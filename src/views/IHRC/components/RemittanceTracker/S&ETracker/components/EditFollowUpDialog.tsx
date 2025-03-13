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
       const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
           const file = e.target.files?.[0];
           if (file) {
               try {
                   const base64String = await convertToBase64(file);
                   setFileBase64(base64String); // Store base64 string for new file
               } catch (error) {
                   console.error('Error converting file:', error);
               }
           }
       };

      // Convert file to base64
      const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = (reader.result as string).split(',')[1];
                resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };


    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const payload = {
                notice_type: form.notice_type,
                notice_date: form.notice_date,
                reference_number: form.reference_number,
                notice_detail: form.notice_detail,
                notice_document: fileBase64 ? fileBase64 : form.notice_document,
            };

            await httpClient.put(endpoints.noticeTracker.updateFollowupNotice(followUpId), payload);

            toast.push(
                <Notification title="Success" type="success" closable={true}>
                    Follow-up notice updated successfully.
                </Notification>
            );

            onClose(); // Close the dialog after successful submission
        } catch (error) {
            throw error;
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
                                <button
                                    onClick={handleDocumentView}
                                    className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0"
                                    title="View Document"
                                >
                                    <Eye size={20} />
                                </button>
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