import React, { useState, useMemo, useEffect } from 'react'
import DataTable from '@/components/shared/DataTable'
import { Button, Dialog, Tooltip, Notification, toast } from '@/components/ui'
import { FiTrash } from 'react-icons/fi'
import { MdEdit } from 'react-icons/md'
import OutlinedInput from '@/components/ui/OutlinedInput'
import { useAppDispatch } from '@/store'
import {
    deleteCompanyGroup,
    updateCompanyGroup,
    fetchCompanyGroups,
} from '@/store/slices/companyGroup/companyGroupSlice'
import { CompanyGroupData } from '@/store/slices/companyGroup/companyGroupSlice'
import { showErrorNotification } from '@/components/ui/ErrorMessage'
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json'
import Lottie from 'lottie-react'
import { HiOutlineViewGrid } from 'react-icons/hi'
import * as yup from 'yup'

interface ValidationErrors {
    name?: string
}

const companySchema = yup.object().shape({
    name: yup
        .string()
        .required('Role name is required')
        .min(3, 'Role name must be at least 3 characters')
        .max(50, 'Role name must not exceed 50 characters')
        .matches(
            /^\S.*\S$|^\S$/,
            'The input must not have leading or trailing spaces',
        ),
})

interface CompanyTableProps {
    companyData: CompanyGroupData[]
    isLoading: boolean
    onDataChange: (page?: number, pageSize?: number) => void
}

