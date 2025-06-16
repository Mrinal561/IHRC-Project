// import React, { useEffect } from 'react'
// import classNames from 'classnames'
// import ScrollBar from '@/components/ui/ScrollBar'
// // import { Clock, UserCircle, MapPin } from 'lucide-react';
// import { HiClock, HiUserCircle, HiMap } from 'react-icons/hi'
// import {
//     SIDE_NAV_WIDTH,
//     SIDE_NAV_COLLAPSED_WIDTH,
//     NAV_MODE_DARK,
//     NAV_MODE_THEMED,
//     NAV_MODE_TRANSPARENT,
//     SIDE_NAV_CONTENT_GUTTER,
//     LOGO_X_GUTTER,
// } from '@/constants/theme.constant'
// import {
//     NAV_ITEM_TYPE_TITLE,
//     NAV_ITEM_TYPE_ITEM,
//     NAV_ITEM_TYPE_COLLAPSE,
// } from '@/constants/navigation.constant'
// import type { NavigationTree } from '@/@types/navigation'

// import Logo from '@/components/template/Logo'
// import navigationConfig from '@/configs/navigation.config'
// import VerticalMenuContent from '@/components/template/VerticalMenuContent'
// import useResponsive from '@/utils/hooks/useResponsive'
// import { useAppSelector } from '@/store'
// import { HiMapPin } from 'react-icons/hi2'
// import store from '../../store'

// const sideNavStyle = {
//     width: SIDE_NAV_WIDTH,
//     minWidth: SIDE_NAV_WIDTH,
// }

// const sideNavCollapseStyle = {
//     width: SIDE_NAV_COLLAPSED_WIDTH,
//     minWidth: SIDE_NAV_COLLAPSED_WIDTH,
// }
// const adminnav: NavigationTree[] = [
//     {
//         key: 'home',
//         path: '/dashboard',
//         title: 'Dashboard',
//         translateKey: 'nav.home',
//         icon: 'home',
//         type: NAV_ITEM_TYPE_ITEM,
//         authority: [],
//         subMenu: [],
//     },

//     {
//         key: 'groupMenu.collapse',
//         path: '',
//         title: 'Global Settings',
//         translateKey: 'nav.groupMenu.collapse.collapse',
//         icon: 'globeCollapse',
//         type: NAV_ITEM_TYPE_COLLAPSE,
//         authority: [],
//         subMenu: [
//             // {
//             //     key: 'groupMenu.collapse.item1',
//             //     path: '/global-certificate',
//             //     title: 'Certificate Template',
//             //     translateKey: 'nav.groupMenu.collapse.item1',
//             //     icon: '',
//             //     type: NAV_ITEM_TYPE_ITEM,
//             //     authority: [],
//             //     subMenu: [],
//             // },
//             {
//                 key: 'groupMenu.collapse.item2',
//                 path: '/global-notification',
//                 title: 'Notification Settings',
//                 translateKey: 'nav.groupMenu.collapse.item2',
//                 icon: '',
//                 type: NAV_ITEM_TYPE_ITEM,
//                 authority: [],
//                 subMenu: [],
//             },
//             // {
//             //     key: 'groupMenu.collapse.item6',
//             //     path: '/role',
//             //     title: 'Role',
//             //     translateKey: 'nav.groupMenu.collapse.item6',
//             //     icon: '',
//             //     type: NAV_ITEM_TYPE_ITEM,
//             //     authority: [],
//             //     subMenu: [],
//             // },
//             {
//                 key: 'groupMenu.collapse.item7',
//                 path: '/Edit-permission',
//                 title: 'Remittance Edit Permission',
//                 translateKey: 'nav.groupMenu.collapse.item7',
//                 icon: '',
//                 type: NAV_ITEM_TYPE_ITEM,
//                 authority: [],
//                 subMenu: [],
//             },
//             // {
//             //     key: 'groupMenu.collapse.item3',
//             //     path: '/global-status',
//             //     title: 'Status Settings',
//             //     translateKey: 'nav.groupMenu.collapse.item3',
//             //     icon: '',
//             //     type: NAV_ITEM_TYPE_ITEM,
//             //     authority: [],
//             //     subMenu: [],
//             // },
//             // {
//             //     key: 'groupMenu.collapse.item4',
//             //     path: '/custom-fields',
//             //     title: 'Custom Fields',
//             //     translateKey: 'nav.groupMenu.collapse.item4',
//             //     icon: '',
//             //     type: NAV_ITEM_TYPE_ITEM,
//             //     authority: [],
//             //     subMenu: [],
//             // },
//             // {
//             //     key: 'groupMenu.collapse.item5',
//             //     path: '/register-template',
//             //     title: 'Register Template',
//             //     translateKey: 'nav.groupMenu.collapse.item5',
//             //     icon: '',
//             //     type: NAV_ITEM_TYPE_ITEM,
//             //     authority: [],
//             //     subMenu: [],
//             // },
//         ],
//     },
//     {
//         key: 'companySetup.collapse',
//         path: '',
//         title: 'Company Setup',
//         translateKey: 'nav.companySetup.companySetup',
//         icon: 'buildingCollapse',
//         type: NAV_ITEM_TYPE_COLLAPSE,
//         authority: [],
//         subMenu: [
//             {
//                 key: 'entitySetup.collapse',
//                 path: '',
//                 title: 'Entity Setup',
//                 translateKey: 'nav.entitySetup.collapse',
//                 icon: 'buildingOffice',
//                 type: NAV_ITEM_TYPE_COLLAPSE,
//                 authority: [],
//                 subMenu: [
//                     {
//                         key: 'entitySetup.collapse.companyGroup',
//                         path: '/company-group',
//                         title: 'Company Group',
//                         translateKey: 'nav.entitySetup.collapse.companyGroup',
//                         icon: '',
//                         type: NAV_ITEM_TYPE_ITEM,
//                         authority: [],
//                         subMenu: [],
//                     },
//                     {
//                         key: 'entitySetup.collapse.company',
//                         path: '/company-name',
//                         title: 'Company',
//                         translateKey: 'nav.entitySetup.collapse.company',
//                         icon: '',
//                         type: NAV_ITEM_TYPE_ITEM,
//                         authority: [],
//                         subMenu: [],
//                     },
//                     {
//                         key: 'entitySetup.collapse.branch',
//                         path: '/branch',
//                         title: 'Branch',
//                         translateKey: 'nav.entitySetup.collapse.branch',
//                         icon: '',
//                         type: NAV_ITEM_TYPE_ITEM,
//                         authority: [],
//                         subMenu: [],
//                     },
//                     {
//                         key: 'entitySetup.collapse.branchagreement',
//                         path: '/agreements',
//                         title: 'Agreements',
//                         translateKey: 'nav.entitySetup.collapse.branchagreement',
//                         icon: '',
//                         type: NAV_ITEM_TYPE_ITEM,
//                         authority: [],
//                         subMenu: [],
//                     },
//                 ],
//             },
//             {
//                 key: 'userSetup.collapse',
//                 path: '',
//                 title: 'User Setup',
//                 translateKey: 'nav.userSetup.collapse',
//                 icon: '',
//                 type: NAV_ITEM_TYPE_COLLAPSE,
//                 authority: [],
//                 subMenu: [
//                     {
//                         key: 'userSetup.collapse.role',
//                         path: '/role',
//                         title: 'Designation',
//                         translateKey: 'nav.userSetup.collapse.role',
//                         icon: '',
//                         type: NAV_ITEM_TYPE_ITEM,
//                         authority: [],
//                         subMenu: [],
//                     },
//                     {
//                         key: 'userSetup.collapse.user',
//                         path: '/user-entity',
//                         title: 'Users',
//                         translateKey: 'nav.userSetup.collapse.user',
//                         icon: '',
//                         type: NAV_ITEM_TYPE_ITEM,
//                         authority: [],
//                         subMenu: [],
//                     },
//                 ],
//             },
//         ],
//     },

