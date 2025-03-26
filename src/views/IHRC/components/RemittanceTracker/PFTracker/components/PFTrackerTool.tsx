
import React, { useEffect, useState } from 'react';
import PFTrackerFilter from './PFTrackerFilter';
import PFTrackerTable from './PFTrackerTable';
import PFTrackerBulkUpload from './PFTrackerBulkUpload';
import UploadedPFDetails from './UploadedPFDetails';
// import { dummyData } from './PFTrackerTable';
import { Button, toast, Notification } from '@/components/ui';
import { HiDownload } from 'react-icons/hi';
import CustomDateRangePicker from './CustomDateRangePicker';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

const PFTrackerTool: React.FC<{ 
  onFilterChange: (filters: { 
    groupName: string; 
    groupId: string;
    companyName: string; 
    companyId: string;
    pfCode: string ;
    startDate: string | null;
    endDate: string | null;
    // search:string;
    location_name: string | null;

  }) => void ;
  canCreate:boolean
}> = ({ onFilterChange, canCreate }) => {
  const [showUploadedDetails, setShowUploadedDetails] = useState(false);
  const [filters, setFilters] = useState({ 
    groupName: '', 
    groupId: '',
    companyName: '', 
    companyId: '',
    pfCode: '' ,
    startDate:'',
    endDate:'',
    // search:''
    location_name: ''

  });
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleUploadConfirm = () => {
    setShowUploadedDetails(true);
  };

  const handleBack = () => {
    setShowUploadedDetails(false);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  if (showUploadedDetails) {
    return <UploadedPFDetails onBack={handleBack} />;
  }

  useEffect(() => {
    console.log('Updated dates:', startDate, endDate);
  }, [startDate, endDate]);

  const handleDateRangeApply = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    // console.log(startDate, endDate)

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
      if (!filters.groupId && !filters.pfCode && !filters.companyId) {
        toast.push(
          <Notification title='Warning' type='warning' closable={true} duration={10000}>
            Atleast Select One Company To Download The Data
          </Notification>
        )
        return;
      }
  
      // Helper function to format date without timezone issues
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
  
      const res = await httpClient.get(endpoints.tracker.downloadALl(), {
        responseType: 'blob',
        params: {
          'group_id[]': filters.groupId,
          'code[]': filters.pfCode,
          'company_id[]': filters.companyId,
          'to_date': formattedEndDate,
          'from_date': formattedStartDate
        }
      });
  
      if (res) {
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'PFData.xlsx')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url) // Clean up the URL object
      }
    } catch (error) {
      throw error;
    }
  }

  return (
    <div className='w-full'>
      <div className="flex gap-4 items-center mb-4 w-full">
        <PFTrackerFilter 
          // data={dummyData} 
          onFilterChange={handleFilterChange} 
        />
        <CustomDateRangePicker onApply={handleDateRangeApply} />
        <Button  
          variant="solid" 
          size="sm" 
          icon={<HiDownload />}
          onClick={handleDownload}>
          Download PF Data
        </Button>
        <PFTrackerBulkUpload onUploadConfirm={handleUploadConfirm} canCreate={canCreate}/>
      </div>
    </div>
  );
};

export default PFTrackerTool;