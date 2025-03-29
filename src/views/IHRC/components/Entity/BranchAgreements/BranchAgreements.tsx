import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { AdaptableCard } from '@/components/shared'
import BranchAgreementTool from './components/BranchAgreementTool'
import BranchAgreementTable from './components/BranchAgreementTable'
import Loading from '@/components/shared/Loading'
import { Notification, toast } from '@/components/ui'
import { fetchAuthUser } from '@/store/slices/login'

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


const BranchAgreements: React.FC = () => {
    const location = useLocation();
    const { branchId } = location.state || {};
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [isInitialized, setIsInitialized] = useState(false)
    const [permissionCheckComplete, setPermissionCheckComplete] = useState(false)
    const [permissions, setPermissions] = useState<Permissions>({
        canList: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
    })

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
                
                // Find Branch module (module.id = 8)
                const branchModule = response.payload.moduleAccess?.find(
                    (module: any) => module.id === 2
                )
                
                if (!branchModule) {
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

                // Find Branch Agreements menu item (menu.id = 29)
                const branchAgreementsMenu = branchModule.menus?.find(
                    (menu: any) => menu.id === 8
                )

                if (!branchAgreementsMenu) {
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
                const newPermissions = getPermissions(branchAgreementsMenu)
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
                            You don't have permission to view Branch Agreements
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
    }, [dispatch, isInitialized, navigate])

    // Show loading while initializing
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
        <AdaptableCard className='h-full' bodyClass='h-full'>
            <div className="flex flex-col justify-between gap-8 mb-2">
                <div className="mb-4 lg:mb-0 flex justify-between">
                    <h3 className='text-2xl font-bold'>Agreement</h3>
                    <div className='flex-shrink-0'>
                        <BranchAgreementTool canCreate={permissions.canCreate} />
                    </div>
                </div>
            </div>
            <div>
                <BranchAgreementTable 
                    canEdit={permissions.canEdit}
                    canDelete={permissions.canDelete}
                />
            </div>
        </AdaptableCard>
    )
}

export default BranchAgreements