import React, { useState, useEffect } from 'react';
import { Button, Dialog, Input, Notification, toast } from '@/components/ui';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import PoshBulkUpload from './components/PoshBulkUpload';
import PoshTable from './components/PoshTable';
import { HiPlusCircle, HiDownload, HiTrash } from 'react-icons/hi';
import { AdaptableCard } from '@/components/shared';
import OutlinedInput from '@/components/ui/OutlinedInput';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { useAppSelector } from '@/store';
import useAuth from '@/utils/hooks/useAuth';

const FINANCIAL_YEAR_KEY = 'selectedFinancialYear'
const FINANCIAL_YEAR_CHANGE_EVENT = 'financialYearChanged';

interface SelectOption {
  value: string;
  label: string;
}

interface PoshTableData {
  id: string;
  companyGroup: string;
  company: string;
  branch: string;
  complaintsReceived: number;
  complaintsDisposed: number;
  pendingCases: number;
  workshops: number;
  actionTaken: string;
  returnLevel: string;
}

interface PoshReturn {
  id: string;
  company_id: string;
  company_name: string;
  branch_id: string;
  branch_name: string;
  complaints_received: number;
  complaints_disposed: number;
  pending_cases: number;
  workshop_conducted: number;
  nature_of_action_taken: string;
  return_level: string;
  created_at: string;
}


