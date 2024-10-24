import React, { useState } from 'react';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
// import DashboardFilter from './DashboardFilter';
// import CustomDateRangePicker from './CustomDateRangePicker';

const dummyData = {
  companyGroups: [
    { value: 'cg1', label: 'Company Group 1' },
    { value: 'cg2', label: 'Company Group 2' },
  ],
  companies: [
    { value: 'c1', label: 'CEAT' },
    { value: 'c2', label: 'MRF' },
  ],
  states: [
    { value: 's1', label: 'Bihar' },
    { value: 's2', label: 'West Bengal' },
  ],
  cities: [
    { value: 'city1', label: 'Muzaffarpur' },
    { value: 'city2', label: 'Patna' },
  ],
  branches: [
    { value: 'b1', label: 'Branch 1' },
    { value: 'b2', label: 'Branch 2' },
  ],
  registerStatus: [
    { value: 'january', label: 'January' },
    { value: 'february', label: 'February' },
    { value: 'march', label: 'March' },
    { value: 'april', label: 'April' },
    { value: 'may', label: 'May' },
    { value: 'june', label: 'June' },
    { value: 'july', label: 'July' },
    { value: 'august', label: 'August' },
    { value: 'september', label: 'September' },
    { value: 'october', label: 'October' },
    { value: 'november', label: 'November' },
    { value: 'december', label: 'December' },
  ],
  types:[
    { value: 'Uploaded', label: 'Uploaded' },
    { value: 'Not Uploaded', label: 'Not Uploaded' }
  ]
};

const OutputRegisterFilter = () => {
  const [selectedCompanyGroup, setSelectedCompanyGroup] = useState(dummyData.companyGroups[0]);
  const [selectedCompany, setSelectedCompany] = useState(dummyData.companies[0]);
  const [selectedState, setSelectedState] = useState(dummyData.states[0]);
  const [selectedCity, setSelectedCity] = useState(dummyData.cities[0]);
  const [selectedBranch, setSelectedBranch] = useState(dummyData.branches[0]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState(dummyData.types[0]);
  const [selectedRegisterStatus, setSelectedRegisterStatus] = useState(dummyData.registerStatus[0]);



  const handleDateRangeApply = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="flex gap-3 items-center">
      <div className="w-48 z-auto"> {/* 192px */}
        <OutlinedSelect
          label="Company Group"
          value={selectedCompanyGroup}
          onChange={setSelectedCompanyGroup}
          options={dummyData.companyGroups}
        />
      </div>

      <div className="w-44 z-auto"> {/* 176px */}
        <OutlinedSelect
          label="Company"
          value={selectedCompany}
          onChange={setSelectedCompany}
          options={dummyData.companies}
        />
      </div>

      <div className="w-44 z-auto"> {/* 144px */}
        <OutlinedSelect
          label="State"
          value={selectedState}
          onChange={setSelectedState}
          options={dummyData.states}
        />
      </div>

      <div className="w-44 z-auto"> {/* 160px */}
        <OutlinedSelect
          label="Location"
          value={selectedCity}
          onChange={setSelectedCity}
          options={dummyData.cities}
        />
      </div>

      <div className="w-44 z-auto"> {/* 160px */}
        <OutlinedSelect
          label="Branch"
          value={selectedBranch}
          onChange={setSelectedBranch}
          options={dummyData.branches}
        />
      </div>
      <div className="w-44 z-auto">
        <OutlinedSelect
          label="Month"
          value={selectedRegisterStatus}
          onChange={setSelectedRegisterStatus}
          options={dummyData.registerStatus}
        />
      </div>
      <div className="w-44 z-auto">
        <OutlinedSelect
          label="Types"
          value={selectedTypes}
          onChange={setSelectedTypes}
          options={dummyData.types}
        />
      </div>

      {/* <CustomDateRangePicker onApply={handleDateRangeApply} /> */}
      {/* <DashboardFilter /> */}
    </div>
  );
};

export default OutputRegisterFilter;