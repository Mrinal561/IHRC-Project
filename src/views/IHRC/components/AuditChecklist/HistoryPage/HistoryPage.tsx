// import React, { useEffect, useState } from 'react'
// import  AdaptableCard from '@/components/shared/AdaptableCard';
// import HistoryPageTableTool from './components/HistoryPageTableTool';
// import HistoryPageTable from './components/HistoryPageTable';
// import Company from '../../Home/components/Company';
// import { Button, Dialog, toast, Notification, Dropdown } from '@/components/ui'
// import { fetchAuthUser } from '@/store/slices/login';
// import { Loading } from '@/components/shared';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { HiDownload } from 'react-icons/hi';


// interface Permissions {
//   canList: boolean;
//   canCreate: boolean;
//   canEdit: boolean;
//   canDelete: boolean;
// }
// const getPermissions = (menuItem: any): Permissions => {
//   const permissionsObject = menuItem?.permissions || menuItem?.access || {}
//   return {
//       canList: !!permissionsObject.can_list,
//       canCreate: !!permissionsObject.can_create,
//       canEdit: !!permissionsObject.can_edit,
//       canDelete: !!permissionsObject.can_delete,
//   }
// }
// const DueCompliance = () => {
//   const navigate = useNavigate()
//   const dispatch = useDispatch();
//   const [permissions, setPermissions] = useState<Permissions>({
//     canList: false,
//     canCreate: false,
//     canEdit: false,
//     canDelete: false,
// })
// const [isInitialized, setIsInitialized] = useState(false)
// const [permissionCheckComplete, setPermissionCheckComplete] = useState(false)

// //permission check section 
// // useEffect(() => {
// //     const initializeAuth = async () => {
// //         try {
// //             const response = await dispatch(fetchAuthUser())

// //             if (!response.payload?.moduleAccess) {
// //                 toast.push(
// //                     <Notification
// //                         title="Permission"
// //                         type="danger"
// //                     >
// //                         You don't have access to any modules
// //                     </Notification>
// //                 )
// //                 navigate('/home')
// //                 setPermissionCheckComplete(true)
// //                 setIsInitialized(true)
// //                 return
// //             }
            
            
// //             // Find Remittance Tracker module
// //             const remittanceModule = response.payload.moduleAccess?.find(
// //                 (module: any) => module.id === 2
// //             )
            
// //             if (!remittanceModule) {
// //                 toast.push(
// //                     <Notification
// //                         title="Permission"
// //                         type="danger"
// //                     >
// //                         You don't have access to this module
// //                     </Notification>
// //                 )
// //                 navigate('/home')
// //                 setPermissionCheckComplete(true)
// //                 setIsInitialized(true)
// //                 return
// //             }

// //             // Find PF Tracker menu item
// //             const recommendedMenu = remittanceModule.menus?.find(
// //                 (menu: any) => menu.id === 15
// //             )

// //             if (!recommendedMenu) {
// //                 toast.push(
// //                     <Notification
// //                         title="Permission"
// //                         type="danger"
// //                     >
// //                         You don't have access to this menu
// //                     </Notification>
// //                 )
// //                 navigate('/home')
// //                 setPermissionCheckComplete(true)
// //                 setIsInitialized(true)
// //                 return
// //             }

// //             // Get and set permissions only once
// //             const newPermissions = getPermissions(recommendedMenu)
// //             setPermissions(newPermissions)
// //             setIsInitialized(true)
            
// //             // If no list permission, show notification and redirect
// //             if (!newPermissions.canList) {
// //                 toast.push(
// //                     <Notification
// //                         title="Permission"
// //                         type="danger"
// //                     >
// //                         You don't have permission of History
// //                     </Notification>
// //                 )
// //                 navigate('/home')
// //             }
// //             setPermissionCheckComplete(true)

// //         } catch (error) {
// //             console.error('Error fetching auth user:', error)
// //             setIsInitialized(true)
// //             setPermissionCheckComplete(true)
// //         }
// //     }

// //     if (!isInitialized) {
// //         initializeAuth()
// //     }
// // }, [dispatch, isInitialized, navigate])

// // if (!isInitialized || !permissionCheckComplete) {
// //   return (
// //       <Loading loading={true} type="default">
// //           <div className="h-full" />
// //       </Loading>
// //   )
// // }

