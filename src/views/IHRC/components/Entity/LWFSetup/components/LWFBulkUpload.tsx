import React, { useState } from 'react'
import { Button, Dialog, Input, Notification, toast } from '@/components/ui'
import { HiDownload, HiUpload } from 'react-icons/hi'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'

interface LWFBulkUploadProps {
    onUploadSuccess?: () => void
    companyId: any
}

const LWFBulkUpload: React.FC<LWFBulkUploadProps> = ({
    onUploadSuccess,
    companyId,
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [remark, setRemark] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    const handleUploadClick = () => {
        setIsDialogOpen(true)
    }

    const handleConfirm = async () => {
        try {
            setIsUploading(true)

            if (!file) {
                toast.push(
                    <Notification
                        title="Error"
                        closable={true}
                        type="danger"
                    >
                        Please select a file to upload
                    </Notification>,
                )
                return
            }

            const formData = new FormData()
            formData.append('file', file)
            formData.append('remark', remark)
            formData.append('company_id', companyId)
            //company_id
            const res = await httpClient.post(
                endpoints.lwfSetup.bulkCreate(),
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            )

            if (res) {
                toast.push(
                    <Notification title="Success" type="success">
                        {res.data.message}
                    </Notification>,
                )

                handleCancel()

                if (onUploadSuccess) {
                    onUploadSuccess()
                }
            }
        } catch (error) {
            throw error
            console.error('Upload error:', error)
        } finally {
            setIsUploading(false)
            handleCancel()
        }
    }

    const handleCancel = () => {
        setIsDialogOpen(false)
        setRemark('')
        setFile(null)
        setIsUploading(false)
    }

    const handleDownload = async () => {
        try {
            const res = await httpClient.get(
                endpoints.lwfSetup.downloadFormat(companyId),
                {
                    responseType: 'blob',
                },
            )

            const blob = new Blob([res.data], { type: 'text/xlsx' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'LWF_Setup_Template.xlsx')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error('Download error:', error)
            throw error
            // toast.push(
            //   <Notification title="Error" closable={true} type="danger">
            //     Failed to download template. Please try again.
            //   </Notification>
            // );
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0])
        }
    }

    return (
        <>
            <Button
                variant="solid"
                size="sm"
                icon={<HiUpload />}
                onClick={handleUploadClick}
                className="mr-2"
            >
                Bulk Upload
            </Button>

            <Dialog
                isOpen={isDialogOpen}
                onClose={handleCancel}
                width={450}
                shouldCloseOnOverlayClick={false}
            >
                <h5 className="mb-4">Bulk Upload</h5>
                <div className="my-4 flex gap-2 items-center">
                    <p>Download Format</p>
                    <a
                        onClick={handleDownload}
                        className="text-blue-600 hover:underline"
                    >
                        <Button size="xs" icon={<HiDownload />}>
                            Download
                        </Button>
                    </a>
                </div>
                <div className="flex flex-col gap-2">
                    <p>Upload LWF Setup File:</p>
                    <Input
                        type="file"
                        onChange={handleFileChange}
                        accept=".xlsx,.xls"
                        className="mb-4"
                    />
                </div>
                <p>Please Enter the Remark:</p>
                <textarea
                    className="w-full p-2 border rounded mb-2"
                    rows={3}
                    placeholder="Enter remark"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                />
                <div className="mt-6 text-right flex gap-2 justify-end items-center">
                    <Button
                        size="sm"
                        className="mr-2"
                        onClick={handleCancel}
                        disabled={isUploading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        size="sm"
                        onClick={handleConfirm}
                        loading={isUploading}
                    >
                        Confirm
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

export default LWFBulkUpload
