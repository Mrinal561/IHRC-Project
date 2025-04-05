import React, { useEffect, useState } from 'react'
import {
    Button,
    Input,
    toast,
    Notification,
    DatePicker,
    Select,
} from '@/components/ui'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi'
import OutlinedInput from '@/components/ui/OutlinedInput'
import { MultiValue, ActionMeta } from 'react-select'
import DistrictAutosuggest from '../../Branch/components/DistrictAutoSuggest'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import LocationAutosuggest from '../../Branch/components/LocationAutosuggest'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store'
import { fetchPFById, updatePF } from '@/store/slices/pfSetup/pfSlice'
import { showErrorNotification } from '@/components/ui/ErrorMessage'
import * as yup from 'yup'
import OutlinedPasswordInput from '@/components/ui/OutlinedInput/OutlinedPasswordInput'
import OutlinedSelect from '@/components/ui/Outlined'

interface ValidationErrors {
    pf_code?: string
    pf_user?: string
    password?: string
    register_date?: Date
}

const pfSetupSchema = yup.object().shape({
    pf_code: yup
        .string()
        .required('PF Code is required')
        .matches(
            /^[A-Za-z0-9]+$/,
            'ESI code must contain only letters and numbers',
        ),

    // state_id: yup
    //     .number()
    //     .required('State is required')
    //     .min(1, 'Please select a state'),

    // district: yup
    //     .string()
    //     .required('District is required')
    //     .min(2, 'District name must be at least 2 characters'),

    // location: yup
    //     .string()
    //     .required('Location is required')
    //     .min(2, 'Location must be at least 2 characters'),

    pf_user: yup.string(),

    password: yup.string(),

    register_date: yup
        .date()
        .required('Registration date is required')
        .max(new Date(), 'Registration date cannot be in the future'),

    signatory_data: yup
        .array()
        .of(
            yup.object().shape({
                signatory_id: yup.number().required('Signatory ID is required'),
                dsc_validity: yup
                    .string()
                    .required('DSC validity date is required'),
                e_sign_status: yup
                    .string()
                    .required('E-sign status is required')
                    .oneOf(['active', 'inactive'], 'Invalid e-sign status'),
            }),
        )
        .min(1, 'At least one signatory is required'),
})

interface PFSetupData {
    group_id: number
    company_id: number
    state_id?: number
    district?: string
    location?: string
    pf_code: string
    register_date: Date | null
    register_certificate: string
    signatory_data: SignatoryData[]
    pf_user: string
    password: string
}

interface SignatoryData {
    signatory_id: number
    dsc_validity: Date | null
    e_sign: string
    e_sign_status: string
    details: {
        id: number
        name: string
        email: string
        mobile: string
        Role: {
            id: number
            name: string
        }
    }
}

interface LocationState {
    id?: any
    companyName?: string
    companyGroupName?: string
    companyId?: string
    groupId?: string
}

interface PFEditPageProps {
    onClose: () => void
    companyGroupName: string
    companyName: string
}

interface Signatory {
    name: string
    designation: string
    mobile: string
    email: string
    dscFile?: File | null
    eSignFile?: File | null
    esignStatus?: string
}
interface SelectOption {
    value: string
    label: string
}
interface UserSignatory {
    id: number
    name: string
    esignStatus?: string
}

interface Location {
    id: number
    name: string
    district_id: number
}

const PFEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const navigate = useNavigate()
    const location = useLocation()
    const locationState = location.state as LocationState
    const companyGroupName = locationState?.companyGroupName
    const companyName = locationState?.companyName
    const companyId = locationState?.companyId
    const groupId = locationState?.groupId
    const pfid = locationState?.id
    const companyData = location.state?.companyData
    const [fileBase64, setFileBase64] = useState<string>('')
    const dispatch = useDispatch<AppDispatch>()

    const [selectedSignatories, setSelectedSignatories] = useState<
        UserSignatory[]
    >([])
    const [isLoading, setIsLoading] = useState(true)
    const [companyGroups, setCompanyGroups] = useState<SelectOption[]>([])
    const [selectedCompanyGroup, setSelectedCompanyGroup] =
        useState<SelectOption | null>(null)
    const [companies, setCompanies] = useState<SelectOption[]>([])
    const [selectedCompany, setSelectedCompany] = useState<SelectOption | null>(
        null,
    )
    const [users, setUsers] = useState<any[]>([])

    const [formTouched, setFormTouched] = useState(false)
    const [pfSetupData, setPfSetupData] = useState<PFSetupData>({
        group_id: 0,
        company_id: 0,
        state_id: 0,
        district: '',
        location: '',
        pf_code: '',
        register_date: null,
        register_certificate: '',
        signatory_data: [],
        pf_user: '',
        password: '',
    })
    const [isSubmitted, setIsSubmitted] = useState(false)

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

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await httpClient.get(endpoints.user.getAll())
                if (response.data) {
                    const formattedUsers = response.data.data.map(
                        (user: any) => ({
                            id: user.user_details.id,
                            name: user.user_details.name,
                        }),
                    )
                    setUsers(formattedUsers)
                }
            } catch (error) {
                console.error('Failed to load users:', error)
                showErrorNotification('Failed to load users')
            }
        }

        fetchUsers()
    }, [])

    // Modify the existing useEffect for fetching PF data
    useEffect(() => {
        const fetchPFSetupData = async () => {
            try {
                const response = await dispatch(fetchPFById(pfid))
                const data = response.payload

                const registerDate = data.register_date
                    ? new Date(data.register_date)
                    : null

                const signatoryData = data.signatory_data.map(
                    (signatory: any) => ({
                        signatory_id: signatory.signatory_id,
                        dsc_validity: signatory.dsc_validity
                            ? new Date(signatory.dsc_validity)
                            : null,
                        e_sign_status: signatory.e_sign_status,
                        details: {
                            id: signatory.details.id,
                            name: signatory.details.name,
                            email: signatory.details.email,
                            mobile: signatory.details.mobile,
                            Role: {
                                id: signatory.details.Role.id,
                                name: signatory.details.Role.name,
                            },
                        },
                    }),
                )

                // Extract location information from the response
                const stateId = data.Location?.District?.State?.id || 0
                const districtName = data.Location?.District?.name || ''
                const locationName = data.Location?.name || ''

                setPfSetupData({
                    ...data,
                    register_date: registerDate,
                    signatory_data: signatoryData,
                    state_id: stateId,
                    district: districtName,
                    location: locationName,
                    pf_user: data.pf_user || '',
                    password: data.password || '',
                })

                const signatoryUsers = data.signatory_data.map(
                    (signatory: any) => ({
                        id: signatory.signatory_id,
                        name: signatory.details.name,
                        dscValidity: signatory.dsc_validity
                            ? new Date(signatory.dsc_validity)
                            : null,
                        esignStatus: signatory.e_sign_status,
                    }),
                )
                setSelectedSignatories(signatoryUsers)

                setIsLoading(false)
            } catch (error) {
                console.error('Failed to fetch PF setup data:', error)
                toast.push(
                    <Notification title="Error" closable={true} type="danger">
                        Failed to load PF setup data
                    </Notification>,
                )
                setIsLoading(false)
            }
        }

        if (pfid) {
            fetchPFSetupData()
        }
    }, [pfid, dispatch])

    const validateForm = async () => {
        try {
            // Validate the form data against the schema
            await pfSetupSchema.validate(
                {
                    pf_code: pfSetupData.pf_code,
                    pf_user: pfSetupData.pf_user,
                    password: pfSetupData.password,
                    register_date: pfSetupData.register_date
                        ? new Date(pfSetupData.register_date)
                        : undefined,
                },
                { abortEarly: false },
            )

            // Clear any existing errors if validation passes
            setErrors({})
            return true
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                const validationErrors: ValidationErrors = {}
                err.inner.forEach((error) => {
                    if (error.path) {
                        // Update the ValidationErrors interface to include all possible fields
                        validationErrors[error.path as keyof ValidationErrors] =
                            error.message
                    }
                })
                setErrors(validationErrors)
            }
            return false
        }
    }

    const handleSubmit = async () => {
        setIsSubmitted(true)
        const isValid = await validateForm()

            if (!isValid) return
        

        // Format the signatory data
        const formattedSignatoryData = pfSetupData.signatory_data.map(
            (signatory) => ({
                signatory_id: signatory.signatory_id,
                dsc_validity: signatory.dsc_validity
                    ? signatory.dsc_validity.toISOString()
                    : null,
                e_sign: signatory.e_sign,
                e_sign_status: signatory.e_sign_status,
                details: {
                    id: signatory.details.id,
                    name: signatory.details.name,
                    email: signatory.details.email,
                    mobile: signatory.details.mobile,
                    Role: {
                        id: signatory.details.Role.id,
                        name: signatory.details.Role.name,
                    },
                },
            }),
        )

        // Create the payload with only the required fields including state and location
        const formData = {
            group_id: pfSetupData.group_id,
            company_id: pfSetupData.company_id,
            state_id:
                pfSetupData.Location?.District?.State?.id ||
                pfSetupData.state_id,
            district:
                pfSetupData.Location?.District?.name || pfSetupData.district,
            location: pfSetupData.Location?.name || pfSetupData.location,
            pf_code: pfSetupData.pf_code,
            register_date: pfSetupData.register_date
                ? pfSetupData.register_date.toISOString()
                : null,
            register_certificate: pfSetupData.register_certificate,
            signatory_data: formattedSignatoryData,
        }

        try {
            const response = await dispatch(
                updatePF({ id: pfid, pfData: formData }),
            )
                .unwrap()
                .catch((error: any) => {
                    throw error
                })
            if (response) {
                toast.push(
                    <Notification title="Success" type="success">
                        <div className="flex items-center">
                            <span>PF Setup successfully updated</span>
                        </div>
                    </Notification>,
                )
                navigate(-1)
            }
        } catch (error: any) {
            console.error('Error updating PF setup:', error)
        }
    }

    const handleInputChange = async (
        field: keyof PFSetupData,
        value: string | Date | null | File | string[],
    ) => {
        setPfSetupData((prev) => ({ ...prev, [field]: value }))

        if (isSubmitted) {
            const error = await validateField(field, value)
            setErrors((prev) => ({
                ...prev,
                [field]: error,
            }))
        }
    }

    const getErrorMessage = (field: string, signatoryIndex?: number) => {
        if (signatoryIndex !== undefined) {
            // For signatory fields, construct the error key
            const errorKey = `signatory_data_${signatoryIndex}_${field}`
            return errors[errorKey] ? (
                <p className="text-red-500 text-sm mt-1">{errors[errorKey]}</p>
            ) : null
        }
        return errors[field] ? (
            <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
        ) : null
    }

    const validateField = async (field: string, value: any) => {
        try {
            // Create a partial schema for just this field
            const fieldSchema = yup.reach(pfSetupSchema, field)
            await fieldSchema.validate(value)
            return ''
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                return err.message
            }
            return ''
        }
    }
    const handleSignatoryChange = (
        newValue: MultiValue<{ value: string; label: string }>,
        actionMeta: ActionMeta<{ value: string; label: string }>,
    ) => {
        const selectedUserIds = newValue.map((option) => parseInt(option.value))
        const newSignatoryData = selectedUserIds.map((id) => {
            const user = users.find((user) => user.id === id)
            return {
                signatory_id: id,
                dsc_validity: null,
                e_sign: '',
                e_sign_status: 'active',
                details: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile,
                    Role: {
                        id: user.Role.id,
                        name: user.Role.name,
                    },
                },
            }
        })

        setPfSetupData((prev) => ({
            ...prev,
            signatory_data: newSignatoryData,
        }))

        const newSelectedSignatories = selectedUserIds.map((id) => {
            const user = users.find((user) => user.id === id)
            return {
                id,
                name: user?.name || '',
                esignStatus: 'active',
            }
        })
        setSelectedSignatories(newSelectedSignatories)
    }

    // Add handlers for DSC validity and E-sign status
    const handleDscValidityChange = (
        signatoryId: number,
        date: Date | null,
    ) => {
        setPfSetupData((prev) => ({
            ...prev,
            signatory_data: prev.signatory_data.map((sig) => {
                if (sig.signatory_id === signatoryId) {
                    return {
                        ...sig,
                        dsc_validity: date,
                    }
                }
                return sig
            }),
        }))
    }

    const handleESignStatusChange = (signatoryId: number, status: string) => {
        setSelectedSignatories((prev) =>
            prev.map((signatory) => {
                if (signatory.id === signatoryId) {
                    return { ...signatory, esignStatus: status }
                }
                return signatory
            }),
        )

        setPfSetupData((prev) => ({
            ...prev,
            signatory_data: prev.signatory_data.map((sig) => {
                if (sig.signatory_id === signatoryId) {
                    return {
                        ...sig,
                        e_sign_status: status,
                    }
                }
                return sig
            }),
        }))
    }

    const handleRegistrationCertificateUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0]
        if (file) {
            try {
                const base64String = await convertToBase64(file)
                setPfSetupData((prev) => ({
                    ...prev,
                    register_certificate: base64String,
                }))
            } catch (error) {
                console.error(
                    'Error converting registration certificate to base64:',
                    error,
                )
                toast.push(
                    <Notification title="Error" closable={true} type="danger">
                        Failed to process registration certificate
                    </Notification>,
                )
            }
        }
    }

    // Rest of the code remains the same as PFSetupPage
    // You can reuse the same functions like handleInputChange, handleSignatoryChange, etc.

    return (
        <div className="container mx-auto py-8">
            <div className="flex gap-3 items-center mb-6">
                <Button
                    variant="plain"
                    size="sm"
                    icon={<HiArrowLeft />}
                    onClick={() => navigate(-1)}
                    className="mb-4"
                ></Button>
                <h2 className="text-2xl font-bold mb-6">Edit PF Setup</h2>
            </div>
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="mb-2"> Company Group</p>
                        {/* <OutlinedSelect
                            label="Select Company Group"
                            options={companyGroups}
                            value={selectedCompanyGroup}
                            onChange={setSelectedCompanyGroup}
                        /> */}
                        <OutlinedInput
                            label="Company Group"
                            value={companyGroupName}
                            disabled
                        />
                    </div>
                    <div>
                        <p className="mb-2"> Company</p>
                        {/* <OutlinedSelect
                            label="Select Company"
                            options={companies}
                            value={selectedCompany}
                            onChange={(option: SelectOption | null) => {
                                setSelectedCompany(option)
                            }}
                        /> */}
                        <OutlinedInput
                            label="Company"
                            value={companyName}
                            disabled
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="mb-2">
                            {' '}
                            PF code <span className="text-red-500">*</span>
                        </p>
                        <OutlinedInput
                            label="Enter PF Code"
                            value={pfSetupData.pf_code}
                            onChange={(value: string) =>
                                handleInputChange('pf_code', value)
                            }
                        />
                        {getErrorMessage('pf_code')}
                    </div>
                    <div>
                        <p className="mb-2">PF User</p>
                        <OutlinedInput
                            label="Enter Username"
                            value={pfSetupData.pf_user}
                            onChange={(value: string) => {
                                setPfSetupData((prev) => ({
                                    ...prev,
                                    pf_user: value,
                                }))
                            }}
                        />
                        {getErrorMessage('pf_user')}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="mb-2">Password</p>
                        <OutlinedInput
                            label="Enter Password"
                            value={pfSetupData.password}
                            onChange={(value: string) => {
                                setPfSetupData((prev) => ({
                                    ...prev,
                                    password: value,
                                }))
                            }}
                        />
                        {/* {getErrorMessage('password')} */}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            PF Registration Date{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <DatePicker
                            placeholder="Pick a Date"
                            value={pfSetupData.register_date}
                            onChange={(date: Date | null) =>
                                handleInputChange('register_date', date)
                            }
                            inputFormat="DD-MM-YYYY" // Changed to uppercase format tokens
                            yearLabelFormat="YYYY"
                            monthLabelFormat="MMMM YYYY"
                        />
                        {getErrorMessage('register_date')}
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            PF Certificate (PDF/Zip/Image, Max 20MB)
                            <span className="text-red-500">*</span>
                        </label>
                        <Input
                            accept=".pdf,.zip,.jpg"
                            type="file"
                            onChange={handleRegistrationCertificateUpload}
                        />
                        {getErrorMessage('register_certificate')}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Authorised Signatories
                    </label>
                    <Select
                        isMulti
                        value={selectedSignatories.map((signatory) => ({
                            value: String(signatory.id),
                            label: signatory.name,
                        }))}
                        options={users.map((user) => ({
                            value: String(user.id),
                            label: user.name,
                        }))}
                        onChange={handleSignatoryChange}
                    />
                </div>

                {selectedSignatories.length > 0 && (
                    <div className="space-y-4 border rounded-lg p-4">
                        <h6 className="font-semibold">Selected Signatories</h6>
                        {selectedSignatories.map((signatory, index) => {
                            const signatoryData =
                                pfSetupData.signatory_data.find(
                                    (sig) => sig.signatory_id === signatory.id,
                                )

                            return (
                                <div
                                    key={signatory.id}
                                    className="border p-4 rounded-lg"
                                >
                                    <h4 className="text-sm mb-4">
                                        {signatory.name}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                                DSC Valid Upto{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <DatePicker
                                                size="sm"
                                                placeholder="Pick a Date"
                                                value={
                                                    signatoryData?.dsc_validity ||
                                                    null
                                                }
                                                onChange={(
                                                    date: Date | null,
                                                ) => {
                                                    handleDscValidityChange(
                                                        signatory.id,
                                                        date,
                                                    )
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                                E-Sign Status
                                            </label>
                                            <OutlinedSelect
                                                label="Status"
                                                options={[
                                                    {
                                                        value: 'active',
                                                        label: 'Active',
                                                    },
                                                    {
                                                        value: 'inactive',
                                                        label: 'Inactive',
                                                    },
                                                ]}
                                                value={
                                                    signatoryData?.e_sign_status
                                                        ? {
                                                              value: signatoryData.e_sign_status,
                                                              label:
                                                                  signatoryData.e_sign_status ===
                                                                  'active'
                                                                      ? 'Active'
                                                                      : 'Inactive',
                                                          }
                                                        : null
                                                }
                                                onChange={(value: string) =>
                                                    handleESignStatusChange(
                                                        signatory.id,
                                                        value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
                <div className="flex justify-end space-x-2">
                    <Button onClick={() => navigate(-1)}>Cancel</Button>
                    <Button
                        type="submit"
                        variant="solid"
                        onClick={handleSubmit}
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default PFEditPage
