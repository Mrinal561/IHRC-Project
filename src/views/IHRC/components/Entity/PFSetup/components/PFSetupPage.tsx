import React, { useEffect, useState } from 'react'
import {
    Button,
    Input,
    toast,
    Notification,
    DatePicker,
    Select,
} from '@/components/ui'
// import { useLocation } from 'react-router-dom'
import OutlinedInput from '@/components/ui/OutlinedInput'
import { MultiValue, ActionMeta } from 'react-select'
import { useLocation, useNavigate } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi'
import OutlinedSelect from '@/components/ui/Outlined'
import DistrictAutosuggest from '../../Branch/components/DistrictAutoSuggest'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import LocationAutosuggest from '../../Branch/components/LocationAutosuggest'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store'
import { createEsiSetup } from '@/services/EsiSetupService'
import { createPF } from '@/store/slices/pfSetup/pfSlice'
import { showErrorNotification } from '@/components/ui/ErrorMessage'
import * as yup from 'yup'
import OutlinedPasswordInput from '@/components/ui/OutlinedInput/OutlinedPasswordInput'

const pfSetupSchema = yup.object().shape({
    pf_code: yup
        .string()
        .required('PF Code is required')
        .matches(
            /^[A-Za-z0-9]+$/,
            'ESI code must contain only letters and numbers',
        ),

    state_id: yup
        .number()
        .required('State is required')
        .min(1, 'Please select a state'),

    district: yup
        .string()
        .required('District is required')
        .min(2, 'District name must be at least 2 characters'),

    location: yup
        .string()
        .required('Location is required')
        .min(2, 'Location must be at least 2 characters'),

    pf_user: yup.string(),

    password: yup.string(),

    register_date: yup
        .date()
        .required('Registration date is required')
        .max(new Date(), 'Registration date cannot be in the future'),

    // register_certificate: yup.object().shape({
    //         data: yup.string().required('Registration certificate file is required'),
    //         filename: yup.string().required(),
    //         mimetype: yup.string().required()
    //     }).required('Registration certificate is required'),

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

interface CertificateData {
    data: string
    filename: string
    mimetype: string
}

interface PFSetupData {
    group_id: number
    company_id: number
    state_id: number
    district: string
    location: string
    pf_code: string
    register_date: Date | null
    register_certificate?: CertificateData
    signatory_data: SignatoryData[]
    pf_user: string
    password: string
}

interface LocationState {
    companyName?: string
    companyGroupName?: string
    companyId?: string
    groupId?: string
}

interface PFSetupPageProps {
    onClose: () => void
    companyGroupName: string
    companyName: string
}

interface SignatoryData {
    signatory_id: number
    e_sign: string
    e_sign_status: string
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

const PFSetupPage: React.FC = () => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const navigate = useNavigate()
    const location = useLocation()
    const locationState = location.state as LocationState

    const companyGroupName = locationState?.companyGroupName
    const companyName = locationState?.companyName
    const companyId = locationState?.companyId
    const groupId = locationState?.groupId
    const companyData = location.state?.companyData
    const [fileBase64, setFileBase64] = useState<string>('')
    const dispatch = useDispatch<AppDispatch>()

    const [selectedSignatories, setSelectedSignatories] = useState<
        UserSignatory[]
    >([])

    const [states, setStates] = useState<SelectOption[]>([])
    const [selectedStates, setSelectedStates] = useState<SelectOption | null>(
        null,
    )
    const [selectedLocation, setSelectedLocation] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [companyGroups, setCompanyGroups] = useState<SelectOption[]>([])
    const [selectedCompanyGroup, setSelectedCompanyGroup] =
        useState<SelectOption | null>(null)
    const [companies, setCompanies] = useState<SelectOption[]>([])
    const [selectedCompany, setSelectedCompany] = useState<SelectOption | null>(
        null,
    )
    const [districts, setDistricts] = useState<SelectOption[]>([])
    const [selectedDistrict, setSelectedDistrict] = useState('')
    const [locations, setLocations] = useState<SelectOption[]>([])
    const [users, setUsers] = useState<any[]>([])

    const [selectedStateId, setSelectedStateId] = useState('')
    const [selectedDistrictId, setSelectedDistrictId] = useState<
        number | undefined
    >()
    const [selectedLocationId, setSelectedLocationId] = useState('')
    const [formTouched, setFormTouched] = useState(false)
    const [pfSetupData, setPfSetupData] = useState<PFSetupData>({
        group_id: 0,
        company_id: 0,
        state_id: 0,
        district: '',
        location: '',
        pf_code: '',
        register_date: null,
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

    // Handle registration certificate upload
    const handleRegistrationCertificateUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
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

            setPfSetupData(prev => ({
                ...prev,
                registration_certificate: {
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

    // Handle signatory document uploads (DSC and E-Sign)
    const handleSignatoryFileUpload = async (
        signatoryId: number,
        fileType: 'dsc_document' | 'e_sign',
        file: File | null,
    ) => {
        if (!file) return

        try {
            const base64String = await convertToBase64(file)

            setPfSetupData((prev) => ({
                ...prev,
                signatory_data: prev.signatory_data.map((sig) => {
                    if (sig.signatory_id === signatoryId) {
                        return {
                            ...sig,
                            [fileType]: base64String,
                        }
                    }
                    return sig
                }),
            }))
        } catch (error) {
            console.error(`Error converting ${fileType} to base64:`, error)
            toast.push(
                <Notification title="Error" closable={true} type="danger">
                    Failed to process{' '}
                    {fileType === 'dsc_document' ? 'DSC' : 'E-Sign'} document
                </Notification>,
            )
        }
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

    const validateForm = async () => {
        try {
            await pfSetupSchema.validate(pfSetupData, { abortEarly: false })
            setErrors({})
            return true
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                const newErrors: { [key: string]: string } = {}
                err.inner.forEach((error) => {
                    if (error.path) {
                        if (error.path.startsWith('signatory_data[')) {
                            const match = error.path.match(
                                /signatory_data\[(\d+)\]\.(.+)/,
                            )
                            if (match) {
                                const [_, index, field] = match
                                newErrors[`signatory_data_${index}_${field}`] =
                                    error.message
                            }
                        } else {
                            newErrors[error.path] = error.message
                        }
                    }
                })
                setErrors(newErrors)
            }
            return false
        }
    }

    useEffect(() => {
        const validateChangedFields = async () => {
            if (isSubmitted) {
                await validateForm()
            }
        }
        validateChangedFields()
    }, [pfSetupData, isSubmitted])

    useEffect(() => {
        if (formTouched) {
            validateForm()
        }
    }, [pfSetupData])
    // Handle submit with base64 files
    const handleSubmit = async () => {
        setIsSubmitted(true)
        const isValid = await validateForm()

        if (!isValid) return
        const formData = {
            ...pfSetupData,
            register_date: pfSetupData.register_date?.toISOString() || '',
            Company_Group_Name: companyGroupName,
            Company_Name: companyName,
            company_id: companyId,
            group_id: groupId,
        }

        try {
            const response = await dispatch(createPF(formData))
                .unwrap()
                .catch((error: any) => {
                    throw error
                })
            if (response) {
                toast.push(
                    <Notification title="Success" type="success">
                        <div className="flex items-center">
                            <span>PF Setup successfully created</span>
                        </div>
                    </Notification>,
                )
                navigate(-1)
            }
        } catch (error: any) {
            console.error('Error submitting PF setup:', error)
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

    const loadCompanyGroups = async () => {
        try {
            const { data } = await httpClient.get(
                endpoints.companyGroup.getAll(),
                {
                    params: { ignorePlatform: true },
                },
            )
            const formattedGroups = data.data.map((v: any) => ({
                label: v.name,
                value: String(v.id),
            }))
            setCompanyGroups(formattedGroups)
        } catch (error) {
            console.error('Failed to load company groups:', error)
            toast.push(
                <Notification title="Error" closable={true} type="danger">
                    Failed to load company groups
                </Notification>,
            )
        }
    }

    // Load Companies based on selected group
    const loadCompanies = async (groupId: string) => {
        try {
            const { data } = await httpClient.get(endpoints.company.getAll(), {
                params: {
                    'group_id[]': [groupId],
                },
            })

            if (data?.data) {
                const formattedCompanies = data.data.map((company: any) => ({
                    label: company.name,
                    value: String(company.id),
                }))

                setCompanies(formattedCompanies)
                if (formattedCompanies.length === 0) {
                    toast.push(
                        <Notification title="Info" type="info">
                            No companies found for this group
                        </Notification>,
                    )
                }
            }
        } catch (error: any) {
            console.error('Failed to load companies:', error)
            toast.push(
                <Notification title="Error" closable={true} type="danger">
                    {error.response?.data?.message ||
                        'Failed to load companies'}
                </Notification>,
            )
            setCompanies([])
        }
    }

    // Initial load of company groups
    useEffect(() => {
        loadCompanyGroups()
    }, [])

    // Load companies when company group is selected
    useEffect(() => {
        if (selectedCompanyGroup?.value) {
            setPfSetupData((prev) => ({
                ...prev,
                group_id: parseInt(selectedCompanyGroup.value),
                Company_Group_Name: selectedCompanyGroup.label,
                Company_Name: '', // Reset company when group changes
                company_id: 0,
            }))

            setSelectedCompany(null)
            loadCompanies(selectedCompanyGroup.value)
        } else {
            setCompanies([])
        }
    }, [selectedCompanyGroup])

    // Add this function after loadStates

    const loadUsers = async () => {
        try {
            const response = await httpClient.get(endpoints.user.getAll(), {
                params: {
                    'company_id[]': companyId,
                },
            })
            console.log('Users API Response:', response.data)

            if (response.data) {
                // Format the users data to only include name and id
                const formattedUsers = response.data.data
                    .filter((user: any) => user.user_details.auth_signatory)
                    .map((user: any) => ({
                        id: user.user_details.id,
                        name: `${user.user_details.name}`,
                    }))

                setUsers(formattedUsers)
                console.log('Formatted Users:', formattedUsers)
            }
        } catch (error) {
            console.error('Failed to load users:', error)
            toast.push(
                <Notification title="Error" closable={true} type="danger">
                    Failed to load users
                </Notification>,
            )
        }
    }

    // Add a useEffect to call loadUsers when component mounts
    useEffect(() => {
        loadUsers()
    }, []) // Empty dependency array means this runs once when component mounts

    useEffect(() => {
        if (selectedCompany?.value) {
            setPfSetupData((prev) => ({
                ...prev,
                company_id: parseInt(selectedCompany.value),
                Company_Name: selectedCompany.label,
            }))
        }
    }, [selectedCompany])

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
            toast.push(
                <Notification title="Error" closable={true} type="danger">
                    Failed to load states
                </Notification>,
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleStateChange = (option: SelectOption | null) => {
        setSelectedStates(option)
        setSelectedDistrict('') // Reset district selection
        setSelectedLocation('') // Reset location selection
        setDistricts([]) // Clear districts
        setLocations([]) // Clear locations

        if (option) {
            // loadDistricts(option.value);
            setPfSetupData((prev) => ({
                ...prev,
                state_id: parseInt(option.value),
                district_id: 0,
                location: '',
            }))
        }
    }

    useEffect(() => {
        loadStates()
    }, [])

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

    const handleSignatoryChange = async (
        newValue: MultiValue<{ value: string; label: string }>,
        actionMeta: ActionMeta<{ value: string; label: string }>,
    ) => {
        const selectedUserIds = newValue.map((option) => parseInt(option.value))
        const newSignatoryData = selectedUserIds.map((id) => ({
            signatory_id: id,
            dsc_validity: '',
            e_sign: '',
            e_sign_status: 'active',
            dsc_document: '',
        }))

        setPfSetupData((prev) => ({
            ...prev,
            signatory_data: newSignatoryData,
        }))

        if (isSubmitted) {
            const error = await validateField(
                'signatory_data',
                newSignatoryData,
            )
            setErrors((prev) => ({
                ...prev,
                signatory_data: error,
            }))
        }

        const newSelectedSignatories = selectedUserIds.map((id) => {
            return users.find((user) => user.id === id) || { id, name: '' }
        })
        setSelectedSignatories(newSelectedSignatories)
    }

    const handleESignStatusChange = (signatoryName: string, status: string) => {
        setSelectedSignatories((prev) =>
            prev.map((signatory) => {
                if (signatory.name === signatoryName) {
                    return { ...signatory, esignStatus: status }
                }
                return signatory
            }),
        )
    }
    const handleDscValidityChange = (signatoryId: number, date: string) => {
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

    const handleCancel = () => {
        navigate(-1)
    }

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
                <h2 className="text-2xl font-bold mb-6">Add PF Setup</h2>
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
                        <p className="mb-2">
                            {' '}
                            State <span className="text-red-500">*</span>
                        </p>
                        <OutlinedSelect
                            label="Select State"
                            options={states}
                            value={selectedStates}
                            onChange={handleStateChange}
                        />
                        {getErrorMessage('state_id')}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                        <DistrictAutosuggest
                            value={selectedDistrict}
                            onChange={(value: string) => {
                                console.log(value)
                                setSelectedDistrict(value)
                                // Update the pfSetupData with the district
                                setPfSetupData((prev) => ({
                                    ...prev,
                                    district: value,
                                }))
                            }}
                            stateId={
                                selectedStates?.value
                                    ? parseInt(selectedStates.value)
                                    : undefined
                            }
                            onDistrictSelect={(districtId) => {
                                setSelectedDistrictId(districtId)
                            }}
                        />
                        {getErrorMessage('district')}
                    </div>
                    <div>
                        <LocationAutosuggest
                            value={selectedLocation}
                            onChange={(value: string) => {
                                console.log(value)
                                setSelectedLocation(value)
                                // Update the pfSetupData with the location
                                setPfSetupData((prev) => ({
                                    ...prev,
                                    location: value,
                                }))
                            }}
                            districtId={selectedDistrictId}
                        />
                        {getErrorMessage('location')}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            PF Registration Date{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <DatePicker
                            placeholder="Select a Date"
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            PF Certificate (PDF/Zip/Image, Max 20MB)
                            <span className="text-red-500">*</span>
                        </label>
                        <Input
                            accept=".pdf,.zip,.jpg,.jpeg,.png,.gif,application/pdf,application/zip,image/jpeg,image/png,image/gif"                            
                            type="file"
                            onChange={handleRegistrationCertificateUpload}
                        />
<div style={{ height: '10px' }}>
                        {errors.certificate && (
                            <p className="text-red-500 text-xs mt-1">
                                {typeof errors.certificate === 'string' 
                                    ? errors.certificate 
                                    : 'Certificate is required'}
                            </p>
                        )}
                    </div>                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Authorised Signatories
                    </label>
                    <Select
                        isMulti
                        options={users.map((user) => ({
                            value: String(user.id), // Use ID as value
                            label: user.name,
                        }))}
                        onChange={handleSignatoryChange}
                    />
                    {getErrorMessage('signatory_data')}
                </div>
                {selectedSignatories.length > 0 && (
                    <div className="space-y-4 border rounded-lg p-4">
                        <h6 className="font-semibold">Selected Signatories</h6>
                        {selectedSignatories.map((signatory, index) => (
                            <div
                                key={signatory.id}
                                className="border p-4 rounded-lg"
                            >
                                <h4 className="text-sm mb-4">
                                    {signatory.name}
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-4">
                                            DSC Upload
                                        </label>
                                        <Input
                                        type="file"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const file = e.target.files?.[0] || null;
                                            handleSignatoryFileUpload(signatory.id, 'dsc_document', file);
                                        }}
                                    />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-4">
                                            E-Sign Upload
                                        </label>
                                        <Input
                                        type="file"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const file = e.target.files?.[0] || null;
                                            handleSignatoryFileUpload(signatory.id, 'e_sign', file);
                                        }}
                                    />
                                    </div> */}
                                    <div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                                {' '}
                                                DSC Valid Upto{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <DatePicker
                                                size="sm"
                                                placeholder="Pick a Date"
                                                onChange={(
                                                    date: Date | null,
                                                ) => {
                                                    handleDscValidityChange(
                                                        signatory.id,
                                                        date
                                                            ? date.toISOString()
                                                            : '',
                                                    )
                                                }}
                                            />
                                            {getErrorMessage(
                                                'dsc_validity',
                                                index,
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                                E-Sign Status
                                            </label>
                                            <div>
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
                                                        signatory.esignStatus ||
                                                        ''
                                                    }
                                                    onChange={(value: string) =>
                                                        handleESignStatusChange(
                                                            signatory.name,
                                                            value,
                                                        )
                                                    }
                                                />
                                                {getErrorMessage(
                                                    'e_sign_status',
                                                    index,
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
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

export default PFSetupPage
