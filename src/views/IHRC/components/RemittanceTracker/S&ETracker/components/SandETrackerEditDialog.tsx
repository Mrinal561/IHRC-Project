import React, { useState, useEffect } from 'react';
import { Dialog, Button, DatePicker, toast, Notification } from '@/components/ui';
import OutlinedInput from '@/components/ui/OutlinedInput';
import OutlinedSelect from '@/components/ui/Outlined';
import { SandETrackerData } from './SandETrackerTable';

interface PFTrackerEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (editedData: SandETrackerData) => void;
  data: SandETrackerData;
}

const SandETrackerEditDialog: React.FC<PFTrackerEditDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  data,
}) => {
  const [editedData, setEditedData] = useState<SandETrackerData>(data);

  useEffect(() => {
    setEditedData(data);
  }, [data]);

  const handleChange = (field: keyof SandETrackerData, value: string | number) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(editedData);
    onClose();
    openNotification('success', 'S&E Tracker edited successfully');

  };
  
  const handleDateChange = (field: 'dueDate' | 'branchOpeningDate' | 'aggreedDueDate' | 'actualDate', date: Date | null) => {
    if (date) {
      handleChange(field, date.toISOString().split('T')[0]);
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

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      onRequestClose={onClose}
      width={1000}
      height={550}
    >
      <h5 className="mb-4">Edit S&E Tracker Details</h5>

      
      <div className="p-2 space-y-4">
        <div className='flex gap-4 items-center'>
        <div className='flex flex-col gap-2 w-full'>
            <label>Enter State</label>
            <div className=' w-full'>
              <OutlinedInput
                label="State"
                value={editedData.state.toString()}
                onChange={(value) => handleChange('state', parseInt(value, 10))}
              />
            </div>
          </div>
          <div className='flex flex-col gap-2 w-full'>
            <label>Enter Location</label>
            <div className=' w-full'>
              <OutlinedInput
                label="Location"
                value={editedData.location}
                onChange={(value) => handleChange('location', value)}
              />
            </div>
          </div>
          <div className='flex flex-col gap-2 w-full'>
            <label>Enter S&E Number</label>
            <div className='w-full'>
              <OutlinedInput
                label="S&E Number"
                value={editedData.sandeNumber.toString()}
                onChange={(value) => handleChange('sandeNumber', parseFloat(value))}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          
          <div className='flex flex-col gap-2 w-full'>
            <label>Enter User Id</label>
            <div className='w-full'>
              <OutlinedInput
                label="User ID"
                value={editedData.userId.toString()}
                onChange={(value) => handleChange('userId', parseFloat(value))}
              />
            </div>
          </div>
          <div className='flex flex-col gap-2 w-full'>
            <label>Enter Password</label>
            <div className='w-full'>
              <OutlinedInput
                label="Password"
                value={editedData.password.toString()}
                onChange={(value) => handleChange('password', parseFloat(value))}
              />
            </div>
          </div>
          <div className='flex flex-col gap-2 w-full'>
            <label>Enter Delay</label>
            <div className='w-full'>
              <OutlinedInput
                label="Delay"
                value={editedData.delay}
                onChange={(value) => handleChange('delay', value)}
              />
            </div>
          </div>
          <div className='flex flex-col gap-2 w-full'>
            <label>Enter Delay Reason</label>
            <div className='w-full'>
              <OutlinedInput
                label="Delay Reason"
                value={editedData.delayReason}
                onChange={(value) => handleChange('delayReason', value)}
              />
            </div>
          </div>
        </div>



        <div className="flex gap-4 items-center">
          
        <div className='flex flex-col gap-2 w-full'>
            <label>Select Branch Opening Date</label>
            <div className='w-[219px]'>
              <DatePicker
                placeholder="Branch Opening Date"
                value={new Date(editedData.branchOpeningDate)}
                onChange={(date) => handleDateChange('branchOpeningDate', date)}
              />
            </div>
          </div>
          <div className='flex flex-col gap-2 w-full'>
            <label>Select Due Date</label>
            <div className='w-[219px]'>
              <DatePicker
                placeholder="Due Date"
                value={new Date(editedData.dueDate)}
                onChange={(date) => handleDateChange('dueDate', date)}
              />
            </div>
          </div>
        <div className='flex flex-col gap-2 w-full'>
            <label>Select Agreed Date</label>
            <div className=' w-full'>
              <DatePicker
                placeholder="Month"
                value={new Date(editedData.aggreedDueDate)}
                onChange={(date) => handleDateChange('aggreedDueDate', date)}
              />
            </div>
          </div>
          <div className='flex flex-col gap-2 w-full'>
            <label>Select Actual Date</label>
            <div className=' w-full'>
              <DatePicker
                placeholder="Due Date"
                value={new Date(editedData.actualDate)}
                onChange={(date) => handleDateChange('actualDate', date)}
              />
            </div>
          </div>
        </div>
        </div>
        





        <div className='flex gap-4 items-center'>
          <div className='flex flex-col gap-2 w-full'>
            <label>Enter Branch Address</label>
            <div className='w-full'>
              <OutlinedInput
                label="Delay Reason"
                value={editedData.address}
                onChange={(value) => handleChange('address', value)}
                textarea={true}
              />
            </div>
          </div>
        </div>
        

      <div className="flex justify-end mt-6">
        <Button variant="plain" onClick={onClose} className="mr-2">
          Cancel
        </Button>
        <Button variant="solid" onClick={handleSubmit}>
          Save Changes
        </Button>
      </div>
    </Dialog>
  );
};

export default SandETrackerEditDialog;