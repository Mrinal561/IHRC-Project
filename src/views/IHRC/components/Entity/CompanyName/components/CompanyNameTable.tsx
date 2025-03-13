
import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Dialog, Tooltip, Notification, toast, Dropdown } from '@/components/ui';
import { FiSettings, FiTrash } from 'react-icons/fi';
import { MdEdit } from 'react-icons/md';
import { RiEyeLine } from 'react-icons/ri';
import OutlinedInput from '@/components/ui/OutlinedInput/OutlinedInput';
import OutlinedSelect from '@/components/ui/Outlined';
import DataTable, { ColumnDef, OnSortParam } from '@/components/shared/DataTable';
import { APP_PREFIX_PATH } from '@/constants/route.constant';
import { useAppDispatch } from '@/store';
import { deleteCompany, fetchCompanies, updateCompany } from '@/store/slices/company/companySlice';
import ConfigDropdown from './ConfigDropdown';
import { endpoints } from '@/api/endpoint';
import httpClient from '@/api/http-client';
import { showErrorNotification } from '@/components/ui/ErrorMessage';
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json'
import Lottie from 'lottie-react';
import { HiOutlineViewGrid } from 'react-icons/hi'
import * as yup from 'yup';

interface ValidationErrors {
  name?: string;
}

const companySchema = yup.object().shape({
  name: yup
    .string()
    .required('Company name is required')
    .min(3, 'Company name must be at least 3 characters')
    .max(50, 'Company name must not exceed 50 characters')
    .matches(/^\S.*\S$|^\S$/,'The input must not have leading or trailing spaces')
    .matches(/^[a-zA-Z0-9\s_-]+$/, 'Role name can only contain letters, numbers, spaces, underscores, and hyphens')
});

interface CompanyData {
  id: number;
  name: string;
  company_group_name: string;
  group_id: number;
  CompanyGroup?: {
    name: string;
  };
}

interface CompanyNameTableProps {
  companyData: CompanyData[];
  isLoading: boolean;
  onDataChange: () => void;
  pagination: {
    total: number;
    pageIndex: number;
    pageSize: number;
  };
  onPaginationChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

interface SelectOption {
  value: string;
  label: string;
}

const CompanyNameTable: React.FC<CompanyNameTableProps> = ({
  companyData,
  isLoading,
  onDataChange,
  pagination,
  onPaginationChange,
  onPageSizeChange
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [companyTableData, setCompanyTableData] = useState<CompanyData[]>([]);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CompanyData | null>(null);
  const [itemToEdit, setItemToEdit] = useState<CompanyData | null>(null);
  const [editedName, setEditedName] = useState('');
  const [selectedCompanyGroup, setSelectedCompanyGroup] = useState<SelectOption | null>(null);
  const [companyGroups, setCompanyGroups] = useState<SelectOption[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    loadCompanyGroups();
  }, []);

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const handleNameChange = async (value: string) => {
    setEditedName(value);
    try {
      await companySchema.validateAt('name', { name: value });
      setErrors(prev => ({ ...prev, name: undefined }));
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setErrors(prev => ({ ...prev, name: err.message }));
      }
    }
  };

  const fetchCompanyData = async () => {
    try {
      const { payload: data } = await dispatch(fetchCompanies());
      
      const mappedData = data?.data?.map((company: CompanyData) => ({
        ...company,
        company_group_name: company.CompanyGroup?.name || company.company_group_name || 'N/A'
      })) || [];

      setCompanyTableData(mappedData);
    } catch (error) {
      console.error('Failed to fetch company data:', error);
      showNotification('error', 'Failed to fetch company data');
    }
  };

  const loadCompanyGroups = async () => {
    try {
      const { data } = await httpClient.get(endpoints.companyGroup.getAll(), {
        params: { ignorePlatform: true },
      });
      setCompanyGroups(
        data.data.map((v: any) => ({
          label: v.name,
          value: String(v.id),
        }))
      );
    } catch (error) {
      console.error('Failed to load company groups:', error);
      showNotification('error', 'Failed to load company groups');
    }
  };

