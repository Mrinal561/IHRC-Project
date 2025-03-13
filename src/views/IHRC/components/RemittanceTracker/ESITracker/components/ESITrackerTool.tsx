// import React, { useState } from 'react';
// import ESITrackerFilter from './ESITrackerFilter';
// import ESITrackerTable from './ESITrackerTable';
// import ESITrackerBulkUpload from './ESITrackerBulkUpload';
// import UploadedESIDetails from './UploadedESIDetails';
// // import { sampleData } from './ESITrackerTable';
// import { dummyData } from '../../PFTracker/components/PFTrackerTable';
// import CustomDateRangePicker from './CustomDateRangePicker';
// import { Button } from '@/components/ui';
// import { HiDownload } from 'react-icons/hi';
// import httpClient from '@/api/http-client';
// import { endpoints } from '@/api/endpoint';

// const ESITrackerTool: React.FC<{ onFilterChange: (filters: any) => void }> = ({ onFilterChange })  => {
//   const [showUploadedDetails, setShowUploadedDetails] = useState(false);
//   const [filters, setFilters] = useState({ groupName: '', companyName: '', esiCode: '' });
//   const [isLoading, setIsLoading] = useState(false)


//   const handleUploadConfirm = () => {
//     setShowUploadedDetails(true);
//     setIsLoading(true)

//   };

//   const handleBack = () => {
//     setShowUploadedDetails(false);
//   };

//   const handleFilterChange = (newFilters) => {
//     setFilters(newFilters);
//     // You can apply the filters to your data here or pass them to ESITrackerTable
//   };
//   const handleDateRangeApply = (start: Date, end: Date) => {
//     setStartDate(start);
//     setEndDate(end);
//   };

//   if (showUploadedDetails) {
//     return <UploadedESIDetails onBack={handleBack}                 loading={isLoading}
// />;
//   }


//      const handleDownload = async () => {
//     try {
//       const res = await httpClient.get(endpoints.esiTracker.downloadAll(), {
//         responseType: 'blob'
//       })
      
//       const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
//       const url = window.URL.createObjectURL(blob)
//       const link = document.createElement('a')
//       link.href = url
//       link.setAttribute('download', 'ESIData.xlsx')
//       document.body.appendChild(link)
//       link.click()
//       document.body.removeChild(link)
//       window.URL.revokeObjectURL(url) // Clean up the URL object
//     } catch (error) {
//       console.error('Error downloading LWF data:', error)
//       // Here you might want to show an error notification to the user
//     }
//   }
//   return (
//     <div>
//       <div className="flex gap-3 items-center mb-4">
//         <ESITrackerFilter data={dummyData} onFilterChange={handleFilterChange} />
//         <CustomDateRangePicker onApply={handleDateRangeApply} />
//         <Button
//         variant="solid"
//         size="sm"
//           icon={<HiDownload />}
//          onClick={handleDownload}>Download ESI Data</Button>
//         <ESITrackerBulkUpload onUploadConfirm={handleUploadConfirm} />
//       </div>
//     </div>
//   );
// };

// export default ESITrackerTool;

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
    startdate:'',
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

    setFilters(prevFilters => ({
      ...prevFilters,
      startDate: start ? start.toISOString().split('T')[0] : null,
      endDate: end ? end.toISOString().split('T')[0] : null
    }));
  
    // Also call onFilterChange to notify parent component
    onFilterChange({
      ...filters,
      startDate: start ? start.toISOString().split('T')[0] : null,
      endDate: end ? end.toISOString().split('T')[0] : null
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
      const formattedStartDate = filters.startDate ? new Date(filters.startDate).toISOString().split('T')[0].replace(/-/g, '/') : '';
      const formattedEndDate = filters.endDate ? new Date(filters.endDate).toISOString().split('T')[0].replace(/-/g, '/') : '';
  
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
    <div className="w-full px-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center mb-4 w-full">
        <div className="w-full lg:flex-1">
          <ESITrackerFilter 
            onFilterChange={handleFilterChange} 
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <CustomDateRangePicker onApply={handleDateRangeApply} />
          <Button  
            variant="solid" 
            size="sm" 
            icon={<HiDownload />}
            onClick={handleDownload}
            className="whitespace-nowrap"
          >
            Download ESI Data
          </Button>
          <ESITrackerBulkUpload 
            onUploadConfirm={handleUploadConfirm} 
            canCreate={canCreate} 
          />
        </div>
      </div>
    </div>
  );
};

export default ESITrackerTool;