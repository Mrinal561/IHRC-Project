import React, { useState, useEffect, useMemo } from 'react';
import { DataTable } from '@/components/shared';
import { Button, Tooltip, Notification } from '@/components/ui';
import { HiDownload, HiOutlineViewGrid } from 'react-icons/hi';
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
    zone_type?: string;
    state?: string;
    members: CommitteeMember[];
    total_members: number;
    created_by: number;
    created_by_name: string;
    created_at: string;
    updated_at: string;
}


const toTitleCase = (str: string) => {
  if (!str || str === '--') return str;
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};



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
                members: Array.isArray(committee.members) ? 
                    committee.members : 
                    JSON.parse(committee.members || '[]'),
                zone_type: committee.zone_type || '--',
                state: committee.state || '--'
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

    const renderMemberCell = (member: CommitteeMember | undefined) => {
        return (
            <div className="w-48">
                {member ? (
                    <>
                        <div className="font-medium">{member.fullName}</div>
                        <div className="text-xs text-gray-500">{member.designation}</div>
                    </>
                ) : (
                    <div className="text-gray-400">--</div>
                )}
            </div>
        );
    };

    // Calculate maximum members across all committees to determine dynamic columns
    const maxMembers = useMemo(() => {
        return data.reduce((max, committee) => 
            Math.max(max, committee.members.length), 4); // Start with minimum of 4
    }, [data]);

     const getColumns = () => {
        const baseColumns = [
            {
                header: 'Company',
                enableSorting: false,
                accessorKey: 'company_name',
                cell: ({ row }) => <div className="w-40 truncate">{toTitleCase(row.original.company_name)}</div>
            },
            {
                header: 'Committee Type',
                enableSorting: false,
                accessorKey: 'committee_type',
                cell: ({ row }) => <div className="w-40">{toTitleCase(row.original.committee_type)}</div>
            },
            {
                header: 'Zone Type',
                enableSorting: false,
                cell: ({ row }) => <div className="w-40">{toTitleCase(row.original.zone_type)}</div>
            },
            {
                header: 'State',
                enableSorting: false,
                cell: ({ row }) => <div className="w-40">{toTitleCase(row.original.state)}</div>
            },
            {
                header: 'Member 1',
                enableSorting: false,
                cell: ({ row }) => renderMemberCell(row.original.members[0])
            },
            {
                header: 'Member 2',
                enableSorting: false,
                cell: ({ row }) => renderMemberCell(row.original.members[1])
            },
            {
                header: 'Member 3',
                enableSorting: false,
                cell: ({ row }) => renderMemberCell(row.original.members[2])
            },
            {
                header: 'Member 4',
                enableSorting: false,
                cell: ({ row }) => renderMemberCell(row.original.members[3])
            }
        ];

        // Add dynamic columns for members beyond 4 if they exist
        const additionalMemberColumns = [];
        for (let i = 4; i < maxMembers; i++) {
            additionalMemberColumns.push({
                header: `Member ${i + 1}`,
                enableSorting: false,
                cell: ({ row }) => renderMemberCell(row.original.members[i])
            });
        }

        // Add actions column
        const actionColumn = {
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
        };

        return [...baseColumns, ...additionalMemberColumns, actionColumn];
    };

    const columns = useMemo(() => getColumns(), [data, maxMembers]);

    return (
        <div className="relative">
            {data.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
                    <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
                    <p className="text-center">No Data Available</p>
                </div>
            ) : (
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
            )}
        </div>
    );
};

export default CommitteeTable;