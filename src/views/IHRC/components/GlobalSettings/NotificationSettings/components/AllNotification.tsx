

// import React, { useEffect, useState } from 'react';
// import { Card } from '@/components/ui';
// import Avatar from '@/components/ui/Avatar';
// import Badge from '@/components/ui/Badge';
// import Spinner from '@/components/ui/Spinner';
// import { HiOutlineBell } from 'react-icons/hi';
// import useThemeClass from '@/utils/hooks/useThemeClass';
// import { useDispatch } from 'react-redux';
// import { 
//     fetchAllNotifications,
//     markNotificationAsRead 
// } from '@/store/slices/notification/notificationSlice';
// import store from '@/store';
// import OutlinedSelect from '@/components/ui/Outlined';
// import CustomDateRangePicker from '../../../RemittanceTracker/PFTracker/components/CustomDateRangePicker';
// import { Link, useNavigate } from 'react-router-dom';

// // Define the Notification type
// interface Notification {
//     id: number;
//     company_admin_id: number;
//     company_id?: number;
//     module_type: string;
//     module_reference: string;
//     title: string;
//     content: string;
//     company_name?: string;
//     logo?: string;
//     logo_path?: string;
//     due_date: string;
//     created_at: string;
//     is_read: boolean;
//     users?: {
//         id: number;
//         name: string;
//         email: string;
//         is_read: boolean;
//         role_id: number | null;
//         personalizedTitle: string;
//         personalizedContent: string;
//     }[];
//     days_left?: string;
// }

// // Utility functions remain the same
// const calculateDaysLeft = (dueDate: string): string => {
//     const today = new Date();
//     const due = new Date(dueDate);
//     const diffTime = due.getTime() - today.getTime();
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays.toString();
// };

// const formatDate = (date: string): string => {
//     const d = new Date(date);
//     const day = d.getDate().toString().padStart(2, '0');
//     const month = (d.getMonth() + 1).toString().padStart(2, '0');
//     const year = d.getFullYear();
//     return `${day}/${month}/${year}`;
// };



// const AllNotifications = () => {
//     const [notifications, setNotifications] = useState<Notification[]>([]);
//     const [loading, setLoading] = useState(true);
//     const { bgTheme } = useThemeClass();
//     const dispatch = useDispatch();
//     const [filterRead, setFilterRead] = useState<boolean | null>(null);
//     const [startDate, setStartDate] = useState<Date | null>(null);
//     const [endDate, setEndDate] = useState<Date | null>(null);
    
    
//     const { login } = store.getState();
//     const currentUserId = login?.user.user.id;
//     const navigate = useNavigate();
//     const filterOptions = [
//         { value: null, label: 'All Notifications' },
//         { value: true, label: 'Unread' },
//         // { value: false, label: 'Read' }
//     ];

//     useEffect(() => {
//         fetchNotificationsList();
//     }, [filterRead, startDate, endDate]); // Add date dependencies

//     const fetchNotificationsList = async () => {
//         try {
//             // Prepare date parameters
//             const params = {
//                 unmarked: filterRead === true ? 'true' : filterRead === false ? 'false' : undefined,
//                 startDate: startDate ? startDate.toISOString().split('T')[0] : undefined,
//                 endDate: endDate ? endDate.toISOString().split('T')[0] : undefined
//             };

//             const response = await dispatch(fetchAllNotifications(params));
//             console.log('response of notification', response);

//             if (response.payload && response.payload.data) {
//                 const processedNotifications = response.payload.data.map((notification: Notification) => ({
//                     ...notification,
//                     days_left: calculateDaysLeft(notification.due_date)
//                 }));

//                 setNotifications(processedNotifications);
//                 console.log('notification list', notifications.map((data) => {
//                     return {
//                         data
//                     }
//                 }));
//             }
//         } catch (error) {
//             console.error('Error fetching notifications:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleNotificationClick = async (notificationId: number) => {
//         try {
//             const notification = notifications.find(n => n.id === notificationId);
//             const isUnread = notification && 
//                 ((!notification.is_read) || 
//                  (notification.users && notification.users[0] && !notification.users[0].is_read));
            
