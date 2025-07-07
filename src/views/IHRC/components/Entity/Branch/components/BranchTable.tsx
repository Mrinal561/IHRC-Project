// import React, { useMemo, useState, useEffect } from 'react'
// import {
//     Table,
//     Button,
//     Dialog,
//     Tooltip,
//     Notification,
//     toast,
// } from '@/components/ui'
// import { FiTrash } from 'react-icons/fi'
// import { MdEdit } from 'react-icons/md'
// import OutlinedInput from '@/components/ui/OutlinedInput/OutlinedInput'
// import OutlinedSelect from '@/components/ui/Outlined'
// import DataTable, { ColumnDef } from '@/components/shared/DataTable'
// import { EntityData, entityDataSet } from '../../../../store/dummyEntityData'
// import store, { AppDispatch } from '@/store'
// import { useDispatch, useSelector } from 'react-redux'
// import { BranchData } from '@/@types/branch'
// import { deleteBranch, fetchBranches } from '@/store/slices/branch/branchSlice'
// import httpClient from '@/api/http-client'
// import { endpoints } from '@/api/endpoint'
// import dayjs from 'dayjs'
// import { HiOutlineBookOpen, HiOutlineViewGrid } from 'react-icons/hi'
// // import {lo}
// import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json'
// import Lottie from 'lottie-react'
// import BranchEditDialog from './BranchEditDialog'
// import { useNavigate } from 'react-router-dom'
// import { showErrorNotification } from '@/components/ui/ErrorMessage'

// interface SelectOption {
//     value: string
//     label: string
// }
// interface BranchTableProps {
//     filterValues?: {
//         branchId?: string
//         companyGroupId?: string
//         companyId?: string
//         stateId?: string
//         districtId?: string
//         locationId?: string
//         search?: any
//     }

//     onRefreshMethodAvailable?: (refreshFn: () => void) => void
// }

// const BranchTable: React.FC<BranchTableProps> = ({
//     filterValues = {},
//     onRefreshMethodAvailable,
// }) => {
//     const { login } = store.getState()
//     const agreement = login.user.user.moduleAccess
//     const hasAgreementAccess = agreement.some(
//         (module) => module.name === 'Agreement',
//     )
//     const [tableData, setTableData] = useState({
//         total: 0,
//         pageIndex: 1,
//         pageSize: 10,
//     })
//     const dispatch = useDispatch<AppDispatch>()
//     const [data, setData] = useState<EntityData[]>(entityDataSet)
//     const [dialogIsOpen, setDialogIsOpen] = useState(false)
//     const [itemToDelete, setItemToDelete] = useState<number | null>(null)
//     const [editDialogIsOpen, setEditDialogIsOpen] = useState(false)
//     const [itemToEdit, setItemToEdit] = useState<number | null>(null)
//     const [editedBranch, setEditedBranch] = useState('')
//     const [selectedCompanyGroup, setSelectedCompanyGroup] =
//         useState<SelectOption | null>(null)
//     const [selectedCompany, setSelectedCompany] = useState<SelectOption | null>(
//         null,
//     )
//     const [selectedState, setSelectedState] = useState<SelectOption | null>(
//         null,
//     )
//     const [selectedDistrict, setSelectedDistrict] =
//         useState<SelectOption | null>(null)
//     const [selectedLocation, setSelectedLocation] =
//         useState<SelectOption | null>(null)
//     const [companyGroupOptions, setCompanyGroupOptions] = useState<
//         SelectOption[]
//     >([])
//     const [companyOptions, setCompanyOptions] = useState<SelectOption[]>([])
//     const [stateOptions, setStateOptions] = useState<SelectOption[]>([])
//     const [districtOptions, setDistrictOptions] = useState<SelectOption[]>([])
//     const [locationOptions, setLocationOptions] = useState<SelectOption[]>([])
//     const [isLoading, setIsLoading] = useState(false)
//     const [currentBranchId, setCurrentBranchId] = useState<number | null>(null)
//     const navigate = useNavigate()

//     const [branchTableData, setBranchTableData] = useState([])

//     useEffect(() => {
//         if (onRefreshMethodAvailable) {
//             onRefreshMethodAvailable(() => {
//                 fetchBranchData(1, tableData.pageSize)
//             })
//         }
//     }, [onRefreshMethodAvailable])

