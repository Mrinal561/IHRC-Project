import React, { useState } from 'react'
import { Button, Dialog, Input, Notification } from '@/components/ui'
import { IoArrowBack } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { toast } from '@/components/ui'
import ReuploadDocumentTable from './components/ReuploadDocumentTable'
import { HiDownload, HiUpload } from 'react-icons/hi'
import { CgSoftwareUpload } from 'react-icons/cg'

const documentPath = "../store/AllMappedCompliancesDetails.xls";


const BulkUploadButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [remark, setRemark] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleAssignClick = () => {
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    setIsDialogOpen(false);
    // Here you would typically handle the file upload and remark submission
    // For this example, we'll just show a success notification
    toast.push(
      <Notification
        title="Success"
        type="success"
      >
        Upload successfully!
      </Notification>,
      {
        placement: 'top-end',
      }
    );
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setRemark('');
    setFile(null);
  };

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    // Implement the download functionality here
    // For example, you could use the `fetch` API to download the file
    fetch(documentPath)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'AllMappedCompliancesDetails.xls';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => console.error('Download failed'));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <>
      <Button 
        variant="solid" 
        size="sm" 
        icon={<HiUpload />} 
        onClick={handleAssignClick}
      >
        Bulk Upload
      </Button>

      <Dialog
        isOpen={isDialogOpen}
        onClose={handleCancel}
        width={450}
      >
        <h5 className="mb-4">Upload Compliances</h5>
        <div className="my-4 flex gap-2 items-center">
          <p>Download Compliances</p>
          <a href={documentPath} onClick={handleDownload} className="text-blue-600 hover:underline ">
            <Button size='xs' icon={<HiDownload />}>Download</Button>
          </a>
        </div>
        <div className='flex flex-col gap-2'>
        <p>Upload updated Compliances:</p>
        <Input
          type="file"
          onChange={handleFileChange}
          className="mb-4"
          />
        </div>
        <p>Please Enter the Remark:</p>
        <textarea
          className="w-full p-2 border rounded mb-2"
          rows={3}
          placeholder="Enter remark"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
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


const ReuploadDocument: React.FC = () => {
  const navigate = useNavigate();
  const [bulkUploadDialog, setBulkUploadDialog] = useState(false);

  const handleBulkUpload = () => {
    setBulkUploadDialog(true);
  };

  const handleConfirmBulkUpload = () => {
    setBulkUploadDialog(false);
    toast.push(
      <Notification title="Success" type="success">
        All documents submitted successfully
      </Notification>
    );
  };
  const handleConfirmBulkDownload = () => {
    setBulkUploadDialog(false);
    toast.push(
      <Notification title="Success" type="success">
        All Documents downloaded successfully
      </Notification>
    );
  };

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <Button
            icon={<IoArrowBack />}
            variant="plain"
            onClick={() => navigate(-1)}
          >
          </Button>
          <h3 className="mb-4 lg:mb-0">Copy from Previous Month Data</h3>
        </div>
        <div className='flex gap-2'>
          <BulkUploadButton />
        {/* <Button size='sm' variant='solid' icon={<HiDownload />} onClick={handleConfirmBulkDownload}>Download</Button> */}
        <Button size='sm' variant="solid" icon={<CgSoftwareUpload />} onClick={handleBulkUpload}>Proceed with Last Month Data</Button>
        </div>
      </div>
      <div>
        <ReuploadDocumentTable />
      </div>

      <Dialog
        isOpen={bulkUploadDialog}
        onClose={() => setBulkUploadDialog(false)}
      >
        <h5 className="mb-4">Submit Documents</h5>
        <p>Are you sure you want to submit these documents?</p>
        <div className="text-right mt-6">
          <Button
            className="mr-2"
            variant="plain"
            onClick={() => setBulkUploadDialog(false)}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={handleConfirmBulkUpload}>
            Confirm
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default ReuploadDocument;
