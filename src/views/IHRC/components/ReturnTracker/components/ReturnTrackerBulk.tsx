import React, { useState } from 'react'
import { Button, Dialog, Input, Notification, Select, toast } from '@/components/ui'
import { HiDownload, HiUpload } from 'react-icons/hi'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import OutlinedSelect from '@/components/ui/Outlined/Outlined'

interface ReturnBulkUploadProps {
    onUploadSuccess?: () => void
}

const ReturnTrackerBulk: React.FC<ReturnBulkUploadProps> = ({ onUploadSuccess }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [remark, setRemark] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [selectedCompany, setSelectedCompany] = useState('')
    const [selectedYear, setSelectedYear] = useState('')
    

    // Generate years (current year and previous 5 years)
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 6 }, (_, i) => ({
        value: (currentYear - i).toString(),
        label: (currentYear - i).toString()
    }))

    const handleUploadClick = () => {
        setIsDialogOpen(true)
    }

const handleConfirm = async () => {
    try {
        setIsUploading(true);

        if (!file) {
            toast.push(
                <Notification title="Error" type="error" closable>
                    Please select a file to upload
                </Notification>
            );
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('remark', remark);

        const res = await httpClient.post(
            endpoints.return.bulkCreate(),
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        if (res.data) {
            toast.push(
                <Notification title="Success" type="success" closable>
                    {res.data.message}
                </Notification>
            );
            handleCancel();
            onUploadSuccess?.();
        }
    } catch (error: any) {
        console.error('Upload error:', error);
        
        let errorMessage = 'Failed to upload file';
        let errorTitle = 'Error';
        
        // Handle API response errors
        if (error.response?.data) {
            const errorData = error.response.data;
            
            // Use the message directly from the response
            errorMessage = errorData.message || 'Validation failed';
            errorTitle = errorData.status === false ? 'Validation Error' : 'Error';
            
            // Add summary of failed records if available
            if (errorData.failedRecords !== undefined && errorData.totalRecords !== undefined) {
                errorMessage += `\n\nFailed records: ${errorData.failedRecords} of ${errorData.totalRecords}`;
            }
        } 
        // Handle network errors
        else if (error.message) {
            errorMessage = error.message;
        }

        // Show the error toast
        toast.push(
            <Notification 
                title={errorTitle} 
                type="error" 
                duration={5000}
                closable
            >
                <div className="whitespace-pre-line">{errorMessage}</div>
            </Notification>
        );
    } finally {
        setIsUploading(false);
    }
};

    const handleCancel = () => {
        setIsDialogOpen(false)
        setRemark('')
        setFile(null)
        setSelectedCompany('')
        setSelectedYear('')
        setIsUploading(false)
    }

    const handleDownload = async (e: React.MouseEvent) => {
        e.preventDefault()
        try {

            const res = await httpClient.get(
                endpoints.return.template(), 
                {
                    responseType: 'blob',
                }
            )

            const blob = new Blob([res.data], {
                type: 'application/vnd.ms-excel',
            })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `RETURN_Template.xlsx`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Download error:', error)
            toast.push(
                <Notification title="Error" closable={true} type="error">
                    Failed to download template. Please try again.
                </Notification>,
            )
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
            >
                Bulk Upload
            </Button>

            <Dialog
                isOpen={isDialogOpen}
                onClose={handleCancel}
                width={450}
                shouldCloseOnOverlayClick={false}
            >
                <h5 className="mb-4">Return Bulk Upload</h5>
                
                {/* Company and Year Selection */}
                {/* <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm mb-2">Company</label>
                        <OutlinedSelect
                            options={companies.map(c => ({
                                value: c.id,
                                label: c.name
                            }))}
                            value={selectedCompany}
                            onChange={setSelectedCompany}
                            label="Select Company"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-2">Year</label>
                        <OutlinedSelect
                            options={years}
                            value={selectedYear}
                            onChange={setSelectedYear}
                            label="Select Year"
                        />
                    </div>
                </div> */}

                {/* Download Format Section */}
                <div className="my-4 flex gap-2 items-center">
                    <p>Download Format</p>
                    <a
                        onClick={handleDownload}
                        className="text-blue-600 hover:underline"
                    >
                        <Button 
                            size="xs" 
                            icon={<HiDownload />}
                                                  
                        >
                            Download
                        </Button>
                    </a>
                </div>

                {/* File Upload Section */}
                <div className="flex flex-col gap-2">
                    <p>Upload Return File:</p>
                    <Input
                        type="file"
                        onChange={handleFileChange}
                        accept=".xlsx,.xls"
                        className="mb-4"
                    />
                </div>

                {/* Remark Section */}
                <p>Please Enter the Remark:</p>
                <textarea
                    className="w-full p-2 border rounded mb-2"
                    rows={3}
                    placeholder="Enter remark"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                />

               
                {/* Action Buttons */}
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

export default ReturnTrackerBulk