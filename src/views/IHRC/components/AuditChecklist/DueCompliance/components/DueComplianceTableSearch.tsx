import React, { useState } from 'react';
import { Input } from '@/components/ui';
import { HiOutlineSearch } from 'react-icons/hi';

interface DueComplianceTableSearchProps {
  onSearch: (searchTerm: string) => void;
}

const DueComplianceTableSearch: React.FC<DueComplianceTableSearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="w-52">
      <Input
        placeholder="Search compliance"
        value={searchTerm}
        onChange={handleSearch}
        prefix={<HiOutlineSearch className="text-lg" />}
      />
    </div>
  );
};

export default DueComplianceTableSearch;