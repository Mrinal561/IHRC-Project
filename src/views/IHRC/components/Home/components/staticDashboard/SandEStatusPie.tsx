
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { Card } from '@/components/ui';
import { ApexOptions } from 'apexcharts';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { HiOutlineViewGrid } from 'react-icons/hi';

interface SEStatusProps {
  companyId?: string | number;
  stateId?: string | number;
  districtId?: string | number;
  locationId?: string | number;
  branchId?: string | number;
}

interface SEStatusData {
  series: number[];
  labels: string[];
}
const SandEStatusPie: React.FC<SEStatusProps> = ({ 
  companyId, 
  stateId, 
  districtId, 
  locationId, 
  branchId 
}) => {


const [chartData, setChartData] = useState<SEStatusData>({
    series: [0, 0],   // Default values before API response (Expired, Valid)
    labels: ['Expired', 'Valid']
  });
  
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    const fetchSEGraph = async () => {
      setLoading(true);
      try {
        const params: any = {};
                if (companyId) params.companyId = companyId;
                if (stateId) params.stateId = stateId;
                if (districtId) params.districtId = districtId;
                if (locationId) params.locationId = locationId;
                if (branchId) params.branchId = branchId;
        const response = await httpClient.get(endpoints.graph.branchSEStatusGraph(), {
          params
        });
        
        setChartData(response.data);
      } catch (error) {
        console.error('Error fetching S&E Status Data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if at least one filter parameter is provided
    // if (companyId || stateId || districtId || locationId || branchId) {
      fetchSEGraph();
    // }
  }, [companyId, stateId, districtId, locationId, branchId]);

  const options: ApexOptions = {
    chart: {
      type: 'pie',
      background: 'transparent'
    },
    colors: ['#d20000', '#00a249'], // Red for Expired, Green for Valid
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
      <div className="flex justify-center items-center px-4">
        <h4 className="text-base font-semibold text-center">
         Branch S&E Status
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

export default SandEStatusPie;