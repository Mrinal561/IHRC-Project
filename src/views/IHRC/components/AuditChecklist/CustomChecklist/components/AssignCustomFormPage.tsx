
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button, Notification, toast } from '@/components/ui';
// import { IoArrowBack } from 'react-icons/io5';
// import OutlinedSelect from '@/components/ui/Outlined';
// import OutlinedInput from '@/components/ui/OutlinedInput';

// interface FormData {
//   Compliance_Id: string;
//   Compliance_Categorization: string;
//   Compliance_Header: string;
//   Compliance_Description: string;
//   Compliance_Applicability: string;
//   Compliance_Clause: string;
//   Compliance_Type: string;
//   Compliance_Frequency: string;
//   Compliance_Statutory_Authority: string;
//   Criticality: string;
//   Penalt_Type: string;
//   Scheduled_Frequency:string;
//   Penalty_Description: string;
//   Legislation: string;
//   Applicability: string;
//   Bare_Act_Text: string;

// }

// interface SelectOption {
//   value: string;
//   label: string;
// }

// const AssignCustomFormPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = React.useState<FormData>({
//     Compliance_Id: '',
//     Compliance_Categorization: '',
//     Compliance_Header: '',
//     Compliance_Description: '',
//     Compliance_Applicability: '',
//     Compliance_Clause: '',
//     Compliance_Type: '',
//     Compliance_Frequency: '',
//     Compliance_Statutory_Authority: '',
//     Criticality:'',
//     Penalt_Type:'',
//     Scheduled_Frequency:'',
//     Penalty_Description:'',
//     Legislation:'',
//     Applicability:'',
//     Bare_Act_Text:'',
//   });

//   const openNotification = (type: 'success' | 'info' | 'danger' | 'warning', message: string) => {
//     toast.push(
//       <Notification
//         title={type.charAt(0).toUpperCase() + type.slice(1)}
//         type={type}
//       >
//         {message}
//       </Notification>
//     )
//   }

//   const handleSubmit = () => {
//     console.log(formData);
//     openNotification('success', 'Compliance assigned successfully');
//     navigate(-1);
//   };

//   // Mock options for select fields
//   const categorizationOptions: SelectOption[] = [
//     { value: 'category1', label: 'Category 1' },
//     { value: 'category2', label: 'Category 2' },
//   ];
//   const criticalityOptions: SelectOption[] = [
//     { value: 'low', label: 'Low' },
//     { value: 'medium', label: 'Medium' },
//     { value: 'high', label: 'High' },
//   ];
  
//   const typeOptions: SelectOption[] = [
//     { value: 'type1', label: 'Type 1' },
//     { value: 'type2', label: 'Type 2' },
//   ];

//   const frequencyOptions: SelectOption[] = [
//     { value: 'daily', label: 'Daily' },
//     { value: 'weekly', label: 'Weekly' },
//     { value: 'monthly', label: 'Monthly' },
//     { value: 'yearly', label: 'Yearly' },
//   ];
//   const scheduledOptions: SelectOption[] = [
//     { value: 'monthly', label: 'Monthly' },
//     { value: 'yearly', label: 'Yearly' },
//   ];
//   return (
//     <div className="p-2 bg-white rounded-lg">
//       <div className='flex gap-2 items-center mb-3'>
//         <Button
//           size="sm"
//           variant="plain"
//           icon={<IoArrowBack className="text-[#72828e] hover:text-[#5d6169]" />}
//           onClick={() => navigate(-1)}
//         />
//         <h3 className="text-2xl font-semibold mb-2">Assign Compliance</h3>
//       </div>
//       <div className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//         <div>
//             <p className="mb-2">Compliance Header</p>
//             <OutlinedInput
//               label="Compliance Header"
//               value={formData.Compliance_Header}
//               onChange={(value: string) => {
//                 setFormData(prev => ({ ...prev, Compliance_Header: value }));
//               }}
//             />
//           </div>
//         <div>
//             <p className="mb-2">Compliance Applicability</p>
//             <OutlinedInput
//               label="Compliance Applicability"
//               value={formData.Compliance_Applicability}
//               onChange={(value: string) => {
//                 setFormData(prev => ({ ...prev, Compliance_Applicability: value }));
//               }}
//             />
//           </div>
         
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <p className="mb-2">Compliance Categorization</p>
//             <OutlinedSelect
//               label="Select Categorization"
//               options={categorizationOptions}
//               value={categorizationOptions.find(option => option.value === formData.Compliance_Categorization)}
//               onChange={(selectedOption: SelectOption | null) => {
//                 setFormData(prev => ({
//                   ...prev,
//                   Compliance_Categorization: selectedOption?.value || '',
//                 }));
//               }}
//             />
//           </div>
//           <div>
//             <p className="mb-2">Compliance Clause</p>
//             <OutlinedInput
//               label="Compliance Clause"
//               value={formData.Compliance_Clause}
//               onChange={(value: string) => {
//                 setFormData(prev => ({ ...prev, Compliance_Clause: value }));
//               }}
//             />
//           </div>
//         </div>

