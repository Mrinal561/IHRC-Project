import React, { useState, useEffect } from 'react'
import { Button, Input, Notification, Select, toast } from '@/components/ui'
import OutlinedSelect from '@/components/ui/Outlined'
import OutlinedInput from '@/components/ui/OutlinedInput'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import { ActionMeta, MultiValue } from 'react-select'
import { UsersRound } from 'lucide-react'
import DistrictAutosuggest from './DistrictAutoSuggest'
import LocationAutosuggest from '../../Branch/components/LocationAutosuggest'
import { createEsiSetup } from '@/store/slices/esiSetup/esiSetupSlice'
import { showErrorNotification } from '@/components/ui/ErrorMessage'
import * as yup from 'yup'
import OutlinedPasswordInput from '@/components/ui/OutlinedInput/OutlinedPasswordInput'
import { Loading } from '@/components/shared'

const esiSetupSchema = yup.object().shape({
    code_Type: yup.string().required('Code type is required'),
    code: yup
        .string()
        .required('ESI code is required')
        .matches(/^[A-Za-z0-9]+$/, 'Only letters, numbers, and hyphens.'),
    state_id: yup
        .number()
        .required('State is required')
        .positive('Please select a valid state'),
    district_id: yup
        .number()
        .required('District is required')
        .min(1, 'Please select a district'),
    location: yup
        .string()
        .required('Location is required')
        .min(2, 'Please Select a location'),
    email: yup
        .string()
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/,
            'Invalid email address.',
        )
        .required('Email is required'),
    mobile_number: yup
        .string()
        .required('Mobile number is required')
        .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
    certificate: yup.object().shape({
        data: yup.string().required('Certificate file is required'),
        filename: yup.string().required(),
        mimetype: yup.string().required()
    }).required('Certificate is required')
})

interface ValidationErrors {
    [key: string]: string
}

interface ESISetupPanelProps {
    onClose: () => void
    addESISetup: (data: any) => void
    refreshData: () => Promise<void>
    companyId: string
    groupId: string
    companyName: string
    groupName: string
}

interface SelectOption {
    value: string
    label: string
}

interface StateOption {
    id: number
    name: string
}

interface DistrictOption {
    id: number
    name: string
    state_id: number
}

interface LocationOption {
    id: number
    name: string
    district_id: number
}

interface CertificateData {
    data: string
    filename: string
    mimetype: string
}

interface FormData {
    group_id: number
    company_id: number
    code_Type: string
    code: string
    state_id?: number
    district_id: number
    location: string
    esi_user: string
    password: string
    certificate?: CertificateData
    email: string
    mobile_number: string
}

