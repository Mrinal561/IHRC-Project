import React, { useEffect, useState } from 'react'
import { Button, Dialog, Input, Notification, toast, Tooltip } from '@/components/ui'
import OutlinedInput from '@/components/ui/OutlinedInput'
import OutlinedSelect from '@/components/ui/Outlined'
import OutlinedPasswordInput from '@/components/ui/OutlinedInput/OutlinedPasswordInput'
import { useDispatch } from 'react-redux'
import { showErrorNotification } from '@/components/ui/ErrorMessage'
import {
    fetchEsiSetupById,
    updateEsiSetup,
} from '@/store/slices/esiSetup/esiSetupSlice'
import * as yup from 'yup'
import { Eye } from 'lucide-react'

interface CertificateData {
    data: string
    filename: string
    mimetype: string
}

interface ESISetupData {
    id: number
    group_id: number
    company_id: number
    code_Type: string
    code: string
    esi_user: string
    password: string
    certificate?: string | CertificateData
    email: string
    mobile_number: string
    CompanyGroup?: {
        id: number
        name: string
    }
    Company?: {
        id: number
        name: string
    }
    Location?: {
        name?: string
        id?: number
        District?: {
            id?: number
            name?: string
            State?: {
                id?: number
                name?: string
            }
        }
    }
}

interface ValidationErrors {
    code_Type?: string
    code?: string
    esi_user?: string
    password?: string
    certificate?: string
    mobile_number?: string
    email?: string
}

interface ESIEditedDataProps {
    initialData: ESISetupData | null
    onClose: () => void
    onRefresh: () => void
    id: number
}

const esiSchema = yup.object().shape({
    code_Type: yup.string().required('Code type is required'),
    code: yup
        .string()
        .required('ESI code is required')
        .matches(
            /^[A-Za-z0-9]+$/,
            'ESI code must contain only letters and numbers',
        ),
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
   
    certificate: yup.object().shape({
        data: yup.string().required('Certificate file is required'),
        filename: yup.string().required(),
        mimetype: yup.string().required()
    }).nullable()
})

