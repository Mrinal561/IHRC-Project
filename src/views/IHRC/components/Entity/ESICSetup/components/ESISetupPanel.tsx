// import React, { useState, useEffect } from 'react';
// import { Button, Input, Notification, Select, toast } from '@/components/ui';
// import OutlinedSelect from '@/components/ui/Outlined';
// import OutlinedInput from '@/components/ui/OutlinedInput';
// import { useDispatch } from 'react-redux';
// import { AppDispatch } from '@/store';
// import httpClient from '@/api/http-client';
// import { endpoints } from '@/api/endpoint';
// import { ActionMeta, MultiValue } from 'react-select';
// import { UsersRound } from 'lucide-react';
// import DistrictAutosuggest from './DistrictAutoSuggest';
// import LocationAutosuggest from '../../Branch/components/LocationAutosuggest';
// import { createEsiSetup } from '@/store/slices/esiSetup/esiSetupSlice';
// import { showErrorNotification } from '@/components/ui/ErrorMessage';
// import * as yup from 'yup';
// import OutlinedPasswordInput from '@/components/ui/OutlinedInput/OutlinedPasswordInput';

// const esiSetupSchema = yup.object().shape({
//   code_Type: yup.string().required('Code type is required'),
//   code: yup.string()
//   .required('ESI code is required')
//   .matches(/^[A-Za-z0-9]+$/, 'ESI code must contain only letters and numbers'),
//     state_id: yup
//         .number()
//         .min(1, 'Please select a state'),
//   district_id: yup.number()
//     .required('District is required')
//     .min(1, 'Please select a district'),
//   location: yup.string()
//     .required('Location is required')
//     .min(2, 'Please Select a location'),
//   // esi_user: yup.string()
//   //   .required('ESI user is required')
//   //   .min(3, 'ESI user must be at least 3 characters'),
//   // password: yup.string()
//   //   .required('Password is required')
//   //   .min(6, 'Password must be at least 6 characters')
//   //   .matches(
//   //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
//   //     'Must include A-Z, a-z, 0-9, @$!%*?& (Weak Password)'
//   // ),
//   signatory_data: yup.array()
//     .of(
//       yup.object().shape({
//         signatory_id: yup.number().required('Signatory  is required')
//       })
//     )
//     .min(1, 'At least one signatory must be selected'),
//   // certificate: yup.string()
//   //   .required('Certificate is required')
// });

// interface ValidationErrors {
//   [key: string]: string;
// }

// interface ESISetupPanelProps {
//   onClose: () => void;
//   addESISetup: (data: any) => void;
//   refreshData: () => Promise<void>;
//   companyId:string;
//   groupId:string;
//   companyname:string;
//   groupName:string;
// }

// interface SelectOption {
//   value: string;
//   label: string;
// }

// interface SignatoryOption {
//   id: number;
//   name: string;
//   first_name: string;
//   last_name: string;
// }

// interface UserSignatory {
//   id: number
//   name: string
//   esignStatus?: string
// }

// interface StateOption {
//   id: number;
//   name: string;
// }

// interface DistrictOption {
//   id: number;
//   name: string;
//   state_id: number;
// }

// interface LocationOption {
//   id: number;
//   name: string;
//   district_id: number;
// }

// const ESISetupPanel = ({ onClose, addESISetup , refreshData, companyId, companyName, groupId, groupName}) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [errors, setErrors] = useState<ValidationErrors>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [companyGroups, setCompanyGroups] = useState<SelectOption[]>([]);
//   const [selectedCompanyGroup, setSelectedCompanyGroup] = useState<SelectOption | null>(null);
//   const [companies, setCompanies] = useState<SelectOption[]>([]);
//   const [selectedCompany, setSelectedCompany] = useState<SelectOption | null>(null);
//   const [signatories, setSignatories] = useState<SignatoryOption[]>([]);
//   const [selectedSignatories, setSelectedSignatories] = useState<
//   UserSignatory[]
// >([])

//   const [fileBase64, setFileBase64] = useState<string>('');
//   const [selectedDistrictId, setSelectedDistrictId] =  useState<number | undefined>();

//   const [states, setStates] = useState<StateOption[]>([]);
//   const [selectedStates, setSelectedStates] = useState<SelectOption | null>(null,)
//   const [districts, setDistricts] = useState<DistrictOption[]>([]);
//   const [selectedDistrict, setSelectedDistrict] = useState<{ id: number | null; name: string }>({
//     id: null,
//     name: ''
//   });
//   const [locations, setLocations] = useState<LocationOption[]>([]);
//   const [selectedLocation, setSelectedLocation] = useState('')
//   const [users, setUsers] = useState<any[]>([])
//   const [loading, setLoading] = useState(false)
//   const [formData, setFormData] = useState<{
//     group_id: number;
//     company_id: number;
//     code_Type: string;
//     code: string;
//     district_id: number;
//     location: string;
//     esi_user: string;
//     password: string;
//     signatory_data: { signatory_id: number }[]; // Update this line
//     certificate: string;
//   }>({
//     group_id: 0,
//     company_id: 0,
//     code_Type: '',
//     code: '',
//     district_id: 0,
//     location: '',
//     esi_user: '',
//     password: '',
//     signatory_data: [], // Initialize as an empty array
//     certificate: ''
//   });

