import React, { useMemo } from 'react'
import { ColumnDef } from '@/components/shared/DataTable'
import DataTable from '@/components/shared/DataTable'
import { Button, Tooltip } from '@/components/ui'
import { RiEyeLine } from 'react-icons/ri'
import { HiOutlineViewGrid } from 'react-icons/hi'
import { MdDelete, MdEdit } from 'react-icons/md'
import { FiTrash } from 'react-icons/fi'
import { FaEye } from 'react-icons/fa'

export type AuditChecklistData = {
    id: number
    compliance_instance_id: string
    compliance_id: string
    ihrc_company_name: string
    location: string
    legislation: string
    compliance_categorization: string
    compliance_header: string
    compliance_description: string
    penalty_description: string
    compliance_applicability: string
    bare_act_text: string
    compliance_clause: string
    compliance_type: string
    compliance_frequency: string
    compliance_statutory_authority: string
    approval_required: boolean
    criticality: string
    penalty_type: string
    default_due_date: string
    first_due_date: string
    due_date: string
    scheduled_frequency: string
    proof_mandatory: boolean
    owner_name: string
    owner_username: string
    approver_name: string
    approver_username: string
    reminder: string
    effective_date_of_change: string
    reason_to_edit: string
    edited_on: string
    edited_by: string
}

const dummyAuditChecklistData: AuditChecklistData[] = [
    {
        id: 1,
        compliance_instance_id: 'INST-001',
        compliance_id: 'COMP-2023-001',
        ihrc_company_name: 'ABC Corporation',
        location: 'Mumbai',
        legislation: 'Companies Act 2013',
        compliance_categorization: 'Financial Reporting',
        compliance_header: 'Annual Financial Statement Filing',
        compliance_description: 'Submission of audited financial statements to ROC',
        penalty_description: 'Fine of ₹1000 per day of delay',
        compliance_applicability: 'All registered companies',
        bare_act_text: 'Section 137 of Companies Act 2013',
        compliance_clause: '137(1)',
        compliance_type: 'Annual Filing',
        compliance_frequency: 'Annual',
        compliance_statutory_authority: 'Registrar of Companies',
        approval_required: true,
        criticality: 'High',
        penalty_type: 'Monetary Fine',
        default_due_date: '2023-10-30',
        first_due_date: '2023-10-30',
        due_date: '2023-10-30',
        scheduled_frequency: 'Yearly',
        proof_mandatory: true,
        owner_name: 'John Doe',
        owner_username: 'johnd',
        approver_name: 'Jane Smith',
        approver_username: 'janes',
        reminder: '30 days before due date',
        effective_date_of_change: '2023-01-01',
        reason_to_edit: 'Regulatory update',
        edited_on: '2023-01-15',
        edited_by: 'admin_user'
    },
    {
        id: 2,
        compliance_instance_id: 'INST-002',
        compliance_id: 'COMP-2023-002',
        ihrc_company_name: 'XYZ Ltd',
        location: 'Bangalore',
        legislation: 'GST Act 2017',
        compliance_categorization: 'Tax Filing',
        compliance_header: 'Monthly GST Return',
        compliance_description: 'Filing of GSTR-3B return',
        penalty_description: 'Late fee of ₹50 per day (CGST + SGST)',
        compliance_applicability: 'All GST registered businesses',
        bare_act_text: 'Section 39 of CGST Act 2017',
        compliance_clause: '39(1)',
        compliance_type: 'Monthly Filing',
        compliance_frequency: 'Monthly',
        compliance_statutory_authority: 'GST Department',
        approval_required: false,
        criticality: 'Medium',
        penalty_type: 'Late Fee',
        default_due_date: '2023-11-20',
        first_due_date: '2023-11-20',
        due_date: '2023-11-20',
        scheduled_frequency: 'Monthly',
        proof_mandatory: true,
        owner_name: 'Robert Johnson',
        owner_username: 'robertj',
        approver_name: 'Emily Davis',
        approver_username: 'emilyd',
        reminder: '7 days before due date',
        effective_date_of_change: '2023-04-01',
        reason_to_edit: 'Rate change',
        edited_on: '2023-04-05',
        edited_by: 'tax_admin'
    }
];

interface AuditChecklistTableProps {
    data?: AuditChecklistData[]
    loading?: boolean
    onViewDetail?: (item: AuditChecklistData) => void
    pagination: {
        total: number
        pageIndex: number
        pageSize: number
    }
    onPaginationChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
}

