import React, { useEffect, useState } from 'react';
import { Dialog, Button, Input, toast, Notification, DatePicker } from '@/components/ui';
import { FaUserShield } from 'react-icons/fa';
import OutlinedInput from '@/components/ui/OutlinedInput';
import dayjs from 'dayjs';

interface PFIWChallanData {
  id: number;
  submit_date?: string | null;
  delay_reason?: string;
}

interface RequestToAdminDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, updateData?: Record<string, any>) => Promise<void>;
  loading?: boolean;
  trackerData?: PFIWChallanData | null;
}

const RequestToAdminDialog: React.FC<RequestToAdminDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  trackerData
}) => {
  const [reason, setReason] = useState('');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Initialize form data with tracker data when dialog opens
  useEffect(() => {
    if (isOpen && trackerData) {
      setFormData({
        submit_date: trackerData.submit_date 
                ? dayjs(trackerData.submit_date).toISOString() 
                : '',
        delay_reason: trackerData.delay_reason || ''
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

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.push(
        <Notification title="Error" type="danger">
          Please enter a reason for the request
        </Notification>
      );
      return;
    }

    // Calculate changed fields only
    const changedFields: Record<string, any> = {};
    if (trackerData) {
      Object.keys(formData).forEach(key => {
        if (JSON.stringify(formData[key]) !== JSON.stringify(trackerData[key as keyof PFIWChallanData])) {
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

    try {
      await onConfirm(reason, changedFields);
      toast.push(
        <Notification title="Success" type="success">
          Request sent to admin successfully
        </Notification>
      );
      onClose();
    } catch (error) {
      console.error('Request failed:', error);
      throw error
    }
  };


  const formatDateForDisplay = (dateString: string | undefined): Date | undefined => {
    if (!dateString) return undefined;
    
    // Parse both ISO format and simple YYYY-MM-DD format
    return dayjs(dateString).isValid() 
      ? dayjs(dateString).toDate()
      : undefined;
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} shouldCloseOnOverlayClick={false} width={600}>
      <div className="">
        <h4 className="mb-2">Edit Fields</h4>
        
        <div className="">
          <div className='flex flex-col min-h-[90px]'>
            <label className="mb-2">Submission Date</label>
            <DatePicker
              size='sm'
              placeholder="Submission Date"
              value={formData.submit_date ? formatDateForDisplay(formData.submit_date) : undefined}
              onChange={(date) => handleDateChange('submit_date', date)}
              inputFormat="DD-MM-YYYY"
              yearLabelFormat="YYYY"
              monthLabelFormat="MMMM YYYY"
            />
            {validationErrors.submit_date && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.submit_date}</p>
            )}
          </div>
          
          <div className='flex flex-col min-h-[90px]'>
            <label className="mb-2">Delay Reason</label>
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

        <div className="mb-2">
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