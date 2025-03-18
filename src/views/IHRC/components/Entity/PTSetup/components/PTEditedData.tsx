import React, { useEffect, useState } from 'react'
import {
    Button,
    Dialog,
    DatePicker,
    toast,
    Notification,
    Input,
} from '@/components/ui'
import OutlinedInput from '@/components/ui/OutlinedInput'
import { useDispatch } from 'react-redux'
import { showErrorNotification } from '@/components/ui/ErrorMessage'
import { PTSetupData } from './PTSetupTable'
import { fetchptsetupById, updatePT } from '@/store/slices/ptSetup/ptSetupSlice'
import * as yup from 'yup'
import OutlinedSelect from '@/components/ui/Outlined/Outlined'
import OutlinedPasswordInput from '@/components/ui/OutlinedInput/OutlinedPasswordInput'
import { Eye } from 'lucide-react'

interface ValidationErrors {
    register_number?: string
    enroll_number?: string
    username?: string
    password?: string
    email?: string
    mobile?: string
    register_date?: Date
    remmit_mode?: string
}

const ptSchema = yup.object().shape({
    register_number: yup
        .string()
        .required('Register Number is required'),
        // .matches(
        //     /^[A-Za-z0-9]+$/,
        //     'rc number must contain only letters and numbers',
        // ),
    enroll_number: yup
        .string()
        .required('Enrollment Number is required'),
        // .matches(
        //     /^[A-Za-z0-9]+$/,
        //     'ec number must contain only letters and numbers',
        // ),
    // username: yup
    //     .string()
    //     .required('PF User is required')
    //     .min(3, 'Username must be at least 3 characters'),
    // password: yup
    //     .string()
    //     .required('Password is required')
    //     .min(8, 'Password must be at least 8 characters')
    //     .matches(
    //         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    //         'Must include A-Z, a-z, 0-9, @$!%*?& (Weak Password)',
    //     ),
    //     email: yup
    //     .string()
    //     .matches(
    //         /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|gov)$/,
    //         'Invalid email address. Please use a valid email with a.com,.in,.org,.net,.edu, or.gov domain.',
    //     ),
    mobile: yup
        .string()
        .test(
            'len',
            'Mobile number must be exactly 10 digits',
            (val) => !val || val.toString().length === 10,
        ),
    register_date: yup
        .date()
        .required('Registration date is required')
        .max(new Date(), 'Registration date cannot be in the future'),
    // remmit_mode: yup
    // .string()
    // .required('Remmit mode is required')
    // .oneOf(['online', 'offline'], 'Invalid remit mode'),
})
interface PTEditedDataProps {
    id?: number
    initialData?: PTSetupData | null
    onClose: () => void
    onSubmit: (data: PTSetupData) => void
    onRefresh?: () => void
}

