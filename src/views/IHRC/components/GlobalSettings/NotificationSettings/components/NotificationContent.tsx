// import React, { useState, ChangeEvent, useEffect } from 'react'
// import { Switcher, Checkbox, Button, Avatar } from '@/components/ui'
// import OutlinedInput from '@/components/ui/OutlinedInput'
// import { Dialog, Input, Notification, toast } from '@/components/ui'
// import {
//     HiOutlineBell,
//     HiOutlineCalendar,
//     HiOutlineClipboardCheck,
//     HiOutlineBan,
//     HiOutlinePlusCircle,
//     HiOutlineDocumentText,
//     HiOutlineClipboardList,
//     HiOutlineExclamationCircle,
//     HiOutlineBadgeCheck,
// } from 'react-icons/hi'
// import { useDispatch } from 'react-redux'
// import {
//     createNotificationSettings,
//     fetchUnmarkedNotifications,
// } from '@/store/slices/notification/notificationSlice'
// import { showErrorNotification } from '@/components/ui/ErrorMessage'
// import Lottie from 'lottie-react'
// import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json'
// import httpClient from '@/api/http-client'
// import { endpoints } from '@/api/endpoint'

// interface FormData {
//     daysBeforeNotify: number
//     totalTimes: number
//     pushEnabled: boolean
//     emailEnabled: boolean
// }

// const NotificationContent: React.FC = () => {
//     const [selectAll, setSelectAll] = useState(false)
//     const [notificationTypes, setNotificationTypes] = useState({
//         ComplianceApproved: false,
//         ComplianceRejected: false,
//         ComplianceUpdateRequired: false,
//         ComplianceDeadlineReminder: false,
//         NewComplianceAdded: false,
//         PolicyUpdate: false,
//         AuditNotification: false,
//         ViolationsNotification: false,
//         CertificationExpirationsNotification: false,
//     })
//     const dispatch = useDispatch()
//     const [formData, setFormData] = useState<FormData>({
//         daysBeforeNotify: 0,
//         totalTimes: 0,
//         pushEnabled: false,
//         emailEnabled: false,
//     })
//     const [isLoading, setIsLoading] = useState(false)
//     const [deadlineReminder, setDeadlineReminder] = useState('')

//     useEffect(() => {
//         const fetchNotificationData = async () => {
//             try {
//                 const response = await httpClient.get(
//                     endpoints.notification.notification(),
//                 )
//                 console.log('Notification Data:', response)

//                 // Check if the response has data and update the form state
//                 if (response.data.data && response.data.data.length > 0) {
//                     console.log('data')
//                     const {
//                         days_before,
//                         total_times,
//                         email_enabled,
//                         push_enabled,
//                     } = response.data.data[0]
//                     setFormData((prev) => ({
//                         ...prev,
//                         daysBeforeNotify: days_before || 0,
//                         totalTimes: total_times || 0,
//                         emailEnabled: email_enabled || false,
//                         pushEnabled: push_enabled || false,
//                     }))
//                 }
//             } catch (error) {
//                 console.error('Error fetching notification data:', error)
//             }
//         }

//         fetchNotificationData()
//     }, []) // Empty dependency array ensures this runs only once on mount

//     const handleInputChange = (
//         field: keyof FormData,
//         value: string | boolean,
//     ) => {
//         setFormData((prev) => ({
//             ...prev,
//             [field]: typeof value === 'string' ? parseInt(value) || 0 : value,
//         }))
//     }

//     useEffect(() => {
//         const allChecked = Object.values(notificationTypes).every(
//             (value) => value === true,
//         )
//         setSelectAll(allChecked)
//     }, [notificationTypes])

//     const handleSelectAll = () => {
//         const newSelectAll = !selectAll
//         setSelectAll(newSelectAll)
//         setNotificationTypes((prevTypes) =>
//             Object.keys(prevTypes).reduce(
//                 (acc, key) => {
//                     acc[key] = newSelectAll
//                     return acc
//                 },
//                 { ...prevTypes },
//             ),
//         )
//     }

//     const onNotificationTypeChange = (type: string) => {
//         setNotificationTypes((prev) => ({
//             ...prev,
//             [type]: !prev[type as keyof typeof prev],
//         }))
//     }

