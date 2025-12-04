import React, { useEffect } from 'react'
import classNames from 'classnames'
import ScrollBar from '@/components/ui/ScrollBar'
import { HiClock, HiUserCircle, HiMap } from 'react-icons/hi'
import {
    SIDE_NAV_WIDTH,
    SIDE_NAV_COLLAPSED_WIDTH,
    NAV_MODE_DARK,
    NAV_MODE_THEMED,
    NAV_MODE_TRANSPARENT,
    SIDE_NAV_CONTENT_GUTTER,
    LOGO_X_GUTTER,
} from '@/constants/theme.constant'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'
import Logo from '@/components/template/Logo'
import navigationConfig from '@/configs/navigation.config'
import VerticalMenuContent from '@/components/template/VerticalMenuContent'
import useResponsive from '@/utils/hooks/useResponsive'
import { useAppSelector } from '@/store'
import { HiMapPin } from 'react-icons/hi2'
import store from '../../store'

const sideNavStyle = {
    width: SIDE_NAV_WIDTH,
    minWidth: SIDE_NAV_WIDTH,
}

const sideNavCollapseStyle = {
    width: SIDE_NAV_COLLAPSED_WIDTH,
    minWidth: SIDE_NAV_COLLAPSED_WIDTH,
}

const adminnav: NavigationTree[] = [
    {
        key: 'home',
        path: '/dashboard',
        title: 'Dashboard',
        translateKey: 'nav.home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'groupMenu.collapse',
        path: '',
        title: 'Global Settings',
        translateKey: 'nav.groupMenu.collapse.collapse',
        icon: 'globeCollapse',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'groupMenu.collapse.item2',
                path: '/global-notification',
                title: 'Notification Settings',
                translateKey: 'nav.groupMenu.collapse.item2',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'groupMenu.collapse.item7',
                path: '/Edit-permission',
                title: 'Remittance Edit Permission',
                translateKey: 'nav.groupMenu.collapse.item7',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
    {
        key: 'companySetup.collapse',
        path: '',
        title: 'Company Setup',
        translateKey: 'nav.companySetup.companySetup',
        icon: 'buildingCollapse',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'entitySetup.collapse',
                path: '',
                title: 'Entity Setup',
                translateKey: 'nav.entitySetup.collapse',
                icon: 'buildingOffice',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
                    {
                        key: 'entitySetup.collapse.companyGroup',
                        path: '/company-group',
                        title: 'Company Group',
                        translateKey: 'nav.entitySetup.collapse.companyGroup',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                    {
                        key: 'entitySetup.collapse.company',
                        path: '/company-name',
                        title: 'Company',
                        translateKey: 'nav.entitySetup.collapse.company',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                    {
                        key: 'entitySetup.collapse.branch',
                        path: '/branch',
                        title: 'Branch',
                        translateKey: 'nav.entitySetup.collapse.branch',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                    {
                        key: 'entitySetup.collapse.branchagreement',
                        path: '/agreements',
                        title: 'Agreement',
                        translateKey:
                            'nav.entitySetup.collapse.branchagreement',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                ],
            },
            {
                key: 'userSetup.collapse',
                path: '',
                title: 'User Setup',
                translateKey: 'nav.userSetup.collapse',
                icon: '',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
                    {
                        key: 'userSetup.collapse.role',
                        path: '/role',
                        title: 'Designation',
                        translateKey: 'nav.userSetup.collapse.role',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                    {
                        key: 'userSetup.collapse.user',
                        path: '/user-entity',
                        title: 'User',
                        translateKey: 'nav.userSetup.collapse.user',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                ],
            },
            {
                key: 'auditorSetup.collapse',
                path: '',
                title: 'Auditor Setup',
                translateKey: 'nav.auditorSetup.collapse',
                icon: '',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
                    {
                        key: 'auditorSetup.collapse.auditor',
                        path: '/auditor-entity',
                        title: 'Auditor',
                        translateKey: 'nav.auditorSetup.collapse.auditor',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                ],
            },
        ],
    },
    {
        key: 'remittanceTracker.collapse',
        path: '/remittanceTracker',
        title: 'Remittance Tracker',
        translateKey: 'nav.remittanceTracker.collapse.collapse',
        icon: 'remittanceCollapse',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'remittanceTracker.collapse.item1',
                path: '/pf-tracker',
                title: 'PF Tracker',
                translateKey: 'nav.remittanceTracker.collapse.item1',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'remittanceTracker.collapse.item6',
                path: '/pfiw-tracker',
                title: 'PFIW Tracker',
                translateKey: 'nav.remittanceTracker.collapse.item6',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'remittanceTracker.collapse.item2',
                path: '/esi-tracker',
                title: 'ESI Tracker',
                translateKey: 'nav.remittanceTracker.collapse.item2',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'remittanceTracker.collapse.item3',
                path: '/lwf-tracker',
                title: 'LWF Tracker',
                translateKey: 'nav.remittanceTracker.collapse.item3',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'remittanceTracker.collapse.item4',
                path: '/ptrc-tracker',
                title: 'PT RC Tracker',
                translateKey: 'nav.remittanceTracker.collapse.item4',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'remittanceTracker.collapse.item5',
                path: '/ptec-tracker',
                title: 'PT EC Tracker',
                translateKey: 'nav.remittanceTracker.collapse.item5',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
    {
        key: 'notice',
        path: '/notice-tracker',
        title: 'Notice Tracker',
        translateKey: 'nav.notice',
        icon: 'remittanceCollapse',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'returnTraccker',
        path: '/return-tracker',
        title: 'Return Tracker',
        translateKey: 'nav.return',
        icon: 'remittanceCollapse',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'posh.collapse',
        path: '/poshTracker',
        title: 'POSH',
        translateKey: 'nav.poshTracker.collapse.collapse',
        icon: 'remittanceCollapse',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'poshTracker.collapse.item3',
                path: '/policy',
                title: 'POSH Policy',
                translateKey: 'nav.poshTracker.collapse.item3',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },

            {
                key: 'poshTracker.collapse.item2',
                path: '/committee',
                title: 'POSH Committee',
                translateKey: 'nav.poshTracker.collapse.item2',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'poshTracker.collapse.item1',
                path: '/posh',
                title: 'POSH Return',
                translateKey: 'nav.poshTracker.collapse.item1',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
    {
        key: 'collapseMenu.collapse',
        path: '',
        title: 'Audit Tracker',
        translateKey: 'nav.collapseMenu.collapseMenu.collapse',
        icon: 'auditCollapse',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'status.item1',
                path: '/status',
                title: 'Status',
                translateKey: 'nav.collapseMenu.collapse.item6',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'customChecklist.item2',
                path: '/custom-checklist',
                title: 'Custom Checklist',
                translateKey: 'nav.collapseMenu.collapse.item4',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'recommendedList.item3',
                path: '/compliance-checklist',
                title: 'Compliance Checklist',
                translateKey: 'nav.collapseMenu.collapse.item1',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'dueCompliance.item4',
                path: '/due-compliance',
                title: 'Due Compliance',
                translateKey: 'nav.collapseMenu.collapse.item5',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },

            {
                key: 'complianceCertificate.item5',
                path: '/compliance-certificate',
                title: 'Certificate',
                translateKey: 'nav.collapseMenu.collapse.item7',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'history.item6',
                path: '/history',
                title: 'History',
                translateKey: 'nav.collapseMenu.item8',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
    {
        key: 'register',
        path: '/register',
        title: 'Register',
        translateKey: 'nav.register',
        icon: 'remittanceCollapse',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
]

const usernav: NavigationTree[] = [
    {
        key: 'home',
        path: '/dashboard',
        title: 'Dashboard',
        translateKey: 'nav.home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'agreement',
        path: '/agreements',
        title: 'Agreement',
        translateKey: 'nav.agreement',
        icon: 'remittanceCollapse',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'remittanceTracker.collapse',
        path: '/remittanceTracker',
        title: 'Remittance Tracker',
        translateKey: 'nav.remittanceTracker.collapse.collapse',
        icon: 'remittanceCollapse',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'remittanceTracker.collapse.item1',
                path: '/pf-tracker',
                title: 'PF Tracker',
                translateKey: 'nav.remittanceTracker.collapse.item1',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'remittanceTracker.collapse.item6',
                path: '/pfiw-tracker',
                title: 'PFIW Tracker',
                translateKey: 'nav.remittanceTracker.collapse.item6',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'remittanceTracker.collapse.item2',
                path: '/esi-tracker',
                title: 'ESI Tracker',
                translateKey: 'nav.remittanceTracker.collapse.item2',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'remittanceTracker.collapse.item3',
                path: '/lwf-tracker',
                title: 'LWF Tracker',
                translateKey: 'nav.remittanceTracker.collapse.item3',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'remittanceTracker.collapse.item4',
                path: '/ptrc-tracker',
                title: 'PT RC Tracker',
                translateKey: 'nav.remittanceTracker.collapse.item4',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'remittanceTracker.collapse.item5',
                path: '/ptec-tracker',
                title: 'PT EC Tracker',
                translateKey: 'nav.remittanceTracker.collapse.item5',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
    {
        key: 'notice',
        path: '/notice-tracker',
        title: 'Notice Tracker',
        translateKey: 'nav.notice',
        icon: 'remittanceCollapse',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'returnTraccker',
        path: '/return-tracker',
        title: 'Return Tracker',
        translateKey: 'nav.return',
        icon: 'remittanceCollapse',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'collapseMenu.collapse',
        path: '',
        title: 'Audit Checklist',
        translateKey: 'nav.collapseMenu.collapseMenu.collapse',
        icon: 'auditCollapse',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'status.item1',
                path: '/status',
                title: 'Status',
                translateKey: 'nav.collapseMenu.collapse.item6',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'customChecklist.item2',
                path: '/custom-checklist',
                title: 'Custom Checklist',
                translateKey: 'nav.collapseMenu.collapse.item4',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'recommendedList.item3',
                path: '/compliance-checklist',
                title: 'Compliance Checklist',
                translateKey: 'nav.collapseMenu.collapse.item1',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'dueCompliance.item4',
                path: '/due-compliance',
                title: 'Due Compliances',
                translateKey: 'nav.collapseMenu.collapse.item5',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },

            {
                key: 'complianceCertificate.item5',
                path: '/compliance-certificate',
                title: 'Compliance Certificate',
                translateKey: 'nav.collapseMenu.collapse.item7',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'history.item6',
                path: '/history',
                title: 'History',
                translateKey: 'nav.collapseMenu.item8',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
    {
        key: 'posh.collapse',
        path: '/poshTracker',
        title: 'POSH',
        translateKey: 'nav.poshTracker.collapse.collapse',
        icon: 'remittanceCollapse',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'poshTracker.collapse.item3',
                path: '/policy',
                title: 'POSH Policy',
                translateKey: 'nav.poshTracker.collapse.item3',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },

            {
                key: 'poshTracker.collapse.item2',
                path: '/committee',
                title: 'POSH Committee',
                translateKey: 'nav.poshTracker.collapse.item2',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'poshTracker.collapse.item1',
                path: '/posh',
                title: 'POSH Return',
                translateKey: 'nav.poshTracker.collapse.item1',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
    {
        key: 'register',
        path: '/register',
        title: 'Register',
        translateKey: 'nav.register',
        icon: 'remittanceCollapse',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
]

const auditornav: NavigationTree[] = [
    {
        key: 'home',
        path: '/dashboard',
        title: 'Dashboard',
        translateKey: 'nav.home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'collapseMenu.collapse',
        path: '',
        title: 'Audit Tracker',
        translateKey: 'nav.collapseMenu.collapseMenu.collapse',
        icon: 'auditCollapse',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'status.item1',
                path: '/status',
                title: 'Status',
                translateKey: 'nav.collapseMenu.collapse.item6',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'dueCompliance.item4',
                path: '/due-compliance',
                title: 'Due Compliance',
                translateKey: 'nav.collapseMenu.collapse.item5',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
]

const SideNav = () => {
    const { login } = store.getState()
    const { moduleAccess: moduleList, PermissionModules } = login.user.user
    const userType = login.user.type

    const themeColor = useAppSelector((state) => state.theme.themeColor)
    const primaryColorLevel = useAppSelector(
        (state) => state.theme.primaryColorLevel,
    )
    const navMode = useAppSelector((state) => state.theme.navMode)
    const mode = useAppSelector((state) => state.theme.mode)
    const direction = useAppSelector((state) => state.theme.direction)
    const currentRouteKey = useAppSelector(
        (state) => state.base.common.currentRouteKey,
    )
    const sideNavCollapse = useAppSelector(
        (state) => state.theme.layout.sideNavCollapse,
    )
    const userAuthority = useAppSelector((state) => state.auth.user.authority)
    const { larger } = useResponsive()

    // Create a mapping function to match navigation titles with module/menu names
    const createTitleMapping = () => {
        const mapping = {
            // Module level mappings
            'Global Settings': 'Global Settings',
            'Company Setup': 'Company Setup',
            'Agreement': 'Agreement',
            'Remittance Tracker': 'Remittance Tracker',
            'Notice Tracker': 'Notice',
            'Return Tracker': 'Return Tracker',
            'POSH': 'POSH',
            'Audit Tracker': 'Audit Tracker',
            'Audit Checklist': 'Audit Tracker',

            // Menu level mappings
            'Entity Setup': 'Entity Setup',
            'User Setup': 'User Setup',
            'Auditor Setup': 'User Setup',
            'Company Group': 'Company Group',
            'Company': 'Company',
            'Branch': 'Branch',
            'Designation': 'Designation',
            'User': 'User',
            'Auditor': 'User',
            'PF Tracker': 'PF Tracker',
            'PFIW Tracker': 'PFIW Tracker',
            'ESI Tracker': 'ESI Tracker',
            'LWF Tracker': 'LWF Tracker',
            'PT RC Tracker': 'PT RC Tracker',
            'PT EC Tracker': 'PT EC Tracker',
            'Status': 'Status',
            'Custom Checklist': 'Custom Checklist',
            'Compliance Checklist': 'Compliance Checklist',
            'Due Compliance': 'Due Compliance',
            'Due Compliances': 'Due Compliance',
            'Certificate': 'Certificate',
            'Compliance Certificate': 'Certificate',
            'History': 'History',
            'POSH Policy': 'POSH Policy',
            'POSH Committee': 'POSH Committee',
            'POSH Return': 'POSH Return',
        }
        return mapping
    }

    const titleMapping = createTitleMapping()

    // Enhanced permission checking function
    const hasPermission = (menuTitle: string): boolean => {
        // Always allow Dashboard for all users
        if (menuTitle === 'Dashboard') return true
        if (userType === 'admin' && menuTitle === 'Global Settings') return true

        // Get the mapped name for checking permissions
        const mappedName = titleMapping[menuTitle] || menuTitle

        // Special handling for auditors
        if (userType === 'auditor') {
            for (const module of moduleList) {
                if (module.name === 'Audit Tracker') {
                    for (const menu of module.menus) {
                        if (menu.name === mappedName) {
                            return menu.permissions?.can_list === true
                        }
                    }
                }
            }
            return false
        }

        // // For all other users (including admin)
        // for (const module of moduleList) {
        //     // First check if this is a module-level match
        //     if (module.name === mappedName) {
        //         return true
        //     }

        //     // Then check menu items within modules
        //     if (module.menus) {
        //         for (const menu of module.menus) {
        //             if (menu.name === mappedName) {
        //                 return menu.permissions?.can_list === true
        //             }

        //             // Check child menus if they exist
        //             if (menu.children) {
        //                 for (const child of menu.children) {
        //                     if (child.name === mappedName) {
        //                         return child.permissions?.can_list === true
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }
        if (userType === 'user') {
        for (const module of moduleList) {
            // Check module level access first
            if (module.name === mappedName) {
                return module.access?.can_list === true
            }

            // Check menu items within modules
            if (module.menus) {
                for (const menu of module.menus) {
                    if (menu.name === mappedName) {
                        return menu.access?.can_list === true
                    }

                    // Check child menus if they exist
                    if (menu.children) {
                        for (const child of menu.children) {
                            if (child.name === mappedName) {
                                return child.access?.can_list === true
                            }
                        }
                    }
                }
            }
        }
    } else {
        // For admin and other users
        for (const module of moduleList) {
            // First check if this is a module-level match
            if (module.name === mappedName) {
                return true
            }

            // Then check menu items within modules
            if (module.menus) {
                for (const menu of module.menus) {
                    if (menu.name === mappedName) {
                        return menu.permissions?.can_list === true
                    }

                    // Check child menus if they exist
                    if (menu.children) {
                        for (const child of menu.children) {
                            if (child.name === mappedName) {
                                return child.permissions?.can_list === true
                            }
                        }
                    }
                }
            }
        }
    }

        return false
    }

    const filterNavigation = (
        navigation: NavigationTree[],
    ): NavigationTree[] => {
        return navigation.filter((navItem) => {
            if (userType === 'admin' && navItem.title === 'Global Settings')
                return true

            // Check permission for this item
            const hasPermissionForItem = hasPermission(navItem.title)

            // Process submenus if they exist
            if (navItem.subMenu?.length) {
                const filteredSubMenu = filterNavigation([...navItem.subMenu])
                navItem.subMenu = filteredSubMenu

                // For collapse items, show if:
                // 1. User has permission for the parent item OR
                // 2. There are visible submenus
                if (navItem.type === NAV_ITEM_TYPE_COLLAPSE) {
                    return hasPermissionForItem || filteredSubMenu.length > 0
                }
            }

            return hasPermissionForItem
        })
    }

    // Get the appropriate navigation based on user type
    const getNavigationForUserType = () => {
        switch (userType) {
            case 'admin':
                return adminnav
            case 'user':
                return usernav
            case 'auditor':
                return auditornav
            default:
                return usernav // default to user nav if type not recognized
        }
    }

    // Get filtered navigation based on user role
    const filteredNav = filterNavigation(getNavigationForUserType())

    const sideNavColor = () => {
        if (navMode === NAV_MODE_THEMED) {
            return `bg-${themeColor}-${primaryColorLevel} side-nav-${navMode}`
        }
        return `side-nav-${navMode}`
    }

    const logoMode = () => {
        if (navMode === NAV_MODE_THEMED) return NAV_MODE_DARK
        if (navMode === NAV_MODE_TRANSPARENT) return mode
        return navMode
    }

    const menuContent = (
        <VerticalMenuContent
            navMode={navMode}
            collapsed={!sideNavCollapse}
            navigationTree={filteredNav}
            routeKey={currentRouteKey}
            userAuthority={userAuthority as string[]}
            direction={direction}
        />
    )

    const footerContent = (
        <div className="side-nav-footer mt-auto bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mx-4 mb-4 overflow-x-hidden">
            <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3">
                    <HiUserCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">
                        <span className="font-semibold">Role:</span> {userType}
                    </span>
                </div>
            </div>
        </div>
    )

    if (!larger.md) return null

    return (
        <div
            style={!sideNavCollapse ? sideNavCollapseStyle : sideNavStyle}
            className={classNames(
                'side-nav',
                sideNavColor(),
                sideNavCollapse && 'side-nav-expand',
            )}
        >
            <div className="side-nav-content-content h-full flex flex-col">
                <div className="side-nav-header py-4">
                    <Logo
                        mode={logoMode()}
                        type={!sideNavCollapse ? 'streamline' : 'full'}
                        className={
                            !sideNavCollapse
                                ? SIDE_NAV_CONTENT_GUTTER
                                : LOGO_X_GUTTER
                        }
                    />
                </div>
                <div className="side-nav-middle flex-1">
                    {!sideNavCollapse ? (
                        menuContent
                    ) : (
                        <ScrollBar autoHide direction={direction}>
                            {menuContent}
                        </ScrollBar>
                    )}
                </div>
                {sideNavCollapse && footerContent}
            </div>
        </div>
    )
}

export default SideNav