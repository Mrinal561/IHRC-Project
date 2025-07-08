// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button, Input, DatePicker, toast, Notification } from '@/components/ui';
// import OutlinedSelect from '@/components/ui/Outlined';
// import OutlinedInput from '@/components/ui/OutlinedInput/OutlinedInput';
// import { IoArrowBack } from 'react-icons/io5';
// import httpClient from '@/api/http-client';
// import { endpoints } from '@/api/endpoint';
// import { Formik, Form, Field } from 'formik';
// import * as Yup from 'yup';

// interface ReturnFormValues {
//   company_id: number;
//   act_name: string;
//   return_name: string;
//   state_id?: number;
//   district_id?: number;
//   location_id?: number;
//   branch_id?: number;
//   frequency: string;
//   year: number;
//   month?: number;
//   return_submission: string;
//   submission_date?: string;
//   delay_reason?: string;
//   return_copy?: File | null;
//   not_applicable_reason?: string;
// }

// interface CompanyOption extends SelectOption {
//   group_id: number;
// }
// interface SelectOption {
//   value: string;
//   label: string;
// }

// interface SuperadminReturn {
//   id: number;
//   act_name: string;
//   return_name: string;
//   state_id: number;
//   applicable: 'STATE' | 'CENTRAL' | 'ALL_STATES';
//   frequency: string;
//   due_dates: any;
//   State: {
//     name: string;
//   };
// }

// interface BranchOption extends SelectOption {
//   location_id: number;
// }

// const validationSchema = Yup.object().shape({
//   company_id: Yup.number().required('Company is required').min(1, 'Please select a company'),
//   act_name: Yup.string().required('Act Name is required'),
//   return_name: Yup.string().required('Return Name is required'),
//   frequency: Yup.string().required('Frequency is required'),
//   year: Yup.number().required('Year is required').min(2000, 'Invalid year').max(2100, 'Invalid year'),
//   return_submission: Yup.string().required('Return Submission is required'),
//   submission_date: Yup.string().when('return_submission', {
//     is: 'applicable',
//     then: (schema) => schema.required('Submission Date is required'),
//   }),
//   delay_reason: Yup.string().when(['return_submission', 'submission_date'], {
//     is: (return_submission: string, submission_date: string) => 
//       return_submission === 'applicable' && submission_date,
//     then: (schema) => schema.test(
//       'is-delayed',
//       'Delay reason is required for delayed returns',
//       function (value) {
//         const { parent } = this;
//         const superadminReturn = parent._superadminReturn;
        
//         if (!superadminReturn || !superadminReturn.due_dates || !parent.submission_date) {
//           return true;
//         }

//         const dueDates = superadminReturn.due_dates;
//         let dueDate: Date | null = null;
//         const submissionDate = new Date(parent.submission_date);

//         switch (parent.frequency) {
//           case 'monthly':
//             dueDate = new Date(dueDates.first_due_date);
//             break;
//           case 'quarterly':
//             if (parent.month) {
//               if (parent.month >= 1 && parent.month <= 3) {
//                 dueDate = new Date(dueDates.first_due_date);
//               } else if (parent.month >= 4 && parent.month <= 6) {
//                 dueDate = new Date(dueDates.second_due_date);
//               } else if (parent.month >= 7 && parent.month <= 9) {
//                 dueDate = new Date(dueDates.third_due_date);
//               } else {
//                 dueDate = new Date(dueDates.last_due_date);
//               }
//             }
//             break;
//           case 'half_yearly':
//             if (parent.month && parent.month <= 6) {
//               dueDate = new Date(dueDates.first_due_date);
//             } else {
//               dueDate = new Date(dueDates.last_due_date);
//             }
//             break;
//           case 'yearly':
//             dueDate = new Date(dueDates.first_due_date);
//             break;
//           case 'bi_annual':
//             dueDate = new Date(dueDates.bi_annual_due_date);
//             break;
//         }

//         if (dueDate && submissionDate > dueDate) {
//           return !!value;
//         }
//         return true;
//       }
//     ),
//   }),
//   not_applicable_reason: Yup.string().when('return_submission', {
//     is: 'not_applicable',
//     then: (schema) => schema.required('Not Applicable Reason is required'),
//   }),
//   return_copy: Yup.mixed().when('return_submission', {
//     is: 'applicable',
//     then: (schema) => schema
//       .required('Return copy is required')
//       .test('fileSize', 'File size must be less than 20MB', (value) => {
//         if (!value) return false;
//         return (value as File).size <= 20 * 1024 * 1024;
//       })
//       .test('fileType', 'Only PDF, Excel, and image files are allowed', (value) => {
//         if (!value) return false;
//         const file = value as File;
//         const allowedTypes = [
//           'application/pdf',
//           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//           'application/vnd.ms-excel',
//           'image/jpeg',
//           'image/png'
//         ];
//         return allowedTypes.includes(file.type);
//       }),
//   }),
//   month: Yup.number().when('frequency', {
//     is: (frequency: string) => ['monthly', 'quarterly', 'half_yearly'].includes(frequency),
//     then: (schema) => schema.required('Month is required').min(1, 'Invalid month').max(12, 'Invalid month'),
//   }),
// });

// const ReturnTrackerAddForm = () => {
//   const navigate = useNavigate();
//   const [actOptions, setActOptions] = useState<SelectOption[]>([]);
//   const [returnOptions, setReturnOptions] = useState<SelectOption[]>([]);
//   const [companyGroups, setCompanyGroups] = useState<SelectOption[]>([]);
//   const [companies, setCompanies] = useState<CompanyOption[]>([]);
//   const [allBranches, setAllBranches] = useState<BranchOption[]>([]);
//   const [branches, setBranches] = useState<BranchOption[]>([]);
//   const [states, setStates] = useState<SelectOption[]>([]);
//   const [districts, setDistricts] = useState<SelectOption[]>([]);
//   const [locations, setLocations] = useState<SelectOption[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [superadminReturns, setSuperadminReturns] = useState<SuperadminReturn[]>([]);
//   const [currentGroupId, setCurrentGroupId] = useState<number>(0);
//   const [allIndianStates, setAllIndianStates] = useState<SelectOption[]>([]);

//   const showNotification = (
//     type: 'success' | 'info' | 'error' | 'warning',
//     message: string
//   ) => {
//     toast.push(
//       <Notification
//         title={type.charAt(0).toUpperCase() + type.slice(1)}
//         type={type}
//       >
//         {message}
//       </Notification>
//     );
//   };

//   useEffect(() => {
//     const loadInitialData = async () => {
//       try {
//         // Load all Indian states first
//         const statesResponse = await httpClient.get(endpoints.common.state());
//         const allStates = statesResponse.data.map((state: any) => ({
//           label: state.name,
//           value: String(state.id),
//         }));
//         setAllIndianStates(allStates);
//         setStates(allStates);

//         // Load company groups
//         const groupsResponse = await httpClient.get(endpoints.companyGroup.getAll());
//         const companyGroupOptions = groupsResponse.data.data.map((group: any) => ({
//           label: group.name,
//           value: String(group.id),
//         }));
//         setCompanyGroups(companyGroupOptions);

//         if (groupsResponse.data.data.length > 0) {
//           const firstGroupId = groupsResponse.data.data[0].id;
//           await loadCompanies(String(firstGroupId));
//         }

//         // Load superadmin returns for act names and return names
//         const returnsResponse = await httpClient.get(endpoints.return.getList());
//         setSuperadminReturns(returnsResponse.data.data);

//         // Prepare act options based on applicable field
//         const uniqueActs = new Map<string, boolean>();
//         const actOptionsList: SelectOption[] = [];

//         returnsResponse.data.data.forEach((ret: SuperadminReturn) => {
//           if (ret.applicable === 'CENTRAL') {
//             // For CENTRAL, add only once without state
//             if (!uniqueActs.has(ret.act_name)) {
//               actOptionsList.push({
//                 label: `${ret.act_name} (${"Central"})`,
//                 value: `${ret.act_name}||CENTRAL`,
//               });
//               uniqueActs.set(ret.act_name, true);
//             }
//           } else if (ret.applicable === 'ALL_STATES') {
//             // For ALL_STATES, add for each state in India
//             allStates.forEach(state => {
//               actOptionsList.push({
//                 label: `${ret.act_name} (${state.label})`,
//                 value: `${ret.act_name}||${state.value}`,
//               });
//             });
//           } else if (ret.applicable === 'STATE') {
//             // For STATE, add with specific state
//             actOptionsList.push({
//               label: `${ret.act_name} (${ret.State.name})`,
//               value: `${ret.act_name}||${ret.state_id}`,
//             });
//           }
//         });
//         actOptionsList.sort((a, b) => a.label.localeCompare(b.label));
//         setActOptions(actOptionsList);
//       } catch (error) {
//         console.error('Failed to load initial data:', error);
//         showNotification('error', 'Failed to load initial data');
//       }
//     };

//     loadInitialData();
//   }, []);

//   const loadCompanies = async (groupId: string) => {
//     try {
//       const response = await httpClient.get(endpoints.company.getAll(), {
//         params: { 'group_id[]': groupId },
//       });
//       setCompanies(
//         response.data.data.map((company: any) => ({
//           label: company.name,
//           value: String(company.id),
//           group_id: company.group_id,
//         }))
//       );
//       setCurrentGroupId(Number(groupId));
//     } catch (error) {
//       console.error('Failed to load companies:', error);
//       showNotification('error', 'Failed to load companies');
//     }
//   };

//  const loadBranches = async (companyId: string) => {
//   try {
//     const response = await httpClient.get(endpoints.branch.getAllBranch(), {
//       params: { 'company_id[]': companyId },
//     });
//     const branchesData = response.data.data.map((branch: any) => ({
//       label: branch.name
//         .split(' ')
//         .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//         .join(' '), // Convert to title case
//       value: String(branch.id),
//       location_id: branch.location_id,
//     }));
//     setAllBranches(branchesData);
//     setBranches([]);
//   } catch (error) {
//     console.error('Failed to load branches:', error);
//     showNotification('error', 'Failed to load branches');
//   }
// };

//   const loadDistricts = async (stateId: string) => {
//     try {
//       const response = await httpClient.get(endpoints.common.district(), {
//         params: { 'state_id[]': stateId },
//       });
//       setDistricts(
//         response.data.map((district: any) => ({
//           label: district.name,
//           value: String(district.id),
//         }))
//       );
//     } catch (error) {
//       console.error('Failed to load districts:', error);
//       showNotification('error', 'Failed to load districts');
//     }
//   };

//   const loadLocations = async (districtId: string) => {
//     try {
//       const response = await httpClient.get(endpoints.common.location(), {
//         params: { 'district_id[]': districtId },
//       });
//       setLocations(
//         response.data.map((location: any) => ({
//           label: location.name,
//           value: String(location.id),
//         }))
//       );
//     } catch (error) {
//       console.error('Failed to load locations:', error);
//       showNotification('error', 'Failed to load locations');
//     }
//   };

//   const loadReturnOptions = (actName: string, stateId: string) => {
//     try {
//       let filteredReturns: SuperadminReturn[] = [];
      
//       if (stateId === 'CENTRAL') {
//         filteredReturns = superadminReturns.filter(
//           ret => ret.act_name === actName && ret.applicable === 'CENTRAL'
//         );
//       } else {
//         filteredReturns = superadminReturns.filter(
//           ret => ret.act_name === actName && 
//                  (ret.applicable === 'ALL_STATES' || 
//                   (ret.applicable === 'STATE' && ret.state_id === Number(stateId)))
//         );
//       }

//       setReturnOptions(
//         filteredReturns.map(ret => ({
//           label: ret.return_name,
//           value: ret.return_name,
//         }))
//       );
//     } catch (error) {
//       console.error('Failed to load return options:', error);
//       showNotification('error', 'Failed to load return options');
//     }
//   };

//   const getFrequencyForReturn = (actName: string, returnName: string, stateId: string) => {
//     let returnData: SuperadminReturn | undefined;
    
