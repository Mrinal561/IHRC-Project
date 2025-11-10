import React, { useState, useEffect, useCallback, useMemo } from 'react';
import StatusTable from './components/StatusTable';
import StatusCard from './components/StatusCard';
import Company from '../../Home/components/Company';
import { endpoints } from '@/api/endpoint';
import httpClient from '@/api/http-client';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Notification, toast } from '@/components/ui';
import { fetchAuthUser } from '@/store/slices/login';
import { Loading } from '@/components/shared';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import store from '@/store';

interface SelectOption {
  label: string;
  value: string;
}

interface BranchOption {
  label: string;
  value: string;
}

interface Permissions {
  canList: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

const getPermissions = (menuItem: any): Permissions => {
  const permissionsObject = menuItem?.permissions || menuItem?.access || {};
  return {
    canList: !!permissionsObject.can_list,
    canCreate: !!permissionsObject.can_create,
    canEdit: !!permissionsObject.can_edit,
    canDelete: !!permissionsObject.can_delete,
  };
};


const validatePage = (page: number): number => {
  const validatedPage = Math.max(1, Math.floor(Number(page)));
  return isNaN(validatedPage) ? 1 : validatedPage;
};

const validatePageSize = (size: number): number => {
  const validatedSize = Math.max(1, Math.min(100, Math.floor(Number(size))));
  return isNaN(validatedSize) ? 10 : validatedSize;
};

const Status: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { login } = store.getState();
  const userType = login?.user?.type;

