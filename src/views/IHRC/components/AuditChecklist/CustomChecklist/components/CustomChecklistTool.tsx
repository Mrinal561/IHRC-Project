import React from 'react';
import CustomTableSearch from './CustomTableSearch';
import { Button } from '@/components/ui';
import { HiDownload } from 'react-icons/hi';
import CustomChecklistButton from './CustomChecklistButton';
import BulkUpload from './BulkUpload';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { Notification, toast } from '@/components/ui';

const CustomChecklistTool = () => {
  const handleExportData = async () => {
    try {
      const response = await httpClient.get(
        endpoints.compliance.exportCustomChecklist(),
        {
          responseType: 'blob'
        }
      );

      // Create a blob from the response
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Custom_Checklists_Export.xlsx'; // or get filename from headers
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.push(
        <Notification title="Success" type="success">
          Data exported successfully
        </Notification>
      );
    } catch (error) {
      console.error('Export failed:', error);
      toast.push(
        <Notification title="Error" type="error">
          Failed to export data
        </Notification>
      );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-3">
      <CustomTableSearch />
      <Button 
        size='sm' 
        icon={<HiDownload />} 
        variant='solid'
        onClick={handleExportData}
      >
        Download 
      </Button>
      <BulkUpload />
      <div className="block lg:inline-block md:mb-0 mb-4">
        <CustomChecklistButton />
      </div>
    </div>
  );
};

export default CustomChecklistTool;