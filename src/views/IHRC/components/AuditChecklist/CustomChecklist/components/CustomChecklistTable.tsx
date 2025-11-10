// import React, { useMemo, useState, useEffect } from 'react';
// import DataTable from '@/components/shared/DataTable';
// import { Tooltip, Button, Dialog, Notification, toast } from '@/components/ui';
// import { useNavigate } from 'react-router-dom';
// import { MdEdit } from 'react-icons/md';
// import { FiTrash } from 'react-icons/fi';
// import { RiEyeLine } from 'react-icons/ri';
// import httpClient from '@/api/http-client';
// import { endpoints } from '@/api/endpoint';
// import { APP_PREFIX_PATH } from '@/constants/route.constant';
// import { HiOutlineViewGrid } from 'react-icons/hi';

// interface CustomChecklist {
//     id: number;
//     uuid: string;
//     group_id: number;
//     country: string;
//     function: string;
//     applicable: string;
//     state_id: number | null;
//     legislation_act: string;
//     compliance_categorization: string;
//     penalty_type: string;
//     penalty_description: string;
//     compliance_header: string;
//     compliance_description: string;
//     compliance_applicability: string;
//     compliance_reference: string;
//     compliance_type: string;
//     compliance_frequency: string;
//     criticality: string;
//     proof_mandatory: boolean;
//     due_date_frequency: string;
//     due_dates: {
//         first_due_date?: string;
//         second_due_date?: string;
//         third_due_date?: string;
//         last_due_date?: string;
//     };
//     is_active: boolean;
//     created_by: number;
//     created_at: string;
//     updated_at: string;
//     CompanyGroup: {
//         id: number;
//         name: string;
//     };
//     State: {
//         id: number;
//         name: string;
//     } | null;
//     CompanyAdmin: {
//         id: number;
//         name: string;
//     };
// }


// interface PaginationState {
//     pageIndex: number;
//     pageSize: number;
// }

// interface CustomChecklistTableProps {
//   searchQuery?: string;
// }


// const CustomChecklistTable = ({ searchQuery = '' }: CustomChecklistTableProps) => {
//     const [data, setData] = useState<CustomChecklist[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [dialogIsOpen, setDialogIsOpen] = useState(false);
//     const [itemToDelete, setItemToDelete] = useState<CustomChecklist | null>(null);
//     const [totalItems, setTotalItems] = useState(0);
//     const [pageIndex, setPageIndex] = useState(1);
//     const [pageSize, setPageSize] = useState(10);
//     const [sort, setSort] = useState<{id: string; desc: boolean} | null>(null);
//     const navigate = useNavigate();
//         const [isSearching, setIsSearching] = useState(false);


//     const fetchData = async () => {
//         try {
//             setLoading(true);
//             const params = {
//                 page: pageIndex,
//                 limit: pageSize,
//                 sort: sort ? `${sort.id}:${sort.desc ? 'desc' : 'asc'}` : undefined,
//                 search: searchQuery || undefined
//             };

//             const response = await httpClient.get(endpoints.compliance.listCustomChecklist(), { params });
//             setData(response.data.data);
//             setTotalItems(response.data.total);
//         } catch (error) {
//             console.error('Error fetching custom checklists:', error);
//             toast.push(
//                 <Notification title="Error" type="error">
//                     Failed to load custom checklists
//                 </Notification>
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//    useEffect(() => {
//     const timer = setTimeout(() => {
//         fetchData();
//     }, 500); // 500ms debounce delay

//     return () => clearTimeout(timer);
// }, [pageIndex, pageSize, sort, searchQuery]); // Add searchQuery to dependencies

//     const handleDeleteClick = (item: CustomChecklist) => {
//         setItemToDelete(item);
//         setDialogIsOpen(true);
//     };

//     const handleConfirmDelete = async () => {
//         if (itemToDelete) {
//             try {
//                 await httpClient.delete(
//                     endpoints.compliance.deleteCustomChecklist(itemToDelete.id)
//                 );
//                 toast.push(
//                     <Notification title="Success" type="success">
//                         Checklist deleted successfully
//                     </Notification>
//                 );
//                 // Refresh data after deletion
//                 fetchData();
//             } catch (error) {
//                 console.error('Error deleting checklist:', error);
//                 toast.push(
//                     <Notification title="Error" type="error">
//                         Failed to delete checklist
//                     </Notification>
//                 );
//             }
//         }
//         setDialogIsOpen(false);
//         setItemToDelete(null);
//     };

