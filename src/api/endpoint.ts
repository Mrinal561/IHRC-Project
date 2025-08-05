const api = (endpoint: string) =>
    `${import.meta.env.VITE_API_GATEWAY}${endpoint}`

export const endpoints = {
    auth: {
        login: () => api('companyadmin/login'),
        refresh: () => api('companyadmin/refresh'),
        signup: () => api('companyadmin/signup'),
        logout: () => api('companyadmin/logout'),
        profile: () => api('companyadmin/profile'),
    },
    companyGroup: {
        getAll: () => api('companyadmin/company-group'),
        getById: (id: string) => api(`companyadmin/company-group/${id}`),
        create: () => api('companyadmin/company-group'),
        update: (id: string) => api(`companyadmin/company-group/${id}`),
        delete: (id: string) => api(`companyadmin/company-group/${id}`),
    },
    company: {
        getAll: () => api('companyadmin/company'),
        getById: (id: string) => api(`companyadmin/company/${id}`),
        create: () => api('companyadmin/company'),
        update: (id: string) => api(`companyadmin/company/${id}`),
        delete: (id: string) => api(`companyadmin/company/${id}`),
        downloadFormat: () => api(`/companyadmin/company/export-template`),
        bulkCreate: () => api(`/companyadmin/company/bulk-upload`),
        companyList: () => api('company')
    },
    common: {
        getAll: () => api('/company-group'),
        state: () => api('/states'),
        district: () => api('/district'),
        location: () => api('/location'),
        getSubCategory: () => api('/subcategory-suggestions'),
        createSubCategory: () => api('/subcategory'),
        agreementTypeSuggestions: () => api('/agreement-type-suggestions'),
        createAgreementType: () => api('/agreement-type'),
       

    },
    user: {
        getAll: () => api('companyadmin/user'),
        getById: (id: any) => api(`companyadmin/user/${id}`),
        create: () => api('companyadmin/user'),
        update: (id: string) => api(`companyadmin/user/${id}`),
        delete: (id: string) => api(`companyadmin/user/${id}`),
        updatePermission:(id:any)=> api(`companyadmin/user/permissions/${id}`),
        bulkCreate:()=> api(`companyadmin/user/user-bulkUpload`),
        downloadFormat:()=> api(`companyadmin/user/user-template`),
        downloadData: () => api('companyadmin/user/user-data/export')

    },
    auditor: {
        listAuditor: () => api('companyadmin/auditor'),
        auditorDetail: (id:any) => api(`companyadmin/auditor/${id}`),
        auditorUpdate: (id:any) => api(`companyadmin/auditor/${id}`),
        auditorCreate: () => api('companyadmin/auditor'),
        auditorDelete: (id:any) => api(`companyadmin/auditor/${id}`),
        downloadFormat: () => api('companyadmin/auditor/template/download'),
        auditorExport: () => api('companyadmin/auditor/export/data'),
        auditorBulkUpload: () => api('companyadmin/auditor/bulk-upload')

    },
    complianceSuperadmin: {
        getAll: () => api('/companyadmin/compliance/recommend'),
        // getAll: () => api('/companyadmin/compliance/recommend'),
    },
    assign: {
        create: () => api('companyadmin/compliance'),
        getAll: () => api('companyadmin/compliance'),
        // create: () => api('companyadmin/compliance'),
        // getAll: () => api('companyadmin/compliance'),
        update: () => api(`companyadmin/compliance/assign-user`),
    },
    due: {
        getAll: () => api('companyadmin/compliance/data'),
        updateStatus: (id: string) =>
            api(`/companyadmin/compliance/data/update/${id}`),
    },
    branch: {
        getAll: () => api('companyadmin/branch'),
        getAllBranch: () => api('companyadmin/branch/all'),
        getById: (id: string) => api(`companyadmin/branch/${id}`),
        create: () => api('companyadmin/branch'),
        update: (id: string) => api(`companyadmin/branch/${id}`),
        // update: (id: string) => api(`companyadmin/branch/${id}`),
        delete: (id: string) => api(`companyadmin/branch/${id}`),
        downloadFormat: () => api(`companyadmin/branch/download-template`),
        bulkCreate: () => api(`/companyadmin/branch/bulk-upload`),
        downloadData: () => api('companyadmin/branch/branch-data/export')
    },
    role: {
        getAll: () => api('companyadmin/role'),
        create:()=> api(`companyadmin/role`),
        update:(id:any)=> api(`companyadmin/role/${id}`),
        getById:(id:any)=> api(`companyadmin/role/${id}`),
        delete:(id:any)=> api(`companyadmin/role/${id}`),
        bulkCreate:()=> api(`/companyadmin/role/bulk-upload`),
        download: () => api(`/companyadmin/role/export`),
        downloadFormat: () => api(`/companyadmin/role/designation-template`),
        rolePermission:(id:any) => api(`/companyadmin/role/role-permission/${id}`)
    },
    compliance: {
        createCustomChecklist: () => api('companyadmin/compliance/checklists'),
        updateCustomChecklist: (id:any) => api(`companyadmin/compliance/checklists/${id}`),
        detailCustomChecklist: (id:any) => api(`companyadmin/compliance/checklists/${id}`),
        deleteCustomChecklist: (id:any) => api(`companyadmin/compliance/checklists/${id}`),
        exportCustomChecklist: () => api('companyadmin/compliance/checklists/export/data'),
        downloadCustomChecklistTemplate: () => api('companyadmin/compliance/checklists/export/template'),
        listCustomChecklist: () => api('companyadmin/compliance/checklists'),
        downloadComplianceTemplate: () => api('companyadmin/compliance/checklists/checklist/template'),
        bulkUploadCompliance: () => api('companyadmin/compliance/checklists/bulk-upload'),
        listComplianceChecklist: () => api('companyadmin/compliance/checklists/checklist'),
        downloadComplianceChecklist: () => api('companyadmin/compliance/checklists/download'),
        detailComplianceChecklist: (id:any) => api(`companyadmin/compliance/checklists/checklist/${id}`),
        editComplianceChecklist: (id:any) => api(`companyadmin/compliance/checklists/checklist/${id}`),
        dueComplianceList: () => api('companyadmin/compliance/checklists/due-compliance'),
        dueComplianceOwnerList: () => api('companyadmin/compliance/checklists/owner'),
        dueComplianceApproverList: () => api('companyadmin/compliance/checklists/approver'),
        dueComplianceAuditorList: () => api('companyadmin/compliance/checklists/auditor'),
        dueComplianceDocumentUpload: (id:any) => api(`companyadmin/compliance/checklists/upload-base64/${id}`),
        rejectOwnerCompliance: (id:any) => api(`companyadmin/compliance/checklists/reject/${id}`),
        approveOwnerCompliance: (id:any) => api(`companyadmin/compliance/checklists/approve/${id}`),
        approveApproverCompliance: (id:any) => api(`companyadmin/compliance/checklists/auditor/approve/${id}`),
        rejectApproverCompliance: (id:any) => api(`companyadmin/compliance/checklists/auditor/reject/${id}`),
        detailDueCompliance: (id:any) => api(`companyadmin/compliance/checklists/due-compliance/${id}`),
        complianceHistoryList: () => api('companyadmin/compliance/checklists/history'),
        downloadComplianceHistory: () => api('companyadmin/compliance/checklists/history-checklist'),
        listCertificate: () => api('companyadmin/compliance/checklists/certificate'),
        creteCertificate: () => api('companyadmin/compliance/checklists/compliance-certificate'),
        downloadCertificate: (id:any) => api(`companyadmin/compliance/checklists/compliance-certificate/download/${id}`),
        bulkCustomCompliance: () => api('companyadmin/compliance/checklists/bulk-upload-custom-checklist'),
        dueComplianceDocumentDownload: (id:any) => api(`/companyadmin/compliance/checklists/due-compliance-document/${id}`),
        updateComplianceOwnership: (id:any) => api(`companyadmin/compliance/checklists/update-ownership/${id}`)
    },
    esiSetup: {
        getAll: () => api('companyadmin/esisetup'),
        getById: (id: string) => api(`companyadmin/esisetup/${id}`), 
        create: () => api('companyadmin/esisetup'),
        // download: () => api(`companyadmin/esisetup/esi-tracker/export`)
         update: (id: any) => api(`/companyadmin/esisetup/${id}`),
         delete: (id:any) => api(`companyadmin/esisetup/${id}`),
         getAllCodes:()=> api('esi-code'),
         downloadFormat: (id:any) => api(`/companyadmin/esisetup/template/download?company_id=${id}`),
         downloadData: () => api('/companyadmin/esisetup/esisetup-data/export'),
         bulkCreate: () => api('/companyadmin/esisetup/bulk-upload'),
    },
    pfSetup: {
        getAll: () => api('companyadmin/pfsetup'),
        create: () => api('companyadmin/pfsetup'),
        getById: (id: any) => api(`companyadmin/pfsetup/${id}`),
        update: (id: any) => api(`/companyadmin/pfsetup/${id}`),
        delete: (id:any) => api(`companyadmin/pfsetup/${id}`),
        getAllCodes:()=> api('pf-code')
    },
    ptSetup: {
        getAll: () => api('companyadmin/ptsetup'),
        create: () => api('companyadmin/ptsetup'),
        getById: (id: any) => api(`companyadmin/ptsetup/${id}`),
        update: (id: any) => api(`companyadmin/ptsetup/${id}`),
        delete: (id:any) => api(`companyadmin/ptsetup/${id}`),
        getAllCodes:()=> api('ptec-code'),
        rcCodes:()=>  api('ptrc-code'),
        downloadFormat:(id:any)=> api(`companyadmin/ptsetup/template/download?company_id=${id}`),
        bulkCreate:()=> api('companyadmin/ptsetup/bulk-create'),
        downloadData: () => api('companyadmin/ptsetup/ptsetup-data/export')
    },
    registerSetup: {
        createRegisterSetup: () => api('companyadmin/register/register-setup'),
        updateRegisterSetup: (id:any) => api(`companyadmin/register/register-setup/${id}`),
        listRegisterSetup: () => api('companyadmin/register/register-setup')
    },
    tracker: {
        downloadFormat: () => api('/companyadmin/pfsetup/pf-tracker/exportdata'),
        pfUpload: () => api('companyadmin/pfsetup/pf-tracker'),
        pfGetALl: () => api(`companyadmin/pfsetup/pf-tracker`),
        uploadDocs: (id: any) =>
            api(`companyadmin/pfsetup/pf-tracker/document/${id}`),
        downloadALl: () => api('/companyadmin/pfsetup/pf-tracker/export'),
        getById: (id: any) => api(`companyadmin/pfsetup/pf-tracker/${id}`),
        delete: (id: string) => api(`companyadmin/pfsetup/pf-delete/${id}`),
        update: (id: any) => api(`/companyadmin/pfsetup/pf-tracker/${id}`),
    },
    esiTracker: {
        getAll: () => api(`companyadmin/esisetup/esi-tracker`),
        bulkUpload: () => api(`companyadmin/esisetup/esi-tracker`),
        download: () => api('/companyadmin/esisetup/esi-tracker/exportdata'),
        uploadDocs: (id: any) =>
            api(`companyadmin/esisetup/esi-tracker/challan/${id}`),
        downloadAll: () => api('/companyadmin/esisetup/esi-tracker/export'),
        getById: (id: any) => api(`companyadmin/esisetup/esi-tracker/${id}`),
        delete: (id: string) => api(`companyadmin/esisetup/esi-delete/${id}`),
        update: (id: any) => api(`/companyadmin/esisetup/esi-tracker/${id}`),
    },
    ptrc: {
        download: () => api('/companyadmin/ptsetup/ptrc-tracker/exportdata'),
        bulkUpload: () => api('companyadmin/ptsetup/ptrc-tracker'),
        getAll: () => api('/companyadmin/ptsetup/ptrc-tracker'),
        uploadDocs: (id: any) =>
            api(`/companyadmin/ptsetup/ptrc-tracker/document/${id}`),
        downloadAll: () => api('/companyadmin/ptsetup/ptrc-tracker/export'),
        delete: (id: any) => api(`companyadmin/ptsetup/ptrc-delete/${id}`),
        getById: (id: any) => api(`companyadmin/ptsetup/ptrc-tracker/${id}`),
         update: (id: any) => api(`/companyadmin/ptsetup/ptrc-tracker/${id}`),
    },
    // ptTracker: {
    //     getAll: () => api(`companyadmin/esisetup/esi-tracker`),
    //     bulkUpload: () => api(`companyadmin/esisetup/esi-tracker`),
    //     download: () => api(`upload/sample_files/esi-tracker.xlsx`)
    //    },
    ptTracker: {
        getAll: () => api(`companyadmin/esisetup/esi-tracker`),
        bulkUpload: () => api(`companyadmin/esisetup/esi-tracker`),
        download: () => api(`upload/sample_files/esi-tracker.xlsx`),
    },
    ptec: {
        download: () => api('/companyadmin/ptsetup/ptec-tracker/exportdata'),
        // download: () => api('upload/sample_files/ptec-tracker.xlsx'),
        bulkUpload: () => api('/companyadmin/ptsetup/ptec-tracker'),
        getAll: () => api('/companyadmin/ptsetup/ptec-tracker'),
        uploadDocs: (id: any) =>
            api(`/companyadmin/ptsetup/ptec-tracker/document/${id}`),
        downloadAll: () => api('/companyadmin/ptsetup/ptec-tracker/export'),
        delete: (id: any) => api(`companyadmin/ptsetup/ptec-delete/${id}`),
        getById: (id: any) => api(`companyadmin/ptsetup/ptec-tracker/${id}`),
        update: (id: any) => api(`/companyadmin/ptsetup/ptec-tracker/${id}`),
    },
    poshSetup: {
    detail: (id:any) => api(`companyadmin/posh-setup/${id}`),
    list: () => api('companyadmin/posh-setu'),
    createUpdate: () => api('companyadmin/posh-setup'),
    downloadTemplate: () => api('companyadmin/posh-setup/template'),
    bulkCreate: () => api('companyadmin/posh-setup/bulk-upload'),
    detailbyCompany: (id: any) => api(`companyadmin/posh-setup/company/${id}`),
    committeeList: () => api("companyadmin/posh-setup/committees"),
    committeeData: () => api("companyadmin/posh-setup/committee/export"),
    createCommittee: () => api("companyadmin/posh-setup/committee"),
    createBulkCommittee: () => api("companyadmin/posh-setup/committee/bulk-upload"),
    BulkCommitteeRepors: () => api("companyadmin/posh-setup/committee/bulk-download"),
    committeeTemplate: () => api("companyadmin/posh-setup/committee/template"),
    createPoshReturn: () => api("companyadmin/posh-setup/posh-return"),
    poshReturnList: () => api("companyadmin/posh-setup/posh-return/list"),
    poshReturnExport: () => api("companyadmin/posh-setup/posh-return/export"),
    poshCommitteeExport: () => api("companyadmin/posh-setup/committee/export"),
    poshReturnBulkDocumentDownload: () => api("companyadmin/posh-setup/posh-return/bulk-download"),
    poshReturnIndividualDocumentDownload: (id: any) => api(`companyadmin/posh-setup/posh-return/report/${id}`),
    poshCommitteeIndividualDocumentDownload: (id: any) => api(`/companyadmin/posh-setup/committee/policy/${id}`),
    createPolicy: () => api("companyadmin/posh-setup/policy"),
    downloadPolicy: (id:any) => api(`companyadmin/posh-setup/policy/download/${id}`),
    downloadBulkPolicy: () => api("companyadmin/posh-setup/policy/download"),
    listPolicy: () => api("companyadmin/posh-setup/policy/list"),
    policyTemplate: () => api("companyadmin/posh-setup/policy/template"),
    policyBulkCreate: () => api("companyadmin/posh-setup/policy/bulk-upload"),
    policyDelete: (id:any) => api(`companyadmin/posh-setup/policy/${id}`),
    poshSetupDocumentDownload: (id:any) => api(`companyadmin/posh-setup/posh-setup/document-download/${id}`)
    },
    
    pfiwtracker: {
        download: () => api('companyadmin/pfsetup/pfiw-tracker/exportdata'),
        bulkupload: () => api('/companyadmin/pfsetup/pfiw-tracker'),
        pfiwGetAll: () => api('/companyadmin/pfsetup/pfiw-tracker'),
        challanupload: (id: any) =>
            api(`/companyadmin/pfsetup/pfiw-tracker/document/${id}`),
        downloadALl: () => api('/companyadmin/pfsetup/pfiw-tracker/export'),
        delete: (id: any) => api(`companyadmin/pfsetup/pfiw-delete/${id}`),
        getById: (id: any) => api(`companyadmin/pfsetup/pfiw-tracker/${id}`),
        update: (id: any) => api(`/companyadmin/pfsetup/pfiw-tracker/${id}`),
    },
    lwftracker: {
        downlaodAll: () => api(`/companyadmin/lwfsetup/lwf-tracker/export`),
        download: () => api('companyadmin/lwfsetup/lwf-tracker/exportdata'),
        bulkupload: () => api('/companyadmin/lwfsetup/lwf-tracker'),
        lwfGetAll: () => api('companyadmin/lwfsetup/lwf-tracker'),
        upload: (id: any) =>
            api(`/companyadmin/lwfsetup/lwf-tracker/payment-receipt/${id}`),
        getById: (id: any) => api(`companyadmin/lwfsetup/lwf-tracker/${id}`),
        delete: (id: any) => api(`companyadmin/lwfsetup/lwf-delete/${id}`),
        update: (id: any) => api(`/companyadmin/lwfsetup/lwf-tracker/${id}`),
    },
    lwfSetup: {
        getAll: () => api('/companyadmin/lwfsetup'),
        create: () => api('/companyadmin/lwfsetup'),
        getById: (id: any) => api(`companyadmin/lwfsetup/${id}`),
          update: (id: any) => api(`companyadmin/lwfsetup/${id}`),
          delete: (id:any) => api(`companyadmin/lwfsetup/${id}`),
          getAllCodes:()=> api('lwf-code'),
          downloadFormat:(id:any)=> api(`companyadmin/lwfsetup/template/download?company_id=${id}`),
          bulkCreate:()=> api('companyadmin/lwfsetup/bulk-create'),
          download: () => api('/companyadmin/lwfsetup/lwfsetup-data/export')
    },
    request: {
        request: (id: any) => api(`companyadmin/company/edit-request/${id}`),
        getAll:() => api(`companyadmin/company/tracker-edit-permission`),
        requestEdit: () => api('companyadmin/noticetracker/request-edit-permission'),
        getAllNoticeRequest: () => api(`companyadmin/noticetracker/edit-history`),
        canEdit: (id: any) => api(`companyadmin/company/can-edit/${id}`),
        requestEditApproval: () => api('companyadmin/company/request-edit'),
        rejectRequest: (id: any) => api(`companyadmin/company/reject/${id}`),
        requestDetail: (id: any) => api(`companyadmin/company/edit-request-details/${id}`),
        trackerTimeline: () => api('companyadmin/company/trackerTimeline')
    },
    certificate:{
        list: ()=> api('/companyadmin/certificate/list'),
        certificateDownload: (id:any)=> api(`/companyadmin/certificate/download/${id}`)
    },
    noticeTracker:{
        create: () => api('/companyadmin/noticetracker'),
        followupNoticeCreate: (id:any) => api(`/companyadmin/noticetracker/followup/${id}`),
        update: (id:any) => api(`/companyadmin/noticetracker/${id}`),
        list:()=> api('companyadmin/noticetracker'),
        detail: (id:any) => api(`/companyadmin/noticetracker/${id}`),
        delete: (id:any) => api(`/companyadmin/noticetracker/${id}`),
        timeline: (id: any) => api(`/companyadmin/noticeTracker/timeline/${id}`),
        noticeReply: (id: any) => api(`/companyadmin/noticeTracker/reply/${id}`),
        createNoticeType:()=> api(`/companyadmin/noticeTracker/notice-type`),
        noticeTypeSuggestions:() => api(`/companyadmin/noticeTracker/notice-type`),
        createNoticeActType:() => api(`/companyadmin/noticeTracker/notice-act`),
        noticeActSuggestions:() => api(`/companyadmin/noticeTracker/notice-act`),
        noticeStatusSuggestions: () => api(`/companyadmin/noticeTracker/status`),
        createNoticeStatusSuggestions: () => api(`/companyadmin/noticeTracker/status`),
        noticeCriticalitySuggestion: () => api(`/companyadmin/noticeTracker/criticality`),
        createNoticeCriticalitySuggestion: () => api(`/companyadmin/noticeTracker/criticality`),
        download:()=> api(`companyadmin/noticetracker/download-notice-data`),
        followUpNoticeDetail: (id: any) => api(`companyadmin/noticetracker/followup/${id}`),
        updateFollowupNotice: (id: any) => api(`companyadmin/noticetracker/followup/${id}`),
        replyNoticeDetail: (id: any) => api(`companyadmin/noticetracker/reply/${id}`),
        updateReplyNotice: (id: any) => api(`companyadmin/noticetracker/reply/${id}`),
    },
    permission:{
        approveRequest:(id: any) => api(`companyadmin/company/approve/${id}`),
        approveNoticeEdit: (id:any) => api(`companyadmin/noticetracker/approve-edit-request/${id}`)
    },
    branchAgreement: {
        list: () => api('companyadmin/agreement/agreement'),
        create: () => api('companyadmin/agreement/agreement'),
        update: (id: any) => api(`/companyadmin/agreement/agreement/${id}`),
        detail: (id: any) => api(`/companyadmin/agreement/agreement/${id}`),
        delete: (id: any) => api(`/companyadmin/agreement/agreement/${id}`),
        download: () => api('companyadmin/agreement/agreement-data/export')

    },
    notification:{
            notification:() => api('notifications/settings'),
            unmarkedlist:()=> api('/notifications?unmarked=true'),
            allList:()=> api(`/notifications`),
            markRead:(id:any)=> api(`notification/read/${id}`)
        },
    forgotpassword:{
            forgot:()=> api('forgot-password'),
            reset:() => api(`reset-password`),
            verifyToken: () => api(`/verify-reset-token`)
        },
     graph:{
            branchType: () => api(`companyadmin/graph/branch-types`),
            branchStatus: () => api(`companyadmin/graph/branch-status`),
            agreementStatus: () => api(`companyadmin/graph/agreement-status`),
            agreementStatusGraph: () => api(`companyadmin/graph/agreement-status-graph`),
            branchSEStatus: () => api(`companyadmin/graph/branch-se-status`),
            branchSEStatusGraph: () => api(`companyadmin/graph/branch-se-status-graph`),
            noticeStatus: () => api(`companyadmin/graph/notice-status`),
            noticeStatusGraph: () => api(`companyadmin/graph/notice-status-graph`),
            remittanceBreakup: () => api(`companyadmin/graph/remittance-breakup`),
            registerBreakup: () => api(`companyadmin/graph/registration-breakup`),
            pfremittanceBreakup: () => api(`companyadmin/graph/pf-remittance-breakdown`),
            esiremittanceBreakup: () => api(`companyadmin/graph/esi-remittance-breakdown`),
            lwfremittanceBreakup: () => api(`companyadmin/graph/lwf-remittance-breakdown`),
            ptremittanceBreakup: () => api(`companyadmin/graph/pt-remittance-breakdown`),
            branchStatusGraph: () => api(`companyadmin/graph/branch-status-graph`),
            calendar: () => api(`companyadmin/graph/compliance-calendar-dates`)
        },
    return: {
        create: () => api('companyadmin/returns'),
        bulkCreate: () => api('companyadmin/returns/bulk-upload'),
        update: (id: any) => api(`companyadmin/returns/${id}`),
        list: () => api('companyadmin/returns'),
        detail: (id: any) => api(`companyadmin/returns/${id}`),
        template: () => api('companyadmin/returns/export/template'),
        downloadData: () => api('companyadmin/returns/export/data'),
        returnActList: () => api('return-superadmin/act-name'),
        returnList: () => api('return-superadmin/return-name'),
        getList: () => api('return-superadmin/all'),
        downloadDocument: (id:any) => api(`companyadmin/returns/document/download/${id}`)

    },
    register: {
        listSalaryRegister: () => api('companyadmin/register/data'),
        downloadSalaryRegisterTemplate: () => api('companyadmin/register/template/download'),
        createSalaryRegister: () => api('companyadmin/register/upload'),
        listAttendanceRegister: () => api('companyadmin/register/data'),
        downloadAttendanceRegisterTemplate: () => api('companyadmin/register/template/download'),
        createAttendancceRegister: () => api('companyadmin/register/upload'),
        exportRegister: () => api('companyadmin/register/export/house-rent')
    }
        
}
