// // import React from 'react';

// // const StatisticCard = ({ icon, bgColor, title, value }) => {
// //     return (
// //       <div className={`${bgColor} p-4 flex items-center rounded-lg text-white`}>
// //         <div className="p-2 rounded-lg h-14 w-14 flex items-center justify-center mr-4 bg-white/20">
// //           {React.cloneElement(icon, {
// //             fill: "white"
// //           })}
// //         </div>
// //         <div className="flex-1 min-w-0"> {/* Add flex-1 and min-w-0 to allow truncation */}
// //           <h3 className="font-semibold text-base text-white whitespace-nowrap overflow-hidden text-ellipsis">
// //             {title}
// //           </h3>
// //           <p className="font-medium opacity-90">{value}</p>
// //         </div>
// //       </div>
// //     );
// //   };

// // // Rental Deposits Dashboard
// // const RentalDepositsDashboard = () => {
// //   const depositStatistics = [
// //     {
// //       title: 'Total Agreements',
// //       value: '1000',
// //       icon: (
// //         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
// //           <path d="M21 19H23V21H1V19H3V4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V19ZM5 19H19V5H5V19ZM8 11H16V13H8V11ZM8 7H16V9H8V7ZM8 15H13V17H8V15Z" />
// //         </svg>
// //       ),
// //       bgColor: 'bg-blue-500',
// //     },
// //     {
// //       title: 'Valid Agreement',
// //       value: '800',
// //       icon: (
// //         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
// //           <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11.0026 16L18.0737 8.92893L16.6595 7.51472L11.0026 13.1716L8.17421 10.3431L6.75999 11.7574L11.0026 16Z" />
// //         </svg>
// //       ),
// //       bgColor: 'bg-green-500',
// //     },
// //     {
// //       title: 'Expired Agreement',
// //       value: '200',
// //       icon: (
// //         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
// //           <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM13 8V14H11V8H13ZM13 16V18H11V16H13Z" />
// //         </svg>
// //       ),
// //       bgColor: 'bg-red-500',
// //     },
// //   ];

// //   return (
// //     <div className="space-y-4">
// //       <div className="flex flex-wrap gap-4">
// //         {depositStatistics.map((stat, index) => (
// //           <div key={index} className="flex-1 min-w-[240px]">
// //             <StatisticCard
// //               icon={stat.icon}
// //               bgColor={stat.bgColor}
// //               title={stat.title}
// //               value={stat.value}
// //             />
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };


// // export default  RentalDepositsDashboard;

// import { Tooltip } from '@/components/ui';
// import React from 'react';

// const StatisticCard = ({ icon, bgColor, title, value }) => {
//   return (
//     <div className={`${bgColor} p-4 flex items-center rounded-lg text-white h-full`}>
//       <div className="p-2 rounded-lg h-14 w-14 flex items-center justify-center mr-4 bg-white/20">
//         {React.cloneElement(icon, {
//           fill: "white"
//         })}
//       </div>
//       <div className="flex-1 min-w-0">
//         <h3 className="font-semibold text-sm text-white">
     
//           {title}
//         </h3>
//         <p className="font-medium opacity-90">{value}</p>
//       </div>
//     </div>
//   );
// };

// // Rental Deposits Dashboard
// const RentalDepositsDashboard = () => {
//   const depositStatistics = [
//     {
//       title: 'Total Agreements',
//       value: '1000',
//       icon: (
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
//           <path d="M21 19H23V21H1V19H3V4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V19ZM5 19H19V5H5V19ZM8 11H16V13H8V11ZM8 7H16V9H8V7ZM8 15H13V17H8V15Z" />
//         </svg>
//       ),
//       bgColor: 'bg-blue-500',
//     },
//     {
//       title: 'Valid Agreement',
//       value: '800',
//       icon: (
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
//           <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11.0026 16L18.0737 8.92893L16.6595 7.51472L11.0026 13.1716L8.17421 10.3431L6.75999 11.7574L11.0026 16Z" />
//         </svg>
//       ),
//       bgColor: 'bg-green-500',
//     },
//     {
//       title: 'Expired Agreement',
//       value: '200',
//       icon: (
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
//           <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM13 8V14H11V8H13ZM13 16V18H11V16H13Z" />
//         </svg>
//       ),
//       bgColor: 'bg-red-500',
//     },
//   ];