//   const codeTypeOptions = [
//     { value: 'main', label: 'Main' },
//     { value: 'subcode', label: 'SubCode' }
//   ];

//   const showNotification = (type: 'success' | 'info' | 'danger' | 'warning', message: string) => {
//     toast.push(
//       <Notification
//         title={type.charAt(0).toUpperCase() + type.slice(1)}
//         type={type}
//       >
//         {message}
//       </Notification>
//     );
//   };

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

// const handleRegistrationCertificateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0];
//   if (file) {
//       try {
//           const base64String = await convertToBase64(file);
//           setFormData(prev => ({
//               ...prev,
//               register_certificate: base64String
//           }));
//       } catch (error) {
//           console.error('Error converting registration certificate to base64:', error);
//           toast.push(
//               <Notification title="Error" closable={true} type="danger">
//                   Failed to process registration certificate
//               </Notification>
//           );
//       }
//   }
// };

//   // Load Company Groups
//   const loadCompanyGroups = async () => {
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
//       showNotification('danger', 'Failed to load company groups');
//     }
//   };

//   useEffect(() => {
//     loadCompanyGroups();
//   }, []);

//   // Load Companies based on selected group
//   const loadCompanies = async (groupId: string[] | number[]) => {
//     try {
//       const groupIdParam = [`${groupId}`];
//       const { data } = await httpClient.get(endpoints.company.getAll(), {
//         params: {
//           'group_id[]': groupIdParam
//         }
//       });

//       if (data?.data) {
//         const formattedCompanies = data.data.map((company: any) => ({
//           label: company.name,
//           value: String(company.id),
//         }));

//         setCompanies(formattedCompanies);
//       } else {
//         setCompanies([]);
//         showNotification('info', 'No companies found for this group');
//       }
//     } catch (error: any) {
//       console.error('Failed to load companies:', error);
//       showNotification('danger', error.response?.data?.message || 'Failed to load companies');
//       setCompanies([]);
//     }
//   };

//   const loadStates = async () => {
//     try {
//         setIsLoading(true);
//         const response = await httpClient.get(endpoints.common.state());

//         if (response.data) {
//             const formattedStates = response.data.map((state: any) => ({
//                 label: state.name,
//                 value: String(state.id)
//             }));
//             setStates(formattedStates);
//         }
//     } catch (error) {
//         console.error('Failed to load states:', error);
//         toast.push(
//             <Notification title="Error" closable={true} type="danger">
//                 Failed to load states
//             </Notification>
//         );
//     } finally {
//         setIsLoading(false);
//     }
// };

// // const handleStateChange = (option: SelectOption | null) => {
// //   setSelectedStates(option);
// //   setSelectedDistrict(''); // Reset district selection
// //   setSelectedLocation(''); // Reset location selection
// //   setDistricts([]); // Clear districts
// //   setLocations([]); // Clear locations

// //   if (option) {
// //       // loadDistricts(option.value);
// //       // setPfSetupData(prev => ({
// //       //     ...prev,
// //       //     state_id: parseInt(option.value),
// //       //     district_id: 0,
// //       //     location: ''
// //       // }));
// //   }
// // };

// useEffect(() => {
//   loadStates()
// }, [])

//   // Load Signatories
//   const loadUsers = async () => {
//     try {
//       const response = await httpClient.get(endpoints.user.getAll(), {
//         params: {
//           'company_id[]': companyId
//         }
//       });
//       console.log('Users API Response:', response.data)
//       if(response.data){
//         const authorizedSignatories = response.data.data.filter(user => user.user_details.auth_signatory);
//         setUsers(authorizedSignatories)
//         console.log(authorizedSignatories);

//       }
//     } catch (error) {
//       console.error('Failed to fetch users:', error);
//       throw error;
//     }
//   };

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   // Handle company group change
//   useEffect(() => {
//     if (selectedCompanyGroup?.value) {
//       setFormData(prev => ({
//         ...prev,
//         group_id: parseInt(selectedCompanyGroup.value)
//       }));
//       setSelectedCompany(null);
//       loadCompanies(selectedCompanyGroup.value);
//     } else {
//       setCompanies([]);
//     }
//   }, [selectedCompanyGroup]);

