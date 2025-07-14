import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button, Input, DatePicker, toast, Notification } from '@/components/ui';
import OutlinedSelect from '@/components/ui/Outlined';
import OutlinedInput from '@/components/ui/OutlinedInput/OutlinedInput';
import { IoArrowBack } from 'react-icons/io5';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FaEye } from 'react-icons/fa';
import { Tooltip } from '@/components/ui';



interface ReturnFormValues {
  company_id: number;
  act_name: string;
  return_name: string;
  state_id?: number;
  district_id?: number;
  location_id?: number;
  branch_id?: number;
  frequency: string;
  year: number;
  month?: number;
  return_submission: string;
  submission_date?: string;
  delay_reason?: string;
  return_copy?: File | null;
  not_applicable_reason?: string;
  existing_file_url?: string;
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
      .test('fileSize', 'File size must be less than 20MB', (value) => {
        if (!value || typeof value === 'string') return true;
        return (value as File).size <= 20 * 1024 * 1024;
      })
      .test('fileType', 'Only PDF, Excel, and image files are allowed', (value) => {
        if (!value || typeof value === 'string') return true;
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
  }),
  month: Yup.number().when('frequency', {
    is: (frequency: string) => ['monthly', 'quarterly', 'half_yearly'].includes(frequency),
    then: (schema) => schema.required('Month is required').min(1, 'Invalid month').max(12, 'Invalid month'),
  }),
});

const ReturnTrackerEditForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { returnTrackerId } = location.state || {};
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
  const [dataLoading, setDataLoading] = useState(true);
  const [viewDocumentModal, setViewDocumentModal] = useState(false);
const [documentUrl, setDocumentUrl] = useState('');
  const [superadminReturns, setSuperadminReturns] = useState<SuperadminReturn[]>([]);
  const [currentGroupId, setCurrentGroupId] = useState<number>(0);
  const [allIndianStates, setAllIndianStates] = useState<SelectOption[]>([]);
  const [initialValues, setInitialValues] = useState<ReturnFormValues>({
    company_id: 0,
    act_name: '',
    return_name: '',
    state_id: undefined,
    frequency: '',
    year: new Date().getFullYear(),
    return_submission: '',
  });

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
   // Update the loadInitialData function in ReturnTrackerEditForm.tsx
