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
}


interface CompanyOption extends SelectOption {
  group_id: number;
}
interface SelectOption {
  value: string;
  label: string;
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
    is: (val: string) => ['applicable', 'not_applicable'].includes(val),
    then: (schema) => schema
      .required('Return copy is required')
      .test('fileSize', 'File size must be less than 20MB', (value) => {
        if (!value) return true;
        return (value as File).size <= 20 * 1024 * 1024;
      })
      .test('fileType', 'Only PDF, Excel, and image files are allowed', (value) => {
        if (!value) return true;
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

const ReturnTrackerAddForm = () => {
  const navigate = useNavigate();
  const [actOptions, setActOptions] = useState<SelectOption[]>([]);
  const [returnOptions, setReturnOptions] = useState<SelectOption[]>([]);
  const [companyGroups, setCompanyGroups] = useState<SelectOption[]>([]);
const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [branches, setBranches] = useState<SelectOption[]>([]);
  const [states, setStates] = useState<SelectOption[]>([]);
  const [districts, setDistricts] = useState<SelectOption[]>([]);
  const [locations, setLocations] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [superadminReturns, setSuperadminReturns] = useState<any[]>([]);
  const [currentGroupId, setCurrentGroupId] = useState<number>(0);


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

      // Extract unique act names
      const uniqueActNames = [...new Set(returnsResponse.data.data.map((ret: any) => ret.act_name))];
      setActOptions(
        uniqueActNames.map((act) => ({
          label: act as string,
          value: act as string,
        }))
      );

      // Load states
      const statesResponse = await httpClient.get(endpoints.common.state());
      setStates(
        statesResponse.data.map((state: any) => ({
          label: state.name,
          value: String(state.id),
        }))
      );
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
      setBranches(
        response.data.data.map((branch: any) => ({
          label: branch.name,
          value: String(branch.id),
        }))
      );
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

 const loadReturnOptions = (actName: string) => {
  try {
    const filteredReturns = superadminReturns.filter(
      (ret) => ret.act_name === actName
    );
    setReturnOptions(
      filteredReturns.map((ret) => ({
        label: ret.return_name,
        value: ret.return_name,
      }))
    );
  } catch (error) {
    console.error('Failed to load return options:', error);
    showNotification('error', 'Failed to load return options');
  }
};

  const getFrequencyForReturn = (actName: string, returnName: string) => {
    const returnData = superadminReturns.find(
      (ret) => ret.act_name === actName && ret.return_name === returnName
    );
    return returnData?.frequency || '';
  };

const handleSubmit = async (values: ReturnFormValues) => {
  try {
    setLoading(true);

    // Convert file to base64
    let returnCopyBase64 = '';
    if (values.return_copy) {
      returnCopyBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Get only the base64 data
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(values.return_copy as Blob); // Explicitly cast to Blob
      });
    }

    // Prepare the submission data
    const submissionData = {
      ...values,
      company_group_id: currentGroupId,
      company_id: Number(values.company_id),
      state_id: values.state_id ? Number(values.state_id) : undefined,
      district_id: values.district_id ? Number(values.district_id) : undefined,
      location_id: values.location_id ? Number(values.location_id) : undefined,
      branch_id: values.branch_id ? Number(values.branch_id) : undefined,
      year: Number(values.year),
      month: values.month ? Number(values.month) : undefined,
      return_copy: returnCopyBase64 || undefined, // Ensure undefined instead of empty string
    };

    // Make the API call
    const response = await httpClient.post(
      endpoints.return.create(),
      submissionData
    );

    if(response) {
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
    company_group_id: 0,
    company_id: 0,
    act_name: '',
    return_name: '',
    frequency: '',
    year: new Date().getFullYear(),
    return_submission: '',
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
        const superadminReturn = superadminReturns.find(
          (ret) =>
            ret.act_name === values.act_name &&
            ret.return_name === values.return_name
        );

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
          setFieldValue('company_group_id', selectedOption.group_id); // Auto-set group_id
          setFieldValue('branch_id', '');
          setBranches([]);
          loadBranches(selectedOption.value);
        }
      }}
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
                          setFieldValue(
                            'act_name',
                            selectedOption ? selectedOption.value : ''
                          );
                          setFieldValue('return_name', '');
                          setFieldValue('frequency', '');
                          setReturnOptions([]);
                          if (selectedOption) {
                            loadReturnOptions(selectedOption.value);
                          }
                        }}
                      />
                    )}
                  </Field>
                  {errors.act_name && touched.act_name && (
                    <p className="text-red-500 text-xs">{errors.act_name}</p>
                  )}
                </div>
              </div>

              {/* 2nd Row: Return Name && State */}
              <div className="grid grid-cols-2 gap-4">
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
                          if (selectedOption) {
                            const selectedReturn = superadminReturns.find(
                              (ret) => 
                                ret.act_name === values.act_name && 
                                ret.return_name === selectedOption.value
                            );
                            if (selectedReturn) {
                              setFieldValue('frequency', selectedReturn.frequency);
                            }
                          }
                        }}
                      />
                    )}
                  </Field>
                  {errors.return_name && touched.return_name && (
                    <p className="text-red-500 text-xs">{errors.return_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    State <span className="text-red-500">*</span>
                  </label>
                  <Field name="state_id">
                    {({ field }: any) => (
                      <OutlinedSelect
                        label="Select State"
                        options={states}
                        value={states.find(
                          (option) => Number(option.value) === values.state_id
                        )}
                        onChange={(selectedOption: SelectOption | null) => {
                          setFieldValue(
                            'state_id',
                            selectedOption ? selectedOption.value : ''
                          );
                          setFieldValue('district_id', '');
                          setFieldValue('location_id', '');
                          setDistricts([]);
                          setLocations([]);
                          if (selectedOption) {
                            loadDistricts(selectedOption.value);
                          }
                        }}
                      />
                    )}
                  </Field>
                  {errors.state_id && touched.state_id && (
                    <p className="text-red-500 text-xs">{errors.state_id}</p>
                  )}
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
                    value={values.frequency || '--'}
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
                      <OutlinedInput
                        label="Enter Year"
                        value={String(values.year)}
                        onChange={(value: string) => {
                          setFieldValue('year', value ? parseInt(value) : '');
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

              {/* 6th Row: Return File Submission && (Submission Date or Not Applicable Reason) */}
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
                        }}
                      />
                    )}
                  </Field>
                  {errors.return_submission && touched.return_submission && (
                    <p className="text-red-500 text-xs">{errors.return_submission}</p>
                  )}
                </div>

                {values.return_submission === 'applicable' ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Submission Date <span className="text-red-500">*</span>
                    </label>
                    <DatePicker
                      size="sm"
                      placeholder="Select Date"
                      value={values.submission_date ? new Date(values.submission_date) : null}
                      onChange={(date) => {
                        setFieldValue('submission_date', date ? date.toISOString() : '');
                      }}
                    />
                    {errors.submission_date && touched.submission_date && (
                      <p className="text-red-500 text-xs">{errors.submission_date}</p>
                    )}
                  </div>
                ) : values.return_submission === 'not_applicable' ? (
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
                ) : null}
              </div>

              {/* 7th Row: (Delay Reason if applicable) && Return Copy */}
              <div className="grid grid-cols-2 gap-4">
                {values.return_submission === 'applicable' && values.submission_date && superadminReturn?.due_dates && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Delay Reason{' '}
                      {new Date(values.submission_date) > new Date(superadminReturn.due_dates.first_due_date) ? (
                        <span className="text-red-500">*</span>
                      ) : null}
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Return Copy (PDF/Zip/Image, Max 20MB){' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="file"
                    size="sm"
                    className="w-full"
                    accept=".pdf,.jpg,.zip,.jpeg,.png"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFieldValue('return_copy', file);
                      } else {
                        setFieldValue('return_copy', null);
                      }
                    }}
                  />
                  {errors.return_copy && touched.return_copy && (
                    <p className="text-red-500 text-xs">{errors.return_copy}</p>
                  )}
                </div>
              </div>

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