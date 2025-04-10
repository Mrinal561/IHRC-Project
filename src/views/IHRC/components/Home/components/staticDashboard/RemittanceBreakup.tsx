// import React, { useState, useEffect } from 'react';
// import Chart from 'react-apexcharts';
// import httpClient from '@/api/http-client';
// import { endpoints } from '@/api/endpoint';
// import { Card } from '@/components/ui';


// const FINANCIAL_YEAR_KEY = 'selectedFinancialYear'
// const FINANCIAL_YEAR_CHANGE_EVENT = 'financialYearChanged'
// interface RemittanceBreakupProps {
//   companyId?: string | number;
//   stateId?: string | number;
//   districtId?: string | number;
//   locationId?: string | number;
//   branchId?: string | number;
// }

// interface RemittanceData {
//   pf: number;
//   esi: number;
//   pt: number;
//   lwf: number;
// }

// const RemittanceBreakup: React.FC<RemittanceBreakupProps> = ({
//   companyId,
//   stateId,
//   districtId,
//   locationId,
//   branchId
// }) => {
//   const [loading, setLoading] = useState<boolean>(true);
//   const [remittanceData, setRemittanceData] = useState<RemittanceData>({
//     pf: 0,
//     esi: 0,
//     pt: 0,
//     lwf: 0
//   });

//   const [financialYear, setFinancialYear] = useState<string | null>(
//       sessionStorage.getItem(FINANCIAL_YEAR_KEY),
//     );

//   useEffect(() => {
//     const fetchRemittanceData = async () => {
//       setLoading(true);
//       try {
//         const params: any = {};
//         if (companyId) params.companyId = companyId;
//         if (stateId) params.stateId = stateId;
//         if (districtId) params.districtId = districtId;
//         if (locationId) params.locationId = locationId;
//         if (branchId) params.branchId = branchId;
//         const response = await httpClient.get(endpoints.graph.remittanceBreakup(), {
//           params
//         });

//         setRemittanceData(response.data);
//       } catch (error) {
//         console.error('Error fetching remittance breakup data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRemittanceData();
//   }, [companyId, stateId, districtId, locationId, branchId]);

//   // Transform API data to chart format
//   const data = [
//     {
//       name: '₹',
//       data: [
//         remittanceData.pf,
//         remittanceData.esi,
//         remittanceData.pt,
//         remittanceData.lwf
//       ]
//     }
//   ];

//   const colors = {
//     pf: '#002D62',     // Pure blue for PF
//     esi: '#ffc107',    // Orange for ESI
//     pt: '#00a249',     // Green for PT
//     lwf: '#0ea5e9'     // Sky blue for LWF
//   };

//   // Find maximum value for x-axis with some buffer
//   const maxValue = Math.max(
//     remittanceData.pf,
//     remittanceData.esi,
//     remittanceData.pt,
//     remittanceData.lwf
//   );
//   const xAxisMax = maxValue > 0 ? maxValue * 1.2 : 150000; // 20% buffer or default

//   // Check if all values in remittanceData are 0
//   const isNoDataAvailable = Object.values(remittanceData).every(value => value === 0);

//   return (
//     <div>
//       <div>
//         {loading ? (
//           <div className="py-10 text-gray-400 text-center">Loading remittance data...</div>
//         ) : isNoDataAvailable ? (
//           <div className="py-10 text-gray-400 flex justify-center items-center">
//             <p>No Data Available</p></div>
//         ) : (
//           <Chart
//             options={{
//               title: {
//                 text: 'YTD Remittance Breakup',
//                 align: 'center',
//                 style: {
//                   fontSize: '16px',
//                   fontWeight: 'bold',
//                   fontFamily: 'Arial'
//                 },
//               },
//               plotOptions: {
//                 bar: {
//                   horizontal: true,
//                   distributed: true,
//                 },
//               },
//               colors: [colors.pf, colors.esi, colors.pt, colors.lwf],
//               dataLabels: {
//                 enabled: false,
//               },
//               xaxis: {
//                 categories: ['PF', 'ESI', 'PT', 'LWF'],
//                 labels: {
//                   formatter: function (value) {
//                     const num = Number(value);
//                     if (num >= 100000) {
//                       return (num / 100000).toFixed(1) + 'L';
//                     } else if (num >= 1000) {
//                       return (num / 1000).toFixed(1) + 'K';
//                     } else {
//                       return '₹' + num;
//                     }
//                   }
//                 },
//                 max: xAxisMax
//               },
//               tooltip: {
//                 enabled: true,
//                 intersect: false,
//                 shared: false,
//                 y: {
//                   formatter: function (value) {
//                     return value.toLocaleString('en-IN');
//                   }
//                 },
//                 // onDatasetHover: {
//                 //   highlightDataSeries: true
//                 // }
//               },
//               legend: {
//                 show: true,
//                 position: 'right'
//               },
//             }}
//             series={data}
//             type="bar"
//             height={300}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default RemittanceBreakup;



