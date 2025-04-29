import React, { useEffect, useState } from 'react'
import {
    Button,
    Dialog,
    DatePicker,
    toast,
    Notification,
    Input,
    Tooltip,
} from '@/components/ui'
import OutlinedInput from '@/components/ui/OutlinedInput'
import OutlinedSelect from '@/components/ui/Outlined'
import OutlinedPasswordInput from '@/components/ui/OutlinedInput/OutlinedPasswordInput'
import { useDispatch } from 'react-redux'
import { showErrorNotification } from '@/components/ui/ErrorMessage'
import {
    fetchLwfById,
    updateLwf,
} from '@/store/slices/lwfSetup/lwfTrackerSlice'
import * as yup from 'yup'
import { Eye } from 'lucide-react'

interface ValidationErrors {
    register_number?: string
    username?: string
    password?: string
    register_date?: Date
    remmit_mode?: string
    mobile_number?: string
    email?: string
}

interface Company {
    id: number
    name: string
}

interface CompanyGroup {
    id: number
    name: string
}

interface LWFSetupData {
    register_number: string
    username: string
    password: string
    register_date: string
    remmit_mode: string
    Company?: Company
    CompanyGroup?: CompanyGroup
    certificate?: string
    signatory_id?: number
    email?: string
    mobile_number?: string
}

const lwfSchema = yup.object().shape({
    register_number: yup
        .string()
        .required('Registration number is required')
        .matches(
            /^[A-Za-z0-9-]+$/,
            'Registration number can only contain letters, numbers, and hyphens',
        ),
    // username: yup
    //   .string()
    //   .required('User is required')
    //   .min(3, 'Username must be at least 3 characters'),
    // password: yup
    //   .string()
    //   .required('Password is required')
    //   .min(8, 'Password must be at least 8 characters')
    //   .matches(
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    //     'Must include A-Z, a-z, 0-9, @$!%*?& (Weak Password)'
    //   ),
    register_date: yup
        .date()
        .required('Registration date is required')
        .max(new Date(), 'Registration date cannot be in the future'),
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
})

interface LWFEditedDataProps {
    id: number
    initialData?: LWFSetupData | null
    onClose: () => void
    onSubmit: (data: LWFSetupData) => void
    onRefresh: () => void
}

