// RequestToAdminDialog.tsx
import React, { useState } from 'react';
import { Button, Dialog, Input, Notification, toast } from '@/components/ui';

interface RequestToAdminDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  loading?: boolean;
}

const RequestToAdminDialog: React.FC<RequestToAdminDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) => {
  const [reason, setReason] = useState('');

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.push(
        <Notification title="Error" type="danger">
          Please enter a reason for the request
        </Notification>
      );
      return;
    }

    try {
      await onConfirm(reason);
      toast.push(
        <Notification title="Success" type="success">
          Request sent to admin successfully
        </Notification>
      );
      onClose();
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} shouldCloseOnOverlayClick={false}>
      <div className="p-4">
        <h3 className="mb-4">Request Edit Permission</h3>
        <div className="mb-6">
        <p className="mb-4">Please provide a reason for requesting edit access:</p>
          <Input
            textArea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason why you need to edit this record..."
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} variant="plain">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="solid"
            loading={loading}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default RequestToAdminDialog;