//     const handleCancelDelete = () => {
//         setDialogIsOpen(false);
//         setItemToDelete(null);
//     };

//     const handleEditClick = (item: CustomChecklist) => {
//         navigate(`${APP_PREFIX_PATH}/companyadmin/compliance/checklists/edit/${item.id}`);
//     };

//     const handleViewDetails = (item: CustomChecklist) => {
//         navigate(`/app/companyadmin/compliance/checklists/view/${item.id}`);
//     };

//     const handleCreateNew = () => {
//         navigate('/app/companyadmin/compliance/checklists/create');
//     };


//     const columns = useMemo(
//         () => [
//             // {
//             //     header: 'ID',
//             //     enableSorting: false,
//             //     accessorKey: 'id',
//             //     cell: (props) => <div className="w-10">{props.getValue()}</div>,
//             // },
//             // {
//             //     header: 'Company Group',
//             //     enableSorting: false,
//             //     accessorKey: 'CompanyGroup.name',
//             //     cell: (props) => (
//             //         <div className="w-24 truncate">
//             //             {props.row.original.CompanyGroup.name}
//             //         </div>
//             //     ),
//             // },
//             {
//                 header: 'Country',
//                 enableSorting: false,
//                 accessorKey: 'country',
//                 cell: (props) => <div className="w-20">{props.getValue()}</div>,
//             },
//             {
//                 header: 'Function',
//                 enableSorting: false,
//                 accessorKey: 'function',
//                 cell: (props) => <div className="w-24 truncate">{props.getValue()}</div>,
//             },
//             {
//                 header: 'Applicable',
//                 enableSorting: false,
//                 accessorKey: 'applicable',
//                 cell: (props) => (
//                     <div className="w-20 capitalize">{props.getValue()}</div>
//                 ),
//             },
//             {
//                 header: 'State',
//                 enableSorting: false,
//                 accessorKey: 'State.name',
//                 cell: (props) => (
//                     <div className="w-24">
//                         {props.row.original.State?.name || '-'}
//                     </div>
//                 ),
//             },
//             {
//                 header: 'Legislation',
//                 enableSorting: false,
//                 accessorKey: 'legislation_act',
//                 cell: (props) => (
//                     <Tooltip title={props.getValue() as string} placement="top">
//                         <div className="w-32 truncate">{props.getValue()}</div>
//                     </Tooltip>
//                 ),
//             },
//             {
//                 header: 'Header',
//                 enableSorting: false,
//                 accessorKey: 'compliance_header',
//                 cell: (props) => (
//                     <Tooltip title={props.getValue() as string} placement="top">
//                         <div className="w-40 truncate">{props.getValue()}</div>
//                     </Tooltip>
//                 ),
//             },
//             {
//                 header: 'Criticality',
//                 enableSorting: false,
//                 accessorKey: 'criticality',
//                 cell: (props) => {
//                     const criticality = props.getValue();
//                     return (
//                         <div className="w-20 font-semibold capitalize">
//                             {criticality === 'high' ? (
//                                 <span className="text-red-500">{criticality}</span>
//                             ) : criticality === 'medium' ? (
//                                 <span className="text-yellow-500">{criticality}</span>
//                             ) : (
//                                 <span className="text-green-500">{criticality}</span>
//                             )}
//                         </div>
//                     );
//                 },
//             },
//             {
//             header: 'Proof Mandatory',
//             enableSorting: false,
//             accessorKey: 'proof_mandatory',
//             cell: (props) => (
//                 <div className="w-24 capitalize">
//                     {props.getValue() ? 'Yes' : 'No'}
//                 </div>
//             ),
//         },
//             {
//                 header: 'Status',
//                 enableSorting: false,
//                 accessorKey: 'is_active',
//                 cell: (props) => (
//                     <div className="w-16">
//                         {props.getValue() ? (
//                             <span className="text-green-500">Active</span>
//                         ) : (
//                             <span className="text-red-500">Inactive</span>
//                         )}
//                     </div>
//                 ),
//             },
//             {
//                 header: 'Actions',
//                 id: 'actions',
//                 cell: ({ row }) => (
//                     <div className='flex space-x-2'>
//                         {/* <Tooltip title="View Details" placement="top">
//                             <Button
//                                 size="sm"
//                                 onClick={() => handleViewDetails(row.original)}
//                                 icon={<RiEyeLine />}
//                                 className='hover:bg-transparent'
//                             />
//                         </Tooltip> */}
//                         {/* <Tooltip title="Edit" placement="top">
//                             <Button
//                                 size="sm"
//                                 onClick={() => handleEditClick(row.original)}
//                                 icon={<MdEdit />}
//                                 className='hover:bg-transparent'
//                             />
//                         </Tooltip> */}
//                         <Tooltip title="Delete" placement="top">
//                             <Button
//                                 size="sm"
//                                 onClick={() => handleDeleteClick(row.original)}
//                                 icon={<FiTrash />}
//                                 className='hover:bg-transparent text-red-500'
//                             />
//                         </Tooltip>
//                     </div>
//                 ),
//             },
//         ],
//         []
//     );

