// import React, { useEffect, useMemo, useState } from 'react'
// import { ColumnDef, OnSortParam } from '@/components/shared/DataTable'
// import DataTable from '@/components/shared/DataTable'
// import {
//     Button,
//     Calendar,
//     Dialog,
//     Tooltip,
//     Input,
//     toast,
//     Notification,
//     Checkbox,
//     DatePicker,
// } from '@/components/ui'
// import { HiBellAlert } from 'react-icons/hi2'
// import { MdEdit } from 'react-icons/md'
// import { RiEyeLine } from 'react-icons/ri'
// import { useNavigate } from 'react-router-dom'
// import OutlinedSelect from '@/components/ui/Outlined/Outlined'
// import { useDispatch, useSelector } from 'react-redux'
// import httpClient from '@/api/http-client'
// import { endpoints } from '@/api/endpoint'
// import {
//     updateApproverOwner,
//     selectUpdateLoading,
//     selectUpdateSuccess,
//     resetUpdateStatus,
//     selectUpdateError,
//     ApproverOwnerAssignedCompliances,
// } from '@/store/slices/AssignedCompliance/assignedComplianceSlice'
// import { fetchUsers } from '@/store/slices/userEntity/UserEntitySlice'
// import { AppDispatch } from '@/store'
// import { showErrorNotification } from '@/components/ui/ErrorMessage'
// import OutlinedInput from '@/components/ui/OutlinedInput'
// import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json'
// import Lottie from 'lottie-react'
// import { HiOutlineViewGrid } from 'react-icons/hi'

// interface UserData {
//     id: number
//     group_id: number
//     first_name: string
//     last_name: string
//     email: string
//     mobile: string
//     joining_date: string
//     role: string
//     aadhar_no: string
//     pan_card: string
//     auth_signatory: boolean
//     suspend: boolean
//     disable: boolean
//     CompanyGroup: {
//         id: number
//         name: string
//     }
// }

// interface MasterCompliance {
//     id: number
//     uuid: string
//     legislation: string
//     header: string
//     criticality: string
//     description: string
//     scheduled_frequency?: string
//     default_due_date: {
//         first_date: string
//         last_date: string
//     }
// }

// interface Owner {
//     id: number
//     name: string
//     email: string
//     // last_name: string
// }
// interface SelectOption {
//     value: string
//     label: string
// }

// interface ComplianceData {
//     id: number
//     branch_id: number
//     mst_compliance_id: number
//     owner_id: number | null
//     approver_id: number | null
//     status: boolean
//     MasterCompliance: MasterCompliance
//     Owner: Owner | null
//     Approver: Owner | null
//     customized_frequency: string
//     due_date: string
// }

// interface AssignChecklistTableProps {
//     data: ComplianceData[]
//     loading: boolean
//     tableKey?: number
//     refreshTable: () => void
//     onSelectedIdsChange: (selectedIds: number[]) => void
//     selectedId?: number[]
//     pagination: {
//         total: number
//         pageIndex: number
//         pageSize: number
//     }
//     onPaginationChange: (page: number) => void
//     onPageSizeChange: (pageSize: number) => void
//     canCreate: boolean
// }

// const AssignChecklistTable: React.FC<AssignChecklistTableProps> = ({
//     data,
//     loading,
//     tableKey,
//     refreshTable,
//     onSelectedIdsChange,
//     selectedId,
//     pagination,
//     onPaginationChange,
//     onPageSizeChange,
//     canCreate,
// }) => {
//     console.log(data)

//     const navigate = useNavigate()
//     const dispatch = useDispatch<AppDispatch>()
//     const [activeRowId, setActiveRowId] = useState<number | null>(null)
//     const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
//     const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false)
//     const [editData, setEditData] = useState<Partial<ComplianceData>>({})
//     // const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
//     const [reminderDate, setReminderDate] = useState<Date | null>(null)
//     const [reminderEmail, setReminderEmail] = useState('')
//     const [tempDueDate, setTempDueDate] = useState<Date | string | null>(null)
//     const [userOptions, setUserOptions] = useState<SelectOption[]>([])
//     const [isUpdating, setIsUpdating] = useState(false)
//     const [selectedOwnerOption, setSelectedOwnerOption] = useState<any>(null)
//     const [selectedApproverOption, setSelectedApproverOption] =
//         useState<any>(null)
//     const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
//     const [selectedScheduledFrequency, setSelectedScheduledFrequency] =
//         useState<SelectOption | null>(null)
//     const [selectedCustomizedFrequency, setSelectedCustomizedFrequency] =
//         useState<SelectOption | null>(null)
//     const [dueDate, setDueDate] = useState<Date | null>(null)
//     const [firstDate, setFirstDate] = useState<Date | null>(null)
//     const [secondDate, setSecondDate] = useState<Date | null>(null)
//     const [thirdDate, setThirdDate] = useState<Date | null>(null)
//     const [lastDate, setLastDate] = useState<Date | null>(null)

//     const scheduledOptions: SelectOption[] = [
//         { value: 'monthly', label: 'Monthly' },
//         { value: 'yearly', label: 'Yearly' },
//         { value: 'half_yearly', label: 'Half Yearly' },
//         { value: 'quarterly', label: 'Quarterly' },
//     ]

