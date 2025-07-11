import React, { useState, useEffect } from 'react';
import AdaptableCard from '@/components/shared/AdaptableCard';
import CustomChecklistTool from './components/CustomChecklistTool';
import CustomChecklistTable from './components/CustomChecklistTable';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { Notification, toast } from '@/components/ui';

const CustomChecklist = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
    });
    const [sort, setSort] = useState<{id: string; desc: boolean} | null>(null);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.pageIndex,
                limit: pagination.pageSize,
                sort: sort ? `${sort.id}:${sort.desc ? 'desc' : 'asc'}` : undefined,
                search: debouncedSearchQuery || undefined
            };

            const response = await httpClient.get(endpoints.compliance.listCustomChecklist(), { params });
            setData(response.data.data);
            setPagination(prev => ({
                ...prev,
                total: response.data.total
            }));
        } catch (error) {
            console.error('Error fetching custom checklists:', error);
            toast.push(
                <Notification title="Error" type="error">
                    Failed to load custom checklists
                </Notification>
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pagination.pageIndex, pagination.pageSize, sort, debouncedSearchQuery]);

    const handlePageChange = (page: number) => {
        setPagination(prev => ({
            ...prev,
            pageIndex: page
        }));
        fetchData();
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPagination(prev => ({
            ...prev,
            pageSize: newPageSize,
            pageIndex: 1, // Reset to first page when page size changes
        }));
    };

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
                <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold">Custom Checklist</h3>
                    <p className="text-gray-600">View your company's custom compliance</p>
                </div>
                <CustomChecklistTool 
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                     onRefresh={fetchData}
                />
            </div>
            <CustomChecklistTable 
                data={data}
                loading={loading}
                pagination={pagination}
                onPaginationChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                onSortChange={setSort}
            />
        </AdaptableCard>
    );
};

export default CustomChecklist;