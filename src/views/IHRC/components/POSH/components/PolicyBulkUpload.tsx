import React, { useState } from 'react';
import { Button, Dialog, Input, Notification, toast } from '@/components/ui';
import { HiDownload, HiUpload } from 'react-icons/hi';
import OutlinedInput from '@/components/ui/OutlinedInput';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import useAuth from '@/utils/hooks/useAuth';

interface PolicyBulkUploadProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const PolicyBulkUpload = ({ isOpen, onClose, onSuccess }: PolicyBulkUploadProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [remark, setRemark] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = useAuth();
    const userId = auth?.user?.id || 0;

    const handleUpload = async () => {
        if (!file) {
            toast.push(
                <Notification title="Warning" type="warning" closable>
                    Please select a file to upload
                </Notification>
            );
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('remark', remark);
        formData.append('created_by', userId.toString());

        setLoading(true);
        try {
            await httpClient.post(endpoints.poshSetup.policyBulkCreate(), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.push(
                <Notification title="Success" type="success" closable>
                    Policies uploaded successfully
                </Notification>
            );
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Upload error:', error);
            let errorMessage = 'Failed to upload policies';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            toast.push(
                <Notification title="Error" type="error" closable>
                    {errorMessage}
                </Notification>
            );
        } finally {
            setLoading(false);
        }
    };

    const downloadTemplate = async () => {
        try {
            const response = await httpClient.get(endpoints.poshSetup.policyTemplate(), {
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
                <Notification title="Error" type="error" closable>
                    Failed to download template
                </Notification>
            );
        }
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={500}
            onRequestClose={onClose}
        >
            <h5 className="mb-4">Bulk Upload POSH Policy</h5>
            
            <div className="my-4 flex gap-2 items-center">
                <p>Download Template:</p>
                <Button
                    size="xs"
                    icon={<HiDownload />}
                    onClick={downloadTemplate}
                >
                    Download Template
                </Button>
            </div>

            <div className="flex flex-col gap-2 mb-4">
                <p>Upload Policies File:</p>
                <Input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    accept=".xlsx,.xls,.csv"
                />
            </div>

            <div className="mb-4 flex flex-col gap-2">
                <p>Enter Remark</p>
                <OutlinedInput 
                    textarea 
                    label="Enter Remark" 
                    value={remark} 
                    onChange={(value) => setRemark(value)} 
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
                    onClick={handleUpload}
                    disabled={!file || loading}
                >
                   Confirm
                </Button>
            </div>
        </Dialog>
    );
};

export default PolicyBulkUpload;