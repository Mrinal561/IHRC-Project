import React from 'react'
import { Dialog, Button, Notification, toast } from '@/components/ui'
import { HiDownload } from 'react-icons/hi'
import dayjs from 'dayjs'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import moment from 'moment-timezone'
interface BranchClosingDetailsDialogProps {
    isOpen: boolean
    onClose: () => void
    branchData: {
        id?: number
        name?: string
        closer_date?: string
        closer_reason?: string
        closer_submission_copy?: string
    } | null
}

const BranchClosingDetailsDialog: React.FC<BranchClosingDetailsDialogProps> = ({
    isOpen,
    onClose,
    branchData,
}) => {
    const handleDownload = async () => {
        if (!branchData?.closer_submission_copy) {
            toast.push(
                <Notification title="Error" type="error" closable={true}>
                    No submission copy available for download
                </Notification>,
            )
            return
        }

        try {
            let fileUrl = branchData.closer_submission_copy

            // If it's a relative path, construct full URL
            if (!fileUrl.startsWith('http') && !fileUrl.startsWith('data:')) {
                // Construct full URL using API base URL
                const apiBaseUrl = import.meta.env.VITE_API_GATEWAY || ''
                fileUrl = `${apiBaseUrl}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`
            }

            // If it's a base64 data URL, handle it directly
            if (fileUrl.startsWith('data:')) {
                const response = await fetch(fileUrl)
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.setAttribute(
                    'download',
                    `branch-closing-document-${branchData.id}.pdf`,
                )
                document.body.appendChild(link)
                link.click()
                link.parentNode?.removeChild(link)
                window.URL.revokeObjectURL(url)
            } else {
                // Fetch from server
                const response = await httpClient.get(fileUrl, {
                    responseType: 'blob',
                })

                // Extract filename from Content-Disposition header if available
                const contentDisposition =
                    response.headers['content-disposition']
                let filename = `branch-closing-document-${branchData.id}.pdf`

                if (contentDisposition) {
                    const filenameMatch =
                        contentDisposition.match(/filename="?(.+)"?/i)
                    if (filenameMatch && filenameMatch[1]) {
                        filename = filenameMatch[1].replace(/['"]/g, '')
                    }
                }

                // Determine file type from extension or default to PDF
                const fileExtension = filename.split('.').pop()?.toLowerCase()
                const mimeType =
                    fileExtension === 'zip'
                        ? 'application/zip'
                        : fileExtension === 'png' ||
                            fileExtension === 'jpg' ||
                            fileExtension === 'jpeg'
                          ? `image/${fileExtension}`
                          : 'application/pdf'

                const blob = new Blob([response.data], { type: mimeType })
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = filename
                document.body.appendChild(link)
                link.click()

                setTimeout(() => {
                    window.URL.revokeObjectURL(url)
                    document.body.removeChild(link)
                }, 100)
            }

            toast.push(
                <Notification title="Success" type="success" closable={true}>
                    Document downloaded successfully
                </Notification>,
            )
        } catch (error: any) {
            console.error('Download failed:', error)
            toast.push(
                <Notification title="Error" type="error" closable={true}>
                    {error.response?.data?.message ||
                        'Failed to download document'}
                </Notification>,
            )
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            onRequestClose={onClose}
            width={600}
        >
            <h5 className="mb-4">Branch Closing Details</h5>

            {branchData && (
                <div className="space-y-4">
                    {/* Branch Name */}
                    {branchData.name && (
                        <div className="flex items-start gap-4">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-32 flex-shrink-0">
                                Branch Name:
                            </label>
                            <p className="text-sm text-gray-900 dark:text-gray-100 flex-1">
                                {branchData.name}
                            </p>
                        </div>
                    )}

                    {/* Closing Date */}
                    <div className="flex items-start gap-4">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-32 flex-shrink-0">
                            Closing Date:
                        </label>
                        <p className="text-sm text-gray-900 dark:text-gray-100 flex-1">
                            {branchData.closer_date
                                ? moment
                                      .utc(branchData.closer_date)
                                      .tz('Asia/Kolkata')
                                      .subtract(5, 'hours')
                                      .subtract(30, 'minutes')
                                      .format('DD-MMM-YYYY hh:mm A')
                                : //   moment(branchData.closer_date).format(
                                  //                                       'DD-MMM-YYYY HH:mm A',
                                  //                                   )
                                  'N/A'}
                        </p>
                    </div>

                    {/* Closing Reason */}
                    <div className="flex items-start gap-4">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-32 flex-shrink-0">
                            Closing Reason:
                        </label>
                        <p className="text-sm text-gray-900 dark:text-gray-100 flex-1">
                            {branchData.closer_reason || 'N/A'}
                        </p>
                    </div>

                    {/* Submission Copy Download */}
                    <div className="flex items-start gap-4">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-32 flex-shrink-0">
                            Submission Copy:
                        </label>
                        <div className="flex-1">
                            {branchData.closer_submission_copy ? (
                                <Button
                                    variant="solid"
                                    icon={<HiDownload />}
                                    size="sm"
                                    onClick={handleDownload}
                                >
                                    Download Submission Copy
                                </Button>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No submission copy available
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
                <Button variant="plain" onClick={onClose}>
                    Close
                </Button>
            </div>
        </Dialog>
    )
}

export default BranchClosingDetailsDialog
