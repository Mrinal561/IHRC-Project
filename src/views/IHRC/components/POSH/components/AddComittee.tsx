// import React, { useState, useEffect } from 'react';
// import { Button, Dialog, Input, Notification, Tooltip } from '@/components/ui';
// import { HiPlus, HiTrash, HiDownload } from 'react-icons/hi';
// import OutlinedSelect from '@/components/ui/Outlined/Outlined';
// import { IoArrowBack } from 'react-icons/io5';
// import { useNavigate } from 'react-router-dom';
// import httpClient from '@/api/http-client';
// import { endpoints } from '@/api/endpoint';
// import useAuth from '@/utils/hooks/useAuth';

// interface CommitteeMember {
//     fullName: string;
//     designation: string;
//     email: string;
//     mobile: string;
// }

// interface SelectOption {
//     value: string;
//     label: string;
// }

// const AddCommittee = () => {
//     const [loading, setLoading] = useState(false);
//     const [companies, setCompanies] = useState<SelectOption[]>([]);
//     const [companyGroups, setCompanyGroups] = useState('');
//     const [companyGroupId, setCompanyGroupId] = useState('');
//     const [formData, setFormData] = useState({
//         company_id: '',
//         committee_type: '',
//         members: [
//             { fullName: '', designation: '', email: '', mobile: '' },
//             { fullName: '', designation: '', email: '', mobile: '' },
//             { fullName: '', designation: '', email: '', mobile: '' },
//             { fullName: '', designation: '', email: '', mobile: '' }
//         ]
//     });

//     const auth = useAuth();
//     const userId = (auth as any).user?.id || 0;
//     const navigate = useNavigate();

//     const committeeTypeOptions = [
//         { value: 'one', label: 'One' },
//         { value: 'zone', label: 'Zone' },
//         { value: 'state', label: 'State Wise' }
//     ];

//     useEffect(() => {
//         loadCompanyGroups();
//     }, []);

//     const loadCompanyGroups = async () => {
//         try {
//             const { data } = await httpClient.get(endpoints.companyGroup.getAll(), {
//                 params: { ignorePlatform: true }
//             });
//             if (data.data && data.data.length > 0) {
//                 const defaultGroup = data.data[0];
//                 setCompanyGroups(defaultGroup.name);
//                 setCompanyGroupId(defaultGroup.id);
//                 loadCompanies(defaultGroup.id);
//             }
//         } catch (error) {
//             console.error('Failed to load company groups:', error);
//             Notification.error({
//                 title: 'Error',
//                 message: 'Failed to load company groups'
//             });
//         }
//     };

//     const loadCompanies = async (groupId: string) => {
//         try {
//             const { data } = await httpClient.get(endpoints.company.getAll(), {
//                 params: { 'group_id[]': groupId }
//             });
//             const formattedCompanies = data?.data?.map((company: any) => ({
//                 label: company.name,
//                 value: String(company.id)
//             }));
//             setCompanies(formattedCompanies || []);
//         } catch (error) {
//             console.error('Failed to load companies:', error);
//             Notification.error({
//                 title: 'Error',
//                 message: 'Failed to load companies'
//             });
//         }
//     };

//     const handleInputChange = (field: string, value: string, memberIndex?: number, memberField?: keyof CommitteeMember) => {
//         if (memberIndex !== undefined && memberField !== undefined) {
//             const updatedMembers = [...formData.members];
//             updatedMembers[memberIndex] = {
//                 ...updatedMembers[memberIndex],
//                 [memberField]: value
//             };
//             setFormData({ ...formData, members: updatedMembers });
//         } else {
//             setFormData({ ...formData, [field]: value });
//         }
//     };

//     const addMemberRow = () => {
//         setFormData({
//             ...formData,
//             members: [
//                 ...formData.members,
//                 { fullName: '', designation: '', email: '', mobile: '' }
//             ]
//         });
//     };

//     const removeMemberRow = (index: number) => {
//         if (formData.members.length <= 4) {
//             Notification.warning({
//                 title: 'Warning',
//                 message: 'Minimum 4 members are required'
//             });
//             return;
//         }
        
//         const updatedMembers = [...formData.members];
//         updatedMembers.splice(index, 1);
//         setFormData({ ...formData, members: updatedMembers });
//     };

//     const handleSubmit = async () => {
//         // Validate required fields
//         if (!formData.company_id || !formData.committee_type) {
         
//             return;
//         }
    
//         // Validate at least 4 members
//         if (formData.members.length < 4) {
          
//             return;
//         }
    
//         // Validate all required member fields
//         const invalidMembers = formData.members.some(member => 
//             !member.fullName || !member.designation
//         );
        
