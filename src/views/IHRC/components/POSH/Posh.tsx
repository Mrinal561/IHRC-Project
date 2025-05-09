import React, { useState } from 'react';
import {Button, Dialog, Input, Notification } from '@/components/ui';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import PoshBulkUpload from './components/PoshBulkUpload';
import PoshTable from './components/PoshTable';
import { HiPlusCircle, HiDownload } from 'react-icons/hi';
import OutlinedOutlinedSelect from '@/components/ui/Outlined/Outlined';
import { AdaptableCard } from '@/components/shared'
import OutlinedInput from '@/components/ui/OutlinedInput';

const Posh = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
    const [formData, setFormData] = useState({
        company: '',
        branch: '',
        complaintsReceived: 0,
        complaintsDisposed: 0,
        pendingCases: 0,
        workshops: 1,
        actionTaken: '',
        returnLevel: 'branch'
    });
    const [poshData, setPoshData] = useState([]);
    
    // Assuming you have companies and branches data in your Redux store
    // const companies = useAppOutlinedSelector(state => state.company.data);
    // const branches = useAppOutlinedSelector(state => state.branch.data);
    
    const returnLevelOptions = [
        { value: 'branch', label: 'Branch Level' },
        { value: 'district', label: 'District Level' }
    ];

    const handleInputChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        // Validate workshops - minimum 1
        if (formData.workshops < 1) {
            // Notification.warning({
            //     title: 'Validation Error',
            //     message: 'Number of workshops must be at least 1'
            // });
            return;
        }

        // In a real app, you would call an API here
        const newEntry = {
            id: Date.now().toString(),
            companyGroup: 'IHRC', // Default as per requirements
            ...formData,
            // company: companies.find(c => c.id === formData.company)?.name || '',
            // branch: branches.find(b => b.id === formData.branch)?.name || ''
        };

        // setPoshData(prev => [...prev, newEntry]);
        setIsDialogOpen(false);
        setFormData({
            company: '',
            branch: '',
            complaintsReceived: 0,
            complaintsDisposed: 0,
            pendingCases: 0,
            workshops: 1,
            actionTaken: '',
            returnLevel: 'branch'
        });

        // Notification.success({
        //     title: 'Success',
        //     message: 'POSH return added successfully'
        // });
    };

    // const handleDownloadReport = (id) => {
    //     const item = poshData.find(item => item.id === id);
    //     if (!item) return;

    //     // In a real app, you would call an API to generate the PDF
    //     // For demo, we'll just show a notification
    //     Notification.info({
    //         title: 'Download Started',
    //         message: `Downloading report for ${item.company} - ${item.branch}`
    //     });
    // };

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold">POSH Returns</h3>
                </div>
                <div className="flex gap-2">
                    <OutlinedInput label={'Search by branch'} value={''} onChange={function (value: string): void {
                        throw new Error('Function not implemented.');
                    } }></OutlinedInput>
                    <Button size='sm' variant='solid' icon={<HiDownload />}>Download Data</Button>
                    <PoshBulkUpload />
                    <Button
                        variant="solid"
                        size="sm"
                        icon={<HiPlusCircle />}
                        onClick={() => setIsDialogOpen(true)}
                    >
                        Add Return
                    </Button>
                </div>
            </div>

            <PoshTable 
                data={poshData}
                loading={false} onDownload={undefined}                // onDownload={handleDownloadReport}
            />

            {/* Add Return Dialog */}
            <Dialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onRequestClose={() => setIsDialogOpen(false)}
                width={800}
            >
                <h5 className="mb-6">Add POSH Return</h5>
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Select Company</label>
                            <OutlinedSelect
                                options=''
                                value={formData.company}
                                onChange={(value) => handleInputChange('company', value)}
                                label="Select Company"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Select Branch</label>
                            <OutlinedSelect
                                options=''
                                value={formData.branch}
                                onChange={(value) => handleInputChange('branch', value)}
                                label="Select Branch"
                                disabled={!formData.company}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Complaints Received</label>
                            <Input
                                type="number"
                                min="0"
                                value={formData.complaintsReceived}
                                onChange={(e) => handleInputChange('complaintsReceived', parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Complaints Disposed</label>
                            <Input
                                type="number"
                                min="0"
                                value={formData.complaintsDisposed}
                                onChange={(e) => handleInputChange('complaintsDisposed', parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Pending Cases (90+ days)</label>
                            <Input
                                type="number"
                                min="0"
                                value={formData.pendingCases}
                                onChange={(e) => handleInputChange('pendingCases', parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Workshops Conducted</label>
                            <Input
                                type="number"
                                min="1"
                                value={formData.workshops}
                                onChange={(e) => handleInputChange('workshops', parseInt(e.target.value) || 1)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Return Level</label>
                            <OutlinedSelect
                                options={returnLevelOptions}
                                value={formData.returnLevel}
                                onChange={(value) => handleInputChange('returnLevel', value)} label={'Return Level'}                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Nature of Action Taken</label>
                        <Input
                            textArea
                            rows={3}
                            value={formData.actionTaken}
                            onChange={(e) => handleInputChange('actionTaken', e.target.value)}
                            placeholder="Describe the actions taken..."
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="plain" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="solid" onClick={handleSubmit}>
                            Confirm
                        </Button>
                    </div>
                </div>
            </Dialog>
        </AdaptableCard>
    );
};

export default Posh;