  const [selectedView, setSelectedView] = useState<'owner' | 'approver' | 'auditor'>('owner');
  const [selectedStatus, setSelectedStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  });
  const [permissions, setPermissions] = useState<Permissions>({
    canList: false,
    canCreate: false,
    canEdit: false,
    canDelete: false,
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [permissionCheckComplete, setPermissionCheckComplete] = useState(false);
  
  // Filter states
  const [selectedCompany, setSelectedCompany] = useState<SelectOption | null>(null);
  const [selectedState, setSelectedState] = useState<SelectOption | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<SelectOption | null>(null);

  // Initialize auth and permissions
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const response = await dispatch(fetchAuthUser());

        if (!response.payload?.moduleAccess) {
          toast.push(
            <Notification title="Permission" type="danger">
              You don't have access to any modules
            </Notification>
          );
          navigate('/home');
          return;
        }

        // Find Status module
        const statusModule = response.payload.moduleAccess?.find(
          (module: any) => module.id === 5 // Replace with correct module ID
        );

        if (!statusModule) {
          toast.push(
            <Notification title="Permission" type="danger">
              You don't have access to the Status module
            </Notification>
          );
          navigate('/home');
          return;
        }

        // Find Status menu item
        const statusMenu = statusModule.menus?.find(
          (menu: any) => menu.id === 19 // Replace with correct menu ID
        );

        if (!statusMenu) {
          toast.push(
            <Notification title="Permission" type="danger">
              You don't have access to Status
            </Notification>
          );
          navigate('/home');
          return;
        }

        // Get and set permissions
        const newPermissions = getPermissions(statusMenu);
        setPermissions(newPermissions);

        if (!newPermissions.canList) {
          toast.push(
            <Notification title="Permission" type="danger">
              You don't have permission to view Status
            </Notification>
          );
          navigate('/home');
        }

      } catch (error) {
        console.error('Error fetching auth user:', error);
        toast.push(
          <Notification title="Error" type="danger">
            Failed to initialize application
          </Notification>
        );
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
        setPermissionCheckComplete(true);
      }
    };

    if (!isInitialized) {
      initializeAuth();
    }
  }, [dispatch, isInitialized, navigate]);

  // Set default view based on user type
  useEffect(() => {
    if (permissionCheckComplete && permissions.canList) {
      let defaultView: 'owner' | 'approver' | 'auditor' = 'owner';
      
      if (userType === 'auditor') {
        defaultView = 'auditor';
      } else {
        defaultView = 'owner'; // Default to owner for other user types
      }
      
      setSelectedView(defaultView);
    }
  }, [permissionCheckComplete, permissions.canList, userType]);

  // Fetch data based on selected view and status
  const fetchData = useCallback(async () => {
    if (!permissionCheckComplete || !permissions.canList) {
      return;
    }

    setIsLoading(true);
    
    try {
      let endpoint = '';
      let statusParam = '';
      
      // Determine endpoint and status param based on view and status
      switch (selectedView) {
        case 'owner':
          endpoint = endpoints.compliance.dueComplianceOwnerList();
          switch (selectedStatus) {
            case 'pending':
              statusParam = 'pending';
              break;
            case 'approved':
              statusParam = 'approved_by_approver';
              break;
            case 'rejected':
              statusParam = 'rejected_by_approver';
              break;
          }
          break;
          
        case 'approver':
          endpoint = endpoints.compliance.dueComplianceApproverList();
          switch (selectedStatus) {
            case 'pending':
              statusParam = 'submitted';
              break;
            case 'approved':
              statusParam = 'approved_by_auditor';
              break;
            case 'rejected':
              statusParam = 'rejected_by_auditor';
              break;
          }
          break;
          
        case 'auditor':
          endpoint = endpoints.compliance.dueComplianceAuditorList();
          switch (selectedStatus) {
            case 'pending':
              statusParam = 'approved_by_approver';
              break;
            case 'approved':
              statusParam = 'approved_by_auditor';
              break;
            case 'rejected':
              statusParam = 'rejected_by_auditor';
              break;
          }
          break;
      }

        const page = validatePage(pagination.pageIndex);
      const page_size = validatePageSize(pagination.pageSize);

      const response = await httpClient.get(endpoint, {
        params: {
          page: page.toString(),
          page_size: page_size.toString(),
          search: searchTerm,
          status: statusParam,
          company_id: selectedCompany?.value || undefined,
          state_id: selectedState?.value || undefined,
          branch_id: selectedBranch?.value || undefined

        },
      });

      if (response?.data?.data) {
        setData(response.data.data);
        setPagination(prev => ({
          ...prev,
          total: response.data.paginate_data?.totalResults || 0,
          pageIndex: page,
          pageSize: page_size
        }));
      }
    } catch (error: any) {
      console.error('Error fetching status data:', error);
      toast.push(
        <Notification type="danger" title="Error" closable={true}>
          Failed to fetch status data
        </Notification>
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedView, 
    selectedStatus, 
    pagination.pageIndex, 
    pagination.pageSize, 
    permissionCheckComplete, 
    permissions.canList, 
    searchTerm,
    selectedCompany,
    selectedState,
    selectedBranch
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPagination(prev => ({ ...prev, pageIndex: 1 }));
  };

  const handleViewChange = (view: 'owner' | 'approver' | 'auditor') => {
    setSelectedView(view);
    setPagination(prev => ({ ...prev, pageIndex: 1 }));
  };

  const handleStatusChange = (status: 'pending' | 'approved' | 'rejected') => {
    setSelectedStatus(status);
    setPagination(prev => ({ ...prev, pageIndex: 1 }));
  };

   const handlePaginationChange = (page: number) => {
    const validPage = validatePage(page);
    setPagination((prev) => ({
      ...prev, 
      pageIndex: validPage
    }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const validPageSize = validatePageSize(newPageSize);
    setPagination((prev) => ({
      ...prev, 
      pageSize: validPageSize,
      pageIndex: 1  // Reset to first page when page size changes
    }));
  };

  // View options based on user type
  const viewOptions = useMemo(() => {
    const allOptions = [
      { value: 'owner', label: 'As a Owner' },
      { value: 'approver', label: 'As a Approver' },
      { value: 'auditor', label: 'As a Auditor' },
    ];

    if (userType === 'admin') {
      return allOptions;
    }
    
    if (userType === 'auditor') {
      return allOptions.filter(option => option.value === 'auditor');
    }
    
    return allOptions.filter(option => option.value !== 'auditor');
  }, [userType]);

  // Status options
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    // { value: 'rejected', label: 'Rejected' },
  ];

  if (!isInitialized || !permissionCheckComplete) {
    return (
      <Loading loading={true} type="default">
        <div className="h-full" />
      </Loading>
    );
  }

  if (!permissions.canList) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex flex-row lg:flex-row lg:items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold">Status</h3>
          <p className="text-gray-600">View your company's compliance status</p>
        </div>
        <div className="flex gap-4">
          <div className="w-52">
            <OutlinedSelect
              label="Select View"
              options={viewOptions}
              value={viewOptions.find(option => option.value === selectedView) || viewOptions[0]}
              onChange={(option) => handleViewChange(option?.value as 'owner' | 'approver' | 'auditor')}
            />
          </div>
          <div className="w-52">
            <OutlinedSelect
              label="Status"
              options={statusOptions}
              value={statusOptions.find(option => option.value === selectedStatus) || statusOptions[0]}
              onChange={(option) => handleStatusChange(option?.value as 'pending' | 'approved' | 'rejected')}
            />
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <Company 
          onCompanyChange={setSelectedCompany}
          onStateChange={setSelectedState}
          onBranchChange={setSelectedBranch}
        />
      </div>
      
      <div>
        <StatusCard 
          selectedView={selectedView}
          selectedStatus={selectedStatus}
          companyId={selectedCompany?.value}
          stateId={selectedState?.value}
          branchId={selectedBranch?.value}
        />
      </div>
      
      <div>
        <StatusTable
          data={data}
          loading={isLoading}
          selectedView={selectedView}
          selectedStatus={selectedStatus}
          onSearch={handleSearch}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
          onPageSizeChange={handlePageSizeChange}
          canCreate={permissions.canCreate}
        />
      </div>
    </div>
  );
};

export default Status;