//             if (isUnread) {
//                 // Call the API to mark the notification as read
//                 const response = await dispatch(markNotificationAsRead(notificationId));
                
//                 // Update the state immutably
//                 if (response.payload) {
//                     setNotifications(prevNotifications =>
//                         prevNotifications.map(notif => {
//                             if (notif.id === notificationId) {
//                                 // Create a new object for the updated notification
//                                 const updatedNotif = { 
//                                     ...notif, 
//                                     is_read: true, 
//                                     users: notif.users?.map(user => ({
//                                         ...user,
//                                         is_read: true
//                                     })) 
//                                 };
//                                 return updatedNotif;
//                             }
//                             return notif;
//                         })
//                     );
//                 }
//             }
            
//             // Navigate to the notification path
//             if (notification?.logo_path) {
//                 navigate(notification.logo_path);
//             }
//         } catch (error) {
//             console.error('Error marking notification as read:', error);
//         }
//     };

//     useEffect(() => {
//         console.log('Notifications updated:', notifications);
//     }, [notifications]);

//     const notificationTypeAvatar = (type: string) => {
//         let className = 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-100';
        
//         if (type === 'ESI') {
//             className = 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100';
//         } else if (type === 'PF') {
//             className = 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-100';
//         }

//         return (
//             <Avatar
//                 shape="circle"
//                 className={className}
//                 icon={<HiOutlineBell />}
//             />
//         );
//     };

//     const handleFilterChange = (option: { value: boolean | null }) => {
//         setFilterRead(option ? option.value : null);
//     };

//     const handleDateRangeApply = (start: Date, end: Date) => {
//         setStartDate(start);
//         setEndDate(end);
//     };

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center min-h-[300px]">
//                 <Spinner size={40} />
//             </div>
//         );
//     }

//     const isNotificationRead = (notification: Notification): boolean => {
//         // Check user-level is_read first, then fall back to top-level is_read
//         if (notification.users && notification.users.length > 0) {
//             return notification.users[0].is_read;
//         }
//         return notification.is_read;
//     };

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <Card>
//                 <div className="mb-6 flex justify-between items-center">
//                     <h4 className="text-lg font-semibold">All Notifications</h4>
//                     <div className="flex gap-3">
//                         <CustomDateRangePicker 
//                             onApply={handleDateRangeApply}
//                         />
//                         <div className="w-[170px]">
//                             <OutlinedSelect
//                                 label="Filter Notifications"
//                                 options={filterOptions}
//                                 value={filterOptions.find(option => option.value === filterRead)}
//                                 onChange={handleFilterChange}
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 <div className="divide-y divide-gray-200 dark:divide-gray-600">
//                     {notifications.length > 0 ? (
//                         notifications.map((item: Notification) => (
//                             <div
//                                 key={item.id}
//                                 className="relative flex px-4 py-4 hover:bg-gray-50 dark:hover:bg-black dark:hover:bg-opacity-20 cursor-pointer"
//                                 onClick={() => handleNotificationClick(item.id)}
//                             >
//                                 <div>{notificationTypeAvatar(item.module_type)}</div>
//                                 <div className="ltr:ml-3 rtl:mr-3 w-full">
//                                     <div>
//                                         <span className="font-semibold heading-text">
//                                             {item.title}
//                                         </span>
//                                     </div>
//                                     <p className="mb-1 text-sm">{item.content}</p>
//                                     <div className="mt-1 flex flex-wrap gap-2 text-xs">
//                                         <span className="text-red-500">
//                                             Due: {formatDate(item.due_date)}
//                                         </span>
//                                         <span className="text-gray-500">
//                                             Company: {item.company_name}
//                                         </span>
//                                         <span className="text-blue-500">
//                                             Reference: {item.module_reference}
//                                         </span>
//                                         <Link className="text-red-500" to={item.logo_path}>
//                                             Path: {item.logo_path}
//                                         </Link>
//                                     </div>
//                                 </div>
//                                 <Badge
//     className="absolute top-4 ltr:right-4 rtl:left-4 mt-1.5"
//     innerClass={`${
//         isNotificationRead(item) ? 'bg-gray-300' : bgTheme
//     }`}
// />
//                             </div>
//                         ))
//                     ) : (
//                         <div className="py-8 text-center">
//                             <h6 className="font-semibold">No notifications!</h6>
//                             <p className="mt-1">You're all caught up!</p>
//                         </div>
//                     )}
//                 </div>
//             </Card>
//         </div>
//     );
// };

