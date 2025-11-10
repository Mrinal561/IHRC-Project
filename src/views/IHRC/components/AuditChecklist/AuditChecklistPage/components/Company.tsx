// CompanyFilter.tsx
import React, { useEffect, useState } from 'react'
import OutlinedSelect from '@/components/ui/Outlined/Outlined'
import { endpoints } from '@/api/endpoint'
import httpClient from '@/api/http-client'
import { Notification, toast } from '@/components/ui'

interface SelectOption {
  value: string
  label: string
}

interface BranchOption {
  label: string
  value: string
}

interface CompanyFilterProps {
  onFilterChange: (filters: {
    company_id?: string
    state_id?: string
    branch_id?: string
  }) => void
}

const Company: React.FC<CompanyFilterProps> = ({ onFilterChange }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCompany, setSelectedCompany] = useState<SelectOption | null>(null)
  const [selectedState, setSelectedState] = useState<SelectOption | null>(null)
  const [selectedBranch, setSelectedBranch] = useState<BranchOption | null>(null)
  const [companies, setCompanies] = useState<SelectOption[]>([])
  const [states, setStates] = useState<SelectOption[]>([])
  const [branches, setBranches] = useState<BranchOption[]>([])
  const [isLoadingBranches, setIsLoadingBranches] = useState(false)

  // Load Companies
  const loadCompanies = async () => {
    try {
      const { data } = await httpClient.get(endpoints.company.getAll())
      
      if (data.data && data.data.length > 0) {
        const formattedCompanies = data.data.map((company: any) => ({
          label: company.name,
          value: String(company.id)
        }))

        setCompanies(formattedCompanies)
        // Set first company as default
        if (formattedCompanies.length > 0) {
          setSelectedCompany(formattedCompanies[0])
          onFilterChange({
            company_id: formattedCompanies[0].value
          })
        }
      }
    } catch (error) {
      console.error('Failed to load companies:', error)
      toast.push(
        <Notification title="Error" type="error">
          Failed to load companies
        </Notification>
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Load States
  const loadStates = async () => {
    try {
      const response = await httpClient.get(endpoints.common.state())
      if (response.data) {
        const formattedStates = response.data.map((state: any) => ({
          label: state.name,
          value: String(state.id)
        }))
        setStates(formattedStates)
      }
    } catch (error) {
      console.error('Failed to load states:', error)
      toast.push(
        <Notification title="Error" type="error">
          Failed to load states
        </Notification>
      )
    }
  }

  // Load Branches based on selected State and Company
 // In loadBranches function:
const loadBranches = async (stateId: string, companyId: string) => {
  setIsLoadingBranches(true);
  try {
    const { data } = await httpClient.get(endpoints.branch.getAllBranch(), {
      params: {
        'state_id[]': stateId,  // Note the array syntax
        'company_id[]': companyId  // Note the array syntax
      }
    });

    if (data.data) {
      const formattedBranches = data.data.map((branch: any) => ({
        label: branch.name,
        value: String(branch.id)
      }));
      setBranches(formattedBranches);
    }
  } catch (error) {
    console.error('Failed to load branches:', error);
    toast.push(
      <Notification title="Error" type="error">
        Failed to load branches
      </Notification>
    );
    setBranches([]);
  } finally {
    setIsLoadingBranches(false);
  }
};

  // Initial load
  useEffect(() => {
    loadCompanies()
    loadStates()
  }, [])

  // Handle company change
  const handleCompanyChange = (value: SelectOption | null) => {
    setSelectedCompany(value)
    setSelectedState(null)
    setSelectedBranch(null)
    setBranches([])
    
    if (value) {
      onFilterChange({
        company_id: value.value
      })
    } else {
      onFilterChange({})
    }
  }

  // Handle state change
  const handleStateChange = (value: SelectOption | null) => {
    setSelectedState(value)
    setSelectedBranch(null)
    
    if (value && selectedCompany) {
      loadBranches(value.value, selectedCompany.value)
      onFilterChange({
        company_id: selectedCompany.value,
        state_id: value.value
      })
    } else if (selectedCompany) {
      onFilterChange({
        company_id: selectedCompany.value
      })
    } else {
      onFilterChange({})
    }
  }

  // Handle branch change
  const handleBranchChange = (value: BranchOption | null) => {
    setSelectedBranch(value)
    
    if (value && selectedState && selectedCompany) {
      onFilterChange({
        company_id: selectedCompany.value,
        state_id: selectedState.value,
        branch_id: value.value
      })
    } else if (selectedState && selectedCompany) {
      onFilterChange({
        company_id: selectedCompany.value,
        state_id: selectedState.value
      })
    } else if (selectedCompany) {
      onFilterChange({
        company_id: selectedCompany.value
      })
    } else {
      onFilterChange({})
    }
  }

  return (
    <div className="w-full flex items-center gap-3">
      <div className="flex-1 min-w-[140px]">
        <OutlinedSelect
          label="Company"
          options={companies}
          value={selectedCompany}
          onChange={handleCompanyChange}
          isLoading={isLoading}
        />
      </div>

      <div className="flex-1 min-w-[140px]">
        <OutlinedSelect
          label="State"
          options={states}
          value={selectedState}
          onChange={handleStateChange}
          isDisabled={!selectedCompany}
        />
      </div>

      <div className="flex-1 min-w-[140px]">
        <OutlinedSelect
          label="Branch"
          options={branches}
          value={selectedBranch}
          onChange={handleBranchChange}
          isDisabled={!selectedState}
          isLoading={isLoadingBranches}
        />
      </div>
    </div>
  )
}

export default Company