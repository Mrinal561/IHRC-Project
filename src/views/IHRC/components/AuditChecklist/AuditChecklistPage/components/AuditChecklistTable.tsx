import React, { useMemo, useState } from 'react'
import { ColumnDef } from '@/components/shared/DataTable'
import DataTable from '@/components/shared/DataTable'
import { Button, Tooltip, Dialog, Notification, toast } from '@/components/ui'
import { RiEyeLine } from 'react-icons/ri'
import { HiOutlineViewGrid } from 'react-icons/hi'
import { MdEdit } from 'react-icons/md'
import { FiTrash } from 'react-icons/fi'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import AuditChecklistDetailDialog from './AuditChecklistDetailDialog'
import AuditChecklistEditDialog from './AuditChecklistEditDialog'

export type AuditChecklistData = {
    id: number
    uuid: string
    group_id: number
    company_id: number
    branch_id: number
    state_id: number
    compliance_header: string
    compliance_description: string
    applicable: string
    legislation_act: string
    compliance_categorization: string
    penalty_type: string
    penalty_description: string
    compliance_applicability: string
    compliance_reference: string
    compliance_type: string
    compliance_frequency: string
    criticality: string
    proof_mandatory: boolean
    due_date_frequency: string
    due_dates: {
        first_due_date: string | null
        second_due_date: string | null
        third_due_date: string | null
        last_due_date: string | null
    }
    owner_name: string
    owner_email: string
    approver_name: string
    approver_email: string
    created_by: number
    created_at: string
    updated_at: string
    last_processed_date: string
    is_active: boolean
    CompanyGroup: {
        id: number
        name: string
    }
    Company: {
        id: number
        name: string
    }
    Branch: {
        id: number
        name: string
    }
    State: {
        id: number
        name: string
    }
}

interface AuditChecklistTableProps {
    data?: AuditChecklistData[]
    loading?: boolean
    pagination: {
        total: number
        pageIndex: number
        pageSize: number
    }
    onPaginationChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
    onRefresh: () => void
    searchQuery?: string
}

