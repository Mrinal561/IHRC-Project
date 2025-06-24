import React, { useEffect, useMemo, useState } from 'react'
import {
    Table,
    Button,
    Dialog,
    Tooltip,
    Notification,
    toast,
} from '@/components/ui'
import { FiTrash } from 'react-icons/fi'
import { MdEdit } from 'react-icons/md'
import DataTable, { ColumnDef } from '@/components/shared/DataTable'
import dayjs from 'dayjs'
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json'
import Lottie from 'lottie-react'
import { HiOutlineViewGrid } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { AppDispatch } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import {
    fetchAuditors,
    deleteAuditor,
    selectAuditors,
    selectLoading,
    AuditorData
} from '@/store/slices/auditorEntity/auditorEntitySlice'
import store from '@/store'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'

interface TableData {
    total: number
    pageIndex: number
    pageSize: number
    query: string
    sort: { order: string; key: string }
}

const AuditorTable: React.FC<{
    search: string
    refreshTrigger: number
}> = ({ search, refreshTrigger }) => {
    const dispatch = useDispatch<AppDispatch>()
    const [isLoading, setIsLoading] = useState(false)
    const [auditorTableData, setAuditorTableData] = useState<AuditorData[]>([])
    const navigate = useNavigate()
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<string | null>(null)
    
 

    const columns = useMemo<ColumnDef<AuditorData>[]>(
        () => [
           
            {
                header: 'Company',
                enableSorting: false,
                accessorKey: 'company_name',
                cell: (props) => (
                    <div className="w-32 truncate">
                        {props.getValue() as string}
                    </div>
                ),
            },
            {
                header: 'Firm Name',
                enableSorting: false,
                accessorKey: 'firm_name',
                cell: (props) => (
                    <div className="w-32 truncate">
                        {props.getValue() as string}
                    </div>
                ),
            },
            {
                header: 'Auditor Name',
                enableSorting: false,
                accessorKey: 'name',
                cell: (props) => (
                    <div className="w-32 truncate">
                        {props.getValue() as string}
                    </div>
                ),
            },
            {
                header: 'Email',
                enableSorting: false,
                accessorKey: 'email',
                cell: (props) => (
                    <div className="w-40 truncate">
                        {props.getValue() as string}
                    </div>
                ),
            },
            {
                header: 'Mobile',
                enableSorting: false,
                accessorKey: 'mobile',
                cell: (props) => (
                    <div className="w-36 truncate">
                        {props.getValue() as string}
                    </div>
                ),
            },
            {
                header: 'Audit Frequency',
                enableSorting: false,
                accessorKey: 'audit_frequency',
                cell: (props) => (
                    <div className="w-32 truncate">
                        {props.getValue() as string}
                    </div>
                ),
            },
            {
                header: 'Created At',
                enableSorting: false,
                accessorKey: 'created_at',
                cell: (props) => (
                    <div className="w-32 truncate">
                        {dayjs(props.getValue() as string).format('DD-MM-YYYY')}
                    </div>
                ),
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Tooltip title="Edit Auditor Details">
                            <Button
                                size="sm"
                                onClick={() => navigate('/edit-auditor', {
                                    state: {
                                        companyName: row.original.company_name,
                                        companyId: row.original.company_id,
                                        groupId: row.original.group_id,
                                        auditorId: row.original.id
                                    }
                                })}
                                icon={<MdEdit />}
                                className="text-blue-500"
                            />
                        </Tooltip>
                        <Tooltip title="Delete Auditor">
                            <Button
                                size="sm"
                                onClick={() => openDeleteDialog(row.original.id?.toString() || '')}
                                icon={<FiTrash />}
                                className="text-red-500"
                            />
                        </Tooltip>
                    </div>
                ),
            },
        ],
        [navigate],
    )

    const openDeleteDialog = (auditorId: string) => {
        setItemToDelete(auditorId)
        setDialogIsOpen(true)
    }

   const handleDeleteConfirm = async () => {
    if (itemToDelete) {
        try {
            // Replace Redux dispatch with direct HTTP call
            const response = await httpClient.delete(
                endpoints.auditor.auditorDelete(itemToDelete)
            );

            if (response.data) {
                handleDialogClose();
                // Fetch updated data after deletion
                fetchAuditorData(tableData.pageIndex, tableData.pageSize);
                toast.push(
                    <Notification title="Success" type="success">
                        Auditor deleted successfully
                    </Notification>
                );
            }
        } catch (error) {
            // const errorMessage = error?.response?.data?.message || 'Failed to delete auditor';
            // toast.push(
            //     <Notification title="Error" type="error">
            //         {errorMessage}
            //     </Notification>
            // );
        }
    }
};

    const handleDialogClose = () => {
        setDialogIsOpen(false)
        setItemToDelete(null)
    }

    useEffect(() => {
        fetchAuditorData(1, 10, search)
    }, [search, refreshTrigger])

   const fetchAuditorData = async (
    page: number,
    size: number,
    searchQuery?: string,
) => {
    setIsLoading(true);
    try {
        // Replace Redux dispatch with direct HTTP call
        const response = await httpClient.get(
            endpoints.auditor.listAuditor(),
            {
                params: {
                    page,
                    page_size: size,
                    search: searchQuery || '',
                }
            }
        );

        if (response.data?.data) {
            const auditors = response.data.data;
            setAuditorTableData(auditors);
            setTableData(prev => ({
                ...prev,
                total: response.data.total || auditors.length,
                pageIndex: page,
            }));
        }
    } catch (error) {
        console.error('Failed to fetch auditors:', error);
        // const errorMessage = error?.response?.data?.message || 'Failed to fetch auditors';
        // toast.push(
        //     <Notification title="Error" type="error">
        //         {errorMessage}
        //     </Notification>
        // );
    } finally {
        setIsLoading(false);
    }
};

    const [tableData, setTableData] = useState<TableData>({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sort: { order: '', key: '' },
    })

    const onPaginationChange = (page: number) => {
        setTableData((prev) => ({ ...prev, pageIndex: page }))
        fetchAuditorData(page, tableData.pageSize, search)
    }

    const onSelectChange = (value: number) => {
        setTableData((prev) => ({
            ...prev,
            pageSize: Number(value),
            pageIndex: 1,
        }))
        fetchAuditorData(1, value, search)
    }

    if (isLoading) {
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
            {auditorTableData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
                    <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
                    <p className="text-center">No Data Available</p>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={auditorTableData}
                    loading={isLoading}
                    pagingData={{
                        total: tableData.total,
                        pageIndex: tableData.pageIndex,
                        pageSize: tableData.pageSize,
                    }}
                    onPaginationChange={onPaginationChange}
                    onSelectChange={onSelectChange}
                />
            )}

            <Dialog
                isOpen={dialogIsOpen}
                onClose={handleDialogClose}
                onRequestClose={handleDialogClose}
            >
                <h5 className="mb-4">Confirm Deleting Auditor</h5>
                <p>
                    Are you sure you want to delete this auditor? This action cannot
                    be undone.
                </p>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={handleDialogClose}
                    >
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={handleDeleteConfirm}>
                        Confirm
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default AuditorTable