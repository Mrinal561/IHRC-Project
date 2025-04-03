

import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '@/store';
import reducer from './store';
import { Notification, toast } from '@/components/ui';
import AdaptableCard from '@/components/shared/AdaptableCard';
import RecommendedTableTool from './components/RecommendedTableTool';
import RecommendedTable from './components/RecommendedTable';

import Company from '../../Home/components/Company';
import { endpoints } from '@/api/endpoint';
import httpClient from '@/api/http-client';
import { ComplianceData } from '@/@types/compliance';
import { useNavigate } from 'react-router-dom';
import { fetchAuthUser } from '@/store/slices/login';
import { Loading } from '@/components/shared';

interface BranchOption {
    label: string;
    value: string;
}

interface SelectOption {
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


const RecommendedList = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [istableLoading, setIstableLoading] = useState(false)
    const [complianceData, setComplianceData] = useState<ComplianceData[]>([]);
    const [tableKey, setTableKey] = useState(0);
    const [selectedBranch, setSelectedBranch] = useState<BranchOption | null>(null);
    const [selectedComplianceIds, setSelectedComplianceIds] = useState<number[]>([]);
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
    //                 toast.push(
    //                     <Notification
    //                         title="Permission"
    //                         type="danger"
    //                     >
    //                         You don't have access to any modules
    //                     </Notification>
    //                 )
    //                 navigate('/home')
    //                 setPermissionCheckComplete(true)
    //                 setIsInitialized(true)
    //                 return
    //             }
                
    //             // Find Remittance Tracker module
    //             const remittanceModule = response.payload.moduleAccess?.find(
    //                 (module: any) => module.id === 2
    //             )
                
    //             if (!remittanceModule) {
    //                 toast.push(
    //                     <Notification
    //                         title="Permission"
    //                         type="danger"
    //                     >
    //                         You don't have access to this module
    //                     </Notification>
    //                 )
    //                 navigate('/home')
    //                 setPermissionCheckComplete(true)
    //                 setIsInitialized(true)
    //                 return
    //             }

    //             // Find PF Tracker menu item
    //             const recommendedMenu = remittanceModule.menus?.find(
    //                 (menu: any) => menu.id === 9
    //             )

    //             if (!recommendedMenu) {
    //                 toast.push(
    //                     <Notification
    //                         title="Permission"
    //                         type="danger"
    //                     >
    //                         You don't have access to this menu
    //                     </Notification>
    //                 )
    //                 navigate('/home')
    //                 setPermissionCheckComplete(true)
    //                 setIsInitialized(true)
    //                 return
    //             }

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
    //                         You don't have permission of Recommended List
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
    // }, [dispatch, isInitialized, navigate])






    const handleDataUpdate = (pageIndex: number, pageSize: number) => {
        fetchComplianceData(pageIndex, pageSize);
    };

    const fetchComplianceData = async (page = 1, pageSize = 10) => {
        setIsLoading(true);
        try {
            const response = await httpClient.get(endpoints.complianceSuperadmin.getAll(), {
                params: {
                    page,
                    pageSize
                }
            });

            if (response?.data?.data) {
                setComplianceData(response.data.data);
                setIstableLoading(false)
            } else {
                console.log('No data in API response or unexpected response structure');
            }
        } catch (error) {
            console.error('Error fetching compliance data:', error);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to fetch compliance data
                </Notification>
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log({
            companyGroup: selectedCompanyGroup,
            company: selectedCompany,
            state: selectedState,
            district: selectedDistrict,
            branch: selectedBranch,
            location: selectedLocation,
        });
        
        // Fetch data with updated filters
        fetchComplianceData();
    }, [istableLoading]);

    useEffect(() => {
        fetchComplianceData();
    }, []); // Initial fetch

    useEffect(() => {
        if (selectedBranch) {
            fetchComplianceData();
        }
    }, [selectedBranch]); // Refetch when branch changes

    const handleBranchChange = (branch: BranchOption | null) => {
        setSelectedBranch(branch);
        setTableKey(prevKey => prevKey + 1);
    };

    const handleSelectedCompliancesChange = (selectedIds: number[]) => {
        setSelectedComplianceIds(selectedIds);
        console.log(selectedComplianceIds)
    };

    const handleAssignSuccess = () => {
        setSelectedComplianceIds([]);
        setTableKey(prevKey => prevKey + 1);
        fetchComplianceData();
    };

    useEffect(() => {
        // Simplified fetch with reduced filtering
        fetchComplianceData();
    }, [selectedState, selectedCompanyGroup, selectedCompany]);

    
    // if (!isInitialized || !permissionCheckComplete) {
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
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="flex flex-row items-center justify-between mb-10">
                <div className="">
                    <h3 className="text-2xl font-bold">Recommended Checklist</h3>
                    <p className="text-gray-600">View your company's recommended compliance</p>
                </div>
            </div>
            <div className='mb-8 flex gap-4'>
                <Company 
                    onBranchChange={(branch) => handleBranchChange(branch)}
                    onCompanyGroupChange={setSelectedCompanyGroup}
                    onCompanyChange={setSelectedCompany}
                    onStateChange={setSelectedState}
                    onDistrictChange={setSelectedDistrict}
                    onLocationChange={setSelectedLocation}
                />
                <RecommendedTableTool
                    selectedComplianceIds={selectedComplianceIds} 
                    branchValue={selectedBranch?.value || ''}
                    companyGroupValue={selectedCompanyGroup?.value || ''}
                    companyValue={selectedCompany?.value || ''}
                    stateValue={selectedState?.value || ''}
                    districtValue={selectedDistrict?.value || ''} 
                    locationValue={selectedLocation?.value || ''} 
                    onAssignSuccess={handleAssignSuccess}
                    canCreate = {permissions.canCreate}
                />
            </div>
            <RecommendedTable
                data={complianceData}
                loading={isLoading}
                tableKey={tableKey}
                branchValue={selectedBranch?.value || ''}
                companyGroupValue={selectedCompanyGroup?.value || ''}
                companyValue={selectedCompany?.value || ''}
                stateValue={selectedState?.value || ''}
                districtValue={selectedDistrict?.value || ''} 
                locationValue={selectedLocation?.value || ''} 
                onSelectedCompliancesChange={handleSelectedCompliancesChange}
                onDataUpdate={fetchComplianceData}
                setIstableLoading={setIstableLoading}
                canCreate={permissions.canCreate}
            />
        </AdaptableCard>
    );
}

export default RecommendedList;