//   return (
//     <div className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {depositStatistics.map((stat, index) => (
//           <div 
//             key={index} 
//             className={`
//               ${depositStatistics.length % 2 === 1 && index === depositStatistics.length - 1 
//                 ? "md:col-span-2" 
//                 : ""}
//             `}
//           >
//             <StatisticCard
//               icon={stat.icon}
//               bgColor={stat.bgColor}
//               title={stat.title}
//               value={stat.value}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RentalDepositsDashboard;



// import React, { useMemo } from 'react';
// import DataTable from '@/components/shared/DataTable';
// import { Tooltip } from '@/components/ui';
// import type { ColumnDef } from '@/components/shared/DataTable';

// const RentalDepositsDashboard = () => {
//     const depositsData = [
        
//         {
//             name: 'Valid',
//             ph: '110',
//             vr: '50',
//             value: '800',
//         },
//         {
//             name: 'Expired',
//             ph: '110',
//             vr: '50',
//             value: '200',
//             badgeColor: 'text-red-600',
//         },
//         {
//             name: 'Total',
//             ph: '110',
//             vr: '50',
//             value: '1000',
//         },
//     ];

//     const columns: ColumnDef<typeof depositsData[0]>[] = useMemo(
//         () => [
//             {
//                 header: 'Status',
//                 accessorKey: 'name',
//                 enableSorting: false,
//                 cell: (props) => {
//                     const value = props.getValue() as string;
//                     const row = props.row.original;

//                     return (
//                         <Tooltip title={value} placement="top">
//                            <div className={ `w-12 font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200 text-xs ${row.badgeColor}`}>
//                                 {value.length > 30
//                                     ? value.substring(0, 30) + '...'
//                                     : value}
//                             </div>
//                         </Tooltip>
//                     );
//                 },
//             },
//             {
//                 header: 'PH',
//                 accessorKey: 'ph',
//                 enableSorting: false,
//                 cell: (props) => {
//                     const row = props.row.original;
//                                        const value = props.getValue() as string;
//                                        return (
//                                            <Tooltip title={value} placement="top">
//                                                <div
//                                                    className={`w-2 inline-flex items-center py-1 rounded-full text-xs font-semibold ${row.badgeColor}`}>
//                                 {value.length > 18
//                                     ? value.substring(0, 18) + '...'
//                                     : value}
//                             </div>
//                         </Tooltip>
//                     );
//                 },
//             },
//             {
//                 header: 'VR',
//                 accessorKey: 'vr',
//                 enableSorting: false,
//                 cell: (props) => {
//                     const row = props.row.original;
//                                        const value = props.getValue() as string;
//                                        return (
//                                            <Tooltip title={value} placement="top">
//                                                <div
//                                                    className={`inline-flex items-center w-2 py-1 rounded-full text-xs font-semibold ${row.badgeColor}`}>
//                                 {value.length > 18
//                                     ? value.substring(0, 18) + '...'
//                                     : value}
//                             </div>
//                         </Tooltip>
//                     );
//                 },
//             },
//             {
//                 header: 'Count',
//                 accessorKey: 'value',
//                 enableSorting: false,
//                 cell: (props) => {
//                     const row = props.row.original;
//                                        const value = props.getValue() as string;
//                                        return (
//                                            <Tooltip title={value} placement="top">
//                                                <div
//                                                    className={`inline-flex items-center py-1 rounded-full text-xs font-semibold ${row.badgeColor}`}>
//                                 {value.length > 18
//                                     ? value.substring(0, 18) + '...'
//                                     : value}
//                             </div>
//                         </Tooltip>
//                     );
//                 },
//             },
//         ],
//         []
//     );

//     return (
//         <div className="w-full overflow-x-auto py-2 p-1 bg-white rounded-lg shadow-lg border">
//                                     <h2 className="text-base text-center font-semibold  mb-4 mt-2">Agreement Status</h2>

//             <DataTable
//                 columns={columns}
//                 data={depositsData}
//                 skeletonAvatarColumns={[0]}
//                 skeletonAvatarProps={{ className: 'rounded-md' }}
//                 loading={false}
//                 stickyHeader={true}
//                 selectable={false}
//                 showPageSizeSelector={false} 
//             />
//         </div>
//     );
// };

// export default RentalDepositsDashboard;




import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { Tooltip } from '@/components/ui';
import type { ColumnDef } from '@/components/shared/DataTable';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

// Define type for deposit data (without badgeColor since it's not from API)
interface AgreementStatusProps {
    companyId?: string | number;
    stateId?: string | number;
    districtId?: string | number;
    locationId?: string | number;
    branchId?: string | number;
  }

  
