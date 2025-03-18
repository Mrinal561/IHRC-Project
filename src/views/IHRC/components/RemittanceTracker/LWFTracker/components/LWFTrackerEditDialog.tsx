
import React, { useState, useEffect } from 'react';
import { Dialog, Button, DatePicker, toast, Notification } from '@/components/ui';
import OutlinedInput from '@/components/ui/OutlinedInput';
import OutlinedSelect from '@/components/ui/Outlined';
import { useDispatch } from 'react-redux';
import { showErrorNotification } from '@/components/ui/ErrorMessage';
import { fetchLwfTrackerById, updateLwfTracker } from '@/store/slices/lwfTracker/lwfTracker';
import * as Yup from 'yup';


interface LWFTrackerData {
  id: number;
  receipt_no?: string;
  total_paid_amt?: number | null;
  delay_in_days?: string;
  delay_reason?: string;
  difference_reason?: string;
  payment_date?: string;
}
interface ValidationErrors {
  [key: string]: string;
}

const validationSchema = Yup.object().shape({
  receipt_no: Yup.string()
    .required('Receipt number is required'),
  total_paid_amt: Yup.number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .required('Total paid amount is required')
    .min(0, 'Total paid amount must be greater than or equal to 0'),
  payment_date: Yup.string()
    .required('Payment date is required'),
  // delay_reason: Yup.string()
  // .required('Delay reason is required')
  //   .when('delay_in_days', {
  //     is: (delay_in_days: string) => delay_in_days && parseInt(delay_in_days) > 0,
  //     then: (schema) => schema.required('Delay reason is required when there is a delay'),
  //     otherwise: (schema) => schema.optional(),
  //   }),
});

interface LWFTrackerEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (editedData: LWFTrackerData) => void;
  trackerId: number;
   onRefresh: () => void;
}

const LWFTrackerEditDialog: React.FC<LWFTrackerEditDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  trackerId,
  onRefresh
}) => {
  const [editedData, setEditedData] = useState<LWFTrackerData>({
    id: trackerId,
  });
  const [loading, setLoading] = useState(true);
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
      const response = await dispatch((fetchLwfTrackerById(trackerId)))
        .unwrap()
        .catch((error: any) => {
          throw error;
        });
      
      setEditedData(response);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tracker data:', err);
      setError('Failed to load tracker details');
      setLoading(false);
      openNotification('error', 'Failed to load tracker details');
    }
  };

  const handleChange = (field: keyof LWFTrackerData, value: string | number) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));

    if (field === 'total_paid_amt') {
      // Handle empty string or invalid number
      const numValue = value === '' ? null : Number(value);
      setEditedData((prev) => ({ ...prev, [field]: numValue }));
    } else {
      setEditedData((prev) => ({ ...prev, [field]: value }));
    }
  };
  
  const validateForm = async (): Promise<boolean> => {
    try {
      await validationSchema.validate(editedData, { abortEarly: false });
      setValidationErrors({});
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors: ValidationErrors = {};
        err.inner.forEach((e) => {
          if (e.path) {
            errors[e.path] = e.message;
          }
        });
        setValidationErrors(errors);
      }
      return false;
    }
  };


  const handleSubmit = async () => {
      try {
        setLoading(true)
        const isValid = await validateForm();
      if (!isValid) {
        openNotification('error', 'Please fix the validation errors');
        return;
      }
    // Create updateData object (matching the original updateTracker data expectation)
    const updateData = {
      payment_date: editedData.payment_date || '',
      delay_reason: editedData.delay_reason || '',
      receipt_no: editedData.receipt_no,
      total_paid_amt: editedData.total_paid_amt,
      difference_reason: editedData.difference_reason || '',
    };

    // Dispatch updateTracker with id and updateData
    const resultAction = await dispatch(updateLwfTracker({
      id: trackerId, 
      data: updateData // Note: data, not formData
    })).unwrap()
    .catch((error: any) => {
        throw error; // Re-throw to prevent navigation
    });

    onClose();
    openNotification('success', 'LWF Tracker edited successfully');
     if (onRefresh) {
      onRefresh();
    }
  } catch (err) {
    console.error('Error submitting tracker data:', err);
    // openNotification('danger', 'Failed to save changes');
  } finally{
    setLoading(false)
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
        closable={true}
      >
        {message}
      </Notification>
    );
  };

  if (error) {
    return (
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        onRequestClose={onClose}
        width={800}
        height={450}  shouldCloseOnOverlayClick={false} 
      >
        <div className="flex justify-center items-center h-full">
          <p className="text-red-500">{error}</p>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog
    isOpen={isOpen}
    onClose={onClose}
    onRequestClose={onClose}
    width={800}
    height={450} // Increased height to accommodate error messages
  >
    <h5 className="mb-4">Edit LWF Tracker</h5>
    
    <div className=" space-y-2"> {/* Increased space between rows */}
      <div className='grid grid-cols-2 gap-4'> {/* Changed to grid layout */}
        <div className='flex flex-col min-h-[90px]'> {/* Added minimum height */}
          <label className="mb-2">Enter Receipt Number</label>
          <OutlinedInput
            label="Receipt Number"
            value={editedData.receipt_no || ''}
            onChange={(value) => handleChange('receipt_no', value)}
          />
          {validationErrors.receipt_no && (
            <span className="text-red-500 text-sm mt-1">{validationErrors.receipt_no}</span>
          )}
        </div>

        <div className='flex flex-col min-h-[90px]'> {/* Added minimum height */}
          <label className="mb-2">Enter Total Amount</label>
          <OutlinedInput
            label="Total Paid Amount"
            value={editedData.total_paid_amt?.toString() || ''}
            onChange={(value) => handleChange('total_paid_amt', value)}
          />
          {validationErrors.total_paid_amt && (
            <span className="text-red-500 text-sm mt-1">{validationErrors.total_paid_amt}</span>
          )}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'> {/* Changed to grid layout */}

      <div className='flex flex-col min-h-[90px]'>
    <label className="mb-2">Enter Difference Reason</label>
    <OutlinedInput
      label="Difference Reason"
      value={editedData.difference_reason || ''}
      onChange={(value) => handleChange('difference_reason', value)}
    />
    {validationErrors.difference_reason && (
      <span className="text-red-500 text-sm mt-1">{validationErrors.difference_reason}</span>
    )}
  </div>
       

        <div className='flex flex-col min-h-[90px]'> {/* Added minimum height */}
          <label className="mb-2">Select Date of Payment</label>
          <DatePicker
          size='sm'
            placeholder="Date of Payment"
            value={editedData.payment_date ? formatDateForDisplay(editedData.payment_date) : undefined}
            onChange={(date) => handleDateChange('payment_date', date)}
            inputFormat="DD-MM-YYYY"  // Changed to uppercase format tokens
            yearLabelFormat="YYYY"
            monthLabelFormat="MMMM YYYY"
          />
          {validationErrors.payment_date && (
            <span className="text-red-500 text-sm mt-1">{validationErrors.payment_date}</span>
          )}
        </div>

        
      </div>
      <div className='grid grid-cols-2 gap-4'>
      <div className='flex flex-col min-h-[90px]'> {/* Added minimum height */}
          <label className="mb-2">Enter Delay Reason</label>
          <OutlinedInput
            label="Delay Reason"
            value={editedData.delay_reason || ''}
            onChange={(value) => handleChange('delay_reason', value)}
          />
          {validationErrors.delay_reason && (
            <span className="text-red-500 text-sm mt-1">{validationErrors.delay_reason}</span>
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

export default LWFTrackerEditDialog;