// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Button, Notification, toast } from '@/components/ui';
// import { IoArrowBack } from 'react-icons/io5';
// import OutlinedSelect from '@/components/ui/Outlined';
// import OutlinedInput from '@/components/ui/OutlinedInput';
// import { DatePicker } from '@/components/ui/DatePicker';
// import httpClient from '@/api/http-client';
// import { endpoints } from '@/api/endpoint';

// interface FormData {
//   group_id: number;
//   country: string;
//   function: string;
//   applicable: string;
//   state_id?: number | null;
//   legislation_act: string;
//   compliance_categorization: string;
//   penalty_type: string;
//   penalty_description: string;
//   compliance_header: string;
//   compliance_description: string;
//   compliance_applicability: string;
//   compliance_reference: string;
//   compliance_type: string;
//   compliance_frequency: string;
//   criticality: string;
//   due_date_frequency: string;
//   due_dates: {
//     first_due_date?: string;
//     second_due_date?: string;
//     third_due_date?: string;
//     last_due_date?: string;
//   };
//   is_active?: boolean;
// }

// interface SelectOption {
//   value: string;
//   label: string;
// }

// interface StateOption {
//   value: number;
//   label: string;
// }

// const AssignCustomFormPage = () => {
//   const navigate = useNavigate();
//       const location = useLocation();

//   const [formData, setFormData] = useState<FormData>({
//     group_id: 0,
//     country: 'India',
//     function: '',
//     applicable: 'central',
//     state_id: null,
//     legislation_act: '',
//     compliance_categorization: '',
//     penalty_type: '',
//     penalty_description: '',
//     compliance_header: '',
//     compliance_description: '',
//     compliance_applicability: '',
//     compliance_reference: '',
//     compliance_type: '',
//     compliance_frequency: 'monthly',
//     criticality: 'medium',
//     due_date_frequency: 'monthly',
//     due_dates: {},
//     is_active: true
//   });
//       const [isLoading, setIsLoading] = useState(true);

//   const [loading, setLoading] = useState(false);
//   const [showStateField, setShowStateField] = useState(false);
//   const [showDateFields, setShowDateFields] = useState(false);
//   const [dateFieldsState, setDateFieldsState] = useState({
//     isSecondDateEnabled: false,
//     isThirdDateEnabled: false,
//     isLastDateEnabled: false,
//   });
//   const [states, setStates] = useState<StateOption[]>([]);
//      const [companyGroupName, setCompanyGroupName] = useState('');
//     const [companyGroupId, setCompanyGroupId] = useState('');

//   // Options for select fields
//   const applicableOptions: SelectOption[] = [
//     { value: 'central', label: 'Central' },
//     { value: 'state', label: 'State' },
//   ];

//   const frequencyOptions: SelectOption[] = [
//     { value: 'monthly', label: 'Monthly' },
//     { value: 'quarterly', label: 'Quarterly' },
//     { value: 'yearly', label: 'Yearly' },
//     { value: 'half_yearly', label: 'Half Yearly' },
//   ];

//   const criticalityOptions: SelectOption[] = [
//     { value: 'low', label: 'Low' },
//     { value: 'medium', label: 'Medium' },
//     { value: 'high', label: 'High' },
//   ];

//   const dueDateFrequencyOptions: SelectOption[] = [
//     { value: 'monthly', label: 'Monthly' },
//     { value: 'yearly', label: 'Yearly' },
//     { value: 'quarterly', label: 'Quarterly' },
//     { value: 'half_yearly', label: 'Half Yearly' },
//     { value: 'na', label: 'NA' },
//     { value: 'one', label: 'One' },
//   ];

//   // Fetch states data
//   useEffect(() => {
//     const fetchStates = async () => {
//       try {
//         const response = await httpClient.get(endpoints.common.state());
//         setStates(response.data.map((state: any) => ({
//           value: state.id,
//           label: state.name
//         })));
//       } catch (error) {
//         console.error('Error fetching states:', error);
//         toast.push(
//           <Notification title="Error" type="error">
//             Failed to load states
//           </Notification>
//         );
//       }
//     };

//     fetchStates();
//   }, []);

//   const showNotification = (
//           type: 'success' | 'info' | 'error' | 'warning',
//           message: string,
//       ) => {
//           toast.push(
//               <Notification
//                   title={type.charAt(0).toUpperCase() + type.slice(1)}
//                   type={type}
//               >
//                   {message}
//               </Notification>,
//           )
//       }

//   const loadCompanyGroups = async () => {
//   try {
//     const { data } = await httpClient.get(endpoints.companyGroup.getAll(), {
//       params: { ignorePlatform: true },
//     });

//     if (data.data && data.data.length > 0) {
//       const defaultGroup = data.data[0];
//       setCompanyGroupName(defaultGroup.name);
//       setCompanyGroupId(String(defaultGroup.id));

//       // Update the formData with the fetched group_id
//       setFormData(prev => ({
//         ...prev,
//         group_id: defaultGroup.id  // This is the key change
//       }));
//     }
//   } catch (error) {
//     console.error('Error loading company groups:', error);
//   } finally {
//     setIsLoading(false);
//   }
// };

//        useEffect(() => {
//           loadCompanyGroups();
//         }, []);

//   // Handle applicable change to show/hide state field
//   useEffect(() => {
//     setShowStateField(formData.applicable === 'state');
//     if (formData.applicable !== 'state') {
//       setFormData(prev => ({ ...prev, state_id: null }));
//     }
//   }, [formData.applicable]);

//   // Handle due date frequency change
//   useEffect(() => {
//     const frequency = formData.due_date_frequency.toLowerCase();
//     const shouldShowDates = !['na', 'one'].includes(frequency);
//     setShowDateFields(shouldShowDates);

//     if (shouldShowDates) {
//       switch (frequency) {
//         case 'monthly':
//         case 'yearly':
//           setDateFieldsState({
//             isSecondDateEnabled: false,
//             isThirdDateEnabled: false,
//             isLastDateEnabled: false
//           });
//           break;
//         case 'half_yearly':
//           setDateFieldsState({
//             isSecondDateEnabled: false,
//             isThirdDateEnabled: false,
//             isLastDateEnabled: true
//           });
//           break;
//         case 'quarterly':
//           setDateFieldsState({
//             isSecondDateEnabled: true,
//             isThirdDateEnabled: true,
//             isLastDateEnabled: true
//           });
//           break;
//         default:
//           setDateFieldsState({
//             isSecondDateEnabled: false,
//             isThirdDateEnabled: false,
//             isLastDateEnabled: false
//           });
//       }
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         due_dates: {}
//       }));
//     }
//   }, [formData.due_date_frequency]);

//   const handleInputChange = (field: string, value: any) => {
//     if (field.includes('_due_date')) {
//       const dateValue = value ? value.toISOString().split('T')[0] : '';
//       setFormData(prev => ({
//         ...prev,
//         due_dates: {
//           ...prev.due_dates,
//           [field]: dateValue
//         }
//       }));
//       return;
//     }

//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);

//       // Prepare payload
//       const payload = {
//         ...formData,
//         state_id: formData.applicable === 'state' ? formData.state_id : null
//       };

//       // Make API call
//       const response = await httpClient.post(
//         endpoints.compliance.createCustomChecklist(),
//         payload
//       );

//       toast.push(
//         <Notification title="Success" type="success">
//           Custom checklist created successfully
//         </Notification>
//       );
//       navigate(-1);
//     } catch (error: any) {
//       console.error('Error creating custom checklist:', error);
//       const errorMessage = error.response?.data?.message || 'Failed to create custom checklist';
//       toast.push(
//         <Notification title="Error" type="error">
//           {errorMessage}
//         </Notification>
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-2 bg-white rounded-lg">
//       <div className="flex gap-2 items-center mb-3">
//         <Button
//           size="sm"
//           variant="plain"
//           icon={<IoArrowBack className="text-[#72828e] hover:text-[#5d6169]" />}
//           onClick={() => navigate(-1)}
//         />
//         <h3 className="text-2xl font-semibold mb-2">Add Custom Checklist</h3>
//       </div>
//       <div className="space-y-6">
//         {/* Group ID */}
//         <div>
//           <p className="mb-2">Company Group</p>
//           <OutlinedInput
//                         label="Company Group"
//                         value={companyGroupName}
//                         onChange={() => {}}