const AuditChecklistTable: React.FC<AuditChecklistTableProps> = ({
    data = [],
    loading,
    pagination,
    onPaginationChange,
    onPageSizeChange,
    onRefresh,
    searchQuery
}) => {
    const [detailDialogOpen, setDetailDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<AuditChecklistData | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleViewDetail = (item: AuditChecklistData) => {
        setSelectedItem(item)
        setDetailDialogOpen(true)
    }

    const handleEdit = (item: AuditChecklistData) => {
        setSelectedItem(item)
        setEditDialogOpen(true)
    }

    const handleDelete = (item: AuditChecklistData) => {
        setSelectedItem(item)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!selectedItem) return
        
        setIsDeleting(true)
        try {
            await httpClient.delete(endpoints.compliance.detailComplianceChecklist(selectedItem.id))
            toast.push(
                <Notification title="Success" type="success">
                    Checklist deleted successfully
                </Notification>
            )
            onRefresh()
        } catch (error) {
            console.error('Error deleting checklist:', error)
            toast.push(
                <Notification title="Error" type="error">
                    Failed to delete checklist
                </Notification>
            )
        } finally {
            setIsDeleting(false)
            setDeleteDialogOpen(false)
        }
    }

    const columns: ColumnDef<AuditChecklistData>[] = useMemo(
        () => [
            {
                header: 'ID',
                enableSorting: false,
                accessorKey: 'uuid',
                cell: (props) => (
                    <div className="w-28">{props.getValue() as string}</div>
                ),
            },
            // {
            //     header: 'Group',
            //     enableSorting: false,
            //     accessorKey: 'CompanyGroup.name',
            //     cell: (props) => (
            //         <div className="w-40">{props.row.original.CompanyGroup.name}</div>
            //     ),
            // },
            {
                header: 'Company',
                enableSorting: false,
                accessorKey: 'Company.name',
                cell: (props) => (
                    <div className="w-40">{props.row.original.Company.name}</div>
                ),
            },
            {
                header: 'Branch',
                enableSorting: false,
                accessorKey: 'Branch.name',
                cell: (props) => (
                    <div className="w-40">{props.row.original.Branch.name}</div>
                ),
            },
            {
                header: 'State',
                enableSorting: false,
                accessorKey: 'State.name',
                cell: (props) => (
                    <div className="w-40">{props.row.original.State.name}</div>
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
                header: 'Applicable',
                enableSorting: false,
                accessorKey: 'applicable',
                cell: (props) => (
                    <div className="w-32 capitalize">{props.getValue() as string}</div>
                ),
            },
            {
                header: 'Legislation',
                enableSorting: false,
                accessorKey: 'legislation_act',
                cell: (props) => (
                    <div className="w-64 truncate">
                        {props.getValue() as string}
                    </div>
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
                header: 'Frequency',
                enableSorting: false,
                accessorKey: 'compliance_frequency',
                cell: (props) => (
                    <div className="w-32 capitalize">{props.getValue() as string}</div>
                ),
            },
            {
                header: 'Criticality',
                enableSorting: false,
                accessorKey: 'criticality',
                cell: (props) => {
                    const criticality = props.getValue() as string
                    return (
                        <div className="w-24 font-semibold">
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
            header: 'Proof Mandatory',
            enableSorting: false,
            accessorKey: 'proof_mandatory',
            cell: (props) => (
                <div className="w-24 capitalize">
                    {props.getValue() ? 'Yes' : 'No'}
                </div>
            ),
        },
            {
                header: 'Due Date',
                enableSorting: false,
                accessorKey: 'due_dates.first_due_date',
                cell: (props) => (
                    <div className="w-32">
                        {props.row.original.due_dates.first_due_date || 'N/A'}
                    </div>
                ),
            },
            {
                header: 'Owner',
                enableSorting: false,
                accessorKey: 'owner_name',
                cell: (props) => (
                    <div className="w-40">
                        <div>{props.getValue() as string}</div>
                        <div className="text-xs text-gray-500">{props.row.original.owner_email}</div>
                    </div>
                ),
            },
            {
                header: 'Approver',
                enableSorting: false,
                accessorKey: 'approver_name',
                cell: (props) => (
                    <div className="w-40">
                        <div>{props.getValue() as string}</div>
                        <div className="text-xs text-gray-500">{props.row.original.approver_email}</div>
                    </div>
                ),
            },
            {
                header: 'Status',
                enableSorting: false,
                accessorKey: 'is_active',
                cell: (props) => (
                    <div className="w-24">
                        {props.getValue() ? (
                            <span className="text-green-500 font-semibold">Active</span>
                        ) : (
                            <span className="text-red-500 font-semibold">Inactive</span>
                        )}
                    </div>
                ),
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex space-x-2">
                        {/* <Tooltip title="View Details" placement="top">
                            <Button
                                onClick={() => handleViewDetail(row.original)}
                                icon={<RiEyeLine />}
                                size='sm'
                                className='hover:bg-transparent'
                            />
                        </Tooltip> */}
                        {/* <Tooltip title="Edit" placement="top">
                            <Button
                                onClick={() => handleEdit(row.original)}
                                icon={<MdEdit />}
                                size='sm'
                                className='hover:bg-transparent'
                            />
                        </Tooltip> */}
                        <Tooltip title="Delete" placement="top">
                            <Button
                                onClick={() => handleDelete(row.original)}
                                icon={<FiTrash />}
                                size='sm'
                                className='hover:bg-transparent text-red-500'
                            />
                        </Tooltip>
                    </div>
                ),
            },
        ],
        []
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
                <>
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

                    {/* Detail Dialog */}
                    {selectedItem && (
                        <AuditChecklistDetailDialog
                            isOpen={detailDialogOpen}
                            onClose={() => setDetailDialogOpen(false)}
                            checklist={selectedItem}
                        />
                    )}

                    {/* Edit Dialog */}
                    {selectedItem && (
                        <AuditChecklistEditDialog
                            isOpen={editDialogOpen}
                            onClose={() => setEditDialogOpen(false)}
                            checklist={selectedItem}
                            onSuccess={onRefresh}
                        />
                    )}

                    {/* Delete Confirmation Dialog */}
                    <Dialog
                        isOpen={deleteDialogOpen}
                        onClose={() => setDeleteDialogOpen(false)}
                        onRequestClose={() => setDeleteDialogOpen(false)}
                    >
                        <h5 className="mb-4">Confirm Delete</h5>
                        <p>
                            Are you sure you want to delete this compliance checklist?
                        </p>
                        <div className="text-right mt-6">
                            <Button
                                className="ltr:mr-2 rtl:ml-2"
                                variant="plain"
                                onClick={() => setDeleteDialogOpen(false)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="solid"
                                color="red-600"
                                onClick={confirmDelete}
                                loading={isDeleting}
                            >
                                Delete
                            </Button>
                        </div>
                    </Dialog>
                </>
            )}
        </div>
    )
}

export default AuditChecklistTable