import { AdaptableCard } from '@/components/shared'
import { Button, Dialog, toast } from '@/components/ui';
import OutlinedInput from '@/components/ui/OutlinedInput';
import React, { useEffect, useState } from 'react'
import { HiDownload, HiPlusCircle } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import CommitteeBulkUpload from './ComitteeBulkUpload';
import CommitteeTable from './ComitteeTable';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { Notification } from '@/components/ui';
import useAuth from '@/utils/hooks/useAuth';
import { useAppSelector } from '@/store';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import { useDispatch } from 'react-redux';
import { fetchAuthUser } from '@/store/slices/login';
import { Loading } from '@/components/shared';

interface SelectOption {
  value: string;
  label: string;
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


const Committee = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
    const [tableKey, setTableKey] = useState(Date.now()); 
    const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
    const [companies, setCompanies] = useState<SelectOption[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<SelectOption | null>(null);
      const [companyGroupId, setCompanyGroupId] = useState('');
      const [permissions, setPermissions] = useState<Permissions>({
        canList: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
    });
    const [isInitialized, setIsInitialized] = useState(false);
    const [permissionCheckComplete, setPermissionCheckComplete] = useState(false);
    
    // Using your existing useAuth hook
    const auth = useAuth();
    const userId = auth?.user?.id || 0;
    const currentFinancialYear = useAppSelector((state: any) => state.common?.currentFinancialYear || '');

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

                // Find POSH Committee menu (ID 25 based on your data)
                const poshCommitteeMenu = poshModule.menus?.find(
                    // (menu: any) => menu.id === 25
                    (menu: any) => menu.id === 32
                );

                if (!poshCommitteeMenu) {
                    toast.push(
                        <Notification title="Permission" type="error" closable={true}>
                            You don't have access to POSH Committee menu
                        </Notification>
                    );
                    navigate('/home');
                    setPermissionCheckComplete(true);
                    setIsInitialized(true);
                    return;
                }

                const newPermissions = getPermissions(poshCommitteeMenu);
                setPermissions(newPermissions);
                setIsInitialized(true);

                if (!newPermissions.canList) {
                    toast.push(
                        <Notification title="Permission" type="error" closable={true}>
                            You don't have permission to access POSH Committee
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

    useEffect(() => {
        if (permissions.canList) {
            fetchCompanyGroups();
        }
    }, [permissions.canList]);


    const handleBulkUploadSuccess = () => {
        setIsBulkUploadOpen(false);
        setTableKey(Date.now());
    };

    const handleDownloadAllData = async () => {
         if (!permissions.canList) {
            toast.push(
                <Notification title="Permission Denied" type="error" closable={true}>
                    You don't have permission to download committee data
                </Notification>
            );
            return;
        }
        try {
            const response = await httpClient.get(endpoints.poshSetup.committeeData(), {
                params: {
                    financial_year: currentFinancialYear,
                    created_by: userId,
                    search: searchTerm
                },
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `committee-data-export.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

           
        } catch (error) {
         
             toast.push(
                            <Notification title="error" type="error" closable>
                                Failed to download committee data
                            </Notification>
                        );
        }
    };

  
     const fetchCompanyGroups = async () => {
    try {
      const response = await httpClient.get(endpoints.companyGroup.getAll(), {
        params: { ignorePlatform: true }
      });
      
      if (response.data.data?.length > 0) {
        const defaultGroup = response.data.data[0];
        setCompanyGroupId(defaultGroup.id);
        fetchCompanies(defaultGroup.id);
      }
    } catch (error) {
      console.error('Failed to fetch company groups:', error);
    }
  };

    const fetchCompanies = async (groupId: string) => {
    try {
      const response = await httpClient.get(endpoints.company.getAll(), {
        params: { 'group_id[]': groupId }
      });
      
      const formattedCompanies = response.data?.data?.map((company: any) => ({
        value: company.id.toString(),
        label: company.name
      }));
      
      setCompanies(formattedCompanies || []);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    }
  };

    const handleDownloadReports = async () => {
         if (!permissions.canList) {
            toast.push(
                <Notification title="Permission Denied" type="error" closable={true}>
                    You don't have permission to download committee reports
                </Notification>
            );
            return;
        }
        if (!selectedCompany) {
         
             toast.push(
                            <Notification title="info" type="info" closable>
                                Please select a company first
                            </Notification>
                        );
            
            return;
        }

        try {
            const response = await httpClient.get(
                endpoints.poshSetup.BulkCommitteeRepors(), 
                {
                    params: {
                        company_id: selectedCompany.value
                    },
                    responseType: 'blob'
                }
            );
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `committee-reports-${selectedCompany.value}.zip`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setIsDownloadDialogOpen(false);
           
        } catch (error) {
           
             toast.push(
                            <Notification title="error" type="error" closable>
                                Failed to download committee reports
                            </Notification>
                        );
        }
    };

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
                    <h3 className="text-2xl font-bold">POSH Committee</h3>
                </div>
                <div className="flex gap-2">
                   {permissions.canList && (
                        <Button 
                            size='sm' 
                            variant='solid' 
                            icon={<HiDownload />}
                            onClick={handleDownloadAllData}
                        >
                            Download Data
                        </Button>
                    )}
                    {/* <Button 
                        size='sm' 
                        variant='solid' 
                        icon={<HiDownload />}
                        onClick={() => {
                            fetchCompanies();
                            setIsDownloadDialogOpen(true);
                        }}
                    >
                        Download Reports
                    </Button> */}
                     {permissions.canCreate && (
                        <CommitteeBulkUpload 
                            isOpen={isBulkUploadOpen}
                            onClose={() => setIsBulkUploadOpen(false)}
                            onSuccess={handleBulkUploadSuccess}
                        />
                    )}
                  {permissions.canCreate && (
                        <Button
                            variant="solid"
                            size="sm"
                            icon={<HiPlusCircle />}
                            onClick={() => navigate('/add-committee')}
                        >
                            Add Committee
                        </Button>
                    )}
                </div>
            </div>
            <CommitteeTable key={tableKey} searchTerm={searchTerm} canList={permissions.canList}
                />

            {/* Download Reports Dialog */}
            <Dialog
                isOpen={isDownloadDialogOpen}
                onClose={() => setIsDownloadDialogOpen(false)}
                onRequestClose={() => setIsDownloadDialogOpen(false)}
                width={500}
            >
                <h5 className="mb-6">Download Committee Reports</h5>
                <div className="grid gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Select Company</label>
                        <OutlinedSelect
                            options={companies}
                            value={selectedCompany}
                            onChange={(selectedOption) => setSelectedCompany(selectedOption)}
                            label="Select Company"
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="plain" onClick={() => setIsDownloadDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button 
                            variant="solid" 
                            onClick={handleDownloadReports}
                            disabled={!selectedCompany}
                        >
                            Download Reports
                        </Button>
                    </div>
                </div>
            </Dialog>
        </AdaptableCard>
    );
};

export default Committee;