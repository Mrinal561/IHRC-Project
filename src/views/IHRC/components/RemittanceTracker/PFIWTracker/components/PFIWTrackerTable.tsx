
import React, { useMemo, useState } from 'react';
import { Button, Dialog, toast, Tooltip, Notification } from '@/components/ui';
import { FiEdit, FiFile, FiTrash } from 'react-icons/fi';
import DataTable, { ColumnDef } from '@/components/shared/DataTable';
import { MdEdit } from 'react-icons/md';
import PFIWTrackerEditDialog from './PFIWTrackerEditDialog';
import ConfigDropdown from './ConfigDropdown';
import dayjs from 'dayjs';
import { PfiwChallanData } from '@/@types/PfiwChallanData';
import { HiOutlineViewGrid } from 'react-icons/hi';
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json'
import Lottie from 'lottie-react';
import { useDispatch } from 'react-redux';
import { deletePfiwTracker } from '@/store/slices/pftracker/pfTrackerSlice';
import { FaUserShield } from 'react-icons/fa';
import { requestCompanyEdit } from '@/store/slices/request/requestSLice';
import store from '@/store';
import { showErrorNotification } from '@/components/ui/ErrorMessage';

const documentPath = "../store/AllMappedCompliancesDetails.xls";

// Define the complete data structure with nested types
export interface Company {
  name: string;
}

export interface Location {
  name: string;
}

export interface CompanyGroup {
  name: string;
}

export interface PfSetup {
  Company: Company;
  CompanyGroup: CompanyGroup;
  Location: Location;
  pf_code: string;
}

export interface PFIWTrackerData {
  id: string;
  PfSetup: PfSetup;
  month: string;
  payment_due_date: string;
  payment_date: string;
  delay_days: number;
  delay_reason: string;
  challan_document: string | null;
  upload_status?: string;
  payroll_month: string;
  iseditable?:boolean;
  uploaded_by?:any;
}

interface PFIWTrackerTableProps {
  dataSent: PfiwChallanData[];
  loading?: boolean;
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

const PFIWTrackerTable: React.FC<PFIWTrackerTableProps> =({ 
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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingData, setEditingData] = useState<PFIWTrackerData | null>(null);
const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
const [trackerToDelete, setTrackerToDelete] = useState<string | null>(null);
  const dispatch = useDispatch();
  const userId = login?.user?.user?.id;
  const type = login?.user?.user?.type;
  const [loader ,setLoader] = useState(false)
  
const handleDeleteConfirmation = (trackerId: string) => {
  setTrackerToDelete(trackerId);
  setDeleteConfirmOpen(true);
};

const confirmDelete = async () => {
  try{
    setLoader(true)
  if (trackerToDelete) {
   const res = await dispatch(deletePfiwTracker(trackerToDelete)).unwrap().catch((error: any) => {
      throw error; // Re-throw to prevent navigation
  });
  if(res) {
    setDeleteConfirmOpen(false);
    toast.push(
      <Notification title="Success" type="success">
        PF IW Tracker Data deleted successfully
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
const handleRequestToAdmin = async (id: any) => {
  try {
    // Dispatch the request with the required type
    const res = await dispatch(requestCompanyEdit({
      id: id,
      payload: {
        type: "pfiw" 
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
  const handleEdit = (row: PFIWTrackerData) => {
    setEditingData(row);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = (editedData: PFIWTrackerData) => {
    // Handle the update logic here
    setEditDialogOpen(false);
    setEditingData(null);
    if (onRefresh) {
    onRefresh();
  }
  };

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
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

  const columns: ColumnDef<PFIWTrackerData>[] = useMemo(
    () => [
      {
        header: 'Company',
        enableSorting: false,
        accessorKey: 'PfSetup.Company.name',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
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
        header: 'Due Date',
        enableSorting: false,
        accessorKey: 'return_due_date',
        cell: (props) => (
          <div className="w-28 truncate">
            {dayjs(props.getValue() as string).format('DD-MM-YYYY')}
          </div>
        ),
      },
      {
        header: 'Date Of Payment',
        enableSorting: false,
        accessorKey: 'submit_date',
        cell: (props) => (
          <div className="w-40 truncate">
            {dayjs(props.getValue() as string).format('DD-MM-YYYY')}
          </div>
        ),
      },
      // {
      //   header: 'Submission Date',
      //   enableSorting: false,
      //   accessorKey: 'submit_date',
      //   cell: (props) => (
      //     <div className="w-40 truncate">
      //       {dayjs(props.getValue() as string).format('DD-MM-YYYY')}
      //     </div>
      //   ),
      // },
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
        cell: (props) => {
          const value = props.getValue() as string;
          return (
            <Tooltip title={value}>
              <div className="w-40 truncate">{value || '--'}</div>
            </Tooltip>
          );
        },
      },

{
  header: 'IW return',
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
          const uploadedCount = challan_document ? 1 : 0;
          return <div className="w-32 truncate">{`${uploadedCount}/1`}</div>;
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
        
          return (
            <div className="flex items-center gap-2">
              {iseditable ? (
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
                    companyName={row.original.PfSetup.Company.name} 
                    companyGroupName={row.original.PfSetup.CompanyGroup.name} 
                    trackerId={row.original.id}  
                    onRefresh={onRefresh}
                  />
                </>
              ) : (
                // Show only Request to Admin button when iseditable is false
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
          );
        }
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
                ? `No data available for ${companyName} and PF code ${code}`
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
        <PFIWTrackerEditDialog
          isOpen={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSubmit={handleEditSubmit}
          trackerid={editingData.id}
          data={editingData}
          onRefresh={onRefresh}
        />
      )}
       <Dialog
      isOpen={deleteConfirmOpen}
      onClose={() => setDeleteConfirmOpen(false)}  shouldCloseOnOverlayClick={false} 
    >
      <div className="p-2">
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-6">Are you sure you want to delete this PFIW Tracker entry?</p>
        
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
    </div>
  );
};

export default PFIWTrackerTable;