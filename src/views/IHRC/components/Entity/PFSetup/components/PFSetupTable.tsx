
import React, { useMemo, useState } from 'react';
import { Button, Dialog, Tooltip, toast, Notification } from '@/components/ui';
import { FiTrash } from 'react-icons/fi';
import { MdEdit } from 'react-icons/md';
import DataTable, { ColumnDef } from '@/components/shared/DataTable';
import PFEditedData from './PFEditedData';
import dayjs from 'dayjs';
import { deletePF } from '@/store/slices/pfSetup/pfSlice';
import { useDispatch } from 'react-redux';
import { showErrorNotification } from '@/components/ui/ErrorMessage';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const PFSetupTable = ({ data, onRefresh, companyName, groupName, pagination, onPageSizeChange, onPaginationChange, isLoading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  // Find the maximum number of signatories in any record
  const maxSignatories = useMemo(() => {
    return data.reduce((max, item) => {
      const signatoryCount = item.signatory_data?.length || 0;
      return Math.max(max, signatoryCount);
    }, 0);
  }, [data]);

  // Transform the data to include all signatory fields
  const transformedData = useMemo(() => {
    return data.map(item => {
      const transformed = {
        ...item,
        // Base fields remain the same
        pf_code: item.pf_code,
        location_name: item.Location?.name,
        register_date: item.register_date,
      };

      // Add fields for each possible signatory
      for (let i = 0; i < maxSignatories; i++) {
        const signatory = item.signatory_data?.[i];
        transformed[`signatory_name_${i + 1}`] = signatory?.details?.name || '';
        transformed[`signatory_role_${i + 1}`] = signatory?.details?.Role?.name || '';
        transformed[`signatory_email_${i + 1}`] = signatory?.details?.email || '';
        transformed[`dsc_validity_${i + 1}`] = signatory?.dsc_validity || '';
        transformed[`e_sign_status_${i + 1}`] = signatory?.e_sign_status || '';
      }

      return transformed;
    });
  }, [data, maxSignatories]);

  // Generate columns dynamically based on maxSignatories
  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: 'PF Code',
        enableSorting: false,
        accessorKey: 'pf_code',
        cell: (props) => (
          <div className="w-36 text-start">{props.getValue()}</div>
        ),
      },
      {
        header: 'PF Code Location',
        enableSorting: false,

        accessorKey: 'location_name',
        cell: (props) => (
          <div className="w-36 truncate">{props.getValue()}</div>
        ),
      },
      {
        header: 'PF Registration Date',
        enableSorting: false,

        enableSorting: false,
        accessorKey: 'register_date',
        cell: (props) => (
          <div className="w-44 flex items-center justify-center">
            {props.getValue() ? dayjs(props.getValue()).format('DD-MM-YYYY') : ''}
          </div>
        ),
      },
    ];

    // Add columns for each signatory
    for (let i = 0; i < maxSignatories; i++) {
      const signatoryNum = i + 1;
      baseColumns.push(
        {
          header: `Authorized Signatory ${signatoryNum}`,
          enableSorting: false,
          accessorKey: `signatory_name_${signatoryNum}`,
          cell: (props) => (
            <div className="w-48 truncate">{props.getValue()}</div>
          ),
        },
        {
          header: `Designation ${signatoryNum}`,
          accessorKey: `signatory_role_${signatoryNum}`,
          cell: (props) => (
            <div className="w-48 truncate">{props.getValue()}</div>
          ),
        },
        {
          header: `Email ${signatoryNum}`,
          enableSorting: false,

          accessorKey: `signatory_email_${signatoryNum}`,
          cell: (props) => (
            <div className="w-48 truncate">{props.getValue()}</div>
          ),
        },
        {
          header: `DSC Validity ${signatoryNum}`,
          enableSorting: false,

          accessorKey: `dsc_validity_${signatoryNum}`,
          cell: (props) => (
            <div className="w-44 flex items-center justify-center">
              {props.getValue() ? dayjs(props.getValue()).format('DD-MM-YYYY') : ''}
            </div>
          ),
        },
        {
          header: `E Sign Status ${signatoryNum}`,
          enableSorting: false,

          accessorKey: `e_sign_status_${signatoryNum}`,
          cell: (props) => (
            <div className="w-48 truncate">{props.getValue()}</div>
          ),
        }
      );
    }

    // Add actions column
    baseColumns.push({
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
              onClick={() => openDialog(row.original)}
              icon={<FiTrash />}
              className="text-red-500"
            />
          </Tooltip>
        </div>
      ),
    });

    return baseColumns;
  }, [maxSignatories]);

  const openDialog = (item) => {
    setItemToDelete(item);
    setDialogIsOpen(true);
  };

  const openEditDialog = (item) => {
    // setEditingId(item.id);
    // setEditDialogIsOpen(true);
    // setEditFormData(item);
    navigate(`/pfsetup-edit`, {
      state: {
          id:item.id,
          companyGroupName: groupName,
          companyName: companyName,
          companyId: item.company_id,
          groupId: item.group_id,
      },
  });
  };

  const handleDialogClose = () => {
    setDialogIsOpen(false);
    setEditDialogIsOpen(false);
    setItemToDelete(null);
    setEditFormData(null);
  };

  const handleDialogOk = async () => {
    if (itemToDelete) {
      try {
        setLoading(true)
        const res = await dispatch(deletePF(itemToDelete.id)).unwrap();
        if (res) {
          setDialogIsOpen(false);
          toast.push(
            <Notification title="Success" type="success">
              PF Setup deleted successfully
            </Notification>
          );
          setItemToDelete(null);
          if (onRefresh) {
            onRefresh();
          }
        }
      } catch (error) {
        if (error.response?.data?.message) {
          showErrorNotification(error.response.data.message);
        } else if (error.message) {
          showErrorNotification(error.message);
        } else if (Array.isArray(error)) {
          showErrorNotification(error);
        } else {
          showErrorNotification(error);
        }
      } finally{
        setLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500 rounded-xl">
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
      {transformedData.length === 0 ? (
       <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
       <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
       <p className="text-center">No Data Available</p>
     </div>
      ) : (
        <DataTable
          columns={columns}
          data={transformedData}
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
          stickyHeader={true}
          stickyFirstColumn={true}
          stickyLastColumn={true}
        />
      )}

      <Dialog
        isOpen={dialogIsOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}  
        shouldCloseOnOverlayClick={false} 
      >
        <h5 className="mb-4">Confirm Deletion</h5>
        <p>Are you sure you want to delete this PF Setup?</p>
        <div className="text-right mt-6">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            variant="plain"
            onClick={handleDialogClose}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={handleDialogOk} loading={loading}>
            Confirm
          </Button>
        </div>
      </Dialog>

      <Dialog
        isOpen={editDialogIsOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}
        width={800}
        height={470}
      >
        <h5 className="mb-4">Edit PF Setup</h5>
        <PFEditedData
          onRefresh={onRefresh}
          id={editingId}
          initialData={editFormData}
          onClose={handleDialogClose}
        />
      </Dialog>
    </div>
  );
};

export default PFSetupTable;