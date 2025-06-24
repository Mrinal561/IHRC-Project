import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
    Button,
    Notification,
    toast,
    DatePicker,
    Select
} from '@/components/ui'
import { IoArrowBack } from 'react-icons/io5'
import OutlinedSelect from '@/components/ui/Outlined'
import OutlinedInput from '@/components/ui/OutlinedInput'
import { AppDispatch } from '@/store'
import * as yup from 'yup'
import { Formik, Field, Form } from 'formik'
import OutlinedPasswordInput from '@/components/ui/OutlinedInput/OutlinedPasswordInput'
import { MultiValue } from 'react-select'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import { createAuditor } from '@/store/slices/auditorEntity/AuditorEntitySlice'

interface LocationState {
    companyName?: string
    companyId?: string
    groupId?: string
}

interface AuditorFormData {
    group_id: number
    company_id: number
    firm_name: string
    name: string
    email: string
    password: string
    mobile: string
    audit_frequency: 'monthly' | 'quarterly' | 'half_yearly' | 'yearly'
}

interface SelectOption {
    value: string
    label: string
}

const auditorValidationSchema = yup.object().shape({
    company_id: yup
        .number()
        .required('Company is required')
        .min(1, 'Please select a company'),
    firm_name: yup
        .string()
        .required('Firm name is required')
        .min(2, 'Firm name must be at least 2 characters'),
    name: yup
        .string()
        .required('Auditor name is required')
        .min(2, 'Name must be at least 2 characters'),
    email: yup
        .string()
        .email('Invalid email address')
        .required('Email is required'),
    password: yup
        .string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            'Must include A-Z, a-z, 0-9, @$!%*?& (Weak Password)',
        ),
    mobile: yup
        .string()
        .required('Mobile number is required')
        .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
    audit_frequency: yup
        .string()
        .required('Audit frequency is required')
        .oneOf(['monthly', 'quarterly', 'half_yearly', 'yearly'], 'Invalid audit frequency'),
})

const AuditorAddForm = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const location = useLocation()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const locationState = location.state as LocationState
    const companyName = locationState?.companyName
    const companyId = locationState?.companyId
    const groupId = locationState?.groupId

    const [companies, setCompanies] = useState<SelectOption[]>([])
    const [selectedCompany, setSelectedCompany] = useState<SelectOption | null>(null)

    const auditFrequencyOptions = [
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'half_yearly', label: 'Half Yearly' },
        { value: 'yearly', label: 'Yearly' }
    ]

    const handleAddAuditor = async (values: AuditorFormData) => {
    try {
        setIsSubmitting(true);
        
        // Replace the Redux dispatch with direct HTTP call
        const response = await httpClient.post(
            endpoints.auditor.auditorCreate(), // Make sure you have this endpoint defined
            {
                ...values,
                group_id: Number(groupId),
                company_id: Number(values.company_id)
            }
        );

        if (response.data) {
            navigate('/auditor-entity');
            toast.push(
                <Notification title="Success" type="success">
                    Auditor created successfully
                </Notification>
            );
        }
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || 'Failed to create auditor';
        toast.push(
            <Notification title="Error" type="error">
                {errorMessage}
            </Notification>
        );
    } finally {
        setIsSubmitting(false);
    }
};

    const loadCompanies = async (groupId: string) => {
        try {
            const response = await httpClient.get(endpoints.company.getAll(), {
                params: {
                    'group_id[]': groupId
                }
            })
            const formattedCompanies = response.data?.data?.map((company: any) => ({
                label: company.name,
                value: String(company.id),
            }))
            setCompanies(formattedCompanies || [])
        } catch (error) {
            console.error('Failed to load companies:', error)
            toast.push(
                <Notification title="Error" type="error">
                    Failed to load companies
                </Notification>
            )
        }
    }

    useEffect(() => {
        if (groupId) {
            loadCompanies(groupId)
        }
    }, [groupId])

    return (
        <div className="p-2 bg-white rounded-lg">
            <div className="flex items-center gap-2 mb-3">
                <Button
                    size="sm"
                    variant="plain"
                    icon={<IoArrowBack className="text-[#72828e] hover:text-[#5d6169]" />}
                    onClick={() => navigate('/auditor-entity')}
                />
                <h3 className="text-2xl font-semibold">Add Auditor</h3>
            </div>

            <Formik
                initialValues={{
                    group_id: groupId ? Number(groupId) : 0,
                    company_id: 0,
                    firm_name: '',
                    name: '',
                    email: '',
                    password: '',
                    mobile: '',
                    audit_frequency: 'monthly'
                }}
                validationSchema={auditorValidationSchema}
                onSubmit={handleAddAuditor}
            >
                {({ setFieldValue, values, errors, touched }) => (
                    <Form>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-8">
                            {/* Company (Read-only) */}
                            {/* <div className="flex flex-col gap-2">
                                <p className="mb-2">Company</p>
                                <input
                                    type="text"
                                    value={companyName}
                                    disabled
                                    className="p-2 border rounded"
                                />
                            </div> */}

                            {/* Select Company */}
                            <div className="flex flex-col gap-2">
                                <p className="mb-2">
                                    Select Company <span className="text-red-500">*</span>
                                </p>
                                <Field name="company_id">
                                    {({ field }: any) => (
                                        <OutlinedSelect
                                            label="Select Company"
                                            options={companies}
                                            value={companies.find(
                                                (company) => Number(company.value) === values.company_id
                                            )}
                                            onChange={(selectedOption: SelectOption | null) => {
                                                setFieldValue(
                                                    'company_id',
                                                    selectedOption ? selectedOption.value : null
                                                )
                                            }}
                                            isMulti={false}
                                        />
                                    )}
                                </Field>
                                {touched.company_id && errors.company_id && (
                                    <span className="text-red-500 text-sm">
                                        {errors.company_id}
                                    </span>
                                )}
                            </div>

                            {/* Firm Name */}
                            <div className="flex flex-col gap-2">
                                <p className="mb-2">
                                    Firm Name <span className="text-red-500">*</span>
                                </p>
                                <Field
                                    name="firm_name"
                                    render={({ field }) => (
                                        <OutlinedInput
                                            {...field}
                                            label="Enter Firm Name"
                                            value={values.firm_name}
                                            onChange={(value: string) =>
                                                setFieldValue('firm_name', value)
                                            }
                                            error={touched.firm_name && errors.firm_name}
                                        />
                                    )}
                                />
                                {touched.firm_name && errors.firm_name && (
                                    <span className="text-red-500 text-sm">
                                        {errors.firm_name}
                                    </span>
                                )}
                            </div>

                            {/* Auditor Name */}
                            <div className="flex flex-col gap-2">
                                <p className="mb-2">
                                    Auditor Name <span className="text-red-500">*</span>
                                </p>
                                <Field
                                    name="name"
                                    render={({ field }) => (
                                        <OutlinedInput
                                            {...field}
                                            label="Enter Auditor Name"
                                            value={values.name}
                                            onChange={(value: string) =>
                                                setFieldValue('name', value)
                                            }
                                            error={touched.name && errors.name}
                                        />
                                    )}
                                />
                                {touched.name && errors.name && (
                                    <span className="text-red-500 text-sm">
                                        {errors.name}
                                    </span>
                                )}
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-2">
                                <p className="mb-2">
                                    Email <span className="text-red-500">*</span>
                                </p>
                                <Field
                                    name="email"
                                    render={({ field }) => (
                                        <OutlinedInput
                                            {...field}
                                            label="Enter Email"
                                            value={values.email}
                                            onChange={(value: string) =>
                                                setFieldValue('email', value)
                                            }
                                            error={touched.email && errors.email}
                                        />
                                    )}
                                />
                                {touched.email && errors.email && (
                                    <span className="text-red-500 text-sm">
                                        {errors.email}
                                    </span>
                                )}
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-2">
                                <p className="mb-2">
                                    Password <span className="text-red-500">*</span>
                                </p>
                                <Field
                                    name="password"
                                    render={({ field }) => (
                                        <OutlinedPasswordInput
                                            {...field}
                                            label="Enter Password"
                                            value={values.password}
                                            onChange={(value: string) =>
                                                setFieldValue('password', value)
                                            }
                                            error={touched.password && errors.password}
                                        />
                                    )}
                                />
                                {touched.password && errors.password && (
                                    <span className="text-red-500 text-sm">
                                        {errors.password}
                                    </span>
                                )}
                            </div>

                            {/* Mobile */}
                            <div className="flex flex-col gap-2">
                                <p className="mb-2">
                                    Mobile <span className="text-red-500">*</span>
                                </p>
                                <Field
                                    name="mobile"
                                    render={({ field }) => (
                                        <OutlinedInput
                                            {...field}
                                            label="Enter Mobile"
                                            value={values.mobile}
                                            onChange={(value: string) =>
                                                setFieldValue('mobile', value)
                                            }
                                            error={touched.mobile && errors.mobile}
                                        />
                                    )}
                                />
                                {touched.mobile && errors.mobile && (
                                    <span className="text-red-500 text-sm">
                                        {errors.mobile}
                                    </span>
                                )}
                            </div>

                            {/* Audit Frequency */}
                            <div className="flex flex-col gap-2">
                                <p className="mb-2">
                                    Audit Frequency <span className="text-red-500">*</span>
                                </p>
                                <Field name="audit_frequency">
                                    {({ field }: any) => (
                                        <Select
                                            size="sm"
                                            options={auditFrequencyOptions}
                                            value={auditFrequencyOptions.find(
                                                (option) => option.value === values.audit_frequency
                                            )}
                                            onChange={(selectedOption: SelectOption | null) => {
                                                setFieldValue(
                                                    'audit_frequency',
                                                    selectedOption ? selectedOption.value : null
                                                )
                                            }}
                                        />
                                    )}
                                </Field>
                                {touched.audit_frequency && errors.audit_frequency && (
                                    <span className="text-red-500 text-sm">
                                        {errors.audit_frequency}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button
                                variant="plain"
                                onClick={() => navigate(-1)}
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" variant="solid" loading={isSubmitting}>
                                Confirm
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AuditorAddForm