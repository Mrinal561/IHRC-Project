import React, { useState, useEffect } from 'react';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import OutlinedInput from '@/components/ui/OutlinedInput/OutlinedInput';
import { endpoints } from '@/api/endpoint';
import httpClient from '@/api/http-client';

interface RegisterTrackerFilterProps {
    onFilterChange: (filters: any) => void;
    availableYears: number[];
    availableCompanies: {id: number, name: string}[];
}

interface SelectOption {
    value: string;
    label: string;
}

const RegisterTrackerFilter = ({ onFilterChange, availableYears, availableCompanies }: RegisterTrackerFilterProps) => {
    const [filters, setFilters] = useState({
        company_id: '',
        year: '',
        search: '',
    });
        const [companyOptions, setCompanyOptions] = useState<SelectOption[]>([]);
    

   const currentYear = new Date().getFullYear();
const yearOptions: SelectOption[] = Array.from(
    { length: currentYear - 2020 }, // 2021 to current year (inclusive)
    (_, i) => {
        const year = currentYear - i;
        return {
            value: String(year),
            label: String(year),
        };
    }
);

   

    const handleFilterChange = (name: string, value: string) => {
        const newFilters = {
            ...filters,
            [name]: value
        };
        
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

     useEffect(() => {
        const loadOptions = async () => {
            try {
                // Load companies
                const companiesRes = await httpClient.get(endpoints.company.getAll());
                setCompanyOptions(companiesRes.data.data.map((c: any) => ({
                    value: String(c.id), // Ensure value is string
                    label: c.name
                })));
            } catch (error) {
                console.error('Failed to load filter options:', error);
            }
        };

        loadOptions();
    }, []);

    return ( 
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"> 
            <div className="min-w-0">
                <OutlinedSelect
                    label="Company"
                    options={companyOptions}
                    value={companyOptions.find(opt => opt.value === filters.company_id) || null}
                    onChange={(option) => handleFilterChange('company_id', option?.value || '')}
                />
            </div>
            <div className="min-w-0">
                <OutlinedSelect
                    label="Year"
                    options={yearOptions}
                    value={yearOptions.find(opt => opt.value === filters.year) || null}
                    onChange={(option) => handleFilterChange('year', option?.value || '')}
                />
            </div>
            <div className="min-w-0">
                <OutlinedInput
                    label="Search"
                    value={filters.search}
                    onChange={(value: string) => handleFilterChange('search', value)}
                />
            </div>
        </div>
    );
};

export default RegisterTrackerFilter;