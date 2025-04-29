import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import OutlinedSelect from '@/components/ui/Outlined'
import OutlinedInput from '@/components/ui/OutlinedInput'
import DatePicker from '@/components/ui/DatePicker/DatePicker'
import { Dialog } from '@/components/ui/dialog'
import { Select } from '@/components/ui'
import { toast, Notification } from '@/components/ui'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import DistrictAutosuggest from '../../ESICSetup/components/DistrictAutoSuggest'
import LocationAutosuggest from '../../Branch/components/LocationAutosuggest'
import * as yup from 'yup'
import OutlinedPasswordInput from '@/components/ui/OutlinedInput/OutlinedPasswordInput'
import { createLwfSetup } from '@/store/slices/lwfSetup/lwfTrackerSlice'

const validationSchema = yup.object().shape({
    state_id: yup
        .number()
        .required('State is required')
        .positive('Please select a valid state'),
    district_id: yup
        .number()
        .required('District is required')
        .positive('Please select a valid district'),
    location: yup.string().required('Location is required'),
    register_number: yup
        .string()
        .required('Registration number is required')
        .matches(/^[A-Za-z0-9-]+$/, 'Only letters, numbers, and hyphens.'),
    register_date: yup
        .date()
        .required('Registration date is required')
        .max(new Date(), 'Date cannot be future.'),
    remmit_mode: yup
        .string()
        .required('Remittance mode is required')
        .oneOf(['online', 'offline'], 'Invalid remittance mode'),
    mobile_number: yup
        .string()
        .required('Mobile number is required')
        .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
    email: yup
        .string()
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/,
            'Invalid email address.',
        )
        .required('Email is required'),
    certificate: yup
        .object()
        .shape({
            data: yup.string().required('File data is required'),
            filename: yup.string().required('Filename is required'),
            mimetype: yup.string().required('Mimetype is required')
        })
        .required('Certificate is required')
})

interface ValidationErrors {
    [key: string]: string
}

interface LWFSetupPanelProps {
    onClose: () => void
    addLWFSetup: (data: any) => void
    companyId: string
    groupId: string
    companyName: string
    groupName: string
}

interface SelectOption {
    value: string
    label: string
}

interface DistrictValue {
    id: number | null
    name: string
}

interface StateOption extends SelectOption {}
interface DistrictOption extends SelectOption {}
interface LocationOption extends SelectOption {}