//     if (stateId === 'CENTRAL') {
//       returnData = superadminReturns.find(
//         ret => ret.act_name === actName && 
//                ret.return_name === returnName && 
//                ret.applicable === 'CENTRAL'
//       );
//     } else {
//       returnData = superadminReturns.find(
//         ret => ret.act_name === actName && 
//                ret.return_name === returnName && 
//                (ret.applicable === 'ALL_STATES' || 
//                 (ret.applicable === 'STATE' && ret.state_id === Number(stateId)))
//       );
//     }
    
//     return returnData?.frequency || '';
//   };

// const handleSubmit = async (values: ReturnFormValues) => {
//   try {
//     setLoading(true);

//     // Convert file to base64
//     let returnCopyBase64 = '';
//     if (values.return_copy && values.return_submission !== 'not_applicable') {
//       returnCopyBase64 = await new Promise<string>((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = () => {
//           const result = reader.result as string;
//           resolve(result.split(',')[1]);
//         };
//         reader.onerror = (error) => {
//           reject(error);
//         };
//         reader.readAsDataURL(values.return_copy as Blob);
//       });
//     }

//     // Split act_name to remove state ID
//     const [actName] = values.act_name.split('||');

//     // Prepare the submission data
//     const submissionData = {
//       ...values,
//       act_name: actName, // Use only the act name part
//       company_group_id: currentGroupId,
//       company_id: Number(values.company_id),
//       state_id: values.state_id ? Number(values.state_id) : undefined,
//       district_id: values.district_id ? Number(values.district_id) : undefined,
//       location_id: values.location_id ? Number(values.location_id) : undefined,
//       branch_id: values.branch_id ? Number(values.branch_id) : undefined,
//       year: Number(values.year),
//       month: values.month ? Number(values.month) : undefined,
//       return_copy: returnCopyBase64 || undefined,
//     };

//     // Make the API call
//     const response = await httpClient.post(
//       endpoints.return.create(),
//       submissionData
//     );

//     if (response) {
//       showNotification('success', 'Return created successfully');
//       navigate('/return-tracker');
//     }
//   } catch (error: any) {
//     console.error('Failed to create return:', error);
//     const errorMessage = error.response?.data?.message || 'Failed to create return';
//     showNotification('error', errorMessage);
//   } finally {
//     setLoading(false);
//   }
// };

//   const initialValues: ReturnFormValues = {
//     company_id: 0,
//     act_name: '',
//     return_name: '',
//     state_id: undefined,
//     frequency: '',
//     year: new Date().getFullYear(),
//     return_submission: '',
//   };
 
//   // Generate year options (current year and past 4 years)
//   const yearOptions = Array.from({ length: 5 }, (_, i) => {
//     const year = new Date().getFullYear() - i;
//     return {
//       label: String(year),
//       value: year,
//     };
//   });

//   const formatFrequencyDisplay = (frequency: string) => {
//   if (!frequency) return '--';
  
//   const formatMap: Record<string, string> = {
//     monthly: 'Monthly',
//     quarterly: 'Quarterly',
//     half_yearly: 'Half Yearly',
//     yearly: 'Yearly',
//     bi_annual: 'Bi-Annual'
//   };
  
//   return formatMap[frequency] || frequency;
// };

//   return (
//     <div className="w-full mx-auto p-2 bg-white rounded-lg">
//       <div className="flex gap-2 items-center mb-3">
//         <Button
//           size="sm"
//           variant="plain"
//           icon={<IoArrowBack className="text-gray-500 hover:text-gray-700" />}
//           onClick={() => navigate(-1)}
//         />
//         <h3 className="text-2xl font-semibold">Add Return Details</h3>
//       </div>

//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={handleSubmit}
//       >
//         {({
//           values,
//           errors,
//           touched,
//           setFieldValue,
//           setFieldTouched,
//           isValid,
//           isSubmitting,
//         }) => {
//           // Move the useEffect inside here
//           useEffect(() => {
//             if (values.location_id && allBranches.length > 0) {
//               const filteredBranches = allBranches.filter(
//                 branch => Number(branch.location_id) === Number(values.location_id)
//               );
//               setBranches(filteredBranches);
//               if (values.branch_id && !filteredBranches.some(b => b.value === String(values.branch_id))) {
//                 setFieldValue('branch_id', '');
//               }
//             } else {
//               setBranches([]);
//               setFieldValue('branch_id', '');
//             }
//           }, [values.location_id, allBranches]);

//            useEffect(() => {
//       // Log validation errors
//       if (Object.keys(errors).length > 0) {
//         console.log('Form errors:', errors);
//       }
//     }, [errors]);

//           // Parse act_name and state_id from values.act_name
//           const [selectedActName, selectedStateId] = values.act_name ? values.act_name.split('||') : ['', ''];
          
//           const superadminReturn = superadminReturns.find(
//             ret =>
//               ret.act_name === selectedActName &&
//               ret.return_name === values.return_name &&
//               (ret.applicable === 'CENTRAL' || 
//                ret.applicable === 'ALL_STATES' || 
//                (ret.applicable === 'STATE' && ret.state_id === Number(selectedStateId)))
//           );

//             const isDelayed = (() => {
//             if (!superadminReturn || !values.submission_date || values.return_submission !== 'applicable') {
//               return false;
//             }

//             const dueDates = superadminReturn.due_dates;
//             if (!dueDates) return false;

//             const submissionDate = new Date(values.submission_date);
//             let dueDate: Date | null = null;

//             switch (values.frequency) {
//               case 'monthly':
//                 dueDate = new Date(dueDates.first_due_date);
//                 break;
//               case 'quarterly':
//                 if (values.month) {
//                   if (values.month >= 1 && values.month <= 3) {
//                     dueDate = new Date(dueDates.first_due_date);
//                   } else if (values.month >= 4 && values.month <= 6) {
//                     dueDate = new Date(dueDates.second_due_date);
//                   } else if (values.month >= 7 && values.month <= 9) {
//                     dueDate = new Date(dueDates.third_due_date);
//                   } else {
//                     dueDate = new Date(dueDates.last_due_date);
//                   }
//                 }
//                 break;
//               case 'half_yearly':
//                 if (values.month && values.month <= 6) {
//                   dueDate = new Date(dueDates.first_due_date);
//                 } else {
//                   dueDate = new Date(dueDates.last_due_date);
//                 }
//                 break;
//               case 'yearly':
//                 dueDate = new Date(dueDates.first_due_date);
//                 break;
//               case 'bi_annual':
//                 dueDate = new Date(dueDates.bi_annual_due_date);
//                 break;
//             }

//             return dueDate && submissionDate > dueDate;
//           })();


//           return (
//             <Form>
//               <div className="space-y-6">
//                 {/* 1st Row: Company && Act Name */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                       Company <span className="text-red-500">*</span>
//                     </label>
//                     <Field name="company_id">
//                       {({ field }: any) => (
//                         <OutlinedSelect
//                           label="Select Company"
//                           options={companies}
//                           value={companies.find(
//                             (option) => Number(option.value) === values.company_id
//                           )}
//                           onChange={(selectedOption: CompanyOption | null) => {
//                             if (selectedOption) {
//                               setFieldValue('company_id', Number(selectedOption.value));
//                               setFieldValue('company_group_id', selectedOption.group_id);
//                               setFieldValue('branch_id', '');
//                               loadBranches(selectedOption.value);
//                             }
//                           }}
//                         />
//                       )}
//                     </Field>
//                     {errors.company_id && touched.company_id && (
//                       <p className="text-red-500 text-xs">{errors.company_id}</p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                       Act Name <span className="text-red-500">*</span>
//                     </label>
//                     <Field name="act_name">
//                       {({ field }: any) => (
//                         <OutlinedSelect
//                           label="Select Act Name"
//                           options={actOptions}
//                           value={actOptions.find(
//                             (option) => option.value === values.act_name
//                           )}
//                           onChange={(selectedOption: SelectOption | null) => {
//                             if (selectedOption) {
//                               const [actName, stateId] = selectedOption.value.split('||');
//                               setFieldValue('act_name', selectedOption.value);
//                               setFieldValue('return_name', '');
//                               setFieldValue('frequency', '');
//                               setFieldValue('state_id', stateId === 'CENTRAL' ? undefined : Number(stateId));
//                               setReturnOptions([]);
//                               loadReturnOptions(actName, stateId);
//                             } else {
//                               setFieldValue('act_name', '');
//                               setFieldValue('return_name', '');
//                               setFieldValue('frequency', '');
//                               setFieldValue('state_id', undefined);
//                               setReturnOptions([]);
//                             }
//                           }}
//                         />
//                       )}
//                     </Field>
//                     {errors.act_name && touched.act_name && (
//                       <p className="text-red-500 text-xs">{errors.act_name}</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* 2nd Row: Return Name && State */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                       State <span className="text-red-500">*</span>
//                     </label>
//                     <OutlinedInput
//                       label="State"
//                       value={
//                         selectedStateId === 'CENTRAL' 
//                           ? 'CENTRAL' 
//                           : states.find(s => s.value === selectedStateId)?.label || '--'
//                       }
//                       onChange={() => {}}
//                       disabled
//                     />
//                     <Field name="state_id" type="hidden" />
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                       Return Name <span className="text-red-500">*</span>
//                     </label>
//                     <Field name="return_name">
//                       {({ field }: any) => (
//                         <OutlinedSelect
//                           label="Select Return Name"
//                           options={returnOptions}
//                           value={returnOptions.find(
//                             (option) => option.value === values.return_name
//                           )}
//                           onChange={(selectedOption: SelectOption | null) => {
//                             setFieldValue(
//                               'return_name',
//                               selectedOption ? selectedOption.value : ''
//                             );
//                             if (selectedOption && selectedActName && selectedStateId) {
//                               const frequency = getFrequencyForReturn(
//                                 selectedActName,
//                                 selectedOption.value,
//                                 selectedStateId
//                               );
//                               setFieldValue('frequency', frequency);
//                             }
//                           }}
//                         />
//                       )}
//                     </Field>
//                     {errors.return_name && touched.return_name && (
//                       <p className="text-red-500 text-xs">{errors.return_name}</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* 3rd Row: District && Location */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                       District <span className="text-red-500">*</span>
//                     </label>
//                     <Field name="district_id">
//                       {({ field }: any) => {
//                         // Load districts when state is selected and districts aren't loaded yet
//                         useEffect(() => {
//                           if (selectedStateId && selectedStateId !== 'CENTRAL' && districts.length === 0) {
//                             loadDistricts(selectedStateId);
//                           }
//                         }, [selectedStateId, districts.length]);

//                         return (
//                           <OutlinedSelect
//                             label="Select District"
//                             options={districts}
//                             value={districts.find(
//                               (option) => Number(option.value) === values.district_id
//                             )}
//                             onChange={(selectedOption: SelectOption | null) => {
//                               setFieldValue(
//                                 'district_id',
//                                 selectedOption ? selectedOption.value : ''
//                               );
//                               setFieldValue('location_id', '');
//                               setLocations([]);
//                               if (selectedOption) {
//                                 loadLocations(selectedOption.value);
//                               }
//                             }}
//                           />
//                         );
//                       }}
//                     </Field>
//                     {errors.district_id && touched.district_id && (
//                       <p className="text-red-500 text-xs">{errors.district_id}</p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                       Location <span className="text-red-500">*</span>
//                     </label>
//                     <Field name="location_id">
//                       {({ field }: any) => (
//                         <OutlinedSelect
//                           label="Select Location"
//                           options={locations}
//                           value={locations.find(
//                             (option) => Number(option.value) === values.location_id
//                           )}
//                           onChange={(selectedOption: SelectOption | null) => {
//                             setFieldValue(
//                               'location_id',
//                               selectedOption ? selectedOption.value : ''
//                             );
//                           }}
//                         />
//                       )}
//                     </Field>
//                     {errors.location_id && touched.location_id && (
//                       <p className="text-red-500 text-xs">{errors.location_id}</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* 4th Row: Branch && Frequency */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                       Branch <span className="text-red-500">*</span>
//                     </label>
//                     <Field name="branch_id">
//                       {({ field }: any) => (
//                         <div>
//                           <OutlinedSelect
//                             label="Select Branch"
//                             options={branches}
//                             value={branches.find(
//                               (option) => Number(option.value) === values.branch_id
//                             )}
//                             onChange={(selectedOption: SelectOption | null) => {
//                               setFieldValue(
//                                 'branch_id',
//                                 selectedOption ? selectedOption.value : ''
//                               );
//                             }}
//                           />
//                           {branches.length === 0 && (
//                             <p className="text-xs text-gray-500 mt-1">
//                               {!values.location_id 
//                                 ? "Please select a location first" 
//                                 : "No branches available for this location"}
//                             </p>
//                           )}
//                         </div>
//                       )}
//                     </Field>
//                     {errors.branch_id && touched.branch_id && (
//                       <p className="text-red-500 text-xs">{errors.branch_id}</p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                       Frequency <span className="text-red-500">*</span>
//                     </label>
//                    <OutlinedInput
//   label="Frequency"
//   value={formatFrequencyDisplay(values.frequency)}
//   onChange={() => {}}
//   disabled
//                     />
//                   </div>
//                 </div>