//     // {
//     //     key: 'collapseMenu',
//     //     path: '',
//     //     title: 'Audit Checklist',
//     //     translateKey: 'nav.collapseMenu.collapseMenu',
//     //     icon: 'auditCollapse',
//     //     type: NAV_ITEM_TYPE_COLLAPSE,
//     //     authority: [],
//     //     subMenu: [
//     //         {
//     //             key: 'recommendedList.item1',
//     //             path: '/recommended-checklist',
//     //             title: 'Recommended Checklist',
//     //             translateKey: 'nav.collapseMenu.item1',
//     //             icon: '',
//     //             type: NAV_ITEM_TYPE_ITEM,
//     //             authority: [],
//     //             subMenu: [],
//     //         },
//     //         {
//     //             key: 'assignChecklist.item3',
//     //             path: '/assigned-checklist',
//     //             title: 'Assigned Checklist',
//     //             translateKey: 'nav.collapseMenu.item3',
//     //             icon: '',
//     //             type: NAV_ITEM_TYPE_ITEM,
//     //             authority: [],
//     //             subMenu: [],
//     //         },
//     //         {
//     //             key: 'customChecklist.item4',
//     //             path: '/custom-checklist',
//     //             title: 'Custom Checklist',
//     //             translateKey: 'nav.collapseMenu.item4',
//     //             icon: '',
//     //             type: NAV_ITEM_TYPE_ITEM,
//     //             authority: [],
//     //             subMenu: [],
//     //         },
//     //         {
//     //             key: 'dueCompliance.item5',
//     //             path: '/due-compliance',
//     //             title: 'Due Compliances',
//     //             translateKey: 'nav.collapseMenu.item5',
//     //             icon: '',
//     //             type: NAV_ITEM_TYPE_ITEM,
//     //             authority: [],
//     //             subMenu: [],
//     //         },
//     //         {
//     //             key: 'status.item6',
//     //             path: '/status',
//     //             title: 'Status',
//     //             translateKey: 'nav.collapseMenu.item6',
//     //             icon: '',
//     //             type: NAV_ITEM_TYPE_ITEM,
//     //             authority: [],
//     //             subMenu: [],
//     //         },
//     //         {
//     //             key: 'complianceCertificate.item7',
//     //             path: '/compliance-certificate',
//     //             title: 'Compliance Certificate',
//     //             translateKey: 'nav.collapseMenu.item7',
//     //             icon: '',
//     //             type: NAV_ITEM_TYPE_ITEM,
//     //             authority: [],
//     //             subMenu: [],
//     //         },
//     //         {
//     //             key: 'history.item8',
//     //             path: '/history',
//     //             title: 'History',
//     //             translateKey: 'nav.collapseMenu.item8',
//     //             icon: '',
//     //             type: NAV_ITEM_TYPE_ITEM,
//     //             authority: [],
//     //             subMenu: [],
//     //         },
//     //     ],
//     // },