//     const [pagination, setPagination] = useState<PaginationState>({
//     pageIndex: 1,
//     pageSize: 10
// });

// const handlePaginationChange = (newPagination: PaginationState) => {
//     setPagination(newPagination);
//     // Or if your DataTable expects separate parameters:
//     // setPageIndex(newPagination.pageIndex);
//     // setPageSize(newPagination.pageSize);
// };



//     return (
//         <div className="relative">
//              {data.length === 0 ? (
//                             <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
//                                 <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
//                                 <p className="text-center">No Data Available</p>
//                             </div>
//                         ) : (
//                             <>
//                    <DataTable
//     columns={columns}
//     data={data}
//     loading={loading}
//     paging
//     pageIndex={pagination.pageIndex}
//     pageSize={pagination.pageSize}
//     total={totalItems}
//     onPaginationChange={handlePaginationChange}
//     onSortingChange={(sorting) => {
//         if (sorting.length > 0) {
//             setSort({ id: sorting[0].id, desc: sorting[0].desc });
//         } else {
//             setSort(null);
//         }
//     }}
//     stickyHeader
//     stickyFirstColumn
//     stickyLastColumn
// />
//                     </>
//                 )
//             }
            
//             {/* <div className="overflow-x-auto bg-white">
//                 <DataTable
//     columns={columns}
//     data={data}
//     loading={loading}
//     paging
//     pageIndex={pagination.pageIndex}
//     pageSize={pagination.pageSize}
//     total={totalItems}
//     onPaginationChange={handlePaginationChange}
//     onSortingChange={(sorting) => {
//         if (sorting.length > 0) {
//             setSort({ id: sorting[0].id, desc: sorting[0].desc });
//         } else {
//             setSort(null);
//         }
//     }}
//     stickyHeader
//     stickyFirstColumn
//     stickyLastColumn
// />
//             </div> */}

//             <Dialog
//                 isOpen={dialogIsOpen}
//                 onClose={handleCancelDelete}
//                 onRequestClose={handleCancelDelete}
//                 shouldCloseOnOverlayClick={false}
//             >
//                 <h5 className="mb-4">Confirm Delete</h5>
//                 <p>
//                     Are you sure you want to delete the checklist: {itemToDelete?.compliance_header}?
//                 </p>
//                 <div className="text-right mt-6">
//                     <Button
//                         className="ltr:mr-2 rtl:ml-2"
//                         variant="plain"
//                         onClick={handleCancelDelete}
//                     >
//                         Cancel
//                     </Button>
//                     <Button variant="solid" color="red-600" onClick={handleConfirmDelete}>
//                         Confirm
//                     </Button>
//                 </div>
//             </Dialog>
//         </div>
//     );
// };

// export default CustomChecklistTable;


























// import React, { useMemo, useState, useEffect } from 'react';
// import DataTable from '@/components/shared/DataTable';
// import { Tooltip, Button, Dialog, Notification, toast } from '@/components/ui';
// import { useNavigate } from 'react-router-dom';
// import { FiTrash } from 'react-icons/fi';
// import httpClient from '@/api/http-client';
// import { endpoints } from '@/api/endpoint';
// import { APP_PREFIX_PATH } from '@/constants/route.constant';
// import { HiOutlineViewGrid, HiOutlineSearch } from 'react-icons/hi';

