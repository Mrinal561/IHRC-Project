import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui';
import { HiOutlineSearch } from 'react-icons/hi';

interface StatusTableSearchProps {
  onSearch: (term: string) => void;
}

const StatusTableSearch: React.FC<StatusTableSearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  useEffect(() => {
    onSearch(debouncedTerm);
  }, [debouncedTerm, onSearch]);

  return (
    <div className="w-52">
      <Input
        placeholder="Search by Header or Legislation"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        prefix={<HiOutlineSearch className="text-lg" />}
      />
    </div>
  );
};

export default StatusTableSearch;