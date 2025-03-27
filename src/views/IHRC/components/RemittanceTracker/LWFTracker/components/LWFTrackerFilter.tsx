
import React, { useState, useEffect } from 'react';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import { endpoints } from '@/api/endpoint';
import httpClient from '@/api/http-client';
import { Notification, toast } from '@/components/ui';
import OutlinedInput from '@/components/ui/OutlinedInput';


const FINANCIAL_YEAR_KEY = 'selectedFinancialYear';
const FINANCIAL_YEAR_CHANGE_EVENT = 'financialYearChanged';


type Option = {
  value: string;
  label: string;
};

interface LWFTrackerFilterProps {
  onFilterChange: (filters: { 
    groupName: string; 
    groupId: string;
    companyName: string; 
    companyId: string;
    lwfCode: string ;
    // search: string;
    location_name: string;
  }) => void;
}

const LWFTrackerFilter: React.FC<LWFTrackerFilterProps> = ({ onFilterChange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [companyGroupName, setCompanyGroupName] = useState('');
  const [companyGroupId, setCompanyGroupId] = useState('');
  const [financialYear, setFinancialYear] = useState<string | null>(
    sessionStorage.getItem(FINANCIAL_YEAR_KEY)
  );

  const [selectedCompanyGroup, setSelectedCompanyGroup] = useState<Option | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Option | null>(null);
  const [selectedLwfCode, setSelectedLwfCode] = useState<Option | null>(null);

  const [companyGroups, setCompanyGroups] = useState<Option[]>([]);
  const [companies, setCompanies] = useState<Option[]>([]);
  const [lwfCodeOptions, setLwfCodeOptions] = useState<Option[]>([]);
  const [searchValue, setSearchValue] = useState('');
    const [locationValue, setLocationValue] = useState('');
  
  const handleSearchChange = (value: string) => {
    // setSearchValue(value);
    setLocationValue(value);
    
    // Trigger filter change with updated search value
    onFilterChange({
      groupName: selectedCompanyGroup?.label || '',
      groupId: selectedCompanyGroup?.value || '',
      companyName: selectedCompany?.label || '',
      companyId: selectedCompany?.value || '',
      lwfCode: selectedLwfCode?.value || '',
      // search: value
      location_name: value
    });
  };
  useEffect(() => {
    const handleFinancialYearChange = (event: CustomEvent) => {
      const newFinancialYear = event.detail;
      setFinancialYear(newFinancialYear);
      
      // Reset selections
      setSelectedCompany(null);
      setSelectedLwfCode(null);
      setCompanies([]);
      setLwfCodeOptions([]);
      
      // Reload companies if group selected
      if (selectedCompanyGroup?.value) {
        loadCompanies(selectedCompanyGroup.value);
      }
      
      // Update filters
      onFilterChange({
        groupName: selectedCompanyGroup?.label || '',
        groupId: selectedCompanyGroup?.value || '',
        companyName: '',
        companyId: '',
        lwfCode: '',
        // search:''
        location_name: ''
      });
    };
  
    window.addEventListener(
      FINANCIAL_YEAR_CHANGE_EVENT,
      handleFinancialYearChange as EventListener
    );
  
    return () => {
      window.removeEventListener(
        FINANCIAL_YEAR_CHANGE_EVENT,
        handleFinancialYearChange as EventListener
      );
    };
  }, [selectedCompanyGroup, onFilterChange]);
  const showNotification = (type: 'success' | 'info' | 'error' | 'warning', message: string) => {
    toast.push(
      <Notification
        title={type.charAt(0).toUpperCase() + type.slice(1)}
        type={type}
        closable={true}
      >
        {message}
      </Notification>
    );
  };

  // Load Company Groups
  const loadCompanyGroups = async () => {
    try {
      const { data } = await httpClient.get(endpoints.companyGroup.getAll(), {
        params: { ignorePlatform: true },
      });
      
      if (data.data && data.data.length > 0) {
        const defaultGroup = data.data[0];
        setCompanyGroupName(defaultGroup.name);
        setCompanyGroupId(String(defaultGroup.id));
        setSelectedCompanyGroup({
          value: String(defaultGroup.id),
          label: defaultGroup.name
        });
        
        // Trigger loading companies with the default group
        loadCompanies(String(defaultGroup.id));
      } else {
        showNotification('warning', 'No company group found');
      }
    } catch (error) {
      console.error('Failed to load company group:', error);
      showNotification('error', 'Failed to load company group');
    } finally {
      setIsLoading(false);
    }
  };

  // Load Companies based on selected Company Group
  const loadCompanies = async (groupId: string) => {
    try {
      const { data } = await httpClient.get(endpoints.company.getAll(), {
        params: {
          'group_id[]': [groupId]
        }
      });

      if (data?.data) {
        const formattedCompanies = data.data.map((company: any) => ({
          label: company.name,
          value: String(company.id),
        }));

        setCompanies(formattedCompanies);
        if (formattedCompanies.length === 0) {
          showNotification('info', 'No companies found for this group');
        }
      } else {
        setCompanies([]);
      }
    } catch (error: any) {
      console.error('Failed to load companies:', error);
      showNotification('error', error.response?.data?.message || 'Failed to load companies');
      setCompanies([]);
    }
  };

  // Load LWF Codes based on selected Company
  const loadLWFCodes = async (companyId: string) => {
    try {
      const { data } = await httpClient.get(endpoints.lwfSetup.getAllCodes(), {
        params: {
          'company_id[]': [companyId]
        }
      });

      if (data) {
        const formattedLWFCodes = data.map((lwfSetup: any) => ({
          label: lwfSetup.register_number,
          value: lwfSetup.register_number,
          companyId: String(lwfSetup.company_id),
          groupId: String(lwfSetup.group_id)
        }));

        setLwfCodeOptions(formattedLWFCodes);
        if (formattedLWFCodes.length === 0) {
          // showNotification('info', 'No LWF Codes found for this company');
        }
      } else {
        setLwfCodeOptions([]);
      }
    } catch (error: any) {
      console.error('Failed to load LWF Codes:', error);
      showNotification('error', error.response?.data?.message || 'Failed to load LWF Codes');
      setLwfCodeOptions([]);
    }
  };

  // Initial load of company groups
  useEffect(() => {
    loadCompanyGroups();
  }, []);

  // Load companies when company group changes
  useEffect(() => {
    if (selectedCompanyGroup?.value) {
      setSelectedCompany(null);
      setSelectedLwfCode(null);
      loadCompanies(selectedCompanyGroup.value);
    } else {
      setCompanies([]);
      setLwfCodeOptions([]);
    }
  }, [selectedCompanyGroup]);

  // Load LWF Codes when company changes
  useEffect(() => {
    if (selectedCompany?.value) {
      setSelectedLwfCode(null);
      loadLWFCodes(selectedCompany.value);
      
      // Trigger filter change when company is selected
      onFilterChange({
        groupName: selectedCompanyGroup?.label || '',
        groupId: selectedCompanyGroup?.value || '',
        companyName: selectedCompany.label,
        companyId: selectedCompany.value,
        lwfCode: '',
        // search:''
        location_name: ''
      });
    } else {
      setLwfCodeOptions([]);
    }
  }, [selectedCompany]);

  const handleCompanyGroupChange = (value: Option | null) => {
    setSelectedCompanyGroup(value);
    // Reset company and LWF code selections
    setSelectedCompany(null);
    setSelectedLwfCode(null);
    onFilterChange({
      groupName: value?.label || '',
      groupId: value?.value || '',
      companyName: '',
      companyId: '',
      lwfCode: '',
      // search: searchValue
      location_name: locationValue
    });
  };

  const handleCompanyChange = (value: Option | null) => {
    setSelectedCompany(value);
    setSelectedLwfCode(null);
    onFilterChange({
      groupName: value?.label || '',
      groupId: value?.value || '',
      companyName: value?.label || '',
      companyId: value?.value || '',
      lwfCode: '',
      // search: searchValue
      location_name: locationValue
    });
  };

  const handleLwfCodeChange = (value: Option | null) => {
    setSelectedLwfCode(value);
    // Trigger filter change with both company and LWF code
    onFilterChange({
      groupName: selectedCompanyGroup?.label || '',
      groupId: selectedCompanyGroup?.value || '',
      companyName: selectedCompany?.label || '',
      companyId: selectedCompany?.value || '',
      lwfCode: value?.value || '',
      // search: searchValue
      location_name: locationValue
    });
  };

  return ( 
    <div className="w-full grid grid-cols-3 gap-3"> 
      {/* <div className="min-w-0">
        <OutlinedSelect
          label="Group"
          options={companyGroups}
          value={selectedCompanyGroup}
          onChange={handleCompanyGroupChange}
          showClearButton={false}
        />
      </div> */}
      
      <div className="min-w-0">
        <OutlinedSelect
          label="Company"
          options={companies}
          value={selectedCompany}
          onChange={handleCompanyChange}
        />
      </div>
      
      <div className="min-w-0">
        <OutlinedSelect
          label="LWF Code"
          options={lwfCodeOptions}
          value={selectedLwfCode}
          onChange={handleLwfCodeChange}
        />
      </div> 
      <div className="min-w-0">
        <OutlinedInput
          label="Search By Location"
          value={locationValue}
          onChange={(e) => handleSearchChange(e)}
          maxLabelWidth='90%'
        />
      </div>
    </div>
  );
};

export default LWFTrackerFilter;