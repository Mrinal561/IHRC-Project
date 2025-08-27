// import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { Button, Tooltip } from '@/components/ui';
// import { HiArrowLeft } from 'react-icons/hi';
// import DataTable, { ColumnDef } from '@/components/shared/DataTable';
// import { useNavigate } from 'react-router-dom';
// import EsiConfigDropdown from './ESIConfigDropDown';
// import { esiChallanData } from '@/@types/esiTracker';
// import httpClient from '@/api/http-client';
// import { endpoints } from '@/api/endpoint';
// import dayjs from 'dayjs';
// import { FiFile } from 'react-icons/fi';
// import store from '@/store';
// const documentPath = "../store/AllMappedCompliancesDetails.xls";


// interface UploadedESIDetailsProps {
//   onBack: () => void;
//   loading: boolean;
//   groupId: string;
//   companyId:string;
//   // onRefersh: () => void
// }



// const FINANCIAL_YEAR_KEY = 'selectedFinancialYear'
// const FINANCIAL_YEAR_CHANGE_EVENT = 'financialYearChanged';

// const UploadedESIDetails: React.FC<UploadedESIDetailsProps> = ({ onBack, loading, groupId, companyId }) => {
//   const navigate = useNavigate();
//   const [data, setData] = useState<esiChallanData[]>([]);
// const [isLoading, setIsLoading] = useState(false);
//   const [refreshCounter, setRefreshCounter] = useState(0);

// const {login} = store.getState();
//   const [financialYear, setFinancialYear] = useState(sessionStorage.getItem(FINANCIAL_YEAR_KEY));
// const [pagination, setPagination] = useState({
//   total: 0,
//   pageIndex: 1,
//   pageSize: 10,
// });
// const params: any = {
//   'group_id[]': login.user.user?.group_id,
//   'company_id[]': login.user.user?.company_id,
// };
//   const fetchEsiTrackerData = useCallback(async  (page: number, pageSize: number) => {
//     console.log(login)
//     try {
//         setIsLoading(true)
//         const params: any = {
//           page,
//           page_size: pageSize,
//           'group_id[]': login.user.user?.group_id,
//           'company_id[]': login.user.user?.company_id,
//         };
//         if (financialYear) {
//           params['financial_year'] = financialYear
//       }
//       const res = await httpClient.get(endpoints.esiTracker.getAll(), {
//         params,
//       });
//       console.log(res.data.data)
//       setData(res.data.data);
//       setPagination((prev) => ({
//         ...prev,
//         total: res.data.paginate_data.totalResults,
//       }));
//     } catch (error) {
//       console.error('Error fetching PF tracker data:', error);
//     } finally{
//         setIsLoading(false)
//     }
//   }, []);
//       useEffect(() => {
//     fetchEsiTrackerData(pagination.pageIndex, pagination.pageSize);
//   }, [fetchEsiTrackerData, pagination.pageIndex, pagination.pageSize]);

//   const handlePaginationChange = (page: number) => {
//     setPagination((prev) => ({ ...prev, pageIndex: page }));
//   };

//   const handlePageSizeChange = (newPageSize: number) => {
//     setPagination((prev) => ({
//       ...prev,
//       pageSize: newPageSize,
//       pageIndex: 1,
//     }));
//   };

//   const formatIndianCurrency = (num: number, showDecimal = true) => {
//   if (isNaN(num)) return '₹0';
  
//   // Get the integer part (before decimal)
//   const integerPart = Math.floor(num);
//   const numStr = integerPart.toString();
  
//   const lastThree = numStr.substring(numStr.length - 3);
//   const otherNumbers = numStr.substring(0, numStr.length - 3);
  
//   if (otherNumbers !== '') {
//     return '₹' + otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
//   }
//   return '₹' + lastThree;
// };

// useEffect(() => {
//     fetchEsiTrackerData(pagination.pageIndex, pagination.pageSize);
//   }, [fetchEsiTrackerData, pagination.pageIndex, pagination.pageSize, refreshCounter]);

//   // Create refresh function
//   const handleRefresh = useCallback(() => {
//     setRefreshCounter(prev => prev + 1);
//   }, []);

