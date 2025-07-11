import React, { useState } from 'react';
import CustomTableSearch from './CustomTableSearch';
import { Button } from '@/components/ui';
import { HiDownload } from 'react-icons/hi';
import CustomChecklistButton from './CustomChecklistButton';
import BulkUpload from './BulkUpload';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { Notification, toast } from '@/components/ui';
import CustomChecklistTable from './CustomChecklistTable';


interface CustomChecklistToolProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onRefresh?: () => void;  // Add this prop
}


const CustomChecklistTool = ({ 
    searchQuery, 
    onSearchChange,
    onRefresh 
}: CustomChecklistToolProps) => {
  const handleExportData = async () => {
    try {
      const response = await httpClient.get(
        endpoints.compliance.exportCustomChecklist(),
        {
          responseType: 'blob'
        }
      );

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Custom_Checklists_Export.xlsx';
      document.body.appendChild(a);
      a.click();
      
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
    <div className="flex flex-col">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
       <CustomTableSearch 
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
        <Button 
          size='sm' 
          icon={<HiDownload />} 
          variant='solid'
          onClick={handleExportData}
        >
          Download 
        </Button>
        <BulkUpload onSuccess={onRefresh} />
        <div className="block lg:inline-block md:mb-0 mb-4">
          <CustomChecklistButton />
        </div>
      </div>
      {/* <CustomChecklistTable searchQuery={searchQuery} /> */}
    </div>
  );
};

export default CustomChecklistTool;