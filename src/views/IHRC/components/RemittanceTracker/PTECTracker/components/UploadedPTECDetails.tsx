
// import React, { useCallback, useEffect, useState } from 'react';
// import { Button } from '@/components/ui';
// import { HiArrowLeft } from 'react-icons/hi';
// import DataTable, { ColumnDef } from '@/components/shared/DataTable';
// import { useNavigate } from 'react-router-dom';
// import ConfigDropdown from './ConfigDropdown';
// import httpClient from '@/api/http-client';
// import { endpoints } from '@/api/endpoint';
// import { PTTrackerData } from '@/@types/PTTracker';
// import { FiFile } from 'react-icons/fi';
// import dayjs from 'dayjs';
// import store from '@/store';

// interface UploadedPTDetailsProps {
//   onBack: () => void;
// }


// const UploadedPTECDetails: React.FC<UploadedPTDetailsProps> = ({ onBack }) => {
//   const navigate = useNavigate();
//   const [data, setData] = useState<PTTrackerData[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [pagination, setPagination] = useState({
//     total: 0,
//     pageIndex: 1,
//     pageSize: 10,
//   });
//   const {login} = store.getState();
// const params: any = {
//   'group_id[]': login.user.user?.group_id,
//   'company_id[]': login.user.user?.company_id,
// };

//   const fetchPTTrackerData = useCallback(
//     async (page: number, pageSize: number) => {
//       setIsLoading(true);
//       try {
//         const res = await httpClient.get(endpoints.ptec.getAll(), {
//           params: {
//             page,
//             page_size: pageSize,
//             'group_id[]': login.user.user?.group_id,
//             'company_id[]': login.user.user?.company_id,
//           },
//         });
//         setData(res.data.data);
//         setPagination((prev) => ({
//           ...prev,
//           total: res.data.paginate_data.totalResults,
//         }));
//       } catch (error) {
//         console.error('Error fetching PT tracker data:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [],
//   );

//   useEffect(() => {
//     fetchPTTrackerData(pagination.pageIndex, pagination.pageSize);
//   }, [fetchPTTrackerData, pagination.pageIndex, pagination.pageSize]);

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

//   const columns: ColumnDef<PTTrackerData>[] = [
//     {
//         header: 'Company',
//         enableSorting: false,
//         accessorKey: 'PtSetup.Company.name',
//         cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
//       },
//       // {
//       //   header: 'State',
//       //   accessorKey: 'state',
//       //   cell: (props) => <div className="w-28 truncate">{props.getValue() as string}</div>,
//       // },
//       {
//         header: 'PT EC Location',
//         enableSorting: false,
//         accessorKey: 'PtSetup.Location.name',
//         cell: (props) => <div className="w-36 truncate">{props.getValue() as string}</div>,
//       },
//       {
//         header: 'PT EC Number',
//         enableSorting: false,
//         accessorKey: 'PtSetup.enroll_number',
//         cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
//       },
//       // {
//       //   header: 'Date of Enrolment',
//       //   accessorKey: 'dateOfEnrolment',
//       //   cell: (props) => (
//       //     <div className="w-36 truncate">
//       //       {dayjs(props.getValue() as string).format('DD-MM-YYYY')}
//       //     </div>
//       //   ),
//       // },
//       // {
//       //   header: 'PT EC Enrolment Address',
//       //   accessorKey: 'ptEcEnrolmentAddress',
//       //   cell: (props) => {
//       //     const value = props.getValue() as string;
//       //     return (
//       //       <Tooltip title={value}>
//       //         <div className="w-52 truncate">{value}</div>
//       //       </Tooltip>
//       //     );
//       //   }
//       // },
//       // {
//       //   header: 'Remittance Mode',
//       //   accessorKey: 'remittanceMode',
//       //   cell: (props) => <div className="w-36 truncate">{props.getValue() as string}</div>,
//       // },
//       // {
//       //   header: 'Frequency',
//       //   accessorKey: 'frequency',
//       //   cell: (props) => <div className="w-28 truncate">{props.getValue() as string}</div>,
//       // },
//       {
//         header: 'Payroll month',
//         enableSorting: false,
//         accessorKey: 'period',
//         cell: (props) => {
//           const date = new Date(props.getValue() as string);
//           return (
//             <div className="w-32 truncate">
//               {date.toLocaleString('default', { month: 'long' })}
//             </div>
//           );
//         }
//       },
//        {
//               header: 'Period',
//               enableSorting: false,
//               accessorKey: 'period',
//               cell: (props) => {
//                 const periodDate = new Date(props.getValue() as string);
//                 const frequency = props.row.original.setup_data.State.ptec_frequency;
            
