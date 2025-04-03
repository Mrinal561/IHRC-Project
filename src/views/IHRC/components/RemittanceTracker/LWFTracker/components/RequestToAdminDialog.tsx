import React, { useEffect, useState } from 'react';
import { Dialog, Button, Input, toast, Notification, DatePicker } from '@/components/ui';
import { FaUserShield } from 'react-icons/fa';
import OutlinedInput from '@/components/ui/OutlinedInput';
import dayjs from 'dayjs';


interface LWFTrackerDatas {
    id: number;
    receipt_no?: string;
    total_paid_amt?: number | null;
    delay_in_days?: string;
    delay_reason?: string;
    difference_reason?: string;
    payment_date?: string | null;
  }

interface RequestToAdminDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, updateData?: Record<string, any>) => void;
  loading?: boolean;
  trackerData?: LWFTrackerDatas;
}

const RequestToAdminDialog: React.FC<RequestToAdminDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  trackerData
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Record<string, any>>({});
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
 useEffect(() => {
    if (isOpen && trackerData) {
      setFormData({
        receipt_no: trackerData. receipt_no,
        total_paid_amt: trackerData. total_paid_amt,
        delay_reason: trackerData. delay_reason,
        difference_reason: trackerData. difference_reason,
        payment_date: trackerData.payment_date 
               ? dayjs(trackerData.payment_date).toISOString() 
               : '',
        
      });
      setReason('');
      setValidationErrors({});
    }
  }, [isOpen, trackerData]);

   const handleChange = (field: string, value: string | number | Date | null) => {
      let formattedValue = value;
      
      if (value instanceof Date) {
        formattedValue = dayjs(value).format('YYYY-MM-DD');
      }
      
      setFormData(prev => ({
        ...prev,
        [field]: formattedValue
      }));
    };

  const handleDateChange = (field: string, date: Date | null) => {
    if (date) {
      // Convert to ISO string (includes timezone info)
      const isoDate = dayjs(date).toISOString();
      handleChange(field, isoDate);
    }
  };


  const handleSubmit = () => {
    if (!reason.trim()) {
         toast.push(
           <Notification title="Error" type="danger">
             Please enter a reason for the request
           </Notification>
         );
         return;
    }

    const changedFields: Record<string, any> = {};
    if (trackerData) {
      Object.keys(formData).forEach(key => {
        if (JSON.stringify(formData[key]) !== JSON.stringify(trackerData[key as keyof LWFTrackerDatas])) {
          changedFields[key] = formData[key];
        }
      });
    }

    // If no fields actually changed
    if (Object.keys(changedFields).length === 0) {
      toast.push(
        <Notification title="Error" type="danger">
          Please make at least one change to request edit
        </Notification>
      );
      return;
    }

    onConfirm(reason, changedFields);
  };


  const formatDateForDisplay = (dateString: string | undefined): Date | undefined => {
    if (!dateString) return undefined;
    
    // Parse both ISO format and simple YYYY-MM-DD format
    return dayjs(dateString).isValid() 
      ? dayjs(dateString).toDate()
      : undefined;
  };
  
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      onRequestClose={onClose}
      width={800}
      height={500}
      shouldCloseOnOverlayClick={false}
    >
      <div className="">
        <h4 className="mb-2">Edit Fields</h4>
        
        <div className="space-y-2">
          <div className='grid grid-cols-3 gap-4'>
            <div className='flex flex-col min-h-[90px]'>
              <label className="mb-2">Enter Receipt Number</label>
              <OutlinedInput
                label="Receipt Number"
                value={formData.receipt_no || ''}
                onChange={(value) => handleChange('receipt_no', value)}
              />
              {validationErrors.receipt_no && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.receipt_no}</p>
              )}
            </div>

            <div className='flex flex-col min-h-[90px]'>
              <label className="mb-2">Enter Total Amount</label>
              <OutlinedInput
                label="Total Paid Amount"
                value={formData.total_paid_amt?.toString() || ''}
                onChange={(value) => handleChange('total_paid_amt', parseFloat(value))}
              />
              {validationErrors.total_paid_amt && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.total_paid_amt}</p>
              )}
            </div>

            <div className='flex flex-col min-h-[90px]'>
              <label className="mb-2">Select Date of Payment</label>
              <DatePicker
                size='sm'
                placeholder="Date of Payment"
                value={formData.payment_date ? formatDateForDisplay(formData.payment_date) : undefined}
                onChange={(date) => handleDateChange('payment_date', date)}
                inputFormat="DD-MM-YYYY"
                yearLabelFormat="YYYY"
                monthLabelFormat="MMMM YYYY"
              />
              {validationErrors.payment_date && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.payment_date}</p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col min-h-[90px]'>
              <label className="mb-2">Enter Difference Reason</label>
              <OutlinedInput
                label="Difference Reason"
                value={formData.difference_reason || ''}
                onChange={(value) => handleChange('difference_reason', value)}
              />
              {validationErrors.difference_reason && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.difference_reason}</p>
              )}
            </div>

            <div className='flex flex-col min-h-[90px]'>
              <label className="mb-2">Enter Delay Reason</label>
              <OutlinedInput
                label="Delay Reason"
                value={formData.delay_reason || ''}
                onChange={(value) => handleChange('delay_reason', value)}
              />
              {validationErrors.delay_reason && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.delay_reason}</p>
              )}
            </div>
          </div>

           
          </div>


        <div className="mb-2 mt-4">
          <p className="mb-2">Please provide a reason for requesting edit access:</p>
          <Input
            textArea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason why you need to edit this record..."
          />
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="plain" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button
            variant="solid"
            onClick={handleSubmit}
            loading={loading}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default RequestToAdminDialog;