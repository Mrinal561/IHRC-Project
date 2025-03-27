
import React, { useState } from 'react'
import SandETrackerFilter from './SandETrackerFilter';
import SandETrackerBulkUpload from './SandETrackerBulkUpload';
import { Button, toast, Notification } from '@/components/ui';
import CustomDateRangePicker from '../../PFTracker/components/CustomDateRangePicker';
import { HiDownload, HiPlusCircle } from 'react-icons/hi';
import NoticeUploadDialog from './SandETrackerBulkUpload';
import { useNavigate } from 'react-router-dom';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

interface SandETrackerToolProps {
  canCreate:boolean;
  onRefresh: () => void;
  onFilterChange: (filters: {
    groupName: string;
    groupId: string;
    companyName: string;
    companyId: string;
    startDate: string;
    endDate: string;
    // is_follow_up: string;
  }) => void;
}

const SandETrackerTool: React.FC<SandETrackerToolProps> = ({ onRefresh, onFilterChange, canCreate }) => {
  const [showUploadedDetails, setShowUploadedDetails] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filters, setFilters] = useState({
    groupName: '',
    groupId: '',
    companyName: '',
    companyId: '',
    startDate: '',
    endDate: '',
    status:'',
    noticeType: '',
  });
  const navigate = useNavigate()
  const handleUploadConfirm = () => {
    setShowUploadedDetails(true);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    console.log('Filter values changed:', newFilters);
    setFilters({
      ...newFilters,
    });
    onFilterChange(newFilters);
  };

  const handleDateRangeApply = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    
    const updatedFilters = {
      ...filters,
      startDate: start ? start.toISOString().split('T')[0] : '',
      endDate: end ? end.toISOString().split('T')[0] : ''
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleDownload = async () => {
    try {
      // Format dates to YYYY/MM/DD

      if (!filters.groupId  && !filters.companyId) {
        toast.push(
          <Notification title='Warning' type='warning' closable={true} duration={10000}>
            Atleast Select One Company To Download The Data
          </Notification>
        )
        return;
      }
      const formattedStartDate = filters.startDate ? new Date(filters.startDate).toISOString().split('T')[0].replace(/-/g, '/') : '';
      const formattedEndDate = filters.endDate ? new Date(filters.endDate).toISOString().split('T')[0].replace(/-/g, '/') : '';
  
      const response = await httpClient.get(endpoints.noticeTracker.download(), {
        responseType: 'blob',
        params: {
          'group_id[]': filters.groupId,
          'company_id[]': filters.companyId,
          'to_date[]': formattedEndDate,
          'from_date': formattedStartDate
        }
      });
      if(response){
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'NoticeTracker.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
      
     
    } catch (error) {
      toast.push(
        <Notification title='error' type='error' closable={true} duration={10000}>
        Failed to generate excel file
        </Notification>
      )
      // throw error
      // Here you might want to show an error notification to the user
    }
  };

  return (
    <div className='w-full'>
      <div className='flex gap-4 items-center mb-4 w-full'>
        <SandETrackerFilter onFilterChange={handleFilterChange} />
        <CustomDateRangePicker onApply={handleDateRangeApply} />
        <Button  
          variant="solid" 
          size="sm" 
          icon={<HiDownload />}
          onClick={handleDownload}
        >
          Download Data
        </Button>
        {canCreate && (
        <Button
          variant="solid"
          size="sm"
          icon={<HiPlusCircle />}
          onClick={() => navigate('/notice-tracker/create')} // Adjust this path to match your routing structure
        >
          Add Notice
        </Button>
      )}
      </div>
    </div>
  )
}

export default SandETrackerTool