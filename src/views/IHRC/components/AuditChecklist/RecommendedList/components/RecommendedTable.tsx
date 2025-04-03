import React, { useMemo, useState, useEffect } from 'react'
import DataTable from '@/components/shared/DataTable'
import { Checkbox, Tooltip, Button, Notification, toast } from '@/components/ui'
import cloneDeep from 'lodash/cloneDeep'
import type { OnSortParam, ColumnDef } from '@/components/shared/DataTable'
import { useNavigate } from 'react-router-dom'
import { HiOutlineEye } from 'react-icons/hi'
import { RiCheckLine } from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import {
    assignCompliancesToBranch,
} from '@/store/slices/compliance/ComplianceApiSlice'
import { Loading } from '@/components/shared'
import { type } from '../../../../../../components/ui/ScrollBar/index';
import { showErrorNotification } from '@/components/ui/ErrorMessage'
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json'
import Lottie from 'lottie-react';
import { HiOutlineViewGrid } from 'react-icons/hi'
 
interface ComplianceData {
    id: string;
        uuid: string;
        legislation: string,
        category: string,
        header: string,
        description: string,
        penalty_description: string,
        applicablility: string,
        bare_act_text: string,
        caluse: string,
        type: string,
        frequency: string,
        scope: string,
        state_id: number,        
        statutory_auth: string,
        approval_required: boolean,
        criticality: string,
        penalty_type: string,
        default_due_date: {
            first_date: string,
            second_date: string,
            third_date: string,
            last_date: string,
        },
        proof_mandatory: boolean,
        created_type: string,
        created_at: string,
}
 
interface RecommendedTableContentProps {
    data: ComplianceData[]
    loading: boolean
    tableKey: number
    branchValue?: string
    companyGroupValue?: string
    companyValue?: string
    stateValue?: string
    districtValue?: string
    locationValue?: string
    setIstableLoading: boolean
    onSelectedCompliancesChange: (selectedIds: number[]) => void
    canCreate:boolean;
}
 
