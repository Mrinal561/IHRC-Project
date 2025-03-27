
// import React, { useState, useEffect, useRef } from 'react';
// import { isBefore, isEqual } from 'date-fns';
// import DatePicker from '@/components/ui/DatePicker/DatePicker';

// interface DateRange {
//   start: Date | null;
//   end: Date | null;
// }

// const CustomDateRangePicker = ({ onApply }: { onApply: (start: Date | null, end: Date | null) => void }) => {
//   const [startDate, setStartDate] = useState<Date | null>(null);
//   const [endDate, setEndDate] = useState<Date | null>(null);
//   const prevDates = useRef<DateRange>({ start: null, end: null });

//   const handleStartDateChange = (date: Date | null) => {
//     setStartDate(date);
//     if (date && endDate && isBefore(endDate, date)) {
//       setEndDate(null);
//     }
//   };

//   const handleEndDateChange = (date: Date | null) => {
//     if (!startDate || (date && !isBefore(date, startDate))) {
//       setEndDate(date);
//     }
//   };

//   useEffect(() => {
//     if (startDate && endDate) {
//       const datesChanged = 
//         !prevDates.current.start || 
//         !prevDates.current.end ||
//         !isEqual(startDate, prevDates.current.start) || 
//         !isEqual(endDate, prevDates.current.end);

//       if (datesChanged) {
//         prevDates.current = { start: startDate, end: endDate };
//         onApply(startDate, endDate);
//       }
//     } else if ((!startDate || !endDate) && (prevDates.current.start || prevDates.current.end)) {
//       // Handle case when dates are cleared
//       prevDates.current = { start: null, end: null };
//       onApply(null, null);
//     }
//   }, [startDate, endDate, onApply]);

//   return (
//     <div className="flex space-x-4">
//       <DatePicker
//         size="sm"
//         value={startDate}
//         placeholder="From Date"
//         onChange={handleStartDateChange}
//         maxDate={endDate || undefined}
//       />
//       <DatePicker
//         size="sm"
//         value={endDate}
//         placeholder="To Date"
//         onChange={handleEndDateChange}
//         minDate={startDate || undefined}
//         disabled={!startDate}
//       />
//     </div>
//   );
// };

// export default CustomDateRangePicker;


import React, { useState, useEffect, useRef } from 'react';
import { isBefore, isEqual } from 'date-fns';
import DatePicker from '@/components/ui/DatePicker/DatePicker';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

const CustomDateRangePicker = ({ onApply }: { onApply: (start: Date | null, end: Date | null) => void }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const prevDates = useRef<DateRange>({ start: null, end: null });

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    if (date === null) {
      setEndDate(null); // Clear end date if start date is cleared
    } else if (endDate && isBefore(endDate, date)) {
      setEndDate(null);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (!startDate || (date && !isBefore(date, startDate))) {
      setEndDate(date);
    }
  };

  useEffect(() => {
    // Helper function to safely compare dates (including null)
    const datesAreEqual = (a: Date | null, b: Date | null): boolean => {
      if (a === null && b === null) return true;
      if (a === null || b === null) return false;
      return isEqual(a, b);
    };

    // Only trigger onApply if either:
    // 1. Both dates are set and different from previous
    // 2. Both dates are null and previous had at least one date
    if ((startDate && endDate) || 
        (!startDate && !endDate && (prevDates.current.start || prevDates.current.end))) {
      const datesChanged = 
        !datesAreEqual(startDate, prevDates.current.start) || 
        !datesAreEqual(endDate, prevDates.current.end);

      if (datesChanged) {
        prevDates.current = { start: startDate, end: endDate };
        onApply(startDate, endDate);
      }
    }
  }, [startDate, endDate, onApply]);

  return (
    <div className="flex space-x-4">
      <DatePicker
        size="sm"
        value={startDate}
        placeholder="From Date"
        onChange={handleStartDateChange}
        maxDate={endDate || undefined}
      />
      <DatePicker
        size="sm"
        value={endDate}
        placeholder="To Date"
        onChange={handleEndDateChange}
        minDate={startDate || undefined}
        disabled={!startDate}
      />
    </div>
  );
};

export default CustomDateRangePicker;