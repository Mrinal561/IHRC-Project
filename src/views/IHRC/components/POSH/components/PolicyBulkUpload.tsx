import React, { useState } from 'react';
import { Button, Dialog, Notification, toast } from '@/components/ui';
import { HiDownload, HiUpload } from 'react-icons/hi';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

interface PolicyBulkUploadProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const PolicyBulkUpload = ({ isOpen, onClose, onSuccess }: PolicyBulkUploadProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!file) {
         

             toast.push(
                             <Notification 
                                            title='warning'
                                            closable={true}
                                            type='warning'
                                            >
                                                Please select a file to upload
                                            </Notification>
                        )
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            await httpClient.post(endpoints.poshSetup.createPolicy(), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

         
            toast.push(
                             <Notification 
                                            title='success'
                                            closable={true}
                                            type='success'
                                            >
                                                Policies uploaded successfully
                                            </Notification>
                        )
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Upload error:', error);
          
             toast.push(
                             <Notification 
                                            title='error'
                                            closable={true}
                                            type='error'
                                            >
                                                error.response?.data?.message
                                            </Notification>
                        )
        } finally {
            setLoading(false);
        }
    };

    const downloadTemplate = async () => {
        try {
            const response = await httpClient.get(endpoints.poshSetup.downloadTemplate(), {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'posh-policy-template.xlsx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
           
              toast.push(
                             <Notification 
                                            title='error'
                                            closable={true}
                                            type='error'
                                            >
                                                Failed to download template
                                            </Notification>
                        )
        }
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={500}
        >
            <h5 className="mb-4">Bulk Upload POSH Policies</h5>
            
            <div className="my-4 flex gap-2 items-center">
                <p>Download Template:</p>
                <Button
                    size="xs"
                    icon={<HiDownload />}
                    onClick={downloadTemplate}
                >
                    Download Excel Template
                </Button>
            </div>

            <div className="flex flex-col gap-2 mb-4">
                <p>Upload Policies File:</p>
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    accept=".xlsx,.xls,.csv"
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                />
            </div>

            <div className="flex justify-end gap-2 mt-6">
                <Button
                    variant="plain"
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    variant="solid"
                    loading={loading}
                    icon={<HiUpload />}
                    onClick={handleUpload}
                    disabled={!file || loading}
                >
                    Upload
                </Button>
            </div>
        </Dialog>
    );
};

export default PolicyBulkUpload;