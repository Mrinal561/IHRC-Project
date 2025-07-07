import React from 'react';
import DataTable from '@/components/shared/DataTable';
import { Button, Tooltip } from '@/components/ui';
import { HiDownload, HiOutlineViewGrid } from 'react-icons/hi';

interface PoshTableData {
    id: string;
    companyGroup: string;
    company: string;
    branch: string;
    complaintsReceived: number;
    complaintsDisposed: number;
    pendingCases: number;
    workshops: number;
    actionTaken: string;
    returnLevel: string;
}

interface PoshTableProps {
    data: PoshTableData[];
    loading: boolean;
    onDownload: (id: string) => void;
   pagination: {
        total: number;
        pageIndex: number;
        pageSize: number;
    };
    onPaginationChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}





const PoshTable = ({ data, loading, onDownload,pagination,
    onPaginationChange,
    onPageSizeChange }: PoshTableProps) => {

 



    const columns = [
        {
            header: 'Company',
            accessorKey: 'company',
            enableSorting: false,
            cell: ({ row }) => <div className="w-40 truncate">{row.original.company}</div>
        },
       {
    header: 'Branch',
    accessorKey: 'branch',
    enableSorting: false,
    cell: ({ row }) => {
        const capitalizeAllWords = (str: string) => {
            return str.split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join(' ');
        };
        
        return <div className="w-40 truncate">{capitalizeAllWords(row.original.branch)}</div>;
    }
},
        {
            header: 'Complaints Received',
            accessorKey: 'complaintsReceived',
            enableSorting: false,
            cell: ({ row }) => <div className="text-center">{row.original.complaintsReceived}</div>
        },
        {
            header: 'Complaints Disposed',
            accessorKey: 'complaintsDisposed',
            enableSorting: false,
            cell: ({ row }) => <div className="text-center">{row.original.complaintsDisposed}</div>
        },
        {
            header: 'Pending Cases',
            accessorKey: 'pendingCases',
            enableSorting: false,
            cell: ({ row }) => <div className="text-center">{row.original.pendingCases}</div>
        },
        {
            header: 'Workshops',
            accessorKey: 'workshops',
            enableSorting: false,
            cell: ({ row }) => <div className="text-center">{row.original.workshops}</div>
        },
        {
            header: 'Return Level',
            accessorKey: 'returnLevel',
            enableSorting: false,
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
                        onClick={() => onDownload(row.original.id)}  // Uncommented and added onClick handler
                    />
                </Tooltip>
            )
        }
    ];

    return (
        <div className='relative'>
{data.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
           <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
           <p className="text-center">No Data Available</p>
         </div>
): (

        <div className="relative">
            <DataTable
                columns={columns}
                data={data}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ className: 'rounded-md' }}
                loading={loading}
                 pagingData={{
                            total: pagination.total,
                            pageIndex: pagination.pageIndex,
                            pageSize: pagination.pageSize,
                        }}
                        onPaginationChange={onPaginationChange}
                        onSelectChange={onPageSizeChange}
                stickyHeader={true}
                stickyFirstColumn={true}
                stickyLastColumn={true}
                />
        </div>
)}
                </div>
    );
};

export default PoshTable;