// export default AllNotifications;









import React, { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { HiOutlineBell } from 'react-icons/hi';
import useThemeClass from '@/utils/hooks/useThemeClass';
import { useDispatch } from 'react-redux';
import { 
    fetchAllNotifications,
    markNotificationAsRead 
} from '@/store/slices/notification/notificationSlice';
import store from '@/store';
import OutlinedSelect from '@/components/ui/Outlined';
import CustomDateRangePicker from '../../../RemittanceTracker/PFTracker/components/CustomDateRangePicker';
import { Link, useNavigate } from 'react-router-dom';

// Define the Notification type
interface Notification {
    id: number;
    company_admin_id: number;
    company_id?: number;
    module_type: string;
    module_reference: string;
    title: string;
    content: string;
    company_name?: string;
    logo?: string;
    logo_path?: string;
    due_date: string;
    created_at: string;
    is_read: boolean;
    is_processed?: boolean;
    is_active?: boolean;
    users?: {
        id: number;
        name: string;
        email: string;
        is_read: boolean;
        role_id: number | null;
        personalizedTitle: string;
        personalizedContent: string;
    }[];
    days_left?: string;
}

// Utility functions
const calculateDaysLeft = (dueDate: string): string => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays.toString();
};

const formatDate = (date: string): string => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

const AllNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const { bgTheme } = useThemeClass();
    const dispatch = useDispatch();
    const [filterRead, setFilterRead] = useState<boolean | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    
    // Keep track of which notifications have been manually marked as read by the user
    // This will persist even if the API response doesn't update correctly
    const [manuallyReadNotifications, setManuallyReadNotifications] = useState<Set<number>>(new Set());
    
    const { login } = store.getState();
    const currentUserId = login?.user?.user?.id;
    const navigate = useNavigate();
    
    const filterOptions = [
        { value: null, label: 'All Notifications' },
        { value: true, label: 'Unread' },
        // { value: false, label: 'Read' }
    ];

    const fetchNotificationsList = useCallback(async () => {
        try {
            setLoading(true);
            
            // Prepare date parameters
            const params = {
                unmarked: filterRead === true ? 'true' : filterRead === false ? 'false' : undefined,
                startDate: startDate ? startDate.toISOString().split('T')[0] : undefined,
                endDate: endDate ? endDate.toISOString().split('T')[0] : undefined
            };

            const response = await dispatch(fetchAllNotifications(params));
            console.log('Response of notification:', response);

            if (response.payload && response.payload.data) {
                const processedNotifications = response.payload.data.map((notification: Notification) => ({
                    ...notification,
                    days_left: calculateDaysLeft(notification.due_date)
                }));

                setNotifications(processedNotifications);
                console.log('Notification list:', processedNotifications);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [dispatch, filterRead, startDate, endDate]);

    useEffect(() => {
        fetchNotificationsList();
    }, [fetchNotificationsList]);

    // Checks if a notification should be considered as read
    const isNotificationRead = useCallback((notification: Notification): boolean => {
        // First priority: Check if we've manually marked it as read in this session
        if (manuallyReadNotifications.has(notification.id)) {
            return true;
        }
        
        // Second priority: Check user-level is_read status
        if (notification.users && notification.users.length > 0) {
            const currentUser = notification.users.find(user => user.id === currentUserId);
            if (currentUser) {
                return currentUser.is_read;
            }
        }
        
        // Last priority: Check notification-level is_read
        return notification.is_read;
    }, [currentUserId, manuallyReadNotifications]);

    const handleNotificationClick = async (notificationId: number) => {
        try {
            console.log(`Clicking notification ${notificationId}`);
            
            // Immediately mark as read in our local state
            setManuallyReadNotifications(prev => {
                const newSet = new Set(prev);
                newSet.add(notificationId);
                console.log('Updated manually read notifications:', newSet);
                return newSet;
            });
            
            // Find the notification for navigation purposes
            const notification = notifications.find(n => n.id === notificationId);
            
            // Call the API to update the server state
            await dispatch(markNotificationAsRead(notificationId));
            
            // Navigate to the notification path if available
            if (notification?.logo_path) {
                navigate(notification.logo_path);
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
            // We could revert the manual read state on error, but that might be confusing
            // to users who already saw the change. Better to keep it marked as read in UI.
        }
    };

    const notificationTypeAvatar = (type: string) => {
        let className = 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-100';
        
        if (type === 'ESI') {
            className = 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100';
        } else if (type === 'PF') {
            className = 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-100';
        }

        return (
            <Avatar
                shape="circle"
                className={className}
                icon={<HiOutlineBell />}
            />
        );
    };

    const handleFilterChange = (option: { value: boolean | null }) => {
        setFilterRead(option ? option.value : null);
    };

    const handleDateRangeApply = (start: Date, end: Date) => {
        setStartDate(start);
        setEndDate(end);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <Spinner size={40} />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <div className="mb-6 flex justify-between items-center">
                    <h4 className="text-lg font-semibold">All Notifications</h4>
                    <div className="flex gap-3">
                        {/* <CustomDateRangePicker 
                            onApply={handleDateRangeApply}
                        /> */}
                        <div className="w-[170px]">
                            <OutlinedSelect
                                label="Filter Notifications"
                                options={filterOptions}
                                value={filterOptions.find(option => option.value === filterRead)}
                                onChange={handleFilterChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-600">
                    {notifications.length > 0 ? (
                        notifications.map((item: Notification) => (
                            <div
                                key={item.id}
                                className="relative flex px-4 py-4 hover:bg-gray-50 dark:hover:bg-black dark:hover:bg-opacity-20 cursor-pointer"
                                onClick={() => handleNotificationClick(item.id)}
                            >
                                <div>{notificationTypeAvatar(item.module_type)}</div>
                                <div className="ltr:ml-3 rtl:mr-3 w-full">
                                    <div>
                                        <span className="font-semibold heading-text">
                                            {item.title}
                                        </span>
                                    </div>
                                    <p className="mb-1 text-sm">{item.content}</p>
                                    <div className="mt-1 flex flex-wrap gap-2 text-xs">
                                        <span className="text-red-500">
                                            Due: {formatDate(item.due_date)}
                                        </span>
                                        <span className="text-gray-500">
                                            Company: {item.company_name}
                                        </span>
                                        <span className="text-blue-500">
                                            Reference: {item.module_reference}
                                        </span>
                                        <Link className="text-red-500" to={item.logo_path}>
                                            Path: {item.logo_path}
                                        </Link>
                                    </div>
                                </div>
                                <Badge
                                    className="absolute top-4 ltr:right-4 rtl:left-4 mt-1.5"
                                    innerClass={isNotificationRead(item) ? 'bg-gray-300' : bgTheme}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="py-8 text-center">
                            <h6 className="font-semibold">No notifications!</h6>
                            <p className="mt-1">You're all caught up!</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AllNotifications;