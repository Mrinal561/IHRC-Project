import React, { useEffect, useState, useMemo } from 'react';
import useAuth from '@/utils/hooks/useAuth';
import DataTable from '@/components/shared/DataTable';
import { Button, toast, Tooltip, Notification, Dialog } from '@/components/ui';
import OutlinedInput from '@/components/ui/OutlinedInput';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import { MdEdit } from 'react-icons/md';
import { FiFile, FiTrash } from 'react-icons/fi';
import dayjs from 'dayjs';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineViewGrid } from 'react-icons/hi';



interface BranchAgreementTableProps {
    canEdit: boolean;
    canDelete: boolean;
}


const BranchAgreementTable: React.FC<BranchAgreementTableProps> = ({ canEdit, canDelete }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { branchId, companyId, companyName, branchName } = location.state || {};
    
    // State Management
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [isBranchLoading, setIsBranchLoading] = useState(false);
    const [branches, setBranches] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedAgreementId, setSelectedAgreementId] = useState(null);
    // Filter and Table State
    const [filters, setFilters] = useState({
        search: '',
        branch_id: branchId ? {
            value: branchId,
            label: branchName
        } : '',
        company_id: companyId ? {
            value: companyId,
            label: companyName
        } : (user?.company_id || ''),
        sub_category: '',
        agreement_type: '',
        isFromBranch: !!branchId // Flag to check if coming from branch table
    });
    
    const [tableData, setTableData] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        sort: { order: 'desc', key: 'id' },
    });

    // Fetch Companies
    const fetchCompanies = async () => {
        try {
            const response = await httpClient.get(endpoints.company.getAll());
            const formattedCompanies = response.data?.data?.map(company => ({
                value: company.id,
                label: company.name
            })) || [];
            setCompanies(formattedCompanies);
        } catch (error) {
            console.error('Failed to fetch companies', error);
            setCompanies([]);
        }
    };

    const fetchBranches = async (companyId) => {
        if (!companyId) {
            setBranches([]);
            return;
        }
        
        setIsBranchLoading(true);
        try {
            // Extract just the ID value if it's an object and put it in an array
            const id = typeof companyId === 'object' ? companyId.value : companyId;
            
            const response = await httpClient.get(endpoints.branch.getAll(), {
                params: { 
                    company_id: [id] // Pass as array since API expects company_id[]
                }
            });
            const formattedBranches = response.data?.data?.map(branch => ({
                value: branch.id,
                label: branch.name
            })) || [];
            setBranches(formattedBranches);
        } catch (error) {
            console.error('Failed to fetch branches', error);
            setBranches([]);
        } finally {
            setIsBranchLoading(false);
        }
    };
    
    const fetchBranchAgreementData = async () => {
        setIsLoading(true);
        
        try {
            let params = {};
            
            if (filters.search) {
                params.search = filters.search;
            }
            
            // Handle company_id - extract just the ID if it's an object
            if (filters.company_id) {
                const companyId = typeof filters.company_id === 'object' 
                    ? filters.company_id.value 
                    : filters.company_id;
                
                if (companyId && !isNaN(parseInt(companyId))) {
                    params.company_id = parseInt(companyId);
                }
            }
            
            // Handle branch_id - extract just the ID if it's an object
            if (filters.branch_id) {
                const branchId = typeof filters.branch_id === 'object'
                    ? filters.branch_id.value
                    : filters.branch_id;
                    
                if (branchId && !isNaN(parseInt(branchId))) {
                    params.branch_id = parseInt(branchId);
                }
            }
            
            if (filters.sub_category) {
                params.sub_category = filters.sub_category;
            }

            if(filters.agreement_type){
                params.agreement_type = filters.agreement_type;
            }
            
            console.log('Final Request params:', params);
            
            const response = await httpClient.get(endpoints.branchAgreement.list(), {
                params
            });
    
            setData(response.data?.data || []);
            setTableData(prev => ({
                ...prev,
                total: response.data?.pagination?.total || 0
            }));
        } catch (error) {
            console.error('Failed to fetch branch agreement data', error);
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFilterChange = (key, value) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            
            if (key === 'company_id') {
                // Store the entire selected option object
                newFilters.company_id = value;
                // Reset branch when company changes
                newFilters.branch_id = '';
            } else if (key === 'branch_id') {
                // Store the entire selected option object
                newFilters.branch_id = value;
            } else {
                newFilters[key] = value || '';
            }
            
            console.log('New filters:', newFilters);
            
            return newFilters;
        });
    };
    
    // Initial data fetch
    useEffect(() => {
        fetchCompanies();
        if (filters.company_id) {
            fetchBranches(filters.company_id);
        }
    }, []);

    // Fetch data when filters or pagination changes
    useEffect(() => {
        fetchBranchAgreementData();
    }, [
        filters.search,
        filters.branch_id,
        filters.company_id,
        filters.sub_category,
        filters.agreement_type,
        tableData.pageIndex,
        tableData.pageSize,
        tableData.sort
    ]);

    // Update branches when company changes
    useEffect(() => {
        if (filters.company_id) {
            fetchBranches(filters.company_id);
        } else {
            setBranches([]);
        }
    }, [filters.company_id]);

    const showNotification = (
        type: 'success' | 'info' | 'danger' | 'warning' | 'error',
        message: string,
    ) => {
        toast.push(
            <Notification
                title={type.charAt(0).toUpperCase() + type.slice(1)}
                type={type}
                closable={true}
            >
                {message}
            </Notification>,
        )
    }

    const handleDelete = async () => {
        try {
            setLoading(true)
          await httpClient.delete(endpoints.branchAgreement.delete(selectedAgreementId));
          showNotification('success', 'Branch agreement deleted successfully');
          fetchBranchAgreementData(); // Refresh the table
          setDeleteDialogOpen(false);
        } catch (error) {
          console.error('Failed to delete agreement:', error);
          showNotification('error', 'Failed to delete agreement');
        } finally {
            setLoading(false)
        }
      };

    // Table Columns
    const columns = useMemo(() => [
        // {
        //     header: 'Company',
        //     accessorKey: 'Branch.Company.name',
        //     enableSorting: false,
        //     Cell: ({ value }) => <div className="w-52 truncate">{value}</div>,
        // },
        // {
        //     header: 'Branch',
        //     enableSorting: false,
        //     accessorKey: 'Branch.name',
        //     Cell: ({ value }) => <div className="w-52 truncate">{value}</div>,
        // },
        {
            header: 'Agreement Type',
            enableSorting: false,
            accessorKey: 'agreement_type',
            Cell: ({ value }) => <div className="w-52 truncate">{value}</div>,
        },
        {
            header: 'Sub Category',
            enableSorting: false,
            accessorKey: 'sub_category',
            Cell: ({ value }) => <div className="w-40 truncate">{value}</div>,
        },
        {
            header: 'Owner',
            enableSorting: false,
            accessorKey: 'owner.name',
            Cell: ({ value }) => <div className="w-40 truncate">{value}</div>,
        },
        {
            header: 'Partner',
            enableSorting: false,
            accessorKey: 'partner_name',
            Cell: ({ value }) => <div className="w-40 truncate">{value}</div>,
        },
        {
            header: 'Start Date',
            enableSorting: false,
            accessorKey: 'start_date',
            cell: ({ getValue }) => {
              const value = getValue();
              return (
                <div className="w-44">
                  {dayjs(value).isValid() 
                    ? dayjs(value).format('DD-MM-YYYY')
                    : 'Invalid Date'}
                </div>
              );
            },
          },
          {
            header: 'End Date',
            accessorKey: 'end_date',
            enableSorting: false,
            cell: ({ getValue }) => {
              const value = getValue();
              return (
                <div className="w-44">
                  {dayjs(value).isValid()
                    ? dayjs(value).format('DD-MM-YYYY')
                    : 'Invalid Date'}
                </div>
              );
            },
          },
          {
            header: 'Agreement Copy',
            enableSorting: false,
            accessorKey: 'agreement_document',
            cell: (props) => {
                const document = props.getValue() as string | null;

                const handleDocumentDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    if(document) {
                        const fullPath = `${import.meta.env.VITE_API_GATEWAY}/${document}`;
                        window.open(fullPath, '_blank');
                    }
                };
                 return (
                            <div className="w-40 flex items-center">
                              {document ? (
                                <a 
                                  href="#" 
                                  onClick={handleDocumentDownload} 
                                  className="text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                  <FiFile className="w-5 h-5" />
                                </a>
                              ) : (
                                '--'
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
                    
                    {canEdit && (
                    <Tooltip title="Edit">
                        <Button
                            size="sm"
                            onClick={() => navigate('/edit-branch-agreement', { 
                                state: { agreementId: row.original.id } 
                            })}
                            icon={<MdEdit />}
                            className="text-blue-500"
                        />
                    </Tooltip>
                    )}
                    {canDelete && (
                    <Tooltip title="Delete">
                        <Button
                        size="sm"
                        icon={<FiTrash />}
                        className="text-red-500"
                        onClick={() => {
                            setSelectedAgreementId(row.original.id);
                            setDeleteDialogOpen(true);
                        }}
                        />
                    </Tooltip>
                    )}
                </div>
            ),
        },
    ], []);

    return (
        <div className="space-y-4">
            {/* Filters Section */}
            <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <OutlinedSelect
    label="Company"
    value={filters.company_id} // This will now be the full option object
    options={companies}
    onChange={(value) => handleFilterChange('company_id', value)}
/>

<OutlinedSelect
    label="Branch"
    value={filters.branch_id} // This will now be the full option object
    options={branches}
    onChange={(value) => handleFilterChange('branch_id', value)}
    disabled={filters.isFromBranch}
/>

                <OutlinedInput
                    label="Agreement Type"
                    value={filters.agreement_type}
                    onChange={(value) => handleFilterChange('agreement_type', value)}
                />
                <OutlinedInput
                    label="Sub Category"
                    value={filters.sub_category}
                    onChange={(value) => handleFilterChange('sub_category', value)}
                />
            </div>

            {/* Data Table */}
            {data.length === 0 ? (
  <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
    <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
    <p className="text-center">No Data Available</p>
  </div>
) : (
  <DataTable
    columns={columns}
    data={data}
    loading={isLoading}
    pagingData={{
      total: tableData.total,
      pageIndex: tableData.pageIndex,
      pageSize: tableData.pageSize,
    }}
    onPaginationChange={(page) => setTableData(prev => ({ 
      ...prev, 
      pageIndex: page 
    }))}
    onSelectChange={(value) => setTableData(prev => ({
      ...prev,
      pageSize: Number(value),
      pageIndex: 1,
    }))}
    onSort={(sortKey) => setTableData(prev => ({
      ...prev,
      sort: {
        key: sortKey,
        order: prev.sort.order === 'desc' ? 'asc' : 'desc'
      }
    }))}
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
                  <p>
                      Are you sure you want to delete this Branch Agreement?
                  </p>
                  <div className="text-right mt-6">
                      <Button
                          className="ltr:mr-2 rtl:ml-2"
                          variant="plain"
                          onClick={() => setDeleteDialogOpen(false)}
                      >
                          Cancel
                      </Button>
                      <Button variant="solid" onClick={handleDelete} loading={loading}>
                          Confirm
                      </Button>
                  </div>
</Dialog>
        </div>
    );
};

export default BranchAgreementTable;