//     const customizedFrequencyOptions: SelectOption[] = [
//         { value: 'monthly', label: 'Monthly' },
//         { value: 'yearly', label: 'Yearly' },
//         { value: 'half_yearly', label: 'Half Yearly' },
//         { value: 'quarterly', label: 'Quarterly' },
//     ]

//     // State to manage date field states
//     const [dateFieldsState, setDateFieldsState] = useState({
//         isFirstDateEnabled: true,
//         isSecondDateEnabled: false,
//         isThirdDateEnabled: false,
//         isLastDateEnabled: false,
//     })

//     // Function to handle frequency changes
//     const handleCustomizedFrequencyChange = (
//         selectedOption: SelectOption | null,
//     ) => {
//         setSelectedCustomizedFrequency(selectedOption)

//         // Reset date states
//         setFirstDate(null)
//         setSecondDate(null)
//         setThirdDate(null)
//         setLastDate(null)

//         // Update date field states based on selected frequency
//         switch (selectedOption?.value) {
//             case 'monthly':
//                 setDateFieldsState({
//                     isFirstDateEnabled: true,
//                     isSecondDateEnabled: false,
//                     isThirdDateEnabled: false,
//                     isLastDateEnabled: false,
//                 })
//                 break
//             case 'yearly':
//                 setDateFieldsState({
//                     isFirstDateEnabled: true,
//                     isSecondDateEnabled: false,
//                     isThirdDateEnabled: false,
//                     isLastDateEnabled: false,
//                 })
//                 break
//             case 'half_yearly':
//                 setDateFieldsState({
//                     isFirstDateEnabled: true,
//                     isSecondDateEnabled: false,
//                     isThirdDateEnabled: false,
//                     isLastDateEnabled: true,
//                 })
//                 break
//             case 'quarterly':
//                 setDateFieldsState({
//                     isFirstDateEnabled: true,
//                     isSecondDateEnabled: true,
//                     isThirdDateEnabled: true,
//                     isLastDateEnabled: true,
//                 })
//                 break
//             default:
//                 setDateFieldsState({
//                     isFirstDateEnabled: false,
//                     isSecondDateEnabled: false,
//                     isThirdDateEnabled: false,
//                     isLastDateEnabled: false,
//                 })
//         }
//     }

//     const handleCancel = () => {
//         setIsEditDialogOpen(false)
//     }

//     const handleEditSave = async () => {
//         // Determine the appropriate due date based on frequency
//         let selectedDueDate: string | null = null

//         switch (selectedCustomizedFrequency?.value) {
//             case 'monthly':
//                 selectedDueDate = firstDate?.toISOString().split('T')[0] || null
//                 break
//             case 'yearly':
//                 selectedDueDate = firstDate?.toISOString().split('T')[0] || null
//                 break
//             case 'half_yearly':
//                 selectedDueDate = lastDate?.toISOString().split('T')[0] || null
//                 break
//             case 'quarterly':
//                 selectedDueDate = lastDate?.toISOString().split('T')[0] || null
//                 break
//             default:
//                 selectedDueDate = null
//         }
//         if (
//             activeRowId &&
//             (selectedOwnerOption !== null || selectedApproverOption !== null) &&
//             selectedScheduledFrequency !== null &&
//             selectedDueDate // Ensure a date is selected
//         ) {
//             const updateData: ApproverOwnerAssignedCompliances = {
//                 assigned_compliance_id: [activeRowId],
//                 owner_id: selectedOwnerOption?.value || 0,
//                 approver_id: selectedApproverOption?.value || 0,
//                 scheduled_frequency: selectedScheduledFrequency?.value || '',
//                 due_date: selectedDueDate,
//                 customized_frequency: selectedCustomizedFrequency?.value || '',
//             }

//             setIsUpdating(true)
//             try {
//                 const response = await dispatch(
//                     updateApproverOwner({
//                         id: activeRowId.toString(),
//                         data: updateData,
//                     }),
//                 )
//                     .unwrap()
//                     .catch((error: any) => {
//                         // Error handling remains the same
//                         if (error.response?.data?.message) {
//                             showErrorNotification(error.response.data.message)
//                         } else if (error.message) {
//                             showErrorNotification(error.message)
//                         } else if (Array.isArray(error)) {
//                             showErrorNotification(error)
//                         } else {
//                             showErrorNotification(
//                                 'An unexpected error occurred. Please try again.',
//                             )
//                         }
//                         throw error
//                     })

//                 if (response) {
//                     setIsEditDialogOpen(false)
//                     toast.push(
//                         <Notification title="Success" type="success">
//                             Owner and Approver updated successfully
//                         </Notification>,
//                     )
//                     setSelectedOwnerOption(null)
//                     setSelectedApproverOption(null)
//                     setSelectedScheduledFrequency(null)
//                     setSelectedCustomizedFrequency(null)
//                     refreshTable()
//                 }
//             } catch (error: any) {
//                 console.log(error)
//                 toast.push(
//                     <Notification title="Error" closable={true} type="danger">
//                         {error}
//                     </Notification>,
//                 )
//                 console.error('Error updating owner/approver:', error)
//             } finally {
//                 setIsUpdating(false)
//             }
//         } else {
//             toast.push(
//                 <Notification title="Warning" type="warning">
//                     Please select an owner, approver, and due date
//                 </Notification>,
//             )
//         }
//     }

