import React from 'react'
import { Button, Dialog } from '@/components/ui'
import { AuditChecklistData } from './AuditChecklistTable'
import Badge from '@/components/ui/Badge'

interface AuditChecklistDetailDialogProps {
    isOpen: boolean
    onClose: () => void
    checklist: AuditChecklistData
}

const AuditChecklistDetailDialog: React.FC<AuditChecklistDetailDialogProps> = ({
    isOpen,
    onClose,
    checklist
}) => {
    const getCriticalityBadge = (criticality: string) => {
        switch (criticality.toLowerCase()) {
            case 'high':
                return <Badge className="bg-red-500" />
            case 'medium':
                return <Badge className="bg-yellow-500" />
            case 'low':
                return <Badge className="bg-green-500" />
            default:
                return <Badge className="bg-gray-500" />
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={800}
            onRequestClose={onClose}
        >
            <h5 className="mb-4">Compliance Checklist Details</h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <h6 className="text-sm font-semibold mb-2">Basic Information</h6>
                    <div className="space-y-2">
                        <p><span className="font-medium">Instance ID:</span> {checklist.compliance_instance_id}</p>
                        <p><span className="font-medium">Compliance ID:</span> {checklist.compliance_id}</p>
                        <p><span className="font-medium">Company:</span> {checklist.ihrc_company_name}</p>
                        <p><span className="font-medium">Location:</span> {checklist.location}</p>
                    </div>
                </div>
                
                <div>
                    <h6 className="text-sm font-semibold mb-2">Status</h6>
                    <div className="space-y-2">
                        <p className="flex items-center gap-2">
                            <span className="font-medium">Criticality:</span> 
                            {getCriticalityBadge(checklist.criticality)}
                            {checklist.criticality}
                        </p>
                        <p><span className="font-medium">Legislation:</span> {checklist.legislation}</p>
                        <p><span className="font-medium">Categorization:</span> {checklist.compliance_categorization}</p>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h6 className="text-sm font-semibold mb-2">Compliance Details</h6>
                <div className="space-y-2">
                    <p><span className="font-medium">Header:</span> {checklist.compliance_header}</p>
                    <p><span className="font-medium">Description:</span> {checklist.compliance_description}</p>
                    <p><span className="font-medium">Penalty Description:</span> {checklist.penalty_description}</p>
                    <p><span className="font-medium">Applicability:</span> {checklist.compliance_applicability}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <h6 className="text-sm font-semibold mb-2">Compliance Specifications</h6>
                    <div className="space-y-2">
                        <p><span className="font-medium">Type:</span> {checklist.compliance_type}</p>
                        <p><span className="font-medium">Frequency:</span> {checklist.compliance_frequency}</p>
                        <p><span className="font-medium">Statutory Authority:</span> {checklist.compliance_statutory_authority}</p>
                        <p><span className="font-medium">Approval Required:</span> {checklist.approval_required ? 'Yes' : 'No'}</p>
                    </div>
                </div>
                
                <div>
                    <h6 className="text-sm font-semibold mb-2">Dates & Scheduling</h6>
                    <div className="space-y-2">
                        <p><span className="font-medium">Default Due Date:</span> {checklist.default_due_date}</p>
                        <p><span className="font-medium">First Due Date:</span> {checklist.first_due_date}</p>
                        <p><span className="font-medium">Due Date:</span> {checklist.due_date}</p>
                        <p><span className="font-medium">Scheduled Frequency:</span> {checklist.scheduled_frequency}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h6 className="text-sm font-semibold mb-2">Ownership</h6>
                    <div className="space-y-2">
                        <p><span className="font-medium">Owner:</span> {checklist.owner_name}</p>
                        <p><span className="font-medium">Owner Email:</span> {checklist.owner_username}</p>
                    </div>
                </div>
                
                <div>
                    <h6 className="text-sm font-semibold mb-2">Approval</h6>
                    <div className="space-y-2">
                        <p><span className="font-medium">Approver:</span> {checklist.approver_name}</p>
                        <p><span className="font-medium">Approver Email:</span> {checklist.approver_username}</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-right">
                <Button variant="solid" onClick={onClose}>
                    Close
                </Button>
            </div>
        </Dialog>
    )
}

export default AuditChecklistDetailDialog