//         <div>
//           <p className="mb-2">Compliance Description</p>
//           <OutlinedInput
//             label="Compliance Description"
//             value={formData.Compliance_Description}
//             onChange={(value: string) => {
//               setFormData(prev => ({ ...prev, Compliance_Description: value }));
//             }}
//             textarea={true}
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          
//           <div>
//             <p className="mb-2">Compliance Type</p>
//             <OutlinedSelect
//               label="Select Type"
//               options={typeOptions}
//               value={typeOptions.find(option => option.value === formData.Compliance_Type)}
//               onChange={(selectedOption: SelectOption | null) => {
//                 setFormData(prev => ({
//                   ...prev,
//                   Compliance_Type: selectedOption?.value || '',
//                 }));
//               }}
//             />
//           </div>
//           <div>
//             <p className="mb-2">Compliance Frequency</p>
//             <OutlinedSelect
//               label="Select Frequency"
//               options={frequencyOptions}
//               value={frequencyOptions.find(option => option.value === formData.Compliance_Frequency)}
//               onChange={(selectedOption: SelectOption | null) => {
//                 setFormData(prev => ({
//                   ...prev,
//                   Compliance_Frequency: selectedOption?.value || '',
//                 }));
//               }}
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          
//           <div>
//             <p className="mb-2">Compliance Statutory Authority</p>
//             <OutlinedInput
//               label="Compliance Statutory Authority"
//               value={formData.Compliance_Statutory_Authority}
//               onChange={(value: string) => {
//                 setFormData(prev => ({ ...prev, Compliance_Statutory_Authority: value }));
//               }}
//             />
//           </div>
//           <div>
//             <p className="mb-2">Criticality</p>
//             <OutlinedSelect
//               label="Select Criticality"
//               options={criticalityOptions}
//               value={criticalityOptions.find(option => option.value === formData.Compliance_Frequency)}
//               onChange={(selectedOption: SelectOption | null) => {
//                 setFormData(prev => ({
//                   ...prev,
//                   Criticality: selectedOption?.value || '',
//                 }));
//               }}
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <p className="mb-2">Scheduled Frequency</p>
//             <OutlinedSelect
//               label="Select Scheduled Frequency"
//               options={scheduledOptions}
//               value={scheduledOptions.find(option => option.value === formData.Scheduled_Frequency)}
//               onChange={(selectedOption: SelectOption | null) => {
//                 setFormData(prev => ({
//                   ...prev,
//                   Scheduled_Frequency: selectedOption?.value || '',
//                 }));
//               }}
//             />
//           </div>
//           <div>
//         <p className="mb-2">Penalty Type</p>
//             <OutlinedInput
//               label="Penalty"
//               value={formData.Penalt_Type}
//               onChange={(value: string) => {
//                 setFormData(prev => ({ ...prev, Penalt_Type: value }));
//               }}
//             />
//           </div>
//         </div>
//         <div>
//           <p className="mb-2">Penalty Description</p>
//           <OutlinedInput
//             label="Penalty Description"
//             value={formData.Penalty_Description}
//             onChange={(value: string) => {
//               setFormData(prev => ({ ...prev, Penalty_Description: value }));
//             }}
//             textarea={true}
//           />
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//         <div>
//         <p className="mb-2">Legislation</p>
//             <OutlinedInput
//               label="Legislation"
//               value={formData.Legislation}
//               onChange={(value: string) => {
//                 setFormData(prev => ({ ...prev, Legislation: value }));
//               }}
//             />
//           </div>
//         <div>
//         <p className="mb-2">Applicability</p>
//             <OutlinedInput
//               label="Applicability"
//               value={formData.Applicability}
//               onChange={(value: string) => {
//                 setFormData(prev => ({ ...prev, Applicability: value }));
//               }}
//             />
//           </div>