const loadInitialData = async () => {
  if (!returnTrackerId) {
    showNotification('error', 'No return ID provided');
    navigate('/return-tracker');
    return;
  }

  try {
    setLoading(true);
    
    // 1. First load all the static data needed for options
    const statesResponse = await httpClient.get(endpoints.common.state());
    const allStates = statesResponse.data.map((state: any) => ({
      label: state.name,
      value: String(state.id),
    }));
    setAllIndianStates(allStates);

    // Load superadmin returns for act names and return names
    const superadminResponse = await httpClient.get(endpoints.return.getList());
    setSuperadminReturns(superadminResponse.data.data);

    // Prepare act options
    const uniqueActs = new Map<string, boolean>();
    const actOptionsList: SelectOption[] = [];

    superadminResponse.data.data.forEach((ret: SuperadminReturn) => {
      if (ret.applicable === 'CENTRAL') {
        if (!uniqueActs.has(ret.act_name)) {
          actOptionsList.push({
            label: ret.act_name,
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

    // 2. Now load the return data
    const returnResponse = await httpClient.get(endpoints.return.detail(returnTrackerId));
    const returnData = returnResponse.data.data;

    // Construct the act value correctly
    const actValue = returnData.state_id 
      ? `${returnData.act_name}||${returnData.state_id}`
      : `${returnData.act_name}||CENTRAL`;

    // Find the matching superadmin return to get the applicable type
    const matchingSuperadminReturn = superadminResponse.data.data.find(
      ret => ret.act_name === returnData.act_name && 
             ret.return_name === returnData.return_name
    );

    // Load return options for the selected act
    const returnOptions = superadminResponse.data.data
      .filter(ret => {
        if (returnData.state_id) {
          return ret.act_name === returnData.act_name && 
                 (ret.applicable === 'ALL_STATES' || 
                  (ret.applicable === 'STATE' && ret.state_id === returnData.state_id));
        } else {
          return ret.act_name === returnData.act_name && 
                 ret.applicable === 'CENTRAL';
        }
      })
      .map(ret => ({
        label: ret.return_name,
        value: ret.return_name,
      }));

    setReturnOptions(returnOptions);

    // Load company groups
    const groupsResponse = await httpClient.get(endpoints.companyGroup.getAll());
    setCompanyGroups(
      groupsResponse.data.data.map((group: any) => ({
        label: group.name,
        value: String(group.id),
      }))
    );

    // Load companies
    const companiesResponse = await httpClient.get(endpoints.company.getAll(), {
      params: { 'group_id[]': returnData.company_group_id }
    });
    setCompanies(
      companiesResponse.data.data.map((company: any) => ({
        label: company.name,
        value: String(company.id),
        group_id: company.group_id,
      }))
    );
    setCurrentGroupId(returnData.company_group_id);

    // Load branches
    const branchesResponse = await httpClient.get(endpoints.branch.getAllBranch(), {
      params: { 'company_id[]': returnData.company_id }
    });
     const branchesData = branchesResponse.data.data.map((branch: any) => ({
      label: branch.name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' '),
      value: String(branch.id),
      location_id: branch.location_id,
    }));
    setAllBranches(branchesData);

    // Load districts if state exists
    if (returnData.state_id) {
      const districtsResponse = await httpClient.get(endpoints.common.district(), {
        params: { 'state_id[]': returnData.state_id }
      });
      setDistricts(
        districtsResponse.data.map((district: any) => ({
          label: district.name,
          value: String(district.id),
        }))
      );
    }

    // Load locations if district exists
    if (returnData.district_id) {
      const locationsResponse = await httpClient.get(endpoints.common.location(), {
        params: { 'district_id[]': returnData.district_id }
      });
      setLocations(
        locationsResponse.data.map((location: any) => ({
          label: location.name,
          value: String(location.id),
        }))
      );
    }

    // Filter branches based on location
    if (returnData.location_id) {
      const filteredBranches = branchesData.filter(
        branch => Number(branch.location_id) === Number(returnData.location_id)
      );
      setBranches(filteredBranches);
    }

    // Format act_name value correctly
   const initialActValue = returnData.state_id 
  ? `${returnData.act_name.split('||')[0]}||${returnData.state_id}`
  : `${returnData.act_name}||CENTRAL`;

    // Set initial values after all options are loaded
    setInitialValues({
  company_id: returnData.company_id,
  act_name: initialActValue,
  return_name: returnData.return_name,
  state_id: returnData.state_id || undefined,
  district_id: returnData.district_id || undefined,
  location_id: returnData.location_id || undefined,
  branch_id: returnData.branch_id || undefined,
  frequency: returnData.frequency,
  year: returnData.year,
  month: returnData.month || undefined,
  return_submission: returnData.return_submission,
  submission_date: returnData.submission_date || undefined,
  delay_reason: returnData.delay_reason || undefined,
  not_applicable_reason: returnData.not_applicable_reason || undefined,
  return_copy: returnData.return_copy || undefined,
  existing_file_url: returnData.return_copy,
});

    // Load return options for the selected act
    loadReturnOptions(returnData.act_name, returnData.state_id ? String(returnData.state_id) : 'CENTRAL');

  } catch (error) {
    console.error('Failed to load initial data:', error);
    showNotification('error', 'Failed to load return data');
    navigate('/return-tracker');
  } finally {
    setLoading(false);
    setDataLoading(false);
  }
};

    loadInitialData();
  }, [returnTrackerId, navigate]);

  const loadBranches = async (companyId: string) => {
    try {
      const response = await httpClient.get(endpoints.branch.getAllBranch(), {
        params: { 'company_id[]': companyId },
      });
      const branchesData = response.data.data.map((branch: any) => ({
        label: branch.name,
        value: String(branch.id),
        location_id: branch.location_id,
      }));
      setAllBranches(branchesData);
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

    const options = filteredReturns.map(ret => ({
      label: ret.return_name,
      value: ret.return_name,
    }));

    console.log('Return options:', options); // Debug log
    setReturnOptions(options);
  } catch (error) {
    console.error('Failed to load return options:', error);
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

// const handleSubmit = async (values: ReturnFormValues) => {
//     try {
//       setLoading(true);
//       console.log('Submitting values:', values); 

//       // Convert file to base64 if a new file was selected
//       let returnCopyBase64 = '';
//       if (values.return_copy && typeof values.return_copy !== 'string') {
//         returnCopyBase64 = await new Promise<string>((resolve, reject) => {
//           const reader = new FileReader();
//           reader.onload = () => {
//             const result = reader.result as string;
//             resolve(result.split(',')[1]);
//           };
//           reader.onerror = (error) => {
//             reject(error);
//           };
//           reader.readAsDataURL(values.return_copy as Blob);
//         });
//       } else if (values.return_copy && typeof values.return_copy === 'string') {
//         // Keep the existing file URL if no new file was uploaded
//         returnCopyBase64 = values.return_copy;
//       }

//       // Split act_name to remove state ID
//       const [actName] = values.act_name.split('||');

//       // Prepare the submission data
//       const submissionData = {
//         ...values,
//         act_name: actName, // Use only the act name part
//         company_group_id: currentGroupId,
//         company_id: Number(values.company_id),
//         state_id: values.state_id ? Number(values.state_id) : undefined,
//         district_id: values.district_id ? Number(values.district_id) : undefined,
//         location_id: values.location_id ? Number(values.location_id) : undefined,
//         branch_id: values.branch_id ? Number(values.branch_id) : undefined,
//         year: Number(values.year),
//         month: values.month ? Number(values.month) : undefined,
//         return_copy: returnCopyBase64 || undefined,
//         return_submission: values.return_submission,
//         submission_date: values.submission_date,
//         delay_reason: values.delay_reason,
//         not_applicable_reason: values.not_applicable_reason
//       };

//       // Make the API call to update
//       const response = await httpClient.put(
//         endpoints.return.update(returnTrackerId),
//         submissionData
//       );

//       showNotification('success', 'Return updated successfully');
//       navigate('/return-tracker');
//     } catch (error: any) {
//       console.error('Failed to update return:', error);
//       const errorMessage = error.response?.data?.message || 'Failed to update return';
//       showNotification('error', errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };



const handleSubmit = async (values: ReturnFormValues) => {
  try {
    setLoading(true);
    
    // Get only the changed values
    const changedValues = getChangedValues(values, initialValues);

    // Prepare the minimal submission data
    const submissionData: any = {
      ...changedValues,
      updated_at: new Date().toISOString()
    };

    // Handle file upload if changed
    if (changedValues.return_copy && typeof changedValues.return_copy !== 'string') {
      submissionData.return_copy = await convertFileToBase64(changedValues.return_copy as File);
    } else if (!changedValues.return_copy && values.existing_file_url) {
      // Keep existing file if no new file was uploaded
      submissionData.return_copy = values.existing_file_url;
    }

    // Split act_name if it was changed
    if (changedValues.act_name) {
      submissionData.act_name = values.act_name.split('||')[0];
    }

    // Convert number fields if they were changed
    if (changedValues.company_id) submissionData.company_id = Number(changedValues.company_id);
    if (changedValues.state_id) submissionData.state_id = Number(changedValues.state_id);
    if (changedValues.district_id) submissionData.district_id = Number(changedValues.district_id);
    if (changedValues.location_id) submissionData.location_id = Number(changedValues.location_id);
    if (changedValues.branch_id) submissionData.branch_id = Number(changedValues.branch_id);
    if (changedValues.year) submissionData.year = Number(changedValues.year);
    if (changedValues.month) submissionData.month = Number(changedValues.month);

    // Make the API call to update
    const response = await httpClient.put(
      endpoints.return.update(returnTrackerId),
      submissionData
    );

    if(response){
      showNotification('success', 'Return updated successfully');
      navigate('/return-tracker');
    }
  } catch (error: any) {
    console.error('Failed to update return:', error);
    const errorMessage = error.response?.data?.message || 'Failed to update return';
    showNotification('error', errorMessage);
  } finally {
    setLoading(false);
  }
};

// Helper function to get only changed values
const getChangedValues = (values: any, initialValues: any) => {
  const changes: any = {};
  Object.keys(values).forEach(key => {
    if (JSON.stringify(values[key]) !== JSON.stringify(initialValues[key])) {
      changes[key] = values[key];
    }
  });
  return changes;
};

// Helper function to convert file to base64
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

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

  // Generate year options (current year and past 4 years)
  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return {
      label: String(year),
      value: year,
    };
  });


  if (dataLoading) {
    return (
      <div className="w-full mx-auto p-2 bg-white rounded-lg">
        <div className="flex gap-2 items-center mb-3">
          <Button
            size="sm"
            variant="plain"
            icon={<IoArrowBack className="text-gray-500 hover:text-gray-700" />}
            onClick={() => navigate(-1)}
          />
          <h3 className="text-2xl font-semibold">Edit Return Details</h3>
        </div>
        <div>Loading return data...</div>
      </div>
    );
  }



  return (
    <div className="w-full mx-auto p-2 bg-white rounded-lg">
      <div className="flex gap-2 items-center mb-3">
        <Button
          size="sm"
          variant="plain"
          icon={<IoArrowBack className="text-gray-500 hover:text-gray-700" />}
          onClick={() => navigate(-1)}
        />
        <h3 className="text-2xl font-semibold">Edit Return Details</h3>
      </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            setFieldTouched,
            isValid,
            isSubmitting,
          }) => {
            // Parse act_name and state_id from values.act_name
            const [selectedActName, selectedStateId] = values.act_name ? values.act_name.split('||') : ['', ''];
            
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

            // Filter branches based on selected location
            useEffect(() => {
              if (values.location_id && allBranches.length > 0) {
                const filteredBranches = allBranches.filter(
                  branch => Number(branch.location_id) === Number(values.location_id)
                );
                setBranches(filteredBranches);
              } else {
                setBranches([]);
              }
            }, [values.location_id, allBranches]);

            return (
              <Form>
                <div className="space-y-6">
                  {/* 1st Row: Company && Act Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
    <label className="text-sm font-medium">
      Company <span className="text-red-500">*</span>
    </label>
    <OutlinedInput
      label="Company"
      value={initialValues.company_id ? 
        companies.find(c => Number(c.value) === initialValues.company_id)?.label || '--' 
        : '--'}
      onChange={() => {}}
    />
  </div>

                     <div className="space-y-2">
    <label className="text-sm font-medium">
      Act Name <span className="text-red-500">*</span>
    </label>
    <OutlinedInput
      label="Act Name"
      value={initialValues.act_name.split('||')[0]} // Extract just the act name part
      onChange={() => {}}
    />
  </div>
                  </div>

                  {/* 2nd Row: Return Name && State */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        State <span className="text-red-500">*</span>
                      </label>
                      <OutlinedInput
                        label="State"
                        value={
                          selectedStateId === 'CENTRAL' 
                            ? 'CENTRAL' 
                            : allIndianStates.find(s => s.value === selectedStateId)?.label || '--'
                        }
                        onChange={() => {}}
                      />
                      <Field name="state_id" type="hidden" />
                    </div>

                   <div className="space-y-2">
    <label className="text-sm font-medium">
      Return Name <span className="text-red-500">*</span>
    </label>
    <OutlinedInput
      label="Return Name"
      value={initialValues.return_name || '--'}
      onChange={() => {}}
    />
  </div>
                  </div>

                  {/* 3rd Row: District && Location */}
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
                            }}
                          />
                        )}
                      </Field>
                      {errors.location_id && touched.location_id && (
                        <p className="text-red-500 text-xs">{errors.location_id}</p>
                      )}
                    </div>
                  </div>

                  {/* 4th Row: Branch && Frequency */}
                  <div className="grid grid-cols-2 gap-4">
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

                  {/* 5th Row: Year && (Month if applicable) */}
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
                                setFieldValue('month', value ? parseInt(value) : '');
                              }}
                            />
                          )}
                        </Field>
                        {errors.month && touched.month && (
                          <p className="text-red-500 text-xs">{errors.month}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 6th Row: Return File Submission */}
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
                              // Clear file when switching to not_applicable
                              if (selectedOption?.value === 'not_applicable') {
                                setFieldValue('return_copy', null);
                                setFieldValue('submission_date', '');
                                setFieldValue('delay_reason', '');
                              }
                            }}
                          />
                        )}
                      </Field>
                      {errors.return_submission && touched.return_submission && (
                        <p className="text-red-500 text-xs">{errors.return_submission}</p>
                      )}
                    </div>

                    {/* Conditional fields based on return_submission */}
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
                              inputFormat='DD-MM-YYYY'
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
                            />
                          )}
                        </Field>
                        {errors.not_applicable_reason && touched.not_applicable_reason && (
                          <p className="text-red-500 text-xs">{errors.not_applicable_reason}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 7th Row: Conditional fields for applicable returns */}
                  {values.return_submission === 'applicable' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Return Copy (PDF/Zip/Image, Max 20MB) {values.return_submission && (
                              <span className="text-red-500">*</span>
                            )}
                          </label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              size="md"
                              className="w-full"
                              accept=".pdf,.jpg,.zip,.jpeg,.png"
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setFieldValue('return_copy', file);
                                } else {
                                  setFieldValue('return_copy', values.existing_file_url || null);
                                }
                              }}
                            />
                          {values.existing_file_url && (
  <Tooltip title="View Document">
    <Button
      className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(`${import.meta.env.VITE_API_GATEWAY}/${values.existing_file_url}`, '_blank');
      }}
      icon={<FaEye />}
      variant="plain"
    />
  </Tooltip>
)}
                          </div>
                          {errors.return_copy && touched.return_copy && (
                            <p className="text-red-500 text-xs">{errors.return_copy}</p>
                          )}
                        </div>
                        {/* Delay reason (only shown if submission is delayed) */}
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
                      Update
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

export default ReturnTrackerEditForm;