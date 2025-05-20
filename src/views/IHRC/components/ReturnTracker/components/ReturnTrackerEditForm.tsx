import React, { useState, useEffect } from 'react';
import { Button, DatePicker, Input, Notification, toast } from '@/components/ui';
import OutlinedSelect from '@/components/ui/Outlined';
import OutlinedInput from '@/components/ui/OutlinedInput/OutlinedInput';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';

interface ReturnFormValues {
  company_group_id: number;
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

const validationSchema = Yup.object().shape({
  company_id: Yup.number().required('Company is required').min(1, 'Please select a company'),
  act_name: Yup.string().required('Act Name is required'),
  return_name: Yup.string().required('Return Name is required'),
  state_id: Yup.number().required('State is required').min(1, 'Please select a state'),
  district_id: Yup.number().required('District is required').min(1, 'Please select a district'),
  location_id: Yup.number().required('Location is required').min(1, 'Please select a location'),
  branch_id: Yup.number().required('Branch is required').min(1, 'Please select a branch'),
  frequency: Yup.string().required('Frequency is required'),
  year: Yup.number().required('Year is required').min(2000, 'Invalid year').max(2100, 'Invalid year'),
  month: Yup.number().when('frequency', {
    is: (frequency: string) => ['monthly', 'quarterly', 'half_yearly'].includes(frequency),
    then: (schema) => schema.required('Month is required').min(1, 'Invalid month').max(12, 'Invalid month'),
  }),
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
});

const ReturnTrackerEditForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState<ReturnFormValues>({
    company_group_id: 0,
    company_id: 0,
    act_name: '',
    return_name: '',
    state_id: 0,
    district_id: 0,
    location_id: 0,
    branch_id: 0,
    frequency: '',
    year: new Date().getFullYear(),
    month: undefined,
    return_submission: '',
  });
  const [loading, setLoading] = useState(false);
  const [superadminReturns, setSuperadminReturns] = useState<any[]>([]);
  const [companyGroups, setCompanyGroups] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [branches, setBranches] = useState([]);
  const [actOptions, setActOptions] = useState([]);
  const [returnOptions, setReturnOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch the return data to edit
        const returnResponse = await httpClient.get(endpoints.return.detail(id));
        const returnData = returnResponse.data;
        
        // Fetch superadmin returns for validation
        const superadminResponse = await httpClient.get(endpoints.return.getList());
        setSuperadminReturns(superadminResponse.data.data);
        
        // Fetch all necessary options
        const groupsResponse = await httpClient.get(endpoints.companyGroup.getAll());
        setCompanyGroups(groupsResponse.data.data);
        
        const companiesResponse = await httpClient.get(endpoints.company.getAll());
        setCompanies(companiesResponse.data.data);
        
        const statesResponse = await httpClient.get(endpoints.common.state());
        setStates(statesResponse.data);
        
        const actsResponse = await httpClient.get(endpoints.return.returnActList());
        setActOptions(actsResponse.data);
        
        // Set initial values
        setInitialValues({
          company_group_id: returnData.company_group_id,
          company_id: returnData.company_id,
          act_name: returnData.act_name,
          return_name: returnData.return_name,
          state_id: returnData.state_id,
          district_id: returnData.district_id,
          location_id: returnData.location_id,
          branch_id: returnData.branch_id,
          frequency: returnData.frequency,
          year: returnData.year,
          month: returnData.month,
          return_submission: returnData.return_submission,
          submission_date: returnData.submission_date,
          delay_reason: returnData.delay_reason,
          not_applicable_reason: returnData.not_applicable_reason,
          return_copy: null, // We'll handle file separately
        });
        
        // Load dependent data
        if (returnData.state_id) {
          const districtsResponse = await httpClient.get(endpoints.common.district(), {
            params: { 'state_id[]': returnData.state_id }
          });
          setDistricts(districtsResponse.data);
        }
        
        if (returnData.district_id) {
          const locationsResponse = await httpClient.get(endpoints.common.location(), {
            params: { 'district_id[]': returnData.district_id }
          });
          setLocations(locationsResponse.data);
        }
        
        if (returnData.company_id) {
          const branchesResponse = await httpClient.get(endpoints.branch.getAllBranch(), {
            params: { 'company_id[]': returnData.company_id }
          });
          setBranches(branchesResponse.data.data);
        }
        
        // Load return options for the selected act
        if (returnData.act_name) {
          const filteredReturns = superadminResponse.data.data.filter(
            (ret: any) => ret.act_name === returnData.act_name
          );
          setReturnOptions(filteredReturns.map((ret: any) => ({
            label: ret.return_name,
            value: ret.return_name,
          })));
        }
        
      } catch (error) {
        console.error('Failed to load data:', error);
        toast.push(
          <Notification title="Error" type="error">
            Failed to load return data
          </Notification>
        );
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, navigate]);

  const loadDistricts = async (stateId: string) => {
    try {
      const response = await httpClient.get(endpoints.common.district(), {
        params: { 'state_id[]': stateId },
      });
      setDistricts(response.data);
    } catch (error) {
      console.error('Failed to load districts:', error);
    }
  };

  const loadLocations = async (districtId: string) => {
    try {
      const response = await httpClient.get(endpoints.common.location(), {
        params: { 'district_id[]': districtId },
      });
      setLocations(response.data);
    } catch (error) {
      console.error('Failed to load locations:', error);
    }
  };

  const loadBranches = async (companyId: string) => {
    try {
      const response = await httpClient.get(endpoints.branch.getAllBranch(), {
        params: { 'company_id[]': companyId },
      });
      setBranches(response.data.data);
    } catch (error) {
      console.error('Failed to load branches:', error);
    }
  };

  const loadReturnOptions = (actName: string) => {
    const filteredReturns = superadminReturns.filter(
      (ret) => ret.act_name === actName
    );
    setReturnOptions(
      filteredReturns.map((ret) => ({
        label: ret.return_name,
        value: ret.return_name,
      }))
    );
  };

  const handleSubmit = async (values: ReturnFormValues) => {
    try {
      setLoading(true);
      
      // Convert file to base64 if new file was selected
      let returnCopyBase64 = '';
      if (values.return_copy) {
        returnCopyBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
          reader.onerror = (error) => {
            reject(error);
          };
          reader.readAsDataURL(values.return_copy as Blob);
        });
      }

      // Prepare the submission data
      const submissionData = {
        ...values,
        company_group_id: Number(values.company_group_id),
        company_id: Number(values.company_id),
        state_id: Number(values.state_id),
        district_id: Number(values.district_id),
        location_id: Number(values.location_id),
        branch_id: Number(values.branch_id),
        year: Number(values.year),
        month: values.month ? Number(values.month) : undefined,
        return_copy: returnCopyBase64 || undefined,
      };

      // Make the API call to update
      const response = await httpClient.put(
        endpoints.return.update(id),
        submissionData
      );

      toast.push(
        <Notification title="Success" type="success">
          Return updated successfully
        </Notification>
      );
      navigate(-1);
    } catch (error: any) {
      console.error('Failed to update return:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update return';
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

      {loading ? (
        <div>Loading...</div>
      ) : (
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
            // Find the superadmin return data for validation
            const superadminReturn = superadminReturns.find(
              (ret) =>
                ret.act_name === values.act_name &&
                ret.return_name === values.return_name
            );

            return (
              <Form>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Company Group <span className="text-red-500">*</span>
                      </label>
                      <OutlinedInput
                        label="Company Group"
                        value={companyGroups.find(g => g.id === values.company_group_id)?.name || ''}
                        onChange={() => {}}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Company <span className="text-red-500">*</span>
                      </label>
                      <OutlinedSelect
                        label="Select Company"
                        options={companies.map((c: any) => ({
                          label: c.name,
                          value: String(c.id),
                        }))}
                        value={companies.find((c: any) => Number(c.id) === values.company_id)}
                        onChange={(selectedOption: any) => {
                          setFieldValue('company_id', selectedOption ? selectedOption.value : '');
                          setFieldValue('branch_id', '');
                          setBranches([]);
                          if (selectedOption) {
                            loadBranches(selectedOption.value);
                          }
                        }}
                      />
                      {errors.company_id && touched.company_id && (
                        <p className="text-red-500 text-xs">{errors.company_id}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Act Name <span className="text-red-500">*</span>
                      </label>
                      <OutlinedSelect
                        label="Select Act Name"
                        options={actOptions.map((act: any) => ({
                          label: act.act_name,
                          value: act.act_name,
                        }))}
                        value={actOptions.find((act: any) => act.act_name === values.act_name)}
                        onChange={(selectedOption: any) => {
                          setFieldValue('act_name', selectedOption ? selectedOption.value : '');
                          setFieldValue('return_name', '');
                          setFieldValue('frequency', '');
                          setReturnOptions([]);
                          if (selectedOption) {
                            loadReturnOptions(selectedOption.value);
                          }
                        }}
                      />
                      {errors.act_name && touched.act_name && (
                        <p className="text-red-500 text-xs">{errors.act_name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Return Name <span className="text-red-500">*</span>
                      </label>
                      <OutlinedSelect
                        label="Select Return Name"
                        options={returnOptions}
                        value={returnOptions.find(opt => opt.value === values.return_name)}
                        onChange={(selectedOption: any) => {
                          setFieldValue('return_name', selectedOption ? selectedOption.value : '');
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
                      {errors.return_name && touched.return_name && (
                        <p className="text-red-500 text-xs">{errors.return_name}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        State <span className="text-red-500">*</span>
                      </label>
                      <OutlinedSelect
                        label="Select State"
                        options={states.map((state: any) => ({
                          label: state.name,
                          value: String(state.id),
                        }))}
                        value={states.find((state: any) => Number(state.id) === values.state_id)}
                        onChange={(selectedOption: any) => {
                          setFieldValue('state_id', selectedOption ? selectedOption.value : '');
                          setFieldValue('district_id', '');
                          setFieldValue('location_id', '');
                          setDistricts([]);
                          setLocations([]);
                          if (selectedOption) {
                            loadDistricts(selectedOption.value);
                          }
                        }}
                      />
                      {errors.state_id && touched.state_id && (
                        <p className="text-red-500 text-xs">{errors.state_id}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        District <span className="text-red-500">*</span>
                      </label>
                      <OutlinedSelect
                        label="Select District"
                        options={districts.map((district: any) => ({
                          label: district.name,
                          value: String(district.id),
                        }))}
                        value={districts.find((district: any) => Number(district.id) === values.district_id)}
                        onChange={(selectedOption: any) => {
                          setFieldValue('district_id', selectedOption ? selectedOption.value : '');
                          setFieldValue('location_id', '');
                          setLocations([]);
                          if (selectedOption) {
                            loadLocations(selectedOption.value);
                          }
                        }}
                      />
                      {errors.district_id && touched.district_id && (
                        <p className="text-red-500 text-xs">{errors.district_id}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <OutlinedSelect
                        label="Select Location"
                        options={locations.map((location: any) => ({
                          label: location.name,
                          value: String(location.id),
                        }))}
                        value={locations.find((location: any) => Number(location.id) === values.location_id)}
                        onChange={(selectedOption: any) => {
                          setFieldValue('location_id', selectedOption ? selectedOption.value : '');
                        }}
                      />
                      {errors.location_id && touched.location_id && (
                        <p className="text-red-500 text-xs">{errors.location_id}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Branch <span className="text-red-500">*</span>
                      </label>
                      <OutlinedSelect
                        label="Select Branch"
                        options={branches.map((branch: any) => ({
                          label: branch.name,
                          value: String(branch.id),
                        }))}
                        value={branches.find((branch: any) => Number(branch.id) === values.branch_id)}
                        onChange={(selectedOption: any) => {
                          setFieldValue('branch_id', selectedOption ? selectedOption.value : '');
                        }}
                      />
                      {errors.branch_id && touched.branch_id && (
                        <p className="text-red-500 text-xs">{errors.branch_id}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Frequency <span className="text-red-500">*</span>
                      </label>
                      <OutlinedInput
                        label="Frequency"
                        value={values.frequency}
                        onChange={() => {}}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Year <span className="text-red-500">*</span>
                      </label>
                      <OutlinedInput
                        label="Year"
                        value={String(values.year)}
                        onChange={(value) => {
                          setFieldValue('year', value ? parseInt(value) : '');
                        }}
                      />
                      {errors.year && touched.year && (
                        <p className="text-red-500 text-xs">{errors.year}</p>
                      )}
                    </div>
                  </div>

                  {['monthly', 'quarterly', 'half_yearly'].includes(values.frequency) && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Month <span className="text-red-500">*</span>
                        </label>
                        <OutlinedInput
                          label="Month (1-12)"
                          value={values.month ? String(values.month) : ''}
                          onChange={(value) => {
                            setFieldValue('month', value ? parseInt(value) : '');
                          }}
                        />
                        {errors.month && touched.month && (
                          <p className="text-red-500 text-xs">{errors.month}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Return File Submission <span className="text-red-500">*</span>
                      </label>
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
                                label: values.return_submission === 'applicable' ? 'Applicable' : 'Not Applicable',
                              }
                            : null
                        }
                        onChange={(selectedOption: any) => {
                          setFieldValue('return_submission', selectedOption ? selectedOption.value : '');
                        }}
                      />
                      {errors.return_submission && touched.return_submission && (
                        <p className="text-red-500 text-xs">{errors.return_submission}</p>
                      )}
                    </div>
                  </div>

                  {values.return_submission === 'applicable' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
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

                        {values.submission_date && superadminReturn?.due_dates && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Delay Reason{' '}
                              {new Date(values.submission_date) > new Date(superadminReturn.due_dates.first_due_date) ? (
                                <span className="text-red-500">*</span>
                              ) : null}
                            </label>
                            <OutlinedInput
                              label="Enter Delay Reason"
                              value={values.delay_reason || ''}
                              onChange={(value) => {
                                setFieldValue('delay_reason', value);
                              }}
                            />
                            {errors.delay_reason && touched.delay_reason && (
                              <p className="text-red-500 text-xs">{errors.delay_reason}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {values.return_submission === 'not_applicable' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Not Applicable Reason <span className="text-red-500">*</span>
                        </label>
                        <OutlinedInput
                          label="Enter Not Applicable Reason"
                          value={values.not_applicable_reason || ''}
                          onChange={(value) => {
                            setFieldValue('not_applicable_reason', value);
                          }}
                        />
                        {errors.not_applicable_reason && touched.not_applicable_reason && (
                          <p className="text-red-500 text-xs">{errors.not_applicable_reason}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Return Copy (PDF/Zip/Image, Max 20MB) {values.return_submission && (
                          <span className="text-red-500">*</span>
                        )}
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

                  <div className="flex justify-end gap-2 pt-8">
                    <Button
                      type="button"
                      variant="plain"
                      onClick={() => navigate(-1)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="solid"
                      loading={isSubmitting}
                      disabled={!isValid || isSubmitting}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
};

export default ReturnTrackerEditForm;