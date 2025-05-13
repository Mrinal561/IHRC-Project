import { AdaptableCard } from '@/components/shared'
import { Button } from '@/components/ui';
import OutlinedInput from '@/components/ui/OutlinedInput';
import React, { useState } from 'react'
import { HiDownload, HiPlusCircle } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import CommitteeBulkUpload from './CommitteeBulkUpload';
import CommitteeTable from './CommitteeTable';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { Notification } from '@/components/ui';
import useAuth from '@/utils/hooks/useAuth';
import { useAppSelector } from '@/store';

const Committee = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
    
    // Using your existing useAuth hook
    const auth = useAuth();
    const userId = auth?.user?.id || 0;
    const currentFinancialYear = useAppSelector((state: any) => state.common?.currentFinancialYear || '');

    const handleBulkUploadSuccess = () => {
        setIsBulkUploadOpen(false);
        // You might want to add a way to refresh the table data here
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
          
        }
    };

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold">Committee</h3>
                </div>
                <div className="flex gap-2">
                    {/* <OutlinedInput 
                        label={'Search by branch'} 
                        value={searchTerm}
                        onChange={(value) => setSearchTerm(value)}
                    /> */}
                    <Button 
                        size='sm' 
                        variant='solid' 
                        icon={<HiDownload />}
                        onClick={handleDownloadAllData}
                    >
                        Download Data
                    </Button>
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
            <CommitteeTable searchTerm={searchTerm} />
        </AdaptableCard>
    );
};

export default Committee;