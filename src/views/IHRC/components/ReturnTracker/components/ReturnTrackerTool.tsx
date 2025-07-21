import React, { useEffect, useMemo, useState } from 'react';
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



const FINANCIAL_YEAR_KEY = 'selectedFinancialYear'
const FINANCIAL_YEAR_CHANGE_EVENT = 'financialYearChanged';

interface ReturnTrackerItem {
    id: string;
    uuid: string;
    company_id: number;
    act_name: string;
    return_name: string;
    state_id: number | null;
    district_id: number | null;
    location_id: number | null;
    branch_id: number | null;
    frequency: string | null;
    year: number;
    month: number | null;
    return_submission: string;
    submission_date: string | null;
    delay_reason: string | null;
    return_copy: string | null;
    not_applicable_reason: string | null;
    is_delayed: boolean;
    state?: {
        id: number;
        name: string;
    };
    district?: {
        id: number;
        name: string;
        state_id: number;
    };
    location?: {
        id: number;
        name: string;
        district_id: number;
    };
    branch?: {
        id: number;
        name: string;
        location_id: number;
    };
    company: {
        id: number;
        name: string;
    };
    // These might be coming from your API response
    state_name?: string;
    branch_name?: string;
}


const ReturnTrackerTool = () => {
    const auth = useAuth();
    const userId = auth?.user?.id || 0;
    const navigate = useNavigate();
  const currentFinancialYear = useAppSelector((state: any) => state.common?.currentFinancialYear || '');
    
const financialYearParts = currentFinancialYear ? parseInt(currentFinancialYear.split('-')[0]) : new Date().getFullYear();
//   const baseYear = financialYearParts.length > 0 ? parseInt(financialYearParts[0]) : new Date().getFullYear();
  
// Extract the base year from currentFinancialYear (e.g., "2024-25" → 2024)
// Calculate baseYear whenever currentFinancialYear changes
const baseYear = useMemo(() => {
  return currentFinancialYear ? 
    parseInt(currentFinancialYear.split('-')[0], 10) : 
    new Date().getFullYear();
}, [currentFinancialYear]);

    const [filters, setFilters] = useState({
        company_id: '',
        state_id: '',
        branch_id: '',
        page: 1,
        page_size: 10,
        sort: 'desc',
        sort_by: 'id'
    });

       const [financialYear, setFinancialYear] = useState(sessionStorage.getItem(FINANCIAL_YEAR_KEY));
    
const [tableData, setTableData] = useState<ReturnTrackerItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
            total: 0,
            pageIndex: 1,
            pageSize: 10,
        });
    
        useEffect(() => {
          const handleFinancialYearChange = (event: CustomEvent) => {
            const newFinancialYear = event.detail;
            setFinancialYear(newFinancialYear);
            sessionStorage.setItem(FINANCIAL_YEAR_KEY, newFinancialYear);
          };
        
          window.addEventListener(
            FINANCIAL_YEAR_CHANGE_EVENT, 
            handleFinancialYearChange as EventListener
          );
        
          return () => {
            window.removeEventListener(
              FINANCIAL_YEAR_CHANGE_EVENT, 
              handleFinancialYearChange as EventListener
            );
          };
        }, []);


   // In your ReturnTrackerTool component
const fetchReturns = async () => {
    setLoading(true);
    try {
        const params: any = {
            page: filters.page,
            page_size: filters.page_size,
            year: financialYear ? parseInt(financialYear.split('-')[0]) : new Date().getFullYear()
        };

        // Only add filters if they have values
        if (filters.company_id) params.company_id = filters.company_id;
        if (filters.state_id) params.state_id = filters.state_id;
        if (filters.branch_id) params.branch_id = filters.branch_id;

        const response = await httpClient.get(endpoints.return.list(), { params });

        // Transform the API response to match DataTable expectations
setTableData(response.data.data as ReturnTrackerItem[]);
        setPagination({
            total: response.data.meta?.totalResults || 0,
            pageIndex: response.data.meta?.page || 1,
            pageSize: response.data.meta?.limit || 10,
        });
    } catch (error) {
        console.error('Failed to fetch returns:', error);
        setTableData([]);
        setPagination({
            total: 0,
            pageIndex: 1,
            pageSize: 10,
        });
    } finally {
        setLoading(false);
    }
};
  

    const handleFilterChange = (newFilters: any) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: 1 // Reset to first page when filters change
        }));
    };

    // In ReturnTrackerTool.tsx

const handlePaginationChange = (page: number) => {
        setPagination(prev => ({ ...prev, pageIndex: page }));
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPagination(prev => ({
            ...prev,
            pageSize: newPageSize,
            pageIndex: 1,
        }));
    };

      useEffect(() => {
            console.log('Fetching returns...', { filters, pagination });

        fetchReturns();
}, [filters, pagination.pageIndex, pagination.pageSize, financialYear, baseYear, userId]);

    const handleDownloadAllData = async () => {
        try {
            const params: any = {
                ...filters,
                financial_year: currentFinancialYear,
                created_by: userId
            };

            // Only include filters that have values
            if (!params.company_id) delete params.company_id;
            if (!params.state_id) delete params.state_id;
            if (!params.branch_id) delete params.branch_id;

            const response = await httpClient.get(endpoints.return.downloadData(), {
                params,
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
    onPaginationChange={(page) => {
        setFilters(prev => ({ ...prev, page }));
    }}
    onPageSizeChange={(pageSize) => {
        setFilters(prev => ({ ...prev, page_size: pageSize, page: 1 }));
    }}
                />
            </div>
        </div>
    );
};

export default ReturnTrackerTool;