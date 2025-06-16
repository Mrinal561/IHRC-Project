

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui';
import { Notification } from '@/components/ui';
import AdaptableCard from '@/components/shared/AdaptableCard';
import DueComplianceTableTool from './components/DueComplianceTableTool';
import DueComplianceTable, { DueComplianceDetailData } from './components/DueComplianceTable';
import { endpoints } from '@/api/endpoint';
import httpClient from '@/api/http-client';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchAuthUser } from '@/store/slices/login';
import { Loading } from '@/components/shared';

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


  const dummyDueComplianceData: DueComplianceDetailData[] = [
      {
        id: 1,
        uuid: 'comp-001',
        ac_compliance_id: 101,
        proof_document: 'https://example.com/proof1.pdf',
        status: 'pending',
        compliance_detail: {
          id: 101,
          uuid: 'detail-001',
          legislation: 'Environmental Protection Act 2020',
          category: 'Environmental',
          penalty_type: 'Monetary Fine',
          default_due_date: {
            first_date: '2023-12-31',
            last_date: '2023-12-31'
          },
          scheduled_frequency: 'yearly',
          proof_mandatory: true,
          header: 'Annual Environmental Compliance Report',
          description: 'Submission of annual environmental impact assessment report',
          penalty_description: 'Fine up to $50,000 for non-compliance',
          applicability: 'All manufacturing units',
          bare_act_text: 'Section 12(3) of the Environmental Protection Act',
          type: 'Annual Filing',
          clause: '12.3',
          frequency: 'Annual',
          statutory_auth: 'Ministry of Environment',
          approval_required: true,
          criticality: 'high',
          created_type: 'system',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        upload_date: '2023-12-15',
        first_due_date: '2023-12-31',
        due_date: '2023-12-31',
        data_status: 'pending',
        uploaded_by: 201,
        approved_by: 301,
        created_by: 1,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-12-15T00:00:00Z',
        UploadBy: {
          id: 201,
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          mobile: 9876543210
        },
        ApprovedBy: {
          id: 301,
          name: 'Jane Smith'
        },
        AssignedComplianceRemark: [
          {
            id: 1,
            remark: 'Initial submission pending review',
            created_by: 1,
            created_at: '2023-12-01T00:00:00Z',
            updated_at: '2023-12-01T00:00:00Z'
          }
        ]
      },
      {
        id: 2,
        uuid: 'comp-002',
        ac_compliance_id: 102,
        proof_document: null,
        status: 'due',
        compliance_detail: {
          id: 102,
          uuid: 'detail-002',
          legislation: 'Labor Standards Act',
          category: 'Employment',
          penalty_type: 'Administrative Penalty',
          default_due_date: {
            first_date: '2023-06-30',
            last_date: '2023-06-30'
          },
          scheduled_frequency: 'quarterly',
          proof_mandatory: false,
          header: 'Quarterly Employee Benefits Report',
          description: 'Submission of quarterly report on employee benefits',
          penalty_description: 'Warning for first offense, fine thereafter',
          applicability: 'All full-time employees',
          bare_act_text: 'Section 8(2) of the Labor Standards Act',
          type: 'Quarterly Filing',
          clause: '8.2',
          frequency: 'Quarterly',
          statutory_auth: 'Ministry of Labor',
          approval_required: false,
          criticality: 'medium',
          created_type: 'system',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        upload_date: null,
        first_due_date: '2023-06-30',
        due_date: '2023-06-30',
        data_status: 'due',
        uploaded_by: null,
        approved_by: null,
        created_by: 1,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        UploadBy: null,
        ApprovedBy: null,
        AssignedComplianceRemark: []
      },
      {
        id: 3,
        uuid: 'comp-004',
        ac_compliance_id: 104,
        proof_document: null,
        status: 'overdue',
        compliance_detail: {
          id: 104,
          uuid: 'detail-004',
          legislation: 'Health and Safety Regulations',
          category: 'Safety',
          penalty_type: 'Both Fine and Penalty',
          default_due_date: {
            first_date: '2023-01-15',
            last_date: '2023-01-15'
          },
          scheduled_frequency: 'half_yearly',
          proof_mandatory: false,
          header: 'Bi-annual Safety Audit',
          description: 'Submission of workplace safety audit report',
          penalty_description: 'Fine up to $25,000 and possible shutdown',
          applicability: 'All work locations',
          bare_act_text: 'Section 7(4) of the Health and Safety Regulations',
          type: 'Bi-annual Filing',
          clause: '7.4',
          frequency: 'Half-yearly',
          statutory_auth: 'Department of Workplace Safety',
          approval_required: false,
          criticality: 'medium',
          created_type: 'system',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        upload_date: null,
        first_due_date: '2023-01-15',
        due_date: '2023-01-15',
        data_status: 'overdue',
        uploaded_by: null,
        approved_by: null,
        created_by: 1,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        UploadBy: null,
        ApprovedBy: null,
        AssignedComplianceRemark: [
          {
            id: 3,
            remark: 'Overdue - reminder sent',
            created_by: 1,
            created_at: '2023-01-20T00:00:00Z',
            updated_at: '2023-01-20T00:00:00Z'
          }
        ]
      }
    ];


    
const DueCompliance = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
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
})
const [isInitialized, setIsInitialized] = useState(false)
const [permissionCheckComplete, setPermissionCheckComplete] = useState(false)

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
//                 (menu: any) => menu.id === 12
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
//                         You don't have permission of Due List
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




    // const fetchDueComplianceData = useCallback(async (page: number = 1, pageSize: number = 10) => {
    //     console.log('Fetching due compliance data...');
        
    //     setIsLoading(true);
    //     try {
    //         const response = await httpClient.get(endpoints.due.getAll(), {
    //             params: {
    //                 page,
    //                 pageSize:pageSize,
    //                 'data_status[]': ['due']
    //             }
    //         });

    //         if (response?.data?.data) {
    //             console.log('API Response:', response.data);
    //             console.log('Due compliance data received:', response.data.data);
    //             setData(response.data.data);
    //              setPagination((prev) => ({...prev, total: response.data.paginate_data.totalResults }));
    //         } else {
    //             console.log('No data in API response or unexpected response structure');
    //         }
    //     } catch (error: any) {
    //         console.error('Error fetching due compliance data:', error);
    //         console.error('Error details:', {
    //             message: error.message,
    //             stack: error.stack
    //         });
    //         toast.push(
    //             <Notification type="danger" title="Error">
    //                 Failed to fetch due compliance data
    //             </Notification>
    //         );
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }, []);

    useEffect(() => {
        console.log('Initial component mount - Fetching data...');
        // fetchDueComplianceData(pagination.pageIndex, pagination.pageSize);
    }, [, pagination.pageIndex, pagination.pageSize]);

    const handleUploadAll = (selectedComplianceIds, remark) => {
        console.log(`Uploading ${selectedComplianceIds.length} compliances with remark: ${remark}`);
        // Implement API call for bulk upload
    };

    const handleUploadSingle = (complianceId, isProofMandatory, file, remark) => {
        console.log(`Uploading compliance ${complianceId}. Proof mandatory: ${isProofMandatory}. File: ${file?.name}. Remark: ${remark}`);
        // Implement API call for single upload
    };

    const handleUpdateStatus = (complianceId, newStatus) => {
        console.log(`Updating status for compliance ${complianceId} to ${newStatus}`);
        // Implement API call for status update
    };
      const handlePaginationChange = (page: number) => {
    setPagination((prev) => ({...prev, pageIndex: page }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPagination((prev) => ({...prev, pageSize: newPageSize, pageIndex: 1 }));
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
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
                <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold">Due Compliance</h3>
                    <p className="text-gray-600">View your company's due compliance</p>
                </div>
                <div className="flex items-center gap-4">
                    <DueComplianceTableTool data={data} onUploadAll={handleUploadAll} canCreate={permissions.canCreate}/>
                </div>
            </div>
            <DueComplianceTable 
                data={dummyDueComplianceData} 
                loading={isLoading}
                onUploadSingle={handleUploadSingle} 
                onUpdateStatus={handleUpdateStatus} 
                // onDataUpdate={fetchDueComplianceData}
                 pagination={pagination}
        onPaginationChange={handlePaginationChange}
        onPageSizeChange={handlePageSizeChange}
        canCreate={permissions.canCreate}
            />
        </AdaptableCard>
    );
};

export default DueCompliance;