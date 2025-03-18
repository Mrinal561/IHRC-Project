import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { COLOR_1, COLOR_2, COLOR_5 } from '@/constants/chart.constant';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

interface ComplianceStatusProps {
  companyId?: string | number;
  stateId?: string | number;
  districtId?: string | number;
  locationId?: string | number;
  branchId?: string | number;
  year?: string; // Financial year (e.g., '2024-25')
}

const ComplianceStatus: React.FC<ComplianceStatusProps> = ({
  companyId,
  stateId,
  districtId,
  locationId,
  branchId,
  year = '2024-25'
}) => {
  const [currentGroup, setCurrentGroup] = useState<string>('');
  const [mainTotal, setMainTotal] = useState(0);
  const [arrearTotal, setArrearTotal] = useState(0);
  const [damageTotal, setDamageTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Generate month options based on the financial year
  const getFinancialYearMonths = (financialYear: string) => {
    const [startYear, endYear] = financialYear.split('-').map((y) => parseInt(y.length === 2 ? `20${y}` : y));
    const months = [
      { value: 'apr', label: `April ${startYear}` },
      { value: 'may', label: `May ${startYear}` },
      { value: 'jun', label: `June ${startYear}` },
      { value: 'jul', label: `July ${startYear}` },
      { value: 'aug', label: `August ${startYear}` },
      { value: 'sep', label: `September ${startYear}` },
      { value: 'oct', label: `October ${startYear}` },
      { value: 'nov', label: `November ${startYear}` },
      { value: 'dec', label: `December ${startYear}` },
      { value: 'jan', label: `January ${endYear}` },
      { value: 'feb', label: `February ${endYear}` },
      { value: 'mar', label: `March ${endYear}` },
    ];
    return months;
  };

  const groupOptions = getFinancialYearMonths(year);

  // Get the current month based on the financial year
  const getCurrentMonth = () => {
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth(); // 0 (Jan) to 11 (Dec)
    const currentYear = currentDate.getFullYear();

    // Financial year starts in April (index 3)
    const financialYearStart = year.split('-')[0];
    const financialYearEnd = year.split('-')[1];

    if (currentMonthIndex >= 3) {
      // April (3) to December (11) belong to the start year
      return groupOptions[currentMonthIndex - 3].value;
    } else {
      // January (0) to March (2) belong to the end year
      return groupOptions[currentMonthIndex + 9].value;
    }
  };

  // Set the default month to the current month
  useEffect(() => {
    const currentMonth = getCurrentMonth();
    setCurrentGroup(currentMonth);
  }, [year]);

  // Handler for dropdown changes
  const handleChange = (setter) => (option) => {
    setter(option.value);
  };

  // Fetch data when filters, month, or financial year change
  useEffect(() => {
    const fetchRemittanceData = async () => {
      setLoading(true);
      try {
        const response = await httpClient.get(endpoints.graph.pfremittanceBreakup(), {
          params: {
            companyId,
            stateId,
            districtId,
            locationId,
            branchId,
            month: currentGroup, // Pass the selected month
            financialYear: year // Pass the financial year
          }
        });

        // Update state with fetched data
        setMainTotal(response.data.main || 0);
        setArrearTotal(response.data.arrear || 0);
        setDamageTotal(response.data.damage || 0);
      } catch (error) {
        console.error('Error fetching remittance breakup data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRemittanceData();
  }, [companyId, stateId, districtId, locationId, branchId, currentGroup, year]);

  // Data series and labels
  const series = [mainTotal, arrearTotal, damageTotal];
  const labels = ['Main', 'Arrear', 'Damage'];
  const totalAmount = mainTotal + arrearTotal + damageTotal;

  // Check if all values in the series are 0
  const isNoDataAvailable = series.every(value => value === 0);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full">
        <div className="flex justify-between items-center">
          <h4 className="text-base font-bold flex-1 text-center">
            PF Remittance Breakdown for {year}
          </h4>
          <div className="w-40">
            <OutlinedSelect
              label="Month"
              options={groupOptions}
              value={groupOptions.find((option) => option.value === currentGroup)}
              onChange={handleChange(setCurrentGroup)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-gray-400">Loading...</div>
      ) : isNoDataAvailable ? (
        <div className="py-10 text-gray-400">No Data Available</div>
      ) : (
        <>
          <Chart
            options={{
              colors: ['#002D62', '#0066b2', '#318CE7'],
              labels: labels,
              legend: {
                position: 'bottom',
                formatter: function (val, opts) {
                  const percent = (opts.w.globals.series[opts.seriesIndex] / totalAmount) * 100;
                  return `${val}: ${isNaN(percent) ? '0%' : percent.toFixed(1) + '%'}`;
                }
              },
              plotOptions: {
                pie: {
                  donut: {
                    labels: {
                      show: true,
                    }
                  }
                }
              },
              dataLabels: {
                enabled: false,
                // formatter: function (val) {
                //   return isNaN(val) ? '0%' : val.toFixed(1) + '%';
                // }
              },
              tooltip: {
                y: {
                  formatter: function (val) {
                    return val.toLocaleString();
                  }
                }
              },
              responsive: [
                {
                  breakpoint: 480,
                  options: {
                    chart: {
                      width: 380,
                    },
                    legend: {
                      position: 'bottom',
                    },
                  },
                },
              ],
            }}
            series={series}
            height={350}
            type="donut"
          />
          <div className="grid grid-cols-3 gap-6 mt-4 text-center">
            {labels.map((label, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-sm text-gray-600">{label}</span>
                <span className="font-semibold text-lg">
                  {series[index].toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ComplianceStatus;