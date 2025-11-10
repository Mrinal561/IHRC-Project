// import React, { useState, useEffect } from 'react';
// import { Button, Dialog, Notification, Input, toast } from '@/components/ui';
// import { HiPlusCircle } from 'react-icons/hi';
// import AssignChecklistTableSearch from './AssignChecklistTableSearch';
// import BulkAlertButton from './BulkAlertButton';
// import OutlinedSelect from '@/components/ui/Outlined/Outlined';
// import httpClient from '@/api/http-client';
// import { endpoints } from '@/api/endpoint';
// import { useDispatch } from 'react-redux';
// import { updateApproverOwner } from '@/store/slices/AssignedCompliance/assignedComplianceSlice';

// interface SelectOption {
//   value: number;
//   label: string;
// }
// interface SelectOptionOwner {
//   value: string;
//   label: string;
// }

// interface BulkSetOwnerApproverButtonProps {
//   selectedIds: number[];
//   refreshTable: () => void;
// }

// export const BulkSetOwnerApproverButton: React.FC<BulkSetOwnerApproverButtonProps> = ({
//   selectedIds,
//   refreshTable
// }) => {
//   const dispatch = useDispatch();
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [remark, setRemark] = useState('');
//   const [userOptions, setUserOptions] = useState<SelectOption[]>([]);
//   const [selectedOwnerOption, setSelectedOwnerOption] = useState<SelectOption | null>(null);
//   const [selectedApproverOption, setSelectedApproverOption] = useState<SelectOption | null>(null);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [selectedScheduledFrequency, setSelectedScheduledFrequency] = useState<any>(null)

//   const scheduledOptions: SelectOptionOwner[] = [
//     { value: 'monthly', label: 'Monthly' },
//     { value: 'yearly', label: 'Yearly' },
// ]

//   useEffect(() => {
//     fetchUsersData();
//   }, []);

//   const fetchUsersData = async () => {
//     try {
//       const response = await httpClient.get(endpoints.user.getAll());

//       if (response?.data?.data && Array.isArray(response.data.data)) {
//         const mappedOptions = response.data.data.map((user: any) => ({
//           label: user.name,
//           value: user.id // Ensure value is string
//         }));