//     {
//         key: 'remittanceTracker.collapse',
//         path: '/remittanceTracker',
//         title: 'Remittance Tracker',
//         translateKey: 'nav.remittanceTracker.collapse.collapse',
//         icon: 'remittanceCollapse',
//         type: NAV_ITEM_TYPE_COLLAPSE,
//         authority: [],
//         subMenu: [
//             {
//                 key: 'remittanceTracker.collapse.item1',
//                 path: '/pf-tracker',
//                 title: 'PF Tracker',
//                 translateKey: 'nav.remittanceTracker.collapse.item1',
//                 icon: '',
//                 type: NAV_ITEM_TYPE_ITEM,
//                 authority: [],
//                 subMenu: [],
//             },
//             {
//                 key: 'remittanceTracker.collapse.item6',
//                 path: '/pfiw-tracker',
//                 title: 'PF IW Tracker',
//                 translateKey: 'nav.remittanceTracker.collapse.item6',
//                 icon: '',
//                 type: NAV_ITEM_TYPE_ITEM,
//                 authority: [],
//                 subMenu: [],
//             },
//             {
//                 key: 'remittanceTracker.collapse.item2',
//                 path: '/esi-tracker',
//                 title: 'ESI Tracker',
//                 translateKey: 'nav.remittanceTracker.collapse.item2',
//                 icon: '',
//                 type: NAV_ITEM_TYPE_ITEM,
//                 authority: [],
//                 subMenu: [],
//             },
//             {
//                 key: 'remittanceTracker.collapse.item3',
//                 path: '/lwf-tracker',
//                 title: 'LWF Tracker',
//                 translateKey: 'nav.remittanceTracker.collapse.item3',
//                 icon: '',
//                 type: NAV_ITEM_TYPE_ITEM,
//                 authority: [],
//                 subMenu: [],
//             },
//             {
//                 key: 'remittanceTracker.collapse.item4',
//                 path: '/ptrc-tracker',
//                 title: 'PT RC Tracker',
//                 translateKey: 'nav.remittanceTracker.collapse.item4',
//                 icon: '',
//                 type: NAV_ITEM_TYPE_ITEM,
//                 authority: [],
//                 subMenu: [],
//             },
//             {
//                 key: 'remittanceTracker.collapse.item5',
//                 path: '/ptec-tracker',
//                 title: 'PT EC Tracker',
//                 translateKey: 'nav.remittanceTracker.collapse.item5',
//                 icon: '',
//                 type: NAV_ITEM_TYPE_ITEM,
//                 authority: [],
//                 subMenu: [],
//             },
//             // {
//             //     key: 'remittanceTracker.collapse.item7',
//             //     path: '/notice-tracker',
//             //     title: 'Notice Tracker',
//             //     translateKey: 'nav.remittanceTracker.collapse.item7',
//             //     icon: '',
//             //     type: NAV_ITEM_TYPE_ITEM,
//             //     authority: [],
//             //     subMenu: [],
//             // },
//         ],
//     },
//     {
//         key: 'notice',
//         path: '/notice-tracker',
//         title: 'Notice Tracker',
//         translateKey: 'nav.notice',
//         icon: 'remittanceCollapse',
//         type: NAV_ITEM_TYPE_ITEM,
//         authority: [],
//         subMenu:[]
//     },
//     // {
//     //     key: 'externalUser',
//     //     path: '/external-user',
//     //     title: 'External user',
//     //     translateKey: 'nav.externaluser',
//     //     icon: 'remittanceCollapse',
//     //     type: NAV_ITEM_TYPE_ITEM,
//     //     authority: [],
//     //     subMenu:[]
//     // }

