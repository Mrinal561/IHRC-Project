
import React, { useState, useEffect } from 'react';
import Drawer from '@/components/ui/Drawer';
import { HiOutlineCog } from 'react-icons/hi';
import SidePanelContent, { SidePanelContentProps } from './SidePanelContent';
import withHeaderItem from '@/utils/hoc/withHeaderItem';
import { setPanelExpand, useAppSelector, useAppDispatch } from '@/store';
import type { CommonProps } from '@/@types/common';
import Notification from '../Notification';
import { Badge } from '@/components/ui';
import OutlinedBadgeSelect from '@/components/ui/OutlinedBadgeSelect';
import { fetchUnmarkedNotifications } from '@/store/slices/notification/notificationSlice';

type SidePanelProps = SidePanelContentProps & CommonProps;

interface Option {
    value: string;
    label: React.ReactNode;
}

interface FinancialYearFilterProps {
    onChange: (year: string) => void;
}

const FINANCIAL_YEAR_KEY = 'selectedFinancialYear';
const FINANCIAL_YEAR_CHANGE_EVENT = 'financialYearChanged';

// Standalone function for getting current financial year
const getCurrentFinancialYear = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const isAfterApril = today.getMonth() >= 3; // 3 represents April (0-based months)
    
    const fyYear = isAfterApril ? currentYear : currentYear - 1;
    return `${fyYear}-${(fyYear + 1).toString().slice(-2)}`;
};

// const FinancialYearFilter: React.FC<FinancialYearFilterProps> = ({ onChange }) => {
//     // Function to get display format of year
//     const getYearDisplay = (yearValue: string) => {
//         const [startYear] = yearValue.split('-');
//         return `${startYear}-${Number(startYear) + 1}`;
//     };

//     // Get available years based on current date
//     const getAvailableYears = () => {
//         const today = new Date();
//         const isAfterApril = today.getMonth() >= 3;
//         const currentFY = getCurrentFinancialYear();
        
//         if (isAfterApril) {
//             // After April 1st, show current and previous FY
//             return [
//                 { value: currentFY, label: getYearDisplay(currentFY) },
//                 { 
//                     value: `${Number(currentFY.split('-')[0]) - 1}-${currentFY.split('-')[0].slice(-2)}`, 
//                     label: `${Number(currentFY.split('-')[0]) - 1}-${currentFY.split('-')[0]}` 
//                 }
//             ];
//         } else {
//             // Before April 1st, show only current FY
//             return [
//                 { value: currentFY, label: getYearDisplay(currentFY) }
//             ];
//         }
//     };

//     const [selectedYear, setSelectedYear] = useState<string>(() => {
//         const savedYear = sessionStorage.getItem(FINANCIAL_YEAR_KEY);
//         const currentFY = getCurrentFinancialYear();
//         if (!savedYear || !getAvailableYears().some(year => year.value === savedYear)) {
//             sessionStorage.setItem(FINANCIAL_YEAR_KEY, currentFY);
//             return currentFY;
//         }
//         return savedYear;
//     });

//     // Check for financial year change every day
//     useEffect(() => {
//         const checkFinancialYear = () => {
//             const currentFY = getCurrentFinancialYear();
//             if (selectedYear !== currentFY) {
//                 setSelectedYear(currentFY);
//                 sessionStorage.setItem(FINANCIAL_YEAR_KEY, currentFY);
//                 onChange(currentFY);
//                 window.dispatchEvent(new CustomEvent(FINANCIAL_YEAR_CHANGE_EVENT, {
//                     detail: currentFY
//                 }));
//             }
//         };

//         // Check on component mount
//         checkFinancialYear();

//         // Set up daily check at midnight
//         const interval = setInterval(() => {
//             checkFinancialYear();
//         }, 24 * 60 * 60 * 1000); // 24 hours

//         return () => clearInterval(interval);
//     }, [selectedYear, onChange]);