// interface CustomChecklist {
//     id: number;
//     uuid: string;
//     group_id: number;
//     country: string;
//     function: string;
//     applicable: string;
//     state_id: number | null;
//     legislation_act: string;
//     compliance_categorization: string;
//     penalty_type: string;
//     penalty_description: string;
//     compliance_header: string;
//     compliance_description: string;
//     compliance_applicability: string;
//     compliance_reference: string;
//     compliance_type: string;
//     compliance_frequency: string;
//     criticality: string;
//     proof_mandatory: boolean;
//     due_date_frequency: string;
//     due_dates: {
//         first_due_date?: string;
//         second_due_date?: string;
//         third_due_date?: string;
//         last_due_date?: string;
//     };
//     is_active: boolean;
//     created_by: number;
//     created_at: string;
//     updated_at: string;
//     CompanyGroup: {
//         id: number;
//         name: string;
//     };
//     State: {
//         id: number;
//         name: string;
//     } | null;
//     CompanyAdmin: {
//         id: number;
//         name: string;
//     };
// }

// interface PaginationState {
//     pageIndex: number;
//     pageSize: number;
// }

// interface CustomChecklistTableProps {
//     searchQuery?: string;
// }

// const CustomChecklistTable = ({ searchQuery = '' }: CustomChecklistTableProps) => {
//     const [data, setData] = useState<CustomChecklist[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [isSearching, setIsSearching] = useState(false);
//     const [dialogIsOpen, setDialogIsOpen] = useState(false);
//     const [itemToDelete, setItemToDelete] = useState<CustomChecklist | null>(null);
//     const [totalItems, setTotalItems] = useState(0);
//     const [pageIndex, setPageIndex] = useState(1);
//     const [pageSize, setPageSize] = useState(10);
//     const [sort, setSort] = useState<{id: string; desc: boolean} | null>(null);
//     const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
//     const navigate = useNavigate();

//     // Debounce search query
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setDebouncedSearchQuery(searchQuery);
//         }, 500);

//         return () => clearTimeout(timer);
//     }, [searchQuery]);

//     const fetchData = async () => {
//         try {
//             setLoading(true);
//             const params = {
//                 page: pageIndex,
//                 limit: pageSize,
//                 sort: sort ? `${sort.id}:${sort.desc ? 'desc' : 'asc'}` : undefined,
//                 search: debouncedSearchQuery || undefined
//             };

//             const response = await httpClient.get(endpoints.compliance.listCustomChecklist(), { params });
//             setData(response.data.data);
//             setTotalItems(response.data.total);
//         } catch (error) {
//             console.error('Error fetching custom checklists:', error);
//             toast.push(
//                 <Notification title="Error" type="error">
//                     Failed to load custom checklists
//                 </Notification>
//             );
//         } finally {
//             setLoading(false);
//             setIsSearching(false);
//         }
//     };

//     // Fetch data when dependencies change
//     useEffect(() => {
//         setIsSearching(true);
//         const timer = setTimeout(() => {
//             fetchData();
//         }, 300);

//         return () => clearTimeout(timer);
//     }, [pageIndex, pageSize, sort, debouncedSearchQuery]);

//     const handleDeleteClick = (item: CustomChecklist) => {
//         setItemToDelete(item);
//         setDialogIsOpen(true);
//     };

//     const handleConfirmDelete = async () => {
//         if (itemToDelete) {
//             try {
//                 await httpClient.delete(
//                     endpoints.compliance.deleteCustomChecklist(itemToDelete.id)
//                 );
//                 toast.push(
//                     <Notification title="Success" type="success">
//                         Checklist deleted successfully
//                     </Notification>
//                 );
//                 fetchData();
//             } catch (error) {
//                 console.error('Error deleting checklist:', error);
//                 toast.push(
//                     <Notification title="Error" type="error">
//                         Failed to delete checklist
//                     </Notification>
//                 );
//             }
//         }
//         setDialogIsOpen(false);
//         setItemToDelete(null);
//     };

//     const handleCancelDelete = () => {
//         setDialogIsOpen(false);
//         setItemToDelete(null);
//     };

//     // const handlePaginationChange = (newPagination: PaginationState) => {
//     //     setPageIndex(newPagination.pageIndex);
//     //     setPageSize(newPagination.pageSize);
//     // };