const PTEditedData: React.FC<PTEditedDataProps> = ({
    id,
    initialData,
    onClose,
    onSubmit,
    onRefresh,
}) => {
    const [formData, setFormData] = useState<PTSetupData>({
        register_number: '',
        enroll_number: '',
        username: '',
        password: '',
        email: '',
        mobile: '',
        register_date: '',
        remmit_mode: '',
        ec_certificate: '',
        rc_certificate: '',
    })
    const [loader, setLoader] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const dispatch = useDispatch()
    const [errors, setErrors] = useState<ValidationErrors>({})

    const remittanceModeOptions = [
        { value: 'online', label: 'Online' },
        { value: 'offline', label: 'Offline' },
    ]

    const handleRCDocumentView = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (formData.rc_certificate) {
            const fullPath = `${import.meta.env.VITE_API_GATEWAY}/${formData.rc_certificate}`
            window.open(fullPath, '_blank')
        }
    }
    const handleECDocumentView = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (formData.rc_certificate) {
            const fullPath = `${import.meta.env.VITE_API_GATEWAY}/${formData.rc_certificate}`
            window.open(fullPath, '_blank')
        }
    }
    useEffect(() => {
        if (id) {
            fetchPTData()
        } else if (initialData) {
            setFormData(initialData)
            setLoading(false)
        }
    }, [id, initialData])

    const fetchPTData = async () => {
        try {
            setLoading(true)
            const response = await dispatch(fetchptsetupById(id))
                .unwrap()
                .catch((error: any) => {
                    throw error
                })
            setFormData(response)
            setLoading(false)
        } catch (err) {
            console.error('Error fetching PT data:', err)
            setError('Failed to load PT details')
            setLoading(false)
            openNotification('danger', 'Failed to load PT details')
        }
    }

    const handleSubmit = async () => {
        try {
            setLoader(true)
            const isValid = await validateForm()
            if (!isValid) return
            // Implement your update logic similar to LW
            const updateData = {
                register_number: formData.register_number,
                enroll_number: formData.enroll_number,
                username: formData.username,
                password: formData.password,
                email: formData.email,
                mobile: formData.mobile,
                register_date: formData.register_date || '',
                remmit_mode: formData.remmit_mode,
                ec_certificate: formData.ec_certificate,
                rc_certificate: formData.rc_certificate,
            }

            const resultAction = await dispatch(
                updatePT({
                    id: id,
                    data: updateData,
                }),
            )

            //   onSubmit(formData);
            if (resultAction) {
                onClose()

                if (onRefresh) {
                    onRefresh()
                }
                openNotification('success', 'PT Setup edited successfully')
            }
        } catch (err) {
            console.error('Error submitting PT data:', err)
            openNotification('danger', 'Failed to save changes')
        } finally {
            setLoader(false)
        }
    }

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

    const handleFileChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
        certificateType: 'ec_certificate' | 'rc_certificate',
    ) => {
        const file = e.target.files?.[0]
        if (file) {
            try {
                const base64String = await convertToBase64(file)
                setFormData((prev) => ({
                    ...prev,
                    [certificateType]: base64String,
                }))
                // toast.push(
                //     <Notification title="Success" type="success">
                //         {certificateType === 'ec_certificate' ? 'EC' : 'RC'} Certificate uploaded successfully
                //     </Notification>,
                // )
            } catch (error) {
                console.error(
                    `Error converting ${certificateType} file to base64:`,
                    error,
                )
                toast.push(
                    <Notification title="Error" closable={true} type="danger">
                        Failed to process{' '}
                        {certificateType === 'ec_certificate' ? 'EC' : 'RC'}{' '}
                        certificate
                    </Notification>,
                )
            }
        }
    }

    const validateField = async (field: keyof PTSetupData, value: any) => {
        try {
            // Create a schema for just this field
            const fieldSchema = yup.reach(ptSchema, field)
            await fieldSchema.validate(value)
            setErrors((prev) => ({ ...prev, [field]: undefined }))
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                setErrors((prev) => ({ ...prev, [field]: err.message }))
            }
        }
    }

    // Modify handleChange to include validation
    const handleChange = async (field: keyof PTSetupData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Validate the field as it changes
        await validateField(field, value)

        // Special validation for password to check against username
        // if (field === 'password' || field === 'username') {
        //     const newFormData = { ...formData, [field]: value }
        //     if (newFormData.password === newFormData.username) {
        //         setErrors(prev => ({
        //             ...prev,
        //             password: 'Password cannot be same as username'
        //         }))
        //     }
        // }

        // Special validation for mobile number to check for numeric only
        // if (field === 'mobile') {
        //     if (!/^\d*$/.test(value)) {
        //         setErrors(prev => ({
        //             ...prev,
        //             mobile: 'Mobile number must contain only digits'
        //         }))
        //     }
        // }
    }

    // Modify validateForm to check for custom validations as well
    const validateForm = async () => {
        try {
            await ptSchema.validate(
                {
                    register_number: formData.register_number,
                    mobile: formData.mobile,
                    enroll_number: formData.enroll_number,
                    username: formData.username,
                    password: formData.password,
                    email: formData.email,
                    register_date: formData.register_date
                        ? new Date(formData.register_date)
                        : undefined,
                },
                { abortEarly: false },
            )

            // Additional custom validations
            // if (formData.password === formData.username) {
            //     setErrors(prev => ({
            //         ...prev,
            //         password: 'Password cannot be same as username'
            //     }))
            //     return false
            // }

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
        <div className="p-1 space-y-2">
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
                <div className="flex flex-col gap-2">
                    <label> PT RC Registration Number</label>
                    <div className="w-full">
                        <OutlinedInput
                            label="Enter PT RC Registration Number"
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

            <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                    <label> PT EC Enrollment Number</label>
                    <div className="w-full">
                        <OutlinedInput
                            label="Enter PT EC Enrollment Number"
                            value={formData.enroll_number}
                            onChange={(value) =>
                                handleChange('enroll_number', value)
                            }
                        />
                        <div className="h-5">
                            {errors.enroll_number && (
                                <div className="text-red-500 text-sm">
                                    {errors.enroll_number}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label> PT User </label>
                    <div className="w-full">
                        <OutlinedInput
                            label="Enter PT User"
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
                <div className="flex flex-col gap-2">
                    <label> Password</label>
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
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                    <label> Email ID</label>
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
                <div className="flex flex-col gap-2">
                    <label> Mobile Number</label>
                    <div className="w-full">
                        <OutlinedInput
                            label="Enter Mobile"
                            value={formData.mobile}
                            onChange={(value) => handleChange('mobile', value)}
                        />
                        <div className="h-5">
                            {errors.mobile && (
                                <div className="text-red-500 text-sm">
                                    {errors.mobile}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label>Remit Mode</label>
                    <div className="w-full">
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
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                    <label>PT Registration Date</label>
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
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        EC Certificate Upload (PDF/ZIP/IMG • 20MB)
                    </label>
                    <div className="flex items-center gap-2">
                        <Input
                            type="file"
                            onChange={(e) =>
                                handleFileChange(e, 'ec_certificate')
                            }
                            className="w-full"
                            accept=".pdf"
                        />
                        {formData.rc_certificate && (
                            <button
                                onClick={handleECDocumentView}
                                className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0"
                                title="View Document"
                            >
                                <Eye size={20} />
                            </button>
                        )}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        RC Certificate Upload (PDF/ZIP/IMG • 20MB)
                    </label>
                    <div className="flex items-center gap-2">
                        <Input
                            type="file"
                            onChange={(e) =>
                                handleFileChange(e, 'rc_certificate')
                            }
                            className="w-full"
                            accept=".pdf"
                        />
                        {formData.ec_certificate && (
                            <button
                                onClick={handleRCDocumentView}
                                className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0"
                                title="View Document"
                            >
                                <Eye size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-6">
                <Button variant="plain" onClick={onClose} className="mr-2">
                    Cancel
                </Button>
                <Button variant="solid" onClick={handleSubmit} loading={loader}>
                    Confirm
                </Button>
            </div>
        </div>
    )
}

export default PTEditedData
