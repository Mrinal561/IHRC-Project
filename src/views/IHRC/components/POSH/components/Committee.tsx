import { AdaptableCard } from '@/components/shared'
import { Button } from '@/components/ui';
import OutlinedInput from '@/components/ui/OutlinedInput';
import React from 'react'
import { HiDownload, HiPlusCircle } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import CommitteeBulkUpload from './CommitteeBulkUpload';
import CommitteeTable from './CommitteeTable';

const Committee = () => {
    const navigate= useNavigate()
  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div className="mb-4 lg:mb-0">
            <h3 className="text-2xl font-bold">Committee</h3>
        </div>
        <div className="flex gap-2">
            <OutlinedInput label={'Search by branch'} value={''} onChange={function (value: string): void {
                throw new Error('Function not implemented.');
            } }></OutlinedInput>
            <Button size='sm' variant='solid' icon={<HiDownload />}>Download Data</Button>
            <CommitteeBulkUpload />
            <Button
                variant="solid"
                size="sm"
                icon={<HiPlusCircle />}
                onClick={() => navigate('/add-committee')}
            >
                Add Committee
            </Button>
        </div>
    </div>
    <div>
        <CommitteeTable />
    </div>
    </AdaptableCard>
  )
}

export default Committee