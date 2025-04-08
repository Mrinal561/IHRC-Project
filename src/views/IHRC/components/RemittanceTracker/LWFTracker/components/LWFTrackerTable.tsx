

import React, { useMemo, useState } from 'react';
import { Button, Dialog, toast, Tooltip, Notification } from '@/components/ui';
import { FiEdit, FiFile, FiTrash } from 'react-icons/fi';
import DataTable, { ColumnDef } from '@/components/shared/DataTable';
import { MdEdit } from 'react-icons/md';
import LWFTrackerEditDialog from './LWFTrackerEditDialog';
import ConfigDropdown from './ConfigDropDown'
import dayjs from 'dayjs';
import { HiOutlineClock, HiOutlineViewGrid } from 'react-icons/hi';
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json'
import Lottie from 'lottie-react';
import { deleteLwfTracker, LwfTrackerData } from '@/store/slices/lwfTracker/lwfTracker';
import { useDispatch } from 'react-redux';
import { FaEye, FaUserShield } from 'react-icons/fa';
import { requestCompanyEdit } from '@/store/slices/request/requestSLice';
import store from '@/store';
import { showErrorNotification } from '@/components/ui/ErrorMessage';
import RequestToAdminDialog from '../components/RequestToAdminDialog';
import { useNavigate } from 'react-router-dom';

export interface Company {
  id: number;
  name: string;
}

export interface Location {
  id: number;
  name: string;
}

export interface CompanyGroup {
  id: number;
  name: string;
}

export interface LWFTrackerData {
  id: number;
  uuid: string;
  lwf_setup_id: number;
  period: string;
  salary_register_amt: number;
  total_paid_amt: number;
  difference_amt: number;
  difference_reason: string | null;
  payment_due_date: string;
  payment_date: string;
  delay_in_days: number | null;
  delay_reason: string | null;
  receipt_no: string;
  receipt_document: string | null;
  remark: string | null;
  upload_date: string;
  status: string;
  uploaded_by: number;
  created_at: string;
  updated_at: string;
  is_requested?: boolean;
  iseditable?: boolean;
  UploadBy: {
    id: number;
    name: string;
    email: string;
    mobile: string | null;
  };
  LwfSetup: {
    register_number: string;
    CompanyGroup: CompanyGroup;
    Company: Company;
    Location: Location;
  };
}

interface LWFTrackerDatas {
  id: number;
  receipt_no?: string;
  total_paid_amt?: number | null;
  delay_in_days?:string;
  delay_reason?: string;
  difference_reason?: string;
  payment_date?: string;
}

interface LWFTrackerTableProps {
  dataSent: LWFTrackerDatas[];
  loading?: boolean;
  companyName: string;
  code: string;
  onRefresh?: () => void;
    pagination: {
    total: number;
    pageIndex: number;
    pageSize: number;
  };
  onPaginationChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  canDelete:boolean;
  canEdit: boolean;
}

const { login } = store.getState()

