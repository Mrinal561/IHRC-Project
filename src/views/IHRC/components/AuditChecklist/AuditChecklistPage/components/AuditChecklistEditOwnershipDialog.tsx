import React, { useState, useEffect } from 'react';
import { Dialog, Button, Notification, toast } from '@/components/ui';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import OutlinedSelect from '@/components/ui/Outlined';

interface UserOption {
  label: string;
  value: number;
  email: string;
}

interface AuditChecklistEditOwnershipDialogProps {
  isOpen: boolean;
  onClose: () => void;
  checklist: any;
  onSuccess: () => void;
}

const AuditChecklistEditOwnershipDialog: React.FC<AuditChecklistEditOwnershipDialogProps> = ({
  isOpen,
  onClose,
  checklist,
  onSuccess,
}) => {
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<UserOption | null>(null);
  const [selectedApprover, setSelectedApprover] = useState<UserOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && checklist) {
      fetchCompanyUsers();
      // Set current owner and approver
      setSelectedOwner({
        label: checklist.owner_name,
        value: checklist.owner_id,
        email: checklist.owner_email
      });
      setSelectedApprover({
        label: checklist.approver_name,
        value: checklist.approver_id,
        email: checklist.approver_email
      });
    }
  }, [isOpen, checklist]);

  const fetchCompanyUsers = async () => {
    setIsLoading(true);
    try {
      const response = await httpClient.get(endpoints.user.getAll(), {
        params: { 'company_id[]': checklist.company_id }
      });
      
      // Transform the API response to match expected format
      const userOptions = response.data.data.map((user: any) => ({
        label: user.user_details.name,
        value: user.user_details.id,
        email: user.user_details.email
      }));
      
      setUsers(userOptions);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.push(
        <Notification title="Error" type="error">
          Failed to load company users
        </Notification>
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedOwner || !selectedApprover) {
      toast.push(
        <Notification title="Warning" type="warning">
          Please select both owner and approver
        </Notification>
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await httpClient.put(
        endpoints.compliance.updateComplianceOwnership(checklist.id),
        {
          owner_id: selectedOwner.value,
          approver_id: selectedApprover.value
        }
      );

      toast.push(
        <Notification title="Success" type="success">
          Ownership updated successfully
        </Notification>
      );
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating ownership:', error);
      toast.push(
        <Notification title="Error" type="error">
          Failed to update ownership
        </Notification>
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      width={500}
      shouldCloseOnOverlayClick={!isSubmitting}
    >
      <h5 className="mb-4">Update Compliance Ownership</h5>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Owner</label>
          <OutlinedSelect
            label="Select Owner"
            options={users}
            value={selectedOwner}
            onChange={setSelectedOwner}
            // isLoading={isLoading}
            isDisabled={isSubmitting}
          />
          {/* {selectedOwner && (
            <p className="text-xs text-gray-500 mt-1">{selectedOwner.email}</p>
          )} */}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Approver</label>
          <OutlinedSelect
            label="Select Approver"
            options={users}
            value={selectedApprover}
            onChange={setSelectedApprover}
            // isLoading={isLoading}
            isDisabled={isSubmitting}
          />
          {/* {selectedApprover && (
            <p className="text-xs text-gray-500 mt-1">Approver Email: {selectedApprover.email}</p>
          )} */}
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-2">
        <Button
          disabled={isSubmitting}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="solid"
          loading={isSubmitting}
          onClick={handleSubmit}
        >
          Update
        </Button>
      </div>
    </Dialog>
  );
};

export default AuditChecklistEditOwnershipDialog;