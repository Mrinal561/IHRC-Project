// import Chart from 'react-apexcharts';

// const NoticeStatusPie = () => {
//     return (
//         <Chart
//             options={{
//                 colors: ['#040273', '#FF0000', '#056608'],  // Blue, Amber, Green
//                 labels: ['Total Notice', 'Open', 'Closed'],
//                 legend: {
//                     position: 'top',  // Move legend to the top
//                 },
//                 responsive: [
//                     {
//                         breakpoint: 480,
//                         options: {
//                             chart: {
//                                 width: 300,  // Adjusted width for smaller screens
//                             },
//                             legend: {
//                                 position: 'top',  // Ensure legend stays at the top on smaller screens
//                             },
//                         },
//                     },
//                 ],
//                 chart: {
//                     width: '100%',  // Makes the chart responsive
//                 },
//                 title: {
//                     text: 'Notice Status',
//                     align: 'center',
//                     style: {
//                         fontSize: '20px',
//                         fontWeight: 'bold'
//                     },
//                     offsetY:5,  // Add spacing below the title
//                 }
//             }}
//             series={[100, 30, 70]}  // Total Notice, Open, Closed
//             height={300}  // Increased height
//             type="pie"
//         />
//     );
// };

// export default NoticeStatusPie;




// import Chart from 'react-apexcharts';
// import { Card } from '@/components/ui/card';
// import { ApexOptions } from 'apexcharts';

// const NoticeStatusPie = () => {
//   const data = {
//     series: [ 200, 70],  // Total Notice, Open, Closed
//     labels: [ 'Open', 'Closed']
//   };

//   const options: ApexOptions = {
//     chart: {
//       type: 'pie',
//       background: 'transparent'
//     },
//     colors: ['#ff3d00', '#00c853'],  // Blue, Red, Green
//     labels: data.labels,
//     legend: {
//       position: 'top',
//       horizontalAlign: 'center',
//       fontSize: '14px',
//       markers: {
//         offsetX: 0,
//         offsetY: 0
//       },
//       itemMargin: {
//         horizontal: 10,
//         vertical: 5
//       }
//     },
//     plotOptions: {
//       pie: {
//         startAngle: 0,
//         endAngle: 360,
//         expandOnClick: true,
//         offsetX: 0,
//         offsetY: 0,
//         customScale: 1,
//         dataLabels: {
//           offset: 0
//         },
//         donut: {
//           size: '0%'
//         }
//       }
//     },
//     stroke: {
//       show: true,
//       width: 2,
//       colors: ['#fff']
//     },
//     dataLabels: {
//       enabled: true,
//       formatter: function(val: number) {
//         if (typeof val === 'number') {
//           return val.toFixed(1) ;
//         }
//         return '';
//       },
//       style: {
//         fontSize: '16px',
//         fontWeight: '600',
//         colors: ['#fff']
//       },
//       background: {
//         enabled: false
//       },
//       dropShadow: {
//         enabled: false
//       }
//     },
//     tooltip: {
//       enabled: true,
//     //   y: {
//     //     formatter: function(val: number) {
//     //       return val 
//     //     }
//     //   }
//     },
//     responsive: [{
//       breakpoint: 480,
//       options: {
//         chart: {
//           width: '100%'
//         },
//         legend: {
//           position: 'top'
//         }
//       }
//     }]
//   };

//   const header = (
//     <div className="w-full">
//       <h4 className="text-xl text-center font-bold">Notice Status</h4>
//     </div>
//   );

