// import React, { useState } from 'react';
// import { Button, Input } from '@/components/ui';
// import OutlinedInput from '@/components/ui/OutlinedInput';
// import OutlinedSelect from '@/components/ui/Outlined/Outlined';




// export interface PFSetupData {
//     Company_Group_Name: string;
//     Company_Name: string;
//     pfCode: string;
//     pfCodeLocation: string;
//     registrationDate?: string;
//     pfUserId?: string;
//     pfPassword?: string;
//     authorizedSignatory: string;
//     signatoryDesignation?: string;
//     signatoryMobile?: string;
//     signatoryEmail?: string;
//     dscValidDate?: string;
//     esign?: string;
//     pfRegistrationCertificate?: File | null;
//   }





// interface PFSetupSidePanelProps {
//   addPFSetup: (newPFSetup: PFSetupData) => void;
//   onClose: () => void;
//   companyGroupName: string;
//   companyName: string;
// }

// interface SelectOption {
//   value: string;
//   label: string;
// }

// const PFSetupSidePanel: React.FC<PFSetupSidePanelProps> = ({
//   addPFSetup,
//   onClose,
//   companyGroupName,
//   companyName,
// }) => {
//     console.log("Received props:", { companyGroupName, companyName });
//   const [pfSetupData, setPfSetupData] = useState<PFSetupData>({
//     Company_Group_Name: companyGroupName,
//     Company_Name: companyName,
//     pfCode: '',
//     pfCodeLocation: '',
//     authorizedSignatory: '',
//   });

//   const handleInputChange = (field: keyof PFSetupData, value: string | File | null) => {
//     setPfSetupData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = () => {
//     if (pfSetupData.pfCode && pfSetupData.pfCodeLocation && pfSetupData.authorizedSignatory) {
//       addPFSetup(pfSetupData);
//       onClose();
//     } else {
//       // Show error message
//       console.error('Please fill in all required fields.');
//     }
//   };

//   const pfCodeLocations = ['Location A', 'Location B', 'Location C']; // Replace with actual locations
//   const existingSignatories = ['Amit', 'Krishna Kumar Singh', 'Ajay Thakur']; // Replace with actual signatories

//   return (
//     <div className="p-4 space-y-4">
//       <div className='flex gap-4 items-center'>
//     <OutlinedInput
//       label="Company Group Name"
//       value={pfSetupData.Company_Group_Name}
//       onChange={(value: string) => handleInputChange('Company_Group_Name', value)}
//       />
//     <OutlinedInput
//       label="Company Name"
//       value={pfSetupData.Company_Name}
//       onChange={(value: string) => handleInputChange('Company_Name', value)}
//       />
//       </div>

//       <div className='flex gap-4 items-center'>
//     <div className='flex flex-col gap-4'>
//         <label>Enter the PF Code</label>
//     <OutlinedInput
//       label="PF Code"
//       value={pfSetupData.pfCode}
//       onChange={(value: string) => handleInputChange('pfCode', value)}
//       />
//       </div>
//       <div className='flex flex-col gap-4'>
//       <label>Enter the PF Code Location</label>
//     <OutlinedInput
//       label="PF Code Location"
//       value={pfSetupData.pfCodeLocation || ''}
//       onChange={(value: string ) => handleInputChange('pfCodeLocation', value || '')}
//       />
//       </div>
//       </div>

//       <div className='flex gap-4 items-center'>
//         <div className='flex flex-col gap-4'>
//           <label>Enter PF Registration Date</label>
//     <OutlinedInput
//       label="PF Registration Date"
//       value={pfSetupData.registrationDate || ''}
//       onChange={(value: string) => handleInputChange('registrationDate', value)}
//       />
//       </div>
//       <div className='flex flex-col gap-4'>
//         <label>Enter PF user ID</label>
//     <OutlinedInput
//       label="PF User ID (Optional)"
//       value={pfSetupData.pfUserId || ''}
//       onChange={(value: string) => handleInputChange('pfUserId', value)}
//       />
//       </div>
//       </div>

