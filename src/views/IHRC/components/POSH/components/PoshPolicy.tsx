

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
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAuthUser } from '@/store/slices/login';
import { Loading } from '@/components/shared';

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

interface Permissions {
    canList: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
}

const getPermissions = (menuItem: any): Permissions => {
    const permissionsObject = menuItem?.permissions || menuItem?.access || {};
    return {
        canList: !!permissionsObject.can_list,
        canCreate: !!permissionsObject.can_create,
        canEdit: !!permissionsObject.can_edit,
        canDelete: !!permissionsObject.can_delete,
    };
};

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
    const [permissions, setPermissions] = useState<Permissions>({
        canList: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
    });
    const [isInitialized, setIsInitialized] = useState(false);
    const [permissionCheckComplete, setPermissionCheckComplete] = useState(false);

    const auth = useAuth();
    const userId = auth?.user?.id || 0;
    const dispatch = useDispatch();
    const navigate = useNavigate();

     // Permission initialization
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const response = await dispatch(fetchAuthUser());

                if (!response.payload?.moduleAccess) {
                    toast.push(
                        <Notification title="Permission" type="error" closable={true}>
                            You don't have access to any modules
                        </Notification>
                    );
                    navigate('/home');
                    setPermissionCheckComplete(true);
                    setIsInitialized(true);
                    return;
                }

                // Find POSH module (ID 10 based on your data)
                const poshModule = response.payload.moduleAccess?.find(
                    // (module: any) => module.id === 10
                    (module: any) => module.id === 11
                );

                if (!poshModule) {
                    toast.push(
                        <Notification title="Permission" type="error" closable={true}>
                            You don't have access to POSH module
                        </Notification>
                    );
                    navigate('/home');
                    setPermissionCheckComplete(true);
                    setIsInitialized(true);
                    return;
                }

                // Find POSH Policy menu (ID 24 based on your data)
                const poshPolicyMenu = poshModule.menus?.find(
                    // (menu: any) => menu.id === 24
                    (menu: any) => menu.id === 31
                );

                if (!poshPolicyMenu) {
                    toast.push(
                        <Notification title="Permission" type="error" closable={true}>
                            You don't have access to POSH Policy menu
                        </Notification>
                    );
                    navigate('/home');
                    setPermissionCheckComplete(true);
                    setIsInitialized(true);
                    return;
                }

                const newPermissions = getPermissions(poshPolicyMenu);
                setPermissions(newPermissions);
                setIsInitialized(true);

                if (!newPermissions.canList) {
                    toast.push(
                        <Notification title="Permission" type="error" closable={true}>
                            You don't have permission to access POSH Policies
                        </Notification>
                    );
                    navigate('/home');
                }
                setPermissionCheckComplete(true);
            } catch (error) {
                console.error('Error fetching auth user:', error);
                setIsInitialized(true);
                setPermissionCheckComplete(true);
            }
        };

        if (!isInitialized) {
            initializeAuth();
        }
    }, [dispatch, isInitialized, navigate]);

    // Fetch all necessary data
    const fetchData = async () => {
         if (!permissions.canList) return;
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
         if (!permissions.canList) return;
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
         if (!permissions.canList) {
            toast.push(
                <Notification title="Permission Denied" type="error">
                    You don't have permission to download policies
                </Notification>
            );
            return;
        }
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
         if (!permissions.canList) {
            toast.push(
                <Notification title="Permission Denied" type="error">
                    You don't have permission to download policies
                </Notification>
            );
            return;
        }

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
     if (!permissions.canDelete) {
            toast.push(
                <Notification title="Permission Denied" type="error">
                    You don't have permission to delete policies
                </Notification>
            );
            return;
        }
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
    }, [permissions.canList]); 

    
     // Show loading while checking permissions
    if (!isInitialized || !permissionCheckComplete) {
        return (
            <Loading loading={true} type="default">
                <div className="h-full" />
            </Loading>
        );
    }

    // Don't render anything if user doesn't have list permission
    if (!permissions.canList) {
        return null;
    }


    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold">POSH Policy</h3>
                </div>
                <div className="flex gap-2">
                    {permissions.canList && (
                        <Button 
                            size='sm' 
                            variant='solid' 
                            icon={<HiDownload />}
                            onClick={handleDownloadAll}
                        >
                            Download All
                        </Button>
                    )}
                      {/* {permissions.canCreate && (
                        <Button
                            variant="solid"
                            size="sm"
                            icon={<HiUpload />}
                            onClick={() => setIsBulkUploadOpen(true)}
                        >
                            Bulk Upload
                        </Button>
                    )} */}
                    {permissions.canCreate && (
                        <Button
                            variant="solid"
                            size="sm"
                            icon={<HiPlusCircle />}
                            onClick={() => setIsAddDialogOpen(true)}
                        >
                            Add Policy
                        </Button>
                    )}
                </div>
            </div>
            
            <PoshPolicyTable 
                data={poshPolicies}
                loading={loading}
                pagingData={pagingData}
                onPaginationChange={fetchPolicies}
                onDownload={handleDownloadPolicy}
                onReferesh={fetchPolicies}
                canList={permissions.canList}
                canEdit={permissions.canEdit}
                canDelete={permissions.canDelete}
               
            />
            
            {permissions.canCreate && (
                <AddPolicyDialog
                    isOpen={isAddDialogOpen}
                    onClose={() => setIsAddDialogOpen(false)}
                    onSuccess={handleSuccess}
                    companies={companies}
                />
            )}
            
            {permissions.canCreate && (
                <PolicyBulkUpload
                    isOpen={isBulkUploadOpen}
                    onClose={() => setIsBulkUploadOpen(false)}
                    onSuccess={() => {
                        setIsBulkUploadOpen(false);
                        fetchPolicies(pagingData.page, pagingData.limit);
                    }}
                />
            )}
            
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