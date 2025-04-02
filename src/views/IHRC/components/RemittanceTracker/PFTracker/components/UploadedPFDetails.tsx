import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Tooltip } from '@/components/ui';
import { HiArrowLeft } from 'react-icons/hi';
import DataTable, { ColumnDef } from '@/components/shared/DataTable';
import { useNavigate } from 'react-router-dom';
import { PFTrackerData } from './PFTrackerTable';
import { MdEdit } from 'react-icons/md';
import { FiFile, FiTrash } from 'react-icons/fi';
import ConfigDropdown from './ConfigDropdown';
import { PfChallanData } from '@/@types/pfTracker';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import dayjs from 'dayjs';
import store from '@/store';
import { useDispatch } from 'react-redux';
import { fetchAuthUser } from '@/store/slices/login';
import toast from '@/components/ui/toast';
import { Notification } from '@/components/ui';
import Loading from '@/components/shared/Loading';

const FINANCIAL_YEAR_KEY = 'selectedFinancialYear';
const FINANCIAL_YEAR_CHANGE_EVENT = 'financialYearChanged';

interface UploadedPFDetailsProps {
  onBack: () => void;
}

const documentPath = "../store/AllMappedCompliancesDetails.xls";


const UploadedPFDetails: React.FC<UploadedPFDetailsProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { login } = store.getState();
  const [data, setData] = useState<PfChallanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState({
    canList: false,
    canCreate: false,
    canEdit: false,
    canDelete: false,
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [financialYear, setFinancialYear] = useState(
    sessionStorage.getItem(FINANCIAL_YEAR_KEY)
  );
  const [pagination, setPagination] = useState({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  });

  // Listen for financial year changes
  useEffect(() => {
    const handleFinancialYearChange = (event: CustomEvent) => {
      const newFinancialYear = event.detail;
      setFinancialYear(newFinancialYear);
    };

    window.addEventListener(
      FINANCIAL_YEAR_CHANGE_EVENT,
      handleFinancialYearChange as EventListener
    );

    return () => {
      window.removeEventListener(
        FINANCIAL_YEAR_CHANGE_EVENT,
        handleFinancialYearChange as EventListener
      );
    };
  }, []);

  // Initialize auth and permissions
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await dispatch(fetchAuthUser());
        
        if (!response.payload?.moduleAccess) {
          toast.push(
            <Notification title="Permission" type="error" closable duration={2000}>
              You don't have access to any modules
            </Notification>
          );
          navigate('/home');
          setIsInitialized(true);
          return;
        }

        // Find Remittance Tracker module
        const remittanceModule = response.payload.moduleAccess?.find(
          (module: any) => module.id === 3
        );
        
        if (!remittanceModule) {
          toast.push(
            <Notification title="Permission" type="error" closable duration={2000}>
              You don't have access to this module
            </Notification>
          );
          navigate('/home');
          setIsInitialized(true);
          return;
        }

        // Find PF Tracker menu item
        const pfTrackerMenu = remittanceModule.menus?.find(
          (menu: any) => menu.id === 9
        );

        if (!pfTrackerMenu) {
          toast.push(
            <Notification title="Permission" type="error" closable duration={2000}>
              You don't have access to this menu
            </Notification>
          );
          navigate('/home');
          setIsInitialized(true);
          return;
        }

        // Set permissions
        setPermissions({
          canList: !!pfTrackerMenu.permissions?.can_list,
          canCreate: !!pfTrackerMenu.permissions?.can_create,
          canEdit: !!pfTrackerMenu.permissions?.can_edit,
          canDelete: !!pfTrackerMenu.permissions?.can_delete,
        });

        setIsInitialized(true);
      } catch (error) {
        console.error('Error fetching auth user:', error);
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      initializeAuth();
    }
  }, [dispatch, isInitialized, navigate]);

  const fetchPFTrackerData = useCallback(
    async (page: number, pageSize: number) => {
      if (!permissions.canList || !isInitialized) return;

      try {
        setLoading(true);
        
        const params: any = {
          page,
          page_size: pageSize,
          'group_id[]': login.user.user?.group_id,
          'company_id[]': login.user.user?.company_id,
        };

        if (financialYear) {
          params.financial_year = financialYear;
        }

        const res = await httpClient.get(endpoints.tracker.pfGetALl(), {
          params,
        });

        setData(res.data.data);
        setPagination((prev) => ({
          ...prev,
          total: res.data.paginate_data.totalResults,
        }));
      } catch (error) {
        console.error('Error fetching PF tracker data:', error);
      } finally {
        setLoading(false);
      }
    },
    [login.user.user?.group_id, login.user.user?.company_id, permissions.canList, isInitialized, financialYear]
  );

  useEffect(() => {
    if (isInitialized && permissions.canList) {
      fetchPFTrackerData(pagination.pageIndex, pagination.pageSize);
    }
  }, [fetchPFTrackerData, pagination.pageIndex, pagination.pageSize, isInitialized, permissions.canList]);

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
  const columns: ColumnDef<PFTrackerData>[] = useMemo(
    () => [
      {
        header: 'PF Code',
        enableSorting: false,
        accessorKey: 'PfSetup.pf_code',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Company Group',
        enableSorting: false,
        accessorKey: 'PfSetup.CompanyGroup.name',
        cell: (props) => <div className="w-28 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Company',
        enableSorting: false,
        accessorKey: 'PfSetup.Company.name',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Location',
        enableSorting: false,
        accessorKey: 'PfSetup.Location.name',
        cell: (props) => <div className="w-28 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'No. of Employees',
        enableSorting: false,
        accessorKey: 'no_of_emp',
        cell: (props) => <div className="w-28 truncate  text-center">{props.getValue() as number}</div>,
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
        header: 'EPF Wage',
        enableSorting: false,
        accessorKey: 'epf_wage',
        cell: (props) => <div className="w-28 truncate">₹{(props.getValue() as number).toLocaleString()}</div>,
      },
      {
        header: 'EPS Wage',
        enableSorting: false,
        accessorKey: 'eps_wage',
        cell: (props) => <div className="w-28 truncate">₹{(props.getValue() as number).toLocaleString()}</div>,
      },
      {
        header: 'EDLI Wage',
        enableSorting: false,
        accessorKey: 'edli_wage',
        cell: (props) => <div className="w-28 truncate">₹{(props.getValue() as number).toLocaleString()}</div>,
      },
      {
        header: 'Total Challan Amount',
        enableSorting: false,
        accessorKey: 'total_challan_amt',
        cell: (props) => <div className="w-52 truncate">₹{(props.getValue() as number).toLocaleString()}</div>,
      },
      {
        header: 'Total Paid Amount',
        enableSorting: false,
        accessorKey: 'total_paid_amt',
        cell: (props) => <div className="w-52 truncate">₹{(props.getValue() as number).toLocaleString()}</div>,
      },
      {
        header: 'Difference Amount',
        enableSorting: false,
        accessorKey: 'difference_amt',
        cell: (props) => <div className="w-52 truncate">₹{(props.getValue() as number).toLocaleString()}</div>,
      },
      {
        header: 'Difference Reason',
        enableSorting: false,
        accessorKey: 'difference_reason',
        cell: (props) => <div className="w-52 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Payment Due Date',
        enableSorting: false,
        accessorKey: 'payment_due_date',
        cell: (props) => <div className="w-28 truncate">{dayjs(props.getValue() as string).format('DD-MM-YYYY')}</div>,
      },
      {
        header: 'Payment Date',
        enableSorting: false,
        accessorKey: 'payment_date',
        cell: (props) => <div className="w-40 truncate">{dayjs(props.getValue() as string).format('DD-MM-YYYY')}</div>,
      },
      {
        header: 'Delay in Days',
        enableSorting: false,
        accessorKey: 'delay_in_days',
        cell: (props) => <div className="w-28 truncate">{props.getValue() as number || '-'}</div>,
      },
      {
        header: 'Delay Reason',
        enableSorting: false,
        accessorKey: 'delay_reason',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string || '-'}</div>,
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
        header: 'TRRN No',
        enableSorting: false,
        accessorKey: 'trrn_no',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'CRN No',
        enableSorting: false,
        accessorKey: 'crn_no',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Remark',
        enableSorting: false,
        accessorKey: 'remark',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
      },
      // {
      //   header: 'Upload Date',
      //   accessorKey: 'upload_date',
      //   cell: (props) => <div className="w-40 truncate">{dayjs(props.getValue() as string).format('DD-MM-YYYY')}</div>,
      // },
      {
        header: 'Status',
        enableSorting: false,
        accessorKey: 'status',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Uploaded By',
        enableSorting: false,
        accessorKey: 'UploadBy.name',
        cell: (props) => (
          <div className="w-40 truncate">
            {`${props.row.original.UploadBy?.name}`}
          </div>
        ),
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
          </a>
        ) : (
          '--'
        )}
      </div>
    );
  },
},
{
  header: 'ECR',
  enableSorting: false,
  accessorKey: 'ecr_document',
  cell: (props) => {
    const ecrDocument = props.getValue() as string | null;
    
    const handleEcrDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (ecrDocument) {
        const fullPath = `${import.meta.env.VITE_API_GATEWAY}/${ecrDocument}`;
        window.open(fullPath, '_blank');
      }
    };

    return (
      <div className="w-40 flex items-center">
        {ecrDocument ? (
          <a 
            href="#" 
            onClick={handleEcrDownload} 
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
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <ConfigDropdown companyName={row.original.PfSetup.Company.name} companyGroupName={row.original.PfSetup.CompanyGroup.name}
          trackerId={row.original.id}  
            onRefresh={fetchPFTrackerData}/>
        ),
    },
    ],
    []
  );

  const backFunction = () => {
    navigate('/pf-tracker');
  };

  if (!isInitialized) {
    return (
      <Loading loading={true} type="default">
        <div className="h-full" />
      </Loading>
    );
  }

  if (!permissions.canList) {
    return null;
  }


  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Implement the download functionality here
    // For example, you could use the `fetch` API to download the file
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
        />
        <h2 className="text-2xl font-bold">Uploaded PF Tracker Details</h2>
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

export default UploadedPFDetails;