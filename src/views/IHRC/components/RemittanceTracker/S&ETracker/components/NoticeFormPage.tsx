import React, { useState, useEffect } from 'react'
import { Button, DatePicker, Input } from '@/components/ui'
import OutlinedInput from '@/components/ui/OutlinedInput'
import DistrictAutosuggest from '../../../Entity/ESICSetup/components/DistrictAutoSuggest'
import LocationAutosuggest from '../../../Entity/Branch/components/LocationAutosuggest'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import { toast, Notification } from '@/components/ui'
import OutlinedSelect from '@/components/ui/Outlined/Outlined'
import { useDispatch } from 'react-redux'
import { createNotice } from '@/store/slices/noticeTracker/noticeTrackerSlice'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
import NoticeTypeAutosuggest from './NoticeTypeAutosuggest'
import NoticeActAutosuggest from './NoticeActAutosuggest'
import * as Yup from 'yup'
interface SelectOption {
    value: string
    label: string
}

interface FormErrors {
    [key: string]: string
}

interface ValidationError {
  path: string
  message: string
}

// Validation Schema
const validationSchema = Yup.object().shape({
    
    company_id: Yup.number()
        .required('Company is required')
        .min(1, 'Please select a valid company'),
    state_id: Yup.string()
        .required('State is required'),
    district_id: Yup.number()
        .required('District is required')
        .min(1, 'District must be at least 2 characters'),
    location: Yup.string()
        .required('Location is required')
        .trim()
        .min(2, 'Location must be at least 2 characters'),
    notice_type: Yup.string()
        .required('Notice type is required')
        .trim(),
    notice_date: Yup.date()
        .required('Notice date is required')
        .max(new Date(), 'Future dates are not allowed')
        .nullable(),
    reference_number: Yup.string()
        .required('Reference number is required')
        .trim()
        .min(3, 'Reference number must be at least 3 characters'),
    related_act: Yup.string()
        .required('Related act is required')
        .trim(),
    notice_document: Yup.string()
        .required('Notice document is required'),
    notice_detail: Yup.string()
        .required('Notice details are required')
        .trim(),
    criticality: Yup.string()
        .required('Criticality is required')
        .oneOf(['high', 'medium', 'low'], 'Invalid criticality value'),
})     

