

import React, { useMemo, useState } from 'react';
import { Button, Dialog, Tooltip } from '@/components/ui';
import { FiFile, FiTrash } from 'react-icons/fi';
import DataTable, { ColumnDef } from '@/components/shared/DataTable';
import { MdEdit } from 'react-icons/md';
import { HiOutlineViewGrid } from 'react-icons/hi';
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json';
import Lottie from 'lottie-react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { deleteNotice } from '@/store/slices/noticeTracker/noticeTrackerSlice';
import EditNoticeDialog from './EditNoticeDialog';
import { useNavigate } from 'react-router-dom';
import { FaArrowCircleRight, FaComments, FaEnvelopeOpen, FaEye, FaHistory, FaRegCommentDots, FaReply, FaUserShield } from 'react-icons/fa';
import { requestNoticeEdit } from '@/store/slices/request/noticerequest';



const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase();
  
  if (statusLower === 'open') {
      return 'bg-red-500 text-white rounded-lg';
  }
  if (statusLower === 'closed') {
      return 'bg-green-500 text-white rounded-lg';
  }
  // Any other status (including reopen, etc) will be amber
  return 'bg-amber-500 text-white rounded-lg';
};

interface NoticeData {
  id: number;
  uuid: string;
  group_id: number;
  company_id: number;
  location_id: number;
  notice_type: string;
  notice_date: string;
  reference_number: string;
  related_act: string;
  notice_document: string;
  CompanyGroup: {
    id: number;
    name: string;
  };
  Company: {
    id: number;
    name: string;
  };
  Location: {
    id: number;
    name: string;
  };
  iseditable?: boolean;
  is_requested?: boolean;
  created_by?: any;
  CreatedBy: {
    id: number;
    name: string;
  }
}

// Define the interface for the request payload
interface CompanyAdminNoticeRequestPayload {
  type: number;
}

interface NoticeTrackerTableProps {
  data: NoticeData[];
  loading: boolean;
  onRefresh?: () => void;
  companyName: string;
  pagination: {
    total: number;
    pageIndex: number;
    pageSize: number;
  };
  onPaginationChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  canEdit:boolean;
  canDelete: boolean;
}

