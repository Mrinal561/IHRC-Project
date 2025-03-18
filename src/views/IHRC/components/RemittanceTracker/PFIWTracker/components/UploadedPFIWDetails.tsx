
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Tooltip } from '@/components/ui';
import { HiArrowLeft } from 'react-icons/hi';
import DataTable, { ColumnDef } from '@/components/shared/DataTable';
import { useNavigate } from 'react-router-dom';
import ConfigDropdown from './ConfigDropdown';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import dayjs from 'dayjs';
import { FiFile } from 'react-icons/fi';
import store from '@/store';

const documentPath = "../store/AllMappedCompliancesDetails.xls";

// Updated interface to match API response
interface PfiwChallanData {
  id: number;
  PfSetup: {
    pf_code: string;
    CompanyGroup: {
      name: string;
    };
    Company: {
      name: string;
    };
    Location: {
      name: string;
    };
  };
  payroll_month: string;
  payment_due_date: string;
  payment_date: string;
  delay_in_days: number;
  delay_reason: string;
  challan_document: string;
  status: string;
  UploadBy: {
    name: string;
    last_name: string;
  };
}

interface UploadedPFIWDetailsProps {
  onBack: () => void;
}

const UploadedPFIWDetails: React.FC<UploadedPFIWDetailsProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [data, setData] = useState<PfiwChallanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  });
  const {login} = store.getState();
const params: any = {
  'group_id[]': login.user.user?.group_id,
  'company_id[]': login.user.user?.company_id,
};

  const fetchPFIWTrackerData = useCallback(async  (page: number, pageSize: number) => {
    try {
      setLoading(true);
      const res = await httpClient.get(endpoints.pfiwtracker.pfiwGetAll(), {
        params: {
          page,
          page_size: pageSize,
          'group_id[]': login.user.user?.group_id,
          'company_id[]': login.user.user?.company_id,
        },
      });
      setData(res.data.data);
      setPagination((prev) => ({
        ...prev,
        total: res.data.paginate_data.totalResults,
      }));
    } catch (error) {
      console.error('Error fetching PFIW tracker data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPFIWTrackerData(pagination.pageIndex, pagination.pageSize);
  }, [fetchPFIWTrackerData,pagination.pageIndex, pagination.pageSize]);

  const handlePaginationChange = (page: number) => {
    setPagination((prev) => ({ ...prev, pageIndex: page }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: newPageSize,
      pageIndex: 1,
    }));
  };

  const columns: ColumnDef<PfiwChallanData>[] = useMemo(
    () => [
      {
        header: 'Company',
        enableSorting: false,
        accessorKey: 'PfSetup.Company.name',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'PF Code',
        enableSorting: false,
        accessorKey: 'PfSetup.pf_code',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Location',
        enableSorting: false,
        accessorKey: 'PfSetup.Location.name',
        cell: (props) => <div className="w-32 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Month',
        enableSorting: false,
        accessorKey: 'payroll_month',
        cell: (props) => {
          const date = new Date(props.getValue() as string);
          return (
            <div className="w-28 truncate">
            {date.toLocaleString('default', { month: 'long' })}
            </div>
          );
        }
      },  
      {
        header: 'Due Date',
        enableSorting: false,
        accessorKey: 'return_due_date',
        cell: (props) => <div className="w-28 truncate">{dayjs(props.getValue() as string).format('DD-MM-YYYY')}</div>,
      },
      {
        header: 'Date of Payment',
        enableSorting: false,
        accessorKey: 'submit_date',
        cell: (props) => <div className="w-40 truncate">{dayjs(props.getValue() as string).format('DD-MM-YYYY')}</div>,
      },
      {
        header: 'Delay in Days',
        enableSorting: false,
        accessorKey: 'delay_in_days',
        cell: (props) => <div className="w-28 truncate">{props.getValue() ? `${props.getValue()}` : '-'}</div>,
      },
      {
        header: 'Delay Reason',
        enableSorting: false,
        accessorKey: 'delay_reason',
        cell: (props) => {
          const value = props.getValue() as string;
          return (
            <Tooltip title={value}>
              <div className="w-40 truncate">{value || '-'}</div>
            </Tooltip>
          );
        }
      },
      {
  header: 'Challan',
  enableSorting: false,
  accessorKey: 'challan_document',
  cell: (props) => {
    const challanDocument = props.getValue() as string | null;
    
    const handleChallanDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (challanDocument) {
        const fullPath = `${import.meta.env.VITE_API_GATEWAY}/${challanDocument}`;
        window.open(fullPath, '_blank');
      }
    };

    return (
      <div className="w-40 flex items-center">
        {challanDocument ? (
          <a 
            href="#" 
            onClick={handleChallanDownload} 
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FiFile className="w-5 h-5" />
             {/* <span className="truncate">View File</span> */}
          </a>
        ) : (
          '--'
        )}
      </div>
    );
  },
},
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (props) => <div className="w-28 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Uploaded By',
        accessorKey: 'UploadBy.name',
        cell: (props) => (
          <div className="w-40 truncate">
            {`${props.row.original.UploadBy?.name}`}
          </div>
        ),
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <ConfigDropdown 
            companyName={row.original.PfSetup.Company.name} 
            companyGroupName={row.original.PfSetup.CompanyGroup.name} 
            trackerId={row.original.id}  
            onRefresh={fetchPFIWTrackerData}
          />
        ),
      },
    ],
    []
  );

  const backFunction = () => {
    navigate('/pfiw-tracker');
  };

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    fetch(documentPath)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'AllMappedCompliancesDetails.xls';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => console.error('Download failed'));
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-8">
        <Button
          variant="plain"
          size="sm"
          icon={<HiArrowLeft />}
          onClick={backFunction}
          className="mr-4"
        >
        </Button>
        <h2 className="text-2xl font-bold">Uploaded PF IW Tracker Details</h2>
      </div>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        skeletonAvatarColumns={[0]}
        skeletonAvatarProps={{ className: 'rounded-md' }}
        stickyHeader={true}
        stickyFirstColumn={true}
        stickyLastColumn={true}
        pagingData={{
          total: pagination.total,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        }}
        onPaginationChange={handlePaginationChange}
        onSelectChange={handlePageSizeChange}
      />
    </div>
  );
};

export default UploadedPFIWDetails;