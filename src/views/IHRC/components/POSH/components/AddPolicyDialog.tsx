import React, { useState } from 'react';
import { Dialog, Button, Select, Notification, toast } from '@/components/ui';
import { HiPlusCircle } from 'react-icons/hi';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';

interface AddPolicyDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    companies: Array<{ id: number; name: string }>;
}

interface SelectOption {
    value: number;
    label: string;
}
const AddPolicyDialog = ({ isOpen, onClose, onSuccess, companies }: AddPolicyDialogProps) => {
const [selectedCompany, setSelectedCompany] = useState<number | SelectOption | null>(null);
    const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
    if (!selectedCompany) {
        toast.push(
            <Notification title='warning' closable type='warning'>
                Please select a company
            </Notification>
        );
        return;
    }

    setLoading(true);
    try {
        // Get the numeric company ID regardless of the input type
        const companyId = typeof selectedCompany === 'object' 
            ? selectedCompany.value 
            : selectedCompany;

        const response = await httpClient.post(endpoints.poshSetup.createPolicy(), {
            company_id: companyId
        });

        toast.push(
            <Notification title='success' closable type='success'>
                Policy created successfully
            </Notification>
        );

        onSuccess();
        onClose();
    } catch (error: any) {
        console.error('Error creating policy:', error);
        toast.push(
            <Notification title='error' closable type='error'>
                {error.response?.data?.message || 'Failed to create policy'}
            </Notification>
        );
    } finally {
        setLoading(false);
    }
};

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={500}
        >
            <h5 className="mb-4">Upload Policy</h5>
            
            <div className="mb-4">
                <label className="block mb-2">Select Company</label>
                <OutlinedSelect
    options={companies.map(company => ({
        value: company.id,
        label: company.name
    }))}
    value={selectedCompany}
    onChange={(value: number | SelectOption) => {
        // Store the value directly if it's a number, or the object if the component returns that
        setSelectedCompany(value);
    }}
    label="Select a company"
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
                    icon={<HiPlusCircle />}
                    onClick={handleSubmit}
                >
                    Create Policy
                </Button>
            </div>
        </Dialog>
    );
};

export default AddPolicyDialog;