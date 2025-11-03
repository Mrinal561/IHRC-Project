import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
    Button,
    Checkbox,
    toast,
    Notification,
    DatePicker,
    Select,
    Spinner
} from '@/components/ui'
import { IoArrowBack } from 'react-icons/io5'
import OutlinedSelect from '@/components/ui/Outlined'
import OutlinedInput from '@/components/ui/OutlinedInput'
import { AppDispatch } from '@/store'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import {
    createUser,
    fetchUserById,
    updateUser,
} from '@/store/slices/userEntity/UserEntitySlice'
import * as yup from 'yup'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { showErrorNotification } from '@/components/ui/ErrorMessage/ErrorMessage'
import { MultiValue } from 'react-select'

interface LocationState {
    userId: any
    companyName?: string
    companyId?: string
}

interface UserFormData {
    branch_id: any
    group_id: number
    company_id: number
    name: string
    email: string
    mobile: string
    joining_date: any
    role_id: number
    aadhar_no: string
    pan_card: string
    auth_signatory: boolean
    suspend: boolean
    disable: boolean
}

interface SelectOption {
    value: string
    label: string
}

interface UserDetails {
    id?: number
    name?: string
    group_id?: number
    company_id?: number
    joining_date?: any
    role_id?: number
    auth_signatory?: boolean
    suspend?: boolean
    disable?: boolean
    email?: string
    mobile?: string
    branch_id?: number[]
    aadhar_no?: string
    pan_card?: string
}

const userValidationSchema = yup.object().shape({
    company_id: yup
        .number()
        .required('Company is required')
        .min(1, 'Please select a company'),
    name: yup
        .string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters')
        .matches(
            /^\S.*\S$|^\S$/,
            'The input must not have leading or trailing spaces',
        ),
    email: yup
        .string()
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|gov)$/,
            'Invalid email address.',
        )
        .required('Email is required'),
    mobile: yup
        .string()
        .required('Mobile number is required')
        .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
    joining_date: yup.string().required('Joining date is required').test(
        'is-not-future-date',
        'Opening date cannot be a future date',
        function (value) {
            if (!value) return true
            const selectedDate = new Date(value)
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            return selectedDate <= today
        }
    ),
    role_id: yup
        .number()
        .required('Designation is required')
        .min(1, 'Please select a designation'),
    aadhar_no: yup
        .string()
        .nullable()
        .transform((value) => (value === '' ? null : value))
        .notRequired()
        .matches(/^[0-9]{12}$/, 'Aadhar number must be 12 digits'),
    pan_card: yup
        .string()
        .nullable()
        .transform((value) => (value === '' ? null : value))
        .notRequired()
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
    auth_signatory: yup.boolean(),
    suspend: yup.boolean(),
    disable: yup.boolean(),
})

