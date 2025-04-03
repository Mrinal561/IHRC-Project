import React, { useMemo, useState } from 'react';
import { Button, Dialog, toast, Tooltip, Notification } from '@/components/ui';
import { FiEdit, FiFile, FiTrash } from 'react-icons/fi';
import DataTable, { ColumnDef } from '@/components/shared/DataTable';
import { MdEdit } from 'react-icons/md';
import ESITrackerEditDialog from './ESITrackerEditDialog';
import ESIConfigDropdown from './ESIConfigDropDown'
import { esiChallanData } from '@/@types/esiTracker';
import dayjs from 'dayjs';
import { HiOutlineClock, HiOutlineViewGrid } from 'react-icons/hi';
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json'
import { deleteTracker } from '@/store/slices/esitracker/esitrackerSlice';
import Lottie from 'lottie-react';
import { useDispatch } from 'react-redux';
import { FaEye, FaUserShield } from 'react-icons/fa';
import { requestCompanyEdit } from '@/store/slices/request/requestSLice';
import store from '@/store';
import { showErrorNotification } from '@/components/ui/ErrorMessage';
import RequestToAdminDialog from '../components/RequestToAdminDialog';
import { useNavigate } from 'react-router-dom';

interface EsiTrackerTableProps {
    dataSent: esiChallanData[];
    loading: boolean
    onRefresh?: () => void;
    companyName: string;
    code: string;
     pagination: {
    total: number;
    pageIndex: number;
    pageSize: number;
  };
  onPaginationChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  canEdit:boolean;
  canDelete:boolean;
  }

  const { login } = store.getState()
