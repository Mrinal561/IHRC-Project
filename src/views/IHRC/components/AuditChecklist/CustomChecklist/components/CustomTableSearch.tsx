import React from 'react'
import Input from '@/components/ui/Input'
import { HiOutlineSearch } from 'react-icons/hi'

interface CustomTableSearchProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomTableSearch: React.FC<CustomTableSearchProps> = ({ value, onChange }) => {
    return (
        <Input
            className="w-44"
            size="sm"
            placeholder="Search Compliances"
            prefix={<HiOutlineSearch className="text-lg" />}
            value={value}
            onChange={onChange}
        />
    )
}

export default CustomTableSearch