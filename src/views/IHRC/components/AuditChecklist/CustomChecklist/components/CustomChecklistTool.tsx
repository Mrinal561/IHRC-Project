import React from 'react'
import CustomTableSearch from './CustomTableSearch'
import CustomTableFilter from './CustomTableFilter'
import { Link } from 'react-router-dom'
import { HiDownload } from 'react-icons/hi'
import CustomChecklistButton from './CustomChecklistButton'
import { Button } from '@/components/ui'
import BulkUpload from './BulkUpload';
import Company from '../../../Home/components/Company'
const CustomChecklistTool = () => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <CustomTableSearch />
            {/* <Company /> */}
            <Button size='sm' icon={<HiDownload />} variant='solid'>Download </Button>
            <BulkUpload />
            <div className="block lg:inline-block md:mb-0 mb-4">
                <CustomChecklistButton />
            </div>
        </div>
    )
}

export default CustomChecklistTool