//         setUserOptions(mappedOptions);
//       } else {
//         toast.push(
//           <Notification title="Error" closable={true} type="danger">
//             Invalid data format received
//           </Notification>
//         );
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       toast.push(
//         <Notification title="Error" closable={true} type="danger">
//           Failed to fetch users
//         </Notification>
//       );
//     }
//   };

//   const handleOwnerChange = (value: SelectOption | null) => {
//     setSelectedOwnerOption(value);
//   };

//   const handleApproverChange = (value: SelectOption | null) => {
//     setSelectedApproverOption(value);
//   };

//   const handleConfirm = async () => {
//     if (!selectedOwnerOption && !selectedApproverOption) {
//       toast.push(
//         <Notification title="Warning" type="warning">
//           Please select at least an owner or approver
//         </Notification>
//       );
//       return;
//     }

//     setIsUpdating(true);
//     try {
//       const updateData = {
//         owner_id: selectedOwnerOption?.value || null,
//         approver_id: selectedApproverOption?.value || null,
//         assigned_compliance_id: selectedIds,
//         scheduled_frequency: selectedScheduledFrequency?.value || '',

//       };

//       const response = await httpClient.put(endpoints.assign.update(), updateData);

//       if (response) {
//         toast.push(
//           <Notification title="Success" type="success">
//             Owner and Approver updated successfully
//           </Notification>
//         );
//         handleCancel();
//         refreshTable();
//         // This will refresh the table and reset selections
//       } else {
//         throw new Error('Update failed');
//       }
//     } catch (error) {
//       console.error('Error updating owner/approver:', error);
//       toast.push(
//         <Notification title="Error" closable={true} type="danger">
//           Failed to update owner and approver
//         </Notification>
//       );
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const handleCancel = () => {
//     setIsDialogOpen(false);
//     setRemark('');
//     setSelectedOwnerOption(null);
//     setSelectedApproverOption(null);
//   };

//   return (
//     <div className="flex items-center justify-center gap-3">
//       <Button
//         variant="solid"
//         size="sm"
//         icon={<HiPlusCircle />}
//         onClick={() =>{
//           if (selectedIds.length === 0) {
//             toast.push(
//               <Notification title="Warning" type="warning">
//                 Please select compliances to update
//               </Notification>
//             );
//             return;
//           }
//           setIsDialogOpen(true)}}
//       >
//         Bulk Owner/Approver
//       </Button>

//       <Dialog
//         isOpen={isDialogOpen}
//         onClose={handleCancel}
//         width={500}
//       >
//         <h5 className="mb-4">Set Owner/Approver for Selected Compliances</h5>

//         <div className="space-y-6">
//           <div>
//             <label className="block mb-2">Set Owner</label>
//             <OutlinedSelect
//               label="Set Owner"
//               options={userOptions}
//               value={selectedOwnerOption}
//               onChange={handleOwnerChange}
//             />
//           </div>

//           <div>
//             <label className="block mb-2">Set Approver</label>
//             <OutlinedSelect
//               label="Set Approver"
//               options={userOptions}
//               value={selectedApproverOption}
//               onChange={handleApproverChange}
//             />
//           </div>

//           <div>
//                         <label className="block mb-2">Scheduled Frequency</label>
//                         <OutlinedSelect
//                             label="Select Scheduled Frequency"
//                             options={scheduledOptions}
//                             value={selectedScheduledFrequency}
//                             onChange={(selectedOption: SelectOption | null) => {
//                                 setSelectedScheduledFrequency(selectedOption)
//                             }}
//                         />
//                     </div>

//           {/* <div>
//             <label className="block mb-2">Remark</label>
//             <textarea
//               className="w-full p-2 border rounded"
//               rows={3}
//               placeholder="Enter remark"
//               value={remark}
//               onChange={(e) => setRemark(e.target.value)}
//             />
//           </div> */}
//         </div>

//         <div className="mt-6 text-right space-x-2">
//           <Button
//             size="sm"
//             onClick={handleCancel}
//             disabled={isUpdating}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="solid"
//             size="sm"
//             onClick={handleConfirm}
//             loading={isUpdating}
//             disabled={isUpdating}
//           >
//             {isUpdating ? 'Updating...' : 'Confirm'}
//           </Button>
//         </div>
//       </Dialog>
//     </div>
//   );
// };

// interface AssignChecklistTableToolProps {
//   selectedIds: number[];
//   refreshTable: () => void;
// }

// const AssignChecklistTableTool: React.FC<AssignChecklistTableToolProps> = ({
//   selectedIds,
//   refreshTable
// }) => {
//   return (
//     <div className="flex flex-col lg:flex-row lg:items-center gap-3">
//       <div>
//         <AssignChecklistTableSearch />
//       </div>
//       <div className="flex items-center gap-3">
//         <BulkAlertButton />
//         <BulkSetOwnerApproverButton
//           selectedIds={selectedIds}
//           refreshTable={refreshTable}
//         />
//       </div>
//     </div>
//   );
// };

// export default AssignChecklistTableTool;

import React, { useState, useEffect } from 'react'
import {
    Button,
    Dialog,
    Notification,
    Input,
    toast,
    DatePicker,
} from '@/components/ui'
import { HiPlusCircle } from 'react-icons/hi'
import AssignChecklistTableSearch from './AssignChecklistTableSearch'
import BulkAlertButton from './BulkAlertButton'
import OutlinedSelect from '@/components/ui/Outlined/Outlined'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import { useDispatch } from 'react-redux'
import { updateApproverOwner } from '@/store/slices/AssignedCompliance/assignedComplianceSlice'
import OutlinedInput from '@/components/ui/OutlinedInput'

interface SelectOption {
    value: string
    label: string
}
interface SelectOptionOwner {
    value: string
    label: string
}

interface BulkSetOwnerApproverButtonProps {
    selectedIds: number[]
    refreshTable: () => void
}

// export const BulkSetOwnerApproverButton: React.FC<BulkSetOwnerApproverButtonProps> = ({
//   selectedIds,
//   refreshTable
// }) => {
//   const dispatch = useDispatch();
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [remark, setRemark] = useState('');
//   const [userOptions, setUserOptions] = useState<SelectOption[]>([]);
//   const [selectedOwnerOption, setSelectedOwnerOption] = useState<SelectOption | null>(null);
//   const [selectedApproverOption, setSelectedApproverOption] = useState<SelectOption | null>(null);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [selectedScheduledFrequency, setSelectedScheduledFrequency] = useState<any>(null)

//   const scheduledOptions: SelectOptionOwner[] = [
//     { value: 'monthly', label: 'Monthly' },
//     { value: 'yearly', label: 'Yearly' },
// ]

//   useEffect(() => {
//     fetchUsersData();
//   }, []);

//   const fetchUsersData = async () => {
//     try {
//       const response = await httpClient.get(endpoints.user.getAll());

//       if (response?.data?.data && Array.isArray(response.data.data)) {
//         const mappedOptions = response.data.data.map((user: any) => ({
//           label: user.name,
//           value: user.id // Ensure value is string
//         }));

//         setUserOptions(mappedOptions);
//       } else {
//         toast.push(
//           <Notification title="Error" closable={true} type="danger">
//             Invalid data format received
//           </Notification>
//         );
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       toast.push(
//         <Notification title="Error" closable={true} type="danger">
//           Failed to fetch users
//         </Notification>
//       );
//     }
//   };

//   const handleOwnerChange = (value: SelectOption | null) => {
//     setSelectedOwnerOption(value);
//   };

//   const handleApproverChange = (value: SelectOption | null) => {
//     setSelectedApproverOption(value);
//   };

//   const handleConfirm = async () => {
//     if (!selectedOwnerOption && !selectedApproverOption) {
//       toast.push(
//         <Notification title="Warning" type="warning">
//           Please select at least an owner or approver
//         </Notification>
//       );
//       return;
//     }

//     setIsUpdating(true);
//     try {
//       const updateData = {
//         owner_id: selectedOwnerOption?.value || null,
//         approver_id: selectedApproverOption?.value || null,
//         assigned_compliance_id: selectedIds,
//         scheduled_frequency: selectedScheduledFrequency?.value || '',

//       };

//       const response = await httpClient.put(endpoints.assign.update(), updateData);

//       if (response) {
//         toast.push(
//           <Notification title="Success" type="success">
//             Owner and Approver updated successfully
//           </Notification>
//         );
//         handleCancel();
//         refreshTable();
//         // This will refresh the table and reset selections
//       } else {
//         throw new Error('Update failed');
//       }
//     } catch (error) {
//       console.error('Error updating owner/approver:', error);
//       toast.push(
//         <Notification title="Error" closable={true} type="danger">
//           Failed to update owner and approver
//         </Notification>
//       );
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const handleCancel = () => {
//     setIsDialogOpen(false);
//     setRemark('');
//     setSelectedOwnerOption(null);
//     setSelectedApproverOption(null);
//   };

//   return (
//     <div className="flex items-center justify-center gap-3">
//       <Button
//         variant="solid"
//         size="sm"
//         icon={<HiPlusCircle />}
//         onClick={() =>{
//           if (selectedIds.length === 0) {
//             toast.push(
//               <Notification title="Warning" type="warning">
//                 Please select compliances to update
//               </Notification>
//             );
//             return;
//           }
//           setIsDialogOpen(true)}}
//       >
//         Bulk Owner/Approver
//       </Button>

//       <Dialog
//         isOpen={isDialogOpen}
//         onClose={handleCancel}
//         width={500}
//       >
//         <h5 className="mb-4">Set Owner/Approver for Selected Compliances</h5>

//         <div className="space-y-6">
//           <div>
//             <label className="block mb-2">Set Owner</label>
//             <OutlinedSelect
//               label="Set Owner"
//               options={userOptions}
//               value={selectedOwnerOption}
//               onChange={handleOwnerChange}
//             />
//           </div>

//           <div>
//             <label className="block mb-2">Set Approver</label>
//             <OutlinedSelect
//               label="Set Approver"
//               options={userOptions}
//               value={selectedApproverOption}
//               onChange={handleApproverChange}
//             />
//           </div>

//           <div>
//                         <label className="block mb-2">Scheduled Frequency</label>
//                         <OutlinedSelect
//                             label="Select Scheduled Frequency"
//                             options={scheduledOptions}
//                             value={selectedScheduledFrequency}
//                             onChange={(selectedOption: SelectOption | null) => {
//                                 setSelectedScheduledFrequency(selectedOption)
//                             }}
//                         />
//                     </div>

//           {/* <div>
//             <label className="block mb-2">Remark</label>
//             <textarea
//               className="w-full p-2 border rounded"
//               rows={3}
//               placeholder="Enter remark"
//               value={remark}
//               onChange={(e) => setRemark(e.target.value)}
//             />
//           </div> */}
//         </div>

//         <div className="mt-6 text-right space-x-2">
//           <Button
//             size="sm"
//             onClick={handleCancel}
//             disabled={isUpdating}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="solid"
//             size="sm"
//             onClick={handleConfirm}
//             loading={isUpdating}
//             disabled={isUpdating}
//           >
//             {isUpdating ? 'Updating...' : 'Confirm'}
//           </Button>
//         </div>
//       </Dialog>
//     </div>
//   );
// };

export const BulkSetOwnerApproverButton: React.FC<
    BulkSetOwnerApproverButtonProps
> = ({ selectedIds, refreshTable }) => {
    const dispatch = useDispatch()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [userOptions, setUserOptions] = useState<SelectOption[]>([])
    const [selectedOwnerOption, setSelectedOwnerOption] =
        useState<SelectOption | null>(null)
    const [selectedApproverOption, setSelectedApproverOption] =
        useState<SelectOption | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)

    // New state for frequency and dates
    const [selectedCustomizedFrequency, setSelectedCustomizedFrequency] =
        useState<SelectOption | null>(null)
    const [dueDate, setDueDate] = useState<Date | null>(null)
    const [secondDate, setSecondDate] = useState<Date | null>(null)
    const [thirdDate, setThirdDate] = useState<Date | null>(null)
    const [lastDate, setLastDate] = useState<Date | null>(null)

    // State to manage date field states
    const [dateFieldsState, setDateFieldsState] = useState({
        isFirstDateEnabled: true,
        isSecondDateEnabled: false,
        isThirdDateEnabled: false,
        isLastDateEnabled: false,
    })

    const customizedFrequencyOptions: SelectOptionOwner[] = [
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' },
        { value: 'half_yearly', label: 'Half Yearly' },
        { value: 'quarterly', label: 'Quarterly' },
    ]

    // Function to handle frequency changes
    const handleCustomizedFrequencyChange = (
        selectedOption: SelectOption | null,
    ) => {
        setSelectedCustomizedFrequency(selectedOption)

        // Reset date states
        setDueDate(null)
        setSecondDate(null)
        setThirdDate(null)
        setLastDate(null)

        // Update date field states based on selected frequency
        switch (selectedOption?.value) {
            case 'monthly':
                setDateFieldsState({
                    isFirstDateEnabled: true,
                    isSecondDateEnabled: false,
                    isThirdDateEnabled: false,
                    isLastDateEnabled: false,
                })
                break
            case 'yearly':
                setDateFieldsState({
                    isFirstDateEnabled: true,
                    isSecondDateEnabled: false,
                    isThirdDateEnabled: false,
                    isLastDateEnabled: false,
                })
                break
            case 'half_yearly':
                setDateFieldsState({
                    isFirstDateEnabled: true,
                    isSecondDateEnabled: false,
                    isThirdDateEnabled: false,
                    isLastDateEnabled: true,
                })
                break
            case 'quarterly':
                setDateFieldsState({
                    isFirstDateEnabled: true,
                    isSecondDateEnabled: true,
                    isThirdDateEnabled: true,
                    isLastDateEnabled: true,
                })
                break
            default:
                setDateFieldsState({
                    isFirstDateEnabled: false,
                    isSecondDateEnabled: false,
                    isThirdDateEnabled: false,
                    isLastDateEnabled: false,
                })
        }
    }

    useEffect(() => {
        fetchUsersData()
    }, [])

    const fetchUsersData = async () => {
        try {
            const response = await httpClient.get(endpoints.user.getAll())

            if (response?.data?.data && Array.isArray(response.data.data)) {
                const mappedOptions = response.data.data.map((user: any) => ({
                    label: user.name,
                    value: user.id,
                }))

                setUserOptions(mappedOptions)
            } else {
                toast.push(
                    <Notification title="Error" closable={true} type="danger">
                        Invalid data format received
                    </Notification>,
                )
            }
        } catch (error) {
            console.error('Error fetching users:', error)
            toast.push(
                <Notification title="Error" closable={true} type="danger">
                    Failed to fetch users
                </Notification>,
            )
        }
    }

    const handleOwnerChange = (value: SelectOption | null) => {
        setSelectedOwnerOption(value)
    }

    const handleApproverChange = (value: SelectOption | null) => {
        setSelectedApproverOption(value)
    }

    const handleConfirm = async () => {
        if (!selectedOwnerOption && !selectedApproverOption) {
            toast.push(
                <Notification title="Warning" type="warning">
                    Please select at least an owner or approver
                </Notification>,
            )
            return
        }

        // Determine the appropriate due date based on frequency
        let selectedDueDate: Date | null = null

        switch (selectedCustomizedFrequency?.value) {
            case 'monthly':
            case 'yearly':
                selectedDueDate = dueDate
                break
            case 'half_yearly':
            case 'quarterly':
                selectedDueDate = lastDate
                break
            default:
                selectedDueDate = dueDate
        }

        if (
            (selectedOwnerOption !== null || selectedApproverOption !== null) &&
            selectedCustomizedFrequency !== null &&
            selectedDueDate // Ensure a date is selected
        ) {
            setIsUpdating(true)
            try {
                const updateData = {
                    owner_id: selectedOwnerOption?.value || null,
                    approver_id: selectedApproverOption?.value || null,
                    assigned_compliance_id: selectedIds,
                    scheduled_frequency:
                        selectedCustomizedFrequency?.value || '',
                    due_date: selectedDueDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
                }

                const response = await httpClient.put(
                    endpoints.assign.update(),
                    updateData,
                )

                if (response) {
                    toast.push(
                        <Notification title="Success" type="success">
                            Owner and Approver updated successfully
                        </Notification>,
                    )
                    handleCancel()
                    refreshTable()
                } else {
                    throw new Error('Update failed')
                }
            } catch (error) {
                console.error('Error updating owner/approver:', error)
                toast.push(
                    <Notification title="Error" closable={true} type="danger">
                        Failed to update owner and approver
                    </Notification>,
                )
            } finally {
                setIsUpdating(false)
            }
        } else {
            toast.push(
                <Notification title="Warning" type="warning">
                    Please select an owner, approver, frequency, and due date
                </Notification>,
            )
        }
    }

    const handleCancel = () => {
        setIsDialogOpen(false)
        setSelectedOwnerOption(null)
        setSelectedApproverOption(null)
        setSelectedCustomizedFrequency(null)
        setDueDate(null)
        setSecondDate(null)
        setThirdDate(null)
        setLastDate(null)
    }

    return (
        <div className="flex items-center justify-center gap-3">
            <Button
                variant="solid"
                size="sm"
                icon={<HiPlusCircle />}
                onClick={() => {
                    if (selectedIds.length === 0) {
                        toast.push(
                            <Notification title="Warning" type="warning">
                                Please select compliances to update
                            </Notification>,
                        )
                        return
                    }
                    setIsDialogOpen(true)
                }}
            >
                Bulk Owner/Approver
            </Button>

            <Dialog
                isOpen={isDialogOpen}
                onClose={handleCancel}
                onRequestClose={handleCancel}
                width={700}
                shouldCloseOnOverlayClick={false}
            >
                <h5 className="mb-2 text-lg font-semibold">
                    Set Owner & Approver for Compliances
                </h5>
                <div className="space-y-6">
                    <div className="flex gap-4 w-full">
                        <div className="w-full flex flex-col gap-2">
                            <label className="block mb-2">Set Owner Name</label>
                            <OutlinedSelect
                                label="Set Owner Name"
                                options={userOptions}
                                value={selectedOwnerOption}
                                onChange={handleOwnerChange}
                            />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <label className="block mb-2">
                                Set Approver Name
                            </label>
                            <OutlinedSelect
                                label="Set Approver Name"
                                options={userOptions}
                                value={selectedApproverOption}
                                onChange={handleApproverChange}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 w-full">
                        <div className="w-full">
                            <label className="block mb-2">
                                Scheduled Frequency
                            </label>
                            <OutlinedInput
                                label="Scheduled Frequency"
                                // value={editData.MasterCompliance?.scheduled_frequency || 'Not Set'}
                                onChange={function (value: string): void {
                                    throw new Error('Function not implemented.')
                                }}
                                value={''}
                            />
                        </div>

                        <div className="w-full">
                            <label className="block mb-2">
                                Customized Frequency
                            </label>
                            <OutlinedSelect
                                label="Select Customized Frequency"
                                options={customizedFrequencyOptions}
                                value={selectedCustomizedFrequency}
                                onChange={handleCustomizedFrequencyChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="mb-2">First Due Date</p>
                            <DatePicker
                                size="sm"
                                placeholder="Select first due date"
                                value={dueDate}
                                onChange={(date: Date | null) =>
                                    setDueDate(date)
                                }
                                disabled={!dateFieldsState.isFirstDateEnabled}
                            />
                        </div>
                        <div>
                            <p className="mb-2">Second Due Date</p>
                            <DatePicker
                                size="sm"
                                placeholder="Select second due date"
                                value={secondDate}
                                onChange={(date: Date | null) =>
                                    setSecondDate(date)
                                }
                                disabled={!dateFieldsState.isSecondDateEnabled}
                            />
                        </div>
                        <div>
                            <p className="mb-2">Third Due Date</p>
                            <DatePicker
                                size="sm"
                                placeholder="Select third due date"
                                value={thirdDate}
                                onChange={(date: Date | null) =>
                                    setThirdDate(date)
                                }
                                disabled={!dateFieldsState.isThirdDateEnabled}
                            />
                        </div>
                        <div>
                            <p className="mb-2">Last Due Date</p>
                            <DatePicker
                                size="sm"
                                placeholder="Select last due date"
                                value={lastDate}
                                onChange={(date: Date | null) =>
                                    setLastDate(date)
                                }
                                disabled={!dateFieldsState.isLastDateEnabled}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-right">
                    <Button className="mr-2" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        onClick={handleConfirm}
                        loading={isUpdating}
                        disabled={isUpdating}
                    >
                        {isUpdating ? 'Saving...' : 'Confirm'}
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}
interface AssignChecklistTableToolProps {
    selectedIds: number[]
    refreshTable: () => void
    canCreate: boolean
}

const AssignChecklistTableTool: React.FC<AssignChecklistTableToolProps> = ({
    selectedIds,
    refreshTable,
    canCreate,
}) => {
    console.log('==============', canCreate)
    return (
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div>
                <AssignChecklistTableSearch />
            </div>
            <div className="flex items-center gap-3">
                <BulkAlertButton />
                {/* {canCreate && (/ */}
                    <BulkSetOwnerApproverButton
                        selectedIds={selectedIds}
                        refreshTable={refreshTable}
                    />
                {/* )} */}
            </div>
        </div>
    )
}

export default AssignChecklistTableTool