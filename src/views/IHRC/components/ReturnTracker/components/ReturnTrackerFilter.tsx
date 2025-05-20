import React, { useState, useEffect } from 'react';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import { endpoints } from '@/api/endpoint';
import httpClient from '@/api/http-client';
import OutlinedInput from '@/components/ui/OutlinedInput';

interface ReturnTrackerFilterProps {
  onFilterChange: (filters: any) => void;
}

const ReturnTrackerFilter = ({ onFilterChange }: ReturnTrackerFilterProps) => {
    const [filters, setFilters] = useState({
        company_id: '',
        state_id: '',
        branch_id: '',
    });

    const [companyOptions, setCompanyOptions] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);
    const [branchOptions, setBranchOptions] = useState([]);

    useEffect(() => {
        // Load initial options
        const loadOptions = async () => {
            try {
                // Load companies
                const companiesRes = await httpClient.get(endpoints.company.getAll());
                setCompanyOptions(companiesRes.data.data.map((c: any) => ({
                    value: c.id,
                    label: c.name
                })));

                // Load states
                const statesRes = await httpClient.get(endpoints.common.state());
                setStateOptions(statesRes.data.map((s: any) => ({
                    value: s.id,
                    label: s.name
                })));

                // Load branches
                const branchesRes = await httpClient.get(endpoints.branch.getAllBranch());
                setBranchOptions(branchesRes.data.data.map((b: any) => ({
                    value: b.id,
                    label: b.name
                })));
            } catch (error) {
                console.error('Failed to load filter options:', error);
            }
        };

        loadOptions();
    }, []);

    const handleFilterChange = (name: string, value: string) => {
        const newFilters = {
            ...filters,
            [name]: value
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    return ( 
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"> 
            <div className="min-w-0">
                <OutlinedSelect
                    label="Company"
                    options={companyOptions}
                    value={companyOptions.find(opt => opt.value === filters.company_id)}
                    onChange={(option) => handleFilterChange('company_id', option?.value || '')}
                />
            </div>
            <div className="min-w-0">
                <OutlinedSelect
                    label="State"
                    options={stateOptions}
                    value={stateOptions.find(opt => opt.value === filters.state_id)}
                    onChange={(option) => handleFilterChange('state_id', option?.value || '')}
                />
            </div>
            <div className="min-w-0">
                <OutlinedSelect
                    label="Branch"
                    options={branchOptions}
                    value={branchOptions.find(opt => opt.value === filters.branch_id)}
                    onChange={(option) => handleFilterChange('branch_id', option?.value || '')}
                />
            </div>
        </div>
    );
};

export default ReturnTrackerFilter;