import { AdaptableCard } from '@/components/shared';
import { Button, Dialog, Input } from '@/components/ui';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import OutlinedInput from '@/components/ui/OutlinedInput';
import React, { useState } from 'react';
import { HiPlusCircle, HiUpload, HiDownload, HiEye } from 'react-icons/hi';
import DataTable from '@/components/shared/DataTable';
import { useNavigate } from 'react-router-dom';
import UploadRegisterDialog from './UploadRegisterDialog';
import RegisterTable from './RegisterTable';

// Main Register Component
const Register = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = (id: string) => {
    navigate(`/register/history/${id}`);
  };

  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
        <div className="mb-4 lg:mb-0">
          <h3 className="text-2xl font-bold">Register For Contractor</h3>
        </div>
        <div className='flex items-center gap-2'>
          <Button 
            size='sm' 
            variant='solid' 
            icon={<HiUpload />}
            onClick={() => setIsDialogOpen(true)}
          >
            Upload Register
          </Button>
        </div>
      </div>
      <div className='mb-8'>
        <RegisterTable onViewDetails={handleViewDetails} />
      </div>

      <UploadRegisterDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </AdaptableCard>
  );
};

export default Register