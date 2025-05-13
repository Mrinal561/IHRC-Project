import React, { useState } from 'react';
import { Button, Dialog, Input, Notification, Tooltip } from '@/components/ui';
import { HiPlus, HiTrash, HiDownload } from 'react-icons/hi';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import useAuth from '@/utils/hooks/useAuth';

interface CommitteeMember {
    fullName: string;
    designation: string;
    email: string;
    mobile: string;
}

const AddCommittee = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        company_id: '',
        committee_type: '',
        members: [
            { fullName: '', designation: '', email: '', mobile: '' },
            { fullName: '', designation: '', email: '', mobile: '' },
            { fullName: '', designation: '', email: '', mobile: '' },
            { fullName: '', designation: '', email: '', mobile: '' }
        ]
    });

// In your component
const auth = useAuth();
const userId = (auth as any).user?.id || 0; // Fallback to 0 if not available    const userId = user?.id || 0;
    const navigate = useNavigate();

    const committeeTypeOptions = [
        { value: 'one', label: 'One' },
        { value: 'zone', label: 'Zone' },
        { value: 'state', label: 'State Wise' }
    ];

    // Mock companies - replace with your actual company data
    const companies = [
        { value: '1', label: 'Adani Solutions' },
        { value: '2', label: 'Adani Power' }
    ];

    const handleInputChange = (field: string, value: string, memberIndex?: number, memberField?: keyof CommitteeMember) => {
        if (memberIndex !== undefined && memberField !== undefined) {
            const updatedMembers = [...formData.members];
            updatedMembers[memberIndex] = {
                ...updatedMembers[memberIndex],
                [memberField]: value
            };
            setFormData({ ...formData, members: updatedMembers });
        } else {
            setFormData({ ...formData, [field]: value });
        }
    };

    const addMemberRow = () => {
        setFormData({
            ...formData,
            members: [
                ...formData.members,
                { fullName: '', designation: '', email: '', mobile: '' }
            ]
        });
    };

    const removeMemberRow = (index: number) => {
        if (formData.members.length <= 4) {
           
            return;
        }
        
        const updatedMembers = [...formData.members];
        updatedMembers.splice(index, 1);
        setFormData({ ...formData, members: updatedMembers });
    };

    const handleSubmit = async () => {
        // Validate required fields
        if (!formData.company_id || !formData.committee_type) {
         
            return;
        }
    
        // Validate at least 4 members
        if (formData.members.length < 4) {
            
            return;
        }
    
        // Prepare the request data
        const requestData = {
            company_id: Number(formData.company_id), // Ensure it's a number
            committee_type: formData.committee_type, // Extract just the value
            committee: formData.members,
            created_by: userId
        };
    
        try {
            setLoading(true);
            const response = await httpClient.post(
                endpoints.poshSetup.createCommittee(),
                requestData
            );
    
          
            navigate('/committee');
        } catch (error) {
            
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            company_id: '',
            committee_type: '',
            members: [
                { fullName: '', designation: '', email: '', mobile: '' },
                { fullName: '', designation: '', email: '', mobile: '' },
                { fullName: '', designation: '', email: '', mobile: '' },
                { fullName: '', designation: '', email: '', mobile: '' }
            ]
        });
    };

    // const downloadTemplate = async (format: 'pdf' | 'word') => {
    //     try {
    //         const endpoint = format === 'pdf' 
    //             ? endpoints.poshSetup.downloadPdfTemplate()
    //             : endpoints.poshSetup.downloadWordTemplate();

    //         const response = await httpClient.get(endpoint, {
    //             responseType: 'blob'
    //         });
            
    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute('download', `committee-template.${format}`);
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //         window.URL.revokeObjectURL(url);

    //         Notification.info({
    //             title: 'Download Started',
    //             message: `Committee ${format.toUpperCase()} template download has started`
    //         });
    //     } catch (error) {
    //         Notification.error({
    //             title: 'Error',
    //             message: `Failed to download ${format.toUpperCase()} template`
    //         });
    //     }
    // };

    return (
        <div className="p-6">
            <div className="">
                <div className='flex gap-2 items-center'>
                    <Button
                        size="sm"
                        variant="plain"
                        icon={<IoArrowBack className="text-[#72828e] hover:text-[#5d6169]" />}
                        onClick={() => navigate(-1)}
                    />
                    <h2 className="text-2xl font-bold">Add New Committee</h2>
                </div>
                
                {/* Company and Committee Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-8">
                    <div>
                        <label className="block text-sm font-medium mb-2">Company</label>
                        <OutlinedSelect
  options={companies}
  value={companies.find(opt => opt.value === formData.company_id)}
  onChange={(selected) => handleInputChange('company_id', selected?.value || '')}
  label="Select Company"
/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Committee Type</label>
                        <OutlinedSelect
    options={committeeTypeOptions}
    value={committeeTypeOptions.find(opt => opt.value === formData.committee_type)}
    onChange={(selected) => handleInputChange('committee_type', selected?.value || '')}
    label="Select Committee Type"
/>
                    </div>
                </div>

                {/* Committee Members */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Committee Members</h3>
                    
                    {formData.members.map((member, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    {index === 0 ? 'First User' : 
                                     index === 1 ? 'Second User' : 
                                     index === 2 ? 'Third User' : 
                                     index === 3 ? 'Fourth User' : 
                                     `Member ${index + 1}`}
                                </label>
                                <Input
                                    value={member.fullName}
                                    onChange={(e) => handleInputChange('', e.target.value, index, 'fullName')}
                                    placeholder="Full Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Designation</label>
                                <Input
                                    value={member.designation}
                                    onChange={(e) => handleInputChange('', e.target.value, index, 'designation')}
                                    placeholder="Designation"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <Input
                                    value={member.email}
                                    onChange={(e) => handleInputChange('', e.target.value, index, 'email')}
                                    placeholder="Email"
                                    type="email"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Mobile</label>
                                <Input
                                    value={member.mobile}
                                    onChange={(e) => handleInputChange('', e.target.value, index, 'mobile')}
                                    placeholder="Mobile"
                                    type="tel"
                                />
                            </div>
                            <div className="flex justify-end">
                                {index >= 4 && (
                                    <Tooltip title="Remove member">
                                        <Button
                                            variant="plain"
                                            shape="circle"
                                            icon={<HiTrash />}
                                            onClick={() => removeMemberRow(index)}
                                            className="text-red-500 hover:text-red-600"
                                        />
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                    ))}

                    <div className="mt-4">
                        <Button
                            variant="twoTone"
                            size="sm"
                            icon={<HiPlus />}
                            onClick={addMemberRow}
                        >
                            Add Another Member
                        </Button>
                    </div>
                </div>

                {/* Template Download */}
                {/* <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Download Template</h3>
                    <div className="flex gap-4">
                        <Button
                            variant="solid"
                            size="sm"
                            icon={<HiDownload />}
                            onClick={() => downloadTemplate('pdf')}
                        >
                            Download PDF Template
                        </Button>
                        <Button
                            variant="solid"
                            size="sm"
                            icon={<HiDownload />}
                            onClick={() => downloadTemplate('word')}
                        >
                            Download Word Template
                        </Button>
                    </div>
                </div> */}

                {/* Form Actions */}
                <div className="flex justify-end gap-4 border-t pt-6">
                    <Button
                        variant="plain"
                        onClick={resetForm}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        onClick={handleSubmit}
                        loading={loading}
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddCommittee;