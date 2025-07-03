import React, { useState, useEffect } from 'react'
import { Button, Dialog, Notification, toast } from '@/components/ui'
import { HiDownload } from 'react-icons/hi'
import OutlinedSelect from '@/components/ui/Outlined/Outlined'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import useAuth from '@/utils/hooks/useAuth'
import { useAppSelector } from '@/store'
import OutlinedInput from '@/components/ui/OutlinedInput'

interface SelectOption {
  value: string;
  label: string;
}

interface GenerateRegisterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  rowData: any;
}

const GenerateRegisterDialog: React.FC<GenerateRegisterDialogProps> = ({ 
  isOpen, 
  onClose,
  rowData 
}) => {
  const [selectedCompany, setSelectedCompany] = useState<SelectOption | null>(null);
  const [selectedState, setSelectedState] = useState<SelectOption | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<SelectOption | null>(null);
  const [selectedYear, setSelectedYear] = useState<SelectOption | null>(null);
  const [selectedRegisterType, setSelectedRegisterType] = useState<SelectOption | null>(null);
  const [companies, setCompanies] = useState<SelectOption[]>([]);
  const [states, setStates] = useState<SelectOption[]>([]);
  const [months, setMonths] = useState<SelectOption[]>([]);
  const [years, setYears] = useState<SelectOption[]>([]);
  const [registerTypes, setRegisterTypes] = useState<SelectOption[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const auth = useAuth();

  // Initialize register types
  useEffect(() => {
    setRegisterTypes([
      { value: 'Form A', label: 'Form A' }
      // Add more register types here if needed
    ]);
    // setSelectedRegisterType({ value: 'Form A', label: 'Form A' });
  }, []);

  // Fetch companies on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await httpClient.get(endpoints.company.getAll());
        const formattedCompanies = response.data?.data?.map((company: any) => ({
          value: company.id.toString(),
          label: company.name
        }));
        setCompanies(formattedCompanies || []);
      } catch (error) {
        console.error('Failed to fetch companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  // Fetch states when component mounts
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await httpClient.get(endpoints.common.state());
        console.log('States API response:', response.data);
        
        if (response.data && Array.isArray(response.data)) {
          const formattedStates = response.data.map((state: any) => ({
            value: state.id.toString(),
            label: state.name
          }));
          setStates(formattedStates);
        } else {
          console.error('Unexpected API response format:', response.data);
          toast.push(
            <Notification title="Error" type="error" closable>
              Unexpected data format from states API
            </Notification>
          );
        }
      } catch (error) {
        console.error('Failed to fetch states:', error);
        toast.push(
          <Notification title="Error" type="error" closable>
            Failed to load states
          </Notification>
        );
      }
    };

    if (isOpen) fetchStates();
  }, [isOpen]);

  // Initialize months and years
  useEffect(() => {
    // Generate months (January to December)
    const monthOptions = [
      { value: 'January', label: 'January' },
      { value: 'February', label: 'February' },
      { value: 'March', label: 'March' },
      { value: 'April', label: 'April' },
      { value: 'May', label: 'May' },
      { value: 'June', label: 'June' },
      { value: 'July', label: 'July' },
      { value: 'August', label: 'August' },
      { value: 'September', label: 'September' },
      { value: 'October', label: 'October' },
      { value: 'November', label: 'November' },
      { value: 'December', label: 'December' },
    ];
    setMonths(monthOptions);

    // Generate years (current year and previous 4 years)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 5 }, (_, i) => ({
      value: (currentYear - i).toString(),
      label: (currentYear - i).toString()
    }));
    setYears(yearOptions);
    setSelectedYear(yearOptions[0] || null);
  }, []);

  const handleGenerate = async () => {
    if (!selectedCompany || !selectedState || !selectedMonth || !selectedYear || !selectedRegisterType) {
      toast.push(
        <Notification title="Warning" type="warning" closable>
          Please fill all fields
        </Notification>
      );
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await httpClient.get(
        endpoints.register.exportRegister(),
        {
          params: {
            company_id: Number(selectedCompany.value),
            state_id: Number(selectedState.value),
            register_type: selectedRegisterType.value,
            month: selectedMonth.value,
            year: Number(selectedYear.value),
            register_data_id: rowData.id
          },
          responseType: 'blob'
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedRegisterType.value}_${selectedMonth.value}_${selectedYear.value}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.push(
        <Notification title="Success" type="success" closable>
          Register generated successfully
        </Notification>
      );
      onClose();
    } catch (error: any) {
      console.error('Generation error:', error);
      let errorMessage = 'Failed to generate register';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.join('\n');
      }

      toast.push(
        <Notification title="Error" type="error" closable>
          {errorMessage}
        </Notification>
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      onRequestClose={onClose}
      width={500}
    >
      <h5 className="mb-4">Generate Register</h5>
      
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Company</label>
          <OutlinedSelect
            options={companies}
            value={selectedCompany}
            onChange={setSelectedCompany}
            label="Select Company"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">State</label>
          <OutlinedSelect
            options={states}
            value={selectedState}
            onChange={setSelectedState}
            label="Select State"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Register Type</label>
          <OutlinedSelect
            options={registerTypes}
            value={selectedRegisterType}
            onChange={setSelectedRegisterType}
            label="Select Register Type"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Month</label>
            <OutlinedSelect
              options={months}
              value={selectedMonth}
              onChange={setSelectedMonth}
              label="Select Month"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Year</label>
            <OutlinedSelect
              options={years}
              value={selectedYear}
              onChange={setSelectedYear}
              label="Select Year"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="plain"
            onClick={onClose}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            onClick={handleGenerate}
            disabled={!selectedCompany || !selectedState || !selectedMonth || !selectedYear || !selectedRegisterType || isGenerating}
            loading={isGenerating}
            icon={<HiDownload />}
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default GenerateRegisterDialog;