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


import React, { useState } from 'react';
import AdaptableCard from '@/components/shared/AdaptableCard';
import HistoryPageTable from './components/HistoryPageTable';
import Company from '../../Home/components/Company';
import { Button, toast, Notification } from '@/components/ui';
import { HiDownload } from 'react-icons/hi';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

const DueCompliance = () => {
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);


      const handleDownload = async () => {
            try {
                const params = {
                    // company_id: selectedCompany,
                    // state_id: selectedState,
                    // status: 'approved_by_auditor'
                };
    
                const response = await httpClient.get(
                    endpoints.compliance.downloadComplianceHistory(),
                    { 
                        params,
                        responseType: 'blob' // Important for file downloads
                    }
                );
    
                // Create download link
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'compliance_history.xlsx');
                document.body.appendChild(link);
                link.click();
                link.remove();
    
                toast.push(
                    <Notification
                        title="Success"
                        type="success"
                        duration={2500}
                    >
                        Download started successfully
                    </Notification>
                );
            } catch (error) {
                console.error('Error downloading compliance history:', error);
                toast.push(
                    <Notification
                        title="Error"
                        type="danger"
                        duration={2500}
                    >
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
                     onClick={() => handleDownload()}
                >
                    Download
                </Button>
            </div>

            {/* Pass filters to the Company component */}
            <div className="mb-4">
                <Company 
                    onCompanyChange={(company) => setSelectedCompany(company?.value || null)}
                    onStateChange={(state) => setSelectedState(state?.value || null)}
                    onBranchChange={(branch) => setSelectedBranch(branch?.value || null)}
                />
            </div>

            {/* Pass filters to the HistoryPageTable */}
            <HistoryPageTable 
                selectedCompany={selectedCompany}
                selectedState={selectedState}
                selectedBranch={selectedBranch}
            />
        </AdaptableCard>
    );
};

export default DueCompliance;