//     const handleOwnerChange = (value: any) => {
//         setSelectedOwnerOption(value)
//     }

//     const handleApproverChange = (value: any) => {
//         setSelectedApproverOption(value)
//     }
//     useEffect(() => {
//         setSelectedItems(new Set(selectedId || []))
//     }, [selectedId])
//     useEffect(() => {
//         fetchUsersData()
//     }, [])

//     const fetchUsersData = async () => {
//         setUserOptions(dummyUserOptions);
//     }
//     useEffect(() => {
//         console.log('Updated userOptions:', userOptions)
//     }, [userOptions])
//     const isAllSelected = useMemo(
//         () => selectedItems.size === data.length,
//         [selectedItems, data],
//     )

//     const handleCheckboxChange = (id: number) => {
//         setSelectedItems((prev) => {
//             const newSet = new Set(prev)
//             if (newSet.has(id)) {
//                 newSet.delete(id)
//             } else {
//                 newSet.add(id)
//             }
//             // Convert Set to Array and notify parent
//             onSelectedIdsChange(Array.from(newSet))
//             return newSet
//         })
//     }

//     const handleSelectAllChange = () => {
//         if (isAllSelected) {
//             setSelectedItems(new Set())
//             onSelectedIdsChange([])
//         } else {
//             const allIds = data.map((item) => item.id)
//             setSelectedItems(new Set(allIds))
//             onSelectedIdsChange(allIds)
//         }
//     }

//     const handleEditClick = (row: ComplianceData) => {
//         setActiveRowId(row.id)
//         setEditData({
//             id: row.id,
//             owner_id: row.owner_id,
//             approver_id: row.approver_id,
//             MasterCompliance: row.MasterCompliance,
//         })

//         // Set the initial selected options based on existing data
//         const ownerOption = userOptions.find(
//             (option) => option.value === row.owner_id,
//         )
//         const approverOption = userOptions.find(
//             (option) => option.value === row.approver_id,
//         )
//         const initialScheduledFrequency = scheduledOptions.find(
//             (option) =>
//                 option.value === row.MasterCompliance.scheduled_frequency,
//         )

//         console.log(
//             'testing frequency ............' + initialScheduledFrequency,
//         )

//         setSelectedScheduledFrequency(initialScheduledFrequency || null)

//         setIsEditDialogOpen(true)
//         setFirstDate(null)
//         setSecondDate(null)
//         setThirdDate(null)
//         setLastDate(null)

//         setSelectedOwnerOption(ownerOption || null)
//         setSelectedApproverOption(approverOption || null)
//         setIsEditDialogOpen(true)
//     }

//     const handleDialogClose = () => {
//         setIsEditDialogOpen(false)
//         setTempDueDate(null)
//         setSelectedOwnerOption(null)
//         setSelectedApproverOption(null)
//     }

//     const columns: ColumnDef<ComplianceData>[] = useMemo(
//         () => [
//             {
//                 header: ({ table }) => (
//                     <div className="w-2">
//                         <Checkbox
//                             checked={isAllSelected}
//                             onChange={handleSelectAllChange}
//                         />
//                     </div>
//                 ),
//                 id: 'select',
//                 cell: ({ row }) => (
//                     <div className="w-2">
//                         <Checkbox
//                             checked={selectedItems.has(row.original.id)}
//                             onChange={() =>
//                                 handleCheckboxChange(row.original.id)
//                             }
//                         />
//                     </div>
//                 ),
//             },
//             // {
//             //   header: 'Instance ID',
//             //   accessorKey: 'id',
//             //   cell: (props) => <div className="w-24 text-start">{props.getValue()}</div>,
//             // },
//             {
//                 header: 'Compliance ID',
//                 accessorKey: 'MasterCompliance.record_id',
//                 cell: (props) => (
//                     <div className="w-32 text-start">{props.getValue()}</div>
//                 ),
//             },
//             {
//                 header: 'Legislation',
//                 accessorFn: (row) => row.MasterCompliance.legislation,
//                 cell: (props) => {
//                     const value = props.getValue() as string
//                     return (
//                         <Tooltip title={value} placement="top">
//                             <div className="w-32 truncate">
//                                 {value.length > 20
//                                     ? value.substring(0, 20) + '...'
//                                     : value}
//                             </div>
//                         </Tooltip>
//                     )
//                 },
//             },
//             {
//                 header: 'Criticality',
//                 accessorFn: (row) => row.MasterCompliance.criticality,
//                 cell: (props) => {
//                     const criticality = props.getValue() as string
//                     return (
//                         <div className="w-24 font-semibold truncate">
//                             {criticality === 'high' ? (
//                                 <span className="text-red-500">High</span>
//                             ) : criticality === 'medium' ? (
//                                 <span className="text-yellow-500">Medium</span>
//                             ) : (
//                                 <span className="text-green-500">Low</span>
//                             )}
//                         </div>
//                     )
//                 },
//             },
//             {
//                 header: 'Header',
//                 accessorFn: (row) => row.MasterCompliance.header,
//                 cell: (props) => {
//                     const value = props.getValue() as string
//                     return (
//                         <Tooltip title={value} placement="top">
//                             <div className="w-40 truncate">{value}</div>
//                         </Tooltip>
//                     )
//                 },
//             },
//             {
//                 header: 'Due Date',
//                 accessorFn: (row) =>
//                     row.MasterCompliance.default_due_date.first_date,
//                 cell: ({ getValue }) => {
//                     const date = getValue<string>()
//                     return (
//                         <div className="w-20">
//                             {new Date(date).toLocaleDateString()}
//                         </div>
//                     )
//                 },
//             },
//             {
//                 header: 'Customized Due Date',
//                 accessorKey: 'due_date',
//                 cell: (props) => {
//                     const value = props.getValue<string | null>()

