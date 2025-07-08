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
    Badge,
    DatePicker,
} from '@/components/ui'
import { RiEyeLine } from 'react-icons/ri'
import { HiUpload, HiCheck, HiX } from 'react-icons/hi'
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json'
import Lottie from 'lottie-react'
import { HiOutlineViewGrid } from 'react-icons/hi'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import OutlinedSelect from '@/components/ui/Outlined/Outlined'
import dayjs from 'dayjs'

interface DetailRowProps {
    label: string
    value?: React.ReactNode
    children?: React.ReactNode
}

export type DueComplianceDetailData = {
    id: number
    uuid: string
    compliance_id: number
    group_id: number
    company_id: number
    branch_id: number
    state_id: number
    status:
        | 'pending'
        | 'submitted'
        | 'approved_by_approver'
        | 'rejected_by_approver'
        | 'approved_by_auditor'
        | 'rejected_by_auditor'
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
    due_date_frequency: string
    due_dates: {
        first_due_date: string | null
        second_due_date: string | null
        third_due_date: string | null
        last_due_date: string | null
    }
    owner_id: number
    approver_id: number
    rejection_reason: string | null
    document: string | null
    month: string
    created_by: number
    created_at: string
    updated_at: string
    original_filename: string | null
    mime_type: string | null
    uploaded_at: string | null
    uploaded_by: number | null
    proof_mandatory: boolean
    ComplianceChecklist: {
        id: number
        compliance_header: string
        compliance_description: string
        legislation_act: string
        is_active: boolean
    }
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
    owner: {
        id: number
        name: string
        email: string
    }
    approver: {
        id: number
        name: string
        email: string
    }
}

interface ComplianceDetailTableProps {
    data: DueComplianceDetailData[]
    loading?: boolean
    selectedRole: 'owner' | 'approver' | 'auditor'
    onUploadSingle?: (complianceId: number, file: File, remark: string) => void
    onApprove?: (complianceId: number, complianceStatus: string) => void
    onReject?: (
        complianceId: number,
        reason: string,
        complianceStatus: string,
    ) => void
    onViewDetails?: (complianceId: number) => Promise<any>
    pagination: {
        total: number
        pageIndex: number
        pageSize: number
    }
    onPaginationChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
    canCreate: boolean
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, children }) => (
    <div className="grid grid-cols-3 gap-2">
        <span className="text-gray-600 font-medium">{label}:</span>
        <span className="col-span-2">
            {value || children || (
                <span className="text-gray-400">Not available</span>
            )}
        </span>
    </div>
)

