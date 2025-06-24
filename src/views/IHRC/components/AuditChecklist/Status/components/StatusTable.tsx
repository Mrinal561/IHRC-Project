import React, { useMemo, useState } from 'react';
import { ColumnDef } from '@/components/shared/DataTable';
import DataTable from '@/components/shared/DataTable';
import { Button, Tooltip, Badge } from '@/components/ui';
import { RiCheckLine, RiCloseLine, RiEyeLine } from 'react-icons/ri';
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json';
import Lottie from 'lottie-react';
import { HiOutlineViewGrid } from 'react-icons/hi';
import StatusTableSearch from './StatusTableSearch';

interface StatusTableProps {
  data: any[];
  loading: boolean;
  selectedView: 'owner' | 'approver' | 'auditor';
  selectedStatus: 'pending' | 'approved' | 'rejected';
  onSearch: (term: string) => void;
  pagination: {
    total: number;
    pageIndex: number;
    pageSize: number;
  };
  onPaginationChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  canCreate: boolean;
}

const StatusTable: React.FC<StatusTableProps> = ({
  data,
  loading,
  selectedView,
  selectedStatus,
  onSearch,
  pagination,
  onPaginationChange,
  onPageSizeChange,
  canCreate,
}) => {

   const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const term = searchTerm.toLowerCase();
    return data.filter(item => 
      (item.uuid && item.uuid.toLowerCase().includes(term)) ||
      (item.compliance_header && item.compliance_header.toLowerCase().includes(term)) ||
      (item.legislation_act && item.legislation_act.toLowerCase().includes(term))
    );
  }, [data, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    onSearch(term); // This is for parent component if needed for API search
  };

  
  const columns: ColumnDef<any>[] = useMemo(() => [
    {
      header: 'Compliance ID',
      enableSorting: false,
      accessorKey: 'uuid',
      cell: (props) => (
        <div className="w-40">{props.getValue() as string}</div>
      ),
    },
    {
      header: 'Header',
      enableSorting: false,
      accessorKey: 'compliance_header',
      cell: (props) => (
        <Tooltip title={props.getValue() as string}>
          <div className="w-48 truncate">{props.getValue() as string}</div>
        </Tooltip>
      ),
    },
    {
      header: 'Legislation',
      enableSorting: false,
      accessorKey: 'legislation_act',
      cell: (props) => (
        <Tooltip title={props.getValue() as string}>
          <div className="w-48 truncate">{props.getValue() as string}</div>
        </Tooltip>
      ),
    },
    {
      header: 'Status',
      enableSorting: false,
      accessorKey: 'status',
      cell: ({ row }) => {
        const status = row.original.status;
        let badgeClass = '';
        let statusText = '';
        
        switch (status) {
          case 'pending':
            badgeClass = 'font-semibold text-yellow-500';
            statusText = 'Pending';
            break;
          case 'submitted':
            badgeClass = 'font-semibold text-blue-800';
            statusText = 'Submitted';
            break;
          case 'approved_by_approver':
            badgeClass = 'font-semibold text-green-800';
            statusText = 'Approved (Approver)';
            break;
          case 'rejected_by_approver':
            badgeClass = 'font-semibold text-red-800';
            statusText = 'Rejected (Approver)';
            break;
          case 'approved_by_auditor':
            badgeClass = 'font-semibold text-green-800';
            statusText = 'Approved (Auditor)';
            break;
          case 'rejected_by_auditor':
            badgeClass = 'font-semibold text-red-800';
            statusText = 'Rejected (Auditor)';
            break;
          default:
            badgeClass = 'bg-gray-100 text-gray-800';
            statusText = status;
        }
        
        return <div className={badgeClass}>{statusText}</div>;
      },
    },
    // {
    //   header: 'Actions',
    //   id: 'actions',
    //   cell: ({ row }) => {
    //     return (
    //       <div className="flex gap-2">
    //         <Tooltip title="View Details">
    //           <Button
    //             size="sm"
    //             onClick={() => {
    //               // Handle view details
    //             }}
    //             icon={<RiEyeLine />}
    //           />
    //         </Tooltip>
            
    //         {canCreate && selectedStatus === 'pending' && (
    //           <>
    //             <Tooltip title="Approve">
    //               <Button
    //                 size="sm"
    //                 onClick={() => {
    //                   // Handle approve
    //                 }}
    //                 icon={<RiCheckLine />}
    //               />
    //             </Tooltip>
    //             <Tooltip title="Reject">
    //               <Button
    //                 size="sm"
    //                 onClick={() => {
    //                   // Handle reject
    //                 }}
    //                 icon={<RiCloseLine />}
    //               />
    //             </Tooltip>
    //           </>
    //         )}
    //       </div>
    //     );
    //   },
    // },
  ], [selectedStatus, canCreate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500 rounded-xl">
        <div className="w-28 h-28">
          <Lottie animationData={loadingAnimation} loop className="w-24 h-24" />
        </div>
        <p className="text-lg font-semibold">Loading Data...</p>
      </div>
    );
  }

  return (
   <div className="relative">
      <div className="flex items-center justify-between my-8">
        <StatusTableSearch onSearch={handleSearch} />
      </div>
      
      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-56 text-gray-500 border rounded-xl">
          <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
          <p className="text-center">
            {searchTerm ? 'No matching records found' : 'No Data Available'}
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredData}
          skeletonAvatarColumns={[0]}
          skeletonAvatarProps={{ className: 'rounded-md' }}
          loading={loading}
          pagingData={{
            total: searchTerm ? filteredData.length : pagination.total,
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
          }}
          onPaginationChange={onPaginationChange}
          onSelectChange={onPageSizeChange}
          stickyHeader={true}
          stickyFirstColumn={true}
          stickyLastColumn={true}
        />
      )}
    </div>
  );
};

export default StatusTable;