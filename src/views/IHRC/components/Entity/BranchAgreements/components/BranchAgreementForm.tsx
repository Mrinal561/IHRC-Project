import React, { useEffect, useState } from 'react';
import { endpoints } from '@/api/endpoint';
import httpClient from '@/api/http-client';
import { Button, Checkbox, Input, toast, Notification } from '@/components/ui';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import OutlinedInput from '@/components/ui/OutlinedInput';
import { Field, Formik, Form } from 'formik';
import { IoArrowBack } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import SubCategoryAutosuggest from './SubCategoryAutosuggest';
import DatePicker from '@/components/ui/DatePicker/DatePicker';
import { format } from 'date-fns';
import AgreementTypeAutosuggest from './AgreementTypeAutosuggest';

interface SelectOption {
  value: string;
  label: string;
}

interface BranchData extends SelectOption {
  officeType?: string;
}

interface LocationState {
  companyName?: string;
  companyId?: string;
}

interface BranchAgreement {
    branch_id?: number;
    agreement_type?: string;
    sub_category?: string;
    owner_name?: string;
    partner_name?: string;
    partner_number?: string;
    start_date?: string;
    end_date?: string;
    applicable_for_all?: boolean;
    agreement_document?: string;
}

interface FormValues {
    companyGroup: string;
    company: string;
    branch: string;
    agreementType: string;
    subCategory: string;
    owner_id: string;
    partnerName: string;
    partnerContact: string;
    startDate: string;
    endDate: string;
    agreementDocument: File | null;
    applicableForAllCompany: boolean;
  }
  

const validationSchema = Yup.object().shape({
    companyGroup: Yup.string().required('Company Group is required'),
    company: Yup.string().required('Company is required'),
    branch: Yup.string().required('Branch is required'),
    agreementType: Yup.string().required('Agreement Type is required'),
    subCategory: Yup.string().required('Sub Category is required'),
    // ownerName: Yup.string().required('Owner Name is required'),
    owner_id: Yup.string().required('Owner Name is required'),
    partnerName: Yup.string().required('Partner Name is required'),
    partnerContact: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .required('Partner Contact is required'),
    startDate: Yup.date().required('Start Date is required'),
    endDate: Yup.date()
      .min(Yup.ref('startDate'), 'End date must be after start date')
      .required('End Date is required'),
      agreementDocument: Yup.mixed()
      .required('Agreement Document is required')
      .test('fileRequired', 'Agreement Document is required', (value) => {
        return value !== null && value !== undefined;
      })
      .test('fileSize', 'File size must be less than 20MB', (value) => {
        if (!value) return true; // Skip size validation if no file
        return value instanceof File && value.size <= 20 * 1024 * 1024;
      })
      .test('fileType', 'Only PDF, ZIP, and image files are allowed', (value) => {
        if (!value) return true; // Skip type validation if no file
        if (!(value instanceof File)) return false;
        const allowedTypes = ['application/pdf', 'application/zip', 'image/jpeg', 'image/png', 'image/gif'];
        return allowedTypes.includes(value.type);
      }),
    applicableForAllCompany: Yup.boolean()
});

const BranchAgreementForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;
  const [users, setUsers] = useState<SelectOption[]>([]);
  const [companyGroups, setCompanyGroups] = useState('');
  const [companies, setCompanies] = useState<SelectOption[]>([]);
  const [branchData, setBranchData] = useState<BranchData[]>([]);
  const [currentBranchData, setCurrentBranchData] = useState<any>(null);
  const [subCategories, setSubCategories] = useState<SelectOption[]>([]);
  const [companyGroupId, setCompanyGroupId] = useState('');
  const [agreementDocument, setAgreementDocument] = useState<File | null>(null);
  const [isLoadingSubCategories, setIsLoadingSubCategories] = useState(false);
