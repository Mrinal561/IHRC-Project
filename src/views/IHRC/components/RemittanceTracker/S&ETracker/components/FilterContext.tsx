import React, { createContext, useContext, useState } from 'react';

// Define the shape of the filter state
interface FilterState {
  selectedCompanyGroup: { value: string; label: string } | null;
  selectedCompany: { value: string; label: string } | null;
  selectedStatus: { value: string; label: string } | null;
  selectedNoticeType: { value: string; label: string } | null;
}

// Define the shape of the context
interface FilterContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

// Create the context
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Create a provider component
export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>({
    selectedCompanyGroup: null,
    selectedCompany: null,
    selectedStatus: null,
    selectedNoticeType: null,
  });

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

// Custom hook to use the filter context
export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};