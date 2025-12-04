import React, { useState, useEffect } from 'react';
import { Dialog, Button, Input, toast, Notification } from '@/components/ui';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

interface RegisterEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    availableCompanies: {id: number, name: string}[];
    availableYears: number[];
    registerData: {
        id: number;
        company_id: number;
        company_name: string;
        year: number;
        description?: string;
        status: string;
    } | null;
}

interface SelectOption {
    value: string;
    label: string;
}

const validationSchema = Yup.object().shape({
    company_id: Yup.number().required('Company is required'),
    year: Yup.number()
        .required('Year is required')
        .min(2000, 'Year must be 2000 or later')
        .max(2100, 'Year must be 2100 or earlier'),
    description: Yup.string(),
    file: Yup.mixed()
        .nullable()
        .test('fileSize', 'File size must be less than 100MB', (value) => {
            if (!value) return true; // File is optional for update
            return (value as File).size <= 100 * 1024 * 1024;
        })
        .test('fileType', 'Only ZIP files are allowed', (value) => {
            if (!value) return true; // File is optional for update
            const file = value as File;
            const allowedTypes = ['application/zip', 'application/x-zip-compressed'];
            return allowedTypes.includes(file.type);
        }),
});

const RegisterEditModal = ({
    isOpen,
    onClose,
    onSuccess,
    availableCompanies,
    availableYears,
    registerData
}: RegisterEditModalProps) => {
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [initialValues, setInitialValues] = useState<any>({
        company_id: '',
        year: '',
        description: '',
        file: null,
    });

            const [companyOptions, setCompanyOptions] = useState<SelectOption[]>([]);
    

      useEffect(() => {
        const loadOptions = async () => {
            try {
                // Load companies
                const companiesRes = await httpClient.get(endpoints.company.getAll());
                setCompanyOptions(companiesRes.data.data.map((c: any) => ({
                    value: String(c.id), // Ensure value is string
                    label: c.name
                })));
            } catch (error) {
                console.error('Failed to load filter options:', error);
            }
        };

        loadOptions();
    }, []);


    const currentYear = new Date().getFullYear();
const yearOptions: SelectOption[] = Array.from(
    { length: currentYear - 2020 }, // 2021 to current year (inclusive)
    (_, i) => {
        const year = currentYear - i;
        return {
            value: String(year),
            label: String(year),
        };
    }
);

    useEffect(() => {
        if (registerData && isOpen) {
            setInitialValues({
                company_id: String(registerData.company_id),
                year: String(registerData.year),
                description: registerData.description || '',
                file: null,
            });
            setSelectedFile(null);
        }
    }, [registerData, isOpen]);

    const handleSubmit = async (values: any) => {
        if (!registerData) return;

        setUploading(true);
        try {
            const formData = new FormData();
            
            // Only append changed values
            if (values.company_id !== String(registerData.company_id)) {
                formData.append('company_id', values.company_id);
            }
            if (values.year !== String(registerData.year)) {
                formData.append('year', values.year);
            }
            if (values.description !== registerData.description) {
                formData.append('description', values.description || '');
            }
            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            const response = await httpClient.put(
                endpoints.registerNew.update(registerData.id),
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.success) {
                toast.push(
                    <Notification title="Success" type="success" duration={2500}>
                        Register updated successfully
                    </Notification>
                );
                onSuccess();
            }
        } catch (error: any) {
            console.error('Update failed:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update register';
            toast.push(
                <Notification title="Error" type="danger" duration={2500}>
                    {errorMessage}
                </Notification>
            );
        } finally {
            setUploading(false);
        }
    };

    if (!registerData) return null;

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            onRequestClose={onClose}
            closable={true}
            width={500}
        >
            <div className="pb-2 mb-1">
                <h4 className="text-lg font-semibold">Edit Register</h4>
                
                {/* <div className="mt-2 text-xs text-gray-600">
                    <p>Current Status: <span className="font-medium">{registerData.status}</span></p>
                    <p>Company: <span className="font-medium">{registerData.company_name}</span></p>
                </div> */}
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ values, errors, touched, setFieldValue, handleSubmit, isValid }) => (
                    <Form>
                        <div className="space-y-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Company <span className="text-red-500">*</span>
                                </label>
                                <Field name="company_id">
                                    {({ field }: any) => (
                                        <OutlinedSelect
                                            label="Select Company"
                                            options={companyOptions}
                                            value={companyOptions.find(
                                                (option) => option.value === values.company_id
                                            )}
                                            onChange={(selectedOption: SelectOption | null) => {
                                                setFieldValue(
                                                    'company_id',
                                                    selectedOption ? selectedOption.value : ''
                                                );
                                            }}
                                            // isDisabled={true}
                                        />
                                    )}
                                </Field>
                                {errors.company_id && touched.company_id && (
                                    <p className="text-red-500 text-xs">{errors.company_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Year <span className="text-red-500">*</span>
                                </label>
                                <Field name="year">
                                    {({ field }: any) => (
                                        <OutlinedSelect
                                            label="Select Year"
                                            options={yearOptions}
                                            value={yearOptions.find(
                                                (option) => option.value === values.year
                                            )}
                                            onChange={(selectedOption: SelectOption | null) => {
                                                setFieldValue(
                                                    'year',
                                                    selectedOption ? selectedOption.value : ''
                                                );
                                            }}
                                        />
                                    )}
                                </Field>
                                {errors.year && touched.year && (
                                    <p className="text-red-500 text-xs">{errors.year}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description (Optional)</label>
                                <Field name="description">
                                    {({ field }: any) => (
                                        <Input
                                            textArea
                                            placeholder="Enter description..."
                                            value={values.description}
                                            onChange={(e: any) => setFieldValue('description', e.target.value)}
                                        />
                                    )}
                                </Field>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Re-upload ZIP File (Optional, Max 20GB)
                                </label>
                                <div className="border rounded p-3 bg-gray-50 mb-2">
                                    <p className="text-sm font-medium mb-1">Current File:</p>
                                    <p className="text-xs text-gray-600">
                                        If you don't select a new file, the existing file will be retained.
                                        Uploading a new file will replace the existing one.
                                    </p>
                                </div>
                                <Input
                                    type="file"
                                    size="md"
                                    className="w-full"
                                    accept=".zip"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setSelectedFile(file);
                                            setFieldValue('file', file);
                                        } else {
                                            setSelectedFile(null);
                                            setFieldValue('file', null);
                                        }
                                    }}
                                />
                               
                                {errors.file && touched.file && (
                                    <p className="text-red-500 text-xs">{errors.file}</p>
                                )}
                                <p className="text-xs text-gray-500">
                                    Only ZIP files are allowed. Maximum file size is 20GB.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 mt-2">
                            <Button
                                type="button"
                                variant="plain"
                                onClick={onClose}
                                disabled={uploading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="solid"
                                loading={uploading}
                                disabled={uploading}
                            >
                                Confirm
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default RegisterEditModal;