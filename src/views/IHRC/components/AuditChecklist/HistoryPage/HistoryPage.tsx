

import React, { useState, useEffect } from 'react';
import AdaptableCard from '@/components/shared/AdaptableCard';
import HistoryPageTable from './components/HistoryPageTable';
import Company from './components/Company';
import { Button, toast, Notification } from '@/components/ui';
import { HiDownload } from 'react-icons/hi';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

const DueCompliance = () => {
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
    const [tableData, setTableData] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sort: { order: '', key: '' },
    });
    const [allData, setAllData] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch all data on component mount
    useEffect(() => {
        fetchAllComplianceHistory();
    }, []);

    // Apply filters whenever filter criteria or data changes
    useEffect(() => {
        applyFilters();
    }, [selectedCompany, selectedState, selectedBranch, allData]);

    const fetchAllComplianceHistory = async () => {
        try {
            setIsLoading(true);
            const { data: response } = await httpClient.get(
                endpoints.compliance.complianceHistoryList(),
                { 
                    params: { 
                        status: 'approved_by_auditor',
                        page_size: 100 // Fetch all records or implement pagination
                    }
                }
            );

            const transformedData = response.data.map((item: any) => ({
                id: item.id,
            uuid: item.uuid,
            record_id: item.id || `COMP-${item.id}`,
            company: item.Company?.name || 'N/A',
            company_id: item.company_id,
            state: item.State?.name || 'N/A',
            state_id: item.state_id,
            branch: item.Branch?.name || 'N/A',
            branch_id: item.branch_id,
            proof_document: item.document, // Changed from proof_document to document
            status: item.status,
            data_status: item.complianceStatus === 'review_complied' ? 'Complied' : 'Pending',
            compliance_detail: {
                id: item.ComplianceChecklist?.id || 0,
                legislation: item.legislation_act || 'N/A',
                header: item.compliance_header || 'N/A',
                description: item.compliance_description || 'N/A',
                category: item.compliance_categorization || 'General',
                criticality: item.criticality || 'Medium'
            },
            AssignedComplianceRemark: [] // Add remarks if available in response
        }));
            setAllData(transformedData);
            setTableData(prev => ({
                ...prev,
                total: response.paginate_data?.totalResults || 0
            }));
        } catch (error) {
            console.error('Error fetching compliance history:', error);
            toast.push(
                <Notification title="Error" type="danger" duration={2500}>
                    Failed to load compliance history
                </Notification>
            );
        } finally {
            setIsLoading(false);
        }
    };

    const applyFilters = () => {
        let result = [...allData];

        if (selectedCompany) {
            result = result.filter(item => 
                String(item.company_id) === selectedCompany
            );
        }

        if (selectedState) {
            result = result.filter(item => 
                String(item.state_id) === selectedState
            );
        }

        if (selectedBranch) {
            result = result.filter(item => 
                String(item.branch_id) === selectedBranch
            );
        }

         if (tableData.sort.key && tableData.sort.order) {
        result.sort((a, b) => {
            const key = tableData.sort.key as keyof typeof a;
            if (a[key] < b[key]) return tableData.sort.order === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return tableData.sort.order === 'asc' ? 1 : -1;
            return 0;
        });
    }

       const startIndex = (tableData.pageIndex - 1) * tableData.pageSize;
    const paginatedData = result.slice(startIndex, startIndex + tableData.pageSize);

    setFilteredData(paginatedData);
    setTableData(prev => ({
        ...prev,
        total: result.length
    }));
    };

    const handleDownload = async () => {
        try {
            // Use filteredData for download
           const response = await httpClient.get(
                   endpoints.compliance.downloadComplianceHistory(),
                   {
                     responseType: 'blob'
                   }
                 );
            
           const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'History_Export.xlsx';
                document.body.appendChild(a);
                a.click();
                
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
          
                toast.push(
                  <Notification title="Success" type="success">
                    Data exported successfully
                  </Notification>
                );
              } catch (error) {
                console.error('Export failed:', error);
                toast.push(
                  <Notification title="Error" type="error">
                    Failed to export data
                  </Notification>
                );
              }
            };
          
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
                <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold">Compliance History</h3>
                    <p className="text-gray-600">View your company's compliance history</p>
                </div>
                <Button
                    size="sm"
                    icon={<HiDownload />}
                    variant="solid"
                    onClick={handleDownload}
                >
                    Download
                </Button>
            </div>

            <div className="mb-4">
                <Company 
                    onCompanyChange={(company) => setSelectedCompany(company?.value || null)}
                    onStateChange={(state) => setSelectedState(state?.value || null)}
                    onBranchChange={(branch) => setSelectedBranch(branch?.value || null)}
                />
            </div>

            <HistoryPageTable 
                data={filteredData}
                isLoading={isLoading}
                tableData={tableData}
                onTableDataChange={setTableData}
            />
        </AdaptableCard>
    );
};

export default DueCompliance;