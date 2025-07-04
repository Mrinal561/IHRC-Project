

import React, { useCallback, useEffect, useState, useRef } from 'react';
import AdaptableCard from '@/components/shared/AdaptableCard';
import ESITrackerTable from './components/ESITrackerTable';
import ESITrackerTool from './components/ESITrackerTool';
import { esiChallanData } from '@/@types/esiTracker';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Notification, toast } from '@/components/ui'
import { fetchAuthUser } from '@/store/slices/login';
import { Loading } from '@/components/shared';

const FINANCIAL_YEAR_KEY = 'selectedFinancialYear'
const FINANCIAL_YEAR_CHANGE_EVENT = 'financialYearChanged';

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



const ESITracker: React.FC = () => {
    const [filters, setFilters] = useState({
        groupName: '',
        groupId: '',
        companyName: '',
        companyId: '',
        esiCode: '',
        startDate:'',
        endDate:'',
        // search:''
        location_name: ''
    });

    // Use a ref to store the latest filters
    const filtersRef = useRef(filters);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [data, setData] = useState<esiChallanData[]>([]);
    const [financialYear, setFinancialYear] = useState(sessionStorage.getItem(FINANCIAL_YEAR_KEY));
    const [isLoading, setIsLoading] = useState(false);
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
    })
    const [isInitialized, setIsInitialized] = useState(false)
    const [permissionCheckComplete, setPermissionCheckComplete] = useState(false)


    useEffect(() => {
        // console.log(filters)
        // Handler for the custom event
        const handleFinancialYearChange = (event: CustomEvent) => {
            const newFinancialYear = event.detail;
            setFinancialYear(newFinancialYear);
        };

        // Add event listener for our custom event
        window.addEventListener(
            FINANCIAL_YEAR_CHANGE_EVENT, 
            handleFinancialYearChange as EventListener
        );

        // Cleanup
        return () => {
            window.removeEventListener(
                FINANCIAL_YEAR_CHANGE_EVENT, 
                handleFinancialYearChange as EventListener
            );
        };
    }, []);
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const response = await dispatch(fetchAuthUser())

                if (!response.payload?.moduleAccess) {
                    toast.push(
                        <Notification
                            title="Permission"
                            type="error"
                            closable={true}
                        >
                            You don't have access to any modules
                        </Notification>
                    )
                    navigate('/home')
                    setPermissionCheckComplete(true)
                    setIsInitialized(true)
                    return
                }
                
                
                // Find Remittance Tracker module
                const remittanceModule = response.payload.moduleAccess?.find(
                    (module: any) => module.id === 3
                )
                
                if (!remittanceModule) {
                    toast.push(
                        <Notification
                            title="Permission"
                            type="error"
                            closable={true}
                        >
                            You don't have access to this module
                        </Notification>
                    )
                    navigate('/home')
                    setPermissionCheckComplete(true)
                    setIsInitialized(true)
                    return
                }

                // Find PF Tracker menu item
                const pfTrackerMenu = remittanceModule.menus?.find(
                    (menu: any) => menu.id === 11
                )

                if (!pfTrackerMenu) {
                    toast.push(
                        <Notification
                            title="Permission"
                            type="error"
                            closable={true}
                        >
                            You don't have access to this menu
                        </Notification>
                    )
                    navigate('/home')
                    setPermissionCheckComplete(true)
                    setIsInitialized(true)
                    return
                }

                // Get and set permissions only once
                const newPermissions = getPermissions(pfTrackerMenu)
                setPermissions(newPermissions)
                setIsInitialized(true)
                
                // If no list permission, show notification and redirect
                if (!newPermissions.canList) {
                    toast.push(
                        <Notification
                            title="Permission"
                            type="error"
                            closable={true}
                        >
                            You don't have permission of ESI Tracker
                        </Notification>
                    )
                    navigate('/home')
                }
                setPermissionCheckComplete(true)

            } catch (error) {
                console.error('Error fetching auth user:', error)
                setIsInitialized(true)
                setPermissionCheckComplete(true)
            }
        }

        if (!isInitialized) {
            initializeAuth()
        }
    }, [dispatch, isInitialized,navigate])

    // Update the ref whenever filters change
    useEffect(() => {
        // console.log(filters)
        filtersRef.current = filters;
    }, [filters]);

    const fetchEsiTrackerData = useCallback(
        async (page: number, pageSize: number) => {
            setIsLoading(true);
            try {
                // Use the ref to get the most recent filters
                const currentFilters = filtersRef.current;

                const params: any = {
                    page,
                    page_size: pageSize,
                    'group_id[]': currentFilters.groupId || '',
                    'company_id[]': currentFilters.companyId || '',
                    'from_date': filters.startDate,
                    'to_date': filters.endDate,
                    // 'search' : filters.search,
                    'location_name': filters.location_name
                };

                // Only add esi_code[] to params if it's selected
                if (currentFilters.esiCode) {
                    params['esi_code[]'] = currentFilters.esiCode;
                }
                if (financialYear) {
                    params['financial_year'] = financialYear
                }

                const res = await httpClient.get(endpoints.esiTracker.getAll(), {
                    params
                });
                
                console.log('Fetched Data:', res.data.data);
                console.log('Current Filters:', currentFilters);

                setData(res.data.data);
                setPagination((prev) => ({
                    ...prev,
                    total: res.data.paginate_data.totalResults,
                }));
            } catch (error) {
                console.error('Error fetching ESI tracker data:', error);
            } finally {
                setIsLoading(false);
            }
        },
         [filters.groupId, filters.companyId, filters.esiCode, filters.startDate,filters.endDate, financialYear, filters.location_name]// Remove dependencies to prevent unnecessary re-creations
    );

    useEffect(() => {
        fetchEsiTrackerData(pagination.pageIndex, pagination.pageSize);
    }, [fetchEsiTrackerData, pagination.pageIndex, pagination.pageSize,filters]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        console.log(filters)
        // Reset pagination to first page when filters change
        setPagination((prev) => ({
            ...prev,
            pageIndex: 1,
        }));
    };

    const refreshEsiTrackerData = useCallback(() => {
        // Use the ref to get the most recent filters
        const currentFilters = filtersRef.current;

        const params: any = {
            page: 1,
            page_size: 10,
            'group_id[]': currentFilters.groupId || '',
            'company_id[]': currentFilters.companyId || '',
        };

        // Only add esi_code[] to params if it's selected
        if (currentFilters.esiCode) {
            params['esi_code[]'] = currentFilters.esiCode;
        }

        if (financialYear) {
        params['financial_year'] = financialYear;
    }

        setIsLoading(true);
        httpClient.get(endpoints.esiTracker.getAll(), {
            params
        }).then(res => {
            console.log('Refresh Data:', res.data.data);
            console.log('Refresh Filters:', currentFilters);

            setData(res.data.data);
            setPagination((prev) => ({
                ...prev,
                total: res.data.paginate_data.totalResults,
                pageIndex: 1,
                pageSize: 10
            }));
        }).catch(error => {
            console.error('Error refreshing ESI tracker data:', error);
        }).finally(() => {
            setIsLoading(false);
        });
    }, [financialYear]); // No dependencies needed

    const handlePaginationChange = (page: number) => {
        setPagination((prev) => ({ ...prev, pageIndex: page }));
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPagination((prev) => ({
            ...prev,
            pageSize: newPageSize,
            pageIndex: 1, // Reset to first page when changing page size
        }));
    };

    if (!isInitialized || !permissionCheckComplete) {
        return (
            <Loading loading={true} type="default">
                <div className="h-full" />
            </Loading>
        )
    }

    // Only render if we have list permission
    if (!permissions.canList) {
        return null
    }

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="flex flex-wrap gap-6 items-center justify-between mb-6">
                <div className="">
                    <h3 className="text-2xl font-bold">ESI Tracker</h3>
                </div>
                <ESITrackerTool onFilterChange={handleFilterChange} canCreate={permissions.canCreate} />
            </div>
            <ESITrackerTable
                loading={isLoading}
                dataSent={data}
                companyName={filters.companyName} 
                code={filters.esiCode}
                onRefresh={refreshEsiTrackerData}
                pagination={pagination}
                onPaginationChange={handlePaginationChange}
                onPageSizeChange={handlePageSizeChange}
                canEdit={permissions.canEdit}
                canDelete={permissions.canDelete}
            />
        </AdaptableCard>
    );
}

export default ESITracker;