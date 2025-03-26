// import React, { useState, useEffect, useRef } from 'react';
// import { format, addMonths, subMonths, startOfMonth, endOfMonth, isAfter, isBefore, isEqual, addDays, startOfWeek, endOfWeek, startOfQuarter, endOfQuarter, differenceInDays } from 'date-fns';
// import OutlinedSelect from '@/components/ui/Outlined/Outlined';

// const CustomDateRangePicker = ({ onApply }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [leftMonth, setLeftMonth] = useState(new Date());
//   const [rightMonth, setRightMonth] = useState(addMonths(new Date(), 1));
//   const [activeTab, setActiveTab] = useState('Current');
//   const [activePeriod, setActivePeriod] = useState('Month');
//   const [dayCount, setDayCount] = useState(0);
//   const [activeInput, setActiveInput] = useState(null);
//   const [fromInputFocused, setFromInputFocused] = useState(false);
//   const [toInputFocused, setToInputFocused] = useState(false);
//   const popupRef = useRef(null);
//   const fromInputRef = useRef(null);
//   const toInputRef = useRef(null);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (popupRef.current && !popupRef.current.contains(event.target) &&
//           !fromInputRef.current.contains(event.target) &&
//           !toInputRef.current.contains(event.target)) {
//         setIsOpen(false);
//         setFromInputFocused(false);
//         setToInputFocused(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [popupRef, fromInputRef, toInputRef]);

//   useEffect(() => {
//     if (startDate && endDate) {
//       const days = differenceInDays(endDate, startDate) + 1;
//       setDayCount(days);
//     }
//   }, [startDate, endDate]);

//   const handleDateClick = (date) => {
//     if (!startDate || (startDate && endDate)) {
//       setStartDate(date);
//       setEndDate(null);
//     } else if (isAfter(date, startDate)) {
//       setEndDate(date);
//     } else {
//       setEndDate(startDate);
//       setStartDate(date);
//     }
//   };

//   const handleApply = () => {
//     onApply(startDate, endDate);
//     setIsOpen(false);
//     setFromInputFocused(false);
//     setToInputFocused(false);
//   };

//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//     updateDates(tab, activePeriod);
//   };

//   const handlePeriodClick = (period) => {
//     setActivePeriod(period);
//     updateDates(activeTab, period);
//   };

//   const updateDates = (tab, period) => {
//     const today = new Date();
//     let start, end;

//     switch (period) {
//       case 'Week':
//         start = startOfWeek(today);
//         end = endOfWeek(today);
//         break;
//       case 'Month':
//         start = startOfMonth(today);
//         end = endOfMonth(today);
//         break;
//       case 'Quarter':
//         start = startOfQuarter(today);
//         end = endOfQuarter(today);
//         break;
//       case 'Period':
//         start = startOfMonth(today);
//         end = endOfMonth(today);
//         break;
//       default:
//         start = startOfMonth(today);
//         end = endOfMonth(today);
//     }

//     switch (tab) {
//       case 'Last':
//         setStartDate(subMonths(start, 1));
//         setEndDate(subMonths(end, 1));
//         break;
//       case 'Current':
//         setStartDate(start);
//         setEndDate(end);
//         break;
//       case 'Next':
//         setStartDate(addMonths(start, 1));
//         setEndDate(addMonths(end, 1));
//         break;
//       default:
//         break;
//     }
//   };

//   const renderCalendar = (month) => {
//     const days = [];
//     const startDay = startOfMonth(month);
//     const endDay = endOfMonth(month);

//     for (let day = startDay; day <= endDay; day = addDays(day, 1)) {
//       const isSelected = 
//         (startDate && isEqual(day, startDate)) || 
//         (endDate && isEqual(day, endDate)) ||
//         (startDate && endDate && isAfter(day, startDate) && isBefore(day, endDate));

//       days.push(
//         <button
//           key={day.toString()}
//           onClick={() => handleDateClick(day)}
//           className={`p-2 m-1 w-8 h-8 flex items-center justify-center ${
//             isSelected ? 'bg-blue-500 text-white rounded-full' : 'hover:bg-gray-200 rounded-full'
//           }`}
//         >
//           {format(day, 'd')}
//         </button>
//       );
//     }
//     return (
//       <div className="grid grid-cols-7 gap-1">
//         {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
//           <div key={day} className="text-center font-bold text-sm p-2">{day}</div>
//         ))}
//         {days}
//       </div>
//     );
//   };

//   const formatDateDisplay = (date) => {
//     return date ? format(date, 'dd/MM/yyyy') : '';
//   }

//   const handleInputClick = (inputType) => {
//     setIsOpen(true);
//     setActiveInput(inputType);
//     if (inputType === 'from') {
//       setFromInputFocused(true);
//       setToInputFocused(false);
//     } else {
//       setFromInputFocused(false);
//       setToInputFocused(true);
//     }
//   }

//   const handleInputBlur = (inputType) => {
//     if (inputType === 'from' && !startDate) {
//       setFromInputFocused(false);
//     } else if (inputType === 'to' && !endDate) {
//       setToInputFocused(false);
//     }
//   }

//   const handleReset = () => {
//     setStartDate(null);
//     setEndDate(null);
//     setDayCount(0);
//     setActiveTab('Current');
//     setActivePeriod('Month');
//     setFromInputFocused(false);
//     setToInputFocused(false);
//   };