//       <div className='flex gap-4 items-center'>
//       <div className='flex flex-col gap-4'>
//         <label>Enter PF User Password</label>
//     <OutlinedInput
//       label="PF Password (Optional)"
//       value={pfSetupData.pfPassword || ''}
//       onChange={(value: string) => handleInputChange('pfPassword', value)}
//       />
//       </div>



//       <div className='flex flex-col gap-4 w-52'>
//         <label>Choose the Signatory</label>
//     <OutlinedSelect
//       label="Authorized Signatory"
//       options={existingSignatories.map(name => ({ value: name, label: name }))}
//       value={pfSetupData.authorizedSignatory ? { value: pfSetupData.authorizedSignatory, label: pfSetupData.authorizedSignatory } : null}
//       onChange={(option: SelectOption | null) => handleInputChange('authorizedSignatory', option?.value || '')}
//       />
//       </div>
//       </div>
//     {/* <OutlinedInput
//       label="Designation"
//       value={pfSetupData.signatoryDesignation || ''}
//       onChange={(value: string) => handleInputChange('signatoryDesignation', value)}
//     /> */}
//     {/* <OutlinedInput
//       label="Signatory Mobile"
//       value={pfSetupData.signatoryMobile || ''}
//       onChange={(value: string) => handleInputChange('signatoryMobile', value)}
//     /> */}
//     {/* <OutlinedInput
//       label="Signatory Email"
//       value={pfSetupData.signatoryEmail || ''}
//       onChange={(value: string) => handleInputChange('signatoryEmail', value)}
//     /> */}
//     {/* <OutlinedInput
//       label="DSC Valid Up To"
//       value={pfSetupData.dscValidDate || ''}
//       onChange={(value: string) => handleInputChange('dscValidDate', value)}
//     /> */}
//     <div className='flex flex-col gap-4'>
//       <label>Please upload the PF certificate</label>
//     <Input
//       id="file-upload"
//       type="file"
//       onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0] || null;
//         handleInputChange('pfRegistrationCertificate', file);
//       }}
//       />
//       </div>
//     <div className="flex justify-end space-x-2">
//       <Button onClick={onClose}>Cancel</Button>
//       <Button variant="solid" onClick={handleSubmit}>Confirm</Button>
//     </div>
//   </div>
//   );
// };

// export default PFSetupSidePanel;



import React, { useState } from 'react';
import { Button, Input, Dialog } from '@/components/ui';
import OutlinedInput from '@/components/ui/OutlinedInput';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';

export interface PFSetupData {
  Company_Group_Name: string;
  Company_Name: string;
  pfCode: string;
  pfCodeLocation: string;
  registrationDate?: string;
  pfUserId?: string;
  pfPassword?: string;
  authorizedSignatory: string;
  signatoryDesignation?: string;
  signatoryMobile?: string;
  signatoryEmail?: string;
  dscValidDate?: string;
  esign?: string;
  pfRegistrationCertificate?: File | null;
}

