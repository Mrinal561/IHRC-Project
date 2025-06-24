import React, { useState } from 'react'
import { Dialog, Button, Input, Notification, toast } from '@/components/ui'
import { AuditChecklistData } from './AuditChecklistTable'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'

interface AuditChecklistEditDialogProps {
    isOpen: boolean
    onClose: () => void
    checklist: AuditChecklistData
    onSuccess: () => void
}

const AuditChecklistEditDialog: React.FC<AuditChecklistEditDialogProps> = ({
    isOpen,
    onClose,
    checklist,
    onSuccess
}) => {
    const [formData, setFormData] = useState({
        owner_name: checklist.owner_name,
        owner_email: checklist.owner_username,
        approver_name: checklist.approver_name,
        approver_email: checklist.approver_username,
        due_date_frequency: checklist.scheduled_frequency,
        compliance_frequency: checklist.compliance_frequency,
        due_dates: JSON.stringify({
            first_due_date: checklist.first_due_date,
            due_date: checklist.due_date
        }, null, 2)
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            await httpClient.put(
                endpoints.compliance.editComplianceChecklist(checklist.id),
                formData
            )
            toast.push(
                <Notification title="Success" type="success">
                    Compliance checklist updated successfully
                </Notification>
            )
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error updating checklist:', error)
            toast.push(
                <Notification title="Error" type="error">
                    Failed to update compliance checklist
                </Notification>
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={600}
            onRequestClose={onClose}
        >
            <h5 className="mb-4">Edit Compliance Checklist</h5>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Owner Name</label>
                    <Input
                        name="owner_name"
                        value={formData.owner_name}
                        onChange={handleChange}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-1">Owner Email</label>
                    <Input
                        name="owner_email"
                        value={formData.owner_email}
                        onChange={handleChange}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-1">Approver Name</label>
                    <Input
                        name="approver_name"
                        value={formData.approver_name}
                        onChange={handleChange}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-1">Approver Email</label>
                    <Input
                        name="approver_email"
                        value={formData.approver_email}
                        onChange={handleChange}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-1">Due Date Frequency</label>
                    <Input
                        name="due_date_frequency"
                        value={formData.due_date_frequency}
                        onChange={handleChange}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-1">Compliance Frequency</label>
                    <Input
                        name="compliance_frequency"
                        value={formData.compliance_frequency}
                        onChange={handleChange}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-1">Due Dates (JSON)</label>
                    <Input
                        textArea
                        name="due_dates"
                        value={formData.due_dates}
                        onChange={handleChange}
                        rows={4}
                    />
                </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
                <Button variant="plain" onClick={onClose} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button
                    variant="solid"
                    onClick={handleSubmit}
                    loading={isSubmitting}
                >
                    Save Changes
                </Button>
            </div>
        </Dialog>
    )
}

export default AuditChecklistEditDialog