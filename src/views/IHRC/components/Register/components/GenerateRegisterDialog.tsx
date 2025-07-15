// import React, { useState, useEffect } from 'react'
// import { Button, Dialog, Notification, toast } from '@/components/ui'
// import { HiDownload } from 'react-icons/hi'
// import OutlinedSelect from '@/components/ui/Outlined/Outlined'
// import httpClient from '@/api/http-client'
// import { endpoints } from '@/api/endpoint'
// import useAuth from '@/utils/hooks/useAuth'
// import { useAppSelector } from '@/store'
// import OutlinedInput from '@/components/ui/OutlinedInput'

// interface SelectOption {
//   value: string;
//   label: string;
// }

// interface GenerateRegisterDialogProps {
//   isOpen: boolean;
//   onClose: () => void;
//   rowData: any;
// }

// const GenerateRegisterDialog: React.FC<GenerateRegisterDialogProps> = ({ 
//   isOpen, 
//   onClose,
//   rowData 
// }) => {
//   const [selectedCompany, setSelectedCompany] = useState<SelectOption | null>(null);
//   const [selectedState, setSelectedState] = useState<SelectOption | null>(null);
//   const [selectedMonth, setSelectedMonth] = useState<SelectOption | null>(null);
//   const [selectedYear, setSelectedYear] = useState<SelectOption | null>(null);
//   const [selectedRegisterType, setSelectedRegisterType] = useState<SelectOption | null>(null);
//   const [companies, setCompanies] = useState<SelectOption[]>([]);
//   const [states, setStates] = useState<SelectOption[]>([]);
//   const [months, setMonths] = useState<SelectOption[]>([]);
//   const [years, setYears] = useState<SelectOption[]>([]);
//   const [registerTypes, setRegisterTypes] = useState<SelectOption[]>([]);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const auth = useAuth();

//   // Initialize register types
//   useEffect(() => {
//     setRegisterTypes([
//       { value: 'Form A', label: 'Form A' }
//       // Add more register types here if needed
//     ]);
//     // setSelectedRegisterType({ value: 'Form A', label: 'Form A' });
//   }, []);

//   // Fetch companies on component mount
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         const response = await httpClient.get(endpoints.company.getAll());
//         const formattedCompanies = response.data?.data?.map((company: any) => ({
//           value: company.id.toString(),
//           label: company.name
//         }));
//         setCompanies(formattedCompanies || []);
//       } catch (error) {
//         console.error('Failed to fetch companies:', error);
//       }
//     };

//     fetchCompanies();
//   }, []);

//   // Fetch states when component mounts
//   useEffect(() => {
//     const fetchStates = async () => {
//       try {
//         const response = await httpClient.get(endpoints.common.state());
//         console.log('States API response:', response.data);
        
//         if (response.data && Array.isArray(response.data)) {
//           const formattedStates = response.data.map((state: any) => ({
//             value: state.id.toString(),
//             label: state.name
//           }));
//           setStates(formattedStates);
//         } else {
//           console.error('Unexpected API response format:', response.data);
//           toast.push(
//             <Notification title="Error" type="error" closable>
//               Unexpected data format from states API
//             </Notification>
//           );
//         }
//       } catch (error) {
//         console.error('Failed to fetch states:', error);
//         toast.push(
//           <Notification title="Error" type="error" closable>
//             Failed to load states
//           </Notification>
//         );
//       }
//     };

//     if (isOpen) fetchStates();
//   }, [isOpen]);

//   // Initialize months and years
//   useEffect(() => {
//     // Generate months (January to December)
//     const monthOptions = [
//       { value: 'January', label: 'January' },
//       { value: 'February', label: 'February' },
//       { value: 'March', label: 'March' },
//       { value: 'April', label: 'April' },
//       { value: 'May', label: 'May' },
//       { value: 'June', label: 'June' },
//       { value: 'July', label: 'July' },
//       { value: 'August', label: 'August' },
//       { value: 'September', label: 'September' },
//       { value: 'October', label: 'October' },
//       { value: 'November', label: 'November' },
//       { value: 'December', label: 'December' },
//     ];
//     setMonths(monthOptions);