const LWFTrackerTable: React.FC<LWFTrackerTableProps> = ({ 
  dataSent, 
  loading = false, 
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
  const [editingData, setEditingData] = useState<LWFTrackerData | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [trackerToDelete, setTrackerToDelete] = useState<string | null>(null);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
      const [selectedTrackerId, setSelectedTrackerId] = useState<number | null>(null);
      const [requestLoading, setRequestLoading] = useState(false);

      const navigate = useNavigate();

  const userId = login?.user?.user?.id;
  const type = login?.user?.user?.type;
    const handleDeleteConfirmation = (trackerId: string) => {
    setTrackerToDelete(trackerId);
    setDeleteConfirmOpen(true);
  };


   const confirmDelete = () => {
    try{
      setLoader(true)
    
    if (trackerToDelete) {
      dispatch(deleteLwfTracker(trackerToDelete)).unwrap().catch((error: any) => {
        throw error; // Re-throw to prevent navigation
    });
      setDeleteConfirmOpen(false);
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

  const isEditPermissionExpired = (tracker: LWFTrackerData) => {
    if (!tracker.updated_at) return true;
    
    const updatedAt = new Date(tracker.updated_at);
    const expiryTime = new Date(updatedAt.getTime() + 24 * 60 * 60 * 1000); // 24 hours from last update
    return new Date() > expiryTime;
  };
  
  // Function to check if user can edit
  const canUserEditTracker = (tracker: LWFTrackerData) => {
    // Admin can always edit
    if (type === 'admin') return true;
    
    // Check if user is the uploader and has valid edit permission
    return (
      userId === tracker.uploaded_by && 
      !isEditPermissionExpired(tracker)
    );
  };
  
  // Function to check if request is pending
  const isRequestPending = (tracker: LWFTrackerData) => {
    return tracker.is_requested;
  };

  const handleRequestToAdmin = async (id: any, reason: string, updateData?: Record<string, any>) => {
    try {
      setRequestLoading(true);
      const res = await dispatch(requestCompanyEdit({
        id: id,
        payload: {
          type: "lwf",  // Changed from "esi" to "lwf"
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

  const handleEdit = (row: LWFTrackerData) => {
    setEditingData(row);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = (editedData: LWFTrackerData) => {
    // Implement update logic or pass to parent component
    setEditDialogOpen(false);
    setEditingData(null);
     if (onRefresh) {
      onRefresh();
    }
  };

  const columns: ColumnDef<LWFTrackerData>[] = useMemo(
    () => [
      {
        header: 'Company',
        enableSorting: false,
        accessorKey: 'LwfSetup.Company.name',
        cell: (props) => <div className="w-52 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Location',
        enableSorting: false,
        accessorKey: 'LwfSetup.Location.name',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Registration Number',
        enableSorting: false,
        accessorKey: 'LwfSetup.register_number',
        cell: (props) => <div className="w-28 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Payroll month',
        enableSorting: false,
        accessorKey: 'period',
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
        header: 'Salary Register Amount',
        enableSorting: false,
        accessorKey: 'salary_register_amt',
        cell: (props) => <div className="w-36 truncate">
          ₹{(props.getValue() as number)?.toLocaleString() || '-'}
        </div>,
      },
      {
        header: 'Total Paid Amount',
        enableSorting: false,
        accessorKey: 'total_paid_amt',
        cell: (props) => <div className="w-36 truncate">
          ₹{(props.getValue() as number)?.toLocaleString() || '-'}
        </div>,
      },
      {
        header: 'Difference Amount',
        enableSorting: false,
        accessorKey: 'difference_amt',
        cell: (props) => <div className="w-36 truncate">
          ₹{(props.getValue() as number)?.toLocaleString() || '-'}
        </div>,
      },
      {
        header: 'Difference Reason',
        enableSorting: false,
        accessorKey: 'difference_reason',
        cell: (props) => <div className="w-40 truncate">
          {(props.getValue() as string) || '--'}
        </div>,
      },
      {
        header: 'Due Date',
        enableSorting: false,
        accessorKey: 'payment_due_date',
        cell: (props) => <div className="w-28 truncate">
          {dayjs(props.getValue() as string).format('DD-MM-YYYY')}
        </div>,
      },
      {
        header: 'Payment Date',
        enableSorting: false,
        accessorKey: 'payment_date',
        cell: (props) => <div className="w-28 truncate">
          {dayjs(props.getValue() as string).format('DD-MM-YYYY')}
        </div>,
      },
      {
        header: 'Delay in Days',
        enableSorting: false,
        accessorKey: 'delay_in_days',
        cell: (props) => <div className="w-28 truncate">
          {props.getValue()}
        </div>,
      },
      {
        header: 'Delay Reason',
        enableSorting: false,
        accessorKey: 'delay_reason',
        cell: (props) => <div className="w-40 truncate">
          {(props.getValue() as string) || '--'}
        </div>,
      },
      {
        header: 'Receipt No',
        enableSorting: false,
        accessorKey: 'receipt_no',
        cell: (props) => <div className="w-52 truncate">
          {props.getValue() as string || '-'}
        </div>,
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
      <div className="w-40 flex items-center">
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
        header: 'Status',
        enableSorting: false,
        accessorKey: 'status',
        cell: (props) => <div className="w-28 truncate">
          {props.getValue() as string}
        </div>,
      },
      {
        header: 'Uploaded By',
        enableSorting: false,
        accessorKey: 'UploadBy.name',
        cell: (props) => <div className="w-40 truncate">
          {props.getValue() as string}
        </div>,
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => {
          const tracker = row.original;
          const canEdit = canUserEditTracker(tracker);
          const requestPending = isRequestPending(tracker);
          const isUploader = userId === tracker.uploaded_by;
            
            return (
              <div className="flex items-center gap-2">
                <Tooltip title="View Timeline">
                                        <Button
                                          size="sm"
                                          onClick={() => navigate('/trackerTimeline', {
                                            state: { 
                                              trackerId: tracker.id,
                                              trackerType: 'lwf' 
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
                    
                    <ConfigDropdown
                      companyName={row.original.LwfSetup.Company.name}
                      companyGroupName={row.original.LwfSetup.CompanyGroup.name}
                      trackerId={row.original.id}
                      onRefresh={onRefresh}
                    />
                  </>
                ) : (
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
                ? `No data available for ${companyName} and LWF code ${code}`
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
        <LWFTrackerEditDialog
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
          <p className="mb-6">Are you sure you want to delete this LWF Tracker entry?</p>
          
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
              // color="blue"
              loading={loader}
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
  onConfirm={(reason, updateData) => 
    handleRequestToAdmin(selectedTrackerId, reason, updateData)
  }
  loading={requestLoading}
  trackerData={dataSent.find(tracker => tracker.id === selectedTrackerId)}
/>
    </div>
  );
};

export default LWFTrackerTable;