//     // {
//     //     key: 'register.collapse',
//     //     path: '/register&return',
//     //     title: 'Register & Return',
//     //     translateKey: 'nav.register.collapse.collapse',
//     //     icon: 'remittanceCollapse',
//     //     type: NAV_ITEM_TYPE_COLLAPSE,
//     //     authority: [],
//     //     subMenu: [
//     //         {
//     //             key: 'register.collapse.inputSetup.collapse',
//     //             path: '',
//     //             title: 'Input',
//     //             translateKey: 'nav.register.collapse.inputSetup.collapse.collapse',
//     //             icon: '',
//     //             type: NAV_ITEM_TYPE_COLLAPSE,
//     //             authority: [],
//     //             subMenu: [
//     //                 {
//     //                     key: 'register.collapse.inputSetup.collapse.item1',
//     //                     path: '/salary-register-input',
//     //                     title: 'Salary Register',
//     //                     translateKey: 'nav.register.collapse.item1',
//     //                     icon: '',
//     //                     type: NAV_ITEM_TYPE_ITEM,
//     //                     authority: [],
//     //                     subMenu: [],
//     //                 },
//     //                 {
//     //                     key: 'register.collapse.inputSetup.collapse.item2',
//     //                     path: '/attendance-register-input',
//     //                     title: 'Attendance Register',
//     //                     translateKey: 'nav.register.collapse.item2',
//     //                     icon: '',
//     //                     type: NAV_ITEM_TYPE_ITEM,
//     //                     authority: [],
//     //                     subMenu: [],
//     //                 },
//     //                 {
//     //                     key: 'register.collapse.inputSetup.collapse.item3',
//     //                     path: '/leave-register-input',
//     //                     title: 'Leave Register',
//     //                     translateKey: 'nav.register.collapse.item3',
//     //                     icon: '',
//     //                     type: NAV_ITEM_TYPE_ITEM,
//     //                     authority: [],
//     //                     subMenu: [],
//     //                 },
//     //                 {
//     //                     key: 'register.collapse.inputSetup.collapse.item4',
//     //                     path: '/bonus-register-input',
//     //                     title: 'Bonus Register',
//     //                     translateKey: 'nav.register.collapse.item4',
//     //                     icon: '',
//     //                     type: NAV_ITEM_TYPE_ITEM,
//     //                     authority: [],
//     //                     subMenu: [],
//     //                 },
//     //                 {
//     //                     key: 'register.collapse.inputSetup.collapse.item5',
//     //                     path: '/maternity-register-input',
//     //                     title: 'Maternity Register',
//     //                     translateKey: 'nav.register.collapse.item5',
//     //                     icon: '',
//     //                     type: NAV_ITEM_TYPE_ITEM,
//     //                     authority: [],
//     //                     subMenu: [],
//     //                 },
//     //             ],
//     //         },
//     //         {
//     //             key: 'register.collapse.outputSetup.collapse',
//     //             path: '',
//     //             title: 'Output',
//     //             translateKey: 'nav.register.collapse.outputSetup.collapse.collapse',
//     //             icon: '',
//     //             type: NAV_ITEM_TYPE_COLLAPSE,
//     //             authority: [],
//     //             subMenu: [
//     //                 {
//     //                     key: 'register.collapse.outputSetup.collapse.item1',
//     //                     path: '/output-register',
//     //                     title: 'Output Registers',
//     //                     translateKey: 'nav.register.collapse.item1',
//     //                     icon: '',
//     //                     type: NAV_ITEM_TYPE_ITEM,
//     //                     authority: [],
//     //                     subMenu: [],
//     //                 },
//     //                 // {
//     //                 //     key: 'register.collapse.outputSetup.collapse.item2',
//     //                 //     path: '/attendance-register-output',
//     //                 //     title: 'Attendance Register',
//     //                 //     translateKey: 'nav.register.collapse.item2',
//     //                 //     icon: '',
//     //                 //     type: NAV_ITEM_TYPE_ITEM,
//     //                 //     authority: [],
//     //                 //     subMenu: [],
//     //                 // },
//     //                 // {
//     //                 //     key: 'register.collapse.outputSetup.collapse.item3',
//     //                 //     path: '/leave-register-output',
//     //                 //     title: 'Leave Register',
//     //                 //     translateKey: 'nav.register.collapse.item3',
//     //                 //     icon: '',
//     //                 //     type: NAV_ITEM_TYPE_ITEM,
//     //                 //     authority: [],
//     //                 //     subMenu: [],
//     //                 // },
//     //                 // {
//     //                 //     key: 'register.collapse.outputSetup.collapse.item4',
//     //                 //     path: '/bonus-register-output',
//     //                 //     title: 'Bonus Register',
//     //                 //     translateKey: 'nav.register.collapse.item4',
//     //                 //     icon: '',
//     //                 //     type: NAV_ITEM_TYPE_ITEM,
//     //                 //     authority: [],
//     //                 //     subMenu: [],
//     //                 // },
//     //                 // {
//     //                 //     key: 'register.collapse.outputSetup.collapse.item5',
//     //                 //     path: '/maternity-register-output',
//     //                 //     title: 'Maternity Register',
//     //                 //     translateKey: 'nav.register.collapse.item5',
//     //                 //     icon: '',
//     //                 //     type: NAV_ITEM_TYPE_ITEM,
//     //                 //     authority: [],
//     //                 //     subMenu: [],
//     //                 // },
//     //             ],
//     //         },
//     //     ],
//     // },
// ]
// const usernav: NavigationTree[] = [
//     {
//         key: 'home',
//         path: '/dashboard',
//         title: 'Dashboard',
//         translateKey: 'nav.home',
//         icon: 'home',
//         type: NAV_ITEM_TYPE_ITEM,
//         authority: [],
//         subMenu: [],
//     },
//     {
//         key: 'agreement',
//         path: '/agreements',
//         title: 'Agreement',
//         translateKey: 'nav.agreement',
//         icon: 'remittanceCollapse',
//         type: NAV_ITEM_TYPE_ITEM,
//         authority: [],
//         subMenu: [],
//     },
//     // {
//     //     key: 'collapseMenu',
//     //     path: '',
//     //     title: 'Audit Checklist',
//     //     translateKey: 'nav.collapseMenu.collapseMenu',
//     //     icon: 'auditCollapse',
//     //     type: NAV_ITEM_TYPE_COLLAPSE,
//     //     authority: [],
//     //     subMenu: [
//     //         {
//     //             key: 'recommendedList.item1',
//     //             path: '/recommended-checklist',
//     //             title: 'Recommended Checklist',
//     //             translateKey: 'nav.collapseMenu.item1',
//     //             icon: '',
//     //             type: NAV_ITEM_TYPE_ITEM,
//     //             authority: [],
//     //             subMenu: [],
//     //         },
//     //         {
//     //             key: 'assignChecklist.item3',
//     //             path: '/assigned-checklist',
//     //             title: 'Assigned Checklist',
//     //             translateKey: 'nav.collapseMenu.item3',
//     //             icon: '',
//     //             type: NAV_ITEM_TYPE_ITEM,
//     //             authority: [],
//     //             subMenu: [],
//     //         },
//     //         {
//     //             key: 'customChecklist.item4',
//     //             path: '/custom-checklist',
//     //             title: 'Custom Checklist',
//     //             translateKey: 'nav.collapseMenu.item4',
//     //             icon: '',
//     //             type: NAV_ITEM_TYPE_ITEM,
//     //             authority: [],
//     //             subMenu: [],
//     //         },
//     //         {
//     //             key: 'dueCompliance.item5',
//     //             path: '/due-compliance',
//     //             title: 'Due Compliances',
//     //             translateKey: 'nav.collapseMenu.item5',
//     //             icon: '',
//     //             type: NAV_ITEM_TYPE_ITEM,
//     //             authority: [],
//     //             subMenu: [],
//     //         },
//     //         {
//     //             key: 'status.item6',
//     //             path: '/status',
//     //             title: 'Status',
//     //             translateKey: 'nav.collapseMenu.item6',
//     //             icon: '',
//     //             type: NAV_ITEM_TYPE_ITEM,
//     //             authority: [],
//     //             subMenu: [],
//     //         },
//     //         {
//     //             key: 'complianceCertificate.item7',
//     //             path: '/compliance-certificate',
//     //             title: 'Compliance Certificate',
//     //             translateKey: 'nav.collapseMenu.item7',
//     //             icon: '',
//     //             type: NAV_ITEM_TYPE_ITEM,
//     //             authority: [],
//     //             subMenu: [],
//     //         },
//     //         {
//     //             key: 'history.item8',
//     //             path: '/history',
//     //             title: 'History',
//     //             translateKey: 'nav.collapseMenu.item8',
//     //             icon: '',
//     //             type: NAV_ITEM_TYPE_ITEM,
//     //             authority: [],
//     //             subMenu: [],
//     //         },
//     //     ],
//     // },

