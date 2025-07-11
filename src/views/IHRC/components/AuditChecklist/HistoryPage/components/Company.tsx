import React, { useState, useEffect } from 'react';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import DashboardFilter from './DashboardFilter';
import CustomDateRangePicker from './CustomDateRangePicker';
import { endpoints } from '@/api/endpoint';
import httpClient from '@/api/http-client';
import { Notification, toast } from '@/components/ui';
import OutlinedInput from '@/components/ui/OutlinedInput';
import store, { useAppDispatch } from '@/store';
import { fetchAuthUser } from '@/store/slices/login';

interface SelectOption {
  value: string;
  label: string;
}

interface BranchOption {
  label: string;
  value: string;
}

interface CompanyProps {
  onBranchChange?: (branch: BranchOption | null) => void;
  onCompanyGroupChange?: (companyGroup: SelectOption | null) => void;
  onCompanyChange?: (company: SelectOption | null) => void;
  onStateChange?: (state: SelectOption | null) => void;
  onDistrictChange?: (district: SelectOption | null) => void;
  onLocationChange?: (location: SelectOption | null) => void;
}

const Company: React.FC<CompanyProps> = ({
  onBranchChange,
  onCompanyGroupChange,
  onCompanyChange,
  onStateChange,
  onDistrictChange,
  onLocationChange
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCompanyGroup, setSelectedCompanyGroup] = useState<SelectOption | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<SelectOption | null>(null);
  const [selectedState, setSelectedState] = useState<SelectOption | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<SelectOption | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<SelectOption | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<BranchOption | null>(null);

  const [companyGroupName, setCompanyGroupName] = useState('');
  const [companyGroupId, setCompanyGroupId] = useState('');

  const [companyGroups, setCompanyGroups] = useState<SelectOption[]>([]);
  const [companies, setCompanies] = useState<SelectOption[]>([]);
  const [states, setStates] = useState<SelectOption[]>([]);
  const [districts, setDistricts] = useState<SelectOption[]>([]);
  const [location, setLocation] = useState<SelectOption[]>([]);
  const [locationId, setLocationId] = useState();
  const [branches, setBranches] = useState<BranchOption[]>([]);
  
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  const dispatch = useAppDispatch()
  const { login } = store.getState();
   const userType = login.user.type;

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

  // Load Company Groups
  const loadCompanyGroups = async () => {
    try {
      setIsLoading(true);

      if (userType === 'auditor') {
        // For auditor, use data from their profile
        const response = await dispatch(fetchAuthUser());
        const groupData = response.payload?.CompanyGroup;
        
        if (groupData) {
          const auditorGroup = {
            label: groupData.name,
            value: String(groupData.id)
          };
          
          setCompanyGroups([auditorGroup]);
          setSelectedCompanyGroup(auditorGroup);
          setCompanyGroupName(groupData.name);
          setCompanyGroupId(String(groupData.id));
          onCompanyGroupChange?.(auditorGroup);
          loadCompanies(String(groupData.id));
        } else {
          showNotification('warning', 'No company group assigned to auditor');
        }
      } else {
        // For admin/user, use the existing API call
        const { data } = await httpClient.get(endpoints.companyGroup.getAll(), {
          params: { ignorePlatform: true },
        });
        
        if (data.data && data.data.length > 0) {
          const formattedGroups = data.data.map((group: any) => ({
            label: group.name,
            value: String(group.id),
          }));

          setCompanyGroups(formattedGroups);
          
          if (formattedGroups.length > 0) {
            const defaultGroup = formattedGroups[0];
            setSelectedCompanyGroup(defaultGroup);
            setCompanyGroupName(defaultGroup.label);
            setCompanyGroupId(defaultGroup.value);
            onCompanyGroupChange?.(defaultGroup);
            loadCompanies(defaultGroup.value);
          }
        } else {
          showNotification('warning', 'No company group found');
        }
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
      const groupIdParam = [groupId];
      const { data } = await httpClient.get(endpoints.company.companyList(), {
        params: {
          'group_id[]': [groupId]
        }
      });
      if (Array.isArray(data)) {
        const formattedCompanies = data.map((company: any) => ({
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

  // Load States
  const loadStates = async () => {
    try {
      const response = await httpClient.get(endpoints.common.state());
      if (response.data) {
        const formattedStates = response.data.map((state: any) => ({
          label: state.name,
          value: String(state.id)
        }));
        setStates(formattedStates);
      }
      console.log(response.data);
      console.log('state  id ' + response.data.id);


    } catch (error) {
      console.error('Failed to load states:', error);
      showNotification('error', 'Failed to load states');
    }
  };

  // Load Districts based on selected State
  const loadDistricts = async (stateId: string) => {
    try {
      const response = await httpClient.get(endpoints.common.district(), {
        params: { state_id: stateId }
      });
      
      if (response.data) {
        const formattedDistricts = response.data.map((district: any) => ({
          label: district.name,
          value: String(district.id)
        }));
        setDistricts(formattedDistricts);
      }
      console.log(response.data);
      console.log('district  id ' + response.data.id);


    } catch (error) {
      console.error('Failed to load districts:', error);
      showNotification('error', 'Failed to load districts');
      setDistricts([]);
    }
  };

  const loadLocation = async (districtId: string) => {
    setIsLoadingBranches(true);
 
    try{
      const response = await httpClient.get(endpoints.common.location(), {
        params: { district_id: districtId}
      })
      // setLocationId(location.id);
 
      if (response.data) {
        const formattedLocation = response.data.map((location: any) => ({
          label: location.name,
          value: String(location.id)
        }));
        console.log("location data" + response.data);
       
        setLocation(formattedLocation);
      }
      // console.log(response.data);
      console.log('location  id ' + response.data.id);
      console.log('location district id ' + response.data.district_id);


    }
    catch (error) {
      console.error('Failed to load location:', error);
    }
  }

  // Load Branches based on selected District
  const loadBranches = async (locationId: string, locationName: string)  => {
    setIsLoadingBranches(true);
    try {
     
      const { data } = await httpClient.get(endpoints.branch.getAllBranch());

      console.log('branch  id ' + data.id);
      console.log('branch location id ' + data.location_id);

     
 
      console.log('Selected location:', { id: locationId, name: locationName });
      console.log('Available Branches:', data.data);
 
 
 
      // Filter branches where district_id matches the selected district
      const filteredBranches = data.data.filter((branch: any, location: any) => {
        const branchLocationId = String(location.id);
        const branchLocationName = branch.Location?.name?.toLowerCase();
        const selectedLocationName = locationName.toLowerCase();
       
        const matchById = branchLocationId === locationId;
        const matchByName = branchLocationName === selectedLocationName;
       
        console.log('Branch District:', {
          branchId: branch.id,
          branchName: branch.name,
          branchLocationId,
          locationId,
          branchLocationName,
          selectedLocationId: locationId,
          selectedLocationName,
          matchById,
          matchByName
        });
        console.log('location id' + locationId);
        console.log('branch location id' + branchLocationId);
        
       
        return matchById || matchByName;
      });
    console.log('Filtered Branches:', filteredBranches);
 
    const formattedBranches = filteredBranches.map((branch: any) => ({
      label: `${branch.name}`,
      value: String(branch.id),
    }));
   
    console.log('Formatted Branches:', formattedBranches);
    setBranches(formattedBranches);
   
    if (selectedBranch && !formattedBranches.find(b => b.value === selectedBranch.value)) {
      setSelectedBranch(null);
      onBranchChange?.(null);
    }
    console.log(data.data);
     
    } catch (error) {
      console.error('Failed to load branches:', error);
      showNotification('error', 'Failed to load branches');
      setBranches([]);
      setSelectedBranch(null);
      onBranchChange?.(null);
    } finally {
      setIsLoadingBranches(false);
    }
  };

  // Initial load of company groups and states
  useEffect(() => {
    loadCompanyGroups();
    loadStates();
  }, []);

  // Load companies when company group changes
  useEffect(() => {
    if (selectedCompanyGroup?.value) {
      setSelectedCompany(null);
      loadCompanies(selectedCompanyGroup.value);
    } else {
      setCompanies([]);
    }
  }, [selectedCompanyGroup]);

  // Load districts when state changes
  useEffect(() => {
    if (selectedState?.value) {
      setSelectedDistrict(null);
      setSelectedLocation(null);
      setSelectedLocation(null);
      setSelectedBranch(null);
      setLocation([]);
      setLocation([]);
      setBranches([]);
      loadDistricts(selectedState.value);
    } else {
      setDistricts([]);
      setLocation([]);
      setLocation([]);
      setBranches([]);
    }
  }, [selectedState]);


  useEffect(() => {
    if (selectedDistrict?.value) {
      setSelectedLocation(null);
    if (selectedDistrict?.value) {
      setSelectedLocation(null);
      setSelectedBranch(null);
      setBranches([]);
      loadLocation(selectedDistrict.value);
      setBranches([]);
      loadLocation(selectedDistrict.value);
    } else {
      setLocation([]);
      setBranches([]);
    }
  }}, [selectedDistrict])


  useEffect(() => {
    if (selectedLocation?.value) {
      setSelectedBranch(null);
      loadBranches(selectedLocation.value, selectedLocation.label);
    } else {
      setBranches([]);
    }
  }, [selectedLocation]);


  useEffect(() => {
    if (selectedLocation?.value) {
      setSelectedBranch(null);
      loadBranches(selectedLocation.value, selectedLocation.label);
    } else {
      setLocation([]);
      setBranches([]);
    }
  }, [selectedLocation]);

  const handleDateRangeApply = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };
  const handleCompanyGroupChange = (value: SelectOption | null) => {
    setSelectedCompanyGroup(value);
    onCompanyGroupChange?.(value);
  };

  const handleCompanyChange = (value: SelectOption | null) => {
    setSelectedCompany(value);
    onCompanyChange?.(value);
  };

  const handleStateChange = (value: SelectOption | null) => {
    if (value?.value === selectedState?.value) return;

    setSelectedState(value);
    onStateChange?.(value);
  };

  const handleDistrictChange = (value: SelectOption | null) => {
    setSelectedDistrict(value);
    onDistrictChange?.(value);
  };

  const handleBranchChange = (value: BranchOption | null) => {
    setSelectedBranch(value);
    onBranchChange?.(value);
  };
  
  const handleLocationChange = (value: SelectOption | null) => {
    setSelectedLocation(value);
    onLocationChange?.(value);
  };
  

  return (
    <div className="w-full flex items-center gap-3">
      {/* <div className="flex-1 min-w-[140px]">
        
        <OutlinedInput
          label="Company Group"
          value={companyGroupName} 
          onChange={() => {}}
        />
      </div> */}

      <div className="flex-1 min-w-[140px]">
        <OutlinedSelect
          label="Company"
          options={companies}
          value={selectedCompany}
          onChange={handleCompanyChange}
        />
      </div>

      <div className="flex-1 min-w-[140px]">
        <OutlinedSelect
          label="State"
          options={states}
          value={selectedState}
          onChange={handleStateChange}
        />
      </div>

      <div className="flex-1 min-w-[140px]">
        <OutlinedSelect
          label="District"
          options={districts}
          value={selectedDistrict}
          onChange={handleDistrictChange}
        />
      </div>
      <div className="flex-1 min-w-[140px]">
        <OutlinedSelect
          label="Location"
          options={location}
          value={selectedLocation}
          onChange={handleLocationChange}
        />
      </div>

      <div className="flex-1 min-w-[140px]">
        <OutlinedSelect
          label="Branch"
          value={selectedBranch}
          onChange={handleBranchChange}
          options={branches}
        
        />
      </div>

      {/* <div className="flex-none">
        <CustomDateRangePicker onApply={handleDateRangeApply} />
      </div>

      <div className="flex-none">
        <DashboardFilter />
      </div> */}
    </div>
  );
};

export default Company;

