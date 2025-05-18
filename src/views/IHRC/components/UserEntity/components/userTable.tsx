import React, { useEffect, useMemo, useState } from 'react'
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
import DataTable, { ColumnDef } from '@/components/shared/DataTable'
import { RiCloseLine, RiEyeLine, RiShieldKeyholeLine } from 'react-icons/ri'
import { CiSquareRemove } from 'react-icons/ci'
import { IoPersonRemoveOutline } from 'react-icons/io5'
import {
    fetchUsers,
    deleteUser,
    updateUser,
    selectUsers,
    selectLoading,
    fetchUserById,
} from '@/store/slices/userEntity/UserEntitySlice'
import { AppDispatch } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import { UserData } from '@/@types/userEntity'
import { showErrorNotification } from '@/components/ui/ErrorMessage'
import dayjs from 'dayjs'
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json'
import Lottie from 'lottie-react'
import { HiOutlineViewGrid } from 'react-icons/hi'
import UserEditDialog from './UserEditDialog'
import { fetchCompanyGroups } from '@/store/slices/companyGroup/companyGroupSlice'
import { useNavigate } from 'react-router-dom'

const UserTable: React.FC<{
    search: any
    refreshTrigger: number
}> = ({ search, refreshTrigger }) => {
    const dispatch = useDispatch<AppDispatch>()
    const [isLoading, setIsLoading] = useState(false)
    const [userTableData, setUserTableData] = useState([])
    // const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    // const [dialogState, setDialogState] = useState({
    //     delete: false,
    //     edit: false,
    //     suspend: false,
    //     disable: false
    // });
    const navigate = useNavigate()
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const [editDialogIsOpen, setEditDialogIsOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<string | null>(null)
    const [itemToEdit, setItemToEdit] = useState<number | null>(null)
    const [editedUserData, setEditedUserData] = useState<Partial<UserData>>({})

    const handleModifyPermission = async (userData) => {
        try {
            const response = await dispatch(
                fetchUserById(userData.user_details.id),
            )
            if (response) {
                navigate('/user-permission', {
                    state: { userData: response.payload },
                })
            }
        } catch (error) {
            showErrorNotification('Failed to fetch role details')
        }
    }

    const columns = useMemo(
        () => [
            {
                header: 'Company',
                enableSorting: false,
                accessorKey: 'company_details.name',
                cell: (props) => (
                    <div className="w-32 truncate">
                        {props.getValue() as string}
                    </div>
                ),
            },
            {
                header: 'Name',
                enableSorting: false,
                accessorKey: 'user_details.name',
                cell: (props) => (
                    <div className="w-32 truncate">
                        {props.getValue() as string}
                    </div>
                ),
            },
            // {
            //     header: 'Last Name',
            //     accessorKey: 'last_name',
            //     cell: (props) => <div className="w-32 truncate">{props.getValue() as string}</div>,
            // },
            {
                header: 'Branch Name',
                enableSorting: false,
                accessorKey: 'branch_details',
                cell: (props) => {
                    const branches = props.getValue() as Array<{
                        name: string
                        state: { name: string }
                        district: { name: string }
                    }>

                    if (!branches || branches.length === 0) {
                        return (
                            <div className="w-40 truncate">
                                No Branch Assigned
                            </div>
                        )
                    }

                    const branchNames = branches
                        .map((branch) => branch.name)
                        .join(', ')

                    return (
                        <Tooltip title={branchNames}>
                            <div className="w-40 truncate">{branchNames}</div>
                        </Tooltip>
                    )
                },
            },
            {
                header: 'Email',
                enableSorting: false,
                accessorKey: 'user_details.email',
                cell: (props) => (
                    <div className="w-40 truncate">
                        {props.getValue() as string}
                    </div>
                ),
            },

            // {
            //     header: 'Password',
            //     accessorKey: 'password',
            //     cell: (props) => <div className="w-32 truncate">{props.getValue() as string}</div>,
            // },
            {
                header: 'Mobile Number',
                enableSorting: false,
                accessorKey: 'user_details.mobile',
                cell: (props) => (
                    <div className="w-36 truncate">
                        {props.getValue() as string}
                    </div>
                ),
            },
            {
                header: 'Designation',
                enableSorting: false,
                accessorKey: 'role_details.name',
                cell: (props) => (
                    <div className="w-32 truncate">
                        {props.getValue() as string}
                    </div>
                ),
            },
            // {
            //     header: 'PAN',
            //     accessorKey: 'user_details.pan_card',
            //     cell: (props) => (
            //         <div className="w-28 truncate">
            //             {props.getValue() as string}
            //         </div>
            //     ),
            // },
            // {
            //     header: 'Aadhar',
            //     accessorKey: 'user_details.aadhar_no',
            //     cell: (props) => (
            //         <div className="w-36 truncate">
            //             {props.getValue() as string}
            //         </div>
            //     ),
            // },
            {
                header: 'Date of Joining',
                enableSorting: false,
                accessorKey: 'user_details.joining_date',
                cell: (props) => (
                    <div className="w-32 truncate">
                        {dayjs(props.getValue() as string).format('DD-MM-YYYY')}
                    </div>
                ),
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        {/* <Tooltip title="View User Details">
                            <Button
                                    size="sm"
                                    icon={<RiEyeLine />}
                                    className="text-blue-500"
                                />
                        </Tooltip> */}
                        <Tooltip title="Edit User Details">
                            <Button
                                size="sm"
                                onClick={
                                    () => {
                                        navigate('/edit-user', {
                                            state: {
                                                companyName:
                                                    row.original.group_details
                                                        ?.name,
                                                companyId:
                                                    row.original.group_details
                                                        ?.id,
                                                userId: row.original
                                                    .user_details?.id,
                                            },
                                        })
                                    }

                                    // handleEditClick(row.original.user_details.id);
                                }
                                icon={<MdEdit />}
                                className="text-blue-500"
                            />
                        </Tooltip>
                        {/* <Tooltip title="Suspend User">
                            <Button
                                size="sm"
                                // onClick={() => openSuspendDialog(row.original)}
                                icon={<IoPersonRemoveOutline />}
                                className="text-blue-500"
                            />
                        </Tooltip> */}
                        {/* <Tooltip title="Disable Login">
                            <Button
                                size="sm"
                                // onClick={() => openDisableDialog(row.original)}
                                icon={<RiCloseLine />}
                                className="text-blue-500"
                            />
                        </Tooltip> */}
                        <Tooltip title="Modify Permission">
                            <Button
                                size="sm"
                                onClick={() =>
                                    handleModifyPermission(row.original)
                                }
                                icon={
                                    <RiShieldKeyholeLine className="h-5 w-5" />
                                }
                                className="text-purple-600"
                            />
                        </Tooltip>

                        <Tooltip title="Delete User">
                            <Button
                                size="sm"
                                onClick={() =>
                                    openDeleteDialog(
                                        row.original.user_details.id,
                                    )
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
        type: 'success' | 'info' | 'danger' | 'warning',
        message: string,
    ) => {
        toast.push(
            <Notification
                title={type.charAt(0).toUpperCase() + type.slice(1)}
                type={type}
            >
                {message}
            </Notification>,
        )
    }

    const handleDeleteConfirm = async () => {
        console.log(itemToDelete)
        if (itemToDelete) {
            const response = await dispatch(deleteUser(itemToDelete))
                .unwrap()
                .catch((error: any) => {
                    throw error // Re-throw to prevent navigation
                })

            if (response) {
                handleDialogClose()

                const newTotal = tableData.total - 1
                const lastPage = Math.ceil(newTotal / tableData.pageSize)
                const newPageIndex =
                    tableData.pageIndex > lastPage
                        ? lastPage
                        : tableData.pageIndex

                fetchUserData(newPageIndex, tableData.pageSize)
                toast.push(
                    <Notification title="Success" type="success">
                        User deleted successfully
                    </Notification>,
                )
            }
        }
    }

    const openDeleteDialog = (userid: string) => {
        setItemToDelete(userid)
        setDialogIsOpen(true)
    }
    // const openSuspendDialog = (index: number) => {
    //     setSuspendDialogIsOpen(true);
    // };
    // const openDisableDialog = (index: number) => {
    //     setDisableDialogIsOpen(true);
    // };

    const openEditDialog = (user: UserData) => {
        setItemToEdit(user)
        setEditedUserData(user)
        setEditDialogIsOpen(true)
    }

    const handleEditClick = (user: number) => {
        setItemToEdit(user)
        setEditDialogIsOpen(true)
    }

    const handleDialogClose = () => {
        setDialogIsOpen(false)
        setEditDialogIsOpen(false)
        setItemToDelete(null)
        setItemToEdit(null)
        setEditedUserData({})
    }
    useEffect(() => {
        fetchUserData(1, 10, search)
    }, [search, refreshTrigger])

    const fetchUserData = async (
        page: number,
        size: number,
        searchQuery?: string,
    ) => {
        setIsLoading(true)
        try {
            const { payload: data } = await dispatch(
                fetchUsers({
                    page: page,
                    page_size: size,
                    search: searchQuery,
                }),
            )
            //     .unwrap()
            //     .catch((error: any) => {
            //       // Handle different error formats
            //       if (error.data?.data?.message) {
            //           // API error response
            //           showErrorNotification(error.data.data.message);
            //       } else if (error.message) {
            //           // Regular error object
            //           showErrorNotification(error.message);
            //       } else if (Array.isArray(error)) {
            //           // Array of error messages
            //           showErrorNotification(error);
            //       } else {
            //           // Fallback error message
            //           showErrorNotification('An unexpected error occurred. Please try again.');
            //       }
            //       throw error; // Re-throw to prevent navigation
            //   });
            if (data?.data) {
                setUserTableData(data.data)
                setTableData((prev) => ({
                    ...prev,
                    total: data.paginateData.totalResults,
                    pageIndex: data.paginateData.page,
                }))
            }
        } catch (error) {
            console.error('Failed to fetch users:', error)
            // toast.push(
            //   <Notification title="Error" closable={true} type="danger">
            //     Failed to fetch Users
            //   </Notification>
            // );
        } finally {
            setIsLoading(false)
        }
    }

    const [tableData, setTableData] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sort: { order: '', key: '' },
    })

    const onPaginationChange = (page: number) => {
        setTableData((prev) => ({ ...prev, pageIndex: page }))
        fetchUserData(page, tableData.pageSize, search)
    }

    const onSelectChange = (value: number) => {
        setTableData((prev) => ({
            ...prev,
            pageSize: Number(value),
            pageIndex: 1,
        }))
        fetchUserData(1, value, search)
    }

    if (isLoading) {
        console.log('Loading....................')

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
            {userTableData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
                    <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
                    <p className="text-center">No Data Available</p>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={userTableData}
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

            <Dialog
                isOpen={dialogIsOpen}
                onClose={handleDialogClose}
                onRequestClose={handleDialogClose}
            >
                <h5 className="mb-4">Confirm Deleting User</h5>
                <p>
                    Are you sure you want to delete the user? This action cannot
                    be undone.
                </p>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={handleDialogClose}
                    >
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={handleDeleteConfirm}>
                        Confirm
                    </Button>
                </div>
            </Dialog>
            <UserEditDialog
                isOpen={editDialogIsOpen}
                onClose={() => setEditDialogIsOpen(false)}
                userId={itemToEdit}
                onRefresh={fetchUserData}
            />
        </div>
    )
}

export default UserTable






// import React from 'react'
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
// import DataTable from '@/components/shared/DataTable'
// import { useNavigate } from 'react-router-dom'

// interface Auditor {
//     id: string
//     company: string
//     auditFirmName: string
//     auditorName: string
//     email: string
//     mobile: string
//     auditFrequency: string
// }

// const UserTable: React.FC = () => {
//     const navigate = useNavigate()
//     const [dialogIsOpen, setDialogIsOpen] = React.useState(false)
//     const [itemToDelete, setItemToDelete] = React.useState<string | null>(null)

//     // Dummy data
//     const dummyData: Auditor[] = [
//         {
//             id: '1',
//             company: 'ABC Corporation',
//             auditFirmName: 'Deloitte',
//             auditorName: 'John Smith',
//             email: 'john.smith@deloitte.com',
//             mobile: '9876543210',
//             auditFrequency: 'Quarterly'
//         },
//         {
//             id: '2',
//             company: 'XYZ Ltd',
//             auditFirmName: 'PwC',
//             auditorName: 'Sarah Johnson',
//             email: 'sarah.j@pwc.com',
//             mobile: '8765432109',
//             auditFrequency: 'Yearly'
//         },
//         {
//             id: '3',
//             company: 'Global Enterprises',
//             auditFirmName: 'EY',
//             auditorName: 'Michael Brown',
//             email: 'michael.b@ey.com',
//             mobile: '7654321098',
//             auditFrequency: 'Monthly'
//         },
//         {
//             id: '4',
//             company: 'Tech Solutions',
//             auditFirmName: 'KPMG',
//             auditorName: 'Emily Davis',
//             email: 'emily.d@kpmg.com',
//             mobile: '6543210987',
//             auditFrequency: 'Half Yearly'
//         }
//     ]

//     const columns = [
//         {
//             header: 'Company',
//             accessorKey: 'company',
//             enableSorting: false,
//             cell: (props: any) => (
//                 <div className="w-32 truncate">
//                     {props.getValue() as string}
//                 </div>
//             ),
//         },
//         {
//             header: 'Audit Firm Name',
//             accessorKey: 'auditFirmName',
//                         enableSorting: false,

//             cell: (props: any) => (
//                 <div className="w-32 truncate">
//                     {props.getValue() as string}
//                 </div>
//             ),
//         },
//         {
//             header: 'Auditor Name',
//             accessorKey: 'auditorName',
//                         enableSorting: false,

//             cell: (props: any) => (
//                 <div className="w-32 truncate">
//                     {props.getValue() as string}
//                 </div>
//             ),
//         },
//         {
//             header: 'Email ID',
//             accessorKey: 'email',
//                         enableSorting: false,

//             cell: (props: any) => (
//                 <div className="w-40 truncate">
//                     {props.getValue() as string}
//                 </div>
//             ),
//         },
//         {
//             header: 'Mobile Number',
//             accessorKey: 'mobile',
//                         enableSorting: false,

//             cell: (props: any) => (
//                 <div className="w-36 truncate">
//                     {props.getValue() as string}
//                 </div>
//             ),
//         },
//         {
//             header: 'Audit Frequency',
//             accessorKey: 'auditFrequency',
//                         enableSorting: false,

//             cell: (props: any) => (
//                 <div className="w-32 truncate">
//                     {props.getValue() as string}
//                 </div>
//             ),
//         },
//         {
//             header: 'Actions',
//             id: 'actions',
//             cell: ({ row }: any) => (
//                 <div className="flex items-center gap-2">
//                     <Tooltip title="Edit Auditor Details">
//                         <Button
//                             size="sm"
//                             onClick={() => navigate(`/edit-auditor/${row.original.id}`)}
//                             icon={<MdEdit />}
//                             className="text-blue-500"
//                         />
//                     </Tooltip>
//                     <Tooltip title="Delete Auditor">
//                         <Button
//                             size="sm"
//                             onClick={() => openDeleteDialog(row.original.id)}
//                             icon={<FiTrash />}
//                             className="text-red-500"
//                         />
//                     </Tooltip>
//                 </div>
//             ),
//         },
//     ]

//     const openDeleteDialog = (auditorId: string) => {
//         setItemToDelete(auditorId)
//         setDialogIsOpen(true)
//     }

//     const handleDeleteConfirm = () => {
//         if (itemToDelete) {
//             // In a real app, you would make an API call here
//             toast.push(
//                 <Notification title="Success" type="success">
//                     Auditor deleted successfully
//                 </Notification>,
//             )
//             handleDialogClose()
//         }
//     }

//     const handleDialogClose = () => {
//         setDialogIsOpen(false)
//         setItemToDelete(null)
//     }

//     return (
//         <div className="relative">
//             <DataTable
//                 columns={columns}
//                 data={dummyData}
//                 pagingData={{
//                     total: dummyData.length,
//                     pageIndex: 1,
//                     pageSize: 10,
//                 }}
//             />

//             <Dialog
//                 isOpen={dialogIsOpen}
//                 onClose={handleDialogClose}
//                 onRequestClose={handleDialogClose}
//             >
//                 <h5 className="mb-4">Confirm Deleting Auditor</h5>
//                 <p>
//                     Are you sure you want to delete this auditor? This action cannot
//                     be undone.
//                 </p>
//                 <div className="text-right mt-6">
//                     <Button
//                         className="ltr:mr-2 rtl:ml-2"
//                         variant="plain"
//                         onClick={handleDialogClose}
//                     >
//                         Cancel
//                     </Button>
//                     <Button variant="solid" onClick={handleDeleteConfirm}>
//                         Confirm
//                     </Button>
//                 </div>
//             </Dialog>
//         </div>
//     )
// }

// export default UserTable