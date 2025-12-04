import { lazy } from 'react'
import authRoute from './authRoute'
import { APP_PREFIX_PATH } from '@/constants/route.constant'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/IHRC/components/Home/Home')),
        authority: [],
    },
    {
        key: 'nav.externaluser',
        path: '/external-user',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/ExternalUser/ExternalUser'
                ),
        ),
        authority: [],
    },
     {
        key: 'nav.posh',
        path: '/posh',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/POSH/Posh'
                ),
        ),
        authority: [],
    },
    {
        key: 'nav.committee',
        path: '/committee',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/POSH/components/Comittee'
                ),
        ),
        authority: [],
    },
    {
        key: 'addCommittee',
        path: '/add-committee',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/POSH/components/AddComittee'
                ),
        ),
        authority: [],
    },
    {
        key: 'nav.policy',
        path: '/policy',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/POSH/components/PoshPolicy'
                ),
        ),
        authority: [],
    },
    // {
    //     key: 'Reset Password',
    //     path: '/reset-password',
    //     component: lazy(() => import('@/views/auth/ResetPassword/ResetPassword')),
    //     authority: [],
    // },

    {
        key: 'recommendedList.item1',
        path: '/recommended-checklist',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/AuditChecklist/RecommendedList/RecommendedList'
                ),
        ),
        authority: [],
    },

    {
        key: 'complianceDetail.statusItem',
        path: `${APP_PREFIX_PATH}/IHRC/compliance-reupload/:complianceID`,
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/AuditChecklist/ReuploadDocument/ReuploadDocument'
                ),
        ),
        authority: [],
    },
    {
        key: 'complianceDetail.complianceItem',
        path: `${APP_PREFIX_PATH}/IHRC/compliance-list-detail/:complianceID`,
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/AuditChecklist/ComplianceRowDetails/ComplianceRowDetails'
                ),
        ),
        authority: [],
    },
    {
        key: 'historyDetail.complianceItem',
        path: `${APP_PREFIX_PATH}/IHRC/history-list-detail/:complianceID`,
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/AuditChecklist/HistoryPage/components/ViewDetails'
                ),
        ),
        authority: [],
    },
    {
        key: 'assignComplianceDetail.complianceItem',
        path: `${APP_PREFIX_PATH}/IHRC/assign-list-detail/:complianceID`,
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/AuditChecklist/AssignChecklist/components/AssignComplianceDetails'
                ),
        ),
        authority: [],
    },
    {
        key: 'complianceStatusDetail.complianceItem',
        path: `${APP_PREFIX_PATH}/IHRC/compliance-status-list-detail/:complianceID`,
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/AuditChecklist/Status/components/ViewDetails'
                ),
        ),
        authority: [],
    },

    {
        key: 'branchInputDetail.item',
        path: `/add-branch`,
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/Entity/Branch/components/BranchForm'
                ),
        ),
        authority: [],
    },
    {
        key: 'branchAgreement.item',
        path: `/edit-branch-agreement`,
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/Entity/BranchAgreements/components/BranchAgreementEditForm'
                ),
        ),
        authority: [],
    },
    {
        key: 'branchl.item',
        path: `/edit-branch`,
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/Entity/Branch/components/EditBranchForm'
                ),
        ),
        authority: [],
    },
    {
        key: 'branchAgreement.item',
        path: '/branch-agreement-form',
        component: lazy(
            () => 
                import (
                    '@/views/IHRC/components/Entity/BranchAgreements/components/BranchAgreementForm'
                )
        ),
        authority: [],
    },

    {
        key: 'userEntity.add',
        path: `/add-user`,
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/UserEntity/components/UserAddForm'
                ),
        ),
        authority: [],
    },
    {
        key: 'userEntity.edit',
        path: `/edit-user`,
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/UserEntity/components/UpdateUser'
                ),
        ),
        authority: [],
    },
     {
        key: 'auditorEntity.add',
        path: `/add-auditor`,
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/AuditorSetup/components/AuditorAddForm'
                ),
        ),
        authority: [],
    },
    {
        key: 'auditorEntity.edit',
        path: `/edit-auditor`,
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/AuditorSetup/components/AuditorEditForm'
                ),
        ),
        authority: [],
    },
    {
        key: 'pfSetup.edit',
        path: `/pfsetup-edit`,
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/Entity/PFSetup/components/PFEditPage'
                ),
        ),
        authority: [],
    },

    {
        key: 'assignChecklist.item3',
        path: '/compliance-checklist',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/AuditChecklist/AuditChecklistPage/AuditChecklistPage'
                ),
        ),
        authority: [],
    },
    {
        key: 'customChecklist.item4',
        path: '/custom-checklist',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/AuditChecklist/CustomChecklist/CustomChecklist'
                ),
        ),
        authority: [],
    },
    {
        key: 'dueCompliance.item5',
        path: '/due-compliance',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/AuditChecklist/DueCompliance/DueCompliance'
                ),
        ),
        authority: [],
    },
    {
        key: 'status.item6',
        path: '/status',
        component: lazy(
            () =>
                import('@/views/IHRC/components/AuditChecklist/Status/Status'),
        ),
        authority: [],
    },
    {
        key: 'complianceCertificate.item7',
        path: '/compliance-certificate',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/AuditChecklist/ComplianceCertificate/ComplianceCertificate'
                ),
        ),
        authority: [],
    },
    {
        key: 'history.item8',
        path: '/history',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/AuditChecklist/HistoryPage/HistoryPage'
                ),
        ),
        authority: [],
    },
    {
        key: 'customChecklist.customChecklistForm',
        path: '/assign-custom-form',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/AuditChecklist/CustomChecklist/components/AssignCustomFormPage'
                ),
        ),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item1',
        path: '/global-certificate',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/GlobalSettings/CertificateTemplate/CertificateTemplate'
                ),
        ),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item6',
        path: '/role',
        component: lazy(
            () => import('@/views/IHRC/components/GlobalSettings/Role/Role'),
        ),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item2',
        path: '/global-notification',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/GlobalSettings/NotificationSettings/NotificationSettings'
                ),
        ),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item3',
        path: '/all-notification',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/GlobalSettings/NotificationSettings/components/AllNotification'
                ),
        ),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item3',
        path: '/global-status',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/GlobalSettings/StatusSettings/StatusSettings'
                ),
        ),
        authority: [],
    },
    // {
    //     key: 'customFields',
    //     path: `${APP_PREFIX_PATH}/custom-fields`,
    //     component: lazy(() => import('@/views/IHRC/components/GlobalSettings/CustomField/CustomField')),
    //     authority: [],
    // },
    {
        key: 'groupMenu.collapse.item4',
        path: '/custom-fields',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/GlobalSettings/CustomField/CustomField'
                ),
        ),
        authority: [],
    },
    //     {
    //         key: 'groupMenu.collapse.item5',
    //         path: '/register-template',
    //         component: lazy(() =>
    //             import('@/views/IHRC/components/GlobalSettings/RegisterTemplate/RegisterTemplate')
    //     ),
    //     authority: [],
    // },
    {
        key: 'customFields.moduleDetail',
        path: `${APP_PREFIX_PATH}/custom-fields/:moduleValue`,
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/GlobalSettings/CustomField/components/ModuleCustomFields'
                ),
        ),
        authority: [],
    },
    {
        key: 'entityMenu.collapse.item1',
        path: '/company-group',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/Entity/CompanyGroup/CompanyGroup'
                ),
        ),
        authority: [],
    },
    {
        key: 'entityMenu.collapse.item2',
        path: '/company-name',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/Entity/CompanyName/CompanyName'
                ),
        ),
        authority: [],
    },
    {
        key: 'entityMenu.collapse.item3',
        path: '/state',
        component: lazy(
            () => import('@/views/IHRC/components/Entity/State/State'),
        ),
        authority: [],
    },
    {
        key: 'entityMenu.collapse.item4',
        path: '/district',
        component: lazy(
            () => import('@/views/IHRC/components/Entity/District/District'),
        ),
        authority: [],
    },
    {
        key: 'entityMenu.collapse.item5',
        path: '/location',
        component: lazy(
            () => import('@/views/IHRC/components/Entity/Location/Location'),
        ),
        authority: [],
    },
    {
        key: 'entityMenu.collapse.item6',
        path: '/branch',
        component: lazy(
            () => import('@/views/IHRC/components/Entity/Branch/Branch'),
        ),
        authority: [],
    },
    {
        key: 'entityMenu.collapse.item7',
        path: '/Edit-permission',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/Entity/CompanyName/components/EditPermission'
                ),
        ),
        authority: [],
    },
    {
        key: 'entityMenu.collapse.item8',
        path: '/Notice-Edit-permission',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/GlobalSettings/NoticeEditPermission/NoticeEditPermission'
                ),
        ),
        authority: [],
    },
    {
        key: 'entityMenu.collapse.item8',
        path: '/agreements',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/Entity/BranchAgreements/BranchAgreements'
                ),
        ),
        authority: [],
    },
    // {
    //     key: 'entityMenu.collapse.item8',
    //     path:  '/User-access-permission',
    //     component: lazy(() => import('@/views/IHRC/components/UserEntity/components/UserModuleAccess')),
    //     authority: [],
    //   },
    {
        key: 'entityMenu.pfSetup',
        path: `${APP_PREFIX_PATH}/IHRC/pf-setup/:companyName`,
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/Entity/PFSetup/CompanyPFSetupPage'
                ),
        ),
        authority: [],
    },
    {
        key: 'entityMenu.esiSetup',
        path: `${APP_PREFIX_PATH}/IHRC/esi-setup/:companyName`,
        component: lazy(
            () => import('@/views/IHRC/components/Entity/ESICSetup/EsicSetup'),
        ),
        authority: [],
    },
    {
        key: 'entityMenu.LWFSetup',
        path: `${APP_PREFIX_PATH}/IHRC/lwf-setup/:companyName`,
        component: lazy(
            () => import('@/views/IHRC/components/Entity/LWFSetup/LWFSetup'),
        ),
        authority: [],
    },
    {
        key: 'entityMenu.ptSetup',
        path: `${APP_PREFIX_PATH}/IHRC/pt-setup/:companyName`,
        component: lazy(
            () => import('@/views/IHRC/components/Entity/PTSetup/PTSetup'),
        ),
        authority: [],
    },
    {     
        key: 'entityMenu.poshSetup',
        path: `${APP_PREFIX_PATH}/IHRC/posh-setup/:companyName`,
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/Entity/PoshSetup/PoshSetup'
                ),
        ),
        authority: [],
    },
    {
        key: 'entityMenu.companyDetails',
        path: `${APP_PREFIX_PATH}/IHRC/company-details/:companyName`,
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/Entity/CompanyDetails/CompanyDetails'
                ),
        ),
        authority: [],
    },
    {
        key: 'companySetup.collapse.userSetup',
        path: '/user-entity',
        component: lazy(
            () => import('@/views/IHRC/components/UserEntity/UserEntity'),
        ),
        authority: [],
    },
     {
        key: 'companySetup.collapse.auditorSetup',
        path: '/auditor-entity',
        component: lazy(
            () => import('@/views/IHRC/components/AuditorSetup/AuditorEntity'),
        ),
        authority: [],
    },
    {
        key: 'companySetup.collapse.userAccess',
        path: '/userAccess',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/UserEntity/components/UserModuleAccess'
                ),
        ),
        authority: [],
    },
    // {
    //     key: 'customChecklist.customChecklistForm',
    //     path: '/add-user-form',
    //     component: lazy(() => import('@/views/IHRC/components/UserEntity/components/UserAddForm')),
    //     authority: [],
    // },
    {
        key: 'remittanceTracker.collapse.item1',
        path: '/pf-tracker',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/RemittanceTracker/PFTracker/PFTracker'
                ),
        ),
        authority: [],
    },
    {
        key: 'remittanceTracker.collapse.item2',
        path: '/esi-tracker',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/RemittanceTracker/ESITracker/ESITracker'
                ),
        ),
        authority: [],
    },
    {
        key: 'remittanceTracker.collapse.item6',
        path: '/pfiw-tracker',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/RemittanceTracker/PFIWTracker/PFIWTracker'
                ),
        ),
        authority: [],
    },
    {
        key: 'remittanceTracker.collapse.item3',
        path: '/lwf-tracker',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/RemittanceTracker/LWFTracker/LWFTracker'
                ),
        ),
        authority: [],
    },
    {
        key: 'remittanceTracker.collapse.item4',
        path: '/ptrc-tracker',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/RemittanceTracker/PTRCTracker/PTRCTracker'
                ),
        ),
        authority: [],
    },
    {
        key: 'remittanceTracker.collapse.item5',
        path: '/ptec-tracker',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/RemittanceTracker/PTECTracker/PTECTracker'
                ),
        ),
        authority: [],
    },
    {
        key: 'remittanceTracker.collapse.item7',
        path: '/notice-tracker',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/RemittanceTracker/S&ETracker/SandETracker'
                ),
        ),
        authority: [],
    },
    {
        key: 'noticeTracker.response',
        path: '/notice-tracker/response',
        component: lazy(
            () =>
              import(
                '@/views/IHRC/components/RemittanceTracker/S&ETracker/components/NoticeResponsePage'
              )
        ),
        authority: [],
    },
    {
        key: 'noticeTracker.followupNotice',
        path: '/notice-tracker/followUpNotice',
        component: lazy(
            () =>
              import(
                '@/views/IHRC/components/RemittanceTracker/S&ETracker/components/NoticeFollowUpPage'
              )
        ),
        authority: [],
    },
    {
        key: 'noticeTracker.replyHistory',
        path: '/notice-tracker/replyhistory',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/RemittanceTracker/S&ETracker/components/NoticeTimelinePage'
                ),
        ),
        authority: [],
    },
    {
        key: 'returnTracker',
        path: '/return-tracker',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/ReturnTracker/ReturnTracker'
                ),
        ),
        authority: [],
    },
    {
        key: 'returnTracker.add',
        path: '/add-return-tracker',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/ReturnTracker/components/ReturnTrackerAddForm'
                ),
        ),
        authority: [],
    },
    {
        key: 'returnTracker.edit',
        path: '/edit-return-tracker',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/ReturnTracker/components/ReturnTrackerEditForm'
                ),
        ),
        authority: [],
    },
    {
        key: 'remittanceTrackerCreate.collapse.item7',
        path: '/notice-tracker/create',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/RemittanceTracker/S&ETracker/components/NoticeFormPage'
                ),
        ),
        authority: [],
    },
    {
        key: 'pftracker.uploadeddetail',
        path: '/uploadedpfdetail',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/RemittanceTracker/PFTracker/components/UploadedPFDetails'
                ),
        ),
        authority: [],
    },
    {
        key: 'esitracker.uploadeddetail',
        path: '/uploadedesidetails',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/RemittanceTracker/ESITracker/components/UploadedESIDetails'
                ),
        ),
        authority: [],
    },
    {
        key: 'ptrctracker.uploadeddetail',
        path: '/uploadedptrcdetail',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/RemittanceTracker/PTRCTracker/components/UploadedPTRCDetails'
                ),
        ),
        authority: [],
    },
    // {
    //     key: 'ptrctracker.uploadeddetail',
    //     path: '/uploadedptrcdetail',
    //     component: lazy(() => import('@/views/IHRC/components/RemittanceTracker/PTRCTracker/components/UploadedPTRCDetails')),
    //     authority: [],
    // },
    {
        key: 'ptectracker.uploadeddetail',
        path: '/uploadedptecdetail',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/RemittanceTracker/PTECTracker/components/UploadedPTECDetails'
                ),
        ),
        authority: [],
    },
    {
        key: 'pfiwtracker.uploadeddetail',
        path: '/uploadedpfiwdetail',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/RemittanceTracker/PFIWTracker/components/UploadedPFIWDetails'
                ),
        ),
        authority: [],
    },
    {
        key: 'lwftracker.uploadeddetail',
        path: '/uploadedLWFdetails',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/RemittanceTracker/LWFTracker/components/UploadedLWFDetails'
                ),
        ),
        authority: [],
    },
    {
        key: 's&eTracker.uploadeddetail',
        path: '/uploadeds&eDetails',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/RemittanceTracker/S&ETracker/components/UploadedSandEDetails'
                ),
        ),
        authority: [],
    },
    {
        key: 'pfSetup.adddetail',
        path: '/add-pf-setup',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/Entity/PFSetup/components/PFSetupPage'
                ),
        ),
        authority: [],
    },
    {
        key: 'role.permission',
        path: '/role-permission',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/GlobalSettings/Role/components/RolePermission'
                ),
        ),
        authority: [],
    },
    {
        key: 'user.permission',
        path: '/user-permission',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/UserEntity/components/UserPermission'
                ),
        ),
        authority: [],
    },
    {
        key: 'ptSetup.adddetail',
        path: '/add-pt-setup',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/Entity/PTSetup/components/PTSetupPage'
                ),
        ),
        authority: [],
    },

    {
        key: 'nav.register',
        path: '/register',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/Register/Register'
                ),
        ),
        authority: [],
    },
    // {
    //     key: 'register.collapse.item1',
    //     path: '/salary-register-input',
    //     component: lazy(
    //         () =>
    //             import(
    //                 '@/views/IHRC/components/Registers&Return/input/SalaryRegister/SalaryRegister'
    //             ),
    //     ),
    //     authority: [],
    // },
    // {
    //     key: 'register.collapse.item2',
    //     path: '/attendance-register-input',
    //     component: lazy(
    //         () =>
    //             import(
    //                 '@/views/IHRC/components/Registers&Return/input/AttendanceRegister/AttendanceRegister'
    //             ),
    //     ),
    //     authority: [],
    // },
    // {
    //     key: 'register.collapse.item3',
    //     path: '/leave-register-input',
    //     component: lazy(
    //         () =>
    //             import(
    //                 '@/views/IHRC/components/Registers&Return/input/LeaveRegister/LeaveRegister'
    //             ),
    //     ),
    //     authority: [],
    // },
    // {
    //     key: 'register.collapse.item4',
    //     path: '/bonus-register-input',
    //     component: lazy(
    //         () =>
    //             import(
    //                 '@/views/IHRC/components/Registers&Return/input/BonusRegister/BonusRegister'
    //             ),
    //     ),
    //     authority: [],
    // },
    // {
    //     key: 'register.collapse.item5',
    //     path: '/maternity-register-input',
    //     component: lazy(
    //         () =>
    //             import(
    //                 '@/views/IHRC/components/Registers&Return/input/MaternityRegister/MaternityRegister'
    //             ),
    //     ),
    //     authority: [],
    // },

    // {
    //     key: 'register.collapse.item1',
    //     path: '/output-register',
    //     component: lazy(
    //         () =>
    //             import(
    //                 '@/views/IHRC/components/Registers&Return/output/OutputRegisters/OutputRegisters'
    //             ),
    //     ),
    //     authority: [],
    // },

    {
        key: 'editRequestDetail',
        path: '/request-tracker-detail',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/Entity/CompanyName/components/EditRequestDetails'
                ),
        ),
        authority: [],
    },
    {
        key: 'trackerTimeline',
        path: '/trackerTimeline',
        component: lazy(
            () =>
                import(
                    '@/views/IHRC/components/RemittanceTracker/PFIWTracker/components/TrackerTimeline'
                ),
        ),
        authority: [],
    },
]