const ESISetupPanel = ({
    onClose,
    addESISetup,
    refreshData,
    companyId,
    companyName,
    groupId,
    groupName,
}: ESISetupPanelProps) => {
    const dispatch = useDispatch<AppDispatch>()
    const [errors, setErrors] = useState<ValidationErrors>({})
    const [isLoading, setIsLoading] = useState(false)
    const [companyGroups, setCompanyGroups] = useState<SelectOption[]>([])
    const [selectedCompanyGroup, setSelectedCompanyGroup] = useState<SelectOption | null>(null)
    const [companies, setCompanies] = useState<SelectOption[]>([])
    const [selectedCompany, setSelectedCompany] = useState<SelectOption | null>(null)
    const [states, setStates] = useState<StateOption[]>([])
    const [selectedStates, setSelectedStates] = useState<SelectOption | null>(null)
    const [districts, setDistricts] = useState<DistrictOption[]>([])
    const [selectedDistrict, setSelectedDistrict] = useState<{ id: number | null; name: string }>({
        id: null,
        name: '',
    })
    const [selectedDistrictId, setSelectedDistrictId] = useState<number | undefined>()
    const [locations, setLocations] = useState<LocationOption[]>([])
    const [selectedLocation, setSelectedLocation] = useState('')
    const [loading, setLoading] = useState(false)
    
    const [formData, setFormData] = useState<FormData>({
        group_id: Number(groupId),
        company_id: Number(companyId),
        code_Type: '',
        code: '',
        district_id: 0,
        location: '',
        esi_user: '',
        password: '',
        email: '',
        mobile_number: '',
    })

    const codeTypeOptions = [
        { value: 'main', label: 'Main' },
        { value: 'subcode', label: 'SubCode' },
    ]

    const showNotification = (
        type: 'success' | 'info' | 'error' | 'warning',
        message: string,
    ) => {
        toast.push(
            <Notification
                title={type.charAt(0).toUpperCase() + type.slice(1)}
                type={type}
                closable= {true}

            >
                {message}
            </Notification>,
        )
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file size (20MB max)
        if (file.size > 20 * 1024 * 1024) {
            showNotification('error', 'File size exceeds 20MB limit')
            return
        }

        // Validate file type
        const allowedTypes = [
            'application/pdf',
            'application/zip',
            'application/x-zip-compressed',
            'image/jpeg',
            'image/png',
            'image/gif'
        ]

        if (!allowedTypes.includes(file.type)) {
            showNotification('error', 'Only PDF, ZIP, JPEG, PNG, and GIF files are allowed')
            return
        }

        try {
            const base64String = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => {
                    const result = reader.result as string
                    resolve(result.split(',')[1])
                }
                reader.onerror = reject
                reader.readAsDataURL(file)
            })

            setFormData(prev => ({
                ...prev,
                certificate: {
                    data: base64String,
                    filename: file.name,
                    mimetype: file.type
                }
            }))
        } catch (error) {
            console.error('File upload error:', error)
            showNotification('error', 'Failed to process file')
        }
    }

    const loadStates = async () => {
        try {
            setIsLoading(true)
            const response = await httpClient.get(endpoints.common.state())

            if (response.data) {
                const formattedStates = response.data.map((state: any) => ({
                    label: state.name,
                    value: String(state.id),
                }))
                setStates(formattedStates)
            }
        } catch (error) {
            console.error('Failed to load states:', error)
            showNotification('error', 'Failed to load states')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadStates()
    }, [])

    const validateForm = async () => {
        try {
            await esiSetupSchema.validate(formData, { abortEarly: false })
            setErrors({})
            return true
        } catch (yupError) {
            if (yupError instanceof yup.ValidationError) {
                const newErrors: ValidationErrors = {}
                yupError.inner.forEach((error) => {
                    if (error.path) {
                        newErrors[error.path] = error.message
                    }
                })
                setErrors(newErrors)
            }
            return false
        }
    }

    const handleSubmit = async () => {
        try {
            setLoading(true)
            const isValid = await validateForm()
            if (!isValid) {
                showNotification('error', 'Please fix the validation errors')
                return
            }

            const data = {
                ...formData,
                code: formData.code.toUpperCase(), // Ensure code is uppercase as per backend
                company_id: Number(companyId),
                group_id: Number(groupId),
            }

            const response = await dispatch(createEsiSetup(data)).unwrap()
            
            if (response) {
                addESISetup(response.data)
                onClose()
                showNotification('success', 'ESI Setup created successfully')
                if (refreshData) {
                    await refreshData()
                }
            }
        } catch (error: any) {
           throw error
        } finally {
            setLoading(false)
        }
    }

    const validateField = async (fieldName: string, value: any) => {
        try {
            const fieldToValidate = { [fieldName]: value }
            const fieldSchema = yup.reach(esiSetupSchema, fieldName)
            await fieldSchema.validate(value)
            setErrors(prev => ({
                ...prev,
                [fieldName]: undefined,
            }))
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                setErrors(prev => ({
                    ...prev,
                    [fieldName]: error.message,
                }))
            }
        }
    }

    const handleStateChange = (option: SelectOption | null) => {
        setSelectedStates(option)
        setSelectedDistrict({ id: null, name: '' })
        setSelectedLocation('')
        setDistricts([])
        setLocations([])

        const stateId = option ? parseInt(option.value) : 0

        setFormData(prev => ({
            ...prev,
            state_id: stateId,
            district_id: 0,
            location: '',
        }))

        validateField('state_id', stateId)
    }

    const handleCodeTypeChange = (option: SelectOption | null) => {
        const newValue = option?.value || ''
        setFormData(prev => ({
            ...prev,
            code_Type: newValue,
        }))
        validateField('code_Type', newValue)
    }

    const handleCodeChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            code: value,
        }))
        validateField('code', value)
    }

    const handleESIUserChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            esi_user: value,
        }))
        validateField('esi_user', value)
    }

    const handlePasswordChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            password: value,
        }))
        validateField('password', value)
    }

    const handleEmailChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            email: value,
        }))
        validateField('email', value)
    }

    const handleMobileChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            mobile_number: value,
        }))
        validateField('mobile_number', value)
    }

    const handleDistrictChange = (district: { id: number | null; name: string }) => {
        setSelectedDistrict(district)
        const districtId = district.id || 0
        setSelectedDistrictId(districtId)
        setFormData(prev => ({
            ...prev,
            district_id: districtId,
        }))
        validateField('district_id', districtId)
    }

    const handleLocationChange = (location: string) => {
        setSelectedLocation(location)
        setFormData(prev => ({
            ...prev,
            location: location,
        }))
        validateField('location', location)
    }

    return (
        <div className="p-4">
            <div className="grid grid-cols-4 gap-4 mb-3">
                {/* First Row with 4 columns */}
                <div className="space-y-2">
                    <p className="text-sm font-medium">Company Group</p>
                    <OutlinedInput
                        label="Company Group"
                        value={groupName}
                        disabled
                    />
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-medium">Company</p>
                    <OutlinedInput
                        label="Company"
                        value={companyName}
                        disabled
                    />
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-medium">
                        Code Type <span className="text-red-500">*</span>
                    </p>
                    <OutlinedSelect
                        label="Select Code Type"
                        options={codeTypeOptions}
                        value={codeTypeOptions.find(
                            (option) => option.value === formData.code_Type,
                        )}
                        onChange={handleCodeTypeChange}
                    />
                    <div style={{ height: '10px' }}>
                        {errors.code_Type && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.code_Type}
                            </p>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-medium">
                        ESI Code <span className="text-red-500">*</span>
                    </p>
                    <OutlinedInput
                        label="Enter ESI Code"
                        value={formData.code}
                        onChange={handleCodeChange}
                    />
                    <div style={{ height: '10px' }}>
                        {errors.code && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.code}
                            </p>
                        )}
                    </div>
                </div>

                {/* Second Row with 4 columns */}
                <div className="space-y-2">
                    <p className="text-sm font-medium">
                        State <span className="text-red-500">*</span>
                    </p>
                    <OutlinedSelect
                        label="Select State"
                        options={states}
                        value={selectedStates}
                        onChange={handleStateChange}
                    />
                    <div style={{ height: '10px' }}>
                        {errors.state_id && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.state_id}
                            </p>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                    <DistrictAutosuggest
                        value={selectedDistrict}
                        onChange={handleDistrictChange}
                        stateId={
                            selectedStates?.value
                                ? parseInt(selectedStates.value)
                                : undefined
                        }
                        onDistrictSelect={(id) => setSelectedDistrictId(id)}
                    />
                    <div style={{ height: '10px' }}>
                        {errors.district_id && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.district_id}
                            </p>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                    <LocationAutosuggest
                        value={selectedLocation}
                        onChange={handleLocationChange}
                        districtId={selectedDistrictId}
                    />
                    <div style={{ height: '10px' }}>
                        {errors.location && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.location}
                            </p>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-medium">
                        ESI User 
                    </p>
                    <OutlinedInput
                        label="Enter ESI User"
                        value={formData.esi_user}
                        onChange={handleESIUserChange}
                    />
                    <div style={{ height: '10px' }}>
                        {errors.esi_user && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.esi_user}
                            </p>
                        )}
                    </div>
                </div>

                {/* Third Row with Password, Email and Mobile */}
                <div className="grid grid-cols-3 col-span-4 gap-4">
                    <div className="space-y-2">
                        <p className="text-sm font-medium">
                            Password 
                        </p>
                        <OutlinedPasswordInput
                            label="Enter Password"
                            value={formData.password}
                            onChange={handlePasswordChange}
                        />
                        <div style={{ height: '10px' }}>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium">
                            Email ID <span className="text-red-500">*</span>
                        </p>
                        <OutlinedInput
                            label="Enter Email ID"
                            value={formData.email}
                            onChange={handleEmailChange}
                        />
                        <div style={{ height: '10px' }}>
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium">
                            Mobile <span className="text-red-500">*</span>
                        </p>
                        <OutlinedInput
                            label="Enter Mobile"
                            value={formData.mobile_number}
                            onChange={handleMobileChange}
                        />
                        <div style={{ height: '10px' }}>
                            {errors.mobile_number && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.mobile_number}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Fourth Row with Certificate Upload */}
                <div className="col-span-4 space-y-2">
                    <p className="text-sm font-medium">
                        Upload Certificate (PDF/Zip/Image, Max 20MB)
                        <span className="text-red-500">*</span>
                    </p>
                    <Input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.zip,.jpg,.jpeg,.png,.gif,application/pdf,application/zip,image/jpeg,image/png,image/gif"
                    />
                  
                    <div style={{ height: '10px' }}>
                        {errors.certificate && (
                            <p className="text-red-500 text-xs mt-1">
                                {typeof errors.certificate === 'string' 
                                    ? errors.certificate 
                                    : 'Certificate is required'}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
                <Button size="sm" variant="plain" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    size="sm"
                    variant="solid"
                    onClick={handleSubmit}
                    loading={loading}
                >
                    Confirm
                </Button>
            </div>
        </div>
    )
}

export default ESISetupPanel