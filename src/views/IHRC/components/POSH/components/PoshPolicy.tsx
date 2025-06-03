import React, { useState, useEffect } from 'react';
import { AdaptableCard } from '@/components/shared';
import { HiDownload, HiPlusCircle, HiUpload } from 'react-icons/hi';
import PoshPolicyTable from './PoshPolicyTable';
import AddPolicyDialog from './AddPolicyDialog';
import PolicyBulkUpload from './PolicyBulkUpload';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import useAuth from '@/utils/hooks/useAuth';
import { Button } from '@/components/ui';

const PoshPolicy = () => {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
    const [companies, setCompanies] = useState<Array<{ id: number; name: string }>>([]);
    const [companyGroupId, setCompanyGroupId] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const handleSuccess = () => {
        setIsAddDialogOpen(false);
    setRefreshKey(prev => prev + 1); 
};
    
    const auth = useAuth();
    const userId = auth?.user?.id || 0;

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
            
            // Format companies to match what AddPolicyDialog expects
            const formattedCompanies = response.data?.data?.map((company: any) => ({
                id: company.id, // number type
                name: company.name
            }));
            
            setCompanies(formattedCompanies || []);
        } catch (error) {
            console.error('Failed to fetch companies:', error);
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
        }
    };

    useEffect(() => {
        fetchCompanyGroups();
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
                    {/* <Button
                        variant="solid"
                        size="sm"
                        icon={<HiUpload />}
                        onClick={() => setIsBulkUploadOpen(true)}
                    >
                        Bulk Upload
                    </Button> */}
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
            
            <PoshPolicyTable refreshKey={refreshKey} />
            
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
                    // You might want to add a way to refresh the table data here
                    setIsBulkUploadOpen(false);
                }}
            />
        </AdaptableCard>
    );
};

export default PoshPolicy;