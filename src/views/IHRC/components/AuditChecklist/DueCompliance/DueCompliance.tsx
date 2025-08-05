import React, { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui';
import { Notification } from '@/components/ui';
import AdaptableCard from '@/components/shared/AdaptableCard';
import DueComplianceTableTool from './components/DueComplianceTableTool';
import DueComplianceTable from './components/DueComplianceTable';
import { endpoints } from '@/api/endpoint';
import httpClient from '@/api/http-client';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchAuthUser } from '@/store/slices/login';
import { Loading } from '@/components/shared';
import store from '@/store';
import Company from './components/Company';

interface Permissions {
  canList: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

interface SelectOption {
    value: string
    label: string
}

interface BranchOption {
    label: string
    value: string
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

const DueCompliance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { login } = store.getState();
  const userType = login?.user?.type;
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
  const [selectedRole, setSelectedRole] = useState<'owner' | 'approver' | 'auditor'>('owner');
  
 // Initialize auth and permissions
useEffect(() => {
  const initializeAuth = async () => {
    try {
      setIsLoading(true); // Add loading state
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

      // Find Due Compliance module
      const dueComplianceModule = response.payload.moduleAccess?.find(
        (module: any) => module.id === 5
      );

      if (!dueComplianceModule) {
        toast.push(
          <Notification title="Permission" type="danger">
            You don't have access to the Due Compliance module
          </Notification>
        );
        navigate('/home');
        return;
      }

      // Find Due Compliance menu item
      const dueComplianceMenu = dueComplianceModule.menus?.find(
        (menu: any) => menu.id === 19
      );

      if (!dueComplianceMenu) {
        toast.push(
          <Notification title="Permission" type="danger">
            You don't have access to Due Compliance
          </Notification>
        );
        navigate('/home');
        return;
      }

      // Get and set permissions
      const newPermissions = getPermissions(dueComplianceMenu);
      setPermissions(newPermissions);

      if (!newPermissions.canList) {
        toast.push(
          <Notification title="Permission" type="danger">
            You don't have permission to view Due Compliance
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


    const [filters, setFilters] = useState({
          company_id: '',
          state_id: '',
          branch_id: ''
      })
  

  
    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters)
        // Reset to first page when filters change
        setPagination(prev => ({ ...prev, pageIndex: 1 }))
    }


  // Set default role based on user type - only run once after permissions are checked
  useEffect(() => {
    if (permissionCheckComplete && permissions.canList) {
      let defaultRole: 'owner' | 'approver' | 'auditor' = 'owner';
      
      if (userType === 'auditor') {
        defaultRole = 'auditor';
      } else {
        defaultRole = 'owner'; // Default to owner for other user types
      }
      
      console.log('Setting default role:', defaultRole, 'for user type:', userType);
      setSelectedRole(defaultRole);
    }
  }, [permissionCheckComplete, permissions.canList, userType]);

  // Fetch data based on selected role
  const fetchData = useCallback(async () => {
    // Ensure selectedRole is a string and not an object
    const currentRole = typeof selectedRole === 'string' ? selectedRole : (selectedRole as any)?.value || 'owner';
    
    if (!currentRole || !permissionCheckComplete || !permissions.canList) {
      console.log('Fetch data conditions not met:', { currentRole, permissionCheckComplete, canList: permissions.canList });
      return;
    }

    console.log('Fetching data for role:', currentRole);
    setIsLoading(true);
    
    try {
      let endpoint = '';
      
      switch (currentRole) {
        case 'owner':
          endpoint = endpoints.compliance.dueComplianceOwnerList();
          console.log('Calling owner endpoint:', endpoint);
          break;
        case 'approver':
          endpoint = endpoints.compliance.dueComplianceApproverList();
          console.log('Calling approver endpoint:', endpoint);
          break;
        case 'auditor':
          endpoint = endpoints.compliance.dueComplianceAuditorList();
          console.log('Calling auditor endpoint:', endpoint);
          break;
        default:
          console.error('Invalid role:', currentRole);
          setIsLoading(false);
          return;
      }

      const page = validatePage(pagination.pageIndex);
      const page_size = validatePageSize(pagination.pageSize);

     const params: any = {
        page: validatePage(pagination.pageIndex),
        page_size: validatePageSize(pagination.pageSize),
        search: searchTerm,
      };

      // Add filters if they exist
      if (filters.company_id) params.company_id = filters.company_id;
      if (filters.state_id) params.state_id = filters.state_id;
      if (filters.branch_id) params.branch_id = filters.branch_id;

      const response = await httpClient.get(endpoint, { params });

      if (response?.data?.data) {
        setData(response.data.data);
        setPagination(prev => ({
          ...prev,
          total: response.data.paginate_data?.totalResults || 0,
          pageIndex: page,
          pageSize: page_size
        }));
        console.log('Data updated successfully for role:', currentRole);
      }
    } catch (error: any) {
      console.error('Error fetching compliance data:', error);
      toast.push(
        <Notification type="danger" title="Error" closable={true}>
          Failed to fetch compliance data
        </Notification>
      );
    } finally {
      setIsLoading(false);
    }
  }, [selectedRole, pagination.pageIndex, pagination.pageSize, permissionCheckComplete, permissions.canList, searchTerm, filters]);


  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPagination(prev => ({ ...prev, pageIndex: 1 })); // Reset to first page when searching
  };

  useEffect(() => {
    console.log('Effect triggered - selectedRole:', selectedRole, 'permissionCheckComplete:', permissionCheckComplete, 'canList:', permissions.canList);
    if (permissionCheckComplete && permissions.canList && selectedRole) {
      fetchData();
    }
  }, [selectedRole, pagination.pageIndex, pagination.pageSize, fetchData]);

  // FIXED: Handle role change properly
  const handleRoleChange = (role: 'owner' | 'approver' | 'auditor') => {
    console.log('Role changed from', selectedRole, 'to', role);
    
    // Ensure we're setting a string value
    const newRole = typeof role === 'string' ? role : (role as any)?.value || 'owner';
    
    setSelectedRole(newRole as 'owner' | 'approver' | 'auditor');
    
    // Reset pagination when role changes
    setPagination(prev => ({
      ...prev, 
      pageIndex: 1
    }));
  };

  const handleUploadAll = (selectedComplianceIds: number[], remark: string) => {
    console.log(`Uploading ${selectedComplianceIds.length} compliances with remark: ${remark}`);
    // Implement API call for bulk upload if needed
  };

  const handleUploadSingle = async (complianceId: number, file: File, remark: string) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('document', file);
      formData.append('remark', remark);

      await httpClient.post(
        endpoints.compliance.dueComplianceDocumentUpload(complianceId),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.push(
        <Notification title="Success" type="success">
          Document uploaded successfully
        </Notification>
      );
      fetchData();
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Failed to upload document
        </Notification>
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (complianceId: number) => {
    try {
      setIsLoading(true);
      const currentRole = typeof selectedRole === 'string' ? selectedRole : (selectedRole as any)?.value || 'owner';
      let endpoint = '';
      
      if (currentRole === 'approver') {
        endpoint = endpoints.compliance.approveOwnerCompliance(complianceId);
      } else if (currentRole === 'auditor') {
        endpoint = endpoints.compliance.approveApproverCompliance(complianceId);
      }
      
      await httpClient.post(endpoint);
      toast.push(
        <Notification title="Success" type="success">
          Compliance approved successfully
        </Notification>
      );
      fetchData();
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Failed to approve compliance
        </Notification>
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (complianceId: number, reason: string) => {
    try {
      setIsLoading(true);
     
      const currentRole = typeof selectedRole === 'string' ? selectedRole : (selectedRole as any)?.value || 'owner';

      let endpoint = '';
      
      if (currentRole === 'approver') {
        endpoint = endpoints.compliance.rejectOwnerCompliance(complianceId);
      } else if (currentRole === 'auditor') {
        endpoint = endpoints.compliance.rejectApproverCompliance(complianceId);
      }
      
      await httpClient.post(endpoint, { reason });
      toast.push(
        <Notification title="Success" type="success">
          Compliance rejected successfully
        </Notification>
      );
      fetchData();
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Failed to reject compliance
        </Notification>
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (complianceId: number) => {
    try {
      setIsLoading(true);
      const response = await httpClient.get(
        endpoints.compliance.detailDueCompliance(complianceId)
      );
      return response.data;
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Failed to fetch compliance details
        </Notification>
      );
      return null;
    } finally {
      setIsLoading(false);
    }
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
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
        <div className="mb-4 lg:mb-0">
          <h3 className="text-2xl font-bold">Due Compliance</h3>
          <p className="text-gray-600">View your company's due compliance</p>
        </div>
        <div className="flex items-center gap-4">
          <DueComplianceTableTool 
            data={data} 
            onUploadAll={handleUploadAll} 
            canCreate={permissions.canCreate}
            selectedRole={selectedRole}
            onRoleChange={handleRoleChange}
            userType={userType}
            onSearch={handleSearch}
          />
        </div>
      </div>
       <div className="mb-8">
                                    <Company onFilterChange={handleFilterChange} />

            </div>
      <DueComplianceTable 
        data={data} 
        loading={isLoading}
        selectedRole={selectedRole}
        onUploadSingle={handleUploadSingle}
        onApprove={handleApprove}
        onReject={handleReject}
        onViewDetails={handleViewDetails}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        onPageSizeChange={handlePageSizeChange}
        canCreate={permissions.canCreate}
        fetchData={fetchData} 
      />
    </AdaptableCard>
  );
};

export default DueCompliance;