//     const onDeadlineReminderChange = (value: string) => {
//         setDeadlineReminder(value)
//     }
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const data = await dispatch(fetchUnmarkedNotifications())
//                 console.log(data.payload)
//             } catch (error) {
//                 console.error('Error fetching notifications:', error)
//             }
//         }

//         fetchData()
//     }, [])
//     const onSaveChanges = async () => {
//         try {
//             if (!formData) {
//                 toast.push(
//                     <Notification title="Error" closable={true} type="danger">
//                         Please fill in the required fields
//                     </Notification>,
//                 )
//                 return
//             }

//             // Set loading to true before the API call
//             setIsLoading(true)

//             const res = await dispatch(createNotificationSettings(formData))
//                 .unwrap()
//                 .catch((error: any) => {
//                     throw error
//                 })

//             if (res) {
//                 toast.push(
//                     <Notification title="Success" type="success">
//                         Settings saved successfully!
//                     </Notification>,
//                 )

//                 // Reset form data
//                 // setFormData({
//                 //     daysBeforeNotify: 0,
//                 //     totalTimes: 0,
//                 //     pushEnabled: false,
//                 //     emailEnabled: false
//                 // });

//                 // Reset notification types
//                 setNotificationTypes({
//                     ComplianceApproved: false,
//                     ComplianceRejected: false,
//                     ComplianceUpdateRequired: false,
//                     ComplianceDeadlineReminder: false,
//                     NewComplianceAdded: false,
//                     PolicyUpdate: false,
//                     AuditNotification: false,
//                     ViolationsNotification: false,
//                     CertificationExpirationsNotification: false,
//                 })

//                 // Reset select all
//                 setSelectAll(false)
//             }
//         } catch (error) {
//             console.error('Save error:', error)
//         } finally {
//             // Set loading back to false after everything is done
//             setIsLoading(false)
//             console.log('done')
//         }
//     }

//     const getIcon = (type: string) => {
//         switch (type) {
//             case 'ComplianceApproved':
//                 return (
//                     <Avatar
//                         shape="circle"
//                         className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100"
//                         icon={<HiOutlineClipboardCheck />}
//                     />
//                 )
//             case 'ComplianceRejected':
//                 return (
//                     <Avatar
//                         shape="circle"
//                         className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100"
//                         icon={<HiOutlineBan />}
//                     />
//                 )
//             case 'ComplianceUpdateRequired':
//                 return (
//                     <Avatar
//                         shape="circle"
//                         className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100"
//                         icon={<HiOutlineCalendar />}
//                     />
//                 )
//             case 'ComplianceDeadlineReminder':
//                 return (
//                     <Avatar
//                         shape="circle"
//                         className="bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-100"
//                         icon={<HiOutlineBell />}
//                     />
//                 )
//             case 'NewComplianceAdded':
//                 return (
//                     <Avatar
//                         shape="circle"
//                         className="bg-purple-100 text-purple-600 dark:bg-yellow-500/20 dark:text-yellow-100"
//                         icon={<HiOutlinePlusCircle />}
//                     />
//                 )
//             case 'PolicyUpdate':
//                 return (
//                     <Avatar
//                         shape="circle"
//                         className="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100"
//                         icon={<HiOutlineDocumentText />}
//                     />
//                 )
//             case 'AuditNotification':
//                 return (
//                     <Avatar
//                         shape="circle"
//                         className="bg-teal-100 text-teal-600 dark:bg-teal-500/20 dark:text-teal-100"
//                         icon={<HiOutlineClipboardList />}
//                     />
//                 )
//             case 'ViolationsNotification':
//                 return (
//                     <Avatar
//                         shape="circle"
//                         className="bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-100"
//                         icon={<HiOutlineExclamationCircle />}
//                     />
//                 )
//             case 'CertificationExpirationsNotification':
//                 return (
//                     <Avatar
//                         shape="circle"
//                         className="bg-pink-100 text-pink-600 dark:bg-pink-500/20 dark:text-pink-100"
//                         icon={<HiOutlineBadgeCheck />}
//                     />
//                 )
//             default:
//                 return null
//         }
//     }