const CompanyTable: React.FC<CompanyTableProps> = ({
    companyData,
    isLoading,
    onDataChange,
}) => {
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false)
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const [companyGroupTableData, setCompanyGroupTableData] = useState<
        CompanyGroupData[]
    >([])
    const [editDialogIsOpen, setEditDialogIsOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<CompanyGroupData | null>(
        null,
    )
    const [itemToEdit, setItemToEdit] = useState<CompanyGroupData | null>(null)
    const [editedCompanyGroupName, setEditedCompanyGroupName] = useState('')
    const [errors, setErrors] = useState<ValidationErrors>({})
    const [editedCreatedBy, setEditedCreatedBy] = useState<string | null>(null)
    const [tableData, setTableData] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sort: { order: '', key: '' },
    })

    useEffect(() => {
        setCompanyGroupTableData(companyData)
    }, [companyData])

    useEffect(() => {
        fetchCompanyGroupData(tableData.pageIndex, tableData.pageSize)
    }, [tableData.pageIndex, tableData.pageSize])

    const fetchCompanyGroupData = async (page: number, size: number) => {
        const { payload: data } = await dispatch(
            fetchCompanyGroups({ page, page_size: size }),
        )
        if (data?.data) {
            setCompanyGroupTableData(data.data)
            // setTableData(prev => ({
            //     ...prev,
            //     total: data.paginate_data.totalResult,
            //     pageIndex: data.paginate_data.page,
            // }));
        }
    }

    const columns = useMemo(
        () => [
            {
                header: 'Company Group',
                enableSorting: false,
                accessorKey: 'name',
                cell: (props) => (
                    <div className="w-96 truncate">
                        {props.getValue() as string}
                    </div>
                ),
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Tooltip title="Edit">
                            <Button
                                size="sm"
                                onClick={() => openEditDialog(row.original)}
                                icon={<MdEdit />}
                                className="text-blue-500"
                            />
                        </Tooltip>
                        {/* <Tooltip title="Delete">
                            <Button
                                size="sm"
                                onClick={() => openDeleteDialog(row.original)}
                                icon={<FiTrash />}
                                className="text-red-500"
                            />
                        </Tooltip> */}
                    </div>
                ),
            },
        ],
        [],
    )

    const handleDeleteConfirm = async () => {
        if (itemToDelete?.id) {
            try {
                const response = await dispatch(
                    deleteCompanyGroup(itemToDelete.id),
                )
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

                    onDataChange(newPageIndex, tableData.pageSize)
                    showSuccessNotification(
                        'Company group deleted successfully',
                    )
                }
            } catch (error) {
                showErrorNotification(error)
                console.log(error)
            }
            handleDialogClose()
        }
    }

    const validateForm = async () => {
        try {
            await companySchema.validate(
                { name: editedCompanyGroupName },
                { abortEarly: false },
            )
            setErrors({})
            return true
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                const validationErrors: ValidationErrors = {}
                err.inner.forEach((error) => {
                    if (error.path) {
                        validationErrors[error.path as keyof ValidationErrors] =
                            error.message
                    }
                })
                setErrors(validationErrors)
            }
            return false
        }
    }

    useEffect(() => {
        validateForm()
    }, [editedCompanyGroupName])

    const handleEditConfirm = async () => {
        // if (itemToEdit?.id && editedCompanyGroupName.trim()) {
        try {
            setLoading(true)
            const isValid = await validateForm()
            if (!isValid) {
                showErrorNotification('Please fix the validation Error')
                return
            }
            const result = await dispatch(
                updateCompanyGroup({
                    id: itemToEdit.id,
                    data: {
                        name: editedCompanyGroupName.trim(),
                        created_by: editedCreatedBy,
                    },
                }),
            )
                .unwrap()
                .catch((error: any) => {
                    throw error // Re-throw to prevent navigation
                })

            if (result) {
                onDataChange()
                handleDialogClose()
                showSuccessNotification('Company group updated successfully')
            }
        } catch (error) {
            console.error('Error updating company group:', error)
            // showErrorNotification('Failed to update company group');
        } finally {
            setLoading(false)
        }
        // } else {
        //     showErrorNotification('Please enter a valid company group name');
        // }
    }

    const openDeleteDialog = (company: CompanyGroupData) => {
        setItemToDelete(company)
        setDialogIsOpen(true)
    }

    const openEditDialog = (company: CompanyGroupData) => {
        setItemToEdit(company)
        setEditedCompanyGroupName(company.name)
        setEditedCreatedBy(company.created_by)
        setEditDialogIsOpen(true)
    }

    const handleDialogClose = () => {
        setDialogIsOpen(false)
        setEditDialogIsOpen(false)
        setItemToDelete(null)
        setItemToEdit(null)
        setEditedCompanyGroupName('')
        setErrors({})
    }

    const showSuccessNotification = (message: string) => {
        toast.push(
            <Notification title="Success" type="success" closable={true}>
                {message}
            </Notification>,
        )
    }

    // const showErrorNotification = (message: string) => {
    //     toast.push(
    //         <Notification title="Error" closable={true} type="danger">
    //             {message}
    //         </Notification>
    //     );
    // };

    const onPaginationChange = (page: number) => {
        setTableData((prev) => ({ ...prev, pageIndex: page }))
    }

    const onSelectChange = (value: number) => {
        setTableData((prev) => ({
            ...prev,
            pageSize: Number(value),
            pageIndex: 1,
        }))
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
            {companyGroupTableData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
                    <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
                    <p className="text-center">No Data Available</p>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={companyGroupTableData}
                    skeletonAvatarColumns={[0]}
                    skeletonAvatarProps={{ className: 'rounded-md' }}
                    loading={isLoading}
                    // pagingData={{
                    //     total: tableData.total,
                    //     pageIndex: tableData.pageIndex,
                    //     pageSize: tableData.pageSize,
                    // }}
                    // onPaginationChange={onPaginationChange}
                    // onSelectChange={onSelectChange}
                    stickyHeader={true}
                    stickyFirstColumn={true}
                    stickyLastColumn={true}
                    pageSizes={[]}
                    onPaginationChange={() => {}}
                    onSelectChange={() => {}}
                />
            )}
            <Dialog
                isOpen={dialogIsOpen}
                onClose={handleDialogClose}
                onRequestClose={handleDialogClose}
                shouldCloseOnOverlayClick={false}
            >
                <h5 className="mb-4">Confirm Deletion</h5>
                <p>
                    Are you sure you want to delete the company group "
                    {itemToDelete?.name}"? This action cannot be undone.
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
                        Delete
                    </Button>
                </div>
            </Dialog>

            <Dialog
                isOpen={editDialogIsOpen}
                onClose={handleDialogClose}
                onRequestClose={handleDialogClose}
            >
                <h5 className="mb-4">Edit Company Group</h5>
                <div className="mb-4">
                    <OutlinedInput
                        label="Company Group Name"
                        value={editedCompanyGroupName}
                        onChange={(value: string) =>
                            setEditedCompanyGroupName(value)
                        }
                    />
                    {errors.name && (
                        <div className="text-red-500 text-sm mt-1">
                            {errors.name}
                        </div>
                    )}
                </div>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={handleDialogClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        loading={loading}
                        variant="solid"
                        onClick={handleEditConfirm}
                    >
                        Confirm
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default CompanyTable
