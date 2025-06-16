import React, { useMemo, useState, useEffect } from 'react';
import DataTable from '@/components/shared/DataTable';
import { Tooltip, Button, Dialog, Notification, toast } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { MdEdit } from 'react-icons/md';
import { FiTrash } from 'react-icons/fi';
import { RiEyeLine } from 'react-icons/ri';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

interface CustomChecklist {
    id: number;
    uuid: string;
    group_id: number;
    country: string;
    function: string;
    applicable: string;
    state_id: number | null;
    legislation_act: string;
    compliance_categorization: string;
    penalty_type: string;
    penalty_description: string;
    compliance_header: string;
    compliance_description: string;
    compliance_applicability: string;
    compliance_reference: string;
    compliance_type: string;
    compliance_frequency: string;
    criticality: string;
    due_date_frequency: string;
    due_dates: {
        first_due_date?: string;
        second_due_date?: string;
        third_due_date?: string;
        last_due_date?: string;
    };
    is_active: boolean;
    created_by: number;
    created_at: string;
    updated_at: string;
    CompanyGroup: {
        id: number;
        name: string;
    };
    State: {
        id: number;
        name: string;
    } | null;
    CompanyAdmin: {
        id: number;
        name: string;
    };
}

const CustomChecklistTable = () => {
    const [data, setData] = useState<CustomChecklist[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<CustomChecklist | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await httpClient.get(endpoints.compliance.listCustomChecklist());
                setData(response.data.data);
            } catch (error) {
                console.error('Error fetching custom checklists:', error);
                toast.push(
                    <Notification title="Error" type="error">
                        Failed to load custom checklists
                    </Notification>
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDeleteClick = (item: CustomChecklist) => {
        setItemToDelete(item);
        setDialogIsOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (itemToDelete) {
            try {
                await httpClient.delete(
                    endpoints.compliance.deleteCustomChecklist(itemToDelete.id)
                );
                setData(prev => prev.filter(item => item.id !== itemToDelete.id));
                toast.push(
                    <Notification title="Success" type="success">
                        Checklist deleted successfully
                    </Notification>
                );
            } catch (error) {
                console.error('Error deleting checklist:', error);
                toast.push(
                    <Notification title="Error" type="error">
                        Failed to delete checklist
                    </Notification>
                );
            }
        }
        setDialogIsOpen(false);
        setItemToDelete(null);
    };

    const handleCancelDelete = () => {
        setDialogIsOpen(false);
        setItemToDelete(null);
    };

    const handleEditClick = (item: CustomChecklist) => {
        navigate(`/app/companyadmin/compliance/checklists/edit/${item.id}`, {
            state: item
        });
    };

    const handleViewDetails = (item: CustomChecklist) => {
        navigate(`/app/companyadmin/compliance/checklists/view/${item.id}`, {
            state: item
        });
    };

    const columns = useMemo(
        () => [
            {
                header: 'ID',
                enableSorting: false,
                accessorKey: 'id',
                cell: (props) => <div className="w-10">{props.getValue()}</div>,
            },
            {
                header: 'Company Group',
                enableSorting: false,
                accessorKey: 'CompanyGroup.name',
                cell: (props) => (
                    <div className="w-24 truncate">
                        {props.row.original.CompanyGroup.name}
                    </div>
                ),
            },
            {
                header: 'Country',
                enableSorting: false,
                accessorKey: 'country',
                cell: (props) => <div className="w-20">{props.getValue()}</div>,
            },
            {
                header: 'Function',
                enableSorting: false,
                accessorKey: 'function',
                cell: (props) => <div className="w-24 truncate">{props.getValue()}</div>,
            },
            {
                header: 'Applicable',
                enableSorting: false,
                accessorKey: 'applicable',
                cell: (props) => (
                    <div className="w-20 capitalize">{props.getValue()}</div>
                ),
            },
            {
                header: 'State',
                enableSorting: false,
                accessorKey: 'State.name',
                cell: (props) => (
                    <div className="w-24">
                        {props.row.original.State?.name || '-'}
                    </div>
                ),
            },
            {
                header: 'Legislation',
                enableSorting: false,
                accessorKey: 'legislation_act',
                cell: (props) => (
                    <Tooltip title={props.getValue() as string} placement="top">
                        <div className="w-32 truncate">{props.getValue()}</div>
                    </Tooltip>
                ),
            },
            {
                header: 'Header',
                enableSorting: false,
                accessorKey: 'compliance_header',
                cell: (props) => (
                    <Tooltip title={props.getValue() as string} placement="top">
                        <div className="w-40 truncate">{props.getValue()}</div>
                    </Tooltip>
                ),
            },
            {
                header: 'Criticality',
                enableSorting: false,
                accessorKey: 'criticality',
                cell: (props) => {
                    const criticality = props.getValue();
                    return (
                        <div className="w-20 font-semibold capitalize">
                            {criticality === 'high' ? (
                                <span className="text-red-500">{criticality}</span>
                            ) : criticality === 'medium' ? (
                                <span className="text-yellow-500">{criticality}</span>
                            ) : (
                                <span className="text-green-500">{criticality}</span>
                            )}
                        </div>
                    );
                },
            },
            {
                header: 'Status',
                enableSorting: false,
                accessorKey: 'is_active',
                cell: (props) => (
                    <div className="w-16">
                        {props.getValue() ? (
                            <span className="text-green-500">Active</span>
                        ) : (
                            <span className="text-red-500">Inactive</span>
                        )}
                    </div>
                ),
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => (
                    <div className='flex space-x-2'>
                        <Tooltip title="View Details" placement="top">
                            <Button
                                size="sm"
                                onClick={() => handleViewDetails(row.original)}
                                icon={<RiEyeLine />}
                                className='hover:bg-transparent'
                            />
                        </Tooltip>
                        <Tooltip title="Edit" placement="top">
                            <Button
                                size="sm"
                                onClick={() => handleEditClick(row.original)}
                                icon={<MdEdit />}
                                className='hover:bg-transparent'
                            />
                        </Tooltip>
                        <Tooltip title="Delete" placement="top">
                            <Button
                                size="sm"
                                onClick={() => handleDeleteClick(row.original)}
                                icon={<FiTrash />}
                                className='hover:bg-transparent text-red-500'
                            />
                        </Tooltip>
                    </div>
                ),
            },
        ],
        []
    );

    return (
        <div className="w-full overflow-x-auto">
            <DataTable
                columns={columns}
                data={data}
                loading={loading}
                stickyHeader={true}
                stickyFirstColumn={true}
                stickyLastColumn={true}
            />
            <Dialog
                isOpen={dialogIsOpen}
                onClose={handleCancelDelete}
                onRequestClose={handleCancelDelete}
                shouldCloseOnOverlayClick={false}
            >
                <h5 className="mb-4">Confirm Delete</h5>
                <p>
                    Are you sure you want to delete the checklist: {itemToDelete?.compliance_header}?
                </p>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={handleCancelDelete}
                    >
                        Cancel
                    </Button>
                    <Button variant="solid" color="red-600" onClick={handleConfirmDelete}>
                        Confirm
                    </Button>
                </div>
            </Dialog>
        </div>
    );
};

export default CustomChecklistTable;