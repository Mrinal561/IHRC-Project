import React, { useEffect, useMemo, useState } from 'react';
import { Button, Dialog, toast, Tooltip, Notification } from '@/components/ui';
import { FiEdit, FiFile, FiTrash } from 'react-icons/fi';
import DataTable, { ColumnDef } from '@/components/shared/DataTable';
import { MdAdminPanelSettings, MdEdit } from 'react-icons/md';
import PFTrackerEditDialog from './PFTrackerEditDialog';
import ConfigDropdown from './ConfigDropdown';
import { PfChallanData } from '@/@types/pfTracker';
import dayjs from 'dayjs';
import { HiOutlineClock, HiOutlineViewGrid } from 'react-icons/hi';
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json'
import Lottie from 'lottie-react';
import { useDispatch } from 'react-redux';
import { deleteTracker } from '@/store/slices/pftracker/pfTrackerSlice';
import { VscGitPullRequestGoToChanges } from 'react-icons/vsc';
import { FaEye, FaUserShield } from 'react-icons/fa';
import { requestCompanyEdit } from '@/store/slices/request/requestSLice';
import store from '@/store';
import { showErrorNotification } from '@/components/ui/ErrorMessage';
import RequestToAdminDialog from '../components/RequestToAdminDialog';
import { useNavigate } from 'react-router-dom';
const documentPath = "../store/AllMappedCompliancesDetails.xls";

interface PfTrackerTableProps {
  dataSent: PfChallanData[];
  loading: boolean;
  onRefresh?: () => void;
  code: string;
  companyName: string;
  pagination: {
    total: number;
    pageIndex: number;
    pageSize: number;
  };
  onPaginationChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
    canEdit: boolean;
    canDelete: boolean;
}
const { login } = store.getState()

