import React, { useState, useEffect, useCallback } from 'react'
import { useAppDispatch } from '@/store'
import reducer from './store'
import { Notification, toast } from '@/components/ui'
import AdaptableCard from '@/components/shared/AdaptableCard'
import AssignChecklistTable from './components/AssignChecklistTable'
import AssignChecklistTableTool from './components/AssignChecklistTableTool'
import Company from '../../Home/components/Company'
import { endpoints } from '@/api/endpoint'
import httpClient from '@/api/http-client'
import { fetchUsers } from '@/store/slices/userEntity/UserEntitySlice'
import { AppDispatch } from '@/store'
import { showErrorNotification } from '@/components/ui/ErrorMessage'
import { useNavigate } from 'react-router-dom'
import { fetchAuthUser } from '@/store/slices/login'
import { Loading } from '@/components/shared'
import { useDispatch } from 'react-redux'

// Define all your interfaces at the top of the file
interface MasterCompliance {
    id: number
    uuid: string
    record_id?: string  // Added this since your table uses MasterCompliance.record_id
    legislation: string
    header: string
    criticality: string
    description: string
    scheduled_frequency?: string
    default_due_date: {
        first_date: string
        last_date: string
    }
}

interface Owner {
    id: number
    name: string
    email: string
}

interface ComplianceData {
    id: number
    branch_id: number
    mst_compliance_id: number
    owner_id: number | null
    approver_id: number | null
    status: boolean
    MasterCompliance: MasterCompliance
    Owner: Owner | null
    Approver: Owner | null
    customized_frequency: string
    due_date: string
}

interface SelectOption {
    value: string
    label: string
}

interface BranchOption {
    label: string
    value: string
}