const ESITrackerTable: React.FC<EsiTrackerTableProps> =({ 
  dataSent, 
  loading = false, 
  onRefresh,
  pagination,
  onPaginationChange,
    onPageSizeChange,
    companyName,
  code,
  canEdit,
  canDelete
}) => {
    // const [data, setData] = useState<ESITrackerData[]>(sampleData);
    const dispatch = useDispatch();
    const [loader ,setLoader] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingData, setEditingData] = useState<esiChallanData | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [trackerToDelete, setTrackerToDelete] = useState<string | null>(null);
     const [requestDialogOpen, setRequestDialogOpen] = useState(false);
     const [selectedTrackerId, setSelectedTrackerId] = useState<number | null>(null);        const [requestLoading, setRequestLoading] = useState(false);

     const navigate = useNavigate();
    const userId = login?.user?.user?.id;
    const type = login?.user?.user?.type;
    const handleEdit = (row: esiChallanData) => {
        setEditingData(row);
        setEditDialogOpen(true);
    };

    const handleDeleteConfirmation = (trackerId: string) => {

      console.log(login, type)
        setTrackerToDelete(trackerId);
        setDeleteConfirmOpen(true);
      };

      const handleRequestClick = (trackerId: number) => {
        setSelectedTrackerId(trackerId);
        setRequestDialogOpen(true);
      };

      const confirmDelete = async () => {
        try{
          setLoader(true)
        if (trackerToDelete) {
         const res = await dispatch(deleteTracker(trackerToDelete)).unwrap().catch((error: any) => {
            throw error; // Re-throw to prevent navigation
        });
        if(res) {
          setDeleteConfirmOpen(false);
          toast.push(
            <Notification title="Success" type="success" closable={true}>
              ESI Tracker Data Deleted Successfully
            </Notification>
          );
        }

          if (onRefresh) {
            onRefresh();
          }
        }
      } catch(error:any){
        console.log(error)
      }finally{
        setLoader(false)
      }
      };

    const isEditPermissionExpired = (tracker: esiChallanData) => {
      if (!tracker.updated_at) return true;
      
      const updatedAt = new Date(tracker.updated_at);
      const expiryTime = new Date(updatedAt.getTime() + 24 * 60 * 60 * 1000); // 24 hours from last update
      return new Date() > expiryTime;
    };
    
    // Function to check if user can edit
    const canUserEditTracker = (tracker: esiChallanData) => {
      // Admin can always edit
      if (type === 'admin') return true;
      
      // Ensure both values are numbers before comparison
      const uploadedBy = typeof tracker.uploaded_by === 'string' 
        ? parseInt(tracker.uploaded_by) 
        : tracker.uploaded_by;
      
      const currentUserId = typeof userId === 'string' 
        ? parseInt(userId) 
        : userId;
    
      // Check if user is the uploader and has valid edit permission
      return (
        currentUserId === uploadedBy && 
        !isEditPermissionExpired(tracker)
      );
    };

      // Function to check if request is pending
      const isRequestPending = (tracker: esiChallanData) => {
        return tracker.is_requested;
      };
    


      const handleRequestToAdmin = async (id: any, reason: string, updateData: Record<string, any>) => {
        try {
          setRequestLoading(true);
          const res = await dispatch(requestCompanyEdit({
            id: id,
            payload: {
              type: "esi",
              reason_for_request: reason,
              update_data: updateData
            }
          })).unwrap();
          
          if (res) {
            toast.push(
              <Notification title="Success" type="success">
                Request sent to admin successfully
              </Notification>
            );
            setRequestDialogOpen(false);
            onRefresh?.();
          }
        } catch (error: any) {
          // showErrorNotification(error.message || 'Failed to send request to admin');
          throw error
        } finally {
          setRequestLoading(false);
        }
      };
      
    

    const handleEditSubmit = (editedData: esiChallanData) => {
        setEditDialogOpen(false);
        setEditingData(null);
        if (onRefresh) {
            onRefresh();
          }
    };



    const columns: ColumnDef<esiChallanData>[] = useMemo(
        () => [
            {
                header: 'Company',
                enableSorting: false,
                accessorKey: 'EsiSetup.Company.name',
                cell: (props) => (
                    <div className="w-52 truncate">
                        {props.getValue() as string}
                    </div>
                ),
            },
            {
                header: 'ESI Code',
                enableSorting: false,
                accessorKey: 'EsiSetup.code',
                cell: (props) => (
                    <div className="w-40 truncate">
                        {props.getValue() as string}
                    </div>
                ),
            },
            // {
            //     header: 'Code Type',
            //     accessorKey: 'codeType',
            //     cell: (props) => (
            //         <div className="w-40 truncate">
            //             {props.getValue() as string}
            //         </div>
            //     ),
            // },
            {
                header: 'ESI Code Location',
                enableSorting: false,
                accessorKey: 'EsiSetup.Location.name',
                cell: (props) => (
                    <div className="w-40 truncate">
                        {props.getValue() as string}
                    </div>
                ),
            },
            {
                header: 'Payroll month',
                enableSorting: false,
                accessorKey: 'payroll_month',
                cell: (props) => {
                    const date = new Date(props.getValue() as string);
                    return (
                      <div className="w-32 truncate">
                         {date.toLocaleString('default', { month: 'long' })}
                      </div>
                    );
                  }
            },
            {
                header: 'No. of Employees',
                enableSorting: false,
                accessorKey: 'no_of_emp',
                cell: (props) => (
                    <div className="w-40 truncate">
                        {props.getValue() as number}
                    </div>
                ),
            },
            {
                header: 'ESI Gross Wages',
                enableSorting: false,
                accessorKey: 'gross_wage',
                cell: (props) => (
                    <div className="w-40 truncate">
                        ₹{(props.getValue() as number).toLocaleString()}
                    </div>
                ),
            },
            {
                header: 'EE ESI',
                enableSorting: false,
                accessorKey: 'employee_esi',
                cell: (props) => (
                    <div className="w-28 truncate">
                        ₹{(props.getValue() as number).toLocaleString()}
                    </div>
                ),
            },
            {
                header: 'ER ESI',
                enableSorting: false,
                accessorKey: 'employer_esi',
                cell: (props) => (
                    <div className="w-28 truncate">
                        ₹{(props.getValue() as number).toLocaleString()}
                    </div>
                ),
            },
            {
                header: 'Total ESI',
                enableSorting: false,
                accessorKey: 'total_esi',
                cell: (props) => (
                    <div className="w-28 truncate">
                        ₹{(props.getValue() as number).toLocaleString()}
                    </div>
                ),
            },
            {
                header: 'Total Amount As per Challan',
                enableSorting: false,
                accessorKey: 'challan_amt',
                cell: (props) => (
                    <div className="w-52 truncate">
                        ₹{(props.getValue() as number).toLocaleString()}
                    </div>
                ),
            },
            {
                header: 'Difference in Amount',
                enableSorting: false,
                accessorKey: 'difference_amt',
                cell: (props) => (
                    <div className="w-40 truncate">
                        ₹{(props.getValue() as number).toLocaleString()}
                    </div>
                ),
               
                
            },
            {
                header: 'Reason For Difference',
                enableSorting: false,
                accessorKey: 'difference_reason',
                cell: (props) => {
                    const value = props.getValue() as number;
                    return(
                        <Tooltip title={value}>
                        <div className="w-40 truncate">
                        {(props.getValue() as number)}
                    </div>
                        </Tooltip>
                    )
                },
            },
            
           
            {
                header: 'Due Date',
                enableSorting: false,
                accessorKey: 'payment_due_date',
                cell: (props) => <div className="w-28 truncate">{dayjs(props.getValue() as string).format('DD-MM-YYYY')}</div>,
            },
            {
                header: 'Date of Payment',
                enableSorting: false,
                accessorKey: 'payment_date',
                cell: (props) => <div className="w-40 truncate">{dayjs(props.getValue() as string).format('DD-MM-YYYY')}</div>,
            },
            {
              header: 'Delay',
              enableSorting: false,
              accessorKey: 'delay_in_days',
              cell: (props) => (
                  <div className="w-40 truncate">
                      {props.getValue()}
                  </div>
              ),
          },
          {
              header: 'Delay Reason',
              enableSorting: false,
              accessorKey: 'delay_reason',
              cell: (props) => (
                  <div className="w-40 truncate">
                      {props.getValue() as string || '--'}
                  </div>
              ),
          },
            {
                header: 'Challan No',
                enableSorting: false,
                accessorKey: 'challan_no',
                cell: (props) => (
                    <div className="w-40 truncate">
                        {props.getValue() as string}
                    </div>
                ),
            },
            {
              header: 'Challan Type',
              enableSorting: false,
              accessorKey: 'challan_type',
              cell: (props) => {
                  const value = props.getValue() as string;
                  // Capitalize the first letter
                  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
                  
                  return (
                      <div className="w-40 truncate">
                          {capitalizedValue}
                      </div>
                  );
              },
          },
            {
  header: 'ESIC challan cum payment receipt',
  enableSorting: false,
  accessorKey: 'challan_document',
  cell: (props) => {
    const challanDocument = props.getValue() as string | null;
    
    const handleChallanDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (challanDocument) {
        const fullPath = `${import.meta.env.VITE_API_GATEWAY}/${challanDocument}`;
        window.open(fullPath, '_blank');
      }
    };

    return (
      <div className="w-40 flex items-center">
        {challanDocument ? (
          <a 
            href="#" 
            onClick={handleChallanDownload} 
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FiFile className="w-5 h-5" />
             {/* <span className="truncate">View File</span> */}
          </a>
        ) : (
          '--'
        )}
      </div>
    );
  },
},
          
              {
                header: 'Upload Status',
                enableSorting: false,
                id: 'uploadStatus',
                cell: ({ row }) => {
                    const { challan_document } = row.original;
                    const uploadedCount = [challan_document].filter(Boolean).length;
                    return <div className="w-32 truncate">{`${uploadedCount}/1`}</div>;
                },
            },
            {
              header: 'Actions',
              id: 'actions',
              cell: ({ row }) => {
                const tracker = row.original;
                const canEdit = canUserEditTracker(tracker);
                const requestPending = isRequestPending(tracker);
                const isUploader = userId === tracker.uploaded_by;
                const editExpired = isEditPermissionExpired(tracker);

                if (!isUploader && type !== 'admin') return null;
      
                return(
                <div className="flex items-center gap-2">
                  <Tooltip title="View Timeline">
                                          <Button
                                            size="sm"
                                            onClick={() => navigate('/trackerTimeline', {
                                              state: { 
                                                trackerId: tracker.id,
                                                trackerType: 'esi' 
                                              }
                                            })}
                                            icon={<FaEye />}
                                          />
                                        </Tooltip>
                  {canEdit ? (
                      // Show all actions when iseditable is true
                      <>
                        {canEdit && (
                          <Tooltip title="Edit">
                            <Button
                              size="sm"
                              onClick={() => handleEdit(row.original)}
                              icon={<MdEdit />}
                            />
                          </Tooltip>
                        )}
                        
                        {canDelete && (
                          <Tooltip title="Delete">
                            <Button
                              size="sm"
                              onClick={() => handleDeleteConfirmation(row.original.id)}
                              icon={<FiTrash />}
                              className="text-red-500"
                            />
                          </Tooltip>
                        )}
                        
                        <ESIConfigDropdown
                        companyName={row.original.EsiSetup.Company.name}
                        companyGroupName={row.original.EsiSetup.CompanyGroup.name}
                        trackerId={row.original.id}
                        onRefresh={onRefresh}
                        />
                        </>
                      ) : (
                        editExpired && (

                          <>
                                      {requestPending ? (
                                        <Tooltip title="Pending Approval">
                                                           <Button
                                                             size="sm"
                                                             disabled
                                                             icon={<FaUserShield />}
                                                             className="text-yellow-500"
                                                           />
                                                         </Tooltip>
                                                       ) : (
                                                         <Tooltip title="Request to Admin">
                                                           <Button
                                                             size="sm"
                                                             onClick={() => handleRequestClick(tracker.id)}
                                                             icon={<FaUserShield />}
                                                             className="text-blue-500"
                                                             />
                                                         </Tooltip>
                                                       )}
                                     
                                    
                                                       </>
                                                      )
                                   )}
                                 </div>
                                 )
                               },
                             },
                           ],
                           [onRefresh]
    )
    const documentPath = "../store/AllMappedCompliancesDetails.xls";

    const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        // Implement the download functionality here
        // For example, you could use the `fetch` API to download the file
        fetch(documentPath)
          .then(response => response.blob())
          .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'AllMappedCompliancesDetails.xls';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          })
          .catch(() => console.error('Download failed'));
      };

   if (loading) {
        console.log("Loading....................");
        
        return (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500  rounded-xl">
                <div className="w-28 h-28">
                    <Lottie 
                        animationData={loadingAnimation} 
                        loop 
                        className="w-24 h-24"
                    />
                </div>
                <p className="text-lg font-semibold">
                    Loading Data...
                </p>

            </div>
        );
    }

    return (
        <div className="relative">
              {!companyName ? (
        <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
          <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
          <p className="text-center">
            Please select a company first to view data
          </p>
        </div>
      ) : dataSent.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
          <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
          <p className="text-center">
             {code 
                ? `No data available for ${companyName} and ESI code ${code}`
                : `No data available for ${companyName}`
            }
          </p>
        </div>
      ) : (
                <DataTable
                    columns={columns}
                    data={dataSent}
                    loading={loading}
                    skeletonAvatarColumns={[0]}
                    skeletonAvatarProps={{ className: 'rounded-md' }}
                    stickyHeader={true}
                    stickyFirstColumn={true}
                    stickyLastColumn={true}
                    pagingData={{
                        total: pagination.total,
                        pageIndex: pagination.pageIndex,
                        pageSize: pagination.pageSize,
                    }}
                    onPaginationChange={onPaginationChange}
                    onSelectChange={onPageSizeChange}
                />
            )}
            {editingData && (
                <ESITrackerEditDialog
                    isOpen={editDialogOpen}
                    onClose={() => setEditDialogOpen(false)}
                    onSubmit={handleEditSubmit}
                    trackerId={editingData.id}
                    onRefresh={onRefresh}
                />
            )}
             <Dialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}  shouldCloseOnOverlayClick={false} 
      >
        <div className="p-2">
          <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
          <p className="mb-6">Are you sure you want to delete this ESI Tracker entry?</p>
          
          <div className="flex justify-end space-x-2  items-center">
            <Button 
              onClick={() => setDeleteConfirmOpen(false)}
              variant="plain"
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete}
              variant="solid"
              loading={loader}
              // color="blue"
            >
              Confirm
            </Button>
          </div>
        </div>
      </Dialog>
      <RequestToAdminDialog
      isOpen={requestDialogOpen}
      onClose={() => {
        setRequestDialogOpen(false);
        setSelectedTrackerId(null);
      }}
      onConfirm={(reason, updateData) => handleRequestToAdmin(selectedTrackerId, reason, updateData)}
      loading={requestLoading}
      trackerData={dataSent.find(tracker => tracker.id === selectedTrackerId)}
    />
        </div>
    )
};

export default ESITrackerTable;