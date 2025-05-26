import React, { useState } from 'react';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import { Notification, toast } from '@/components/ui';
import { HiDownload } from 'react-icons/hi';
import Button from '@/components/ui/Button';

interface SelectOption {
  value: string;
  label: string;
}

interface HistoryFilterProps {
  onCompanyChange?: (company: SelectOption | null) => void;
  onStateChange?: (state: SelectOption | null) => void;
  onActChange?: (act: SelectOption | null) => void;
  onMonthChange?: (month: SelectOption | null) => void;
  onComplianceTypeChange?: (type: SelectOption | null) => void;
  onDownload?: () => void;
}

const HistoryPageFilter: React.FC<HistoryFilterProps> = ({
  onCompanyChange,
  onStateChange,
  onActChange,
  onMonthChange,
  onComplianceTypeChange,
  onDownload
}) => {
  const [selectedCompany, setSelectedCompany] = useState<SelectOption | null>(null);
  const [selectedState, setSelectedState] = useState<SelectOption | null>(null);
  const [selectedAct, setSelectedAct] = useState<SelectOption | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<SelectOption | null>(null);
  const [selectedComplianceType, setSelectedComplianceType] = useState<SelectOption | null>(null);

  // Dummy data for companies
  const companies: SelectOption[] = [
    { label: 'Adani Solutions', value: 'adani-solutions' },
    { label: 'Adani Tech', value: 'adani-tech' }
  ];

  // Dummy data for states (10 states)
  const states: SelectOption[] = [
    { label: 'Maharashtra', value: 'maharashtra' },
    { label: 'Gujarat', value: 'gujarat' },
    { label: 'Rajasthan', value: 'rajasthan' },
    { label: 'Karnataka', value: 'karnataka' },
    { label: 'Tamil Nadu', value: 'tamil-nadu' },
    { label: 'Uttar Pradesh', value: 'uttar-pradesh' },
    { label: 'West Bengal', value: 'west-bengal' },
    { label: 'Madhya Pradesh', value: 'madhya-pradesh' },
    { label: 'Punjab', value: 'punjab' },
    { label: 'Haryana', value: 'haryana' }
  ];

  // Dummy data for acts
  const acts: SelectOption[] = [
    { label: 'Companies Act 2013', value: 'companies-act-2013' },
    { label: 'Labour Act', value: 'labour-act' },
    { label: 'Tax Act', value: 'tax-act' },
    { label: 'Environmental Protection Act', value: 'environmental-protection-act' }
  ];

  // Dummy data for months
  const months: SelectOption[] = [
    { label: 'January', value: '1' },
    { label: 'February', value: '2' },
    { label: 'March', value: '3' },
    { label: 'April', value: '4' },
    { label: 'May', value: '5' },
    { label: 'June', value: '6' },
    { label: 'July', value: '7' },
    { label: 'August', value: '8' },
    { label: 'September', value: '9' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' }
  ];

  // Dummy data for compliance types
  const complianceTypes: SelectOption[] = [
    { label: 'Complied', value: 'complied' },
    { label: 'Not Complied', value: 'not-complied' },
    { label: 'Not Applicable', value: 'not-applicable' }
  ];

  const showNotification = (type: 'success' | 'info' | 'error' | 'warning', message: string) => {
    toast.push(
      <Notification
        title={type.charAt(0).toUpperCase() + type.slice(1)}
        type={type}
      >
        {message}
      </Notification>
    );
  };

  const handleCompanyChange = (value: SelectOption | null) => {
    setSelectedCompany(value);
    onCompanyChange?.(value);
  };

  const handleStateChange = (value: SelectOption | null) => {
    setSelectedState(value);
    onStateChange?.(value);
  };

  const handleActChange = (value: SelectOption | null) => {
    setSelectedAct(value);
    onActChange?.(value);
  };

  const handleMonthChange = (value: SelectOption | null) => {
    setSelectedMonth(value);
    onMonthChange?.(value);
  };

  const handleComplianceTypeChange = (value: SelectOption | null) => {
    setSelectedComplianceType(value);
    onComplianceTypeChange?.(value);
  };

  const handleDownload = () => {
    onDownload?.();
    showNotification('success', 'Filtered data downloaded successfully');
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-3 mb-4">
      <div className="w-full md:flex-1 min-w-[140px]">
        <OutlinedSelect
          label="Company"
          options={companies}
          value={selectedCompany}
          onChange={handleCompanyChange}
        />
      </div>

      <div className="w-full md:flex-1 min-w-[140px]">
        <OutlinedSelect
          label="State"
          options={states}
          value={selectedState}
          onChange={handleStateChange}
        />
      </div>

      <div className="w-full md:flex-1 min-w-[140px]">
        <OutlinedSelect
          label="Act Name"
          options={acts}
          value={selectedAct}
          onChange={handleActChange}
        />
      </div>

      <div className="w-full md:flex-1 min-w-[140px]">
        <OutlinedSelect
          label="Month"
          options={months}
          value={selectedMonth}
          onChange={handleMonthChange}
        />
      </div>

      <div className="w-full md:flex-1 min-w-[140px]">
        <OutlinedSelect
          label="Compliance Status"
          options={complianceTypes}
          value={selectedComplianceType}
          onChange={handleComplianceTypeChange}
        />
      </div>

      <div className="w-full md:w-auto">
        <Button
          size="sm"
          variant="solid"
          icon={<HiDownload />}
          onClick={handleDownload}
          className="w-full md:w-auto"
        >
          Download Data
        </Button>
      </div>
    </div>
  );
};

export default HistoryPageFilter;