//     const NotificationPreview = ({ type, isChecked }) => {
//         if (!isChecked) return null

//         const getMessage = () => {
//             switch (type) {
//                 case 'ComplianceApproved':
//                     return 'Admin approved Compliance ID: C12345 for Branch XYZ'
//                 case 'ComplianceRejected':
//                     return 'Admin rejected Compliance ID: C67890 for Branch ABC'
//                 case 'ComplianceUpdateRequired':
//                     return 'You have 5 compliances to be updated by today'
//                 case 'ComplianceDeadlineReminder':
//                     return 'Compliance ID: C54321 deadline is approaching'
//                 case 'NewComplianceAdded':
//                     return 'New compliance added: Annual Review 2024'
//                 case 'PolicyUpdate':
//                     return 'Policy update: New data protection guidelines effective from next month'
//                 case 'AuditNotification':
//                     return 'Upcoming compliance audit scheduled for next week'
//                 case 'ViolationsNotification':
//                     return 'Alert: Potential compliance violation detected in Department X'
//                 case 'CertificationExpirationsNotification':
//                     return 'Your ISO 27001 certification expires in 30 days. Renewal required.'
//                 default:
//                     return ''
//             }
//         }

//         return (
//             <div className="flex items-start space-x-3 p-3 border-b border-gray-200 dark:border-gray-600 mb-2">
//                 <div className="flex-shrink-0">{getIcon(type)}</div>
//                 <div>
//                     <h4 className="text-sm font-semibold">
//                         {type.split(/(?=[A-Z])/).join(' ')}
//                     </h4>
//                     <p className="text-xs text-gray-600">{getMessage()}</p>
//                     <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
//                 </div>
//             </div>
//         )
//     }

//     const EmptyPreviewMessage = () => (
//         <div className="flex flex-col items-center justify-center h-full text-gray-500">
//             <HiOutlineBell className="w-12 h-12 mb-4 text-gray-300" />
//             <p className="text-center">
//                 To see previews of notifications,
//                 <br />
//                 select one or more notification types.
//             </p>
//         </div>
//     )

//     if (isLoading) {
//         console.log('Loading....................')

//         return (
//             <div className="flex flex-col items-center justify-center h-96 text-gray-500 rounded-xl">
//                 <div className="w-28 h-28">
//                     <Lottie
//                         animationData={loadingAnimation}
//                         loop
//                         className="w-24 h-24"
//                     />
//                 </div>
//                 <p className="text-lg font-semibold">Loading Data...</p>
//             </div>
//         )
//     }

//     return (
//         <div className="space-y-8">
//             <div className="flex space-x-4">
//                 <div className="w-1/2">
//                     <div className="space-y-8">
//                         <div className="flex items-center mb-6">
//                             <Checkbox
//                                 checked={selectAll}
//                                 onChange={handleSelectAll}
//                             />
//                             <h3 className="text-lg font-semibold text-gray-700">
//                                 Notification Types:
//                             </h3>
//                         </div>
//                         {Object.entries(notificationTypes).map(
//                             ([key, value]) => (
//                                 <div
//                                     key={key}
//                                     className="flex items-center ml-4"
//                                 >
//                                     <Checkbox
//                                         checked={value}
//                                         onChange={() =>
//                                             onNotificationTypeChange(key)
//                                         }
//                                     />
//                                     <label
//                                         htmlFor={key}
//                                         className="ml-2 text-gray-600"
//                                     >
//                                         {key.split(/(?=[A-Z])/).join(' ')}
//                                     </label>
//                                 </div>
//                             ),
//                         )}
//                     </div>
//                 </div>

//                 <div className="w-1/2">
//                     <h3 className="text-lg font-semibold text-gray-700 mb-4">
//                         Notification Previews:
//                     </h3>
//                     <div className="space-y-2 overflow-y-auto border p-4 rounded-md h-[410px]">
//                         {Object.values(notificationTypes).some(
//                             (value) => value,
//                         ) ? (
//                             Object.entries(notificationTypes).map(
//                                 ([key, value]) => (
//                                     <NotificationPreview
//                                         key={key}
//                                         type={key}
//                                         isChecked={value}
//                                     />
//                                 ),
//                             )
//                         ) : (
//                             <EmptyPreviewMessage />
//                         )}
//                     </div>
//                 </div>
//             </div>