const [subCategoryInput, setSubCategoryInput] = useState('');
const [loading, setLoading] = useState(false)
  const [formdata, setFormData] = useState<BranchAgreement>({
    branch_id: 0,
    agreement_type: '',
    sub_category: '',
    owner_name: '',
    partner_name: '',
    partner_number: '',
    start_date: '',
    end_date: '',
    applicable_for_all: false,
    agreement_document: '',
  })
  

  const showNotification = (type: 'success' | 'info' | 'danger' | 'warning' | 'error', message: string) => {
    toast.push(
      <Notification title={type.charAt(0).toUpperCase() + type.slice(1)} type={type} closable={true}>
        {message}
      </Notification>
    );
  };

  const loadCompanyGroups = async () => {
    try {
      const { data } = await httpClient.get(endpoints.companyGroup.getAll(), {
        params: { ignorePlatform: true }
      });
      if (data.data && data.data.length > 0) {
        const defaultGroup = data.data[0];
        setCompanyGroups(defaultGroup.name);
        setCompanyGroupId(defaultGroup.id);
        loadCompanies(defaultGroup.id);
      }
    } catch (error) {
      console.error('Failed to load company groups:', error);
      showNotification('error', 'Failed to load company groups');
    }
  };

  useEffect(() => {
    loadCompanyGroups();
  }, []);

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
      showNotification('error', 'Failed to load companies');
    }
  };

  const loadBranches = async (selectedCompany: SelectOption | string) => {
    const companyId = typeof selectedCompany === 'object' ? selectedCompany.value : selectedCompany;
    
    try {
      const { data } = await httpClient.get(endpoints.branch.getAllBranch(), {
        params: {
          'company_id[]': companyId
        }
      });
      
      const formattedBranches = data?.data?.map((branch: any) => ({
        label: `${branch.name} (${branch.Location?.name}/${branch.District?.name}/${branch.State?.name})`,
        value: String(branch.id),
        officeType: branch.office_type,
        ...branch // Keep all branch data
      }));

      setBranchData(formattedBranches || []);
    } catch (error) {
      console.error('Failed to load branches:', error);
      showNotification('error', 'Failed to load branches');
    }
  };
  const handleCompanySelect = (selectedOption: SelectOption, setFieldValue: any) => {
    // Check if selectedOption is valid
    if (!selectedOption) return;
  
    // Update both the field value and load branches
    setFieldValue('company', selectedOption.value);
    setCurrentBranchData(null);
    setFieldValue('branch', '');
    loadBranches(selectedOption);
  };
  
  const handleBranchSelect = (selectedOption: SelectOption, setFieldValue: any) => {
    // Check if selectedOption is valid
    if (!selectedOption) return;
  
    const branch = branchData.find(b => b.value === selectedOption.value);
    if (branch) {
      setCurrentBranchData(branch);
      setFieldValue('branch', selectedOption.value);
      loadUsers(selectedOption.value);

    }
  };
  const loadUsers = async (branchId: string) => {
    try {
      const { data } = await httpClient.get(endpoints.user.getAll(), {
        params: { 'branch_id[]': branchId }
      });
      const formattedUsers = data?.data?.map((user: any) => ({
        label: user.user_details.name,
        value: user.user_details.id.toString()
      }));
      setUsers(formattedUsers || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      showNotification('error', 'Failed to load users');
    }
  };

  const initialValues: FormValues = {
    companyGroup: companyGroupId,
    company: '',
    branch: '',
    agreementType: '',
    subCategory: '',
    owner_id: '',
    partnerName: '',
    partnerContact: '',
    startDate: '',
    endDate: '',
    agreementDocument: null,
    applicableForAllCompany: false
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Split the result to get only the base64 data (without the mime type)
        const base64Data = (reader.result as string).split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };
  


  const handleFormSubmit = async (
    values: FormValues, 
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    console.log("form submisiion")
    try {
      setLoading(true)
      if (!values.agreementDocument) {
        showNotification('error', 'Agreement document is required');
        return;
      }
  
      // Convert file to base64
      let base64Document = '';
      if (values.agreementDocument instanceof File) {
        base64Document = await convertFileToBase64(values.agreementDocument);
      }
  
      const startDate = new Date(values.startDate);
      const endDate = new Date(values.endDate);
  
      const requestBody = {
        branch_id: parseInt(values.branch, 10),
        agreement_type: values.agreementType,
        sub_category: values.subCategory,
        owner_id: parseInt(values.owner_id, 10),
        partner_name: values.partnerName,
        partner_number: values.partnerContact,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        applicable_for_all: values.applicableForAllCompany,
        agreement_document: base64Document,
      };
  
      const response = await httpClient.post(
        endpoints.branchAgreement.create(),
        requestBody
      );
  
      // Log response for debugging
      console.log('API Response:', response);
  
      // Only show success and navigate if we get here (no error thrown)
      showNotification('success', 'Branch agreement created successfully');
      navigate('/agreements');
  
    } catch (error: any) {
      console.error('Failed to submit form:', error);
      
      // More detailed error logging
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
  
      if (error.response?.data?.message && Array.isArray(error.response.data.message)) {
        error.response.data.message.forEach((message: string) => {
          showNotification('error', message);
        });
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to create branch agreement';
        showNotification('error', errorMessage);
      }
    } finally {
      setSubmitting(false);
      setLoading(false)
    }
  };
return (
    <div className="p-2 bg-white rounded-lg">
      <div className="flex gap-2 items-center mb-3">
        <Button
          size="sm"
          variant="plain"
          icon={<IoArrowBack className="text-gray-500 hover:text-gray-700" />}
          onClick={() => navigate('/agreements')}
        />
        <h3 className="text-2xl font-semibold">Add Agreement</h3>
      </div>

      <Formik<FormValues>
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize={true}
      >
        {({ errors, touched, values, setFieldValue, isSubmitting }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Company Group - Read only */}
                            <div className="space-y-2">
                            <label htmlFor="companyGroup">Company Group</label>
                <OutlinedInput
                  label="Company Group"
                  value={companyGroups}
                  onChange={() => {}}
                />
              </div>

              {/* Company Select */}
              <div className="space-y-2">
              <label htmlFor="company">Select Company <span className="text-red-500">*</span></label>

                <OutlinedSelect
                  label="Select Company"
                  options={companies}
                  value={companies.find(option => option.value === values.company) || null}
                  onChange={(selectedOption) => handleCompanySelect(selectedOption, setFieldValue)}
                />
                {errors.company && touched.company && (
                  <p className="text-red-500 text-sm">{errors.company}</p>
                )}
              </div>

              {/* Branch Select */}
              <div className="space-y-2">
              <label htmlFor="branch">Branch <span className="text-red-500">*</span></label>
                <OutlinedSelect
                  label="Select Branch"
                  options={branchData}
                  value={branchData.find(option => option.value === values.branch) || null}
                  onChange={(selectedOption) => handleBranchSelect(selectedOption, setFieldValue)}
                />
                {errors.branch && touched.branch && (
                  <p className="text-red-500 text-sm">{errors.branch}</p>
                )}
              </div>

              {/* Office Type */}
              {currentBranchData?.office_type && (
                <div className="space-y-2">
                  <label htmlFor="officeType">Office Type</label>
                  <OutlinedInput
                    label="Office Type"
                    value={currentBranchData.office_type === 'coorporate_office' 
                      ? 'Corporate Office' 
                      : currentBranchData.office_type}
                    onChange={() => {}}
                  />
                </div>
              )}
             {/* Agreement Type */}
          <div className="space-y-2">
            <AgreementTypeAutosuggest
              value={values.agreementType}
              onChange={(value) => setFieldValue('agreementType', value)}
              onAgreementTypeSelect={(value) => {
                setFieldValue('agreementTypeId', value);
              }}
              isDisabled={isSubmitting}
            />
            {errors.agreementType && touched.agreementType && (
              <p className="text-red-500 text-sm">{errors.agreementType}</p>
            )}
          </div>

              {/* Sub Category */}
              <div className="space-y-2">
                <SubCategoryAutosuggest
                  value={values.subCategory}
                  onChange={(value) => setFieldValue('subCategory', value)}
                  onSubCategorySelect={(value) => {
                    setFieldValue('subCategoryId', value);
                  }}
                  isDisabled={isSubmitting}
                />
                {errors.subCategory && touched.subCategory && (
                  <p className="text-red-500 text-sm">{errors.subCategory}</p>
                )}
              </div>

             
{/* Owner Name */}
          <div className="space-y-2">
            <label htmlFor="owner_id">Owner Name <span className="text-red-500">*</span></label>
            <OutlinedSelect
              label="Select Owner"
              options={users}
              value={users.find(option => option.value === values.owner_id) || null}
              onChange={(selectedOption) => {
                if (selectedOption) {
                  setFieldValue('owner_id', selectedOption.value);
                }
              }}
            />
           {errors.owner_id && touched.owner_id && (
    <p className="text-red-500 text-sm">{errors.owner_id}</p>
  )}
          </div>

              {/* Partner Name */}
              <div className="space-y-2">
              <label htmlFor="partnerName">Partner Name <span className="text-red-500">*</span></label>
                <Field name="partnerName">
                  {({ field, form }) => (
                    <OutlinedInput
                      label="Enter Partner Name"
                      value={field.value}
                      onChange={(value) => {
                        if (typeof value === 'string') {
                          form.setFieldValue('partnerName', value);
                        } else if (value?.target?.value) {
                          form.setFieldValue('partnerName', value.target.value);
                        }
                      }}
                      onBlur={field.onBlur}
                    />
                  )}
                </Field>
                {errors.partnerName && touched.partnerName && (
                  <p className="text-red-500 text-sm">{errors.partnerName}</p>
                )}
              </div>

              {/* Partner Contact */}
              <div className="space-y-2">
              <label htmlFor="partnerContact">Partner Contact No.<span className="text-red-500">*</span></label>
                <Field name="partnerContact">
                  {({ field, form }) => (
                    <OutlinedInput
                      label="Enter Partner Contact No."
                      value={field.value}
                      onChange={(value) => {
                        if (typeof value === 'string') {
                          form.setFieldValue('partnerContact', value);
                        } else if (value?.target?.value) {
                          form.setFieldValue('partnerContact', value.target.value);
                        }
                      }}
                    //   onBlur={field.onBlur}
                    />
                  )}
                </Field>
                {errors.partnerContact && touched.partnerContact && (
                  <p className="text-red-500 text-sm">{errors.partnerContact}</p>
                )}
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <label htmlFor="startDate">Agreement Start Date <span className="text-red-500">*</span></label>
                <DatePicker
                  size="sm"
                  placeholder="Select Start Date"
                  onChange={(date) => {
                    setFieldValue('startDate', date ? format(date, 'yyyy-MM-dd') : '');
                  }}
                  inputFormat="DD-MM-YYYY"  // Changed to uppercase format tokens
                  yearLabelFormat="YYYY"
                  monthLabelFormat="MMMM YYYY"
                />
                {errors.startDate && touched.startDate && (
                  <p className="text-red-500 text-sm">{errors.startDate}</p>
                )}
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label htmlFor="endDate">Agreement End Date <span className="text-red-500">*</span></label>
                <DatePicker
                  size="sm"
                  placeholder="Select End Date"
                  onChange={(date) => {
                    setFieldValue('endDate', date ? format(date, 'yyyy-MM-dd') : '');
                  }}
                  minDate={values.startDate ? new Date(values.startDate) : undefined}
                  inputFormat="DD-MM-YYYY"  // Changed to uppercase format tokens
                  yearLabelFormat="YYYY"
                  monthLabelFormat="MMMM YYYY"
                />
                {errors.endDate && touched.endDate && (
                  <p className="text-red-500 text-sm">{errors.endDate}</p>
                )}
              </div>

              {/* Agreement Document */}
              <div className="space-y-2">
                <label htmlFor="agreementDocument">Agreement Document (PDF/Zip/Image, Max 20MB) <span className="text-red-500">*</span></label>
                <Input
                  id="agreementDocument"
                  name="agreementDocument"
                  type="file"
                  accept=".pdf,.zip,.jpeg,.jpg,.png,.gif"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      if (file.size > 20 * 1024 * 1024) {
                        showNotification('danger', 'File size exceeds 20MB limit');
                        event.target.value = '';
                        return;
                      }
                      setFieldValue('agreementDocument', file);
                    }
                  }}
                  onClick={(event) => {
                    (event.target as HTMLInputElement).value = '';
                  }}
                />
                {errors.agreementDocument && touched.agreementDocument && (
                  <p className="text-red-500 text-sm">{errors.agreementDocument}</p>
                )}
                {/* {values.agreementDocument && (
                  <div className="text-sm text-gray-600">
                    Selected file: {values.agreementDocument.name}
                  </div>
                )} */}
              </div>
            </div>

            {/* Applicable for all company */}
            {currentBranchData?.office_type === 'coorporate_office' && (
              <div className="col-span-2">
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={values.applicableForAllCompany}
                    onChange={(checked) => setFieldValue('applicableForAllCompany', checked)}
                  />
                  <span>Applicable for all branches</span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-2">
             
              <Button
                        type="button"
                        variant="plain"
                        // size="sm"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </Button>
                    <Button 
                type="submit" 
                variant='solid'
                disabled={isSubmitting}
                loading={loading}
              >
                Confirm
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BranchAgreementForm