import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { HiOutlineViewGrid } from 'react-icons/hi';

const FINANCIAL_YEAR_KEY = 'selectedFinancialYear';
const FINANCIAL_YEAR_CHANGE_EVENT = 'financialYearChanged';

interface RemittanceBreakupProps {
  companyId?: string | number;
  stateId?: string | number;
  districtId?: string | number;
  locationId?: string | number;
  branchId?: string | number;
}

interface RemittanceData {
  pf: number;
  esi: number;
  pt: number;
  lwf: number;
}

const RemittanceBreakup: React.FC<RemittanceBreakupProps> = ({
  companyId,
  stateId,
  districtId,
  locationId,
  branchId
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [remittanceData, setRemittanceData] = useState<RemittanceData>({
    pf: 0,
    esi: 0,
    pt: 0,
    lwf: 0
  });
  const [financialYear, setFinancialYear] = useState<string | null>(
    sessionStorage.getItem(FINANCIAL_YEAR_KEY)
  );

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

  useEffect(() => {
    const fetchRemittanceData = async () => {
      if (!financialYear) return;
      
      setLoading(true);
      try {
        const params: any = { financialYear };
        
        if (companyId) params.companyId = companyId;
        if (stateId) params.stateId = stateId;
        if (districtId) params.districtId = districtId;
        if (locationId) params.locationId = locationId;
        if (branchId) params.branchId = branchId;

        const response = await httpClient.get(endpoints.graph.remittanceBreakup(), {
          params
        });

        setRemittanceData(response.data);
      } catch (error) {
        console.error('Error fetching remittance breakup data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRemittanceData();
  }, [companyId, stateId, districtId, locationId, branchId, financialYear]);

  // Transform API data to chart format
  const data = [
    {
      name: '₹',
      data: [
        remittanceData.pf,
        remittanceData.esi,
        remittanceData.pt,
        remittanceData.lwf
      ]
    }
  ];

  const colors = {
    pf: '#002D62',     // Pure blue for PF
    esi: '#ffc107',    // Orange for ESI
    pt: '#00a249',     // Green for PT
    lwf: '#0ea5e9'     // Sky blue for LWF
  };

  // Find maximum value for x-axis with some buffer
  const maxValue = Math.max(
    remittanceData.pf,
    remittanceData.esi,
    remittanceData.pt,
    remittanceData.lwf
  );
  const xAxisMax = maxValue > 0 ? maxValue * 1.2 : 150000; // 20% buffer or default

  // Check if all values in remittanceData are 0
  const isNoDataAvailable = Object.values(remittanceData).every(value => value === 0);

  return (
    <div>
      <h4 className="text-base font-bold text-center mb-4">
        YTD Remittance Breakup {financialYear ? `for ${financialYear}` : ''}
      </h4>

      {loading ? (
        <div className="py-10 text-gray-400 text-center">Loading remittance data...</div>
      ) : isNoDataAvailable ? (
        <div className="flex items-center justify-center min-h-[300px] w-full">
          <div className="flex flex-col items-center justify-center text-gray-500">
            <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-center">No Data Available</p>
          </div>
        </div>
      ) : (
        <Chart
          options={{
            plotOptions: {
              bar: {
                horizontal: true,
                distributed: true,
              },
            },
            colors: [colors.pf, colors.esi, colors.pt, colors.lwf],
            dataLabels: {
              enabled: false,
            },
            xaxis: {
              categories: ['PF', 'ESI', 'PT', 'LWF'],
              labels: {
                formatter: function (value) {
                  const num = Number(value);
                  if (num >= 100000) {
                    return (num / 100000).toFixed(1) + 'L';
                  } else if (num >= 1000) {
                    return (num / 1000).toFixed(1) + 'K';
                  } else {
                    return '₹' + num;
                  }
                }
              },
              max: xAxisMax
            },
            tooltip: {
              enabled: true,
              intersect: false,
              shared: false,
              y: {
                formatter: function (value) {
                  return value.toLocaleString('en-IN');
                }
              },
            },
            legend: {
              show: true,
              position: 'right'
            },
          }}
          series={data}
          type="bar"
          height={300}
        />
      )}
    </div>
  );
};

export default RemittanceBreakup;