const ESIEditedData: React.FC<ESIEditedDataProps> = ({
    initialData,
    onClose,
    onRefresh,
    id,
}) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [errors, setErrors] = useState<ValidationErrors>({})
    const [loader, setLoader] = useState(false)
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [formData, setFormData] = useState<ESISetupData>({
        id: 0,
        group_id: 0,
        company_id: 0,
        code_Type: '',
        code: '',
        esi_user: '',
        password: '',
        email: '',
        mobile_number: '',
    })
    const [fileInfo, setFileInfo] = useState<{
        name: string
        type: string
        size: number
    } | null>(null)

    const codeTypeOptions = [
        { value: 'main', label: 'Main' },
        { value: 'subcode', label: 'SubCode' },
    ]

    const handleDocumentView = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (formData.certificate && typeof formData.certificate === 'string') {
            const fullPath = `${import.meta.env.VITE_API_GATEWAY}/${formData.certificate}`
            window.open(fullPath, '_blank')
        }
    }

    useEffect(() => {
        if (id) {
            fetchESIData()
        } else if (initialData) {
            setFormData(initialData)
            setLoading(false)
        }
    }, [id, initialData])

    const fetchESIData = async () => {
        try {
            setLoading(true)
            const response = await dispatch(fetchEsiSetupById(id))
                .unwrap()
                .catch((error: any) => {
                    throw error
                })
            setFormData(response)
            setLoading(false)
        } catch (err) {
            console.error('Error fetching ESI data:', err)
            setError('Failed to load ESI details')
            setLoading(false)
            showNotification('danger', 'Failed to load ESI details')
        }
    }

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

    const validateField = async (field: keyof ESISetupData, value: string) => {
        try {
            const fieldSchema = yup.reach(esiSchema, field)
            await fieldSchema.validate(value)
            setErrors((prev) => ({ ...prev, [field]: undefined }))
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                setErrors((prev) => ({ ...prev, [field]: err.message }))
            }
        }
    }

    const handleChange = async (field: keyof ESISetupData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        setTouched((prev) => ({ ...prev, [field]: true }))
        await validateField(field, value)
    }

    const isFieldValid = (field: keyof ValidationErrors) => {
        return touched[field] && !errors[field]
    }

    const validateForm = async () => {
        try {
            await esiSchema.validate(formData, { abortEarly: false })
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

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
                const base64String = (reader.result as string).split(',')[1]
                resolve(base64String)
            }
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file size (20MB max)
        if (file.size > 20 * 1024 * 1024) {
            showNotification('danger', 'File size exceeds 20MB limit')
            return
        }

        // Validate file type
        const allowedTypes = [
            'application/pdf',
            'application/zip',
            'application/x-zip-compressed',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif'
        ]

        if (!allowedTypes.includes(file.type)) {
            showNotification('danger', 'Only PDF, ZIP, JPEG, JPG PNG, and GIF files are allowed')
            return
        }

        try {
            const base64String = await convertToBase64(file)
            setFormData((prev) => ({
                ...prev,
                certificate: {
                    data: base64String,
                    filename: file.name,
                    mimetype: file.type
                }
            }))
            setFileInfo({
                name: file.name,
                type: file.type,
                size: file.size
            })
        } catch (error) {
            console.error('Error converting file to base64:', error)
            showNotification('danger', 'Failed to process certificate')
        }
    }

    const handleSubmit = async () => {
        try {
            setLoader(true)
            // Mark all fields as touched
            const allFields = [
                'code_Type', 'code', 'esi_user', 'password',
                'email', 'mobile_number'
            ]
            setTouched(
                allFields.reduce(
                    (acc, field) => ({ ...acc, [field]: true }),
                    {},
                ),
            )

            const isValid = await validateForm()
            if (!isValid) {
                showNotification('danger', 'Please fix the validation errors')
                return
            }

            const updateData = {
                group_id: formData.group_id,
                company_id: formData.company_id,
                district_id: formData.Location?.District?.id,
                location: formData?.Location?.name,
                code_Type: formData.code_Type,
                code: formData.code.toUpperCase(), // Ensure code is uppercase
                esi_user: formData.esi_user,
                password: formData.password,
                certificate: formData.certificate,
                email: formData.email,
                mobile_number: formData.mobile_number,
            }

            if (!id) {
                showNotification('danger', 'ESI Setup ID is missing')
                return
            }

            const resultAction = await dispatch(
                updateEsiSetup({
                    id: id,
                    esiData: updateData,
                })
            ).unwrap()

            if (resultAction) {
                showNotification('success', 'ESI Setup updated successfully')
                onClose()
                if (onRefresh) {
                    onRefresh()
                }
            }
        } catch (err: any) {
            console.error('Error updating ESI data:', err)
           throw err
        } finally {
            setLoader(false)
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return (
            <Dialog
                isOpen={true}
                onClose={onClose}
                onRequestClose={onClose}
                shouldCloseOnOverlayClick={false}
            >
                <div className="flex justify-center items-center h-full">
                    <p className="text-red-500">{error}</p>
                </div>
            </Dialog>
        )
    }

    return (
        <div className="p-4 space-y-6">
            {/* First Row: Company Group, Company, Code Type */}
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
                <div className="h-[70px]">
                    <p className="text-sm font-medium mb-2">
                        Code Type<span className="text-red-500">*</span>
                    </p>
                    <OutlinedSelect
                        label="Select Code Type"
                        options={codeTypeOptions}
                        value={codeTypeOptions.find(
                            (option) => option.value === formData.code_Type,
                        )}
                        onChange={(option: any) => {
                            handleChange('code_Type', option?.value || '')
                        }}
                    />
                    {errors.code_Type && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.code_Type}
                        </p>
                    )}
                </div>
            </div>

            {/* Second Row: ESI Code, ESI User, Password */}
            <div className="grid grid-cols-3 gap-4">
                <div className="h-[70px]">
                    <p className="text-sm font-medium mb-2">
                        ESI Code<span className="text-red-500">*</span>
                    </p>
                    <OutlinedInput
                        label="Enter ESI Code"
                        value={formData.code}
                        onChange={(value) => handleChange('code', value)}
                    />
                    {errors.code && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.code}
                        </p>
                    )}
                </div>
                <div className="h-[70px]">
                    <p className="text-sm font-medium mb-2">
                        ESI User
                    </p>
                    <OutlinedInput
                        label="Enter ESI User"
                        value={formData.esi_user}
                        onChange={(value) => handleChange('esi_user', value)}
                    />
                   
                </div>
                <div className="h-[70px]">
                    <p className="text-sm font-medium mb-2">
                        Password
                    </p>
                    <OutlinedPasswordInput
                        label="Enter Password"
                        value={formData.password}
                        onChange={(value) => handleChange('password', value)}
                    />
                   
                </div>
            </div>

            {/* Third Row: Email, Mobile */}
            <div className="grid grid-cols-2 gap-4">
                <div className="h-[70px]">
                    <p className="text-sm font-medium mb-2">
                        Email<span className="text-red-500">*</span>
                    </p>
                    <OutlinedInput
                        label="Enter Email"
                        value={formData.email}
                        onChange={(value) => handleChange('email', value)}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>
                <div className="h-[70px]">
                    <p className="text-sm font-medium mb-2">
                        Mobile<span className="text-red-500">*</span>
                    </p>
                    <OutlinedInput
                        label="Enter Mobile"
                        value={formData.mobile_number}
                        onChange={(value) =>
                            handleChange('mobile_number', value)
                        }
                    />
                    {errors.mobile_number && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.mobile_number}
                        </p>
                    )}
                </div>
            </div>

            {/* ESI Certificate */}
            <div className="grid grid-cols-1 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        ESI Certificate (PDF/Zip/Image, Max 20MB)
                        {!formData.certificate && <span className="text-red-500">*</span>}
                    </label>
                    <div className="flex items-center justify-between gap-2">
                        <Input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full"
                            accept=".pdf,.zip,.jpg,.jpeg,.png,.gif,application/pdf,application/zip,image/jpeg,image/png,image/gif"
                        />
                        {(formData.certificate || fileInfo) && (
                            <>
                            <Tooltip title = "View Document">
                                <Button
                                className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0"
                                    onClick={handleDocumentView}
                                    >
                                    <Eye size={20} />
                                </Button>
                                    </Tooltip>
                              
                            </>
                        )}
                    </div>
                    {errors.certificate && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.certificate}
                        </p>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-6">
                <Button variant="plain" onClick={onClose} size="sm">
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

export default ESIEditedData