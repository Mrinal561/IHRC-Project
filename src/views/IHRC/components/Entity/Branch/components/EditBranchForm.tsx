import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    Button,
    DatePicker,
    Input,
    Notification,
    toast,
    Tooltip,
} from '@/components/ui'
import { IoArrowBack } from 'react-icons/io5'
import {
    EntityData,
    entityDataSet,
    LocationData,
} from '../../../../store/dummyEntityData'
import OutlinedSelect from '@/components/ui/Outlined'
import OutlinedInput from '@/components/ui/OutlinedInput'
import LocationAutosuggest from './LocationAutosuggest'
import { AppDispatch } from '@/store'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import { useDispatch } from 'react-redux'
import DistrictAutosuggest from './DistrictAutoSuggest'
import {
    createBranch,
    fetchBranchById,
    updateBranch,
} from '@/store/slices/branch/branchSlice'
import { format, isPast } from 'date-fns'
import { MdLabel } from 'react-icons/md'
import { showErrorNotification } from '@/components/ui/ErrorMessage'
import SESetup from './SEsetup'
import { HiMinusCircle, HiPlusCircle } from 'react-icons/hi'
import * as yup from 'yup'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { Eye } from 'lucide-react'
import moment from 'moment'

interface AgreementSection {
    agreement_type: string
    start_date: string
    end_date: string
    agreement_document: string | null
    owner_name: string
    partner_name: string
    partner_contact: string
}

interface BranchFormData {
    group_id: number
    company_id: number
    state_id: number
    district: string
    location: string
    name: string
    opening_date: string
    head_count: string
    address: string
    type: string
    office_type: string
    other_office: string
    // custom_data: {
    //     remark: string
    //     status: string
    //     email?: string
    //     mobile?: string
    // }
    register_number?: string
    lease_status: string
    //   validity: string;
    document?: string
    se_document: string | null
    lease_document: string | null
    document_validity_type: string
    se_validity?: string
    lease_validity?: string
    se_status?: string
    office_mode?: 'physical' | 'virtual'
    // agreement_data?: AgreementSection[]
    gst_number?: string
}

interface SelectOption {
    value: string
    label: string
}

interface District {
    id: number
    name: string
}

