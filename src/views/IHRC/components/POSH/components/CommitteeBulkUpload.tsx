import React, { useState } from 'react';
import { Button, Dialog, Input, Notification, toast } from '@/components/ui';
import { HiDownload, HiUpload } from 'react-icons/hi';
import OutlinedInput from '@/components/ui/OutlinedInput';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import useAuth from '@/utils/hooks/useAuth';


interface CommitteeBulkUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Add this prop
}


const CommitteeBulkUpload: React.FC<CommitteeBulkUploadProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [remark, setRemark] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const auth = useAuth();
  const userId = auth?.user?.id || 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await httpClient.get(endpoints.poshSetup.committeeTemplate(), {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'posh-committee-template.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.push(
        <Notification 
          title="Error"
          type="error"
          closable
        >
          Failed to download template
        </Notification>
      );
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.push(
        <Notification 
          title="Warning"
          type="warning"
          closable
        >
          Please select a file to upload
        </Notification>
      );
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('remark', remark);
      formData.append('created_by', userId.toString());

      const response = await httpClient.post(
        endpoints.poshSetup.createBulkCommittee(), 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data) {
        toast.push(
          <Notification 
            title="Success"
            type="success"
            closable
          >
            Committee members uploaded successfully
          </Notification>
        );
        setIsDialogOpen(false);
        onSuccess(); // Call the success callback
        onClose();
        // You might want to add a callback prop here to refresh the table
      }
    } catch (error:any) {
      console.error('Upload error:', error);
      let errorMessage = 'Failed to upload committee data';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.join('\n');
      }

      toast.push(
        <Notification 
          title="Error"
          type="error"
          closable
        >
          {errorMessage}
        </Notification>
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* This is the bulk upload button that was in your original code */}
      <Button
        variant="solid"
        size="sm"
        icon={<HiUpload />}
        onClick={() => setIsDialogOpen(true)}
      >
        Bulk Upload
      </Button>

      {/* This is the dialog that appears when the button is clicked */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        width={500}
        onRequestClose={() => setIsDialogOpen(false)}
      >
        <h5 className="mb-4">Bulk Upload Committees</h5>
        
        <div className="my-4 flex gap-2 items-center">
          <p>Download Template:</p>
          <Button
            size="xs"
            icon={<HiDownload />}
            onClick={handleDownloadTemplate}
          >
            Download
          </Button>
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <p>Upload Committees File:</p>
          <Input
            type="file"
            onChange={handleFileChange}
            accept=".xlsx,.xls,.csv"
          />
        </div>

        <div>
          <p>Enter Remark</p>
          <OutlinedInput 
            textarea 
            label="Enter Remark" 
            value={remark} 
            onChange={(value) => setRemark(value)} 
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="plain"
            onClick={() => setIsDialogOpen(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            onClick={handleUpload}
            disabled={!file || isUploading}
            loading={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Confirm'}
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default CommitteeBulkUpload;