//                     />
//         </div>

//         {/* Country and Function */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <p className="mb-2">Country</p>
//             <OutlinedInput
//               label="Country"
//               value={formData.country}
//               onChange={(value: string) => {
//                 setFormData(prev => ({ ...prev, country: value }));
//               }}
//             />
//           </div>
//           <div>
//             <p className="mb-2">Function</p>
//             <OutlinedInput
//               label="Function"
//               value={formData.function}
//               onChange={(value: string) => {
//                 setFormData(prev => ({ ...prev, function: value }));
//               }}
//             />
//           </div>
//         </div>

//         {/* Applicable and State (conditionally shown) */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <p className="mb-2">Applicable</p>
//             <OutlinedSelect
//               label="Select Applicable"
//               options={applicableOptions}
//               value={applicableOptions.find(option => option.value === formData.applicable)}
//               onChange={(selectedOption: SelectOption | null) => {
//                 setFormData(prev => ({
//                   ...prev,
//                   applicable: selectedOption?.value || 'central',
//                 }));
//               }}
//             />
//           </div>
//           {showStateField && (
//             <div>
//               <p className="mb-2">State</p>
//               <OutlinedSelect
//                 label="Select State"
//                 options={states}
//                 value={states.find(option => option.value === formData.state_id)}
//                 onChange={(selectedOption: StateOption | null) => {
//                   setFormData(prev => ({
//                     ...prev,
//                     state_id: selectedOption?.value || null,
//                   }));
//                 }}
//               />
//             </div>
//           )}
//         </div>

//         {/* Legislation Act and Compliance Categorization */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <p className="mb-2">Legislation Act</p>
//             <OutlinedInput
//               label="Legislation Act"
//               value={formData.legislation_act}
//               onChange={(value: string) => {
//                 setFormData(prev => ({ ...prev, legislation_act: value }));
//               }}
//             />
//           </div>
//           <div>
//             <p className="mb-2">Compliance Categorization</p>
//             <OutlinedInput
//               label="Compliance Categorization"
//               value={formData.compliance_categorization}
//               onChange={(value: string) => {
//                 setFormData(prev => ({ ...prev, compliance_categorization: value }));
//               }}
//             />
//           </div>
//         </div>

//         {/* Penalty Type and Description */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <p className="mb-2">Penalty Type</p>
//             <OutlinedInput
//               label="Penalty Type"
//               value={formData.penalty_type}
//               onChange={(value: string) => {
//                 setFormData(prev => ({ ...prev, penalty_type: value }));
//               }}
//             />
//           </div>
//           <div>
//             <p className="mb-2">Penalty Description</p>
//             <OutlinedInput
//               label="Penalty Description"
//               value={formData.penalty_description}
//               onChange={(value: string) => {
//                 setFormData(prev => ({ ...prev, penalty_description: value }));
//               }}
//             />
//           </div>
//         </div>

//         {/* Compliance Header */}
//         <div>
//           <p className="mb-2">Compliance Header</p>
//           <OutlinedInput
//             label="Compliance Header"
//             value={formData.compliance_header}
//             onChange={(value: string) => {
//               setFormData(prev => ({ ...prev, compliance_header: value }));
//             }}
//           />
//         </div>

//         {/* Compliance Description */}
//         <div>
//           <p className="mb-2">Compliance Description</p>
//           <OutlinedInput
//             label="Compliance Description"
//             value={formData.compliance_description}
//             onChange={(value: string) => {
//               setFormData(prev => ({ ...prev, compliance_description: value }));
//             }}
//             textarea={true}
//           />
//         </div>

//         {/* Compliance Applicability and Reference */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <p className="mb-2">Compliance Applicability</p>
//             <OutlinedInput
//               label="Compliance Applicability"
//               value={formData.compliance_applicability}
//               onChange={(value: string) => {
//                 setFormData(prev => ({ ...prev, compliance_applicability: value }));
//               }}
//             />
//           </div>
//           <div>
//             <p className="mb-2">Compliance Reference</p>
//             <OutlinedInput
//               label="Compliance Reference"
//               value={formData.compliance_reference}
//               onChange={(value: string) => {
//                 setFormData(prev => ({ ...prev, compliance_reference: value }));
//               }}
//             />
//           </div>
//         </div>

//         {/* Compliance Type and Frequency */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <p className="mb-2">Compliance Type</p>
//             <OutlinedInput
//               label="Compliance Type"
//               value={formData.compliance_type}
//               onChange={(value: string) => {
//                 setFormData(prev => ({ ...prev, compliance_type: value }));
//               }}
//             />
//           </div>
//           <div>
//             <p className="mb-2">Compliance Frequency</p>
//             <OutlinedSelect
//               label="Select Frequency"
//               options={frequencyOptions}
//               value={frequencyOptions.find(option => option.value === formData.compliance_frequency)}
//               onChange={(selectedOption: SelectOption | null) => {
//                 setFormData(prev => ({
//                   ...prev,
//                   compliance_frequency: selectedOption?.value || 'monthly',
//                 }));
//               }}
//             />
//           </div>
//         </div>

//         {/* Criticality and Due Date Frequency */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <p className="mb-2">Criticality</p>
//             <OutlinedSelect
//               label="Select Criticality"
//               options={criticalityOptions}
//               value={criticalityOptions.find(option => option.value === formData.criticality)}
//               onChange={(selectedOption: SelectOption | null) => {
//                 setFormData(prev => ({
//                   ...prev,
//                   criticality: selectedOption?.value || 'medium',
//                 }));
//               }}
//             />
//           </div>
//           <div>
//             <p className="mb-2">Due Date Frequency</p>
//             <OutlinedSelect
//               label="Select Due Date Frequency"
//               options={dueDateFrequencyOptions}
//               value={dueDateFrequencyOptions.find(option => option.value === formData.due_date_frequency)}
//               onChange={(selectedOption: SelectOption | null) => {
//                 setFormData(prev => ({
//                   ...prev,
//                   due_date_frequency: selectedOption?.value || 'monthly',
//                 }));
//               }}
//             />
//           </div>
//         </div>

//         {/* Date fields - conditionally shown */}
//         {showDateFields && (
//           <>
//             {/* First Due Date */}
//             <div>
//               <p className="mb-2">First Due Date</p>
//               <DatePicker
//                 placeholder="Select first due date"
//                 value={formData.due_dates.first_due_date ? new Date(formData.due_dates.first_due_date) : null}
//                 onChange={(date) => handleInputChange('first_due_date', date)}
//               />
//             </div>

//             {/* Second Due Date - conditionally shown */}
//             {dateFieldsState.isSecondDateEnabled && (
//               <div>
//                 <p className="mb-2">Second Due Date</p>
//                 <DatePicker
//                   placeholder="Select second due date"
//                   value={formData.due_dates.second_due_date ? new Date(formData.due_dates.second_due_date) : null}
//                   onChange={(date) => handleInputChange('second_due_date', date)}
//                 />
//               </div>
//             )}

//             {/* Third Due Date - conditionally shown */}
//             {dateFieldsState.isThirdDateEnabled && (
//               <div>
//                 <p className="mb-2">Third Due Date</p>
//                 <DatePicker
//                   placeholder="Select third due date"
//                   value={formData.due_dates.third_due_date ? new Date(formData.due_dates.third_due_date) : null}
//                   onChange={(date) => handleInputChange('third_due_date', date)}
//                 />
//               </div>
//             )}

//             {/* Last Due Date - conditionally shown */}
//             {dateFieldsState.isLastDateEnabled && (
//               <div>
//                 <p className="mb-2">Last Due Date</p>
//                 <DatePicker
//                   placeholder="Select last due date"
//                   value={formData.due_dates.last_due_date ? new Date(formData.due_dates.last_due_date) : null}
//                   onChange={(date) => handleInputChange('last_due_date', date)}
//                 />
//               </div>
//             )}
//           </>
//         )}

//         {/* Submit and Cancel buttons */}
//         <div className="flex justify-end gap-2">
//           <Button type="button" variant="solid" size="sm" onClick={handleSubmit} loading={loading}>
//             Create Checklist
//           </Button>
//           <Button type="button" variant="plain" size="sm" onClick={() => navigate(-1)}>
//             Cancel
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssignCustomFormPage;

// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { Button, Notification, toast } from '@/components/ui';
// import { IoArrowBack } from 'react-icons/io5';
// import OutlinedSelect from '@/components/ui/Outlined';
// import OutlinedInput from '@/components/ui/OutlinedInput';
// import { DatePicker } from '@/components/ui/DatePicker';
// import httpClient from '@/api/http-client';
// import { endpoints } from '@/api/endpoint';

// interface FormData {
//   group_id: number;
//   country: string;
//   function: string;
//   applicable: string;
//   state_id?: number | null;
//   legislation_act: string;
//   compliance_categorization: string;
//   penalty_type: string;
//   penalty_description: string;
//   compliance_header: string;
//   compliance_description: string;
//   compliance_applicability: string;
//   compliance_reference: string;
//   compliance_type: string;
//   compliance_frequency: string;
//   criticality: string;
//   proof_mandatory: boolean;
//   due_date_frequency: string;
//   due_dates: {
//     first_due_date?: string;
//     second_due_date?: string;
//     third_due_date?: string;
//     last_due_date?: string;
//   };
//   is_active?: boolean;
// }

// interface SelectOption {
//   value: string;
//   label: string;
// }

// interface StateOption {
//   value: number;
//   label: string;
// }

// const AssignCustomFormPage = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const isEditMode = !!id;

//   const [formData, setFormData] = useState<FormData>({
//     group_id: 0,
//     country: 'India',
//     function: '',
//     applicable: 'central',
//     state_id: null,
//     legislation_act: '',
//     compliance_categorization: '',
//     penalty_type: '',
//     penalty_description: '',
//     compliance_header: '',
//     compliance_description: '',
//     compliance_applicability: '',
//     compliance_reference: '',
//     compliance_type: '',
//     compliance_frequency: 'monthly',
//     criticality: 'medium',
//     proof_mandatory: false,
//     due_date_frequency: 'monthly',
//     due_dates: {},
//     is_active: true
//   });

//   const [isLoading, setIsLoading] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [showStateField, setShowStateField] = useState(false);
//   const [showDateFields, setShowDateFields] = useState(false);
//   const [dateFieldsState, setDateFieldsState] = useState({
//     isSecondDateEnabled: false,
//     isThirdDateEnabled: false,
//     isLastDateEnabled: false,
//   });
//   const [states, setStates] = useState<StateOption[]>([]);
//   const [companyGroupName, setCompanyGroupName] = useState('');
//   const [companyGroupId, setCompanyGroupId] = useState('');

//   // Options for select fields
//   const applicableOptions: SelectOption[] = [
//     { value: 'central', label: 'Central' },
//     { value: 'state', label: 'State' },
//   ];

//   const proofMandatoryOptions: SelectOption[] = [
//   { value: 'true', label: 'Yes' },
//   { value: 'false', label: 'No' },
// ];

//   const frequencyOptions: SelectOption[] = [
//     { value: 'monthly', label: 'Monthly' },
//     { value: 'quarterly', label: 'Quarterly' },
//     { value: 'yearly', label: 'Yearly' },
//     { value: 'half_yearly', label: 'Half Yearly' },
//   ];

//   const criticalityOptions: SelectOption[] = [
//     { value: 'low', label: 'Low' },
//     { value: 'medium', label: 'Medium' },
//     { value: 'high', label: 'High' },
//   ];

//   const dueDateFrequencyOptions: SelectOption[] = [
//     { value: 'monthly', label: 'Monthly' },
//     { value: 'yearly', label: 'Yearly' },
//     { value: 'quarterly', label: 'Quarterly' },
//     { value: 'half_yearly', label: 'Half Yearly' },
//     { value: 'na', label: 'NA' },
//     { value: 'one', label: 'One' },
//   ];

//   // Fetch states data
//   useEffect(() => {
//     const fetchStates = async () => {
//       try {
//         const response = await httpClient.get(endpoints.common.state());
//         setStates(response.data.map((state: any) => ({
//           value: state.id,
//           label: state.name
//         })));
//       } catch (error) {
//         console.error('Error fetching states:', error);
//         toast.push(
//           <Notification title="Error" type="error">
//             Failed to load states
//           </Notification>
//         );
//       }
//     };

//     fetchStates();
//   }, []);

//   // Load checklist data in edit mode
//   useEffect(() => {
//     if (isEditMode) {
//       const fetchChecklistData = async () => {
//         try {
//           const response = await httpClient.get(
//             endpoints.compliance.detailCustomChecklist(Number(id))
//           );
//           const data = response.data;

//           setFormData({
//             group_id: data.group_id,
//             country: data.country,
//             function: data.function,
//             applicable: data.applicable,
//             state_id: data.state_id,
//             legislation_act: data.legislation_act,
//             compliance_categorization: data.compliance_categorization,
//             penalty_type: data.penalty_type,
//             penalty_description: data.penalty_description,
//             compliance_header: data.compliance_header,
//             compliance_description: data.compliance_description,
//             compliance_applicability: data.compliance_applicability,
//             compliance_reference: data.compliance_reference,
//             compliance_type: data.compliance_type,
//             compliance_frequency: data.compliance_frequency,
//             criticality: data.criticality,
//             proof_mandatory: data.proof_mandatory || false,
//             due_date_frequency: data.due_date_frequency,
//             due_dates: data.due_dates || {},
//             is_active: data.is_active
//           });

//           // Set company group info
//           if (data.CompanyGroup) {
//             setCompanyGroupName(data.CompanyGroup.name);
//             setCompanyGroupId(String(data.CompanyGroup.id));
//           }
//         } catch (error) {
//           console.error('Error fetching checklist data:', error);
//           toast.push(
//             <Notification title="Error" type="error">
//               Failed to load checklist data
//             </Notification>
//           );
//           navigate(-1);
//         } finally {
//           setIsLoading(false);
//         }
//       };

//       fetchChecklistData();
//     } else {
//       loadCompanyGroups();
//     }
//   }, [id, isEditMode, navigate]);

//   const loadCompanyGroups = async () => {
//     try {
//       const { data } = await httpClient.get(endpoints.companyGroup.getAll(), {
//         params: { ignorePlatform: true },
//       });

//       if (data.data && data.data.length > 0) {
//         const defaultGroup = data.data[0];
//         setCompanyGroupName(defaultGroup.name);
//         setCompanyGroupId(String(defaultGroup.id));

//         setFormData(prev => ({
//           ...prev,
//           group_id: defaultGroup.id
//         }));
//       }
//     } catch (error) {
//       console.error('Error loading company groups:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle applicable change to show/hide state field
//   useEffect(() => {
//     setShowStateField(formData.applicable === 'state');
//     if (formData.applicable !== 'state') {
//       setFormData(prev => ({ ...prev, state_id: null }));
//     }
//   }, [formData.applicable]);

//   // Handle due date frequency change
//   useEffect(() => {
//     const frequency = formData.due_date_frequency.toLowerCase();
//     const shouldShowDates = !['na', 'one'].includes(frequency);
//     setShowDateFields(shouldShowDates);

//     if (shouldShowDates) {
//       switch (frequency) {
//         case 'monthly':
//         case 'yearly':
//           setDateFieldsState({
//             isSecondDateEnabled: false,
//             isThirdDateEnabled: false,
//             isLastDateEnabled: false
//           });
//           break;
//         case 'half_yearly':
//           setDateFieldsState({
//             isSecondDateEnabled: false,
//             isThirdDateEnabled: false,
//             isLastDateEnabled: true
//           });
//           break;
//         case 'quarterly':
//           setDateFieldsState({
//             isSecondDateEnabled: true,
//             isThirdDateEnabled: true,
//             isLastDateEnabled: true
//           });
//           break;
//         default:
//           setDateFieldsState({
//             isSecondDateEnabled: false,
//             isThirdDateEnabled: false,
//             isLastDateEnabled: false
//           });
//       }
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         due_dates: {}
//       }));
//     }
//   }, [formData.due_date_frequency]);

//   const handleInputChange = (field: string, value: any) => {
//     if (field.includes('_due_date')) {
//       const dateValue = value ? value.toISOString().split('T')[0] : '';
//       setFormData(prev => ({
//         ...prev,
//         due_dates: {
//           ...prev.due_dates,
//           [field]: dateValue
//         }
//       }));
//       return;
//     }