//     // Generate years (current year and previous 4 years)
//     const currentYear = new Date().getFullYear();
//     const yearOptions = Array.from({ length: 5 }, (_, i) => ({
//       value: (currentYear - i).toString(),
//       label: (currentYear - i).toString()
//     }));
//     setYears(yearOptions);
//     setSelectedYear(yearOptions[0] || null);
//   }, []);

//   const handleGenerate = async () => {
//     if (!selectedCompany || !selectedState || !selectedMonth || !selectedYear || !selectedRegisterType) {
//       toast.push(
//         <Notification title="Warning" type="warning" closable>
//           Please fill all fields
//         </Notification>
//       );
//       return;
//     }

//     setIsGenerating(true);
    
//     try {
//       const response = await httpClient.get(
//         endpoints.register.exportRegister(),
//         {
//           params: {
//             company_id: Number(selectedCompany.value),
//             state_id: Number(selectedState.value),
//             register_type: selectedRegisterType.value,
//             month: selectedMonth.value,
//             year: Number(selectedYear.value),
//             register_data_id: rowData.id
//           },
//           responseType: 'blob'
//         }
//       );
      
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `${selectedRegisterType.value}_${selectedMonth.value}_${selectedYear.value}.xlsx`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);

//       toast.push(
//         <Notification title="Success" type="success" closable>
//           Register generated successfully
//         </Notification>
//       );
//       onClose();
//     } catch (error: any) {
//       console.error('Generation error:', error);
//       let errorMessage = 'Failed to generate register';
      
//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.response?.data?.errors) {
//         errorMessage = error.response.data.errors.join('\n');
//       }

