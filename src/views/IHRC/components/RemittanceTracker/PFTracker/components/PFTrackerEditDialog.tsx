
import React, { useState, useEffect } from 'react';
import { Dialog, Button, DatePicker, toast, Notification } from '@/components/ui';
import OutlinedInput from '@/components/ui/OutlinedInput';
import OutlinedSelect from '@/components/ui/Outlined';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { showErrorNotification } from '@/components/ui/ErrorMessage';
import { useDispatch } from 'react-redux';
import { fetchTrackerById, updatePfTracker } from '@/store/slices/pftracker/pfTrackerSlice';
import * as Yup from 'yup';


interface PfChallanData {
  id: number;
  trrn_no?: string;
  crn_no?: string;
  epf_wage?: string;
  eps_wage?: string;
  edli_wage?: string;
  total_challan_amt?: string;
  payroll_month?: string;
  dueDate?: string;
  payment_date?: string;
  challan_type?: string;
  no_of_emp?: string;
  delay_in_days?: string;
  delay_reason?: string;
  difference_reason?: string;
  total_paid_amt?: number;
}

interface ValidationErrors {
  [key: string]: string;
}

interface PFTrackerEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (editedData: PfChallanData) => void;
  trackerId: number;
     onRefresh: () => void;
}

const validationSchema = Yup.object().shape({
  trrn_no: Yup.string()
    .required('TRRN No. is required')
    .matches(/^[A-Za-z0-9]+$/, 'TRRN No. should be alphanumeric'),
  crn_no: Yup.string()
    .required('CRN No. is required')
    .matches(/^[A-Za-z0-9]+$/, 'CRN No. should be alphanumeric'),
  epf_wage: Yup.number()
    .required('EPF Wage is required')
    .min(0, 'EPF Wage must be positive')
    .typeError('EPF Wage must be a number'),
  eps_wage: Yup.number()
    .required('EPS Wage is required')
    .min(0, 'EPS Wage must be positive')
    .typeError('EPS Wage must be a number'),
  edli_wage: Yup.number()
    .required('EDLI Wage is required')
    .min(0, 'EDLI Wage must be positive')
    .typeError('EDLI Wage must be a number'),
  total_challan_amt: Yup.number()
    .required('Total Challan Amount is required')
    .min(0, 'Total Challan Amount must be positive')
    .typeError('Total Challan Amount must be a number'),
  payment_date: Yup.date()
    .required('Payment Date is required')
    .typeError('Invalid date format'),
  total_paid_amt: Yup.number()
    .required('Total Paid Amount is required')
    .min(0, 'Total Paid Amount must be positive')
    .typeError('Total Paid Amount must be a number'),
  no_of_emp: Yup.number()
    .required('Number of Employees is required')
    .integer('Number of Employees must be an integer')
    .min(1, 'Number of Employees must be at least 1')
    .typeError('Number of Employees must be a number'),
    // difference_reason: Yup.string().test({
    //   name: 'difference-check',
    //   test: function(diffReason, context) {
    //     const { total_challan_amt, total_paid_amt } = context.parent;
    //     if (Number(total_challan_amt) !== Number(total_paid_amt)) {
    //       return diffReason ? diffReason.length >= 3 : false;
    //     }
    //     return true;
    //   },
    //   message: 'Difference reason is required when amounts differ and must be at least 3 characters'
    // }),
    
    // delay_reason: Yup.string().test({
    //   name: 'delay-check',
    //   test: function(delayReason, context) {
    //     const { payment_date } = context.parent;
    //     if (payment_date && Yup.date().isValidSync(payment_date)) {
    //       return delayReason ? delayReason.length >= 3 : false;
    //     }
    //     return true;
    //   },
    //   message: 'Delay reason is required when payment date is provided and must be at least 3 characters'
    // })
});