//     const handleChange = (selectedOption: Option | null) => {
//         if (selectedOption) {
//             setSelectedYear(selectedOption.value);
//             sessionStorage.setItem(FINANCIAL_YEAR_KEY, selectedOption.value);
//             onChange(selectedOption.value);
//             window.dispatchEvent(new CustomEvent(FINANCIAL_YEAR_CHANGE_EVENT, {
//                 detail: selectedOption.value
//             }));
//         }
//     };

//     return (
//         <div className="w-52">
//             <OutlinedBadgeSelect
//                 label="Financial Year"
//                 value={getAvailableYears().find(option => option.value === selectedYear)}
//                 options={getAvailableYears()}
//                 onChange={handleChange}
//                 optionRenderer={(option, isSelected) => (
//                     <div className="flex items-center justify-between w-full">
//                         <span>{option.label}</span>
//                         {isSelected && (
//                             <Badge className="w-2 h-2 rounded-full bg-emerald-500" />
//                         )}
//                     </div>
//                 )}
//             />
//         </div>
//     );
// };

const FinancialYearFilter: React.FC<FinancialYearFilterProps> = ({ onChange }) => {
    // Function to get display format of year
    const getYearDisplay = (yearValue: string) => {
        const [startYear] = yearValue.split('-');
        return `${startYear}-${Number(startYear) + 1}`;
    };

    // Get available years - current year and previous 4 years
    const getAvailableYears = () => {
        const currentFY = getCurrentFinancialYear();
        const [currentStartYearStr] = currentFY.split('-');
        const currentStartYear = parseInt(currentStartYearStr, 10);
        const years: Option[] = [];
        
        // Generate 5 years (current + previous 4)
        for (let i = 0; i < 5; i++) {
            const year = currentStartYear - i;
            const nextYearShort = (year + 1).toString().slice(-2).padStart(2, '0');
            const yearValue = `${year}-${nextYearShort}`;
            years.push({
                value: yearValue,
                label: getYearDisplay(yearValue)
            });
        }
        
        return years;
    };

    const [selectedYear, setSelectedYear] = useState<string>(() => {
        const savedYear = sessionStorage.getItem(FINANCIAL_YEAR_KEY);
        const currentFY = getCurrentFinancialYear();
        const availableYears = getAvailableYears().map(y => y.value);
        
        // Only use currentFY if no valid saved year exists
        if (!savedYear || !availableYears.includes(savedYear)) {
            sessionStorage.setItem(FINANCIAL_YEAR_KEY, currentFY);
            return currentFY;
        }
        return savedYear;
    });

    // Check for financial year change only when the component mounts
    useEffect(() => {
        const currentFY = getCurrentFinancialYear();
        const savedYear = sessionStorage.getItem(FINANCIAL_YEAR_KEY);
        
        if (!savedYear) {
            setSelectedYear(currentFY);
            sessionStorage.setItem(FINANCIAL_YEAR_KEY, currentFY);
            onChange(currentFY);
            return;
        }

        // Parse the years for comparison
        const [currentStartYearStr] = currentFY.split('-');
        const [savedStartYearStr] = savedYear.split('-');
        const currentStartYear = parseInt(currentStartYearStr, 10);
        const savedStartYear = parseInt(savedStartYearStr, 10);
        
        // Only auto-update if the saved year is the previous financial year
        if (savedStartYear === currentStartYear - 1) {
            setSelectedYear(currentFY);
            sessionStorage.setItem(FINANCIAL_YEAR_KEY, currentFY);
            onChange(currentFY);
        }
    }, []); // Empty dependency array means this runs only on mount

    const handleChange = (selectedOption: Option | null) => {
        if (selectedOption) {
            setSelectedYear(selectedOption.value);
            sessionStorage.setItem(FINANCIAL_YEAR_KEY, selectedOption.value);
            onChange(selectedOption.value);
            window.dispatchEvent(new CustomEvent(FINANCIAL_YEAR_CHANGE_EVENT, {
                detail: selectedOption.value
            }));
        }
    };

    return (
        <div className="w-52">
            <OutlinedBadgeSelect
                label="Financial Year"
                value={getAvailableYears().find(option => option.value === selectedYear)}
                options={getAvailableYears()}
                onChange={handleChange}
                optionRenderer={(option, isSelected) => (
                    <div className="flex items-center justify-between w-full">
                        <span>{option.label}</span>
                        {isSelected && (
                            <Badge className="w-2 h-2 rounded-full bg-emerald-500" />
                        )}
                    </div>
                )}
            />
        </div>
    );
};