//         if (invalidMembers) {
          
//             return;
//         }
    
//         // Prepare the request data
//         const requestData = {
//             company_id: Number(formData.company_id),
//             committee_type: formData.committee_type,
//             committee: formData.members,
//             created_by: userId
//         };
    
//         try {
//             setLoading(true);
//             const response = await httpClient.post(
//                 endpoints.poshSetup.createCommittee(),
//                 requestData
//             );
//     if(response) {
//         navigate('/committee');
//     }
          
//         } catch (error: any) {
           
//         } finally {
//             setLoading(false);
//         }
//     };

//     const resetForm = () => {
//         setFormData({
//             company_id: '',
//             committee_type: '',
//             members: [
//                 { fullName: '', designation: '', email: '', mobile: '' },
//                 { fullName: '', designation: '', email: '', mobile: '' },
//                 { fullName: '', designation: '', email: '', mobile: '' },
//                 { fullName: '', designation: '', email: '', mobile: '' }
//             ]
//         });
//     };

//     return (
//         <div className="p-6">
//             <div className="">
//                 <div className='flex gap-2 items-center'>
//                     <Button
//                         size="sm"
//                         variant="plain"
//                         icon={<IoArrowBack className="text-[#72828e] hover:text-[#5d6169]" />}
//                         onClick={() => navigate(-1)}
//                     />
//                     <h2 className="text-2xl font-bold">Add New Committee</h2>
//                 </div>
                
//                 {/* Company Group and Company */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-8">
//                     {/* Company Group (read-only) */}
//                     {/* <div>
//                         <label className="block text-sm font-medium mb-2">Company Group</label>
//                         <Input
//                             value={companyGroups}
//                             onChange={() => {}}
//                             readOnly
//                         />
//                     </div> */}
                    
//                     {/* Company Select */}
//                     <div>
//                         <label className="block text-sm font-medium mb-2">Company</label>
//                         <OutlinedSelect
//                             options={companies}
//                             value={companies.find(opt => opt.value === formData.company_id)}
//                             onChange={(selected) => handleInputChange('company_id', selected?.value || '')}
//                             label="Select Company"
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium mb-2">Committee Type</label>
//                         <OutlinedSelect
//                             options={committeeTypeOptions}
//                             value={committeeTypeOptions.find(opt => opt.value === formData.committee_type)}
//                             onChange={(selected) => handleInputChange('committee_type', selected?.value || '')}
//                             label="Select Committee Type"
//                         />
//                     </div>
//                 </div>

//                 {/* Committee Type */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                   
//                 </div>

//                 {/* Committee Members */}
//                 <div className="mb-8">
//                     <h3 className="text-lg font-semibold mb-4">Committee Members</h3>
                    
//                     {formData.members.map((member, index) => (
//                         <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end">
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">
//                                     {index === 0 ? 'First User' : 
//                                      index === 1 ? 'Second User' : 
//                                      index === 2 ? 'Third User' : 
//                                      index === 3 ? 'Fourth User' : 
//                                      `Member ${index + 1}`}
//                                 </label>
//                                 <Input
//                                     value={member.fullName}
//                                     onChange={(e) => handleInputChange('', e.target.value, index, 'fullName')}
//                                     placeholder="Full Name"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">Designation</label>
//                                 <Input
//                                     value={member.designation}
//                                     onChange={(e) => handleInputChange('', e.target.value, index, 'designation')}
//                                     placeholder="Designation"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">Email</label>
//                                 <Input
//                                     value={member.email}
//                                     onChange={(e) => handleInputChange('', e.target.value, index, 'email')}
//                                     placeholder="Email"
//                                     type="email"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">Mobile</label>
//                                 <Input
//                                     value={member.mobile}
//                                     onChange={(e) => handleInputChange('', e.target.value, index, 'mobile')}
//                                     placeholder="Mobile"
//                                     type="tel"
//                                 />
//                             </div>
//                             <div className="flex justify-end">
//                                 {index >= 4 && (
//                                     <Tooltip title="Remove member">
//                                         <Button
//                                             variant="plain"
//                                             shape="circle"
//                                             icon={<HiTrash />}
//                                             onClick={() => removeMemberRow(index)}
//                                             className="text-red-500 hover:text-red-600"
//                                         />
//                                     </Tooltip>
//                                 )}
//                             </div>
//                         </div>
//                     ))}

//                     <div className="mt-4">
//                         <Button
//                             variant="twoTone"
//                             size="sm"
//                             icon={<HiPlus />}
//                             onClick={addMemberRow}
//                         >
//                             Add Another Member
//                         </Button>
//                     </div>
//                 </div>

