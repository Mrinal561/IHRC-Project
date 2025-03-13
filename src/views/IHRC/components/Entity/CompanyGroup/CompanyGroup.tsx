import React, { useState, useEffect } from 'react'
import { Button, Dialog, Notification, toast } from '@/components/ui'
import { HiPlusCircle } from 'react-icons/hi'
import OutlinedInput from '@/components/ui/OutlinedInput'
import AdaptableCard from '@/components/shared/AdaptableCard'
import CompanyTable from './components/CompanyTable'
import { useAppDispatch } from '@/store'
import {
    fetchCompanyGroups,
    createCompanyGroup,
    updateCompanyGroup,
    deleteCompanyGroup,
} from '@/store/slices/companyGroup/companyGroupSlice'
import { CompanyGroupData } from '@/store/slices/companyGroup/companyGroupSlice'
import { showErrorNotification } from '@/components/ui/ErrorMessage'
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
            /^[a-zA-Z0-9\s_-]+$/,
            'Role name can only contain letters, numbers, spaces, underscores, and hyphens',
        ),
})

const CompanyGroup = () => {
    const dispatch = useAppDispatch()
    const [isLoading, setIsLoading] = useState(false)
    const [dialogLoading, setDialogLoading] = useState(false)
    const [companyData, setCompanyData] = useState<CompanyGroupData[]>([])
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const [tableKey, setTableKey] = useState(0) // Add this to force table re-render
    const [newCompanyGroup, setNewCompanyGroup] = useState({
        name: '',
    })
    const [errors, setErrors] = useState<ValidationErrors>({})

    // Updated to include pagination parameters
    const fetchCompanyDataTable = async (page = 1, pageSize = 10) => {
        setIsLoading(true)
        try {
            const { payload: data }: any = await dispatch(
                fetchCompanyGroups({ page, page_size: pageSize }),
            )
            if (data && data.data) {
                setCompanyData(data.data)
            }
        } catch (error) {
            console.error('Failed to fetch company groups:', error)
            toast.push(
                <Notification title="Error" closable={true} type="error">
                    Failed to fetch company groups
                </Notification>,
            )
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCompanyDataTable()
    }, [])

    const validateForm = async () => {
        try {
            await companySchema.validate(newCompanyGroup, { abortEarly: false })
            setErrors({}) // Clear any existing errors
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

    const handleConfirm = async () => {
        // if (companyData.length > 0) {
        //     toast.push(
        //         <Notification title="Error" closable={true} type="danger">
        //             Only one company group is allowed. Please delete the existing group first.
        //         </Notification>
        //     );
        //     return;
        // }

        // if (!newCompanyGroup.name.trim()) {
        //     toast.push(
        //         <Notification title="Error" closable={true} type="danger">
        //             Please enter a valid company group name
        //         </Notification>
        //     );
        //     return;
        // }
        const isValid = await validateForm()
        if (!isValid) return
        setDialogLoading(true)
        try {
            const result = await dispatch(createCompanyGroup(newCompanyGroup))
                .unwrap()
                .catch((error: any) => {
                    throw error // Re-throw to prevent navigation
                })
            if (result) {
                onDialogClose()
                // Force table component to re-render
                setTableKey((prevKey) => prevKey + 1)
                // Fetch fresh data
                await fetchCompanyDataTable(1, 10) // Reset to first page after adding new item
                toast.push(
                    <Notification title="Success" type="success">
                        Company Group added successfully
                    </Notification>,
                )
            }
        } catch (error) {
            toast.push(
                <Notification title="Failed" type="error">
                    Failed to add company group
                </Notification>,
            )
        } finally {
            setDialogLoading(false)
        }
    }

    const onDialogClose = () => {
        setDialogIsOpen(false)
        setNewCompanyGroup({ name: '' })
    }

    const handleInputChange = (
        field: keyof CompanyGroupData,
        value: string,
    ) => {
        setNewCompanyGroup((prev) => ({ ...prev, [field]: value }))
        setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
                <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold">Company Group</h3>
                </div>
                {/* <Button 
                    variant="solid" 
                    onClick={() => setDialogIsOpen(true)} 
                    icon={<HiPlusCircle />} 
                    size="sm"
                    // disabled={companyData.length > 0}
                >
                    Add Company Group
                </Button> */}
            </div>

            <CompanyTable
                key={tableKey} // Add key to force re-render
                companyData={companyData}
                isLoading={isLoading}
                onDataChange={fetchCompanyDataTable}
            />

            <Dialog
                isOpen={dialogIsOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
                width={500}
                height={260}
                shouldCloseOnOverlayClick={false}
            >
                <div className="flex flex-col h-full justify-between">
                    <h5 className="mb-4">Add Company Group</h5>
                    <div className="flex flex-col gap-2">
                        <p>Enter Your Company Group</p>
                        <OutlinedInput
                            label="Company Group Name"
                            value={newCompanyGroup.name}
                            onChange={(value: string) =>
                                handleInputChange('name', value)
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
                            className="mr-2"
                            variant="plain"
                            onClick={onDialogClose}
                            disabled={dialogLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="solid"
                            onClick={handleConfirm}
                            loading={dialogLoading}
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </Dialog>
        </AdaptableCard>
    )
}

export default CompanyGroup
