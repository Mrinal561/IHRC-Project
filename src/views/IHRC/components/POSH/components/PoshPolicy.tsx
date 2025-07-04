// import React, { useState, useEffect } from 'react';
// import { AdaptableCard } from '@/components/shared';
// import { HiDownload, HiPlusCircle, HiUpload } from 'react-icons/hi';
// import PoshPolicyTable from './PoshPolicyTable';
// import AddPolicyDialog from './AddPolicyDialog';
// import PolicyBulkUpload from './PolicyBulkUpload';
// import httpClient from '@/api/http-client';
// import { endpoints } from '@/api/endpoint';
// import useAuth from '@/utils/hooks/useAuth';
// import { Button } from '@/components/ui';

// const PoshPolicy = () => {
//     const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//     const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
//     const [companies, setCompanies] = useState<Array<{ id: number; name: string }>>([]);
//     const [companyGroupId, setCompanyGroupId] = useState('');
//     const [refreshKey, setRefreshKey] = useState(0);
//     const handleSuccess = () => {
//         setIsAddDialogOpen(false);
//     setRefreshKey(prev => prev + 1); 
// };
    
//     const auth = useAuth();
//     const userId = auth?.user?.id || 0;

//     const fetchCompanyGroups = async () => {
//         try {
//             const response = await httpClient.get(endpoints.companyGroup.getAll(), {
//                 params: { ignorePlatform: true }
//             });
            
//             if (response.data.data?.length > 0) {
//                 const defaultGroup = response.data.data[0];
//                 setCompanyGroupId(defaultGroup.id);
//                 fetchCompanies(defaultGroup.id);
//             }
//         } catch (error) {
//             console.error('Failed to fetch company groups:', error);
//         }
//     };

//     const fetchCompanies = async (groupId: string) => {
//         try {
//             const response = await httpClient.get(endpoints.company.getAll(), {
//                 params: { 'group_id[]': groupId }
//             });
            
//             // Format companies to match what AddPolicyDialog expects
//             const formattedCompanies = response.data?.data?.map((company: any) => ({
//                 id: company.id, // number type
//                 name: company.name
//             }));
            
//             setCompanies(formattedCompanies || []);
//         } catch (error) {
//             console.error('Failed to fetch companies:', error);
//         }
//     };

//     const handleDownloadAll = async () => {
//         try {
//             const response = await httpClient.get(endpoints.poshSetup.downloadBulkPolicy(), {
//                 responseType: 'blob'
//             });
            
//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', 'posh-policies.zip');
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             window.URL.revokeObjectURL(url);
//         } catch (error) {
//             console.error('Download error:', error);
//         }
//     };

//     useEffect(() => {
//         fetchCompanyGroups();
//     }, []);

//     return (
//         <AdaptableCard className="h-full" bodyClass="h-full">
//             <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
//                 <div className="mb-4 lg:mb-0">
//                     <h3 className="text-2xl font-bold">POSH Policy</h3>
//                 </div>
//                 <div className="flex gap-2">
//                     <Button 
//                         size='sm' 
//                         variant='solid' 
//                         icon={<HiDownload />}
//                         onClick={handleDownloadAll}
//                     >
//                         Download All
//                     </Button>
//                     {/* <Button
//                         variant="solid"
//                         size="sm"
//                         icon={<HiUpload />}
//                         onClick={() => setIsBulkUploadOpen(true)}
//                     >
//                         Bulk Upload
//                     </Button> */}
//                     <Button
//                         variant="solid"
//                         size="sm"
//                         icon={<HiPlusCircle />}
//                         onClick={() => setIsAddDialogOpen(true)}
//                     >
//                         Add Policy
//                     </Button>
//                 </div>
//             </div>
            
//             <PoshPolicyTable refreshKey={refreshKey} />
            
//             <AddPolicyDialog
//                 isOpen={isAddDialogOpen}
//                 onClose={() => setIsAddDialogOpen(false)}
//                 onSuccess={handleSuccess}
//                 companies={companies}
//             />
            
//             <PolicyBulkUpload
//                 isOpen={isBulkUploadOpen}
//                 onClose={() => setIsBulkUploadOpen(false)}
//                 onSuccess={() => {
//                     // You might want to add a way to refresh the table data here
//                     setIsBulkUploadOpen(false);
//                 }}
//             />
//         </AdaptableCard>
//     );
// };

// export default PoshPolicy;








import React, { useState, useEffect } from 'react';
import { AdaptableCard } from '@/components/shared';
import { HiDownload, HiPlusCircle, HiUpload } from 'react-icons/hi';
import PoshPolicyTable from './PoshPolicyTable';
import AddPolicyDialog from './AddPolicyDialog';
import PolicyBulkUpload from './PolicyBulkUpload';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import useAuth from '@/utils/hooks/useAuth';
import { Button, Dialog, Notification, toast } from '@/components/ui';

interface PoshPolicy {
    id: number;
    company_id: number;
    company_name: string;
    version: string;
    is_active: boolean;
    created_by: number;
    created_by_name: string;
    created_by_email: string;
    created_at: string;
    updated_at: string;
}

interface Company {
    id: number;
    name: string;
}

