import React, { useEffect, useState } from 'react';
import { endpoints } from '@/api/endpoint';
import httpClient from '@/api/http-client';
import { Button, Checkbox, Input, toast, Notification, Tooltip } from '@/components/ui';
import OutlinedInput from '@/components/ui/OutlinedInput';
import { Field, Formik, Form } from 'formik';
import { IoArrowBack } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import DatePicker from '@/components/ui/DatePicker/DatePicker';
import { format } from 'date-fns';
import SubCategoryAutosuggest from './SubCategoryAutosuggest';
import { Eye } from 'lucide-react';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import AgreementTypeAutosuggest from './AgreementTypeAutosuggest';


interface SelectOption {
  value: string;
  label: string;
}

interface FormValues {
    agreementType: string;
    ownerName: string;
    partnerName: string;
    partnerContact: string;
    startDate: string;
    endDate: string;
    agreementDocument: File | null;
    existingDocument: string; // Added this
    subCategory: string;
    // Non-editable fields
    companyGroup: string;
    company: string;
    branch: string;
    applicableForAllCompany: boolean;
  }
  interface SelectOption {
    value: string;
    label: string;
  }
const validationSchema = Yup.object().shape({
  agreementType: Yup.string().required('Agreement Type is required'),
  ownerName: Yup.string().required('Owner Name is required'),
  partnerName: Yup.string().required('Partner Name is required'),
  partnerContact: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Partner Contact is required'),
  startDate: Yup.date().required('Start Date is required'),
  endDate: Yup.date()
    .min(Yup.ref('startDate'), 'End date must be after start date')
    .required('End Date is required'),
  subCategory: Yup.string().required('Sub Category is required'),
  agreementDocument: Yup.mixed()
    .test('fileSize', 'File size must be less than 20MB', (value) => {
      if (!value || !(value instanceof File)) return true;
      return value.size <= 20 * 1024 * 1024;
    })
    .test('fileType', 'Only PDF, ZIP, and image files are allowed', (value) => {
      if (!value || !(value instanceof File)) return true;
      const allowedTypes = ['application/pdf', 'application/zip', 'image/jpeg', 'image/png', 'image/gif'];
      return allowedTypes.includes(value.type);
    }),
});

const BranchAgreementEditForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.agreementId;
  const [loading, setLoading] = useState(true);
  const [branchOfficeType, setBranchOfficeType] = useState('');
  const [companyGroups, setCompanyGroups] = useState<string[]>([]);
  const [companyGroupId, setCompanyGroupId] = useState('');
  const [branchData, setBranchData] = useState([]);
  const [currentBranchData, setCurrentBranchData] = useState<any>(null);
  const [initialValues, setInitialValues] = useState<FormValues>({
    agreementType: '',
    ownerName: '',
    partnerName: '',
    partnerContact: '',
    startDate: '',
    endDate: '',
    agreementDocument: null,
    existingDocument: '', // Added this
    subCategory: '',
    companyGroup: '',
    company: '',
    branch: '',
    applicableForAllCompany: false,
  });
  const [users, setUsers] = useState<SelectOption[]>([]);


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

  const loadBranches = async (companyId: string) => {
    try {
      const { data } = await httpClient.get(endpoints.branch.getAll(), {
        params: {
          'company_id[]': companyId
        }
      });
      
      const formattedBranches = data?.data?.map((branch: any) => ({
        label: `${branch.name} (${branch.Location?.name}/${branch.District?.name}/${branch.State?.name})`,
        value: String(branch.id),
        officeType: branch.office_type,
        ...branch
      }));

      setBranchData(formattedBranches || []);

      // Find and set current branch data
      const currentBranch = formattedBranches?.find(
        (b: any) => b.value === String(id)
      );
      if (currentBranch) {
        setCurrentBranchData(currentBranch);
      }
    } catch (error) {
      console.error('Failed to load branches:', error);
      showNotification('error', 'Failed to load branches');
    }
  };

  const showNotification = (type: 'success' | 'info' | 'danger' | 'warning' | 'error', message: string) => {
    toast.push(
      <Notification title={type.charAt(0).toUpperCase() + type.slice(1)} type={type} closable={true}>
        {message}
      </Notification>
    );
  };

  const loadInitialData = async () => {
    try {
      const agreementResponse = await httpClient.get(endpoints.branchAgreement.detail(id));
      const agreement = agreementResponse.data.agreement;
      await loadBranches(agreement.Branch.Company.id);
      await loadUsers(agreement.Branch.id); 
      setBranchOfficeType(agreement.Branch.office_type);
      
      setInitialValues({
        agreementType: agreement.agreement_type || '',
        ownerName: agreement.owner_id?.toString() || '',
        partnerName: agreement.partner_name || '',
        partnerContact: agreement.partner_number || '',
        startDate: agreement.start_date || '',
        endDate: agreement.end_date || '',
        agreementDocument: agreement.agreement_document,
        existingDocument: agreement.agreement_document || '',
        subCategory: agreement.sub_category || '',
        companyGroup: agreement.Branch.Company.group_name || '',
        company: agreement.Branch.Company.name || '',
        branch: String(agreement.Branch.id),
        applicableForAllCompany: agreement.applicable_for_all || false,
        
      });
      setCurrentBranchData({
        value: String(agreement.Branch.id),
        label: `${agreement.Branch.name} (${agreement.Branch.Location?.name}/${agreement.Branch.District?.name}/${agreement.Branch.State?.name})`,
        officeType: agreement.Branch.office_type,
        ...agreement.Branch
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to load initial data:', error);
      showNotification('error', 'Failed to load agreement data');
    }
  };

  useEffect(() => {
    if (id) {
      loadInitialData();
    }
  }, [id]);

  const handleFormSubmit = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      let base64Document = '';
      if (values.agreementDocument instanceof File) {
        base64Document = await convertFileToBase64(values.agreementDocument);
      }
  
      const requestBody = {
        branch_id: parseInt(values.branch, 10), 
        agreement_type: values.agreementType,
        owner_id: parseInt(values.ownerName, 10), 
        partner_name: values.partnerName,
        partner_number: values.partnerContact,
        start_date: format(new Date(values.startDate), 'yyyy-MM-dd'),
        end_date: format(new Date(values.endDate), 'yyyy-MM-dd'),
        sub_category: values.subCategory,
        applicable_for_all: values.applicableForAllCompany
      };
  
      // Only include document if a new one was uploaded
      if (base64Document) {
        requestBody['agreement_document'] = base64Document;
      }
  
      await httpClient.put(
        endpoints.branchAgreement.update(id),
        requestBody
      );
  
      showNotification('success', 'Agreement updated successfully');
      navigate('/agreements');
    } catch (error) {
      console.error('Failed to update agreement:', error);
      showNotification('error', 'Failed to update agreement');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Add the convertFileToBase64 function if it's not already there
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Data = (reader.result as string).split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
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
        // loadCompanies(defaultGroup.id);
      }
    } catch (error) {
      console.error('Failed to load company groups:', error);
      showNotification('error', 'Failed to load company groups');
    }
  };

  useEffect(() => {
    loadCompanyGroups();
  }, []);

  const handleDocumentView = (existingDocument: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (existingDocument) {
      const fullPath = `${import.meta.env.VITE_API_GATEWAY}/${existingDocument}`;
      window.open(fullPath, '_blank');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="p-2 bg-white rounded-lg">
      <div className="flex gap-2 items-center mb-3">
        <Button
          size="sm"
          variant="plain"
          icon={<IoArrowBack className="text-gray-500 hover:text-gray-700" />}
          onClick={() => navigate('/agreements')}
        />
        <h3 className="text-2xl font-semibold">Edit Agreement</h3>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({ errors, touched, values, setFieldValue, isSubmitting }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Non-editable fields */}
              <div className="space-y-2">
                <label>Company Group <span className="text-red-500">*</span></label>
                <OutlinedInput 
                  value={companyGroups}
                  disabled 
                />
              </div>

              <div className="space-y-2">
                <label>Company <span className="text-red-500">*</span></label>
                <OutlinedInput 
                  value={values.company}
                  disabled 
                />
              </div>

              <div className="space-y-2">
      <label>Branch <span className="text-red-500">*</span></label>
      <Field name="branch">
        {({ field }) => (
          <OutlinedSelect
          label="Select Branch"
            value={branchData.find(option => option.value === field.value) || null}
            options={branchData}
            onChange={(selectedOption) => {
              const branch = branchData.find(b => b.value === selectedOption.value);
              if (branch) {
                setCurrentBranchData(branch);
                setFieldValue('branch', selectedOption.value);
                setBranchOfficeType(branch.officeType || '');
                loadUsers(selectedOption.id)
                // console.log(selectedOption.id)
              }
            }}
            // isDisabled={true} // Since it's edit form, we keep it disabled
          />
        )}
      </Field>
      {errors.branch && touched.branch && (
        <p className="text-red-500 text-sm">{errors.branch}</p>
      )}
    </div>

              {branchOfficeType && (
                <div className="space-y-2">
                  <label>Office Type</label>
                  <OutlinedInput 
                    value={branchOfficeType === 'coorporate_office' 
                      ? 'Corporate Office' 
                      : currentBranchData.office_type}
                    disabled 
                  />
                </div>
              )}

              {/* Editable fields */}
              <div className="space-y-2">
              {/* <label htmlFor="agreementType">Agreement Type <span className="text-red-500">*</span></label> */}
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

              <div className="space-y-2">
                <label htmlFor="ownerName">Owner Name <span className="text-red-500">*</span></label>
                <Field name="ownerName">
                  {({ field }) => (
                    <OutlinedSelect
                    label="Select Owner"
                    options={users}
                    value={users.find(option => option.value === values.ownerName) || null}
                    onChange={(selectedOption) => {
                      if (selectedOption) {
                        setFieldValue('ownerName', selectedOption.value);
                      }
                    }}
                  />
                  )}
                </Field>
                {errors.ownerName && touched.ownerName && (
                  <p className="text-red-500 text-sm">{errors.ownerName}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="partnerName">Partner Name <span className="text-red-500">*</span></label>
                <Field name="partnerName">
                  {({ field }) => (
                    <OutlinedInput
                      {...field}
                      label="Enter Partner Name"
                      value={field.value}
                      onChange={(value) => setFieldValue('partnerName', value)}
                      error={errors.partnerName && touched.partnerName}
                    />
                  )}
                </Field>
                {errors.partnerName && touched.partnerName && (
                  <p className="text-red-500 text-sm">{errors.partnerName}</p>
                )}
              </div>


              <div className="space-y-2">
                <label htmlFor="partnerContact">Partner Contact No.<span className="text-red-500">*</span></label>
                <Field name="partnerContact">
                  {({ field }) => (
                    <OutlinedInput
                      {...field}
                      label="Enter Partner Contact No."
                      value={field.value}
                      onChange={(value) => setFieldValue('partnerContact', value)}
                      error={errors.partnerContact && touched.partnerContact}
                    />
                  )}
                </Field>
                {errors.partnerContact && touched.partnerContact && (
                  <p className="text-red-500 text-sm">{errors.partnerContact}</p>
                )}
              </div>
              

              <div className="space-y-2">
  <label htmlFor="startDate">Agreement Start Date <span className="text-red-500">*</span></label>
  <DatePicker
    placeholder="Start Date"
    value={values.startDate ? new Date(values.startDate) : null}
    onChange={(date) => setFieldValue('startDate', date ? format(date, 'yyyy-MM-dd') : '')}
    inputFormat="DD-MM-YYYY"  // Changed to uppercase format tokens
    yearLabelFormat="YYYY"
    monthLabelFormat="MMMM YYYY"
  />
  {errors.startDate && touched.startDate && (
    <p className="text-red-500 text-sm">{errors.startDate}</p>
  )}
</div>

<div className="space-y-2">
  <label htmlFor="endDate">Agreement End Date <span className="text-red-500">*</span></label>
  <DatePicker
    placeholder="End Date"
    value={values.endDate ? new Date(values.endDate) : null}
    onChange={(date) => setFieldValue('endDate', date ? format(date, 'yyyy-MM-dd') : '')}
    minDate={values.startDate ? new Date(values.startDate) : undefined}
    inputFormat="DD-MM-YYYY"  // Changed to uppercase format tokens
    yearLabelFormat="YYYY"
    monthLabelFormat="MMMM YYYY"
  />
  {errors.endDate && touched.endDate && (
    <p className="text-red-500 text-sm">{errors.endDate}</p>
  )}
</div>

<div className="space-y-2">
              <label htmlFor="agreementDocument" className="block text-sm font-medium text-gray-700 mb-2">
                Agreement Document
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".pdf,.zip,.jpeg,.jpg,.png,.gif"
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0];
                    if (file) {
                      if (file.size > 20 * 1024 * 1024) {
                        showNotification('error', 'File size exceeds 20MB limit');
                        e.target.value = '';
                        return;
                      }
                      setFieldValue('agreementDocument', file);
                    }
                  }}
                  className="w-full"
                />
                {values.existingDocument && ( 
                <Tooltip title="View Document">
                  <button
                  onClick={handleDocumentView(values.existingDocument)}
                    className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0"
                    title="View Document"
                    type="button"
                  >
                   
                    <Eye size={20} />
                  </button>
                  </Tooltip>
                )}
              </div>
              {errors.agreementDocument && touched.agreementDocument && (
                <p className="text-red-500 text-sm">{errors.agreementDocument}</p>
              )}
            </div>
            </div>

            {/* Applicable for all company checkbox */}
            {branchOfficeType === 'coorporate_office' && (
              <div className="col-span-2">
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={values.applicableForAllCompany}
                    onChange={(checked) => setFieldValue('applicableForAllCompany', checked)}
                  />
                  <span>Applicable for all company</span>
                </label>
              </div>
            )}

            <div className="flex gap-4 justify-end">
             
              <Button
                variant="plain"
                onClick={() => navigate('/agreements')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} variant="solid">
                Confirm
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BranchAgreementEditForm;

