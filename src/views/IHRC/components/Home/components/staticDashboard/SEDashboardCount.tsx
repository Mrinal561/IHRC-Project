// import React from 'react';

// const StatisticCard = ({ icon, bgColor, title, value }) => {
//     return (
//       <div className={`${bgColor} p-4 flex items-center rounded-lg text-white`}>
//         <div className="p-2 rounded-lg h-14 w-14 flex items-center justify-center mr-4 bg-white/20">
//           {React.cloneElement(icon, {
//             fill: "white"
//           })}
//         </div>
//         <div className="flex-1 min-w-0"> {/* Add flex-1 and min-w-0 to allow truncation */}
//           <h3 className="font-semibold text-base text-white whitespace-nowrap overflow-hidden text-ellipsis">
//             {title}
//           </h3>
//           <p className="font-medium opacity-90">{value}</p>
//         </div>
//       </div>
//     );
//   };

// // SE Dashboard Component
// const SEDashboardCount = () => {
//   const seStatistics = [
//     {
//       title: 'Total S&E Registration',
//       value: '15',
//       icon: (
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
//           <path d="M21 19H23V21H1V19H3V4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V19ZM5 19H19V5H5V19ZM8 11H16V13H8V11ZM8 7H16V9H8V7ZM8 15H13V17H8V15Z" />
//         </svg>
//       ),
//       bgColor: 'bg-blue-500',
//     },
//     {
//       title: 'Have Valid Registration',
//       value: '10',
//       icon: (
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
//           <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11.0026 16L18.0737 8.92893L16.6595 7.51472L11.0026 13.1716L8.17421 10.3431L6.75999 11.7574L11.0026 16Z" />
//         </svg>
//       ),
//       bgColor: 'bg-green-500',
//     },
//     {
//       title: 'Applied For',
//       value: '2',
//       icon: (
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
//           <path d="M4 20V4C4 3.44772 4.44772 3 5 3H19C19.5523 3 20 3.44772 20 4V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20ZM16 11H13V8H11V11H8V13H11V16H13V13H16V11Z" />
//         </svg>
//       ),
//       bgColor: 'bg-amber-500',
//     },
//     {
//       title: 'Expired',
//       value: '2',
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
//       <div className="flex flex-wrap gap-4">
//         {seStatistics.map((stat, index) => (
//           <div key={index} className="flex-1 min-w-[240px]">
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

// export default SEDashboardCount;

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

// // SE Dashboard Component
// const SEDashboardCount = () => {
//   const seStatistics = [
//     {
//       title: 'Total S&E Registration',
//       value: '15',
//       icon: (
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
//           <path d="M21 19H23V21H1V19H3V4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V19ZM5 19H19V5H5V19ZM8 11H16V13H8V11ZM8 7H16V9H8V7ZM8 15H13V17H8V15Z" />
//         </svg>
//       ),
//       bgColor: 'bg-blue-500',
//     },
//     {
//       title: 'Have Valid Registration',
//       value: '10',
//       icon: (
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
//           <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11.0026 16L18.0737 8.92893L16.6595 7.51472L11.0026 13.1716L8.17421 10.3431L6.75999 11.7574L11.0026 16Z" />
//         </svg>
//       ),
//       bgColor: 'bg-green-500',
//     },
//     {
//       title: 'Applied For',
//       value: '2',
//       icon: (
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
//           <path d="M4 20V4C4 3.44772 4.44772 3 5 3H19C19.5523 3 20 3.44772 20 4V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20ZM16 11H13V8H11V11H8V13H11V16H13V13H16V11Z" />
//         </svg>
//       ),
//       bgColor: 'bg-amber-500',
//     },
//     {
//       title: 'Expired',
//       value: '2',
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
//         {seStatistics.map((stat, index) => (
//           <div 
//             key={index} 
//             className={`
//               ${seStatistics.length % 2 === 1 && index === seStatistics.length - 1 
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

// export default SEDashboardCount;

import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { Tooltip } from '@/components/ui';
import type { ColumnDef } from '@/components/shared/DataTable';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

interface SEProps {
    companyId?: string | number;
    stateId?: string | number;
    districtId?: string | number;
    locationId?: string | number;
    branchId?: string | number;
  }



