
// import React, { useMemo, useState } from 'react';
// import { Button, Dialog, toast, Tooltip, Notification } from '@/components/ui';
// import { FiTrash } from 'react-icons/fi';
// import { MdEdit } from 'react-icons/md';
// import DataTable, { ColumnDef } from '@/components/shared/DataTable';
// import ESIEditedData from './ESIEditedData';
// import { EsiSetupData } from '@/@types/esiSetup';
// import dayjs from 'dayjs';
// import { showErrorNotification } from '@/components/ui/ErrorMessage';
// import { deleteESI } from '@/store/slices/esiSetup/esiSetupSlice';
// import { useDispatch } from 'react-redux';
// import Lottie from 'lottie-react';
// import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json';
// import { HiOutlineViewGrid } from 'react-icons/hi';

// interface ESISetupTableProps {
//   data: EsiSetupData[];
//   onDelete?: (index: number) => void;
//   onEdit?: (index: number, newData: EsiSetupData) => void;
//   loading?: boolean;
//   onRefresh?: () => void;
//   pagination: {
//     total: number;
//     pageIndex: number;
//     pageSize: number;
//   };
//   onPaginationChange: (page: number) => void;
//   onPageSizeChange: (pageSize: number) => void;
//   isLoading: boolean;
// }

// const ESISetupTable: React.FC<ESISetupTableProps> = ({ 
//   data,
//   loading = false,
//   onDelete,
//   onEdit,
//   onRefresh,
//   onPageSizeChange,
//   onPaginationChange,
//   pagination, 
//   isLoading
// }) => {
//   const dispatch = useDispatch();
//   const [dialogIsOpen, setDialogIsOpen] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState<number | null>(null);
//   const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
//   const [itemToEdit, setItemToEdit] = useState<EsiSetupData | null>(null);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [Loading, setLoading] = useState(false)
//   const maxSignatories = useMemo(() => {
//     return data.reduce((max, item) => {
//       const signatoryCount = item.signatories?.length || 0;
//       return Math.max(max, signatoryCount);
//     }, 0);
//   }, [data]);

//   const transformedData = useMemo(() => {
//     return data.map(item => {
//       const transformed = {
//         ...item,
//         esi_code_type: item.code_Type,
//         esi_code: item.code,
//         location_name: item.Location?.name,
//         esi_user: item.esi_user,
//         password: item.password,
//       };

//       for (let i = 0; i < maxSignatories; i++) {
//         const signatory = item.signatories?.[i];
//         transformed[`signatory_name_${i + 1}`] = signatory?.name || '';
//         transformed[`signatory_role_${i + 1}`] = signatory?.Role?.name || '';
//         transformed[`signatory_email_${i + 1}`] = signatory?.email || '';
//         transformed[`signatory_mobile_${i + 1}`] = signatory?.mobile || '';
//       }

//       return transformed;
//     });
//   }, [data, maxSignatories]);

//   const columns = useMemo(() => {
//     const baseColumns = [
//       {
//         header: 'ESI Code Type',
//         enableSorting: false,
//         accessorKey: 'esi_code_type',
//         cell: (props) => (
//           <div className="w-36 text-start">{props.getValue()}</div>
//         ),
//       },
//       {
//         header: 'ESI Code',
//         enableSorting: false,
//         accessorKey: 'esi_code',
//         cell: (props) => (
//           <div className="w-36 text-start">{props.getValue()}</div>
//         ),
//       },
//       {
//         header: 'ESI Code Location',
//         enableSorting: false,
//         accessorKey: 'location_name',
//         cell: (props) => (
//           <div className="w-36 truncate">{props.getValue()}</div>
//         ),
//       },
//       {
//         header: 'Mobile',
//         enableSorting: false,
//         accessorKey: 'mobile_number',
//         cell: (props) => (
//           <div className=" flex items-center justify-center">{props.getValue()}</div>
//         ),
//       },
//       {
//         header: 'Email',
//         enableSorting: false,
//         accessorKey: 'email',
//         cell: (props) => (
//           <div className=" flex items-center justify-center">{props.getValue()}</div>
//         ),
//       },
//       {
//         header: 'ESI User ID',
//         enableSorting: false,
//         accessorKey: 'esi_user',
//         cell: (props) => (
//           <div className="w-32 flex items-center justify-center">{props.getValue()}</div>
//         ),
//       },
//       {
//         header: 'ESI User Password',
//         enableSorting: false,
//         accessorKey: 'password',
//         cell: (props) => (
//           <div className="w-40 flex items-center justify-center">{props.getValue()}</div>
//         ),
//       },
//     ];

