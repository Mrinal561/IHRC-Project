import React, { useState } from 'react';
import { Button, Dialog, Input, Notification, Select, Tooltip } from '@/components/ui';
import { HiPlus, HiTrash, HiDownload } from 'react-icons/hi';
import { useAppSelector } from '@/store';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

interface CommitteeMember {
    name: string;
    designation: string;
    email: string;
    mobile: string;
}

const AddCommittee = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        company: '',
        committeeType: '',
        members: [
            { name: '', designation: '', email: '', mobile: '' },
            { name: '', designation: '', email: '', mobile: '' },
            { name: '', designation: '', email: '', mobile: '' },
            { name: '', designation: '', email: '', mobile: '' }
        ]
    });

    // const companies = useAppSelector(state => state.company.data);
    
    const committeeTypeOptions = [
        { value: 'one', label: 'One' },
        { value: 'zone', label: 'Zone' },
        { value: 'state', label: 'State Wise' }
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
                { name: '', designation: '', email: '', mobile: '' }
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

    const handleSubmit = () => {
        // Validate required fields
        if (!formData.company || !formData.committeeType) {
           
            return;
        }

        // Validate at least 4 members
        if (formData.members.length < 4) {
           
            return;
        }

        // Validate member details
        for (const member of formData.members) {
            if (!member.name || !member.designation || !member.email || !member.mobile) {
               
                return;
            }
        }

        // Submit logic would go here
       
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            company: '',
            committeeType: '',
            members: [
                { name: '', designation: '', email: '', mobile: '' },
                { name: '', designation: '', email: '', mobile: '' },
                { name: '', designation: '', email: '', mobile: '' },
                { name: '', designation: '', email: '', mobile: '' }
            ]
        });
        setIsDialogOpen(false);
    };

    const downloadTemplate = (format: 'pdf' | 'word') => {
        
    };

    const company = [
        { value: "adani_solution", name: 'Adani SOlution' },
    ]

    const navigate = useNavigate()

    return (
        <div className="p-6">
            <div className="">
                <div className='flex gap-2 items-center'>

                 <Button
                                    size="sm"
                                    variant="plain"
                                    icon={
                                        <IoArrowBack className="text-[#72828e] hover:text-[#5d6169]" />
                                    }
                                    onClick={() => navigate(-1)}
                                />
                <h2 className="text-2xl font-bold">Add New Committee</h2>
                                    </div>
                
                {/* Company and Committee Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-8">
                    <div>
                        <label className="block text-sm font-medium mb-2">Company</label>
                        <OutlinedSelect
                            options={company}
                            value={formData.company}
                            // onChange={(value) => handleInputChange('company', value)}
                            label="Select Company" onChange={undefined}                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Committee Type</label>
                        <OutlinedSelect
                            options={committeeTypeOptions}
                            value={formData.committeeType}
                            onChange={(value) => handleInputChange('committeeType', value)}
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
                                    value={member.name}
                                    onChange={(e) => handleInputChange('', e.target.value, index, 'name')}
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
                            {/* <div className="flex justify-end">
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
                            </div> */}
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
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddCommittee;