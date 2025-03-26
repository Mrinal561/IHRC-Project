
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button, Dialog, toast, Notification } from '@/components/ui';
import { HiArrowLeft, HiDownload, HiPlusCircle } from 'react-icons/hi';
import PTSetupTable from './components/PTSetupTable';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { PTSetupData } from '@/@types/PtSetup';
import { fetchptsetup } from '@/store/slices/ptSetup/ptSetupSlice';
import { useDispatch } from 'react-redux';
import PTBulkUpload from './components/PTBulkUpload';

interface LocationState {
  companyName?: string;
  companyGroupName?: string;
  companyId?: string;
  groupId?: string;
}

const PTSetupPage: React.FC = () => {
  const { companyName } = useParams<{ companyName: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [ptSetupData, setPTSetupData] = useState<PTSetupData[]>([]);
  const dispatch = useDispatch();
    const locationState = location.state as { 
    companyName?: string; 
    companyGroupName?: string; 
    companyId?: string; 
    groupId?: string;
  };
  const actualCompanyId = locationState?.companyId;
  const actualCompanyName = locationState?.companyName;
  const actualGroupName = locationState?.companyGroupName;
  const actualGroupId = locationState?.groupId;

  const [pagination, setPagination] = useState({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
});


  const fetchPTSetupData = async () => {
    try {
      setIsLoading(true);
      const response = await await httpClient.get(endpoints.ptSetup.getAll(), {
        params: {
          'company_id[]': actualCompanyId,
          page: pagination.pageIndex,
          page_size: pagination.pageSize
      }
      });
      if (response?.data.data) {
        setPTSetupData(response.data.data);
        setPagination(prev => ({
          ...prev,
          total: response.data.paginate_data.totalResults
      }));
      }
      console.log('Fetched PT Setup data:', response.data.data);
    } catch (error) {
      console.error('Error fetching PT Setup data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaginationChange = (page: number) => {
    setPagination(prev => ({ ...prev, pageIndex: page }));
};

const handlePageSizeChange = (newPageSize: number) => {
    setPagination(prev => ({
        ...prev,
        pageSize: newPageSize,
        pageIndex: 1, // Reset to first page when changing page size
    }));
};


       const refreshPTSetupData = () => {
    fetchPTSetupData();
    // showNotification('PF Setup data refreshed successfully');
  };

  useEffect(() => {
    console.log(actualCompanyId,actualCompanyName, actualGroupId, actualGroupName)
    if(actualCompanyName){
      fetchPTSetupData();
    }
  }, [actualCompanyName, pagination.pageIndex, pagination.pageSize]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddPTSetup = () => {
    navigate(`/add-pt-setup`, {
      state: {
        companyName: actualCompanyName,
        companyGroupName: actualGroupName,
        companyId: actualCompanyId,
        groupId: actualGroupId
      }
    });
  };

  const showNotification = (message: string) => {
    toast.push(
      <Notification title="Success" type="success">
        <div className="flex items-center">
          <span>{message}</span>
        </div>
      </Notification>
    );
  };

  const handleDownload = async () => {
    if (!actualCompanyId || !actualGroupId) {
      toast.push(
        <Notification title="Error" type="error">
          Company information is incomplete
        </Notification>
      );
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append('company_id[]', actualCompanyId);
      params.append('group_id[]', actualGroupId);

      const response = await httpClient.get(endpoints.ptSetup.downloadData(), {
        params,
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'pt_setup_data.xlsx');
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.push(
        <Notification title="Success" type="success">
          PT Setup data downloaded successfully
        </Notification>
      );
    } catch (error) {
      console.error('Download failed:', error);
      toast.push(
        <Notification title="Error" type="error">
          Failed to download PT Setup data
        </Notification>
      );
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button
            variant="plain"
            size="sm"
            icon={<HiArrowLeft />}
            onClick={handleBack}
            className="mr-2"
          >
          </Button>
          <h1 className="text-2xl font-bold">{actualCompanyName}-PT Setup</h1>
        </div>
        <div className="flex items-center">
          <div className="flex gap-3">

        <Button 
            variant='solid' 
            size='sm' 
            icon={<HiDownload />}
            onClick={handleDownload}
            >
            Download
          </Button>
        <PTBulkUpload
                        companyId={actualCompanyId}
                        onUploadSuccess={refreshPTSetupData}
                        />
                        </div>
           <Button
          variant="solid"
          size="sm"
          icon={<HiPlusCircle />}
          onClick={handleAddPTSetup}
        >
          Add PT Setup
        </Button>
        </div>

      </div>

      <PTSetupTable data={ptSetupData}  
      isLoading={isLoading}
      onRefresh={refreshPTSetupData} 
      pagination={pagination}
      onPaginationChange={handlePaginationChange}
      onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default PTSetupPage;