import React, { useState } from 'react';
import { Button, Input, FormItem } from '@/components/ui';
import { RegisterSetupData } from '../RegisterSetupPage';
import * as yup from 'yup';

interface RegisterSetupEditPanelProps {
  initialData: RegisterSetupData;
  onClose: () => void;
  onSubmit: (data: RegisterSetupData) => void;
  isLoading: boolean;
}

interface FormData {
  name_of_industry: string;
  address: string;
  name_of_employer: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const registerSetupSchema = yup.object().shape({
  name_of_industry: yup.string().required('Name of Industry is required'),
  address: yup.string().required('Address is required'),
  name_of_employer: yup.string().required('Name of Employer is required'),
});

const RegisterSetupEditPanel: React.FC<RegisterSetupEditPanelProps> = ({
  initialData,
  onClose,
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState<FormData>({
    name_of_industry: initialData.name_of_industry,
    address: initialData.address,
    name_of_employer: initialData.name_of_employer
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = async () => {
    try {
      await registerSetupSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (yupError) {
      if (yupError instanceof yup.ValidationError) {
        const newErrors: ValidationErrors = {};
        yupError.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = await validateForm();
    if (!isValid) return;

    setLoading(true);
    try {
      const submitData: RegisterSetupData = {
        ...initialData,
        ...formData
      };
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <FormItem label="Company" className="mb-4">
            <Input
              type="text"
              value={initialData.Company?.name || 'N/A'}
              disabled
              className="bg-gray-50"
            />
          </FormItem>

          <FormItem label="Name of Industry" className="mb-4">
            <Input
              type="text"
              value={formData.name_of_industry}
              onChange={(e) => handleChange('name_of_industry', e.target.value)}
              placeholder="Enter name of industry"
            />
            {errors.name_of_industry && (
              <p className="text-red-500 text-xs mt-1">{errors.name_of_industry}</p>
            )}
          </FormItem>

          <FormItem label="Address" className="mb-4">
            <Input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Enter address"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </FormItem>

          <FormItem label="Name of Employer" className="mb-6">
            <Input
              type="text"
              value={formData.name_of_employer}
              onChange={(e) => handleChange('name_of_employer', e.target.value)}
              placeholder="Enter name of employer"
            />
            {errors.name_of_employer && (
              <p className="text-red-500 text-xs mt-1">{errors.name_of_employer}</p>
            )}
          </FormItem>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="plain"
            onClick={onClose}
            disabled={loading || isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="solid"
            loading={loading || isLoading}
          >
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterSetupEditPanel;