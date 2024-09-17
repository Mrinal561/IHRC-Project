import React, { useState } from 'react';
import { Button, Input, Dialog, toast, Notification, DatePicker, Select } from '@/components/ui';
import OutlinedInput from '@/components/ui/OutlinedInput';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import { MultiValue, ActionMeta } from 'react-select';

export interface PFSetupData {
  Company_Group_Name: string;
  Company_Name: string;
  pfCode: string;
  pfCodeLocation: string;
  registrationDate?: Date | null;
  pfUserId?: string;
  pfPassword?: string;
  authorizedSignatory: string[];
  signatoryDesignation?: string;
  signatoryMobile?: string;
  signatoryEmail?: string;
  dscValidDate?: string;
  esign?: string;
  pfRegistrationCertificate?: File | null;
}

interface PFSetupSidePanelProps {
  // addPFSetup: (newPFSetup: PFSetupData) => void;
  onClose: () => void;
  companyGroupName: string;
  companyName: string;
  pfSetupData?: PFSetupData;
}

interface SelectOption {
  value: string;
  label: string;
}

interface Signatory {
  name: string;
  designation: string;
  mobile: string;
  email: string;
  dscValidDate: string;
  esign: string;
}

const PFSetupSidePanel: React.FC<PFSetupSidePanelProps> = ({
  // addPFSetup,
  onClose,
  companyGroupName,
  companyName,
}) => {
  const [pfSetupData, setPfSetupData] = useState<PFSetupData>({
    Company_Group_Name: companyGroupName,
    Company_Name: companyName,
    pfCode: '',
    pfCodeLocation: '',
    authorizedSignatory: [],
    registrationDate: null,
  });

  const [existingSignatories, setExistingSignatories] = useState<Signatory[]>([
    { name: 'Amit', designation: 'Manager', mobile: '1234567890', email: 'amit@example.com', dscValidDate: '2024-12-31', esign: 'Active' },
    { name: 'Krishna Kumar Singh', designation: 'Director', mobile: '9876543210', email: 'krishna@example.com', dscValidDate: '2025-06-30', esign: 'Active' },
    { name: 'Ajay Thakur', designation: 'CFO', mobile: '5555555555', email: 'ajay@example.com', dscValidDate: '2024-09-30', esign: 'Inactive' },
  ]);

  const [showAddSignatoryDialog, setShowAddSignatoryDialog] = useState(false);
  const [newSignatory, setNewSignatory] = useState<Signatory>({
    name: '',
    designation: '',
    mobile: '',
    email: '',
    dscValidDate: '',
    esign: '',
  });

  const handleInputChange = (field: keyof PFSetupData, value: string | Date | null | File | string[]) => {
    setPfSetupData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignatoryChange = (
    newValue: MultiValue<{ value: string; label: string }>,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    const selectedSignatories = newValue.map(option => option.value);
    handleInputChange('authorizedSignatory', selectedSignatories);

    if (actionMeta.action === 'select-option' && actionMeta.option?.value === 'add_new') {
      setShowAddSignatoryDialog(true);
      handleInputChange('authorizedSignatory', selectedSignatories.filter(name => name !== 'add_new'));
    }
  };



  const handleSubmit = () => {
    if (pfSetupData.pfCode && pfSetupData.pfCodeLocation && pfSetupData.authorizedSignatory) {
      // addPFSetup(pfSetupData);
      toast.push(
        <Notification title="Success" type="success">
          <div className="flex items-center">
            <span>PF Setup successfully created</span>
          </div>
        </Notification>
      );
      onClose();
    } else {
      toast.push(
        <Notification title="Error" type="danger">
          <div className="flex items-center">
            <span>Please fill in all required fields</span>
          </div>
        </Notification>
      );
    }
  };

  const handleAddSignatory = () => {
    setExistingSignatories(prev => [...prev, newSignatory]);
    setShowAddSignatoryDialog(false);
    setNewSignatory({
      name: '',
      designation: '',
      mobile: '',
      email: '',
      dscValidDate: '',
      esign: '',
    });
  };

  const handleNewSignatoryInputChange = (field: keyof Signatory, value: string) => {
    setNewSignatory(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4 space-y-4">
       <div className='flex gap-4 items-center'>
        <div className='w-full'>
        <OutlinedInput
          label="Company Group Name"
          value={pfSetupData.Company_Group_Name}
          onChange={(value: string) => handleInputChange('Company_Group_Name', value)}
          />
          </div>
          <div className='w-full'>
        <OutlinedInput
          label="Company Name"
          value={pfSetupData.Company_Name}
          onChange={(value: string) => handleInputChange('Company_Name', value)}
          />
          </div>
      </div>

       <div className='flex gap-4 items-center'>
        <div className='flex flex-col gap-2'>
          <label>Enter the PF Code</label>
          <div className='w-[352px]'>
          <OutlinedInput
            label="PF Code"
            value={pfSetupData.pfCode}
            onChange={(value: string) => handleInputChange('pfCode', value)}
            />
            </div>
        </div>
        <div className='flex flex-col gap-2'>
          <label>Enter the PF Location</label>
          <div className='w-[352px]'>
          <OutlinedInput
            label="Location"
            value={pfSetupData.pfCodeLocation}
            onChange={(value: string) => handleInputChange('pfCodeLocation', value)}
            />
            </div>
        </div>
      </div>


      <div className='flex gap-4 items-center'>
      <div className='flex flex-col gap-2'>
          <label>Enter PF user ID</label>
          <div className='w-[352px]'>
          <OutlinedInput
            label="PF User ID (Optional)"
            value={pfSetupData.pfUserId || ''}
            onChange={(value: string) => handleInputChange('pfUserId', value)}
            />
            </div>
        </div>
        <div className='flex flex-col gap-2'>
          <label>Enter PF User Password</label>
          <div className='w-[352px]'>
          <OutlinedInput
            label="PF Password (Optional)"
            value={pfSetupData.pfPassword || ''}
            onChange={(value: string) => handleInputChange('pfPassword', value)}
            />
            </div>
        </div>
      </div>

      <div className='flex gap-4 items-center'>
        <div className='flex flex-col gap-2'>
          <label>PF Registration Date</label>
          <div className='w-56'>
          <DatePicker
            placeholder="Select date"
            value={pfSetupData.registrationDate}
            onChange={(date: Date | null) => handleInputChange('registrationDate', date)}
            />
            </div>
        </div>

        <div className='flex flex-col gap-2 w-full'>
          <label>Choose the Signatories</label>
          <div className=''>
          <Select
            isMulti
            options={[
              ...existingSignatories.map(s => ({ value: s.name, label: s.name })),
              { value: 'add_new'}
            ]}
            // value={pfSetupData.authorizedSignatory.map(name => ({ value: name, label: name }))}
            // onChange={handleSignatoryChange}
            />
            </div>
        </div>
      </div>


      <div className='flex flex-col gap-2'>
        <label>Please upload the PF certificate</label>
        <Input
          id="file-upload"
          type="file"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0] || null;
            handleInputChange('pfRegistrationCertificate', file);
          }}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="solid" onClick={handleSubmit}>Confirm</Button>
      </div>

      <Dialog
        isOpen={showAddSignatoryDialog}
        onClose={() => setShowAddSignatoryDialog(false)}
      >
        <h5 className="mb-4">Add New Signatory</h5>
        <div className="space-y-4">
          <OutlinedInput
            label="Name"
            value={newSignatory.name}
            onChange={(value) => handleNewSignatoryInputChange('name', value)}
          />
          <OutlinedInput
            label="Designation"
            value={newSignatory.designation}
            onChange={(value) => handleNewSignatoryInputChange('designation', value)}
          />
          <OutlinedInput
            label="Mobile"
            value={newSignatory.mobile}
            onChange={(value) => handleNewSignatoryInputChange('mobile', value)}
          />
          <OutlinedInput
            label="Email"
            value={newSignatory.email}
            onChange={(value) => handleNewSignatoryInputChange('email', value)}
          />
          <OutlinedInput
            label="DSC Valid Date"
            value={newSignatory.dscValidDate}
            onChange={(value) => handleNewSignatoryInputChange('dscValidDate', value)}
          />
          <OutlinedInput
            label="E-Sign"
            value={newSignatory.esign}
            onChange={(value) => handleNewSignatoryInputChange('esign', value)}
          />
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={() => setShowAddSignatoryDialog(false)}>Cancel</Button>
          <Button variant="solid" onClick={handleAddSignatory}>Add Signatory</Button>
        </div>
      </Dialog>
    </div>
  );
};

export default PFSetupSidePanel;