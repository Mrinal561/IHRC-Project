import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { HiDownload, HiPlusCircle, HiUpload } from 'react-icons/hi';
import DueComplianceTableSearch from './DueComplianceTableSearch';
import { Dialog, Input, Notification, toast } from '@/components/ui';
import { Select } from '@/components/ui';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import OutlinedSelect from '@/components/ui/Outlined/Outlined'

interface DueComplianceDataRow {
  id: number;
  uuid: string;
  // ... other properties
}

interface DueComplianceTableToolProps {
  data: DueComplianceDataRow[];
  onUploadAll: (selectedComplianceIds: number[], remark: string) => void;
  canCreate: boolean;
  selectedRole: 'owner' | 'approver' | 'auditor';
  onRoleChange: (role: 'owner' | 'approver' | 'auditor') => void;
  userType: string;
  onSearch: (searchTerm: string) => void;
}

const DueComplianceTableTool: React.FC<DueComplianceTableToolProps> = ({
  data,
  onUploadAll,
  canCreate,
  selectedRole,
  onRoleChange,
  userType,
  onSearch
}) => {
  const navigate = useNavigate();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [remark, setRemark] = useState('');

  console.log('TableTool - Current user type:', userType, 'Selected role:', selectedRole);

  // Define role options based on user type
  const filteredRoleOptions = useMemo(() => {
    const allOptions = [
      { value: 'owner', label: 'As a Owner' },
      { value: 'approver', label: 'As a Approver' },
      { value: 'auditor', label: 'As a Auditor' },
    ];

    // Admin can see all options
    if (userType === 'admin') {
      return allOptions;
    }
    
    // Auditor can only see auditor view
    if (userType === 'auditor') {
      return allOptions.filter(option => option.value === 'auditor');
    }
    
    // Other users can see owner and approver
    return allOptions.filter(option => option.value === 'owner' || option.value === 'approver');
  }, [userType]);

  const handleRoleSelect = (selectedOption: any) => {
    console.log('Role selected:', selectedOption);
     const roleValue = typeof selectedOption === 'string' 
      ? selectedOption 
      : selectedOption?.value || selectedOption;
    
    console.log('Extracted role value:', roleValue);
    onRoleChange(roleValue as 'owner' | 'approver' | 'auditor');
  };

 const handleConfirm = () => {
  // If you're not using these properties, remove these lines:
  // const eligibleComplianceIds = data
  //   .filter((item) => item.Proof_Of_Compliance_Mandatory === 'No')
  //   .map((item) => item.Compliance_Instance_ID);
  
  // Replace with whatever logic you actually need
  const eligibleComplianceIds = data.map(item => item.id);
  
  onUploadAll(eligibleComplianceIds, remark);
  setDialogIsOpen(false);
  setRemark('');
  
  toast.push(
    <Notification title="Success" type="success">
      Compliance Uploaded Successfully
    </Notification>,
  );
};

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-3">
      <DueComplianceTableSearch onSearch={onSearch} />
      
      {/* Role Selector */}
      <div className="w-52">
        <OutlinedSelect
          label="Select a view"
          options={filteredRoleOptions}
  value={filteredRoleOptions.find(option => option.value === selectedRole) || filteredRoleOptions[0]}
          onChange={handleRoleSelect}
        />
      </div>
      
     

      <Dialog
        isOpen={dialogIsOpen}
        onClose={() => setDialogIsOpen(false)}
      >
        <h5 className="mb-4">Upload Compliances</h5>
        <p>{selectedCount} compliances selected for upload.</p>
        <Input
          placeholder="Enter remark"
          textArea
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
        <div className="text-right mt-6">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            variant="plain"
            onClick={() => setDialogIsOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default DueComplianceTableTool;