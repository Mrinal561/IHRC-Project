import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/shared';
import { Button, Tooltip, Notification } from '@/components/ui';
import { HiDownload } from 'react-icons/hi';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import useAuth from '@/utils/hooks/useAuth';
import { useAppSelector } from '@/store';

interface CommitteeMember {
    fullName: string;
    designation: string;
    email: string;
    mobile: string;
}

interface CommitteeData {
    id: string;
    uuid: string;
    company_id: number;
    company_name: string;
    committee_type: string;
    committee: CommitteeMember[];
    created_by: number;
    created_by_name: string;
    created_at: string;
    updated_at: string;
}

const CommitteeTable = () => {
    const [data, setData] = useState<CommitteeData[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const auth = useAuth();
    const userId = auth?.user?.id || 0;
    const currentFinancialYear = useAppSelector((state: any) => state.common?.currentFinancialYear || '');

    const fetchCommittees = async () => {
        setLoading(true);
        try {
            const response = await httpClient.get(endpoints.poshSetup.committeeList(), {
                params: {
                    financial_year: currentFinancialYear,
                    created_by: userId,
                    search: searchTerm
                }
            });

            const formattedData = response.data.data.map((committee: any) => ({
                ...committee,
                committee: Array.isArray(committee.committee) ? 
                    committee.committee : 
                    JSON.parse(committee.committee || '[]')
            }));

            setData(formattedData);
        } catch (error) {
            console.error('Failed to fetch committees:', error);
         
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (id: string) => {
        try {
            const response = await httpClient.get(
                endpoints.poshSetup.poshCommitteeIndividualDocumentDownload(id), 
                {
                    responseType: 'blob'
                }
            );
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `committee-policy-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Download error:', error);
          
        }
    };


    useEffect(() => {
        fetchCommittees();
    }, [searchTerm, currentFinancialYear]);
 
 
    const columns = [
        {
            header: 'Company',
            enableSorting: false,
            accessorKey: 'company_name',
            cell: ({ row }) => <div className="w-40 truncate">{row.original.company_name}</div>
        },
        {
            header: 'Committee Type',
            enableSorting: false,
            accessorKey: 'committee_type',
            cell: ({ row }) => <div className="w-40">{row.original.committee_type}</div>
        },
        {
            header: 'Member 1',
            enableSorting: false,
            cell: ({ row }) => (
                <div className="w-48">
                    {row.original.members[0] ? (
                        <>
                            <div className="font-medium">{row.original.members[0].fullName}</div>
                            <div className="text-xs text-gray-500">{row.original.members[0].designation}</div>
                        </>
                    ) : '-'}
                </div>
            )
        },
        {
            header: 'Member 2',
            enableSorting: false,
            cell: ({ row }) => (
                <div className="w-48">
                    {row.original.members[1] ? (
                        <>
                            <div className="font-medium">{row.original.members[1].fullName}</div>
                            <div className="text-xs text-gray-500">{row.original.members[1].designation}</div>
                        </>
                    ) : '-'}
                </div>
            )
        },
        {
            header: 'Member 3',
            enableSorting: false,
            cell: ({ row }) => (
                <div className="w-48">
                    {row.original.members[2] ? (
                        <>
                            <div className="font-medium">{row.original.members[2].fullName}</div>
                            <div className="text-xs text-gray-500">{row.original.members[2].designation}</div>
                        </>
                    ) : '-'}
                </div>
            )
        },
        {
            header: 'Member 4',
            enableSorting: false,
            cell: ({ row }) => (
                <div className="w-48">
                    {row.original.members[3] ? (
                        <>
                            <div className="font-medium">{row.original.members[3].fullName}</div>
                            <div className="text-xs text-gray-500">{row.original.members[3].designation}</div>
                        </>
                    ) : '-'}
                </div>
            )
        },
        {
            header: 'Additional Members',
            enableSorting: false,
            cell: ({ row }) => (
                <div className="w-40">
                    {row.original.members.length > 4 ? 
                        `${row.original.members.length - 4} more` : 
                        'None'}
                </div>
            )
        },
        {
            header: 'Created At',
            enableSorting: false,
            cell: ({ row }) => (
                <div className="w-40">
                    {new Date(row.original.created_at).toLocaleDateString()}
                </div>
            )
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
    ];
    return (
        <DataTable
            columns={columns}
            data={data}
            loading={loading}
            pagingData={{
                total: data.length,
                pageIndex: 1,
                pageSize: 10
            }}
            stickyHeader={true}
            stickyFirstColumn={true}
            stickyLastColumn={true}
        />
    );
};

export default CommitteeTable;