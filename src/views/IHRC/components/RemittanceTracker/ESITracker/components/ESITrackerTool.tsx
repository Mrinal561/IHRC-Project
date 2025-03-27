import React, { useState } from 'react';
import ESITrackerFilter from './ESITrackerFilter';
import ESITrackerTable from './ESITrackerTable';
import ESITrackerBulkUpload from './ESITrackerBulkUpload';
import UploadedESIDetails from './UploadedESIDetails';
import { Button, toast, Notification } from '@/components/ui';
import { HiDownload } from 'react-icons/hi';
import CustomDateRangePicker from './CustomDateRangePicker';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

const ESITrackerTool: React.FC<{ 
  onFilterChange: (filters: { 
    groupName: string; 
    groupId: string;
    companyName: string; 
    companyId: string;
    esiCode: string ;
    startDate: string | null;
    endDate: string | null;
    // search: string | null;
    location_name: string | null;
  }) => void ,
  canCreate:boolean;
}> = ({ onFilterChange, canCreate }) => {
  const [showUploadedDetails, setShowUploadedDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({ 
    groupName: '', 
    groupId: '',
    companyName: '', 
    companyId: '',
    esiCode: '' ,
    startDate:'',
    endDate:'',
    // search: ''
    location_name: ''
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleUploadConfirm = () => {
    setShowUploadedDetails(true);
    setIsLoading(true);
  };

  const handleBack = () => {
    setShowUploadedDetails(false);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  if (showUploadedDetails) {
    return <UploadedESIDetails onBack={handleBack} loading={isLoading} groupId={filters.groupId} companyId={filters.companyId} />;
  }

  const handleDateRangeApply = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);


    const formatDateWithoutTimezone = (date: Date | null) => {
      if (!date) return null;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };


    setFilters(prevFilters => ({
      ...prevFilters,
      startDate: formatDateWithoutTimezone(start),
      endDate: formatDateWithoutTimezone(end)
    }));
  
    // Also call onFilterChange to notify parent component
    onFilterChange({
      ...filters,
      startDate: formatDateWithoutTimezone(start),
      endDate: formatDateWithoutTimezone(end)
    });
  };

  const handleDownload = async () => {
    try {
      // Format dates to YYYY/MM/DD

      if (!filters.groupId && !filters.esiCode && !filters.companyId) {
        toast.push(
          <Notification title='Warning' type='warning' closable={true} duration={10000}>
            Atleast Select One Company To Download The Data
          </Notification>
        )
        return;
      }

      const formatDateForDownload = (dateString: string | null) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
      };


      const formattedStartDate = formatDateForDownload(filters.startDate);
      const formattedEndDate = formatDateForDownload(filters.endDate);
  
      const response = await httpClient.get(endpoints.esiTracker.downloadAll(), {
        responseType: 'blob',
         params: {
          'group_id[]': filters.groupId,
          'code[]': filters.esiCode,
          'company_id[]': filters.companyId,
          'to_date': formattedEndDate,
          'from_date': formattedStartDate
        }
      });
      if(response){
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'ESIData.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
      
     
    } catch (error) {
      throw error
      // Here you might want to show an error notification to the user
    }
  };
  return (
    <div className="w-full">
      <div className="flex gap-4 items-center mb-4 w-full">
          <ESITrackerFilter 
            onFilterChange={handleFilterChange} 
          />
          <CustomDateRangePicker onApply={handleDateRangeApply} />
          <Button  
            variant="solid" 
            size="sm" 
            icon={<HiDownload />}
            onClick={handleDownload}
            className="whitespace-nowrap"
          >
            Download Data
          </Button>
          <ESITrackerBulkUpload 
            onUploadConfirm={handleUploadConfirm} 
            canCreate={canCreate} 
          />
        </div>
      </div>
  );
};

export default ESITrackerTool;