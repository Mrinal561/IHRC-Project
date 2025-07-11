import React, { useState, useEffect } from 'react';
import { Button, Dialog, Input, Notification, toast } from '@/components/ui';
import { HiDownload, HiUpload } from 'react-icons/hi';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';


interface BulkUploadProps {
  onSuccess?: () => void;
}


const BulkUpload = ({ onSuccess }: BulkUploadProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [remark, setRemark] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState<number>(0);

  useEffect(() => {
    const loadCompanyGroups = async () => {
      try {
        const response = await httpClient.get(endpoints.companyGroup.getAll());
        // Set the first group ID as default if available
        if (response.data.data.length > 0) {
          setCurrentGroupId(response.data.data[0].id);
        }
      } catch (error) {
        console.error('Failed to load company groups:', error);
        toast.push(
          <Notification title="Error" type="error">
            Failed to load company groups
          </Notification>
        );
      }
    };

    loadCompanyGroups();
  }, []);

  const handleUploadClick = () => {
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!file) {
      toast.push(
        <Notification title="Error" type="error">
          Please select a file to upload
        </Notification>
      );
      return;
    }

    if (!currentGroupId) {
      toast.push(
        <Notification title="Error" type="error">
          Company group information is not available
        </Notification>
      );
      return;
    }

    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('companyGroupId', currentGroupId.toString());
      if (remark) {
        formData.append('remark', remark);
      }

      const response = await httpClient.post(
        endpoints.compliance.bulkCustomCompliance(),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast.push(
        <Notification title="Success" type="success">
          {response.data.message || 'Checklists imported successfully'}
        </Notification>
      );
      setIsDialogOpen(false);
      setRemark('');
      setFile(null);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to import checklists';
      toast.push(
        <Notification title="Error" type="error">
          {errorMessage}
        </Notification>
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setRemark('');
    setFile(null);
  };

  const handleDownloadTemplate = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (!currentGroupId) {
        toast.push(
          <Notification title="Error" type="error">
            Company group information is not available
          </Notification>
        );
        return;
      }

      const response = await httpClient.get(
        endpoints.compliance.downloadCustomChecklistTemplate(),
        {
          responseType: 'blob',
          params: {
            companyGroupId: currentGroupId
          }
        }
      );

      // Create a blob from the response
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Custom_Checklist_Template.xlsx';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.push(
        <Notification title="Success" type="success">
          Template downloaded successfully
        </Notification>
      );
    } catch (error) {
      console.error('Download failed:', error);
      toast.push(
        <Notification title="Error" type="error">
          Failed to download template
        </Notification>
      );
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <>
      <Button 
        variant="solid" 
        size="sm" 
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
        <h5 className="mb-4">Add Custom Compliances</h5>

        <div className="my-4 flex gap-2 items-center">
          <p>Download Template:</p>
          <Button 
            size="xs" 
            icon={<HiDownload />}
            onClick={handleDownloadTemplate}
            loading={isLoading}
          >
            Download
          </Button>
        </div>
        
        <div className="flex flex-col gap-2">
          <p>Upload Custom Compliances:</p>
          <Input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
            className="mb-4"
            disabled={isLoading}
          />
        </div>
        
        <p>Please Enter the Remark:</p>
        <textarea
          className="w-full p-2 border rounded mb-2"
          rows={3}
          placeholder="Enter remark (optional)"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          disabled={isLoading}
        />
        
        <div className="mt-6 text-right">
          <Button
            size="sm"
            className="mr-2"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            size="sm"
            onClick={handleConfirm}
            loading={isLoading}
            disabled={isLoading || !file}
          >
            {isLoading ? 'Uploading...' : 'Confirm'}
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default BulkUpload;