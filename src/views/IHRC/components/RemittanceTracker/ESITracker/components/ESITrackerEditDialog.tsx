
import React, { useState, useEffect } from 'react';
import { Dialog, Button, DatePicker, toast, Notification } from '@/components/ui';
import OutlinedInput from '@/components/ui/OutlinedInput';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import OutlinedSelect from '@/components/ui/Outlined';
import { showErrorNotification } from '@/components/ui/ErrorMessage';
import { useDispatch } from 'react-redux';
import { fetchTrackerById, updateTracker } from '@/store/slices/esitracker/esitrackerSlice';
import * as yup from 'yup';


interface ESITrackerFormData {
  id?: number;
  no_of_emp?: number;
  gross_wage?: number;
  employee_esi?: number;
  employer_esi?: number;
  total_esi?: number ;
  challan_amt?: number;
  payment_date?: number;
  challan_no?: number;
  delay_reason?: string;
  difference_reason?: string;
  challan_type?: string;
  
  payroll_month?: string;
}

interface ESIChallanData {
  id: number;
  no_of_emp?: string;
  gross_wage?: string;
  employee_esi?: string;
  employer_esi?: string;
  total_esi?: string;
  challan_amt?: string;
  // payroll_month?: string;
  payment_date?: string;
  challan_no?: string;
  // challan_type?: string;
  delay_reason?: string;
  difference_reason?: string;
  payroll_month?: string;
}


interface ValidationErrors {
  no_of_emp?: string;
  gross_wage?: string;
  employee_esi?: string;
  employer_esi?: string;
  total_esi?: string;
  challan_amt?: string;
  payment_date?: string;
  challan_no?: string;
  delay_reason?: string;
  difference_reason?: string;
}

const validationSchema = yup.object().shape({
  no_of_emp: yup
  .number()
  .typeError("Number of employees cannot be zero")
  .required('Number of employees is required')
  .positive('Number of employees must be positive'),
gross_wage: yup
  .number()
  .typeError("Gross wage cannot be zero")
  .required('Gross wage is required')
  .positive('Gross wage must be positive'),
employee_esi: yup
  .number()
  .typeError("Employee ESI cannot be zero")
  .required('Employee ESI is required')
  .positive('Employee ESI must be positive'),
employer_esi: yup
  .number()
  .typeError("Employer ESI cannot be zero")
  .required('Employer ESI is required')
  .positive('Employer ESI must be positive'),
total_esi: yup
  .number()
  .typeError("Total ESI cannot be zero")
  .required('Total ESI is required')
  .positive('Total ESI must be positive'),
  // .test('total-esi-match', 'Total ESI should equal employee + employer ESI', 
  //   function(value) {
  //     const { employee_esi, employer_esi } = this.parent;
  //     if (!value || !employee_esi || !employer_esi) return true;
  //     return Math.abs(value - (employee_esi + employer_esi)) < 0.01;
  // }),
challan_amt: yup
  .number()
  .typeError("Challan amount cannot be zero")
  .required('Challan amount is required')
  .positive('Challan amount must be positive'),
payment_date: yup
  .date()
  .required('Payment date is required')
  .max(new Date(), 'Payment date cannot be in the future'),
challan_no: yup
  .string()
  .required('Challan number is required'),
delay_reason: yup.string().nullable(),
difference_reason: yup.string().nullable()
});

interface ESITrackerEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (editedData: ESIChallanData) => void;
  trackerId: number;
  onRefresh: () => void;

}