//   const columns: ColumnDef<esiChallanData>[] = useMemo(
//     () => [
//      {
//       header: 'Company',
//       enableSorting: false,
//       accessorKey: 'EsiSetup.Company.name',
//       cell: (props) => {
//         const value = props.getValue() as string;
//         return (
//           <div className="w-52 truncate">
//             {value || '--'}
//           </div>
//         );
//       },
//     },
//     {
//         header: 'ESI Code',
//         enableSorting: false,
//         accessorKey: 'EsiSetup.code',
//         cell: (props) => (
//             <div className="w-40 truncate">
//                 {props.getValue() as string}
//             </div>
//         ),
//     },
//     // {
//     //     header: 'Code Type',
//     //     accessorKey: 'codeType',
//     //     cell: (props) => (
//     //         <div className="w-40 truncate">
//     //             {props.getValue() as string}
//     //         </div>
//     //     ),
//     // },
//     {
//         header: 'ESI Code Location',
//         enableSorting: false,
//         accessorKey: 'EsiSetup.Location.name',
//         cell: (props) => (
//             <div className="w-40 truncate">
//                 {props.getValue() as string}
//             </div>
//         ),
//     },
//     // {
//     //     header: 'Month',
//     //     enableSorting: false,
//     //     accessorKey: 'payroll_month',
//     //     cell: (props) => {
//     //         const date = new Date(props.getValue() as string);
//     //         return (
//     //           <div className="w-28 truncate">
//     //             {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
//     //           </div>
//     //         );
//     //       }
//     // },
//     {
//     header: 'Month',
//     enableSorting: false,
//     accessorKey: 'payroll_month',
//     cell: (props) => {
//         const dateString = props.getValue() as string;
//         if (!dateString) return <div className="w-28 truncate">--</div>;
        
//         try {
//             const date = dayjs(dateString);
//             return (
//                 <div className="w-28 truncate">
//                     {date.isValid() ? date.format('MMMM YYYY') : '--'}
//                 </div>
//             );
//         } catch (error) {
//             return <div className="w-28 truncate">--</div>;
//         }
//     }
// },
//     {
//         header: 'No. of Employees',
//         enableSorting: false,
//         accessorKey: 'no_of_emp',
//         cell: (props) => (
//             <div className="w-40 truncate">
//                 {props.getValue() as number}
//             </div>
//         ),
//     },
//     {
//     header: 'ESI Gross Wages',
//     enableSorting: false,
//     accessorKey: 'gross_wage',
//     cell: (props) => (
//         <div className="w-40 truncate">
//             {formatIndianCurrency(props.getValue() as number, false)}
//         </div>
//     ),
// },
// {
//     header: 'EE ESI',
//     enableSorting: false,
//     accessorKey: 'employee_esi',
//     cell: (props) => (
//         <div className="w-28 truncate">
//            {formatIndianCurrency(props.getValue() as number, false)}
//         </div>
//     ),
// },
// {
//     header: 'ER ESI',
//     enableSorting: false,
//     accessorKey: 'employer_esi',
//     cell: (props) => (
//         <div className="w-28 truncate">
//             {formatIndianCurrency(props.getValue() as number, false)}
//         </div>
//     ),
// },
// {
//     header: 'Total ESI',
//     enableSorting: false,
//     accessorKey: 'total_esi',
//     cell: (props) => (
//         <div className="w-28 truncate">
//             {formatIndianCurrency(props.getValue() as number, false)}
//         </div>
//     ),
// },
// {
//     header: 'Total Amount As per Challan',
//     enableSorting: false,
//     accessorKey: 'challan_amt',
//     cell: (props) => (
//         <div className="w-52 truncate">
//             {formatIndianCurrency(props.getValue() as number, false)}
//         </div>
//     ),
// },
//     {
//         header: 'Difference in Amount',
//         enableSorting: false,
//         accessorKey: 'difference_amt',
//         cell: (props) => (
//             <div className="w-40 truncate">
//                 ₹{(props.getValue() as number).toLocaleString()}
//             </div>
//         ),
//     },
//     {
//         header: 'Reason For Difference',
//         enableSorting: false,
//         accessorKey: 'difference_reason',
//         cell: (props) => (
//             <div className="w-40 truncate">
//                 {(props.getValue() as number).toLocaleString()}
//             </div>
//         ),
//     },
    
   
//     {
//         header: 'Due Date',
//         enableSorting: false,
//         accessorKey: 'payment_due_date',
//         cell: (props) => <div className="w-28 truncate">{dayjs(props.getValue() as string).format('DD-MM-YYYY')}</div>,
//     },
//     {
//         header: 'Date of Payment',
//         enableSorting: false,
//         accessorKey: 'payment_date',
//         cell: (props) => <div className="w-40 truncate">{dayjs(props.getValue() as string).format('DD-MM-YYYY')}</div>,
//     },
//     {
//       header: 'Delay',
//       enableSorting: false,
//       accessorKey: 'delay_in_days',
//       cell: (props) => (
//           <div className="w-40 truncate">
//               {props.getValue() as string}
//           </div>
//       ),
//   },
//   {
//       header: 'Delay Reason',
//       enableSorting: false,
//       accessorKey: 'delay_reason',
//       cell: (props) => (
//           <div className="w-40 truncate">
//               {props.getValue() as string}
//           </div>
//       ),
//   },
//     {
//         header: 'Challan No',
//         enableSorting: false,
//         accessorKey: 'challan_no',
//         cell: (props) => (
//             <div className="w-40 truncate">
//                 {props.getValue() as string}
//             </div>
//         ),
//     },
//     {
//       header: 'Challan Type',
//       enableSorting: false,
//       accessorKey: 'challan_type',
//       cell: (props) => {
//           const value = props.getValue() as string;
//           // Capitalize the first letter
//           const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
          
