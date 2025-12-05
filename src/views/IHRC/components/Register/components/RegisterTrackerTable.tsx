import React, { useMemo, useState } from 'react';
import { Button, Dialog, toast, Notification, Tooltip } from '@/components/ui';
import { FiFile, FiDownload, FiTrash2, FiTrash } from 'react-icons/fi';
import { DataTable } from '@/components/shared';
import { HiOutlineViewGrid } from 'react-icons/hi';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import RegisterEditModal from './RegisterEditModal';
import { MdEdit } from 'react-icons/md';

interface RegisterData {
    id: number;
    uuid: string;
    company_id: number;
    company_name: string;
    year: number;
    description?: string;
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
}

interface RegisterTrackerTableProps {
    data: RegisterData[];
    loading: boolean;
    pagination: {
        total: number;
        pageIndex: number;
        pageSize: number;
    };
    onPaginationChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    onDeleteSuccess: () => void;
    availableCompanies: {id: number, name: string}[];
    availableYears: number[];
}

const RegisterTrackerTable = ({
    data: registers,
    loading,
    pagination,
    onPaginationChange,
    onPageSizeChange,
    onDeleteSuccess,
    availableCompanies,
    availableYears
}: RegisterTrackerTableProps) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedRegister, setSelectedRegister] = useState<RegisterData | null>(null);
    const [downloading, setDownloading] = useState<string | null>(null);

    const formatDate = (dateString: Date | string) => {
        if (!dateString) return '--';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const handleDownload = async (id: number, type: 'original' | 'processed') => {
        try {
            setDownloading(`${id}-${type}`);
            const response = await httpClient.get(
                endpoints.registerNew.downloadFile(id, type),
                { 
                    responseType: 'blob'
                }
            );

            const contentDisposition = response.headers['content-disposition'];
            let filename = `register_${type}.zip`;
            
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+\.zip)"?/i);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1].replace(/['"]/g, '');
                }
            }

            const blob = new Blob([response.data], { type: 'application/zip' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            
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
            console.error('Error downloading file:', error);
            toast.push(
                <Notification title="Error" type="danger" duration={2500}>
                    Failed to download file
                </Notification>
            );
        } finally {
            setDownloading(null);
        }
    };

    const handleEdit = (register: RegisterData) => {
        setSelectedRegister(register);
        setEditModalOpen(true);
    };

    const handleEditSuccess = () => {
        setEditModalOpen(false);
        onDeleteSuccess(); // This will refresh the data
    };

    const handleDelete = async () => {
        if (!selectedRegister) return;
        
        try {
            await httpClient.delete(endpoints.registerNew.delete(selectedRegister.id));
            
            toast.push(
                <Notification title="Success" type="success" duration={2500}>
                    Register deleted successfully
                </Notification>
            );
            
            setDeleteDialogOpen(false);
            onDeleteSuccess();
        } catch (error) {
            console.error('Error deleting register:', error);
            toast.push(
                <Notification title="Error" type="danger" duration={2500}>
                    Failed to delete register
                </Notification>
            );
        }
    };

    const columns = useMemo(
        () => [
            {
                header: 'Company',
                enableSorting: false,
                accessorKey: 'company_name',
                cell: ({ row }) => (
                    <div className="w-40 truncate">{row.original.company_name}</div>
                ),
            },
            {
                header: 'Year',
                enableSorting: false,
                accessorKey: 'year',
                cell: ({ row }) => (
                    <div className="w-20">{row.original.year}</div>
                ),
            },
            // {
            //     header: 'Description',
            //     enableSorting: false,
            //     accessorKey: 'description',
            //     cell: ({ row }) => (
            //         <Tooltip title={row.original.description || 'No description'}>
            //             <div className="w-52 truncate">{row.original.description || '--'}</div>
            //         </Tooltip>
            //     ),
            // },
            {
                header: 'Status',
                enableSorting: false,
                accessorKey: 'status',
                cell: ({ row }) => {
                    const statusColors = {
                        pending: 'bg-yellow-100 text-yellow-800',
                        processed: 'bg-blue-100 text-blue-800',
                        completed: 'bg-green-100 text-green-800'
                    };
                    
                    return (
                        <span className={`px-4 py-2 rounded-xl text-[13px] font-bold ${statusColors[row.original.status]}`}>
                            {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
                        </span>
                    );
                },
            },
            {
                header: 'Uploaded Date',
                enableSorting: false,
                accessorKey: 'orignal_uploaded_at',
                cell: ({ row }) => (
                    <div className="w-32">{formatDate(row.original.orignal_uploaded_at)}</div>
                ),
            },
            {
                header: 'Completed Date',
                enableSorting: false,
                accessorKey: 'processed_uploaded_at',
                cell: ({ row }) => (
                    <div className="w-32">{row.original.processed_uploaded_at ? formatDate(row.original.processed_uploaded_at) : '--'}</div>
                ),
            },
            {
                header: 'Uploaded Document',
                enableSorting: false,
                accessorKey: 'has_original_zip',
                cell: ({ row }) => (
                    <div className="flex items-center justify-center">
                        {row.original.has_original_zip ? (
                            <Tooltip title="Download Original File">
                                <Button
                                    size="sm"
                                    variant="plain"
                                    icon={<FiFile className="w-5 h-5 text-blue-600 hover:text-blue-800" />}
                                    onClick={() => handleDownload(row.original.id, 'original')}
                                    loading={downloading === `${row.original.id}-original`}
                                    disabled={downloading === `${row.original.id}-original`}
                                />
                            </Tooltip>
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
                        {row.original.has_processed_zip && (
                            <Tooltip title="Download Processed File">
                                <Button
                                    size="sm"
                                    variant="plain"
                                    icon={<FiDownload className="w-5 h-5 text-green-600 hover:text-green-800" />}
                                    onClick={() => handleDownload(row.original.id, 'processed')}
                                    loading={downloading === `${row.original.id}-processed`}
                                    disabled={downloading === `${row.original.id}-processed`}
                                />
                            </Tooltip>
                        )}
                        
                        {row.original.status === 'pending' && (
                            <>
                                <Tooltip title="Edit">
                                    <Button
                                        size="sm"
                                        // variant="plain"
                                        icon={<MdEdit />}
                                        onClick={() => handleEdit(row.original)}
                                    />
                                </Tooltip>
                                
                                <Tooltip title="Delete">
                                    <Button
                                        size="sm"
                                        // variant="plain"
                                        icon={<FiTrash />}
                                        onClick={() => {
                                            setSelectedRegister(row.original);
                                            setDeleteDialogOpen(true);
                                        }}
                                        className="text-red-500"
                                    />
                                </Tooltip>
                            </>
                        )}
                    </div>
                ),
            },
        ],
        [downloading]
    );

    return (
        <div className="relative">
            {!loading && registers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
                    <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
                    <p className="text-center">No Register Data Available</p>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={registers}
                    loading={loading}
                    skeletonAvatarColumns={[0]}
                    skeletonAvatarProps={{ className: 'rounded-md' }}
                    pagingData={{
                        total: pagination.total,
                        pageIndex: pagination.pageIndex,
                        pageSize: pagination.pageSize,
                    }}
                    onPaginationChange={onPaginationChange}
                    onPageSizeChange={onPageSizeChange}
                    stickyHeader={true}
                    stickyFirstColumn={true}
                    stickyLastColumn={true}
                />
            )}

            <Dialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onRequestClose={() => setDeleteDialogOpen(false)}
                shouldCloseOnOverlayClick={false}
            >
                <h5 className="mb-4">Confirm Deletion</h5>
                <p>Are you sure you want to delete this register entry? This action cannot be undone.</p>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={() => setDeleteDialogOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant="solid" color="red" onClick={handleDelete}>
                        Confirm Delete
                    </Button>
                </div>
            </Dialog>

            <RegisterEditModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSuccess={handleEditSuccess}
                availableCompanies={availableCompanies}
                availableYears={availableYears}
                registerData={selectedRegister}
            />
        </div>
    );
};

export default RegisterTrackerTable;