const ViewDetailsButton = ({
    compliance,
    branchValue,
    companyGroupValue,
    companyValue,
    stateValue,
    locationValue,
    districtValue,
    onAssignSuccess,
    // onTableRerender,
    setIstableLoading,
    clearCheckboxes,
    canCreate,
}: {
    compliance: ComplianceData;
    branchValue?: string;
    companyGroupValue?: string;
    companyValue?: string;
    stateValue?: string;
    locationValue?: string;
    districtValue?: string;
    onAssignSuccess: (complianceId: number) => void;
    // onTableRerender: () => void;
    setIstableLoading: () => void
    clearCheckboxes: () => void;
    canCreate:boolean;
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
 
    const handleViewDetails = () => {
        navigate(`/app/IHRC/compliance-list-detail/${compliance.uuid}`, {
            state: compliance,
        });
    };
 
    const handleAssignCompliance = async () => {
 
        if (!companyGroupValue && !companyValue && !stateValue && !districtValue && !locationValue && !branchValue) {
            toast.push(
                <Notification title="Missing Information" type="danger">
                    Please select at least one field
                </Notification>
            );
            return;
        }
   
        // Check hierarchy only if fields are selected
        if (companyValue && !companyGroupValue) {
            toast.push(
                <Notification title="Missing Information" type="danger">
                    Please select Company Group before selecting Company
                </Notification>
            );
            return;
        }
   
        if (stateValue && (!companyGroupValue || !companyValue)) {
            toast.push(
                <Notification title="Missing Information" type="danger">
                    Please select Company Group and Company before selecting State
                </Notification>
            );
            return;
        }
   
        if (districtValue && (!companyGroupValue || !companyValue || !stateValue)) {
            toast.push(
                <Notification title="Missing Information" type="danger">
                    Please select Company Group, Company, and State before selecting District
                </Notification>
            );
            return;
        }
   
        if (locationValue && (!companyGroupValue || !companyValue || !stateValue || !districtValue)) {
            toast.push(
                <Notification title="Missing Information" type="danger">
                    Please select Company Group, Company, State, and District before selecting Location
                </Notification>
            );
            return;
        }
   
        if (branchValue && (!companyGroupValue || !companyValue || !stateValue || !districtValue || !locationValue)) {
            toast.push(
                <Notification title="Missing Information" type="danger">
                    Please select Company Group, Company, State, District, and Location before selecting Branch
                </Notification>
            );
            return;
        }
 
        const assignData = {
            group_id: parseInt(companyGroupValue),
            company_id: parseInt(companyValue),
            state_id: parseInt(stateValue),
            location_id: parseInt(locationValue),
            branch_id: parseInt(branchValue),
            compliance_id: [compliance.id]
        };
        console.log(assignData);
 
        try {
           const response = await dispatch(assignCompliancesToBranch(assignData)).unwrap()
           .catch((error: any) => {
            // Handle different error formats
            if (error.response?.data?.message) {
                // API error response
                showErrorNotification(error.response.data.message);
            } else if (error.message) {
                // Regular error object
                showErrorNotification(error.message);
            } else if (Array.isArray(error)) {
                // Array of error messages
                showErrorNotification(error);
            } else {
                // Fallback error message
                showErrorNotification('An unexpected error occurred. Please try again.');
            }
            throw error; // Re-throw to prevent navigation
        });
            if(response){
 
                onAssignSuccess(compliance.id);
                  clearCheckboxes(); 
                toast.push(
                    <Notification title="Success" type="success">
                    Assigned Successfully
                </Notification>
            );
        }
            // setIstableLoading(true)
        } catch (error : any) {
            console.error('Failed to assign compliance:', error);
            toast.push(
                <Notification title="Failed" type="danger">
                    {error}
                </Notification>
            );
        }
    };
 
    return (
        <div className="flex gap-2 items-center">
            <Tooltip title="View Compliance Detail" placement="top">
                <Button
                    size="sm"
                    className="text-[#737171]"
                    icon={<HiOutlineEye />}
                    onClick={handleViewDetails}
                />
            </Tooltip>
            {/* {canCreate&&( */}
            <Tooltip title="Assign Compliance">
                <Button
                    size="sm"
                    onClick={handleAssignCompliance}
                    icon={<RiCheckLine />}
                />
            </Tooltip>
            {/* )} */}
        </div>
    );
};
 
const RecommendedTable = ({
    data,
    loading,
    tableKey,
    branchValue,
    companyGroupValue,
    companyValue,
    stateValue,
    locationValue,
    districtValue,
    // onDataUpdate,
    setIstableLoading,
    onSelectedCompliancesChange,
    canCreate
}: RecommendedTableContentProps)  => {
    const dispatch = useDispatch()
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
    const [assignedItems, setAssignedItems] = useState<Set<number>>(new Set())
    const [initialLoadComplete, setInitialLoadComplete] = useState(false)
    const [checkboxState, setCheckboxState] = useState<{ [key: number]: boolean }>({})
    const [rerenderKey, setRerenderKey] = useState(0)
    const [tableData, setTableData] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sort: { order: '', key: '' },
    })

    const dummyData: ComplianceData[] = [
        {
            id: '1',
            uuid: 'dummy-1',
            legislation: 'Labour Act',
            category: 'Employment',
            header: 'Minimum Wage Compliance',
            description: 'Ensure all employees are paid at least the minimum wage',
            penalty_description: 'Fine up to ₹50,000',
            applicablility: 'All industries',
            bare_act_text: 'Section 4 of Labour Act',
            caluse: '4.1.2',
            type: 'Monthly',
            frequency: 'Monthly',
            scope: 'National',
            state_id: 1,
            statutory_auth: 'Labour Department',
            approval_required: false,
            criticality: 'high',
            penalty_type: 'Monetary',
            default_due_date: {
                first_date: '2023-06-01',
                second_date: '2023-06-15',
                third_date: '2023-06-20',
                last_date: '2023-06-30',
            },
            proof_mandatory: true,
            created_type: 'System',
            created_at: '2023-01-01',
        },
        {
            id: '2',
            uuid: 'dummy-2',
            legislation: 'Factory Act',
            category: 'Safety',
            header: 'Fire Safety Compliance',
            description: 'Install and maintain fire safety equipment',
            penalty_description: 'Fine up to ₹1,00,000',
            applicablility: 'Manufacturing',
            bare_act_text: 'Section 38 of Factory Act',
            caluse: '38.5',
            type: 'Quarterly',
            frequency: 'Quarterly',
            scope: 'State',
            state_id: 2,
            statutory_auth: 'Factory Inspectorate',
            approval_required: true,
            criticality: 'medium',
            penalty_type: 'Monetary',
            default_due_date: {
                first_date: '2023-03-01',
                second_date: '2023-03-15',
                third_date: '2023-03-20',
                last_date: '2023-03-31',
            },
            proof_mandatory: true,
            created_type: 'System',
            created_at: '2023-01-01',
        },
        {
            id: '3',
            uuid: 'dummy-3',
            legislation: 'Environmental Protection Act',
            category: 'Environment',
            header: 'Waste Disposal Compliance',
            description: 'Proper disposal of hazardous waste materials',
            penalty_description: 'Fine up to ₹2,00,000',
            applicablility: 'All industries',
            bare_act_text: 'Section 12 of EPA',
            caluse: '12.3.1',
            type: 'Annual',
            frequency: 'Annual',
            scope: 'National',
            state_id: 3,
            statutory_auth: 'Pollution Control Board',
            approval_required: true,
            criticality: 'high',
            penalty_type: 'Monetary',
            default_due_date: {
                first_date: '2023-12-01',
                second_date: '2023-12-15',
                third_date: '2023-12-20',
                last_date: '2023-12-31',
            },
            proof_mandatory: false,
            created_type: 'System',
            created_at: '2023-01-01',
        },
        {
            id: '4',
            uuid: 'dummy-4',
            legislation: 'Shops and Establishments Act',
            category: 'Operations',
            header: 'Working Hours Compliance',
            description: 'Maintain proper working hours records',
            penalty_description: 'Fine up to ₹25,000',
            applicablility: 'Retail',
            bare_act_text: 'Section 8 of S&E Act',
            caluse: '8.2',
            type: 'Monthly',
            frequency: 'Monthly',
            scope: 'State',
            state_id: 4,
            statutory_auth: 'Labour Department',
            approval_required: false,
            criticality: 'low',
            penalty_type: 'Monetary',
            default_due_date: {
                first_date: '2023-05-01',
                second_date: '2023-05-15',
                third_date: '2023-05-20',
                last_date: '2023-05-31',
            },
            proof_mandatory: true,
            created_type: 'System',
            created_at: '2023-01-01',
        },
        {
            id: '5',
            uuid: 'dummy-5',
            legislation: 'Employee Provident Fund',
            category: 'Benefits',
            header: 'PF Contribution Compliance',
            description: 'Timely deposit of employee PF contributions',
            penalty_description: 'Fine up to ₹10,000 per month delay',
            applicablility: 'All organizations with 20+ employees',
            bare_act_text: 'EPF Act Section 6',
            caluse: '6.1',
            type: 'Monthly',
            frequency: 'Monthly',
            scope: 'National',
            state_id: 5,
            statutory_auth: 'EPFO',
            approval_required: false,
            criticality: 'high',
            penalty_type: 'Monetary',
            default_due_date: {
                first_date: '2023-04-15',
                second_date: '2023-04-20',
                third_date: '2023-04-25',
                last_date: '2023-04-30',
            },
            proof_mandatory: true,
            created_type: 'System',
            created_at: '2023-01-01',
        }
    ];

    // Use dummy data if no real data is provided
    const displayData = data.length > 0 ? data : dummyData;
 
    useEffect(() => {
        setSelectedItems(new Set());
        onSelectedCompliancesChange([]);
        setInitialLoadComplete(true)
        setTableData(prev => ({
            ...prev,
            total: data.length
        }))
    }, [data])
 

        const clearCheckboxes = () => {
        setSelectedItems(new Set());
        onSelectedCompliancesChange([]);
    };
    const isAllSelected = useMemo(() => {
        if (data.length === 0) return false;
        return selectedItems.size === data.length;
    }, [selectedItems.size, data.length]);
 
    const isIndeterminate = useMemo(() => {
        return selectedItems.size > 0 && selectedItems.size < data.length;
    }, [selectedItems.size, data.length]);
 
    const handleCheckboxChange = (id: number) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            onSelectedCompliancesChange(Array.from(newSet));
            return newSet;
        });
    };
 
    const handleSelectAllChange = () => {
        if (selectedItems.size === data.length) {
            setSelectedItems(new Set());
            onSelectedCompliancesChange([]);
        } else {
            const newSelectedItems = new Set(data.map(item => item.id));
            setSelectedItems(newSelectedItems);
            onSelectedCompliancesChange(Array.from(newSelectedItems));
        }
    };
 
    const handleAssignSuccess = async (complianceIdAssigned: number) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(complianceIdAssigned);
            onSelectedCompliancesChange(Array.from(newSet));
            return newSet;
        });
        setIstableLoading(true);
    };
 
    const handleTableRerender = () => {
        setRerenderKey(prev => prev + 1);
    };
 
    const columns = useMemo(
        () => [
            {
                header: ({ table }) => (
                    <div className="w-2">
                        <Checkbox
                            checked={isAllSelected}
                            onChange={handleSelectAllChange}
                        />
                    </div>
                ),
                id: 'select',
                cell: ({ row }) => (
                    <div className="w-2">
                        <Checkbox
                            checked={selectedItems.has(row.original.id)}
                            onChange={() => handleCheckboxChange(row.original.id)}
                        />
                    </div>
                ),
            },
            // {
            //     header: 'ID',
            //     accessorKey: 'record_id',
            //     cell: (props) => (
            //         <Tooltip title={`ID: ${props.getValue()}`} placement="top">
            //             <div className="w-24 truncate">{props.getValue()}</div>
            //         </Tooltip>
            //     ),
            // },
            {
                header: 'Scope',
                accessorKey: 'scope',
                cell: (props) => (
                  <Tooltip title={props.getValue()} placement="top">
                    <div className="w-24 truncate uppercase">{props.getValue()}</div>
                  </Tooltip>
                ),
              },
            {
                header: 'Legislation',
                accessorKey: 'legislation',
                cell: (props) => {
                    const value = props.getValue() as string
                    return (
                        <Tooltip title={value} placement="top">
                            <div className="w-42 truncate">{value.length > 22 ? value.substring(0, 22) + '...' : value}</div>
                        </Tooltip>
                    )
                },
            },
            {
                header: 'Criticality',
                accessorKey: 'criticality',
                cell: (props) => {
                    const criticality = props.getValue() as string
                    return (
                        <div className="w-24 font-semibold truncate">
                            {criticality === 'high' ? (
                                <span className="text-red-500">High</span>
                            ) : criticality === 'medium' ? (
                                <span className="text-yellow-500">Medium</span>
                            ) : (
                                <span className="text-green-500">Low</span>
                            )}
                        </div>
                    )
                }
            },
            {
                header: 'Category',
                accessorKey: 'category',
                cell: (props) => {
                    const value = props.getValue() as string
                    return (
                        <Tooltip title={value} placement="top">
                            <div className="w-36 truncate">{value.length > 20 ? value.substring(0, 20) + '...' : value}</div>
                        </Tooltip>
                    )
                },
            },
            {
                header: 'Header',
                accessorKey: 'header',
                cell: (props) => {
                    const value = props.getValue() as string
                    return (
                        <Tooltip title={value} placement="top">
                            <div className="w-36 truncate">{value.length > 18 ? value.substring(0, 18) + '...' : value}</div>
                        </Tooltip>
                    )
                },
            },
            {
                header: 'Description',
                accessorKey: 'description',
                cell: (props) => {
                    const value = props.getValue() as string
                    return (
                        <Tooltip title={value} placement="left">
                            <div className="w-48 truncate">{value.length > 30 ? value.substring(0, 30) + '...' : value}</div>
                        </Tooltip>
                    )
                },
            },
            {
                header: 'Due Date',
                accessorKey: 'default_due_date',
                cell: (props) => {
                    const dueDate = props.getValue() as { first_date: string; last_date: string }
                    const displayDate = `${new Date(dueDate.first_date).toLocaleDateString()} - ${new Date(dueDate.last_date).toLocaleDateString()}`
                    return (
                        <Tooltip title={displayDate} placement="top">
                            <div className="w-40 truncate">{displayDate}</div>
                        </Tooltip>
                    )
                },
            },
            {
                header: 'Action',
                id: 'viewDetails',
                cell: (props) => (
                    <div className="w-16 flex justify-center">
                        <ViewDetailsButton
                            compliance={props.row.original}
                            branchValue={branchValue}
                            companyGroupValue={companyGroupValue}
                            companyValue={companyValue}
                            stateValue={stateValue}
                            districtValue={districtValue}
                            locationValue={locationValue}
                            onAssignSuccess={handleAssignSuccess}
                            // onTableRerender={IstableLoading}
                            setIstableLoading={setIstableLoading}
                            clearCheckboxes={clearCheckboxes} 
                            canCreate={canCreate}
                        />
                    </div>
                ),
            }
        ],
        [selectedItems, data, isAllSelected, isIndeterminate, branchValue, companyGroupValue, companyValue, stateValue, districtValue, locationValue, setIstableLoading]
    );
 
    const onPaginationChange = (page: number) => {
        setTableData(prev => ({...prev, pageIndex: page }));
        fetchDataWithPagination(); // New function to fetch data with updated pagination
      };
   
      const onSelectChange = (value: number) => {
        setTableData(prev => ({...prev, pageSize: Number(value), pageIndex: 1 }));
        fetchDataWithPagination(); // New function to fetch data with updated pagination
      };
   
      const fetchDataWithPagination = () => {
        // onDataUpdate(tableData.pageIndex, tableData.pageSize); // Callback to RecommendedList
        // setIstableLoading(true);
      };

      if (loading) {
        console.log("Loading....................");
        
        return (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500  rounded-xl">
                <div className="w-28 h-28">
                    <Lottie 
                        animationData={loadingAnimation} 
                        loop 
                        className="w-24 h-24"
                    />
                </div>
                <p className="text-lg font-semibold">
                    Loading Data...
                </p>

            </div>
        );
    }
 
    return (
        <div className="w-full overflow-x-auto">
             {data.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
                <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
                <p className="text-center">
        No Data Available
                </p>
      </div>
            ) : (
            <DataTable
                columns={columns}
                data={displayData}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ className: 'rounded-md' }}
                loading={loading}
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
                selectable={true}
            />
            )}
        </div>
    )
}
 
export default RecommendedTable
