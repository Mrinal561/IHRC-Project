import React, { useCallback, useMemo, useState } from 'react'
import { ColumnDef } from '@/components/shared/DataTable'
import DataTable from '@/components/shared/DataTable'
import {
    Button,
    Tooltip,
    Dialog,
    Input,
    toast,
    Notification,
} from '@/components/ui'
import { RiEyeLine } from 'react-icons/ri'
import { MdEdit } from 'react-icons/md'
import { HiDocumentDownload, HiUpload } from 'react-icons/hi'
import OutlinedSelect from '@/components/ui/Outlined'
import { updateStatus } from '@/store/slices/dueCompliance/statusUpdateSlice'
import { useDispatch } from 'react-redux'
import { StatusRequest } from '@/@types/status'
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json'
import Lottie from 'lottie-react'
import { HiOutlineViewGrid } from 'react-icons/hi'

export type DueComplianceDetailData = {
    id: number
    uuid: string
    ac_compliance_id: number
    proof_document: string | null
    status: 'pending' | 'due' | 'overdue'
    compliance_detail: {
        id: number
        uuid: string
        legislation: string
        category: string
        penalty_type: string
        default_due_date: {
            first_date: string
            last_date: string
        }
        scheduled_frequency: string
        proof_mandatory: boolean
        header: string
        description: string
        penalty_description: string
        applicability: string
        bare_act_text: string
        type: string
        clause: string
        frequency: string
        statutory_auth: string
        approval_required: boolean
        criticality: string
        created_type: string
        created_at: string
        updated_at: string
    }
    upload_date: string | null
    first_due_date: string | null
    due_date: string
    data_status: string
    uploaded_by: number | null
    approved_by: number | null
    created_by: number
    created_at: string
    updated_at: string
    UploadBy: {
        id: number
        first_name: string
        last_name: string
        email: string
        mobile: number
    } | null
    ApprovedBy: {
        id: number
        name: string
    } | null
    AssignedComplianceRemark: Array<{
        id: number
        remark: string
        created_by: number
        created_at: string
        updated_at: string
    }>
}
const StatusOption = {
    statusOption: [
        { value: 'complied', label: 'Complied' },
        { value: 'not_complied', label: 'Not Complied' },
        { value: 'not_applicable', label: 'Not Applicable' },
    ],
}

