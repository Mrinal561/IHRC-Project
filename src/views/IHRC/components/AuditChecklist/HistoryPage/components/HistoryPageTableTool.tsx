import React, { useState } from 'react'
import Button from '@/components/ui/Button'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { Dialog, toast, Notification } from '../../../../../../components/ui'
import HistoryPageTableSearch from './HistoryPageTableSearch'
import HistoryPageFilter from './HistoryPageFilter'




const AssignChecklistButton = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    

    const handleConfirm = () => {
        setIsDialogOpen(false);
        toast.push(
          <Notification
            title="Success"
            type="success"
          >
            Compliance assigned successfully!
          </Notification>,
          {
            placement: 'top-end',
          }
        );
      };

    const handleCancel = () => {
        setIsDialogOpen(false);
    };

    return (
        <>
            <Dialog
                isOpen={isDialogOpen}
                onClose={handleCancel}
                width={400}
            >
                <h5 className="mb-4">Confirm Assignment</h5>
                <p>Are you sure you want to assign the checked compliances?</p>
                <div className="mt-6 text-right">
                    <Button
                        size="sm"
                        className="mr-2"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        size="sm"
                        onClick={handleConfirm}
                    >
                        Confirm
                    </Button>
                </div>
            </Dialog>
        </>
    );
};



const HistoryPageTableTool = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleAssignClick = () => {
        setIsDialogOpen(true)
    }

    const handleDialogClose = () => {
        setIsDialogOpen(false)
    }

    const handleConfirmAssign = () => {
        setIsDialogOpen(false)
        // Here you would typically call an API to assign the checklist
        // For this example, we'll just show a success toast
        toast.push(
            <div className="flex items-center gap-2">
                <span className="text-emerald-600">
                    <HiPlusCircle />
                </span>
                <span>Compliance assigned successfully!</span>
            </div>,
            { placement: 'top-center' }
        )
    }

    const BulkDownload = () => {
        toast.push(
            <Notification
        title="Downloaded Successfully"
        type="success"
      >
        <p>All Compliances history Downloaded Successfully</p>
      </Notification>,
      {
        placement: 'top-end',
      }
        )
    }
    return (
        <>
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            {/* <HistoryPageTableSearch onSearch={undefined} onDateRangeChange={undefined} /> */}
           
               <HistoryPageFilter />
          
        </div>
        </>
    )
}

export default HistoryPageTableTool