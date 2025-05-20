import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui';
import { HiDownload, HiPlusCircle } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import ReturnTrackerFilter from './ReturnTrackerFilter';
import ReturnTrackerTable from './ReturnTrackerTable';
import ReturnTrackerBulk from './ReturnTrackerBulk';
import { useAppSelector } from '@/store';
import useAuth from '@/utils/hooks/useAuth';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

const ReturnTrackerTool = () => {
    const auth = useAuth();
    const userId = auth?.user?.id || 0;
    const navigate = useNavigate();
    const currentFinancialYear = useAppSelector((state: any) => state.common?.currentFinancialYear || '');
    
    const [filters, setFilters] = useState({
        company_id: '',
        state_id: '',
        branch_id: '',
        page: 1,
        page_size: 10,
        sort: 'desc',
        sort_by: 'id'
    });

    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 0
    });

    const fetchReturns = async () => {
        setLoading(true);
        try {
            const response = await httpClient.get(endpoints.return.list(), {
                params: {
                    ...filters,
                    created_by: userId,
                    financial_year: currentFinancialYear
                }
            });

            setTableData(response.data.data);
            setPagination(response.data.paginate_data);
        } catch (error) {
            console.error('Failed to fetch returns:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReturns();
    }, [filters]);

    const handleFilterChange = (newFilters: any) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: 1 // Reset to first page when filters change
        }));
    };

    const handlePageChange = (newPage: number) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const handleDownloadAllData = async () => {
        try {
            const response = await httpClient.get(endpoints.return.downloadData(), {
                params: {
                    ...filters,
                    financial_year: currentFinancialYear,
                    created_by: userId
                },
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `return-data-export.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    return (
        <div className='w-full'>
            <div className='flex gap-4 items-center mb-4 w-full'>
                <ReturnTrackerFilter onFilterChange={handleFilterChange} />
                <Button  
                    variant="solid" 
                    size="sm" 
                    icon={<HiDownload />}
                    onClick={handleDownloadAllData}
                >
                    Download Return Data
                </Button>
                <div>
                    <ReturnTrackerBulk onUploadSuccess={fetchReturns} />
                </div>
                <Button
                    variant="solid"
                    size="sm"
                    icon={<HiPlusCircle />}
                    onClick={() => navigate('/add-return-tracker')}
                >
                    Add Return
                </Button>
            </div>

            <div className="mt-8">
                <ReturnTrackerTable 
                    data={tableData} 
                    loading={loading}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default ReturnTrackerTool;