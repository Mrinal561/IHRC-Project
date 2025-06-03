import React, { useState, useEffect, useMemo } from 'react';
import { DataTable } from '@/components/shared';
import { Button, Tooltip, Notification } from '@/components/ui';
import { HiDownload, HiOutlineViewGrid } from 'react-icons/hi';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import useAuth from '@/utils/hooks/useAuth';

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

interface PoshPolicyTableProps {
    refreshKey?: number;
}


const PoshPolicyTable = ({ refreshKey }: PoshPolicyTableProps) => {
    const [data, setData] = useState<PoshPolicy[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagingData, setPagingData] = useState({
        total: 0,
        page: 1,
        limit: 10
    });
    const auth = useAuth();
    const userId = auth?.user?.id || 0;

    const fetchPolicies = async (page = 1, limit = 10) => {
        setLoading(true);
        try {
            const response = await httpClient.get(endpoints.poshSetup.listPolicy(), {
                // params: {
                //     page,
                //     limit,
                // }
            });

            setData(response.data.data);
            setPagingData({
                total: response.data.meta.total,
                page: response.data.meta.page,
                limit: response.data.meta.limit
            });
        } catch (error) {
            console.error('Failed to fetch policies:', error);
          
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (id: number) => {
        try {
            const response = await httpClient.get(
                endpoints.poshSetup.downloadPolicy(id), 
                {
                    responseType: 'blob'
                }
            );
            
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
           
        }
    };

    useEffect(() => {
        fetchPolicies();
    }, [refreshKey]);

    const columns = useMemo(() => [
        {
            header: 'Company Name',
            enableSorting: false,
            accessorKey: 'company_name',
            cell: ({ row }) => <div className="font-medium">{row.original.company_name}</div>
        },
       
        {
            header: 'Status',
                        enableSorting: false,

            accessorKey: 'is_active',
            cell: ({ row }) => (
                <span className={`px-2 py-1 rounded-full text-xs ${row.original.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {row.original.is_active ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            header: 'Created By',
                                    enableSorting: false,

            accessorKey: 'created_by_name',
            cell: ({ row }) => row.original.created_by_name
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => (
                <Tooltip title="Download Policy">
                    <Button
                        size="sm"
                        icon={<HiDownload />}
                        onClick={() => handleDownload(row.original.id)}
                    />
                </Tooltip>
            )
        }
    ], []);

    return (
        <div className="relative">
            {data.length === 0 && !loading ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
                    <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
                    <p className="text-center">No POSH Policies Available</p>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={data}
                    loading={loading}
                    pagingData={pagingData}
                    onPaginationChange={({ pageIndex, pageSize }) => 
                        fetchPolicies(pageIndex + 1, pageSize)
                    }
                    stickyHeader={true}
                />
            )}
        </div>
    );
};

export default PoshPolicyTable;