//     const handlePaginationChange = (newPagination: PaginationState) => {
//     setPagination(newPagination);
//     // Or if your DataTable expects separate parameters:
//     // setPageIndex(newPagination.pageIndex);
//     // setPageSize(newPagination.pageSize);
// };

//     const columns = useMemo(
//         () => [
//             {
//                 header: 'Country',
//                 enableSorting: false,
//                 accessorKey: 'country',
//                 cell: (props) => <div className="w-20">{props.getValue()}</div>,
//             },
//             {
//                 header: 'Function',
//                 enableSorting: false,
//                 accessorKey: 'function',
//                 cell: (props) => <div className="w-24 truncate">{props.getValue()}</div>,
//             },
//             {
//                 header: 'Applicable',
//                 enableSorting: false,
//                 accessorKey: 'applicable',
//                 cell: (props) => (
//                     <div className="w-20 capitalize">{props.getValue()}</div>
//                 ),
//             },
//             {
//                 header: 'State',
//                 enableSorting: false,
//                 accessorKey: 'State.name',
//                 cell: (props) => (
//                     <div className="w-24">
//                         {props.row.original.State?.name || '-'}
//                     </div>
//                 ),
//             },
//             {
//                 header: 'Legislation',
//                 enableSorting: false,
//                 accessorKey: 'legislation_act',
//                 cell: (props) => (
//                     <Tooltip title={props.getValue() as string} placement="top">
//                         <div className="w-32 truncate">{props.getValue()}</div>
//                     </Tooltip>
//                 ),
//             },
//             {
//                 header: 'Header',
//                 enableSorting: false,
//                 accessorKey: 'compliance_header',
//                 cell: (props) => (
//                     <Tooltip title={props.getValue() as string} placement="top">
//                         <div className="w-40 truncate">{props.getValue()}</div>
//                     </Tooltip>
//                 ),
//             },
//             {
//                 header: 'Criticality',
//                 enableSorting: false,
//                 accessorKey: 'criticality',
//                 cell: (props) => {
//                     const criticality = props.getValue();
//                     return (
//                         <div className="w-20 font-semibold capitalize">
//                             {criticality === 'high' ? (
//                                 <span className="text-red-500">{criticality}</span>
//                             ) : criticality === 'medium' ? (
//                                 <span className="text-yellow-500">{criticality}</span>
//                             ) : (
//                                 <span className="text-green-500">{criticality}</span>
//                             )}
//                         </div>
//                     );
//                 },
//             },
//             {
//                 header: 'Proof Mandatory',
//                 enableSorting: false,
//                 accessorKey: 'proof_mandatory',
//                 cell: (props) => (
//                     <div className="w-24 capitalize">
//                         {props.getValue() ? 'Yes' : 'No'}
//                     </div>
//                 ),
//             },
//             {
//                 header: 'Status',
//                 enableSorting: false,
//                 accessorKey: 'is_active',
//                 cell: (props) => (
//                     <div className="w-16">
//                         {props.getValue() ? (
//                             <span className="text-green-500">Active</span>
//                         ) : (
//                             <span className="text-red-500">Inactive</span>
//                         )}
//                     </div>
//                 ),
//             },
//             {
//                 header: 'Actions',
//                 id: 'actions',
//                 cell: ({ row }) => (
//                     <div className='flex space-x-2'>
//                         <Tooltip title="Delete" placement="top">
//                             <Button
//                                 size="sm"
//                                 onClick={() => handleDeleteClick(row.original)}
//                                 icon={<FiTrash />}
//                                 className='hover:bg-transparent text-red-500'
//                             />
//                         </Tooltip>
//                     </div>
//                 ),
//             },
//         ],
//         []
//     );

//     return (
//         <div className="relative">
//             {isSearching && (
//                 <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
//                     <div className="flex items-center">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>
//                         <span>Searching...</span>
//                     </div>
//                 </div>
//             )}