const AuditChecklistTable: React.FC<AuditChecklistTableProps> = ({
    data = dummyAuditChecklistData,
    loading,
    onViewDetail,
    pagination,
    onPaginationChange,
    onPageSizeChange,
}) => {
    const columns: ColumnDef<AuditChecklistData>[] = useMemo(
        () => [
            {
                header: 'Instance Id',
                enableSorting: false,

                accessorKey: 'compliance_instance_id',
                cell: (props) => (
                    <div className="w-32">{props.getValue() as string}</div>
                ),
            },
            {
                header: 'Compliance Id',
                enableSorting: false,

                accessorKey: 'compliance_id',
                cell: (props) => (
                    <div className="w-40">{props.getValue() as string}</div>
                ),
            },
            {
                header: 'Company',
                enableSorting: false,

                accessorKey: 'ihrc_company_name',
                cell: (props) => (
                    <div className="w-40">{props.getValue() as string}</div>
                ),
            },
            {
                header: 'Legislation',
                enableSorting: false,

                accessorKey: 'legislation',
                cell: (props) => (
                    <Tooltip title={props.getValue() as string} placement="top">
                        <div className="w-64 truncate">
                            {props.getValue() as string}
                        </div>
                    </Tooltip>
                ),
            },
            {
                header: 'Criticality',
                enableSorting: false,

                accessorKey: 'criticality',
                cell: (props) => {
                    const criticality = props.getValue() as string
                    return (
                        <div className="w-40 font-semibold">
                            {criticality.toLowerCase() === 'high' ? (
                                <span className="text-red-500">High</span>
                            ) : criticality.toLowerCase() === 'medium' ? (
                                <span className="text-yellow-500">Medium</span>
                            ) : (
                                <span className="text-green-500">Low</span>
                            )}
                        </div>
                    )
                },
            },
            {
                header: 'Location',
                enableSorting: false,

                accessorKey: 'location',
                cell: (props) => (
                    <div className="w-40">{props.getValue() as string}</div>
                ),
            },
            {
                header: 'Header',
                enableSorting: false,

                accessorKey: 'compliance_header',
                cell: (props) => (
                    <Tooltip title={props.getValue() as string} placement="top">
                        <div className="w-64 truncate">
                            {props.getValue() as string}
                        </div>
                    </Tooltip>
                ),
            },
            {
                header: 'Description',
                enableSorting: false,

                accessorKey: 'compliance_description',
                cell: (props) => (
                    <Tooltip title={props.getValue() as string} placement="top">
                        <div className="w-64 truncate">
                            {props.getValue() as string}
                        </div>
                    </Tooltip>
                ),
            },
           
            {
                header: 'Categorization',
                enableSorting: false,

                accessorKey: 'compliance_categorization',
                cell: (props) => (
                    <div className="w-40">{props.getValue() as string}</div>
                ),
            },
           
           
            {
                header: 'Owner Name',
                enableSorting: false,

                accessorKey: 'owner_name',
                cell: (props) => (
                    <div className="w-40">{props.getValue() as string}</div>
                ),
            },
            {
                header: 'Owner Email',
                enableSorting: false,

                accessorKey: 'owner_username',
                cell: (props) => (
                    <div className="w-40">{props.getValue() as string}</div>
                ),
            },
            {
                header: 'Approver Name',
                enableSorting: false,

                accessorKey: 'approver_name',
                cell: (props) => (
                    <div className="w-40">{props.getValue() as string}</div>
                ),
            },
            {
                header: 'Approver Email',
                enableSorting: false,

                accessorKey: 'approver_username',
                cell: (props) => (
                    <div className="w-40">{props.getValue() as string}</div>
                ),
            },
           
           
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <Tooltip title="View Details" placement="top">
                            <Button
                              onClick={() => onViewDetail?.(row.original)}
                              icon={<RiEyeLine />}
                              size='sm'
                              className='hover:bg-transparent'

                            >
                            </Button>
                        </Tooltip>
                        <Tooltip title="Edit" placement="top">
                            <Button
                                onClick={() => onViewDetail?.(row.original)}
                                icon={<MdEdit />}
                                size='sm'
                                className='hover:bg-transparent'

                            >
                            </Button>
                        </Tooltip>
                        <Tooltip title="Delete" placement="top">
                            <Button
                                onClick={() => onViewDetail?.(row.original)}
                                 icon={<FiTrash />}
                                 size='sm'
                                 className='hover:bg-transparent text-red-500'                            >
                            </Button>
                        </Tooltip>
                    </div>
                ),
            },
        ],
        [onViewDetail]
    )

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500 rounded-xl">
                <HiOutlineViewGrid className="w-12 h-12 mb-4 animate-spin" />
                <p className="text-lg font-semibold">Loading Data...</p>
            </div>
        )
    }

    return (
        <div className="relative">
            {data.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
                    <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
                    <p className="text-center">No Data Available</p>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={data}
                    loading={loading}
                    pagingData={{
                        total: pagination.total,
                        pageIndex: pagination.pageIndex,
                        pageSize: pagination.pageSize,
                    }}
                    onPaginationChange={onPaginationChange}
                    onSelectChange={onPageSizeChange}
                    stickyHeader={true}
                    stickyFirstColumn={true}
                    stickyLastColumn={true}
                />
            )}
        </div>
    )
}

export default AuditChecklistTable