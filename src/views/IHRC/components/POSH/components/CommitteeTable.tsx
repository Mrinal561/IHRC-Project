import React from 'react';
import { DataTable } from '@/components/shared';
import { Button, Tooltip } from '@/components/ui';
import { HiDownload } from 'react-icons/hi';

interface CommitteeMember {
    name: string;
    designation: string;
    email: string;
    mobile: string;
}

interface CommitteeData {
    id: string;
    company: string;
    committeeType: string;
    members: CommitteeMember[];
    createdAt: string;
}

const CommitteeTable = () => {
    // Dummy data with members
    const data: CommitteeData[] = [
        {
            id: '1',
            company: 'ABC Corp',
            committeeType: 'State Wise',
            members: [
                { name: 'John Doe', designation: 'Chairperson', email: 'john@abc.com', mobile: '9876543210' },
                { name: 'Jane Smith', designation: 'Member', email: 'jane@abc.com', mobile: '9876543211' },
                { name: 'Robert Johnson', designation: 'Member', email: 'robert@abc.com', mobile: '9876543212' },
                { name: 'Emily Davis', designation: 'Member', email: 'emily@abc.com', mobile: '9876543213' }
            ],
            createdAt: '2023-05-15'
        },
        {
            id: '2',
            company: 'XYZ Ltd',
            committeeType: 'Zone',
            members: [
                { name: 'Michael Brown', designation: 'Chairperson', email: 'michael@xyz.com', mobile: '9876543220' },
                { name: 'Sarah Wilson', designation: 'Member', email: 'sarah@xyz.com', mobile: '9876543221' },
                { name: 'David Taylor', designation: 'Member', email: 'david@xyz.com', mobile: '9876543222' },
                { name: 'Lisa Anderson', designation: 'Member', email: 'lisa@xyz.com', mobile: '9876543223' },
                { name: 'James Martinez', designation: 'Member', email: 'james@xyz.com', mobile: '9876543224' }
            ],
            createdAt: '2023-06-20'
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
            header: 'Committee Type',
            enableSorting: false,

            accessorKey: 'committeeType',
            cell: ({ row }) => <div className="w-40">{row.original.committeeType}</div>
        },
        {
            header: 'Member 1',
            enableSorting: false,

            cell: ({ row }) => (
                <div className="w-48">
                    {row.original.members[0] ? (
                        <>
                            <div className="font-medium">{row.original.members[0].name}</div>
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
                            <div className="font-medium">{row.original.members[1].name}</div>
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
                            <div className="font-medium">{row.original.members[2].name}</div>
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
                            <div className="font-medium">{row.original.members[3].name}</div>
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

            accessorKey: 'createdAt',
            cell: ({ row }) => (
                <div className="w-40">
                    {new Date(row.original.createdAt).toLocaleDateString()}
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
                        onClick={() => console.log('Download', row.original.id)}
                    />
                </Tooltip>
            )
        }
    ];

    return (
        <DataTable
            columns={columns}
            data={data}
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