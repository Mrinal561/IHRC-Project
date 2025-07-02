// import React, { useEffect, useMemo, useState } from 'react'
// import { ColumnDef } from '@/components/shared/DataTable'
// import DataTable from '@/components/shared/DataTable'
// import {
//     Button,
//     Tooltip,
//     Dialog,
//     Input,
//     toast,
//     Notification,
//     Badge,
// } from '@/components/ui'
// import { FaDownload } from 'react-icons/fa6'
// import { HiDownload, HiOutlineEye } from 'react-icons/hi'
// import { RiEyeLine } from 'react-icons/ri'
// import { Navigate, useNavigate } from 'react-router-dom'
// import httpClient from '@/api/http-client'
// import { endpoints } from '@/api/endpoint'

// import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json'
// import Lottie from 'lottie-react'
// import { HiOutlineViewGrid } from 'react-icons/hi'
// // import { ComplianceData } from '@/@types/compliance';
// // Define the structure of our data
// // interface ComplianceData {
// //   id: number;
// //     uuid: string;
// //     legislation: string;
// //     category: string;
// //     penalty_type: string;
// //     default_due_date: {
// //         first_date: string; // in "YYYY-MM-DD" format
// //         last_date: string;  // in "YYYY-MM-DD" format
// //     };
// //     scheduled_frequency: string;
// //     proof_mandatory: boolean;
// //     header: string;
// //     description: string;
// //     penalty_description: string;
// //     applicability: string;
// //     bare_act_text: string;
// //     type: string;
// //     clause: string;
// //     frequency: string;
// //     statutory_auth: string;
// //     approval_required: boolean;
// //     criticality: string;
// //     assign:boolean;
// // }

// interface ComplianceData {
//     id: number
//     uuid: string
//     record_id: string
//     proof_document: string | null
//     status: string
//     data_status: string
//     compliance_detail: {
//         id: number
//         legislation: string
//         header: string
//         description: string
//         category: string
//         criticality: string
//     }
//     AssignedComplianceRemark: Array<{
//         id: number
//         remark: string
//         created_at: string
//     }>
// }

// const DownloadHistoryButton = () => {
//     const [isDialogOpen, setIsDialogOpen] = useState(false)
//     const navigate = useNavigate()

//     const handleAssignClick = () => {
//         setIsDialogOpen(true)
//     }

//     const handleConfirm = () => {
//         setIsDialogOpen(false)
//         toast.push(
//             <Notification title="Success" type="success">
//                 Compliance Report downloaded successfully!
//             </Notification>,
//             {
//                 placement: 'top-end',
//             },
//         )
//     }

//     const handleCancel = () => {
//         setIsDialogOpen(false)
//     }
//     const value = 'Download'

//     return (
//         <>
//             <Tooltip title="View Details">
//                 <Button
//                     size="sm"
//                     onClick={() =>
//                         navigate(
//                             `/app/IHRC/compliance-status-list-detail/${row.original.Compliance_Id}`,
//                             { state: row.original },
//                         )
//                     }
//                     icon={<RiEyeLine />}
//                 />
//             </Tooltip>
//         </>
//     )
// }

// const HistoryPageTable: React.FC = () => {
//     const navigate = useNavigate()
//     const [data, setData] = useState<ComplianceData[]>([])
//     const [filteredData, setFilteredData] = useState<ComplianceData[]>([])
//     const [startDate, setStartDate] = useState<Date | null>(null)
//     const [endDate, setEndDate] = useState<Date | null>(null)
//     const [isLoading, setIsLoading] = useState(false)

//     const fetchHistoryData = async () => {
//         setIsLoading(true)
//         try {
//             const response = await httpClient.get(endpoints.due.getAll(), {
//                 params: {
//                     'data_status[]': ['approved'],
//                 },
//             })
//             console.log('API Response:', response)
//             const fetchedData = response.data?.data || []

