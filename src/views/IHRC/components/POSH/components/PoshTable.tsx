import React from 'react';
import DataTable from '@/components/shared/DataTable';
import { Button, Tooltip } from '@/components/ui';
import { HiDownload } from 'react-icons/hi';

const PoshTable = ({ loading, onDownload }) => {
    // Dummy data with 5 entries
    const dummyData = [
        {
            id: '1',
            companyGroup: 'IHRC',
            company: 'ABC Corporation',
            branch: 'Mumbai Branch',
            complaintsReceived: 5,
            complaintsDisposed: 4,
            pendingCases: 1,
            workshops: 3,
            actionTaken: 'Internal committee formed, awareness sessions conducted',
            returnLevel: 'Branch Level'
        },
        {
            id: '2',
            companyGroup: 'IHRC',
            company: 'XYZ Industries',
            branch: 'Delhi Branch',
            complaintsReceived: 2,
            complaintsDisposed: 2,
            pendingCases: 0,
            workshops: 4,
            actionTaken: 'Complainant compensated, perpetrator terminated',
            returnLevel: 'Branch Level'
        },
        {
            id: '3',
            companyGroup: 'IHRC',
            company: 'Global Solutions',
            branch: 'Bangalore Branch',
            complaintsReceived: 0,
            complaintsDisposed: 0,
            pendingCases: 0,
            workshops: 2,
            actionTaken: 'Regular awareness programs conducted',
            returnLevel: 'District Level'
        },
        {
            id: '4',
            companyGroup: 'IHRC',
            company: 'Tech Innovators',
            branch: 'Hyderabad Branch',
            complaintsReceived: 3,
            complaintsDisposed: 1,
            pendingCases: 2,
            workshops: 5,
            actionTaken: 'Cases under investigation, counseling provided',
            returnLevel: 'Branch Level'
        },
        {
            id: '5',
            companyGroup: 'IHRC',
            company: 'Future Enterprises',
            branch: 'Chennai Branch',
            complaintsReceived: 1,
            complaintsDisposed: 1,
            pendingCases: 0,
            workshops: 3,
            actionTaken: 'Mutual settlement reached',
            returnLevel: 'District Level'
        }
    ];

    const columns = [
       
        {
            header: 'Company',
            enableSorting: false,

            accessorKey: 'company',
            cell: ({ row }) => <div className="w-40 truncate">{row.original.company}</div>
        },
        {
            header: 'Branch',
            enableSorting: false,

            accessorKey: 'branch',
            cell: ({ row }) => <div className="w-40 truncate">{row.original.branch}</div>
        },
        {
            header: 'Complaints Received',
            enableSorting: false,

            accessorKey: 'complaintsReceived',
            cell: ({ row }) => <div className="text-center">{row.original.complaintsReceived}</div>
        },
        {
            header: 'Complaints Disposed',
            enableSorting: false,

            accessorKey: 'complaintsDisposed',
            cell: ({ row }) => <div className="text-center">{row.original.complaintsDisposed}</div>
        },
        {
            header: 'Pending Cases',
            enableSorting: false,

            accessorKey: 'pendingCases',
            cell: ({ row }) => <div className="text-center">{row.original.pendingCases}</div>
        },
        {
            header: 'Workshops',
            enableSorting: false,

            accessorKey: 'workshops',
            cell: ({ row }) => <div className="text-center">{row.original.workshops}</div>
        },
        {
            header: 'Return Level',
            enableSorting: false,

            accessorKey: 'returnLevel',
            cell: ({ row }) => <div className="w-40 truncate">{row.original.returnLevel}</div>
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => (
                <Tooltip title="Download Report">
                    <Button
                        size="sm"
                        icon={<HiDownload />}
                        onClick={() => onDownload(row.original.id)}
                    />
                </Tooltip>
            )
        }
    ];

    return (
        <div className="relative">
            <DataTable
                columns={columns}
                data={dummyData}
                loading={loading}
                pagingData={{
                    total: dummyData.length,
                    pageIndex: 1,
                    pageSize: 10
                }}
                stickyHeader={true}
                    stickyFirstColumn={true}
                    stickyLastColumn={true}
            />
        </div>
    );
};

export default PoshTable;