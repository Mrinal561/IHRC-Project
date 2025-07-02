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
    // const handleDownload = async (certificateId: number) => {
    //     try {
    //         // This will trigger the browser download
    //         const response = await httpClient.get(endpoints.compliance.downloadCertificate(certificateId));
    //         if(response){

    //             toast.push(
    //                 <Notification title="Success" type="success" closable>
    //                 Download started successfully
    //             </Notification>
    //         );
    //     }
            
    //         onDownloadSuccess();
    //     } catch (error) {
    //         console.error('Failed to download certificate:', error);
    //         toast.push(
    //             <Notification title="Error" type="error" closable>
    //                 Failed to download certificate
    //             </Notification>
    //         );
    //     }
    // };

    const handleDownload = async (certificateId: number) => {
        try {
            const response = await httpClient.get(
                endpoints.compliance.downloadCertificate(certificateId), 
                {
                    responseType: 'blob'
                }
            );
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `certificate.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
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