//                 let periodDisplay = '';
            
//                 if (frequency === 'half_yearly') {
//                   const month = periodDate.getMonth() + 1; // getMonth() returns 0-11, so +1 to make it 1-12
//                   if (month >= 4 && month <= 9) {
//                     periodDisplay = 'Apr-Sep'; // First half of the financial year
//                   } else {
//                     periodDisplay = 'Oct-Mar'; // Second half of the financial year
//                   }
//                 } else if (frequency === 'quarterly') {
//                   const month = periodDate.getMonth() + 1; // getMonth() returns 0-11, so +1 to make it 1-12
//                   if (month >= 4 && month <= 6) {
//                     periodDisplay = 'Apr-Jun'; // Q1
//                   } else if (month >= 7 && month <= 9) {
//                     periodDisplay = 'Jul-Sep'; // Q2
//                   } else if (month >= 10 && month <= 12) {
//                     periodDisplay = 'Oct-Dec'; // Q3
//                   } else {
//                     periodDisplay = 'Jan-Mar'; // Q4
//                   }
//                 } else {
//                   // Default to showing the full date if frequency is not recognized
//                   periodDisplay = dayjs(periodDate).format('DD-MM-YYYY');
//                 }
            
//                 return (
//                   <div className="w-28 truncate">
//                     {periodDisplay}
//                   </div>
//                 );
//               }
//             },
//       {
//         header: 'PT Amount As Per Salary Register',
//         enableSorting: false,
//         accessorKey: 'total_challan_amt',
//         cell: (props) => (
//           <div className="w-40 truncate">
//             ₹{(props.getValue() as number).toLocaleString()}
//           </div>
//         ),
//       },
//       {
//         header: 'Total Amount Paid',
//         enableSorting: false,
//         accessorKey: 'total_paid_amt',
//         cell: (props) => (
//           <div className="w-40 truncate">
//             ₹{(props.getValue() as number).toLocaleString()}
//           </div>
//         ),
//       },
//       {
//         header: 'Difference in Amount',
//         enableSorting: false,
//         accessorKey: 'difference_amt',
//         cell: (props) => (
//           <div className="w-44 truncate">
//             ₹{(props.getValue() as number).toLocaleString()}
//           </div>
//         ),
//       },
//       {
//         header: 'Difference Reason',
//         enableSorting: false,
//         accessorKey: 'difference_reason',
//         cell: (props) => <div className="w-40 truncate">{props.getValue() as string || '--'}</div>,
//       },
//       {
//         header: 'Due Date',
//         enableSorting: false,
//         accessorKey: 'payment_due_date',
//         cell: (props) => (
//           <div className="w-28 truncate">
//             {dayjs(props.getValue() as string).format('DD-MM-YYYY')}
//           </div>
//         ),
//       },
//       {
//         header: 'Date of Payment',
//         enableSorting: false,
//         accessorKey: 'payment_date',
//         cell: (props) => (
//           <div className="w-36 truncate">
//             {dayjs(props.getValue() as string).format('DD-MM-YYYY')}
//           </div>
//         ),
//       },
//       {
//         header: 'Delay',
//         enableSorting: false,
//         accessorKey: 'delay_in_days',
//         cell: (props) => <div className="w-28 truncate">{props.getValue() as string}</div>,
//       },
//       {
//         header: 'Delay Reason',
//         enableSorting: false,
//         accessorKey: 'delay_reason',
//         cell: (props) => <div className="w-36 truncate">{props.getValue() as string || '--'}</div>,
//       },
//       {
//         header: 'Receipt No',
//         enableSorting: false,
//         accessorKey: 'receipt_no',
//         cell: (props) => <div className="w-28 truncate">{props.getValue() as number}</div>,
//       },
//       {
//         header: 'Challan Type',
//         enableSorting: false,
//         accessorKey: 'challan_type',
//         cell: (props) => {
//             const value = props.getValue() as string;
//             // Capitalize the first letter
//             const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
            
//             return (
//                 <div className="w-40 truncate">
//                     {capitalizedValue}
//                 </div>
//             );
//         },
//     },
//       // {
//       //   header: 'Challan',
//       //   accessorKey: 'challan',
//       //   cell: (props) => {
//       //     const challanDocument = props.getValue() as string | null;
          