const NoticeFormPage = ({ onSuccess }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [errors, setErrors] = useState<FormErrors>({})
    const [companyGroups, setCompanyGroups] = useState<string>('')
    const [companies, setCompanies] = useState<SelectOption[]>([])
    const [selectedCompany, setSelectedCompany] = useState<SelectOption | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [states, setStates] = useState<SelectOption[]>([])
    const [selectedStates, setSelectedStates] = useState<SelectOption | null>(null)
    const [selectedCriticality, setSelectedCriticality] = useState<SelectOption | null>(null)
    const [branches, setBranches] = useState<SelectOption[]>([])
    const [selectedBranch, setSelectedBranch] = useState<SelectOption | null>(null)


    const [selectedDistrict, setSelectedDistrict] = useState<{
        id: number | null
        name: string
    }>({
        id: null,
        name: '',
    })
    const [fileBase64, setFileBase64] = useState<string>('')
    const [selectedDistrictId, setSelectedDistrictId] = useState<number | undefined>()
    const [selectedLocation, setSelectedLocation] = useState('')

    const initialFormData = {
        group_id: 0,
        company_id: 0,
        companyGroupName: '',
        entityName: '',
        state_id: '',
        district_id: 0,
        branch_id: null,
        location: '',
        notice_type: '',
        notice_date: null,
        reference_number: '',
        related_act: '',
        notice_document: null,
        notice_detail: '',
        criticality: '',
    }

    const [formData, setFormData] = useState(initialFormData)

    useEffect(() => {
        loadCompanyGroups()
        loadStates()
    }, [])

    const criticalityOptions = [
        {value: 'high', label: 'High'},
        {value: 'medium', label: 'Medium'},
        {value: 'low', label: 'Low'}
    ]

    const loadBranches = async (companyId: string) => {
        try {
            const { data } = await httpClient.get(endpoints.branch.getAllBranch(), {
                params: { 'company_id[]': companyId }
            })
            const formattedBranches = data?.data?.map((branch: any) => ({
                label: `${branch.name} (${branch.Location?.name}/${branch.District?.name}/${branch.State?.name})`,
                value: String(branch.id),
                displayValue: branch.name 
            }))
            setBranches(formattedBranches || [])
        } catch (error) {
            showError('Failed to load branches')
        }
    }



    const loadCompanyGroups = async () => {
        try {
            const { data } = await httpClient.get(endpoints.companyGroup.getAll(), {
                params: { ignorePlatform: true },
            })
            if (data.data && data.data.length > 0) {
                const defaultGroup = data.data[0]
                setCompanyGroups(defaultGroup.name)
                setFormData((prev) => ({
                    ...prev,
                    group_id: defaultGroup.id,
                }))
                loadCompanies(defaultGroup.id)
            }
        } catch (error) {
            showError('Failed to load company groups')
        }
    }

    const loadCompanies = async (groupId: string) => {
        try {
            const { data } = await httpClient.get(endpoints.company.getAll(), {
                params: { 'group_id[]': groupId },
            })
            const formattedCompanies = data?.data?.map((company: any) => ({
                label: company.name,
                value: String(company.id),
            }))
            setCompanies(formattedCompanies || [])
        } catch (error) {
            showError('Failed to load companies')
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
            showError('Failed to load states')
        } finally {
            setIsLoading(false)
        }
    }

    const showError = (message: string) => {
        toast.push(
            <Notification title="Error" type="error" duration={5000} closable={true}>
                {message}
            </Notification>
        )
    }

    const handleStateChange = (option: SelectOption | null) => {
        setSelectedStates(option)
        setSelectedDistrict({ id: null, name: '' })
        setSelectedLocation('')
        setFormData((prev) => ({
            ...prev,
            state_id: option?.value || '',
            district_id: 0,
            location: '',
        }))
        setErrors((prev) => ({
            ...prev,
            state_id: '',
            district_id: '',
            location: '',
        }))
    }

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
        // Clear error when field is changed
        setErrors((prev) => ({
            ...prev,
            [field]: '',
        }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 20 * 1024 * 1024) { // 20MB limit
                showError('File size should not exceed 20MB')
                return
            }
            const reader = new FileReader()
            reader.onload = () => {
                const base64String = (reader.result as string).split(',')[1]
                setFileBase64(base64String)
                setFormData((prev) => ({
                    ...prev,
                    notice_document: base64String,
                }))
                setErrors((prev) => ({
                    ...prev,
                    notice_document: '',
                }))
            }
            reader.readAsDataURL(file)
        }
    }

  //   const showErrors = (errors: FormErrors) => {
  //     const errorMessages = Object.values(errors);
  //     if (errorMessages.length > 0) {
  //         const errorMessagesList = errorMessages.join('\n• ');
  //         toast.push(
  //             <Notification title="Validation Errors" type="error" duration={5000}>
  //                 <div className="whitespace-pre-line">
  //                     • {errorMessagesList}
  //                 </div>
  //             </Notification>
  //         );
  //     }
  // };
  

  const validateForm = async () => {
    try {
        await validationSchema.validate(formData, { abortEarly: false });
        setErrors({});
        return true;
    } catch (error) {
        if (error instanceof Yup.ValidationError) {
            const newErrors: FormErrors = {};
            
            // Collect all validation errors
            error.inner.forEach((err) => {
                if (err.path) {
                    newErrors[err.path] = err.message;
                }
            });
            
            // Set all errors in state
            setErrors(newErrors);
            
            // Show all errors in toast notification
            // showErrors(newErrors);
        } else {
            console.error('Validation error:', error);
          
        }
        return false;
    }
};

    const handleSubmit = async () => {
        const isValid = await validateForm()
        if (!isValid) return

        try {
            setIsLoading(true)
            const resultAction = await dispatch(createNotice(formData)).unwrap()
            if (resultAction) {
                toast.push(
                    <Notification title="Success" type="success" closable={true}>
                        Notice uploaded successfully
                    </Notification>
                )
                onSuccess?.()
                navigate(-1)
            }
        } catch (error) {
            showError('Failed to submit notice')
        } finally {
            setIsLoading(false)
        }
    }

    const showFieldError = (fieldName: string) => {
        return errors[fieldName] ? (
            <span className="text-red-500 text-sm mt-1">{errors[fieldName]}</span>
        ) : null
    }

    return (
        <div className="w-full mx-auto p-2 bg-white rounded-lg">
            <div className="flex gap-2 items-center mb-3">
                <Button
                    size="sm"
                    variant="plain"
                    icon={<IoArrowBack className="text-gray-500 hover:text-gray-700" />}
                    onClick={() => navigate(-1)}
                />
                <h3 className="text-2xl font-semibold">Add Notice Details</h3>
            </div>

            <div className="space-y-6">
                {/* Company Group and Company */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Company Group <span className="text-red-500">*</span>
                        </label>
                        <OutlinedInput
                            label="Company Group"
                            value={companyGroups}
                            onChange={() => {}}
                        />
                        {showFieldError('group_id')}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Company <span className="text-red-500">*</span>
                        </label>
                        <OutlinedSelect
                            label="Select Company"
                            options={companies}
                            value={selectedCompany}
                            onChange={(option: SelectOption | null) => {
                                setSelectedCompany(option)
                                handleChange('company_id', option?.value ? parseInt(option.value) : 0)
                                if (option?.value) {
                                    loadBranches(option.value)
                                } else {
                                    setBranches([])
                                    setSelectedBranch(null)
                                    handleChange('branch_id', null)
                                }
                            }}
                        />
                        {showFieldError('company_id')}
                    </div>
                </div>

                {/* Location Details */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            State <span className="text-red-500">*</span>
                        </label>
                        <OutlinedSelect
                            label="Select State"
                            options={states}
                            value={selectedStates}
                            onChange={handleStateChange}
                        />
                        {showFieldError('state_id')}
                    </div>
                    <div className="space-y-2">
                        <DistrictAutosuggest
                            value={selectedDistrict}
                            onChange={(district) => {
                                setSelectedDistrict(district)
                                handleChange('district_id', district.id || 0)
                            }}
                            stateId={selectedStates?.value ? parseInt(selectedStates.value) : undefined}
                            onDistrictSelect={setSelectedDistrictId}
                        />
                        {showFieldError('district_id')}
                    </div>
                    <div className="space-y-2">
                        <LocationAutosuggest
                            value={selectedLocation}
                            onChange={(location: string) => {
                                setSelectedLocation(location)
                                handleChange('location', location)
                            }}
                            districtId={selectedDistrictId}
                        />
                        {showFieldError('location')}
                    </div>
                </div>

                {/* Notice Type and Date */}
                <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Branch
                        </label>
                        <OutlinedSelect
                            label="Select Branch"
                            options={branches}
                            value={selectedBranch}
                            onChange={(option: SelectOption | null) => {
                                setSelectedBranch(option)
                                handleChange('branch_id', option?.value ? parseInt(option.value) : null)
                            }}
                            // isDisabled={!formData.company_id || branches.length === 0}
                        />
                    </div>

                    <div className="space-y-2">
                        <NoticeTypeAutosuggest
                            value={formData.notice_type}
                            onChange={(value) => handleChange('notice_type', value)}
                            onNoticeTypeSelect={(id) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    notice_type_id: id,
                                }))
                            }}
                            isDisabled={isLoading}
                        />
                        {showFieldError('notice_type')}
                    </div>
                   
                </div>

                {/* Reference Number, Act, and Document */}
                <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Criticality <span className="text-red-500">*</span>
                    </label>
                    <OutlinedSelect
                        label="Select Criticality"
                        options={criticalityOptions}
                        value={selectedCriticality}
                        onChange={(option: SelectOption | null) => {
                            setSelectedCriticality(option)
                            handleChange('criticality', option?.value || '')
                        }}
                    />
                    {showFieldError('criticality')}
                </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Notice Date <span className="text-red-500">*</span>
                        </label>
                        <DatePicker
                            clearable
                            size="sm"
                            placeholder="Select Date"
                            value={formData.notice_date}
                            onChange={(date) => handleChange('notice_date', date)}
                            inputFormat="DD-MM-YYYY"
                            yearLabelFormat="YYYY"
                            monthLabelFormat="MMMM YYYY"
                            maxDate={new Date()}
                        />
                        {showFieldError('notice_date')}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Letter/Notice reference number <span className="text-red-500">*</span>
                        </label>
                        <OutlinedInput
                            label="Reference Number"
                            value={formData.reference_number}
                            onChange={(value) => handleChange('reference_number', value)}
                        />
                        {showFieldError('reference_number')}
                    </div>
                   
                </div>
                <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                        <NoticeActAutosuggest
                            value={formData.related_act}
                            onChange={(value) => handleChange('related_act', value)}
                            onNoticeActSelect={(id) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    notice_act_id: id,
                                }))
                            }}
                            isDisabled={isLoading}
                        />
                        {showFieldError('related_act')}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Notice Copy (PDF/Zip/Image, Max 20MB) <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full"
                            accept=".pdf,.jpg,.zip,.jpeg,.png"
                        />
                        {showFieldError('notice_document')}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Details of Notice <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        className={`w-full p-2 border rounded-md h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.notice_detail ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={formData.notice_detail}
                        onChange={(e) => handleChange('notice_detail', e.target.value)}
                        placeholder="Enter notice details..."
                    />
                    {showFieldError('notice_detail')}
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
                <Button
                    type="button"
                    variant="plain"
                    onClick={() => {
                        if (window.confirm('Are you sure you want to cancel? All changes will be lost.')) {
                            navigate(-1)
                        }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="solid"
                    onClick={handleSubmit}
                    loading={isLoading}
                    disabled={isLoading}
                >
                    Confirm
                </Button>
            </div>
        </div>
    )
}

export default NoticeFormPage

