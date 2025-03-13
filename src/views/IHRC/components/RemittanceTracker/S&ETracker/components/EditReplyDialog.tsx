import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Input, Card, Spinner, Dialog, Tooltip } from '@/components/ui';
import OutlinedInput from '@/components/ui/OutlinedInput';
import { toast, Notification } from '@/components/ui';
import { IoArrowBack } from 'react-icons/io5';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json';
import { Eye } from 'lucide-react';

const EditReplyDialog = ({ replyId, onClose, isOpen }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [form, setForm] = useState({
        notice_sent_at: null,
        notice_reply: '',
        reply_document: null, // Existing document path or null
    });
    const [errors, setErrors] = useState({});
    const [fileBase64, setFileBase64] = useState<string>(''); // For new file uploads

    // Fetch reply details when the component mounts or replyId changes
    useEffect(() => {
        const fetchReplyDetails = async () => {
            try {
                const response = await httpClient.get(endpoints.noticeTracker.replyNoticeDetail(replyId));
                const replyData = response.data;

                console.log("Fetched Reply Data:", replyData); // Debugging
                const noticeSentAt = replyData.notice_sent_at ? new Date(replyData.notice_sent_at) : null;

                // Update form state with fetched data
                setForm({
                    notice_sent_at: noticeSentAt,
                    notice_reply: replyData.notice_reply || '',
                    reply_document: replyData.reply_documents?.[0] || null, // Existing document path
                });
            } catch (error) {
                console.error("Error fetching reply details:", error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen && replyId) {
            fetchReplyDetails();
        }
    }, [replyId, isOpen]);

    // Handle form field changes
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

    // Handle form submission
    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            // Prepare payload
            const payload = {
                notice_sent_at: form.notice_sent_at,
                notice_reply: form.notice_reply,
                reply_documents: fileBase64 ? [fileBase64] : form.reply_document ? [form.reply_document] : [], // Send new file or existing document
            };

            // Send PUT request to update the reply
            await httpClient.put(endpoints.noticeTracker.updateReplyNotice(replyId), payload);

            // Show success notification
            toast.push(
                <Notification title="Success" type="success" closable={true}>
                    Reply updated successfully.
                </Notification>
            );

            // Close the dialog
            onClose();
        } catch (error) {
            console.error("Error updating reply:", error);
          throw error
        } finally {
            setIsLoading(false);
        }
    };

    // Handle document view
    const handleDocumentView = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (form.reply_document) {
            const fullPath = `${import.meta.env.VITE_API_GATEWAY}/${form.reply_document}`;
            window.open(fullPath, '_blank');
        }
    };

    // Show loading spinner while fetching data
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

    // Render the edit dialog
    return (
        <Dialog isOpen={isOpen} onClose={onClose} width={600} shouldCloseOnOverlayClick={false}>
            <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">Edit Reply</h2>
                <div className="space-y-4">
                    {/* Reply Date */}
                    <div>
                        <label className="text-sm font-medium">Reply Date</label>
                        <DatePicker
                            clearable
                            size="sm"
                            placeholder="Select Date"
                            value={form.notice_sent_at}
                            onChange={(date) => handleChange('notice_sent_at', date)}
                            inputFormat="DD/MM/YYYY"
                            maxDate={new Date()}
                        />
                    </div>

                    {/* Details of the Reply */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Details Of The Reply</label>
                        <OutlinedInput
                            label="Details of the Reply"
                            value={form.notice_reply}
                            onChange={(value) => handleChange('notice_reply', value)}
                            textarea={true}
                        />
                    </div>

                    {/* Reply Document */}
                    <div>
                        <label className="text-sm font-medium">Reply Document (PDF/Zip/Image, Max 20MB)</label>
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

                {/* Action Buttons */}
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

export default EditReplyDialog;