import React, { useState } from 'react';
import { Button, Dialog, Notification, toast } from '@/components/ui';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

interface GenerateCertificateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    companyId?: number;
    month: string;
    year: string;
}

const GenerateCertificateDialog: React.FC<GenerateCertificateDialogProps> = ({ 
    isOpen, 
    onClose, 
    onSuccess,
    companyId,
    month,
    year
}) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!companyId) return;

        setIsGenerating(true);
        try {
            const response = await httpClient.post(endpoints.compliance.creteCertificate(), {
                companyId,
                month,
                year
            });

            toast.push(
                <Notification title="Success" type="success" closable>
                    Certificate generated successfully!
                </Notification>
            );
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to generate certificate:', error);
            toast.push(
                <Notification title="Error" type="error" closable>
                    Failed to generate certificate
                </Notification>
            );
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            onRequestClose={onClose}
            width={400}
        >
            <h5 className="mb-4">Generate Compliance Certificate</h5>
            <p>Are you sure you want to generate a compliance certificate for:</p>
            <p className="font-semibold mt-2">
                Month: {month}, Year: {year}
            </p>
            
            <div className="mt-6 text-right">
                <Button
                    size="sm"
                    className="mr-2"
                    onClick={onClose}
                    disabled={isGenerating}
                >
                    Cancel
                </Button>
                <Button
                    variant="solid"
                    size="sm"
                    onClick={handleGenerate}
                    loading={isGenerating}
                >
                    {isGenerating ? 'Generating...' : 'Confirm'}
                </Button>
            </div>
        </Dialog>
    );
};

export default GenerateCertificateDialog;