//     useEffect(() => {
//         // Generate unique options for all fields
//         const uniqueCompanyGroups = Array.from(
//             new Set(
//                 data.map((item) => item.Company_Group_Name).filter(Boolean),
//             ),
//         )
//         const uniqueStates = Array.from(
//             new Set(data.map((item) => item.State).filter(Boolean)),
//         )

//         setCompanyGroupOptions(
//             uniqueCompanyGroups.map((group) => ({
//                 value: group!,
//                 label: group!,
//             })),
//         )
//         setStateOptions(
//             uniqueStates.map((state) => ({ value: state!, label: state! })),
//         )
//     }, [data])

//     const handleDialogOk = async () => {
//         console.log(login, hasAgreementAccess)
//         if (itemToDelete) {
//             try {
//                 const res = await dispatch(deleteBranch(itemToDelete)).unwrap()

//                 // Only show success message if we get here (no error was thrown)
//                 toast.push(
//                     <Notification title="Deleted" type="success">
//                         Branch Deleted Successfully
//                     </Notification>,
//                 )

//                 handleRefreshData()
//                 handleDialogClose()
//             } catch (error: any) {
//                 // Handle different error formats
//                 if (error.response?.data?.message) {
//                     // API error response
//                     showErrorNotification(error.response.data.message)
//                 } else if (error.message) {
//                     // Regular error object
//                     showErrorNotification(error.message)
//                 } else if (Array.isArray(error)) {
//                     // Array of error messages
//                     showErrorNotification(error)
//                 } else {
//                     // Fallback error message
//                     showErrorNotification(error)
//                 }
//                 console.log(error)
//             } finally {
//                 handleDialogClose()
//             }
//         }
//     }

//     const openDeleteDialog = (branchId: number) => {
//         setItemToDelete(branchId)
//         setDialogIsOpen(true)
//     }

//     const handleDialogClose = () => {
//         setDialogIsOpen(false)
//         setItemToDelete(null)
//     }

//     const columns = useMemo(
//         () => [
//             // {
//             //     header: 'Company Group',
//             //     accessorKey: 'CompanyGroup.name',
//             //     cell: (props) => (
//             //         <div className="w-52 truncate">
//             //             {props.getValue() as string}
//             //         </div>
//             //     ),
//             // },
//             {
//                 header: 'Company',
//                 enableSorting: false,
//                 accessorKey: 'Company.name',
//                 cell: (props) => (
//                     <div className="w-32 truncate">
//                         {props.getValue() as string}
//                     </div>
//                 ),
//             },
//             {
//                 header: 'State',
//                 enableSorting: false,
//                 accessorKey: 'State.name',
//                 cell: (props) => (
//                     <div className="w-32 truncate">
//                         {props.getValue() as string}
//                     </div>
//                 ),
//             },
//             {
//                 header: 'District',
//                 enableSorting: false,
//                 accessorKey: 'District.name',
//                 cell: (props) => (
//                     <div className="w-32 truncate">
//                         {props.getValue() as string}
//                     </div>
//                 ),
//             },
//             {
//                 header: 'Location',
//                 enableSorting: false,
//                 accessorKey: 'Location.name',
//                 cell: (props) => (
//                     <div className="w-32 truncate">
//                         {props.getValue() as string}
//                     </div>
//                 ),
//             },
//             {
//                 header: 'Branch Name',
//                 enableSorting: false,
//                 accessorKey: 'name',
//                 cell: (props) => (
//                     <div className="w-40 truncate">
//                         {props.getValue() as string}
//                     </div>
//                 ),
//             },
//             {
//                 header: 'Branch Address',
//                 enableSorting: false,
//                 accessorKey: 'address',
//                 cell: (props) => (
//                     <div className="w-40 truncate">
//                         {props.getValue() as string}
//                     </div>
//                 ),
//             },
//             {
//                 header: 'Branch Opening Date',
//                 enableSorting: false,
//                 accessorKey: 'opening_date',
//                 cell: (props) => (
//                     <div className="w-44 ">
//                         {dayjs(props.getValue() as string).format('DD-MM-YYYY')}
//                     </div>
//                 ),
//             },
//             {
//                 header: 'Actions',
//                 enableSorting: false,
//                 id: 'actions',
//                 cell: ({ row }) => (
//                     <div className="flex items-center gap-2">
//                         <Tooltip title="Edit">
//                             <Button
//                                 size="sm"
//                                 onClick={() => {
//                                     navigate('/edit-branch', {
//                                         state: {
//                                             branchId: row.original?.id,
//                                         },
//                                     })
//                                 }}
//                                 icon={<MdEdit />}
//                                 className="text-blue-500"
//                             />
//                         </Tooltip>
//                         {hasAgreementAccess && (
//                             <Tooltip title="Agreements">
//                                 <Button
//                                     size="sm"
//                                     icon={<HiOutlineBookOpen />}
//                                     onClick={() => {
//                                         navigate('/agreements', {
//                                             state: {
//                                                 branchId: row.original?.id,
//                                                 companyId:
//                                                     row.original?.Company?.id,
//                                                 companyName:
//                                                     row.original?.Company?.name,
//                                                 branchName: row.original?.name,
//                                             },
//                                         })
//                                     }}
//                                 >
//                                     {/* Agreements */}
//                                 </Button>
//                             </Tooltip>
//                         )}
//                         <Tooltip title="Delete">
//                             <Button
//                                 size="sm"
//                                 onClick={() =>
//                                     openDeleteDialog(row.original.id)
//                                 }
//                                 icon={<FiTrash />}
//                                 className="text-red-500"
//                             />
//                         </Tooltip>
//                     </div>
//                 ),
//             },
//         ],
//         [],
//     )

