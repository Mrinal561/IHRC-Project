// import React from 'react';
// import { useState } from 'react';
// import Calendar from '@/components/ui/Calendar';
// import Badge from '@/components/ui/Badge';
// import { Card } from '@/components/ui';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// const ComplianceCalendar: React.FC = () => {
//   const [value, setValue] = useState<Date | null>(null);

//   const upcomingDates = [
//     {
//       date: '12 Feb',
//       event: 'ESI Payment Due',
//       type: 'danger'
//     },
//     {
//       date: '18 Feb',
//       event: 'PF Filing',
//       type: 'success'
//     },
//     {
//       date: '24 Feb',
//       event: 'PT Payment',
//       type: 'info'
//     }
//   ];

//   return (
//     <Card className="p-0 border-none custom-card-body">
//       <div className="flex flex-col lg:flex-row gap-6">
//         {/* Calendar Section */}
//         <div className="flex-1 md:w-[50%] max-w-[50%] ">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
//               Compliance Calendar
//             </h2>
//           </div>
//           <div className="md:w-[100%] max-w-[100%] mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm">
//             <Calendar
//               className="border-none"
//               value={value}
//               dayClassName={(date, { selected }) => {
//                 if (date.getDate() === 12 && !selected) {
//                   return 'text-red-600 font-medium';
//                 }
//                 if (selected) {
//                   return 'text-white font-medium';
//                 }
//                 return 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors';
//               }}
//               dayStyle={(date, { selected, outOfMonth }) => {
//                 if (date.getDate() === 18 && !selected) {
//                   return { color: '#15c39a', fontWeight: 500 };
//                 }
//                 if (outOfMonth) {
//                   return {
//                     opacity: 0,
//                     pointerEvents: 'none',
//                     cursor: 'default',
//                   };
//                 }
//                 return {};
//               }}
//               renderDay={(date) => {
//                 const day = date.getDate();
//                 if (day !== 12) {
//                   return <span>{day}</span>;
//                 }
//                 return (
//                   <span className="relative flex justify-center items-center w-full h-full">
//                     {day}
//                     <Badge
//                       className="absolute bottom-1"
//                       innerClass="h-1 w-1 bg-red-500"
//                     />
//                   </span>
//                 );
//               }}
//               onChange={setValue}
//             />
//           </div>
//         </div>

//         {/* Upcoming Dates Section */}
//         <div className="flex-1 lg:border-l lg:pl-6 md:w-[50%] max-w-[50%] ">
//           <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
//             Upcoming Dates
//           </h3>
//           <div className="space-y-4">
//             {upcomingDates.map((item, index) => (
//               <div
//                 key={index}
//                 className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//               >
//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                     {item.event}
//                   </p>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                     {item.date}
//                   </p>
//                 </div>
//                 <Badge
//                   className={`${
//                     item.type === 'danger'
//                       ? 'bg-red-100 text-red-800'
//                       : item.type === 'success'
//                       ? 'bg-green-100 text-green-800'
//                       : 'bg-blue-100 text-blue-800'
//                   } px-2 py-1 text-xs rounded-full`}
//                 >
//                   {item.type === 'danger' ? 'Due' : item.type === 'success' ? 'Coming Up' : 'Scheduled'}
//                 </Badge>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default ComplianceCalendar;


import React, { useState, useEffect } from 'react';
import Calendar from '@/components/ui/Calendar';
import Badge from '@/components/ui/Badge';
import { Card, Dialog } from '@/components/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { format, isAfter, parse, isSameMonth } from 'date-fns';
import { HiOutlineViewGrid } from 'react-icons/hi';

const FINANCIAL_YEAR_KEY = 'selectedFinancialYear';
const FINANCIAL_YEAR_CHANGE_EVENT = 'financialYearChanged';

interface DueDate {
  type: string;
  date: string;
  display: string;
  frequency: string;
  state?: string;
}

interface ComplianceCalendarProps {
  companyId?: string | number;
  financialYear?: string;
}

