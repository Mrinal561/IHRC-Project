import React, { useState, useEffect } from 'react';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import { endpoints } from '@/api/endpoint';
import httpClient from '@/api/http-client';

interface ReturnTrackerFilterProps {
  onFilterChange: (filters: any) => void;
}

interface SelectOption {
  value: string; // Changed to string only since IDs are typically strings in APIs
  label: string;
}

const ReturnTrackerFilter = ({ onFilterChange }: ReturnTrackerFilterProps) => {
    const [filters, setFilters] = useState({
        company_id: '',
        state_id: '',
        branch_id: '',
    });

    const [companyOptions, setCompanyOptions] = useState<SelectOption[]>([]);
    const [stateOptions, setStateOptions] = useState<SelectOption[]>([]);
    const [branchOptions, setBranchOptions] = useState<SelectOption[]>([]);
    const [loadingBranches, setLoadingBranches] = useState(false);

    useEffect(() => {
        const loadOptions = async () => {
            try {
                // Load companies
                const companiesRes = await httpClient.get(endpoints.company.getAll());
                setCompanyOptions(companiesRes.data.data.map((c: any) => ({
                    value: String(c.id), // Ensure value is string
                    label: c.name
                })));

                // Load states
                const statesRes = await httpClient.get(endpoints.common.state());
                setStateOptions(statesRes.data.map((s: any) => ({
                    value: String(s.id), // Ensure value is string
                    label: s.name
                })));
            } catch (error) {
                console.error('Failed to load filter options:', error);
            }
        };

        loadOptions();
    }, []);

 // In your ReturnTrackerFilter component
useEffect(() => {
    const loadBranches = async () => {
        if (!filters.state_id) {
            setBranchOptions([]);
            return;
        }

        setLoadingBranches(true);
        try {
            // First fetch ALL branches
            const branchesRes = await httpClient.get(endpoints.branch.getAllBranch());
            
            // Then filter locally by state
            const filteredBranches = branchesRes.data.data
                .filter((b: any) => b.state_id === Number(filters.state_id))
                .map((b: any) => ({
                    value: String(b.id),
                    label: b.name
                }));
            
            setBranchOptions(filteredBranches);
            
            // Clear branch selection if state changes
            if (filters.branch_id) {
                handleFilterChange('branch_id', '');
            }
        } catch (error) {
            console.error('Failed to load branches:', error);
            setBranchOptions([]);
        } finally {
            setLoadingBranches(false);
        }
    };

    loadBranches();
}, [filters.state_id]);

    const handleFilterChange = (name: string, value: string) => {
        const newFilters = {
            ...filters,
            [name]: value
        };
        
        if (name === 'company_id') {
            newFilters.state_id = '';
            newFilters.branch_id = '';
        } else if (name === 'state_id') {
            newFilters.branch_id = '';
        }
        
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    return ( 
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"> 
            <div className="min-w-0">
                <OutlinedSelect
                    label="Company"
                    options={companyOptions}
                    value={companyOptions.find(opt => opt.value === filters.company_id) || null}
                    onChange={(option) => handleFilterChange('company_id', option?.value || '')}
                    isClearable
                />
            </div>
            <div className="min-w-0">
                <OutlinedSelect
                    label="State"
                    options={stateOptions}
                    value={stateOptions.find(opt => opt.value === filters.state_id) || null}
                    onChange={(option) => handleFilterChange('state_id', option?.value || '')}
                    isClearable
                />
            </div>
            <div className="min-w-0">
                <OutlinedSelect
                    label="Branch"
                    options={branchOptions}
                    value={branchOptions.find(opt => opt.value === filters.branch_id) || null}
                    onChange={(option) => handleFilterChange('branch_id', option?.value || '')}
                    isLoading={loadingBranches}
                    isClearable
                />
            </div>
        </div>
    );
};

export default ReturnTrackerFilter;