//       toast.push(
//         <Notification title="Error" type="error" closable>
//           {errorMessage}
//         </Notification>
//       );
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   return (
//     <Dialog
//       isOpen={isOpen}
//       onClose={onClose}
//       onRequestClose={onClose}
//       width={500}
//     >
//       <h5 className="mb-4">Generate Register</h5>
      
//       <div className="grid gap-4">
//         <div>
//           <label className="block text-sm font-medium mb-2">Company</label>
//           <OutlinedSelect
//             options={companies}
//             value={selectedCompany}
//             onChange={setSelectedCompany}
//             label="Select Company"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-2">State</label>
//           <OutlinedSelect
//             options={states}
//             value={selectedState}
//             onChange={setSelectedState}
//             label="Select State"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-2">Register Type</label>
//           <OutlinedSelect
//             options={registerTypes}
//             value={selectedRegisterType}
//             onChange={setSelectedRegisterType}
//             label="Select Register Type"
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium mb-2">Month</label>
//             <OutlinedSelect
//               options={months}
//               value={selectedMonth}
//               onChange={setSelectedMonth}
//               label="Select Month"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">Year</label>
//             <OutlinedSelect
//               options={years}
//               value={selectedYear}
//               onChange={setSelectedYear}
//               label="Select Year"
//             />
//           </div>
//         </div>

//         <div className="flex justify-end gap-2 mt-6">
//           <Button
//             variant="plain"
//             onClick={onClose}
//             disabled={isGenerating}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="solid"
//             onClick={handleGenerate}
//             disabled={!selectedCompany || !selectedState || !selectedMonth || !selectedYear || !selectedRegisterType || isGenerating}
//             loading={isGenerating}
//             icon={<HiDownload />}
//           >
//             {isGenerating ? 'Generating...' : 'Generate'}
//           </Button>
//         </div>
//       </div>
//     </Dialog>
//   );
// };

// export default GenerateRegisterDialog;




















// import React, { useState, useEffect, useMemo } from 'react'
// import { Button, Dialog, Notification, toast, Input } from '@/components/ui'
// import { HiDownload } from 'react-icons/hi'
// import OutlinedSelect from '@/components/ui/Outlined/Outlined'
// import httpClient from '@/api/http-client'
// import { endpoints } from '@/api/endpoint'
// import useAuth from '@/utils/hooks/useAuth'
// import { addMonths, format } from 'date-fns';


// interface SelectOption {
//   value: string;
//   label: string;
// }

// interface ErrorResponse {
//   message?: string;
//   error?: string;
//   statusCode?: number;
//   errors?: string[];
// }


// interface GenerateRegisterDialogProps {
//   isOpen: boolean;
//   onClose: () => void;
//   rowData: any;
// }

// const FINANCIAL_YEAR_KEY = 'selectedFinancialYear';
// const FINANCIAL_YEAR_CHANGE_EVENT = 'financialYearChanged';

// const SALARY_REGISTER_TYPES = [
//   { value: 'HRA Form A', label: 'HRA Form A' },
//   { value: 'HRA Form I', label: 'HRA Form I' },
//   { value: 'HRA Form J', label: 'HRA Form J' }
// ];

// const generateMonthOptions = (financialYear: string | null) => {
//   if (!financialYear) return [];

//   const [startYear] = financialYear.split('-');
//   const fullStartYear = parseInt(`${startYear}`);

//   const months: Array<{
//     value: string;
//     label: string;
//     apiValue: string;
//   }> = [];
//   const startDate = new Date(fullStartYear, 3, 1); // April of start year (month is 0-indexed)

//   for (let i = 0; i < 12; i++) {
//     const date = addMonths(startDate, i);
//     const twoDigitYear = format(date, 'yy');
//     months.push({
//       value: format(date, 'MMMM'), // Full month name (e.g., "April")
//       label: `${format(date, 'MMM')} ${twoDigitYear}`, // Short month + year (e.g., "Apr 25")
//       apiValue: format(date, 'MMM').toLowerCase() // Short month lowercase (e.g., "apr")
//     });
//   }

//   return months;
// };

// const GenerateRegisterDialog: React.FC<GenerateRegisterDialogProps> = ({ 
//   isOpen, 
//   onClose,
//   rowData 
// }) => {
//   const [selectedCompany, setSelectedCompany] = useState<SelectOption | null>(null);
//   const [selectedState, setSelectedState] = useState<SelectOption | null>(null);
//   const [selectedMonth, setSelectedMonth] = useState<SelectOption | null>(null);
//   const [selectedRegisterType, setSelectedRegisterType] = useState<SelectOption | null>(null);
//   const [companies, setCompanies] = useState<SelectOption[]>([]);
//   const [states, setStates] = useState<SelectOption[]>([]);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [financialYear, setFinancialYear] = useState<string | null>(
//     sessionStorage.getItem(FINANCIAL_YEAR_KEY)
//   );
//   const auth = useAuth();

//   const monthOptions = useMemo(
//     () => generateMonthOptions(financialYear),
//     [financialYear]
//   );

//  const isSalaryRegister = rowData?.register_type?.includes('Salary') || false;
// const registerTypes = isSalaryRegister 
//   ? SALARY_REGISTER_TYPES 
//   : rowData?.register_type 
//     ? [{ value: rowData.register_type, label: rowData.register_type }] 
//     : [];
//   const currentYear = financialYear ? financialYear.split('-')[0] : new Date().getFullYear().toString();

//   useEffect(() => {
//     const handleFinancialYearChange = (event: CustomEvent) => {
//       const newFinancialYear = event.detail;
//       setFinancialYear(newFinancialYear);
//       sessionStorage.setItem(FINANCIAL_YEAR_KEY, newFinancialYear);
//       setSelectedMonth(null);
//     };

//     window.addEventListener(
//       FINANCIAL_YEAR_CHANGE_EVENT,
//       handleFinancialYearChange as EventListener
//     );

//     return () => {
//       window.removeEventListener(
//         FINANCIAL_YEAR_CHANGE_EVENT,
//         handleFinancialYearChange as EventListener
//       );
//     };
//   }, []);

//   // Set initial register type based on rowData
//   useEffect(() => {
//     if (rowData && registerTypes.length > 0) {
//       const defaultType = isSalaryRegister 
//         ? registerTypes[0] 
//         : { value: rowData.register_type, label: rowData.register_type };
//       setSelectedRegisterType(defaultType);
//     }
//   }, [rowData, isSalaryRegister, registerTypes]);

//   // Fetch companies on component mount
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         const response = await httpClient.get(endpoints.company.getAll());
//         const formattedCompanies = response.data?.data?.map((company: any) => ({
//           value: company.id.toString(),
//           label: company.name
//         }));
//         setCompanies(formattedCompanies || []);
//       } catch (error) {
//         console.error('Failed to fetch companies:', error);
//       }
//     };

//     fetchCompanies();
//   }, []);

//   // Fetch states when dialog opens
//   useEffect(() => {
//     const fetchStates = async () => {
//       try {
//         const response = await httpClient.get(endpoints.common.state());
        
//         if (response.data && Array.isArray(response.data)) {
//           const formattedStates = response.data.map((state: any) => ({
//             value: state.id.toString(),
//             label: state.name
//           }));
//           setStates(formattedStates);
//         } else {
//           console.error('Unexpected API response format:', response.data);
//           toast.push(
//             <Notification title="Error" type="error" closable>
//               Unexpected data format from states API
//             </Notification>
//           );
//         }
//       } catch (error) {
//         console.error('Failed to fetch states:', error);
//         toast.push(
//           <Notification title="Error" type="error" closable>
//             Failed to load states
//           </Notification>
//         );
//       }
//     };

//     if (isOpen) fetchStates();
//   }, [isOpen]);

// const handleGenerate = async () => {
//   if (!selectedCompany || !selectedRegisterType || 
//      (isSalaryRegister && (!selectedState || !selectedMonth))) {
//     toast.push(
//       <Notification title="Warning" type="warning" closable>
//         Please fill all required fields
//       </Notification>
//     );
//     return;
//   }

//   setIsGenerating(true);
  
//   try {
//     const params: Record<string, any> = {
//       company_id: Number(selectedCompany.value),
//       register_type: selectedRegisterType.value,
//       year: currentYear,
//       register_data_id: rowData.id
//     };

//     if (isSalaryRegister) {
//       params.state_id = Number(selectedState?.value);
//       params.month = selectedMonth?.value;
//     }

//     const response = await httpClient.get(
//       endpoints.register.exportRegister(),
//       {
//         params,
//         responseType: 'blob'
//       }
//     );
    
//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', `${selectedRegisterType.value}_${isSalaryRegister ? selectedMonth?.value : ''}_${currentYear}.xlsx`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);

//     toast.push(
//       <Notification title="Success" type="success" closable>
//         Register generated successfully
//       </Notification>
//     );
//     onClose();
//   } catch (error: any) {
//     console.error('Generation error:', error);
//     console.error('Error response:', error.response);
//     console.error('Error response data:', error.response?.data);
//     console.error('Error response data type:', typeof error.response?.data);
//     console.error('Is Blob?', error.response?.data instanceof Blob);
    
//     let errorMessage = 'Failed to generate register';
    
//     try {
//       // Check if the error response is a blob (which happens with responseType: 'blob')
//       if (error.response?.data instanceof Blob) {
//         console.log('Processing blob error...');
//         // Convert blob to text to get the actual error message
//         const errorText = await error.response.data.text();
//         console.log('Blob text:', errorText);
        
//         try {
//           const errorJson = JSON.parse(errorText);
//           console.log('Parsed JSON:', errorJson);
//           errorMessage = errorJson.message || errorJson.error || errorMessage;
//         } catch (jsonError) {
//           console.error('JSON parse error:', jsonError);
//           // If it's not JSON, use the text as is
//           errorMessage = errorText || errorMessage;
//         }
//       } else if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.response?.data?.errors) {
//         errorMessage = error.response.data.errors.join('\n');
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
//     } catch (parseError) {
//       console.error('Error parsing error response:', parseError);
//       // Fall back to generic error message
//     }

//     console.log('Final error message:', errorMessage);
    
//     toast.push(
//       <Notification title="Error" type="error" closable>
//         {errorMessage}
//       </Notification>
//     );
//   } finally {
//     setIsGenerating(false);
//   }
// };
//   return (
//     <Dialog
//       isOpen={isOpen}
//       onClose={onClose}
//       onRequestClose={onClose}
//       width={500}
//     >
//       <h5 className="mb-4">Generate Register</h5>
      
//       <div className="grid gap-4">
//         <div>
//           <label className="block text-sm font-medium mb-2">Company</label>
//           <OutlinedSelect
//             options={companies}
//             value={selectedCompany}
//             onChange={setSelectedCompany}
//             label="Select Company"
//           />
//         </div>

//         {isSalaryRegister && (
//           <div>
//             <label className="block text-sm font-medium mb-2">State</label>
//             <OutlinedSelect
//               options={states}
//               value={selectedState}
//               onChange={setSelectedState}
//               label="Select State"
//             />
//           </div>
//         )}

//         <div>
//           <label className="block text-sm font-medium mb-2">Register Type</label>
//           <OutlinedSelect
//             options={registerTypes}
//             value={selectedRegisterType}
//             onChange={setSelectedRegisterType}
//             label="Select Register Type"
//             isDisabled={!isSalaryRegister} // Only allow changing for salary registers
//           />
//         </div>

//         {isSalaryRegister && (
//           <div>
//             <label className="block text-sm font-medium mb-2">Month</label>
//             <OutlinedSelect
//               options={monthOptions}
//               value={selectedMonth}
//               onChange={setSelectedMonth}
//               label="Select Month"
//             />
//           </div>
//         )}

//         <div>
//           <label className="block text-sm font-medium mb-2">Year</label>
//           <Input
//             value={currentYear}
//             readOnly
//             placeholder="Financial Year"
//           />
//         </div>

//         <div className="flex justify-end gap-2 mt-6">
//           <Button
//             variant="plain"
//             onClick={onClose}
//             disabled={isGenerating}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="solid"
//             onClick={handleGenerate}
//             disabled={
//               !selectedCompany || 
//               !selectedRegisterType || 
//               (isSalaryRegister && (!selectedState || !selectedMonth)) || 
//               isGenerating
//             }
//             loading={isGenerating}
//             icon={<HiDownload />}
//           >
//             {isGenerating ? 'Generating...' : 'Generate'}
//           </Button>
//         </div>
//       </div>
//     </Dialog>
//   );
// };

// export default GenerateRegisterDialog;



import React, { useState, useEffect, useMemo } from 'react'
import { Button, Dialog, Notification, toast, Input } from '@/components/ui'
import { HiDownload } from 'react-icons/hi'
import OutlinedSelect from '@/components/ui/Outlined/Outlined'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import useAuth from '@/utils/hooks/useAuth'
import { addMonths, format } from 'date-fns';


interface SelectOption {
  value: string;
  label: string;
}

interface ErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
  errors?: string[];
}