//     {
//         key: 'remittanceTracker.collapse',
//         path: '/remittanceTracker',
//         title: 'Remittance Tracker',
//         translateKey: 'nav.remittanceTracker.collapse.collapse',
//         icon: 'remittanceCollapse',
//         type: NAV_ITEM_TYPE_COLLAPSE,
//         authority: [],
//         subMenu: [
//             {
//                 key: 'remittanceTracker.collapse.item1',
//                 path: '/pf-tracker',
//                 title: 'PF Tracker',
//                 translateKey: 'nav.remittanceTracker.collapse.item1',
//                 icon: '',
//                 type: NAV_ITEM_TYPE_ITEM,
//                 authority: [],
//                 subMenu: [],
//             },
//             {
//                 key: 'remittanceTracker.collapse.item6',
//                 path: '/pfiw-tracker',
//                 title: 'PF IW Tracker',
//                 translateKey: 'nav.remittanceTracker.collapse.item6',
//                 icon: '',
//                 type: NAV_ITEM_TYPE_ITEM,
//                 authority: [],
//                 subMenu: [],
//             },
//             {
//                 key: 'remittanceTracker.collapse.item2',
//                 path: '/esi-tracker',
//                 title: 'ESI Tracker',
//                 translateKey: 'nav.remittanceTracker.collapse.item2',
//                 icon: '',
//                 type: NAV_ITEM_TYPE_ITEM,
//                 authority: [],
//                 subMenu: [],
//             },
//             {
//                 key: 'remittanceTracker.collapse.item3',
//                 path: '/lwf-tracker',
//                 title: 'LWF Tracker',
//                 translateKey: 'nav.remittanceTracker.collapse.item3',
//                 icon: '',
//                 type: NAV_ITEM_TYPE_ITEM,
//                 authority: [],
//                 subMenu: [],
//             },
//             {
//                 key: 'remittanceTracker.collapse.item4',
//                 path: '/ptrc-tracker',
//                 title: 'PT RC Tracker',
//                 translateKey: 'nav.remittanceTracker.collapse.item4',
//                 icon: '',
//                 type: NAV_ITEM_TYPE_ITEM,
//                 authority: [],
//                 subMenu: [],
//             },
//             {
//                 key: 'remittanceTracker.collapse.item5',
//                 path: '/ptec-tracker',
//                 title: 'PT EC Tracker',
//                 translateKey: 'nav.remittanceTracker.collapse.item5',
//                 icon: '',
//                 type: NAV_ITEM_TYPE_ITEM,
//                 authority: [],
//                 subMenu: [],
//             },
//             // {
//             //     key: 'remittanceTracker.collapse.item7',
//             //     path: '/notice-tracker',
//             //     title: 'Notice Tracker',
//             //     translateKey: 'nav.remittanceTracker.collapse.item7',
//             //     icon: '',
//             //     type: NAV_ITEM_TYPE_ITEM,
//             //     authority: [],
//             //     subMenu: [],
//             // },
//         ],
//     },
//     {
//         key: 'notice',
//         path: '/notice-tracker',
//         title: 'Notice Tracker',
//         translateKey: 'nav.notice',
//         icon: 'remittanceCollapse',
//         type: NAV_ITEM_TYPE_ITEM,
//         authority: [],
//         subMenu:[]
//     },
   