//       //     const handleChallanDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
//       //       e.preventDefault();
//       //       if (challanDocument) {
//       //         const fullPath = `${import.meta.env.VITE_API_GATEWAY}/${challanDocument}`;
//       //         window.open(fullPath, '_blank');
//       //       }
//       //     };

//       //     return (
//       //       <div className="w-40 flex items-center">
//       //         {challanDocument ? (
//       //           <a 
//       //             href="#" 
//       //             onClick={handleChallanDownload} 
//       //             className="text-blue-600 hover:text-blue-800 transition-colors"
//       //           >
//       //             <FiFile className="w-5 h-5" />
//       //           </a>
//       //         ) : (
//       //           '--'
//       //         )}
//       //       </div>
//       //     );
//       //   },
//       // },
//       {
//         header: 'Payment Receipt',
//         enableSorting: false,
//         accessorKey: 'payment_document',
//         cell: (props) => {
//           const paymentDocument = props.getValue() as string | null;
          
//           const handlePaymentDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
//             e.preventDefault();
//             if (paymentDocument) {
//               const fullPath = `${import.meta.env.VITE_API_GATEWAY}/${paymentDocument}`;
//               window.open(fullPath, '_blank');
//             }
//           };

//           return (
//             <div className="w-40 flex items-center">
//               {paymentDocument ? (
//                 <a 
//                   href="#" 
//                   onClick={handlePaymentDownload} 
//                   className="text-blue-600 hover:text-blue-800 transition-colors"
//                 >
//                   <FiFile className="w-5 h-5" />
//                 </a>
//               ) : (
//                 '--'
//               )}
//             </div>
//           );
//         },
//       },
//       {
//         header: 'Return',
//         enableSorting: false,
//         accessorKey: 'pt_return_document',
//         cell: (props) => {
//           const returnDocument = props.getValue() as string | null;
          
//           const handleReturnDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
//             e.preventDefault();
//             if (returnDocument) {
//               const fullPath = `${import.meta.env.VITE_API_GATEWAY}/${returnDocument}`;
//               window.open(fullPath, '_blank');
//             }
//           };

//           return (
//             <div className="w-40 flex items-center">
//               {returnDocument ? (
//                 <a 
//                   href="#" 
//                   onClick={handleReturnDownload} 
//                   className="text-blue-600 hover:text-blue-800 transition-colors"
//                 >
//                   <FiFile className="w-5 h-5" />
//                 </a>
//               ) : (
//                 '--'
//               )}
//             </div>
//           );
//         },
//       },
//       {
//         header: 'Upload Status',
//         enableSorting: false,
//         id: 'uploadStatus',
//         cell: ({ row }) => {
//           const { payment_document, pt_return_document } = row.original;
//           const uploadedCount = [payment_document, pt_return_document].filter(Boolean).length;
//           return <div className="w-32 truncate">{`${uploadedCount}/2`}</div>;
//         },
//       },
//     {
//       header: 'Actions',
//       id: 'actions',
//       cell: ({ row }) => (
//         <ConfigDropdown 
//           companyName={row.original.PtSetup.Company.name}
//           companyGroupName={row.original.PtSetup.CompanyGroup.name}
//           trackerId={row.original.id}
//           onRefresh={() => fetchPTTrackerData(pagination.pageIndex, pagination.pageSize)}
//         />
//       ),
//     },
//   ];

//   const backFunction = () => {
//     navigate('/ptec-tracker');
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
//         />
//         <h2 className="text-2xl font-bold">Uploaded PT EC Tracker Details</h2>
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

// export default UploadedPTECDetails;






import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Tooltip } from '@/components/ui';
import { HiArrowLeft } from 'react-icons/hi';
import { FiFile, FiTrash } from 'react-icons/fi';
import DataTable, { ColumnDef } from '@/components/shared/DataTable';
import { useNavigate } from 'react-router-dom';
import ConfigDropdown from './ConfigDropdown';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import dayjs from 'dayjs';
import store from '@/store';
import { useDispatch } from 'react-redux';
import { Notification, toast } from '@/components/ui';
import { fetchAuthUser } from '@/store/slices/login';
import Loading from '@/components/shared/Loading';
import { FaEye } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { PTTrackerData } from '@/@types/PTTracker';


interface UploadedPTDetailsProps {
  onBack: () => void;
}


const FINANCIAL_YEAR_KEY = 'selectedFinancialYear'
const FINANCIAL_YEAR_CHANGE_EVENT = 'financialYearChanged';