const Posh = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const currentFinancialYear = useAppSelector((state: any) => state.common?.currentFinancialYear || '');
 const [formData, setFormData] = useState(() => {
  // Safely get the base year
  const financialYearParts = currentFinancialYear.split('-');
  const baseYear = financialYearParts.length > 0 ? parseInt(financialYearParts[0]) : new Date().getFullYear();
  
  return {
    company_id: '',
    branch_id: '',
    complaints_received: 0,
    complaints_disposed: 0,
    pending_cases: 0,
    workshop_conducted: 1,
    nature_of_action_taken: '',
    return_level: 'branch',
    year: undefined
  };
});
  const [poshData, setPoshData] = useState<PoshTableData[]>([]);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<SelectOption[]>([]);
  const [branches, setBranches] = useState<SelectOption[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [companyGroupId, setCompanyGroupId] = useState('');
  

  
  // Using your existing useAuth hook as-is
  const auth = useAuth();
  const userId = auth?.user?.id || 0; // Fallback to 0 if not available

   const [financialYear, setFinancialYear] = useState(sessionStorage.getItem(FINANCIAL_YEAR_KEY));
  const [isBulkDownloadOpen, setIsBulkDownloadOpen] = useState(false);
  const [bulkDownloadData, setBulkDownloadData] = useState({
    company_id: '',
    year: currentFinancialYear,
    type: 'branch' as 'branch' | 'district'
  });

  const returnLevelOptions = [
    { value: 'branch', label: 'Branch Level' },
    { value: 'district', label: 'District Level' }
  ];
  
  useEffect(() => {
  const handleFinancialYearChange = (event: CustomEvent) => {
    const newFinancialYear = event.detail;
    setFinancialYear(newFinancialYear);
    sessionStorage.setItem(FINANCIAL_YEAR_KEY, newFinancialYear);
  };

  window.addEventListener(
    FINANCIAL_YEAR_CHANGE_EVENT, 
    handleFinancialYearChange as EventListener
  );

  return () => {
    window.removeEventListener(
      FINANCIAL_YEAR_CHANGE_EVENT, 
      handleFinancialYearChange as EventListener
    );
  };
}, []);

  useEffect(() => {
    fetchCompanyGroups();
    fetchPoshReturns();
  }, []);

  

  const fetchCompanyGroups = async () => {
    try {
      const response = await httpClient.get(endpoints.companyGroup.getAll(), {
        params: { ignorePlatform: true }
      });
      
      if (response.data.data?.length > 0) {
        const defaultGroup = response.data.data[0];
        setCompanyGroupId(defaultGroup.id);
        fetchCompanies(defaultGroup.id);
      }
    } catch (error) {
      console.error('Failed to fetch company groups:', error);
    }
  };

  const fetchCompanies = async (groupId: string) => {
    try {
      const response = await httpClient.get(endpoints.company.getAll(), {
        params: { 'group_id[]': groupId }
      });
      
      const formattedCompanies = response.data?.data?.map((company: any) => ({
        value: company.id.toString(),
        label: company.name
      }));
      
      setCompanies(formattedCompanies || []);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    }
  };

 const fetchBranches = async (companyId: string) => {
  try {
    const response = await httpClient.get(endpoints.branch.getAllBranch(), {
      params: { 'company_id[]': companyId }
    });
    
    const capitalizeAllWords = (str: string) => {
      return str.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    };

    const formattedBranches = response.data?.data?.map((branch: any) => {
      const capitalizedBranchName = capitalizeAllWords(branch.name);
      return {
        value: branch.id.toString(),
        label: `${capitalizedBranchName} (${branch.Location?.name}/${branch.District?.name}/${branch.State?.name})`
      };
    });
    
    setBranches(formattedBranches || []);
  } catch (error) {
    console.error('Failed to fetch branches:', error);
  }
};

 const fetchPoshReturns = async () => {
  setLoading(true);
  try {
    const params: Record<string, any> = {
      financial_year: financialYear
    };

    // Only add search if searchTerm exists
    if (searchTerm) {
      params.search = searchTerm;
    }

    const response = await httpClient.get(endpoints.poshSetup.poshReturnList(), {
      params
    });
    
    const transformedData = response.data.data.map((item: any) => ({
      id: item.id,
      companyGroup: 'IHRC',
      company: item.company_name,
      branch: item.branch_name,
      complaintsReceived: item.complaints_received,
      complaintsDisposed: item.complaints_disposed,
      pendingCases: item.pending_cases,
      workshops: item.workshop_conducted,
      actionTaken: item.nature_of_action_taken,
      returnLevel: item.return_level === 'branch' ? 'Branch Level' : 'District Level'
    }));
    
    setPoshData(transformedData);
  } catch (error) {
    console.error('Failed to fetch POSH returns:', error);
  } finally {
    setLoading(false);
  }
};

// Update your useEffect that calls fetchPoshReturns
useEffect(() => {
  fetchPoshReturns();
}, [financialYear, searchTerm]); 

  const handleInputChange = (name: string, value: string | number) => {
  if (name === 'company_id') {
    fetchBranches(value as string);
    setFormData(prev => ({
      ...prev,
      company_id: value as string,
      branch_id: ''
    }));
  } else if (name === 'year') {
    setFormData(prev => ({
      ...prev,
      [name]: Number(value) // Ensure year is stored as number
    }));
  } else {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }
};

  const handleSubmit = async () => {
    if (formData.workshop_conducted < 1) {
      
      return;
    }

    try {
     const response = await httpClient.post(endpoints.poshSetup.createPoshReturn(), {
        ...formData,
        company_id: Number(formData.company_id),
        branch_id: Number(formData.branch_id),
        created_by: userId,
        year: Number(formData.year)
      });

if(response){
  toast.push(
    <Notification title='Success' type='success'>
      POSH return created successfully
    </Notification>
  )
}

      

      setIsDialogOpen(false);
      resetForm();
      fetchPoshReturns();
    } catch (error) {
    
    }
  };

const resetForm = () => {
  const financialYearParts = currentFinancialYear.split('-');
  const baseYear = financialYearParts.length > 0 ? parseInt(financialYearParts[0]) : new Date().getFullYear();
  
  setFormData({
    company_id: '',
    branch_id: '',
    complaints_received: 0,
    complaints_disposed: 0,
    pending_cases: 0,
    workshop_conducted: 1,
    nature_of_action_taken: '',
    return_level: 'branch',
    year: isNaN(baseYear) ? new Date().getFullYear() : baseYear
  });
};

//   const handleDownloadReport = async (id: string) => {
//     try {
//       const response = await httpClient.get(endpoints.poshSetup.exportReport(id), {
//         responseType: 'blob'
//       });
      
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `posh-report-${id}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);

//       Notification.info({
//         title: 'Download Started',
//         message: 'POSH report download has started'
//       });
//     } catch (error) {
//       Notification.error({
//         title: 'Error',
//         message: 'Failed to download report'
//       });
//     }
//   };

  const handleDownloadAllData = async () => {
    try {
      const response = await httpClient.get(endpoints.poshSetup.poshReturnExport(), {
        params: {
          financial_year: financialYear,
          // created_by: userId
        },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `posh-data-export.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

     
    } catch (error) {
     
    }
  };

  const handleBulkUploadSuccess = () => {
    setIsBulkUploadOpen(false);
    fetchPoshReturns();
  };

  const handleBulkDownload = async () => {
    try {
      const response = await httpClient.get(
        endpoints.poshSetup.poshReturnBulkDocumentDownload(), 
        {
          params: {
            type: bulkDownloadData.type,
            company_id: bulkDownloadData.company_id,
            year: bulkDownloadData.year
          },
          responseType: 'blob'
        }
      );
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `posh-reports-${bulkDownloadData.company_id}-${bulkDownloadData.year}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
  
      setIsBulkDownloadOpen(false);
     
    } catch (error) {
     throw error
    }
  };

  const handleDownloadReport = async (id: string) => {
    try {
      const response = await httpClient.get(
        endpoints.poshSetup.poshReturnIndividualDocumentDownload(id), 
        {
          responseType: 'blob'
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `posh-report-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
  
     
    } catch (error) {
     
    }
  };

