import React, { useState } from 'react'
import { Button, Dialog, Notification, toast } from '@/components/ui'
import { HiPlusCircle } from 'react-icons/hi'
import OutlinedInput from '@/components/ui/OutlinedInput'
import { createCompanyGroup } from '@/store/slices/companyGroup/companyGroupSlice'
import { AppDispatch } from '@/store'
import { useDispatch } from 'react-redux'
import { CompanyGroupData } from '@/store/slices/companyGroup/companyGroupSlice'

interface CompanyGroupToolProps {
    setLoader: any
    onDataChange: () => void
}

const CompanyGroupTool: React.FC<CompanyGroupToolProps> = ({
    setLoader,
    onDataChange,
}) => {
    const dispatch = useDispatch<AppDispatch>()
    const [dialogIsOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [newCompanyGroup, setNewCompanyGroup] = useState({
        name: '',
    })

    const handleConfirm = async () => {
        if (!newCompanyGroup.name.trim()) {
            toast.push(
                <Notification title="Error" closable={true} type="danger">
                    Please enter a valid company group name
                </Notification>,
            )
            return
        }

        setIsLoading(true)
        try {
            await dispatch(createCompanyGroup(newCompanyGroup))

            onDialogClose()
            setLoader(true)
            toast.push(
                <Notification title="Success" type="success" closable={true}>
                    Company Group added successfully
                </Notification>,
            )
            onDataChange() // Trigger parent refresh
            console.log('re rendering')
        } catch (error) {
            toast.push(
                <Notification title="Failed" type="error" closable={true}>
                    Failed to add company group
                </Notification>,
            )
        }
        setIsLoading(false)
    }

    const onDialogClose = () => {
        setIsOpen(false)
        setNewCompanyGroup({ name: '' })
    }

    const handleInputChange = (
        field: keyof CompanyGroupData,
        value: string,
    ) => {
        setNewCompanyGroup((prev) => ({ ...prev, [field]: value }))
    }

    return (
        <div>
            <Button
                variant="solid"
                onClick={() => setIsOpen(true)}
                icon={<HiPlusCircle />}
                size="sm"
            >
                Add Company Group
            </Button>
            <Dialog
                isOpen={dialogIsOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
                width={500}
                height={250}
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
                    </div>
                    <div className="text-right mt-6">
                        <Button
                            className="mr-2"
                            variant="plain"
                            onClick={onDialogClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="solid"
                            onClick={handleConfirm}
                            loading={isLoading}
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default CompanyGroupTool
