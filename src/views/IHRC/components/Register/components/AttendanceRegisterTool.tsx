import { Button } from '@/components/ui'
import React, { useState } from 'react'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import SalaryRegisterBulkUpload from './SalaryRegisterBulkUpload'
import AttendanceRegisterBulkUpload from './AttendanceRegisterBulkUpload';

interface AttendanceRegisterToolProps {
    onSuccess: () => void;
}

const AttendanceRegisterTool: React.FC<AttendanceRegisterToolProps> = ({ onSuccess }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleBulkUploadSuccess = () => {
        setIsDialogOpen(false)
        onSuccess()
    }

    return (
        <>
            <div className="flex gap-2"> 
                {/* <Button
                    size="sm"
                    variant="solid"
                    icon={<HiDownload />}
                    // onClick={handleDownloadAllData}
                >
                    Download Data
                </Button>                     */}
                <Button
                    variant="solid"
                    size="sm"
                    icon={<HiPlusCircle />}
                    onClick={() => setIsDialogOpen(true)}
                >
                    Add Attendance Data
                </Button>
            </div>

            <AttendanceRegisterBulkUpload
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSuccess={handleBulkUploadSuccess}
            />
        </>
    )
}

export default AttendanceRegisterTool