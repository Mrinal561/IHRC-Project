// import React, { useState, useEffect, useMemo } from 'react';
// import { DataTable } from '@/components/shared';
// import { Button, Tooltip, Notification, toast, Dialog } from '@/components/ui';
// import { HiDownload, HiOutlineViewGrid, HiTrash } from 'react-icons/hi';
// import httpClient from '@/api/http-client';
// import { endpoints } from '@/api/endpoint';
// import useAuth from '@/utils/hooks/useAuth';
// import { FiTrash } from 'react-icons/fi';

// interface PoshPolicy {
//     id: number;
//     company_id: number;
//     company_name: string;
//     version: string;
//     is_active: boolean;
//     created_by: number;
//     created_by_name: string;
//     created_by_email: string;
//     created_at: string;
//     updated_at: string;
// }

// interface PoshPolicyTableProps {
//     refreshKey?: number;
// }


// const PoshPolicyTable = ({ refreshKey }: PoshPolicyTableProps) => {
//     const [data, setData] = useState<PoshPolicy[]>([]);
//     const [loading, setLoading] = useState(false);
//         const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//             const [selectedPolicy, setSelectedPolicy] = useState<PoshPolicy | null>(null);
//                 const [isDeleting, setIsDeleting] = useState(false);



//     const [pagingData, setPagingData] = useState({
//         total: 0,
//         page: 1,
//         limit: 10
//     });
//     const auth = useAuth();
//     const userId = auth?.user?.id || 0;

//     const fetchPolicies = async (page = 1, limit = 10) => {
//         setLoading(true);
//         try {
//             const response = await httpClient.get(endpoints.poshSetup.listPolicy(), {
//                 // params: {
//                 //     page,
//                 //     limit,
//                 // }
//             });

