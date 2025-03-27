
import React from 'react';
import { Button, toast, Notification } from '@/components/ui';
import { HiDownload, HiPlusCircle } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { APP_PREFIX_PATH } from '@/constants/route.constant';
import Bu from './Bu';
import Filter from './Filter';
import Company from '../../../Home/components/Company';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';


interface BranchToolProps {
  onTableRefresh?: () => void;
  companyGroupId?: string;
  companyId?: string;
}




const BranchTool: React.FC<BranchToolProps> = ({ onTableRefresh,  companyGroupId, 
  companyId  }) => {
  const navigate = useNavigate();

  const handleAddBranch = () => {
    navigate(`/add-branch`);
  };

  const handleDownload = async () => {
    try {
      // Prepare query parameters
      const queryParams = {
        ...(companyGroupId && { group_id: [Number(companyGroupId)] }),
        ...(companyId && { company_id: [Number(companyId)] }),
      };

      // Make the API call
      const response = await httpClient.get(endpoints.branch.downloadData(), {
        params: queryParams,
        responseType: 'blob' // Important for file downloads
      });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'branch_data.xlsx');
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show success notification
      toast.push(
        <Notification title="Success" type="success">
          Branch data downloaded successfully
        </Notification>
      );
    } catch (error) {
      console.error('Download failed:', error);
      toast.push(
        <Notification title="Error" type="error">
          Failed to download branch data
        </Notification>
      );
    }
  };


  return (
    <div className='flex gap-2 items-center w-full'>
      {/* <Company/> */}
      <div>
        <Button variant='solid' icon={<HiDownload />} size='sm' onClick={handleDownload}>Download Data</Button>
      </div>
      <div>
      <Bu onUploadSuccess={onTableRefresh} />
      </div>
      <Button variant="solid" onClick={handleAddBranch} icon={<HiPlusCircle />} size="sm">
        Add Branch
      </Button>
      
    </div>
  );
};

export default BranchTool;