//                 {/* 5th Row: Year && (Month if applicable) */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                       Year <span className="text-red-500">*</span>
//                     </label>
//                     <Field name="year">
//                       {({ field }: any) => (
//                         <OutlinedSelect
//                           label="Select Year"
//                           options={yearOptions}
//                           value={yearOptions.find(
//                             (option) => option.value === values.year
//                           )}
//                           onChange={(selectedOption: any) => {
//                             setFieldValue(
//                               'year',
//                               selectedOption ? selectedOption.value : ''
//                             );
//                           }}
//                         />
//                       )}
//                     </Field>
//                     {errors.year && touched.year && (
//                       <p className="text-red-500 text-xs">{errors.year}</p>
//                     )}
//                   </div>

//                   {['monthly', 'quarterly', 'half_yearly'].includes(values.frequency) && (
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium">
//                         Month <span className="text-red-500">*</span>
//                       </label>
//                       <Field name="month">
//                         {({ field }: any) => (
//                           <OutlinedInput
//                             label="Enter Month (1-12)"
//                             value={values.month ? String(values.month) : ''}
//                             onChange={(value: string) => {
//                               setFieldValue('month', value ? parseInt(value) : '');
//                             }}
//                           />
//                         )}
//                       </Field>
//                       {errors.month && touched.month && (
//                         <p className="text-red-500 text-xs">{errors.month}</p>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                {/* 6th Row: Return File Submission */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                       Return File Submission <span className="text-red-500">*</span>
//                     </label>
//                     <Field name="return_submission">
//                       {({ field }: any) => (
//                         <OutlinedSelect
//                           label="Select Return File Submission"
//                           options={[
//                             { value: 'applicable', label: 'Applicable' },
//                             { value: 'not_applicable', label: 'Not Applicable' },
//                           ]}
//                           value={
//                             values.return_submission
//                               ? {
//                                   value: values.return_submission,
//                                   label:
//                                     values.return_submission === 'applicable'
//                                       ? 'Applicable'
//                                       : 'Not Applicable',
//                                 }
//                               : null
//                           }
//                           onChange={(selectedOption: SelectOption | null) => {
//                             setFieldValue(
//                               'return_submission',
//                               selectedOption ? selectedOption.value : ''
//                             );
//                             // Clear file when switching to not_applicable
//                             if (selectedOption?.value === 'not_applicable') {
//                               setFieldValue('return_copy', null);
//                               setFieldValue('submission_date', '');
//                               setFieldValue('delay_reason', '');
//                             }
//                           }}
//                         />
//                       )}
//                     </Field>
//                     {errors.return_submission && touched.return_submission && (
//                       <p className="text-red-500 text-xs">{errors.return_submission}</p>
//                     )}
//                   </div>

//                   {/* Conditional fields based on return_submission */}
//                   {values.return_submission === 'applicable' && (
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium">
//                         Submission Date <span className="text-red-500">*</span>
//                       </label>
//                       <Field name="submission_date">
//                         {({ field }: any) => (
//                           <DatePicker
//                             placeholder="Select submission date"
//                             value={values.submission_date ? new Date(values.submission_date) : null}
//                             onChange={(date: Date | null) => {
//                               setFieldValue(
//                                 'submission_date',
//                                 date ? date.toISOString() : ''
//                               );
//                             }}
//                           />
//                         )}
//                       </Field>
//                       {errors.submission_date && touched.submission_date && (
//                         <p className="text-red-500 text-xs">{errors.submission_date}</p>
//                       )}
//                     </div>
//                   )}

//                   {values.return_submission === 'not_applicable' && (
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium">
//                         Not Applicable Reason <span className="text-red-500">*</span>
//                       </label>
//                       <Field name="not_applicable_reason">
//                         {({ field }: any) => (
//                           <OutlinedInput
//                             label="Enter Not Applicable Reason"
//                             value={values.not_applicable_reason || ''}
//                             onChange={(value: string) => {
//                               setFieldValue('not_applicable_reason', value);
//                             }}
//                           />
//                         )}
//                       </Field>
//                       {errors.not_applicable_reason && touched.not_applicable_reason && (
//                         <p className="text-red-500 text-xs">{errors.not_applicable_reason}</p>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {/* 7th Row: Conditional fields for applicable returns */}
//                 {values.return_submission === 'applicable' && (
//                   <>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <label className="text-sm font-medium">
//                           Return Copy (PDF/Zip/Image, Max 20MB) <span className="text-red-500">*</span>
//                         </label>
//                         <Input
//                           type="file"
//                           size="md"
//                           className="w-full"
//                           accept=".pdf,.jpg,.zip,.jpeg,.png"
//                           onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                             const file = e.target.files?.[0];
//                             if (file) {
//                               setFieldValue('return_copy', file);
//                             } else {
//                               setFieldValue('return_copy', null);
//                             }
//                           }}
//                         />
//                         {errors.return_copy && touched.return_copy && (
//                           <p className="text-red-500 text-xs">{errors.return_copy}</p>
//                         )}
//                       </div>
//                       {/* Delay reason (only shown if submission is delayed) */}
//                     {isDelayed && (
//                         <div className="space-y-2">
//                           <label className="text-sm font-medium">
//                             Delay Reason <span className="text-red-500">*</span>
//                           </label>
//                           <Field name="delay_reason">
//                             {({ field }: any) => (
//                               <OutlinedInput
//                                 label="Enter Delay Reason"
//                                 value={values.delay_reason || ''}
//                                 onChange={(value: string) => {
//                                   setFieldValue('delay_reason', value);
//                                 }}
                                
//                               />
//                             )}
//                           </Field>
//                           {errors.delay_reason && touched.delay_reason && (
//                             <p className="text-red-500 text-xs">{errors.delay_reason}</p>
//                           )}
//                         </div>
//                     )}
//                     </div>

                    
//                   </>
//                 )}

//                 {/* Submit Button */}
//                 <div className="flex justify-end gap-2 pt-8">
//                   <Button
//                     type="button"
//                     variant="plain"
//                     onClick={() => navigate(-1)}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     type="submit"
//                     variant="solid"
//                     loading={loading || isSubmitting}
//                     disabled={!isValid || isSubmitting}
//                   >
//                     Confirm
//                   </Button>
//                 </div>
//               </div>
//             </Form>
//           );
//         }}
//       </Formik>
//     </div>
//   );
// };

// export default ReturnTrackerAddForm;
















// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button, Input, DatePicker, toast, Notification } from '@/components/ui';
// import OutlinedSelect from '@/components/ui/Outlined';
// import OutlinedInput from '@/components/ui/OutlinedInput/OutlinedInput';
// import { IoArrowBack } from 'react-icons/io5';
// import httpClient from '@/api/http-client';
// import { endpoints } from '@/api/endpoint';
// import { Formik, Form, Field } from 'formik';
// import * as Yup from 'yup';
// import { values } from 'lodash';

// interface ReturnFormValues {
//   company_id: number;
//   act_name: string;
//   return_name: string;
//   state_id?: number | null;
//   district_id?: number | null;
//   location_id?: number | null;
//   branch_id?: number | null;
//   frequency: string;
//   year: number;
//   month?: number | null;
//   return_submission: string;
//   submission_date?: string | null;  // Allow null
//   delay_reason?: string | null;
//   return_copy?: File | null;
//   not_applicable_reason?: string | null;
// }

// interface CompanyOption extends SelectOption {
//   group_id: number;
// }
// interface SelectOption {
//   value: string;
//   label: string;
// }

// interface SuperadminReturn {
//   id: number;
//   act_name: string;
//   return_name: string;
//   state_id: number;
//   applicable: 'STATE' | 'CENTRAL' | 'ALL_STATES';
//   frequency: string;
//   due_dates: any;
//   State: {
//     name: string;
//   };
//   is_active: boolean;
// }

// interface BranchOption extends SelectOption {
//   location_id: number;
// }

// const validationSchema = Yup.object().shape({
//   company_id: Yup.number().required('Company is required').min(1, 'Please select a company'),
//   act_name: Yup.string().required('Act Name is required'),
//   return_name: Yup.string().required('Return Name is required'),
//   frequency: Yup.string().required('Frequency is required'),
//   year: Yup.number().required('Year is required').min(2000, 'Invalid year').max(2100, 'Invalid year'),
//   return_submission: Yup.string().required('Return Submission is required'),
  
//   // State validation - required when applicable is STATE
//   state_id: Yup.number().when('act_name', {
//     is: (act_name: string) => {
//       if (!act_name) return false;
//       const [, stateId] = act_name.split('||');
//       return stateId !== 'CENTRAL';
//     },
//     then: (schema) => schema.required('State is required'),
//   }),
  
//   // District validation - required when applicable is STATE
//   district_id: Yup.number().when('act_name', {
//     is: (act_name: string) => {
//       if (!act_name) return false;
//       const [, stateId] = act_name.split('||');
//       return stateId !== 'CENTRAL';
//     },
//     then: (schema) => schema.required('District is required'),
//   }),
  
//   // Location validation - required when applicable is STATE
//   location_id: Yup.number().when('act_name', {
//     is: (act_name: string) => {
//       if (!act_name) return false;
//       const [, stateId] = act_name.split('||');
//       return stateId !== 'CENTRAL';
//     },
//     then: (schema) => schema.required('Location is required'),
//   }),
  
//   // Branch validation - required when applicable is STATE
//   branch_id: Yup.number().when('act_name', {
//     is: (act_name: string) => {
//       if (!act_name) return false;
//       const [, stateId] = act_name.split('||');
//       return stateId !== 'CENTRAL';
//     },
//     then: (schema) => schema.required('Branch is required'),
//   }),
  
//   submission_date: Yup.string().when('return_submission', {
//     is: 'applicable',
//     then: (schema) => schema.required('Submission Date is required'),
//   }),
  
//   delay_reason: Yup.string().when(['return_submission', 'submission_date'], {
//     is: (return_submission: string, submission_date: string) => 
//       return_submission === 'applicable' && submission_date,
//     then: (schema) => schema.test(
//       'is-delayed',
//       'Delay reason is required for delayed returns',
//       function (value) {
//         const { parent } = this;
//         const superadminReturn = parent._superadminReturn;
        
//         if (!superadminReturn || !superadminReturn.due_dates || !parent.submission_date) {
//           return true;
//         }

//         const dueDates = superadminReturn.due_dates;
//         let dueDate: Date | null = null;
//         const submissionDate = new Date(parent.submission_date);

//         switch (parent.frequency) {
//           case 'monthly':
//             dueDate = new Date(dueDates.first_due_date);
//             break;
//           case 'quarterly':
//             if (parent.month) {
//               if (parent.month >= 1 && parent.month <= 3) {
//                 dueDate = new Date(dueDates.first_due_date);
//               } else if (parent.month >= 4 && parent.month <= 6) {
//                 dueDate = new Date(dueDates.second_due_date);
//               } else if (parent.month >= 7 && parent.month <= 9) {
//                 dueDate = new Date(dueDates.third_due_date);
//               } else {
//                 dueDate = new Date(dueDates.last_due_date);
//               }
//             }
//             break;
//           case 'half_yearly':
//             if (parent.month && parent.month <= 6) {
//               dueDate = new Date(dueDates.first_due_date);
//             } else {
//               dueDate = new Date(dueDates.last_due_date);
//             }
//             break;
//           case 'yearly':
//             dueDate = new Date(dueDates.first_due_date);
//             break;
//           case 'bi_annual':
//             dueDate = new Date(dueDates.bi_annual_due_date);
//             break;
//         }

