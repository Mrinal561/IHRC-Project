// import React, { useState, useEffect } from 'react';
// import { Button, DatePicker, Dialog, Input } from '@/components/ui';
// import { HiPlusCircle } from 'react-icons/hi';
// import OutlinedInput from '@/components/ui/OutlinedInput';
// // import OutlinedSelect from '@/components/ui/OutlinedSelect/OutlinedSelect';
// import DistrictAutosuggest from '../../../Entity/ESICSetup/components/DistrictAutoSuggest';
// import LocationAutosuggest from '../../../Entity/Branch/components/LocationAutosuggest';
// import httpClient from '@/api/http-client';
// import { endpoints } from '@/api/endpoint';
// import { toast, Notification } from '@/components/ui';
// import OutlinedSelect from '@/components/ui/Outlined/Outlined';
// import { showErrorNotification } from '@/components/ui/ErrorMessage';
// import { useDispatch } from 'react-redux';
// import { createNotice } from '@/store/slices/noticeTracker/noticeTrackerSlice';

// import * as yup from 'yup';
// import store from '@/store';

// interface SelectOption {
//   value: string;
//   label: string;
// }

// interface ValidationErrors {
//   [key: string]: string;
// }

// // Validation schema
// const noticeValidationSchema = yup.object().shape({
//   group_id: yup.number()
//     .min(1, 'Please select a company group')
//     .required('Company group is required'),
//   company_id: yup.number()
//     .min(1, 'Please select a company')
//     .required('Company is required'),
//   state_id: yup.string()
//     .required('State is required'),
//   district_id: yup.number()
//     .min(1, 'Please select a district')
//     .required('District is required'),
//   location: yup.string()
//     .required('Location is required')
//     .min(2, 'Location must be at least 2 characters'),
//   notice_type: yup.string()
//     .required('Notice type is required'),
//   notice_date: yup.date()
//     .required('Notice date is required')
//     .nullable()
//     .typeError('Please select a valid date'),
//   reference_number: yup.string()
//     .required('Reference number is required')
//     .min(3, 'Reference number must be at least 3 characters'),
//   related_act: yup.string()
//     .required('Related act is required')
//     .min(2, 'Related act must be at least 2 characters'),
//   notice_document: yup.string()
//     .required('Notice document is required'),
//   noticeDetails: yup.string()
//     .required('Notice details are required')
//     .min(10, 'Notice details must be at least 10 characters')
// });

// const SandETrackerBulkUpload = ({onSuccess, canCreate}) => {
//   const dispatch = useDispatch();
//   const {login} = store.getState()
//   const [companyGroups, setCompanyGroups] = useState<SelectOption[]>([]);
//   const [selectedCompanyGroup, setSelectedCompanyGroup] = useState<SelectOption | null>(null);
//   const [companies, setCompanies] = useState<SelectOption[]>([]);
//   const [selectedCompany, setSelectedCompany] = useState<SelectOption | null>(null);
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [states, setStates] = useState<SelectOption[]>([]);
//   const [selectedStates, setSelectedStates] = useState<SelectOption | null>(null);
//   const [selectedDistrict, setSelectedDistrict] = useState<{ id: number | null; name: string }>({
//     id: null,
//     name: ''
//   });
//   const [fileBase64, setFileBase64] = useState<string>('');
//   const [selectedDistrictId, setSelectedDistrictId] = useState<number | undefined>();
//   const [selectedLocation, setSelectedLocation] = useState('');
//   const initialFormData = {
//     group_id: 0,
//     company_id: 0,
//     companyGroupName: '',
//     entityName: '',
//     state_id: '',
//     district_id: 0,
//     location: '',
//     notice_type: '',
//     notice_date: null,
//     reference_number: '',
//     related_act: '',
//     notice_document: null,
//     noticeDetails: ''
//   };
//   const [formData, setFormData] = useState(initialFormData);

//   const loadCompanyGroups = async () => {
//     console.log("getting called",login)
//     try {
//       const { data } = await httpClient.get(endpoints.companyGroup.getAll(), {
//         params: { ignorePlatform: true },
//       });
//       setCompanyGroups(
//         data.data.map((v: any) => ({
//           label: v.name,
//           value: String(v.id),
//         }))
//       );
//     } catch (error) {
//       console.error('Failed to load company groups:', error);
//       toast.push(
//         <Notification title="Error" closable={true} type="error">
//           Failed to load company groups
//         </Notification>
//       );
//     }
//   };

