
import React, { useMemo, useState } from 'react';
import { Button, Dialog, toast, Tooltip, Notification } from '@/components/ui';
import { FiFile, FiTrash } from 'react-icons/fi';
import DataTable, { ColumnDef } from '@/components/shared/DataTable';
import { MdEdit } from 'react-icons/md';
import PTTrackerEditDialog from './PTRCTrackerEditDialog';
import ConfigDropdown from './ConfigDropdown';
import { PTTrackerData } from '@/@types/PTTracker';
import dayjs from 'dayjs';
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json'
import Lottie from 'lottie-react';
import { HiOutlineClock, HiOutlineViewGrid } from 'react-icons/hi';
import { deletePtrcTracker } from '@/store/slices/ptSetup/ptrcTrackerSlice';
import { useDispatch } from 'react-redux';
import { FaEye, FaUserShield } from 'react-icons/fa';
import { requestCompanyEdit } from '@/store/slices/request/requestSLice';
import store from '@/store';
import { showErrorNotification } from '@/components/ui/ErrorMessage';
import RequestToAdminDialog from '../components/RequestToAdminDialog';
import { useNavigate } from 'react-router-dom';

interface PTTrackerTableProps {
  dataSent: PTRCChallanData[];
  loading: boolean;
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

interface PTRCChallanData {
  id: number;
  no_of_emp?: string;
  salary_register_amt?: number;
  total_paid_amt?: string;
  payment_date?: string;
  delay_reason?: string;
  difference_reason?: string;
}

const { login } = store.getState()

const PTRCTrackerTable: React.FC<PTTrackerTableProps> = ({
  dataSent,
  loading,
  onRefresh,
  pagination,
  onPaginationChange,
  onPageSizeChange,
  companyName,
  code,
  canDelete,
  canEdit
}) => {
  const dispatch = useDispatch();
  const [loader ,setLoader] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingData, setEditingData] = useState<PTTrackerData | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [trackerToDelete, setTrackerToDelete] = useState<string | null>(null);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
        const [selectedTrackerId, setSelectedTrackerId] = useState<number | null>(null);        const [requestLoading, setRequestLoading] = useState(false);


          const navigate = useNavigate()
        

  const handleDeleteConfirmation = (trackerId: string) => {
    setTrackerToDelete(trackerId);
    setDeleteConfirmOpen(true);
  };
  const userId = login?.user?.user?.id;
  const type = login?.user?.user?.type;

  const confirmDelete = async () => {
    try{
      setLoader(true)
    if (trackerToDelete) {
     const res = await dispatch(deletePtrcTracker(trackerToDelete)).unwrap().catch((error: any) => {
        throw error; // Re-throw to prevent navigation
    });
    if(res) {
      setDeleteConfirmOpen(false);
      toast.push(
        <Notification title="Success" type="success">
          PT RC Tracker Data Deleted Successfully
        </Notification>
      );
    }
      if (onRefresh) {
        onRefresh();
      }
    }
  } catch(error:any){
    console.log(error)
  } finally {
    setLoader(false)
  }
  };

  const handleEdit = (row: PTTrackerData) => {
    setEditingData(row);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = (editedData: PTTrackerData) => {
    setEditDialogOpen(false);
    setEditingData(null);
    if (onRefresh) {
      onRefresh();
    }
  };

  // const handleRequestToAdmin = async (id: any) => {
  //   try {
  //     // Dispatch the request with the required type
  //     const res = await dispatch(requestCompanyEdit({
  //       id: id,
  //       payload: {
  //         type: "ptrc" 
  //       }
  //     })).unwrap(); 
  
  //     if (res) {
  //       console.log('Requested Successfully')
  //         if (onRefresh) {
  //             onRefresh()
  //         }
  //     }
  
  //   } catch (error) {
  //     console.log("Admin request error:", error);
  //   }
  // };
  

  const isEditPermissionExpired = (tracker: PTTrackerData) => {
    if (!tracker.updated_at) return true;
    
    const updatedAt = new Date(tracker.updated_at);
    const expiryTime = new Date(updatedAt.getTime() + 24 * 60 * 60 * 1000); // 24 hours from last update
    return new Date() > expiryTime;
  };
  
  // Function to check if user can edit
  const canUserEditTracker = (tracker: PTTrackerData) => {
    // Admin can always edit
    if (type === 'admin') return true;
    
    // Check if user is the uploader and has valid edit permission
    return (
      userId === tracker.uploaded_by && 
      !isEditPermissionExpired(tracker)
    );
  };
  
  // Function to check if request is pending
  const isRequestPending = (tracker: PTTrackerData) => {
    return tracker.is_requested;
  };



  const handleRequestToAdmin = async (id: any, reason: string, updateData: Record<string, any> = {}) => {
    try {
      setRequestLoading(true);
      // Dispatch the request with the required type and reason
      const res = await dispatch(requestCompanyEdit({
        id: id,
        payload: {
          type: "ptrc",
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
      console.log("Admin request error:", error);
      // showErrorNotification(error.message || 'Failed to send request to admin');
      throw error
    } finally {
      setRequestLoading(false);
    }
  };


  const formatIndianCurrency = (num: number) => {
  if (isNaN(num)) return '₹0';
  
  const numStr = num.toString();
  const lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);
  
  if (otherNumbers !== '') {
    return '₹' + otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }
  return '₹' + lastThree;
};
  

  const columns: ColumnDef<PTTrackerData>[] = useMemo(
    () => [
      {
        header: 'Company',
        enableSorting: false,
        accessorKey: 'PtSetup.Company.name',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
      },
      // {
      //   header: 'State',
      //   accessorKey: 'state',
      //   cell: (props) => <div className="w-28 truncate">{props.getValue() as string}</div>,
      // },
      // {
      //   header: 'PT RC District',
      //   accessorKey: 'ptRCDistrict',
      //   cell: (props) => <div className="w-36 truncate">{props.getValue() as string}</div>,
      // },
      {
        header: 'PT RC Location',
        enableSorting: false,
        accessorKey: 'PtSetup.Location.name',
        cell: (props) => <div className="w-36 truncate">{props.getValue() as string}</div>,
      },
      // {
      //   header: 'PT RC Location Address',
      //   accessorKey: 'locationAddress',
      //   cell: (props) => {
      //     const value = props.getValue() as string;
      //     return (
      //       <Tooltip title={value}>
      //         <div className="w-52 truncate">{value}</div>
      //       </Tooltip>
      //     );
      //   }
      // },
      {
        header: 'PT RC Number',
        enableSorting: false,
        accessorKey: 'PtSetup.register_number',
        cell: (props) => <div className="w-64 truncate">{props.getValue() as string}</div>,
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
      // {
      //   header: 'Remittance Mode',
      //   accessorKey: 'remittanceMode',
      //   cell: (props) => <div className="w-36 truncate">{props.getValue() as string}</div>,
      // },
      // {
      //   header: 'Frequency',
      //   accessorKey: 'frequency',
      //   cell: (props) => <div className="w-28 truncate">{props.getValue() as string}</div>,
      // },
      {
        header: 'No. of Employees',
        enableSorting: false,
        accessorKey: 'no_of_emp',
        cell: (props) => <div className="w-36 truncate">{props.getValue() as number}</div>,
      },
      // {
      //   header: 'Month',
      //   accessorKey: 'payroll_month',
      //   cell: (props) => <div className="w-28 truncate">{props.getValue() as string}</div>,
      // },
      {
        header: 'Gross Salary',
        enableSorting: false,
        accessorKey: 'gross_salary',
        cell: (props) => (
          <div className="w-32 truncate">
{formatIndianCurrency(props.getValue() as number)}          </div>
        ),
      },
      {
        header: 'PT Amount As Per Salary Register',
        enableSorting: false,
        accessorKey: 'salary_register_amt',
        cell: (props) => (
          <div className="w-40 truncate">
{formatIndianCurrency(props.getValue() as number)}          </div>
        ),
      },
      {
        header: 'Total Amount Paid',
        enableSorting: false,
        accessorKey: 'total_paid_amt',
        cell: (props) => (
          <div className="w-40 truncate">
{formatIndianCurrency(props.getValue() as number)}          </div>
        ),
      },
      {
        header: 'Difference in Amount',
        enableSorting: false,
        accessorKey: 'difference_amt',
        cell: (props) => (
          <div className="w-44 truncate">
{formatIndianCurrency(props.getValue() as number)}          </div>
        ),
      },
      {
        header: 'Difference Reason',
        accessorKey: 'difference_reason',
        enableSorting: false,
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string || '--'}</div>,
      },
      {
        header: 'Due Date',
        enableSorting: false,
        accessorKey: 'payment_due_date',
        cell: (props) => (
          <div className="w-28 truncate">
            {dayjs(props.getValue() as string).format('DD-MM-YYYY')}
          </div>
        ),
      },
      {
        header: 'Date of Payment',
        enableSorting: false,
        accessorKey: 'payment_date',
        cell: (props) => (
          <div className="w-36 truncate">
            {dayjs(props.getValue() as string).format('DD-MM-YYYY')}
          </div>
        ),
      },
      {
        header: 'Delay',
        enableSorting: false,
        accessorKey: 'delay_in_days',
        cell: (props) => <div className="w-28 truncate">{props.getValue()}</div>,
      },
      {
        header: 'Delay Reason',
        enableSorting: false,
        accessorKey: 'delay_reason',
        cell: (props) => <div className="w-28 truncate">{props.getValue() as string || '--'}</div>,
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
        header: 'Payment Receipt',
        enableSorting: false,
        accessorKey: 'ptrc_document',
        cell: (props) => {
          const paymentDocument = props.getValue() as string | null;
          
          const handlePaymentDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            if (paymentDocument) {
              const fullPath = `${import.meta.env.VITE_API_GATEWAY}/${paymentDocument}`;
              window.open(fullPath, '_blank');
            }
          };

          return (
            <div className="w-40 flex items-center">
              {paymentDocument ? (
                <a 
                  href="#" 
                  onClick={handlePaymentDownload} 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <FiFile className="w-5 h-5" />
                </a>
              ) : (
                '--'
              )}
            </div>
          );
        },
      },
      {
        header: 'Return',
        enableSorting: false,
        accessorKey: 'ptrc_return_document',
        cell: (props) => {
          const returnDocument = props.getValue() as string | null;
          
          const handleReturnDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            if (returnDocument) {
              const fullPath = `${import.meta.env.VITE_API_GATEWAY}/${returnDocument}`;
              window.open(fullPath, '_blank');
            }
          };

          return (
            <div className="w-40 flex items-center">
              {returnDocument ? (
                <a 
                  href="#" 
                  onClick={handleReturnDownload} 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <FiFile className="w-5 h-5" />
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
          const { ptrc_document, ptrc_return_document } = row.original;
          const uploadedCount = [ptrc_document, ptrc_return_document].filter(Boolean).length;
          return <div className="w-32 truncate">{`${uploadedCount}/2`}</div>;
        },
      },
      // {
      //   header: 'Actions',
      //   id: 'actions',
      //   cell: ({ row }) => {
      //     const { iseditable, uploaded_by, is_requested } = row.original;
      
      //     // Check if user is admin or if they're the uploader
      //     const canShowActions = type === 'admin' || (type === 'user' && userId === uploaded_by);
      
      //     if (!canShowActions) {
      //       return null; // Don't show any actions
      //     }
      //     return(
      //     <div className="flex items-center gap-2">
      //       {iseditable ? (
      //         <>
      //         {canEdit && (
      //         <Tooltip title="Edit">
      //           <Button
      //             size="sm"
      //             onClick={() => handleEdit(row.original)}
      //             icon={<MdEdit />}
      //           />
      //         </Tooltip>
      //           )}

      //            {canDelete && (
      //       <Tooltip title="Delete">
      //         <Button
      //           size="sm"
      //           onClick={() => handleDeleteConfirmation(row.original.id)}
      //           icon={<FiTrash />}
      //           className="text-red-500"
      //         />
      //       </Tooltip>
      //         )}

      //       <ConfigDropdown 
      //         companyName={row.original.PtSetup.Company.name}
      //         companyGroupName={row.original.PtSetup.CompanyGroup.name}
      //         trackerId={row.original.id}
      //         onRefresh={onRefresh}
      //       />
      //         </>
      //       ) : (
      //         !is_requested && (
      //           <Tooltip title="Request to Admin">
      //             <Button
      //               size="sm"
      //               onClick={() => {
      //                 setSelectedTrackerId(row.original.id);
      //                 setRequestDialogOpen(true);
      //               }}
      //               icon={<FaUserShield />}
      //               className="text-blue-500"
      //             />
      //           </Tooltip>
      //         )
      //       )}
              
             
      //     </div>
      //     )
      //   },
      // },

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

          return (
            <div className="flex items-center gap-2">
              <Tooltip title="View Timeline">
                                      <Button
                                        size="sm"
                                        onClick={() => navigate('/trackerTimeline', {
                                          state: { 
                                            trackerId: tracker.id,
                                            trackerType: 'ptrc' 
                                          }
                                        })}
                                        icon={<FaEye />}
                                      />
                                    </Tooltip>
              {canEdit ? (
                <>
                  {canEdit && (
                    <Tooltip title="Edit">
                      <Button
                        size="sm"
                        onClick={() => handleEdit(tracker)}
                        icon={<MdEdit />}
                      />
                    </Tooltip>
                  )}
                  {canDelete && (
                    <Tooltip title="Delete">
                      <Button
                        size="sm"
                        onClick={() => handleDeleteConfirmation(tracker.id)}
                        icon={<FiTrash />}
                        className="text-red-500"
                      />
                    </Tooltip>
                  )}
                  <ConfigDropdown 
                    companyName={tracker.PtSetup.Company.name}
                    companyGroupName={tracker.PtSetup.CompanyGroup.name}
                    trackerId={tracker.id}
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
                        onClick={() => {
                          setSelectedTrackerId(tracker.id);
                          setRequestDialogOpen(true);
                        }}
                        icon={<FaUserShield />}
                        className="text-blue-500"
                      />
                    </Tooltip>
                  )}
                </>
                )
              )}
            </div>
          );
        },
      },
    ],
    [onRefresh]
  );
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
                ? `No data available for ${companyName} and PTRC code ${code}`
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
        <PTTrackerEditDialog
          isOpen={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSubmit={handleEditSubmit}
          data={editingData}
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
          <p className="mb-6">Are you sure you want to delete this PTRC Tracker entry?</p>
          
          <div className="flex justify-end space-x-2">
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
  );
};

export default PTRCTrackerTable;