import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Input, Card, Spinner, Dialog, Tooltip } from '@/components/ui';
import OutlinedInput from '@/components/ui/OutlinedInput';
import { toast, Notification } from '@/components/ui';
import { IoArrowBack } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import * as Yup from 'yup';
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json';
import Lottie from 'lottie-react';
import NoticeTypeAutosuggest from './NoticeTypeAutosuggest';
import { Eye } from 'lucide-react';

const EditFollowUpDialog = ({ followUpId, onClose, isOpen }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [form, setForm] = useState({
        notice_type: '',
        notice_date: null,
        reference_number: '',
        notice_detail: '',
        notice_document: null,
    });
    const [errors, setErrors] = useState({});
    const [fileBase64, setFileBase64] = useState<string>(''); 

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Cleanup function to re-enable scroll when the component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    
    
    useEffect(() => {
        const fetchFollowUpDetails = async () => {
            try {
                const response = await httpClient.get(endpoints.noticeTracker.followUpNoticeDetail(followUpId));
                const followUpData = response.data;

                const noticeDate = followUpData.notice_date ? new Date(followUpData.notice_date) : null;

                setForm({
                    notice_type: followUpData.notice_type,
                    notice_date: noticeDate,
                    reference_number: followUpData.reference_number,
                    notice_detail: followUpData.notice_detail,
                    notice_document: followUpData.notice_document,
                });
            } catch (error) {
               throw error
            } finally {
                setIsLoading(false);
            }
        };

        if(isOpen && followUpId) {
            fetchFollowUpDetails();
        }
    }, [followUpId, isOpen]);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: '' }));
    };

   
       // Handle file upload
     // Update the handleFileChange function
const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (20MB limit)
    if (file.size > 20 * 1024 * 1024) {
        toast.push(
            <Notification title="Error" type="error" closable={true}>
                File size should not exceed 20MB
            </Notification>
        );
        return;
    }

    // Check allowed file types
    const allowedTypes = [
        'application/pdf',
        'application/zip',
        'application/x-zip-compressed',
        'image/jpeg',
        'image/png',
        'image/gif'
    ];
    
    if (!allowedTypes.includes(file.type)) {
        toast.push(
            <Notification title="Error" type="error" closable={true}>
                Only PDF, ZIP, JPG, PNG, GIF files are allowed
            </Notification>
        );
        return;
    }

    try {
        const base64String = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                resolve(result.split(',')[1]); // Extract just the base64 part
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        const documentData = {
            data: base64String,
            filename: file.name,
            mimetype: file.type
        };

        setForm(prev => ({
            ...prev,
            notice_document: documentData
        }));
        
    } catch (error) {
        console.error('Error processing file:', error);
        toast.push(
            <Notification title="Error" type="error" closable={true}>
                Failed to process file
            </Notification>
        );
    }
};

// Update the handleSubmit function
const handleSubmit = async () => {
    try {
        setIsLoading(true);
        
        // Prepare the payload with proper document format
        const payload = {
            notice_type: form.notice_type,
            notice_date: form.notice_date,
            reference_number: form.reference_number,
            notice_detail: form.notice_detail,
            // Include document only if it exists and is in the correct format
            notice_document: form.notice_document && typeof form.notice_document === 'object' 
                ? form.notice_document 
                : undefined
        };

        await httpClient.put(endpoints.noticeTracker.updateFollowupNotice(followUpId), payload);

        toast.push(
            <Notification title="Success" type="success" closable={true}>
                Follow-up notice updated successfully
            </Notification>
        );
        onClose();
    } catch (error) {
       throw error
    } finally {
        setIsLoading(false);
    }
};
     // Handle document view
        const handleDocumentView = (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            if (form.notice_document) {
                const fullPath = `${import.meta.env.VITE_API_GATEWAY}/${form.notice_document}`;
                window.open(fullPath, '_blank');
            }
        };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500 rounded-xl">
                <div className="w-28 h-28">
                    <Lottie animationData={loadingAnimation} loop className="w-24 h-24" />
                </div>
                <p className="text-lg font-semibold">Loading Data...</p>
            </div>
        );
    }

    return (
                <Dialog isOpen={isOpen} onClose={onClose} width={600} shouldCloseOnOverlayClick={false}>
        
        <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">Edit Follow-Up Notice</h2>
                <div className="space-y-2">
                    <div className='space-y-2'>
                        <NoticeTypeAutosuggest
                value={form.notice_type}
                onChange={(value) => handleChange('notice_type', value)}
                onNoticeTypeSelect={(id) => {
                  setForm((prev) => ({
                    ...prev,
                    notice_type_id: id,
                  }));
                }}
                isDisabled={isLoading}
              />
                    </div>
                    <div className="space-y-2">
                    <label className="text-sm font-medium">Notice Date</label>
                        <DatePicker
                            clearable
                            size="sm"
                            placeholder="Select Date"
                            value={form.notice_date}
                            onChange={(date) => handleChange('notice_date', date)}
                            inputFormat="DD/MM/YYYY"
                            maxDate={new Date()}
                        />
                    </div>
                    <div className="space-y-2">
                    <label className="text-sm font-medium">Reference Number</label>
                        <OutlinedInput
                         label="Enter Reference Number"
                            value={form.reference_number}
                            onChange={(value) => handleChange('reference_number', value)}
                        />
                    </div>
                    <div className="space-y-2">
                    <label className="text-sm font-medium">Details Of The Notice</label>
                        <OutlinedInput
                        label="Details of the Notice"
                            value={form.notice_detail}
                            onChange={(value) => handleChange('notice_detail', value)}
                            textarea={true}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Notice Document (PDF/Zip/Image, Max 20MB)</label>
                        <div className="flex gap-2">
                            <Input
                                type="file"
                                onChange={handleFileChange}
                                className="w-full"
                                accept=".pdf,.jpg,.jpeg,.png,.zip"
                            />
                            <Tooltip title="View Document">
                                <Button
                                    onClick={handleDocumentView}
                                    className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0"
                                >
                                    <Eye size={20} />
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                    <Button variant="plain" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={handleSubmit} loading={isLoading}>
                        Confirm
                    </Button>
                </div>
            </div>
        </Dialog>
    );
};

export default EditFollowUpDialog;