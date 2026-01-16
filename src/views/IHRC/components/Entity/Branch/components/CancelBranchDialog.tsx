import React from 'react'
import {
    Dialog,
    Button,
    Notification,
    toast,
    Input,
    DatePicker,
} from '@/components/ui'
import DateTimepicker from '@/components/ui/DatePicker/DateTimepicker'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import OutlinedInput from '@/components/ui/OutlinedInput/OutlinedInput'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import { showErrorNotification } from '@/components/ui/ErrorMessage'
import dayjs from 'dayjs'

interface CancelBranchDialogProps {
    isOpen: boolean
    onClose: () => void
    branchId: number | null
    onRefresh: () => void
}

interface FormValues {
    closer_date: Date | null
    closer_reason: string
    closer_submission_copy: string | null
    closer_submission_copy_fileName: string | null
}

const validationSchema = Yup.object().shape({
    closer_date: Yup.date().required('Closing date is required').nullable(),
    closer_reason: Yup.string()
        .required('Closing reason is required')
        .trim()
        .min(2, 'Closing reason must be at least 2 characters'),
    closer_submission_copy: Yup.string()
        .required('Closing submission copy is required')
        .nullable(),
})

const CancelBranchDialog: React.FC<CancelBranchDialogProps> = ({
    isOpen,
    onClose,
    branchId,
    onRefresh,
}) => {
    const initialValues: FormValues = {
        closer_date: null,
        closer_reason: '',
        closer_submission_copy: null,
        closer_submission_copy_fileName: null,
    }

    // Convert file to base64
    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
                if (reader.result && typeof reader.result === 'string') {
                    const base64String = reader.result.split(',')[1]
                    resolve(base64String)
                } else {
                    reject(new Error('Failed to read file as base64'))
                }
            }
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }

    const handleSubmit = async (values: FormValues) => {
        if (!branchId) {
            showErrorNotification('Branch ID is required')
            return
        }

        try {
            // Prepare the request body as JSON
            const requestBody: {
                closer_date?: string
                closer_reason?: string
                closer_submission_copy?: string
            } = {}

            // Format date as "YYYY-MM-DD HH:mm:ss"
            if (values.closer_date) {
                requestBody.closer_date = dayjs(values.closer_date).format(
                    'YYYY-MM-DD HH:mm:ss',
                )
            }

            if (values.closer_reason && values.closer_reason.trim()) {
                requestBody.closer_reason = values.closer_reason.trim()
            }

            if (values.closer_submission_copy) {
                requestBody.closer_submission_copy =
                    values.closer_submission_copy
            }

            await httpClient.put(
                endpoints.branch.cancel(branchId.toString()),
                requestBody,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )

            toast.push(
                <Notification title="Success" type="success" closable={true}>
                    Branch cancelled successfully
                </Notification>,
            )

            onClose()
            if (onRefresh) {
                onRefresh()
            }
        } catch (error: any) {
            console.error('Error cancelling branch:', error)
            if (error.response?.data?.message) {
                showErrorNotification(error.response.data.message)
            } else if (error.message) {
                showErrorNotification(error.message)
            } else {
                showErrorNotification(
                    'Failed to cancel branch. Please try again.',
                )
            }
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            onRequestClose={onClose}
            width={600}
        >
            <h5 className="mb-4">Cancel Branch</h5>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
            >
                {({
                    values,
                    errors,
                    touched,
                    setFieldValue,
                    handleSubmit,
                    isSubmitting,
                }) => (
                    <Form>
                        <div className="space-y-4">
                            {/* Closing Date */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Closing Date{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <DateTimepicker
                                    size="sm"
                                    placeholder="Select closing date and time"
                                    value={values.closer_date}
                                    onChange={(date) => {
                                        setFieldValue('closer_date', date)
                                    }}
                                    inputFormat="DD-MMM-YYYY hh:mm a"
                                />
                                {errors.closer_date && touched.closer_date && (
                                    <p className="text-red-500 text-xs">
                                        {errors.closer_date as string}
                                    </p>
                                )}
                            </div>

                            {/* Closing Reason */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Closing Reason{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <OutlinedInput
                                    label="Closing Reason"
                                    value={values.closer_reason}
                                    onChange={(value) => {
                                        setFieldValue('closer_reason', value)
                                    }}
                                />
                                {errors.closer_reason &&
                                    touched.closer_reason && (
                                        <p className="text-red-500 text-xs">
                                            {errors.closer_reason}
                                        </p>
                                    )}
                            </div>

                            {/* Closing Submission Copy */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Closing Submission Copy (PDF Only, Max 20MB){' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="file"
                                    size="md"
                                    className="w-full"
                                    accept=".pdf"
                                    onChange={async (
                                        e: React.ChangeEvent<HTMLInputElement>,
                                    ) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            // Validate file size
                                            if (file.size > 20 * 1024 * 1024) {
                                                showErrorNotification(
                                                    'File size exceeds 20MB limit',
                                                )
                                                e.target.value = ''
                                                return
                                            }

                                            // Validate file type
                                            const allowedTypes = [
                                                'application/pdf',
                                                'application/zip',
                                                'image/jpeg',
                                                'image/png',
                                                'image/gif',
                                                'image/jpg',
                                            ]
                                            if (
                                                !allowedTypes.includes(
                                                    file.type,
                                                )
                                            ) {
                                                showErrorNotification(
                                                    'Only PDF, ZIP, and image files are allowed',
                                                )
                                                e.target.value = ''
                                                return
                                            }

                                            try {
                                                const base64String =
                                                    await convertToBase64(file)
                                                setFieldValue(
                                                    'closer_submission_copy',
                                                    base64String,
                                                )
                                                setFieldValue(
                                                    'closer_submission_copy_fileName',
                                                    file.name,
                                                )
                                            } catch (error) {
                                                console.error(
                                                    'Error converting file:',
                                                    error,
                                                )
                                                showErrorNotification(
                                                    'Error processing file',
                                                )
                                                e.target.value = ''
                                            }
                                        } else {
                                            setFieldValue(
                                                'closer_submission_copy',
                                                null,
                                            )
                                            setFieldValue(
                                                'closer_submission_copy_fileName',
                                                null,
                                            )
                                        }
                                    }}
                                    onClick={(event) => {
                                        ;(
                                            event.target as HTMLInputElement
                                        ).value = ''
                                    }}
                                />
                                {errors.closer_submission_copy &&
                                    touched.closer_submission_copy && (
                                        <p className="text-red-500 text-xs">
                                            {
                                                errors.closer_submission_copy as string
                                            }
                                        </p>
                                    )}
                                {values.closer_submission_copy_fileName && (
                                    <p className="text-xs text-gray-600">
                                        Selected:{' '}
                                        {values.closer_submission_copy_fileName}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
                            <Button
                                type="button"
                                variant="plain"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="solid"
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleSubmit()
                                }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    )
}

export default CancelBranchDialog