interface ComplianceDetailTableProps {
    data: DueComplianceDetailData[]
    loading?: boolean
    onViewDetail?: (compliance: DueComplianceDetailData) => void
    onUpdateStatus?: (
        id: number,
        status: DueComplianceDetailData['status'],
    ) => void
    onDownloadProof?: (documentUrl: string) => void
    onDataUpdate?: () => void
    pagination: {
        total: number
        pageIndex: number
        pageSize: number
    }
    onPaginationChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
    canCreate: boolean
}
const dummyDueComplianceData: DueComplianceDetailData[] = [
    {
      id: 1,
      uuid: 'comp-001',
      ac_compliance_id: 101,
      proof_document: 'https://example.com/proof1.pdf',
      status: 'pending',
      compliance_detail: {
        id: 101,
        uuid: 'detail-001',
        legislation: 'Environmental Protection Act 2020',
        category: 'Environmental',
        penalty_type: 'Monetary Fine',
        default_due_date: {
          first_date: '2023-12-31',
          last_date: '2023-12-31'
        },
        scheduled_frequency: 'yearly',
        proof_mandatory: true,
        header: 'Annual Environmental Compliance Report',
        description: 'Submission of annual environmental impact assessment report',
        penalty_description: 'Fine up to $50,000 for non-compliance',
        applicability: 'All manufacturing units',
        bare_act_text: 'Section 12(3) of the Environmental Protection Act',
        type: 'Annual Filing',
        clause: '12.3',
        frequency: 'Annual',
        statutory_auth: 'Ministry of Environment',
        approval_required: true,
        criticality: 'high',
        created_type: 'system',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
      upload_date: '2023-12-15',
      first_due_date: '2023-12-31',
      due_date: '2023-12-31',
      data_status: 'pending',
      uploaded_by: 201,
      approved_by: 301,
      created_by: 1,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-12-15T00:00:00Z',
      UploadBy: {
        id: 201,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        mobile: 9876543210
      },
      ApprovedBy: {
        id: 301,
        name: 'Jane Smith'
      },
      AssignedComplianceRemark: [
        {
          id: 1,
          remark: 'Initial submission pending review',
          created_by: 1,
          created_at: '2023-12-01T00:00:00Z',
          updated_at: '2023-12-01T00:00:00Z'
        }
      ]
    },
    {
      id: 2,
      uuid: 'comp-002',
      ac_compliance_id: 102,
      proof_document: null,
      status: 'due',
      compliance_detail: {
        id: 102,
        uuid: 'detail-002',
        legislation: 'Labor Standards Act',
        category: 'Employment',
        penalty_type: 'Administrative Penalty',
        default_due_date: {
          first_date: '2023-06-30',
          last_date: '2023-06-30'
        },
        scheduled_frequency: 'quarterly',
        proof_mandatory: false,
        header: 'Quarterly Employee Benefits Report',
        description: 'Submission of quarterly report on employee benefits',
        penalty_description: 'Warning for first offense, fine thereafter',
        applicability: 'All full-time employees',
        bare_act_text: 'Section 8(2) of the Labor Standards Act',
        type: 'Quarterly Filing',
        clause: '8.2',
        frequency: 'Quarterly',
        statutory_auth: 'Ministry of Labor',
        approval_required: false,
        criticality: 'medium',
        created_type: 'system',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
      upload_date: null,
      first_due_date: '2023-06-30',
      due_date: '2023-06-30',
      data_status: 'due',
      uploaded_by: null,
      approved_by: null,
      created_by: 1,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      UploadBy: null,
      ApprovedBy: null,
      AssignedComplianceRemark: []
    },
  
    {
      id: 3,
      uuid: 'comp-004',
      ac_compliance_id: 104,
      proof_document: null,
      status: 'overdue',
      compliance_detail: {
        id: 104,
        uuid: 'detail-004',
        legislation: 'Health and Safety Regulations',
        category: 'Safety',
        penalty_type: 'Both Fine and Penalty',
        default_due_date: {
          first_date: '2023-01-15',
          last_date: '2023-01-15'
        },
        scheduled_frequency: 'half_yearly',
        proof_mandatory: false,
        header: 'Bi-annual Safety Audit',
        description: 'Submission of workplace safety audit report',
        penalty_description: 'Fine up to $25,000 and possible shutdown',
        applicability: 'All work locations',
        bare_act_text: 'Section 7(4) of the Health and Safety Regulations',
        type: 'Bi-annual Filing',
        clause: '7.4',
        frequency: 'Half-yearly',
        statutory_auth: 'Department of Workplace Safety',
        approval_required: false,
        criticality: 'medium',
        created_type: 'system',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
      upload_date: null,
      first_due_date: '2023-01-15',
      due_date: '2023-01-15',
      data_status: 'overdue',
      uploaded_by: null,
      approved_by: null,
      created_by: 1,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      UploadBy: null,
      ApprovedBy: null,
      AssignedComplianceRemark: [
        {
          id: 3,
          remark: 'Overdue - reminder sent',
          created_by: 1,
          created_at: '2023-01-20T00:00:00Z',
          updated_at: '2023-01-20T00:00:00Z'
        }
      ]
    }
  ];
  
const ComplianceDetailTable: React.FC<ComplianceDetailTableProps> = ({
    data = dummyDueComplianceData,
    loading,
    onViewDetail,
    onUpdateStatus,
    onDownloadProof,
    onDataUpdate,
    pagination,
    onPaginationChange,
    onPageSizeChange,
    canCreate,
}) => {
    const [tableData, setTableData] = useState({
        total: data.length,
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sort: { order: '', key: '' },
    })

    const [selectedCompliance, setSelectedCompliance] =
        useState<DueComplianceDetailData | null>(null)
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState<StatusOption | null>(
        null,
    )
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [remark, setRemark] = useState('')
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)

    const onDialogClose = useCallback(() => {
        setDialogIsOpen(false)
        setSelectedFile(null)
        setSelectedCompliance(null)
        setSelectedStatus(null)
        setRemark('')
    }, [])

    const handleStatusUpdate = (compliance: DueComplianceDetailData) => {
        setSelectedCompliance(compliance)
        setIsStatusDialogOpen(true)
    }
    const onStatusChange = useCallback((value: StatusOption) => {
        console.log('Status changed to:', value)
        setSelectedStatus(value)
    }, [])

    const handleUpdateStatus = async () => {
        // if (!selectedCompliance || !selectedStatus) {
        //   toast.push(
        //     <Notification title="Error" closable={true} type="danger">
        //       Please select a status and provide a remark.
        //     </Notification>
        //   );
        //   return;
        // }

        const formData = new FormData()
        formData.append('status', selectedStatus.value)
        formData.append('remark', remark)

        if (selectedCompliance?.compliance_detail.proof_mandatory) {
            if (!selectedFile) {
                toast.push(
                    <Notification title="Error" closable={true} type="danger">
                        Please upload the proof of compliance.
                    </Notification>,
                )
                return
            }
            formData.append('document', selectedFile)
        } else if (selectedFile) {
            formData.append('document', selectedFile)
        }

        try {
            console.log(selectedFile)
            const res = await dispatch(
                updateStatus({
                    id: selectedCompliance.id.toString(),
                    data: formData,
                }),
            )
                .unwrap()
                .catch((error: any) => {
                    error.map((v: string) =>
                        toast.push(
                            <Notification
                                title="Error"
                                closable={true}
                                type="danger"
                            >
                                {v}
                            </Notification>,
                        ),
                    )
                })
            if (res) {
                setIsStatusDialogOpen(false)
                onDialogClose()
                toast.push(
                    <Notification title="Success" type="success">
                        Status updated successfully.
                    </Notification>,
                )
            }

            if (onDataUpdate) {
                onDataUpdate()
            }
        } catch (error) {
            console.error('Error updating status:', error)
            setIsStatusDialogOpen(false)
            toast.push(
                <Notification title="Error" closable={true} type="danger">
                    Error updating status.
                </Notification>,
            )
        }
    }

    const getStatusBadgeColor = (status: DueComplianceDetailData['status']) => {
        switch (status) {
            case 'completed':
                return 'text-green-500'
            case 'pending':
                return 'text-yellow-500'
            case 'due':
                return 'text-blue-500'
            case 'overdue':
                return 'text-red-500'
            default:
                return 'text-gray-500'
        }
    }

    const columns: ColumnDef<DueComplianceDetailData>[] = useMemo(
        () => [
            {
                header: 'Compliance ID', enableSorting: false,
                accessorKey: 'uuid',
                cell: (props) => (
                    <div className="w-40 text-start">{props.getValue()}</div>
                ),
            },
            {
                header: 'Legislation', enableSorting: false,
                accessorFn: (row) => row.compliance_detail.legislation,
                cell: (props) => (
                    <Tooltip title={props.getValue() as string} placement="top">
                        <div className="w-64 truncate">
                            {((props.getValue() as string) || '').length > 40
                                ? `${(props.getValue() as string).substring(0, 40)}...`
                                : props.getValue()}
                        </div>
                    </Tooltip>
                ),
            },
            {
                header: 'Criticality', enableSorting: false,
                accessorFn: (row) => row.compliance_detail.criticality,
                cell: (props) => {
                    const criticality = props.getValue() as string
                    return (
                        <div className="w-24 font-semibold truncate">
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
                header: 'Category', enableSorting: false,
                accessorFn: (row) => row.compliance_detail.category,
                cell: (props) => (
                    <Tooltip title={props.getValue() as string} placement="top">
                        <div className="w-40 truncate">{props.getValue()}</div>
                    </Tooltip>
                ),
            },
            {
                header: 'Due Date', enableSorting: false,
                accessorKey: 'due_date',
                cell: (props) => (
                    <div className="w-28">
                        {new Date(
                            props.getValue() as string,
                        ).toLocaleDateString()}
                    </div>
                ),
            },
            {
                header: 'Status', enableSorting: false,
                accessorKey: 'data_status',
                cell: (props) => (
                    <div
                        className={`w-24 font-semibold ${getStatusBadgeColor(props.getValue() as DueComplianceDetailData['status'])}`}
                    >
                        {(props.getValue() as string).charAt(0).toUpperCase() +
                            (props.getValue() as string).slice(1)}
                    </div>
                ),
            },
            {
                header: 'Uploaded By', enableSorting: false,
                accessorFn: (row) =>
                    `${row.UploadBy?.first_name || ''} ${row.UploadBy?.last_name || ''}`.trim(),
                cell: (props) => (
                    <div className="w-32">{props.getValue() || '--'}</div>
                ),
            },

            {
                header: 'Approved By', enableSorting: false,
                accessorFn: (row) => row.ApprovedBy?.name,
                cell: (props) => (
                    <div className="w-32">{props.getValue() || '--'}</div>
                ),
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex space-x-2">
                        {/* <Tooltip title="View Details" placement="top">
              <Button
                size="sm"
                onClick={() => onViewDetail?.(row.original)}
                icon={<RiEyeLine />}
                className="hover:bg-transparent"
              />
            </Tooltip> */}
                        {/* {canCreate && ( */}
                            <Tooltip title="Update Status" placement="top">
                                <Button
                                    size="sm"
                                    onClick={() =>
                                        handleStatusUpdate(row.original)
                                    }
                                    icon={<HiUpload />}
                                    className="hover:bg-transparent"
                                />
                            </Tooltip>
                        {/* )} */}
                        {/* {row.original.proof_document && (
                            <Tooltip title="Download Proof" placement="top">
                                <Button
                                    size="sm"
                                    onClick={() =>
                                        onDownloadProof?.(
                                            row.original
                                                .proof_document as string,
                                        )
                                    }
                                    icon={<HiDocumentDownload />}
                                    className="hover:bg-transparent"
                                />
                            </Tooltip>
                        )} */}
                    </div>
                ),
            },
        ],
        [onViewDetail, onDownloadProof],
    )

    const handlePageChange = (page: number) => {
        setTableData((prev) => ({ ...prev, pageIndex: page }))
    }

    const handlePageSizeChange = (pageSize: number) => {
        setTableData((prev) => ({
            ...prev,
            pageSize: Number(pageSize),
            pageIndex: 1,
        }))
    }

    if (loading) {
        console.log('Loading....................')

        return (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500  rounded-xl">
                <div className="w-28 h-28">
                    <Lottie
                        animationData={loadingAnimation}
                        loop
                        className="w-24 h-24"
                    />
                </div>
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
                    skeletonAvatarColumns={[0]}
                    skeletonAvatarProps={{ className: 'rounded-md' }}
                    loading={loading}
                    pagingData={{
                        total: pagination.total,
                        pageIndex: pagination.pageIndex,
                        pageSize: pagination.pageSize,
                    }}
                    // Pass the pagination handlers
                    onPaginationChange={onPaginationChange}
                    onSelectChange={onPageSizeChange}
                    stickyHeader={true}
                    stickyFirstColumn={true}
                    stickyLastColumn={true}
                />
            )}
            <Dialog
                isOpen={isStatusDialogOpen}
                onClose={() => setIsStatusDialogOpen(false)}
                shouldCloseOnOverlayClick={false}
            >
                <h5 className="mb-4">Change Compliance Status</h5>
                <div className="flex items-center gap-3 mb-4">
                    <p className="font-semibold">
                        Select the Compliance status
                    </p>
                    <div className="w-40">
                        <OutlinedSelect
                            label="Set Status"
                            options={StatusOption.statusOption.map(
                                (option) => ({
                                    value: option.value,
                                    label: option.label,
                                }),
                            )}
                            value={selectedStatus}
                            onChange={onStatusChange}
                        />
                    </div>
                </div>

                <>
                    {selectedCompliance?.compliance_detail.proof_mandatory ? (
                        <label className="text-red-500">
                            *Please Upload The Proof Of Compliance:
                        </label>
                    ) : (
                        <label>Please Upload The Proof Of Compliance:</label>
                    )}
                    <Input
                        type="file"
                        onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            console.log('File selected:', file?.name)
                            setSelectedFile(file)
                        }}
                        className="mb-4 mt-4"
                    />
                </>
                <label className="mb-2">Please Enter the Remark:</label>
                <Input
                    placeholder="Remarks"
                    textArea
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    className="mb-4"
                />

                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={() => {
                            setIsStatusDialogOpen(false)
                            onDialogClose()
                        }}
                    >
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={handleUpdateStatus}>
                        {' '}
                        {/*  onClick={onSubmit} */}
                        Confirm
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default ComplianceDetailTable