//           return (
//               <div className="w-40 truncate">
//                   {capitalizedValue}
//               </div>
//           );
//       },
//   },
//          {
//   header: 'Challan',
//   enableSorting: false,
//   accessorKey: 'challan_document',
//   cell: (props) => {
//     const challanDocument = props.getValue() as string | null;
    
//     const handleChallanDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
//       e.preventDefault();
//       if (challanDocument) {
//         const fullPath = `${import.meta.env.VITE_API_GATEWAY}/${challanDocument}`;
//         window.open(fullPath, '_blank');
//       }
//     };

//     return (
//       <div className="w-40 flex items-center">
//         {challanDocument ? (
//           <a 
//             href="#" 
//             onClick={handleChallanDownload} 
//             className="text-blue-600 hover:text-blue-800 transition-colors"
//           >
//             <FiFile className="w-5 h-5" />
//              {/* <span className="truncate">View File</span> */}
//           </a>
//         ) : (
//           '--'
//         )}
//       </div>
//     );
//   },
// },
     
//       {
//         header: 'Actions',
//         id: 'actions',
//         cell: ({ row }) => (
//             <EsiConfigDropdown companyName={row.original.EsiSetup.Company.name} 
//             companyGroupName={row.original.EsiSetup.CompanyGroup.name} 
//             trackerId={row.original.id}  
//             onRefresh={handleRefresh} 
//           />
//         ),
//       },
//     ],
//     [handleRefresh]
//   );

//   const backFunction = () => {
//     navigate('/esi-tracker');
//   };
//   const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
//     e.preventDefault();
//     // Implement the download functionality here
//     // For example, you could use the `fetch` API to download the file
//     fetch(documentPath)
//       .then(response => response.blob())
//       .then(blob => {
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.style.display = 'none';
//         a.href = url;
//         a.download = 'AllMappedCompliancesDetails.xls';
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(url);
//       })
//       .catch(() => console.error('Download failed'));
//   };

//   return (
//     <div className="p-4">
//       <div className="flex items-center mb-8">
//         <Button
//           variant="plain"
//           size="sm"
//           icon={<HiArrowLeft />}
//           onClick={backFunction}
//           className="mr-4"
//         >
//         </Button>
//         <h2 className="text-2xl font-bold">Uploaded ESI Tracker Details</h2>
//       </div>
//       <DataTable
//         columns={columns}
//         data={data}
//         loading={isLoading}
//         skeletonAvatarColumns={[0]}
//         skeletonAvatarProps={{ className: 'rounded-md' }}
//         stickyHeader={true}
//         stickyFirstColumn={true}
//         stickyLastColumn={true}
//         pagingData={{
//           total: pagination.total,
//           pageIndex: pagination.pageIndex,
//           pageSize: pagination.pageSize,
//         }}
//         onPaginationChange={handlePaginationChange}
//         onSelectChange={handlePageSizeChange}
//       />
//     </div>
//   );
// };

// export default UploadedESIDetails;
































import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui';
import { HiArrowLeft } from 'react-icons/hi';
import DataTable, { ColumnDef } from '@/components/shared/DataTable';
import { useNavigate } from 'react-router-dom';
import EsiConfigDropdown from './ESIConfigDropDown';
import { esiChallanData } from '@/@types/esiTracker';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import dayjs from 'dayjs';
import { FiFile } from 'react-icons/fi';
import store from '@/store';
import ErrorBoundary from './ErrorBoundary';

interface UploadedESIDetailsProps {
  onBack: () => void;
  loading: boolean;
  groupId: string;
  companyId: string;
}

const FINANCIAL_YEAR_KEY = 'selectedFinancialYear';

