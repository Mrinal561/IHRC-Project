import React, { useEffect, useState } from 'react';
import { Dialog, Button, Input, toast, Notification, DatePicker } from '@/components/ui';
import { FaUserShield } from 'react-icons/fa';
import OutlinedInput from '@/components/ui/OutlinedInput';
import dayjs from 'dayjs';

interface PfChallanData {
    id: number;
    trrn_no?: string | null;
    crn_no?: string | null;
    epf_wage?: number | null;
    eps_wage?: number | null;
    edli_wage?: number | null;
    total_challan_amt?: number | null;
    payment_date?: string | null;
    no_of_emp?: number | null;
    delay_reason?: string | null;
    difference_reason?: string | null;
    total_paid_amt?: number | null;
    // Add any other fields that exist in the imported type
  }

interface RequestToAdminDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, updateData?: Record<string, any>) => Promise<void>;
  loading?: boolean;
  trackerData?: PfChallanData;
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
        trrn_no: trackerData.trrn_no || '',
        crn_no: trackerData.crn_no || '',
        epf_wage: trackerData.epf_wage || 0,
        eps_wage: trackerData.eps_wage || 0,
        edli_wage: trackerData.edli_wage || 0,
        total_challan_amt: trackerData.total_challan_amt || 0,
        payment_date: trackerData.payment_date || '',
        no_of_emp: trackerData.no_of_emp || 0,
        delay_reason: trackerData.delay_reason || '',
        difference_reason: trackerData.difference_reason || '',
        total_paid_amt: trackerData.total_paid_amt || 0
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
        <Notification title="Error" type="danger" closable={true}>
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
        
        if (JSON.stringify(formData[key]) !== JSON.stringify(trackerData[key as keyof PfChallanData])) {
          changedFields[key] = formData[key];
        }
      });
    }

    // If no fields actually changed
    if (Object.keys(changedFields).length === 0) {
      toast.push(
        <Notification title="Error" type="danger" closable={true}>
          Please make at least one change to request edit
        </Notification>
      );
      return;
    }

    try {
     await onConfirm(reason, changedFields);
      onClose();
    } catch (error) {
      console.error('Request failed:', error);
      throw error
    }
  };

  const formatDateForDisplay = (dateString: string | undefined): Date | undefined => {
    if (!dateString) return undefined;
    return dayjs(dateString).toDate();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} shouldCloseOnOverlayClick={false} width={1000}>
      <div className="">
        <h4 className="mb-2">Edit Fields</h4>
        
        <div className="">
          {/* First Row */}
          <div className='grid grid-cols-4 gap-4'>
            <div className='flex flex-col min-h-[90px]'>
              <label className="mb-2">TRRN Number</label>
              <OutlinedInput
                label="TRRN Number"
                value={formData.trrn_no || ''}
                onChange={(value) => handleChange('trrn_no', value)}
              />
              {validationErrors.trrn_no && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.trrn_no}</p>
              )}
            </div>
            
            <div className='flex flex-col min-h-[90px]'>
              <label className="mb-2">CRN Number</label>
              <OutlinedInput
                label="CRN Number"
                value={formData.crn_no || ''}
                onChange={(value) => handleChange('crn_no', value)}
              />
              {validationErrors.crn_no && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.crn_no}</p>
              )}
            </div>
            <div className='flex flex-col min-h-[90px]'>
              <label className="mb-2">EPF Wages</label>
              <OutlinedInput
                label="EPF Wages"
                value={formData.epf_wage?.toString() || '0'}
                onChange={(value) => handleChange('epf_wage', parseFloat(value))}
              />
              {validationErrors.epf_wage && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.epf_wage}</p>
              )}
            </div>

            <div className='flex flex-col min-h-[90px]'>
              <label className="mb-2">EPS Wages</label>
              <OutlinedInput
                label="EPS Wages"
                value={formData.eps_wage?.toString() || '0'}
                onChange={(value) => handleChange('eps_wage', parseFloat(value))}
              />
              {validationErrors.eps_wage && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.eps_wage}</p>
              )}
            </div>
            
          </div>

          {/* Second Row */}
          <div className='grid grid-cols-4 gap-4'>
            
            
            
            
            <div className='flex flex-col min-h-[90px]'>
              <label className="mb-2">EDLI Wages</label>
              <OutlinedInput
                label="EDLI Wages"
                value={formData.edli_wage?.toString() || '0'}
                onChange={(value) => handleChange('edli_wage', parseFloat(value))}
              />
              {validationErrors.edli_wage && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.edli_wage}</p>
              )}
            </div>
            <div className='flex flex-col min-h-[90px]'>
              <label className="mb-2">Total Challan Amount</label>
              <OutlinedInput
                label="Total Challan Amount"
                value={formData.total_challan_amt?.toString() || '0'}
                onChange={(value) => handleChange('total_challan_amt', parseFloat(value))}
              />
              {validationErrors.total_challan_amt && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.total_challan_amt}</p>
              )}
            </div>

            <div className='flex flex-col min-h-[90px]'>
              <label className="mb-2">Total Paid Amount</label>
              <OutlinedInput
                label="Total Paid Amount"
                value={formData.total_paid_amt?.toString() || '0'}
                onChange={(value) => handleChange('total_paid_amt', parseFloat(value))}
              />
              {validationErrors.total_paid_amt && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.total_paid_amt}</p>
              )}
            </div>

            <div className='flex flex-col min-h-[90px]'>
              <label className="mb-2">Payment Date</label>
              <DatePicker
                size='sm'
                placeholder="Payment Date"
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

          {/* Third Row */}
          <div className='grid grid-cols-3 gap-4'>
            
            <div className='flex flex-col min-h-[90px]'>
              <label className="mb-2">Number of Employees</label>
              <OutlinedInput
                label="Number of Employees"
                value={formData.no_of_emp?.toString() || '0'}
                onChange={(value) => handleChange('no_of_emp', parseInt(value, 10))}
              />
              {validationErrors.no_of_emp && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.no_of_emp}</p>
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