//             setData(fetchedData)
//             setFilteredData(fetchedData)
//         } catch (error) {
//             console.error('Error fetching history data:', error)
//             toast.push(
//                 <Notification title="Error" closable={true} type="danger">
//                     Failed to fetch history data
//                 </Notification>,
//                 { placement: 'top-end' },
//             )
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     useEffect(() => {
//         fetchHistoryData()
//     }, [])

//     const columns: ColumnDef<ComplianceData>[] = useMemo(
//         () => [
//             {
//                 header: 'Instance ID',
//                 accessorKey: 'record_id',
//                 cell: (props) => (
//                     <div className="w-40 text-start">{props.getValue()}</div>
//                 ),
//             },
//             // {
//             //   header: 'Compliance ID',
//             //   accessorKey: 'Compliance_ID',
//             //   cell: (props) => (
//             //     <div className="w-24 text-start">{props.getValue()}</div>
//             //   ),
//             // },

//             {
//                 header: 'Legislation',
//                 accessorKey: 'compliance_detail.legislation',
//                 cell: (props) => {
//                     const value = props.getValue() as string
//                     return (
//                         <Tooltip title={value} placement="top">
//                             <div className="w-28 truncate">{value}</div>
//                         </Tooltip>
//                     )
//                 },
//             },
//             // {
//             //   header: 'Location',
//             //   accessorKey: 'compliance_detail.location',
//             //   cell: (props) => (
//             //     <div className="w-24 text-start truncate">{props.getValue()}</div>
//             //   ),
//             // },
//             {
//                 header: 'Header',
//                 accessorKey: 'compliance_detail.header',
//                 cell: (props) => {
//                     const value = props.getValue() as string
//                     return (
//                         <Tooltip title={value} placement="top">
//                             <div className="w-40 truncate">{value}</div>
//                         </Tooltip>
//                     )
//                 },
//             },
//             // {
//             //   header: 'Completion Date',
//             //   accessorKey: 'Due_Date',
//             //   cell: ({ getValue }) => {
//             //     return <div className="w-26 flex items-center justify-center">{getValue<string>()}</div>;
//             //   },
//             // },
//             {
//                 header: 'Compliance Status',
//                 accessorKey: 'data_status',
//                 cell: (props) => {
//                     // const status = getValue<'Completed'>();
//                     // let statusColor = 'bg-green-500';
//                     // let textColor = 'text-green-500';
//                     // return (
//                     //   <div className="w-30 flex items-center">
//                     //     <Badge className= 'mr-2 bg-green-500'/>
//                     //     <div className={`font-semibold ${textColor}`}>{status}</div>
//                     //   </div>
//                     const criticality = props.getValue() // Get the value once

//                     return (
//                         <div className="w-24 font-semibold truncate">
//                             {criticality === 'approved' ? (
//                                 <span className="text-green-500">
//                                     {criticality}
//                                 </span>
//                             ) : criticality === 'NA' ? (
//                                 <span className="text-yellow-500">
//                                     {criticality}
//                                 </span>
//                             ) : criticality === 'Not Complied' ? (
//                                 <span className="text-red-500">
//                                     {criticality}
//                                 </span>
//                             ) : (
//                                 <span></span>
//                             )}
//                         </div>
//                     )
//                 },
//             },
//             {
//                 header: 'Actions',
//                 id: 'actions',
//                 cell: ({ row }) => (
//                     <Tooltip title="View Compliance Detail">
//                         <Button
//                             size="sm"
//                             onClick={() => {
//                                 // Ensure we're passing the full data object as state
//                                 navigate(
//                                     `/app/IHRC/history-list-detail/${row.original.uuid}`,
//                                     {
//                                         state: {
//                                             ...row.original,
//                                             complianceDetail:
//                                                 row.original.compliance_detail,
//                                             remarks:
//                                                 row.original
//                                                     .AssignedComplianceRemark,
//                                         },
//                                     },
//                                 )
//                             }}
//                             icon={<RiEyeLine />}
//                         />
//                     </Tooltip>
//                 ),
//             },
//         ],
//         [],
//     )

//     // State for table pagination and sorting
//     const [tableData, setTableData] = useState({
//         total: data.length,
//         pageIndex: 1,
//         pageSize: 10,
//         query: '',
//         sort: { order: '', key: '' },
//     })

//     // Function to handle pagination changes
//     const onPaginationChange = (page: number) => {
//         setTableData((prev) => ({ ...prev, pageIndex: page }))
//     }

//     // Function to handle page size changes
//     const onSelectChange = (value: number) => {
//         setTableData((prev) => ({
//             ...prev,
//             pageSize: Number(value),
//             pageIndex: 1,
//         }))
//     }

//     if (isLoading) {
//         console.log('Loading....................')

//         return (
//             <div className="flex flex-col items-center justify-center h-96 text-gray-500  rounded-xl">
//                 <div className="w-28 h-28">
//                     <Lottie
//                         animationData={loadingAnimation}
//                         loop
//                         className="w-24 h-24"
//                     />
//                 </div>
//                 <p className="text-lg font-semibold">Loading Data...</p>
//             </div>
//         )
//     }

//     return (
//         <div className="relative">
//             {/* Render the DataTable component */}
//             {data.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
//                     <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
//                     <p className="text-center">No Data Available</p>
//                 </div>
//             ) : (
//                 <DataTable
//                     columns={columns}
//                     data={data}
//                     skeletonAvatarColumns={[0]}
//                     skeletonAvatarProps={{ className: 'rounded-md' }}
//                     loading={isLoading}
//                     pagingData={{
//                         total: tableData.total,
//                         pageIndex: tableData.pageIndex,
//                         pageSize: tableData.pageSize,
//                     }}
//                     onPaginationChange={onPaginationChange}
//                     onSelectChange={onSelectChange}
//                     stickyHeader={true}
//                     stickyLastColumn={true}
//                     stickyFirstColumn={true}
//                 />
//             )}
//         </div>
//     )
// }

// export default HistoryPageTable


import React, { useState, useEffect } from 'react';
import { ColumnDef } from '@/components/shared/DataTable';
import DataTable from '@/components/shared/DataTable';
import { Button, Tooltip, toast, Notification } from '@/components/ui';
import { HiDownload, HiOutlineEye } from 'react-icons/hi';
import { RiEyeLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json';
import Lottie from 'lottie-react';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { endpoints } from '@/api/endpoint';
import httpClient from '@/api/http-client';
import store from '@/store';

interface ComplianceData {
    id: number;
    uuid: string;
    record_id: string;
    company: string;
    proof_document: string | null;
    status: string;
    data_status: string;
    compliance_detail: {
        id: number;
        legislation: string;
        header: string;
        description: string;
        category: string;
        criticality: string;
    };
    AssignedComplianceRemark: Array<{
        id: number;
        remark: string;
        created_at: string;
    }>;
}

const validatePage = (page: number): number => {
  const validatedPage = Math.max(1, Math.floor(Number(page)));
  return isNaN(validatedPage) ? 1 : validatedPage;
};

const validatePageSize = (size: number): number => {
  const validatedSize = Math.max(1, Math.min(100, Math.floor(Number(size))));
  return isNaN(validatedSize) ? 10 : validatedSize;
};

const HistoryPageTable: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<ComplianceData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [tableData, setTableData] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sort: { order: '', key: '' },
    });
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
    const [selectedState, setSelectedState] = useState<string | null>(null);

    // Get user info from store
    const { login } = store.getState();
    const userType = login?.user?.type;

    // Fetch compliance history data
    const fetchComplianceHistory = async () => {
        try {
            setIsLoading(true);
            const params = {
                page: tableData.pageIndex.toString(),
                page_size: tableData.pageSize.toString(),
                search: tableData.query,
                sort_by: tableData.sort.key || 'id',
                sort: tableData.sort.order || 'desc',
                company_id: selectedCompany,
                state_id: selectedState,
                status: 'approved_by_auditor' // Always filter by approved status for history
            };

            const { data: response } = await httpClient.get(
                endpoints.compliance.complianceHistoryList(),
                { params }
            );

            // Transform API response to match your table structure
            const transformedData = response.data.map((item: any) => ({
                id: item.id,
                uuid: item.uuid,
                record_id: item.record_id || `COMP-${item.id}`,
                company: item.Company?.name || 'N/A',
                proof_document: item.proof_document,
                status: item.status,
                data_status: 'Complied', // You may need to adjust this based on actual data
                compliance_detail: {
                    id: item.ComplianceChecklist?.id || 0,
                    legislation: item.legislation_act || 'N/A',
                    header: item.compliance_header || 'N/A',
                    description: item.ComplianceChecklist?.compliance_description || 'N/A',
                    category: item.category || 'General',
                    criticality: item.criticality || 'Medium'
                },
                AssignedComplianceRemark: item.remarks || []
            }));

            setData(transformedData);
            setTableData(prev => ({
                ...prev,
                total: response.paginate_data?.totalResults || 0
            }));
        } catch (error) {
            console.error('Error fetching compliance history:', error);
            toast.push(
                <Notification
                    title="Error"
                    type="danger"
                    duration={2500}
                >
                    Failed to load compliance history
                </Notification>
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Handle download compliance history
  
    // Fetch data on component mount and when filters change
    useEffect(() => {
        fetchComplianceHistory();
    }, [tableData.pageIndex, tableData.pageSize, tableData.query, tableData.sort, selectedCompany, selectedState]);

    const columns: ColumnDef<ComplianceData>[] = [
        // {
        //     header: 'Instance ID',
        //     enableSorting: false,
        //     accessorKey: 'record_id',
        //     cell: (props) => (
        //         <div className="w-40 text-start">{props.getValue() as string}</div>
        //     ),
        // },
        {
            header: 'Company',
            enableSorting: false,
            accessorKey: 'company',
            cell: (props) => (
                <div className="w-40 text-start">{props.getValue() as string}</div>
            ),
        },
        {
            header: 'Legislation(Act Name)',
            enableSorting: false,
            accessorKey: 'compliance_detail.legislation',
            cell: (props) => {
                const value = props.getValue() as string;
                return (
                    <Tooltip title={value} placement="top">
                        <div className="w-64 truncate">{value}</div>
                    </Tooltip>
                );
            },
        },
        {
            header: 'Header',
            enableSorting: false,
            accessorKey: 'compliance_detail.header',
            cell: (props) => {
                const value = props.getValue() as string;
                return (
                    <Tooltip title={value} placement="top">
                        <div className="w-64 truncate">{value}</div>
                    </Tooltip>
                );
            },
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => (
                <div className='flex gap-2 items-center'>
                    <Tooltip title="View Compliance Detail">
                        <Button
                            size="sm"
                            onClick={() => {
                                navigate(
                                    `/app/IHRC/history-list-detail/${row.original.uuid}`,
                                    {
                                        state: {
                                            ...row.original,
                                            complianceDetail: row.original.compliance_detail,
                                            remarks: row.original.AssignedComplianceRemark,
                                        },
                                    }
                                );
                            }}
                            icon={<RiEyeLine />}
                        />
                    </Tooltip>
                    {/* <Tooltip title="Download History">
                        <Button
                            size="sm"
                            icon={<HiDownload />}
                            onClick={() => handleDownload()}
                        />
                    </Tooltip> */}
                </div>
            ),
        },
    ];

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
        );
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
                    loading={isLoading}
                    pagingData={{
                        total: tableData.total,
                        pageIndex: tableData.pageIndex,
                        pageSize: tableData.pageSize,
                    }}
                    onPaginationChange={(page) => {
                        setTableData(prev => ({ ...prev, pageIndex: page }));
                    }}
                    onPageSizeChange={(size) => {
                        setTableData(prev => ({ ...prev, pageSize: size, pageIndex: 1 }));
                    }}
                    onSort={(sort) => {
                        setTableData(prev => ({ ...prev, sort }));
                    }}
                    stickyHeader={true}
                    stickyLastColumn={true}
                    stickyFirstColumn={true}
                />
            )}
        </div>
    );
};

export default HistoryPageTable;