// // // Only render if we have list permission
// // if (!permissions.canList) {
// //   return null
// // }
//   return (
//     <AdaptableCard className="h-full" bodyClass="h-full">
           
//             <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
//                 <div className="mb-4 lg:mb-0">
//                     <h3 className="text-2xl font-bold">Compliance History</h3>
//                     <p className="text-gray-600">View your company's compliance history</p>
//                 </div>
//                 <Button
// size='sm'
// icon={<HiDownload />}
// variant='solid'
// >Download</Button>

// </div>
         
//                 <HistoryPageTable />
//         </AdaptableCard>
//   )
// }

// export default DueCompliance










// import React, { useState } from 'react';
// import AdaptableCard from '@/components/shared/AdaptableCard';
// import HistoryPageTable from './components/HistoryPageTable';
// import Company from './components/Company';
// import { Button, toast, Notification } from '@/components/ui';
// import { HiDownload } from 'react-icons/hi';
// import httpClient from '@/api/http-client';
// import { endpoints } from '@/api/endpoint';

// const DueCompliance = () => {
//     const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
//     const [selectedState, setSelectedState] = useState<string | null>(null);
//     const [selectedBranch, setSelectedBranch] = useState<string | null>(null);


//       const handleDownload = async () => {
//             try {
//                 const params = {
//                     // company_id: selectedCompany,
//                     // state_id: selectedState,
//                     // status: 'approved_by_auditor'
//                 };
    
//                 const response = await httpClient.get(
//                     endpoints.compliance.downloadComplianceHistory(),
//                     { 
//                         params,
//                         responseType: 'blob' // Important for file downloads
//                     }
//                 );
    
//                 // Create download link
//                 const url = window.URL.createObjectURL(new Blob([response.data]));
//                 const link = document.createElement('a');
//                 link.href = url;
//                 link.setAttribute('download', 'compliance_history.xlsx');
//                 document.body.appendChild(link);
//                 link.click();
//                 link.remove();
    
//                 toast.push(
//                     <Notification
//                         title="Success"
//                         type="success"
//                         duration={2500}
//                     >
//                         Download started successfully
//                     </Notification>
//                 );
//             } catch (error) {
//                 console.error('Error downloading compliance history:', error);
//                 toast.push(
//                     <Notification
//                         title="Error"
//                         type="danger"
//                         duration={2500}
//                     >
//                         Failed to download compliance history
//                     </Notification>
//                 );
//             }
//         };
    


//     return (
//         <AdaptableCard className="h-full" bodyClass="h-full">
//             <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
//                 <div className="mb-4 lg:mb-0">
//                     <h3 className="text-2xl font-bold">Compliance History</h3>
//                     <p className="text-gray-600">View your company's compliance history</p>
//                 </div>
//                 <Button
//                     size="sm"
//                     icon={<HiDownload />}
//                     variant="solid"
//                      onClick={() => handleDownload()}
//                 >
//                     Download
//                 </Button>
//             </div>

//             {/* Pass filters to the Company component */}
//             <div className="mb-4">
//                 <Company 
//                     onCompanyChange={(company) => setSelectedCompany(company?.value || null)}
//                     onStateChange={(state) => setSelectedState(state?.value || null)}
//                     onBranchChange={(branch) => setSelectedBranch(branch?.value || null)}
//                 />
//             </div>

//             {/* Pass filters to the HistoryPageTable */}
//             <HistoryPageTable 
//                 selectedCompany={selectedCompany}
//                 selectedState={selectedState}
//                 selectedBranch={selectedBranch}
//             />
//         </AdaptableCard>
//     );
// };

// export default DueCompliance;




import React, { useState, useEffect } from 'react';
import AdaptableCard from '@/components/shared/AdaptableCard';
import HistoryPageTable from './components/HistoryPageTable';
import Company from './components/Company';
import { Button, toast, Notification } from '@/components/ui';
import { HiDownload } from 'react-icons/hi';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

