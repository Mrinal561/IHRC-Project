import { combineReducers, CombinedState, AnyAction, Reducer } from 'redux'
import auth, { AuthState } from './slices/auth'
import base, { BaseState } from './slices/base'
import locale, { LocaleState } from './slices/locale/localeSlice'
import theme, { ThemeState } from './slices/theme/themeSlice'
import RtkQueryService from '@/services/RtkQueryService'
import login, {AuthenticationState} from './slices/login'
import company, { CompanyState } from './slices/company/companySlice'
import companyGroup ,{ CompanyGroupState } from './slices/companyGroup/companyGroupSlice'
import user, { UserState } from './slices/userEntity/UserEntitySlice'
import branch, { BranchState } from './slices/branch/branchSlice'
import compliance, {ComplianceState} from './slices/compliance/complianceSlice'
import assignedCompliance,{ ComplianceAssignmentState } from './slices/AssignedCompliance/assignedComplianceSlice';
import dueCompliance, { DueComplianceState } from './slices/dueCompliance/dueComplianceSlice'
import status,{ StatusState } from './slices/dueCompliance/statusUpdateSlice'
import esisetup, { EsiSetupState } from './slices/esiSetup/esiSetupSlice'
import pfsetup,{ PFState } from './slices/pfSetup/pfSlice'
import pfiwsetup, { PfIwTrackerState } from './slices/pfSetup/pfIwTrackerSlice'
import esitrackersetup, { EsiTrackerState } from './slices/esiSetup/esiTrackerSlice'
import lwftrackersetup, { LwfTrackerState } from './slices/lwfSetup/lwfTrackerSlice'
import ptsetup, { ptsetupState } from './slices/ptSetup/ptSetupSlice'
import ptrctracker,{ PtrcTrackerState } from './slices/ptSetup/ptrcTrackerSlice';
import pftracker,{ TrackerState } from './slices/pftracker/pfTrackerSlice'
import lwfid, { LwfTrackerId } from './slices/lwfTracker/lwfTracker';
import esitracker, { ESITrackersState } from './slices/esitracker/esitrackerSlice'
import certificate, { CertificateState } from './slices/certificate/certificateSlice'
import role,{ RoleState } from './slices/role/roleSlice'
import notice,{ NoticeTrackerState } from './slices/noticeTracker/noticeTrackerSlice'
import notification,{ NotificationState } from './slices/notification/notificationSlice'
import password,{ PasswordRecoveryState } from './slices/password/passwordSlice'
import auditor, {AuditorState} from './slices/auditorEntity/AuditorEntitySlice'









export type RootState = CombinedState<{
    auth: CombinedState<AuthState>
    base: CombinedState<BaseState>
    login:CombinedState<AuthenticationState>
    companyGroup: CompanyGroupState
    compliance: ComplianceState
    company: CompanyState
    due: DueComplianceState
    status:StatusState
    branch: BranchState
    user: UserState
    esiSetup: EsiSetupState
    pfSetup: PFState
    ptSetup: ptsetupState
    ptrctrackerSetup: PtrcTrackerState
    esiTrackerSetup: EsiTrackerState
    lwfTrackerSetup: LwfTrackerState
    pfiwSetup: PfIwTrackerState
    pftracker: TrackerState
    lwfid: LwfTrackerId
    esitracker: ESITrackersState
    locale: LocaleState
    theme: ThemeState
    assigedCompliance: ComplianceAssignmentState
    certificate: CertificateState
    role: RoleState
    noticeTracker: NoticeTrackerState
    notification : NotificationState
    password: PasswordRecoveryState
    auditor: AuditorState
    /* eslint-disable @typescript-eslint/no-explicit-any */
    [RtkQueryService.reducerPath]: any
}>
 
export interface AsyncReducers {
    [key: string]: Reducer<any, AnyAction>
}
 
const staticReducers = {
    auth,
    base,
    locale,
    theme,
    login,
    companyGroup,
    company,
    branch,
    user,
    compliance,
    assignedCompliance,
    dueCompliance,
    status,
    esisetup,
    pfsetup,
    pfiwsetup,
    ptsetup,
    esitrackersetup,
    lwftrackersetup,
    ptrctracker,
    pftracker,
    lwfid,
    esitracker,
    certificate,
    role,
    notice,
    notification,
    password,
    auditor,
    [RtkQueryService.reducerPath]: RtkQueryService.reducer,
}
 
const rootReducer =
    (asyncReducers?: AsyncReducers) =>
    (state: RootState, action: AnyAction) => {
        const combinedReducer = combineReducers({
            ...staticReducers,
            ...asyncReducers,
        })
        return combinedReducer(state, action)
    }
 
export default rootReducer
 