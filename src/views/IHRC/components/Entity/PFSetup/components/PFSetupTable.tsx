import React, { useMemo, useState } from 'react';
import { Button, Dialog, Tooltip, toast, Notification } from '@/components/ui';
import { FiTrash } from 'react-icons/fi';
import { MdEdit } from 'react-icons/md';
import DataTable, { ColumnDef } from '@/components/shared/DataTable';
import PFEditedData from './PFEditedData';

export interface PFSetupData {
  Company_Group_Name: string;
  Company_Name: string;
  pfCode: string;
  pfCodeLocation: string;
  registrationDate?: string;
  pfUserId?: string;
  pfPassword?: string;
  authorizedSignatory: string;
  signatoryDesignation?: string;
  signatoryMobile?: string;
  signatoryEmail?: string;
  dscValidDate?: string;
  esign?: string;
  pfRegistrationCertificate?: File | null;
}

// interface PFSetupTableProps {
//   data: PFSetupData[];
//   onDelete: (index: number) => void;
//   onEdit: (index: number, newData: Partial<PFSetupData>) => void;
// }

const PFSetupTable: React.FC<PFSetupTableProps> = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<Partial<PFSetupData>>({});

  const [data , setData] = useState<PFSetupData[]>([
    {
      Company_Group_Name: "IND Money",
      Company_Name: "India shelter Pvt Ltd",
      pfCode: "RJUDR0021857000",
      pfCodeLocation: "UDAIPUR",
      registrationDate: "2023-01-15",
      pfUserId: "user123",
      pfPassword: "********",
      authorizedSignatory: "Amit",
      signatoryDesignation: "HR Manager",
      signatoryMobile: "+91 9556543210",
      signatoryEmail: "Amit@example.com",
      dscValidDate: "2025-01-15",
      esign: "Yes",
    },
    {
      Company_Group_Name: "IND Money",
      Company_Name: "India shelter Pvt Ltd",
      pfCode: "GNGGN2789109000",
      pfCodeLocation: "UDAIPUR",
      registrationDate: "2023-01-15",
      pfUserId: "user1234",
      pfPassword: "********",
      authorizedSignatory: "Ajay Thakur",
      signatoryDesignation: "CFO",
      signatoryMobile: "+91 9877743210",
      signatoryEmail: "Ajay@example.com",
      dscValidDate: "2026-01-15",
      esign: "Yes",
    },
    {
      Company_Group_Name: "IND Money",
      Company_Name: "India shelter Pvt Ltd",
      pfCode: "GNGGN2789109000",
      pfCodeLocation: "UDAIPUR",
      registrationDate: "2023-01-15",
      pfUserId: "user1234",
      pfPassword: "********",
      authorizedSignatory: "Krishna Kumar Singh",
      signatoryDesignation: "SEO",
      signatoryMobile: "+91 9878743210",
      signatoryEmail: "Krishna@example.com",
      dscValidDate: "2027-01-15",
      esign: "Yes",
    }
    
  ])


  const columns: ColumnDef<PFSetupData>[] = useMemo(
    () => [
      {
        header: 'Company Group Name',
        accessorKey: 'Company_Group_Name',
        cell: (props) => (
          <div className="w-36 text-start">{props.getValue() as string}</div>
        ),
      },
      {
        header: 'Company Name',
        accessorKey: 'Company_Name',
        cell: (props) => (
          <div className="w-36 text-start">{props.getValue() as string}</div>
        ),
      },
      {
        header: 'PF Code',
        accessorKey: 'pfCode',
        cell: (props) => (
          <div className="w-36 text-start">{props.getValue() as string}</div>
        ),
      },
      {
        header: 'PF Code Location',
        accessorKey: 'pfCodeLocation',
        cell: (props) => (
          <div className="w-36 truncate">{props.getValue() as string}</div>
        ),
      },
      {
        header: 'PF Registration Date',
        accessorKey: 'registrationDate',
        cell: (props) => (
          <div className="w-44 flex items-center justify-center">{props.getValue() as string}</div>
        ),
      },
      {
        header: 'PF User ID',
        accessorKey: 'pfUserId',
        cell: (props) => (
          <div className="w-32 flex items-center justify-center">{props.getValue() as string}</div>
        ),
      },
      {
        header: 'PF User Password',
        accessorKey: 'pfPassword',
        cell: (props) => (
          <div className="w-40 flex items-center justify-center">{props.getValue() as string}</div>
        ),
      },
      {
        header: 'Authorized Signatory',
        accessorKey: 'authorizedSignatory',
        cell: (props) => (
          <div className="w-48 truncate">{props.getValue() as string}</div>
        ),
      },
      {
        header: 'Designation',
        accessorKey: 'signatoryDesignation',
        cell: (props) => (
          <div className="w-48 truncate">{props.getValue() as string}</div>
        ),
      },
      {
        header: 'Mobile',
        accessorKey: 'signatoryMobile',
        cell: (props) => (
          <div className="w-48 truncate">{props.getValue() as string}</div>
        ),
      },
      {
        header: 'Email',
        accessorKey: 'signatoryEmail',
        cell: (props) => (
          <div className="w-48 truncate">{props.getValue() as string}</div>
        ),
      },
      {
        header: 'DSC Validity',
        accessorKey: 'dscValidDate',
        cell: (props) => (
          <div className="w-48 truncate">{props.getValue() as string}</div>
        ),
      },
      {
        header: 'E Sign',
        accessorKey: 'esign',
        cell: (props) => (
          <div className="w-48 truncate">{props.getValue() as string}</div>
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
                onClick={() => openDialog(row.index)}
                icon={<FiTrash />}
                className="text-red-500"
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    []
  );
  const openNotification = (type: 'success' | 'info' | 'danger' | 'warning', message: string) => {
    toast.push(
        <Notification
            title={type.charAt(0).toUpperCase() + type.slice(1)}
            type={type}
        >
            {message}
        </Notification>
    )
}

  const openDialog = (index: number) => {
    setItemToDelete(index);
    setDialogIsOpen(true);
  };

  const openEditDialog = (item: PFSetupData) => {
    setItemToEdit(item);
    // setEditedData(data[index]);
    setEditDialogIsOpen(true);
  };

  const handleDialogClose = () => {
    setDialogIsOpen(false);
    setEditDialogIsOpen(false);
    setItemToDelete(null);
    setItemToEdit(null);
    // setEditedData({});
  };

  const handleDialogOk = () => {
    if (itemToDelete !== null) {
      const newData = [...data];
      newData.splice(itemToDelete, 1);
      setData(newData);
      setDialogIsOpen(false);
      setItemToDelete(null);
      openNotification('danger', 'PF Setup deleted successfully');

    }
  };

  const handleEditConfirm = () => {
    if (itemToEdit !== null) {
      // onEdit(itemToEdit, editedData);
      const newData = [...data];
      const index = newData.findIndex(item => item === itemToEdit);
      if(index !== -1){
      setEditDialogIsOpen(false);
      setItemToEdit(null);
      openNotification('success', 'PF Setup updated successfully');
      // setEditedData({});
      }
    }
  };

  return (
    <div className="relative">
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No PF setup data available
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          skeletonAvatarColumns={[0]}
          skeletonAvatarProps={{ className: 'rounded-md' }}
          loading={false}
          pagingData={{
            total: data.length,
            pageIndex: 1,
            pageSize: 10,
          }}
          stickyHeader={true}
          stickyFirstColumn={true}
          stickyLastColumn={true}
        />
      )}

      <Dialog
        isOpen={dialogIsOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}
      >
        <h5 className="mb-4">Confirm Deletion</h5>
        <p>
          Are you sure you want to delete this PF Setup?
        </p>
        <div className="text-right mt-6">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            variant="plain"
            onClick={handleDialogClose}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={handleDialogOk}>
            Delete
          </Button>
        </div>
      </Dialog>

      <Dialog
        isOpen={editDialogIsOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}
        width={800}
        height={570}
      >
        <h5 className="mb-4">Edit PF Setup</h5>
        {/* Add your edit form fields here */}
        <PFEditedData
        initialData={itemToEdit}
        onClose={handleDialogClose}
        onSubmit={handleEditConfirm} />
        <div className="text-right mt-6">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            variant="plain"
            onClick={handleDialogClose}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={handleEditConfirm}>
            Confirm
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default PFSetupTable;