//     // for (let i = 0; i < maxSignatories; i++) {
//     //   const signatoryNum = i + 1;
//     //   baseColumns.push(
//     //     {
//     //       header: `Authorized Signatory ${signatoryNum}`,
//     //       accessorKey: `signatory_name_${signatoryNum}`,
//     //       cell: (props) => (
//     //         <div className="w-48 truncate">{props.getValue()}</div>
//     //       ),
//     //     },
//     //     {
//     //       header: `Designation ${signatoryNum}`,
//     //       accessorKey: `signatory_role_${signatoryNum}`,
//     //       cell: (props) => (
//     //         <div className="w-48 truncate">{props.getValue()}</div>
//     //       ),
//     //     },
//     //     {
//     //       header: `Email ${signatoryNum}`,
//     //       accessorKey: `signatory_email_${signatoryNum}`,
//     //       cell: (props) => (
//     //         <div className="w-48 truncate">{props.getValue()}</div>
//     //       ),
//     //     },
//     //     {
//     //       header: `Mobile ${signatoryNum}`,
//     //       accessorKey: `signatory_mobile_${signatoryNum}`,
//     //       cell: (props) => (
//     //         <div className="w-48 truncate">{props.getValue()}</div>
//     //       ),
//     //     }
//     //   );
//     // }

//     baseColumns.push({
//       header: 'Actions',
//       id: 'actions',
//       cell: ({ row }) => (
//         <div className="flex items-center gap-2">
//           <Tooltip title="Edit">
//             <Button
//               size="sm"
//               onClick={() => openEditDialog(row.original)}
//               icon={<MdEdit />}
//               className="text-blue-500"
//             />
//           </Tooltip>
//           <Tooltip title="Delete">
//             <Button
//               size="sm"
//               onClick={() => openDialog(row.original)}
//               icon={<FiTrash />}
//               className="text-red-500"
//             />
//           </Tooltip>
//         </div>
//       ),
//     });

//     return baseColumns;
//   }, [maxSignatories]);

//   const openDialog = (item: EsiSetupData) => {
//     setItemToDelete(item.id);
//     setDialogIsOpen(true);
//   };

//   const openEditDialog = (item: EsiSetupData) => {
//     setItemToEdit(item);
//     setEditDialogIsOpen(true);
//     setEditingId(item.id);
//   };

//   const handleDialogClose = () => {
//     setDialogIsOpen(false);
//     setEditDialogIsOpen(false);
//     setItemToDelete(null);
//     setItemToEdit(null);
//   };

//   const handleDialogOk = async () => {
//     if (itemToDelete) {
//       try {
//         setLoading(true)
//         const res = await dispatch(deleteESI(itemToDelete)).unwrap();
//         if (res) {
//           toast.push(
//             <Notification title="Success" type="success">
//               ESI Setup Deleted Successfully
//             </Notification>
//           );
//           setDialogIsOpen(false);
//           setItemToDelete(null);
//           if (onRefresh) {
//             onRefresh();
//           }
//         }
//       } catch (error) {
//         if (error.response?.data?.message) {
//           showErrorNotification(error.response.data.message);
//         } else if (error.message) {
//           showErrorNotification(error.message);
//         } else if (Array.isArray(error)) {
//           showErrorNotification(error);
//         } else {
//           showErrorNotification(error);
//         }
//       } finally{
//         setLoading(false)
//       }
//     }
//   };

//   const handleEditConfirm = (editedData: EsiSetupData) => {
//     if (itemToEdit !== null) {
//       const index = data.findIndex(item => item === itemToEdit);
//       if (index !== -1) {
//         onEdit?.(index, editedData);
//         setEditDialogIsOpen(false);
//         setItemToEdit(null);
//         toast.push(
//           <Notification title="Success" type="success">
//             ESI Setup updated successfully
//           </Notification>
//         );
//       }
//     }
//   };
//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-96 text-gray-500 rounded-xl">
//         <div className="w-28 h-28">
//           <Lottie 
//             animationData={loadingAnimation} 
//             loop 
//             className="w-24 h-24"
//           />
//         </div>
//         <p className="text-lg font-semibold">
//           Loading Data...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="relative">
//       {transformedData.length === 0 ? (
//         <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
//         <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
//         <p className="text-center">No Data Available</p>
//       </div>
//       ) : (
//         <DataTable
//           columns={columns}
//           data={transformedData}
//           skeletonAvatarColumns={[0]}
//           skeletonAvatarProps={{ className: 'rounded-md' }}
//           loading={isLoading}
//           pagingData={{
//             total: pagination.total,
//             pageIndex: pagination.pageIndex,
//             pageSize: pagination.pageSize,
//           }}
//           onPaginationChange={onPaginationChange}
//           onSelectChange={onPageSizeChange}
//           stickyHeader={true}
//           stickyFirstColumn={true}
//           stickyLastColumn={true}
//         />
//       )}