const capitalizeFirstLetter = (str?: string) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const ComplianceDetailTable: React.FC<ComplianceDetailTableProps> = ({
    data = [],
    loading,
    selectedRole,
    onUploadSingle,
    onApprove,
    onReject,
    onViewDetails,
    pagination,
    onPaginationChange,
    onPageSizeChange,
    canCreate,
}) => {
    const [selectedCompliance, setSelectedCompliance] =
        useState<DueComplianceDetailData | null>(null)
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [complianceDetails, setComplianceDetails] = useState<any>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [remark, setRemark] = useState('')
    const [rejectReason, setRejectReason] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [complianceStatus, setComplianceStatus] = useState<string>('')
    const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
    const [actualDateOfPayment, setActualDateOfPayment] = useState<string | null>(null);


    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge className="bg-yellow-100 text-yellow-800">
                        Pending
                    </Badge>
                )
            case 'submitted':
                return (
                    <Badge className="bg-blue-100 text-blue-800">
                        Submitted
                    </Badge>
                )
            case 'approved_by_approver':
                return (
                    <Badge className="bg-green-100 text-green-800">
                        Approved (Approver)
                    </Badge>
                )
            case 'rejected_by_approver':
                return (
                    <Badge className="bg-red-100 text-red-800">
                        Rejected (Approver)
                    </Badge>
                )
            case 'approved_by_auditor':
                return (
                    <Badge className="bg-green-100 text-green-800">
                        Approved (Auditor)
                    </Badge>
                )
            case 'rejected_by_auditor':
                return (
                    <Badge className="bg-red-100 text-red-800">
                        Rejected (Auditor)
                    </Badge>
                )
            default:
                return (
                    <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
                )
        }
    }

    const ownerStatusOptions = [
        { label: 'Complied', value: 'complied' },
        { label: 'Not Complied', value: 'not_complied' },
        { label: 'Not Applicable', value: 'not_applicable' },
    ]

    const approverStatusOptions = [
        { label: 'Complied', value: 'approver_complied' },
        { label: 'Not Complied', value: 'approver_not_complied' },
        { label: 'Not Applicable', value: 'approver_not_applicable' },
    ]

    const auditorStatusOptions = [
        { label: 'Review & Complied', value: 'review_complied' },
        { label: 'Review & Not Complied', value: 'review_not_complied' },
        { label: 'Review & Not Applicable', value: 'review_not_applicable' },
    ]

    const handleViewDetails = async (compliance: DueComplianceDetailData) => {
        if (!compliance?.id) return

        setIsLoading(true)
        try {
            const details = await onViewDetails?.(compliance.id)
            if (details) {
                setComplianceDetails(details)
                setIsViewDialogOpen(true)
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Failed to fetch compliance details
                </Notification>,
            )
        } finally {
            setIsLoading(false)
        }
    }

    // const handleUploadConfirm = async () => {
    //     if (!selectedFile) {
    //         toast.push(
    //             <Notification title="Error" type="error">
    //                 Please select a file
    //             </Notification>,
    //         )
    //         return
    //     }

    //     if (!selectedCompliance?.id) return

    //     setIsLoading(true)

    //     try {
    //         const base64String = await new Promise<string>(
    //             (resolve, reject) => {
    //                 const reader = new FileReader()
    //                 reader.onload = () => {
    //                     const result = reader.result as string
    //                     resolve(result.split(',')[1])
    //                 }
    //                 reader.onerror = reject
    //                 reader.readAsDataURL(selectedFile)
    //             },
    //         )

    //         const payload = {
    //             document: base64String,
    //             company_id: selectedCompliance.company_id,
    //             filename: selectedFile.name,
    //             mimetype: selectedFile.type,
    //         }

    //         const response = await httpClient.post(
    //             endpoints.compliance.dueComplianceDocumentUpload(
    //                 selectedCompliance.id,
    //             ),
    //             payload,
    //         )

    //         toast.push(
    //             <Notification title="Success" type="success">
    //                 Document uploaded
    //             </Notification>,
    //         )
    //         setIsUploadDialogOpen(false)
    //         setSelectedFile(null)
    //         setRemark('')
    //     } catch (error: any) {
    //         console.error('Upload error:', error)
    //         toast.push(
    //             <Notification title="Error" type="error">
    //                 {error.response?.data?.message || 'Upload failed'}
    //             </Notification>,
    //         )
    //     } finally {
    //         setIsLoading(false)
    //     }
    // }

    // const handleUploadConfirm = async () => {
    //     if (!selectedFile) {
    //         toast.push(
    //             <Notification title="Error" type="error">
    //                 Please select a file
    //             </Notification>,
    //         )
    //         return
    //     }

    //     if (!selectedCompliance?.id) return

    //     setIsLoading(true)

    //     try {
    //         const base64String = await new Promise<string>(
    //             (resolve, reject) => {
    //                 const reader = new FileReader()
    //                 reader.onload = () => {
    //                     const result = reader.result as string
    //                     resolve(result.split(',')[1])
    //                 }
    //                 reader.onerror = reject
    //                 reader.readAsDataURL(selectedFile)
    //             },
    //         )

    //         const payload = {
    //             document: base64String,
    //             company_id: selectedCompliance.company_id,
    //             filename: selectedFile.name,
    //             mimetype: selectedFile.type,
    //             complianceStatus: selectedRole === 'owner' ? complianceStatus : undefined,
    //             actual_date_of_payment: actualDateOfPayment 
    //         ? dayjs(actualDateOfPayment).format('YYYY-MM-DD') 
    //         : undefined,
    //         }

    //         const response = await httpClient.post(
    //             endpoints.compliance.dueComplianceDocumentUpload(
    //                 selectedCompliance.id,
    //             ),
    //             payload,
    //         )

    //         toast.push(
    //             <Notification title="Success" type="success">
    //                 Document uploaded
    //             </Notification>,
    //         )
    //         setIsUploadDialogOpen(false)
    //         setSelectedFile(null)
    //         setRemark('')
    //         setComplianceStatus('')
    //         setActualDateOfPayment(null);
    //     } catch (error: any) {
    //         console.error('Upload error:', error)
    //         toast.push(
    //             <Notification title="Error" type="error">
    //                 {error.response?.data?.message || 'Upload failed'}
    //             </Notification>,
    //         )
    //     } finally {
    //         setIsLoading(false)
    //     }
    // }

    const handleUploadConfirm = async () => {
    // Check if selectedCompliance is null
    if (!selectedCompliance) {
        toast.push(
            <Notification title="Error" type="danger">
                No compliance selected
            </Notification>,
        );
        return;
    }

    // Validate proof mandatory field
    if (selectedCompliance.proof_mandatory && !selectedFile) {
        toast.push(
            <Notification title="Error" type="danger">
                Document is required for this compliance
            </Notification>,
        );
        return;
    }

   

    setIsLoading(true);

    try {
        let base64String = '';
        if (selectedFile) {
            base64String = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    resolve(result.split(',')[1]);
                };
                reader.onerror = reject;
                reader.readAsDataURL(selectedFile);
            });
        }

        const payload = {
            document: selectedFile ? base64String : undefined,
            company_id: selectedCompliance.company_id,
            filename: selectedFile?.name,
            mimetype: selectedFile?.type,
            complianceStatus: selectedRole === 'owner' ? complianceStatus : undefined,
            actual_date_of_payment: actualDateOfPayment 
                ? dayjs(actualDateOfPayment).format('YYYY-MM-DD') 
                : undefined,
        };

        const response = await httpClient.post(
            endpoints.compliance.dueComplianceDocumentUpload(
                selectedCompliance.id,
            ),
            payload,
        );

        toast.push(
            <Notification title="Success" type="success">
                {selectedFile ? 'Document uploaded' : 'Status updated'}
            </Notification>,
        );
        
        setIsUploadDialogOpen(false);
        setSelectedFile(null);
        setRemark('');
        setComplianceStatus('');
        setActualDateOfPayment(null);
    } catch (error: any) {
        console.error('Upload error:', error);
        toast.push(
            <Notification title="Error" type="error">
                {error.response?.data?.message || 'Operation failed'}
            </Notification>,
        );
    } finally {
        setIsLoading(false);
    }
}

    // const handleRejectConfirm = async () => {
    //     if (!rejectReason) {
    //         toast.push(
    //             <Notification title="Error" type="danger">
    //                 Please enter a rejection reason
    //             </Notification>,
    //         )
    //         return
    //     }

    //     if (!selectedCompliance?.id) return

    //     try {
    //         await onReject?.(selectedCompliance.id, rejectReason)
    //         setIsRejectDialogOpen(false)
    //         setRejectReason('')
    //     } catch (error) {
    //         console.error('Reject error:', error)
    //     }
    // }

    //     const handleRejectConfirm = async () => {
    //   if (!rejectReason) {
    //     toast.push(
    //       <Notification title="Error" type="danger">
    //         Please enter a rejection reason
    //       </Notification>
    //     );
    //     return;
    //   }

    //   if (!complianceStatus) {
    //     toast.push(
    //       <Notification title="Error" type="danger">
    //         Please select a compliance status
    //       </Notification>
    //     );
    //     return;
    //   }

    //   if (!selectedCompliance?.id) return;

    //   try {
    //     await onReject?.(selectedCompliance.id, rejectReason, complianceStatus);
    //     setIsRejectDialogOpen(false);
    //     setRejectReason('');
    //     setComplianceStatus('');
    //   } catch (error) {
    //     console.error('Reject error:', error);
    //   }
    // };

    const handleApproveConfirm = async () => {
        if (!complianceStatus) {
            toast.push(
                <Notification title="Error" type="danger">
                    Please select a compliance status
                </Notification>,
            )
            return
        }

        if (!selectedCompliance?.id) return

        try {
            let endpoint
            if (selectedRole === 'approver') {
                endpoint = endpoints.compliance.approveOwnerCompliance(
                    selectedCompliance.id,
                )
            } else if (selectedRole === 'auditor') {
                endpoint = endpoints.compliance.approveApproverCompliance(
                    selectedCompliance.id,
                )
            } else {
                throw new Error('Invalid role for approval')
            }

            const payload = {
                complianceStatus: complianceStatus,
            }

            await httpClient.post(endpoint, payload)

            toast.push(
                <Notification title="Success" type="success">
                    Compliance approved successfully
                </Notification>,
            )

            setIsApproveDialogOpen(false)
            setComplianceStatus('')

            // Optionally refresh your data here
        } catch (error: any) {
            console.error('Approve error:', error)
            toast.push(
                <Notification title="Error" type="error">
                    {error.response?.data?.message ||
                        'Failed to approve compliance'}
                </Notification>,
            )
        }
    }

    const handleRejectConfirm = async () => {
        if (!rejectReason) {
            toast.push(
                <Notification title="Error" type="danger">
                    Please enter a rejection reason
                </Notification>,
            )
            return
        }

        if (!complianceStatus) {
            toast.push(
                <Notification title="Error" type="danger">
                    Please select a compliance status
                </Notification>,
            )
            return
        }

        if (!selectedCompliance?.id) return

        try {
            let endpoint
            if (selectedRole === 'approver') {
                endpoint = endpoints.compliance.rejectOwnerCompliance(
                    selectedCompliance.id,
                )
            } else if (selectedRole === 'auditor') {
                endpoint = endpoints.compliance.rejectApproverCompliance(
                    selectedCompliance.id,
                )
            } else {
                throw new Error('Invalid role for rejection')
            }

            const payload = {
                complianceStatus: complianceStatus,
                rejectionReason: rejectReason,
            }

            await httpClient.post(endpoint, payload)

            toast.push(
                <Notification title="Success" type="success">
                    Compliance rejected successfully
                </Notification>,
            )

            setIsRejectDialogOpen(false)
            setRejectReason('')
            setComplianceStatus('')

            // Optionally refresh your data here
        } catch (error: any) {
            console.error('Reject error:', error)
            toast.push(
                <Notification title="Error" type="error">
                    {error.response?.data?.message ||
                        'Failed to reject compliance'}
                </Notification>,
            )
        }
    }

   const calculateCurrentDueDate = (dueDate: string, frequency: string): string => {
    if (!dueDate) return 'N/A';
    
    const originalDate = new Date(dueDate);
    const currentDate = new Date();
    const originalMonth = originalDate.getMonth();
    const currentMonth = currentDate.getMonth();
    
    switch (frequency.toLowerCase()) {
        case 'monthly':
            // For monthly, keep the day but use current month and year
            return new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                originalDate.getDate()
            ).toLocaleDateString();
            
        case 'yearly':
            // For yearly, keep the day and month but use current year
            return new Date(
                currentDate.getFullYear(),
                originalMonth,
                originalDate.getDate()
            ).toLocaleDateString();
            
        case 'half-yearly':
            // For half-yearly, we need to determine which half we're in
            // First half is Jan-Jun, second is Jul-Dec
            const isFirstHalf = currentMonth < 6;
            const targetMonth = isFirstHalf ? originalMonth : originalMonth + 6;
            
            return new Date(
                currentDate.getFullYear(),
                targetMonth,
                originalDate.getDate()
            ).toLocaleDateString();
            
        case 'quarterly':
            // For quarterly, we need to determine which quarter we're in
            const quarter = Math.floor(currentMonth / 3);
            const targetMonthQuarterly = originalMonth + (quarter * 3);
            
            return new Date(
                currentDate.getFullYear(),
                targetMonthQuarterly,
                originalDate.getDate()
            ).toLocaleDateString();
            
        default:
            // For one-time or unknown frequencies, return the original date
            return originalDate.toLocaleDateString();
    }
}

    const columns: ColumnDef<DueComplianceDetailData>[] = useMemo(
        () => [
            {
                header: 'Compliance ID',
                enableSorting: false,
                accessorKey: 'uuid',
                cell: (props) => (
                    <div className="w-40 text-start">
                        {props.getValue() as string}
                    </div>
                ),
            },
            {
                header: 'Header',
                enableSorting: false,
                accessorKey: 'compliance_header',
                cell: (props) => (
                    <Tooltip title={props.getValue() as string}>
                        <div className="w-48 truncate">
                            {capitalizeFirstLetter(props.getValue() as string)}
                        </div>
                    </Tooltip>
                ),
            },
            {
                header: 'Legislation',
                enableSorting: false,
                accessorKey: 'legislation_act',
                cell: (props) => (
                    <Tooltip title={props.getValue() as string}>
                        <div className="w-48 truncate">
                            {capitalizeFirstLetter(props.getValue() as string)}
                        </div>
                    </Tooltip>
                ),
            },
            {
                header: 'Category',
                enableSorting: false,
                accessorKey: 'compliance_categorization',
                cell: (props) => (
                    <Tooltip title={props.getValue() as string} placement="top">
                        <div className="w-40 truncate">
                            {capitalizeFirstLetter(props.getValue() as string)}
                        </div>
                    </Tooltip>
                ),
            },
            {
                header: 'Company',
                enableSorting: false,
                accessorFn: (row) => row.Company?.name || '--',
                cell: (props) => (
                    <div className="w-40">
                        {capitalizeFirstLetter(props.getValue() as string)}
                    </div>
                ),
            },
            {
                header: 'Branch',
                enableSorting: false,
                accessorFn: (row) => row.Branch?.name || '--',
                cell: (props) => (
                    <div className="w-40">
                        {capitalizeFirstLetter(props.getValue() as string)}
                    </div>
                ),
            },
            {
                header: 'State',
                enableSorting: false,
                accessorFn: (row) => row.State?.name || '--',
                cell: (props) => (
                    <div className="w-32">
                        {capitalizeFirstLetter(props.getValue() as string)}
                    </div>
                ),
            },
            {
                header: 'Frequency',
                enableSorting: false,
                accessorKey: 'compliance_frequency',
                cell: (props) => (
                    <div className="w-24">
                        {capitalizeFirstLetter(props.getValue() as string)}
                    </div>
                ),
            },
            {
            header: 'Due Date',
            enableSorting: false,
            accessorFn: (row) => row.due_dates?.first_due_date || null,
            cell: (props) => {
                const dueDate = props.getValue() as string | null;
                const frequency = props.row.original.due_date_frequency;
                
                const calculatedDueDate = dueDate 
                    ? calculateCurrentDueDate(dueDate, frequency)
                    : 'N/A';
                
                return (
                    <div className="w-32">
                        {calculatedDueDate}
                    </div>
                );
            },
        },
            {
                header: 'Rejection Reason',
                enableSorting: false,
                accessorKey: 'rejection_reason',
                cell: (props) => (
                    <div className="w-24">
                        {capitalizeFirstLetter(props.getValue() as string)}
                    </div>
                ),
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => {
                    const status = row.original.status

                    return (
                        <div className="flex space-x-2">
                            <Tooltip title="View Details" placement="top">
                                <Button
                                    size="sm"
                                    onClick={() =>
                                        handleViewDetails(row.original)
                                    }
                                    icon={<RiEyeLine />}
                                    className="hover:bg-transparent"
                                />
                            </Tooltip>

                            {selectedRole === 'owner' &&
                                status === 'pending' && (
                                    <Tooltip
                                        title="Upload Document"
                                        placement="top"
                                    >
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                setSelectedCompliance(
                                                    row.original,
                                                )
                                                setIsUploadDialogOpen(true)
                                            }}
                                            icon={<HiUpload />}
                                            className="hover:bg-transparent"
                                        />
                                    </Tooltip>
                                )}

                            {selectedRole === 'approver' &&
                                status === 'submitted' && (
                                    <>
                                        <Tooltip
                                            title="Approve"
                                            placement="top"
                                        >
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedCompliance(
                                                        row.original,
                                                    )
                                                    setIsApproveDialogOpen(true)
                                                }}
                                                icon={<HiCheck />}
                                                className="hover:bg-transparent text-green-500"
                                            />
                                        </Tooltip>
                                        <Tooltip title="Reject" placement="top">
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedCompliance(
                                                        row.original,
                                                    )
                                                    setIsRejectDialogOpen(true)
                                                }}
                                                icon={<HiX />}
                                                className="hover:bg-transparent text-red-500"
                                            />
                                        </Tooltip>
                                    </>
                                )}

                            {selectedRole === 'auditor' &&
                                status === 'approved_by_approver' && (
                                    <>
                                        <Tooltip
                                            title="Approve"
                                            placement="top"
                                        >
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedCompliance(
                                                        row.original,
                                                    )
                                                    setIsApproveDialogOpen(true)
                                                }}
                                                icon={<HiCheck />}
                                                className="hover:bg-transparent text-green-500"
                                            />
                                        </Tooltip>
                                        <Tooltip title="Reject" placement="top">
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedCompliance(
                                                        row.original,
                                                    )
                                                    setIsRejectDialogOpen(true)
                                                }}
                                                icon={<HiX />}
                                                className="hover:bg-transparent text-red-500"
                                            />
                                        </Tooltip>
                                    </>
                                )}

                            {/* {(selectedRole === 'approver' && status === 'submitted') || 
         (selectedRole === 'auditor' && status === 'approved_by_approver') && (
          <>
            <Tooltip title="Approve" placement="top">
              <Button
                size="sm"
                onClick={() => {
                  setSelectedCompliance(row.original);
                  setIsApproveDialogOpen(true);
                }}
                icon={<HiCheck />}
                className="hover:bg-transparent text-green-500"
              />
            </Tooltip>
            <Tooltip title="Reject" placement="top">
              <Button
                size="sm"
                onClick={() => {
                  setSelectedCompliance(row.original);
                  setIsRejectDialogOpen(true);
                }}
                icon={<HiX />}
                className="hover:bg-transparent text-red-500"
              />
            </Tooltip>
          </>
        )} */}
                        </div>
                    )
                },
            },
        ],
        [selectedRole, onApprove, onReject],
    )

    if (loading || isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500 rounded-xl">
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
                <>
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
                        onPaginationChange={onPaginationChange}
                        onSelectChange={onPageSizeChange}
                        stickyHeader={true}
                        stickyFirstColumn={true}
                        stickyLastColumn={true}
                    />
                    {/* <Dialog
            isOpen={isUploadDialogOpen}
            onClose={() => setIsUploadDialogOpen(false)}
            width={500}
          >
            <h5 className="mb-4">Upload Compliance Document</h5>
            <div className="mb-4">
              <p className="font-semibold">Compliance:</p>
              <p>{selectedCompliance?.compliance_header || 'N/A'}</p>
            </div>
            <Input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="mb-4"
            />
            <Input
              textArea
              rows={3}
              placeholder="Enter remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="mb-4"
            />
            <div className="text-right mt-6">
              <Button
                className="mr-2"
                variant="plain"
                onClick={() => setIsUploadDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="solid"
                onClick={handleUploadConfirm}
              >
                Upload
              </Button>
            </div>
          </Dialog> */}
                    <Dialog
                        isOpen={isUploadDialogOpen}
                        onClose={() => setIsUploadDialogOpen(false)}
                        width={500}
                    >
                        <h5 className="mb-4">Upload Compliance Document</h5>

                        <div className="mb-4 flex gap-2 items-center">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Set Compliance Status:
                            </label>
                            <div className="w-1/2">
                                {' '}
                                {/* This wrapper will control the width */}
                                {selectedRole === 'owner' && (
                                    <OutlinedSelect
                                        label="Select compliance status"
                                        options={ownerStatusOptions}
                                        value={ownerStatusOptions.find(
                                            (opt) =>
                                                opt.value === complianceStatus,
                                        )}
                                        onChange={(option) =>
                                            setComplianceStatus(
                                                option?.value || '',
                                            )
                                        }
                                    />
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
            Actual Date of Payment:
        </label>
       <DatePicker
            inputtable
            clearable
            size="sm"
            value={actualDateOfPayment ? new Date(actualDateOfPayment) : null}
            onChange={(date) => {
                setActualDateOfPayment(date ? dayjs(date).format('YYYY-MM-DD') : null);
            }}
            inputFormat="YYYY-MM-DD"
            placeholder="Select payment date"
        />
                        </div>

                        <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            Upload the document:
            {selectedCompliance?.proof_mandatory && (
                <span className="text-red-500 ml-1">*</span>
            )}
        </label>
        <Input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className={`${selectedCompliance?.proof_mandatory && !selectedFile ? 'border-red-500' : ''}`}
        />
        {selectedCompliance?.proof_mandatory && !selectedFile && (
            <p className="mt-1 text-sm text-red-600">Document is required</p>
        )}
    </div>

                        <div className="mb-4">
                            <Input
                                textArea
                                rows={3}
                                placeholder="Enter remark"
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                            />
                        </div>

                        <div className="text-right mt-6">
                            <Button
                                className="mr-2"
                                variant="plain"
                                onClick={() => {
                                    setIsUploadDialogOpen(false)
                                    setComplianceStatus('')
                                    setActualDateOfPayment(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="solid"
                                onClick={handleUploadConfirm}
                                disabled={
                                    !selectedFile ||
                                    (selectedRole === 'owner' &&
                                        !complianceStatus)
                                }
                            >
                                Upload
                            </Button>
                        </div>
                    </Dialog>
                    {/* <Dialog
                        isOpen={isApproveDialogOpen}
                        onClose={() => {
                            setIsApproveDialogOpen(false)
                            setComplianceStatus('')
                        }}
                        width={500}
                    >
                        <h5 className="mb-4">Approve Compliance</h5>

                        <div className="mb-4 flex gap-2 items-center">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Set Compliance Status:
                            </label>

                            <div className="w-1/2">
                                <OutlinedSelect
                                    // className="mb-4"
                                    label="Select compliance status"
                                    options={
                                        selectedRole === 'approver'
                                            ? approverStatusOptions
                                            : auditorStatusOptions
                                    }
                                    value={(selectedRole === 'approver'
                                        ? approverStatusOptions
                                        : auditorStatusOptions
                                    ).find(
                                        (opt) => opt.value === complianceStatus,
                                    )}
                                    onChange={(option) =>
                                        setComplianceStatus(option?.value || '')
                                    }
                                />
                            </div>
                        </div>
                        <div className="text-right mt-6">
                            <Button
                                className="mr-2"
                                variant="plain"
                                onClick={() => {
                                    setIsApproveDialogOpen(false)
                                    setComplianceStatus('')
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="solid"
                                onClick={() => {
                                    if (
                                        selectedCompliance?.id &&
                                        complianceStatus
                                    ) {
                                        onApprove?.(
                                            selectedCompliance.id,
                                            complianceStatus,
                                        )
                                        setIsApproveDialogOpen(false)
                                    }
                                }}
                                disabled={!complianceStatus}
                            >
                                Confirm Approval
                            </Button>
                        </div>
                    </Dialog> */}

                    <Dialog
  isOpen={isApproveDialogOpen}
  onClose={() => {
    setIsApproveDialogOpen(false);
    setComplianceStatus('');
  }}
  width={500}
>
  <h5 className="mb-4">Approve Compliance</h5>
  
  <div className="mb-4 flex gap-2 items-center">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Compliance Status:
    </label>
    <div className="w-1/2">
      <OutlinedSelect
        label="Select status"
        options={
          selectedRole === 'approver' 
            ? approverStatusOptions 
            : auditorStatusOptions
        }
        value={
          (selectedRole === 'approver' 
            ? approverStatusOptions 
            : auditorStatusOptions
          ).find(opt => opt.value === complianceStatus)
        }
        onChange={(option) => setComplianceStatus(option?.value || '')}
      />
    </div>
  </div>

  <div className="text-right mt-6">
    <Button
      className="mr-2"
      variant="plain"
      onClick={() => {
        setIsApproveDialogOpen(false);
        setComplianceStatus('');
      }}
    >
      Cancel
    </Button>
    <Button
      variant="solid"
      onClick={handleApproveConfirm}
      disabled={!complianceStatus}
    >
      Confirm Approval
    </Button>
  </div>
</Dialog>
                    {/* <Dialog
                        isOpen={isRejectDialogOpen}
                        onClose={() => setIsRejectDialogOpen(false)}
                        width={500}
                    >
                        <h5 className="mb-4">Reject Compliance</h5>
                        <div className="mb-4">
                            <p className="font-semibold">Compliance:</p>
                            <p>
                                {selectedCompliance?.compliance_header || 'N/A'}
                            </p>
                        </div>
                        <Input
                            textArea
                            rows={3}
                            placeholder="Enter rejection reason"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="mb-4"
                        />
                        <div className="text-right mt-6">
                            <Button
                                className="mr-2"
                                variant="plain"
                                onClick={() => {
                                    setIsRejectDialogOpen(false)
                                    setRejectReason('')
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="solid"
                                onClick={handleRejectConfirm}
                                disabled={!rejectReason.trim()}
                            >
                                Confirm Rejection
                            </Button>
                        </div>
                    </Dialog> */}
                   <Dialog
  isOpen={isRejectDialogOpen}
  onClose={() => {
    setIsRejectDialogOpen(false);
    setComplianceStatus('');
  }}
  width={500}
>
  <h5 className="mb-4">Reject Compliance</h5>
  
  <div className="mb-4 flex gap-2 items-center">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Compliance Status:
    </label>
    <div className="w-1/2">
      <OutlinedSelect
        label="Select status"
        options={
          selectedRole === 'approver' 
            ? approverStatusOptions 
            : auditorStatusOptions
        }
        value={
          (selectedRole === 'approver' 
            ? approverStatusOptions 
            : auditorStatusOptions
          ).find(opt => opt.value === complianceStatus)
        }
        onChange={(option) => setComplianceStatus(option?.value || '')}
      />
    </div>
  </div>

  <div className="mb-4">
    <Input
      textArea
      rows={3}
      placeholder="Enter rejection reason"
      value={rejectReason}
      onChange={(e) => setRejectReason(e.target.value)}
    />
  </div>

  <div className="text-right mt-6">
    <Button
      className="mr-2"
      variant="plain"
      onClick={() => {
        setIsRejectDialogOpen(false);
        setRejectReason('');
        setComplianceStatus('');
      }}
    >
      Cancel
    </Button>
    <Button
      variant="solid"
      onClick={handleRejectConfirm}
      disabled={!rejectReason.trim() || !complianceStatus}
    >
      Confirm Rejection
    </Button>
  </div>
</Dialog>
                    <Dialog
                        isOpen={isViewDialogOpen}
                        onClose={() => setIsViewDialogOpen(false)}
                        width={1000}
                    >
                        <h5 className="mb-4">Compliance Details</h5>
                        {complianceDetails && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h6 className="font-semibold text-gray-700">
                                        Basic Information
                                    </h6>
                                    <DetailRow
                                        label="Compliance ID"
                                        value={complianceDetails.uuid}
                                    />
                                    <DetailRow
                                        label="Compliance Header"
                                        value={capitalizeFirstLetter(
                                            complianceDetails.compliance_header,
                                        )}
                                    />
                                    <DetailRow
                                        label="Description"
                                        value={capitalizeFirstLetter(
                                            complianceDetails.compliance_description,
                                        )}
                                    />
                                    <DetailRow
                                        label="Status"
                                        value={capitalizeFirstLetter(
                                            complianceDetails.status,
                                        )}
                                    />
                                    <DetailRow
                                        label="Due Date"
                                        value={
                                            complianceDetails.due_dates
                                                ?.first_due_date
                                                ? new Date(
                                                      complianceDetails.due_dates.first_due_date,
                                                  ).toLocaleDateString()
                                                : 'N/A'
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <h6 className="font-semibold text-gray-700">
                                        Legislation & Category
                                    </h6>
                                    <DetailRow
                                        label="Legislation Act"
                                        value={capitalizeFirstLetter(
                                            complianceDetails.legislation_act,
                                        )}
                                    />
                                    <DetailRow
                                        label="Category"
                                        value={capitalizeFirstLetter(
                                            complianceDetails.compliance_categorization,
                                        )}
                                    />
                                    <DetailRow
                                        label="Applicable"
                                        value={capitalizeFirstLetter(
                                            complianceDetails.applicable,
                                        )}
                                    />
                                    <DetailRow
                                        label="Frequency"
                                        value={capitalizeFirstLetter(
                                            complianceDetails.compliance_frequency,
                                        )}
                                    />
                                    <DetailRow
                                        label="Criticality"
                                        value={capitalizeFirstLetter(
                                            complianceDetails.criticality,
                                        )}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <h6 className="font-semibold text-gray-700">
                                        Company Information
                                    </h6>
                                    <DetailRow
                                        label="Company Group"
                                        value={capitalizeFirstLetter(
                                            complianceDetails.CompanyGroup
                                                ?.name,
                                        )}
                                    />
                                    <DetailRow
                                        label="Company"
                                        value={capitalizeFirstLetter(
                                            complianceDetails.Company?.name,
                                        )}
                                    />
                                    <DetailRow
                                        label="Branch"
                                        value={capitalizeFirstLetter(
                                            complianceDetails.Branch?.name,
                                        )}
                                    />
                                    <DetailRow
                                        label="State"
                                        value={capitalizeFirstLetter(
                                            complianceDetails.State?.name,
                                        )}
                                    />
                                    <DetailRow
                                        label="Created By"
                                        value={capitalizeFirstLetter(
                                            complianceDetails.CompanyAdmin
                                                ?.name,
                                        )}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <h6 className="font-semibold text-gray-700">
                                        Compliance Details
                                    </h6>
                                    <DetailRow
                                        label="Penalty Type"
                                        value={capitalizeFirstLetter(
                                            complianceDetails.penalty_type,
                                        )}
                                    />
                                    <DetailRow
                                        label="Penalty Description"
                                        value={capitalizeFirstLetter(
                                            complianceDetails.penalty_description,
                                        )}
                                    />
                                    <DetailRow
                                        label="Applicability"
                                        value={capitalizeFirstLetter(
                                            complianceDetails.compliance_applicability,
                                        )}
                                    />
                                    <DetailRow
                                        label="Reference"
                                        value={capitalizeFirstLetter(
                                            complianceDetails.compliance_reference,
                                        )}
                                    />
                                    <DetailRow
                                        label="Type"
                                        value={capitalizeFirstLetter(
                                            complianceDetails.compliance_type,
                                        )}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="mt-6 text-right">
                            <Button onClick={() => setIsViewDialogOpen(false)}>
                                Close
                            </Button>
                        </div>
                    </Dialog>
                </>
            )}
        </div>
    )
}

export default ComplianceDetailTable
