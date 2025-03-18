
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Tooltip } from '@/components/ui';
import { HiArrowLeft } from 'react-icons/hi';
import { FiFile } from 'react-icons/fi';
import DataTable, { ColumnDef } from '@/components/shared/DataTable';
import { useNavigate } from 'react-router-dom';
import ConfigDropdown from './ConfigDropDown'
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import dayjs from 'dayjs';
import store from '@/store';

export interface LWFTrackerData {
  id: number;
  uuid: string;
  lwf_setup_id: number;
  period: string;
  salary_register_amt: number;
  total_paid_amt: number;
  difference_amt: number;
  difference_reason: string | null;
  payment_due_date: string;
  payment_date: string;
  delay_in_days: number | null;
  delay_reason: string | null;
  receipt_no: string;
  receipt_document: string | null;
  remark: string | null;
  upload_date: string;
  status: string;
  challan_type: string;
  uploaded_by: number;
  created_at: string;
  updated_at: string;
  UploadBy: {
    id: number;
    name: string;
    email: string;
    mobile: string | null;
  };
  LwfSetup: {
    register_number: string;
    CompanyGroup: {
      id: number;
      name: string;
    };
    Company: {
      id: number;
      name: string;
    };
    Location: {
      id: number;
      name: string;
    };
  };
}

interface UploadedLWFDetailsProps {
  onBack: () => void;
}

const UploadedLWFDetails: React.FC<UploadedLWFDetailsProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [data, setData] = useState<LWFTrackerData[]>([]);
  const [loading, setLoading] = useState(true);
  const {login} = store.getState();
  const [pagination, setPagination] = useState({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  });
const params: any = {
  'group_id[]': login.user.user?.group_id,
  'company_id[]': login.user.user?.company_id,
};

  const fetchLWFTrackerData = useCallback(async (page: number, pageSize: number)=> {
    try {
      setLoading(true);
      const res = await httpClient.get(endpoints.lwftracker.lwfGetAll(), {
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
      console.error('Error fetching LWF tracker data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLWFTrackerData(pagination.pageIndex, pagination.pageSize);
  }, [fetchLWFTrackerData,pagination.pageIndex, pagination.pageSize]);

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

  const columns: ColumnDef<LWFTrackerData>[] = useMemo(
    () => [
      {
        header: 'Company',
        enableSorting: false,
        accessorKey: 'LwfSetup.Company.name',
        cell: (props) => <div className="w-52 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Location',
        enableSorting: false,
        accessorKey: 'LwfSetup.Location.name',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Registration Number',
        enableSorting: false,
        accessorKey: 'LwfSetup.register_number',
        cell: (props) => <div className="w-52 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Period',
        enableSorting: false,
        accessorKey: 'period',
        cell: (props) => {
          const date = new Date(props.getValue() as string);
          return (
            <div className="w-28 truncate">
              {date.toLocaleString('default', { month: 'long' })}
            </div>
          );
        },
      },
      {
        header: 'Salary Register Amt',
        enableSorting: false,
        accessorKey: 'salary_register_amt',
        cell: (props) => <div className="w-52 truncate">
          ₹{(props.getValue() as number)?.toLocaleString() || '-'}
        </div>,
      },
      {
        header: 'Total Paid Amt',
        enableSorting: false,
        accessorKey: 'total_paid_amt',
        cell: (props) => <div className="w-52 truncate">
          ₹{(props.getValue() as number)?.toLocaleString() || '-'}
        </div>,
      },
      {
        header: 'Difference Amt',
        enableSorting: false,
        accessorKey: 'difference_amt',
        cell: (props) => <div className="w-52 truncate">
          ₹{(props.getValue() as number)?.toLocaleString() || '-'}
        </div>,
      },
      {
        header: 'Difference Reason',
        enableSorting: false,
        accessorKey: 'difference_reason',
        cell: (props) => {
          const value = props.getValue() as string;
          return (
            <Tooltip title={value}>
              <div className="w-40 truncate">{value || '-'}</div>
            </Tooltip>
          );
        },
      },
      {
        header: 'Due Date',
        enableSorting: false,
        accessorKey: 'payment_due_date',
        cell: (props) => <div className="w-28 truncate">
          {dayjs(props.getValue() as string).format('DD-MM-YYYY')}
        </div>,
      },
      {
        header: 'Payment Date',
        enableSorting: false,
        accessorKey: 'payment_date',
        cell: (props) => <div className="w-28 truncate">
          {dayjs(props.getValue() as string).format('DD-MM-YYYY')}
        </div>,
      },
      {
        header: 'Delay in Days',
        enableSorting: false,
        accessorKey: 'delay_in_days',
        cell: (props) => <div className="w-28 truncate">
          {props.getValue() ? `${props.getValue()}` : '-'}
        </div>,
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
        },
      },
      {
        header: 'Receipt No',
        enableSorting: false,
        accessorKey: 'receipt_no',
        cell: (props) => <div className="w-52 truncate">
          {props.getValue() as string || '-'}
        </div>,
      },
      {
        header: 'Challan Type',
        enableSorting: false,
        accessorKey: 'challan_type',
        cell: (props) => {
            const value = props.getValue() as string;
            // Capitalize the first letter
            const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
            
            return (
                <div className="w-40 truncate">
                    {capitalizedValue}
                </div>
            );
        },
    },
       {
  header: 'Payment Receipt',
  enableSorting: false,
  accessorKey: 'receipt_document',
  cell: (props) => {
    const paymentReceiptDocument = props.getValue() as string | null;
    
    const handlePaymentReceiptDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (paymentReceiptDocument) {
        const fullPath = `${import.meta.env.VITE_API_GATEWAY}/${paymentReceiptDocument}`;
        window.open(fullPath, '_blank');
      }
    };

    return (
      <div className="w-40 flex items-center">
        {paymentReceiptDocument ? (
          <a 
            href="#" 
            onClick={handlePaymentReceiptDownload} 
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FiFile className="w-5 h-5" />
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
        cell: (props) => <div className="w-40 truncate">
          {props.getValue() as string}
        </div>,
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <ConfigDropdown 
            companyName={row.original.LwfSetup.Company.name} 
            companyGroupName={row.original.LwfSetup.CompanyGroup.name} 
            trackerId={row.original.id}
            onRefresh={fetchLWFTrackerData}
          />
        ),
      },
    ],
    []
  );

  const backFunction = () => {
    navigate('/lwf-tracker');
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
        <h2 className="text-2xl font-bold">Uploaded LWF Tracker Details</h2>
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

export default UploadedLWFDetails;