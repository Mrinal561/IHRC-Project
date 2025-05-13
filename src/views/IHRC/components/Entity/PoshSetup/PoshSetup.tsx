import React, { useEffect, useState } from 'react'
import { Button, toast, Notification } from '@/components/ui'
import { FormItem, FormContainer } from '@/components/ui/Form'
import OutlinedSelect from '@/components/ui/Outlined/Outlined'
import { showErrorNotification } from '@/components/ui/ErrorMessage'
import * as yup from 'yup'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import { useLocation, useNavigate } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi'

interface SelectOption {
    value: string
    label: string
}

interface LocationState {
    companyId?: string
    companyName?: string
}

interface ValidationErrors {
    return_level?: string
}

const returnLevelOptions = [
    { value: 'district', label: 'District Level' },
    { value: 'branch', label: 'Branch Level' }
]

const createPoshValidationSchema = () => {
    return yup.object().shape({
        return_level: yup
            .string()
            .required('Return level is required')
            .oneOf(['district', 'branch'], 'Invalid return level selected'),
    })
}

const PoshSetup = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const locationState = location.state as LocationState
    const companyId = locationState?.companyId
    const companyName = locationState?.companyName
    
    const [isEditMode, setIsEditMode] = useState(false)
    const [selectedReturnLevel, setSelectedReturnLevel] = useState<SelectOption | null>(null)
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
    const [isLoading, setIsLoading] = useState(true)
    const [configId, setConfigId] = useState<number | null>(null)
    const [hasExistingConfig, setHasExistingConfig] = useState(false)

    useEffect(() => {
        if (companyId) {
            fetchPoshConfig()
        }
    }, [companyId])

    const fetchPoshConfig = async () => {
        try {
            setIsLoading(true)
            const response = await httpClient.get(endpoints.poshSetup.detailbyCompany(companyId))
            const configData = response.data.data
    
            if (configData) {
                setConfigId(configData.id)
                setHasExistingConfig(true)
                const option = returnLevelOptions.find(opt => opt.value === configData.return_level)
                setSelectedReturnLevel(option || null)
            }
        } catch (error: any) {
            if (error.response?.status === 404) {
                // Treat 404 as "no config exists" case
                setHasExistingConfig(false)
                setSelectedReturnLevel(null)
            } else {
                showErrorNotification('Failed to fetch POSH configuration')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const validateForm = async () => {
        try {
            const validationSchema = createPoshValidationSchema()
            await validationSchema.validate(
                {
                    return_level: selectedReturnLevel?.value || null,
                },
                { abortEarly: false },
            )
            setValidationErrors({})
            return true
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const newErrors: ValidationErrors = {}
                error.inner.forEach((err) => {
                    if (err.path) {
                        newErrors[err.path as keyof ValidationErrors] = err.message
                    }
                })
                setValidationErrors(newErrors)
            }
            return false
        }
    }

    const handleCreateOrUpdate = async () => {
        const isValid = await validateForm()
        if (!isValid || !selectedReturnLevel || !companyId) return

        try {
            await httpClient.post(endpoints.poshSetup.createUpdate(), {
                return_level: selectedReturnLevel.value,
                company_id: Number(companyId)
            })
            
            toast.push(
                <Notification title="Success" type="success">
                    {hasExistingConfig 
                        ? 'POSH configuration updated successfully' 
                        : 'New POSH configuration created successfully'}
                </Notification>
            )
            
            fetchPoshConfig() // Refresh the data
        } catch (error: any) {
            showErrorNotification(
                error.response?.data?.message || 'An error occurred'
            )
        }
    }

    const handleEdit = () => setIsEditMode(true)

    const handleCancel = () => {
        setIsEditMode(false)
        fetchPoshConfig()
    }

    const handleSubmit = async () => {
        const isValid = await validateForm()

        if (!isValid || !selectedReturnLevel || !companyId) return

        const poshConfigData = {
            return_level: selectedReturnLevel.value,
            company_id: Number(companyId)
        }

        try {
            const response = await httpClient.post(endpoints.poshSetup.createUpdate(), poshConfigData)
            
            toast.push(
                <Notification title="Success" type="success">
                    {hasExistingConfig ? 'POSH configuration updated successfully' : 'New POSH configuration created successfully'}
                </Notification>,
            )
            
            if (!configId && response.data.data?.id) {
                setConfigId(response.data.data.id)
            }
            
            setHasExistingConfig(true)
            setIsEditMode(false)
            fetchPoshConfig()
        } catch (error: any) {
            showErrorNotification(
                error.response?.data?.message || 'An error occurred while saving the configuration',
            )
        }
    }

    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded w-1/4 mt-8"></div>
                    </div>
                </div>
            </div>
        )
    }

    const handleBack = () => {
        navigate(-1)
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-6">
                  <div className="flex items-center">
                                    {/* <div className="flex gap-3"> */}
                
                                    <Button
                                        variant="plain"
                                        size="sm"
                                        icon={<HiArrowLeft />}
                                        onClick={handleBack}
                                        className="mr-2"
                                        ></Button>
                <h3 className="text-2xl font-bold">POSH Setup - {companyName}</h3>
                </div>
                <p className="text-gray-500 mt-1">Configure the return level for POSH compliance</p>
                
                {!hasExistingConfig && !isEditMode && (
                    <div className="bg-blue-50 p-4 rounded-md mt-4">
                        <p className="text-blue-800">No POSH configuration exists for this company yet.</p>
                        <p className="text-blue-800 mt-1">Click "Create" to set up the return level.</p>
                    </div>
                )}
            </div>
            
            <FormContainer>
                <div className="grid grid-cols-1 gap-6">
                    <FormItem
                        invalid={!!validationErrors.return_level}
                        errorMessage={validationErrors.return_level}
                    >
                        <label className="text-gray-600 mb-2 block">
                            Return Level <span className="text-red-500">*</span>
                        </label>
                        <OutlinedSelect
                            label="Select Return Level"
                            options={returnLevelOptions}
                            value={selectedReturnLevel}
                            onChange={setSelectedReturnLevel}
                            disabled={!isEditMode}
                        />
                    </FormItem>
                </div>

                <div className="flex justify-end gap-2 mt-8">
                <Button 
                    variant="solid" 
                    onClick={handleCreateOrUpdate}
                    loading={isLoading}
                >
                    {hasExistingConfig ? 'Edit' : 'Create'}
                </Button>
            </div>
            </FormContainer>
        </div>
    )
}

export default PoshSetup