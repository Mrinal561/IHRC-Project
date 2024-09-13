import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
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
        key: 'collapseMenu',
        path: '',
        title: 'Audit Checklist',
        translateKey: 'nav.collapseMenu.collapseMenu',
        icon: 'collapseMenu',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'recommendedList.item1',
                path: '/recommended-checklist',
                title: 'Recommended Checklist',
                translateKey: 'nav.collapseMenu.item1',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            // {
            //     key: 'complianceDetail.item2',
            //     path: '/compliance-detail',
            //     title: 'Compliance Details',
            //     translateKey: 'nav.collapseMenu.item2',
            //     icon: '',
            //     type: NAV_ITEM_TYPE_ITEM,
            //     authority: [],
            //     subMenu: [],
            // },
            {
                key: 'assignChecklist.item3',
                path: '/assigned-checklist',
                title: 'Assigned Checklist',
                translateKey: 'nav.collapseMenu.item3',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'customChecklist.item4',
                path: '/custom-checklist',
                title: 'Custom Checklist',
                translateKey: 'nav.collapseMenu.item4',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'dueCompliance.item5',
                path: '/due-compliance',
                title: 'Due Compliances',
                translateKey: 'nav.collapseMenu.item5',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'status.item6',
                path: '/status',
                title: 'Status',
                translateKey: 'nav.collapseMenu.item6',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'complianceCertificate.item7',
                path: '/compliance-certificate',
                title: 'Compliance Certificate',
                translateKey: 'nav.collapseMenu.item7',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'history.item8',
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
        key: 'groupMenu.collapse',
        path: '',
        title: 'Global Settings',
        translateKey: 'nav.groupMenu.collapse.collapse',
        icon: 'groupCollapseMenu',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'groupMenu.collapse.item1',
                path: '/global-certificate',
                title: 'Certificate Template',
                translateKey: 'nav.groupMenu.collapse.item1',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
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
                key: 'groupMenu.collapse.item3',
                path: '/global-status',
                title: 'Status Settings',
                translateKey: 'nav.groupMenu.collapse.item3',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
    {
        key: 'entityMenu.collapse',
        path: '',
        title: 'Entity',
        translateKey: 'nav.entityMenu.collapse.collapse',
        icon: 'groupCollapseMenu',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'entityMenu.collapse.item1',
                path: '/company-group',
                title: 'Company Group',
                translateKey: 'nav.entityMenu.collapse.item1',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'entityMenu.collapse.item2',
                path: '/company-name',
                title: 'Company Name',
                translateKey: 'nav.entityMenu.collapse.item2',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'entityMenu.collapse.item3',
                path: '/state',
                title: 'State',
                translateKey: 'nav.entityMenu.collapse.item3',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'entityMenu.collapse.item4',
                path: '/district',
                title: 'District',
                translateKey: 'nav.entityMenu.collapse.item4',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'entityMenu.collapse.item5',
                path: '/location',
                title: 'Location',
                translateKey: 'nav.entityMenu.collapse.item5',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'entityMenu.collapse.item6',
                path: '/branch',
                title: 'Branch',
                translateKey: 'nav.entityMenu.collapse.item6',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
    {
        key: 'userEntityMenu.userEntityMenu',
        path: '/user-entity',
        title: 'User Entity',
        translateKey: 'nav.userEntityMenu.userEntityMenu',
        icon: 'groupCollapseMenu',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
]

export default navigationConfig