//             {data.length === 0 && debouncedSearchQuery ? (
//                 <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
//                     <HiOutlineSearch className="w-12 h-12 mb-4 text-gray-300" />
//                     <p className="text-center">No results found for "{debouncedSearchQuery}"</p>
//                 </div>
//             ) : data.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
//                     <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
//                     <p className="text-center">No Data Available</p>
//                 </div>
//             ) : (
//                 <DataTable
//                     columns={columns}
//                     data={data}
//                     loading={loading}
//                     paging
//                     pageIndex={pageIndex}
//                     pageSize={pageSize}
//                     total={totalItems}
//                     onPaginationChange={handlePaginationChange}
//                     onSortingChange={(sorting) => {
//                         if (sorting.length > 0) {
//                             setSort({ id: sorting[0].id, desc: sorting[0].desc });
//                         } else {
//                             setSort(null);
//                         }
//                     }}
//                     stickyHeader
//                     stickyFirstColumn
//                     stickyLastColumn
//                 />
//             )}

//             <Dialog
//                 isOpen={dialogIsOpen}
//                 onClose={handleCancelDelete}
//                 onRequestClose={handleCancelDelete}
//                 shouldCloseOnOverlayClick={false}
//             >
//                 <h5 className="mb-4">Confirm Delete</h5>
//                 <p>
//                     Are you sure you want to delete the checklist: {itemToDelete?.compliance_header}?
//                 </p>
//                 <div className="text-right mt-6">
//                     <Button
//                         className="ltr:mr-2 rtl:ml-2"
//                         variant="plain"
//                         onClick={handleCancelDelete}
//                     >
//                         Cancel
//                     </Button>
//                     <Button variant="solid" color="red-600" onClick={handleConfirmDelete}>
//                         Confirm
//                     </Button>
//                 </div>
//             </Dialog>
//         </div>
//     );
// };

// export default CustomChecklistTable;