//         if (dueDate && submissionDate > dueDate) {
//           return !!value;
//         }
//         return true;
//       }
//     ),
//   }),
  
//   not_applicable_reason: Yup.string().when('return_submission', {
//     is: 'not_applicable',
//     then: (schema) => schema.required('Not Applicable Reason is required'),
//   }),
  
//   return_copy: Yup.mixed().when('return_submission', {
//     is: 'applicable',
//     then: (schema) => schema
//       .required('Return copy is required')
//       .test('fileSize', 'File size must be less than 20MB', (value) => {
//         if (!value) return false;
//         return (value as File).size <= 20 * 1024 * 1024;
//       })
//       .test('fileType', 'Only PDF, Excel, and image files are allowed', (value) => {
//         if (!value) return false;
//         const file = value as File;
//         const allowedTypes = [
//           'application/pdf',
//           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//           'application/vnd.ms-excel',
//           'image/jpeg',
//           'image/png'
//         ];
//         return allowedTypes.includes(file.type);
//       }),
//     otherwise: (schema) => schema.nullable()
//   }),
  
//   month: Yup.number().when('frequency', {
//     is: (frequency: string) => ['monthly', 'quarterly', 'half_yearly'].includes(frequency),
//     then: (schema) => schema.required('Month is required').min(1, 'Invalid month').max(12, 'Invalid month'),
//   }),
// });

// const ReturnTrackerAddForm = () => {
//   const navigate = useNavigate();
//   const [actOptions, setActOptions] = useState<SelectOption[]>([]);
//   const [returnOptions, setReturnOptions] = useState<SelectOption[]>([]);
//   const [companyGroups, setCompanyGroups] = useState<SelectOption[]>([]);
//   const [companies, setCompanies] = useState<CompanyOption[]>([]);
//   const [allBranches, setAllBranches] = useState<BranchOption[]>([]);
//   const [branches, setBranches] = useState<BranchOption[]>([]);
//   const [states, setStates] = useState<SelectOption[]>([]);
//   const [districts, setDistricts] = useState<SelectOption[]>([]);
//   const [locations, setLocations] = useState<SelectOption[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [superadminReturns, setSuperadminReturns] = useState<SuperadminReturn[]>([]);
//   const [currentGroupId, setCurrentGroupId] = useState<number>(0);
//   const [allIndianStates, setAllIndianStates] = useState<SelectOption[]>([]);

//   const showNotification = (
//     type: 'success' | 'info' | 'error' | 'warning',
//     message: string
//   ) => {
//     toast.push(
//       <Notification
//         title={type.charAt(0).toUpperCase() + type.slice(1)}
//         type={type}
//       >
//         {message}
//       </Notification>
//     );
//   };

//   useEffect(() => {
//     const loadInitialData = async () => {
//       try {
//         // Load all Indian states first
//         const statesResponse = await httpClient.get(endpoints.common.state());
//         const allStates = statesResponse.data.map((state: any) => ({
//           label: state.name,
//           value: String(state.id),
//         }));
//         setAllIndianStates(allStates);
//         setStates(allStates);

//         // Load company groups
//         const groupsResponse = await httpClient.get(endpoints.companyGroup.getAll());
//         const companyGroupOptions = groupsResponse.data.data.map((group: any) => ({
//           label: group.name,
//           value: String(group.id),
//         }));
//         setCompanyGroups(companyGroupOptions);

//         if (groupsResponse.data.data.length > 0) {
//           const firstGroupId = groupsResponse.data.data[0].id;
//           await loadCompanies(String(firstGroupId));
//         }

//         // Load superadmin returns for act names and return names
//         const returnsResponse = await httpClient.get(endpoints.return.getList());
//         setSuperadminReturns(returnsResponse.data.data);

//         // Prepare act options based on applicable field
//         const uniqueActs = new Map<string, boolean>();
//         const actOptionsList: SelectOption[] = [];

//         returnsResponse.data.data.forEach((ret: SuperadminReturn) => {
//             if (!ret.is_active) return;

//           if (ret.applicable === 'CENTRAL') {
//             if (!uniqueActs.has(ret.act_name)) {
//               actOptionsList.push({
//                 label: `${ret.act_name} (Central)`,
//                 value: `${ret.act_name}||CENTRAL`,
//               });
//               uniqueActs.set(ret.act_name, true);
//             }
//           } else if (ret.applicable === 'ALL_STATES') {
//             allStates.forEach(state => {
//               actOptionsList.push({
//                 label: `${ret.act_name} (${state.label})`,
//                 value: `${ret.act_name}||${state.value}`,
//               });
//             });
//           } else if (ret.applicable === 'STATE') {
//             actOptionsList.push({
//               label: `${ret.act_name} (${ret.State.name})`,
//               value: `${ret.act_name}||${ret.state_id}`,
//             });
//           }
//         });
//         actOptionsList.sort((a, b) => a.label.localeCompare(b.label));
//         setActOptions(actOptionsList);
//       } catch (error) {
//         console.error('Failed to load initial data:', error);
//         showNotification('error', 'Failed to load initial data');
//       }
//     };

//     loadInitialData();
//   }, []);

//   useEffect(() => {
//   // Mark fields as touched if they have values
//   const fieldsToCheck = [
//     'company_id',
//     'act_name',
//     'return_name',
//     'district_id',
//     'location_id',
//     'branch_id',
//     'year',
//     'return_submission',
//     'month',
//     'not_applicable_reason'
//   ];
  
//   fieldsToCheck.forEach(field => {
//     if (values[field as keyof typeof values] && !Touch[field as keyof typeof Touch]) {
//       setFieldTouched(field, true);
//     }
//   });
// }, [values]);


//   const loadCompanies = async (groupId: string) => {
//     try {
//       const response = await httpClient.get(endpoints.company.getAll(), {
//         params: { 'group_id[]': groupId },
//       });
//       setCompanies(
//         response.data.data.map((company: any) => ({
//           label: company.name,
//           value: String(company.id),
//           group_id: company.group_id,
//         }))
//       );
//       setCurrentGroupId(Number(groupId));
//     } catch (error) {
//       console.error('Failed to load companies:', error);
//       showNotification('error', 'Failed to load companies');
//     }
//   };

// const loadBranches = async (companyId: string) => {
//   try {
//     const response = await httpClient.get(endpoints.branch.getAllBranch(), {
//       params: { 'company_id[]': companyId },
//     });
//     const branchesData = response.data.data.map((branch: any) => ({
//       label: branch.name
//         .split(' ')
//         .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//         .join(' '),
//       value: String(branch.id),
//       location_id: branch.location_id,
//     }));
//     setAllBranches(branchesData);
//     setBranches([]); // Reset branches when company changes
//   } catch (error) {
//     console.error('Failed to load branches:', error);
//     showNotification('error', 'Failed to load branches');
//   }
// };


//   const loadDistricts = async (stateId: string) => {
//     try {
//       const response = await httpClient.get(endpoints.common.district(), {
//         params: { 'state_id[]': stateId },
//       });
//       setDistricts(
//         response.data.map((district: any) => ({
//           label: district.name,
//           value: String(district.id),
//         }))
//       );
//     } catch (error) {
//       console.error('Failed to load districts:', error);
//       showNotification('error', 'Failed to load districts');
//     }
//   };

//   const loadLocations = async (districtId: string) => {
//     try {
//       const response = await httpClient.get(endpoints.common.location(), {
//         params: { 'district_id[]': districtId },
//       });
//       setLocations(
//         response.data.map((location: any) => ({
//           label: location.name,
//           value: String(location.id),
//         }))
//       );
//     } catch (error) {
//       console.error('Failed to load locations:', error);
//       showNotification('error', 'Failed to load locations');
//     }
//   };

//   const getApplicableForAct = (actName: string, stateId: string) => {
//     if (stateId === 'CENTRAL') return 'CENTRAL';
    
//     const returnData = superadminReturns.find(
//       ret => ret.act_name === actName && 
//              (ret.applicable === 'ALL_STATES' || 
//               (ret.applicable === 'STATE' && ret.state_id === Number(stateId)))
//     );
    
//     return returnData?.applicable || '';
//   };

//   const loadReturnOptions = (actName: string, stateId: string) => {
//     try {
//       let filteredReturns: SuperadminReturn[] = [];
      
//       if (stateId === 'CENTRAL') {
//         filteredReturns = superadminReturns.filter(
//           ret => ret.act_name === actName && ret.applicable === 'CENTRAL'
//         );
//       } else {
//         filteredReturns = superadminReturns.filter(
//           ret => ret.act_name === actName && 
//                  (ret.applicable === 'ALL_STATES' || 
//                   (ret.applicable === 'STATE' && ret.state_id === Number(stateId)))
//         );
//       }

//       setReturnOptions(
//         filteredReturns.map(ret => ({
//           label: ret.return_name,
//           value: ret.return_name,
//         }))
//       );
//     } catch (error) {
//       console.error('Failed to load return options:', error);
//       showNotification('error', 'Failed to load return options');
//     }
//   };

//   const getFrequencyForReturn = (actName: string, returnName: string, stateId: string) => {
//     let returnData: SuperadminReturn | undefined;
    
//     if (stateId === 'CENTRAL') {
//       returnData = superadminReturns.find(
//         ret => ret.act_name === actName && 
//                ret.return_name === returnName && 
//                ret.applicable === 'CENTRAL'
//       );
//     } else {
//       returnData = superadminReturns.find(
//         ret => ret.act_name === actName && 
//                ret.return_name === returnName && 
//                (ret.applicable === 'ALL_STATES' || 
//                 (ret.applicable === 'STATE' && ret.state_id === Number(stateId)))
//       );
//     }
    
//     return returnData?.frequency || '';
//   };

// const handleSubmit = async (values: ReturnFormValues) => {
//   try {
//     setLoading(true);

//     // Convert file to base64 only if applicable
//     let returnCopyBase64 = '';
//     if (values.return_copy && values.return_submission === 'applicable') {
//       returnCopyBase64 = await new Promise<string>((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = () => {
//           const result = reader.result as string;
//           resolve(result.split(',')[1]);
//         };
//         reader.onerror = (error) => {
//           reject(error);
//         };
//         reader.readAsDataURL(values.return_copy as Blob);
//       });
//     }

//     // Split act_name to remove state ID
//     const [actName] = values.act_name.split('||');

//     // Prepare the submission data - set null for unused fields based on return_submission
//     const submissionData = {
//       ...values,
//       act_name: actName,
//       company_group_id: currentGroupId,
//       company_id: Number(values.company_id),
//       state_id: values.state_id ? Number(values.state_id) : null, // Use null instead of undefined
//       district_id: values.district_id ? Number(values.district_id) : null,
//       location_id: values.location_id ? Number(values.location_id) : null,
//       branch_id: values.branch_id ? Number(values.branch_id) : null,
//       year: Number(values.year),
//       month: values.month ? Number(values.month) : null,
//       return_copy: values.return_submission === 'applicable' ? returnCopyBase64 : null,
//       submission_date: values.return_submission === 'applicable' && values.submission_date 
//         ? new Date(values.submission_date).toISOString() 
//         : null, // Set to null if not applicable
//       delay_reason: values.return_submission === 'applicable' ? values.delay_reason : null,
//       not_applicable_reason: values.return_submission === 'not_applicable' 
//         ? values.not_applicable_reason 
//         : null
//     };

//     // Make the API call
//     const response = await httpClient.post(
//       endpoints.return.create(),
//       submissionData
//     );

//     if (response) {
//       showNotification('success', 'Return created successfully');
//       navigate('/return-tracker');
//     }
//   } catch (error: any) {
//     console.error('Failed to create return:', error);
//     const errorMessage = error.response?.data?.message || 'Failed to create return';
//     showNotification('error', errorMessage);
//   } finally {
//     setLoading(false);
//   }
// };
//   const initialValues: ReturnFormValues = {
//     company_id: 0,
//     act_name: '',
//     return_name: '',
//     state_id: null,
//     frequency: '',
//     year: new Date().getFullYear(),
//     return_submission: '',
//     submission_date: null,
//   };
 
//   // Generate year options (current year and past 4 years)
//   const yearOptions = Array.from({ length: 5 }, (_, i) => {
//     const year = new Date().getFullYear() - i;
//     return {
//       label: String(year),
//       value: year,
//     };
//   });