interface GenerateRegisterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  rowData: any;
}

const FINANCIAL_YEAR_KEY = 'selectedFinancialYear';
const FINANCIAL_YEAR_CHANGE_EVENT = 'financialYearChanged';

const SALARY_REGISTER_TYPES = [
  { value: 'HRA Form A', label: 'HRA Form A' },
  { value: 'HRA Form I', label: 'HRA Form I' },
  { value: 'HRA Form J', label: 'HRA Form J' }
];

const generateMonthOptions = (financialYear: string | null) => {
  if (!financialYear) return [];

  const [startYear] = financialYear.split('-');
  const fullStartYear = parseInt(`${startYear}`);

  const months: Array<{
    value: string;
    label: string;
    apiValue: string;
  }> = [];
  const startDate = new Date(fullStartYear, 3, 1); // April of start year (month is 0-indexed)

  for (let i = 0; i < 12; i++) {
    const date = addMonths(startDate, i);
    const twoDigitYear = format(date, 'yy');
    months.push({
      value: format(date, 'MMMM'), // Full month name (e.g., "April")
      label: `${format(date, 'MMM')} ${twoDigitYear}`, // Short month + year (e.g., "Apr 25")
      apiValue: format(date, 'MMM').toLowerCase() // Short month lowercase (e.g., "apr")
    });
  }

  return months;
};