//             setData(response.data.data);
//             setPagingData({
//                 total: response.data.meta.total,
//                 page: response.data.meta.page,
//                 limit: response.data.meta.limit
//             });
//         } catch (error) {
//             console.error('Failed to fetch policies:', error);
          
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDownload = async (id: number) => {
//         try {
//             const response = await httpClient.get(
//                 endpoints.poshSetup.downloadPolicy(id), 
//                 {
//                     responseType: 'blob'
//                 }
//             );
            
//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `posh-policy-${id}.pdf`);
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             window.URL.revokeObjectURL(url);
//         } catch (error) {
//             console.error('Download error:', error);
           
//         }
//     };

// const handleDeleteClick = (policyId: number) => {
//     console.log('Current data:', data); // Debug log
//     const policy = data.find(p => p.id === policyId);
    
//     if (!policy) {
//         console.error(`Policy with ID ${policyId} not found. Available IDs:`, data.map(p => p.id));
//         toast.push(
//             <Notification title="Error" type="error">
//                 Policy not found in current data
//             </Notification>
//         );
//         return;
//     }
    
//     console.log('Setting policy for deletion:', policy);
//     setSelectedPolicy(policy);
//     setDeleteDialogOpen(true);
// };



//     const confirmDelete = async () => {
//         if (!selectedPolicy) return;
        
//         setIsDeleting(true);
//         try {
//             await httpClient.delete(endpoints.poshSetup.policyDelete(selectedPolicy.id));
//                toast.push(
//                     <Notification
//                         title="Success"
//                         closable={true}
//                         type="success"
//                     >
//                         Policy deleted successfully
//                     </Notification>,
//                 )  

//             // Refresh the table
//             fetchPolicies(pagingData.page, pagingData.limit);
//         } catch (error) {
//             console.error('Delete error:', error);
//             toast.push(
//                     <Notification
//                         title="Error"
//                         closable={true}
//                         type="error"
//                     >
//                         Failed to delete policy
//                     </Notification>,
//                 )  
           
//         } finally {
//             setIsDeleting(false);
//             setDeleteDialogOpen(false);
//         }
//     };

//     useEffect(() => {
//         fetchPolicies();
//     }, [refreshKey]);

//     const columns = useMemo(() => [
//         {
//             header: 'Company Name',
//             enableSorting: false,
//             accessorKey: 'company_name',
//             cell: ({ row }) => <div className="font-medium">{row.original.company_name}</div>
//         },
       
//         {
//             header: 'Status',
//                         enableSorting: false,

//             accessorKey: 'is_active',
//             cell: ({ row }) => (
//                 <div className={`w-20 font-semibold px-2 py-1 rounded-md text-sm text-center h-8 ${row.original.is_active ? 'text-green-600' : 'text-red-600'}`}>
//                     {row.original.is_active ? 'Active' : 'Inactive'}
//                 </div>
//             )
//         },
//          {
//             header: 'Created By',
//             enableSorting: false,
//             accessorKey: 'created_by_name',
//             cell: ({ row }) => <div className="font-medium">{row.original.created_by_name}</div>
//         },
//         // {
//         //     header: 'Created By',
//         //                             enableSorting: false,

//         //     accessorKey: 'created_by_name',
//         //     cell: ({ row }) => row.original.created_by_name
//         // },
//         {
//             header: 'Actions',
//             id: 'actions',
//             cell: ({ row }) => (
//                 <div className="flex space-x-1">
//                     <Tooltip title="Download Policy">
//                         <Button
//                             size="sm"
//                             icon={<HiDownload />}
//                             onClick={() => handleDownload(row.original.id)}
//                         />
//                     </Tooltip>
//                     <Tooltip title="Delete Policy">
//                         <Button
//     size="sm"
//     icon={<FiTrash />}
//     onClick={(e) => {
//         e.stopPropagation();
//         console.log('Delete clicked for ID:', row.original.id); // Debug log
//         handleDeleteClick(row.original.id);
//     }}
//     className="hover:bg-transparent text-red-500"
// />
//                     </Tooltip>
//                 </div>
//             )
//         }
//     ], []);

//     return (
//         <div className="relative">
//             {data.length === 0 && !loading ? (
//                 <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
//                     <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
//                     <p className="text-center">No POSH Policies Available</p>
//                 </div>
//             ) : (
//                 <>
//                     <DataTable
//                         columns={columns}
//                         data={data}
//                         loading={loading}
//                         pagingData={pagingData}
//                         onPaginationChange={({ pageIndex, pageSize }) => 
//                             fetchPolicies(pageIndex + 1, pageSize)
//                         }
//                         stickyHeader={true}
//                     />

//                     {/* Delete Confirmation Dialog */}
//                     <Dialog
//                         isOpen={deleteDialogOpen}
//                         onClose={() => setDeleteDialogOpen(false)}
//                         onRequestClose={() => setDeleteDialogOpen(false)}
//                     >
//                         <h5 className="mb-4">Confirm Delete</h5>
//                         <p>
//                             Are you sure you want to delete this POSH policy?
//                         </p>
//                         <div className="text-right mt-6">
//                             <Button
//                                 className="ltr:mr-2 rtl:ml-2"
//                                 variant="plain"
//                                 onClick={() => setDeleteDialogOpen(false)}
//                                 disabled={isDeleting}
//                             >
//                                 Cancel
//                             </Button>
//                             <Button
//                                 variant="solid"
//                                 onClick={confirmDelete}
//                                 loading={isDeleting}
//                             >
//                                 Delete
//                             </Button>
//                         </div>
//                     </Dialog>
//                 </>
//             )}
//         </div>
//     );
// };

// export default PoshPolicyTable;



import React, { useMemo, useState } from 'react';
import { DataTable } from '@/components/shared';
import { Button, Tooltip, Dialog, toast, Notification } from '@/components/ui';
import { HiDownload, HiOutlineViewGrid } from 'react-icons/hi';
import { FiTrash } from 'react-icons/fi';
import PoshPolicy from './PoshPolicy';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

interface PoshPolicyTableProps {
    data: PoshPolicy[];
    loading: boolean;
    pagingData: {
        total: number;
        page: number;
        limit: number;
    };
    onPaginationChange: (page: number, limit: number) => void;
    // onDelete: (id: number) => void;
    onReferesh: () => void
    onDownload: (id: number) => void;
}

const PoshPolicyTable = ({ 
    data, 
    loading, 
    pagingData, 
    onPaginationChange,
    // onDelete,
    onReferesh,
    onDownload
}: PoshPolicyTableProps) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedPolicyId, setSelectedPolicyId] = useState<number | null>(null);

    const columns = useMemo(() => [
        {
            header: 'Company Name',
            enableSorting: false,
            accessorKey: 'company_name',
            cell: ({ row }) => <div className="font-medium">{row.original.company_name}</div>
        },
        {
            header: 'Status',
            enableSorting: false,
            accessorKey: 'is_active',
            cell: ({ row }) => (
                <div className={`w-20 font-semibold px-2 py-1 rounded-md text-sm text-center h-8 ${
                    row.original.is_active ? 'text-green-600' : 'text-red-600'
                }`}>
                    {row.original.is_active ? 'Active' : 'Inactive'}
                </div>
            )
        },
        {
            header: 'Created By',
            enableSorting: false,
            accessorKey: 'created_by_name',
            cell: ({ row }) => <div className="font-medium">{row.original.created_by_name}</div>
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => (
                <div className="flex space-x-1">
                    <Tooltip title="Download Policy">
                        <Button
                            size="sm"
                            icon={<HiDownload />}
                            onClick={() => onDownload(row.original.id)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete Policy">
                        <Button
                            size="sm"
                            icon={<FiTrash />}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPolicyId(row.original.id);
                                setDeleteDialogOpen(true);
                            }}
                            className="hover:bg-transparent text-red-500"
                        />
                    </Tooltip>
                </div>
            )
        }
    ], []);

     const handleDeletePolicy = async (id: number) => {
    try {
        await httpClient.delete(endpoints.poshSetup.policyDelete(id));
        toast.push(
            <Notification title="Success" type="success">
                Policy deleted successfully
            </Notification>
        );
        // fetchPolicies(pagingData.page, pagingData.limit);
        setDeleteDialogOpen(false);
        onReferesh();
    } catch (error) {
        console.error('Delete error:', error);
        toast.push(
            <Notification title="Error" type="error">
                Failed to delete policy
            </Notification>
        );
    }
};


    const confirmDelete = () => {
        if (selectedPolicyId) {
            // onDelete(selectedPolicyId);
            handleDeletePolicy(selectedPolicyId)
        }
    };

    return (
        <div className="relative">
            {data.length === 0 && !loading ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
                    <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
                    <p className="text-center">No POSH Policies Available</p>
                </div>
            ) : (
                <>
                    <DataTable
                        columns={columns}
                        data={data}
                        loading={loading}
                        pagingData={pagingData}
                        onPaginationChange={({ pageIndex, pageSize }) => 
                            onPaginationChange(pageIndex + 1, pageSize)
                        }
                        stickyHeader={true}
                    />

                    <Dialog
                        isOpen={deleteDialogOpen}
                        onClose={() => setDeleteDialogOpen(false)}
                    >
                        <h5 className="mb-4">Confirm Delete</h5>
                        <p>Are you sure you want to delete this POSH policy?</p>
                        <div className="text-right mt-6">
                            <Button
                                className="ltr:mr-2 rtl:ml-2"
                                variant="plain"
                                onClick={() => setDeleteDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="solid"
                                onClick={confirmDelete}
                            >
                                Delete
                            </Button>
                        </div>
                    </Dialog>
                </>
            )}
        </div>
    );
};

export default PoshPolicyTable;