interface Permissions {
    canList: boolean
    canCreate: boolean
    canEdit: boolean
    canDelete: boolean
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

const dummyComplianceData: ComplianceData[] = [
    {
        id: 1,
        branch_id: 1,
        mst_compliance_id: 101,
        owner_id: 201,
        approver_id: 301,
        status: true,
        customized_frequency: 'monthly',
        due_date: '2023-12-15',
        MasterCompliance: {
            id: 101,
            uuid: 'comp-001',
            legislation: 'Environmental Protection Act',
            header: 'Annual Environmental Report',
            criticality: 'high',
            description: 'Submission of annual environmental impact report',
            scheduled_frequency: 'yearly',
            default_due_date: {
                first_date: '2023-12-31',
                last_date: '2023-12-31'
            }
        },
        Owner: {
            id: 201,
            name: 'John Doe',
            email: 'john.doe@example.com'
        },
        Approver: {
            id: 301,
            name: 'Jane Smith',
            email: 'jane.smith@example.com'
        }
    },
    {
        id: 2,
        branch_id: 1,
        mst_compliance_id: 102,
        owner_id: 202,
        approver_id: 302,
        status: true,
        customized_frequency: 'quarterly',
        due_date: '2023-09-30',
        MasterCompliance: {
            id: 102,
            uuid: 'comp-002',
            legislation: 'Labor Standards Regulation',
            header: 'Quarterly Safety Inspection',
            criticality: 'medium',
            description: 'Workplace safety inspection report',
            scheduled_frequency: 'quarterly',
            default_due_date: {
                first_date: '2023-09-30',
                last_date: '2023-09-30'
            }
        },
        Owner: {
            id: 202,
            name: 'Robert Johnson',
            email: 'robert.j@example.com'
        },
        Approver: {
            id: 302,
            name: 'Emily Davis',
            email: 'emily.d@example.com'
        }
    },
    {
        id: 3,
        branch_id: 2,
        mst_compliance_id: 103,
        owner_id: null,
        approver_id: null,
        status: false,
        customized_frequency: '',
        due_date: '',
        MasterCompliance: {
            id: 103,
            uuid: 'comp-003',
            legislation: 'Financial Compliance Act',
            header: 'Annual Financial Audit',
            criticality: 'high',
            description: 'Submission of audited financial statements',
            scheduled_frequency: 'yearly',
            default_due_date: {
                first_date: '2023-12-31',
                last_date: '2023-12-31'
            }
        },
        Owner: null,
        Approver: null
    },
    {
        id: 4,
        branch_id: 2,
        mst_compliance_id: 104,
        owner_id: 203,
        approver_id: 303,
        status: true,
        customized_frequency: 'half_yearly',
        due_date: '2023-06-30',
        MasterCompliance: {
            id: 104,
            uuid: 'comp-004',
            legislation: 'Health and Safety Regulations',
            header: 'Bi-annual Safety Training',
            criticality: 'medium',
            description: 'Employee safety training certification',
            scheduled_frequency: 'half_yearly',
            default_due_date: {
                first_date: '2023-06-30',
                last_date: '2023-12-31'
            }
        },
        Owner: {
            id: 203,
            name: 'Sarah Williams',
            email: 'sarah.w@example.com'
        },
        Approver: {
            id: 303,
            name: 'Michael Brown',
            email: 'michael.b@example.com'
        }
    }
];

const dummyUserOptions: SelectOption[] = [
    { value: '201', label: 'John Doe' },
    { value: '202', label: 'Robert Johnson' },
    { value: '203', label: 'Sarah Williams' },
    { value: '301', label: 'Jane Smith' },
    { value: '302', label: 'Emily Davis' },
    { value: '303', label: 'Michael Brown' }
];

const AssignChecklist = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)
    const [assignedData, setAssignedData] = useState<ComplianceData[]>(dummyComplianceData)
    const [tableKey, setTableKey] = useState(0)
    const [selectedBranch, setSelectedBranch] = useState<BranchOption | null>(null)
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [selectedCompanyGroup, setSelectedCompanyGroup] = useState<SelectOption | null>(null)
    const [selectedCompany, setSelectedCompany] = useState<SelectOption | null>(null)
    const [selectedState, setSelectedState] = useState<SelectOption | null>(null)
    const [selectedDistrict, setSelectedDistrict] = useState<SelectOption | null>(null)
    const [selectedLocation, setSelectedLocation] = useState<SelectOption | null>(null)

    const [pagination, setPagination] = useState({
        total: dummyComplianceData.length,
        pageIndex: 1,
        pageSize: 10,
    })

    const [permissions, setPermissions] = useState<Permissions>({
        canList: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
    })

    const handleSelectedIdsChange = (ids: number[]) => {
        console.log('Selected IDs:', ids)
        setSelectedIds(ids)
    }

    const refreshTableAndReset = () => {
        setSelectedIds([])
        setTableKey((prevKey) => prevKey + 1)
    }

    const handleBranchChange = (branch: BranchOption | null) => {
        console.log('Branch value received:', branch?.value)
        setSelectedBranch(branch)
    }

    const handlePaginationChange = (page: number) => {
        setPagination((prev) => ({ ...prev, pageIndex: page }))
    }

    const handlePageSizeChange = (newPageSize: number) => {
        setPagination((prev) => ({
            ...prev,
            pageSize: newPageSize,
            pageIndex: 1,
        }))
    }

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="flex flex-row items-center justify-between mb-10">
                <div className="">
                    <h3 className="text-2xl font-bold">Assigned Checklist</h3>
                    <p className="text-gray-600">
                        View your company's assigned compliance
                    </p>
                </div>
                <AssignChecklistTableTool
                    selectedIds={selectedIds}
                    refreshTable={refreshTableAndReset}
                    canCreate={permissions.canCreate}
                />
            </div>
            <div className="mb-8">
                <Company
                    onBranchChange={(branch) => handleBranchChange(branch)}
                    onCompanyGroupChange={setSelectedCompanyGroup}
                    onCompanyChange={setSelectedCompany}
                    onStateChange={setSelectedState}
                    onDistrictChange={setSelectedDistrict}
                    onLocationChange={setSelectedLocation}
                />
            </div>
            <AssignChecklistTable
                data={assignedData}
                loading={isLoading}
                tableKey={tableKey}
                refreshTable={refreshTableAndReset}
                onSelectedIdsChange={handleSelectedIdsChange}
                selectedId={selectedIds}
                pagination={pagination}
                onPaginationChange={handlePaginationChange}
                onPageSizeChange={handlePageSizeChange}
                canCreate={permissions.canCreate}
            />
        </AdaptableCard>
    )
}

export default AssignChecklist