interface PFSetupSidePanelProps {
  addPFSetup: (newPFSetup: PFSetupData) => void;
  onClose: () => void;
  companyGroupName: string;
  companyName: string;
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
  addPFSetup,
  onClose,
  companyGroupName,
  companyName,
}) => {
  const [pfSetupData, setPfSetupData] = useState<PFSetupData>({
    Company_Group_Name: companyGroupName,
    Company_Name: companyName,
    pfCode: '',
    pfCodeLocation: '',
    authorizedSignatory: '',
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

  const handleInputChange = (field: keyof PFSetupData, value: string | File | null) => {
    setPfSetupData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignatoryChange = (selectedOption: SelectOption | null) => {
    if (selectedOption) {
      if (selectedOption.value === 'add_new') {
        setShowAddSignatoryDialog(true);
      } else {
        const selectedSignatory = existingSignatories.find(s => s.name === selectedOption.value);
        if (selectedSignatory) {
          setPfSetupData(prev => ({
            ...prev,
            authorizedSignatory: selectedSignatory.name,
            signatoryDesignation: selectedSignatory.designation,
            signatoryMobile: selectedSignatory.mobile,
            signatoryEmail: selectedSignatory.email,
            dscValidDate: selectedSignatory.dscValidDate,
            esign: selectedSignatory.esign,
          }));
        }
      }
    }
  };

  const handleSubmit = () => {
    if (pfSetupData.pfCode && pfSetupData.pfCodeLocation && pfSetupData.authorizedSignatory) {
      addPFSetup(pfSetupData);
      onClose();
    } else {
      console.error('Please fill in all required fields.');
    }
  };

  const handleAddSignatory = () => {
    setExistingSignatories(prev => [...prev, newSignatory]);
    setPfSetupData(prev => ({
      ...prev,
      authorizedSignatory: newSignatory.name,
      signatoryDesignation: newSignatory.designation,
      signatoryMobile: newSignatory.mobile,
      signatoryEmail: newSignatory.email,
      dscValidDate: newSignatory.dscValidDate,
      esign: newSignatory.esign,
    }));
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
        <OutlinedInput
          label="Company Group Name"
          value={pfSetupData.Company_Group_Name}
          onChange={(value: string) => handleInputChange('Company_Group_Name', value)}
        />
        <OutlinedInput
          label="Company Name"
          value={pfSetupData.Company_Name}
          onChange={(value: string) => handleInputChange('Company_Name', value)}
        />
      </div>

      <div className='flex gap-4 items-center'>
        <div className='flex flex-col gap-4'>
          <label>Enter the PF Code</label>
          <OutlinedInput
            label="PF Code"
            value={pfSetupData.pfCode}
            onChange={(value: string) => handleInputChange('pfCode', value)}
          />
        </div>
        <div className='flex flex-col gap-4'>
          <label>Enter the PF Code Location</label>
          <OutlinedInput
            label="PF Code Location"
            value={pfSetupData.pfCodeLocation || ''}
            onChange={(value: string ) => handleInputChange('pfCodeLocation', value || '')}
          />
        </div>
      </div>

      <div className='flex gap-4 items-center'>
        <div className='flex flex-col gap-4'>
          <label>Enter PF Registration Date</label>
          <OutlinedInput
            label="PF Registration Date"
            value={pfSetupData.registrationDate || ''}
            onChange={(value: string) => handleInputChange('registrationDate', value)}
          />
        </div>
        <div className='flex flex-col gap-4'>
          <label>Enter PF user ID</label>
          <OutlinedInput
            label="PF User ID (Optional)"
            value={pfSetupData.pfUserId || ''}
            onChange={(value: string) => handleInputChange('pfUserId', value)}
          />
        </div>
      </div>

      <div className='flex gap-4 items-center'>
        <div className='flex flex-col gap-4'>
          <label>Enter PF User Password</label>
          <OutlinedInput
            label="PF Password (Optional)"
            value={pfSetupData.pfPassword || ''}
            onChange={(value: string) => handleInputChange('pfPassword', value)}
          />
        </div>

        <div className='flex flex-col gap-4 w-52'>
          <label>Choose the Signatory</label>
          <OutlinedSelect
            label="Authorized Signatory"
            options={[
              ...existingSignatories.map(s => ({ value: s.name, label: s.name })),
              { value: 'add_new', label: '+ Add New Signatory' }
            ]}
            value={pfSetupData.authorizedSignatory ? { value: pfSetupData.authorizedSignatory, label: pfSetupData.authorizedSignatory } : null}
            onChange={handleSignatoryChange}
          />
        </div>
      </div>

      <div className='flex flex-col gap-4'>
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