//             <div className="w-full max-w-lg bg-white rounded-lg shadow-sm p-6 space-y-6">
//                 {/* Header */}
//                 <div className="border-b pb-4">
//                     <h2 className="text-2xl font-semibold text-gray-900">
//                         Compliance Deadline Reminder
//                     </h2>
//                     <p className="mt-1 text-sm text-gray-500">
//                         Configure your reminder preferences for compliance
//                         deadlines
//                     </p>
//                 </div>

//                 {/* Form Content */}
//                 <div className="space-y-6">
//                     {/* Days before notify */}
//                     <div className="space-y-2">
//                         <label className="text-sm font-medium text-gray-700">
//                             Advance Notice Period
//                         </label>
//                         <div className="flex items-center space-x-3">
//                             <OutlinedInput
//                                 label="Enter Days"
//                                 value={formData.daysBeforeNotify.toString()}
//                                 onChange={(value) =>
//                                     handleInputChange('daysBeforeNotify', value)
//                                 }
//                                 className="w-24"
//                             />
//                             <span className="text-gray-600">
//                                 days before deadline
//                             </span>
//                         </div>
//                     </div>

//                     {/* Number of times */}
//                     <div className="space-y-2">
//                         <label className="text-sm font-medium text-gray-700">
//                             Reminder Frequency
//                         </label>
//                         <div className="flex items-center space-x-3">
//                             <OutlinedInput
//                                 label="Number of Times"
//                                 value={formData.totalTimes.toString()}
//                                 onChange={(value) =>
//                                     handleInputChange('totalTimes', value)
//                                 }
//                                 className="w-24"
//                             />
//                             <span className="text-gray-600">times</span>
//                         </div>
//                     </div>

//                     {/* Notification preferences */}
//                     <div className="space-y-3">
//                         <label className="text-sm font-medium text-gray-700">
//                             Notification Channels
//                         </label>
//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-gray-50">
//                                 <Checkbox
//                                     checked={formData.pushEnabled}
//                                     onChange={(checked) =>
//                                         handleInputChange(
//                                             'pushEnabled',
//                                             checked,
//                                         )
//                                     }
//                                 />
//                                 <label className="text-sm text-gray-600">
//                                     Push Notifications
//                                 </label>
//                             </div>
//                             <div className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-gray-50">
//                                 <Checkbox
//                                     checked={formData.emailEnabled}
//                                     onChange={(checked) =>
//                                         handleInputChange(
//                                             'emailEnabled',
//                                             checked,
//                                         )
//                                     }
//                                 />
//                                 <label className="text-sm text-gray-600">
//                                     Email Notifications
//                                 </label>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Confirm Button */}
//             </div>

//             <div className="flex justify-end">
//                 <Button variant="solid" onClick={onSaveChanges}>
//                     Confirm
//                 </Button>
//             </div>
//         </div>
//     )
// }

// export default NotificationContent



import React, { useState, ChangeEvent, useEffect } from 'react'
import { Switcher, Checkbox, Button, Avatar, Select } from '@/components/ui'
import OutlinedInput from '@/components/ui/OutlinedInput'
import { Dialog, Input, Notification, toast } from '@/components/ui'
import {
    HiOutlineBell,
    HiOutlineCalendar,
    HiOutlineClipboardCheck,
    HiOutlineBan,
    HiOutlinePlusCircle,
    HiOutlineDocumentText,
    HiOutlineClipboardList,
    HiOutlineExclamationCircle,
    HiOutlineBadgeCheck,
} from 'react-icons/hi'
import { useDispatch } from 'react-redux'
import {
    createNotificationSettings,
    fetchUnmarkedNotifications,
} from '@/store/slices/notification/notificationSlice'
import { showErrorNotification } from '@/components/ui/ErrorMessage'
import Lottie from 'lottie-react'
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'

interface FormData {
    daysBeforeNotify: number
    totalTimes: number
    pushEnabled: boolean
    emailEnabled: boolean
}