const LWFSetupPanel: React.FC<LWFSetupPanelProps> = ({
    onClose,
    addLWFSetup,
    companyId,
    companyName,
    groupId,
    groupName,
}) => {
    const dispatch = useDispatch<AppDispatch>()
    const [errors, setErrors] = useState<ValidationErrors>({})
    const [isLoading, setIsLoading] = useState(false)
    const [states, setStates] = useState<StateOption[]>([])
    const [selectedStates, setSelectedStates] = useState<SelectOption | null>(
        null,
    )
    const [selectedDistrict, setSelectedDistrict] = useState<DistrictValue>({
        id: null,
        name: '',
    })
    const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(
        null,
    )
    const [selectedLocation, setSelectedLocation] = useState('')
    const [fileBase64, setFileBase64] = useState<string>('')

    const [formData, setFormData] = useState<{
        group_id: number
        company_id: number
        state_id: number
        district_id: number
        location: string
        register_number: string
        register_date: Date | null
        remmit_mode: string
        username: string
        password: string
        mobile_number: string
        email: string
        certificate: string
    }>({
        group_id: 0,
        company_id: 0,
        state_id: 0,
        district_id: 0,
        location: '',
        register_number: '',
        register_date: null,
        remmit_mode: '',
        username: '',
        password: '',
        mobile_number: '',
        email: '',
        certificate: '',
    })

    const remittanceModeOptions = [
        { value: 'online', label: 'Online' },
        { value: 'offline', label: 'Offline' },
    ]

    const showNotification = (
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

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
                resolve(reader.result as string)
            }
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
    
        // Check file size (20MB limit)
        if (file.size > 20 * 1024 * 1024) {
            showNotification('danger', 'File size exceeds 20MB limit')
            return
        }
    
        // Check allowed file types
        const allowedTypes = [
            'application/pdf',
            'application/zip',
            'application/x-zip-compressed',
            'image/jpeg',
            'image/png',
            'image/gif'
        ]
        
        if (!allowedTypes.includes(file.type)) {
            showNotification('danger', 'Only PDF, ZIP, JPG, PNG, GIF files are allowed')
            return
        }
    
        try {
            const base64Data = await convertToBase64(file)
            const certificateData = {
                data: base64Data.split(',')[1], // Extract just the base64 part
                filename: file.name,
                mimetype: file.type
            }
            
            setFormData(prev => ({
                ...prev,
                certificate: certificateData
            }))
            validateField('certificate', certificateData)
        } catch (error) {
            console.error('Error processing file:', error)
            showNotification('danger', 'Failed to process file')
        }
    }
    // Load States
    const loadStates = async () => {
        try {
            const response = await httpClient.get(endpoints.common.state())

            if (response.data) {
                const formattedStates = response.data
                    .filter((state: any) => state.lwf_active)
                    .map((state: any) => ({
                        label: state.name,
                        value: String(state.id),
                        lwf_active: state.lwf_active,
                    }))
                setStates(formattedStates)
            }
        } catch (error) {
            console.error('Failed to load states:', error)
            showNotification('danger', 'Failed to load states')
        }
    }

    useEffect(() => {
        loadStates()
    }, [])

    const validateForm = async () => {
        try {
            await validationSchema.validate(formData, { abortEarly: false })
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
            setIsLoading(true)
            const isValid = await validateForm()
            if (!isValid) {
                showNotification('danger', 'Please fix the validation errors')
                return
            }
    
            // Prepare the data with certificate if it exists
            const submitData = {
                ...formData,
                company_id: parseInt(companyId),
                group_id: parseInt(groupId),
                register_date: formData.register_date?.toISOString() || '',
                // Include certificate only if it exists and is in the correct format
                certificate: formData.certificate && typeof formData.certificate === 'object' 
                    ? formData.certificate 
                    : undefined
            }
    
            const response = await httpClient.post(
                endpoints.lwfSetup.create(),
                submitData
            )
    
            if (response.data) {
                addLWFSetup(response.data)
                onClose()
                showNotification('success', 'LWF Setup created successfully')
            }
        } catch (error: any) {
           throw error
        } finally {
            setIsLoading(false)
        }
    }

    const validateField = async (fieldName: string, value: any) => {
        try {
            await validationSchema.validateAt(fieldName, {
                ...formData,
                [fieldName]: value,
            })
            setErrors((prev) => ({ ...prev, [fieldName]: undefined }))
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                setErrors((prev) => ({ ...prev, [fieldName]: error.message }))
            }
        }
    }

    // Field change handlers
    const handleStateChange = (option: SelectOption | null) => {
        setSelectedStates(option)
        setSelectedDistrict({ id: null, name: '' })
        setSelectedLocation('')
        const stateId = option ? parseInt(option.value) : 0
        setFormData((prev) => ({
            ...prev,
            state_id: stateId,
        }))
        validateField('state_id', stateId)
    }

    const handleDistrictChange = (district: DistrictValue) => {
        setSelectedDistrict(district)
        const districtId = district.id || 0
        setFormData((prev) => ({
            ...prev,
            district_id: districtId,
        }))
        validateField('district_id', districtId)
        setSelectedDistrictId(districtId)
    }

    const handleLocationChange = (value: string) => {
        setSelectedLocation(value)
        setFormData((prev) => ({
            ...prev,
            location: value,
        }))
        validateField('location', value)
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
        validateField(field, value)
    }

   

    return (
        <div className="p-2">
            <div className="grid grid-cols-4 gap-4 mb-4">
                {/* First Row */}
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

                {/* Second Row */}
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
                        Registration Number{' '}
                        <span className="text-red-500">*</span>
                    </p>
                    <OutlinedInput
                        label="Enter Registration No."
                        value={formData.register_number}
                        onChange={(value) =>
                            handleInputChange('register_number', value)
                        }
                    />
                    <div style={{ height: '10px' }}>
                        {errors.register_number && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.register_number}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-medium">
                        LWF Registration Date{' '}
                        <span className="text-red-500">*</span>
                    </p>
                    <DatePicker
                        size="sm"
                        placeholder="Select Registration Date"
                        value={formData.register_date}
                        onChange={(date) => {
                            setFormData((prev) => ({
                                ...prev,
                                register_date: date,
                            }))
                            validateField('register_date', date)
                        }}
                        inputFormat="DD-MM-YYYY"
                        yearLabelFormat="YYYY"
                        monthLabelFormat="MMMM YYYY"
                    />
                    <div style={{ height: '10px' }}>
                        {errors.register_date && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.register_date}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-medium">
                        Remittance Mode <span className="text-red-500">*</span>
                    </p>
                    <OutlinedSelect
                        label="Select Mode"
                        options={remittanceModeOptions}
                        value={remittanceModeOptions.find(
                            (option) => option.value === formData.remmit_mode,
                        )}
                        onChange={(option) => {
                            const value = option?.value || ''
                            handleInputChange('remmit_mode', value)
                        }}
                    />
                    <div style={{ height: '10px' }}>
                        {errors.remmit_mode && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.remmit_mode}
                            </p>
                        )}
                    </div>
                </div>

                {/* Third Row - New Fields */}
                <div className="space-y-2">
                    <p className="text-sm font-medium">
                        Mobile<span className="text-red-500">*</span>
                    </p>
                    <OutlinedInput
                        label="Enter Mobile"
                        value={formData.mobile_number}
                        onChange={(value) =>
                            handleInputChange('mobile_number', value)
                        }
                    />
                    <div style={{ height: '10px' }}>
                        {errors.mobile_number && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.mobile_number}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-medium">
                        Email ID<span className="text-red-500">*</span>
                    </p>
                    <OutlinedInput
                        label="Enter Email ID"
                        value={formData.email}
                        onChange={(value) => handleInputChange('email', value)}
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
                    <p className="text-sm font-medium">LWF User</p>
                    <OutlinedInput
                        label="Enter LWF User"
                        value={formData.username}
                        onChange={(value) =>
                            handleInputChange('username', value)
                        }
                    />
                    <div style={{ height: '10px' }}>
                        {errors.username && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.username}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-medium">Password</p>
                    <OutlinedPasswordInput
                        label="Enter Password"
                        value={formData.password}
                        onChange={(value) =>
                            handleInputChange('password', value)
                        }
                    />
                    <div style={{ height: '10px' }}>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>
                </div>

                {/* Upload Document */}
                <div className="col-span-4 space-y-1">
                    <p className="text-sm font-medium">
                        Certificate Upload (PDF/Zip/Image, Max 20MB){' '}
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
                                {errors.certificate}
                            </p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="col-span-4 flex justify-end space-x-2 mt-4">
                    <Button variant="plain" size="sm" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        size="sm"
                        onClick={handleSubmit}
                        loading={isLoading}
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default LWFSetupPanel