//     // {
//     //     key: 'register.collapse',
//     //     path: '/register&return',
//     //     title: 'Register & Return',
//     //     translateKey: 'nav.register.collapse.collapse',
//     //     icon: 'remittanceCollapse',
//     //     type: NAV_ITEM_TYPE_COLLAPSE,
//     //     authority: [],
//     //     subMenu: [
//     //         {
//     //             key: 'register.collapse.inputSetup.collapse',
//     //             path: '',
//     //             title: 'Input',
//     //             translateKey: 'nav.register.collapse.inputSetup.collapse.collapse',
//     //             icon: '',
//     //             type: NAV_ITEM_TYPE_COLLAPSE,
//     //             authority: [],
//     //             subMenu: [
//     //                 {
//     //                     key: 'register.collapse.inputSetup.collapse.item1',
//     //                     path: '/salary-register-input',
//     //                     title: 'Salary Register',
//     //                     translateKey: 'nav.register.collapse.item1',
//     //                     icon: '',
//     //                     type: NAV_ITEM_TYPE_ITEM,
//     //                     authority: [],
//     //                     subMenu: [],
//     //                 },
//     //                 {
//     //                     key: 'register.collapse.inputSetup.collapse.item2',
//     //                     path: '/attendance-register-input',
//     //                     title: 'Attendance Register',
//     //                     translateKey: 'nav.register.collapse.item2',
//     //                     icon: '',
//     //                     type: NAV_ITEM_TYPE_ITEM,
//     //                     authority: [],
//     //                     subMenu: [],
//     //                 },
//     //                 {
//     //                     key: 'register.collapse.inputSetup.collapse.item3',
//     //                     path: '/leave-register-input',
//     //                     title: 'Leave Register',
//     //                     translateKey: 'nav.register.collapse.item3',
//     //                     icon: '',
//     //                     type: NAV_ITEM_TYPE_ITEM,
//     //                     authority: [],
//     //                     subMenu: [],
//     //                 },
//     //                 {
//     //                     key: 'register.collapse.inputSetup.collapse.item4',
//     //                     path: '/bonus-register-input',
//     //                     title: 'Bonus Register',
//     //                     translateKey: 'nav.register.collapse.item4',
//     //                     icon: '',
//     //                     type: NAV_ITEM_TYPE_ITEM,
//     //                     authority: [],
//     //                     subMenu: [],
//     //                 },
//     //                 {
//     //                     key: 'register.collapse.inputSetup.collapse.item5',
//     //                     path: '/maternity-register-input',
//     //                     title: 'Maternity Register',
//     //                     translateKey: 'nav.register.collapse.item5',
//     //                     icon: '',
//     //                     type: NAV_ITEM_TYPE_ITEM,
//     //                     authority: [],
//     //                     subMenu: [],
//     //                 },
//     //             ],
//     //         },
//     //         {
//     //             key: 'register.collapse.outputSetup.collapse',
//     //             path: '',
//     //             title: 'Output',
//     //             translateKey: 'nav.register.collapse.outputSetup.collapse.collapse',
//     //             icon: '',
//     //             type: NAV_ITEM_TYPE_COLLAPSE,
//     //             authority: [],
//     //             subMenu: [
//     //                 {
//     //                     key: 'register.collapse.outputSetup.collapse.item1',
//     //                     path: '/output-register',
//     //                     title: 'Output Registers',
//     //                     translateKey: 'nav.register.collapse.item1',
//     //                     icon: '',
//     //                     type: NAV_ITEM_TYPE_ITEM,
//     //                     authority: [],
//     //                     subMenu: [],
//     //                 },
//     //                 // {
//     //                 //     key: 'register.collapse.outputSetup.collapse.item2',
//     //                 //     path: '/attendance-register-output',
//     //                 //     title: 'Attendance Register',
//     //                 //     translateKey: 'nav.register.collapse.item2',
//     //                 //     icon: '',
//     //                 //     type: NAV_ITEM_TYPE_ITEM,
//     //                 //     authority: [],
//     //                 //     subMenu: [],
//     //                 // },
//     //                 // {
//     //                 //     key: 'register.collapse.outputSetup.collapse.item3',
//     //                 //     path: '/leave-register-output',
//     //                 //     title: 'Leave Register',
//     //                 //     translateKey: 'nav.register.collapse.item3',
//     //                 //     icon: '',
//     //                 //     type: NAV_ITEM_TYPE_ITEM,
//     //                 //     authority: [],
//     //                 //     subMenu: [],
//     //                 // },
//     //                 // {
//     //                 //     key: 'register.collapse.outputSetup.collapse.item4',
//     //                 //     path: '/bonus-register-output',
//     //                 //     title: 'Bonus Register',
//     //                 //     translateKey: 'nav.register.collapse.item4',
//     //                 //     icon: '',
//     //                 //     type: NAV_ITEM_TYPE_ITEM,
//     //                 //     authority: [],
//     //                 //     subMenu: [],
//     //                 // },
//     //                 // {
//     //                 //     key: 'register.collapse.outputSetup.collapse.item5',
//     //                 //     path: '/maternity-register-output',
//     //                 //     title: 'Maternity Register',
//     //                 //     translateKey: 'nav.register.collapse.item5',
//     //                 //     icon: '',
//     //                 //     type: NAV_ITEM_TYPE_ITEM,
//     //                 //     authority: [],
//     //                 //     subMenu: [],
//     //                 // },
//     //             ],
//     //         },
//     //     ],
//     // },
// ]
// const SideNav = () => {
//     const { login } = store.getState();
//     const moduleList = login.user.user.moduleAccess;
//     const themeColor = useAppSelector((state) => state.theme.themeColor)
//     const primaryColorLevel = useAppSelector(
//         (state) => state.theme.primaryColorLevel,
//     )
//     const navMode = useAppSelector((state) => state.theme.navMode)
//     const mode = useAppSelector((state) => state.theme.mode)
//     const direction = useAppSelector((state) => state.theme.direction)
//     const currentRouteKey = useAppSelector(
//         (state) => state.base.common.currentRouteKey,
//     )
//     const sideNavCollapse = useAppSelector(
//         (state) => state.theme.layout.sideNavCollapse,
//     )
//     const userAuthority = useAppSelector((state) => state.auth.user.authority)
//     const nav = login.user.type == 'admin' ? adminnav : usernav
//     // const lastLogin = '01/09/2024'
//     const userRole = login.user.type
//     // const companyLocation = 'Samastipur'

//     const { larger } = useResponsive()

//     useEffect(()=>{
//         console.log(login.user.user.moduleAccess)
//     })
//     const sideNavColor = () => {
//         if (navMode === NAV_MODE_THEMED) {
//             return `bg-${themeColor}-${primaryColorLevel} side-nav-${navMode}`
//         }
//         return `side-nav-${navMode}`
//     }

//     const logoMode = () => {
//         if (navMode === NAV_MODE_THEMED) {
//             return NAV_MODE_DARK
//         }
//         if (navMode === NAV_MODE_TRANSPARENT) {
//             return mode
//         }
//         return navMode
//     }

//     const menuContent = (
//         <VerticalMenuContent
//             navMode={navMode}
//             collapsed={!sideNavCollapse}
//             navigationTree={nav}
//             routeKey={currentRouteKey}
//             userAuthority={userAuthority as string[]}
//             direction={direction}
//         />
//     )

//     const footerContent = (
//         <div className="side-nav-footer mt-auto bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mx-4 mb-4 overflow-x-hidden">
//             <div className="flex flex-col space-y-3">
//                 {/* <div className="flex items-center space-x-3">
//                     <HiClock className="w-5 h-5 text-indigo-500" />
//                     <span className="text-sm">
//                         <span className="font-semibold">Last Login:</span>{' '}
//                         {lastLogin}
//                     </span>
//                 </div> */}
//                 <div className="flex items-center space-x-3">
//                     <HiUserCircle className="w-5 h-5 text-green-500" />
//                     <span className="text-sm">
//                         <span className="font-semibold">Role:</span> {userRole}
//                     </span>
//                 </div>
//                 {/* <div className="flex items-center space-x-3">
//                     <HiMapPin className="w-5 h-5 text-red-500" />
//                     <span className="text-sm">
//                         <span className="font-semibold">Location:</span>{' '}
//                         {companyLocation}
//                     </span>
//                 </div> */}
//             </div>
//         </div>
//     )