//   const formatFrequencyDisplay = (frequency: string) => {
//     if (!frequency) return '--';
    
//     const formatMap: Record<string, string> = {
//       monthly: 'Monthly',
//       quarterly: 'Quarterly',
//       half_yearly: 'Half Yearly',
//       yearly: 'Yearly',
//       bi_annual: 'Bi-Annual'
//     };
    
//     return formatMap[frequency] || frequency;
//   };

//   return (
//     <div className="w-full mx-auto p-2 bg-white rounded-lg">
//       <div className="flex gap-2 items-center mb-3">
//         <Button
//           size="sm"
//           variant="plain"
//           icon={<IoArrowBack className="text-gray-500 hover:text-gray-700" />}
//           onClick={() => navigate(-1)}
//         />
//         <h3 className="text-2xl font-semibold">Add Return Details</h3>
//       </div>

//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={handleSubmit}
//       >
//         {({
//           values,
//           errors,
//           touched,
//           setFieldValue,
//           setFieldTouched,
//           isValid,
//           isSubmitting,
//         }) => {
//          useEffect(() => {
//   if (values.location_id && allBranches.length > 0) {
//     const filteredBranches = allBranches.filter(
//       branch => Number(branch.location_id) === Number(values.location_id)
//     );
//     setBranches(filteredBranches);
    
//     // Reset branch selection if current selection is not in filtered list
//     if (values.branch_id && !filteredBranches.some(b => b.value === String(values.branch_id))) {
//       setFieldValue('branch_id', '');
//     }
//   } else {
//     setBranches([]);
//     setFieldValue('branch_id', '');
//   }
// }, [values.location_id, allBranches]);

//           useEffect(() => {
//             if (Object.keys(errors).length > 0) {
//               console.log('Form errors:', errors);
//             }
//           }, [errors]);

//           // Parse act_name and state_id from values.act_name
//           const [selectedActName, selectedStateId] = values.act_name ? values.act_name.split('||') : ['', ''];
          
//           // Get applicable value for the selected act
//           const applicableValue = selectedActName ? getApplicableForAct(selectedActName, selectedStateId) : '';
          
//           const superadminReturn = superadminReturns.find(
//             ret =>
//               ret.act_name === selectedActName &&
//               ret.return_name === values.return_name &&
//               (ret.applicable === 'CENTRAL' || 
//                ret.applicable === 'ALL_STATES' || 
//                (ret.applicable === 'STATE' && ret.state_id === Number(selectedStateId)))
//           );

//           const isDelayed = (() => {
//             if (!superadminReturn || !values.submission_date || values.return_submission !== 'applicable') {
//               return false;
//             }

//             const dueDates = superadminReturn.due_dates;
//             if (!dueDates) return false;

//             const submissionDate = new Date(values.submission_date);
//             let dueDate: Date | null = null;

//             switch (values.frequency) {
//               case 'monthly':
//                 dueDate = new Date(dueDates.first_due_date);
//                 break;
//               case 'quarterly':
//                 if (values.month) {
//                   if (values.month >= 1 && values.month <= 3) {
//                     dueDate = new Date(dueDates.first_due_date);
//                   } else if (values.month >= 4 && values.month <= 6) {
//                     dueDate = new Date(dueDates.second_due_date);
//                   } else if (values.month >= 7 && values.month <= 9) {
//                     dueDate = new Date(dueDates.third_due_date);
//                   } else {
//                     dueDate = new Date(dueDates.last_due_date);
//                   }
//                 }
//                 break;
//               case 'half_yearly':
//                 if (values.month && values.month <= 6) {
//                   dueDate = new Date(dueDates.first_due_date);
//                 } else {
//                   dueDate = new Date(dueDates.last_due_date);
//                 }
//                 break;
//               case 'yearly':
//                 dueDate = new Date(dueDates.first_due_date);
//                 break;
//               case 'bi_annual':
//                 dueDate = new Date(dueDates.bi_annual_due_date);
//                 break;
//             }

//             return dueDate && submissionDate > dueDate;
//           })();

//           return (
//             <Form>
//               <div className="space-y-6">
//                 {/* 1st Row: Company && Act Name */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                       Company <span className="text-red-500">*</span>
//                     </label>
//                     <Field name="company_id">
//                       {({ field }: any) => (
//                         <OutlinedSelect
//                           label="Select Company"
//                           options={companies}
//                           value={companies.find(
//                             (option) => Number(option.value) === values.company_id
//                           )}
//                           onChange={(selectedOption: CompanyOption | null) => {
//                             if (selectedOption) {
//                               setFieldValue('company_id', Number(selectedOption.value));
//                               setFieldValue('company_group_id', selectedOption.group_id);
//                               setFieldValue('branch_id', '');
//                               loadBranches(selectedOption.value);
//                             }
//                           }}
//                         />
//                       )}
//                     </Field>
//                     {errors.company_id && touched.company_id && (
//                       <p className="text-red-500 text-xs">{errors.company_id}</p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                       Act Name <span className="text-red-500">*</span>
//                     </label>
//                     <Field name="act_name">
//                       {({ field }: any) => (
//                         <OutlinedSelect
//                           label="Select Act Name"
//                           options={actOptions}
//                           value={actOptions.find(
//                             (option) => option.value === values.act_name
//                           )}
//                           onChange={(selectedOption: SelectOption | null) => {
//                             if (selectedOption) {
//                               const [actName, stateId] = selectedOption.value.split('||');
//                               setFieldValue('act_name', selectedOption.value);
//                               setFieldValue('return_name', '');
//                               setFieldValue('frequency', '');
//                               setFieldValue('state_id', stateId === 'CENTRAL' ? undefined : Number(stateId));
//                               setReturnOptions([]);
//                               loadReturnOptions(actName, stateId);
//                             } else {
//                               setFieldValue('act_name', '');
//                               setFieldValue('return_name', '');
//                               setFieldValue('frequency', '');
//                               setFieldValue('state_id', undefined);
//                               setReturnOptions([]);
//                             }
//                           }}
//                         />
//                       )}
//                     </Field>
//                     {errors.act_name && touched.act_name && (
//                       <p className="text-red-500 text-xs">{errors.act_name}</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* 2nd Row: Applicable && Return Name */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                       Applicable
//                     </label>
//                     <OutlinedInput
//                       label="Applicable"
//                       value={
//                         applicableValue === 'CENTRAL' 
//                           ? 'CENTRAL' 
//                           : applicableValue === 'STATE'
//                             ? 'STATE'
//                             : applicableValue === 'ALL_STATES'
//                               ? 'ALL STATES'
//                               : '--'
//                       }
//                       onChange={() => {}}
//                       disabled
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                       Return Name <span className="text-red-500">*</span>
//                     </label>
//                     <Field name="return_name">
//                       {({ field }: any) => (
//                         <OutlinedSelect
//                           label="Select Return Name"
//                           options={returnOptions}
//                           value={returnOptions.find(
//                             (option) => option.value === values.return_name
//                           )}
//                           onChange={(selectedOption: SelectOption | null) => {
//                             setFieldValue(
//                               'return_name',
//                               selectedOption ? selectedOption.value : ''
//                             );
//                             if (selectedOption && selectedActName && selectedStateId) {
//                               const frequency = getFrequencyForReturn(
//                                 selectedActName,
//                                 selectedOption.value,
//                                 selectedStateId
//                               );
//                               setFieldValue('frequency', frequency);
//                             }
//                           }}
//                         />
//                       )}
//                     </Field>
//                     {errors.return_name && touched.return_name && (
//                       <p className="text-red-500 text-xs">{errors.return_name}</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* 3rd Row: State (only shown for STATE applicable) */}
//                 {applicableValue === 'STATE' && (
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium">
//                         State <span className="text-red-500">*</span>
//                       </label>
//                       <OutlinedInput
//                         label="State"
//                         value={
//                           states.find(s => s.value === selectedStateId)?.label || '--'
//                         }
//                         onChange={() => {}}
//                         disabled
//                       />
//                       <Field name="state_id" type="hidden" />
//                     </div>
//                     <div></div>
//                   </div>
//                 )}

//                 {/* 4th Row: District && Location (only shown for STATE applicable) */}
//                 {applicableValue === 'STATE' && (
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium">
//                         District <span className="text-red-500">*</span>
//                       </label>
//                       <Field name="district_id">
//                         {({ field }: any) => {
//                           useEffect(() => {
//   if (selectedStateId && selectedStateId !== 'CENTRAL') {
//     loadDistricts(selectedStateId);
//     // Clear existing districts and locations when state changes
//     setDistricts([]);
//     setFieldValue('district_id', '');
//     setLocations([]);
//     setFieldValue('location_id', '');
//   }
// }, [selectedStateId]); // Remove districts.length from dependencies

//                           return (
//                             <OutlinedSelect
//                               label="Select District"
//                               options={districts}
//                               value={districts.find(
//                                 (option) => Number(option.value) === values.district_id
//                               )}
//                               onChange={(selectedOption: SelectOption | null) => {
//                                 setFieldValue(
//                                   'district_id',
//                                   selectedOption ? selectedOption.value : ''
//                                 );
//                                 setFieldValue('location_id', '');
//                                 setLocations([]);
//                                 if (selectedOption) {
//                                   loadLocations(selectedOption.value);
//                                 }
//                               }}
//                             />
//                           );
//                         }}
//                       </Field>
//                       {errors.district_id && touched.district_id && (
//                         <p className="text-red-500 text-xs">{errors.district_id}</p>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <label className="text-sm font-medium">
//                         Location <span className="text-red-500">*</span>
//                       </label>
//                       <Field name="location_id">
//   {({ field }: any) => (
//     <OutlinedSelect
//       label="Select Location"
//       options={locations}
//       value={locations.find(
//         (option) => Number(option.value) === values.location_id
//       )}
//       onChange={(selectedOption: SelectOption | null) => {
//         setFieldValue(
//           'location_id',
//           selectedOption ? selectedOption.value : ''
//         );
//         setFieldValue('branch_id', ''); // Clear branch when location changes
//         setBranches([]); // Clear branches when location changes
//       }}
//     />
//   )}
// </Field>
//                       {errors.location_id && touched.location_id && (
//                         <p className="text-red-500 text-xs">{errors.location_id}</p>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* 5th Row: Branch && Frequency */}
//                 <div className="grid grid-cols-2 gap-4">
//                   {applicableValue === 'STATE' && (
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium">
//                         Branch <span className="text-red-500">*</span>
//                       </label>
//                       <Field name="branch_id">
//                         {({ field }: any) => (
//                           <div>
//                             <OutlinedSelect
//                               label="Select Branch"
//                               options={branches}
//                               value={branches.find(
//                                 (option) => Number(option.value) === values.branch_id
//                               )}
//                               onChange={(selectedOption: SelectOption | null) => {
//                                 setFieldValue(
//                                   'branch_id',
//                                   selectedOption ? selectedOption.value : ''
//                                 );
//                               }}
//                             />
//                             {branches.length === 0 && (
//                               <p className="text-xs text-gray-500 mt-1">
//                                 {!values.location_id 
//                                   ? "Please select a location first" 
//                                   : "No branches available for this location"}
//                               </p>
//                             )}
//                           </div>
//                         )}
//                       </Field>
//                       {errors.branch_id && touched.branch_id && (
//                         <p className="text-red-500 text-xs">{errors.branch_id}</p>
//                       )}
//                     </div>
//                   )}

//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                       Frequency <span className="text-red-500">*</span>
//                     </label>
//                     <OutlinedInput
//                       label="Frequency"
//                       value={formatFrequencyDisplay(values.frequency)}
//                       onChange={() => {}}
//                       disabled
//                     />
//                   </div>
//                 </div>

//                 {/* 6th Row: Year && (Month if applicable) */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                       Year <span className="text-red-500">*</span>
//                     </label>
//                     <Field name="year">
//                       {({ field }: any) => (
//                         <OutlinedSelect
//                           label="Select Year"
//                           options={yearOptions}
//                           value={yearOptions.find(
//                             (option) => option.value === values.year
//                           )}
//                           onChange={(selectedOption: any) => {
//                             setFieldValue(
//                               'year',
//                               selectedOption ? selectedOption.value : ''
//                             );
//                           }}
//                         />
//                       )}
//                     </Field>
//                     {errors.year && touched.year && (
//                       <p className="text-red-500 text-xs">{errors.year}</p>
//                     )}
//                   </div>