const generateYearOption = () => {
  const currentYear = new Date().getFullYear();
  // Generate array of previous 4 years (currentYear-1 to currentYear-4)
  return Array.from({ length: 4 }, (_, i) => ({
    value: currentYear - (i + 1),  // +1 to exclude current year
    label: (currentYear - (i + 1)).toString()
  }));
};


//   const generateYearOptions = () => {
//   const currentYear = new Date().getFullYear();
//   return Array.from({ length: 5 }, (_, i) => ({
//     value: (currentYear - i).toString(),
//     label: (currentYear - i).toString()
//   }));
// };


  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div className="mb-4 lg:mb-0">
          <h3 className="text-2xl font-bold">POSH Returns</h3>
        </div>
        <div className="flex gap-2">
          <OutlinedInput 
            label={'Search by branch'} 
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value);
              fetchPoshReturns();
            }}
          />
          <Button 
            size='sm' 
            variant='solid' 
            icon={<HiDownload />}
            onClick={handleDownloadAllData}
          >
            Download Data
          </Button>
          <Button 
    size='sm' 
    variant='solid' 
    icon={<HiDownload />}
    onClick={() => setIsBulkDownloadOpen(true)}
  >
     Download Reports
  </Button>
          <PoshBulkUpload 
            isOpen={isBulkUploadOpen}
            onClose={() => setIsBulkUploadOpen(false)}
            onSuccess={handleBulkUploadSuccess}
          />
          <Button
            variant="solid"
            size="sm"
            icon={<HiPlusCircle />}
            onClick={() => setIsDialogOpen(true)}
          >
            Add Return
          </Button>
        </div>
      </div>

      <PoshTable 
        data={poshData}
        loading={loading} 
        onDownload={handleDownloadReport}      />

<Dialog
  isOpen={isBulkDownloadOpen}
  onClose={() => setIsBulkDownloadOpen(false)}
  onRequestClose={() => setIsBulkDownloadOpen(false)}
  width={600}
