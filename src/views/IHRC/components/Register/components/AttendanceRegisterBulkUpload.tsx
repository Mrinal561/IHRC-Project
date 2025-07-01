import React, { useState, useEffect, useMemo } from 'react';
import { Button, Dialog, Input, Notification, toast } from '@/components/ui';
import { HiDownload } from 'react-icons/hi';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import useAuth from '@/utils/hooks/useAuth';
import { useAppSelector } from '@/store';
import { addMonths, format } from 'date-fns';

interface SelectOption {
  value: string;
  label: string;
}

interface AttendanceRegisterBulkUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const FINANCIAL_YEAR_KEY = 'selectedFinancialYear';
const FINANCIAL_YEAR_CHANGE_EVENT = 'financialYearChanged';

const generateMonthOptions = (financialYear: string | null) => {
  if (!financialYear) return [];

  // Parse the financial year (format: "2023-24")
  const [startYear] = financialYear.split('-');
  const fullStartYear = parseInt(`${startYear}`);

  const months = [];
  // Start from April of start year
  let startDate = new Date(fullStartYear, 3, 1); // Month is 0-based, so 3 is April

  // Generate 12 months starting from April
  for (let i = 0; i < 12; i++) {
    const date = addMonths(startDate, i);
    const twoDigitYear = format(date, 'yy'); // Get last two digits of the year
    months.push({
      value: format(date, 'MMMM'), // Full month name (e.g., "April")
      label: `${format(date, 'MMM')} ${twoDigitYear}`, // Format like "Apr 25"
      apiValue: format(date, 'MMM').toLowerCase() // Short month name (e.g., "apr")
    });
  }

  return months;
};

const AttendanceRegisterBulkUpload: React.FC<AttendanceRegisterBulkUploadProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<SelectOption | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<SelectOption | null>(null);
  const [companies, setCompanies] = useState<SelectOption[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const auth = useAuth();
  const [financialYear, setFinancialYear] = useState<string | null>(
    sessionStorage.getItem(FINANCIAL_YEAR_KEY)
  );
  const monthOptions = useMemo(
    () => generateMonthOptions(financialYear),
    [financialYear]
  );

  useEffect(() => {
    const handleFinancialYearChange = (event: CustomEvent) => {
      const newFinancialYear = event.detail;
      setFinancialYear(newFinancialYear);
      sessionStorage.setItem(FINANCIAL_YEAR_KEY, newFinancialYear);
      setSelectedMonth(null); // Reset month selection when financial year changes
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = async () => {
    if (!selectedCompany || !selectedMonth) {
      toast.push(
        <Notification title="Warning" type="warning" closable>
          Please select company and month first
        </Notification>
      );
      return;
    }

    try {
      const response = await httpClient.get(
        endpoints.register.downloadAttendanceRegisterTemplate(),
        {
          params: {
            company_id: Number(selectedCompany.value),
            month: selectedMonth.value.toString(),
            register_type: 'Attendance Register'
          },
          responseType: 'blob'
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance-register-template-${selectedMonth.value}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.push(
        <Notification title="Error" type="error" closable>
          Failed to download template
        </Notification>
      );
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedCompany || !selectedMonth || !financialYear) {
      toast.push(
        <Notification title="Warning" type="warning" closable>
          Please fill all fields and select a file
        </Notification>
      );
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('company_id', selectedCompany.value);
      formData.append('register_type', 'Attendance Register');
      formData.append('month', selectedMonth.value);
      formData.append('year', financialYear.split('-')[0]); // Extract first year (2025 from 2025-26)

      const response = await httpClient.post(
        endpoints.register.createAttendancceRegister(),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data) {
        toast.push(
          <Notification title="Success" type="success" closable>
            Attendance register uploaded successfully
          </Notification>
        );
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      let errorMessage = 'Failed to upload salary register';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.join('\n');
      }

      toast.push(
        <Notification title="Error" type="error" closable>
          {errorMessage}
        </Notification>
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleCompanyChange = (selectedOption: SelectOption | null) => {
  setSelectedCompany(selectedOption);
  if (!selectedOption) {
    setFile(null); // Clear file if company is deselected
  }
};

  const handleMonthChange = (selectedOption: SelectOption | null) => {
    setSelectedMonth(selectedOption);
    if (!selectedOption) {
      setFile(null); // Reset file if month is deselected
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      onRequestClose={onClose}
      width={500}
    >
      <h5 className="mb-4">Upload Attendance Register</h5>
      
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Company</label>
          <OutlinedSelect
            options={companies}
            value={selectedCompany}
            onChange={(selectedOption) => setSelectedCompany(selectedOption)}
            label="Select Company"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Select Month</label>
          <OutlinedSelect
            options={monthOptions}
            value={selectedMonth}
            onChange={handleMonthChange}
            label="Select Month"
          />
        </div>

        <div className="my-4 flex gap-2 items-center">
          <p>Download Template:</p>
          <Button
            size="xs"
            icon={<HiDownload />}
            onClick={handleDownloadTemplate}
            disabled={!selectedCompany || !selectedMonth}
          >
            Download
          </Button>
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <p>Upload Attendance Register File:</p>
          {!selectedMonth || !selectedCompany && (
            <p className="text-sm text-red-500 mb-2">
              Please select a comapany & month first to enable file upload
            </p>
          )}
          <Input
            type="file"
            onChange={handleFileChange}
            accept=".xlsx,.xls,.csv"
            disabled={!selectedMonth || !selectedCompany}
            
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="plain"
            onClick={onClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            onClick={handleUpload}
            disabled={!file || !selectedCompany || !selectedMonth || isUploading}
            loading={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Confirm'}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default AttendanceRegisterBulkUpload;