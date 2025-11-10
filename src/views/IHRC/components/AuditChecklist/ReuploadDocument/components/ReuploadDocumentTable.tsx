import React, { useState, useMemo, useCallback } from 'react'
import { ColumnDef } from '@/components/shared/DataTable'
import DataTable from '@/components/shared/DataTable'
import {
    Button,
    Dialog,
    toast,
    Notification,
    Tooltip,
    Input,
} from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import { HiOutlineEye, HiUpload } from 'react-icons/hi'
import { dummyData, ComplianceData } from '@/views/IHRC/store/dummyData'

const ReuploadDocumentTable: React.FC = () => {
    const [uploadDialog, setUploadDialog] = useState<{
        open: boolean
        compliance: ComplianceData | null
    }>({ open: false, compliance: null })
    const [remark, setRemark] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const navigate = useNavigate()

    const getApprovedData = useCallback(() => {
        return dummyData.filter((item) => item.Compliance_Status === 'Complied')
    }, [])

    const approvedData = useMemo(() => getApprovedData(), [getApprovedData])

    const handleUploadDocument = (compliance: ComplianceData) => {
        setUploadDialog({ open: true, compliance })
    }

    const handleConfirmUpload = () => {
        if (!remark || !selectedFile) {
            toast.push(
                <Notification title="Error" closable={true} type="danger">
                    Please provide both a remark and a file.
                </Notification>,
            )
            return
        }

        setUploadDialog({ open: false, compliance: null })
        setRemark('')
        setSelectedFile(null)
        toast.push(
            <Notification title="Success" type="success">
                Document uploaded successfully
            </Notification>,
        )
    }

    const handleViewDetails = (compliance: ComplianceData) => {
        navigate(
            `/app/IHRC/compliance-list-detail/${compliance.Compliance_Instance_ID}`,
            {
                state: compliance,
            },
        )
    }

    const columns: ColumnDef<ComplianceData>[] = useMemo(
        () => [
            {
                header: 'Compliance ID',
                accessorKey: 'Compliance_ID',
                cell: (props) => (
                    <Tooltip
                        title={`Compliance ID: ${props.getValue()}`}
                        placement="top"
                    >
                        <div className="w-10 truncate">{props.getValue()}</div>
                    </Tooltip>
                ),
            },
            {
                header: 'Legislation',
                accessorKey: 'Legislation',
                cell: (props) => (
                    <Tooltip title={props.getValue() as string} placement="top">
                        <div className="w-32 truncate">
                            {props.getValue() as string}
                        </div>
                    </Tooltip>
                ),
            },
            {
                header: 'Criticality',
                accessorKey: 'Criticality',
                cell: (props) => {
                    const criticality = props.getValue()
                    return (
                        <div className="w-24 font-semibold truncate">
                            {criticality === 'High' ? (
                                <span className="text-red-500">
                                    {criticality}
                                </span>
                            ) : criticality === 'Medium' ? (
                                <span className="text-yellow-500">
                                    {criticality}
                                </span>
                            ) : (
                                <span className="text-green-500">
                                    {criticality}
                                </span>
                            )}
                        </div>
                    )
                },
            },
            {
                header: 'Location',
                accessorKey: 'Location',
                cell: (props) => (
                    <Tooltip title={props.getValue() as string} placement="top">
                        <div className="w-20 truncate">
                            {(props.getValue() as string).substring(0, 20)}...
                        </div>
                    </Tooltip>
                ),
            },
            {
                header: 'Header',
                accessorKey: 'Compliance_Header',
                cell: (props) => (
                    <Tooltip title={props.getValue() as string} placement="top">
                        <div className="w-36 truncate">
                            {props.getValue() as string}
                        </div>
                    </Tooltip>
                ),
            },
            {
                header: 'Description',
                accessorKey: 'Compliance_Description',
                cell: (props) => (
                    <Tooltip
                        title={props.getValue() as string}
                        placement="left"
                    >
                        <div className="w-40 truncate">
                            {(props.getValue() as string).substring(0, 30)}...
                        </div>
                    </Tooltip>
                ),
            },
            {
                header: 'Status',
                accessorKey: 'Status',
                cell: (props) => (
                    <div className="font-semibold text-green-500">
                        {props.getValue() as string}
                    </div>
                ),
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <Tooltip
                            title="View Compliance Details"
                            placement="top"
                        >
                            <Button
                                size="sm"
                                className="text-[#737171]"
                                icon={<HiOutlineEye />}
                                onClick={() => handleViewDetails(row.original)}
                            />
                        </Tooltip>
                        <Tooltip
                            title="Upload Compliance Proof"
                            placement="top"
                        >
                            <Button
                                size="sm"
                                onClick={() =>
                                    handleUploadDocument(row.original)
                                }
                            >
                                <HiUpload />
                            </Button>
                        </Tooltip>
                    </div>
                ),
            },
        ],
        [],
    )

    const [tableData, setTableData] = useState({
        total: dummyData.length,
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sort: { order: '', key: '' },
    })

    const onPaginationChange = (page: number) => {
        setTableData((prev) => ({ ...prev, pageIndex: page }))
    }

    const onSelectChange = (value: number) => {
        setTableData((prev) => ({
            ...prev,
            pageSize: Number(value),
            pageIndex: 1,
        }))
    }

    return (
        <div className="relative">
            <DataTable
                columns={columns}
                data={approvedData}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ className: 'rounded-md' }}
                loading={false}
                pagingData={{
                    total: tableData.total,
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                stickyHeader={true}
                stickyFirstColumn={true}
                stickyLastColumn={true}
            />

            <Dialog
                isOpen={uploadDialog.open}
                onClose={() => {
                    setUploadDialog({ open: false, compliance: null })
                    setRemark('')
                    setSelectedFile(null)
                }}
            >
                <h5 className="mb-4">Upload Document</h5>
                <p>Please upload the Proof:</p>
                <Input
                    type="file"
                    onChange={(e) =>
                        setSelectedFile(e.target.files?.[0] || null)
                    }
                    className="mb-4"
                />
                <p>Please Enter the Remark:</p>
                <Input
                    textArea
                    placeholder="Enter remark"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    className="mb-4"
                />

                <div className="text-right mt-6">
                    <Button
                        className="mr-2"
                        variant="plain"
                        onClick={() => {
                            setUploadDialog({ open: false, compliance: null })
                            setRemark('')
                            setSelectedFile(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={handleConfirmUpload}>
                        Confirm
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default ReuploadDocumentTable