const ESITrackerEditDialog: React.FC<ESITrackerEditDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  trackerId,
  onRefresh,
}) => {
  const [editedData, setEditedData] = useState<ESIChallanData>({
    id: trackerId,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // useEffect(() => {
  //   setEditedData(data);
  // }, [data]);


  useEffect(() => {
    if (isOpen && trackerId) {
      fetchTrackerData();
    }
  }, [isOpen, trackerId]);


  const fetchTrackerData = async () => {
    try {
      // console.log(trackerId)
      // setLoading(true);
      const response = await dispatch((fetchTrackerById(trackerId)))
            .unwrap()
            .catch((error: any) => {
                throw error; // Re-throw to prevent navigation
            });
      console.log(response)
        setEditedData(response);
        setValidationErrors({});
        console.log(editedData)
        setLoading(false);
    } catch (err) {
      console.error('Error fetching tracker data:', err);
      setError('Failed to load tracker details');
      setLoading(false);
      openNotification('error', 'Failed to load tracker details');
    }
  };
  const handleChange = (field: keyof ESIChallanData, value: string | number) => {
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
    setLoading(true)
    const isValid = await validateForm();
    if (!isValid) {
      console.log(isValid)
      openNotification('error', 'Please fix the validation errors');
      return;
    }

    // Create updateData object (matching the original updateTracker data expectation)
    const updateData = {
      no_of_emp: editedData.no_of_emp,
      gross_wage: editedData.gross_wage,
      employee_esi: editedData.employee_esi,
      employer_esi: editedData.employer_esi,
      total_esi: editedData.total_esi,
      challan_amt: editedData.challan_amt,
      payment_date: editedData.payment_date || '',
      challan_no: editedData.challan_no?.toString() || '',
      delay_reason: editedData.delay_reason || '',
      difference_reason: editedData.difference_reason || '',
      challan_type: 'main',
      payroll_month: editedData.payroll_month || '',
    };

    // Dispatch updateTracker with id and updateData
    const resultAction = await dispatch(updateTracker({
      id: trackerId, 
      data: updateData // Note: data, not formData
    })) .unwrap()
    .catch((error: any) => {
        throw error; // Re-throw to prevent navigation
    });

    onClose();
    openNotification('success', 'ESI Tracker edited successfully');
     if (onRefresh) {
      onRefresh();
    }
  } catch (err) {
    console.error('Error submitting tracker data:', err);
    // openNotification('danger', 'Failed to save changes');
  } finally {
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
    )
  }

  const challanTypeOptions = [
    { value: 'Main Challan', label: 'Main Challan' },
    { value: 'Supplementary Challan', label: 'Supplementary Challan' },
  ];

  if (error) {
    return (
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        onRequestClose={onClose}
        width={800}
        height={600}  shouldCloseOnOverlayClick={false} 
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
      height={560}
    >
      <h5 className="mb-4">Edit ESI Tracker</h5>
      
      <div className="p-4 space-y-1">
        {/* First Row */}
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col min-h-[90px]'>
            <label className="mb-2">Enter Number of Employees</label>
            <OutlinedInput
              label="No. of Employees"
              value={editedData.no_of_emp || "0"}
              onChange={(value) => handleChange('no_of_emp', parseFloat(value))}
            />
            {validationErrors.no_of_emp && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.no_of_emp}</p>
            )}
          </div>
          <div className='flex flex-col min-h-[90px]'>
            <label className="mb-2">Enter Challan No.</label>
            <OutlinedInput
              label="Challan No"
              value={editedData.challan_no || ''}
              onChange={(value) => handleChange('challan_no', value)}
            />
            {validationErrors.challan_no && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.challan_no}</p>
            )}
          </div>
        </div>

        {/* Second Row */}
        <div className='grid grid-cols-3 gap-4'>
          <div className='flex flex-col min-h-[90px]'>
            <label className="mb-2">Select Date of Payment</label>
            <DatePicker
            size='sm'
              placeholder="Amount Paid On"
              value={editedData.payment_date ? formatDateForDisplay(editedData.payment_date) : undefined}
              onChange={(date) => handleDateChange('payment_date', date)}
              inputFormat="DD-MM-YYYY"  // Changed to uppercase format tokens
              yearLabelFormat="YYYY"
              monthLabelFormat="MMMM YYYY"
            />
            {validationErrors.payment_date && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.payment_date}</p>
            )}
          </div>
          <div className='flex flex-col min-h-[90px]'>
            <label className="mb-2">Enter ESI Gross Wages</label>
            <OutlinedInput
              label="ESI Gross Wages"
              value={editedData.gross_wage || '0'}
              onChange={(value) => handleChange('gross_wage', parseFloat(value))}
            />
            {validationErrors.gross_wage && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.gross_wage}</p>
            )}
          </div>
          <div className='flex flex-col min-h-[90px]'>
            <label className="mb-2">Enter EE ESI</label>
            <OutlinedInput
              label="EE ESI"
              value={editedData.employee_esi || '0'}
              onChange={(value) => handleChange('employee_esi', parseFloat(value))}
            />
            {validationErrors.employee_esi && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.employee_esi}</p>
            )}
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className='flex flex-col min-h-[90px]'>
            <label className="mb-2">Enter ER ESI</label>
            <OutlinedInput
              label="ER ESI"
              value={editedData.employer_esi || '0'}
              onChange={(value) => handleChange('employer_esi', parseFloat(value))}
            />
            {validationErrors.employer_esi && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.employer_esi}</p>
            )}
          </div>
          <div className='flex flex-col min-h-[90px]'>
            <label className="mb-2">Total ESI</label>
            <OutlinedInput
              label="Total Esi"
              value={editedData.total_esi || '0'}
              onChange={(value) => handleChange('total_esi', parseFloat(value))}
            />
            {validationErrors.total_esi && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.total_esi}</p>
            )}
          </div>
          <div className='flex flex-col min-h-[90px]'>
            <label className="mb-2">Total Challan Amount</label>
            <OutlinedInput
              label="Total Amount As per Challan"
              value={editedData.challan_amt || '0'}
              onChange={(value) => handleChange('challan_amt', parseFloat(value))}
            />
            {validationErrors.challan_amt && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.challan_amt}</p>
            )}
          </div>
        </div>

        {/* Fourth Row */}
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col min-h-[90px]'>
            <label className="mb-2">Difference Reason</label>
            <OutlinedInput
              label="Difference Reason"
              value={editedData.difference_reason?.toString() || ''}
              onChange={(value) => handleChange('difference_reason', value)}
            />
            {validationErrors.difference_reason && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.difference_reason}</p>
            )}
          </div>
          <div className='flex flex-col min-h-[90px]'>
            <label className="mb-2">Delay Reason</label>
            <OutlinedInput
              label="Delay Reason"
              value={editedData.delay_reason?.toString() || ''}
              onChange={(value) => handleChange('delay_reason', value)}
            />
            {validationErrors.delay_reason && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.delay_reason}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
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

export default ESITrackerEditDialog;