//                     return (
//                         <div className="w-52">
//                             <div className="w-52">
//                                 {value
//                                     ? new Date(value).toLocaleDateString()
//                                     : '--'}
//                             </div>
//                         </div>
//                     )
//                 },
//             },
//             {
//                 header: 'Owner',
//                 accessorFn: (row) => (row.Owner ? row.Owner.name : null),
//                 cell: ({ getValue }) => (
//                     <div className="w-32">{getValue<string>() || '--'}</div>
//                 ),
//             },
//             {
//                 header: 'Approver',
//                 accessorFn: (row) => (row.Approver ? row.Approver.name : null),
//                 cell: ({ getValue }) => (
//                     <div className="w-36">{getValue<string>() || '--'}</div>
//                 ),
//             },
//             {
//                 header: 'Actions',
//                 id: 'actions',
//                 cell: ({ row }) => (
//                     <div className="flex space-x-2">
//                         <Tooltip title="View Compliance Detail" placement="top">
//                             <Button
//                                 size="sm"
//                                 onClick={() =>
//                                     navigate(
//                                         `/app/IHRC/assign-list-detail/${row.original.mst_compliance_id}`,
//                                         {
//                                             state: row.original
//                                                 .MasterCompliance,
//                                         },
//                                     )
//                                 }
//                                 icon={<RiEyeLine />}
//                                 className="hover:bg-transparent"
//                             />
//                         </Tooltip>
//                         {canCreate && (
//                             <Tooltip
//                                 title="Set Owner & Approver"
//                                 placement="top"
//                             >
//                                 <Button
//                                     size="sm"
//                                     onClick={() =>
//                                         handleEditClick(row.original)
//                                     }
//                                     icon={<MdEdit />}
//                                     className="hover:bg-transparent"
//                                 />
//                             </Tooltip>
//                         )}
//                         <Tooltip
//                             title="Set Compliance Reminder"
//                             placement="top"
//                         >
//                             <Button
//                                 size="sm"
//                                 // onClick={() => handleBellClick(row.original)}
//                                 icon={<HiBellAlert />}
//                                 className="hover:bg-transparent text-red-500"
//                             />
//                         </Tooltip>
//                     </div>
//                 ),
//             },
//         ],
//         [selectedItems, isAllSelected],
//     )

//     const [tableData, setTableData] = useState({
//         total: data.length,
//         pageIndex: 1,
//         pageSize: 10,
//         query: '',
//         sort: { order: '', key: '' },
//     })

//     if (loading) {
//         console.log('Loading....................')

//         return (
//             <div className="flex flex-col items-center justify-center h-96 text-gray-500  rounded-xl">
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
//         <div className="relative">
//             {data.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
//                     <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
//                     <p className="text-center">No Data Available</p>
//                 </div>
//             ) : (
//                 <DataTable
//                     columns={columns}
//                     data={data}
//                     skeletonAvatarColumns={[0]}
//                     skeletonAvatarProps={{ className: 'rounded-md' }}
//                     loading={loading}
//                     // pagingData={{
//                     //     total: tableData.total,
//                     //     pageIndex: tableData.pageIndex,
//                     //     pageSize: tableData.pageSize,
//                     // }}
//                     // onPaginationChange={(page) =>
//                     //     setTableData((prev) => ({ ...prev, pageIndex: page }))
//                     // }
//                     // onSelectChange={(value) =>
//                     //     setTableData((prev) => ({
//                     //         ...prev,
//                     //         pageSize: Number(value),
//                     //         pageIndex: 1,
//                     //     }))
//                     // }
//                     pagingData={{
//                         total: pagination.total,
//                         pageIndex: pagination.pageIndex,
//                         pageSize: pagination.pageSize,
//                     }}
//                     // Pass the pagination handlers
//                     onPaginationChange={onPaginationChange}
//                     onSelectChange={onPageSizeChange}
//                     // onSort={(sort) => setTableData((prev) => ({ ...prev, sort }))}
//                     stickyHeader={true}
//                     stickyFirstColumn={true}
//                     stickyLastColumn={true}
//                     selectable={true}
//                 />
//             )}
//             <Dialog
//                 isOpen={isEditDialogOpen}
//                 onClose={handleDialogClose}
//                 onRequestClose={handleDialogClose}
//                 className="p-4"
//                 width={700}
//                 shouldCloseOnOverlayClick={false}
//             >
//                 <h5 className="mb-2 text-lg font-semibold">
//                     Set Owner & Approver
//                     {/* <span className="text-indigo-600">{editData.MasterCompliance?.uuid}</span> */}
//                 </h5>
//                 <div className="space-y-6">
//                     <div className="flex gap-4 w-full">
//                         <div className="w-full flex flex-col gap-2">
//                             <label className="block mb-2">Set Owner Name</label>
//                             <OutlinedSelect
//                                 label="Set Owner Name"
//                                 options={userOptions}
//                                 value={selectedOwnerOption}
//                                 onChange={handleOwnerChange}
//                             />
//                         </div>
//                         <div className="w-full flex flex-col gap-2">
//                             <label className="block mb-2">
//                                 Set Approver Name
//                             </label>
//                             <OutlinedSelect
//                                 label="Set Approver Name"
//                                 options={userOptions}
//                                 value={selectedApproverOption}
//                                 onChange={handleApproverChange}
//                             />
//                         </div>
//                     </div>

