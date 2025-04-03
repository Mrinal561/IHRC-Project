import React, { useEffect, useState } from 'react'
import  AdaptableCard from '@/components/shared/AdaptableCard';
import HistoryPageTableTool from './components/HistoryPageTableTool';
import HistoryPageTable from './components/HistoryPageTable';
import Company from '../../Home/components/Company';
import { Button, Dialog, toast, Notification, Dropdown } from '@/components/ui'
import { fetchAuthUser } from '@/store/slices/login';
import { Loading } from '@/components/shared';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';


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
const DueCompliance = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
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
//                 (menu: any) => menu.id === 15
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
//                         You don't have permission of History
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

// if (!isInitialized || !permissionCheckComplete) {
//   return (
//       <Loading loading={true} type="default">
//           <div className="h-full" />
//       </Loading>
//   )
// }

// // Only render if we have list permission
// if (!permissions.canList) {
//   return null
// }
  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
            {/* <div className="flex items-center justify-between mb-8">
                <h3 className="mb-4 lg:mb-0">Compliance History</h3>
                <HistoryPageTableTool />
            </div> */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
                <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold">Compliance History</h3>
                    <p className="text-gray-600">View your company's compliance history</p>
                </div>
                <HistoryPageTableTool />
      </div>
      {/* <div className='mb-8'>
        <Company />
      </div> */}
                <HistoryPageTable />
        </AdaptableCard>
  )
}

export default DueCompliance