//                 {/* Form Actions */}
//                 <div className="flex justify-end gap-4 border-t pt-6">
//                     <Button
//                         variant="plain"
//                         onClick={resetForm}
//                     >
//                         Cancel
//                     </Button>
//                     <Button
//                         variant="solid"
//                         onClick={handleSubmit}
//                         loading={loading}
//                     >
//                         Confirm
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddCommittee;





import React, { useState, useEffect } from 'react';
import { Button, Dialog, Input, Notification, Tooltip, toast } from '@/components/ui';
import { HiPlus, HiTrash, HiDownload, HiMinus } from 'react-icons/hi';
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

interface SelectOption {
    value: string;
    label: string;
}

const AddCommittee = () => {
    const [loading, setLoading] = useState(false);
    const [companies, setCompanies] = useState<SelectOption[]>([]);
    const [states, setStates] = useState<SelectOption[]>([]);
    const [companyGroups, setCompanyGroups] = useState('');
    const [companyGroupId, setCompanyGroupId] = useState('');
    const [formData, setFormData] = useState({
        company_id: '',
        committee_type: '',
        zone_type: '',
        state_id: '',
        members: [
            { fullName: '', designation: '', email: '', mobile: '' },
            { fullName: '', designation: '', email: '', mobile: '' },
            { fullName: '', designation: '', email: '', mobile: '' },
            { fullName: '', designation: '', email: '', mobile: '' }
        ]
    });

    const auth = useAuth();
    const userId = (auth as any).user?.id || 0;
    const navigate = useNavigate();

    const committeeTypeOptions = [
        { value: 'one', label: 'Single' },
        { value: 'zone', label: 'Zone' },
        { value: 'state', label: 'State Wise' }
    ];

    const zoneTypeOptions = [
        { value: 'zone 1', label: 'Zone 1' },
        { value: 'zone 2', label: 'Zone 2' },
        { value: 'zone 3', label: 'Zone 3' },
        { value: 'zone 4', label: 'Zone 4' }
    ];

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            // Load company groups
            const { data: groupsData } = await httpClient.get(endpoints.companyGroup.getAll(), {
                params: { ignorePlatform: true }
            });
            
            if (groupsData.data && groupsData.data.length > 0) {
                const defaultGroup = groupsData.data[0];
                setCompanyGroups(defaultGroup.name);
                setCompanyGroupId(defaultGroup.id);
                loadCompanies(defaultGroup.id);
            }

            // Load states
            const { data: statesData } = await httpClient.get(endpoints.common.state());
            setStates(statesData.map((state: any) => ({
                label: state.name,
                value: String(state.id)
            })));
        } catch (error) {
            console.error('Failed to load initial data:', error);
            
        }
    };

    const loadCompanies = async (groupId: string) => {
        try {
            const { data } = await httpClient.get(endpoints.company.getAll(), {
                params: { 'group_id[]': groupId }
            });
            const formattedCompanies = data?.data?.map((company: any) => ({
                label: company.name,
                value: String(company.id)
            }));
            setCompanies(formattedCompanies || []);
        } catch (error) {
            console.error('Failed to load companies:', error);
           
        }
    };

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
            toast.push(
                <Notification 
                title='warning'
                closable={true}
                type='warning'
                >
                    Minimum 4 members are required
                </Notification>
            )
            return;
        }
        
        const updatedMembers = [...formData.members];
        updatedMembers.splice(index, 1);
        setFormData({ ...formData, members: updatedMembers });
    };

    const handleSubmit = async () => {
        // Validate required fields
        if (!formData.company_id || !formData.committee_type) {
         
             toast.push(
                <Notification 
                title='warning'
                closable={true}
                type='warning'
                >
                    Company and Committee Type are required
                </Notification>
            )
            return;
        }
    
        // Validate committee type specific fields
        if (formData.committee_type === 'zone' && !formData.zone_type) {
        toast.push(
                <Notification 
                title='warning'
                closable={true}
                type='warning'
                >
                    Zone type is required for zone committees
                </Notification>
            )
            return;
        }
        
        if (formData.committee_type === 'state' && !formData.state_id) {
         toast.push(
                <Notification 
                title='warning'
                closable={true}
                type='warning'
                >
                   State is required for state committees
                </Notification>
            )
            return;
        }
    
        // Validate at least 4 members
        if (formData.members.length < 4) {
         toast.push(
                <Notification 
                title='warning'
                closable={true}
                type='warning'
                >
                   Minimum 4 committee members are require
                </Notification>
            )
            return;
        }
    
        // Validate all required member fields
        const invalidMembers = formData.members.some(member => 
            !member.fullName.trim() || !member.designation.trim() || !member.email.trim() || !member.mobile.trim()
        );
        
        if (invalidMembers) {
           
            toast.push(
                <Notification 
                title='warning'
                closable={true}
                type='warning'
                >
                   All fields are required for each committee member
                </Notification>
            )
            return;
        }
    
        // Prepare the request data
        const requestData = {
            company_id: Number(formData.company_id),
            committee_type: formData.committee_type,
            committee: formData.members,
            zone_type: formData.zone_type || undefined,
            state_id: formData.state_id ? Number(formData.state_id) : undefined,
            created_by: userId
        };
    
        try {
            setLoading(true);
            const response = await httpClient.post(
                endpoints.poshSetup.createCommittee(),
                requestData
            );
            
            if(response) {
                 toast.push(
                <Notification 
                title='success'
                closable={true}
                type='success'
                >
                   Committee created successfully
                </Notification>
            )
                navigate('/committee');
            }
        } catch (error: any) {
            console.error('Error creating committee:', error);
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

    const resetForm = () => {
        setFormData({
            company_id: '',
            committee_type: '',
            zone_type: '',
            state_id: '',
            members: [
                { fullName: '', designation: '', email: '', mobile: '' },
                { fullName: '', designation: '', email: '', mobile: '' },
                { fullName: '', designation: '', email: '', mobile: '' },
                { fullName: '', designation: '', email: '', mobile: '' }
            ]
        });
    };

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
                    {/* Company Select */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Company <span className="text-red-500">*</span>
                        </label>
                        <OutlinedSelect
                            options={companies}
                            value={companies.find(opt => opt.value === formData.company_id)}
                            onChange={(selected) => handleInputChange('company_id', selected?.value || '')}
                            label="Select Company"
                        />
                    </div>
                    
                    {/* Committee Type */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Committee Type <span className="text-red-500">*</span>
                        </label>
                        <OutlinedSelect
                            options={committeeTypeOptions}
                            value={committeeTypeOptions.find(opt => opt.value === formData.committee_type)}
                            onChange={(selected) => handleInputChange('committee_type', selected?.value || '')}
                            label="Select Committee Type"
                        />
                    </div>
                </div>

                {/* Conditional Fields based on Committee Type */}
                {formData.committee_type === 'zone' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Zone Type <span className="text-red-500">*</span>
                            </label>
                            <OutlinedSelect
                                options={zoneTypeOptions}
                                value={zoneTypeOptions.find(opt => opt.value === formData.zone_type)}
                                onChange={(selected) => handleInputChange('zone_type', selected?.value || '')}
                                label="Select Zone Type"
                            />
                        </div>
                    </div>
                )}

                {formData.committee_type === 'state' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                State <span className="text-red-500">*</span>
                            </label>
                            <OutlinedSelect
                                options={states}
                                value={states.find(opt => opt.value === formData.state_id)}
                                onChange={(selected) => handleInputChange('state_id', selected?.value || '')}
                                label="Select State"
                            />
                        </div>
                    </div>
                )}

                  {/* Committee Members */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Committee Members</h3>
                    
                    <div className="space-y-6">
                        {formData.members.map((member, index) => (
                            <div key={index} className="border rounded-lg p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-medium">
                                        {index === 0 ? 'Member 1' : 
                                         index === 1 ? 'Member 2' : 
                                         index === 2 ? 'Member 3' : 
                                         index === 3 ? 'Member 4' : 
                                         `Member ${index + 1}`} <span className="text-red-500">*</span>
                                    </h4>
                                    {index >= 4 && (
                                        <Tooltip title="Remove member">
                                            <Button
                                                variant="plain"
                                                shape="circle"
                                                size="sm"
                                                icon={<HiMinus />}
                                                onClick={() => removeMemberRow(index)}
                                                className="text-red-500 hover:text-red-600"
                                            />
                                        </Tooltip>
                                    )}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            value={member.fullName}
                                            onChange={(e) => handleInputChange('', e.target.value, index, 'fullName')}
                                            placeholder="Enter full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Designation <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            value={member.designation}
                                            onChange={(e) => handleInputChange('', e.target.value, index, 'designation')}
                                            placeholder="Enter designation"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            value={member.email}
                                            onChange={(e) => handleInputChange('', e.target.value, index, 'email')}
                                            placeholder="Enter email"
                                            type="email"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Mobile <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            value={member.mobile}
                                            onChange={(e) => handleInputChange('', e.target.value, index, 'mobile')}
                                            placeholder="Enter mobile number"
                                            type="tel"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

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