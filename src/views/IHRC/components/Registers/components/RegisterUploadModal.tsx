import React, { useEffect, useState } from 'react';
import { Dialog, Button, Input, toast, Notification } from '@/components/ui';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

interface RegisterUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    availableCompanies: {id: number, name: string}[];
    availableYears: number[];
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
        .required('File is required')
        .test('fileSize', 'File size must be less than 100MB', (value) => {
            if (!value) return false;
            return (value as File).size <= 100 * 1024 * 1024;
        })
        .test('fileType', 'Only ZIP files are allowed', (value) => {
            if (!value) return false;
            const file = value as File;
            const allowedTypes = ['application/zip', 'application/x-zip-compressed'];
            return allowedTypes.includes(file.type);
        }),
});

const RegisterUploadModal = ({
    isOpen,
    onClose,
    onSuccess,
    availableCompanies,
    availableYears
}: RegisterUploadModalProps) => {
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

       const [companyOptions, setCompanyOptions] = useState<SelectOption[]>([]);
   

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

        
    const handleSubmit = async (values: any) => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('company_id', values.company_id);
            formData.append('year', values.year);
            if (values.description) {
                formData.append('description', values.description);
            }
            formData.append('file', selectedFile);

            const response = await httpClient.post(
                endpoints.registerNew.create(),
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
                        Register uploaded successfully
                    </Notification>
                );
                onSuccess();
            }
        } catch (error: any) {
            console.error('Upload failed:', error);
            const errorMessage = error.response?.data?.message || 'Failed to upload register';
            toast.push(
                <Notification title="Error" type="danger" duration={2500}>
                    {errorMessage}
                </Notification>
            );
        } finally {
            setUploading(false);
        }
    };

    const initialValues = {
        company_id: '',
        year: '',
        description: '',
        file: null,
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            onRequestClose={onClose}
            closable={true}
            width={500}
        >
            <div className="pb-4 mb-2">
                <h4 className="text-lg font-semibold">Upload Register</h4>
               
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, setFieldValue, handleSubmit }) => (
                    <Form>
                        <div className="space-y-4">
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
                                    ZIP File (Max 20GB) <span className="text-red-500">*</span>
                                </label>
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
                                        }
                                    }}
                                />
                                {/* {selectedFile && (
                                    <div className="text-sm text-gray-600">
                                        Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024 / 1024)} MB)
                                    </div>
                                )} */}
                                {errors.file && touched.file && (
                                    <p className="text-red-500 text-xs">{errors.file}</p>
                                )}
                                <p className="text-xs text-gray-500">
                                    Only ZIP files are allowed. Maximum file size is 20GB.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-6 mt-6 border-t">
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
                                disabled={!selectedFile || uploading}
                            >
                                Upload Register
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default RegisterUploadModal;