import React, { useState } from 'react'
import {
    Button,
    Dialog,
    Calendar,
    Input,
    Tooltip,
    toast,
    Notification,
} from '@/components/ui'
import { HiBellAlert } from 'react-icons/hi2'

const BulkAlertButton = () => {
    const [isBulkReminderDialogOpen, setIsBulkReminderDialogOpen] =
        useState(false)
    const [bulkReminderDate, setBulkReminderDate] = useState(null)
    const [bulkReminderEmail, setBulkReminderEmail] = useState('')

    const handleBulkBellClick = () => {
        setBulkReminderDate(null)
        setBulkReminderEmail('')
        setIsBulkReminderDialogOpen(true)
    }

    const handleBulkReminderSave = () => {
        if (bulkReminderDate && bulkReminderEmail) {
            console.log(
                `Bulk reminder set on ${bulkReminderDate.toDateString()} to ${bulkReminderEmail}`,
            )

            toast.push(
                <Notification title="Success" type="success">
                    Bulk reminder set successfully
                    <br />
                    Date: {bulkReminderDate.toDateString()}
                    <br />
                    Email: {bulkReminderEmail}
                </Notification>,
                { placement: 'top-end' },
            )

            setIsBulkReminderDialogOpen(false)
            setBulkReminderDate(null)
            setBulkReminderEmail('')
        } else {
            toast.push(
                <Notification title="Error" closable={true} type="danger">
                    Please fill in all fields
                </Notification>,
                { placement: 'top-end' },
            )
        }
    }

    return (
        <>
            <Button
                size="sm"
                onClick={handleBulkBellClick}
                icon={<HiBellAlert />}
                className="hover:bg-transparent text-red-500 flex items-center"
            >
                <span className="ml-1">Bulk Reminder</span>
            </Button>

            <Dialog
                isOpen={isBulkReminderDialogOpen}
                onClose={() => setIsBulkReminderDialogOpen(false)}
                onRequestClose={() => setIsBulkReminderDialogOpen(false)}
                className="max-w-md p-6"
                shouldCloseOnOverlayClick={false}
            >
                <h5 className="mb-4 text-lg font-semibold">
                    Set Bulk Reminder
                </h5>
                <div className="space-y-4">
                    <div>
                        <label className="block mb-2">Set Reminder Date</label>
                        <Calendar
                            value={bulkReminderDate}
                            onChange={(date) => setBulkReminderDate(date)}
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Email</label>
                        <Input
                            type="email"
                            value={bulkReminderEmail}
                            onChange={(e) =>
                                setBulkReminderEmail(e.target.value)
                            }
                            placeholder="Enter email address"
                        />
                    </div>
                </div>
                <div className="mt-6 text-right">
                    <Button
                        variant="solid"
                        size="md"
                        onClick={handleBulkReminderSave}
                    >
                        Confirm
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

export default BulkAlertButton