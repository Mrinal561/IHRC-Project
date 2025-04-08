
import React, { useEffect, useState } from 'react';
import AdaptableCard from '@/components/shared/AdaptableCard';
import { Button, Dialog, toast, Notification } from '@/components/ui';
import { HiDownload, HiPlusCircle } from 'react-icons/hi';
import OutlinedInput from '@/components/ui/OutlinedInput';
import { useDispatch } from 'react-redux';
import { showErrorNotification } from '@/components/ui/ErrorMessage';
import { createRole, fetchRoles } from '@/store/slices/role/roleSlice';
import RoleTable from './components/RoleTable';
import * as yup from 'yup';
import BulkUpload from './components/BulkUpload';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
// import RoleTable from './components/RoleTable';


interface CompanyDetails {
  id: number
  name: string
  group_id: number
}

const roleSchema = yup.object().shape({
  name: yup
    .string()
    .required('Designation name is required')
    // .min(3, 'Role name must be at least 3 characters')/
    .max(50, 'Designation name must not exceed 50 characters')
    .matches(/^\S.*\S$|^\S$/,'The input must not have leading or trailing spaces')
  });

  interface CompanyDetails {
    id: number
    name: string
    group_id: number
  }

  
const Role = () => {
  const dispatch = useDispatch();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [key, setKey] = useState(0);
  const [formData, setFormData] = useState({
    name: ''
  });
  const [errors, setErrors] = useState({
    name: ''
  });
   const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null)

  const refreshData = () => {
    setKey(prev => prev + 1);
  };

  const handleInputChange = (field: string, value: string) => {
    setIsTouched(true);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  const fetchRoleData = async (page = 1, pageSize = 10) => {
    setIsLoading(true);
    try {
      const data = await dispatch(fetchRoles());
      setRoleData(data.payload.data);
      console.log('Role Data:', data.payload);
    } catch (error) {
      console.error('Error fetching role data:', error);
      showErrorNotification('Failed to fetch Designation data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Initial Role Management Rendering");
    fetchRoleData();
  }, [key]);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setFormData({
      name: ''
    });
    setErrors({ name: '' });
    setIsTouched(false);
  };


  useEffect(() => {
    if (isTouched) {
      validateForm();
    }
  }, [formData.name, isTouched]);


  const validateForm = async () => {
    try {
      await roleSchema.validate(formData, { abortEarly: false });
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const validationErrors = {};
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path] = error.message;
          }
        });
        setErrors(validationErrors);
      }
      return false;
    }
  };

  const showSuccessNotification = (message) => {
    toast.push(
        <Notification title="Success" type="success">
            {message}
        </Notification>
    );
};



  const handleConfirm = async () => {
    const isValid = await validateForm();
    if(!isValid) return;
    setIsLoading(true);
    try {
      const result = await dispatch(createRole(formData))
        .unwrap()
        .catch((error: any) => {
          
          throw error;
        });

        if (result) {
          handleDialogClose();
          showSuccessNotification('Designation Created successfully');
          refreshData();
      }
    } catch (error) {
      console.error('Error creating role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!companyDetails) {
        toast.push(
            <Notification title="Error" type="error">
                Company details not loaded
            </Notification>
        )
        return
    }

    try {
        const params = new URLSearchParams()
        // params.append('company_id[]', companyDetails.id.toString())
        params.append('group_id[]', companyDetails.group_id.toString())

        const response = await httpClient.get(
            endpoints.role.download(), 
            {
                params,
                responseType: 'blob'
            }
        )

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'designation_data.xlsx')
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)

        toast.push(
            <Notification title="Success" type="success">
                Designation data downloaded successfully
            </Notification>
        )
    } catch (error) {
        console.error('Download failed:', error)
        toast.push(
            <Notification title="Error" type="error">
                Failed to download Designation data
            </Notification>
        )
    }
}

const fetchCompanyData = async () => {
  try {
      // Use your existing company endpoint to get the first company
      const response = await httpClient.get(endpoints.company.getAll())
      console.log('Company data:', response.data.data)
      const companies = response.data.data
      
      if (companies && companies.length > 0) {
          const firstCompany = companies[0]
          setCompanyDetails({
              id: firstCompany.id,
              name: firstCompany.name,
              group_id: firstCompany.group_id // Ensure this field exists in your API response
          })
      }
  } catch (error) {
      console.error('Failed to fetch company details:', error)
      toast.push(
          <Notification title="Error" type="error">
              Failed to load company information
          </Notification>
      )
  }
}

useEffect(() => {
  fetchCompanyData()
}, [])


  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div className="mb-4 lg:mb-0">
          <h3 className="text-2xl font-bold">Designation</h3>
        </div>
        <div className='flex gap-2'>
          <Button variant='solid' size='sm' icon={<HiDownload />} onClick={handleDownload}>Download</Button>
<div>
  <BulkUpload />
</div>
        <div className="flex gap-2">
          <Button
            variant="solid"
            size="sm"
            icon={<HiPlusCircle />}
            onClick={() => setIsDialogOpen(true)}
            >
            Add Designation
          </Button>
        </div>
            </div>
      </div>

      <RoleTable 
        roleData={roleData}
        isLoading={isLoading}
        onDataChange={fetchRoleData}
      />

      <Dialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}  shouldCloseOnOverlayClick={false} 
      >
        <h5 className="mb-6">Add Designation</h5>
        <div className="flex flex-col gap-6">
          <div className="w-full">
            <label className="text-gray-600 mb-2 block">Designation Name <span className="text-red-500">*</span></label>
            <OutlinedInput
              label="Enter Designation Name"
              value={formData.name}
              onChange={(value: string) => handleInputChange('name', value)}
            />
             {errors.name && (
              <div className="text-red-500 text-sm mt-1">{errors.name}</div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="plain"
            onClick={handleDialogClose}
          >
            Cancel
          </Button>
          <Button 
            variant="solid" 
            onClick={handleConfirm}
            loading={isLoading}
          >
            Confirm
          </Button>
        </div>
      </Dialog>
    </AdaptableCard>
  );
};

export default Role;