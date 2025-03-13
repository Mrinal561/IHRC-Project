
import React, { useState, useEffect } from 'react';
import { Button, Dialog, toast, Notification } from '@/components/ui';
import { HiPlusCircle } from 'react-icons/hi';
import OutlinedInput from '@/components/ui/OutlinedInput';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import Filter from './Filter';
import { endpoints } from '@/api/endpoint';
import httpClient from '@/api/http-client';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { createCompany } from '@/store/slices/company/companySlice';
import Bu from './Bu';

interface CompanyToolProps {
  onDataChange: () => void;
}

interface SelectOption {
  value: string;
  label: string;
}

interface NewCompany {
  name: string;
  group_id: number;
}

const CompanyNameTool: React.FC<CompanyToolProps> = ({ onDataChange }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [dialogIsOpen, setIsOpen] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [selectedCompanyGroup, setSelectedCompanyGroup] = useState<SelectOption | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyGroups, setCompanyGroups] = useState('');
  const [newCompany, setNewCompany] = useState<NewCompany>({
    name: '',
    group_id: 0
  });

  useEffect(() => {
    setNewCompany(prev => ({
      ...prev,
      name: companyName
    }));
  }, [companyName]);

  useEffect(() => {
    loadCompanyGroup();
  }, []);

  useEffect(() => {
    setNewCompany(prev => ({
      ...prev,
      group_id: selectedCompanyGroup?.value ? parseInt(selectedCompanyGroup.value) : 0
    }));
  }, [selectedCompanyGroup]);

  const loadCompanyGroup = async () => {
    try {
      const { data } = await httpClient.get(endpoints.companyGroup.getAll(), {
        params: { ignorePlatform: true },
      });
      setCompanyGroups(
        data.data.map((v: any) => ({
          label: v.name,
          value: String(v.id),
        }))
      );
    } catch (error) {
      console.error('Failed to load company groups:', error);
    }
  };

  const onDialogOk = async () => {
    setIsSubmitting(true);
    try {
      await dispatch(createCompany(newCompany));
      toast.push(
        <Notification title="Success" type="success" closable={true}>
          Company added successfully
        </Notification>
      );
      onDialogClose();
      console.log("re rendering in tool")
      onDataChange(); // This will trigger the parent component to refresh the data
    } catch (error) {
      toast.push(
        <Notification title="Failed" type="error" closable={true}>
          Failed to add company
        </Notification>
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDialogClose = () => {
    setIsOpen(false);
    setCompanyName('');
    setSelectedCompanyGroup(null);
  };

  return (
    <div className="flex gap-3 items-center">
      <Filter />
      <Bu />
      <Button
        size="sm"
        icon={<HiPlusCircle />}
        onClick={() => setIsOpen(true)}
        variant="solid"
      >
        AddsCompany
      </Button>
      <Dialog
        isOpen={dialogIsOpen}
        onClose={onDialogClose}
        onRequestClose={onDialogClose}
        shouldCloseOnOverlayClick={false} 
      >
        <h5 className="mb-4">Add Company</h5>
        <div className="mb-4 flex flex-col gap-3">
          <label>company group</label>
          <OutlinedInput
            label="Company Group"
            // options={companyGroups}
            value={companyGroups} onChange={function (value: string): void {
              throw new Error('Function not implemented.');
            } }            // onChange={setSelectedCompanyGroup}
          />
        </div>
        <div className="mb-4 flex flex-col gap-3">
          <label>Enter company name</label>
          <OutlinedInput
            label="Company"
            value={companyName}
            onChange={(value: string) => setCompanyName(value)}
          />
        </div>
        <div className="text-right mt-6">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            variant="plain"
            onClick={onDialogClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            onClick={onDialogOk}
            loading={isSubmitting}
          >
            Confirm
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default CompanyNameTool;