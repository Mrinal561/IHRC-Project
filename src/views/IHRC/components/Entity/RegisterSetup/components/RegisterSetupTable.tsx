import React, { useMemo, useState } from 'react';
import { Button, Dialog, toast, Tooltip, Notification } from '@/components/ui';
import { FiTrash } from 'react-icons/fi';
import { MdEdit } from 'react-icons/md';
import { HiOutlineViewGrid } from 'react-icons/hi';
import DataTable, { ColumnDef } from '@/components/shared/DataTable';
import RegisterSetupEditPanel from './RegisterSetupEditPanel';
import dayjs from 'dayjs';
import { RegisterSetupData } from '@/@types/RegisterSetupData';

interface RegisterSetupTableProps {
  data: RegisterSetupData[];
  onDelete: (id: number) => void;
  onEdit: (id: number, newData: RegisterSetupData) => void;
  isLoading: boolean;
  onRefresh: () => void;
  pagination: {
    total: number;
    pageIndex: number;
    pageSize: number;
  };
  onPaginationChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const RegisterSetupTable: React.FC<RegisterSetupTableProps> = ({
  data,
  // onDelete,
  // onEdit,
  isLoading,
  onRefresh,
  pagination,
  onPaginationChange,
  onPageSizeChange
}) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<RegisterSetupData | null>(null);
  const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<RegisterSetupData | null>(null);
  const [loading, setLoading] = useState(false);

  const columns: ColumnDef<RegisterSetupData>[] = useMemo(() => [
    {
      header: 'Company',
      enableSorting: false,
      accessorKey: 'Company.name',
      cell: (props) => (
        <div className="w-40 truncate">{props.getValue() || 'N/A'}</div>
      ),
    },
    {
      header: 'Name of Industry',
      enableSorting: false,
      accessorKey: 'name_of_industry',
      cell: (props) => (
        <div className="w-40 truncate">{props.getValue()}</div>
      ),
    },
    {
      header: 'Address',
      enableSorting: false,
      accessorKey: 'address',
      cell: (props) => (
        <div className="w-48 truncate">{props.getValue()}</div>
      ),
    },
    {
      header: 'Name of Employer',
      enableSorting: false,
      accessorKey: 'name_of_employer',
      cell: (props) => (
        <div className="w-40 truncate">{props.getValue()}</div>
      ),
    },
  
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Edit">
            <Button
              size="sm"
              onClick={() => openEditDialog(row.original)}
              icon={<MdEdit />}
              className="text-blue-500"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              size="sm"
              onClick={() => openDeleteDialog(row.original)}
              icon={<FiTrash />}
              className="text-red-500"
            />
          </Tooltip>
        </div>
      ),
    },
  ], []);

  const openDeleteDialog = (item: RegisterSetupData) => {
    setItemToDelete(item);
    setDialogIsOpen(true);
  };

  const openEditDialog = (item: RegisterSetupData) => {
    setItemToEdit(item);
    setEditDialogIsOpen(true);
  };

  const handleDialogClose = () => {
    setDialogIsOpen(false);
    setEditDialogIsOpen(false);
    setItemToDelete(null);
    setItemToEdit(null);
  };

  // const handleDeleteConfirm = async () => {
  //   if (itemToDelete?.id) {
  //     setLoading(true);
  //     try {
  //       await onDelete(itemToDelete.id);
  //       setDialogIsOpen(false);
  //       setItemToDelete(null);
  //     } catch (error) {
  //       console.error('Delete error:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };

  // const handleEditConfirm = async (editedData: RegisterSetupData) => {
  //   if (itemToEdit?.id) {
  //     try {
  //       await onEdit(itemToEdit.id, editedData);
  //       setEditDialogIsOpen(false);
  //       setItemToEdit(null);
  //     } catch (error) {
  //       console.error('Edit error:', error);
  //     }
  //   }
  // };

  if (isLoading && data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500 rounded-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg font-semibold">Loading Data...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
          <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
          <p className="text-center">No Register Setup Data Available</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          skeletonAvatarColumns={[0]}
          skeletonAvatarProps={{ className: 'rounded-md' }}
          loading={isLoading}
          pagingData={{
            total: pagination.total,
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
          }}
          onPaginationChange={onPaginationChange}
          onSelectChange={onPageSizeChange}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {/* <Dialog
        isOpen={dialogIsOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}
      >
        <h5 className="mb-4">Confirm Deletion</h5>
        <p>Are you sure you want to delete this Register Setup?</p>
        <div className="mt-6 text-right flex gap-2 justify-end items-center">
          <Button
            variant="plain"
            onClick={handleDialogClose}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            onClick={handleDeleteConfirm}
            loading={loading}
          >
            Confirm
          </Button>
        </div>
      </Dialog> */}

      {/* Edit Dialog */}
      {/* <Dialog
        isOpen={editDialogIsOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}
        width={800}
        height={400}
      >
        <h5 className="mb-4">Edit Register Setup</h5>
        {itemToEdit && (
          <RegisterSetupEditPanel
            initialData={itemToEdit}
            onClose={handleDialogClose}
            onSubmit={handleEditConfirm}
            isLoading={loading}
          />
        )}
      </Dialog> */}
    </div>
  );
};

export default RegisterSetupTable;