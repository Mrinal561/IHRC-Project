
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
import { HiOutlineViewGrid } from 'react-icons/hi';
import { deletePtrcTracker } from '@/store/slices/ptSetup/ptrcTrackerSlice';
import { useDispatch } from 'react-redux';
import { FaUserShield } from 'react-icons/fa';
import { requestCompanyEdit } from '@/store/slices/request/requestSLice';
import store from '@/store';
import { showErrorNotification } from '@/components/ui/ErrorMessage';

interface PTTrackerTableProps {
  dataSent: PTTrackerData[];
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

  const handleRequestToAdmin = async (id: any) => {
    try {
      // Dispatch the request with the required type
      const res = await dispatch(requestCompanyEdit({
        id: id,
        payload: {
          type: "ptrc" 
        }
      })).unwrap(); 
  
      if (res) {
        console.log('Requested Successfully')
          if (onRefresh) {
              onRefresh()
          }
      }
  
    } catch (error) {
      console.log("Admin request error:", error);
    }
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
            ₹{(props.getValue() as number).toLocaleString()}
          </div>
        ),
      },
      {
        header: 'PT Amount As Per Salary Register',
        enableSorting: false,
        accessorKey: 'salary_register_amt',
        cell: (props) => (
          <div className="w-40 truncate">
            ₹{(props.getValue() as number).toLocaleString()}
          </div>
        ),
      },
      {
        header: 'Total Amount Paid',
        enableSorting: false,
        accessorKey: 'total_paid_amt',
        cell: (props) => (
          <div className="w-40 truncate">
            ₹{(props.getValue() as number).toLocaleString()}
          </div>
        ),
      },
      {
        header: 'Difference in Amount',
        enableSorting: false,
        accessorKey: 'difference_amt',
        cell: (props) => (
          <div className="w-44 truncate">
            ₹{(props.getValue() as number).toLocaleString()}
          </div>
        ),
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
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => {
          const { iseditable, uploaded_by } = row.original;
      
          // Check if user is admin or if they're the uploader
          const canShowActions = type === 'admin' || (type === 'user' && userId === uploaded_by);
      
          if (!canShowActions) {
            return null; // Don't show any actions
          }
          return(
          <div className="flex items-center gap-2">
            {iseditable ? (
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
              companyName={row.original.PtSetup.Company.name}
              companyGroupName={row.original.PtSetup.CompanyGroup.name}
              trackerId={row.original.id}
              onRefresh={onRefresh}
            />
              </>
            ) : (
              <Tooltip title="Request to Admin">
              <Button
                size="sm"
                onClick={() => handleRequestToAdmin(row.original.id)}
                icon={<FaUserShield />}
                className="text-blue-500"
              />
            </Tooltip>
            )}
              
             
          </div>
          )
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
    </div>
  );
};

export default PTRCTrackerTable;