//     return (
//         <>
//             {larger.md && (
//                 <div
//                     style={
//                         !sideNavCollapse ? sideNavCollapseStyle : sideNavStyle
//                     }
//                     className={classNames(
//                         'side-nav',
//                         sideNavColor(),
//                         sideNavCollapse && 'side-nav-expand',
//                     )}
//                 >
//                     <div className="side-nav-content-content h-full flex flex-col ">
//                         <div className="side-nav-header">
//                             <Logo
//                                 mode={logoMode()}
//                                 type={!sideNavCollapse ? 'streamline' : 'full'}
//                                 className={
//                                     !sideNavCollapse
//                                         ? SIDE_NAV_CONTENT_GUTTER
//                                         : LOGO_X_GUTTER
//                                 }
//                             />
//                         </div>
//                         <div className="side-nav-middle flex-1">
//                             {!sideNavCollapse ? (
//                                 menuContent
//                             ) : (
//                                 <ScrollBar autoHide direction={direction}>
//                                     {menuContent}
//                                 </ScrollBar>
//                             )}
//                         </div>
//                         {sideNavCollapse && footerContent}
//                     </div>
//                 </div>
//             )}
//         </>
//     )
// }

// export default SideNav


import React, { useEffect } from 'react';
import classNames from 'classnames';
import ScrollBar from '@/components/ui/ScrollBar';
import { HiClock, HiUserCircle, HiMap } from 'react-icons/hi';
import {
    SIDE_NAV_WIDTH,
    SIDE_NAV_COLLAPSED_WIDTH,
    NAV_MODE_DARK,
    NAV_MODE_THEMED,
    NAV_MODE_TRANSPARENT,
    SIDE_NAV_CONTENT_GUTTER,
    LOGO_X_GUTTER,
} from '@/constants/theme.constant';
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant';
import type { NavigationTree } from '@/@types/navigation';
import Logo from '@/components/template/Logo';
import navigationConfig from '@/configs/navigation.config';
import VerticalMenuContent from '@/components/template/VerticalMenuContent';
import useResponsive from '@/utils/hooks/useResponsive';
import { useAppSelector } from '@/store';
import { HiMapPin } from 'react-icons/hi2';
import store from '../../store';

const sideNavStyle = {
    width: SIDE_NAV_WIDTH,
    minWidth: SIDE_NAV_WIDTH,
};

const sideNavCollapseStyle = {
    width: SIDE_NAV_COLLAPSED_WIDTH,
    minWidth: SIDE_NAV_COLLAPSED_WIDTH,
};

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
            // {
            //     key: 'groupMenu.collapse.item8',
            //     path: '/Notice-Edit-permission',
            //     title: 'Notice Edit Permission',
            //     translateKey: 'nav.groupMenu.collapse.item8',
            //     icon: '',
            //     type: NAV_ITEM_TYPE_ITEM,
            //     authority: [],
            //     subMenu: [],
            // },
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
                        translateKey: 'nav.entitySetup.collapse.branchagreement',
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
   
];

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
  
];