//   // Load companies based on selected group
//   const loadCompanies = async (groupId: string[] | number[]) => {
//     console.log("getting called")
//     try {
//       const groupIdParam = [`${groupId}`];
//       const { data } = await httpClient.get(endpoints.company.getAll(), {
//         params: {
//           'group_id[]': groupIdParam,
//         },
//       });
//       if (data?.data) {
//         const formattedCompanies = data.data.map((company: any) => ({
//           label: company.name,
//           value: String(company.id),
//         }));

//         if (formattedCompanies.length > 0) {
//           setCompanies(formattedCompanies);
//         } else {
//           toast.push(
//             <Notification title="Info" type="info">
//               No companies found for this group
//             </Notification>
//           );
//           setCompanies([]);
//         }
//       } else {
//         setCompanies([]);
//       }
//     } catch (error: any) {
//       console.error('Failed to load companies:', error);
//       toast.push(
//         <Notification title="Error" closable={true} type="error">
//           {error.response?.data?.message || 'Failed to load companies'}
//         </Notification>
//       );
//       setCompanies([]);
//     }
//   };

//   // Effect to load company groups on mount
//   useEffect(() => {
//     loadCompanyGroups();
//   }, []);

//   // Effect to load companies when company group changes
//   useEffect(() => {
//     if (selectedCompanyGroup?.value) {
//       loadCompanies(selectedCompanyGroup.value);
//     } else {
//       setCompanies([]);
//     }
//   }, [selectedCompanyGroup]);

//   // Update form data when selections change
//   useEffect(() => {
//     setFormData(prev => ({
//       ...prev,
//       group_id: selectedCompanyGroup?.value ? parseInt(selectedCompanyGroup.value) : 0
//     }));
//   }, [selectedCompanyGroup]);

//   useEffect(() => {
//     setFormData(prev => ({
//       ...prev,
//       company_id: selectedCompany?.value ? parseInt(selectedCompany.value) : 0
//     }));
//   }, [selectedCompany]);

//   // Notice type options
// const noticeTypeOptions = [
//   { value: 'inspection', label: 'Inspection' },
//   { value: 'show_cause', label: 'Show Cause' },
//   { value: 'demand', label: 'Demand' },
//   { value: 'other', label: 'Other' }
// ];

//   const convertToBase64 = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = () => {
//             const base64String = (reader.result as string).split(',')[1];
//             resolve(base64String);
//         };
//         reader.onerror = reject;
//         reader.readAsDataURL(file);
//     });
// };
//   // Load States
//   const loadStates = async () => {
//     console.log("getting called")
//     try {
//       setIsLoading(true);
//       const response = await httpClient.get(endpoints.common.state());
//       console.log(response,"states")
//       if (response.data) {
//         const formattedStates = response.data.map((state: any) => ({
//           label: state.name,
//           value: String(state.id)
//         }));
//         setStates(formattedStates);
//       }
//     } catch (error) {
//       console.error('Failed to load states:', error);
//       toast.push(
//         <Notification title="Error" closable={true} type="error">
//           Failed to load states
//         </Notification>
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle state change
//   const handleStateChange = (option: SelectOption | null) => {
//     setSelectedStates(option);
//     setSelectedDistrict({ id: null, name: '' });
//     setSelectedLocation('');

//     if (option) {
//       setFormData(prev => ({
//         ...prev,
//         state_id: option.value,
//         district_id: 0,
//         location: ''
//       }));
//     }
//   };

//   // Load states on component mount
//   useEffect(() => {
//     loadStates();
//   }, []);

