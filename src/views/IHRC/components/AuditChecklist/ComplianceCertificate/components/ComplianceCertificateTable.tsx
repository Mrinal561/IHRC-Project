import React from 'react';
import { DataTable } from '@/components/shared';
import { Button, toast, Notification } from '@/components/ui';
import { HiDownload } from 'react-icons/hi';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

interface ComplianceCertificateTableProps {
    data: any[];
    onDownloadSuccess: () => void;
}

const ComplianceCertificateTable: React.FC<ComplianceCertificateTableProps> = ({ data, onDownloadSuccess }) => {
    const handleDownload = async (certificateId: number) => {
        try {
            // This will trigger the browser download
            window.open(`${endpoints.compliance.downloadCertificate(certificateId)}`, '_blank');
            
            toast.push(
                <Notification title="Success" type="success" closable>
                    Download started successfully
                </Notification>
            );
            
            onDownloadSuccess();
        } catch (error) {
            console.error('Failed to download certificate:', error);
            toast.push(
                <Notification title="Error" type="error" closable>
                    Failed to download certificate
                </Notification>
            );
        }
    };

    const columns = [
        {
            header: 'Company',
            enableSorting: false,
            accessorKey: 'Company.name',
            cell: (row: any) => <div className="min-w-[150px]">{row.getValue()}</div>
        },
        {
            header: 'Branch',
            enableSorting: false,
            accessorKey: 'Branch.name',
            cell: (row: any) => <div className="min-w-[150px]">{row.getValue()}</div>
        },
        {
            header: 'Month/Year',
            enableSorting: false,
            accessorFn: (row: any) => `${row.month}/${row.year}`,
            cell: (row: any) => <div className="min-w-[100px]">{row.getValue()}</div>
        },
        {
            header: 'Generated On',
            enableSorting: false,
            accessorFn: (row: any) => new Date(row.created_at).toLocaleDateString(),
            cell: (row: any) => <div className="min-w-[100px]">{row.getValue()}</div>
        },
        {
            header: 'Actions',
            enableSorting: false,
            cell: (row: any) => (
                <Button
                    size="xs"
                    icon={<HiDownload />}
                    onClick={() => handleDownload(row.row.original.id)}
                >
                    Download
                </Button>
            )
        }
    ];

    return (
        <div className="relative">
            <DataTable
                columns={columns}
                data={data}
                pagingData={{
                    total: data.length,
                    pageIndex: 1,
                    pageSize: 10
                }}
            />
        </div>
    );
};

export default ComplianceCertificateTable;