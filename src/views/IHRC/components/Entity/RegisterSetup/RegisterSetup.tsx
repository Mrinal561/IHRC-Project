import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button, Dialog, toast, Notification } from '@/components/ui';
import { HiArrowLeft, HiPlusCircle } from 'react-icons/hi';
import RegisterSetupPanel from './components/RegisterSetupPanel';
import RegisterSetupTable from './components/RegisterSetupTable';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import useAuth from '@/utils/hooks/useAuth';

export interface RegisterSetupData {
  id?: number;
  company_id: number;
  name_of_industry: string;
  address: string;
  name_of_employer: string;
  Company?: {
    id: number;
    name: string;
  };
  created_at?: string;
  updated_at?: string;
}

interface LocationState {
  companyName?: string;
  companyId?: string;
}

const RegisterSetup: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registerSetupData, setRegisterSetupData] = useState<RegisterSetupData[]>([]);
  const locationState = location.state as LocationState;
  const actualCompanyId = companyId || locationState?.companyId;
  const actualCompanyName = locationState?.companyName || 'Company';
  const [pagination, setPagination] = useState({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    toast.push(
      <Notification
        title={type === 'success' ? 'Success' : 'Error'}
        type={type}
        closable= {true}
      >
        {message}
      </Notification>
    );
  };

  const fetchRegisterSetupData = async () => {
    if (!actualCompanyId) return;
    
    try {
      setIsLoading(true);
      const response = await httpClient.get(endpoints.registerSetup.listRegisterSetup(), {
        params: {
          company_id: actualCompanyId,
          page: pagination.pageIndex,
          page_size: pagination.pageSize,
        },
      });
      
      if (response?.data) {
        setRegisterSetupData(response.data.data || response.data);
        if (response.data.paginate_data) {
          setPagination(prev => ({
            ...prev,
            total: response.data.paginate_data.totalResults,
          }));
        }
      }
    } catch (error: any) {
      console.error('Error fetching register setup data:', error);
      showNotification('error', 'Failed to fetch register setup data');
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
      pageIndex: 1,
    }));
  };

  useEffect(() => {
    fetchRegisterSetupData();
  }, [actualCompanyId, pagination.pageIndex, pagination.pageSize]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddRegisterSetup = async (newRegisterSetup: RegisterSetupData) => {
    try {
      setIsLoading(true);
      const response = await httpClient.post(
        endpoints.registerSetup.createRegisterSetup(),
        {
          company_id: Number(actualCompanyId),
          name_of_industry: newRegisterSetup.name_of_industry,
          address: newRegisterSetup.address,
          name_of_employer: newRegisterSetup.name_of_employer
        }
      );
      
      if (response.data) {
        showNotification('success', 'Register Setup created successfully');
        fetchRegisterSetupData();
        setIsOpen(false);
      }
    } catch (error: any) {
      console.error('Error adding register setup:', error);
      showNotification('error', error.response?.data?.message || 'Failed to create register setup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
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
          />
          <h1 className="text-2xl font-bold">
            {actualCompanyName} - Register Setup
          </h1>
        </div>
        <Button
          variant="solid"
          size="sm"
          icon={<HiPlusCircle />}
          onClick={() => setIsOpen(true)}
          disabled={isLoading}
        >
          Add Register Setup
        </Button>
      </div>

      <RegisterSetupTable
        data={registerSetupData}
        isLoading={isLoading}
        onRefresh={fetchRegisterSetupData}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        onPageSizeChange={handlePageSizeChange}
        onDelete={() => {}}
        onEdit={() => {}}
      />

      <Dialog
        isOpen={isOpen}
        onClose={handleClose}
        onRequestClose={() => setIsOpen(false)}
        width={800}
        height={450}
        shouldCloseOnOverlayClick={false}
      >
        <h4 className="mb-4">Add Register Setup</h4>
        <RegisterSetupPanel
          onClose={handleClose}
          onSubmit={handleAddRegisterSetup}
          companyId={actualCompanyId || ''}
          companyName={actualCompanyName}
          isLoading={isLoading}
        />
      </Dialog>
    </div>
  );
};

export default RegisterSetup;