//   const handleChange = (field: string, value: any) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         const base64String = (reader.result as string).split(',')[1];
//         setFileBase64(base64String);
//         setFormData(prev => ({
//           ...prev,
//           notice_document: base64String
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const resetAllStates = () => {
//     // Reset all selection states
//     setSelectedCompanyGroup(null);
//     setSelectedCompany(null);
//     setSelectedStates(null);
//     setSelectedDistrict({ id: null, name: '' });
//     setSelectedDistrictId(undefined);
//     setSelectedLocation('');
//     setFormData(initialFormData);

//     // Reset companies list since it depends on company group selection
//     setCompanies([]);
//   };
//   const handleSubmit = async() => {
//     // Add validation here
//     console.log(formData);
//     try {
//       // Validate all fields
//       // await userValidationSchema.validate(formData, { abortEarly: false });

//       // If validation passes, proceed with user creation
//       const resultAction = await dispatch(createNotice(formData))
//         .unwrap()
//         .catch((error: any) => {
//           if (error.response?.data?.message) {
//             showErrorNotification(error.response.data.message);
//           } else if (error.message) {
//             showErrorNotification(error.message);
//           } else if (Array.isArray(error)) {
//             showErrorNotification(error);
//           } else {
//             showErrorNotification('An unexpected error occurred. Please try again.');
//           }
//           throw error;
//         });

//       if (resultAction) {
//         toast.push(
//           <Notification title="Success" type="success">
//             Uploaded Successfully
//           </Notification>
//       );
//       onSuccess?.();
//       }
//     } catch (error) {
//       // if (error instanceof yup.ValidationError) {
//       //   // Handle validation errors
//       //   const newErrors: ValidationErrors = {};
//       //   error.inner.forEach((err) => {
//       //     if (err.path) {
//       //       newErrors[err.path] = err.message;
//       //     }
//       //   });
//       //   setValidationErrors(newErrors);
//       //   showErrorNotification('Please fix the validation errors');
//       // } else {
//       //   console.error('User creation error:', error);
//       // }
//       console.log(error)
//     }
//     handleClose();
//   };

//   const handleClose = () => {
//     setIsOpen(false);
//     resetAllStates();
//   };

//   return (
//     <>
//     {canCreate && (
//       <Button
//         variant="solid"
//         size="sm"
//         icon={<HiPlusCircle />}
//         onClick={() => setIsOpen(true)}
//       >
//         Add Notice
//       </Button>
//   )}
//       <Dialog
//         isOpen={isOpen}
//         onClose={handleClose}
//         width={800}
//       >
//         <div className="p-3">
//           <h5 className="text-lg font-semibold mb-6">Upload Notice Details</h5>

//           <div className="space-y-3">
//             {/* Serial Number and Company Group Name */}
//             <div className="grid grid-cols-2 gap-2">
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Company Group Name</label>
//                 <OutlinedSelect
//                   label="Select Company Group"
//                   options={companyGroups}
//                   value={selectedCompanyGroup}
//                   onChange={setSelectedCompanyGroup}
//                 />
//               </div>
//               <div className="space-y-2">
//               <label className="text-sm font-medium">Entity Name</label>
//               <OutlinedSelect
//                   label="Select Company"
//                   options={companies}
//                   value={selectedCompany}
//                   onChange={(option: SelectOption | null) => {
//                     setSelectedCompany(option);
//                   }}
//                 />

//             </div>
//             </div>

//             {/* Entity Name */}

//             {/* Location Selection Row */}
//             <div className="grid grid-cols-3 gap-2">
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">State</label>
//                 <OutlinedSelect
//                   label="Select State"
//                   options={states}
//                   value={selectedStates}
//                   onChange={handleStateChange}
//                 />
//               </div>
//               <div className="space-y-2">
//                 {/* <label className="text-sm font-medium">District</label> */}
//                 <DistrictAutosuggest
//                   value={selectedDistrict}
//                   onChange={(district) => {
//                     setSelectedDistrict(district);
//                     setFormData(prev => ({
//                       ...prev,
//                       district_id: district.id || 0
//                     }));
//                   }}
//                   stateId={selectedStates?.value ? parseInt(selectedStates.value) : undefined}
//                   onDistrictSelect={(id) => setSelectedDistrictId(id)}
//                 />
//               </div>
//               <div className="space-y-2">
//                 {/* <label className="text-sm font-medium">Location</label> */}
//                 <LocationAutosuggest
//                   value={selectedLocation}
//                   onChange={(location: string) => {
//                     setSelectedLocation(location);
//                     setFormData(prev => ({
//                       ...prev,
//                       location: location
//                     }));
//                   }}
//                   districtId={selectedDistrictId}
//                 />
//               </div>
//             </div>

//             {/* Notice Type and Received Date */}
//             <div className="grid grid-cols-2 gap-2">
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Notice Type</label>
//                 <OutlinedSelect
//                   label="Select Notice Type"
//                   options={noticeTypeOptions}
//                   value={noticeTypeOptions.find(option => option.value === formData.noticeType)}
//                   onChange={(option) => handleChange('notice_type', option?.value || '')}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Notice Received on</label>
//                 <DatePicker
//                   clearable
//                   size="sm"
//                   placeholder="Select Date"
//                   value={formData.notice_date}
//                   onChange={(date) => handleChange('notice_date', date)}
//                 />
//               </div>
//             </div>

//             {/* Letter Number and Related Act */}
//             <div className="grid grid-cols-3 gap-2">
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Letter/ Notice reference number</label>
//                 <OutlinedInput
//                   label="Reference Number"
//                   value={formData.reference_number}
//                   onChange={(value) => handleChange('reference_number', value)}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Notice related to which Act</label>
//                 <OutlinedInput
//                   label="Related Act"
//                   value={formData.related_act}
//                   onChange={(value) => handleChange('related_act', value)}
//                 />
//               </div>
//               <div className="space-y-2">
//               <label className="text-sm font-medium">Notice Copy (Mandatory)</label>
//               <Input
//                 type="file"
//                 onChange={handleFileChange}
//                 className="w-full"
//                 accept=".pdf,.jpg,.jpeg,.png"
//               />
//             </div>
//             </div>

//             {/* Notice Copy Upload */}

//             {/* Notice Details */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Details of Notice</label>
//               <textarea
//                 className="w-full p-2 border rounded-md h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={formData.noticeDetails}
//                 onChange={(e) => handleChange('noticeDetails', e.target.value)}
//                 placeholder="Enter notice details..."
//               />
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end mt-3 pt-4">
//             <Button
//               variant="plain"
//               onClick={handleClose}
//               className="mr-2"
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="solid"
//               onClick={handleSubmit}
//               loading={isLoading}
//             >
//               Submit
//             </Button>
//           </div>
//         </div>
//       </Dialog>
//     </>
//   );
// };

// export default SandETrackerBulkUpload;

import React, { useState, useEffect } from 'react'
import { Button, DatePicker, Dialog, Input } from '@/components/ui'
import { HiPlusCircle } from 'react-icons/hi'
import OutlinedInput from '@/components/ui/OutlinedInput'
import DistrictAutosuggest from '../../../Entity/ESICSetup/components/DistrictAutoSuggest'
import LocationAutosuggest from '../../../Entity/Branch/components/LocationAutosuggest'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import { toast, Notification } from '@/components/ui'
import OutlinedSelect from '@/components/ui/Outlined/Outlined'
import { showErrorNotification } from '@/components/ui/ErrorMessage'
import { useDispatch } from 'react-redux'
import { createNotice } from '@/store/slices/noticeTracker/noticeTrackerSlice'
import * as yup from 'yup'
import store from '@/store'
import NoticeTypeAutosuggest from './NoticeTypeAutosuggest'
import NoticeActAutosuggest from './NoticeActAutosuggest'

interface SelectOption {
    value: string
    label: string
}

interface ValidationErrors {
    [key: string]: string
}

// Validation schema
const noticeValidationSchema = yup.object().shape({
    group_id: yup
        .number()
        .min(1, 'Please select a company group')
        .required('Company group is required'),
    company_id: yup
        .number()
        .min(1, 'Please select a company')
        .required('Company is required'),
    state_id: yup.string().required('State is required'),
    district_id: yup
        .number()
        .min(1, 'Please select a district')
        .required('District is required'),
    location: yup
        .string()
        .required('Location is required')
        .min(2, 'Location must be at least 2 characters'),
    notice_type: yup.string().required('Notice type is required'),
    notice_date: yup
        .date()
        .required('Notice date is required')
        .nullable()
        .typeError('Please select a valid date'),
    reference_number: yup
        .string()
        .required('Reference number is required')
        .min(3, 'Reference number must be at least 3 characters'),
    related_act: yup
        .string()
        .required('Related act is required')
        .min(2, 'Related act must be at least 2 characters'),
    notice_document: yup.string().required('Notice document is required'),
    noticeDetails: yup
        .string()
        .required('Notice details are required')
        .min(10, 'Notice details must be at least 10 characters'),
})

const SandETrackerBulkUpload = ({ onSuccess, canCreate }) => {
    const dispatch = useDispatch()
    const { login } = store.getState()
    const [companyGroups, setCompanyGroups] = useState<SelectOption[]>([])
    const [selectedCompanyGroup, setSelectedCompanyGroup] =
        useState<SelectOption | null>(null)
    const [companies, setCompanies] = useState<SelectOption[]>([])
    const [selectedCompany, setSelectedCompany] = useState<SelectOption | null>(
        null,
    )
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [states, setStates] = useState<SelectOption[]>([])
    const [selectedStates, setSelectedStates] = useState<SelectOption | null>(
        null,
    )
    const [selectedDistrict, setSelectedDistrict] = useState<{
        id: number | null
        name: string
    }>({
        id: null,
        name: '',
    })
    const [fileBase64, setFileBase64] = useState<string>('')
    const [selectedDistrictId, setSelectedDistrictId] = useState<
        number | undefined
    >()
    const [selectedLocation, setSelectedLocation] = useState('')
    const initialFormData = {
        group_id: 0,
        company_id: 0,
        companyGroupName: '',
        entityName: '',
        state_id: '',
        district_id: 0,
        location: '',
        notice_type: '',
        notice_date: null,
        reference_number: '',
        related_act: '',
        notice_document: null,
        noticeDetails: '',
    }
    const [companyGroupId, setCompanyGroupId] = useState('')
    const [formData, setFormData] = useState(initialFormData)
    const noticeTypeOptions = [
        { value: 'inspection', label: 'Inspection' },
        { value: 'show_cause', label: 'Show Cause' },
        { value: 'demand', label: 'Demand' },
        { value: 'other', label: 'Other' },
    ]
    const loadCompanyGroups = async () => {
        try {
            const { data } = await httpClient.get(
                endpoints.companyGroup.getAll(),
                {
                    params: { ignorePlatform: true },
                },
            )
            if (data.data && data.data.length > 0) {
                const defaultGroup = data.data[0]
                setCompanyGroups(defaultGroup.name)
                setCompanyGroupId(defaultGroup.id)
                loadCompanies(defaultGroup.id)
            }
        } catch (error) {
            console.error('Failed to load company groups:', error)
            toast.push(
                <Notification title="Error" closable={true} type="error">
                    Failed to load company groups
                </Notification>,
            )
        }
    }

    const loadCompanies = async (groupId: string) => {
        try {
            const { data } = await httpClient.get(endpoints.company.getAll(), {
                params: { 'group_id[]': groupId },
            })
            const formattedCompanies = data?.data?.map((company: any) => ({
                label: company.name,
                value: String(company.id),
            }))
            setCompanies(formattedCompanies || [])
        } catch (error) {
            console.error('Failed to load companies:', error)
            toast.push(
                <Notification title="Error" closable={true} type="error">
                    Failed to load companies
                </Notification>,
            )
        }
    }

    useEffect(() => {
        loadCompanyGroups()
    }, [])

    // useEffect(() => {
    //   if (selectedCompanyGroup?.value) {
    //     loadCompanies(selectedCompanyGroup.value);
    //   } else {
    //     setCompanies([]);
    //   }
    // }, [selectedCompanyGroup]);

    // useEffect(() => {
    //   setFormData(prev => ({
    //     ...prev,
    //     group_id: selectedCompanyGroup?.value ? parseInt(selectedCompanyGroup.value) : 0
    //   }));
    // }, [selectedCompanyGroup]);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            company_id: selectedCompany?.value
                ? parseInt(selectedCompany.value)
                : 0,
        }))
    }, [selectedCompany])

    const loadStates = async () => {
        try {
            setIsLoading(true)
            const response = await httpClient.get(endpoints.common.state())
            if (response.data) {
                const formattedStates = response.data.map((state: any) => ({
                    label: state.name,
                    value: String(state.id),
                }))
                setStates(formattedStates)
            }
        } catch (error) {
            console.error('Failed to load states:', error)
            toast.push(
                <Notification title="Error" closable={true} type="error">
                    Failed to load states
                </Notification>,
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleStateChange = (option: SelectOption | null) => {
        setSelectedStates(option)
        setSelectedDistrict({ id: null, name: '' })
        setSelectedLocation('')

        if (option) {
            setFormData((prev) => ({
                ...prev,
                state_id: option.value,
                district_id: 0,
                location: '',
            }))
        }
    }

    useEffect(() => {
        loadStates()
    }, [])

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                const base64String = (reader.result as string).split(',')[1]
                setFileBase64(base64String)
                setFormData((prev) => ({
                    ...prev,
                    notice_document: base64String,
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    const resetAllStates = () => {
        setSelectedCompanyGroup(null)
        setSelectedCompany(null)
        setSelectedStates(null)
        setSelectedDistrict({ id: null, name: '' })
        setSelectedDistrictId(undefined)
        setSelectedLocation('')
        setFormData(initialFormData)
        setCompanies([])
    }

    const handleSubmit = async () => {
        console.log(companies)
        try {
            const resultAction = await dispatch(createNotice(formData))
                .unwrap()
                .catch((error: any) => {
                    throw error
                })

            if (resultAction) {
                toast.push(
                    <Notification title="Success" type="success" closable={true}>
                        Uploaded Successfully
                    </Notification>,
                )
                onSuccess?.()
            }
        } catch (error) {
            console.log(error)
        }
        handleClose()
    }

    const handleClose = () => {
        setIsOpen(false)
        resetAllStates()
    }

    return (
        <>
            {canCreate && (
                <Button
                    variant="solid"
                    size="sm"
                    icon={<HiPlusCircle />}
                    onClick={() => setIsOpen(true)}
                >
                    Add Notice
                </Button>
            )}
            <Dialog isOpen={isOpen} onClose={handleClose} width={800}>
                <div className="p-3">
                    <h5 className="text-lg font-semibold mb-6">
                        Upload Notice Details
                    </h5>

                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Company Group Name
                                </label>
                                {/* <OutlinedSelect
                    label="Select Company Group"
                    options={companyGroups}
                    value={selectedCompanyGroup}
                    onChange={setSelectedCompanyGroup}
                  /> */}
                                <OutlinedInput
                                    label="Company Group"
                                    value={companyGroups}
                                    onChange={() => {}}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Entity Name
                                </label>
                                <OutlinedSelect
                                    label="Select Company"
                                    options={companies}
                                    value={selectedCompany}
                                    onChange={(option: SelectOption | null) => {
                                        setSelectedCompany(option)
                                    }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    State
                                </label>
                                <OutlinedSelect
                                    label="Select State"
                                    options={states}
                                    value={selectedStates}
                                    onChange={handleStateChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <DistrictAutosuggest
                                    value={selectedDistrict}
                                    onChange={(district) => {
                                        setSelectedDistrict(district)
                                        setFormData((prev) => ({
                                            ...prev,
                                            district_id: district.id || 0,
                                        }))
                                    }}
                                    stateId={
                                        selectedStates?.value
                                            ? parseInt(selectedStates.value)
                                            : undefined
                                    }
                                    onDistrictSelect={(id) =>
                                        setSelectedDistrictId(id)
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <LocationAutosuggest
                                    value={selectedLocation}
                                    onChange={(location: string) => {
                                        setSelectedLocation(location)
                                        setFormData((prev) => ({
                                            ...prev,
                                            location: location,
                                        }))
                                    }}
                                    districtId={selectedDistrictId}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                                <NoticeTypeAutosuggest
                                    value={formData.notice_type}
                                    onChange={(value) =>
                                        handleChange('notice_type', value)
                                    }
                                    onNoticeTypeSelect={(id) => {
                                        // If you need to store the ID separately
                                        setFormData((prev) => ({
                                            ...prev,
                                            notice_type_id: id,
                                        }))
                                    }}
                                    isDisabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Notice Received on
                                </label>
                                <DatePicker
                                    clearable
                                    size="sm"
                                    placeholder="Select Date"
                                    value={formData.notice_date}
                                    onChange={(date) =>
                                        handleChange('notice_date', date)
                                    }
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Letter/ Notice reference number
                                </label>
                                <OutlinedInput
                                    label="Reference Number"
                                    value={formData.reference_number}
                                    onChange={(value) =>
                                        handleChange('reference_number', value)
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <NoticeActAutosuggest
                                    value={formData.related_act}
                                    onChange={(value) =>
                                        handleChange('related_act', value)
                                    }
                                    onNoticeActSelect={(id) => {
                                        // If you need to store the ID separately
                                        setFormData((prev) => ({
                                            ...prev,
                                            notice_act_id: id,
                                        }))
                                    }}
                                    isDisabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Notice Copy (Mandatory)
                                </label>
                                <Input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Details of Notice
                            </label>
                            <textarea
                                className="w-full p-2 border rounded-md h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.noticeDetails}
                                onChange={(e) =>
                                    handleChange(
                                        'noticeDetails',
                                        e.target.value,
                                    )
                                }
                                placeholder="Enter notice details..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-3 pt-4">
                        <Button
                            variant="plain"
                            onClick={handleClose}
                            className="mr-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="solid"
                            onClick={handleSubmit}
                            loading={isLoading}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default SandETrackerBulkUpload