const SEDashboardCount: React.FC<SEProps> = ({ 
    companyId, 
    stateId, 
    districtId, 
    locationId, 
    branchId 
  }) => {

    const [seData, setSeData] = useState([]);
          const [loading, setLoading] = useState<boolean>(true);


          useEffect(() => {
            const fetchSEdata = async () => {
                try {
                    const params: any = {};
                if (companyId) params.companyId = companyId;
                if (stateId) params.stateId = stateId;
                if (districtId) params.districtId = districtId;
                if (locationId) params.locationId = locationId;
                if (branchId) params.branchId = branchId;
                    const response = await httpClient.get(endpoints.graph.branchSEStatus(), {
                        params
                    });
                    setSeData(response.data);
                } catch (error) {
                    console.error('Error fetching S&E Data:', error);
                } finally {
                    setLoading(false);
                  }
            };
    
            // if (companyId || stateId || districtId || locationId || branchId) {
                fetchSEdata();
            // }
        }, [companyId, stateId, districtId, locationId, branchId]);

        

    const columns = useMemo(
        () => [
            {
                header: 'Status',
                enableSorting: false,
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original;

                    const value = props.getValue() as string;
                    const textColorClass = 
                        value === 'Expired' ? 'text-red-600' : 
                        value === 'Valid' ? 'text-green-600' : 
                        '';
                    return (
                        <Tooltip title={value} placement="top">
                            <div className= {`font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200 text-xs w-10.5 ${textColorClass}`}>
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
            //     enableSorting: false,
            //     accessorKey: 'ph',
            //     cell: (props) => {
            //         const row = props.row.original;

            //         const value = props.getValue() as string;
            //         const textColorClass = value === 'Expired' ? 'text-red-600' : '';
            //         return (
            //             <Tooltip title={value} placement="top">
            //                 <div className= {`font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200 text-xs ${textColorClass}`}>
            //                     {value.length > 18
            //                         ? value.substring(0, 18) + '...'
            //                         : value}
            //                 </div>
            //             </Tooltip>
            //         );
            //     },
            // },
            // {
            //     header: 'VR',
            //     enableSorting: false,
            //     accessorKey: 'vr',
            //     cell: (props) => {
            //         const value = props.getValue() as string;
            //         const row = props.row.original;
            //         const textColorClass = value === 'Expired' ? 'text-red-600' : '';

            //         return (
            //             <Tooltip title={value} placement="top">
            //                 <div className= {`font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200 text-xs ${textColorClass}`}>
            //                     {value.length > 18
            //                         ? value.substring(0, 18) + '...'
            //                         : value}
            //                 </div>
            //             </Tooltip>
            //         );
            //     },
            // },
            {
                header: 'Total',
                accessorKey: 'value',
                enableSorting: false,
                cell: (props) => {
                    const row = props.row.original;
                    const value = props.getValue() as string;   
                    let textColorClass = 'text-gray-700';
                    if (row.name.toLowerCase() === 'expired') {
                        textColorClass = 'text-red-600'; // Yellow for Rented
                    } else if (row.name.toLowerCase() === 'valid') {
                        textColorClass = 'text-green-600'; // Blue for Owned
                    } 
                     return (
                        <Tooltip title={value} placement="top">
                            <div  className={`inline-flex items-center py-2 rounded-full text-xs font-semibold ${textColorClass}`}>
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
        <div className="w-full  overflow-x-auto py-2 bg-white rounded-lg shadow-lg border table-home">
            <h2 className="text-base text-center font-semibold mb-2 mt-0">Branches S&E Status</h2>
            <DataTable
                columns={columns}
                data={seData}
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

export default SEDashboardCount;















// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const BranchSEStatus = () => {
//   const [data, setData] = useState([
//     { name: 'Valid', value: '0' },
//     { name: 'Expired', value: '0' },
//     { name: 'Total', value: '0' },
//   ]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('/companyadmin/graph/branch-se-status', {
//           params: { companyId: 1 }, // Replace with actual company ID
//         });
//         setData(response.data);
//       } catch (error) {
//         console.error('Error fetching branch S&E status:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div>
//       <h2>Branch S&E Status</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Status</th>
//             <th>Count</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr key={index}>
//               <td>{item.name}</td>
//               <td>{item.value}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default BranchSEStatus;