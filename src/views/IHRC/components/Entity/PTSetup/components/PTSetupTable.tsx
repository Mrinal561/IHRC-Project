import React, { useEffect, useMemo, useState } from 'react'
import { Button, Dialog, toast, Tooltip, Notification } from '@/components/ui'
import { FiTrash } from 'react-icons/fi'
import { MdEdit } from 'react-icons/md'
import DataTable from '@/components/shared/DataTable'
import PTEditedData from './PTEditedData'
import { IoPersonRemoveOutline } from 'react-icons/io5'
import { PTSetupData } from '@/@types/PtSetup'
import dayjs from 'dayjs'
import { showErrorNotification } from '@/components/ui/ErrorMessage'
import { deletePT } from '@/store/slices/ptSetup/ptSetupSlice'
import { useDispatch } from 'react-redux'
import Lottie from 'lottie-react'
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json'
import { HiOutlineViewGrid } from 'react-icons/hi'

interface PTSetupTableProps {
    data: PTSetupData[]
    onRefresh?: () => void
    pagination: {
        total: number
        pageIndex: number
        pageSize: number
    }
    onPaginationChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
    isLoading: boolean
}

const PTSetupTable: React.FC<PTSetupTableProps> = ({
    data,
    isLoading,
    onRefresh,
    pagination,
    onPageSizeChange,
    onPaginationChange,
}) => {
    const dispatch = useDispatch()
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<number | null>(null)
    const [editDialogIsOpen, setEditDialogIsOpen] = useState(false)
    const [itemToEdit, setItemToEdit] = useState<PTSetupData | null>(null)
    const [suspendDialogIsOpen, setSuspendDialogIsOpen] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const openSuspendDialog = (index: number) => {
        setSuspendDialogIsOpen(true)
    }
    useEffect(() => {
        console.log(data)
    }, [])

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

    const columns = useMemo(
        () => [
            // {
            //   header: 'Company Group',
            //   accessorKey: 'CompanyGroup.name',
            //   cell: (props) => (
            //     <div className="w-36 text-start">{props.getValue() as string}</div>
            //   ),
            // },
            // {
            //   header: 'Company',
            //   accessorKey: 'Company.name',
            //   cell: (props: any) => (
            //     <div className="w-48 text-start">
            //      {props.getValue() as string}
            //     </div>
            //   ),
            // },
            // {
            //   header: 'PT State',
            //   accessorKey: 'ptState',
            //   cell: (props: any) => (
            //     <div className="w-36 text-start">{props.getValue()}</div>
            //   ),
            // },
            {
                header: 'PT State',
                enableSorting: false,
                accessorKey: 'State.name',
                cell: (props: any) => (
                    <div className="w-36 text-start">{props.getValue()}</div>
                ),
            },
            {
                header: 'PT Location',
                enableSorting: false,
                accessorKey: 'Location.name',
                cell: (props: any) => (
                    <div className="w-36 text-start">{props.getValue()}</div>
                ),
            },
            {
                header: 'Enrollment Number(PT EC)',
                enableSorting: false,
                accessorKey: 'enroll_number',
                cell: (props: any) => (
                    <div className="w-64 truncate">{props.getValue()}</div>
                ),
            },
            {
                header: 'Registration Number(PT RC)',
                enableSorting: false,
                accessorKey: 'register_number',
                cell: (props: any) => (
                    <div className="w-64 truncate">{props.getValue()}</div>
                ),
            },
            {
                header: 'PT Registration Date',
                enableSorting: false,
                accessorKey: 'register_date',
                cell: (props: any) => (
                    <div className="w-48 flex items-center justify-center">
                        {dayjs(props.getValue() as string).format('DD-MM-YYYY')}
                    </div>
                ),
            },
            {
                header: 'Remittance Mode',
                enableSorting: false,
                accessorKey: 'remmit_mode',
                cell: (props: any) => (
                    <div className="w-40 flex items-center justify-center">
                        {props.getValue()}
                    </div>
                ),
            },
            // {
            //   header: 'PT EC Frequency',
            //   accessorKey: 'ptecPaymentFrequency',
            //   cell: (props: any) => (
            //     <div className="w-40 flex items-center justify-center">
            //       {props.getValue()}
            //     </div>
            //   ),
            // },
            // {
            //   header: 'PT RC Frequency',
            //   accessorKey: 'ptrcPaymentFrequency',
            //   cell: (props: any) => (
            //     <div className="w-40 flex items-center justify-center">
            //       {props.getValue()}
            //     </div>
            //   ),
            // },
            {
                header: 'Username',
                enableSorting: false,
                accessorKey: 'username',
                cell: (props: any) => (
                    <div className="w-48 truncate">{props.getValue()}</div>
                ),
            },
            {
                header: 'Password',
                enableSorting: false,
                accessorKey: 'password',
                cell: (props: any) => (
                    <div className="w-48 truncate">{props.getValue()}</div>
                ),
            },
            {
                header: 'Mobile',
                enableSorting: false,
                accessorKey: 'mobile',
                cell: (props: any) => (
                    <div className="w-48 truncate">{props.getValue()}</div>
                ),
            },
            {
                header: 'Email',
                enableSorting: false,
                accessorKey: 'email',
                cell: (props: any) => (
                    <div className="w-48 truncate">{props.getValue()}</div>
                ),
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }: any) => (
                    <div className="flex items-center gap-2">
                        <Tooltip title="Edit PT Setup">
                            <Button
                                size="sm"
                                onClick={() => openEditDialog(row.original)}
                                icon={<MdEdit />}
                                className="text-blue-500"
                            />
                        </Tooltip>
                        <Tooltip title="Delete PT Setup">
                            <Button
                                size="sm"
                                onClick={() => openDialog(row.original)}
                                icon={<FiTrash />}
                                className="text-red-500"
                            />
                        </Tooltip>
                        {/* <Tooltip title="Suspend User">
              <Button
                size="sm"
                onClick={() => openSuspendDialog(row.index)}
                icon={<IoPersonRemoveOutline />}
                className="text-blue-500"
              />
            </Tooltip> */}
                    </div>
                ),
            },
        ],
        [],
    )

    const openDialog = (index: number) => {
        setItemToDelete(index)
        setDialogIsOpen(true)
    }

    const openEditDialog = (item: PTSetupData) => {
        setItemToEdit(item)
        setEditDialogIsOpen(true)
        setEditingId(item.id)
    }

    const handleDialogClose = () => {
        setDialogIsOpen(false)
        setEditDialogIsOpen(false)
        setSuspendDialogIsOpen(false)
        setItemToDelete(null)
        setItemToEdit(null)
    }

    const handleDialogOk = async () => {
        if (itemToDelete) {
            try {
                setLoading(true)
                const res = await dispatch(deletePT(itemToDelete.id))
                    .unwrap()
                    .catch((error: any) => {
                        throw error // Re-throw to prevent navigation
                    })

                if (res) {
                    toast.push(
                        <Notification title="Success" type="success">
                            PT Setup deleted successfully
                        </Notification>,
                    )
                    setDialogIsOpen(false)
                    setItemToDelete(null)
                    if (onRefresh) {
                        onRefresh() // Refresh the data after successful deletion
                    }
                }
            } catch (error) {
                // toast.push(
                //   <Notification title="Error" closable={true} type="danger">
                //     Failed to delete PF Setup
                //   </Notification>
                // );
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
    }

    if (isLoading) {
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
        <div className="relative">
            {data.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
                    <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
                    <p className="text-center">No Data Available</p>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={data}
                    skeletonAvatarColumns={[0]}
                    skeletonAvatarProps={{ className: 'rounded-md' }}
                    loading={isLoading}
                    pagingData={{
                        total: pagination.total,
                        pageIndex: pagination.pageIndex,
                        pageSize: pagination.pageSize,
                    }}
                    onPaginationChange={onPaginationChange}
                    onSelectChange={onPageSizeChange}
                    stickyHeader
                    stickyFirstColumn
                    stickyLastColumn
                />
            )}

            <Dialog
                isOpen={dialogIsOpen}
                onClose={handleDialogClose}
                onRequestClose={handleDialogClose}
                shouldCloseOnOverlayClick={false}
            >
                <h5 className="mb-4">Confirm Deletion</h5>
                <p>Are you sure you want to delete this PT Setup?</p>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={handleDialogClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        onClick={handleDialogOk}
                        loading={loading}
                    >
                        Confirm
                    </Button>
                </div>
            </Dialog>

            <Dialog
                isOpen={editDialogIsOpen}
                onClose={handleDialogClose}
                onRequestClose={handleDialogClose}
                width={1060}
                height={510}
            >
                <h5 className="mb-4">Edit PT Setup</h5>
                {itemToEdit && (
                    <PTEditedData
                        onRefresh={onRefresh}
                        id={editingId}
                        initialData={itemToEdit}
                        onClose={handleDialogClose}
                        onSubmit={(data: PTSetupData) => {
                            // Handle submit logic here
                            handleDialogClose()
                        }}
                    />
                )}
            </Dialog>

            <Dialog
                isOpen={suspendDialogIsOpen}
                onClose={handleDialogClose}
                onRequestClose={handleDialogClose}
            >
                <h5 className="mb-4">Confirm Suspension</h5>
                <p>Are you sure you want to suspend this user?</p>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={handleDialogClose}
                    >
                        Cancel
                    </Button>
                    <Button variant="solid">Suspend</Button>
                </div>
            </Dialog>
        </div>
    )
}

export default PTSetupTable