//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);

//       // Prepare payload
//       const payload = {
//         ...formData,
//         state_id: formData.applicable === 'state' ? formData.state_id : null
//       };

//       let response;
//       if (isEditMode) {
//         // Update existing checklist
//         response = await httpClient.put(
//           endpoints.compliance.updateCustomChecklist(Number(id)),
//           payload
//         );
//         toast.push(
//           <Notification title="Success" type="success">
//             Custom checklist updated successfully
//           </Notification>
//         );
//       } else {
//         // Create new checklist
//         response = await httpClient.post(
//           endpoints.compliance.createCustomChecklist(),
//           payload
//         );
//         toast.push(
//           <Notification title="Success" type="success">
//             Custom checklist created successfully
//           </Notification>
//         );
//       }

//       navigate(-1);
//     } catch (error: any) {
//       console.error('Error:', error);
//       const errorMessage = error.response?.data?.message ||
//         (isEditMode ? 'Failed to update custom checklist' : 'Failed to create custom checklist');
//       toast.push(
//         <Notification title="Error" type="error">
//           {errorMessage}
//         </Notification>
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       setLoading(true);
//       await httpClient.delete(
//         endpoints.compliance.deleteCustomChecklist(Number(id))
//       );
//       toast.push(
//         <Notification title="Success" type="success">
//           Custom checklist deleted successfully
//         </Notification>
//       );
//       navigate(-1);
//     } catch (error: any) {
//       console.error('Error deleting checklist:', error);
//       const errorMessage = error.response?.data?.message || 'Failed to delete custom checklist';
//       toast.push(
//         <Notification title="Error" type="error">
//           {errorMessage}
//         </Notification>
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="p-2 bg-white rounded-lg">
//       <div className="flex gap-2 items-center mb-3">
//         <Button
//           size="sm"
//           variant="plain"
//           icon={<IoArrowBack className="text-[#72828e] hover:text-[#5d6169]" />}
//           onClick={() => navigate(-1)}
//         />
//         <h3 className="text-2xl font-semibold mb-2">
//           {isEditMode ? 'Edit Custom Checklist' : 'Add Custom Checklist'}
//         </h3>
//       </div>
//       <div className="space-y-6">
//         {/* Group ID */}
//         <div>
//           <p className="mb-2">Company Group</p>
//           <OutlinedInput
//             label="Company Group"
//             value={companyGroupName}
//             onChange={() => {}}
//             disabled
//           />
//         </div>

//         {/* Country and Function */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <p className="mb-2">Country</p>
//             <OutlinedInput
//               label="Country"
//               value={formData.country}
//               onChange={(value: string) => {
//                 setFormData(prev => ({ ...prev, country: value }));
//               }}
//             />
//           </div>
//           <div>
//             <p className="mb-2">Function</p>
//             <OutlinedInput
//               label="Function"
//               value={formData.function}
//               onChange={(value: string) => {
//                 setFormData(prev => ({ ...prev, function: value }));
//               }}
//             />
//           </div>
//         </div>

//         {/* Applicable and State (conditionally shown) */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <p className="mb-2">Applicable</p>
//             <OutlinedSelect
//               label="Select Applicable"
//               options={applicableOptions}
//               value={applicableOptions.find(option => option.value === formData.applicable)}
//               onChange={(selectedOption: SelectOption | null) => {
//                 setFormData(prev => ({
//                   ...prev,
//                   applicable: selectedOption?.value || 'central',
//                 }));
//               }}
//             />
//           </div>
//           {showStateField && (
//             <div>
//               <p className="mb-2">State</p>
//               <OutlinedSelect
//                 label="Select State"
//                 options={states}
//                 value={states.find(option => option.value === formData.state_id)}
//                 onChange={(selectedOption: StateOption | null) => {
//                   setFormData(prev => ({
//                     ...prev,
//                     state_id: selectedOption?.value || null,
//                   }));
//                 }}
//               />
//             </div>
//           )}
//         </div>

//         {/* Legislation Act and Compliance Categorization */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <p className="mb-2">Legislation Act</p>
//             <OutlinedInput
//               label="Legislation Act"
//               value={formData.legislation_act}
//               onChange={(value: string) => {
//                 setFormData(prev => ({ ...prev, legislation_act: value }));
//               }}
//             />
//           </div>
//           <div>
//             <p className="mb-2">Compliance Categorization</p>
//             <OutlinedInput
//               label="Compliance Categorization"
//               value={formData.compliance_categorization}
//               onChange={(value: string) => {
//                 setFormData(prev => ({ ...prev, compliance_categorization: value }));
//               }}
//             />
//           </div>
//         </div>

//         {/* Penalty Type and Description */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <p className="mb-2">Penalty Type</p>
//             <OutlinedInput
//               label="Penalty Type"
//               value={formData.penalty_type}
//               onChange={(value: string) => {
//                 setFormData(prev => ({ ...prev, penalty_type: value }));
//               }}
//             />
//           </div>
//           <div>
//             <p className="mb-2">Penalty Description</p>
//             <OutlinedInput
//               label="Penalty Description"
//               value={formData.penalty_description}
//               onChange={(value: string) => {
//                 setFormData(prev => ({ ...prev, penalty_description: value }));
//               }}
//             />
//           </div>
//         </div>

//         {/* Compliance Header */}
//         <div>
//           <p className="mb-2">Compliance Header</p>
//           <OutlinedInput
//             label="Compliance Header"
//             value={formData.compliance_header}
//             onChange={(value: string) => {
//               setFormData(prev => ({ ...prev, compliance_header: value }));
//             }}
//           />
//         </div>

//         {/* Compliance Description */}
//         <div>
//           <p className="mb-2">Compliance Description</p>
//           <OutlinedInput
//             label="Compliance Description"
//             value={formData.compliance_description}
//             onChange={(value: string) => {
//               setFormData(prev => ({ ...prev, compliance_description: value }));
//             }}
//             textarea={true}
//           />
//         </div>

//         {/* Compliance Applicability and Reference */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <p className="mb-2">Compliance Applicability</p>
//             <OutlinedInput
//               label="Compliance Applicability"
//               value={formData.compliance_applicability}
//               onChange={(value: string) => {
//                 setFormData(prev => ({ ...prev, compliance_applicability: value }));
//               }}
//             />
//           </div>
//           <div>
//             <p className="mb-2">Compliance Reference</p>
//             <OutlinedInput
//               label="Compliance Reference"
//               value={formData.compliance_reference}
//               onChange={(value: string) => {
//                 setFormData(prev => ({ ...prev, compliance_reference: value }));
//               }}
//             />
//           </div>
//         </div>

//         {/* Compliance Type and Frequency */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <p className="mb-2">Compliance Type</p>
//             <OutlinedInput
//               label="Compliance Type"
//               value={formData.compliance_type}
//               onChange={(value: string) => {
//                 setFormData(prev => ({ ...prev, compliance_type: value }));
//               }}
//             />
//           </div>
//           <div>
//             <p className="mb-2">Compliance Frequency</p>
//             <OutlinedSelect
//               label="Select Frequency"
//               options={frequencyOptions}
//               value={frequencyOptions.find(option => option.value === formData.compliance_frequency)}
//               onChange={(selectedOption: SelectOption | null) => {
//                 setFormData(prev => ({
//                   ...prev,
//                   compliance_frequency: selectedOption?.value || 'monthly',
//                 }));
//               }}
//             />
//           </div>
//         </div>

//         {/* Criticality and Due Date Frequency */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <p className="mb-2">Criticality</p>
//             <OutlinedSelect
//               label="Select Criticality"
//               options={criticalityOptions}
//               value={criticalityOptions.find(option => option.value === formData.criticality)}
//               onChange={(selectedOption: SelectOption | null) => {
//                 setFormData(prev => ({
//                   ...prev,
//                   criticality: selectedOption?.value || 'medium',
//                 }));
//               }}
//             />
//           </div>
//           <div>
//   <p className="mb-2">Proof Mandatory</p>
//   <OutlinedSelect
//     label="Select Proof Mandatory"
//     options={proofMandatoryOptions}
//     value={proofMandatoryOptions.find(option =>
//       option.value === String(formData.proof_mandatory)
//     )}
//     onChange={(selectedOption: SelectOption | null) => {
//       setFormData(prev => ({
//         ...prev,
//         proof_mandatory: selectedOption?.value === 'true',
//       }));
//     }}
//   />
// </div>
//           <div>
//             <p className="mb-2">Due Date Frequency</p>
//             <OutlinedSelect
//               label="Select Due Date Frequency"
//               options={dueDateFrequencyOptions}
//               value={dueDateFrequencyOptions.find(option => option.value === formData.due_date_frequency)}
//               onChange={(selectedOption: SelectOption | null) => {
//                 setFormData(prev => ({
//                   ...prev,
//                   due_date_frequency: selectedOption?.value || 'monthly',
//                 }));
//               }}
//             />
//           </div>
//         </div>