const UploadedESIDetails: React.FC<UploadedESIDetailsProps> = ({ onBack, groupId, companyId }) => {
  const navigate = useNavigate();
  const [data, setData] = useState<esiChallanData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const { login } = store.getState();
  const [financialYear] = useState(sessionStorage.getItem(FINANCIAL_YEAR_KEY));
  const [pagination, setPagination] = useState({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  });

  const fetchEsiTrackerData = useCallback(async (page: number, pageSize: number) => {
    try {
      setIsLoading(true);
      const params: any = {
        page,
        page_size: pageSize,
        'group_id[]': login.user.user?.group_id,
        'company_id[]': login.user.user?.company_id,
      };
      
      if (financialYear) {
        params['financial_year'] = financialYear;
      }
      
      const res = await httpClient.get(endpoints.esiTracker.getAll(), { params });
      console.log('API Response:', res.data);
      
      setData(res.data.data || []);
      setPagination((prev) => ({
        ...prev,
        total: res.data.paginate_data?.totalResults || 0,
      }));
    } catch (error) {
      console.error('Error fetching ESI tracker data:', error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [financialYear, login.user.user?.group_id, login.user.user?.company_id]);

  useEffect(() => {
    fetchEsiTrackerData(pagination.pageIndex, pagination.pageSize);
  }, [fetchEsiTrackerData, pagination.pageIndex, pagination.pageSize, refreshCounter]);

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

  const formatIndianCurrency = (num: number) => {
    if (isNaN(num)) return '₹0';
    
    const integerPart = Math.floor(num);
    const numStr = integerPart.toString();
    
    const lastThree = numStr.substring(numStr.length - 3);
    const otherNumbers = numStr.substring(0, numStr.length - 3);
    
    if (otherNumbers !== '') {
      return '₹' + otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    }
    return '₹' + lastThree;
  };

  const handleRefresh = useCallback(() => {
    setRefreshCounter(prev => prev + 1);
  }, []);

  const safeAccess = (obj: any, path: string, defaultValue: any = '--') => {
    try {
      const value = path.split('.').reduce((acc, part) => acc && acc[part], obj);
      return value !== undefined && value !== null ? value : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  };

  const columns: ColumnDef<esiChallanData>[] = useMemo(
    () => [
      {
        header: 'Company',
        enableSorting: false,
        accessorKey: 'company',
        cell: (props) => {
          const companyName = safeAccess(props.row.original, 'EsiSetup.Company.name');
          return <div className="w-52 truncate">{companyName}</div>;
        },
      },
      {
        header: 'ESI Code',
        enableSorting: false,
        accessorKey: 'code',
        cell: (props) => {
          const code = safeAccess(props.row.original, 'EsiSetup.code');
          return <div className="w-40 truncate">{code}</div>;
        },
      },
      {
        header: 'ESI Code Location',
        enableSorting: false,
        accessorKey: 'location',
        cell: (props) => {
          const location = safeAccess(props.row.original, 'EsiSetup.Location.name');
          return <div className="w-40 truncate">{location}</div>;
        },
      },
      {
        header: 'Month',
        enableSorting: false,
        accessorKey: 'payroll_month',
        cell: (props) => {
          const dateString = props.getValue() as string;
          if (!dateString) return <div className="w-28 truncate">--</div>;
          
          try {
            const date = dayjs(dateString);
            return (
              <div className="w-28 truncate">
                {date.isValid() ? date.format('MMMM YYYY') : '--'}
              </div>
            );
          } catch (error) {
            return <div className="w-28 truncate">--</div>;
          }
        }
      },
      {
        header: 'No. of Employees',
        enableSorting: false,
        accessorKey: 'no_of_emp',
        cell: (props) => {
          const value = props.getValue() as number;
          return <div className="w-40 truncate">{value || '--'}</div>;
        },
      },
      {
        header: 'ESI Gross Wages',
        enableSorting: false,
        accessorKey: 'gross_wage',
        cell: (props) => {
          const value = props.getValue() as number;
          return <div className="w-40 truncate">{formatIndianCurrency(value)}</div>;
        },
      },
      {
        header: 'EE ESI',
        enableSorting: false,
        accessorKey: 'employee_esi',
        cell: (props) => {
          const value = props.getValue() as number;
          return <div className="w-28 truncate">{formatIndianCurrency(value)}</div>;
        },
      },
      {
        header: 'ER ESI',
        enableSorting: false,
        accessorKey: 'employer_esi',
        cell: (props) => {
          const value = props.getValue() as number;
          return <div className="w-28 truncate">{formatIndianCurrency(value)}</div>;
        },
      },
      {
        header: 'Total ESI',
        enableSorting: false,
        accessorKey: 'total_esi',
        cell: (props) => {
          const value = props.getValue() as number;
          return <div className="w-28 truncate">{formatIndianCurrency(value)}</div>;
        },
      },
      {
        header: 'Total Amount As per Challan',
        enableSorting: false,
        accessorKey: 'challan_amt',
        cell: (props) => {
          const value = props.getValue() as number;
          return <div className="w-52 truncate">{formatIndianCurrency(value)}</div>;
        },
      },
      {
        header: 'Difference in Amount',
        enableSorting: false,
        accessorKey: 'difference_amt',
        cell: (props) => {
          const value = props.getValue() as number;
          return <div className="w-40 truncate">₹{(value || 0).toLocaleString()}</div>;
        },
      },
      {
        header: 'Reason For Difference',
        enableSorting: false,
        accessorKey: 'difference_reason',
        cell: (props) => {
          const value = props.getValue() as string;
          return <div className="w-40 truncate">{value || '--'}</div>;
        },
      },
      {
        header: 'Due Date',
        enableSorting: false,
        accessorKey: 'payment_due_date',
        cell: (props) => {
          const dateString = props.getValue() as string;
          if (!dateString) return <div className="w-28 truncate">--</div>;
          
          try {
            const date = dayjs(dateString);
            return <div className="w-28 truncate">{date.isValid() ? date.format('DD-MM-YYYY') : '--'}</div>;
          } catch (error) {
            return <div className="w-28 truncate">--</div>;
          }
        },
      },
      {
        header: 'Date of Payment',
        enableSorting: false,
        accessorKey: 'payment_date',
        cell: (props) => {
          const dateString = props.getValue() as string;
          if (!dateString) return <div className="w-40 truncate">--</div>;
          
          try {
            const date = dayjs(dateString);
            return <div className="w-40 truncate">{date.isValid() ? date.format('DD-MM-YYYY') : '--'}</div>;
          } catch (error) {
            return <div className="w-40 truncate">--</div>;
          }
        },
      },
      {
        header: 'Delay',
        enableSorting: false,
        accessorKey: 'delay_in_days',
        cell: (props) => {
          const value = props.getValue();
          return <div className="w-40 truncate">{value !== null && value !== undefined ? String(value) : '--'}</div>;
        },
      },
      {
        header: 'Delay Reason',
        enableSorting: false,
        accessorKey: 'delay_reason',
        cell: (props) => {
          const value = props.getValue() as string;
          return <div className="w-40 truncate">{value || '--'}</div>;
        },
      },
      {
        header: 'Challan No',
        enableSorting: false,
        accessorKey: 'challan_no',
        cell: (props) => {
          const value = props.getValue() as string;
          return <div className="w-40 truncate">{value || '--'}</div>;
        },
      },
      {
        header: 'Challan Type',
        enableSorting: false,
        accessorKey: 'challan_type',
        cell: (props) => {
          const value = props.getValue() as string;
          const capitalizedValue = value ? value.charAt(0).toUpperCase() + value.slice(1) : '--';
          return <div className="w-40 truncate">{capitalizedValue}</div>;
        },
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
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => {
          const companyName = safeAccess(row.original, 'EsiSetup.Company.name');
          const companyGroupName = safeAccess(row.original, 'EsiSetup.CompanyGroup.name');
          const trackerId = row.original.id;
          
          return (
            <EsiConfigDropdown 
              companyName={companyName} 
              companyGroupName={companyGroupName} 
              trackerId={trackerId}  
              onRefresh={handleRefresh} 
            />
          );
        },
      },
    ],
    [handleRefresh]
  );

  const backFunction = () => {
    navigate('/esi-tracker');
  };

  return (
    <ErrorBoundary>
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
          <h2 className="text-2xl font-bold">Uploaded ESI Tracker Details</h2>
        </div>
        
        {isLoading && data.length === 0 ? (
          <div>Loading data...</div>
        ) : data.length === 0 ? (
          <div className="text-center py-10">
            <p>No ESI data available</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={data}
            loading={isLoading}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ className: 'rounded-md' }}
            pagingData={{
              total: pagination.total,
              pageIndex: pagination.pageIndex,
              pageSize: pagination.pageSize,
            }}
            onPaginationChange={handlePaginationChange}
            onSelectChange={handlePageSizeChange}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default UploadedESIDetails;