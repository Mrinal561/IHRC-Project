import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui';
import { HiDownload, HiPlusCircle } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import RegisterTrackerFilter from './RegisterTrackerFilter';
import RegisterTrackerTable from './RegisterTrackerTable';
import RegisterUploadModal from './RegisterUploadModal';
import { useAppSelector } from '@/store';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

interface RegisterItem {
    id: number;
    uuid: string;
    company_id: number;
    company_name: string;
    year: number;
    description?: string;
    orignal_zip_path: string;
    processed_zip_path?: string;
    status: 'pending' | 'processed' | 'completed';
    orignal_uploaded_at: Date;
    processed_uploaded_at?: Date;
    processed_by?: {
        id: number;
        name: string;
        email: string;
    };
    has_original_zip: boolean;
    has_processed_zip: boolean;
    created_at: Date;
    updated_at: Date;
}

interface SelectOption {
  value: string; // Changed to string only since IDs are typically strings in APIs
  label: string;
}

const RegisterTrackerTool = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        company_id: '',
        year: '',
        search: '',
        page: 1,
        page_size: 10,
        sort: 'desc',
        sort_by: 'created_at'
    });

    const [tableData, setTableData] = useState<RegisterItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
    });
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [availableYears, setAvailableYears] = useState<number[]>([]);
    const [availableCompanies, setAvailableCompanies] = useState<{id: number, name: string}[]>([]);
    

    const fetchRegisters = async () => {
        setLoading(true);
        try {
            const params: any = {
                page: filters.page,
                page_size: filters.page_size,
                sort: filters.sort,
                sort_by: filters.sort_by
            };

            if (filters.company_id) params.company_id = filters.company_id;
            if (filters.year) params.year = filters.year;
            if (filters.search) params.search = filters.search;

            const response = await httpClient.get(endpoints.registerNew.getAll(), { params });
            
            setTableData(response.data.data as RegisterItem[]);
            setPagination({
                total: response.data.meta?.total_records || 0,
                pageIndex: response.data.meta?.current_page || 1,
                pageSize: response.data.meta?.page_size || 10,
            });
        } catch (error) {
            console.error('Failed to fetch registers:', error);
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


    useEffect(() => {
        const loadOptions = async () => {
            try {
                // Load companies
                const companiesRes = await httpClient.get(endpoints.company.getAll());
                setAvailableCompanies(companiesRes.data.data.map((c: any) => ({
                    value: String(c.id), // Ensure value is string
                    label: c.name
                })));

            } catch (error) {
                console.error('Failed to load filter options:', error);
            }
        };

        loadOptions();
    }, []);



    useEffect(() => {
        fetchRegisters();
    }, [filters]);

   useEffect(() => {
    // Generate years locally
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 2021; year--) {
        years.push(year);
    }
    setAvailableYears(years);
    
}, []);


    const handleFilterChange = (newFilters: any) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: 1
        }));
    };

    // const handleDownloadAllData = async () => {
    //     try {
    //         const response = await httpClient.get(endpoints.registerNew.downloadData(), {
    //             responseType: 'blob'
    //         });
            
    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute('download', `register-data-export.xlsx`);
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //         window.URL.revokeObjectURL(url);
    //     } catch (error) {
    //         console.error('Download failed:', error);
    //     }
    // };

    const handleUploadSuccess = () => {
        setUploadModalOpen(false);
        fetchRegisters();
    };

    return (
        <div className='w-full'>
            <div className='flex gap-4 items-center mb-4 w-full'>
                <RegisterTrackerFilter 
                    onFilterChange={handleFilterChange}
                    availableYears={availableYears}
                    availableCompanies={availableCompanies}
                />
                {/* <Button  
                    variant="solid" 
                    size="sm" 
                    icon={<HiDownload />}
                    onClick={handleDownloadAllData}
                >
                    Download Register Data
                </Button> */}
                <Button
                    variant="solid"
                    size="sm"
                    icon={<HiPlusCircle />}
                    onClick={() => setUploadModalOpen(true)}
                >
                    Upload Register
                </Button>
            </div>

            <div className="mt-8">
                <RegisterTrackerTable 
        data={tableData}
        loading={loading}
        pagination={pagination}
        onPaginationChange={(page) => {
            setFilters(prev => ({ ...prev, page }));
        }}
        onPageSizeChange={(pageSize) => {
            setFilters(prev => ({ ...prev, page_size: pageSize, page: 1 }));
        }}
        onDeleteSuccess={fetchRegisters}
        availableCompanies={availableCompanies}
        availableYears={availableYears}
    />
            </div>

            <RegisterUploadModal
                isOpen={uploadModalOpen}
                onClose={() => setUploadModalOpen(false)}
                onSuccess={handleUploadSuccess}
                availableCompanies={availableCompanies}
                availableYears={availableYears}
            />
        </div>
    );
};

export default RegisterTrackerTool;