const DueCompliance = () => {
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
    const [tableData, setTableData] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sort: { order: '', key: '' },
    });
    const [allData, setAllData] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch all data on component mount
    useEffect(() => {
        fetchAllComplianceHistory();
    }, []);

    // Apply filters whenever filter criteria or data changes
    useEffect(() => {
        applyFilters();
    }, [selectedCompany, selectedState, selectedBranch, allData]);

    const fetchAllComplianceHistory = async () => {
        try {
            setIsLoading(true);
            const { data: response } = await httpClient.get(
                endpoints.compliance.complianceHistoryList(),
                { 
                    params: { 
                        status: 'approved_by_auditor',
                        page_size: 100 // Fetch all records or implement pagination
                    }
                }
            );

            const transformedData = response.data.map((item: any) => ({
                id: item.id,
            uuid: item.uuid,
            record_id: item.id || `COMP-${item.id}`,
            company: item.Company?.name || 'N/A',
            company_id: item.company_id,
            state: item.State?.name || 'N/A',
            state_id: item.state_id,
            branch: item.Branch?.name || 'N/A',
            branch_id: item.branch_id,
            proof_document: item.document, // Changed from proof_document to document
            status: item.status,
            data_status: item.complianceStatus === 'review_complied' ? 'Complied' : 'Pending',
            compliance_detail: {
                id: item.ComplianceChecklist?.id || 0,
                legislation: item.legislation_act || 'N/A',
                header: item.compliance_header || 'N/A',
                description: item.compliance_description || 'N/A',
                category: item.compliance_categorization || 'General',
                criticality: item.criticality || 'Medium'
            },
            AssignedComplianceRemark: [] // Add remarks if available in response
        }));
            setAllData(transformedData);
            setTableData(prev => ({
                ...prev,
                total: response.paginate_data?.totalResults || 0
            }));
        } catch (error) {
            console.error('Error fetching compliance history:', error);
            toast.push(
                <Notification title="Error" type="danger" duration={2500}>
                    Failed to load compliance history
                </Notification>
            );
        } finally {
            setIsLoading(false);
        }
    };

    const applyFilters = () => {
        let result = [...allData];

        if (selectedCompany) {
            result = result.filter(item => 
                String(item.company_id) === selectedCompany
            );
        }

        if (selectedState) {
            result = result.filter(item => 
                String(item.state_id) === selectedState
            );
        }

        if (selectedBranch) {
            result = result.filter(item => 
                String(item.branch_id) === selectedBranch
            );
        }

         if (tableData.sort.key && tableData.sort.order) {
        result.sort((a, b) => {
            const key = tableData.sort.key as keyof typeof a;
            if (a[key] < b[key]) return tableData.sort.order === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return tableData.sort.order === 'asc' ? 1 : -1;
            return 0;
        });
    }

       const startIndex = (tableData.pageIndex - 1) * tableData.pageSize;
    const paginatedData = result.slice(startIndex, startIndex + tableData.pageSize);

    setFilteredData(paginatedData);
    setTableData(prev => ({
        ...prev,
        total: result.length
    }));
    };

    const handleDownload = async () => {
        try {
            // Use filteredData for download
            const dataToExport = filteredData.length > 0 ? filteredData : allData;
            
            // Implement your download logic here
            // This is a simplified example - you might need to adjust
            const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'compliance_history.json');
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.push(
                <Notification title="Success" type="success" duration={2500}>
                    Download started successfully
                </Notification>
            );
        } catch (error) {
            console.error('Error downloading compliance history:', error);
            toast.push(
                <Notification title="Error" type="danger" duration={2500}>
                    Failed to download compliance history
                </Notification>
            );
        }
    };

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
                <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold">Compliance History</h3>
                    <p className="text-gray-600">View your company's compliance history</p>
                </div>
                <Button
                    size="sm"
                    icon={<HiDownload />}
                    variant="solid"
                    onClick={handleDownload}
                >
                    Download
                </Button>
            </div>

            <div className="mb-4">
                <Company 
                    onCompanyChange={(company) => setSelectedCompany(company?.value || null)}
                    onStateChange={(state) => setSelectedState(state?.value || null)}
                    onBranchChange={(branch) => setSelectedBranch(branch?.value || null)}
                />
            </div>

            <HistoryPageTable 
                data={filteredData}
                isLoading={isLoading}
                tableData={tableData}
                onTableDataChange={setTableData}
            />
        </AdaptableCard>
    );
};

export default DueCompliance;