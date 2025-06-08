import React, { useMemo, useState, useEffect } from 'react';
import { Button, Dialog, Tooltip } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { MdEdit } from 'react-icons/md';
import { FiFile } from 'react-icons/fi';
import { DataTable } from '@/components/shared';
import { HiOutlineViewGrid } from 'react-icons/hi';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

interface ReturnTrackerData {
    id: string;
    act_name: string;
    return_name: string;
    state_name: string;
    branch_name: string;
    frequency: string;
    month: number;
    year: number;
    return_submission: string;
    not_applicable_reason: string;
    submission_date: string;
    delay_reason: string;
    return_copy: string;
}

interface ReturnTrackerTableProps {
    data: ReturnTrackerData[];
    loading: boolean;
    pagination: {
        page: number;
        limit: number;
        totalPages: number;
        totalResults: number;
    };
    onPageChange: (page: number, pageSize: number) => void;
}


const ReturnTrackerTable = ({
    data: returns,
    loading,
    pagination,
    onPageChange
}: ReturnTrackerTableProps) => {
    const navigate = useNavigate();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    // const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
    });
    // const [returns, setReturns] = useState<ReturnTrackerData[]>([]);

    // useEffect(() => {
    //     fetchReturns();
    // }, [tableData.pageIndex, tableData.pageSize]); // Add dependencies for pagination

    // const fetchReturns = async () => {
    //     // setLoading(true);
    //     try {
    //         const response = await httpClient.get(endpoints.return.list(), {
    //             params: {
    //                 page: tableData.pageIndex,
    //                 limit: tableData.pageSize
    //             }
    //         });
            
    //         // Correctly access the data from the response
    //         // setReturns(response.data.data || []);
    //         setTableData(prev => ({
    //             ...prev,
    //             total: response.data.meta?.totalResults || 0
    //         }));
    //     } catch (error) {
    //         console.error('Error fetching returns:', error);
    //         // setReturns([]); // Ensure returns is always an array
    //     } finally {
    //         // setLoading(false);
    //     }
    // };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    const columns = useMemo(
        () => [
            {
                header: 'Act Name',
                enableSorting: false,
                accessorKey: 'act_name',
                cell: ({ row }) => (
                    <Tooltip title={row.original.act_name}>
                        <div className="w-52 truncate">{row.original.act_name}</div>
                    </Tooltip>
                ),
            },
            {
                header: 'Return Name',
                enableSorting: false,
                accessorKey: 'return_name',
                cell: ({ row }) => (
                    <Tooltip title={row.original.return_name}>
                        <div className="w-52 truncate">{row.original.return_name}</div>
                    </Tooltip>
                ),
            },
            {
                header: 'State',
                enableSorting: false,
                accessorKey: 'state_name',
                cell: ({ row }) => <div className="w-40 truncate">{row.original.state_name}</div>,
            },
            {
                header: 'Branch',
                enableSorting: false,
                accessorKey: 'branch_name',
                cell: ({ row }) => <div className="w-40 truncate">{row.original.branch_name}</div>,
            },
            {
                header: 'Frequency',
                enableSorting: false,
                accessorKey: 'frequency',
                cell: ({ row }) => (
                    <div className="w-40 truncate capitalize">{row.original.frequency}</div>
                ),
            },
            {
                header: 'Month',
                enableSorting: false,
                accessorKey: 'month',
                cell: ({ row }) => {
                    const monthNames = [
                        'January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'
                    ];
                    return <div className="w-40 truncate">{monthNames[row.original.month - 1] || '-'}</div>;
                },
            },
            {
                header: 'Year',
                enableSorting: false,
                accessorKey: 'year',
                cell: ({ row }) => <div className="w-40 truncate">{row.original.year}</div>,
            },
            {
                header: 'Submission Status',
                enableSorting: false,
                accessorKey: 'return_submission',
                cell: ({ row }) => (
                    <div className="w-40 truncate capitalize">
                        {row.original.return_submission || '-'}
                    </div>
                ),
            },
            {
                header: 'NA Reason',
                enableSorting: false,
                accessorKey: 'not_applicable_reason',
                cell: ({ row }) => (
                    <div className="w-40 truncate">{row.original.not_applicable_reason || '-'}</div>
                ),
            },
            {
                header: 'Submission Date',
                enableSorting: false,
                accessorKey: 'submission_date',
                cell: ({ row }) => (
                    <div className="w-40 truncate">{formatDate(row.original.submission_date)}</div>
                ),
            },
            {
                header: 'Delay Reason',
                enableSorting: false,
                accessorKey: 'delay_reason',
                cell: ({ row }) => (
                    <div className="w-40 truncate">{row.original.delay_reason || '-'}</div>
                ),
            },
            {
                header: 'Return Document',
                enableSorting: false,
                accessorKey: 'return_copy',
                cell: ({ row }) => (
                    <div className="w-40 flex items-center justify-center">
                        {row.original.return_copy ? (
                            <a 
                                href={row.original.return_copy} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                <FiFile className="w-5 h-5" />
                            </a>
                        ) : (
                            <span className="text-gray-400">
                                <FiFile className="w-5 h-5" />
                            </span>
                        )}
                    </div>
                ),
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Tooltip title="Edit">
                            <Button
                                size="sm"
                                onClick={() => navigate('/edit-return-tracker', {
                                    state: { returnTrackerId: row.original.id },
                                })}
                                icon={<MdEdit />}
                                className="text-blue-500"
                            />
                        </Tooltip>
                    </div>
                ),
            },
        ],
        [navigate]
    );

     const handlePaginationChange = (pageIndex: number, pageSize: number) => {
        onPageChange(pageIndex, pageSize);
    };

    return (
        <div className="relative">
            {!loading && returns.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
                    <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
                    <p className="text-center">No Data Available</p>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={returns}
                    loading={loading}
                    skeletonAvatarColumns={[0]}
                    skeletonAvatarProps={{ className: 'rounded-md' }}
                    pagingData={{
                        total: tableData.total,
                        pageIndex: tableData.pageIndex,
                        pageSize: tableData.pageSize,
                    }}
                    onPaginationChange={handlePaginationChange}
                    stickyHeader={true}
                    stickyFirstColumn={true}
                    stickyLastColumn={true}
                />
            )}

            <Dialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                shouldCloseOnOverlayClick={false}
            >
                <h5 className="mb-4">Confirm Deletion</h5>
                <p>Are you sure you want to delete this Return Setup?</p>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={() => setDeleteDialogOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={undefined} loading={loading}>
                        Confirm
                    </Button>
                </div>
            </Dialog>
        </div>
    );
};

export default ReturnTrackerTable;