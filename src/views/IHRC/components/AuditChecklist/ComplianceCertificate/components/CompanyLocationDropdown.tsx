import React, { useState } from 'react';
import { Dropdown } from '@/components/ui/dropdown';
// import Company from '../../AssignChecklist/components/Company';

const CompanyLocationDropdowns = () => {
  const [selectedCompany, setSelectedCompany] = useState('Company');
  const [selectedLocation, setSelectedLocation] = useState('Location');

  const companies = [
    { key: 'apple', name: 'Apple' },
    { key: 'google', name: 'Google' },
    { key: 'microsoft', name: 'Microsoft' },
    { key: 'amazon', name: 'Amazon' },
  ];

  const locations = [
    { key: 'sf', name: 'San Francisco' },
    { key: 'ny', name: 'New York' },
    { key: 'la', name: 'Los Angeles' },
    { key: 'chicago', name: 'Chicago' },
  ];

  const onCompanySelect = (eventKey) => {
    const company = companies.find(c => c.key === eventKey);
    setSelectedCompany(company ? company.name : 'Select Company');
  };

  const onLocationSelect = (eventKey) => {
    const location = locations.find(l => l.key === eventKey);
    setSelectedLocation(location ? location.name : 'Select Location');
  };

  return (
    <div className="flex space-x-3">
      <div className="flex-1">
        <Dropdown title={selectedCompany} onSelect={onCompanySelect} className="w-full">
          {companies.map((company) => (
            <Dropdown.Item
              key={company.key}
              eventKey={company.key}
            >
              {company.name}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>
      <div className="flex-1">
        <Dropdown title={selectedLocation} onSelect={onLocationSelect} className="w-full">
          {locations.map((location) => (
            <Dropdown.Item
              key={location.key}
              eventKey={location.key}
            >
              {location.name}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>
    </div>
  );
};

export default CompanyLocationDropdowns;