//   const footer = (
//     <div className="grid grid-cols-3 gap-4 flex justify-center items-center">
//       {data.labels.map((label, index) => (
//         <div key={label} className="bg-gray-50 p-3 rounded-lg text-center">
//           <div className="text-sm font-medium text-gray-600">{label}</div>
//           <div 
//             className="text-lg font-bold mt-1" 
//             style={{ color: options.colors?.[index] }}
//           >
//             {data.series[index]}
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   return (
//     <Card 
//       className="w-full max-w-2xl mx-auto border-none"
//       header={header}
//       footer={footer}
//       headerBorder={true}
//       footerBorder={true}
//       bordered={true}
//     >
//       <div className="p-4">
//         <Chart
//           options={options}
//           series={data.series}
//           type="pie"
//           height={350}
//         />
//       </div>
//     </Card>
//   );
// };

// export default NoticeStatusPie;




// import Chart from 'react-apexcharts';
// import { Card } from '@/components/ui/card';
// import { ApexOptions } from 'apexcharts';

// const NoticeStatusPie = () => {
//   const data = {
//     series: [200, 70],   // Total Notice, Open, Closed
//     labels: ['Open', 'Closed']
//   };

//   const options: ApexOptions = {
//     chart: {
//       type: 'pie',
//       background: 'transparent'
//     },
//     colors: ['#ff3d00', '#00c853'],
//     labels: data.labels,
//     legend: {
//       position: 'top',
//       horizontalAlign: 'center',
//       fontSize: '14px',
//       markers: {
//         offsetX: 0,
//         offsetY: 0
//       },
//       itemMargin: {
//         horizontal: 10,
//         vertical: 5
//       }
//     },
//     plotOptions: {
//       pie: {
//         startAngle: 0,
//         endAngle: 360,
//         expandOnClick: true,
//         offsetX: 0,
//         offsetY: 0,
//         customScale: 1,
//         dataLabels: {
//           offset: 0
//         },
//         donut: {
//           size: '0%'
//         }
//       }
//     },
//     stroke: {
//       show: true,
//       width: 2,
//       colors: ['#fff']
//     },
//     dataLabels: {
//       enabled: true,
//       formatter: function(val: number) {
//         if (typeof val === 'number') {
//           return val.toFixed(1) ;
//         }
//         return '';
//       },
//       style: {
//         fontSize: '16px',
//         fontWeight: '600',
//         colors: ['#fff']
//       },
//       background: {
//         enabled: false
//       },
//       dropShadow: {
//         enabled: false
//       }
//     },
//     tooltip: {
//       enabled: true,
//       y: {
//         formatter: function(val: number) {
//           return val.toString(); // Show only the value
//         }
//       }
//     },
//     responsive: [{
//       breakpoint: 480,
//       options: {
//         chart: {
//           width: '100%'
//         },
//         legend: {
//           position: 'top'
//         }
//       }
//     }]
//   };

//   const header = (
//     <div className="w-full">
//       <h4 className="text-xl text-center font-bold">
//         Notice Status
//       </h4>
//     </div>
//   );

//   const footer = (
//     <div className="flex justify-center mx-10">
//       <div className="grid grid-cols-2 gap-4"> {/* Adjusted to 2 columns */}
//         {data.labels.map((label, index) => (
//           <div key={label} className="bg-gray-50 p-3 rounded-lg text-center">
//             <div className="text-sm font-medium text-gray-600">{label}</div>
//             <div 
//               className="text-lg font-bold mt-1" 
//               style={{ color: options.colors?.[index] }}
//             >
//               {data.series[index]}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   return (
//     <Card 
//       className="w-full max-w-2xl mx-auto border-none"
//       header={header}
//       footer={footer}
//       headerBorder={true}
//       footerBorder={true}
//       bordered={true}
//     >
//       <div className="p-4">
//         <Chart
//           options={options}
//           series={data.series}
//           type="pie"
//           height={350}
//         />
//       </div>
//     </Card>
//   );
// };

// export default NoticeStatusPie;













import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { Card } from '@/components/ui';
import { ApexOptions } from 'apexcharts';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { HiOutlineViewGrid } from 'react-icons/hi';

interface NoticeStatusProps {
  companyId?: string | number;
  stateId?: string | number;
  districtId?: string | number;
  locationId?: string | number;
  branchId?: string | number;
}

interface NoticeStatusData {
  series: number[];
  labels: string[];
}


const NoticeStatusPie: React.FC<NoticeStatusProps> = ({ 
  companyId, 
  stateId, 
  districtId, 
  locationId, 
  branchId 
}) => {
  // State for chart data
  const [chartData, setChartData] = useState<NoticeStatusData>({
    series: [0, 0],   // Default values before API response (Expired, Valid)
    labels: ['Open', 'Closed']
  });
  
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch data from API
  useEffect(() => {
    const fetchAgreementStatus = async () => {
      setLoading(true);
      try {
        const params: any = {};
                if (companyId) params.companyId = companyId;
                if (stateId) params.stateId = stateId;
                if (districtId) params.districtId = districtId;
                if (locationId) params.locationId = locationId;
                if (branchId) params.branchId = branchId;
        const response = await httpClient.get(endpoints.graph.noticeStatusGraph(), {
          params
        });
        
        setChartData(response.data);
      } catch (error) {
        console.error('Error fetching Notice Graph Data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if at least one filter parameter is provided
    // if (companyId || stateId || districtId || locationId || branchId) {
      fetchAgreementStatus();
    // }
  }, [companyId, stateId, districtId, locationId, branchId]);

  const options: ApexOptions = {
    chart: {
      type: 'pie',
      background: 'transparent'
    },
    // colors: ['#ed3237', '#059669'],
    colors: [ '#d20000', '#00a249',],    
    labels: chartData.labels,
    legend: {
      show: false
    },
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        expandOnClick: true,
        offsetX: 0,
        offsetY: 0,
        customScale: 1,
        dataLabels: {
          offset: 0
        },
        donut: {
          size: '0%'
        }
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['#fff']
    },
    dataLabels: {
      enabled: false,
      formatter: function(val: number) {
        if (typeof val === 'number') {
          return val.toFixed(1);
        }
        return '';
      },
      style: {
        fontSize: '16px',
        fontWeight: '600',
        colors: ['#fff']
      },
      background: {
        enabled: false
      },
      dropShadow: {
        enabled: false
      }
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function(val: number) {
          return val.toString();
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: '100%'
        },
        legend: {
          position: 'top'
        }
      }
    }]
  };

  const header = (
    <div className="w-full">
      <div className="flex justify-center items-center px-0 py-0">
        <h4 className="text-base font-semibold text-center mb-0 mt-0">
          Notice Status
        </h4>      
      </div>
    </div>
  );
  const isNoDataAvailable = chartData.series.every(value => value === 0);


  return (
    <Card 
         className="w-full max-w-2xl mx-auto border-none p-0 custom-card-home"
         header={header}
         // footer={footer}
         headerBorder={true}
         footerBorder={true}
         bordered={true}
       >
         <div className="p-0 flex justify-center items-center">
           {loading ? (
                             <div className="py-10 text-gray-400 text-center">Loading remittance data...</div>
                           ) : isNoDataAvailable ? (
                             <div className="flex items-center justify-center pt-4 w-full">
                               <div className="flex flex-col items-center justify-center text-gray-500">
                              <HiOutlineViewGrid className="w-8 h-8 mb-4 text-gray-300" />
                                 <p className="text-center">No Data Available</p>
                               </div>
                             </div>
                           ) : (
             <Chart
               options={options}
               series={chartData.series}
               type="pie"
               height={180}
               width={180}
             />
           )}
         </div>
       </Card>
  );
};

export default NoticeStatusPie;