const _SidePanel = (props: SidePanelProps) => {
    const { className, ...rest } = props;
    const panelExpand = useAppSelector((state) => state.theme.panelExpand);
    const direction = useAppSelector((state) => state.theme.direction);
    const [selectedFinancialYear, setSelectedFinancialYear] = useState(() => {
        const savedYear = sessionStorage.getItem(FINANCIAL_YEAR_KEY);
        if (!savedYear) {
            const currentFY = getCurrentFinancialYear();
            sessionStorage.setItem(FINANCIAL_YEAR_KEY, currentFY);
            return currentFY;
        }
        return savedYear;
    });

    const dispatch = useAppDispatch();
    const [notificationData, setNotificationData] = useState([]);
    const [lastFetchTime, setLastFetchTime] = useState<number>(0);
    const FETCH_INTERVAL = 5400000; // 30 min

    const fetchNotifications = async () => {
        try {
            const response = await dispatch(fetchUnmarkedNotifications());
            if (response.payload) {
                setNotificationData(response.payload.data);
            }
        } catch (error) {
            console.error('Error fetching unmarked notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();

        const intervalId = setInterval(() => {
            const currentTime = Date.now();
            if (currentTime - lastFetchTime >= FETCH_INTERVAL) {
                fetchNotifications();
                setLastFetchTime(currentTime);
            }
        }, FETCH_INTERVAL);

        return () => clearInterval(intervalId);
    }, [dispatch, lastFetchTime]);

    // Additional hook to handle real-time updates if needed
    useEffect(() => {
        const handleNotificationUpdate = () => {
            fetchNotifications();
        };

        window.addEventListener('notificationUpdate', handleNotificationUpdate);
        return () => {
            window.removeEventListener('notificationUpdate', handleNotificationUpdate);
        };
    }, []);


    const openPanel = () => {
        dispatch(setPanelExpand(true));
    };

    const closePanel = () => {
        dispatch(setPanelExpand(false));
        const bodyClassList = document.body.classList;
        if (bodyClassList.contains('drawer-lock-scroll')) {
            bodyClassList.remove('drawer-lock-scroll', 'drawer-open');
        }
    };

    const handleFinancialYearChange = (year: string) => {
        setSelectedFinancialYear(year);
        // You can add any additional logic here that needs to run when the financial year changes
    };

    // Listen for financial year change events
    useEffect(() => {
        const handleFinancialYearChangeEvent = (event: CustomEvent) => {
            setSelectedFinancialYear(event.detail);
        };

        window.addEventListener(FINANCIAL_YEAR_CHANGE_EVENT, handleFinancialYearChangeEvent as EventListener);

        return () => {
            window.removeEventListener(FINANCIAL_YEAR_CHANGE_EVENT, handleFinancialYearChangeEvent as EventListener);
        };
    }, []);

    return (
        <div className="flex items-center">
            <div className="flex items-center gap-6">
                <FinancialYearFilter onChange={handleFinancialYearChange} />
                <Notification notificationData={notificationData} />
            </div>
            <Drawer
                title="Side Panel"
                isOpen={panelExpand}
                placement={direction === 'rtl' ? 'left' : 'right'}
                width={375}
                onClose={closePanel}
                onRequestClose={closePanel}
            >
                <SidePanelContent callBackClose={closePanel} />
            </Drawer>
        </div>
    );
};

const SidePanel = withHeaderItem(_SidePanel);

export default SidePanel;