const PFTrackerTable: React.FC<PfTrackerTableProps> =({ 
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
  const [editingData, setEditingData] = useState<PfChallanData | null>(null);
  const [pfTrackerData, setPfTrackerData] = useState<PfChallanData[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [trackerToDelete, setTrackerToDelete] = useState<string | null>(null);
   const [requestDialogOpen, setRequestDialogOpen] = useState(false);
        const [selectedTrackerId, setSelectedTrackerId] = useState<number | null>(null);        const [requestLoading, setRequestLoading] = useState(false);

  const navigate = useNavigate()

 const userId = login?.user?.user?.id;
 const type = login?.user?.user?.type;


  const handleDeleteConfirmation = (trackerId: string) => {
    console.log(userId, type)
    setTrackerToDelete(trackerId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try{

      setLoader(true)
    if (trackerToDelete) {
    const res = await dispatch(deleteTracker(trackerToDelete)).unwrap().catch((error: any) => {
        throw error; // Re-throw to prevent navigation
    });

    if(res){
      setDeleteConfirmOpen(false);
      toast.push(
        <Notification title="Success" type="success">
          PF Tracker Data Deleted Successfully
        </Notification>
      );
    }
      if (onRefresh) {
        onRefresh();
      }
    }
  } catch(error:any){
    console.log(error)
  } finally{
    setLoader(false)
  }
  };

  const isEditPermissionExpired = (tracker: PfChallanData) => {
      if (!tracker.updated_at) return true;
      
      const updatedAt = new Date(tracker.updated_at);
      const expiryTime = new Date(updatedAt.getTime() + 24 * 60 * 60 * 1000); // 24 hours from last update
      return new Date() > expiryTime;
    };
    
    // Function to check if user can edit
    const canUserEditTracker = (tracker: PfChallanData) => {
      // Admin can always edit
      if (type === 'admin') return true;
      
      // Check if user is the uploader and has valid edit permission
      return (
        userId === tracker.uploaded_by && 
        !isEditPermissionExpired(tracker)
      );
    };
    
    // Function to check if request is pending
    const isRequestPending = (tracker: PfChallanData) => {
      return tracker.is_requested;
    };

    const handleRequestToAdmin = async (id: any, reason: string, updateData: Record<string, any> = {}) => {
      try {
    // Dispatch the request with the required type
    const res = await dispatch(requestCompanyEdit({
      id: id,
      payload: {
        type: "pf",
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
      // showErrorNotification(error.message);
      throw error
  }
};
  
  const handleEdit = (row: PfChallanData) => {
    setEditingData(row);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = (editedData: PfChallanData) => {
    setEditDialogOpen(false);
    setEditingData(null);
    if (onRefresh) {
      onRefresh();
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

  const columns: ColumnDef<PfChallanData>[] = useMemo(
    () => [
      {
        header: 'Company',
        enableSorting: false,
        accessorKey: 'PfSetup.Company.name',
        cell: (props) => <div className="w-52 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'PF Code',
        enableSorting: false,
        accessorKey: 'PfSetup.pf_code',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Location',
        enableSorting: false,
        accessorKey: 'PfSetup.Location.name',
        cell: (props) => <div className="w-28 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Payroll Month',
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
        cell: (props) => <div className="w-40 truncate">{props.getValue() as number}</div>,
      },
      {
        header: 'EPF Wages',
        enableSorting: false,
        accessorKey: 'epf_wage',
        cell: (props) => <div className="w-28 truncate"> {formatIndianCurrency(props.getValue() as number)}</div>,
      },
      {
        header: 'EPS Wage',
        enableSorting: false,
        accessorKey: 'eps_wage',
        cell: (props) => <div className="w-28 truncate"> {formatIndianCurrency(props.getValue() as number)}</div>,
      },
      {
        header: 'EDLI Wage',
        enableSorting: false,
        accessorKey: 'edli_wage',
        cell: (props) => <div className="w-28 truncate"> {formatIndianCurrency(props.getValue() as number)}</div>,
      },
      {
        header: 'Total Challan Amount',
        enableSorting: false,
        accessorKey: 'total_challan_amt',
        cell: (props) => <div className="w-52 truncate"> {formatIndianCurrency(props.getValue() as number)}</div>,
      },
      {
        header: 'Total Amount Paid',
        enableSorting: false,
        accessorKey: 'total_paid_amt',
        cell: (props) => <div className="w-52 truncate"> {formatIndianCurrency(props.getValue() as number)}</div>,
      },
      {
        header: 'Difference',
        enableSorting: false,
        accessorKey: 'difference_amt',
        cell: (props) => <div className="w-28 truncate"> {formatIndianCurrency(props.getValue() as number)}</div>,
      },
      {
        header: 'Difference Reason',
        enableSorting: false,
        accessorKey: 'difference_reason',
        cell: (props) => <div className="w-40 truncate">{(props.getValue() as string) || '--'}</div>,
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
        header: 'Delay In Days',
        enableSorting: false,
        accessorKey: 'delay_in_days',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Delay Reason',
        enableSorting: false,
        accessorKey: 'delay_reason',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string || '--'}</div>,
      },
      {
        header: 'TRRN No',
        enableSorting: false,
        accessorKey: 'trrn_no',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'CRN No',
        enableSorting: false,
        accessorKey: 'crn_no',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
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
        header: 'Challan',
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
            <div className="w-28 flex items-center">
              {challanDocument ? (
                <a 
                  href="#" 
                  onClick={handleChallanDownload} 
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
        header: 'ECR',
        enableSorting: false,
        accessorKey: 'ecr_document',
        cell: (props) => {
          const ecrDocument = props.getValue() as string | null;
          
          const handleEcrDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            if (ecrDocument) {
              const fullPath = `${import.meta.env.VITE_API_GATEWAY}/${ecrDocument}`;
              window.open(fullPath, '_blank');
            }
          };

          return (
            <div className="w-28 flex items-center">
              {ecrDocument ? (
                <a 
                  href="#" 
                  onClick={handleEcrDownload} 
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
        header: 'Payment Receipt',
        enableSorting: false,
        accessorKey: 'receipt_document',
        cell: (props) => {
          const paymentReceiptDocument = props.getValue() as string | null;
          
          const handlePaymentReceiptDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            if (paymentReceiptDocument) {
              const fullPath = `${import.meta.env.VITE_API_GATEWAY}/${paymentReceiptDocument}`;
              window.open(fullPath, '_blank');
            }
          };

          return (
            <div className="w-28 flex items-center">
              {paymentReceiptDocument ? (
                <a 
                  href="#" 
                  onClick={handlePaymentReceiptDownload} 
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
          const { ecr_document, challan_document, receipt_document } = row.original;
          const uploadedCount = [ecr_document, challan_document, receipt_document].filter(Boolean).length;
          return <div className="w-32 truncate">{`${uploadedCount}/3`}</div>;
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

          return (
            <div className="flex items-center gap-2">
                            <Tooltip title="View Timeline">
                        <Button
                          size="sm"
                          onClick={() => navigate('/trackerTimeline', {
                            state: { 
                              trackerId: tracker.id,
                              trackerType: 'pf' 
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
                  
                  <ConfigDropdown 
                    companyName={row.original.PfSetup.Company.name} 
                    companyGroupName={row.original.PfSetup.CompanyGroup.name} 
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
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500 rounded-xl">
        <div className="w-28 h-28">
          <Lottie 
            animationData={loadingAnimation} 
            loop 
            className="w-24 h-24"
          />
        </div>
        <p className="text-lg font-semibold">Loading Data...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {!companyName ? (
        <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
          <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
          <p className="text-center">Please select a company first to view data</p>
        </div>
      ) : dataSent.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
          <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
          <p className="text-center">
            {code 
              ? `No data available for ${companyName} and PF code ${code}`
              : `No data available for ${companyName}`}
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
        <PFTrackerEditDialog
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
          <p className="mb-6">Are you sure you want to delete this PF Tracker entry?</p>
          
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
  );
};

export default PFTrackerTable;