const filterNavigation = (
    navigation: NavigationTree[],
    moduleList: any[],
    isAdmin: boolean = false
) => {
    // List of items that should always be visible regardless of moduleList
    const alwaysVisibleItems = ['Dashboard'];

    const findMenuInModuleList = (
        title: string,
        moduleList: any[]
    ): { menu: any; access: any; parentModule?: any } | null => {
        for (const module of moduleList) {
            // Check main module
            if (module.name === title) {
                return { menu: module, access: module.access, parentModule: module };
            }

            // Check in module's menus
            if (module.menus) {
                for (const menu of module.menus) {
                    if (menu.name === title) {
                        return { menu, access: menu.access, parentModule: module };
                    }

                    // Check in children
                    if (menu.children) {
                        const childMenu = menu.children.find(
                            (child: any) => child.name === title
                        );
                        if (childMenu) {
                            return { 
                                menu: childMenu, 
                                access: childMenu.access,
                                parentModule: module 
                            };
                        }
                    }
                }
            }
        }
        return null;
    };

    const findNestedMenu = (title: string, moduleList: any[]): any => {
        for (const module of moduleList) {
            // Check module menus
            if (module.menus) {
                for (const menu of module.menus) {
                    if (menu.name === title) {
                        return menu;
                    }
                    // Check children
                    if (menu.children) {
                        const childMenu = menu.children.find(
                            (child: any) => child.name === title
                        );
                        if (childMenu) {
                            return childMenu;
                        }
                    }
                }
            }
        }
        return null;
    };

    // return navigation.filter((navItem) => {
    //     // Allow always visible items
    //     if (alwaysVisibleItems.includes(navItem.title)) {
    //         return true;
    //     }

    //     // Special case for Global Settings (admin only)
    //     if (navItem.key === 'groupMenu.collapse') {
    //         return isAdmin;
    //     }

    //     // Find menu item in module list
    //     const menuInfo = findMenuInModuleList(navItem.title, moduleList);
        
    //     // Handle items with submenus
    //     if (navItem.subMenu && navItem.subMenu.length > 0) {
    //         // For admin, recursively filter without permission check
    //         if (isAdmin) {
    //             const filteredSubMenu = filterNavigation(navItem.subMenu, moduleList, true);
    //             navItem.subMenu = filteredSubMenu;
    //             return filteredSubMenu.length > 0;
    //         }

    //         // For users, check permissions at each level
    //         let filteredSubMenu;
    //         if (menuInfo?.parentModule) {
    //             // For menus like Remittance Tracker with direct submenus
    //             filteredSubMenu = navItem.subMenu.filter(subItem => {
    //                 const subMenuInfo = findNestedMenu(subItem.title, moduleList);
    //                 return subMenuInfo?.access?.can_list === true;
    //             });
    //         } else {
    //             // For deeply nested menus
    //             filteredSubMenu = filterNavigation(navItem.subMenu, moduleList, false);
    //         }

    //         navItem.subMenu = filteredSubMenu;
    //         return filteredSubMenu.length > 0;
    //     }

    //     // For regular menu items
    //     if (!menuInfo) return false;

    //     // For admin, only check if menu exists
    //     if (isAdmin) {
    //         return true;
    //     }

    //     // For users, check can_list permission
    //     return menuInfo.access?.can_list === true;
    // });
    const filteredNav = navigation.filter((navItem) => {
        // Allow always visible items
        if (alwaysVisibleItems.includes(navItem.title)) {
            return true;
        }

        // Special case for Global Settings (admin only)
        if (navItem.key === 'groupMenu.collapse') {
            return isAdmin;
        }

        // Find menu item in module list
        const menuInfo = findMenuInModuleList(navItem.title, moduleList);
        
        // Handle items with submenus
        if (navItem.subMenu && navItem.subMenu.length > 0) {
            // For admin, recursively filter without permission check
            if (isAdmin) {
                const filteredSubMenu = filterNavigation(navItem.subMenu, moduleList, true);
                navItem.subMenu = filteredSubMenu;
                return filteredSubMenu.length > 0;
            }

            // For users, check permissions at each level
            let filteredSubMenu;
            if (menuInfo?.parentModule) {
                // For menus like Remittance Tracker with direct submenus
                filteredSubMenu = navItem.subMenu.filter(subItem => {
                    const subMenuInfo = findNestedMenu(subItem.title, moduleList);
                    return subMenuInfo?.access?.can_list === true;
                });
            } else {
                // For deeply nested menus
                filteredSubMenu = filterNavigation(navItem.subMenu, moduleList, false);
            }

            navItem.subMenu = filteredSubMenu;
            return filteredSubMenu.length > 0;
        }

        // For regular menu items
        if (!menuInfo) return false;

        // For admin, only check if menu exists
        if (isAdmin) {
            return true;
        }

        // For users, check can_list permission
        return menuInfo.access?.can_list === true;
    });

    // Ensure "Return Tracker" is always shown after "Notice Tracker"
    const noticeTrackerIndex = filteredNav.findIndex(item => item.key === 'notice');
    if (noticeTrackerIndex !== -1) {
        const poshItem = {
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
                ]
        };
        const returnItem = {
             key: 'returnTraccker',
            path: '/return-tracker',
            title: 'Return Tracker',
            translateKey: 'nav.return',
            icon: 'remittanceCollapse',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [],
            subMenu: []
        };
        const auditItem ={
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
        }

        // Insert "Return Tracker" after "Notice Tracker"
        filteredNav.splice(noticeTrackerIndex + 1, 0, poshItem, returnItem, auditItem);
    }

    return filteredNav;



};

const SideNav = () => {

    const { login } = store.getState();
    const moduleList = login.user.user.moduleAccess;
    const themeColor = useAppSelector((state) => state.theme.themeColor);
    const primaryColorLevel = useAppSelector((state) => state.theme.primaryColorLevel);
    const navMode = useAppSelector((state) => state.theme.navMode);
    const mode = useAppSelector((state) => state.theme.mode);
    const direction = useAppSelector((state) => state.theme.direction);
    const currentRouteKey = useAppSelector((state) => state.base.common.currentRouteKey);
    const sideNavCollapse = useAppSelector((state) => state.theme.layout.sideNavCollapse);
    const userAuthority = useAppSelector((state) => state.auth.user.authority);
    const userRole = login.user.type;

    const { larger } = useResponsive();

    const filteredAdminNav = filterNavigation(adminnav, moduleList,true);
    const filteredUserNav = filterNavigation(usernav, moduleList,false);

    const nav = login.user.type === 'admin' ? filteredAdminNav : filteredUserNav;

    useEffect(()=>{
        console.log(filteredAdminNav,filteredUserNav)
    },[filterNavigation])
    const sideNavColor = () => {
        if (navMode === NAV_MODE_THEMED) {
            return `bg-${themeColor}-${primaryColorLevel} side-nav-${navMode}`;
        }
        return `side-nav-${navMode}`;
    };

    const logoMode = () => {
        if (navMode === NAV_MODE_THEMED) {
            return NAV_MODE_DARK;
        }
        if (navMode === NAV_MODE_TRANSPARENT) {
            return mode;
        }
        return navMode;
    };

    const menuContent = (
        <VerticalMenuContent
            navMode={navMode}
            collapsed={!sideNavCollapse}
            navigationTree={nav}
            routeKey={currentRouteKey}
            userAuthority={userAuthority as string[]}
            direction={direction}
        />
    );

    const footerContent = (
        <div className="side-nav-footer mt-auto bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mx-4 mb-4 overflow-x-hidden">
            <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3">
                    <HiUserCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">
                        <span className="font-semibold">Role:</span> {userRole}
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {larger.md && (
                <div
                    style={!sideNavCollapse ? sideNavCollapseStyle : sideNavStyle}
                    className={classNames(
                        'side-nav',
                        sideNavColor(),
                        sideNavCollapse && 'side-nav-expand',
                    )}
                >
                    <div className="side-nav-content-content h-full flex flex-col ">
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
            )}
        </>
    );
};

export default SideNav;