//                   {['monthly', 'quarterly', 'half_yearly'].includes(values.frequency) && (
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium">
//                         Month <span className="text-red-500">*</span>
//                       </label>
//                       <Field name="month">
//                         {({ field }: any) => (
//                           <OutlinedInput
//                             label="Enter Month (1-12)"
//                             value={values.month ? String(values.month) : ''}
//                             onChange={(value: string) => {
//                               const monthNum = value ? parseInt(value) : undefined;
//         setFieldValue('month', monthNum);
//                             }}
//                           />
//                         )}
//                       </Field>
//                       {errors.month && touched.month && (
//                         <p className="text-red-500 text-xs">{errors.month}</p>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {/* 7th Row: Return File Submission */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                       Return File Submission <span className="text-red-500">*</span>
//                     </label>
//                     <Field name="return_submission">
//                       {({ field }: any) => (
//                         <OutlinedSelect
//                           label="Select Return File Submission"
//                           options={[
//                             { value: 'applicable', label: 'Applicable' },
//                             { value: 'not_applicable', label: 'Not Applicable' },
//                           ]}
//                           value={
//                             values.return_submission
//                               ? {
//                                   value: values.return_submission,
//                                   label:
//                                     values.return_submission === 'applicable'
//                                       ? 'Applicable'
//                                       : 'Not Applicable',
//                                 }
//                               : null
//                           }
//                           onChange={(selectedOption: SelectOption | null) => {
//                             setFieldValue(
//                               'return_submission',
//                               selectedOption ? selectedOption.value : ''
//                             );
//                             if (selectedOption?.value === 'not_applicable') {
//                               setFieldValue('return_copy', null);
//                               setFieldValue('submission_date', '');
//                               setFieldValue('delay_reason', '');
//                             }
//                           }}
//                         />
//                       )}
//                     </Field>
//                     {errors.return_submission && touched.return_submission && (
//                       <p className="text-red-500 text-xs">{errors.return_submission}</p>
//                     )}
//                   </div>

//                   {values.return_submission === 'applicable' && (
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium">
//                         Submission Date <span className="text-red-500">*</span>
//                       </label>
//                       <Field name="submission_date">
//                         {({ field }: any) => (
//                           <DatePicker
//                             placeholder="Select submission date"
//                             value={values.submission_date ? new Date(values.submission_date) : null}
//                             onChange={(date: Date | null) => {
//                               setFieldValue(
//                                 'submission_date',
//                                 date ? date.toISOString() : ''
//                               );
//                             }}
//                           />
//                         )}
//                       </Field>
//                       {errors.submission_date && touched.submission_date && (
//                         <p className="text-red-500 text-xs">{errors.submission_date}</p>
//                       )}
//                     </div>
//                   )}

//                   {values.return_submission === 'not_applicable' && (
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium">
//                         Not Applicable Reason <span className="text-red-500">*</span>
//                       </label>
//                       <Field name="not_applicable_reason">
//                         {({ field }: any) => (
//                           <OutlinedInput
//                             label="Enter Not Applicable Reason"
//                             value={values.not_applicable_reason || ''}
//                             onChange={(value: string) => {
//                               setFieldValue('not_applicable_reason', value);
//                                       setFieldTouched('not_applicable_reason', true);

//                             }}
//                           />
//                         )}
//                       </Field>
//                       {errors.not_applicable_reason && touched.not_applicable_reason && (
//                         <p className="text-red-500 text-xs">{errors.not_applicable_reason}</p>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {/* 8th Row: Conditional fields for applicable returns */}
//                 {values.return_submission === 'applicable' && (
//                   <>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <label className="text-sm font-medium">
//                           Return Copy (PDF/Zip/Image, Max 20MB) <span className="text-red-500">*</span>
//                         </label>
//                         <Input
//                           type="file"
//                           size="md"
//                           className="w-full"
//                           accept=".pdf,.jpg,.zip,.jpeg,.png"
//                           onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                             const file = e.target.files?.[0];
//                             if (file) {
//                               setFieldValue('return_copy', file);
//                             } else {
//                               setFieldValue('return_copy', null);
//                             }
//                           }}
//                         />
//                         {errors.return_copy && touched.return_copy && (
//                           <p className="text-red-500 text-xs">{errors.return_copy}</p>
//                         )}
//                       </div>
//                       {isDelayed && (
//                         <div className="space-y-2">
//                           <label className="text-sm font-medium">
//                             Delay Reason <span className="text-red-500">*</span>
//                           </label>
//                           <Field name="delay_reason">
//                             {({ field }: any) => (
//                               <OutlinedInput
//                                 label="Enter Delay Reason"
//                                 value={values.delay_reason || ''}
//                                 onChange={(value: string) => {
//                                   setFieldValue('delay_reason', value);
//                                 }}
//                               />
//                             )}
//                           </Field>
//                           {errors.delay_reason && touched.delay_reason && (
//                             <p className="text-red-500 text-xs">{errors.delay_reason}</p>
//                           )}
                       
//                         </div>
//                     )}
//                     </div>

                    
//                   </>
//                 )}

//                 {/* Submit Button */}
//                 <div className="flex justify-end gap-2 pt-8">
//                   <Button
//                     type="button"
//                     variant="plain"
//                     onClick={() => navigate(-1)}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     type="submit"
//                     variant="solid"
//                     loading={loading || isSubmitting}
//                     disabled={!isValid || isSubmitting}
//                   >
//                     Confirm
//                   </Button>
//                 </div>
//               </div>
              
//             </Form>
//           );
//         }}
//       </Formik>
//     </div>
//   );
// };

// export default ReturnTrackerAddForm;













import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, DatePicker, toast, Notification } from '@/components/ui';
import OutlinedSelect from '@/components/ui/Outlined';
import OutlinedInput from '@/components/ui/OutlinedInput/OutlinedInput';
import { IoArrowBack } from 'react-icons/io5';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

interface ReturnFormValues {
  company_id: number;
  act_name: string;
  return_name: string;
  state_id?: number | null;
  district_id?: number | null;
  location_id?: number | null;
  branch_id?: number | null;
  frequency: string;
  year: number;
  month?: number | null;
  return_submission: string;
  submission_date?: string | null;
  delay_reason?: string | null;
  return_copy?: File | null;
  not_applicable_reason?: string | null;
}

interface CompanyOption extends SelectOption {
  group_id: number;
}
interface SelectOption {
  value: string;
  label: string;
}

interface SuperadminReturn {
  id: number;
  act_name: string;
  return_name: string;
  state_id: number;
  applicable: 'STATE' | 'CENTRAL' | 'ALL_STATES';
  frequency: string;
  due_dates: any;
  State: {
    name: string;
  };
  is_active: boolean;
}

interface BranchOption extends SelectOption {
  location_id: number;
}

const validationSchema = Yup.object().shape({
  company_id: Yup.number().required('Company is required').min(1, 'Please select a company'),
  act_name: Yup.string().required('Act Name is required'),
  return_name: Yup.string().required('Return Name is required'),
  frequency: Yup.string().required('Frequency is required'),
  year: Yup.number().required('Year is required').min(2000, 'Invalid year').max(2100, 'Invalid year'),
  return_submission: Yup.string().required('Return Submission is required'),
  
  state_id: Yup.number().when('act_name', {
    is: (act_name: string) => {
      if (!act_name) return false;
      const [, stateId] = act_name.split('||');
      return stateId !== 'CENTRAL';
    },
    then: (schema) => schema.required('State is required'),
  }),
  
  district_id: Yup.number().when('act_name', {
    is: (act_name: string) => {
      if (!act_name) return false;
      const [, stateId] = act_name.split('||');
      return stateId !== 'CENTRAL';
    },
    then: (schema) => schema.required('District is required'),
  }),
  
  location_id: Yup.number().when('act_name', {
    is: (act_name: string) => {
      if (!act_name) return false;
      const [, stateId] = act_name.split('||');
      return stateId !== 'CENTRAL';
    },
    then: (schema) => schema.required('Location is required'),
  }),
  
  branch_id: Yup.number().when('act_name', {
    is: (act_name: string) => {
      if (!act_name) return false;
      const [, stateId] = act_name.split('||');
      return stateId !== 'CENTRAL';
    },
    then: (schema) => schema.required('Branch is required'),
  }),
  
  submission_date: Yup.string().when('return_submission', {
    is: 'applicable',
    then: (schema) => schema.required('Submission Date is required'),
  }),
  
  delay_reason: Yup.string().when(['return_submission', 'submission_date'], {
    is: (return_submission: string, submission_date: string) => 
      return_submission === 'applicable' && submission_date,
    then: (schema) => schema.test(
      'is-delayed',
      'Delay reason is required for delayed returns',
      function (value) {
        const { parent } = this;
        const superadminReturn = parent._superadminReturn;
        
        if (!superadminReturn || !superadminReturn.due_dates || !parent.submission_date) {
          return true;
        }

        const dueDates = superadminReturn.due_dates;
        let dueDate: Date | null = null;
        const submissionDate = new Date(parent.submission_date);

        switch (parent.frequency) {
          case 'monthly':
            dueDate = new Date(dueDates.first_due_date);
            break;
          case 'quarterly':
            if (parent.month) {
              if (parent.month >= 1 && parent.month <= 3) {
                dueDate = new Date(dueDates.first_due_date);
              } else if (parent.month >= 4 && parent.month <= 6) {
                dueDate = new Date(dueDates.second_due_date);
              } else if (parent.month >= 7 && parent.month <= 9) {
                dueDate = new Date(dueDates.third_due_date);
              } else {
                dueDate = new Date(dueDates.last_due_date);
              }
            }
            break;
          case 'half_yearly':
            if (parent.month && parent.month <= 6) {
              dueDate = new Date(dueDates.first_due_date);
            } else {
              dueDate = new Date(dueDates.last_due_date);
            }
            break;
          case 'yearly':
            dueDate = new Date(dueDates.first_due_date);
            break;
          case 'bi_annual':
            dueDate = new Date(dueDates.bi_annual_due_date);
            break;
        }

        if (dueDate && submissionDate > dueDate) {
          return !!value;
        }
        return true;
      }
    ),
  }),
  
  not_applicable_reason: Yup.string().when('return_submission', {
    is: 'not_applicable',
    then: (schema) => schema.required('Not Applicable Reason is required'),
  }),
  
  return_copy: Yup.mixed().when('return_submission', {
    is: 'applicable',
    then: (schema) => schema
      .required('Return copy is required')
      .test('fileSize', 'File size must be less than 20MB', (value) => {
        if (!value) return false;
        return (value as File).size <= 20 * 1024 * 1024;
      })
      .test('fileType', 'Only PDF, Excel, and image files are allowed', (value) => {
        if (!value) return false;
        const file = value as File;
        const allowedTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
          'image/jpeg',
          'image/png'
        ];
        return allowedTypes.includes(file.type);
      }),
    otherwise: (schema) => schema.nullable()
  }),
  
  month: Yup.number().when('frequency', {
    is: (frequency: string) => ['monthly', 'quarterly', 'half_yearly'].includes(frequency),
    then: (schema) => schema.required('Month is required').min(1, 'Invalid month').max(12, 'Invalid month'),
  }),
});

