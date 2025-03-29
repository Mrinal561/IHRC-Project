
import React, { useCallback, useEffect, useState } from 'react';
import AdaptableCard from '@/components/shared/AdaptableCard';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { Loading } from '@/components/shared';
import NoticeTrackerTable from './components/SandETrackerTable';
import SandETrackerTool from './components/SandETrackerTool';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAuthUser } from '@/store/slices/login';
import { Notification, toast } from '@/components/ui';
import { FilterProvider } from './components/FilterContext';

const FINANCIAL_YEAR_KEY = 'selectedFinancialYear';
const FINANCIAL_YEAR_CHANGE_EVENT = 'financialYearChanged';

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

const SandETracker = () => {
    const [filters, setFilters] = useState({
        groupName: '',
        groupId: '',
        companyName: '',
        companyId: '',
        startDate: '',
        endDate: '',
        status: '',
        noticeType: '',
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
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
    });
    const [isInitialized, setIsInitialized] = useState(false);
    const [permissionCheckComplete, setPermissionCheckComplete] = useState(false);
    const [financialYear, setFinancialYear] = useState(sessionStorage.getItem(FINANCIAL_YEAR_KEY));

    useEffect(() => {
        const handleFinancialYearChange = (event: CustomEvent) => {
            const newFinancialYear = event.detail;
            setFinancialYear(newFinancialYear);
        };

        window.addEventListener(FINANCIAL_YEAR_CHANGE_EVENT, handleFinancialYearChange as EventListener);

        return () => {
            window.removeEventListener(FINANCIAL_YEAR_CHANGE_EVENT, handleFinancialYearChange as EventListener);
        };
    }, []);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const response = await dispatch(fetchAuthUser());

                if (!response.payload?.moduleAccess) {
                    toast.push(
                        <Notification title="Permission" type="error" closable={true}>
                            You don't have access to any modules
                        </Notification>
                    );
                    navigate('/home');
                    setPermissionCheckComplete(true);
                    setIsInitialized(true);
                    return;
                }

                const remittanceModule = response.payload.moduleAccess?.find(
                    (module: any) => module.id === 4
                );

                if (!remittanceModule) {
                    toast.push(
                        <Notification title="Permission" type="error" closable={true}>
                            You don't have access to this module
                        </Notification>
                    );
                    navigate('/home');
                    setPermissionCheckComplete(true);
                    setIsInitialized(true);
                    return;
                }

                const noticeTrackerMenu = remittanceModule.menus?.find(
                    (menu: any) => menu.id === 15
                );

                if (!noticeTrackerMenu) {
                    toast.push(
                        <Notification title="Permission" type="error" closable={true}>
                            You don't have access to this menu
                        </Notification>
                    );
                    navigate('/home');
                    setPermissionCheckComplete(true);
                    setIsInitialized(true);
                    return;
                }

                const newPermissions = getPermissions(noticeTrackerMenu);
                setPermissions(newPermissions);
                setIsInitialized(true);

                if (!newPermissions.canList) {
                    toast.push(
                        <Notification title="Permission" type="error" closable={true}>
                            You don't have permission to access Notice Tracker
                        </Notification>
                    );
                    navigate('/home');
                }
                setPermissionCheckComplete(true);
            } catch (error) {
                console.error('Error fetching auth user:', error);
                setIsInitialized(true);
                setPermissionCheckComplete(true);
            }
        };

        if (!isInitialized) {
            initializeAuth();
        }
    }, [dispatch, isInitialized, navigate]);

    const fetchNoticeTrackerData = useCallback(
        async (page: number, pageSize: number) => {
            setIsLoading(true);
            try {
                const params: any = {
                    page,
                    page_size: pageSize,
                    'group_id[]': filters.groupId, // Always include groupId
                    'company_id[]': filters.companyId, // Always include companyId
                    from_date: filters.startDate, // Always include startDate
                    to_date: filters.endDate, // Always include endDate
                    status: filters.status, // Always include status
                    notice_type: filters.noticeType, // Always include noticeType
                };

                if (financialYear) {
                    params['financial_year'] = financialYear; // Include financialYear if available
                }

                const res = await httpClient.get(endpoints.noticeTracker.list(), {
                    params,
                });

                setData(res.data.data);
                setPagination((prev) => ({
                    ...prev,
                    total: res.data.paginate_data.totalResults,
                }));
            } catch (error) {
               throw error
            } finally {
                setIsLoading(false);
            }
        },
        [filters.groupId, filters.companyId, filters.startDate, filters.endDate, financialYear, filters.status, filters.noticeType, filters]
    );

    useEffect(() => {
        fetchNoticeTrackerData(pagination.pageIndex, pagination.pageSize);
    }, [
        filters.groupId,
        filters.companyId,
        filters.startDate,
        filters.endDate,
        filters.status,
        filters.noticeType,
        pagination.pageIndex,
        pagination.pageSize,
        fetchNoticeTrackerData,
    ]);

    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
        setPagination((prev) => ({
            ...prev,
            pageIndex: 1,
        }));
    };

    const handlePaginationChange = (page: number) => {
        setPagination((prev) => ({ ...prev, pageIndex: page }));
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPagination((prev) => ({
            ...prev,
            pageSize: newPageSize,
            pageIndex: 1,
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
        // <FilterProvider>

        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="flex flex-wrap gap-6 items-center justify-between mb-6">
                <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold">Notice Tracker</h3>
                </div>
                <SandETrackerTool
                    onFilterChange={handleFilterChange}
                    onRefresh={() => fetchNoticeTrackerData(pagination.pageIndex, pagination.pageSize)}
                    canCreate={permissions.canCreate}
                    />
            </div>
            <NoticeTrackerTable
                loading={isLoading}
                companyName={filters.companyName}
                data={data}
                onRefresh={() => fetchNoticeTrackerData(pagination.pageIndex, pagination.pageSize)}
                pagination={pagination}
                onPaginationChange={handlePaginationChange}
                onPageSizeChange={handlePageSizeChange}
                canCreate={permissions.canCreate}
                canEdit={permissions.canEdit}
                canDelete={permissions.canDelete}
                />
        </AdaptableCard>
                // </FilterProvider>
    );
};

export default SandETracker;