const PoshPolicy = () => {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [companyGroupId, setCompanyGroupId] = useState('');
    const [poshPolicies, setPoshPolicies] = useState<PoshPolicy[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagingData, setPagingData] = useState({
        total: 0,
        page: 1,
        limit: 10
    });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedPolicyId, setSelectedPolicyId] = useState<number | null>(null);

    const auth = useAuth();
    const userId = auth?.user?.id || 0;

    // Fetch all necessary data
    const fetchData = async () => {
        await fetchCompanyGroups();
        await fetchPolicies();
    };

    const fetchCompanyGroups = async () => {
        try {
            const response = await httpClient.get(endpoints.companyGroup.getAll(), {
                params: { ignorePlatform: true }
            });
            
            if (response.data.data?.length > 0) {
                const defaultGroup = response.data.data[0];
                setCompanyGroupId(defaultGroup.id);
                await fetchCompanies(defaultGroup.id);
            }
        } catch (error) {
            console.error('Failed to fetch company groups:', error);
            toast.push(
                <Notification title="Error" type="error">
                    Failed to fetch company groups
                </Notification>
            );
        }
    };

    const fetchCompanies = async (groupId: string) => {
        try {
            const response = await httpClient.get(endpoints.company.getAll(), {
                params: { 'group_id[]': groupId }
            });
            
            setCompanies(response.data?.data?.map((company: any) => ({
                id: company.id,
                name: company.name
            })) || []);
        } catch (error) {
            console.error('Failed to fetch companies:', error);
            toast.push(
                <Notification title="Error" type="error">
                    Failed to fetch companies
                </Notification>
            );
        }
    };

    const fetchPolicies = async (page = 1, limit = 10) => {
        setLoading(true);
        try {
            const response = await httpClient.get(endpoints.poshSetup.listPolicy(), {
                params: { page, limit }
            });

            setPoshPolicies(response.data.data || []);
            setPagingData({
                total: response.data.meta?.total || 0,
                page: response.data.meta?.page || 1,
                limit: response.data.meta?.limit || 10
            });
        } catch (error) {
            console.error('Failed to fetch policies:', error);
            toast.push(
                <Notification title="Error" type="error">
                    Failed to fetch policies
                </Notification>
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPolicy = async (id: number) => {
        try {
            const response = await httpClient.get(endpoints.poshSetup.downloadPolicy(id), {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `posh-policy-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
            toast.push(
                <Notification title="Error" type="error">
                    Failed to download policy
                </Notification>
            );
        }
    };

    const handleDownloadAll = async () => {
        try {
            const response = await httpClient.get(endpoints.poshSetup.downloadBulkPolicy(), {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'posh-policies.zip');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
            toast.push(
                <Notification title="Error" type="error">
                    Failed to download all policies
                </Notification>
            );
        }
    };

   const handleDeletePolicy = async (id: number) => {
    try {
        await httpClient.delete(endpoints.poshSetup.policyDelete(id));
        toast.push(
            <Notification title="Success" type="success">
                Policy deleted successfully
            </Notification>
        );
        fetchPolicies(pagingData.page, pagingData.limit);
    } catch (error) {
        console.error('Delete error:', error);
        toast.push(
            <Notification title="Error" type="error">
                Failed to delete policy
            </Notification>
        );
    }
};

    const handleSuccess = () => {
        setIsAddDialogOpen(false);
        fetchPolicies(pagingData.page, pagingData.limit);
    };

    useEffect(() => {
        fetchData();
    }, []);

    

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold">POSH Policy</h3>
                </div>
                <div className="flex gap-2">
                    <Button 
                        size='sm' 
                        variant='solid' 
                        icon={<HiDownload />}
                        onClick={handleDownloadAll}
                    >
                        Download All
                    </Button>
                    <Button
                        variant="solid"
                        size="sm"
                        icon={<HiUpload />}
                        onClick={() => setIsBulkUploadOpen(true)}
                    >
                        Bulk Upload
                    </Button>
                    <Button
                        variant="solid"
                        size="sm"
                        icon={<HiPlusCircle />}
                        onClick={() => setIsAddDialogOpen(true)}
                    >
                        Add Policy
                    </Button>
                </div>
            </div>
            
            <PoshPolicyTable 
                data={poshPolicies}
                loading={loading}
                pagingData={pagingData}
                onPaginationChange={fetchPolicies}
                onDownload={handleDownloadPolicy}
                onReferesh={fetchPolicies}
                // onDelete={(id) => {
                //     setSelectedPolicyId(id);
                //     setDeleteDialogOpen(true);
                // }}
            />
            
            <AddPolicyDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                onSuccess={handleSuccess}
                companies={companies}
            />
            
            <PolicyBulkUpload
                isOpen={isBulkUploadOpen}
                onClose={() => setIsBulkUploadOpen(false)}
                onSuccess={() => {
                    setIsBulkUploadOpen(false);
                    fetchPolicies(pagingData.page, pagingData.limit);
                }}
            />
            
            <Dialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onRequestClose={() => setDeleteDialogOpen(false)}
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
                        onClick={() => {
                            if (selectedPolicyId) {
                                handleDeletePolicy(selectedPolicyId);
                            }
                            setDeleteDialogOpen(false); // Close dialog immediately
            }}
                    >
                        Delete
                    </Button>
                </div>
            </Dialog>
        </AdaptableCard>
    );
};

export default PoshPolicy;