const UserEditForm = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const location = useLocation()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const locationState = location.state as LocationState
    const companyName = locationState?.companyName
    const companyId = locationState?.companyId
    const userId = locationState?.userId
    
    const [companies, setCompanies] = useState<SelectOption[]>([])
    const [userRole, setUserRole] = useState<SelectOption[]>([])
    const [editedData, setEditedData] = useState<UserDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [branches, setBranches] = useState<SelectOption[]>([])

    const formatInitialDate = (dateString: any): Date | null => {
        if (!dateString) return null
        const date = new Date(dateString)
        return isNaN(date.getTime()) ? null : date
    }

    const showNotification = (
        type: 'success' | 'info' | 'danger' | 'warning' | 'error',
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

    const loadBranches = async (companyId: string) => {
        try {
            const { data } = await httpClient.get(endpoints.branch.getAllBranch(), {
                params: {
                    'company_id[]': companyId
                }
            })
            const formattedBranches = data?.data?.map((branch: any) => ({
                label: `${branch.name} (${branch.Location?.name}/${branch.District?.name}/${branch.State?.name})`,
                value: String(branch.id)
            })) || []
            
            setBranches(formattedBranches)
            return formattedBranches
        } catch (error) {
            console.error('Failed to load branches:', error)
            showNotification('error', 'Failed to load branches')
            return []
        }
    }

    const loadCompanies = async (groupId: string[] | number[]) => {
        try {
            const { data } = await httpClient.get(endpoints.company.companyList(), {
                params: {
                    'group_id[]': groupId,
                },
            })
            const formattedCompanies = data?.map((company: any) => ({
                label: company.name,
                value: String(company.id),
            })) || []
            
            setCompanies(formattedCompanies)
            return formattedCompanies
        } catch (error: any) {
            console.error('Failed to load companies:', error)
            showNotification('error', 'Failed to load companies')
            return []
        }
    }

    const loadUserRoles = async () => {
        try {
            const { data } = await httpClient.get(endpoints.role.getAll())
            const roles = data.data.map((item: any) => ({
                label: item.role_details.name,
                value: String(item.role_details.id),
            }))
            setUserRole(roles)
            return roles
        } catch (error) {
            console.error('Failed to load user roles:', error)
            showNotification('error', 'Failed to load user roles')
            return []
        }
    }

const fetchAllData = async () => {
    try {
        setLoading(true)
        console.log('Starting data fetch for userId:', userId)
        
        await loadUserRoles()
        
        const response = await dispatch(fetchUserById(userId)).unwrap()
        console.log('User data fetched:', response)

        const branchIds = response.branch_details?.map((branch: any) => branch.id) || []
        console.log('Branch IDs from API:', branchIds)

        if (response.group_id) {
            await loadCompanies([response.group_id])
        } else if (companyId) {
            await loadCompanies([companyId])
        }

        // IMPORTANT: Load branches BEFORE setting editedData
        if (response.company_id) {
            const loadedBranches = await loadBranches(String(response.company_id))
            console.log('Branches loaded:', loadedBranches)
            console.log('Looking for branch IDs:', branchIds)
            
            // Check if branch 293 exists in loaded branches
            const branch293Exists = loadedBranches.find((b: any) => b.value === '293')
            console.log('Branch 293 exists?', branch293Exists)
        }

        // Set edited data AFTER branches are loaded
        const finalData = {
            ...response,
            branch_id: branchIds
        }
        console.log('Setting edited data:', finalData)
        setEditedData(finalData)

    } catch (error: any) {
        console.error('Error in fetchAllData:', error)
        showNotification('error', 'Failed to load user details')
    } finally {
        setLoading(false)
    }
}

    useEffect(() => {
        if (userId) {
            fetchAllData()
        }
    }, [userId])

    const handleAddUser = async (values: UserFormData) => {
        const data = {
            ...values,
            group_id: companyId,
            Company_Group_Name: companyName,
            company_id: Number(values.company_id),
            role_id: Number(values.role_id),
        }
        console.log('Submitting data:', data)
        
        try {
            setIsSubmitting(true)
            const res = await dispatch(
                updateUser({
                    id: userId,
                    data: data,
                }),
            ).unwrap()
            
            if (res) {
                navigate('/user-entity')
                showNotification('success', 'User Updated successfully')
            }
        } catch (error: any) {
            const errorMessage = error || 'Failed to Update user'
            showNotification('error', errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Show loader while data is being fetched
    if (loading) {
        return (
            <div className="p-2 bg-white rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                    <Button
                        size="sm"
                        variant="plain"
                        icon={<IoArrowBack className="text-[#72828e] hover:text-[#5d6169]" />}
                        onClick={() => navigate('/user-entity')}
                    />
                    <h3 className="text-2xl font-semibold">Edit User</h3>
                </div>
                <div className="flex justify-center items-center h-96">
                    <Spinner size="40px" />
                </div>
            </div>
        )
    }

    // If no data loaded, show error
    if (!editedData) {
        return (
            <div className="p-2 bg-white rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                    <Button
                        size="sm"
                        variant="plain"
                        icon={<IoArrowBack className="text-[#72828e] hover:text-[#5d6169]" />}
                        onClick={() => navigate('/user-entity')}
                    />
                    <h3 className="text-2xl font-semibold">Edit User</h3>
                </div>
                <div className="flex justify-center items-center h-96">
                    <p className="text-red-500">Failed to load user data</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-2 bg-white rounded-lg">
            <div className="flex items-center gap-2 mb-3">
                <Button
                    size="sm"
                    variant="plain"
                    icon={<IoArrowBack className="text-[#72828e] hover:text-[#5d6169]" />}
                    onClick={() => navigate('/user-entity')}
                />
                <h3 className="text-2xl font-semibold">
                    Edit User - ({editedData?.name || ''})
                </h3>
            </div>

            <Formik
                initialValues={{
                    company_id: editedData?.company_id || 0,
                    name: editedData?.name || '',
                    email: editedData?.email || '',
                    mobile: editedData?.mobile || '',
                    joining_date: formatInitialDate(editedData?.joining_date),
                    role_id: editedData?.role_id || 0,
                    aadhar_no: editedData?.aadhar_no || '',
                    pan_card: editedData?.pan_card || '',
                    auth_signatory: editedData?.auth_signatory || false,
                    suspend: editedData?.suspend || false,
                    disable: editedData?.disable || false,
                    branch_id: editedData?.branch_id || [],
                }}
                validationSchema={userValidationSchema}
                onSubmit={handleAddUser}
                enableReinitialize={true}
            >
                {({ setFieldValue, values, errors, touched }) => (
                    <Form>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-8 relative">
                            {/* Company Group (Read-only) */}
                            <div className="flex flex-col gap-2">
                                <p className="mb-2">
                                    Company Group <span className="text-red-500">*</span>
                                </p>
                                <input
                                    type="text"
                                    value={companyName || ''}
                                    disabled
                                    className="p-2 border rounded bg-gray-100"
                                />
                            </div>

                            {/* Select Company */}
                            <div className="flex flex-col gap-2">
                                <p className="mb-2">
                                    Company <span className="text-red-500">*</span>
                                </p>
                                <Field name="company_id">
                                    {({ field }: any) => (
                                        <OutlinedSelect
                                            label="Select Company"
                                            options={companies}
                                            value={companies.find(
                                                (company) => Number(company.value) === values.company_id
                                            )}
                                            onChange={async (selectedOption: SelectOption | null) => {
                                                setFieldValue(
                                                    'company_id',
                                                    selectedOption ? Number(selectedOption.value) : 0
                                                )
                                                if (selectedOption) {
                                                    await loadBranches(selectedOption.value)
                                                    setFieldValue('branch_id', [])
                                                } else {
                                                    setBranches([])
                                                    setFieldValue('branch_id', [])
                                                }
                                            }}
                                            isMulti={false}
                                        />
                                    )}
                                </Field>
                                {touched.company_id && errors.company_id && (
                                    <span className="text-red-500 text-sm">{errors.company_id}</span>
                                )}
                            </div>

                          {/* Branch Selection */}
<div className="flex flex-col gap-2 col-span-full">
    <p className="">
        Select Branch(es) <span className="text-red-500">*</span>
    </p>
    <Field name="branch_id">
        {({ field }: any) => {
            // Debug logs
            console.log('=== Branch Selection Debug ===')
            console.log('values.branch_id:', values.branch_id)
            console.log('branches array:', branches)
            console.log('branches length:', branches.length)
            
            // Convert branch_id numbers to strings for comparison
            const branchIdStrings = values.branch_id?.map((id: number) => String(id)) || []
            console.log('branchIdStrings:', branchIdStrings)
            
            const selectedBranches = branches.filter((branch: SelectOption) =>
                branchIdStrings.includes(branch.value)
            )
            console.log('selectedBranches:', selectedBranches)
            console.log('==============================')
            
            return (
                <Select
                    size="sm"
                    isMulti
                    isDisabled={!values.company_id || branches.length === 0}
                    options={branches}
                    value={selectedBranches}
                    onChange={(selectedOptions: MultiValue<SelectOption>) => {
                        const branchIds = selectedOptions
                            ? selectedOptions.map((option) => Number(option.value))
                            : []
                        setFieldValue('branch_id', branchIds)
                    }}
                    placeholder={
                        branches.length === 0 
                            ? "No branches available" 
                            : "Select branches"
                    }
                />
            )
        }}
    </Field>
    {touched.branch_id && errors.branch_id && (
        <span className="text-red-500 text-sm">{errors.branch_id}</span>
    )}
</div>

                            {/* Name */}
                            <div className="flex flex-col gap-2">
                                <p className="mb-2">
                                    Name <span className="text-red-500">*</span>
                                </p>
                                <Field
                                    name="name"
                                    render={({ field }: any) => (
                                        <OutlinedInput
                                            {...field}
                                            label="Enter Name"
                                            value={values.name}
                                            onChange={(value: string) => setFieldValue('name', value)}
                                            error={touched.name && errors.name}
                                        />
                                    )}
                                />
                                {touched.name && errors.name && (
                                    <span className="text-red-500 text-sm">{errors.name}</span>
                                )}
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-2">
                                <p className="mb-2">
                                    Email <span className="text-red-500">*</span>
                                </p>
                                <Field
                                    name="email"
                                    render={({ field }: any) => (
                                        <OutlinedInput
                                            {...field}
                                            label="Enter Email"
                                            value={values.email}
                                            onChange={(value: string) => setFieldValue('email', value)}
                                            error={touched.email && errors.email}
                                        />
                                    )}
                                />
                                {touched.email && errors.email && (
                                    <span className="text-red-500 text-sm">{errors.email}</span>
                                )}
                            </div>

                            {/* Mobile */}
                            <div className="flex flex-col gap-2">
                                <p className="mb-2">
                                    Mobile <span className="text-red-500">*</span>
                                </p>
                                <Field
                                    name="mobile"
                                    render={({ field }: any) => (
                                        <OutlinedInput
                                            {...field}
                                            label="Enter Mobile"
                                            value={values.mobile}
                                            onChange={(value: string) => setFieldValue('mobile', value)}
                                            error={touched.mobile && errors.mobile}
                                        />
                                    )}
                                />
                                {touched.mobile && errors.mobile && (
                                    <span className="text-red-500 text-sm">{errors.mobile}</span>
                                )}
                            </div>

                            {/* Joining Date */}
                            <div className="flex flex-col gap-2">
                                <p className="mb-2">
                                    Joining Date <span className="text-red-500">*</span>
                                </p>
                                <Field
                                    name="joining_date"
                                    render={({ field }: any) => (
                                        <DatePicker
                                            {...field}
                                            selected={values.joining_date}
                                            onChange={(date) => setFieldValue('joining_date', date)}
                                            placeholder="Select Joining Date"
                                            error={touched.joining_date && errors.joining_date}
                                        />
                                    )}
                                />
                                {touched.joining_date && errors.joining_date && (
                                    <span className="text-red-500 text-sm">{errors.joining_date}</span>
                                )}
                            </div>

                            {/* Role field */}
                            <div className="flex flex-col gap-2">
                                <p className="mb-2">
                                    Select Designation <span className="text-red-500">*</span>
                                </p>
                                <Field name="role_id">
                                    {({ field }: any) => (
                                        <OutlinedSelect
                                            label="Select Designation"
                                            options={userRole}
                                            value={userRole.find(
                                                (role) => Number(role.value) === values.role_id
                                            )}
                                            onChange={(selectedOption: SelectOption | null) => {
                                                setFieldValue(
                                                    'role_id',
                                                    selectedOption ? Number(selectedOption.value) : 0
                                                )
                                            }}
                                            isMulti={false}
                                        />
                                    )}
                                </Field>
                                {touched.role_id && errors.role_id && (
                                    <span className="text-red-500 text-sm">{errors.role_id}</span>
                                )}
                            </div>

                            {/* Aadhar */}
                            <div className="flex flex-col gap-2">
                                <p className="mb-2">Aadhaar</p>
                                <Field
                                    name="aadhar_no"
                                    render={({ field }: any) => (
                                        <OutlinedInput
                                            {...field}
                                            label="Enter Aadhaar No"
                                            value={values.aadhar_no}
                                            onChange={(value: string) => setFieldValue('aadhar_no', value)}
                                            error={touched.aadhar_no && errors.aadhar_no}
                                        />
                                    )}
                                />
                                {touched.aadhar_no && errors.aadhar_no && (
                                    <span className="text-red-500 text-sm">{errors.aadhar_no}</span>
                                )}
                            </div>

                            {/* PAN Field */}
                            <div className="flex flex-col gap-2">
                                <p className="mb-2">PAN</p>
                                <Field
                                    name="pan_card"
                                    render={({ field }: any) => (
                                        <OutlinedInput
                                            {...field}
                                            label="Enter PAN"
                                            value={values.pan_card}
                                            onChange={(value: string) => setFieldValue('pan_card', value)}
                                            error={touched.pan_card && errors.pan_card}
                                        />
                                    )}
                                />
                                {touched.pan_card && errors.pan_card && (
                                    <span className="text-red-500 text-sm">{errors.pan_card}</span>
                                )}
                            </div>

                            {/* Auth Signatory */}
                            <div className="col-span-2 flex flex-col gap-2">
                                <label className="flex items-center">
                                    <Checkbox
                                        checked={values.auth_signatory}
                                        onChange={() =>
                                            setFieldValue('auth_signatory', !values.auth_signatory)
                                        }
                                    />
                                    <span className="ml-2">Authorized Signatory</span>
                                </label>
                            </div>

                            {/* Buttons */}
                            <div className="col-span-2 flex justify-end gap-2 mt-4">
                                <Button variant="plain" onClick={() => navigate(-1)} type="button">
                                    Cancel
                                </Button>
                                <Button type="submit" variant="solid" loading={isSubmitting}>
                                    Confirm
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default UserEditForm