const GenerateRegisterDialog: React.FC<GenerateRegisterDialogProps> = ({ 
  isOpen, 
  onClose,
  rowData 
}) => {
  
  // Custom toast function to ensure error messages are displayed
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'error', title?: string) => {
    try {
      console.log('Showing toast:', { message, type, title });
      
      // Try multiple approaches to ensure toast shows
      const toastElement = (
        <Notification 
          title={title || (type === 'error' ? 'Error' : type === 'success' ? 'Success' : type === 'warning' ? 'Warning' : 'Info')} 
          type={type} 
          closable
        >
          {message}
        </Notification>
      );
      
      // Method 1: Standard toast.push
      toast.push(toastElement);
      
      // Method 2: Fallback with setTimeout (in case of timing issues)
      setTimeout(() => {
        toast.push(toastElement);
      }, 10);
      
      // Method 3: Force re-render with different key (in case of duplicate prevention)
      setTimeout(() => {
        toast.push(
          <Notification 
            title={title || (type === 'error' ? 'Error' : type === 'success' ? 'Success' : type === 'warning' ? 'Warning' : 'Info')} 
            type={type} 
            closable
          >
            {message} - {Date.now()}
          </Notification>
        );
      }, 50);
      
    } catch (toastError) {
      console.error('Toast error:', toastError);
      // Ultimate fallback - browser alert
      alert(`${type.toUpperCase()}: ${message}`);
    }
  };
  const [selectedCompany, setSelectedCompany] = useState<SelectOption | null>(null);
  const [selectedState, setSelectedState] = useState<SelectOption | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<SelectOption | null>(null);
  const [selectedRegisterType, setSelectedRegisterType] = useState<SelectOption | null>(null);
  const [companies, setCompanies] = useState<SelectOption[]>([]);
  const [states, setStates] = useState<SelectOption[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [financialYear, setFinancialYear] = useState<string | null>(
    sessionStorage.getItem(FINANCIAL_YEAR_KEY)
  );
  const auth = useAuth();

  const monthOptions = useMemo(
    () => generateMonthOptions(financialYear),
    [financialYear]
  );

 const isSalaryRegister = rowData?.register_type?.includes('Salary') || false;
const registerTypes = isSalaryRegister 
  ? SALARY_REGISTER_TYPES 
  : rowData?.register_type 
    ? [{ value: rowData.register_type, label: rowData.register_type }] 
    : [];
  const currentYear = financialYear ? financialYear.split('-')[0] : new Date().getFullYear().toString();

  useEffect(() => {
    const handleFinancialYearChange = (event: CustomEvent) => {
      const newFinancialYear = event.detail;
      setFinancialYear(newFinancialYear);
      sessionStorage.setItem(FINANCIAL_YEAR_KEY, newFinancialYear);
      setSelectedMonth(null);
    };

    window.addEventListener(
      FINANCIAL_YEAR_CHANGE_EVENT,
      handleFinancialYearChange as EventListener
    );

    return () => {
      window.removeEventListener(
        FINANCIAL_YEAR_CHANGE_EVENT,
        handleFinancialYearChange as EventListener
      );
    };
  }, []);

  // Set initial register type based on rowData
  useEffect(() => {
    if (rowData && registerTypes.length > 0) {
      const defaultType = isSalaryRegister 
        ? registerTypes[0] 
        : { value: rowData.register_type, label: rowData.register_type };
      setSelectedRegisterType(defaultType);
    }
  }, [rowData, isSalaryRegister, registerTypes]);

  // Fetch companies on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await httpClient.get(endpoints.company.getAll());
        const formattedCompanies = response.data?.data?.map((company: any) => ({
          value: company.id.toString(),
          label: company.name
        }));
        setCompanies(formattedCompanies || []);
      } catch (error) {
        console.error('Failed to fetch companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  // Fetch states when dialog opens
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await httpClient.get(endpoints.common.state());
        
        if (response.data && Array.isArray(response.data)) {
          const formattedStates = response.data.map((state: any) => ({
            value: state.id.toString(),
            label: state.name
          }));
          setStates(formattedStates);
        } else {
          console.error('Unexpected API response format:', response.data);
          showToast('Unexpected data format from states API', 'error');
        }
      } catch (error) {
        console.error('Failed to fetch states:', error);
        showToast('Failed to load states', 'error');
      }
    };

    if (isOpen) fetchStates();
  }, [isOpen]);

