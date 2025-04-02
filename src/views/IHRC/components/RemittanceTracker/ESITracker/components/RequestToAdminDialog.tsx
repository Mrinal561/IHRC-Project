import React, { useState, useEffect } from 'react';
import { Button, Dialog, Input, Notification, toast, DatePicker } from '@/components/ui';
import OutlinedInput from '@/components/ui/OutlinedInput';
import dayjs from 'dayjs';
import { esiChallanData } from '@/@types/esiTracker';

interface RequestToAdminDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, updateData: Record<string, any>) => Promise<void>;
  loading?: boolean;
  trackerData?: esiChallanData | null;
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
        no_of_emp: trackerData.no_of_emp,
        gross_wage: trackerData.gross_wage,
        employee_esi: trackerData.employee_esi,
        employer_esi: trackerData.employer_esi,
        total_esi: trackerData.total_esi,
        challan_amt: trackerData.challan_amt,
        payment_date: trackerData.payment_date,
        challan_no: trackerData.challan_no,
        delay_reason: trackerData.delay_reason,
        difference_reason: trackerData.difference_reason
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
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      handleChange(field, formattedDate);
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
        // Skip system fields and unchanged values
        if (['id', 'created_at', 'updated_at', 'uploaded_by'].includes(key)) return;
        
        if (JSON.stringify(formData[key]) !== JSON.stringify(trackerData[key as keyof esiChallanData])) {
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
    }
  };

  const formatDateForDisplay = (dateString: string | undefined): Date | undefined => {
    if (!dateString) return undefined;
    return dayjs(dateString).toDate();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} shouldCloseOnOverlayClick={false} width={1000} height={560}>
      <div className="">
        

        <h4 className="mb-2">Edit Fields</h4>
        
        <div className="space-y-1">
          {/* First Row */}
          <div className='grid grid-cols-3 gap-4'>
            <div className='flex flex-col min-h-[90px]'>
              <label className="mb-2">Enter Number of Employees</label>
              <OutlinedInput
                label="No. of Employees"
                value={formData.no_of_emp || "0"}
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
                value={formData.challan_no || ''}
                onChange={(value) => handleChange('challan_no', value)}
              />
              {validationErrors.challan_no && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.challan_no}</p>
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

          {/* Second Row */}
          <div className='grid grid-cols-4 gap-4'>
           
            <div className='flex flex-col min-h-[90px]'>
              <label className="mb-2">ESI Gross Wages</label>
              <OutlinedInput
                label="ESI Gross Wages"
                value={formData.gross_wage || '0'}
                onChange={(value) => handleChange('gross_wage', parseFloat(value))}
              />
              {validationErrors.gross_wage && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.gross_wage}</p>
              )}
            </div>
            <div className='flex flex-col min-h-[90px]'>
              <label className="mb-2">EE ESI</label>
              <OutlinedInput
                label="EE ESI"
                value={formData.employee_esi || '0'}
                onChange={(value) => handleChange('employee_esi', parseFloat(value))}
              />
              {validationErrors.employee_esi && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.employee_esi}</p>
              )}
            </div>
            <div className='flex flex-col min-h-[90px]'>
              <label className="mb-2">ER ESI</label>
              <OutlinedInput
                label="ER ESI"
                value={formData.employer_esi || '0'}
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
                value={formData.total_esi || '0'}
                onChange={(value) => handleChange('total_esi', parseFloat(value))}
              />
              {validationErrors.total_esi && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.total_esi}</p>
              )}
            </div>
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-3 gap-4">
           
            <div className='flex flex-col min-h-[90px]'>
              <label className="mb-2">Total Challan Amount</label>
              <OutlinedInput
                label="Total Amount As per Challan"
                value={formData.challan_amt || '0'}
                onChange={(value) => handleChange('challan_amt', parseFloat(value))}
              />
              {validationErrors.challan_amt && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.challan_amt}</p>
              )}
            </div>
            <div className='flex flex-col min-h-[90px]'>
              <label className="mb-2">Difference Reason</label>
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