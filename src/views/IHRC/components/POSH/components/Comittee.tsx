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

interface SelectOption {
  value: string;
  label: string;
}

const Committee = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
    const [tableKey, setTableKey] = useState(Date.now()); 
    const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
    const [companies, setCompanies] = useState<SelectOption[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<SelectOption | null>(null);
      const [companyGroupId, setCompanyGroupId] = useState('');
    
    // Using your existing useAuth hook
    const auth = useAuth();
    const userId = auth?.user?.id || 0;
    const currentFinancialYear = useAppSelector((state: any) => state.common?.currentFinancialYear || '');

    const handleBulkUploadSuccess = () => {
        setIsBulkUploadOpen(false);
        setTableKey(Date.now());
    };

    const handleDownloadAllData = async () => {
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

    useEffect(() => {
        fetchCompanyGroups();
      }, []);

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

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold">POSH Committee</h3>
                </div>
                <div className="flex gap-2">
                    <Button 
                        size='sm' 
                        variant='solid' 
                        icon={<HiDownload />}
                        onClick={handleDownloadAllData}
                    >
                        Download Data
                    </Button>
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
                    <CommitteeBulkUpload 
                        isOpen={isBulkUploadOpen}
                        onClose={() => setIsBulkUploadOpen(false)}
                        onSuccess={handleBulkUploadSuccess}
                    />
                    <Button
                        variant="solid"
                        size="sm"
                        icon={<HiPlusCircle />}
                        onClick={() => navigate('/add-committee')}
                    >
                        Add Committee
                    </Button>
                </div>
            </div>
            <CommitteeTable key={tableKey} searchTerm={searchTerm} />

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