const UploadedPTECDetails: React.FC<UploadedPTDetailsProps> = ({ onBack }) => {
  const navigate = useNavigate();
    const dispatch = useDispatch();
    const [financialYear, setFinancialYear] = useState(sessionStorage.getItem(FINANCIAL_YEAR_KEY));
  
  const [data, setData] = useState<PTTrackerData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const fetchPTTrackerData = useCallback(
    async (page: number, pageSize: number) => {
      try {
        setIsLoading(true);
        const params: any = {
          page,
          page_size: pageSize,
          'group_id[]': login.user.user?.group_id,
          'company_id[]': login.user.user?.company_id,
        };
        if (financialYear) {
          params['financial_year'] = financialYear
      }
        const res = await httpClient.get(endpoints.ptec.getAll(), {
          params,
        });
        setData(res.data.data);
        setPagination((prev) => ({
          ...prev,
          total: res.data.paginate_data.totalResults,
        }));
      } catch (error) {
        console.error('Error fetching PT tracker data:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [login.user.user?.group_id, login.user.user?.company_id],
  );

  useEffect(() => {
    fetchPTTrackerData(pagination.pageIndex, pagination.pageSize);
  }, [fetchPTTrackerData, pagination.pageIndex, pagination.pageSize]);

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

  const columns: ColumnDef<PTTrackerData>[] = [
    {
        header: 'Company',
        enableSorting: false,
        accessorKey: 'PtSetup.Company.name',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
      },
      // {
      //   header: 'State',
      //   accessorKey: 'state',
      //   cell: (props) => <div className="w-28 truncate">{props.getValue() as string}</div>,
      // },
      {
        header: 'PT EC Location',
        enableSorting: false,
        accessorKey: 'PtSetup.Location.name',
        cell: (props) => <div className="w-36 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'PT EC Number',
        enableSorting: false,
        accessorKey: 'PtSetup.enroll_number',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
      },
      // {
      //   header: 'Date of Enrolment',
      //   accessorKey: 'dateOfEnrolment',
      //   cell: (props) => (
      //     <div className="w-36 truncate">
      //       {dayjs(props.getValue() as string).format('DD-MM-YYYY')}
      //     </div>
      //   ),
      // },
      // {
      //   header: 'PT EC Enrolment Address',
      //   accessorKey: 'ptEcEnrolmentAddress',
      //   cell: (props) => {
      //     const value = props.getValue() as string;
      //     return (
      //       <Tooltip title={value}>
      //         <div className="w-52 truncate">{value}</div>
      //       </Tooltip>
      //     );
      //   }
      // },
      // {
      //   header: 'Remittance Mode',
      //   accessorKey: 'remittanceMode',
      //   cell: (props) => <div className="w-36 truncate">{props.getValue() as string}</div>,
      // },
      // {
      //   header: 'Frequency',
      //   accessorKey: 'frequency',
      //   cell: (props) => <div className="w-28 truncate">{props.getValue() as string}</div>,
      // },
      {
        header: 'Payroll month',
        enableSorting: false,
        accessorKey: 'period',
        cell: (props) => {
          const date = new Date(props.getValue() as string);
          return (
            <div className="w-32 truncate">
              {date.toLocaleString('default', { month: 'long' })}
            </div>
          );
        }
      },
       {
              header: 'Period',
              enableSorting: false,
              accessorKey: 'period',
              cell: (props) => {
                const periodDate = new Date(props.getValue() as string);
                const frequency = props.row.original.setup_data.State.ptec_frequency;
            
                let periodDisplay = '';
            
                if (frequency === 'half_yearly') {
                  const month = periodDate.getMonth() + 1; // getMonth() returns 0-11, so +1 to make it 1-12
                  if (month >= 4 && month <= 9) {
                    periodDisplay = 'Apr-Sep'; // First half of the financial year
                  } else {
                    periodDisplay = 'Oct-Mar'; // Second half of the financial year
                  }
                } else if (frequency === 'quarterly') {
                  const month = periodDate.getMonth() + 1; // getMonth() returns 0-11, so +1 to make it 1-12
                  if (month >= 4 && month <= 6) {
                    periodDisplay = 'Apr-Jun'; // Q1
                  } else if (month >= 7 && month <= 9) {
                    periodDisplay = 'Jul-Sep'; // Q2
                  } else if (month >= 10 && month <= 12) {
                    periodDisplay = 'Oct-Dec'; // Q3
                  } else {
                    periodDisplay = 'Jan-Mar'; // Q4
                  }
                } else {
                  // Default to showing the full date if frequency is not recognized
                  periodDisplay = dayjs(periodDate).format('DD-MM-YYYY');
                }
            
                return (
                  <div className="w-28 truncate">
                    {periodDisplay}
                  </div>
                );
              }
            },
      {
        header: 'PT Amount As Per Salary Register',
        enableSorting: false,
        accessorKey: 'total_challan_amt',
        cell: (props) => (
          <div className="w-40 truncate">
            ₹{(props.getValue() as number).toLocaleString()}
          </div>
        ),
      },
      {
        header: 'Total Amount Paid',
        enableSorting: false,
        accessorKey: 'total_paid_amt',
        cell: (props) => (
          <div className="w-40 truncate">
            ₹{(props.getValue() as number).toLocaleString()}
          </div>
        ),
      },
      {
        header: 'Difference in Amount',
        enableSorting: false,
        accessorKey: 'difference_amt',
        cell: (props) => (
          <div className="w-44 truncate">
            ₹{(props.getValue() as number).toLocaleString()}
          </div>
        ),
      },
      {
        header: 'Difference Reason',
        enableSorting: false,
        accessorKey: 'difference_reason',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string || '--'}</div>,
      },
      {
        header: 'Due Date',
        enableSorting: false,
        accessorKey: 'payment_due_date',
        cell: (props) => (
          <div className="w-28 truncate">
            {dayjs(props.getValue() as string).format('DD-MM-YYYY')}
          </div>
        ),
      },
      {
        header: 'Date of Payment',
        enableSorting: false,
        accessorKey: 'payment_date',
        cell: (props) => (
          <div className="w-36 truncate">
            {dayjs(props.getValue() as string).format('DD-MM-YYYY')}
          </div>
        ),
      },
      {
        header: 'Delay',
        enableSorting: false,
        accessorKey: 'delay_in_days',
        cell: (props) => <div className="w-28 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Delay Reason',
        enableSorting: false,
        accessorKey: 'delay_reason',
        cell: (props) => <div className="w-36 truncate">{props.getValue() as string || '--'}</div>,
      },
      {
        header: 'Receipt No',
        enableSorting: false,
        accessorKey: 'receipt_no',
        cell: (props) => <div className="w-28 truncate">{props.getValue() as number}</div>,
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
      // {
      //   header: 'Challan',
      //   accessorKey: 'challan',
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
      //           </a>
      //         ) : (
      //           '--'
      //         )}
      //       </div>
      //     );
      //   },
      // },
      {
        header: 'Payment Receipt',
        enableSorting: false,
        accessorKey: 'payment_document',
        cell: (props) => {
          const paymentDocument = props.getValue() as string | null;
          
          const handlePaymentDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            if (paymentDocument) {
              const fullPath = `${import.meta.env.VITE_API_GATEWAY}/${paymentDocument}`;
              window.open(fullPath, '_blank');
            }
          };

          return (
            <div className="w-40 flex items-center">
              {paymentDocument ? (
                <a 
                  href="#" 
                  onClick={handlePaymentDownload} 
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
        header: 'Return',
        enableSorting: false,
        accessorKey: 'pt_return_document',
        cell: (props) => {
          const returnDocument = props.getValue() as string | null;
          
          const handleReturnDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            if (returnDocument) {
              const fullPath = `${import.meta.env.VITE_API_GATEWAY}/${returnDocument}`;
              window.open(fullPath, '_blank');
            }
          };

          return (
            <div className="w-40 flex items-center">
              {returnDocument ? (
                <a 
                  href="#" 
                  onClick={handleReturnDownload} 
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
        header: 'Upload Status',
        enableSorting: false,
        id: 'uploadStatus',
        cell: ({ row }) => {
          const { payment_document, pt_return_document } = row.original;
          const uploadedCount = [payment_document, pt_return_document].filter(Boolean).length;
          return <div className="w-32 truncate">{`${uploadedCount}/2`}</div>;
        },
      },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <ConfigDropdown 
          companyName={row.original.PtSetup.Company.name}
          companyGroupName={row.original.PtSetup.CompanyGroup.name}
          trackerId={row.original.id}
          onRefresh={() => fetchPTTrackerData(pagination.pageIndex, pagination.pageSize)}
        />
      ),
    },
  ];

  const backFunction = () => {
    navigate('/ptec-tracker');
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
        <h2 className="text-2xl font-bold">Uploaded PT EC Tracker Details</h2>
      </div>
      <DataTable
        columns={columns}
        data={data}
        loading={isLoading}
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

export default UploadedPTECDetails;