const validationSchema = yup.object().shape({
    group_id: yup
        .number()
        .required('Group ID is required')
        .min(1, 'Group ID must be greater than or equal to 1'),
    company_id: yup
        .number()
        .required('Company ID is required')
        .min(1, 'Company ID must be greater than or equal to 1'),
    state_id: yup
        .number()
        .required('State ID is required')
        .min(1, 'State ID must be greater than or equal to 1'),
    district: yup.string().required('District is required'),
    // .min(2, 'District must be at least 2 characters'),
    location: yup.string().required('Location is required'),
    // .min(2, 'Location must be at least 2 characters'),
    name: yup
        .string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters'),
    opening_date: yup.string().required('Opening date is required'),
    // .matches(
    //     /^\d{4}-\d{2}-\d{2}$/,
    //     'Opening date must be in the format YYYY-MM-DD',
    // ),
    head_count: yup
        .string()
        .required('Head count is required')
        .matches(/^[0-9]+$/, 'Head count must be a numeric value'),
    address: yup
        .string()
        .required('Address is required')
        .min(5, 'Address must be at least 5 characters'),
    office_mode: yup
        .string()
        .required('Office mode is required')
        .oneOf(['physical', 'virtual'], 'Invalid office mode'),
    office_type: yup.string().when('office_mode', {
        is: 'physical',
        then: (schema) => schema.required('Office type is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    type: yup.string().when('office_mode', {
        is: 'physical',
        then: (schema) => schema.required('Type is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    other_office: yup
        .string()
        .nullable()
        .when('office_type', {
            is: 'other',
            then: (schema) => schema.required('Other office is required'),
            otherwise: (schema) => schema.notRequired(),
        }),
    lease_status: yup
        .string()
        .nullable()
        .when('type', {
            is: 'rented',
            then: (schema) => schema.required('Lease status is required'),
            otherwise: (schema) => schema.notRequired(),
        }),
    lease_document: yup.string().nullable(),
    // .when('type', {
    //     is: 'rented',
    //     then: (schema) => schema.required('Lease document is required'),
    //     otherwise: (schema) => schema.notRequired(),
    // }),
    lease_validity: yup
        .string()
        .nullable()
        .when('type', {
            is: 'rented',
            then: (schema) =>
                schema
                    // .matches(
                    //     /^\d{4}-\d{2}-\d{2}$/,
                    //     'Lease Validity must be in the format YYYY-MM-DD',
                    // )
                    .required('Lease validity is required'),
            otherwise: (schema) => schema.notRequired(),
        }),
    se_status: yup
        .string()
        .nullable()
        .when('type', {
            is: (val) => val === 'rented' || val === 'owned',
            then: (schema) => schema.required('SE status is required'),
            otherwise: (schema) => schema.notRequired(),
        }),
    se_document: yup.string().nullable(),
    // .when('type', {
    //     is: (val) => val === 'rented' || val === 'owned',
    //     then: (schema) => schema.required('SE document is required'),
    //     otherwise: (schema) => schema.notRequired(),
    // }),
    register_number: yup
        .string()
        .nullable()
        .when(['type', 'document_validity_type', 'se_status'], {
            is: (type, docType, seStatus) =>
                (type === 'owned' &&
                    docType === 'fixed' &&
                    seStatus === 'valid') ||
                (type === 'owned' &&
                    docType === 'fixed' &&
                    seStatus === 'expired'),
            then: (schema) =>
                schema
                    .matches(/^\w+$/, 'Register number must be alphanumeric')
                    .required('Register number is required'),
            otherwise: (schema) => schema.notRequired(),
        }),
    se_validity: yup
        .string()
        .nullable()
        .when(['type', 'document_validity_type', 'se_status'], {
            is: (type, docType, seStatus) =>
                type === 'owned' && docType === 'fixed' && seStatus === 'valid',
            then: (schema) =>
                schema
                    .matches(
                        /^\d{4}-\d{2}-\d{2}$/,
                        'SE Validity must be in the format YYYY-MM-DD',
                    )
                    .required('SE validity is required'),
            otherwise: (schema) => schema.notRequired(),
        }),
    gst_number: yup
        .string()
        .nullable()
        .test(
            'format-if-exists',
            'GST number must be 15 characters and can contain only numbers and uppercase letters',
            function (value) {
                // If value is empty or null, pass the validation
                if (!value) return true

                // Otherwise check format
                return /^[0-9A-Z]{15}$/.test(value)
            },
        ),
    document: yup.string().nullable(),
    document_validity_type: yup
        .string()
        .required('Document validity type is required'),
})

const AddBranchForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    //   const [locationData, setLocationData] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [companyGroups, setCompanyGroups] = useState<SelectOption[]>([])
    const [selectedCompanyGroup, setSelectedCompanyGroup] =
        useState<SelectOption | null>(null)
    const [companies, setCompanies] = useState<SelectOption[]>([])
    const [selectedCompany, setSelectedCompany] = useState<SelectOption | null>(
        null,
    )
    const [states, setStates] = useState<SelectOption[]>([])
    const [selectedStates, setSelectedStates] = useState<SelectOption | null>(
        null,
    )
    const [selectedDistrict, setSelectedDistrict] = useState('')
    const [districtsData, setDistrictsData] = useState<District[]>([])
    const [selectedDistrictId, setSelectedDistrictId] = useState<
        number | undefined
    >()
    const [selectedLocation, setSelectedLocation] = useState('')
    const [fileBase64, setFileBase64] = useState<string>('')

    // const [seDocument, setSeDocument] = useState<string | null>(null);
    //   const [leaseDocument, setLeaseDocument] = useState<string | null>(null);
    const [seRegistrationNumber, setSeRegistrationNumber] = useState('')
    const [seValidityType, setSeValidityType] = useState<'fixed' | 'lifetime'>(
        'fixed',
    )
    const [seValidityDate, setSeValidityDate] = useState<Date | null>(null)
    const [seDocument, setSeDocument] = useState<File | null>(null)
    const [leaseValidityType, setLeaseValidityType] = useState<
        'fixed' | 'lifetime'
    >('fixed')
    const [leaseValidityDate, setLeaseValidityDate] = useState<Date | null>(
        null,
    )
    const [loading, setLoading] = useState(false)
    const [leaseDocument, setLeaseDocument] = useState<File | null>(null)
    const [seRegistrationNumberExists, setSeRegistrationNumberExists] =
        useState('no')
    const [formData, setFormData] = useState<BranchFormData>({
        group_id: 0,
        company_id: selectedCompany?.value
            ? parseInt(selectedCompany.value)
            : 0,
        state_id: selectedCompany?.value ? parseInt(selectedCompany.value) : 0,
        district: selectedDistrict,
        location: selectedLocation,
        name: '',
        opening_date: '',
        head_count: '',
        address: '',
        type: '',
        office_type: '',
        other_office: '',
        // custom_data: {
        //     remark: '',
        //     status: 'active',
        //     email: '',
        //     mobile: '',
        // },
        // register_number: '',
        lease_status: '',
        se_document: '',
        lease_document: '',
        document_validity_type: 'fixed',
        se_validity: '',
        lease_validity: '',
        se_status: '',
        office_mode: 'physical',
        // agreement_data: [],
        gst_number: '',
    })
    const [errors, setErrors] = useState<any>({})
    const location = useLocation()
    const locationState = location.state
    const branchId = locationState?.branchId

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            document_validity_type: seValidityType,
            se_validity:
                seValidityType === 'fixed' ? prev.se_validity : '2024-11-21',
            lease_validity: '2024-11-21',
        }))
    }, [seValidityType])

    const statusTypeOptions = [
        { value: 'active', label: 'Active' },
        { value: 'expired', label: 'Expired' },
    ]
    const branchTypeOptions = [
        { value: 'rented', label: 'Rented' },
        { value: 'owned', label: 'Owned' },
    ]
    const officeTypeOption = [
        { value: 'register_office', label: 'Registered Office' },
        { value: 'coorporate_office', label: 'Coorporate Office' },
        { value: 'regional_office', label: 'Regional Office' },
        { value: 'branch', label: 'Branch Office' },
        { value: 'other', label: 'Others' },
        // { value: 'branch', label: 'Branch' },
    ]

    const documentValidityOptions = [
        { value: 'fixed', label: 'Fixed' },
        { value: 'lifetime', label: 'Lifetime' },
    ]

    const handleDocumentView = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (formData.se_document) {
            const fullPath = `${import.meta.env.VITE_API_GATEWAY}${formData.se_document}`
            window.open(fullPath, '_blank')
        }
    }
    const handleLeaseDocumentView = (
        e: React.MouseEvent<HTMLButtonElement>,
    ) => {
        e.preventDefault()
        if (formData.lease_document) {
            const fullPath = `${import.meta.env.VITE_API_GATEWAY}${formData.lease_document}`
            window.open(fullPath, '_blank')
        }
    }

    // handleSeDocumentView = (
    //     e: React.MouseEvent<HTMLButtonElement>,
    // ) => {
    //     e.preventDefault()
    //     if (formData.se_document) {
    //         const fullPath = `${import.meta.env.VITE_API_GATEWAY}/${formData.se_document}`
    //         window.open(fullPath, '_blank')
    //     }
    // }
    const handleSeValidityChange = (date: Date | null) => {
        console.log('Current seValidityType:', seValidityType)
        console.log('Date:', date)
        if (seValidityType === 'fixed') {
            if (date) {
                const formattedDate = format(date, 'yyyy-MM-dd')
                const status = isPast(date) ? 'inactive' : 'active'

                setFormData((prev) => ({
                    ...prev,
                    se_validity: formattedDate,
                    //   status: status,
                    //   document_validity_type: 'fixed'
                }))
                setSeValidityDate(date)
            } else {
                setFormData((prev) => ({
                    ...prev,
                    se_validity: '',
                    //   status: 'active',
                    //   document_validity_type: 'fixed'
                }))
                setSeValidityDate(null)
            }
        } else {
            // Lifetime option
            console.log('Setting lifetime validity')

            setFormData((prev) => {
                const { se_validity, ...rest } = prev
                return rest
            })
            setSeValidityDate(null)
        }
    }

    const handleLeaseValidityChange = (date: Date | null) => {
        if (leaseValidityType === 'fixed') {
            if (date) {
                const formattedDate = format(date, 'yyyy-MM-dd')
                const status = isPast(date) ? 'inactive' : 'active'
                const displayStatus = isPast(date) ? 'Expired' : 'Active'

                setFormData((prev) => ({
                    ...prev,
                    lease_validity: formattedDate,
                    lease_status: status, // This will be 'inactive' or 'active' for backend
                }))
                setLeaseValidityDate(date)
            } else {
                setFormData((prev) => ({
                    ...prev,
                    lease_validity: '',
                    lease_status: 'active',
                }))
                setLeaseValidityDate(null)
            }
        } else {
            // Lifetime option
            setFormData((prev) => {
                const { lease_validity, ...rest } = prev
                return rest
            })
            setLeaseValidityDate(null)
        }
    }

    const renderDocumentValidityRadio = (
        validityType: 'fixed' | 'lifetime',
        setValidityType: React.Dispatch<
            React.SetStateAction<'fixed' | 'lifetime'>
        >,
        onDateChange: (date: Date | null) => void,
        label: string,
    ) => (
        <div className="space-y-2">
            <div className="flex items-center space-x-4">
                <p>{label}</p>
                {documentValidityOptions.map((option) => (
                    <label
                        key={option.value}
                        className="flex items-center space-x-2"
                    >
                        <input
                            type="radio"
                            value={option.value}
                            checked={validityType === option.value}
                            onChange={() => {
                                setValidityType(
                                    option.value as 'fixed' | 'lifetime',
                                )
                                // If switching to lifetime, clear the date
                                if (option.value === 'lifetime') {
                                    onDateChange(null)
                                }
                            }}
                            className="form-radio"
                        />
                        <span>{option.label}</span>
                    </label>
                ))}
            </div>
        </div>
    )

    const showNotification = (
        type: 'success' | 'info' | 'error' | 'warning',
        message: string,
    ) => {
        toast.push(
            <Notification
                title={type.charAt(0).toUpperCase() + type.slice(1)}
                type={type}
                closable={true}
            >
                {message}
            </Notification>,
        )
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

                console.log('Formatted States:', formattedStates) // Debug log
                setStates(formattedStates)
            } else {
                console.error('Invalid state data structure:', response.data)
                showNotification('error', 'Invalid state data received')
            }
        } catch (error) {
            console.error('Failed to load states:', error)
            showNotification('error', 'Failed to load states')
        } finally {
            setIsLoading(false)
        }
    }

    // Handle state selection
    const handleStateChange = (option: SelectOption | null) => {
        setSelectedStates(option)
        setSelectedDistrict('') // Reset district selection
        setSelectedLocation('')
        if (option) {
            setFormData((prev) => ({
                ...prev,
                state_id: parseInt(option.value),
                // State: option.label,
                // District: '' // Reset district when state changes
            }))
        }
    }

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            group_id: selectedCompanyGroup?.value
                ? parseInt(selectedCompanyGroup.value)
                : 0,
        }))
    }, [selectedCompanyGroup])

    const loadCompanyGroups = async () => {
        try {
            const { data } = await httpClient.get(
                endpoints.companyGroup.getAll(),
                {
                    params: { ignorePlatform: true },
                },
            )
            setCompanyGroups(
                data.data.map((v: any) => ({
                    label: v.name,
                    value: String(v.id),
                })),
            )
            setSelectedCompanyGroup(
                data.data.map((v: any) => ({
                    label: v.name,
                    value: String(v.id),
                }))[0],
            )
        } catch (error) {
            console.error('Failed to load company groups:', error)
            showNotification('error', 'Failed to load company groups')
        }
    }
    const formatInitialDate = (dateString: any) => {
        if (!dateString) return null
        // Parse the date string to a Date object
        const date = new Date(dateString)
        return isNaN(date.getTime()) ? null : date
    }

    const fetchBranchData = async () => {
        try {
            setLoading(true)
            const response = await dispatch(fetchBranchById(branchId))
                .unwrap()
                .catch((error: any) => {
                    throw error
                })

            setFormData({
                group_id: response.group_id || 0,
                company_id: response.company_id || 0,
                state_id: response.state_id || 0,
                district: String(response.District?.id) || '', // Use nested object for district name
                location: String(response.Location?.id) || '', // Use nested object for location name
                name: response.name || '',
                head_count: response.head_count || '',
                address: response.address || '',
                type: response.type || '',
                office_mode: response.office_mode || 'physical',
                office_type: response.office_type || '',
                other_office: response.OtherBrancOffice?.name || '',
                lease_status: response.lease_status || null,
                lease_document: response.lease_document || '',
                se_document: response.se_document || '',
                document_validity_type:
                    response.document_validity_type || 'fixed',
                opening_date: response.opening_date
                    ? formatInitialDate(response.opening_date)
                    : '',
                se_validity: response.se_validity
                    ? formatInitialDate(response.se_validity)
                    : null,
                lease_validity: response.lease_validity
                    ? formatInitialDate(response.lease_validity)
                    : null,
                se_status: response.se_status || '',
                gst_number: response.gst_number || '',
                register_number: response.register_number || '',
            })
            setSeRegistrationNumberExists(response.se_status)
            await setSelectedDistrict(response.District?.name || '')
            await setSelectedDistrictId(response.District?.id || '')
            setSelectedLocation(response.Location?.name || '')
            // Clear validation errors when loading new data
        } catch (error) {
            // setError('Failed to load User details')
            console.error('Error fetching User data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCompanyGroups()
        loadStates()
        fetchBranchData()
    }, [])

    const loadCompanies = async (groupId: string[] | number[]) => {
        try {
            // setIsLoading(true);

            const groupIdParam = [`${groupId}`]
            // Modify the API call to include the group ID as a query parameter
            const { data } = await httpClient.get(endpoints.company.getAll(), {
                params: {
                    'group_id[]': groupIdParam, // Add group_id as a query parameter
                },
            })

            if (data?.data) {
                // Filter companies based on group_id
                const formattedCompanies = data.data.map((company: any) => ({
                    label: company.name,
                    value: String(company.id),
                }))

                if (formattedCompanies.length > 0) {
                    setCompanies(formattedCompanies)
                } else {
                    showNotification(
                        'info',
                        'No companies found for this group',
                    )
                    setCompanies([])
                }
            } else {
                setCompanies([])
            }
        } catch (error: any) {
            console.error('Failed to load companies:', error)
            showNotification(
                'error',
                error.response?.data?.message || 'Failed to load companies',
            )
            setCompanies([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (selectedCompanyGroup?.value) {
            setFormData((prev) => ({
                ...prev,
                // Company_Group_Name: selectedCompanyGroup.label,
                // Company_Name: '', // Reset company name when group changes
                group_id: parseInt(selectedCompanyGroup.value),
                // Company_Group_Name: selectedCompanyGroup.label
            }))
            // Reset selected company
            setSelectedCompany(null)

            // Load companies for the selected group
            loadCompanies(selectedCompanyGroup.value)
        } else {
            setCompanies([]) // Reset companies when no group is selected
        }
    }, [selectedCompanyGroup])

    useEffect(() => {
        if (selectedCompany?.value) {
            setFormData((prev) => ({
                ...prev,
                company_id: parseInt(selectedCompany.value),
                // Company_Name: selectedCompany.label
            }))
        }
    }, [selectedCompany])

    const handleSeDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                const base64String = (reader.result as string).split(',')[1]
                setSeDocument(base64String)
                setFormData((prev) => ({
                    ...prev,
                    se_document: base64String,
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleLeaseDocumentUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                const base64String = (reader.result as string).split(',')[1]
                setLeaseDocument(base64String)
                setFormData((prev) => ({
                    ...prev,
                    lease_document: base64String,
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            district: selectedDistrict,
        }))
    }, [selectedDistrict])

    // Update formData when location changes
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            location: selectedLocation,
        }))
    }, [selectedLocation])
    const prevFormData = useRef(formData)

    useEffect(() => {
        prevFormData.current = formData
    }, [formData])

    // Validate a specific field when it changes
    const validateField = async (fieldName: string, value: any) => {
        try {
            await validationSchema.validateAt(fieldName, { [fieldName]: value })
            setErrors((prevErrors) => ({
                ...prevErrors,
                [fieldName]: undefined, // Clear the error for this field
            }))
        } catch (error) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [fieldName]: error.message, // Set the error message for this field
            }))
            console.log(error.message)
        }
    }

    useEffect(() => {
        // //Check validation here only which filed change
        // const validateField = async (fieldName: string, value: any) => {
        //     try {
        //         // Validate the specific field
        //         await validationSchema.validateAt(fieldName, {
        //             [fieldName]: value,
        //         })
        //         console.log(`Validation passed for ${fieldName}:`, value)
        //     } catch (error) {
        //         console.error(
        //             `Validation error for ${fieldName}:`,
        //             error.message,
        //         )
        //     }
        // }
        Object.keys(formData).forEach((field: any) => {
            if (formData[field]) {
                const value = formData[field]
                // Log the field validation if its value has changed
                if (value !== prevFormData[field]) {
                    validateField(field, value)
                }
            }
        })
    }, [formData])
    const validateFormData = async (data: any) => {
        try {
            await validationSchema.validate(data, { abortEarly: false }) // Validate all fields
            setErrors({}) // Clear any previous errors
        } catch (err) {
            const newErrors: any = {}
            err.inner.forEach((error: any) => {
                newErrors[error.path] = error.message // Collect error messages
            })
            console.log(newErrors)
            setErrors(newErrors) // Set errors to display
            return false // Return false to indicate validation failure
        }
        return true // Validation passed
    }
    const handleUpdateBranch = async (values: BranchFormData) => {
        console.log(formData)
        let editdata = {
            ...formData,
            opening_date: formData.opening_date
                ? moment(formData.opening_date).format('YYYY-MM-DD')
                : null,
            se_validity: formData.se_validity
                ? moment(formData.se_validity).format('YYYY-MM-DD')
                : null,
            lease_validity: formData.lease_validity
                ? moment(formData.lease_validity).format('YYYY-MM-DD')
                : null,
            se_document: formData.se_document?.includes('upload')
                ? null
                : formData.se_document,
            lease_document: formData.lease_document?.includes('upload')
                ? null
                : formData.lease_document,
        }

        // Remove specific keys if office_mode is virtual
        if (editdata.office_mode === 'virtual') {
            const { type, office_type, se_status, ...rest } = editdata
            editdata = rest
        }

        //check validation here all
        await validateFormData(editdata) // This validates all fields at once
        const isValid = await validateFormData(editdata)
        console.log(isValid)
        if (!isValid) {
            return // Don't proceed if validation failed
        }

        try {
            setIsSubmitting(true)
            const res = await dispatch(
                updateBranch({
                    id: branchId,
                    data: editdata,
                }),
            )
                .unwrap()
                .catch((error: any) => {
                    throw error
                })

            if (res) {
                navigate('/branch')
                showNotification('success', 'Branch Updated successfully')
            }
        } catch (error: any) {
            const errorMessage = error || 'Failed to Update user'
        } finally {
            setLoading(false)
            setIsSubmitting(false)
        }
    }

    return (
        <div className="p-2 bg-white rounded-lg">
            <div className="flex gap-2 items-center mb-3">
                <Button
                    size="sm"
                    variant="plain"
                    icon={
                        <IoArrowBack className="text-[#72828e] hover:text-[#5d6169]" />
                    }
                    onClick={() => navigate('/branch')}
                />
                <h3 className="text-2xl font-semibold mb-2">Edit Branch</h3>
            </div>
            {/* <p>
                {companyGroups.length},{companies.length},{states.length}
            </p> */}
            {!!companyGroups.length &&
                !!companies.length &&
                !!states.length && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                                <p className="mb-2">
                                    Company Group{' '}
                                    <span className="text-red-500">*</span>
                                </p>
                                {/* <OutlinedSelect
                                isDisabled={true}
                                    label="Company Group"
                                    options={companyGroups}
                                    value={companyGroups.find(
                                        (value) =>
                                            Number(value.value) ==
                                            formData.group_id,
                                    )}
                                    onChange={setSelectedCompanyGroup}
                                /> */}
                                <OutlinedInput
                                    label="Company Group"
                                    value={selectedCompanyGroup?.label}
                                    onChange={() => {}}
                                />
                            </div>
                            <div>
                                <p className="mb-2">
                                    Company Name{' '}
                                    <span className="text-red-500">*</span>
                                </p>
                                <OutlinedSelect
                                    label="Select Company"
                                    options={companies}
                                    value={companies.find(
                                        (value) =>
                                            Number(value.value) ==
                                            formData.company_id,
                                    )}
                                    onChange={(option: SelectOption | null) => {
                                        setSelectedCompany(option)
                                    }}
                                />
                                {errors?.company_id && (
                                    <span className="text-red-500 text-sm">
                                        {errors?.company_id as String}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                                <p className="mb-2">
                                    State{' '}
                                    <span className="text-red-500">*</span>
                                </p>
                                <OutlinedSelect
                                    label="Select State"
                                    options={states}
                                    value={states.find(
                                        (value) =>
                                            Number(value.value) ==
                                            formData.state_id,
                                    )}
                                    onChange={handleStateChange}
                                />
                                {errors?.state_id && (
                                    <span className="text-red-500 text-sm">
                                        {errors?.state_id as String}
                                    </span>
                                )}
                            </div>
                            <div>
                                {/* {JSON.stringify(selectedDistrict)} */}
                                <DistrictAutosuggest
                                    value={selectedDistrict}
                                    onChange={setSelectedDistrict}
                                    stateId={
                                        selectedStates?.value
                                            ? parseInt(selectedStates.value)
                                            : undefined
                                    }
                                    onDistrictSelect={setSelectedDistrictId}
                                />{' '}
                                {errors?.district && (
                                    <span className="text-red-500 text-sm">
                                        {errors?.district as String}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                                <LocationAutosuggest
                                    value={selectedLocation}
                                    // onChange={setSelectedLocation}
                                    onChange={(value: string) => {
                                        setSelectedLocation(value)
                                    }}
                                    districtId={selectedDistrictId}
                                    // districtId={selectedDistrict ? parseInt(selectedDistrict) : undefined}
                                />
                                {errors?.location && (
                                    <span className="text-red-500 text-sm">
                                        {errors?.location as String}
                                    </span>
                                )}
                            </div>

                            <div>
                                <p className="mb-2">
                                    Branch Name{' '}
                                    <span className="text-red-500">*</span>
                                </p>
                                <OutlinedInput
                                    label="Enter Branch Name"
                                    value={formData.name}
                                    onChange={(value: string) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            name: value,
                                        }))
                                    }}
                                />{' '}
                                {errors?.name && (
                                    <span className="text-red-500 text-sm">
                                        {errors?.name as String}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div>
                            <p className="mb-2">
                                Branch Address{' '}
                                <span className="text-red-500">*</span>
                            </p>
                            <OutlinedInput
                                label="Enter Branch Address"
                                value={formData.address}
                                onChange={(value: string) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        address: value,
                                    }))
                                }}
                                textarea={true}
                            />{' '}
                            {errors?.address && (
                                <span className="text-red-500 text-sm">
                                    {errors?.address as String}
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <div>
                                <p className="mb-2">
                                    Branch Opening Date{' '}
                                    <span className="text-red-500">*</span>
                                </p>
                                <DatePicker
                                    size="sm"
                                    value={formData?.opening_date}
                                    placeholder="Pick a Date"
                                    onChange={(date) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            opening_date: date
                                                ? format(date, 'yyyy-MM-dd')
                                                : '',
                                        }))
                                    }}
                                    inputFormat="DD-MM-YYYY" // Changed to uppercase format tokens
                                    yearLabelFormat="YYYY"
                                    monthLabelFormat="MMMM YYYY"
                                />{' '}
                                {errors?.opening_date && (
                                    <span className="text-red-500 text-sm">
                                        {errors?.opening_date as String}
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="mb-2">
                                    Branch Head Count{' '}
                                    <span className="text-red-500">*</span>
                                </p>
                                <OutlinedInput
                                    label="Enter Branch Head Count"
                                    value={formData.head_count}
                                    onChange={(value: string) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            head_count: value,
                                        }))
                                    }}
                                />{' '}
                                {errors?.head_count && (
                                    <span className="text-red-500 text-sm">
                                        {errors?.head_count as String}
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="mb-2">GST Number </p>
                                <OutlinedInput
                                    label="Enter Gst Number"
                                    value={formData.gst_number}
                                    onChange={(value: string) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            gst_number: value,
                                        }))
                                    }}
                                />{' '}
                                {errors?.gst_number && (
                                    <span className="text-red-500 text-sm">
                                        {errors?.gst_number as String}
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="mb-2">
                                    Branch Mode{' '}
                                    <span className="text-red-500">*</span>
                                </p>
                                <OutlinedSelect
                                    label="Select Branch Mode"
                                    options={[
                                        {
                                            value: 'physical',
                                            label: 'Physical',
                                        },
                                        { value: 'virtual', label: 'Virtual' },
                                    ]}
                                    value={{
                                        value: formData.office_mode,
                                        label:
                                            formData.office_mode
                                                .charAt(0)
                                                .toUpperCase() +
                                            formData.office_mode.slice(1),
                                    }}
                                    onChange={(
                                        selectedOption: SelectOption | null,
                                    ) => {
                                        if (
                                            selectedOption?.value === 'virtual'
                                        ) {
                                            const {
                                                se_status,
                                                se_validity,
                                                lease_status,
                                                office_type,
                                                type,
                                                ...rest
                                            } = formData
                                            setFormData({
                                                ...rest,
                                                office_mode: 'virtual',
                                            })
                                        } else {
                                            setFormData((prev) => ({
                                                ...prev,
                                                office_mode: 'physical',
                                            }))
                                        }
                                    }}
                                />
                                {errors?.office_mode && (
                                    <span className="text-red-500 text-sm">
                                        {errors?.office_mode as String}
                                    </span>
                                )}
                            </div>

                            {formData.office_mode === 'physical' && (
                                <>
                                    <div>
                                        <p className="mb-2">
                                            Office Type{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </p>
                                        <OutlinedSelect
                                            label="Select Office Type"
                                            options={officeTypeOption}
                                            value={officeTypeOption.find(
                                                (option) =>
                                                    option.value ===
                                                    formData.office_type,
                                            )}
                                            onChange={(
                                                selectedOption: SelectOption | null,
                                            ) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    office_type:
                                                        selectedOption?.value ||
                                                        '',
                                                }))
                                            }}
                                        />{' '}
                                        {errors?.office_type && (
                                            <span className="text-red-500 text-sm">
                                                {errors?.office_type as String}
                                            </span>
                                        )}
                                    </div>
                                    {formData.office_type === 'other' && (
                                        <div>
                                            <p className="mb-2">
                                                Office Type (Others){' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </p>
                                            <OutlinedInput
                                                label="Enter Office Type (Others)"
                                                value={formData.other_office}
                                                onChange={(value: string) => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        other_office: value,
                                                    }))
                                                }}
                                            />
                                            {errors?.other_office && (
                                                <span className="text-red-500 text-sm">
                                                    {
                                                        errors?.other_office as String
                                                    }
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    <div>
                                        <p className="mb-2">
                                            Branch Type{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </p>
                                        <OutlinedSelect
                                            label="Select Branch Type"
                                            options={branchTypeOptions}
                                            value={branchTypeOptions.find(
                                                (option) =>
                                                    option.value ===
                                                    formData.type,
                                            )}
                                            onChange={(
                                                selectedOption: SelectOption | null,
                                            ) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    type:
                                                        selectedOption?.value ||
                                                        '',
                                                }))
                                            }}
                                        />
                                        {errors?.type && (
                                            <span className="text-red-500 text-sm">
                                                {errors?.type as String}
                                            </span>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                        {formData.type === 'owned' && (
                            <div className="border rounded-md py-4 p-2 mt-4">
                                <div className="flex flex-col gap-8">
                                    <div className="flex justify-between">
                                        <h4>S&E Setup</h4>
                                        {renderDocumentValidityRadio(
                                            seValidityType,
                                            setSeValidityType,
                                            handleSeValidityChange,
                                            'S&E Validity Type',
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <div>
                                            <p className="mb-2">
                                                S&E Registration Status
                                            </p>
                                            <OutlinedSelect
                                                label="Select S&E Registration Status"
                                                options={[
                                                    {
                                                        value: 'valid',
                                                        label: 'Have Valid License',
                                                    },
                                                    {
                                                        value: 'expired',
                                                        label: 'Expired',
                                                    },
                                                    {
                                                        value: 'applied',
                                                        label: 'Applied For',
                                                    },
                                                ]}
                                                value={[
                                                    {
                                                        value: 'valid',
                                                        label: 'Have Valid License',
                                                    },
                                                    {
                                                        value: 'expired',
                                                        label: 'Expired',
                                                    },
                                                    {
                                                        value: 'applied',
                                                        label: 'Applied For',
                                                    },
                                                ].find(
                                                    (v) =>
                                                        formData.se_status ==
                                                        v.value,
                                                )}
                                                onChange={(
                                                    selectedOption: any,
                                                ) => {
                                                    const newStatus =
                                                        selectedOption?.value ||
                                                        'applied'
                                                    setSeRegistrationNumberExists(
                                                        newStatus,
                                                    )

                                                    setFormData((prev) => {
                                                        // Remove lease_document, lease_validity, and lease_status
                                                        const {
                                                            register_number,
                                                            se_validity,
                                                            se_status,
                                                            lease_document,
                                                            lease_validity,
                                                            lease_status,
                                                            ...rest
                                                        } = prev
                                                        return {
                                                            ...rest,
                                                            se_status:
                                                                newStatus,
                                                            se_validity:
                                                                newStatus ===
                                                                'valid'
                                                                    ? ''
                                                                    : '2024-12-31', // ISO 8601 format
                                                            ...(newStatus ===
                                                            'applied'
                                                                ? {}
                                                                : {
                                                                      register_number:
                                                                          '',
                                                                  }),
                                                        }
                                                    })
                                                }}
                                            />
                                            {errors?.se_status && (
                                                <span className="text-red-500 text-sm">
                                                    {
                                                        errors?.se_status as String
                                                    }
                                                </span>
                                            )}
                                        </div>

                                        {(seRegistrationNumberExists ===
                                            'valid' ||
                                            seRegistrationNumberExists ===
                                                'expired') && (
                                            <div>
                                                <p className="mb-2">
                                                    S&E Registration Number
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </p>
                                                <OutlinedInput
                                                    label="Enter S&E Registration Number"
                                                    value={
                                                        formData.register_number ||
                                                        ''
                                                    }
                                                    onChange={(
                                                        value: string,
                                                    ) => {
                                                        setFormData((prev) => {
                                                            // Remove lease_document, lease_validity, and lease_status
                                                            const {
                                                                lease_document,
                                                                lease_validity,
                                                                lease_status,
                                                                ...rest
                                                            } = prev
                                                            return {
                                                                ...rest,
                                                                register_number:
                                                                    value,
                                                            }
                                                        })
                                                    }}
                                                />{' '}
                                                {errors?.register_number && (
                                                    <span className="text-red-500 text-sm">
                                                        {
                                                            errors?.register_number as String
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {seRegistrationNumberExists ===
                                            'valid' &&
                                            seValidityType === 'fixed' && (
                                                <div>
                                                    <p className="mb-2">
                                                        S&E Validity{' '}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </p>
                                                    <DatePicker
                                                        size="sm"
                                                        value={
                                                            formData?.se_validity ||
                                                            null
                                                        }
                                                        placeholder="Pick a Date"
                                                        onChange={(date) => {
                                                            setFormData(
                                                                (prev) => {
                                                                    // Remove lease_document, lease_validity, and lease_status
                                                                    const {
                                                                        lease_document,
                                                                        lease_validity,
                                                                        lease_status,
                                                                        ...rest
                                                                    } = prev
                                                                    return {
                                                                        ...rest,
                                                                        se_validity:
                                                                            date
                                                                                ? format(
                                                                                      date,
                                                                                      'yyyy-MM-dd',
                                                                                  )
                                                                                : '',
                                                                    }
                                                                },
                                                            )
                                                        }}
                                                        inputFormat="DD-MM-YYYY" // Changed to uppercase format tokens
                                                        yearLabelFormat="YYYY"
                                                        monthLabelFormat="MMMM YYYY"
                                                    />
                                                    {errors?.se_validity && (
                                                        <span className="text-red-500 text-sm">
                                                            {
                                                                errors?.se_validity as String
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                        <div>
                                            <div className="flex flex-col gap-2">
                                                <label>
                                                    {seRegistrationNumberExists ===
                                                    'applied'
                                                        ? 'Upload S&E Acknowledgment Copy (Accepted: PDF/Zip/Image, Max 20MB)'
                                                        : 'Upload The S&E Registration Certificate (Accepted: PDF/Zip/Image, Max 20MB)'}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        id="file-upload"
                                                        size="sm"
                                                        type="file"
                                                        accept=".pdf, .zip, .jpg"
                                                        className="py-[5px]"
                                                        onChange={
                                                            handleSeDocumentUpload
                                                        }
                                                    />
                                                    {formData.se_document && (
                                                        <button
                                                            onClick={
                                                                handleDocumentView
                                                            }
                                                            className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0"
                                                            title="View Document"
                                                        >
                                                            <Eye size={20} />
                                                        </button>
                                                    )}
                                                </div>

                                                {errors?.se_document && (
                                                    <span className="text-red-500 text-sm">
                                                        {
                                                            errors?.se_document as String
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {formData.type === 'rented' && (
                            <>
                                <div className="border rounded-md py-4 p-2 mt-4">
                                    <div className="flex flex-col gap-8">
                                        <div className="flex justify-between">
                                            <h4>Lease / Rent Setup</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <div>
                                                <p className="mb-2">
                                                    Lease deed / Rent Agreement
                                                    Status
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </p>
                                                <OutlinedInput
                                                    label="Status"
                                                    value={
                                                        formData.lease_status ===
                                                        'inactive'
                                                            ? 'Expired'
                                                            : 'Active'
                                                    }
                                                    onChange={(
                                                        value: string,
                                                    ) => {
                                                        setFormData(
                                                            (prevData) => ({
                                                                ...prevData,
                                                                lease_status:
                                                                    value.toLowerCase() ===
                                                                    'expired'
                                                                        ? 'inactive'
                                                                        : 'active',
                                                            }),
                                                        )
                                                    }}
                                                />
                                                {errors?.lease_status && (
                                                    <span className="text-red-500 text-sm">
                                                        {
                                                            errors?.lease_status as String
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                            {leaseValidityType === 'fixed' && (
                                                <div>
                                                    <p className="mb-2">
                                                        Lease deed / Rent
                                                        Agreement valid up to
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </p>
                                                    <DatePicker
                                                        value={
                                                            formData?.lease_validity
                                                        }
                                                        size="sm"
                                                        placeholder="Pick a Date"
                                                        onChange={
                                                            handleLeaseValidityChange
                                                        }
                                                        inputFormat="DD-MM-YYYY" // Changed to uppercase format tokens
                                                        yearLabelFormat="YYYY"
                                                        monthLabelFormat="MMMM YYYY"
                                                    />
                                                    {errors?.lease_validity && (
                                                        <span className="text-red-500 text-sm">
                                                            {
                                                                errors?.lease_validity as String
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            <div>
                                                <div className="flex flex-col gap-4">
                                                    <label>
                                                        Upload Lease deed copy
                                                        (Accepted:
                                                        PDF/Zip/Image, Max 20MB)
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </label>
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            id="file-upload"
                                                            type="file"
                                                            accept=".pdf, .zip, .jpg"
                                                            onChange={
                                                                handleLeaseDocumentUpload
                                                            }
                                                        />{' '}
                                                        {formData.lease_document && (
                                                            <button
                                                                onClick={
                                                                    handleLeaseDocumentView
                                                                }
                                                                className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0"
                                                                title="View Document"
                                                            >
                                                                <Eye
                                                                    size={20}
                                                                />
                                                            </button>
                                                        )}
                                                    </div>
                                                    {errors?.lease_document && (
                                                        <span className="text-red-500 text-sm">
                                                            {
                                                                errors?.lease_document as String
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Modified S&E Setup section */}
                                <div className="border rounded-md py-4 p-2 mt-4">
                                    <div className="flex flex-col gap-8">
                                        <div className="flex justify-between">
                                            <h4>S&E Setup</h4>
                                            {renderDocumentValidityRadio(
                                                seValidityType,
                                                setSeValidityType,
                                                handleSeValidityChange,
                                                'S&E Validity Type',
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <div>
                                                <p className="mb-2">
                                                    S&E Registration Status
                                                </p>
                                                <OutlinedSelect
                                                    label="Select S&E Registration Status"
                                                    options={[
                                                        {
                                                            value: 'valid',
                                                            label: 'Have Valid License',
                                                        },
                                                        {
                                                            value: 'expired',
                                                            label: 'Expired',
                                                        },
                                                        {
                                                            value: 'applied',
                                                            label: 'Applied For',
                                                        },
                                                    ]}
                                                    value={
                                                        seRegistrationNumberExists ===
                                                        'valid'
                                                            ? {
                                                                  value: 'valid',
                                                                  label: 'Have Valid License',
                                                              }
                                                            : seRegistrationNumberExists ===
                                                                'expired'
                                                              ? {
                                                                    value: 'expired',
                                                                    label: 'Expired',
                                                                }
                                                              : {
                                                                    value: 'applied',
                                                                    label: 'Applied For',
                                                                }
                                                    }
                                                    onChange={(
                                                        selectedOption: any,
                                                    ) => {
                                                        const newStatus =
                                                            selectedOption?.value ||
                                                            'applied'
                                                        setSeRegistrationNumberExists(
                                                            newStatus,
                                                        )

                                                        setFormData((prev) => {
                                                            const {
                                                                register_number,
                                                                se_validity,
                                                                se_status,
                                                                ...rest
                                                            } = prev
                                                            return {
                                                                ...rest,
                                                                se_status:
                                                                    newStatus, // Add se_status here
                                                                ...(newStatus ===
                                                                'applied'
                                                                    ? {}
                                                                    : {
                                                                          register_number:
                                                                              '',
                                                                          se_validity:
                                                                              '',
                                                                      }),
                                                            }
                                                        })
                                                    }}
                                                />
                                                {errors?.se_status && (
                                                    <span className="text-red-500 text-sm">
                                                        {
                                                            errors?.se_status as String
                                                        }
                                                    </span>
                                                )}
                                            </div>

                                            {(seRegistrationNumberExists ===
                                                'valid' ||
                                                seRegistrationNumberExists ===
                                                    'expired') && (
                                                <div>
                                                    <p className="mb-2">
                                                        S&E Registration Number
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </p>
                                                    <OutlinedInput
                                                        label="Enter S&E Registration Number"
                                                        value={
                                                            formData.register_number ||
                                                            ''
                                                        }
                                                        onChange={(
                                                            value: string,
                                                        ) => {
                                                            setFormData(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    register_number:
                                                                        value,
                                                                }),
                                                            )
                                                        }}
                                                    />{' '}
                                                    {errors?.register_number && (
                                                        <span className="text-red-500 text-sm">
                                                            {
                                                                errors?.register_number as String
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {seRegistrationNumberExists ===
                                                'valid' &&
                                                seValidityType === 'fixed' && (
                                                    <div>
                                                        <p className="mb-2">
                                                            S&E Validity{' '}
                                                            <span className="text-red-500">
                                                                *
                                                            </span>
                                                        </p>
                                                        <DatePicker
                                                            size="sm"
                                                            value={
                                                                formData?.se_validity
                                                            }
                                                            placeholder="Pick a Date"
                                                            onChange={(
                                                                date,
                                                            ) => {
                                                                setFormData(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        se_validity:
                                                                            date
                                                                                ? format(
                                                                                      date,
                                                                                      'yyyy-MM-dd',
                                                                                  )
                                                                                : '',
                                                                    }),
                                                                )
                                                            }}
                                                            inputFormat="DD-MM-YYYY" // Changed to uppercase format tokens
                                                            yearLabelFormat="YYYY"
                                                            monthLabelFormat="MMMM YYYY"
                                                        />{' '}
                                                        {errors?.se_validity && (
                                                            <span className="text-red-500 text-sm">
                                                                {
                                                                    errors?.se_validity as String
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                            <div>
                                                <div className="flex flex-col gap-2">
                                                    <label>
                                                        {seRegistrationNumberExists ===
                                                        'applied'
                                                            ? 'Upload S&E Acknowledgment Copy (Accepted: PDF/Zip/Image, Max 20MB)'
                                                            : 'Upload The S&E Registration Certificate  (Accepted: PDF/Zip/Image, Max 20MB)'}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>{' '}
                                                        {}
                                                    </label>
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            id="file-upload"
                                                            size="sm"
                                                            type="file"
                                                            accept=".pdf, .zip, .jpg"
                                                            className="py-[5px]"
                                                            onChange={
                                                                handleSeDocumentUpload
                                                            }
                                                        />
                                                        {formData.se_document && (
                                                            <button
                                                                onClick={
                                                                    handleDocumentView
                                                                }
                                                                className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0"
                                                                title="View Document"
                                                            >
                                                                <Eye
                                                                    size={20}
                                                                />
                                                            </button>
                                                        )}
                                                    </div>
                                                    {errors?.se_document && (
                                                        <span className="text-red-500 text-sm">
                                                            {
                                                                errors?.se_document as String
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* <div className="border rounded-md py-4 p-2 mt-4">
                    <div className="flex flex-col gap-4">
                        <h6>Custom Fields</h6>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <div className="w-full">
                                <OutlinedInput
                                    label="Remark"
                                    value={formData.custom_data.remark}
                                    onChange={(value: string) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            remark: value,
                                        }))
                                    }}
                                />
                                {errors['custom_data.remark'] && (
                                    <span className="text-red-500 text-sm">
                                        {errors['custom_data.remark']}
                                    </span>
                                )}
                            </div>
                            <div className="w-full">
                                <OutlinedInput
                                    label="Email"
                                    value={formData.custom_data.email}
                                    onChange={(value: string) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            email: value,
                                        }))
                                    }}
                                />{' '}
                                {errors['custom_data.email'] && (
                                    <span className="text-red-500 text-sm">
                                        {errors['custom_data.email']}
                                    </span>
                                )}
                            </div>
                            <div className="w-full">
                                <OutlinedInput
                                    label="Mobile"
                                    value={formData.custom_data.mobile}
                                    onChange={(value: string) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            mobile: value,
                                        }))
                                    }}
                                />{' '}
                                {errors['custom_data.mobile'] && (
                                    <span className="text-red-500 text-sm">
                                        {errors['custom_data.mobile']}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div> */}

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="plain"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="solid"
                                loading={isSubmitting}
                                onClick={handleUpdateBranch}
                            >
                                Confirm
                            </Button>
                        </div>
                    </div>
                )}
        </div>
    )
}

export default AddBranchForm