//         </div>
//         <div>
//           <p className="mb-2">Bare Act Text</p>
//           <OutlinedInput
//             label="Bare Act Text"
//             value={formData.Bare_Act_Text}
//             onChange={(value: string) => {
//               setFormData(prev => ({ ...prev, Bare_Act_Text: value }));
//             }}
//             textarea={true}
//           />
//         </div>
//         <div className="flex justify-end gap-2">
//           <Button type="button" variant="solid" size="sm" onClick={handleSubmit}>
//             Assign Compliance
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








import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Notification, toast } from '@/components/ui';
import { IoArrowBack } from 'react-icons/io5';
import OutlinedSelect from '@/components/ui/Outlined';
import OutlinedInput from '@/components/ui/OutlinedInput';
import { DatePicker } from '@/components/ui/DatePicker';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

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
  due_date_frequency: string;
  due_dates: {
    first_due_date?: string;
    second_due_date?: string;
    third_due_date?: string;
    last_due_date?: string;
  };
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

const AssignCustomFormPage = () => {
  const navigate = useNavigate();
      const location = useLocation();
  
  const [formData, setFormData] = useState<FormData>({
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
    due_date_frequency: 'monthly',
    due_dates: {},
    is_active: true
  });
      const [isLoading, setIsLoading] = useState(true);


  const [loading, setLoading] = useState(false);
  const [showStateField, setShowStateField] = useState(false);
  const [showDateFields, setShowDateFields] = useState(false);
  const [dateFieldsState, setDateFieldsState] = useState({
    isSecondDateEnabled: false,
    isThirdDateEnabled: false,
    isLastDateEnabled: false,
  });
  const [states, setStates] = useState<StateOption[]>([]);
     const [companyGroupName, setCompanyGroupName] = useState('');
    const [companyGroupId, setCompanyGroupId] = useState('');

  // Options for select fields
  const applicableOptions: SelectOption[] = [
    { value: 'central', label: 'Central' },
    { value: 'state', label: 'State' },
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

  // Fetch states data
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


  const showNotification = (
          type: 'success' | 'info' | 'error' | 'warning',
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


  const loadCompanyGroups = async () => {
  try {
    const { data } = await httpClient.get(endpoints.companyGroup.getAll(), {
      params: { ignorePlatform: true },
    });
    
    if (data.data && data.data.length > 0) {
      const defaultGroup = data.data[0];
      setCompanyGroupName(defaultGroup.name);
      setCompanyGroupId(String(defaultGroup.id));
      
      // Update the formData with the fetched group_id
      setFormData(prev => ({
        ...prev,
        group_id: defaultGroup.id  // This is the key change
      }));
    }
  } catch (error) {
    console.error('Error loading company groups:', error);
  } finally {
    setIsLoading(false);
  }
};

       useEffect(() => {
          loadCompanyGroups();
        }, []);
    
  // Handle applicable change to show/hide state field
  useEffect(() => {
    setShowStateField(formData.applicable === 'state');
    if (formData.applicable !== 'state') {
      setFormData(prev => ({ ...prev, state_id: null }));
    }
  }, [formData.applicable]);

  // Handle due date frequency change
  useEffect(() => {
    const frequency = formData.due_date_frequency.toLowerCase();
    const shouldShowDates = !['na', 'one'].includes(frequency);
    setShowDateFields(shouldShowDates);

    if (shouldShowDates) {
      switch (frequency) {
        case 'monthly':
        case 'yearly':
          setDateFieldsState({
            isSecondDateEnabled: false,
            isThirdDateEnabled: false,
            isLastDateEnabled: false
          });
          break;
        case 'half_yearly':
          setDateFieldsState({
            isSecondDateEnabled: false,
            isThirdDateEnabled: false,
            isLastDateEnabled: true
          });
          break;
        case 'quarterly':
          setDateFieldsState({
            isSecondDateEnabled: true,
            isThirdDateEnabled: true,
            isLastDateEnabled: true
          });
          break;
        default:
          setDateFieldsState({
            isSecondDateEnabled: false,
            isThirdDateEnabled: false,
            isLastDateEnabled: false
          });
      }
    } else {
      setFormData(prev => ({
        ...prev,
        due_dates: {}
      }));
    }
  }, [formData.due_date_frequency]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('_due_date')) {
      const dateValue = value ? value.toISOString().split('T')[0] : '';
      setFormData(prev => ({
        ...prev,
        due_dates: {
          ...prev.due_dates,
          [field]: dateValue
        }
      }));
      return;
    }

    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Prepare payload
      const payload = {
        ...formData,
        state_id: formData.applicable === 'state' ? formData.state_id : null
      };

      // Make API call
      const response = await httpClient.post(
        endpoints.compliance.createCustomChecklist(),
        payload
      );

      toast.push(
        <Notification title="Success" type="success">
          Custom checklist created successfully
        </Notification>
      );
      navigate(-1);
    } catch (error: any) {
      console.error('Error creating custom checklist:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create custom checklist';
      toast.push(
        <Notification title="Error" type="error">
          {errorMessage}
        </Notification>
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 bg-white rounded-lg">
      <div className="flex gap-2 items-center mb-3">
        <Button
          size="sm"
          variant="plain"
          icon={<IoArrowBack className="text-[#72828e] hover:text-[#5d6169]" />}
          onClick={() => navigate(-1)}
        />
        <h3 className="text-2xl font-semibold mb-2">Add Custom Checklist</h3>
      </div>
      <div className="space-y-6">
        {/* Group ID */}
        <div>
          <p className="mb-2">Company Group</p>
          <OutlinedInput
                        label="Company Group"
                        value={companyGroupName} 
                        onChange={() => {}}
                        
                    />
        </div>

        {/* Country and Function */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <p className="mb-2">Country</p>
            <OutlinedInput
              label="Country"
              value={formData.country}
              onChange={(value: string) => {
                setFormData(prev => ({ ...prev, country: value }));
              }}
            />
          </div>
          <div>
            <p className="mb-2">Function</p>
            <OutlinedInput
              label="Function"
              value={formData.function}
              onChange={(value: string) => {
                setFormData(prev => ({ ...prev, function: value }));
              }}
            />
          </div>
        </div>

        {/* Applicable and State (conditionally shown) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <p className="mb-2">Applicable</p>
            <OutlinedSelect
              label="Select Applicable"
              options={applicableOptions}
              value={applicableOptions.find(option => option.value === formData.applicable)}
              onChange={(selectedOption: SelectOption | null) => {
                setFormData(prev => ({
                  ...prev,
                  applicable: selectedOption?.value || 'central',
                }));
              }}
            />
          </div>
          {showStateField && (
            <div>
              <p className="mb-2">State</p>
              <OutlinedSelect
                label="Select State"
                options={states}
                value={states.find(option => option.value === formData.state_id)}
                onChange={(selectedOption: StateOption | null) => {
                  setFormData(prev => ({
                    ...prev,
                    state_id: selectedOption?.value || null,
                  }));
                }}
              />
            </div>
          )}
        </div>

        {/* Legislation Act and Compliance Categorization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <p className="mb-2">Legislation Act</p>
            <OutlinedInput
              label="Legislation Act"
              value={formData.legislation_act}
              onChange={(value: string) => {
                setFormData(prev => ({ ...prev, legislation_act: value }));
              }}
            />
          </div>
          <div>
            <p className="mb-2">Compliance Categorization</p>
            <OutlinedInput
              label="Compliance Categorization"
              value={formData.compliance_categorization}
              onChange={(value: string) => {
                setFormData(prev => ({ ...prev, compliance_categorization: value }));
              }}
            />
          </div>
        </div>

        {/* Penalty Type and Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <p className="mb-2">Penalty Type</p>
            <OutlinedInput
              label="Penalty Type"
              value={formData.penalty_type}
              onChange={(value: string) => {
                setFormData(prev => ({ ...prev, penalty_type: value }));
              }}
            />
          </div>
          <div>
            <p className="mb-2">Penalty Description</p>
            <OutlinedInput
              label="Penalty Description"
              value={formData.penalty_description}
              onChange={(value: string) => {
                setFormData(prev => ({ ...prev, penalty_description: value }));
              }}
            />
          </div>
        </div>

        {/* Compliance Header */}
        <div>
          <p className="mb-2">Compliance Header</p>
          <OutlinedInput
            label="Compliance Header"
            value={formData.compliance_header}
            onChange={(value: string) => {
              setFormData(prev => ({ ...prev, compliance_header: value }));
            }}
          />
        </div>

        {/* Compliance Description */}
        <div>
          <p className="mb-2">Compliance Description</p>
          <OutlinedInput
            label="Compliance Description"
            value={formData.compliance_description}
            onChange={(value: string) => {
              setFormData(prev => ({ ...prev, compliance_description: value }));
            }}
            textarea={true}
          />
        </div>

        {/* Compliance Applicability and Reference */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <p className="mb-2">Compliance Applicability</p>
            <OutlinedInput
              label="Compliance Applicability"
              value={formData.compliance_applicability}
              onChange={(value: string) => {
                setFormData(prev => ({ ...prev, compliance_applicability: value }));
              }}
            />
          </div>
          <div>
            <p className="mb-2">Compliance Reference</p>
            <OutlinedInput
              label="Compliance Reference"
              value={formData.compliance_reference}
              onChange={(value: string) => {
                setFormData(prev => ({ ...prev, compliance_reference: value }));
              }}
            />
          </div>
        </div>

        {/* Compliance Type and Frequency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <p className="mb-2">Compliance Type</p>
            <OutlinedInput
              label="Compliance Type"
              value={formData.compliance_type}
              onChange={(value: string) => {
                setFormData(prev => ({ ...prev, compliance_type: value }));
              }}
            />
          </div>
          <div>
            <p className="mb-2">Compliance Frequency</p>
            <OutlinedSelect
              label="Select Frequency"
              options={frequencyOptions}
              value={frequencyOptions.find(option => option.value === formData.compliance_frequency)}
              onChange={(selectedOption: SelectOption | null) => {
                setFormData(prev => ({
                  ...prev,
                  compliance_frequency: selectedOption?.value || 'monthly',
                }));
              }}
            />
          </div>
        </div>

        {/* Criticality and Due Date Frequency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <p className="mb-2">Criticality</p>
            <OutlinedSelect
              label="Select Criticality"
              options={criticalityOptions}
              value={criticalityOptions.find(option => option.value === formData.criticality)}
              onChange={(selectedOption: SelectOption | null) => {
                setFormData(prev => ({
                  ...prev,
                  criticality: selectedOption?.value || 'medium',
                }));
              }}
            />
          </div>
          <div>
            <p className="mb-2">Due Date Frequency</p>
            <OutlinedSelect
              label="Select Due Date Frequency"
              options={dueDateFrequencyOptions}
              value={dueDateFrequencyOptions.find(option => option.value === formData.due_date_frequency)}
              onChange={(selectedOption: SelectOption | null) => {
                setFormData(prev => ({
                  ...prev,
                  due_date_frequency: selectedOption?.value || 'monthly',
                }));
              }}
            />
          </div>
        </div>

        {/* Date fields - conditionally shown */}
        {showDateFields && (
          <>
            {/* First Due Date */}
            <div>
              <p className="mb-2">First Due Date</p>
              <DatePicker
                placeholder="Select first due date"
                value={formData.due_dates.first_due_date ? new Date(formData.due_dates.first_due_date) : null}
                onChange={(date) => handleInputChange('first_due_date', date)}
              />
            </div>

            {/* Second Due Date - conditionally shown */}
            {dateFieldsState.isSecondDateEnabled && (
              <div>
                <p className="mb-2">Second Due Date</p>
                <DatePicker
                  placeholder="Select second due date"
                  value={formData.due_dates.second_due_date ? new Date(formData.due_dates.second_due_date) : null}
                  onChange={(date) => handleInputChange('second_due_date', date)}
                />
              </div>
            )}

            {/* Third Due Date - conditionally shown */}
            {dateFieldsState.isThirdDateEnabled && (
              <div>
                <p className="mb-2">Third Due Date</p>
                <DatePicker
                  placeholder="Select third due date"
                  value={formData.due_dates.third_due_date ? new Date(formData.due_dates.third_due_date) : null}
                  onChange={(date) => handleInputChange('third_due_date', date)}
                />
              </div>
            )}

            {/* Last Due Date - conditionally shown */}
            {dateFieldsState.isLastDateEnabled && (
              <div>
                <p className="mb-2">Last Due Date</p>
                <DatePicker
                  placeholder="Select last due date"
                  value={formData.due_dates.last_due_date ? new Date(formData.due_dates.last_due_date) : null}
                  onChange={(date) => handleInputChange('last_due_date', date)}
                />
              </div>
            )}
          </>
        )}

        {/* Submit and Cancel buttons */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="solid" size="sm" onClick={handleSubmit} loading={loading}>
            Create Checklist
          </Button>
          <Button type="button" variant="plain" size="sm" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssignCustomFormPage;