

import React, { useState, useEffect } from 'react';
import { Dialog, Button, DatePicker, toast, Notification } from '@/components/ui';
import OutlinedInput from '@/components/ui/OutlinedInput';
import OutlinedSelect from '@/components/ui/Outlined';
import { fetchPtrcTrackerById, updatePtrcTracker } from '@/store/slices/ptSetup/ptrcTrackerSlice';
import { useDispatch } from 'react-redux';
import { showErrorNotification } from '@/components/ui/ErrorMessage';
import * as yup from 'yup';

// Add this interface for validation errors
interface ValidationErrors {
  no_of_emp?: string;
  gross_salary?: string;
  total_paid_amt?: string;
  payment_date?: string;
  delay_reason?: string;
  difference_reason?: string;
}

// Add the validation schema
const validationSchema = yup.object().shape({
  no_of_emp: yup
    .number()
    .typeError("Number of employees cannot be zero")
    .required('Number of employees is required')
    .positive('Number of employees must be positive'),
  gross_salary: yup
    .number()
    .typeError("Gross salary cannot be zero")
    .required('Gross salary is required')
    .positive('Gross salary must be positive'),
  total_paid_amt: yup
    .number()
    .typeError("Total paid amount cannot be zero")
    .required('Total paid amount is required')
    .positive('Total paid amount must be positive'),
  payment_date: yup
    .date()
    .required('Payment date is required')
    .max(new Date(), 'Payment date cannot be in the future'),
  delay_reason: yup.string().nullable(),
  difference_reason: yup.string().nullable()
});



interface PTRCTrackerData {
  id: number;
  no_of_emp?: number;
  gross_salary: number;
  total_paid_amt?: number;
  payment_due_date?: string;
  delay_reason?: string;
  differenceInAmount?: number;
  payment_date?: string;
  difference_reason?: string;
}


interface PTRCTrackerEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (editedData: PTRCTrackerData) => void;
  trackerId: number;
    onRefresh: () => void;
}

const PTRCTrackerEditDialog: React.FC<PTRCTrackerEditDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  trackerId,
   onRefresh
}) => {
  const [editedData, setEditedData] = useState<PTRCTrackerData>({
    id: trackerId,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (isOpen && trackerId) {
      fetchTrackerData();
    }
  }, [isOpen, trackerId]);

  const fetchTrackerData = async () => {
    try {
      // setLoading(true);
      const response = await dispatch(fetchPtrcTrackerById(trackerId))
        .unwrap()
        .catch((error: any) => {
          throw error;
        });

      setEditedData(response);
      console.log(editedData);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tracker data:', err);
      setError('Failed to load tracker details');
      setLoading(false);
      openNotification('error', 'Failed to load tracker details');
    }
  };


  const handleChange = (field: keyof PTRCTrackerData, value: string | number) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
    
    validationSchema.validateAt(field, { [field]: value }).catch((err) => {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: err.message
      }));
    });
  };


  const validateForm = async (): Promise<boolean> => {
    try {
      await validationSchema.validate(editedData, { abortEarly: false });
      setValidationErrors({});
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errors: ValidationErrors = {};
        err.inner.forEach((e) => {
          if (e.path) {
            errors[e.path as keyof ValidationErrors] = e.message;
          }
        });
        setValidationErrors(errors);
      }
      return false;
    }
  };

  
  const handleSubmit = async () => {
       try {
        setLoading(true);
        const isValid = await validateForm();
        if (!isValid) {
          openNotification('error', 'Please fix the validation errors');
          return;
        }
    // Create updateData object (matching the original updateTracker data expectation)
    const updateData = {
      payment_date: editedData.payment_date || '',
      delay_reason: editedData.delay_reason || '',
      difference_reason: editedData.difference_reason,
      total_paid_amt: editedData.total_paid_amt,
      no_of_emp: editedData.no_of_emp,
      gross_salary: editedData.gross_salary,
    };

    // Dispatch updateTracker with id and updateData
    const resultAction = await dispatch(updatePtrcTracker({
      id: trackerId, 
      data: updateData // Note: data, not formData
    })) .unwrap()
    .catch((error: any) => {
        throw error; // Re-throw to prevent navigation
    });

    onClose();
    openNotification('success', 'PTRC Tracker edited successfully');
     if (onRefresh) {
      onRefresh();
    }
  } catch (err) {
    console.error('Error submitting tracker data:', err);
    // openNotification('error', 'Failed to save changes');
  } finally {
    setLoading(false);
  }
  };
  
  const formatDateForDisplay = (dateString: string | undefined): Date | undefined => {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    // Adjust for local timezone
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return localDate;
  };
  
  // Helper function to format date for API
  const formatDateForAPI = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };
  
  const handleDateChange = async (field: 'month' | 'dueDate' | 'payment_date', date: Date | null) => {
    if (date) {
      // Format date for API
      const formattedDate = formatDateForAPI(date);
      await handleChange(field, formattedDate);
    }
  };

  const openNotification = (type: 'success' | 'info' | 'error' | 'warning', message: string) => {
    toast.push(
      <Notification
        title={type.charAt(0).toUpperCase() + type.slice(1)}
        type={type}
      >
        {message}
      </Notification>
    )
  }

  const frequencyOptions = [
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Quarterly', label: 'Quarterly' },
    { value: 'Yearly', label: 'Yearly' },
  ];

  const remittanceModeOptions = [
    { value: 'Online', label: 'Online' },
    { value: 'Offline', label: 'Offline' },
  ];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      onRequestClose={onClose}
      width={800}
      height={480}
    >
      <h5 className="mb-4">Edit PT RC Tracker</h5>

      <div className="p-4 space-y-4">
        <div className='flex gap-4 items-center'>
          <div className='flex flex-col gap-2 w-full min-h-[90px]'>
            <label>No. of Employees</label>
            <OutlinedInput
              label="No. of Employees"
              value={editedData.no_of_emp?.toString() || '' }
              onChange={(value) => handleChange('no_of_emp', parseInt(value, 10))}
            />
             {validationErrors.no_of_emp && (
    <p className="text-red-500 text-sm mt-1">{validationErrors.no_of_emp}</p>
  )}
          </div>
          <div className='flex flex-col gap-2 w-full min-h-[90px]'>
            <label>Gross Salary</label>
            <OutlinedInput
              label="Gross Salary"
              value={editedData.gross_salary?.toString() || '' }
              onChange={(value) => handleChange('gross_salary', value)}
            />
             {validationErrors.no_of_emp && (
    <p className="text-red-500 text-sm mt-1">{validationErrors.no_of_emp}</p>
  )}
          </div>
        </div>

        <div className='flex gap-4 items-center'>
         
          <div className='flex flex-col gap-2 w-full min-h-[90px]'>
            <label>Total Amount Paid</label>
            <OutlinedInput
              label="Total Amount Paid"
              value={editedData.total_paid_amt?.toString() || ''  }
              onChange={(value) => handleChange('total_paid_amt', parseFloat(value))}
            />
             {validationErrors.no_of_emp && (
    <p className="text-red-500 text-sm mt-1">{validationErrors.no_of_emp}</p>
  )}
          </div>
          <div className='flex flex-col gap-2 w-full min-h-[90px]'>
            <label>Date of Payment</label>
            <DatePicker
            size='sm'
              placeholder="Date of Payment"
              value={editedData.payment_date ? formatDateForDisplay(editedData.payment_date) : undefined}
              onChange={(date) => handleDateChange('payment_date', date)}
              inputFormat="DD-MM-YYYY"  // Changed to uppercase format tokens
              yearLabelFormat="YYYY"
              monthLabelFormat="MMMM YYYY"
            />
             {validationErrors.no_of_emp && (
    <p className="text-red-500 text-sm mt-1">{validationErrors.no_of_emp}</p>
  )}
          </div>
          <div className='flex flex-col gap-2 w-full min-h-[90px]'>
            <label>Delay Reason</label>
            <OutlinedInput
              label="Delay Reason"
              value={editedData.delay_reason?.toString() || ''  }
              onChange={(value) => handleChange('delay_reason', value)}
            />
             {validationErrors.no_of_emp && (
    <p className="text-red-500 text-sm mt-1">{validationErrors.no_of_emp}</p>
  )}
          </div>
        </div>

        <div className='flex gap-4 items-center'>
        <div className='flex flex-col gap-2 w-full min-h-[90px]'>
            <label>Difference Amount Reason</label>
            <OutlinedInput
              label="Reason"
              value={editedData.difference_reason?.toString() || ''  }
              onChange={(value) => handleChange('difference_reason', value)}
            />
             {validationErrors.no_of_emp && (
    <p className="text-red-500 text-sm mt-1">{validationErrors.no_of_emp}</p>
  )}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button variant="plain" onClick={onClose} className="mr-2">
          Cancel
        </Button>
        <Button variant="solid" onClick={handleSubmit} loading={loading}>
          Confirm
        </Button>
      </div>
    </Dialog>
  );
};

export default PTRCTrackerEditDialog;