const NotificationContent: React.FC = () => {
    const [selectAll, setSelectAll] = useState(true)
    const [notificationTypes, setNotificationTypes] = useState({
        ComplianceApproved: true,
        ComplianceRejected: true,
        ComplianceUpdateRequired: true,
        ComplianceDeadlineReminder: true,
        NewComplianceAdded: true,
        PolicyUpdate: true,
        AuditNotification: true,
        ViolationsNotification: true,
        CertificationExpirationsNotification: true,
    })
    const dispatch = useDispatch()
    const [formData, setFormData] = useState<FormData>({
        daysBeforeNotify: 1,
        totalTimes: 1,
        pushEnabled: false,
        emailEnabled: false,
    })
    const [isLoading, setIsLoading] = useState(false)
    const [deadlineReminder, setDeadlineReminder] = useState('')

    // Options for select dropdowns
    const daysOptions = Array.from({ length: 10 }, (_, i) => ({ 
        value: (i + 1).toString(), 
        label: (i + 1).toString() 
    }))
    
    const timesOptions = Array.from({ length: 2 }, (_, i) => ({ 
        value: (i + 1).toString(), 
        label: (i + 1).toString() 
    }))

    useEffect(() => {
        const fetchNotificationData = async () => {
            try {
                const response = await httpClient.get(
                    endpoints.notification.notification(),
                )
                console.log('Notification Data:', response)

                // Check if the response has data and update the form state
                if (response.data.data && response.data.data.length > 0) {
                    console.log('data')
                    const {
                        days_before,
                        total_times,
                        email_enabled,
                        push_enabled,
                    } = response.data.data[0]
                    setFormData((prev) => ({
                        ...prev,
                        daysBeforeNotify: days_before || 1,
                        totalTimes: total_times || 1,
                        emailEnabled: email_enabled || false,
                        pushEnabled: push_enabled || false,
                    }))
                }
            } catch (error) {
                console.error('Error fetching notification data:', error)
            }
        }

        fetchNotificationData()
    }, []) // Empty dependency array ensures this runs only once on mount

    const handleInputChange = (
        field: keyof FormData,
        value: string | boolean,
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: typeof value === 'string' ? parseInt(value) || 0 : value,
        }))
    }

    useEffect(() => {
        const allChecked = Object.values(notificationTypes).every(
            (value) => value === true,
        )
        setSelectAll(allChecked)
    }, [notificationTypes])

    const handleSelectAll = () => {
        const newSelectAll = !selectAll
        setSelectAll(newSelectAll)
        setNotificationTypes((prevTypes) =>
            Object.keys(prevTypes).reduce(
                (acc, key) => {
                    acc[key] = newSelectAll
                    return acc
                },
                { ...prevTypes },
            ),
        )
    }

    const onNotificationTypeChange = (type: string) => {
        setNotificationTypes((prev) => ({
            ...prev,
            [type]: !prev[type as keyof typeof prev],
        }))
    }

    const onDeadlineReminderChange = (value: string) => {
        setDeadlineReminder(value)
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await dispatch(fetchUnmarkedNotifications())
                console.log(data.payload)
            } catch (error) {
                console.error('Error fetching notifications:', error)
            }
        }

        fetchData()
    }, [])
    const onSaveChanges = async () => {
        try {
            if (!formData) {
                toast.push(
                    <Notification title="Error" closable={true} type="danger">
                        Please fill in the required fields
                    </Notification>,
                )
                return
            }

            // Set loading to true before the API call
            setIsLoading(true)

            const res = await dispatch(createNotificationSettings(formData))
                .unwrap()
                .catch((error: any) => {
                    throw error
                })

            if (res) {
                toast.push(
                    <Notification title="Success" type="success">
                        Settings saved successfully!
                    </Notification>,
                )

                // Reset notification types
                setNotificationTypes({
                    ComplianceApproved: false,
                    ComplianceRejected: false,
                    ComplianceUpdateRequired: false,
                    ComplianceDeadlineReminder: false,
                    NewComplianceAdded: false,
                    PolicyUpdate: false,
                    AuditNotification: false,
                    ViolationsNotification: false,
                    CertificationExpirationsNotification: false,
                })

                // Reset select all
                setSelectAll(false)
            }
        } catch (error) {
            console.error('Save error:', error)
        } finally {
            // Set loading back to false after everything is done
            setIsLoading(false)
            console.log('done')
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'ComplianceApproved':
                return (
                    <Avatar
                        shape="circle"
                        className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100"
                        icon={<HiOutlineClipboardCheck />}
                    />
                )
            case 'ComplianceRejected':
                return (
                    <Avatar
                        shape="circle"
                        className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100"
                        icon={<HiOutlineBan />}
                    />
                )
            case 'ComplianceUpdateRequired':
                return (
                    <Avatar
                        shape="circle"
                        className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100"
                        icon={<HiOutlineCalendar />}
                    />
                )
            case 'ComplianceDeadlineReminder':
                return (
                    <Avatar
                        shape="circle"
                        className="bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-100"
                        icon={<HiOutlineBell />}
                    />
                )
            case 'NewComplianceAdded':
                return (
                    <Avatar
                        shape="circle"
                        className="bg-purple-100 text-purple-600 dark:bg-yellow-500/20 dark:text-yellow-100"
                        icon={<HiOutlinePlusCircle />}
                    />
                )
            case 'PolicyUpdate':
                return (
                    <Avatar
                        shape="circle"
                        className="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100"
                        icon={<HiOutlineDocumentText />}
                    />
                )
            case 'AuditNotification':
                return (
                    <Avatar
                        shape="circle"
                        className="bg-teal-100 text-teal-600 dark:bg-teal-500/20 dark:text-teal-100"
                        icon={<HiOutlineClipboardList />}
                    />
                )
            case 'ViolationsNotification':
                return (
                    <Avatar
                        shape="circle"
                        className="bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-100"
                        icon={<HiOutlineExclamationCircle />}
                    />
                )
            case 'CertificationExpirationsNotification':
                return (
                    <Avatar
                        shape="circle"
                        className="bg-pink-100 text-pink-600 dark:bg-pink-500/20 dark:text-pink-100"
                        icon={<HiOutlineBadgeCheck />}
                    />
                )
            default:
                return null
        }
    }

    const NotificationPreview = ({ type, isChecked }) => {
        if (!isChecked) return null

        const getMessage = () => {
            switch (type) {
                case 'ComplianceApproved':
                    return 'Admin approved Compliance ID: C12345 for Branch XYZ'
                case 'ComplianceRejected':
                    return 'Admin rejected Compliance ID: C67890 for Branch ABC'
                case 'ComplianceUpdateRequired':
                    return 'You have 5 compliances to be updated by today'
                case 'ComplianceDeadlineReminder':
                    return 'Compliance ID: C54321 deadline is approaching'
                case 'NewComplianceAdded':
                    return 'New compliance added: Annual Review 2024'
                case 'PolicyUpdate':
                    return 'Policy update: New data protection guidelines effective from next month'
                case 'AuditNotification':
                    return 'Upcoming compliance audit scheduled for next week'
                case 'ViolationsNotification':
                    return 'Alert: Potential compliance violation detected in Department X'
                case 'CertificationExpirationsNotification':
                    return 'Your ISO 27001 certification expires in 30 days. Renewal required.'
                default:
                    return ''
            }
        }

        return (
            <div className="flex items-start space-x-3 p-3 border-b border-gray-200 dark:border-gray-600 mb-2">
                <div className="flex-shrink-0">{getIcon(type)}</div>
                <div>
                    <h4 className="text-sm font-semibold">
                        {type.split(/(?=[A-Z])/).join(' ')}
                    </h4>
                    <p className="text-xs text-gray-600">{getMessage()}</p>
                    <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                </div>
            </div>
        )
    }

    const EmptyPreviewMessage = () => (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <HiOutlineBell className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-center">
                To see previews of notifications,
                <br />
                select one or more notification types.
            </p>
        </div>
    )

    if (isLoading) {
        console.log('Loading....................')

        return (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500 rounded-xl">
                <div className="w-28 h-28">
                    <Lottie
                        animationData={loadingAnimation}
                        loop
                        className="w-24 h-24"
                    />
                </div>
                <p className="text-lg font-semibold">Loading Data...</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* <div className="flex space-x-4"> */}
                {/* <div className="w-1/2"> */}
                    {/* <div className="space-y-8"> */}
                        {/* <div className="flex items-center mb-6">
                            <Checkbox
                                checked={selectAll}
                                onChange={handleSelectAll}
                            />
                            <h3 className="text-lg font-semibold text-gray-700">
                                Notification Types:
                            </h3>
                        </div> */}
                        {/* {Object.entries(notificationTypes).map(
                            ([key, value]) => (
                                <div
                                    key={key}
                                    className="flex items-center ml-4"
                                >
                                    <Checkbox
                                        checked={value}
                                        onChange={() =>
                                            onNotificationTypeChange(key)
                                        }
                                    />
                                    <label
                                        htmlFor={key}
                                        className="ml-2 text-gray-600"
                                    >
                                        {key.split(/(?=[A-Z])/).join(' ')}
                                    </label>
                                </div>
                            ),
                        )} */}
                    {/* </div> */}
                {/* </div> */}

                {/* <div className="w-1/2">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Notification Previews:
                    </h3>
                    <div className="space-y-2 overflow-y-auto border p-4 rounded-md h-[410px]">
                        {Object.values(notificationTypes).some(
                            (value) => value,
                        ) ? (
                            Object.entries(notificationTypes).map(
                                ([key, value]) => (
                                    <NotificationPreview
                                        key={key}
                                        type={key}
                                        isChecked={value}
                                    />
                                ),
                            )
                        ) : (
                            <EmptyPreviewMessage />
                        )}
                    </div>
                </div> */}
            {/* </div> */}

            <div className="w-full max-w-lg bg-white rounded-lg shadow-sm space-y-6">
                {/* Header */}
                <div className="border-b pb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Compliance Deadline Reminder
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Configure your reminder preferences for compliance
                        deadlines
                    </p>
                </div>

                {/* Form Content */}
                <div className="space-y-6">
                    {/* Days before notify - using OutlinedSelect */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Advance Notice Period
                        </label>
                        <div className="flex items-center space-x-3">
                            <Select
                                isSearchable={false}
                                className="w-32"
                                options={daysOptions}
                                value={daysOptions.find(
                                    (option) => option.value === formData.daysBeforeNotify.toString()
                                ) || daysOptions[0]}
                                onChange={(option) => 
                                    handleInputChange('daysBeforeNotify', option.value)
                                }
                            />
                            <span className="text-gray-600">
                                days before deadline
                            </span>
                        </div>
                    </div>

                    {/* Number of times - using OutlinedSelect */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Reminder Frequency
                        </label>
                        <div className="flex items-center space-x-3">
                            <Select
                                isSearchable={false}
                                className="w-32"
                                options={timesOptions}
                                value={timesOptions.find(
                                    (option) => option.value === formData.totalTimes.toString()
                                ) || timesOptions[0]}
                                onChange={(option) => 
                                    handleInputChange('totalTimes', option.value)
                                }
                            />
                            <span className="text-gray-600">times <span className='text-gray-400'>
                                (1st time:- 9:00 AM, 2nd time:- 12:00 PM)</span>
                                </span>
                        </div>
                    </div>

                    {/* Notification preferences */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">
                            Notification Channels
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-gray-50">
                                <Checkbox
                                    checked={formData.pushEnabled}
                                    onChange={(checked) =>
                                        handleInputChange(
                                            'pushEnabled',
                                            checked,
                                        )
                                    }
                                />
                                <label className="text-sm text-gray-600">
                                    Push Notifications
                                </label>
                            </div>
                            <div className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-gray-50">
                                <Checkbox
                                    checked={formData.emailEnabled}
                                    onChange={(checked) =>
                                        handleInputChange(
                                            'emailEnabled',
                                            checked,
                                        )
                                    }
                                />
                                <label className="text-sm text-gray-600">
                                    Email Notifications
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Confirm Button */}
            </div>

            <div className="flex justify-end">
                <Button variant="solid" onClick={onSaveChanges}>
                    Confirm
                </Button>
            </div>
        </div>
    )
}

export default NotificationContent