const LWFEditedData: React.FC<LWFEditedDataProps> = ({
    id,
    initialData,
    onClose,
    onSubmit,
    onRefresh,
}) => {
    const [formData, setFormData] = useState<LWFSetupData>({
        register_number: '',
        username: '',
        password: '',
        register_date: '',
        remmit_mode: '',
        // certificate: '',
        signatory_id: 0,
        email: '',
        mobile_number: '',
    })

    const [errors, setErrors] = useState<ValidationErrors>({})
    const [loading, setLoading] = useState(true)
    const [loader, setLoader] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const dispatch = useDispatch()

    const remittanceModeOptions = [
        { value: 'online', label: 'Online' },
        { value: 'offline', label: 'Offline' },
    ]

    const handleDocumentView = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (formData.certificate) {
            const fullPath = `${import.meta.env.VITE_API_GATEWAY}/${formData.certificate}`
            window.open(fullPath, '_blank')
        }
    }
    const handleLeaseDocumentView = (
        e: React.MouseEvent<HTMLButtonElement>,
    ) => {
        e.preventDefault()
        if (formData.certificate) {
            const fullPath = `${import.meta.env.VITE_API_GATEWAY}/${formData.certificate}`
            window.open(fullPath, '_blank')
        }
    }

    useEffect(() => {
        if (id) {
            fetchLWFData()
        } else if (initialData) {
            setFormData(initialData)
            setLoading(false)
        }
    }, [id, initialData])

    const fetchLWFData = async () => {
        try {
            setLoading(true)
            const response = await dispatch(fetchLwfById(id))
                .unwrap()
                .catch((error: any) => {
                    throw error
                })
            setFormData(response)
            setLoading(false)
        } catch (err) {
            console.error('Error fetching LWF data:', err)
            setError('Failed to load LWF details')
            setLoading(false)
            openNotification('error', 'Failed to load LWF details')
        }
    }

    const validateForm = async () => {
        try {
            await lwfSchema.validate(
                {
                    email: formData.email,
                    mobile_number: formData.mobile_number,
                    username: formData.username,
                    register_number: formData.register_number,
                    password: formData.password,
                    register_date: formData.register_date
                        ? new Date(formData.register_date)
                        : undefined,
                    remmit_mode: formData.remmit_mode,
                },
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

    const openNotification = (
        type: 'success' | 'info' | 'error' | 'warning',
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
   // Update the convertToBase64 function
const convertToBase64 = (file: File): Promise<{ data: string; filename: string; mimetype: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            const result = reader.result as string;
            resolve({
                data: result.split(',')[1], // Extract just the base64 part
                filename: file.name,
                mimetype: file.type
            });
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

// Update the handleFileChange function
const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (20MB limit)
    if (file.size > 20 * 1024 * 1024) {
        openNotification('error', 'File size exceeds 20MB limit')
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
        openNotification('error', 'Only PDF, ZIP, JPG, PNG, GIF files are allowed')
        return
    }

    try {
        const certificateData = await convertToBase64(file)
        setFormData(prev => ({
            ...prev,
            certificate: certificateData
        }))
        openNotification('success', 'File uploaded successfully')
    } catch (error) {
        console.error('Error processing file:', error)
        openNotification('error', 'Failed to process file')
    }
}

// Update the handleSubmit function
const handleSubmit = async () => {
    try {
        setLoader(true)
        const isValid = await validateForm()
        if (!isValid) return

        // Prepare the data with certificate if it exists
        const updateData = {
            register_number: formData.register_number,
            username: formData.username,
            password: formData.password,
            register_date: formData.register_date || '',
            remmit_mode: formData.remmit_mode,
            signatory_id: formData.signatory_id,
            email: formData.email,
            mobile_number: formData.mobile_number,
            // Only include certificate if it's a new upload
            certificate: formData.certificate && typeof formData.certificate === 'object' 
                ? formData.certificate 
                : undefined
        }

        const resultAction = await dispatch(
            updateLwf({
                id: id,
                data: updateData,
            }),
        ).unwrap() // Use unwrap() to properly handle the Promise

        if (resultAction) {
            onClose()
            onRefresh?.()
            openNotification('success', 'LWF Setup updated successfully')
        }
    } catch (error: any) {
       throw error
    } finally {
        setLoader(false)
    }
}
    const validateField = async (field: keyof LWFSetupData, value: any) => {
        try {
            // Create a schema for just this field
            const fieldSchema = yup.reach(lwfSchema, field)
            await fieldSchema.validate(value)

            // Clear error for this field if validation passes
            setErrors((prev) => ({
                ...prev,
                [field]: undefined,
            }))
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                // Set error for just this field
                setErrors((prev) => ({
                    ...prev,
                    [field]: err.message,
                }))
            }
        }
    }

    // Modified handleChange function with real-time validation
    const handleChange = (field: keyof LWFSetupData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))

        // Special handling for register_date since it needs to be converted to Date
        if (field === 'register_date') {
            validateField(field, value ? new Date(value) : undefined)
        } else {
            validateField(field, value)
        }
    }

    // Modified handleSubmit to still do a final validation
    

    // For the Select component, we need to modify its onChange handler
    const handleRemitModeChange = (
        option: { value: string; label: string } | null,
    ) => {
        const value = option ? option.value : ''
        handleChange('remmit_mode', value)
    }

    if (error) {
        return (
            <Dialog
                isOpen={true}
                onClose={onClose}
                onRequestClose={onClose}
                width={800}
                height={600}
                shouldCloseOnOverlayClick={false}
            >
                <div className="flex justify-center items-center h-full">
                    <p className="text-red-500">{error}</p>
                </div>
            </Dialog>
        )
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="p-4 space-y-2">
            {/* Company and Group Information */}
            <div className="grid grid-cols-3 gap-4">
                <div className="h-[70px]">
                    <p className="text-sm font-medium mb-2">Company Group</p>
                    <OutlinedInput
                        label="Company Group"
                        value={formData.CompanyGroup?.name || ''}
                        disabled
                    />
                </div>
                <div className="h-[70px]">
                    <p className="text-sm font-medium mb-2">Company</p>
                    <OutlinedInput
                        label="Company"
                        value={formData.Company?.name || ''}
                        disabled
                    />
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <label>
                        LWF Registration Number
                        <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full">
                        <OutlinedInput
                            label="Enter LWF Registration Number"
                            value={formData.register_number}
                            onChange={(value) =>
                                handleChange('register_number', value)
                            }
                        />
                        <div className="h-5">
                            {errors.register_number && (
                                <div className="text-red-500 text-sm">
                                    {errors.register_number}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Registration Number and User ID */}
            <div className="flex gap-4 items-center">
                <div className="flex flex-col gap-2 w-full">
                    <label>LWF User</label>
                    <div className="w-full">
                        <OutlinedInput
                            label="Enter LWF User"
                            value={formData.username}
                            onChange={(value) =>
                                handleChange('username', value)
                            }
                        />
                        <div className="h-5">
                            {errors.username && (
                                <div className="text-red-500 text-sm">
                                    {errors.username}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <label>Password</label>
                    <div className="w-full">
                        <OutlinedPasswordInput
                            label="Enter Password"
                            value={formData.password}
                            onChange={(value) =>
                                handleChange('password', value)
                            }
                        />
                        <div className="h-5">
                            {errors.password && (
                                <div className="text-red-500 text-sm">
                                    {errors.password}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <label>
                        LWF Registration Date
                        <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full">
                        <DatePicker
                            size="sm"
                            placeholder="Select date"
                            value={
                                formData.register_date
                                    ? new Date(formData.register_date)
                                    : null
                            }
                            onChange={(date) =>
                                handleChange(
                                    'register_date',
                                    date?.toISOString() || '',
                                )
                            }
                        />
                        <div className="h-5">
                            {errors.register_date && (
                                <div className="text-red-500 text-sm">
                                    {errors.register_date}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Password and Registration Date */}
            <div className="flex gap-4 items-center">
                <div className="flex flex-col gap-2 w-full">
                    <label>Mobile</label>
                    <div className="w-full">
                        <OutlinedInput
                            label="Enter Mobile"
                            value={formData.mobile_number}
                            onChange={(value) =>
                                handleChange('mobile_number', value)
                            }
                        />
                        <div className="h-5">
                            {errors.mobile_number && (
                                <div className="text-red-500 text-sm">
                                    {errors.mobile_number}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <label>Email ID</label>
                    <div className="w-full">
                        <OutlinedInput
                            label="Enter Email ID"
                            value={formData.email}
                            onChange={(value) => handleChange('email', value)}
                        />
                        <div className="h-5">
                            {errors.email && (
                                <div className="text-red-500 text-sm">
                                    {errors.email}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Remittance Mode */}
            <div className="grid grid-cols-2 gap-4">
                {/* Remit Mode Section */}
                <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Remit Mode <span className="text-red-500">*</span>
                    </label>
                    <div>
                        <OutlinedSelect
                            label="Select Mode"
                            options={remittanceModeOptions}
                            value={
                                formData.remmit_mode
                                    ? {
                                          value: formData.remmit_mode,
                                          label:
                                              formData.remmit_mode
                                                  .charAt(0)
                                                  .toUpperCase() +
                                              formData.remmit_mode.slice(1),
                                      }
                                    : null
                            }
                            onChange={handleRemitModeChange}
                        />
                        <div className="h-5">
                            {errors.remmit_mode && (
                                <div className="text-red-500 text-sm">
                                    {errors.remmit_mode}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Certificate Upload (PDF/Zip/Image, Max 20MB){' '}
                        <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                        <Input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full"
                             accept=".pdf,.zip,.jpg,.jpeg,.png,.gif,application/pdf,application/zip,image/jpeg,image/png,image/gif"
                        />
                        {formData.certificate && (
                            <Tooltip title = "View Document">
                                                           <Button
                                                           className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0"
                                                               onClick={handleDocumentView}
                                                               >
                                                               <Eye size={20} />
                                                           </Button>
                                                               </Tooltip>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-6 text-right flex gap-2 justify-end items-center">
                <Button
                    variant="plain"
                    onClick={onClose}
                    className="mr-2"
                    size="sm"
                >
                    Cancel
                </Button>
                <Button
                    variant="solid"
                    onClick={handleSubmit}
                    loading={loader}
                    size="sm"
                >
                    Confirm
                </Button>
            </div>
        </div>
    )
}

export default LWFEditedData