//   // Handle company change
//   useEffect(() => {
//     if (selectedCompany?.value) {
//       setFormData(prev => ({
//         ...prev,
//         company_id: parseInt(selectedCompany.value)
//       }));
//     }
//   }, [selectedCompany]);

//   // Handle file upload
//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         const base64String = (reader.result as string).split(',')[1];
//         setFileBase64(base64String);
//         setFormData(prev => ({
//           ...prev,
//           certificate: base64String
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const validateForm = async () => {
//     try {
//       await esiSetupSchema.validate(formData, { abortEarly: false });
//       setErrors({});
//       return true;
//     } catch (yupError) {
//       if (yupError instanceof yup.ValidationError) {
//         const newErrors: ValidationErrors = {};
//         yupError.inner.forEach((error) => {
//           if (error.path) {
//             newErrors[error.path] = error.message;
//           }
//         });
//         setErrors(newErrors);
//       }
//       return false;
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async () => {
//     try {
//       setLoading(true)
//       const isValid = await validateForm();
//       if(!isValid){
//         showNotification('danger', 'Please fix the validation errors');
//         return;
//       }
//       setIsLoading(true);

//       // const signatoriesWithIds = selectedSignatories.map((s) => ({
//       //   signatory_id: parseInt(s.value.split(" ")[0]),
//       // }));

//       const data = {
//         ...formData,
//         signatory_data: formData.signatory_data,
//         company_id:companyId,
//         group_id: groupId,
//       };

//       const response = await dispatch(createEsiSetup(data))
//       .unwrap()
//       .catch((error: any) => {
//         // Handle different error formats
//         if (error.response?.data?.message) {
//             // API error response
//             console.log('inside error')
//             showErrorNotification(error.response.data.message);
//         } else if (error.message) {
//             // Regular error object
//             showErrorNotification(error.message);
//         } else if (Array.isArray(error)) {
//             // Array of error messages
//             showErrorNotification(error);
//         } else {
//             // Fallback error message
//             showErrorNotification(error);
//         }
//         throw error; // Re-throw to prevent navigation
//     });
//       if(response){
//       addESISetup(response.data);
//       onClose();
//       showNotification('success', 'ESI Setup created successfully');
//         // await refreshData();
//          if (refreshData) {
//           await refreshData();
//         }
//       }
//     } catch (error: any) {
//       console.error('Failed to create ESI Setup:', error);
//       // showNotification('danger', error.response?.data?.message || 'Failed to create ESI Setup');
//     } finally {
//       setIsLoading(false);
//       setLoading(false)
//     }
//   };

//   const validateField = async (fieldName: string, value: any) => {
//     try {
//       // Create an object with just the field being validated
//       const fieldToValidate = { [fieldName]: value };

//       // Get the validation schema for just this field
//       const fieldSchema = yup.reach(esiSetupSchema, fieldName);

//       await fieldSchema.validate(value);

//       // Clear error for this field if validation passes
//       setErrors(prev => ({
//         ...prev,
//         [fieldName]: undefined
//       }));

//     } catch (error) {
//       if (error instanceof yup.ValidationError) {
//         // Set error for this field
//         setErrors(prev => ({
//           ...prev,
//           [fieldName]: error.message
//         }));
//       }
//     }
//   };
//   const handleStateChange = (option: SelectOption | null) => {
//     setSelectedStates(option);
//     setSelectedDistrict({ id: null, name: '' }); // Reset district selection
//     setSelectedLocation(''); // Reset location selection
//     setDistricts([]); // Clear districts
//     setLocations([]); // Clear locations

//     const stateId = option ? parseInt(option.value) : 0;

//     setFormData(prev => ({
//       ...prev,
//       state_id: stateId,
//       district_id: 0,
//       location: ''
//     }));

//     // Validate the state field
//     validateField('state_id', stateId);
//   };

//   // Update change handlers to include validation
//   const handleCodeTypeChange = (option: SelectOption | null) => {
//     const newValue = option?.value || '';
//     setFormData(prev => ({
//       ...prev,
//       code_Type: newValue
//     }));
//     validateField('code_Type', newValue);
//   };

//   const handleCodeChange = (value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       code: value
//     }));
//     validateField('code', value);
//   };

//   const handleESIUserChange = (value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       esi_user: value
//     }));
//     validateField('esi_user', value);
//   };

//   const handlePasswordChange = (value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       password: value
//     }));
//     validateField('password', value);
//   };

//   const handleDistrictChange = (district: { id: number | null; name: string }) => {
//     setSelectedDistrict(district);
//     const districtId = district.id || 0;
//     setFormData(prev => ({
//       ...prev,
//       district_id: districtId
//     }));
//     validateField('district_id', districtId);
//   };

//   const handleLocationChange = (location: string) => {
//     setSelectedLocation(location);
//     setFormData(prev => ({
//       ...prev,
//       location: location
//     }));
//     validateField('location', location);
//   };

//   const handleSignatoryChange = (
//     newValue: MultiValue<{ value: string; label: string }>,
//     actionMeta: ActionMeta<{ value: string; label: string }>,
//   ) => {
//     const selectedUserIds = newValue
//       .map(option => parseInt(option.value))
//       .filter(id => !isNaN(id));

//     const newSignatoryData = selectedUserIds.map((id) => ({
//       signatory_id: id,
//     }));

//     setFormData(prev => ({
//       ...prev,
//       signatory_data: newSignatoryData,
//     }));
//     validateField('signatory_data', newSignatoryData);

//     const newSelectedSignatories = selectedUserIds.map((id) => {
//       const user = users.find((u) => u.id === id);
//       return user ? user : { id, name: '' };
//     });
//     setSelectedSignatories(newSelectedSignatories);
//   };

// //   const handleSignatoryChange = (
// //     newValue: MultiValue<{ value: string; label: string }>,
// //     actionMeta: ActionMeta<{ value: string; label: string }>,
// // ) => {
// //   const selectedUserIds = newValue
// //   .map(option => parseInt(option.value))
// //   .filter(id => !isNaN(id));

// //     // Update signatory_data array
// //     const newSignatoryData = selectedUserIds.map((id) => ({
// //         signatory_id: id,
// //     }))

// //     setFormData((prev) => ({
// //       ...prev,
// //       signatory_data: newSignatoryData,
// //   }))

// //     const newSelectedSignatories = selectedUserIds.map((id) => {
// //       const user = users.find((u) => u.id === id);
// //       return user ? user : { id, name: '' };
// //     });
// //     setSelectedSignatories(newSelectedSignatories);
// // }

// return (
//   <div className="p-4">
//     <div className="grid grid-cols-4 gap-4 mb-3">
//       {/* First Row with 4 columns */}
//       <div className="space-y-2">
//         <p className="text-sm font-medium">Company Group</p>
//         <OutlinedInput
//           label="Company Group"
//           value={groupName}
//           disabled
//         />
//       </div>
//       <div className="space-y-2">
//         <p className="text-sm font-medium">Company</p>
//         <OutlinedInput
//           label="Company"
//           value={companyName}
//           disabled
//         />
//       </div>
//       <div className="space-y-2">
//         <p className="text-sm font-medium">Code Type <span className="text-red-500">*</span></p>
//         <OutlinedSelect
//           label="Select Code Type"
//           options={codeTypeOptions}
//           value={codeTypeOptions.find(option => option.value === formData.code_Type)}
//           onChange={handleCodeTypeChange}
//         />
//         <div className="min-h-[10px]">
//           {errors.code_Type && (
//             <p className="text-red-500 text-xs mt-1">{errors.code_Type}</p>
//           )}
//         </div>
//       </div>
//       <div className="space-y-2">
//         <p className="text-sm font-medium">ESI Code <span className="text-red-500">*</span></p>
//         <OutlinedInput
//           label="Enter ESI Code"
//           value={formData.code}
//           onChange={handleCodeChange}
//         />
//         <div className="min-h-[10px]">
//           {errors.code && (
//             <p className="text-red-500 text-xs mt-1">{errors.code}</p>
//           )}
//         </div>
//       </div>

//       {/* Second Row with 4 columns */}
//       <div className="space-y-2">
//         <p className="text-sm font-medium">State <span className="text-red-500">*</span></p>
//         <OutlinedSelect
//           label="Select State"
//           options={states}
//           value={selectedStates}
//           onChange={handleStateChange}
//         />
//         <div className="min-h-[10px]">
//           {errors.state_id && (
//             <p className="text-red-500 text-xs mt-1">{errors.state_id}</p>
//           )}
//         </div>
//       </div>
//       <div className="space-y-2">
//         <DistrictAutosuggest
//           value={selectedDistrict}
//           onChange={handleDistrictChange}
//           stateId={selectedStates?.value ? parseInt(selectedStates.value) : undefined}
//           onDistrictSelect={(id) => setSelectedDistrictId(id)}
//         />
//         <div className="min-h-[10px]">
//           {errors.district_id && (
//             <p className="text-red-500 text-xs mt-1">{errors.district_id}</p>
//           )}
//         </div>
//       </div>
//       <div className="space-y-2">
//         <LocationAutosuggest
//           value={selectedLocation}
//           onChange={handleLocationChange}
//           districtId={selectedDistrictId}
//         />
//         <div className="min-h-[10px]">
//           {errors.location && (
//             <p className="text-red-500 text-xs mt-1">{errors.location}</p>
//           )}
//         </div>
//       </div>
//       <div className="space-y-2">
//         <p className="text-sm font-medium">ESI User</p>
//         <OutlinedInput
//           label="Enter ESI User"
//           value={formData.esi_user}
//           onChange={handleESIUserChange}
//         />
//         <div className="min-h-[10px]">
//           {errors.esi_user && (
//             <p className="text-red-500 text-xs mt-1">{errors.esi_user}</p>
//           )}
//         </div>
//       </div>

//       {/* Third Row with Password (1 column) and Authorized Signatory (3 columns) */}
//       <div className="space-y-2">
//         <p className="text-sm font-medium">Password</p>
//         <OutlinedPasswordInput
//           label="Enter Password"
//           value={formData.password}
//           onChange={handlePasswordChange}
//         />
//         <div className="min-h-[10px]">
//           {errors.password && (
//             <p className="text-red-500 text-xs mt-1">{errors.password}</p>
//           )}
//         </div>
//       </div>
//       <div className="col-span-3 space-y-2">
//         <p className="text-sm font-medium">Select Authorized Signatory<span className="text-red-500">*</span></p>
//         <Select
//         size='sm'
//           isMulti
//           options={users.map(user => ({
//             value: String(user.user_details.id),
//             label: `${user.user_details.name}`,
//           }))}
//           onChange={handleSignatoryChange}
//         />
//         <div className="min-h-[10px]">
//           {errors.signatory_data && (
//             <p className="text-red-500 text-xs mt-1">{errors.signatory_data}</p>
//           )}
//         </div>
//       </div>

//       {/* Fourth Row with Upload Certificate (4 columns) */}
//       <div className="col-span-4 space-y-2">
//         <p className="text-sm font-medium">Upload Certificate(PDF/Zip/Image, Max 20MB)<span className="text-red-500">*</span></p>
//         <Input
//           type="file"
//           onChange={handleFileUpload}
//           accept=".pdf, .zip, .jpg"
//         />
//         <div className="min-h-[10px]">
//           {errors.certificate && (
//             <p className="text-red-500 text-xs mt-1">{errors.certificate}</p>
//           )}
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="col-span-4 flex justify-end space-x-2">
//         <Button
//           variant="plain"
//           size="sm"
//           onClick={onClose}
//         >
//           Cancel
//         </Button>
//         <Button
//           variant="solid"
//           size="sm"
//           onClick={handleSubmit}
//           loading={loading}
//         >
//           Confirm
//         </Button>
//       </div>
//     </div>
//   </div>
// );
// };

// export default ESISetupPanel;

import React, { useState, useEffect } from 'react'
import { Button, Input, Notification, Select, toast } from '@/components/ui'
import OutlinedSelect from '@/components/ui/Outlined'
import OutlinedInput from '@/components/ui/OutlinedInput'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import { ActionMeta, MultiValue } from 'react-select'
import { UsersRound } from 'lucide-react'
import DistrictAutosuggest from './DistrictAutoSuggest'
import LocationAutosuggest from '../../Branch/components/LocationAutosuggest'
import { createEsiSetup } from '@/store/slices/esiSetup/esiSetupSlice'
import { showErrorNotification } from '@/components/ui/ErrorMessage'
import * as yup from 'yup'
import OutlinedPasswordInput from '@/components/ui/OutlinedInput/OutlinedPasswordInput'
import { Loading } from '@/components/shared'

const esiSetupSchema = yup.object().shape({
    code_Type: yup.string().required('Code type is required'),
    code: yup
        .string()
        .required('ESI code is required')
        .matches(/^[A-Za-z0-9]+$/, 'Only letters, numbers, and hyphens.'),
    state_id: yup
        .number()
        .required('State is required')
        .positive('Please select a valid state'),
    district_id: yup
        .number()
        .required('District is required')
        .min(1, 'Please select a district'),
    location: yup
        .string()
        .required('Location is required')
        .min(2, 'Please Select a location'),
    email: yup
        .string()
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/,
            'Invalid email address.',
        )
        .required('Email is required'),
    mobile_number: yup
        .string()
        .required('Mobile number is required')
        .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
    // esi_user: yup.string()
    //   .required('ESI user is required')
    //   .min(3, 'ESI user must be at least 3 characters'),
    // password: yup.string()
    //   .required('Password is required')
    //   .min(6, 'Password must be at least 6 characters')
    //   .matches(
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    //     'Must include A-Z, a-z, 0-9, @$!%*?& (Weak Password)'
    // ),
    // certificate: yup.string()
    //   .required('Certificate is required')
})

interface ValidationErrors {
    [key: string]: string
}

interface ESISetupPanelProps {
    onClose: () => void
    addESISetup: (data: any) => void
    refreshData: () => Promise<void>
    companyId: string
    groupId: string
    companyname: string
    groupName: string
}

interface SelectOption {
    value: string
    label: string
}

interface StateOption {
    id: number
    name: string
}

interface DistrictOption {
    id: number
    name: string
    state_id: number
}

interface LocationOption {
    id: number
    name: string
    district_id: number
}

// interface FormData {
//     group_id: number;
//     company_id: number;
//     code_Type: string;
//     code: string;
//     district_id: number;
//     location: string;
//     esi_user: string;
//     password: string;
//     certificate?: {
//       data: string;
//       filename: string;
//       mimetype: string;
//     };
//     email: string;
//     mobile_number: string;
//   }

  
const ESISetupPanel = ({
    onClose,
    addESISetup,
    refreshData,
    companyId,
    companyName,
    groupId,
    groupName,
}) => {
    const dispatch = useDispatch<AppDispatch>()
    const [errors, setErrors] = useState<ValidationErrors>({})
    const [isLoading, setIsLoading] = useState(false)
    const [companyGroups, setCompanyGroups] = useState<SelectOption[]>([])
    const [selectedCompanyGroup, setSelectedCompanyGroup] =
        useState<SelectOption | null>(null)
    const [companies, setCompanies] = useState<SelectOption[]>([])
    const [selectedCompany, setSelectedCompany] = useState<SelectOption | null>(
        null,
    )
    const [fileBase64, setFileBase64] = useState<string>('')
    const [selectedDistrictId, setSelectedDistrictId] = useState<
        number | undefined
    >()
    const [states, setStates] = useState<StateOption[]>([])
    const [selectedStates, setSelectedStates] = useState<SelectOption | null>(
        null,
    )
    const [districts, setDistricts] = useState<DistrictOption[]>([])
    const [selectedDistrict, setSelectedDistrict] = useState<{
        id: number | null
        name: string
    }>({
        id: null,
        name: '',
    })
    const [locations, setLocations] = useState<LocationOption[]>([])
    const [selectedLocation, setSelectedLocation] = useState('')
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<{
        group_id: number
        company_id: number
        code_Type: string
        code: string
        district_id: number
        location: string
        esi_user: string
        password: string
        certificate: string
        email: string
        mobile_number: string
    }>({
        group_id: 0,
        company_id: 0,
        code_Type: '',
        code: '',
        district_id: 0,
        location: '',
        esi_user: '',
        password: '',
        certificate: '',
        email: '',
        mobile_number: '',
    })


    // const [formData, setFormData] = useState<FormData>({
    //     group_id: 0,
    //     company_id: 0,
    //     code_Type: '',
    //     code: '',
    //     district_id: 0,
    //     location: '',
    //     esi_user: '',
    //     password: '',
    //     email: '',
    //     mobile_number: ''
    //     // certificate is optional now
    //   });

    const codeTypeOptions = [
        { value: 'main', label: 'Main' },
        { value: 'subcode', label: 'SubCode' },
    ]

    const showNotification = (
        type: 'success' | 'info' | 'danger' | 'warning',
        message: string,
    ) => {
        toast.push(
            <Notification
                title={type.charAt(0).toUpperCase() + type.slice(1)}
                type={type}
            >
                {message}
            </Notification>,
        )
    }
    const handleEmailChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            email: value,
        }))
        validateField('email', value)
    }

    const handleMobileChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            mobile_number: value,
        }))
        validateField('mobile_number', value)
    }

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
                const base64String = (reader.result as string).split(',')[1]
                resolve(base64String)
            }
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }

    const handleRegistrationCertificateUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0]
        if (file) {
            try {
                const base64String = await convertToBase64(file)
                setFormData((prev) => ({
                    ...prev,
                    register_certificate: base64String,
                }))
            } catch (error) {
                console.error(
                    'Error converting registration certificate to base64:',
                    error,
                )
                toast.push(
                    <Notification title="Error" closable={true} type="danger">
                        Failed to process registration certificate
                    </Notification>,
                )
            }
        }
    }

    const loadCompanyGroups = async () => {
        try {
            const { data } = await httpClient.get(
                endpoints.companyGroup.getAll(),
                {
                    params: { ignorePlatform: true },
                },
            )
            setCompanyGroups(
                data.data.map((v: any) => ({
                    label: v.name,
                    value: String(v.id),
                })),
            )
        } catch (error) {
            console.error('Failed to load company groups:', error)
            showNotification('danger', 'Failed to load company groups')
        }
    }

    useEffect(() => {
        loadCompanyGroups()
    }, [])

    const loadCompanies = async (groupId: string[] | number[]) => {
        try {
            const groupIdParam = [`${groupId}`]
            const { data } = await httpClient.get(endpoints.company.getAll(), {
                params: {
                    'group_id[]': groupIdParam,
                },
            })

            if (data?.data) {
                const formattedCompanies = data.data.map((company: any) => ({
                    label: company.name,
                    value: String(company.id),
                }))

                setCompanies(formattedCompanies)
            } else {
                setCompanies([])
                showNotification('info', 'No companies found for this group')
            }
        } catch (error: any) {
            console.error('Failed to load companies:', error)
            showNotification(
                'danger',
                error.response?.data?.message || 'Failed to load companies',
            )
            setCompanies([])
        }
    }

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
                <Notification title="Error" closable={true} type="danger">
                    Failed to load states
                </Notification>,
            )
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadStates()
    }, [])

    useEffect(() => {
        if (selectedCompanyGroup?.value) {
            setFormData((prev) => ({
                ...prev,
                group_id: parseInt(selectedCompanyGroup.value),
            }))
            setSelectedCompany(null)
            loadCompanies(selectedCompanyGroup.value)
        } else {
            setCompanies([])
        }
    }, [selectedCompanyGroup])

    useEffect(() => {
        if (selectedCompany?.value) {
            setFormData((prev) => ({
                ...prev,
                company_id: parseInt(selectedCompany.value),
            }))
        }
    }, [selectedCompany])

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                const base64String = (reader.result as string).split(',')[1]
                setFileBase64(base64String)
                setFormData((prev) => ({
                    ...prev,
                    certificate: base64String,
                }))
            }
            reader.readAsDataURL(file)
        }
    }


    // const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = () => {
    //             const base64String = (reader.result as string).split(',')[1];
    //             setFormData(prev => ({
    //                 ...prev,
    //                 certificate: {
    //                     data: base64String,  // Pure file content
    //                     filename: file.name, // Original filename
    //                     mimetype: file.type  // MIME type
    //                 }
    //             }));
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    const validateForm = async () => {
        try {
            await esiSetupSchema.validate(formData, { abortEarly: false })
            setErrors({})
            return true
        } catch (yupError) {
            if (yupError instanceof yup.ValidationError) {
                const newErrors: ValidationErrors = {}
                yupError.inner.forEach((error) => {
                    if (error.path) {
                        newErrors[error.path] = error.message
                    }
                })
                setErrors(newErrors)
            }
            return false
        }
    }

    const handleSubmit = async () => {
        try {
            setLoading(true)
            const isValid = await validateForm()
            if (!isValid) {
                showNotification('danger', 'Please fix the validation errors')
                return
            }
            setIsLoading(true)

            const data = {
                ...formData,
                company_id: companyId,
                group_id: groupId,
            }

            const response = await dispatch(createEsiSetup(data))
                .unwrap()
                .catch((error: any) => {
                    throw error
                })
            if (response) {
                addESISetup(response.data)
                onClose()
                showNotification('success', 'ESI Setup created successfully')
                if (refreshData) {
                    await refreshData()
                }
            }
        } catch (error: any) {
            console.error('Failed to create ESI Setup:', error)
        } finally {
            setIsLoading(false)
            setLoading(false)
        }
    }

    const validateField = async (fieldName: string, value: any) => {
        try {
            const fieldToValidate = { [fieldName]: value }
            const fieldSchema = yup.reach(esiSetupSchema, fieldName)
            await fieldSchema.validate(value)
            setErrors((prev) => ({
                ...prev,
                [fieldName]: undefined,
            }))
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                setErrors((prev) => ({
                    ...prev,
                    [fieldName]: error.message,
                }))
            }
        }
    }

    const handleStateChange = (option: SelectOption | null) => {
        setSelectedStates(option)
        setSelectedDistrict({ id: null, name: '' })
        setSelectedLocation('')
        setDistricts([])
        setLocations([])

        const stateId = option ? parseInt(option.value) : 0

        setFormData((prev) => ({
            ...prev,
            state_id: stateId,
            district_id: 0,
            location: '',
        }))

        validateField('state_id', stateId)
    }

    const handleCodeTypeChange = (option: SelectOption | null) => {
        const newValue = option?.value || ''
        setFormData((prev) => ({
            ...prev,
            code_Type: newValue,
        }))
        validateField('code_Type', newValue)
    }

    const handleCodeChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            code: value,
        }))
        validateField('code', value)
    }

    const handleESIUserChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            esi_user: value,
        }))
        validateField('esi_user', value)
    }

    const handlePasswordChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            password: value,
        }))
        validateField('password', value)
    }

    const handleDistrictChange = (district: {
        id: number | null
        name: string
    }) => {
        setSelectedDistrict(district)
        const districtId = district.id || 0
        setFormData((prev) => ({
            ...prev,
            district_id: districtId,
        }))
        validateField('district_id', districtId)
    }

    const handleLocationChange = (location: string) => {
        setSelectedLocation(location)
        setFormData((prev) => ({
            ...prev,
            location: location,
        }))
        validateField('location', location)
    }

    return (
        <div className="p-4">
            <div className="grid grid-cols-4 gap-4 mb-3">
                {/* First Row with 4 columns */}
                <div className="space-y-2">
                    <p className="text-sm font-medium">Company Group</p>
                    <OutlinedInput
                        label="Company Group"
                        value={groupName}
                        disabled
                    />
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-medium">Company</p>
                    <OutlinedInput
                        label="Company"
                        value={companyName}
                        disabled
                    />
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-medium">
                        Code Type <span className="text-red-500">*</span>
                    </p>
                    <OutlinedSelect
                        label="Select Code Type"
                        options={codeTypeOptions}
                        value={codeTypeOptions.find(
                            (option) => option.value === formData.code_Type,
                        )}
                        onChange={handleCodeTypeChange}
                    />
                    <div style={{ height: '10px' }}>
                        {errors.code_Type && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.code_Type}
                            </p>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-medium">
                        ESI Code <span className="text-red-500">*</span>
                    </p>
                    <OutlinedInput
                        label="Enter ESI Code"
                        value={formData.code}
                        onChange={handleCodeChange}
                    />
                    <div style={{ height: '10px' }}>
                        {errors.code && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.code}
                            </p>
                        )}
                    </div>
                </div>

                {/* Second Row with 4 columns */}
                <div className="space-y-2">
                    <p className="text-sm font-medium">
                        State <span className="text-red-500">*</span>
                    </p>
                    <OutlinedSelect
                        label="Select State"
                        options={states}
                        value={selectedStates}
                        onChange={handleStateChange}
                    />
                    <div style={{ height: '10px' }}>
                        {errors.state_id && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.state_id}
                            </p>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                    <DistrictAutosuggest
                        value={selectedDistrict}
                        onChange={handleDistrictChange}
                        stateId={
                            selectedStates?.value
                                ? parseInt(selectedStates.value)
                                : undefined
                        }
                        onDistrictSelect={(id) => setSelectedDistrictId(id)}
                    />
                    <div style={{ height: '10px' }}>
                        {errors.district_id && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.district_id}
                            </p>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                    <LocationAutosuggest
                        value={selectedLocation}
                        onChange={handleLocationChange}
                        districtId={selectedDistrictId}
                    />
                    <div style={{ height: '10px' }}>
                        {errors.location && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.location}
                            </p>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-medium">ESI User</p>
                    <OutlinedInput
                        label="Enter ESI User"
                        value={formData.esi_user}
                        onChange={handleESIUserChange}
                    />
                    <div style={{ height: '10px' }}>
                        {errors.esi_user && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.esi_user}
                            </p>
                        )}
                    </div>
                </div>

                {/* Third Row with Password and Email */}
                {/* Third Row with Password, Email and Mobile - Modified for equal width */}
                <div className="grid grid-cols-3 col-span-4 gap-4">
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Password</p>
                        <OutlinedPasswordInput
                            label="Enter Password"
                            value={formData.password}
                            onChange={handlePasswordChange}
                        />
                        <div style={{ height: '10px' }}>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium">
                            Email ID <span className="text-red-500">*</span>
                        </p>
                        <OutlinedInput
                            label="Enter Email ID"
                            value={formData.email}
                            onChange={handleEmailChange}
                        />
                        <div style={{ height: '10px' }}>
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium">
                            Mobile <span className="text-red-500">*</span>
                        </p>
                        <OutlinedInput
                            label="Enter Mobile"
                            value={formData.mobile_number}
                            onChange={handleMobileChange}
                        />
                        <div style={{ height: '10px' }}>
                            {errors.mobile_number && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.mobile_number}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Fourth Row with Certificate Upload */}
                <div className="col-span-4 space-y-2">
                    <p className="text-sm font-medium">
                        Upload Certificate(PDF/Zip/Image, Max 20MB)
                        <span className="text-red-500">*</span>
                    </p>
                    <Input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf, .zip, .jpg"
                    />
                    <div style={{ height: '10px' }}>
                        {errors.certificate && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.certificate}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
                <Button size="sm" variant="plain" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    size="sm"
                    variant="solid"
                    onClick={handleSubmit}
                    loading={loading}
                >
                    Confirm
                </Button>
            </div>
        </div>
    )
}

export default ESISetupPanel