>
  <h5 className="mb-6">Bulk Download POSH Reports</h5>
  <div className="grid gap-4">
    <div>
      <label className="block text-sm font-medium mb-2">Select Company</label>
      <OutlinedSelect
        options={companies}
        value={companies.find(option => option.value === bulkDownloadData.company_id) || null}
        onChange={(selectedOption) => setBulkDownloadData(prev => ({
          ...prev,
          company_id: selectedOption?.value || ''
        }))}
        label="Select Company"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Select Year</label>
      <OutlinedSelect
        options={generateYearOption()}
        value={generateYearOption().find(option => option.value === bulkDownloadData.year) || null}
        onChange={(selectedOption) => setBulkDownloadData(prev => ({
          ...prev,
          year: selectedOption?.value || currentFinancialYear
        }))}
        label="Select Year"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Report Type</label>
      <OutlinedSelect
        options={[
          { value: 'branch', label: 'Branch Level Reports' },
          { value: 'district', label: 'District Level Reports' }
        ]}
        value={bulkDownloadData.type === 'branch' 
          ? { value: 'branch', label: 'Branch Level Reports' }
          : { value: 'district', label: 'District Level Reports' }}
        onChange={(selectedOption) => setBulkDownloadData(prev => ({
          ...prev,
          type: selectedOption?.value as 'branch' | 'district'
        }))}
        label="Select Report Type"
      />
    </div>

    <div className="flex justify-end gap-2 mt-4">
      <Button variant="plain" onClick={() => setIsBulkDownloadOpen(false)}>
        Cancel
      </Button>
      <Button 
        variant="solid" 
        onClick={handleBulkDownload}
        disabled={!bulkDownloadData.company_id || !bulkDownloadData.year}
      >
        Download Reports
      </Button>
    </div>
  </div>
</Dialog>

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onRequestClose={() => setIsDialogOpen(false)}
        width={800}
      >
        <h5 className="mb-6">Add POSH Return</h5>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Company</label>
              <OutlinedSelect
                options={companies}
                value={companies.find(option => option.value === formData.company_id) || null}
                onChange={(selectedOption) => handleInputChange('company_id', selectedOption?.value || '')}
                label="Select Company"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Select Branch</label>
              <OutlinedSelect
                options={branches}
                value={branches.find(option => option.value === formData.branch_id) || null}
                onChange={(selectedOption) => handleInputChange('branch_id', selectedOption?.value || '')}
                label="Select Branch"
                disabled={!formData.company_id}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Complaints Received</label>
              <Input
                type="number"
                min="0"
                value={formData.complaints_received}
                onChange={(e) => handleInputChange('complaints_received', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Complaints Disposed</label>
              <Input
                type="number"
                min="0"
                value={formData.complaints_disposed}
                onChange={(e) => handleInputChange('complaints_disposed', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Pending Cases (90+ days)</label>
              <Input
                type="number"
                min="0"
                value={formData.pending_cases}
                onChange={(e) => handleInputChange('pending_cases', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Workshops Conducted</label>
              <Input
                type="number"
                min="1"
                value={formData.workshop_conducted}
                onChange={(e) => handleInputChange('workshop_conducted', parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
      <label className="block text-sm font-medium mb-2">Select Year</label>
    <OutlinedSelect
      options={generateYearOption()}
      value={formData.year ? generateYearOption().find(option => option.value === formData.year) : null}
      onChange={(selectedOption) => handleInputChange('year', selectedOption?.value || new Date().getFullYear() - 1)}
      label="Select Year"
    />
    </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Nature of Action Taken</label>
            <Input
              textArea
              rows={3}
              value={formData.nature_of_action_taken}
              onChange={(e) => handleInputChange('nature_of_action_taken', e.target.value)}
              placeholder="Describe the actions taken..."
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="plain" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" onClick={handleSubmit} loading={loading}>
              Confirm
            </Button>
          </div>
        </div>
      </Dialog>
    </AdaptableCard>
  );
}

export default Posh;