const ComplianceCalendar: React.FC<ComplianceCalendarProps> = ({
  companyId,
}) => {
  const [value, setValue] = useState<Date | null>(new Date());
  const [financialYear, setFinancialYear] = useState<string | null>(
    sessionStorage.getItem(FINANCIAL_YEAR_KEY),
  );
  const [complianceDates, setComplianceDates] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Fetch compliance dates
  useEffect(() => {
    const fetchComplianceDates = async () => {
      if (!companyId || !financialYear) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await httpClient.get(
          endpoints.graph.calendar(),
          {
            params: {
              companyId: companyId,
              financialYear: financialYear
            }
          }
        );
        setComplianceDates(response.data);
      } catch (err) {
        console.error('Error fetching compliance dates:', err);
        setError('Failed to load compliance dates');
      } finally {
        setLoading(false);
      }
    };

    fetchComplianceDates();
  }, [companyId, financialYear]);

  // Handle financial year changes
  useEffect(() => {
    const handleFinancialYearChange = (event: CustomEvent) => {
      const newFinancialYear = event.detail;
      setFinancialYear(newFinancialYear);
      sessionStorage.setItem(FINANCIAL_YEAR_KEY, newFinancialYear);
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

  const filterUniqueDates = (dates: DueDate[]): DueDate[] => {
    const uniqueMap = new Map<string, DueDate>();
    
    dates.forEach(date => {
      const key = `${date.date}-${date.state || ''}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, date);
      }
    });
    
    return Array.from(uniqueMap.values());
  };

  // Filter dates for the current month and get upcoming dates
  const filteredUpcomingDates = React.useMemo(() => {
    if (!complianceDates?.all) return [];
    
    const now = new Date();
    const currentMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const currentMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    // First filter unique dates
    const uniqueDates = filterUniqueDates(complianceDates.all);
    
    // Then filter by date range
    return uniqueDates
      .filter((item: DueDate) => {
        const dateObj = new Date(item.date);
        return isSameMonth(dateObj, currentMonth) || isAfter(dateObj, now);
      })
      .sort((a: DueDate, b: DueDate) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
  }, [complianceDates, currentMonth]);

  const groupedUpcomingDates = React.useMemo(() => {
    const grouped: Record<string, DueDate[]> = {};
    
    // Group filtered dates by type
    filteredUpcomingDates.forEach((item: DueDate) => {
      const dateObj = new Date(item.date);
      if (isSameMonth(dateObj, currentMonth)) {
        if (!grouped[item.type]) {
          grouped[item.type] = [];
        }
        grouped[item.type].push(item);
      }
    });
    
    return Object.entries(grouped).map(([type, dates]) => {
      const now = new Date();
      
      // Filter unique dates first
      const uniqueDates = filterUniqueDates(dates)
        .map(date => ({ ...date, dateObj: new Date(date.date) }))
        .filter(date => isAfter(date.dateObj, now))
        .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
      
      if (uniqueDates.length === 0) return null;
      
      const nearestDate = uniqueDates[0];
      
      return {
        type,
        date: format(nearestDate.dateObj, 'dd MMM'),
        event: `${type.toUpperCase()} Payment Due`,
        badgeType: 'success',
        allDates: uniqueDates,
        count: uniqueDates.length
      };
    }).filter(Boolean) as Array<{
      type: string;
      date: string;
      event: string;
      badgeType: string;
      allDates: Array<DueDate & { dateObj: Date }>;
      count: number;
    }>;
  }, [filteredUpcomingDates, currentMonth]);

  // Highlight dates in calendar
  const highlightDates = (date: Date) => {
    return complianceDates?.all?.some((item: DueDate) => {
      const dueDate = new Date(item.date);
      return (
        dueDate.getDate() === date.getDate() &&
        dueDate.getMonth() === date.getMonth() &&
        dueDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handleViewAll = (type: string) => {
    setSelectedType(type);
    setDialogOpen(true);
  };

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
  };

  // Get filtered dates for dialog (current month only)
  const getFilteredDatesForDialog = () => {
    if (!selectedType || !complianceDates?.[selectedType]) return [];
    
    const uniqueDates = filterUniqueDates(complianceDates[selectedType]);
    
    return uniqueDates.filter((date: DueDate) => {
      const dateObj = new Date(date.date);
      return isSameMonth(dateObj, currentMonth);
    });
  };

  const getFinancialYearStart = (financialYear: string | null): Date => {
    if (!financialYear) return new Date();
    
    const [startYear] = financialYear.split('-').map(Number);
    return new Date(startYear, 3, 1); // April 1st of start year
  };


  return (
    <Card className="p-0 border-none custom-card-body">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar Section */}
        <div className="flex-1 md:w-[60%]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Compliance Calendar {financialYear ? `(${financialYear})` : ''}
            </h2>
          </div>
          <div className="bg-white dark:bg-gray-800 h-[180px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full text-red-500">
                {error}
              </div>
            ) : (
              <Calendar
                className="border-none h-full"
               value={getFinancialYearStart(financialYear)}
                onMonthChange={handleMonthChange}
                dayClassName={(date, { selected }) => {
                  const isDueDate = highlightDates(date);
                  if (isDueDate && !selected) {
                    return 'text-red-600 font-medium';
                  }
                  if (selected) {
                    return 'text-white font-medium';
                  }
                  return 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors';
                }}
                dayStyle={(date, { selected, outOfMonth }) => {
                  const isDueDate = highlightDates(date);
                  if (isDueDate && !selected) {
                    return { color: '#ef4444', fontWeight: 500 };
                  }
                  if (outOfMonth) {
                    return {
                      opacity: 0,
                      pointerEvents: 'none',
                      cursor: 'default',
                    };
                  }
                  return {};
                }}
                renderDay={(date) => {
                  const day = date.getDate();
                  const isDueDate = highlightDates(date);
                  
                  if (!isDueDate) {
                    return <span>{day}</span>;
                  }
                  return (
                    <span className="relative flex justify-center items-center w-full h-full">
                      {day}
                      <Badge
                        className="absolute bottom-1"
                        innerClass="h-1 w-1 bg-red-500"
                      />
                    </span>
                  );
                }}
                onChange={setValue}
              />
            )}
          </div>
        </div>

        {/* Upcoming Dates Section */}
        <div className="flex-1 lg:border-l lg:pl-6 md:w-[40%]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Upcoming Dates
            </h3>
          </div>
          {loading ? (
            <div className="space-y-4 h-[380px] overflow-y-auto">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[380px] w-full text-red-500">
              {error}
            </div>
          ) : groupedUpcomingDates.length === 0 ? (
            <div className="flex items-center justify-center h-[380px] w-full">
              <div className="flex flex-col items-center justify-center text-gray-500">
                <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
                <p className="text-center">No Upcoming Dates</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 h-[380px] overflow-y-auto pr-2">
              {groupedUpcomingDates.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {item.event}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.date}
                    </p>
                    {item.count > 1 && (
                      <button 
                        className="text-xs text-primary mt-1 hover:underline"
                        onClick={() => handleViewAll(item.type)}
                      >
                        View all {item.count} dates
                      </button>
                    )}
                  </div>
                  <Badge
                    className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full"
                  >
                    Upcoming
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialog to show all dates for a type */}
      <Dialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onRequestClose={() => setDialogOpen(false)}
      >
        <h3 className="text-lg font-medium mb-4">
          {selectedType?.toUpperCase()} Payment Dates ({format(currentMonth, 'MMM yyyy')})
        </h3>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {getFilteredDatesForDialog().length === 0 ? (
            <p className="text-gray-500 text-center py-4">No dates for selected month</p>
          ) : (
            getFilteredDatesForDialog().map((date: DueDate, index: number) => (
              <div key={index} className="flex justify-between items-center p-3 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <p className="font-medium">{format(new Date(date.date), 'dd MMM yyyy')}</p>
                  {date.state && (
                    <p className="text-sm text-gray-500">State: {date.state}</p>
                  )}
                  <p className="text-sm text-gray-500 capitalize">
                    Frequency: {date.frequency.replace(/_/g, ' ')}
                  </p>
                </div>
                <Badge className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full">
                  {date.display}
                </Badge>
              </div>
            ))
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setDialogOpen(false)}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            Close
          </button>
        </div>
      </Dialog>
    </Card>
  );
};

export default ComplianceCalendar;