const RentalDepositsDashboard: React.FC<AgreementStatusProps> = ({ 
    companyId, 
    stateId, 
    districtId, 
    locationId, 
    branchId 
  })  => {
    const [depositsData, setDepositData] = useState([]);
      const [loading, setLoading] = useState<boolean>(true);
    

    // Fetch data from the API
    useEffect(() => {
        const fetchAgreementStatus = async () => {
            try {
                const params: any = {};
                if (companyId) params.companyId = companyId;
                if (stateId) params.stateId = stateId;
                if (districtId) params.districtId = districtId;
                if (locationId) params.locationId = locationId;
                if (branchId) params.branchId = branchId;
                const response = await httpClient.get(endpoints.graph.agreementStatus(), {
                    params
                });
                setDepositData(response.data);
            } catch (error) {
                console.error('Error fetching Agreement Status Data:', error);
            } finally {
                setLoading(false);
              }
        };

        // if (companyId || stateId || districtId || locationId || branchId) {
            fetchAgreementStatus();
        // }
    }, [companyId, stateId, districtId, locationId, branchId]);

    const columns = useMemo(
        () => [
            {
                header: 'Status',
                accessorKey: 'name',
                enableSorting: false,
                cell: (props) => {
                    const value = props.getValue() as string;
                    // Apply text-red-600 class only if status is "Expired"
                    const textColorClass = 
                        value === 'Expired' ? 'text-red-600' : 
                        value === 'Valid' ? 'text-green-600' : 
                        '';

                    return (
                        <Tooltip title={value} placement="top">
                            <div className={`w-10.5 font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200 text-xs ${textColorClass}`}>
                                {value.length > 30
                                    ? value.substring(0, 30) + '...'
                                    : value}
                            </div>
                        </Tooltip>
                    );
                },
            },
            // {
            //     header: 'PH',
            //     accessorKey: 'ph',
            //     enableSorting: false,
            //     cell: (props) => {
            //         const row = props.row.original;
            //         const value = props.getValue() as string || '';
            //         // Apply text-red-600 class only if row's name is "Expired"
            //         const textColorClass = row.name === 'Expired' ? 'text-red-600' : '';
                    
            //         return (
            //             <Tooltip title={value} placement="top">
            //                 <div className={`font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200 text-xs ${textColorClass}`}>
            //                     {value && value.length > 18
            //                         ? value.substring(0, 18) + '...'
            //                         : value}
            //                 </div>
            //             </Tooltip>
            //         );
            //     },
            // },
            // {
            //     header: 'VR',
            //     accessorKey: 'vr',
            //     enableSorting: false,
            //     cell: (props) => {
            //         const row = props.row.original;
            //         const value = props.getValue() as string || '';
            //         // Apply text-red-600 class only if row's name is "Expired"
            //         const textColorClass = row.name === 'Expired' ? 'text-red-600' : '';
                    
            //         return (
            //             <Tooltip title={value} placement="top">
            //                 <div className={`inline-flex items-center rounded-full text-xs font-semibold ${textColorClass}`}>
            //                     {value && value.length > 18
            //                         ? value.substring(0, 18) + '...'
            //                         : value}
            //                 </div>
            //             </Tooltip>
            //         );
            //     },
            // },
            {
                header: 'Total',
                accessorKey: 'total',
                enableSorting: false,
                cell: (props) => {
                    const row = props.row.original;
                    const value = props.getValue() as string;
                    // Apply text-red-600 class only if row's name is "Expired"
                    const textColorClass = row.name === 'Expired' ? 'text-red-600' : '';
                    
                    return (
                        <Tooltip title={value} placement="top">
                            <div className={`inline-flex items-center py-2 rounded-full text-xs font-semibold ${textColorClass}`}>
                                {value.length > 18
                                    ? value.substring(0, 18) + '...'
                                    : value}
                            </div>
                        </Tooltip>
                    );
                },
            },
        ],
        []
    );

    return (
        <div className="w-full overflow-x-auto py-2 bg-white rounded-lg shadow-lg border table-home">
            <h2 className="text-base text-center font-semibold mb-2 mt-0">Agreement Status</h2>
            <DataTable
                columns={columns}
                data={depositsData}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ className: 'rounded-md' }}
                loading={loading}
                stickyHeader={true}
                selectable={false}
                showPageSizeSelector={false}
            />
        </div>
    );
};

export default RentalDepositsDashboard;