import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { Card } from '@/components/ui';
import { ApexOptions } from 'apexcharts';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

interface BranchStatusProps {
  companyId?: string | number;
  stateId?: string | number;
  districtId?: string | number;
  locationId?: string | number;
  branchId?: string | number;
}

interface BranchStatusData {
  series: number[];
  labels: string[];
}

const BranchStatus: React.FC<BranchStatusProps> = ({ 
  companyId, 
  stateId, 
  districtId, 
  locationId, 
  branchId 
}) => {
  const [chartData, setChartData] = useState<BranchStatusData>({
    series: [0, 0], // Default: [Rented, Owned]
    labels: ['Rented', 'Owned']
  });
  
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBranchStatusGraph = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (companyId) params.companyId = companyId;
        if (stateId) params.stateId = stateId;
        if (districtId) params.districtId = districtId;
        if (locationId) params.locationId = locationId;
        if (branchId) params.branchId = branchId;

        const response = await httpClient.get(endpoints.graph.branchStatusGraph(), {
          params
        });
        
        setChartData(response.data);
      } catch (error) {
        console.error('Error fetching Branch Status Data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranchStatusGraph();
  }, [companyId, stateId, districtId, locationId, branchId]);

  const options: ApexOptions = {
    chart: {
      type: 'pie',
      background: 'transparent'
    },
    colors: ['#ffc107', '#0ea5e9'],
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
      enabled: false
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => val.toString()
      }
    }
  };

  const header = (
    <div className="w-full">
      <div className="flex justify-center items-center px-4">
        <h4 className="text-base font-semibold text-center">
          Branch Status
        </h4>
      </div>
    </div>
  );

  const isNoDataAvailable = chartData.series.every(value => value === 0);

  return (
    <Card 
      className="w-full max-w-2xl mx-auto border-none p-0 custom-card-home"
      header={header}
      headerBorder={true}
      footerBorder={true}
      bordered={true}
    >
      <div className="p-0 flex justify-center items-center">
        {loading ? (
          <div className="py-10 text-gray-400">Loading...</div>
        ) : isNoDataAvailable ? (
          <div className="py-10 text-gray-400">No Data Available</div>
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

export default BranchStatus;