const NoticeTrackerTable: React.FC<NoticeTrackerTableProps> = ({
  data,
  loading,
  onRefresh,
  pagination,
  onPaginationChange,
  onPageSizeChange,
  companyName,
  canEdit,
  canDelete
}) => {
  const dispatch = useDispatch();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<number | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedNoticeId, setSelectedNoticeId] = useState<number | null>(null);
  const navigate = useNavigate();
  const handleDeleteConfirmation = (noticeId: number) => {
    setNoticeToDelete(noticeId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (noticeToDelete) {
      dispatch(deleteNotice(noticeToDelete));
      setDeleteConfirmOpen(false);
      if (onRefresh) {
        onRefresh();
      }
    }
  };

  // Fixed handleEdit function
  const handleEdit = (row: NoticeData) => {
    setSelectedNoticeId(row.id);
    setEditDialogOpen(true);
  };

  const handleRequestToAdmin = async (id: number, type: 'notice' | 'reply' | 'followUp') => {
    try {
      let payload: { noticeId?: number; replyId?: number; followUpId?: number } = {};
  
      // Set the appropriate ID based on the type
      if (type === 'notice') {
        payload.noticeId = id;
      } else if (type === 'reply') {
        payload.replyId = id;
      } else if (type === 'followUp') {
        payload.followUpId = id;
      }
  
      // Dispatch the request with the correct payload
      const res = await dispatch(requestNoticeEdit(payload)).unwrap();
  
      if (res) {
        console.log('Requested Successfully');
        if (onRefresh) {
          onRefresh();
        }
      }
    } catch (error) {
      console.log("Admin request error:", error);
    }
  };

  const columns: ColumnDef<NoticeData>[] = useMemo(
    () => [
      // {
      //   header: 'Company Group',
      //   enableSorting: false,
      //   accessorKey: 'CompanyGroup.name',
      //   cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
      // },
      {
        header: 'Company',
        enableSorting: false,
        accessorKey: 'Company.name',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Location',
        enableSorting: false,
        accessorKey: 'Location.name',
        cell: (props) => <div className="w-28 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Notice Type',
        enableSorting: false,
        accessorKey: 'notice_type',
        cell: (props) => (
          <div className="w-32 truncate capitalize">
            {(props.getValue() as string).replace(/_/g, ' ')}
          </div>
        ),
      },
      {
        header: 'Notice Date',
        enableSorting: false,
        accessorKey: 'notice_date',
        cell: (props) => (
          <div className="w-32 truncate">
            {dayjs(props.getValue() as string).format('DD-MM-YYYY')}
          </div>
        ),
      },
      {
        header: 'Status',
        enableSorting: false,
        accessorKey: 'status',
        cell: (props) => {
          const status = props.getValue() as string;
          return (
            <div className="w-32 truncate">
              <span className={`px-2 py-1 rounded ${getStatusColor(status)}`}>
                {status.toUpperCase()}
              </span>
            </div>
          );
        },
      },
      {
        header: 'Reference Number',
        enableSorting: false,
        accessorKey: 'reference_number',
        cell: (props) => <div className="w-36 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Related Act',
        enableSorting: false,
        accessorKey: 'related_act',
        cell: (props) => (
          <div className="w-32 truncate capitalize">
            {(props.getValue() as string).replace(/_/g, ' ')}
          </div>
        ),
      },
      {
        header: 'Notice Copy',
        enableSorting: false,
        accessorKey: 'notice_document',
        cell: (props) => {
          const document = props.getValue() as string | null;
          
          const handleDocumentDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            if (document) {
              const fullPath = `${import.meta.env.VITE_API_GATEWAY}/${document}`;
              window.open(fullPath, '_blank');
            }
          };

          return (
            <div className="w-40 flex items-center">
              {document ? (
                <a 
                  href="#" 
                  onClick={handleDocumentDownload} 
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
    
      // {
      //   header: 'Actions',
      //   id: 'actions',
      //   cell: ({ row }) => (
      //     <div className="flex items-center gap-2">
      //       <Tooltip title="View Reply">
      //     <Button
      //       size="sm"
      //       onClick={() => navigate('/notice-tracker/replyhistory', {
      //         state: { noticeId: row.original.id }
      //       })} 
      //       icon={<FaEye />}
      //     />
      //   </Tooltip>
      //   <Tooltip title="Add Reply">
      //     <Button
      //       size="sm"
      //       onClick={() => navigate('/notice-tracker/response', { 
      //         state: { noticeId: row.original.id }
      //       })}
      //       icon={<FaComments />}

      //     />
      //   </Tooltip>
      //       {canEdit && (
              
      //       <Tooltip title="Edit">
      //         <Button
      //           size="sm"
      //           onClick={() => handleEdit(row.original)}
      //           icon={<MdEdit />}
      //         />
      //       </Tooltip>
      //       )}
      //       {canDelete && (
      //       <Tooltip title="Delete">
      //         <Button
      //           size="sm"
      //           onClick={() => handleDeleteConfirmation(row.original.id)}
      //           icon={<FiTrash />}
      //           className="text-red-500"
      //         />
      //       </Tooltip>
      //       )}
            
        
      //     </div>
      //   ),
      // },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => {
          const { iseditable, is_requested, created_by, id } = row.original;
          const status = row.original.status.toLowerCase(); 
          return (
            <div className="flex items-center gap-2">
              {/* View Reply Button */}
              <Tooltip title="View Reply">
                <Button
                  size="sm"
                  onClick={() => navigate('/notice-tracker/replyhistory', {
                    state: { noticeId: row.original.id }
                  })} 
                  icon={<FaEye />}
                />
              </Tooltip>
      
              {/* Conditional Button */}
              {status === 'open' ? (
                // Show Reply Button if status is "open"
                <Tooltip title="Add Reply">
                  <Button
                    size="sm"
                    onClick={() => navigate('/notice-tracker/response', { 
                      state: { noticeId: row.original.id }
                    })}
                    icon={<FaComments />}
                  />
                </Tooltip>
              ) : (
                // Show Add Notice Button if status is "closed"
                <Tooltip title="Add Notice">
                  <Button
                    size="sm"
                    onClick={() => navigate('/notice-tracker/followUpNotice', { 
                      state: { noticeId: row.original.id }
                    })}
                    icon={<FaEnvelopeOpen />}
                  />
                </Tooltip>
              )}
      
             {/* Edit Button (if iseditable is true and is_requested is false) */}
             {canEdit && iseditable && !is_requested && (
          <Tooltip title="Edit">
            <Button
              size="sm"
              onClick={() => handleEdit(row.original)}
              icon={<MdEdit />}
            />
          </Tooltip>
        )}

        {/* Request to Admin Button (if iseditable is true and is_requested is true) */}
        {(iseditable === false || is_requested) && (
          <Tooltip title="Request to Admin">
            <Button
              size="sm"
              onClick={() => handleRequestToAdmin(id, 'notice')} // Pass the correct ID and type
              icon={<FaUserShield />}
              className="text-blue-500"
            />
          </Tooltip>
        )}
      
              {/* Delete Button (if canDelete is true) */}
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
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
          <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
          <p>No Data Is Available</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
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

      <Dialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <div className="p-2">
          <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
          <p className="mb-6">Are you sure you want to delete this notice entry?</p>
          
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
              color="blue"
            >
              Confirm
            </Button>
          </div>
        </div>
      </Dialog>

      <EditNoticeDialog
        isOpen={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedNoticeId(null);
        }}
        noticeId={selectedNoticeId}
        onSuccess={onRefresh}
      />
    </div>
  );
};

export default NoticeTrackerTable;