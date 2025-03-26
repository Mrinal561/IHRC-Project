import React, { useMemo, useState } from 'react';
import { Button, Dialog, Tooltip } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { MdEdit } from 'react-icons/md';
import { FiFile, FiTrash } from 'react-icons/fi';
import { DataTable } from '@/components/shared';
import { HiOutlineViewGrid } from 'react-icons/hi';

const ReturnTrackerTable = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [tableData, setTableData] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
    });

    // Dummy data for the table
    const dummyData = [
        {
            id: 1,
            act_name: 'Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013',
            return_name: 'Return 1',
            state: 'Gujarat',
            district: 'Ahmedabad',
            location: 'Ahmedabad',
            branch: 'Ahmedabad Branch',
            frequency: 'Monthly',
            month: 'March',
            year: '2024',
            first_due_date: '15-05-2024',
            second_due_date: '-',
            third_due_date: '-',
            last_due_date: '-',
            return_file_submission: 'Not Applicable',
            na_reason: 'Checking',
            submission_date: '-',
            delay_reason: '-',
            return_document: '',
        },
        {
            id: 2,
            act_name: 'Factories Act, 1948',
            return_name: 'Return 2',
            state: 'Maharashtra',
            district: 'Mumbai',
            location: 'Mumbai',
            branch: 'Mumbai Branch',
            frequency: 'Monthly',
            month: 'April',
            year: '2024',
            first_due_date: '10-05-2024',
            second_due_date: '-',
            third_due_date: '-',
            last_due_date: '-',
            return_file_submission: 'Applicable',
            na_reason: '-',
            submission_date: '09-05-2024',
            delay_reason: '-',
            return_document: '',
        },
        {
            id: 3,
            act_name: 'Payment of Wages Act, 1934',
            return_name: 'Return 3',
            state: 'Karnataka',
            district: 'Bengaluru',
            location: 'Bengaluru',
            branch: 'Bengaluru Branch',
            frequency: 'Half Yearly',
            month: 'September',
            year: '2024',
            first_due_date: '30-09-2024',
            second_due_date: '-',
            third_due_date: '-',
            last_due_date: '31-03-25',
            return_file_submission: 'Applicable',
            na_reason: '-',
            submission_date: '28-09-24',
            delay_reason: '-',
            return_document: '',
        },
        {
            id: 4,
            act_name: 'Minimum Wages Act, 1948',
            return_name: 'Return 4',
            state: 'Tamil Nadu',
            district: 'Chennai',
            location: 'Chennai',
            branch: 'Chennai Branch',
            frequency: 'Half Yearly',
            month: 'September',
            year: '2024',
            first_due_date: '30-09-2024',
            second_due_date: '-',
            third_due_date: '-',
            last_due_date: '31-03-25',
            return_file_submission: 'Applicable',
            na_reason: '-',
            submission_date: '28-09-24',
            delay_reason: '-',
            return_document: '',
        },
        {
            id: 5,
            act_name: 'Employee Compensation Act, 1923',
            return_name: 'Return 5',
            state: 'Delhi',
            district: 'New Delhi',
            location: 'New Delhi',
            branch: 'New Delhi Branch',
            frequency: 'Yearly',
            month: 'January',
            year: '2025',
            first_due_date: '10-01-2025',
            second_due_date: '-',
            third_due_date: '-',
            last_due_date: '-',
            return_file_submission: 'Not Applicable',
            na_reason: 'Checking',
            submission_date: '-',
            delay_reason: '-',
            return_document: '',
        },
    ];

    const columns = useMemo(
        () => [
            {
                header: 'Act Name',
                enableSorting: false,
                accessorKey: 'act_name',
                cell: ({ row }) => (
                    <Tooltip title={row.original.act_name}>
                        <div className="w-52 truncate">{row.original.act_name}</div>
                    </Tooltip>
                ),
            },
            {
                header: 'Return Name',
                enableSorting: false,
                accessorKey: 'return_name',
                cell: ({ row }) => (
                    <Tooltip title={row.original.return_name}>
                        <div className="w-52 truncate">{row.original.return_name}</div>
                    </Tooltip>
                ),
            },
            {
                header: 'State',
                enableSorting: false,
                accessorKey: 'state',
                cell: ({ row }) => <div className="w-40 truncate">{row.original.state}</div>,
            },
            // {
            //     header: 'District',
            //     enableSorting: false,
            //     accessorKey: 'district',
            //     cell: ({ row }) => <div className="w-40 truncate">{row.original.district}</div>,
            // },
            // {
            //     header: 'Location',
            //     enableSorting: false,
            //     accessorKey: 'location',
            //     cell: ({ row }) => <div className="w-40 truncate">{row.original.location}</div>,
            // },
            {
                header: 'Branch',
                enableSorting: false,
                accessorKey: 'branch',
                cell: ({ row }) => <div className="w-40 truncate">{row.original.branch}</div>,
            },
            {
                header: 'Frequency',
                enableSorting: false,
                accessorKey: 'frequency',
                cell: ({ row }) => <div className="w-40 truncate">{row.original.frequency}</div>,
            },
            {
                header: 'Month',
                enableSorting: false,
                accessorKey: 'month',
                cell: ({ row }) => <div className="w-40 truncate">{row.original.month}</div>,
            },
            {
                header: 'Year',
                enableSorting: false,
                accessorKey: 'year',
                cell: ({ row }) => <div className="w-40 truncate">{row.original.year}</div>,
            },
            {
                header: 'First Due Date',
                enableSorting: false,
                accessorKey: 'first_due_date',
                cell: ({ row }) => <div className="w-40 truncate">{row.original.first_due_date}</div>,
            },
            {
                header: 'Second Due Date',
                enableSorting: false,
                accessorKey: 'second_due_date',
                cell: ({ row }) => <div className="w-40 truncate">{row.original.second_due_date}</div>,
            },
            {
                header: 'Third Due Date',
                enableSorting: false,
                accessorKey: 'third_due_date',
                cell: ({ row }) => <div className="w-40 truncate">{row.original.third_due_date}</div>,
            },
            {
                header: 'Last Due Date',
                enableSorting: false,
                accessorKey: 'last_due_date',
                cell: ({ row }) => <div className="w-40 truncate">{row.original.last_due_date}</div>,
            },
            {
                header: 'Return File Submission',
                enableSorting: false,
                accessorKey: 'return_file_submission',
                cell: ({ row }) => <div className="w-40 truncate">{row.original.return_file_submission}</div>,
            },
            {
                header: 'NA Reason',
                enableSorting: false,
                accessorKey: 'na_reason',
                cell: ({ row }) => <div className="w-40 truncate">{row.original.na_reason}</div>,
            },
            {
                header: 'Submission Date',
                enableSorting: false,
                accessorKey: 'submission_date',
                cell: ({ row }) => <div className="w-40 truncate">{row.original.submission_date}</div>,
            },
            {
                header: 'Delay Reason',
                enableSorting: false,
                accessorKey: 'delay_reason',
                cell: ({ row }) => <div className="w-40 truncate">{row.original.delay_reason}</div>,
            },
            {
                header: 'Return Document',
                enableSorting: false,
                accessorKey: 'return_document',
                cell: ({ row }) => {
                    
                              return (
                                <div className="w-40 flex items-center justify-center">
                                  {document ? (
                                    <a 
                                      href="#" 
                                      className="text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                      <FiFile className="w-5 h-5" />
                                    </a>
                                  ) : (
                                    <a 
                                    href="#" 
                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                  >
                                    <FiFile className="w-5 h-5" />
                                  </a>
                                  )}
                                </div>
                              );
                }
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Tooltip title="Edit">
                            <Button
                                size="sm"
                                onClick={() =>
                                    navigate('/edit-return-tracker', {
                                        state: { returnTrackerId: row.original.id },
                                    })
                                }
                                icon={<MdEdit />}
                                className="text-blue-500"
                            />
                        </Tooltip>

                        {/* <Tooltip title="Delete">
                            <Button
                                size="sm"
                                icon={<FiTrash />}
                                className="text-red-500"
                                onClick={() => {
                                    setDeleteDialogOpen(true);
                                }}
                            />
                        </Tooltip> */}
                    </div>
                ),
            },
        ],
        []
    );

    const onPaginationChange = (page: number) => {
        console.log(tableData);
    };

    const onSelectChange = (value: number) => {
        console.log(tableData);
    };

    return (
        <div className="relative">
            {dummyData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
                    <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
                    <p className="text-center">No Data Available</p>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={dummyData}
                    loading={loading}
                    skeletonAvatarColumns={[0]}
                    skeletonAvatarProps={{ className: 'rounded-md' }}
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
            )}

            <Dialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                shouldCloseOnOverlayClick={false}
            >
                <h5 className="mb-4">Confirm Deletion</h5>
                <p>Are you sure you want to delete this Return Setup?</p>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={() => setDeleteDialogOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={undefined} loading={loading}>
                        Confirm
                    </Button>
                </div>
            </Dialog>
        </div>
    );
};

export default ReturnTrackerTable;