const ReturnTrackerAddForm = () => {
  const navigate = useNavigate();
  const [actOptions, setActOptions] = useState<SelectOption[]>([]);
  const [returnOptions, setReturnOptions] = useState<SelectOption[]>([]);
  const [companyGroups, setCompanyGroups] = useState<SelectOption[]>([]);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [allBranches, setAllBranches] = useState<BranchOption[]>([]);
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [states, setStates] = useState<SelectOption[]>([]);
  const [districts, setDistricts] = useState<SelectOption[]>([]);
  const [locations, setLocations] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [superadminReturns, setSuperadminReturns] = useState<SuperadminReturn[]>([]);
  const [currentGroupId, setCurrentGroupId] = useState<number>(0);
  const [allIndianStates, setAllIndianStates] = useState<SelectOption[]>([]);

  const showNotification = (
    type: 'success' | 'info' | 'error' | 'warning',
    message: string
  ) => {
    toast.push(
      <Notification
        title={type.charAt(0).toUpperCase() + type.slice(1)}
        type={type}
      >
        {message}
      </Notification>
    );
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load all Indian states first
        const statesResponse = await httpClient.get(endpoints.common.state());
        const allStates = statesResponse.data.map((state: any) => ({
          label: state.name,
          value: String(state.id),
        }));
        setAllIndianStates(allStates);
        setStates(allStates);

        // Load company groups
        const groupsResponse = await httpClient.get(endpoints.companyGroup.getAll());
        const companyGroupOptions = groupsResponse.data.data.map((group: any) => ({
          label: group.name,
          value: String(group.id),
        }));
        setCompanyGroups(companyGroupOptions);

        if (groupsResponse.data.data.length > 0) {
          const firstGroupId = groupsResponse.data.data[0].id;
          await loadCompanies(String(firstGroupId));
        }

        // Load superadmin returns for act names and return names
        const returnsResponse = await httpClient.get(endpoints.return.getList());
        setSuperadminReturns(returnsResponse.data.data);

        // Prepare act options based on applicable field
        const uniqueActs = new Map<string, boolean>();
        const actOptionsList: SelectOption[] = [];

        returnsResponse.data.data.forEach((ret: SuperadminReturn) => {
            if (!ret.is_active) return;

          if (ret.applicable === 'CENTRAL') {
            if (!uniqueActs.has(ret.act_name)) {
              actOptionsList.push({
                label: `${ret.act_name} (Central)`,
                value: `${ret.act_name}||CENTRAL`,
              });
              uniqueActs.set(ret.act_name, true);
            }
          } else if (ret.applicable === 'ALL_STATES') {
            allStates.forEach(state => {
              actOptionsList.push({
                label: `${ret.act_name} (${state.label})`,
                value: `${ret.act_name}||${state.value}`,
              });
            });
          } else if (ret.applicable === 'STATE') {
            actOptionsList.push({
              label: `${ret.act_name} (${ret.State.name})`,
              value: `${ret.act_name}||${ret.state_id}`,
            });
          }
        });
        actOptionsList.sort((a, b) => a.label.localeCompare(b.label));
        setActOptions(actOptionsList);
      } catch (error) {
        console.error('Failed to load initial data:', error);
        showNotification('error', 'Failed to load initial data');
      }
    };

    loadInitialData();
  }, []);

  const loadCompanies = async (groupId: string) => {
    try {
      const response = await httpClient.get(endpoints.company.getAll(), {
        params: { 'group_id[]': groupId },
      });
      setCompanies(
        response.data.data.map((company: any) => ({
          label: company.name,
          value: String(company.id),
          group_id: company.group_id,
        }))
      );
      setCurrentGroupId(Number(groupId));
    } catch (error) {
      console.error('Failed to load companies:', error);
      showNotification('error', 'Failed to load companies');
    }
  };

  const loadBranches = async (companyId: string) => {
    try {
      const response = await httpClient.get(endpoints.branch.getAllBranch(), {
        params: { 'company_id[]': companyId },
      });
      const branchesData = response.data.data.map((branch: any) => ({
        label: branch.name
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' '),
        value: String(branch.id),
        location_id: branch.location_id,
      }));
      setAllBranches(branchesData);
      setBranches([]); // Reset branches when company changes
    } catch (error) {
      console.error('Failed to load branches:', error);
      showNotification('error', 'Failed to load branches');
    }
  };

  const loadDistricts = async (stateId: string) => {
    try {
      const response = await httpClient.get(endpoints.common.district(), {
        params: { 'state_id[]': stateId },
      });
      setDistricts(
        response.data.map((district: any) => ({
          label: district.name,
          value: String(district.id),
        }))
      );
    } catch (error) {
      console.error('Failed to load districts:', error);
      showNotification('error', 'Failed to load districts');
    }
  };

  const loadLocations = async (districtId: string) => {
    try {
      const response = await httpClient.get(endpoints.common.location(), {
        params: { 'district_id[]': districtId },
      });
      setLocations(
        response.data.map((location: any) => ({
          label: location.name,
          value: String(location.id),
        }))
      );
    } catch (error) {
      console.error('Failed to load locations:', error);
      showNotification('error', 'Failed to load locations');
    }
  };

  const getApplicableForAct = (actName: string, stateId: string) => {
    if (stateId === 'CENTRAL') return 'CENTRAL';
    
    const returnData = superadminReturns.find(
      ret => ret.act_name === actName && 
             (ret.applicable === 'ALL_STATES' || 
              (ret.applicable === 'STATE' && ret.state_id === Number(stateId)))
    );
    
    return returnData?.applicable || '';
  };

  const loadReturnOptions = (actName: string, stateId: string) => {
    try {
      let filteredReturns: SuperadminReturn[] = [];
      
      if (stateId === 'CENTRAL') {
        filteredReturns = superadminReturns.filter(
          ret => ret.act_name === actName && ret.applicable === 'CENTRAL'
        );
      } else {
        filteredReturns = superadminReturns.filter(
          ret => ret.act_name === actName && 
                 (ret.applicable === 'ALL_STATES' || 
                  (ret.applicable === 'STATE' && ret.state_id === Number(stateId)))
        );
      }

      setReturnOptions(
        filteredReturns.map(ret => ({
          label: ret.return_name,
          value: ret.return_name,
        }))
      );
    } catch (error) {
      console.error('Failed to load return options:', error);
      showNotification('error', 'Failed to load return options');
    }
  };

  const getFrequencyForReturn = (actName: string, returnName: string, stateId: string) => {
    let returnData: SuperadminReturn | undefined;
    
    if (stateId === 'CENTRAL') {
      returnData = superadminReturns.find(
        ret => ret.act_name === actName && 
               ret.return_name === returnName && 
               ret.applicable === 'CENTRAL'
      );
    } else {
      returnData = superadminReturns.find(
        ret => ret.act_name === actName && 
               ret.return_name === returnName && 
               (ret.applicable === 'ALL_STATES' || 
                (ret.applicable === 'STATE' && ret.state_id === Number(stateId)))
      );
    }
    
    return returnData?.frequency || '';
  };

  const handleSubmit = async (values: ReturnFormValues) => {
    try {
      setLoading(true);

      // Convert file to base64 only if applicable
      let returnCopyBase64 = '';
      if (values.return_copy && values.return_submission === 'applicable') {
        returnCopyBase64 = await new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => {
    resolve(reader.result as string);  // ✅ Send the full data URI
  };
  reader.onerror = (error) => {
    reject(error);
  };
  reader.readAsDataURL(values.return_copy as Blob);
});
      }

      // Split act_name to remove state ID
      const [actName] = values.act_name.split('||');

      // Prepare the submission data - set null for unused fields based on return_submission
      const submissionData = {
        ...values,
        act_name: actName,
        company_group_id: currentGroupId,
        company_id: Number(values.company_id),
        state_id: values.state_id ? Number(values.state_id) : null,
        district_id: values.district_id ? Number(values.district_id) : null,
        location_id: values.location_id ? Number(values.location_id) : null,
        branch_id: values.branch_id ? Number(values.branch_id) : null,
        year: Number(values.year),
        month: values.month ? Number(values.month) : null,
        return_copy: values.return_submission === 'applicable' ? returnCopyBase64 : null,
        submission_date: values.return_submission === 'applicable' && values.submission_date 
          ? new Date(values.submission_date).toISOString() 
          : null,
        delay_reason: values.return_submission === 'applicable' ? values.delay_reason : null,
        not_applicable_reason: values.return_submission === 'not_applicable' 
          ? values.not_applicable_reason 
          : null
      };

      // Make the API call
      const response = await httpClient.post(
        endpoints.return.create(),
        submissionData
      );

      if (response) {
        showNotification('success', 'Return created successfully');
        navigate('/return-tracker');
      }
    } catch (error: any) {
      console.error('Failed to create return:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create return';
      showNotification('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const initialValues: ReturnFormValues = {
    company_id: 0,
    act_name: '',
    return_name: '',
    state_id: null,
    frequency: '',
    year: new Date().getFullYear(),
    return_submission: '',
    submission_date: null,
  };
 
  // Generate year options (current year and past 4 years)
  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return {
      label: String(year),
      value: year,
    };
  });

  const formatFrequencyDisplay = (frequency: string) => {
    if (!frequency) return '--';
    
    const formatMap: Record<string, string> = {
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      half_yearly: 'Half Yearly',
      yearly: 'Yearly',
      bi_annual: 'Bi-Annual'
    };
    
    return formatMap[frequency] || frequency;
  };

  return (
    <div className="w-full mx-auto p-2 bg-white rounded-lg">
      <div className="flex gap-2 items-center mb-3">
        <Button
          size="sm"
          variant="plain"
          icon={<IoArrowBack className="text-gray-500 hover:text-gray-700" />}
          onClick={() => navigate(-1)}
        />
        <h3 className="text-2xl font-semibold">Add Return Details</h3>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnBlur={true}
        validateOnChange={true}
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          setFieldTouched,
          handleSubmit,
          isValid,
          isSubmitting,
        }) => {
          // Parse act_name and state_id from values.act_name
          const [selectedActName, selectedStateId] = values.act_name ? values.act_name.split('||') : ['', ''];
          
          // Get applicable value for the selected act
          const applicableValue = selectedActName ? getApplicableForAct(selectedActName, selectedStateId) : '';
          
          const superadminReturn = superadminReturns.find(
            ret =>
              ret.act_name === selectedActName &&
              ret.return_name === values.return_name &&
              (ret.applicable === 'CENTRAL' || 
               ret.applicable === 'ALL_STATES' || 
               (ret.applicable === 'STATE' && ret.state_id === Number(selectedStateId)))
          );

          const isDelayed = (() => {
            if (!superadminReturn || !values.submission_date || values.return_submission !== 'applicable') {
              return false;
            }

            const dueDates = superadminReturn.due_dates;
            if (!dueDates) return false;

            const submissionDate = new Date(values.submission_date);
            let dueDate: Date | null = null;

            switch (values.frequency) {
              case 'monthly':
                dueDate = new Date(dueDates.first_due_date);
                break;
              case 'quarterly':
                if (values.month) {
                  if (values.month >= 1 && values.month <= 3) {
                    dueDate = new Date(dueDates.first_due_date);
                  } else if (values.month >= 4 && values.month <= 6) {
                    dueDate = new Date(dueDates.second_due_date);
                  } else if (values.month >= 7 && values.month <= 9) {
                    dueDate = new Date(dueDates.third_due_date);
                  } else {
                    dueDate = new Date(dueDates.last_due_date);
                  }
                }
                break;
              case 'half_yearly':
                if (values.month && values.month <= 6) {
                  dueDate = new Date(dueDates.first_due_date);
                } else {
                  dueDate = new Date(dueDates.last_due_date);
                }
                break;
              case 'yearly':
                dueDate = new Date(dueDates.first_due_date);
                break;
              case 'bi_annual':
                dueDate = new Date(dueDates.bi_annual_due_date);
                break;
            }

            return dueDate && submissionDate > dueDate;
          })();

          useEffect(() => {
            if (values.location_id && allBranches.length > 0) {
              const filteredBranches = allBranches.filter(
                branch => Number(branch.location_id) === Number(values.location_id)
              );
              setBranches(filteredBranches);
              
              // Reset branch selection if current selection is not in filtered list
              if (values.branch_id && !filteredBranches.some(b => b.value === String(values.branch_id))) {
                setFieldValue('branch_id', '');
              }
            } else {
              setBranches([]);
              setFieldValue('branch_id', '');
            }
          }, [values.location_id, allBranches]);

          useEffect(() => {
            if (selectedStateId && selectedStateId !== 'CENTRAL') {
              loadDistricts(selectedStateId);
              // Clear existing districts and locations when state changes
              setDistricts([]);
              setFieldValue('district_id', '');
              setLocations([]);
              setFieldValue('location_id', '');
            }
          }, [selectedStateId]);

          return (
            <Form>
              <div className="space-y-6">
                {/* 1st Row: Company && Act Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Company <span className="text-red-500">*</span>
                    </label>
                    <Field name="company_id">
                      {({ field }: any) => (
                        <OutlinedSelect
                          label="Select Company"
                          options={companies}
                          value={companies.find(
                            (option) => Number(option.value) === values.company_id
                          )}
                          onChange={(selectedOption: CompanyOption | null) => {
                            if (selectedOption) {
                              setFieldValue('company_id', Number(selectedOption.value));
                              setFieldValue('company_group_id', selectedOption.group_id);
                              setFieldValue('branch_id', '');
                              loadBranches(selectedOption.value);
                            }
                          }}
                          onBlur={() => setFieldTouched('company_id', true)}
                        />
                      )}
                    </Field>
                    {errors.company_id && touched.company_id && (
                      <p className="text-red-500 text-xs">{errors.company_id}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Act Name <span className="text-red-500">*</span>
                    </label>
                    <Field name="act_name">
                      {({ field }: any) => (
                        <OutlinedSelect
                          label="Select Act Name"
                          options={actOptions}
                          value={actOptions.find(
                            (option) => option.value === values.act_name
                          )}
                          onChange={(selectedOption: SelectOption | null) => {
                            if (selectedOption) {
                              const [actName, stateId] = selectedOption.value.split('||');
                              setFieldValue('act_name', selectedOption.value);
                              setFieldValue('return_name', '');
                              setFieldValue('frequency', '');
                              setFieldValue('state_id', stateId === 'CENTRAL' ? undefined : Number(stateId));
                              setReturnOptions([]);
                              loadReturnOptions(actName, stateId);
                            } else {
                              setFieldValue('act_name', '');
                              setFieldValue('return_name', '');
                              setFieldValue('frequency', '');
                              setFieldValue('state_id', undefined);
                              setReturnOptions([]);
                            }
                          }}
                          onBlur={() => setFieldTouched('act_name', true)}
                        />
                      )}
                    </Field>
                    {errors.act_name && touched.act_name && (
                      <p className="text-red-500 text-xs">{errors.act_name}</p>
                    )}
                  </div>
                </div>

                {/* 2nd Row: Applicable && Return Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Applicable
                    </label>
                    <OutlinedInput
                      label="Applicable"
                      value={
                        applicableValue === 'CENTRAL' 
                          ? 'CENTRAL' 
                          : applicableValue === 'STATE'
                            ? 'STATE'
                            : applicableValue === 'ALL_STATES'
                              ? 'ALL STATES'
                              : '--'
                      }
                      onChange={() => {}}
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Return Name <span className="text-red-500">*</span>
                    </label>
                    <Field name="return_name">
                      {({ field }: any) => (
                        <OutlinedSelect
                          label="Select Return Name"
                          options={returnOptions}
                          value={returnOptions.find(
                            (option) => option.value === values.return_name
                          )}
                          onChange={(selectedOption: SelectOption | null) => {
                            setFieldValue(
                              'return_name',
                              selectedOption ? selectedOption.value : ''
                            );
                            if (selectedOption && selectedActName && selectedStateId) {
                              const frequency = getFrequencyForReturn(
                                selectedActName,
                                selectedOption.value,
                                selectedStateId
                              );
                              setFieldValue('frequency', frequency);
                            }
                          }}
                          onBlur={() => setFieldTouched('return_name', true)}
                        />
                      )}
                    </Field>
                    {errors.return_name && touched.return_name && (
                      <p className="text-red-500 text-xs">{errors.return_name}</p>
                    )}
                  </div>
                </div>

                {/* 3rd Row: State (only shown for STATE applicable) */}
                {applicableValue === 'STATE' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        State <span className="text-red-500">*</span>
                      </label>
                      <OutlinedInput
                        label="State"
                        value={
                          states.find(s => s.value === selectedStateId)?.label || '--'
                        }
                        onChange={() => {}}
                        disabled
                      />
                      <Field name="state_id" type="hidden" />
                    </div>
                    <div></div>
                  </div>
                )}

                {/* 4th Row: District && Location (only shown for STATE applicable) */}
                {applicableValue === 'STATE' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        District <span className="text-red-500">*</span>
                      </label>
                      <Field name="district_id">
                        {({ field }: any) => (
                          <OutlinedSelect
                            label="Select District"
                            options={districts}
                            value={districts.find(
                              (option) => Number(option.value) === values.district_id
                            )}
                            onChange={(selectedOption: SelectOption | null) => {
                              setFieldValue(
                                'district_id',
                                selectedOption ? selectedOption.value : ''
                              );
                              setFieldValue('location_id', '');
                              setLocations([]);
                              if (selectedOption) {
                                loadLocations(selectedOption.value);
                              }
                            }}
                            onBlur={() => setFieldTouched('district_id', true)}
                          />
                        )}
                      </Field>
                      {errors.district_id && touched.district_id && (
                        <p className="text-red-500 text-xs">{errors.district_id}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <Field name="location_id">
                        {({ field }: any) => (
                          <OutlinedSelect
                            label="Select Location"
                            options={locations}
                            value={locations.find(
                              (option) => Number(option.value) === values.location_id
                            )}
                            onChange={(selectedOption: SelectOption | null) => {
                              setFieldValue(
                                'location_id',
                                selectedOption ? selectedOption.value : ''
                              );
                              setFieldValue('branch_id', ''); // Clear branch when location changes
                              setBranches([]); // Clear branches when location changes
                            }}
                            onBlur={() => setFieldTouched('location_id', true)}
                          />
                        )}
                      </Field>
                      {errors.location_id && touched.location_id && (
                        <p className="text-red-500 text-xs">{errors.location_id}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* 5th Row: Branch && Frequency */}
                <div className="grid grid-cols-2 gap-4">
                  {applicableValue === 'STATE' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Branch <span className="text-red-500">*</span>
                      </label>
                      <Field name="branch_id">
                        {({ field }: any) => (
                          <div>
                            <OutlinedSelect
                              label="Select Branch"
                              options={branches}
                              value={branches.find(
                                (option) => Number(option.value) === values.branch_id
                              )}
                              onChange={(selectedOption: SelectOption | null) => {
                                setFieldValue(
                                  'branch_id',
                                  selectedOption ? selectedOption.value : ''
                                );
                              }}
                              onBlur={() => setFieldTouched('branch_id', true)}
                            />
                            {branches.length === 0 && (
                              <p className="text-xs text-gray-500 mt-1">
                                {!values.location_id 
                                  ? "Please select a location first" 
                                  : "No branches available for this location"}
                              </p>
                            )}
                          </div>
                        )}
                      </Field>
                      {errors.branch_id && touched.branch_id && (
                        <p className="text-red-500 text-xs">{errors.branch_id}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Frequency <span className="text-red-500">*</span>
                    </label>
                    <OutlinedInput
                      label="Frequency"
                      value={formatFrequencyDisplay(values.frequency)}
                      onChange={() => {}}
                      disabled
                    />
                  </div>
                </div>

                {/* 6th Row: Year && (Month if applicable) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Year <span className="text-red-500">*</span>
                    </label>
                    <Field name="year">
                      {({ field }: any) => (
                        <OutlinedSelect
                          label="Select Year"
                          options={yearOptions}
                          value={yearOptions.find(
                            (option) => option.value === values.year
                          )}
                          onChange={(selectedOption: any) => {
                            setFieldValue(
                              'year',
                              selectedOption ? selectedOption.value : ''
                            );
                          }}
                          onBlur={() => setFieldTouched('year', true)}
                        />
                      )}
                    </Field>
                    {errors.year && touched.year && (
                      <p className="text-red-500 text-xs">{errors.year}</p>
                    )}
                  </div>

                  {['monthly', 'quarterly', 'half_yearly'].includes(values.frequency) && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Month <span className="text-red-500">*</span>
                      </label>
                      <Field name="month">
                        {({ field }: any) => (
                          <OutlinedInput
                            label="Enter Month (1-12)"
                            value={values.month ? String(values.month) : ''}
                            onChange={(value: string) => {
                              const monthNum = value ? parseInt(value) : undefined;
                              setFieldValue('month', monthNum);
                            }}
                            onBlur={() => setFieldTouched('month', true)}
                          />
                        )}
                      </Field>
                      {errors.month && touched.month && (
                        <p className="text-red-500 text-xs">{errors.month}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* 7th Row: Return File Submission */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Return File Submission <span className="text-red-500">*</span>
                    </label>
                    <Field name="return_submission">
                      {({ field }: any) => (
                        <OutlinedSelect
                          label="Select Return File Submission"
                          options={[
                            { value: 'applicable', label: 'Applicable' },
                            { value: 'not_applicable', label: 'Not Applicable' },
                          ]}
                          value={
                            values.return_submission
                              ? {
                                  value: values.return_submission,
                                  label:
                                    values.return_submission === 'applicable'
                                      ? 'Applicable'
                                      : 'Not Applicable',
                                }
                              : null
                          }
                          onChange={(selectedOption: SelectOption | null) => {
                            setFieldValue(
                              'return_submission',
                              selectedOption ? selectedOption.value : ''
                            );
                            if (selectedOption?.value === 'not_applicable') {
                              setFieldValue('return_copy', null);
                              setFieldValue('submission_date', '');
                              setFieldValue('delay_reason', '');
                            }
                          }}
                          onBlur={() => setFieldTouched('return_submission', true)}
                        />
                      )}
                    </Field>
                    {errors.return_submission && touched.return_submission && (
                      <p className="text-red-500 text-xs">{errors.return_submission}</p>
                    )}
                  </div>

                  {values.return_submission === 'applicable' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Submission Date <span className="text-red-500">*</span>
                      </label>
                      <Field name="submission_date">
                        {({ field }: any) => (
                          <DatePicker
                            placeholder="Select submission date"
                            value={values.submission_date ? new Date(values.submission_date) : null}
                            onChange={(date: Date | null) => {
                              setFieldValue(
                                'submission_date',
                                date ? date.toISOString() : ''
                              );
                            }}
                            onBlur={() => setFieldTouched('submission_date', true)}
                          />
                        )}
                      </Field>
                      {errors.submission_date && touched.submission_date && (
                        <p className="text-red-500 text-xs">{errors.submission_date}</p>
                      )}
                    </div>
                  )}

                  {values.return_submission === 'not_applicable' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Not Applicable Reason <span className="text-red-500">*</span>
                      </label>
                      <Field name="not_applicable_reason">
                        {({ field }: any) => (
                          <OutlinedInput
                            label="Enter Not Applicable Reason"
                            value={values.not_applicable_reason || ''}
                            onChange={(value: string) => {
                              setFieldValue('not_applicable_reason', value);
                            }}
                            onBlur={() => setFieldTouched('not_applicable_reason', true)}
                          />
                        )}
                      </Field>
                      {errors.not_applicable_reason && touched.not_applicable_reason && (
                        <p className="text-red-500 text-xs">{errors.not_applicable_reason}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* 8th Row: Conditional fields for applicable returns */}
                {values.return_submission === 'applicable' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Return Copy (PDF/Zip/Image, Max 20MB) <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="file"
                          size="md"
                          className="w-full"
                          accept=".pdf,.jpg,.zip,.jpeg,.png"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFieldValue('return_copy', file);
                              setFieldTouched('return_copy', true);
                            } else {
                              setFieldValue('return_copy', null);
                            }
                          }}
                          onBlur={() => setFieldTouched('return_copy', true)}
                        />
                        {errors.return_copy && touched.return_copy && (
                          <p className="text-red-500 text-xs">{errors.return_copy}</p>
                        )}
                      </div>
                      {isDelayed && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Delay Reason <span className="text-red-500">*</span>
                          </label>
                          <Field name="delay_reason">
                            {({ field }: any) => (
                              <OutlinedInput
                                label="Enter Delay Reason"
                                value={values.delay_reason || ''}
                                onChange={(value: string) => {
                                  setFieldValue('delay_reason', value);
                                }}
                                onBlur={() => setFieldTouched('delay_reason', true)}
                              />
                            )}
                          </Field>
                          {errors.delay_reason && touched.delay_reason && (
                            <p className="text-red-500 text-xs">{errors.delay_reason}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <div className="flex justify-end gap-2 pt-8">
                  <Button
                    type="button"
                    variant="plain"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="solid"
                    loading={loading || isSubmitting}
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ReturnTrackerAddForm;