//         {/* Date fields - conditionally shown */}
//         {showDateFields && (
//           <>
//             {/* First Due Date */}
//             <div>
//               <p className="mb-2">First Due Date</p>
//               <DatePicker
//                 placeholder="Select first due date"
//                 value={formData.due_dates.first_due_date ? new Date(formData.due_dates.first_due_date) : null}
//                 onChange={(date) => handleInputChange('first_due_date', date)}
//               />
//             </div>

//             {/* Second Due Date - conditionally shown */}
//             {dateFieldsState.isSecondDateEnabled && (
//               <div>
//                 <p className="mb-2">Second Due Date</p>
//                 <DatePicker
//                   placeholder="Select second due date"
//                   value={formData.due_dates.second_due_date ? new Date(formData.due_dates.second_due_date) : null}
//                   onChange={(date) => handleInputChange('second_due_date', date)}
//                 />
//               </div>
//             )}

//             {/* Third Due Date - conditionally shown */}
//             {dateFieldsState.isThirdDateEnabled && (
//               <div>
//                 <p className="mb-2">Third Due Date</p>
//                 <DatePicker
//                   placeholder="Select third due date"
//                   value={formData.due_dates.third_due_date ? new Date(formData.due_dates.third_due_date) : null}
//                   onChange={(date) => handleInputChange('third_due_date', date)}
//                 />
//               </div>
//             )}

//             {/* Last Due Date - conditionally shown */}
//             {dateFieldsState.isLastDateEnabled && (
//               <div>
//                 <p className="mb-2">Last Due Date</p>
//                 <DatePicker
//                   placeholder="Select last due date"
//                   value={formData.due_dates.last_due_date ? new Date(formData.due_dates.last_due_date) : null}
//                   onChange={(date) => handleInputChange('last_due_date', date)}
//                 />
//               </div>
//             )}
//           </>
//         )}

//         {/* Submit and Cancel buttons */}
//         <div className="flex justify-end gap-2">
//           {isEditMode && (
//             <Button
//               type="button"
//               variant="solid"
//               color="red-600"
//               size="sm"
//               onClick={handleDelete}
//               loading={loading}
//             >
//               Delete Checklist
//             </Button>
//           )}
//           <Button
//             type="button"
//             variant="solid"
//             size="sm"
//             onClick={handleSubmit}
//             loading={loading}
//           >
//             {isEditMode ? 'Update Checklist' : 'Create Checklist'}
//           </Button>
//           <Button
//             type="button"
//             variant="plain"
//             size="sm"
//             onClick={() => navigate(-1)}
//           >
//             Cancel
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssignCustomFormPage;



import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Notification, toast } from '@/components/ui';
import { IoArrowBack } from 'react-icons/io5';
import OutlinedSelect from '@/components/ui/Outlined';
import OutlinedInput from '@/components/ui/OutlinedInput';
import { DatePicker } from '@/components/ui/DatePicker';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import * as Yup from 'yup';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface FormData {
  group_id: number;
  country: string;
  function: string;
  applicable: string;
  state_id?: number | null;
  legislation_act: string;
  compliance_categorization: string;
  penalty_type: string;
  penalty_description: string;
  compliance_header: string;
  compliance_description: string;
  compliance_applicability: string;
  compliance_reference: string;
  compliance_type: string;
  compliance_frequency: string;
  criticality: string;
  proof_mandatory: boolean;
  due_date_frequency: string;
  due_dates: DueDates;
  is_active?: boolean;
}

interface SelectOption {
  value: string;
  label: string;
}

interface StateOption {
  value: number;
  label: string;
}

interface DueDates {
  first_due_date?: string;
  second_due_date?: string;
  third_due_date?: string;
  last_due_date?: string;
}

const initialValues: FormData = {
  group_id: 0,
  country: 'India',
  function: '',
  applicable: 'central',
  state_id: null,
  legislation_act: '',
  compliance_categorization: '',
  penalty_type: '',
  penalty_description: '',
  compliance_header: '',
  compliance_description: '',
  compliance_applicability: '',
  compliance_reference: '',
  compliance_type: '',
  compliance_frequency: 'monthly',
  criticality: 'medium',
  proof_mandatory: false,
  due_date_frequency: 'monthly',
  due_dates: {},
  is_active: true
};

const AssignCustomFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [isLoading, setIsLoading] = useState(true);
  const [states, setStates] = useState<StateOption[]>([]);
  const [companyGroupName, setCompanyGroupName] = useState('');
  const [companyGroupId, setCompanyGroupId] = useState('');
  const [formInitialValues, setFormInitialValues] = useState<FormData>(initialValues);


  // Options for select fields
  const applicableOptions: SelectOption[] = [
    { value: 'central', label: 'Central' },
    { value: 'state', label: 'State' },
  ];

  const proofMandatoryOptions: SelectOption[] = [
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' },
  ];

  const frequencyOptions: SelectOption[] = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'half_yearly', label: 'Half Yearly' },
  ];

  const criticalityOptions: SelectOption[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const dueDateFrequencyOptions: SelectOption[] = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'half_yearly', label: 'Half Yearly' },
    { value: 'na', label: 'NA' },
    { value: 'one', label: 'One' },
  ];

  // Validation Schema
  const validationSchema = Yup.object().shape({
    group_id: Yup.number().required('Company Group is required').min(1),
    country: Yup.string().required('Country is required'),
    function: Yup.string().required('Function is required'),
    applicable: Yup.string().required('Applicable is required'),
    state_id: Yup.number().when('applicable', {
      is: 'state',
      then: (schema) => schema.required('State is required'),
      otherwise: (schema) => schema.nullable(),
    }),
    legislation_act: Yup.string().required('Legislation Act is required'),
    compliance_categorization: Yup.string().required('Compliance Categorization is required'),
    penalty_type: Yup.string().required('Penalty Type is required'),
    compliance_header: Yup.string().required('Compliance Header is required'),
    compliance_description: Yup.string().required('Compliance Description is required'),
    penalty_description: Yup.string().required('Penalty Description is required'),
    compliance_applicability: Yup.string().required('Compliance Applicability is required'),
    compliance_reference: Yup.string().required('Compliance Reference is required'),
    compliance_type: Yup.string().required('Compliance Type is required'),
    compliance_frequency: Yup.string().required('Compliance Frequency is required'),
    criticality: Yup.string().required('Criticality is required'),
    due_date_frequency: Yup.string().required('Due Date Frequency is required'),
    proof_mandatory: Yup.boolean().required('Proof Mandatory is required'),
    due_dates: Yup.object().when('due_date_frequency', {
      is: (val: string) => !['na', 'one'].includes(val?.toLowerCase()),
      then: (schema) =>
        schema.shape({
          first_due_date: Yup.string().required('First due date is required'),
          second_due_date: Yup.string().when('due_date_frequency', {
            is: 'quarterly',
            then: (schema) => schema.required('Second due date is required'),
            otherwise: (schema) => schema.nullable(),
          }),
          third_due_date: Yup.string().when('due_date_frequency', {
            is: 'quarterly',
            then: (schema) => schema.required('Third due date is required'),
            otherwise: (schema) => schema.nullable(),
          }),
          last_due_date: Yup.string().when('due_date_frequency', {
            is: (val: string) => ['half_yearly', 'quarterly'].includes(val?.toLowerCase()),
            then: (schema) => schema.required('Last due date is required'),
            otherwise: (schema) => schema.nullable(),
          }),
        }).test('unique-dates', 'Dates must be unique', function(value) {
          const { due_date_frequency } = this.parent;
          
          if (!due_date_frequency || !value) return true;

          if (due_date_frequency === 'half_yearly') {
            if (value.first_due_date && value.last_due_date && 
                value.first_due_date === value.last_due_date) {
              return this.createError({
                path: 'due_dates.last_due_date',
                message: 'Last due date must be different from first due date'
              });
            }
          }
          
          if (due_date_frequency === 'quarterly') {
            const dates = [
              value.first_due_date,
              value.second_due_date,
              value.third_due_date,
              value.last_due_date
            ].filter(date => date !== undefined);
            
            const uniqueDates = new Set(dates);
            if (uniqueDates.size !== dates.length) {
              if (dates[0] && dates[1] && dates[0] === dates[1]) {
                return this.createError({
                  path: 'due_dates.second_due_date',
                  message: 'Second due date must be different from first due date'
                });
              }
              if (dates[0] && dates[2] && dates[0] === dates[2]) {
                return this.createError({
                  path: 'due_dates.third_due_date',
                  message: 'Third due date must be different from first due date'
                });
              }
              if (dates[0] && dates[3] && dates[0] === dates[3]) {
                return this.createError({
                  path: 'due_dates.last_due_date',
                  message: 'Last due date must be different from first due date'
                });
              }
              if (dates[1] && dates[2] && dates[1] === dates[2]) {
                return this.createError({
                  path: 'due_dates.third_due_date',
                  message: 'Third due date must be different from second due date'
                });
              }
              if (dates[1] && dates[3] && dates[1] === dates[3]) {
                return this.createError({
                  path: 'due_dates.last_due_date',
                  message: 'Last due date must be different from second due date'
                });
              }
              if (dates[2] && dates[3] && dates[2] === dates[3]) {
                return this.createError({
                  path: 'due_dates.last_due_date',
                  message: 'Last due date must be different from third due date'
                });
              }
            }
          }
          
          return true;
        }),
      otherwise: (schema) => schema.notRequired(),
    })
  });

  // Date handling functions
  const parseDate = (dateString?: string) => {
    if (!dateString) return null;
    const parts = dateString.split('-');
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const loadCompanyGroups = async (setFieldValue?: (field: string, value: any) => void) => {
    try {
      const { data } = await httpClient.get(endpoints.companyGroup.getAll(), {
        params: { ignorePlatform: true },
      });
      
      if (data.data && data.data.length > 0) {
        const defaultGroup = data.data[0];
        setCompanyGroupName(defaultGroup.name);
        setCompanyGroupId(String(defaultGroup.id));
        
      setFieldValue?.('group_id', defaultGroup.id);
      return defaultGroup.id;
      }
    } catch (error) {
      console.error('Error loading company groups:', error);
      toast.push(
        <Notification title="Error" type="error">
          Failed to load company groups
        </Notification>
      );
    }
  };

  const handleSubmit = async (values: FormData, { setSubmitting }: any) => {
    try {
      console.log('Submitting form with values:', values); 
      // Prepare payload with all form data including group_id
      const payload = {
        ...values,
        state_id: values.applicable === 'state' ? values.state_id : null
      };

      if (isEditMode) {
        await httpClient.put(
          endpoints.compliance.updateCustomChecklist(Number(id)),
          payload
        );
        toast.push(
          <Notification title="Success" type="success">
            Custom checklist updated successfully
          </Notification>
        );
      } else {
        await httpClient.post(
          endpoints.compliance.createCustomChecklist(),
          payload
        );
        toast.push(
          <Notification title="Success" type="success">
            Custom checklist created successfully
          </Notification>
        );
      }

      navigate(-1);
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || 
        (isEditMode ? 'Failed to update custom checklist' : 'Failed to create custom checklist');
      toast.push(
        <Notification title="Error" type="error">
          {errorMessage}
        </Notification>
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await httpClient.delete(
        endpoints.compliance.deleteCustomChecklist(Number(id))
      );
      toast.push(
        <Notification title="Success" type="success">
          Custom checklist deleted successfully
        </Notification>
      );
      navigate(-1);
    } catch (error: any) {
      console.error('Error deleting checklist:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete custom checklist';
      toast.push(
        <Notification title="Error" type="error">
          {errorMessage}
        </Notification>
      );
    }
  };

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await httpClient.get(endpoints.common.state());
        setStates(response.data.map((state: any) => ({
          value: state.id,
          label: state.name
        })));
      } catch (error) {
        console.error('Error fetching states:', error);
        toast.push(
          <Notification title="Error" type="error">
            Failed to load states
          </Notification>
        );
      }
    };

    fetchStates();
  }, []);

  // useEffect(() => {
  //   if (isEditMode) {
  //     const fetchChecklistData = async () => {
  //             await loadCompanyGroups();

  //       try {
  //         const response = await httpClient.get(
  //           endpoints.compliance.detailCustomChecklist(Number(id))
  //         );
  //         const data = response.data;
          
  //         // Set company group info
  //         if (data.CompanyGroup) {
  //           setCompanyGroupName(data.CompanyGroup.name);
  //           setCompanyGroupId(String(data.CompanyGroup.id));
  //         }

  //         return {
  //           ...data,
  //           proof_mandatory: data.proof_mandatory || false,
  //           due_dates: data.due_dates || {},
  //         };
  //       } catch (error) {
  //         console.error('Error fetching checklist data:', error);
  //         toast.push(
  //           <Notification title="Error" type="error">
  //             Failed to load checklist data
  //           </Notification>
  //         );
  //         navigate(-1);
  //         return {
  //           group_id: 0,
  //           country: 'India',
  //           function: '',
  //           applicable: 'central',
  //           state_id: null,
  //           legislation_act: '',
  //           compliance_categorization: '',
  //           penalty_type: '',
  //           penalty_description: '',
  //           compliance_header: '',
  //           compliance_description: '',
  //           compliance_applicability: '',
  //           compliance_reference: '',
  //           compliance_type: '',
  //           compliance_frequency: 'monthly',
  //           criticality: 'medium',
  //           proof_mandatory: false,
  //           due_date_frequency: 'monthly',
  //           due_dates: {},
  //           is_active: true
  //         };
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     };

  //     fetchChecklistData();
  //   } else {
  //     setIsLoading(false);
  //   }
  // }, [id, isEditMode, navigate]);

  useEffect(() => {
  const initializeForm = async () => {
    const defaultGroupId = await loadCompanyGroups();
    
    if (isEditMode) {
      try {
        const response = await httpClient.get(
          endpoints.compliance.detailCustomChecklist(Number(id))
        );
        const data = response.data;
        
        // Set initial values including group_id
        setFormInitialValues({
          ...data,
          group_id: data.group_id || defaultGroupId, // Use existing or default
          proof_mandatory: data.proof_mandatory || false,
          due_dates: data.due_dates || {},
        });

        if (data.CompanyGroup) {
          setCompanyGroupName(data.CompanyGroup.name);
          setCompanyGroupId(String(data.CompanyGroup.id));
        }
      } catch (error) {
        console.error('Error fetching checklist data:', error);
        toast.push(
          <Notification title="Error" type="error">
            Failed to load checklist data
          </Notification>
        );
        navigate(-1);
      }
    } else {
      // For create mode, set the default group_id
      setFormInitialValues({
        ...initialValues,
        group_id: defaultGroupId
      });
    }
    setIsLoading(false);
  };

  initializeForm();
}, [id, isEditMode, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }


    return (
        <div className="p-2 bg-white rounded-lg">
            <div className="flex gap-2 items-center mb-3">
                <Button
                    size="sm"
                    variant="plain"
                    icon={
                        <IoArrowBack className="text-[#72828e] hover:text-[#5d6169]" />
                    }
                    onClick={() => navigate(-1)}
                />
                <h3 className="text-2xl font-semibold mb-2">
                    {isEditMode
                        ? 'Edit Custom Checklist'
                        : 'Add Custom Checklist'}
                </h3>
            </div>

            <Formik
                initialValues={formInitialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                validateOnChange={true}
                validateOnBlur={true}
                enableReinitialize={true}
            >
                {({
                    values,
                    errors,
                    touched,
                    setFieldValue,
                    handleSubmit,
                    setFieldTouched,
                    isSubmitting,
                }) => {
                    // Handle applicable change to show/hide state field
                    const showStateField = values.applicable === 'state'

                    // Handle due date frequency change
                    const showDateFields = !['na', 'one'].includes(
                        values.due_date_frequency.toLowerCase(),
                    )
                    const dateFieldsState = {
                        isSecondDateEnabled:
                            values.due_date_frequency.toLowerCase() ===
                            'quarterly',
                        isThirdDateEnabled:
                            values.due_date_frequency.toLowerCase() ===
                            'quarterly',
                        isLastDateEnabled: [
                            'half_yearly',
                            'quarterly',
                        ].includes(values.due_date_frequency.toLowerCase()),
                    }

                    return (
                        <Form>
                            <div className="space-y-6">
                                {/* Group ID */}
                                <div>
                                    <p className="mb-2">Company Group</p>
                                    <OutlinedInput
                                        label="Company Group"
                                        value={companyGroupName}
                                        onChange={() => {}}
                                        disabled
                                    />
                                </div>

                                {/* Country and Function */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                        <p className="mb-2">
                                            Country{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </p>
                                        <OutlinedInput
                                            label="Country"
                                            value={values.country}
                                            onChange={(value: string) =>
                                                setFieldValue('country', value)
                                            }
                                        />
                                        {touched.country && errors.country && (
                                            <div className="text-red-500 text-sm">
                                                {errors.country}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="mb-2">
                                            Function{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </p>
                                        <OutlinedInput
                                            label="Function"
                                            value={values.function}
                                            onChange={(value: string) =>
                                                setFieldValue('function', value)
                                            }
                                        />
                                        {touched.function &&
                                            errors.function && (
                                                <div className="text-red-500 text-sm">
                                                    {errors.function}
                                                </div>
                                            )}
                                    </div>
                                </div>

                                {/* Applicable and State (conditionally shown) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                        <p className="mb-2">
                                            Applicable{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </p>
                                        <OutlinedSelect
                                            label="Select Applicable"
                                            options={applicableOptions}
                                            value={applicableOptions.find(
                                                (option) =>
                                                    option.value ===
                                                    values.applicable,
                                            )}
                                            onChange={(
                                                selectedOption: SelectOption | null,
                                            ) => {
                                                setFieldValue(
                                                    'applicable',
                                                    selectedOption?.value ||
                                                        'central',
                                                )
                                            }}
                                        />
                                        {touched.applicable &&
                                            errors.applicable && (
                                                <div className="text-red-500 text-sm">
                                                    {errors.applicable}
                                                </div>
                                            )}
                                    </div>
                                    {showStateField && (
                                        <div>
                                            <p className="mb-2">
                                                State{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </p>
                                            <OutlinedSelect
                                                label="Select State"
                                                options={states}
                                                value={states.find(
                                                    (option) =>
                                                        option.value ===
                                                        values.state_id,
                                                )}
                                                onChange={(
                                                    selectedOption: StateOption | null,
                                                ) => {
                                                    setFieldValue(
                                                        'state_id',
                                                        selectedOption?.value ||
                                                            null,
                                                    )
                                                }}
                                            />
                                            {touched.state_id &&
                                                errors.state_id && (
                                                    <div className="text-red-500 text-sm">
                                                        {errors.state_id}
                                                    </div>
                                                )}
                                        </div>
                                    )}
                                </div>

                                {/* Legislation Act and Compliance Categorization */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                        <p className="mb-2">
                                            Legislation Act{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </p>
                                        <OutlinedInput
                                            label="Legislation Act"
                                            value={values.legislation_act}
                                            onChange={(value: string) =>
                                                setFieldValue(
                                                    'legislation_act',
                                                    value,
                                                )
                                            }
                                        />
                                        {touched.legislation_act &&
                                            errors.legislation_act && (
                                                <div className="text-red-500 text-sm">
                                                    {errors.legislation_act}
                                                </div>
                                            )}
                                    </div>
                                    <div>
                                        <p className="mb-2">
                                            Compliance Categorization{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </p>
                                        <OutlinedInput
                                            label="Compliance Categorization"
                                            value={
                                                values.compliance_categorization
                                            }
                                            onChange={(value: string) =>
                                                setFieldValue(
                                                    'compliance_categorization',
                                                    value,
                                                )
                                            }
                                        />
                                        {touched.compliance_categorization &&
                                            errors.compliance_categorization && (
                                                <div className="text-red-500 text-sm">
                                                    {
                                                        errors.compliance_categorization
                                                    }
                                                </div>
                                            )}
                                    </div>
                                </div>

                                {/* Penalty Type and Description */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                        <p className="mb-2">
                                            Penalty Type{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </p>
                                        <OutlinedInput
                                            label="Penalty Type"
                                            value={values.penalty_type}
                                            onChange={(value: string) =>
                                                setFieldValue(
                                                    'penalty_type',
                                                    value,
                                                )
                                            }
                                        />
                                        {touched.penalty_type &&
                                            errors.penalty_type && (
                                                <div className="text-red-500 text-sm">
                                                    {errors.penalty_type}
                                                </div>
                                            )}
                                    </div>
                                    <div>
                                        <p className="mb-2">
                                            Penalty Description{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </p>
                                        <OutlinedInput
                                            label="Penalty Description"
                                            value={values.penalty_description}
                                            onChange={(value: string) =>
                                                setFieldValue(
                                                    'penalty_description',
                                                    value,
                                                )
                                            }
                                        />
                                        {touched.penalty_description &&
                                            errors.penalty_description && (
                                                <div className="text-red-500 text-sm">
                                                    {errors.penalty_description}
                                                </div>
                                            )}
                                    </div>
                                </div>

                                {/* Compliance Header */}
                                <div>
                                    <p className="mb-2">
                                        Compliance Header{' '}
                                        <span className="text-red-500">*</span>
                                    </p>
                                    <OutlinedInput
                                        label="Compliance Header"
                                        value={values.compliance_header}
                                        onChange={(value: string) =>
                                            setFieldValue(
                                                'compliance_header',
                                                value,
                                            )
                                        }
                                    />
                                    {touched.compliance_header &&
                                        errors.compliance_header && (
                                            <div className="text-red-500 text-sm">
                                                {errors.compliance_header}
                                            </div>
                                        )}
                                </div>

                                {/* Compliance Description */}
                                <div>
                                    <p className="mb-2">
                                        Compliance Description{' '}
                                        <span className="text-red-500">*</span>
                                    </p>
                                    <OutlinedInput
                                        label="Compliance Description"
                                        value={values.compliance_description}
                                        onChange={(value: string) =>
                                            setFieldValue(
                                                'compliance_description',
                                                value,
                                            )
                                        }
                                        textarea={true}
                                    />
                                    {touched.compliance_description &&
                                        errors.compliance_description && (
                                            <div className="text-red-500 text-sm">
                                                {errors.compliance_description}
                                            </div>
                                        )}
                                </div>

                                {/* Compliance Applicability and Reference */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                        <p className="mb-2">
                                            Compliance Applicability{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </p>
                                        <OutlinedInput
                                            label="Compliance Applicability"
                                            value={
                                                values.compliance_applicability
                                            }
                                            onChange={(value: string) =>
                                                setFieldValue(
                                                    'compliance_applicability',
                                                    value,
                                                )
                                            }
                                        />
                                        {touched.compliance_applicability &&
                                            errors.compliance_applicability && (
                                                <div className="text-red-500 text-sm">
                                                    {
                                                        errors.compliance_applicability
                                                    }
                                                </div>
                                            )}
                                    </div>
                                    <div>
                                        <p className="mb-2">
                                            Compliance Reference{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </p>
                                        <OutlinedInput
                                            label="Compliance Reference"
                                            value={values.compliance_reference}
                                            onChange={(value: string) =>
                                                setFieldValue(
                                                    'compliance_reference',
                                                    value,
                                                )
                                            }
                                        />
                                        {touched.compliance_reference &&
                                            errors.compliance_reference && (
                                                <div className="text-red-500 text-sm">
                                                    {
                                                        errors.compliance_reference
                                                    }
                                                </div>
                                            )}
                                    </div>
                                </div>

                                {/* Compliance Type and Frequency */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                        <p className="mb-2">
                                            Compliance Type{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </p>
                                        <OutlinedInput
                                            label="Compliance Type"
                                            value={values.compliance_type}
                                            onChange={(value: string) =>
                                                setFieldValue(
                                                    'compliance_type',
                                                    value,
                                                )
                                            }
                                        />
                                        {touched.compliance_type &&
                                            errors.compliance_type && (
                                                <div className="text-red-500 text-sm">
                                                    {errors.compliance_type}
                                                </div>
                                            )}
                                    </div>
                                    <div>
                                        <p className="mb-2">
                                            Compliance Frequency{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </p>
                                        <OutlinedSelect
                                            label="Select Frequency"
                                            options={frequencyOptions}
                                            value={frequencyOptions.find(
                                                (option) =>
                                                    option.value ===
                                                    values.compliance_frequency,
                                            )}
                                            onChange={(
                                                selectedOption: SelectOption | null,
                                            ) => {
                                                setFieldValue(
                                                    'compliance_frequency',
                                                    selectedOption?.value ||
                                                        'monthly',
                                                )
                                            }}
                                        />
                                        {touched.compliance_frequency &&
                                            errors.compliance_frequency && (
                                                <div className="text-red-500 text-sm">
                                                    {
                                                        errors.compliance_frequency
                                                    }
                                                </div>
                                            )}
                                    </div>
                                </div>

                                {/* Criticality and Proof Mandatory */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                        <p className="mb-2">
                                            Criticality{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </p>
                                        <OutlinedSelect
                                            label="Select Criticality"
                                            options={criticalityOptions}
                                            value={criticalityOptions.find(
                                                (option) =>
                                                    option.value ===
                                                    values.criticality,
                                            )}
                                            onChange={(
                                                selectedOption: SelectOption | null,
                                            ) => {
                                                setFieldValue(
                                                    'criticality',
                                                    selectedOption?.value ||
                                                        'medium',
                                                )
                                            }}
                                        />
                                        {touched.criticality &&
                                            errors.criticality && (
                                                <div className="text-red-500 text-sm">
                                                    {errors.criticality}
                                                </div>
                                            )}
                                    </div>
                                    <div>
                                        <p className="mb-2">
                                            Proof Mandatory{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </p>
                                        <OutlinedSelect
                                            label="Select Proof Mandatory"
                                            options={proofMandatoryOptions}
                                            value={proofMandatoryOptions.find(
                                                (option) =>
                                                    option.value ===
                                                    String(
                                                        values.proof_mandatory,
                                                    ),
                                            )}
                                            onChange={(
                                                selectedOption: SelectOption | null,
                                            ) => {
                                                setFieldValue(
                                                    'proof_mandatory',
                                                    selectedOption?.value ===
                                                        'true',
                                                )
                                            }}
                                        />
                                        {touched.proof_mandatory &&
                                            errors.proof_mandatory && (
                                                <div className="text-red-500 text-sm">
                                                    {errors.proof_mandatory}
                                                </div>
                                            )}
                                    </div>
                                </div>

                                {/* Due Date Frequency */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                        <p className="mb-2">
                                            Due Date Frequency{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </p>
                                        <OutlinedSelect
                                            label="Select Due Date Frequency"
                                            options={dueDateFrequencyOptions}
                                            value={dueDateFrequencyOptions.find(
                                                (option) =>
                                                    option.value ===
                                                    values.due_date_frequency,
                                            )}
                                            onChange={(
                                                selectedOption: SelectOption | null,
                                            ) => {
                                                setFieldValue(
                                                    'due_date_frequency',
                                                    selectedOption?.value ||
                                                        'monthly',
                                                )
                                                setFieldValue('due_dates', {})
                                            }}
                                        />
                                        {touched.due_date_frequency &&
                                            errors.due_date_frequency && (
                                                <div className="text-red-500 text-sm">
                                                    {errors.due_date_frequency}
                                                </div>
                                            )}
                                    </div>
                                </div>

                                {/* Date fields - conditionally shown */}
                                {/* Date fields - conditionally shown */}
                                {showDateFields && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* First Due Date */}
                                        <div>
                                            <p className="mb-2">
                                                First Due Date{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </p>
                                            <DatePicker
                                                placeholder="Select first due date"
                                               value={values.due_dates.first_due_date ? parseDate(values.due_dates.first_due_date) : null }
                                                onChange={(date) => {
                                                    setFieldValue('due_dates.first_due_date', date ? formatDate(date) : '');
                                                    setFieldTouched(
                                                        'due_dates.first_due_date',
                                                        true,
                                                    )
                                                }}
                                                 inputFormat='DD-MM-YYYY'
                                            />
                                            {errors.due_dates
                                                ?.first_due_date && (
                                                <div className="text-red-500 text-sm">
                                                    {
                                                        errors.due_dates
                                                            .first_due_date
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        {/* Second Due Date - conditionally shown */}
                                        {dateFieldsState.isSecondDateEnabled && (
                                            <div>
                                                <p className="mb-2">
                                                    Second Due Date{' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </p>
                                                <DatePicker
                                                    placeholder="Select second due date"
                                                    value={values.due_dates.second_due_date? parseDate(values.due_dates.second_due_date, ): null}
                                                    onChange={(date) => {
                                                        setFieldValue(
                                                            'due_dates.second_due_date',
                                                            date
                                                                ?formatDate(date) : '' )
                                                        setFieldTouched(
                                                            'due_dates.second_due_date',
                                                            true,
                                                        )
                                                    }}
                                                     inputFormat='DD-MM-YYYY'
                                                />
                                                {errors.due_dates
                                                    ?.second_due_date && (
                                                    <div className="text-red-500 text-sm">
                                                        {
                                                            errors.due_dates
                                                                .second_due_date
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Third Due Date - conditionally shown */}
                                        {dateFieldsState.isThirdDateEnabled && (
                                            <div>
                                                <p className="mb-2">
                                                    Third Due Date{' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </p>
                                                <DatePicker
                                                    placeholder="Select third due date"
                                                    value={
                                                        values.due_dates
                                                            .third_due_date
                                                            ? parseDate(
                                                                  values.due_dates.third_due_date,
                                                              )
                                                            : null
                                                    }
                                                    onChange={(date) => {
                                                        setFieldValue(
                                                            'due_dates.third_due_date',
                                                            date? formatDate(date) : '' )
                                                        setFieldTouched(
                                                            'due_dates.third_due_date',
                                                            true,
                                                        )
                                                    }}
                                                     inputFormat='DD-MM-YYYY'
                                                />
                                                {errors.due_dates
                                                    ?.third_due_date && (
                                                    <div className="text-red-500 text-sm">
                                                        {
                                                            errors.due_dates
                                                                .third_due_date
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Last Due Date - conditionally shown */}
                                        {dateFieldsState.isLastDateEnabled && (
                                            <div>
                                                <p className="mb-2">
                                                    Last Due Date{' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </p>
                                                <DatePicker
                                                    placeholder="Select last due date"
                                                    value={
                                                        values.due_dates
                                                            .last_due_date
                                                            ? parseDate(
                                                                  values.due_dates.last_due_date,
                                                              )
                                                            : null
                                                    }
                                                    onChange={(date) => {
                                                        setFieldValue(
                                                            'due_dates.last_due_date',
                                                            date
                                                                ?formatDate(date) : '' )
                                                        setFieldTouched(
                                                            'due_dates.last_due_date',
                                                            true,
                                                        )
                                                    }}
                                                     inputFormat='DD-MM-YYYY'
                                                />
                                                {errors.due_dates
                                                    ?.last_due_date && (
                                                    <div className="text-red-500 text-sm">
                                                        {
                                                            errors.due_dates
                                                                .last_due_date
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Submit and Cancel buttons */}
                                <div className="flex justify-end gap-2">
                                    {isEditMode && (
                                        <Button
                                            type="button"
                                            variant="solid"
                                            color="red-600"
                                            size="sm"
                                            onClick={handleDelete}
                                        >
                                            Delete Checklist
                                        </Button>
                                    )}
                                     <Button
                                        type="button"
                                        variant="plain"
                                        size="sm"
                                        onClick={() => navigate(-1)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="solid"
                                        size="sm"
                                        loading={isSubmitting}
                                        icon={
                                            isSubmitting ? (
                                                <AiOutlineLoading3Quarters className="animate-spin" />
                                            ) : null
                                        }
                                    >
                                        {isEditMode
                                            ? 'Update Checklist'
                                            : 'Create Checklist'}
                                    </Button>
                                   
                                </div>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default AssignCustomFormPage
