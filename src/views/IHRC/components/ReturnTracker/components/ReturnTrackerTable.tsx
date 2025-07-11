import React, { useMemo, useState, useEffect } from 'react';
import { Button, Dialog, toast, Tooltip, Notification } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { MdEdit } from 'react-icons/md';
import { FiFile } from 'react-icons/fi';
import { DataTable } from '@/components/shared';
import { HiOutlineViewGrid } from 'react-icons/hi';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

// Define a unified interface that matches your API response
interface ReturnTrackerData {
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
}

// Update your props interface
interface ReturnTrackerTableProps {
    data: ReturnTrackerData[];
    loading: boolean;
    pagination: {
        total: number;
        pageIndex: number;
        pageSize: number;
    };
    onPaginationChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}

const ReturnTrackerTable = ({
    data: returns,
    loading,
    pagination,
    onPaginationChange,
    onPageSizeChange
}: ReturnTrackerTableProps) => {
    const navigate = useNavigate();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    // const [loading, setLoading] = useState(false);
        const [downloading, setDownloading] = useState<string | null>(null);
            const [downloadingId, setDownloadingId] = useState<string | null>(null);


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


    const handleDownloadDocument = async (returnId: string) => {
    try {
        setDownloadingId(returnId);
        
        const response = await httpClient.get(
            endpoints.return.downloadDocument(returnId),
            { 
                responseType: 'blob',
                // Add this to ensure proper headers are received
                headers: {
                    'Accept': 'application/pdf'
                }
            }
        );

        // Extract filename from Content-Disposition header
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'document.pdf'; // Default fallback
        
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?(.+\.pdf)"?/i);
            if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1].replace(/['"]/g, '');
            }
        }

        // Create blob with explicit PDF type
        const blob = new Blob([response.data], { type: 'application/pdf' });
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
        }, 100);

        toast.push(
            <Notification title="Success" type="success" duration={2500}>
                Download started successfully
            </Notification>
        );
    } catch (error) {
        console.error('Error downloading document:', error);
        toast.push(
            <Notification title="Error" type="danger" duration={2500}>
                Failed to download document
            </Notification>
        );
    } finally {
        setDownloadingId(null);
    }
};



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
                cell: ({ row }) => <div className="w-40 truncate">{row.original.state?.name || '--'}</div>,
            },
            {
                header: 'District',
                enableSorting: false,
                accessorKey: 'district',
                cell: ({ row }) => (
                    <div className="w-40 truncate">
                        {row.original.district?.name || '--'}
                    </div>
                ),
            },
            {
                header: 'Location',
                enableSorting: false,
                accessorKey: 'location',
                cell: ({ row }) => (
                    <div className="w-40 truncate">
                        {row.original.location?.name || '--'}
                    </div>
                ),
            },
            {
                header: 'Branch',
                enableSorting: false,
                accessorKey: 'branch_name',
                cell: ({ row }) => <div className="w-40 truncate">{row.original.branch.name}</div>,
            },
            {
            header: 'Frequency',
            enableSorting: false,
            accessorKey: 'frequency',
            cell: ({ row }) => {
                const formatFrequency = (frequency: string) => {
                    switch (frequency) {
                        case 'monthly':
                            return 'Monthly';
                        case 'yearly':
                            return 'Yearly';
                        case 'half_yearly':
                            return 'Half Yearly';
                        case 'quarterly':
                            return 'Quarterly';
                        case 'bi_annual':
                            return 'Binneial';
                        default:
                            return frequency;
                    }
                };
                
                return (
                    <div className="w-40 truncate">
                        {formatFrequency(row.original.frequency)}
                    </div>
                );
            },
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
            cell: ({ row }) => {
                const formatStatus = (status: string) => {
                    switch (status) {
                        case 'applicable':
                            return 'Applicable';
                        case 'not_applicable':
                            return 'Not Applicable';
                        default:
                            return status;
                    }
                };
                
                return (
                    <div className="w-40 truncate">
                        {formatStatus(row.original.return_submission) || '-'}
                    </div>
                );
            },
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
                            <Button
                                size="sm"
                                variant="plain"
                                icon={<FiFile className="w-5 h-5 text-blue-600 hover:text-blue-800 transition-colors" />}
                                onClick={() => handleDownloadDocument(row.original.id)}
                                loading={downloadingId === row.original.id}
                                disabled={downloadingId === row.original.id}
                                title="Download Document"
                            />
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
        [navigate, downloading]
    );

    // In ReturnTrackerTable.tsx
// const handlePaginationChange = (page: number) => {
//     onPageChange(page, tableData.pageSize); // Keep using the current pageSize
// };

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
                            total: pagination.total,
                            pageIndex: pagination.pageIndex,
                            pageSize: pagination.pageSize,
                        }}
                        onPaginationChange={onPaginationChange}
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