//       <Dialog
//         isOpen={dialogIsOpen}
//         onClose={handleDialogClose}
//         onRequestClose={handleDialogClose}
//       >
//         <h5 className="mb-4">Confirm Deletion</h5>
//         <p>Are you sure you want to delete this ESI Setup?</p>
//         <div className="mt-6 text-right flex gap-2 justify-end items-center">
         
//           <Button
//             className="ltr:mr-2 rtl:ml-2"
//             variant="plain"
//             onClick={handleDialogClose}
//           >
//             Cancel
//           </Button>
//           <Button variant="solid" onClick={handleDialogOk} loading={Loading}>
//             Confirm
//           </Button>
//         </div>
//       </Dialog>

//       <Dialog
//         isOpen={editDialogIsOpen}
//         onClose={handleDialogClose}
//         onRequestClose={handleDialogClose}
//         width={800}
//         height={520}
//       >
//         <h5 className="mb-4">Edit ESI Setup</h5>
//         {itemToEdit && (
//           <ESIEditedData
//             onRefresh={onRefresh}
//             id={editingId}
//             initialData={itemToEdit}
//             onClose={handleDialogClose}
//             onSubmit={handleEditConfirm}
//           />
//         )}
//       </Dialog>
//     </div>
//   );
// };

// export default ESISetupTable;


import React, { useMemo, useState } from 'react';
import { Button, Dialog, toast, Tooltip, Notification } from '@/components/ui';
import { FiTrash } from 'react-icons/fi';
import { MdEdit } from 'react-icons/md';
import DataTable, { ColumnDef } from '@/components/shared/DataTable';
import ESIEditedData from './ESIEditedData';
import { EsiSetupData } from '@/@types/esiSetup';
import dayjs from 'dayjs';
import { showErrorNotification } from '@/components/ui/ErrorMessage';
import { deleteESI } from '@/store/slices/esiSetup/esiSetupSlice';
import { useDispatch } from 'react-redux';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json';
import { HiOutlineViewGrid } from 'react-icons/hi';

interface ESISetupTableProps {
  data: EsiSetupData[];
  onDelete?: (index: number) => void;
  onEdit?: (index: number, newData: EsiSetupData) => void;
  loading?: boolean;
  onRefresh?: () => void;
  pagination: {
    total: number;
    pageIndex: number;
    pageSize: number;
  };
  onPaginationChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  isLoading: boolean;
}