const PFTrackerEditDialog: React.FC<PFTrackerEditDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  trackerId,
  onRefresh
}) => {
  const [editedData, setEditedData] = useState<PfChallanData>({
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
      // console.log(trackerId)
      // setLoading(true);
      const response = await dispatch((fetchTrackerById(trackerId)))
            .unwrap()
            .catch((error: any) => {
                throw error; // Re-throw to prevent navigation
            });
      console.log(response)
        setEditedData(response);
        console.log(editedData)
        setLoading(false);
    } catch (err) {
      console.error('Error fetching tracker data:', err);
      // setError('Failed to load tracker details');
      setLoading(false);
      // openNotification('danger', 'Failed to load tracker details');
    }
  };

  const validateField = async (field: keyof PfChallanData, value: any) => {
    try {
      // If the value is empty string, don't validate yet
      if (value === '') {
        setValidationErrors(prev => ({ ...prev, [field]: '' }));
        return true;
      }
      await validationSchema.validateAt(field, { ...editedData, [field]: value });
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setValidationErrors(prev => ({ ...prev, [field]: err.message }));
      }
      return false;
    }
  };

  const handleChange = async (field: keyof PfChallanData, value: string | number) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
    await validateField(field, value);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true)
      await validationSchema.validate(editedData, { abortEarly: false });
    // Create updateData object (matching the original updateTracker data expectation)
    const updateData = {
      no_of_emp: editedData.no_of_emp || '0',
      delay_reason: editedData.delay_reason || '',
      epf_wage: editedData.epf_wage || '0',
      eps_wage: editedData.eps_wage || '0',
      edli_wage: editedData.edli_wage || '0',
      total_challan_amt: editedData.total_challan_amt || '0',
      total_paid_amt: editedData.total_paid_amt || '0',
      payment_date: editedData.payment_date || '',
      challan_type: editedData.challan_type,
      trrn_no: editedData.trrn_no || '',
      crn_no: editedData.crn_no || '',
      difference_reason: editedData.difference_reason || '',
      payroll_month: editedData.payroll_month,
     
    };

    // Dispatch updateTracker with id and updateData
    const resultAction =  await dispatch(updatePfTracker({
      id: trackerId,
      data: updateData
    })).unwrap()
    .catch((error: any) => {
        throw error; // Re-throw to prevent navigation
    });

    onClose();
    openNotification('success', 'PF Tracker edited successfully');
     if (onRefresh) {
      onRefresh();
    }
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      // Transform validation errors into object
      const errors: ValidationErrors = {};
      err.inner.forEach((error) => {
        if (error.path) {
          errors[error.path] = error.message;
        }
      });
      setValidationErrors(errors);
      openNotification('error', 'Please fix validation errors');
    } else {
      console.error('Error submitting tracker data:', err);
      // openNotification('danger', 'Failed to update PF Tracker');
    }
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
      >
        {message}
      </Notification>
    );
  };

  const challanTypeOptions = [
    { value: 'Main Challan', label: 'Main Challan' },
    { value: 'Arrear Challan', label: 'Arrear Challan' },
  ];

  // if (loading) {
  //   return (
  //     <Dialog
  //       isOpen={isOpen}
  //       onClose={onClose}
  //       onRequestClose={onClose}
  //       width={800}
  //       height={600}
  //     >
  //       <div className="flex justify-center items-center h-full">
  //         <p>Loading...</p>
  //       </div>
  //     </Dialog>
  //   );
  // }

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
      height={600}
    >
      <h5 className="mb-4">Edit PF Tracker</h5>

      <div className="p-4 space-y-4">
        <div className='flex gap-4 items-center'>
          <div className='flex flex-col gap-2 w-full'>
            <label>Enter TRR NO.</label>
            <div className='w-full'>
              <OutlinedInput
                label="TRRN No"
                value={editedData.trrn_no || ''}
                onChange={(value) => handleChange('trrn_no', value)}
              />
               {validationErrors['trrn_no'] && (
                <p className="text-red-500 text-sm mt-1">{validationErrors['trrn_no']}</p>
              )}
            </div>
          </div>

          <div className='flex flex-col gap-2 w-full'>
            <label>Enter CRN NO.</label>
            <div className='w-full'>
              <OutlinedInput
                label="CRN No"
                value={editedData.crn_no || ''}
                onChange={(value) => handleChange('crn_no', value)}
              />
               {validationErrors['crn_no'] && (
                <p className="text-red-500 text-sm mt-1">{validationErrors['crn_no']}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-8 items-center">
          <div className='flex flex-col gap-2'>
            <label>Enter EPF Wages</label>
            <div className='w-[219px]'>
              <OutlinedInput
                label="EPF Wage"
                value={editedData.epf_wage || '0'}
                onChange={(value) => handleChange('epf_wage', parseFloat(value))}
              />
               {validationErrors['epf_wage'] && (
                <p className="text-red-500 text-sm mt-1">{validationErrors['epf_wage']}</p>
              )}
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <label>Enter EPS Wage</label>
            <div className='w-[219px]'>
              <OutlinedInput
                label="EPS Wage"
                value={editedData.eps_wage || '0'}
                onChange={(value) => handleChange('eps_wage', parseFloat(value))}
              />
               {validationErrors['eps_wage'] && (
                <p className="text-red-500 text-sm mt-1">{validationErrors['eps_wage']}</p>
              )}
            </div>
          </div>
          <div className='flex flex-col gap-2'>
           <label>Edli Wage</label>
            <div className='w-[219px]'>
              <OutlinedInput
                label="Edli Wage"
                value={editedData.edli_wage || '0'}
                onChange={(value) => handleChange('edli_wage', parseFloat(value))}
              />
                {validationErrors['edli_wage'] && (
                <p className="text-red-500 text-sm mt-1">{validationErrors['edli_wage']}</p>
              )}
            </div>
          </div>
        </div>

        <div className='flex gap-8 items-center'>
          <div className='flex flex-col gap-2'>
             <label>Enter Total Challan Amount</label>
            <div className='w-[219px]'>
              <OutlinedInput
                label="Total Challan Amount"
                value={editedData.total_challan_amt || '0'}
                onChange={(value) => handleChange('total_challan_amt', parseFloat(value))}
              />
               {validationErrors['edli_wage'] && (
                <p className="text-red-500 text-sm mt-1">{validationErrors['edli_wage']}</p>
              )}
            </div>
          </div>
          <div className='flex flex-col gap-2 w-full'>
            <label>Select Date of Payment</label>
            <div className='w-full'>
              <DatePicker
                size='sm'
                placeholder="Date of Payment"
                value={editedData.payment_date ? formatDateForDisplay(editedData.payment_date) : undefined}
                onChange={(date) => handleDateChange('payment_date', date)}
                inputFormat="DD-MM-YYYY"  // Changed to uppercase format tokens
                yearLabelFormat="YYYY"
                monthLabelFormat="MMMM YYYY"
              />
               {validationErrors['payment_date'] && (
                <p className="text-red-500 text-sm mt-1">{validationErrors['payment_date']}</p>
              )}
            </div>
          </div>
        </div>

        <div className='flex gap-4 items-center'>
           <div className='flex flex-col gap-2'>
            <label>Total Paid Amount </label>
            <div className='w-[219px]'>
              <OutlinedInput
                label="Total Paid Amount"
                value={editedData.total_paid_amt || '0'}
                onChange={(value) => handleChange('total_paid_amt', parseFloat(value))}
              />
               {validationErrors['total_paid_amt'] && (
                <p className="text-red-500 text-sm mt-1">{validationErrors['total_paid_amt']}</p>
              )}
            </div>
          </div>

          <div className='flex flex-col gap-2 w-full'>
            <label>Enter Number of Employees</label>
            <div className='w-full'>
              <OutlinedInput
                label="No. of Employees"
                value={editedData.no_of_emp || '0'}
                onChange={(value) => handleChange('no_of_emp', parseInt(value, 10))}
              />
                {validationErrors['no_of_emp'] && (
                <p className="text-red-500 text-sm mt-1">{validationErrors['no_of_emp']}</p>
              )}
            </div>
          </div>
        </div>

        <div className='flex gap-4 items-center'>
          <div className='flex flex-col gap-2 w-full'>
            <label>Difference Reason</label>
            <div className='w-full'>
              <OutlinedInput
                label="Difference Reason"
                value={editedData.difference_reason || ''}
                onChange={(value) => handleChange('difference_reason', value)}
              />
              {validationErrors['difference_reason'] && (
                <p className="text-red-500 text-sm mt-1">{validationErrors['difference_reason']}</p>
              )}
            </div>
          </div>

          <div className='flex flex-col gap-2 w-full'>
            <label>Enter Delay Reason</label>
            <div className='w-full'>
              <OutlinedInput
                label="Delay Reason"
                value={editedData.delay_reason || ''}
                onChange={(value) => handleChange('delay_reason', value)}
              />
              {validationErrors['delay_reason'] && (
                <p className="text-red-500 text-sm mt-1">{validationErrors['delay_reason']}</p>
              )}
            </div>
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

export default PFTrackerEditDialog;
