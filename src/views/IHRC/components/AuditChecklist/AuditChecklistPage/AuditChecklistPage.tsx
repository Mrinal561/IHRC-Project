import { AdaptableCard } from '@/components/shared'
import { Button, Dialog, Input } from '@/components/ui'
import OutlinedInput from '@/components/ui/OutlinedInput'
import React, { useState } from 'react'
import { HiDownload, HiUpload } from 'react-icons/hi'
import AuditChecklistTable from './components/AuditChecklistTable'
import Company from '../../Home/components/Company'
import OutlinedSelect from '@/components/ui/Outlined/Outlined'

const AuditChecklistPage = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [pagination, setPagination] = useState({
        total: 1,
        pageIndex: 1,
        pageSize: 10,
    })

    const handelCancel = () => {
        setIsDialogOpen(false);
    }
    const handelUpload = () => {
        setIsDialogOpen(true);
    }
    const handleViewDetail = (item) => {
        console.log('View details for:', item)
        // Navigate to detail view or open modal
    }

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, pageIndex: page }))
        // Fetch data for new page
    }

    const handlePageSizeChange = (size) => {
        setPagination(prev => ({ ...prev, pageSize: size, pageIndex: 1 }))
        // Refetch data with new page size
    }
  return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className='flex flex-col gap-8'>

            <div className='flex justify-between items-center mb-2'>

         <div className="flex flex-row items-center justify-between">
                <div className="">
                    <h3 className="text-2xl font-bold">Compliance Checklist</h3>
                    <p className="text-gray-600">View your company's compliance</p>
                </div>
            </div>

            <div className='flex items-center gap-2'>
                <div>
                    <OutlinedInput label={'Search'} value={''} onChange={function (value: string): void {
                      throw new Error('Function not implemented.')
                  } } />
                </div>
                <div>
                    <Button variant='solid' size='sm' icon={<HiDownload />}>Download</Button>
                </div>
                <div>
                    <Button variant='solid' size='sm' icon={<HiUpload />} onClick={handelUpload}>Bulk Upload</Button>
                </div>
            </div>
            </div>
            <div className="mb-2">
            <Company />
            </div>

            <AuditChecklistTable
                onViewDetail={handleViewDetail}
                pagination={pagination}
                onPaginationChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
            />
            </div>

            <Dialog
                isOpen={isDialogOpen}
                onClose={handelCancel}
                width={450}
                shouldCloseOnOverlayClick={false}
            >
                <h5 className="mb-4">Bulk Upload</h5>
                <div className='flex flex-col gap-2'>
                    <p>Company</p>
                    <OutlinedSelect label="Select Company" options={undefined} value={undefined} onChange={undefined} />
                </div>
                <div className="my-4 flex gap-2 items-center">
                    <p>Download Format</p>
                    <a
                        // onClick={handleDownload}
                        className="text-blue-600 hover:underline"
                    >
                        <Button size="xs" icon={<HiDownload />}>
                            Download
                        </Button>
                    </a>
                </div>
                <div className="flex flex-col gap-2">
                    <p>Upload Compliance File:</p>
                    <Input
                        type="file"
                        accept=".xlsx,.xls"
                        className="mb-4"
                    />
                </div>
                <p>Enter the Remark:</p>
                <textarea
                    className="w-full p-2 border rounded mb-2"
                    rows={3}
                    placeholder="Enter remark"
                />
                <div className="mt-6 text-right flex gap-2 justify-end items-center">
                    <Button
                        size="sm"
                        className="mr-2"
                        onClick={handelCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        size="sm"
                        onClick={handelCancel}
                    >
                        Confirm
                    </Button>
                </div>
            </Dialog>


        </AdaptableCard>
  )
}

export default AuditChecklistPage