const ESISetupTable: React.FC<ESISetupTableProps> = ({ 
  data,
  loading = false,
  onDelete,
  onEdit,
  onRefresh,
  onPageSizeChange,
  onPaginationChange,
  pagination, 
  isLoading
}) => {
  const dispatch = useDispatch();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<EsiSetupData | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [Loading, setLoading] = useState(false);

  // Sort data to show Main Codes first, then Sub Codes
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aType = String(a.code_Type).toLowerCase().trim();
      const bType = String(b.code_Type).toLowerCase().trim();
      
      if (aType === 'main' && bType !== 'main') return -1;
      if (aType !== 'main' && bType === 'main') return 1;
      return 0;
    });
  }, [data]);

  const maxSignatories = useMemo(() => {
    return sortedData.reduce((max, item) => {
      const signatoryCount = item.signatories?.length || 0;
      return Math.max(max, signatoryCount);
    }, 0);
  }, [sortedData]);

  const transformedData = useMemo(() => {
    return sortedData.map(item => {
      const transformed = {
        ...item,
        esi_code_type: item.code_Type,
        esi_code: item.code,
        location_name: item.Location?.name,
        esi_user: item.esi_user,
        password: item.password,
      };

      for (let i = 0; i < maxSignatories; i++) {
        const signatory = item.signatories?.[i];
        transformed[`signatory_name_${i + 1}`] = signatory?.name || '';
        transformed[`signatory_role_${i + 1}`] = signatory?.Role?.name || '';
        transformed[`signatory_email_${i + 1}`] = signatory?.email || '';
        transformed[`signatory_mobile_${i + 1}`] = signatory?.mobile || '';
      }

      return transformed;
    });
  }, [sortedData, maxSignatories]);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: 'ESI Code Type',
        enableSorting: false,
        accessorKey: 'esi_code_type',
        cell: (props) => {
          const value = props.getValue();
          return (
            <div className="w-36 text-start capitalize">
              {value === 'main' ? 'Main Code' : 'Sub Code'}
            </div>
          );
        },
      },
      {
        header: 'ESI Code',
        enableSorting: false,
        accessorKey: 'esi_code',
        cell: (props) => (
          <div className="w-36 text-start">{props.getValue()}</div>
        ),
      },
      {
        header: 'ESI Code Location',
        enableSorting: false,
        accessorKey: 'location_name',
        cell: (props) => (
          <div className="w-36 truncate">{props.getValue()}</div>
        ),
      },
      {
        header: 'Mobile',
        enableSorting: false,
        accessorKey: 'mobile_number',
        cell: (props) => (
          <div className="flex items-center justify-center">{props.getValue()}</div>
        ),
      },
      {
        header: 'Email',
        enableSorting: false,
        accessorKey: 'email',
        cell: (props) => (
          <div className="flex items-center justify-center">{props.getValue()}</div>
        ),
      },
      {
        header: 'ESI User ID',
        enableSorting: false,
        accessorKey: 'esi_user',
        cell: (props) => (
          <div className="w-32 flex items-center justify-center">{props.getValue()}</div>
        ),
      },
      {
        header: 'ESI User Password',
        enableSorting: false,
        accessorKey: 'password',
        cell: (props) => (
          <div className="w-40 flex items-center justify-center">{props.getValue()}</div>
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
                onClick={() => openDialog(row.original)}
                icon={<FiTrash />}
                className="text-red-500"
              />
            </Tooltip>
          </div>
        ),
      },
    ];

    return baseColumns;
  }, [maxSignatories]);

  const openDialog = (item: EsiSetupData) => {
    setItemToDelete(item.id);
    setDialogIsOpen(true);
  };

  const openEditDialog = (item: EsiSetupData) => {
    setItemToEdit(item);
    setEditDialogIsOpen(true);
    setEditingId(item.id);
  };

  const handleDialogClose = () => {
    setDialogIsOpen(false);
    setEditDialogIsOpen(false);
    setItemToDelete(null);
    setItemToEdit(null);
  };

  const handleDialogOk = async () => {
    if (itemToDelete) {
      try {
        setLoading(true);
        const res = await dispatch(deleteESI(itemToDelete)).unwrap();
        if (res) {
          toast.push(
            <Notification title="Success" type="success">
              ESI Setup Deleted Successfully
            </Notification>
          );
          setDialogIsOpen(false);
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
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditConfirm = (editedData: EsiSetupData) => {
    if (itemToEdit !== null) {
      const index = data.findIndex(item => item.id === itemToEdit.id);
      if (index !== -1) {
        onEdit?.(index, editedData);
        setEditDialogIsOpen(false);
        setItemToEdit(null);
        toast.push(
          <Notification title="Success" type="success">
            ESI Setup updated successfully
          </Notification>
        );
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
          disableSorting={true} // Disable all sorting to maintain our custom order
        />
      )}

      {/* Dialogs remain the same */}
      <Dialog
        isOpen={dialogIsOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}
      >
        <h5 className="mb-4">Confirm Deletion</h5>
        <p>Are you sure you want to delete this ESI Setup?</p>
        <div className="mt-6 text-right flex gap-2 justify-end items-center">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            variant="plain"
            onClick={handleDialogClose}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={handleDialogOk} loading={Loading}>
            Confirm
          </Button>
        </div>
      </Dialog>

      <Dialog
        isOpen={editDialogIsOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}
        width={800}
        height={520}
      >
        <h5 className="mb-4">Edit ESI Setup</h5>
        {itemToEdit && (
          <ESIEditedData
            onRefresh={onRefresh}
            id={editingId}
            initialData={itemToEdit}
            onClose={handleDialogClose}
            onSubmit={handleEditConfirm}
          />
        )}
      </Dialog>
    </div>
  );
};

export default ESISetupTable;