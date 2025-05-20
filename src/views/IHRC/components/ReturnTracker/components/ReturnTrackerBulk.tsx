import { Button, Dialog, Input } from '@/components/ui'
import React, { useState } from 'react'
import { HiDownload, HiUpload } from 'react-icons/hi'

const ReturnTrackerBulk = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);


    const handleUploadClick = () => {
        setIsDialogOpen(true)
    }


    const handleCancel = () => {
        setIsDialogOpen(false)
    }

  return (
    <div>
        <Button 
        variant="solid"
        size='sm'
        icon={<HiUpload />}
        onClick={handleUploadClick}
        >
            Bulk Upload
        </Button>

        <Dialog
        isOpen={isDialogOpen}
        onClose={handleCancel}
        width={450}
        shouldCloseOnOverlayClick={false}
        >
            <h5 className="mb-4">Bulk Upload</h5>
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
                    <p>Upload Return Tracker File:</p>
                    <Input
                        type="file"
                        // onChange={handleFileChange}
                        className="mb-4"
                    />
                </div>
                <p>Please Enter the Remark:</p>
                <textarea
                    className="w-full p-2 border rounded mb-2"
                    rows={3}
                    placeholder="Enter remark"
                    // value={remark}
                    // onChange={(e) => setRemark(e.target.value)}
                />
                <div className="mt-6 text-right flex gap-2 justify-end items-center">
                    <Button
                        size="sm"
                        className="mr-2"
                        onClick={handleCancel}
                        // disabled={isUploading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        size="sm"
                        // onClick={handleConfirm}
                        // loading={isUploading}
                    >
                        Confirm
                    </Button>
                </div>
        </Dialog>
    </div>
  )
}

export default ReturnTrackerBulk