const handleGenerate = async () => {
  if (!selectedCompany || !selectedRegisterType || 
     (isSalaryRegister && (!selectedState || !selectedMonth))) {
    showToast('Please fill all required fields', 'warning');
    return;
  }

  setIsGenerating(true);
  
  try {
    const params: Record<string, any> = {
      company_id: Number(selectedCompany.value),
      register_type: selectedRegisterType.value,
      year: currentYear,
      register_data_id: rowData.id
    };

    if (isSalaryRegister) {
      params.state_id = Number(selectedState?.value);
      params.month = selectedMonth?.value;
    }

    const response = await httpClient.get(
      endpoints.register.exportRegister(),
      {
        params,
        responseType: 'blob'
      }
    );
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${selectedRegisterType.value}_${isSalaryRegister ? selectedMonth?.value : ''}_${currentYear}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    showToast('Register generated successfully', 'success');
    onClose();
  } catch (error: any) {
    console.error('Generation error:', error);
    
    let errorMessage = 'Failed to generate register';
    
    // Handle blob error response (when responseType is 'blob')
    if (error.response?.data instanceof Blob) {
      try {
        console.log('Processing blob error...');
        // Convert blob to text to get the actual error message
        const errorText = await error.response.data.text();
        console.log('Blob text:', errorText);
        
        try {
          const errorJson = JSON.parse(errorText);
          console.log('Parsed JSON:', errorJson);
          errorMessage = errorJson.message || errorJson.error || 'Failed to generate register';
        } catch (jsonError) {
          console.error('JSON parse error:', jsonError);
          // If it's not JSON, use the text as is (but clean it up)
          errorMessage = errorText.trim() || 'Failed to generate register';
        }
      } catch (blobError) {
        console.error('Error processing blob:', blobError);
        errorMessage = 'Failed to generate register';
      }
    } 
    // Handle regular JSON error response
    else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } 
    else if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      errorMessage = error.response.data.errors.join(', ');
    } 
    else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    }
    else if (error.message) {
      errorMessage = error.message;
    }

    console.log('Final error message:', errorMessage);
    
    // Show the toast notification with the parsed error message
    showToast(errorMessage, 'error');
  } finally {
    setIsGenerating(false);
  }
};
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      onRequestClose={onClose}
      width={500}
    >
      <h5 className="mb-4">Generate Register</h5>
      
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Company</label>
          <OutlinedSelect
            options={companies}
            value={selectedCompany}
            onChange={setSelectedCompany}
            label="Select Company"
          />
        </div>

        {isSalaryRegister && (
          <div>
            <label className="block text-sm font-medium mb-2">State</label>
            <OutlinedSelect
              options={states}
              value={selectedState}
              onChange={setSelectedState}
              label="Select State"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Register Type</label>
          <OutlinedSelect
            options={registerTypes}
            value={selectedRegisterType}
            onChange={setSelectedRegisterType}
            label="Select Register Type"
            isDisabled={!isSalaryRegister} // Only allow changing for salary registers
          />
        </div>

        {isSalaryRegister && (
          <div>
            <label className="block text-sm font-medium mb-2">Month</label>
            <OutlinedSelect
              options={monthOptions}
              value={selectedMonth}
              onChange={setSelectedMonth}
              label="Select Month"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Year</label>
          <Input
            value={currentYear}
            readOnly
            placeholder="Financial Year"
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="plain"
            onClick={onClose}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            onClick={handleGenerate}
            disabled={
              !selectedCompany || 
              !selectedRegisterType || 
              (isSalaryRegister && (!selectedState || !selectedMonth)) || 
              isGenerating
            }
            loading={isGenerating}
            icon={<HiDownload />}
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default GenerateRegisterDialog;