//   return (
//     <div className="relative z-20">
//       <div className="flex space-x-3">
//         <div className="relative" ref={fromInputRef}>
//           <div className={`absolute top-0 left-0 w-full h-full border rounded-md pointer-events-none ${fromInputFocused || startDate ? 'border-gray-300' : 'border-gray-300'}`}>
//             <span className={`absolute px-1 transition-all duration-200 ${
//               (fromInputFocused || startDate) ? '-top-3 left-3 text-xs font-semibold bg-white text-indigo-600' : 'top-2 left-2 text-sm text-gray-500'
//             }`}>
//               From Date
//             </span>
//           </div>
//           <input
//             type="text"
//             value={formatDateDisplay(startDate)}
//             onClick={() => handleInputClick('from')}
//             onBlur={() => handleInputBlur('from')}
//             readOnly
//             className="w-28 h-[38px] px-2 bg-transparent border-none cursor-pointer focus:outline-none"
//           />
//         </div>
//         <div className="relative" ref={toInputRef}>
//           <div className={`absolute top-0 left-0 w-full h-full border rounded-md pointer-events-none ${toInputFocused || endDate ? 'border-gray-300' : 'border-gray-300'}`}>
//             <span className={`absolute px-1 transition-all duration-200 ${
//               (toInputFocused || endDate) ? '-top-3 left-3 text-xs font-semibold bg-white text-indigo-600' : 'top-2 left-2 text-sm text-gray-500'
//             }`}>
//               To Date
//             </span>
//           </div>
//           <input
//             type="text"
//             value={formatDateDisplay(endDate)}
//             onClick={() => handleInputClick('to')}
//             onBlur={() => handleInputBlur('to')}
//             readOnly
//             className="w-28 h-[36px] px-2 bg-transparent border-none cursor-pointer focus:outline-none"
//           />
//         </div>
//       </div>
//       {isOpen && (
//         <div ref={popupRef} className="absolute w-[120vh] top-full right-8 mt-2 bg-white border shadow-lg rounded-lg overflow-hidden z-10">
         
//           <div className="flex p-4 space-x-8">
//             <div className="flex items-center">
//               <div>
//                 <div className="flex justify-between items-center mb-2">
//                   <button onClick={() => setLeftMonth(subMonths(leftMonth, 1))} className="p-1 hover:bg-gray-200 rounded">
//                     &lt;
//                   </button>
//                   <span className="font-semibold">{format(leftMonth, 'MMMM yyyy')}</span>
//                   <button onClick={() => setLeftMonth(addMonths(leftMonth, 1))} className="p-1 hover:bg-gray-200 rounded">
//                     &gt;
//                   </button>
//                 </div>
//                 {renderCalendar(leftMonth)}
//               </div>
//               <div className="w-px bg-gray-300 mx-4 h-56 self-center"></div>
//               <div>
//                 <div className="flex justify-between items-center mb-2">
//                   <button onClick={() => setRightMonth(subMonths(rightMonth, 1))} className="p-1 hover:bg-gray-200 rounded">
//                     &lt;
//                   </button>
//                   <span className="font-semibold">{format(rightMonth, 'MMMM yyyy')}</span>
//                   <button onClick={() => setRightMonth(addMonths(rightMonth, 1))} className="p-1 hover:bg-gray-200 rounded">
//                     &gt;
//                   </button>
//                 </div>
//                 {renderCalendar(rightMonth)}
//               </div>
//             </div>
//             <div className="flex flex-col items-start gap-4">
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => handleTabClick('Last')}
//                   className={`p-2 rounded ${activeTab === 'Last' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
//                 >
//                   Last
//                 </button>
//                 <button
//                   onClick={() => handleTabClick('Current')}
//                   className={`p-2 rounded ${activeTab === 'Current' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
//                 >
//                   Current
//                 </button>
//                 <button
//                   onClick={() => handleTabClick('Next')}
//                   className={`p-2 rounded ${activeTab === 'Next' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
//                 >
//                   Next
//                 </button>
//               </div>
//               <div className="flex flex-col gap-2">
//                 {['Week', 'Month', 'Period', 'Quarter'].map((period) => (
//                   <button
//                     key={period}
//                     onClick={() => handlePeriodClick(period)}
//                     className={`p-2 rounded text-left ${activePeriod === period ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
//                   >
//                     {period}
//                   </button>
//                 ))}
//               </div>
//               <div className="mt-2 text-center">
//                 <span className="font-bold border w-24 h-14 py-2 px-6 text-base rounded-md">{dayCount}</span> Days
//               </div>
//             </div>
//           </div>
//           <div className="bg-gray-100 px-4 py-3 flex justify-end space-x-2">
//             <button
//               onClick={handleApply}
//               className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//             >
//               Apply
//             </button>
//             <button
//               onClick={() => setIsOpen(false)}
//               className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleReset}
//               className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//             >
//               Reset
//             </button>
//           </div>
//         </div>
//       )}
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
    if (date && endDate && isBefore(endDate, date)) {
      setEndDate(null);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (!startDate || (date && !isBefore(date, startDate))) {
      setEndDate(date);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      const datesChanged = 
        !prevDates.current.start || 
        !prevDates.current.end ||
        !isEqual(startDate, prevDates.current.start) || 
        !isEqual(endDate, prevDates.current.end);

      if (datesChanged) {
        prevDates.current = { start: startDate, end: endDate };
        onApply(startDate, endDate);
      }
    } else if ((!startDate || !endDate) && (prevDates.current.start || prevDates.current.end)) {
      // Handle case when dates are cleared
      prevDates.current = { start: null, end: null };
      onApply(null, null);
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