  const columns = useMemo<ColumnDef<CompanyData>[]>(
    () => [
      {
        header: 'Company',
        enableSorting: false,
        accessorKey: 'name',
        cell: (props) => (
          <div className="w-96 truncate">{props.getValue() as string}</div>
        ),
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Tooltip title="Edit Company">
              <Button
                size="sm"
                onClick={() => openEditDialog(row.original)}
                icon={<MdEdit />}
                className="text-blue-500"
              />
            </Tooltip>
            <Tooltip title="Delete Company">
              <Button
                size="sm"
                onClick={() => openDeleteDialog(row.original)}
                icon={<FiTrash />}
                className="text-red-500"
              />
            </Tooltip>
            <ConfigDropdown
              companyName={row.original.name} 
              companyGroupName={row.original.company_group_name}
              companyId={row.original.id}
              groupId={row.original.group_id}
            />
          </div>
        ),
      },
    ],
    []
  );

  const handleViewDetails = (company: CompanyData) => {
    const urlSafeCompanyName = encodeURIComponent(company.name.replace(/\s+/g, '-').toLowerCase());
    navigate(`${APP_PREFIX_PATH}/IHRC/company-details/${urlSafeCompanyName}`, {
      state: { 
        companyName: company.name, 
        companyGroupName: company.company_group_name 
      }
    });
  };

  const handleSetupClick = (setupType: string, companyName: string, companyGroupName: string) => {
    const urlSafeCompanyName = encodeURIComponent(companyName.replace(/\s+/g, '-').toLowerCase());
    navigate(`${APP_PREFIX_PATH}/IHRC/${setupType.toLowerCase()}-setup/${urlSafeCompanyName}`, {
      state: { companyName, companyGroupName }
    });
  };

  const openDeleteDialog = (company: CompanyData) => {
    setItemToDelete(company);
    setDialogIsOpen(true);
  };

  const openEditDialog = (company: CompanyData) => {
    setItemToEdit(company);
    setEditedName(company.name);
    setSelectedCompanyGroup({
      label: company.company_group_name,
      value: String(company.group_id)
    });
    setEditDialogIsOpen(true);
  };

  const handleDialogClose = () => {
    setDialogIsOpen(false);
    setEditDialogIsOpen(false);
    setItemToDelete(null);
    setItemToEdit(null);
    setEditedName('');
    setSelectedCompanyGroup(null);
    setErrors({}); 
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    toast.push(
      <Notification title={type === 'success' ? 'Success' : 'Error'} type={type} closable={true}>
        {message}
      </Notification>
    );
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete?.id) {
      try {
        setLoading(true)
        const res = await dispatch(deleteCompany(itemToDelete.id))
        .unwrap()
        .catch((error: any) => {
          throw error;
      });
      handleDialogClose();
      if(res){
        showNotification('success', 'Company deleted successfully');
      }
        
        await fetchCompanyData();
        onDataChange();
      } catch (error) {
      } finally{
        setLoading(false)
      }
      
    }
  };

  const validateForm = async () => {
    try {
        await companySchema.validate({ name: editedName }, { abortEarly: false });
        setErrors({});
        return true;
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            const validationErrors: ValidationErrors = {};
            err.inner.forEach((error) => {
                if (error.path) {
                    validationErrors[error.path as keyof ValidationErrors] = error.message;
                }
            });
            setErrors(validationErrors);
        }
        return false;
    }
};
  
const handleEditConfirm = async () => {
  if (!itemToEdit) {
    showNotification('error', 'No company selected for editing');
    return;
  }

  try {
    setDialogLoading(true);
    
    const isValid = await validateForm();
    if (!isValid) {
      setDialogLoading(false);
      return;
    }

    const groupId = selectedCompanyGroup 
      ? parseInt(selectedCompanyGroup.value)
      : itemToEdit.group_id;

    if (editedName.trim() !== itemToEdit.name || groupId !== itemToEdit.group_id) {
      const response = await dispatch(updateCompany({
        id: itemToEdit.id,
        data: {
          name: editedName.trim(),
          group_id: groupId
        }
      })).unwrap();

      if (response) {
        showNotification('success', 'Company updated successfully');
        handleDialogClose();
        await fetchCompanyData();
        onDataChange();
      }
    } else {
      showNotification('error', 'No changes detected');
      handleDialogClose();
    }
  } catch (error: any) {
    if (error.response?.data?.message) {
      showErrorNotification(error.response.data.message);
    } else if (error.message) {
      showErrorNotification(error.message);
    } else if (Array.isArray(error)) {
      showErrorNotification(error);
    } else {
      showErrorNotification(error);
    }
  } finally {
    setDialogLoading(false);
  }
};

  if (isLoading) {
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
    <div className="relative">
       {companyData.length === 0 ? (

                <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
                <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
                <p className="text-center">
                   No Data Available
                </p>
      </div>
            ) : (
      <DataTable
        columns={columns}
        data={companyData}
        skeletonAvatarColumns={[0]}
        skeletonAvatarProps={{ className: 'rounded-md' }}
        loading={isLoading}
        stickyHeader={true}
        stickyFirstColumn={true}
        stickyLastColumn={true}
        pagingData={{
          total: pagination.total,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        }}
        onPaginationChange={onPaginationChange}
        onSelectChange={onPageSizeChange}
      />
      )}
      <Dialog
        isOpen={dialogIsOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}
        shouldCloseOnOverlayClick={false} 
      >
        <h5 className="mb-4">Confirm Deletion</h5>
        <p>
          Are you sure you want to delete company "{itemToDelete?.name}"? 
          This action cannot be undone.
        </p>
        <div className="mt-6 text-right flex gap-2 justify-end items-center">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            variant="plain"
            onClick={handleDialogClose}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={handleDeleteConfirm} loading={loading}>
            Confirm
          </Button>
        </div>
      </Dialog>

      <Dialog
       isOpen={editDialogIsOpen}
       onClose={() => {
         if (!dialogLoading) {
           handleDialogClose();
         }
       }}
       onRequestClose={() => {
         if (!dialogLoading) {
           handleDialogClose();
         }
       }}
      >
        <h5 className="mb-4">Edit Company</h5>
  <div className="flex flex-col gap-5">
    <div>
      <p className='mb-4'>Company Group <span className='text-red-500'>*</span></p>
      <OutlinedInput
        isDisabled={true}
        label="Company Group"
        // options={companyGroups}
        value={selectedCompanyGroup?.label}
        onChange={()=>{}}
      />
    </div>
    <div>
      <p className='mb-4'> Company Name <span className='text-red-500'>*</span></p>
      <OutlinedInput
        label="Enter Company Name"
        value={editedName}
        onChange={(value: string) => handleNameChange(value)}
      />
      {errors.name && (
        <div className="text-red-500 text-sm mt-1">{errors.name}</div>
      )}
    </div>
  </div>
  <div className="mt-6 text-right flex gap-2 justify-end items-center">
    <Button
      className="ltr:mr-2 rtl:ml-2"
      variant="plain"
      onClick={handleDialogClose}
      disabled={dialogLoading}
      type="button"
    >
      Cancel
    </Button>
    <Button 
      variant="solid" 
      onClick={handleEditConfirm} 
      loading={dialogLoading}
      disabled={dialogLoading}
    >
      Confirm
    </Button>
  </div>
</Dialog>
    </div>
  );
};

export default CompanyNameTable;