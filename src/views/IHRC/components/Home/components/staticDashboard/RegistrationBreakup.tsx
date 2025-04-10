

// import { endpoints } from '@/api/endpoint';
// import httpClient from '@/api/http-client';
// import React, { useState, useEffect } from 'react';
// import Chart from 'react-apexcharts';


// interface RegistrationBreakupProps {
//     companyId?: string | number;
//     stateId?: string | number;
//     districtId?: string | number;
//     locationId?: string | number;
//     branchId?: string | number;
//   }

// const RegistrationsBreakup: React.FC<RegistrationBreakupProps> = ({
//   companyId,
//   stateId,
//   districtId,
//   locationId,
//   branchId
// }) => {
//     const [loading, setLoading] = useState(false);
//     const [chartData, setChartData] = useState({
//         categories: ['PF', 'ESI', 'PT', 'LWF', 'S&E RC'],
//         data: [
//             {
//                 name: 'Registrations',
//                 data: [0, 0, 0, 0, 0], // Initialize with zeros
//             },
//         ]
//     });

//     const colors = ['#002D62', '#ffc107', '#00a249', '#0ea5e9', '#8A2BE2']; // Colors for each bar

//     useEffect(() => {
//         const fetchRegistrationData = async () => {
//             setLoading(true);
//             try {
//                 const params: any = {};
//                 if (companyId) params.companyId = companyId;
//                 if (stateId) params.stateId = stateId;
//                 if (districtId) params.districtId = districtId;
//                 if (locationId) params.locationId = locationId;
//                 if (branchId) params.branchId = branchId;
//                 const response = await httpClient.get(endpoints.graph.registerBreakup(), {
//                     params
//                 });
                
//                 setChartData(response.data);
//             } catch (error) {
//                 console.error('Error fetching registration breakup data:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         // Only fetch if at least one filter parameter is provided
//         // if (companyId || stateId || districtId || locationId || branchId) {
//             fetchRegistrationData();
//         // }
//     }, [companyId, stateId, districtId, locationId, branchId]);

//     const options = {
//         chart: {
//             type: 'bar',
//             height: 350,
//         },
//         plotOptions: {
//             bar: {
//                 distributed: true, // This ensures each bar gets a different color
//                 dataLabels: {
//                     position: 'center', // Places the value in the middle of the bar
//                 },
//             },
//         },
//         colors: colors, // Pass the colors array here
//         dataLabels: {
//             enabled: true,
//             style: {
//                 colors: ['#fff'], // White text for better visibility
//                 fontWeight: 'bold',
//             },
//         },
//         xaxis: {
//             categories: chartData.categories, // Labels from API
//         },
//         title: {
//             text: 'Registrations Breakup',
//             align: 'center',
//             style: {
//                 fontSize: '16px',
//                 fontWeight: 'bold',
//             },
//         },
//         tooltip: {
//             y: {
//                 title: {
//                     formatter: function(seriesName, opts) {
//                         // Return the category name instead of the series name
//                         return chartData.categories[opts.dataPointIndex];
//                     }
//                 },
//                 formatter: (val) => `${val}`, // Tooltip formatting
//             },
//         },
//         legend: {
//             show: true,
//             showForSingleSeries: true,
//             customLegendItems: chartData.categories,
//             markers: {
//                 fillColors: colors
//             }
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center p-10">
//           <div className="text-gray-500">Loading remittance data...</div>
//         </div>
//         );
//     }

//     return (
//         <Chart
//             options={options}
//             series={chartData.data}
//             type="bar"
//             height={300}
//         />
//     );
// };

// export default RegistrationsBreakup;



import { endpoints } from '@/api/endpoint';
import httpClient from '@/api/http-client';
import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { Card } from '@/components/ui';
import { HiOutlineViewGrid } from 'react-icons/hi';

interface RegistrationBreakupProps {
    companyId?: string | number;
    stateId?: string | number;
    districtId?: string | number;
    locationId?: string | number;
    branchId?: string | number;
}

const RegistrationsBreakup: React.FC<RegistrationBreakupProps> = ({
    companyId,
    stateId,
    districtId,
    locationId,
    branchId
}) => {
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState({
        categories: ['PF', 'ESI', 'PT', 'LWF', 'S&E RC'],
        data: [
            {
                name: 'Registrations',
                data: [0, 0, 0, 0, 0], // Initialize with zeros
            },
        ]
    });

    const colors = ['#002D62', '#ffc107', '#00a249', '#0ea5e9', '#8A2BE2']; // Colors for each bar

    useEffect(() => {
        const fetchRegistrationData = async () => {
            setLoading(true);
            try {
                const params: any = {};
                if (companyId) params.companyId = companyId;
                if (stateId) params.stateId = stateId;
                if (districtId) params.districtId = districtId;
                if (locationId) params.locationId = locationId;
                if (branchId) params.branchId = branchId;
                const response = await httpClient.get(endpoints.graph.registerBreakup(), {
                    params
                });

                setChartData(response.data);
            } catch (error) {
                console.error('Error fetching registration breakup data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrationData();
    }, [companyId, stateId, districtId, locationId, branchId]);

    // Check if all values in chartData.data[0].data are 0
    const isNoDataAvailable = chartData.data[0].data.every(value => value === 0);

    const options = {
        chart: {
            type: 'bar',
            height: 350,
            events: {
                mouseMove: function(event, chartContext, config) {
                    // This helps with tooltip positioning
                }
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150
                }
            }
        },
        plotOptions: {
            bar: {
                distributed: true, // This ensures each bar gets a different color
                dataLabels: {
                    position: 'center', // Places the value in the middle of the bar
                },
            },
        },
        colors: colors, // Pass the colors array here
        dataLabels: {
            enabled: true,
            style: {
                colors: ['#fff'], // White text for better visibility
                fontWeight: 'bold',
            },
        },
        xaxis: {
            categories: chartData.categories, // Labels from API
        },
        // title: {
        //     text: 'Registrations Breakup',
        //     align: 'center',
        //     style: {
        //         fontSize: '16px',
        //         fontWeight: 'bold',
        //     },
        // },
        tooltip: {
            enabled: true,
        shared: false,
        intersect: false,
            y: {
                title: {
                    formatter: function (seriesName, opts) {
                        // Return the category name instead of the series name
                        return chartData.categories[opts.dataPointIndex];
                    }
                },
                formatter: (val) => `${val}`, // Tooltip formatting
            },
        },
        marker: {
            show: true
        },
        legend: {
            show: true,
            showForSingleSeries: true,
            customLegendItems: chartData.categories,
            markers: {
                fillColors: colors
            }
        }
    };

    return (
        <div >
            <div>
            <h4 className="text-base font-bold text-center mb-4">
            Registrations Breakup
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
                        options={options}
                        series={chartData.data}
                        type="bar"
                        height={300}
                    />
                )}
            </div>
        </div>
    );
};

export default RegistrationsBreakup;