//                     <div className="flex gap-4 w-full">
//                         <div className="w-full">
//                             <label className="block mb-2">
//                                 Scheduled Frequency
//                             </label>
//                             <OutlinedInput
//                                 label="Scheduled Frequency"
//                                 value={
//                                     editData.MasterCompliance
//                                         ?.scheduled_frequency || 'Not Set'
//                                 }
//                                 onChange={function (value: string): void {
//                                     throw new Error('Function not implemented.')
//                                 }}
//                             />
//                         </div>

//                         <div className="w-full">
//                             <label className="block mb-2">
//                                 Customized Frequency
//                             </label>
//                             <OutlinedSelect
//                                 label="Select Customized Frequency"
//                                 options={customizedFrequencyOptions}
//                                 value={selectedCustomizedFrequency}
//                                 onChange={handleCustomizedFrequencyChange}
//                             />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <p className="mb-2">First Due Date</p>
//                             <DatePicker
//                                 size="sm"
//                                 placeholder="Select first due date"
//                                 value={dueDate}
//                                 onChange={(date: Date | null) =>
//                                     setFirstDate(date)
//                                 }
//                                 disabled={!dateFieldsState.isFirstDateEnabled}
//                             />
//                         </div>
//                         <div>
//                             <p className="mb-2">Second Due Date</p>
//                             <DatePicker
//                                 size="sm"
//                                 placeholder="Select second due date"
//                                 value={secondDate}
//                                 onChange={(date: Date | null) =>
//                                     setSecondDate(date)
//                                 }
//                                 disabled={!dateFieldsState.isSecondDateEnabled}
//                             />
//                         </div>
//                         <div>
//                             <p className="mb-2">Third Due Date</p>
//                             <DatePicker
//                                 size="sm"
//                                 placeholder="Select third due date"
//                                 value={thirdDate}
//                                 onChange={(date: Date | null) =>
//                                     setThirdDate(date)
//                                 }
//                                 disabled={!dateFieldsState.isThirdDateEnabled}
//                             />
//                         </div>
//                         <div>
//                             <p className="mb-2">Last Due Date</p>
//                             <DatePicker
//                                 size="sm"
//                                 placeholder="Select last due date"
//                                 value={lastDate}
//                                 onChange={(date: Date | null) =>
//                                     setLastDate(date)
//                                 }
//                                 disabled={!dateFieldsState.isLastDateEnabled}
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 <div className="mt-6 text-right">
//                     <Button className="mr-2" onClick={handleCancel}>
//                         Cancel
//                     </Button>
//                     <Button
//                         variant="solid"
//                         onClick={handleEditSave}
//                         loading={isUpdating}
//                         disabled={isUpdating}
//                     >
//                         {isUpdating ? 'Saving...' : 'Confirm'}
//                     </Button>
//                 </div>
//             </Dialog>

//             <Dialog
//                 isOpen={isReminderDialogOpen}
//                 onClose={() => setIsReminderDialogOpen(false)}
//                 onRequestClose={() => setIsReminderDialogOpen(false)}
//                 className="max-w-md p-6"
//             >
//                 <h5 className="mb-4 text-lg font-semibold">Set Reminder</h5>
//                 <div className="space-y-4">
//                     <div>
//                         <label className="block mb-2">Set Reminder Date</label>
//                         <Calendar
//                             value={reminderDate}
//                             onChange={(date) => setReminderDate(date)}
//                         />
//                     </div>
//                     <div>
//                         <label className="block mb-2">Email</label>
//                         <Input
//                             type="email"
//                             value={reminderEmail}
//                             onChange={(e) => setReminderEmail(e.target.value)}
//                             placeholder="Enter email address"
//                         />
//                     </div>
//                 </div>
//                 <div className="mt-6 text-right">
//                     <Button variant="solid">Confirm</Button>
//                 </div>
//             </Dialog>
//         </div>
//     )
// }

// export default AssignChecklistTable


