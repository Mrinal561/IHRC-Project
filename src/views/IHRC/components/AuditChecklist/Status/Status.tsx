import React, { useEffect, useState } from 'react';
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
  const permissionsObject = menuItem?.permissions || menuItem?.access || {}
  return {
      canList: !!permissionsObject.can_list,
      canCreate: !!permissionsObject.can_create,
      canEdit: !!permissionsObject.can_edit,
      canDelete: !!permissionsObject.can_delete,
  }
}


const Status: React.FC = () => {
  const [currentFilter, setCurrentFilter] = useState('Pending');
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [updateCounter, setUpdateCounter] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState<SelectOption | null>(null);
  const [selectedCompanyGroup, setSelectedCompanyGroup] = useState<SelectOption | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<SelectOption | null>(null);
  const [selectedState, setSelectedState] = useState<SelectOption | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<SelectOption | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<SelectOption | null>(null);

  const [permissions, setPermissions] = useState<Permissions>({
    canList: false,
    canCreate: false,
    canEdit: false,
    canDelete: false,
})
const [isInitialized, setIsInitialized] = useState(false)
const [permissionCheckComplete, setPermissionCheckComplete] = useState(false)

//permission check section 
// useEffect(() => {
//     const initializeAuth = async () => {
//         try {
//             const response = await dispatch(fetchAuthUser())

//             if (!response.payload?.moduleAccess) {
//               toast.push(
//                   <Notification
//                       title="Permission"
//                       type="danger"
//                   >
//                       You don't have access to any modules
//                   </Notification>
//               )
//               navigate('/home')
//               setPermissionCheckComplete(true)
//               setIsInitialized(true)
//               return
//           }
            
//             // Find Remittance Tracker module
//             const remittanceModule = response.payload.moduleAccess?.find(
//                 (module: any) => module.id === 2
//             )
            
//             if (!remittanceModule) {
//               toast.push(
//                   <Notification
//                       title="Permission"
//                       type="danger"
//                   >
//                       You don't have access to this module
//                   </Notification>
//               )
//               navigate('/home')
//               setPermissionCheckComplete(true)
//               setIsInitialized(true)
//               return
//           }

//             // Find PF Tracker menu item
//             const recommendedMenu = remittanceModule.menus?.find(
//                 (menu: any) => menu.id === 13
//             )

//             if (!recommendedMenu) {
//               toast.push(
//                   <Notification
//                       title="Permission"
//                       type="danger"
//                   >
//                       You don't have access to this menu
//                   </Notification>
//               )
//               navigate('/home')
//               setPermissionCheckComplete(true)
//               setIsInitialized(true)
//               return
//           }

//             // Get and set permissions only once
//             const newPermissions = getPermissions(recommendedMenu)
//             setPermissions(newPermissions)
//             setIsInitialized(true)
            
//             // If no list permission, show notification and redirect
//             if (!newPermissions.canList) {
//                 toast.push(
//                     <Notification
//                         title="Permission"
//                         type="danger"
//                     >
//                         You don't have permission of Status List
//                     </Notification>
//                 )
//                 navigate('/home')
//             }
//             setPermissionCheckComplete(true)

//         } catch (error) {
//             console.error('Error fetching auth user:', error)
//             setIsInitialized(true)
//             setPermissionCheckComplete(true)
//         }
//     }

//     if (!isInitialized) {
//         initializeAuth()
//     }
// }, [dispatch, isInitialized,navigate])





  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleClearAll = () => {
    setCurrentFilter('Pending');
    setSearchTerm('');
    // Clear all company filters
    setSelectedBranch(null);
    setSelectedCompanyGroup(null);
    setSelectedCompany(null);
    setSelectedState(null);
    setSelectedDistrict(null);
    setSelectedLocation(null);
  };
    const handleStatusUpdate = () => {
    setUpdateCounter(prev => prev + 1);
  };

  const filterValues = {
    branchId: selectedBranch?.value,
    companyGroupId: selectedCompanyGroup?.value,
    companyId: selectedCompany?.value,
    stateId: selectedState?.value,
    districtId: selectedDistrict?.value,
    locationId: selectedLocation?.value
  };

//   if (!isInitialized || !permissionCheckComplete) {
//     return (
//         <Loading loading={true} type="default">
//             <div className="h-full" />
//         </Loading>
//     )
// }

// // Only render if we have list permission
// if (!permissions.canList) {
//     return null
// }

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
                <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold">Status</h3>
                    <p className="text-gray-600">View your company's compliance status</p>
                </div>
      </div>
      <div className='mb-4'>
      <Company 
      onBranchChange={setSelectedBranch}
      onCompanyGroupChange={setSelectedCompanyGroup}
      onCompanyChange={setSelectedCompany}
      onStateChange={setSelectedState}
      onDistrictChange={setSelectedDistrict}
      onLocationChange={setSelectedLocation}/>
      </div>
      <div>
        <StatusCard
          updateCounter={updateCounter}
          filterValues={filterValues}/>
      </div>
      <div>
        <StatusTable
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onClearAll={handleClearAll}
          currentFilter={currentFilter}
          filterValues={filterValues}
           onStatusUpdate={handleStatusUpdate}
           canCreate = {permissions.canCreate}
        />
      </div>
    </div>
  );
};

export default Status;