import React, { useMemo, useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { Tooltip, Button, Dialog, Notification, toast } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { FiTrash } from 'react-icons/fi';
import { HiOutlineViewGrid, HiOutlineSearch } from 'react-icons/hi';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { APP_PREFIX_PATH } from '@/constants/route.constant';

interface CustomChecklist {
    id: number;
    uuid: string;
    group_id: number;
    country: string;
    function: string;
    applicable: string;
    state_id: number | null;
    legislation_act: string;
    compliance_categorization: string;
    penalty_type: string;
    penalty_description: string;
    compliance_header: string;
    compliance_description: string;
    compliance_applicability: string;
    compliance_reference: string;
    compliance_type: string;
    compliance_frequency: string;
    criticality: string;
    proof_mandatory: boolean;
    due_date_frequency: string;
    due_dates: {
        first_due_date?: string;
        second_due_date?: string;
        third_due_date?: string;
        last_due_date?: string;
    };
    is_active: boolean;
    created_by: number;
    created_at: string;
    updated_at: string;
    CompanyGroup: {
        id: number;
        name: string;
    };
    State: {
        id: number;
        name: string;
    } | null;
    CompanyAdmin: {
        id: number;
        name: string;
    };
}

interface CustomChecklistTableProps {
    data: CustomChecklist[];
    loading: boolean;
    pagination: {
        total: number;
        pageIndex: number;
        pageSize: number;
    };
    onPaginationChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    onSortChange: (sort: {id: string; desc: boolean} | null) => void;
}

const CustomChecklistTable = ({
    data,
    loading,
    pagination,
    onPaginationChange,
    onPageSizeChange,
    onSortChange
}: CustomChecklistTableProps) => {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<CustomChecklist | null>(null);
    const navigate = useNavigate();

    const handleDeleteClick = (item: CustomChecklist) => {
        setItemToDelete(item);
        setDialogIsOpen(true);
    };

    const [tableData, setTableData] = useState({
            total: 0,
            pageIndex: 1,
            pageSize: 10,
        });
    const handleConfirmDelete = async () => {
        if (itemToDelete) {
            try {
                await httpClient.delete(
                    endpoints.compliance.deleteCustomChecklist(itemToDelete.id)
                );
                toast.push(
                    <Notification title="Success" type="success">
                        Checklist deleted successfully
                    </Notification>
                );
                // Trigger parent to refetch data
                onPaginationChange(1);
            } catch (error) {
                console.error('Error deleting checklist:', error);
                toast.push(
                    <Notification title="Error" type="error">
                        Failed to delete checklist
                    </Notification>
                );
            }
        }
        setDialogIsOpen(false);
        setItemToDelete(null);
    };

    const handleCancelDelete = () => {
        setDialogIsOpen(false);
        setItemToDelete(null);
    };

    const columns = useMemo(
        () => [
            {
                header: 'Country',
                enableSorting: false,
                accessorKey: 'country',
                cell: (props) => <div className="w-20">{props.getValue()}</div>,
            },
            {
                header: 'Function',
                enableSorting: false,
                accessorKey: 'function',
                cell: (props) => <div className="w-24 truncate">{props.getValue()}</div>,
            },
            {
                header: 'Applicable',
                enableSorting: false,
                accessorKey: 'applicable',
                cell: (props) => (
                    <div className="w-20 capitalize">{props.getValue()}</div>
                ),
            },
            {
                header: 'State',
                enableSorting: false,
                accessorKey: 'State.name',
                cell: (props) => (
                    <div className="w-24">
                        {props.row.original.State?.name || '-'}
                    </div>
                ),
            },
            {
                header: 'Legislation',
                enableSorting: false,
                accessorKey: 'legislation_act',
                cell: (props) => (
                    <Tooltip title={props.getValue() as string} placement="top">
                        <div className="w-32 truncate">{props.getValue()}</div>
                    </Tooltip>
                ),
            },
            {
                header: 'Header',
                enableSorting: false,
                accessorKey: 'compliance_header',
                cell: (props) => (
                    <Tooltip title={props.getValue() as string} placement="top">
                        <div className="w-40 truncate">{props.getValue()}</div>
                    </Tooltip>
                ),
            },
            {
                header: 'Criticality',
                enableSorting: false,
                accessorKey: 'criticality',
                cell: (props) => {
                    const criticality = props.getValue();
                    return (
                        <div className="w-20 font-semibold capitalize">
                            {criticality === 'high' ? (
                                <span className="text-red-500">{criticality}</span>
                            ) : criticality === 'medium' ? (
                                <span className="text-yellow-500">{criticality}</span>
                            ) : (
                                <span className="text-green-500">{criticality}</span>
                            )}
                        </div>
                    );
                },
            },
            {
                header: 'Proof Mandatory',
                enableSorting: false,
                accessorKey: 'proof_mandatory',
                cell: (props) => (
                    <div className="w-24 capitalize">
                        {props.getValue() ? 'Yes' : 'No'}
                    </div>
                ),
            },
            {
                header: 'Status',
                enableSorting: false,
                accessorKey: 'is_active',
                cell: (props) => (
                    <div className="w-16">
                        {props.getValue() ? (
                            <span className="text-green-500">Active</span>
                        ) : (
                            <span className="text-red-500">Inactive</span>
                        )}
                    </div>
                ),
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => (
                    <div className='flex space-x-2'>
                        <Tooltip title="Delete" placement="top">
                            <Button
                                size="sm"
                                onClick={() => handleDeleteClick(row.original)}
                                icon={<FiTrash />}
                                className='hover:bg-transparent text-red-500'
                            />
                        </Tooltip>
                    </div>
                ),
            },
        ],
        []
    );

    return (
        <div className="relative">
            {!loading && data.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
                    <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
                    <p className="text-center">No Data Available</p>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={data}
                    loading={loading}
                    pagingData={{
                        total: pagination.total,
                        pageIndex: pagination.pageIndex,
                        pageSize: pagination.pageSize,
                    }}
                    onPaginationChange={onPaginationChange}
                    // onPageSizeChange={onPageSizeChange}
                    // onSortingChange={(sorting) => {
                    //     if (sorting.length > 0) {
                    //         onSortChange({ id: sorting[0].id, desc: sorting[0].desc });
                    //     } else {
                    //         onSortChange(null);
                    //     }
                    // }}
                    stickyHeader
                    stickyFirstColumn
                    stickyLastColumn
                />
            )}

            <Dialog
                isOpen={dialogIsOpen}
                onClose={handleCancelDelete}
                onRequestClose={handleCancelDelete}
                shouldCloseOnOverlayClick={false}
            >
                <h5 className="mb-4">Confirm Delete</h5>
                <p>
                    Are you sure you want to delete the checklist: {itemToDelete?.compliance_header}?
                </p>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={handleCancelDelete}
                    >
                        Cancel
                    </Button>
                    <Button variant="solid" color="red-600" onClick={handleConfirmDelete}>
                        Confirm
                    </Button>
                </div>
            </Dialog>
        </div>
    );
};

export default CustomChecklistTable;