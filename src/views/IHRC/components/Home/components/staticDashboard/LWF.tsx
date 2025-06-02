

import React, { useState, useEffect, useMemo } from 'react';
import Chart from 'react-apexcharts';
import { Card } from '@/components/ui';
import { ApexOptions } from 'apexcharts';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { addMonths, format, parse, setMonth, setYear } from 'date-fns'
import { HiOutlineViewGrid } from 'react-icons/hi';


const FINANCIAL_YEAR_KEY = 'selectedFinancialYear'
const FINANCIAL_YEAR_CHANGE_EVENT = 'financialYearChanged'


interface ComplianceStatusProps {
  year?: string; // Financial year (e.g., '2024-25')
  companyId?: string | number;
  stateId?: string | number;
  districtId?: string | number;
  locationId?: string | number;
  branchId?: string | number;
}

const formatIndianNumber = (num: number): string => {
  const result = new Intl.NumberFormat('en-IN').format(num);
  return result;
};


const generateMonthOptions = (financialYear: string | null) => {
  if (!financialYear) return []

  // Parse the financial year (format: "2023-24")
  const [startYear] = financialYear.split('-')
  const fullStartYear = parseInt(`${startYear}`)

  const months = []
  // Start from April of start year
  let startDate = new Date(fullStartYear, 3, 1) // Month is 0-based, so 3 is April

  // Generate 12 months starting from April
  for (let i = 0; i < 12; i++) {
      const date = addMonths(startDate, i)
      const twoDigitYear = format(date, 'yy') // Get last two digits of the year
      months.push({
          value: format(date, 'yyyy-MM'),
          label: `${format(date, 'MMM')} ${twoDigitYear}`, // Always shows format like "Jan 25"
          apiValue: format(date, 'MMM').toLowerCase()
      })
  }

  return months
}


const Lwf: React.FC<ComplianceStatusProps> = ({
  year = '2024-25',
  companyId,
  stateId,
  districtId,
  locationId,
  branchId,
}) => {
  const [currentGroup, setCurrentGroup] = useState<string>('');
  const [mainTotal, setMainTotal] = useState(0);
  const [interestTotal, setInterestTotal] = useState(0);
  const [penaltyTotal, setPenaltyTotal] = useState(0);
  const [loading, setLoading] = useState(false);
 const [financialYear, setFinancialYear] = useState<string | null>(
          sessionStorage.getItem(FINANCIAL_YEAR_KEY),
      )

 const groupOptions = useMemo(
        () => generateMonthOptions(financialYear),
        [financialYear],
    )

    useEffect(() => {
      if (groupOptions.length > 0 && !currentGroup) {
        setCurrentGroup(groupOptions[0].value);
      }
    }, [groupOptions, currentGroup]);

     useEffect(() => {
            const handleFinancialYearChange = (event: CustomEvent) => {
                const newFinancialYear = event.detail
                setFinancialYear(newFinancialYear)
                // Reset current selection when financial year changes
                setCurrentGroup('')
            }
    
            window.addEventListener(
                FINANCIAL_YEAR_CHANGE_EVENT,
                handleFinancialYearChange as EventListener,
            )
    
            return () => {
                window.removeEventListener(
                    FINANCIAL_YEAR_CHANGE_EVENT,
                    handleFinancialYearChange as EventListener,
                )
            }
        }, [])

        useEffect(() => {
          const fetchRemittanceData = async () => {
            if (!currentGroup || !financialYear) return;
      
            setLoading(true);
            try {
              const selectedOption = groupOptions.find(opt => opt.value === currentGroup);
              const response = await httpClient.get(endpoints.graph.lwfremittanceBreakup(), {
                params: {
                  companyId,
                  stateId,
                  districtId,
                  locationId,
                  branchId,
                  month: selectedOption?.apiValue, // Using MM/yyyy format
                  financialYear // Already in correct format (YYYY-YY)
                }
              });
      
              setMainTotal(response.data.main || 0);
        setInterestTotal(response.data.interest || 0);
        setPenaltyTotal(response.data.penalty || 0);
            } catch (error) {
              console.error('Error fetching remittance breakup data:', error);
            } finally {
              setLoading(false);
            }
          };
      
          fetchRemittanceData();
        }, [companyId, stateId, districtId, locationId, branchId, currentGroup, financialYear, groupOptions]);


  // Data series and labels
  const series = [mainTotal, interestTotal, penaltyTotal];
  const labels = ['Main Challan', 'Interest', 'Penalty'];
  const totalAmount = mainTotal + interestTotal + penaltyTotal;

  const isNoDataAvailable = series.every((value) => value === 0);
  const handleMonthChange = (option: { value: string; label: string } | null) => {
    if (option) {
      setCurrentGroup(option.value);
    }
  };

  // Format percentage values, replacing NaN with 0%
  const formatPercentage = (value: number, total: number) => {
    if (total === 0) return '0%';
    const percent = (value / total) * 100;
    return isNaN(percent) ? '0%' : `${percent.toFixed(1)}%`;
  };


  const formatIndianNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(Math.round(num));
};


  return (
    <div className="flex flex-col items-center">
      <div className="w-full">
        <div className="flex justify-between items-center">
          <h4 className="text-base font-bold flex-1 text-center">
            LWF Remittance Breakdown for  {financialYear ? `for ${financialYear}` : ''}
          </h4>
          <div className="w-40">
            <OutlinedSelect
              label="Month"
              options={groupOptions}
              value={groupOptions.find((option) => option.value === currentGroup)}
              onChange={handleMonthChange}
            />
          </div>
        </div>
      </div>

      {loading ? (
      <div className="py-10 text-gray-400">Loading...</div>
    ) : isNoDataAvailable ? (
      <div className="flex items-center justify-center min-h-[300px] w-full"> {/* Fixed minimum height */}
        <div className="flex flex-col items-center justify-center text-gray-500">
          <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
          <p className="text-center">No Data Available</p>
        </div>
      </div>
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
                },
              },
              plotOptions: {
                pie: {
                  donut: {
                    labels: {
                      show: true,
                      name: {
                        fontSize: '12px',
                        offsetY: -10, // Move the label up slightly

                      },
                      value: {
                        show: true,
                        fontSize: '10px', // Reduced font size for the value
                        formatter: function(val) {               
                          return formatIndianNumber(parseFloat(val));
                        },
                        offsetY: 5
                      },
                    }
                  }
                }
              },
              dataLabels: {
                enabled: false,
                // formatter: function (val) {
                //   return isNaN(val) ? '0%' : val.toFixed(1) + '%';
                // },
              },
              tooltip: {
                y: {
                  formatter: function (val) {
                    return formatIndianNumber(val);
                  },
                },
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
                {formatIndianNumber(series[index])}
                </span>
                {/* <span className="text-sm text-gray-500">
                  {formatPercentage(series[index], totalAmount)}
                </span> */}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Lwf;