import React, { useEffect, useMemo, useState } from 'react';
import { ColumnDef } from '@/components/shared/DataTable';
import DataTable from '@/components/shared/DataTable';
import {
    Button,
    Dialog,
    Tooltip,
    toast,
    Notification,
    Checkbox,
    DatePicker,
} from '@/components/ui';
import { HiBellAlert } from 'react-icons/hi2';
import { MdEdit } from 'react-icons/md';
import { RiEyeLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import OutlinedInput from '@/components/ui/OutlinedInput';

// Interface definitions
interface Owner {
    id: number;
    name: string;
    email: string;
}

interface MasterCompliance {
    id: number;
    uuid: string;
    record_id: string;
    legislation: string;
    header: string;
    criticality: string;
    description: string;
    scheduled_frequency?: string;
    default_due_date: {
        first_date: string;
        last_date: string;
    };
}

interface ComplianceData {
    id: number;
    branch_id: number;
    mst_compliance_id: number;
    owner_id: number | null;
    approver_id: number | null;
    status: boolean;
    MasterCompliance: MasterCompliance;
    Owner: Owner | null;
    Approver: Owner | null;
    customized_frequency: string;
    due_date: string;
}

interface SelectOption {
    value: string;
    label: string;
}

interface AssignChecklistTableProps {
    data: ComplianceData[];
    loading: boolean;
    tableKey?: number;
    refreshTable: () => void;
    onSelectedIdsChange: (selectedIds: number[]) => void;
    selectedId?: number[];
    pagination: {
        total: number;
        pageIndex: number;
        pageSize: number;
    };
    onPaginationChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    canCreate: boolean;
}

// Dummy data
const dummyComplianceData: ComplianceData[] = [
    {
        id: 1,
        branch_id: 1,
        mst_compliance_id: 101,
        owner_id: 201,
        approver_id: 301,
        status: true,
        customized_frequency: 'monthly',
        due_date: '2023-12-15',
        MasterCompliance: {
            id: 101,
            uuid: 'comp-001',
            record_id: 'COMP-001',
            legislation: 'Environmental Protection Act',
            header: 'Annual Environmental Report',
            criticality: 'high',
            description: 'Submission of annual environmental impact report',
            scheduled_frequency: 'yearly',
            default_due_date: {
                first_date: '2023-12-31',
                last_date: '2023-12-31'
            }
        },
        Owner: {
            id: 201,
            name: 'John Doe',
            email: 'john.doe@example.com'
        },
        Approver: {
            id: 301,
            name: 'Jane Smith',
            email: 'jane.smith@example.com'
        }
    },
    {
        id: 2,
        branch_id: 1,
        mst_compliance_id: 102,
        owner_id: 202,
        approver_id: 302,
        status: true,
        customized_frequency: 'quarterly',
        due_date: '2023-09-30',
        MasterCompliance: {
            id: 102,
            uuid: 'comp-002',
            record_id: 'COMP-002',
            legislation: 'Labor Standards Regulation',
            header: 'Quarterly Safety Inspection',
            criticality: 'medium',
            description: 'Workplace safety inspection report',
            scheduled_frequency: 'quarterly',
            default_due_date: {
                first_date: '2023-09-30',
                last_date: '2023-09-30'
            }
        },
        Owner: {
            id: 202,
            name: 'Robert Johnson',
            email: 'robert.j@example.com'
        },
        Approver: {
            id: 302,
            name: 'Emily Davis',
            email: 'emily.d@example.com'
        }
    },
    {
        id: 3,
        branch_id: 2,
        mst_compliance_id: 103,
        owner_id: null,
        approver_id: null,
        status: false,
        customized_frequency: '',
        due_date: '',
        MasterCompliance: {
            id: 103,
            uuid: 'comp-003',
            record_id: 'COMP-003',
            legislation: 'Financial Compliance Act',
            header: 'Annual Financial Audit',
            criticality: 'high',
            description: 'Submission of audited financial statements',
            scheduled_frequency: 'yearly',
            default_due_date: {
                first_date: '2023-12-31',
                last_date: '2023-12-31'
            }
        },
        Owner: null,
        Approver: null
    },
    {
        id: 4,
        branch_id: 2,
        mst_compliance_id: 104,
        owner_id: 203,
        approver_id: 303,
        status: true,
        customized_frequency: 'half_yearly',
        due_date: '2023-06-30',
        MasterCompliance: {
            id: 104,
            uuid: 'comp-004',
            record_id: 'COMP-004',
            legislation: 'Health and Safety Regulations',
            header: 'Bi-annual Safety Training',
            criticality: 'medium',
            description: 'Employee safety training certification',
            scheduled_frequency: 'half_yearly',
            default_due_date: {
                first_date: '2023-06-30',
                last_date: '2023-12-31'
            }
        },
        Owner: {
            id: 203,
            name: 'Sarah Williams',
            email: 'sarah.w@example.com'
        },
        Approver: {
            id: 303,
            name: 'Michael Brown',
            email: 'michael.b@example.com'
        }
    }
];

const dummyUserOptions: SelectOption[] = [
    { value: '201', label: 'John Doe' },
    { value: '202', label: 'Robert Johnson' },
    { value: '203', label: 'Sarah Williams' },
    { value: '301', label: 'Jane Smith' },
    { value: '302', label: 'Emily Davis' },
    { value: '303', label: 'Michael Brown' }
];

const AssignChecklistTable: React.FC<AssignChecklistTableProps> = ({
    data = dummyComplianceData, // Default to dummy data
    loading = false,
    tableKey,
    refreshTable,
    onSelectedIdsChange,
    selectedId,
    pagination = {
        total: dummyComplianceData.length,
        pageIndex: 1,
        pageSize: 10,
    },
    onPaginationChange,
    onPageSizeChange,
    canCreate = true,
}) => {
    const navigate = useNavigate();
    const [activeRowId, setActiveRowId] = useState<number | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editData, setEditData] = useState<Partial<ComplianceData>>({});
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [userOptions, setUserOptions] = useState<SelectOption[]>(dummyUserOptions);
    const [selectedOwnerOption, setSelectedOwnerOption] = useState<any>(null);
    const [selectedApproverOption, setSelectedApproverOption] = useState<any>(null);
    const [selectedScheduledFrequency, setSelectedScheduledFrequency] = useState<SelectOption | null>(null);
    const [selectedCustomizedFrequency, setSelectedCustomizedFrequency] = useState<SelectOption | null>(null);
    const [firstDate, setFirstDate] = useState<Date | null>(null);
    const [lastDate, setLastDate] = useState<Date | null>(null);

    const scheduledOptions: SelectOption[] = [
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' },
        { value: 'half_yearly', label: 'Half Yearly' },
        { value: 'quarterly', label: 'Quarterly' },
    ];

    const customizedFrequencyOptions: SelectOption[] = [
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' },
        { value: 'half_yearly', label: 'Half Yearly' },
        { value: 'quarterly', label: 'Quarterly' },
    ];

    useEffect(() => {
        setSelectedItems(new Set(selectedId || []));
    }, [selectedId]);

    const isAllSelected = useMemo(
        () => selectedItems.size === data.length,
        [selectedItems, data]
    );

    const handleCheckboxChange = (id: number) => {
        setSelectedItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            onSelectedIdsChange(Array.from(newSet));
            return newSet;
        });
    };

    const handleSelectAllChange = () => {
        if (isAllSelected) {
            setSelectedItems(new Set());
            onSelectedIdsChange([]);
        } else {
            const allIds = data.map((item) => item.id);
            setSelectedItems(new Set(allIds));
            onSelectedIdsChange(allIds);
        }
    };

    const handleEditClick = (row: ComplianceData) => {
        setActiveRowId(row.id);
        setEditData({
            id: row.id,
            owner_id: row.owner_id,
            approver_id: row.approver_id,
            MasterCompliance: row.MasterCompliance,
        });

        const ownerOption = userOptions.find(
            (option) => option.value === String(row.owner_id)
        );
        const approverOption = userOptions.find(
            (option) => option.value === String(row.approver_id)
        );
        const initialScheduledFrequency = scheduledOptions.find(
            (option) => option.value === row.MasterCompliance.scheduled_frequency
        );

        setSelectedScheduledFrequency(initialScheduledFrequency || null);
        setSelectedOwnerOption(ownerOption || null);
        setSelectedApproverOption(approverOption || null);
        setIsEditDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsEditDialogOpen(false);
        setSelectedOwnerOption(null);
        setSelectedApproverOption(null);
    };

    const handleEditSave = async () => {
        if (activeRowId && (selectedOwnerOption || selectedApproverOption)) {
            toast.push(
                <Notification title="Success" type="success">
                    Owner and Approver updated successfully
                </Notification>,
            );
            setIsEditDialogOpen(false);
            refreshTable();
        } else {
            toast.push(
                <Notification title="Warning" type="warning">
                    Please select an owner or approver
                </Notification>,
            );
        }
    };

    const columns: ColumnDef<ComplianceData>[] = useMemo(
        () => [
            {
                header: () => (
                    <div className="w-2">
                        <Checkbox
                            checked={isAllSelected}
                            onChange={handleSelectAllChange}
                        />
                    </div>
                ),
                id: 'select',
                cell: ({ row }) => (
                    <div className="w-2">
                        <Checkbox
                            checked={selectedItems.has(row.original.id)}
                            onChange={() => handleCheckboxChange(row.original.id)}
                        />
                    </div>
                ),
            },
            {
                header: 'Compliance ID',
                accessorKey: 'MasterCompliance.record_id',
                cell: (props) => (
                    <div className="w-32 text-start">{props.getValue()}</div>
                ),
            },
            {
                header: 'Legislation',
                accessorFn: (row) => row.MasterCompliance.legislation,
                cell: (props) => {
                    const value = props.getValue() as string;
                    return (
                        <Tooltip title={value} placement="top">
                            <div className="w-32 truncate">
                                {value.length > 20 ? `${value.substring(0, 20)}...` : value}
                            </div>
                        </Tooltip>
                    );
                },
            },
            {
                header: 'Criticality',
                accessorFn: (row) => row.MasterCompliance.criticality,
                cell: (props) => {
                    const criticality = props.getValue() as string;
                    return (
                        <div className="w-24 font-semibold truncate">
                            {criticality === 'high' ? (
                                <span className="text-red-500">High</span>
                            ) : criticality === 'medium' ? (
                                <span className="text-yellow-500">Medium</span>
                            ) : (
                                <span className="text-green-500">Low</span>
                            )}
                        </div>
                    );
                },
            },
            {
                header: 'Header',
                accessorFn: (row) => row.MasterCompliance.header,
                cell: (props) => {
                    const value = props.getValue() as string;
                    return (
                        <Tooltip title={value} placement="top">
                            <div className="w-40 truncate">{value}</div>
                        </Tooltip>
                    );
                },
            },
            {
                header: 'Due Date',
                accessorFn: (row) => row.MasterCompliance.default_due_date.first_date,
                cell: ({ getValue }) => {
                    const date = getValue<string>();
                    return (
                        <div className="w-20">
                            {new Date(date).toLocaleDateString()}
                        </div>
                    );
                },
            },
            {
                header: 'Customized Due Date',
                accessorKey: 'due_date',
                cell: (props) => {
                    const value = props.getValue<string | null>();
                    return (
                        <div className="w-52">
                            {value ? new Date(value).toLocaleDateString() : '--'}
                        </div>
                    );
                },
            },
            {
                header: 'Owner',
                accessorFn: (row) => (row.Owner ? row.Owner.name : null),
                cell: ({ getValue }) => (
                    <div className="w-32">{getValue<string>() || '--'}</div>
                ),
            },
            {
                header: 'Approver',
                accessorFn: (row) => (row.Approver ? row.Approver.name : null),
                cell: ({ getValue }) => (
                    <div className="w-36">{getValue<string>() || '--'}</div>
                ),
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <Tooltip title="View Compliance Detail" placement="top">
                            <Button
                                size="sm"
                                onClick={() => navigate(
                                    `/app/IHRC/assign-list-detail/${row.original.mst_compliance_id}`,
                                    { state: row.original.MasterCompliance }
                                )}
                                icon={<RiEyeLine />}
                                className="hover:bg-transparent"
                            />
                        </Tooltip>
                        {/* {canCreate && ( */}
                            <Tooltip title="Set Owner & Approver" placement="top">
                                <Button
                                    size="sm"
                                    onClick={() => handleEditClick(row.original)}
                                    icon={<MdEdit />}
                                    className="hover:bg-transparent"
                                />
                            </Tooltip>
                        {/* )} */}
                        <Tooltip title="Set Compliance Reminder" placement="top">
                            <Button
                                size="sm"
                                icon={<HiBellAlert />}
                                className="hover:bg-transparent text-red-500"
                            />
                        </Tooltip>
                    </div>
                ),
            },
        ],
        [selectedItems, isAllSelected, navigate, canCreate]
    );

    return (
        <div className="relative">
            <DataTable
                columns={columns}
                data={data}
                loading={loading}
                pagingData={{
                    total: pagination.total,
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onPageSizeChange}
                stickyHeader={true}
                stickyFirstColumn={true}
                stickyLastColumn={true}
                selectable={true}
            />

            {/* Edit Dialog */}
            <Dialog
                isOpen={isEditDialogOpen}
                onClose={handleDialogClose}
                onRequestClose={handleDialogClose}
                className="p-4"
                width={700}
                shouldCloseOnOverlayClick={false}
            >
                <h5 className="mb-2 text-lg font-semibold">Set Owner & Approver</h5>
                <div className="space-y-6">
                    <div className="flex gap-4 w-full">
                        <div className="w-full flex flex-col gap-2">
                            <label className="block mb-2">Set Owner Name</label>
                            <OutlinedSelect
                                label="Set Owner Name"
                                options={userOptions}
                                value={selectedOwnerOption}
                                onChange={setSelectedOwnerOption}
                            />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <label className="block mb-2">Set Approver Name</label>
                            <OutlinedSelect
                                label="Set Approver Name"
                                options={userOptions}
                                value={selectedApproverOption}
                                onChange={setSelectedApproverOption}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 w-full">
                        <div className="w-full">
                            <label className="block mb-2">Scheduled Frequency</label>
                            <OutlinedInput
                                label="Scheduled Frequency"
                                value={editData.MasterCompliance?.scheduled_frequency || 'Not Set'}
                                readOnly
                            />
                        </div>
                        <div className="w-full">
                            <label className="block mb-2">Customized Frequency</label>
                            <OutlinedSelect
                                label="Select Customized Frequency"
                                options={customizedFrequencyOptions}
                                value={selectedCustomizedFrequency}
                                onChange={setSelectedCustomizedFrequency}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="mb-2">First Due Date</p>
                            <DatePicker
                                size="sm"
                                placeholder="Select first due date"
                                value={firstDate}
                                onChange={setFirstDate}
                            />
                        </div>
                        <div>
                            <p className="mb-2">Last Due Date</p>
                            <DatePicker
                                size="sm"
                                placeholder="Select last due date"
                                value={lastDate}
                                onChange={setLastDate}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-right">
                    <Button className="mr-2" onClick={handleDialogClose}>
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={handleEditSave}>
                        Confirm
                    </Button>
                </div>
            </Dialog>
        </div>
    );
};

export default AssignChecklistTable;