//     const openNotification = (
//         type: 'success' | 'info' | 'error' | 'warning',
//         message: string,
//     ) => {
//         toast.push(
//             <Notification
//                 title={type.charAt(0).toUpperCase() + type.slice(1)}
//                 type={type}
//                 closable={true}
//             >
//                 {message}
//             </Notification>,
//         )
//     }
//     useEffect(() => {
//         console.log('Updated tableData:', tableData)
//     }, [tableData])

//     const fetchBranchData = async (page: number, size: number) => {
//         setIsLoading(true)
//         try {
//             const { data } = await httpClient.get(endpoints.branch.getAll(), {
//                 params: {
//                     'branch_id[]': filterValues.branchId || undefined,
//                     'group_id[0]': filterValues.companyGroupId || undefined,
//                     'company_id[]': filterValues.companyId || undefined,
//                     'state_id[]': filterValues.stateId || undefined,
//                     'district_id[]': filterValues.districtId || undefined,
//                     'location_id[]': filterValues.locationId || undefined,
//                     search: filterValues.search || undefined,
//                     page: page,
//                     page_size: size,
//                 },
//             })

//             setBranchTableData(data?.data)
//             setTableData((prev) => ({
//                 ...prev,
//                 total: data?.paginate_data.totalResults,
//                 pageIndex: data?.paginate_data.page,
//                 pageSize: size,
//             }))
//             // console.log(tableData)
//         } catch (error) {
//             console.error('Failed to fetch branch:', error)
//             toast.push(
//                 <Notification title="Error" closable={true} type="error">
//                     Failed to fetch Branch
//                 </Notification>,
//             )
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     const handleEditClick = (branchId: number) => {
//         setCurrentBranchId(branchId)
//         setEditDialogIsOpen(true)
//     }

//     const handleRefreshData = () => {
//         fetchBranchData(1, 10)
//     }

//     const onPaginationChange = (page: number) => {
//         fetchBranchData(page, tableData.pageSize)
//         console.log(tableData)
//     }

//     const onSelectChange = (value: number) => {
//         fetchBranchData(1, value)
//         console.log(tableData)
//     }

//     useEffect(() => {
//         fetchBranchData(1, tableData.pageSize)
//     }, [])

//     useEffect(() => {
//         fetchBranchData(tableData.pageIndex, tableData.pageSize)
//     }, [
//         filterValues.branchId,
//         filterValues.companyGroupId,
//         filterValues.companyId,
//         filterValues.stateId,
//         filterValues.districtId,
//         filterValues.locationId,
//         filterValues.search,
//     ])

//     if (isLoading) {
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
//             {branchTableData.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
//                     <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
//                     <p className="text-center">No Data Available</p>
//                 </div>
//             ) : (
//                 <DataTable
//                     columns={columns}
//                     data={branchTableData}
//                     skeletonAvatarColumns={[0]}
//                     skeletonAvatarProps={{ className: 'rounded-md' }}
//                     loading={isLoading}
//                     pagingData={{
//                         total: tableData.total,
//                         pageIndex: tableData.pageIndex,
//                         pageSize: tableData.pageSize,
//                     }}
//                     onPaginationChange={onPaginationChange}
//                     onSelectChange={onSelectChange}
//                     stickyHeader={true}
//                     stickyFirstColumn={true}
//                     stickyLastColumn={true}
//                 />
//             )}

//             <BranchEditDialog
//                 isOpen={editDialogIsOpen}
//                 onClose={() => setEditDialogIsOpen(false)}
//                 branchId={currentBranchId}
//                 onRefresh={handleRefreshData}
//             />

//             <Dialog
//                 isOpen={dialogIsOpen}
//                 onClose={handleDialogClose}
//                 onRequestClose={handleDialogClose}
//             >
//                 <h5 className="mb-4">Confirm Deleting Branch</h5>
//                 <p>
//                     Are you sure you want to delete this branch? This action
//                     cannot be undone.
//                 </p>
//                 <div className="text-right mt-6">
//                     <Button
//                         className="ltr:mr-2 rtl:ml-2"
//                         variant="plain"
//                         onClick={handleDialogClose}
//                     >
//                         Cancel
//                     </Button>
//                     <Button variant="solid" onClick={handleDialogOk}>
//                         Confirm
//                     </Button>
//                 </div>
//             </Dialog>

//             {/* <Dialog
//                 isOpen={editDialogIsOpen}
//                 onClose={handleDialogClose}
//                 onRequestClose={handleDialogClose}
//             >
//                 <h5 className="mb-4">Edit Branch</h5>
//                 <div className="mb-4">
//                     <OutlinedSelect
//                         label="Company Group"
//                         options={companyGroupOptions}
//                         value={selectedCompanyGroup}
//                         onChange={handleCompanyGroupChange}
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <OutlinedSelect
//                         label="Company"
//                         options={companyOptions}
//                         value={selectedCompany}
//                         onChange={(option: SelectOption | null) =>
//                             setSelectedCompany(option)
//                         }
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <OutlinedSelect
//                         label="State"
//                         options={stateOptions}
//                         value={selectedState}
//                         onChange={handleStateChange}
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <OutlinedSelect
//                         label="District"
//                         options={districtOptions}
//                         value={selectedDistrict}
//                         onChange={handleDistrictChange}
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <OutlinedInput
//                         label="Location"
//                         value={selectedLocation ? selectedLocation.value : ''}
//                         onChange={(value: string) =>
//                             setSelectedLocation({ value, label: value })
//                         }
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <OutlinedInput
//                         label="Branch"
//                         value={editedBranch}
//                         onChange={(value: string) => setEditedBranch(value)}
//                     />
//                 </div>
//                 <div className="text-right mt-6">
//                     <Button
//                         className="ltr:mr-2 rtl:ml-2"
//                         variant="plain"
//                         onClick={handleDialogClose}
//                     >
//                         Cancel
//                     </Button>
//                     <Button variant="solid" onClick={handleEditConfirm}>
//                         Confirm
//                     </Button>
//                 </div>
//             </Dialog> */}
//         </div>
//     )
// }

// export default BranchTable






import React, { useMemo, useState, useEffect } from 'react'
import {
    Table,
    Button,
    Dialog,
    Tooltip,
    Notification,
    toast,
} from '@/components/ui'
import { FiTrash } from 'react-icons/fi'
import { MdEdit } from 'react-icons/md'
import OutlinedInput from '@/components/ui/OutlinedInput/OutlinedInput'
import OutlinedSelect from '@/components/ui/Outlined'
import DataTable, { ColumnDef } from '@/components/shared/DataTable'
import { EntityData, entityDataSet } from '../../../../store/dummyEntityData'
import store, { AppDispatch } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import { BranchData } from '@/@types/branch'
import { deleteBranch, fetchBranches } from '@/store/slices/branch/branchSlice'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import dayjs from 'dayjs'
import { HiOutlineBookOpen, HiOutlineViewGrid } from 'react-icons/hi'
// import {lo}
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json'
import Lottie from 'lottie-react'
import BranchEditDialog from './BranchEditDialog'
import { useNavigate } from 'react-router-dom'
import { showErrorNotification } from '@/components/ui/ErrorMessage'

interface SelectOption {
    value: string
    label: string
}
interface BranchTableProps {
    filterValues?: {
        branchId?: string
        companyGroupId?: string
        companyId?: string
        stateId?: string
        districtId?: string
        locationId?: string
        search?: any
    }

    onRefreshMethodAvailable?: (refreshFn: () => void) => void
}

const BranchTable: React.FC<BranchTableProps> = ({
    filterValues = {},
    onRefreshMethodAvailable,
}) => {
    const { login } = store.getState()
    const agreement = login.user.user.moduleAccess
    const hasAgreementAccess = agreement.some(
        (module) => module.name === 'Agreement',
    )
    const [tableData, setTableData] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
    })
    const dispatch = useDispatch<AppDispatch>()
    const [data, setData] = useState<EntityData[]>(entityDataSet)
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<number | null>(null)
    const [editDialogIsOpen, setEditDialogIsOpen] = useState(false)
    const [itemToEdit, setItemToEdit] = useState<number | null>(null)
    const [editedBranch, setEditedBranch] = useState('')
    const [selectedCompanyGroup, setSelectedCompanyGroup] =
        useState<SelectOption | null>(null)
    const [selectedCompany, setSelectedCompany] = useState<SelectOption | null>(
        null,
    )
    const [selectedState, setSelectedState] = useState<SelectOption | null>(
        null,
    )
    const [selectedDistrict, setSelectedDistrict] =
        useState<SelectOption | null>(null)
    const [selectedLocation, setSelectedLocation] =
        useState<SelectOption | null>(null)
    const [companyGroupOptions, setCompanyGroupOptions] = useState<
        SelectOption[]
    >([])
    const [companyOptions, setCompanyOptions] = useState<SelectOption[]>([])
    const [stateOptions, setStateOptions] = useState<SelectOption[]>([])
    const [districtOptions, setDistrictOptions] = useState<SelectOption[]>([])
    const [locationOptions, setLocationOptions] = useState<SelectOption[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [currentBranchId, setCurrentBranchId] = useState<number | null>(null)
    const navigate = useNavigate()

    const [branchTableData, setBranchTableData] = useState([])

    useEffect(() => {
        if (onRefreshMethodAvailable) {
            onRefreshMethodAvailable(() => {
                fetchBranchData(1, tableData.pageSize)
            })
        }
    }, [onRefreshMethodAvailable])

    useEffect(() => {
        // Generate unique options for all fields
        const uniqueCompanyGroups = Array.from(
            new Set(
                data.map((item) => item.Company_Group_Name).filter(Boolean),
            ),
        )
        const uniqueStates = Array.from(
            new Set(data.map((item) => item.State).filter(Boolean)),
        )

        setCompanyGroupOptions(
            uniqueCompanyGroups.map((group) => ({
                value: group!,
                label: group!,
            })),
        )
        setStateOptions(
            uniqueStates.map((state) => ({ value: state!, label: state! })),
        )
    }, [data])

    const handleDialogOk = async () => {
        console.log(login, hasAgreementAccess)
        if (itemToDelete) {
            try {
                const res = await dispatch(deleteBranch(itemToDelete)).unwrap()

                // Only show success message if we get here (no error was thrown)
                toast.push(
                    <Notification title="Deleted" type="success">
                        Branch Deleted Successfully
                    </Notification>,
                )

                handleRefreshData()
                handleDialogClose()
            } catch (error: any) {
                // Handle different error formats
                if (error.response?.data?.message) {
                    // API error response
                    showErrorNotification(error.response.data.message)
                } else if (error.message) {
                    // Regular error object
                    showErrorNotification(error.message)
                } else if (Array.isArray(error)) {
                    // Array of error messages
                    showErrorNotification(error)
                } else {
                    // Fallback error message
                    showErrorNotification(error)
                }
                console.log(error)
            } finally {
                handleDialogClose()
            }
        }
    }

    const openDeleteDialog = (branchId: number) => {
        setItemToDelete(branchId)
        setDialogIsOpen(true)
    }

    const handleDialogClose = () => {
        setDialogIsOpen(false)
        setItemToDelete(null)
    }

    const columns = useMemo(
        () => [
            // {
            //     header: 'Company Group',
            //     accessorKey: 'CompanyGroup.name',
            //     cell: (props) => (
            //         <div className="w-52 truncate">
            //             {props.getValue() as string}
            //         </div>
            //     ),
            // },
            {
                header: 'Company',
                enableSorting: false,
                accessorKey: 'Company.name',
                cell: (props) => (
                    <div className="w-32 truncate">
                        {props.getValue() as string}
                    </div>
                ),
            },
            {
                header: 'State',
                enableSorting: false,
                accessorKey: 'State.name',
                cell: (props) => (
                    <div className="w-32 truncate">
                        {props.getValue() as string}
                    </div>
                ),
            },
            {
                header: 'District',
                enableSorting: false,
                accessorKey: 'District.name',
                cell: (props) => (
                    <div className="w-32 truncate">
                        {props.getValue() as string}
                    </div>
                ),
            },
            {
                header: 'Location',
                enableSorting: false,
                accessorKey: 'Location.name',
                cell: (props) => (
                    <div className="w-32 truncate">
                        {props.getValue() as string}
                    </div>
                ),
            },
            {
                header: 'Branch Name',
                enableSorting: false,
                accessorKey: 'name',
                cell: (props) => (
                    <div className="w-40 truncate">
                        {props.getValue() as string}
                    </div>
                ),
            },
            {
                header: 'Branch Address',
                enableSorting: false,
                accessorKey: 'address',
                cell: (props) => (
                    <div className="w-40 truncate">
                        {props.getValue() as string}
                    </div>
                ),
            },
            {
                header: 'Branch Opening Date',
                enableSorting: false,
                accessorKey: 'opening_date',
                cell: (props) => (
                    <div className="w-44 ">
                        {dayjs(props.getValue() as string).format('DD-MM-YYYY')}
                    </div>
                ),
            },
            {
                header: 'Actions',
                enableSorting: false,
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Tooltip title="Edit">
                            <Button
                                size="sm"
                                onClick={() => {
                                    navigate('/edit-branch', {
                                        state: {
                                            branchId: row.original?.id,
                                        },
                                    })
                                }}
                                icon={<MdEdit />}
                                className="text-blue-500"
                            />
                        </Tooltip>
                        {hasAgreementAccess && (
                            <Tooltip title="Agreements">
                                <Button
                                    size="sm"
                                    icon={<HiOutlineBookOpen />}
                                    onClick={() => {
                                        navigate('/agreements', {
                                            state: {
                                                branchId: row.original?.id,
                                                companyId:
                                                    row.original?.Company?.id,
                                                companyName:
                                                    row.original?.Company?.name,
                                                branchName: row.original?.name,
                                            },
                                        })
                                    }}
                                >
                                    {/* Agreements */}
                                </Button>
                            </Tooltip>
                        )}
                        <Tooltip title="Delete">
                            <Button
                                size="sm"
                                onClick={() =>
                                    openDeleteDialog(row.original.id)
                                }
                                icon={<FiTrash />}
                                className="text-red-500"
                            />
                        </Tooltip>
                    </div>
                ),
            },
        ],
        [],
    )

    const openNotification = (
        type: 'success' | 'info' | 'error' | 'warning',
        message: string,
    ) => {
        toast.push(
            <Notification
                title={type.charAt(0).toUpperCase() + type.slice(1)}
                type={type}
                closable={true}
            >
                {message}
            </Notification>,
        )
    }
    useEffect(() => {
        console.log('Updated tableData:', tableData)
    }, [tableData])

    const fetchBranchData = async (page: number, size: number) => {
        setIsLoading(true)
        try {
            const { data } = await httpClient.get(endpoints.branch.getAll(), {
                params: {
                    'branch_id[]': filterValues.branchId || undefined,
                    'group_id[0]': filterValues.companyGroupId || undefined,
                    'company_id[]': filterValues.companyId || undefined,
                    'state_id[]': filterValues.stateId || undefined,
                    'district_id[]': filterValues.districtId || undefined,
                    'location_id[]': filterValues.locationId || undefined,
                    search: filterValues.search || undefined,
                    page: page,
                    page_size: size,
                },
            })

            setBranchTableData(data?.data)
            setTableData((prev) => ({
                ...prev,
                total: data?.paginate_data.totalResults,
                pageIndex: data?.paginate_data.page,
                pageSize: size,
            }))
            // console.log(tableData)
        } catch (error) {
            console.error('Failed to fetch branch:', error)
            toast.push(
                <Notification title="Error" closable={true} type="error">
                    Failed to fetch Branch
                </Notification>,
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleEditClick = (branchId: number) => {
        setCurrentBranchId(branchId)
        setEditDialogIsOpen(true)
    }

    const handleRefreshData = () => {
        fetchBranchData(1, 10)
    }

    const onPaginationChange = (page: number) => {
        fetchBranchData(page, tableData.pageSize)
        console.log(tableData)
    }

    const onSelectChange = (value: number) => {
        fetchBranchData(1, value)
        console.log(tableData)
    }

    useEffect(() => {
        fetchBranchData(1, tableData.pageSize)
    }, [])

    useEffect(() => {
        fetchBranchData(tableData.pageIndex, tableData.pageSize)
    }, [
        filterValues.branchId,
        filterValues.companyGroupId,
        filterValues.companyId,
        filterValues.stateId,
        filterValues.districtId,
        filterValues.locationId,
        filterValues.search,
    ])

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500  rounded-xl">
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
        <div className="relative">
            {branchTableData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
                    <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
                    <p className="text-center">No Data Available</p>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={branchTableData}
                    skeletonAvatarColumns={[0]}
                    skeletonAvatarProps={{ className: 'rounded-md' }}
                    loading={isLoading}
                    pagingData={{
                        total: tableData.total,
                        pageIndex: tableData.pageIndex,
                        pageSize: tableData.pageSize,
                    }}
                    onPaginationChange={onPaginationChange}
                    onSelectChange={onSelectChange}
                    stickyHeader={true}
                    stickyFirstColumn={true}
                    stickyLastColumn={true}
                />
            )}

            <BranchEditDialog
                isOpen={editDialogIsOpen}
                onClose={() => setEditDialogIsOpen(false)}
                branchId={currentBranchId}
                onRefresh={handleRefreshData}
            />

            <Dialog
                isOpen={dialogIsOpen}
                onClose={handleDialogClose}
                onRequestClose={handleDialogClose}
            >
                <h5 className="mb-4">Confirm Deleting Branch</h5>
                <p>
                    Are you sure you want to delete this branch? This action
                    cannot be undone.
                </p>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={handleDialogClose}
                    >
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={handleDialogOk}>
                        Confirm
                    </Button>
                </div>
            </Dialog>

            {/* <Dialog
                isOpen={editDialogIsOpen}
                onClose={handleDialogClose}
                onRequestClose={handleDialogClose}
            >
                <h5 className="mb-4">Edit Branch</h5>
                <div className="mb-4">
                    <OutlinedSelect
                        label="Company Group"
                        options={companyGroupOptions}
                        value={selectedCompanyGroup}
                        onChange={handleCompanyGroupChange}
                    />
                </div>
                <div className="mb-4">
                    <OutlinedSelect
                        label="Company"
                        options={companyOptions}
                        value={selectedCompany}
                        onChange={(option: SelectOption | null) =>
                            setSelectedCompany(option)
                        }
                    />
                </div>
                <div className="mb-4">
                    <OutlinedSelect
                        label="State"
                        options={stateOptions}
                        value={selectedState}
                        onChange={handleStateChange}
                    />
                </div>
                <div className="mb-4">
                    <OutlinedSelect
                        label="District"
                        options={districtOptions}
                        value={selectedDistrict}
                        onChange={handleDistrictChange}
                    />
                </div>
                <div className="mb-4">
                    <OutlinedInput
                        label="Location"
                        value={selectedLocation ? selectedLocation.value : ''}
                        onChange={(value: string) =>
                            setSelectedLocation({ value, label: value })
                        }
                    />
                </div>
                <div className="mb-4">
                    <OutlinedInput
                        label="Branch"
                        value={editedBranch}
                        onChange={(value: string) => setEditedBranch(value)}
                    />
                </div>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={handleDialogClose}
                    >
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={handleEditConfirm}>
                        Confirm
                    </Button>
                </div>
            </Dialog> */}
        </div>
    )
}

export default BranchTable