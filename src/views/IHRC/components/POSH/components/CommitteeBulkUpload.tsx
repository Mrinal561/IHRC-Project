import React, { useState } from 'react';
import { Button, Dialog, Input, Notification } from '@/components/ui';
import { HiDownload, HiUpload } from 'react-icons/hi';
import OutlinedInput from '@/components/ui/OutlinedInput';

const CommitteeBulkUpload = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = () => {
        if (!file) {
          
            return;
        }
      
        setIsDialogOpen(false);
    };

    const downloadTemplate = (format: string) => {
       
    };

    return (
        <>
            <Button
                variant="solid"
                size="sm"
                icon={<HiUpload />}
                onClick={() => setIsDialogOpen(true)}
            >
                Bulk Upload
            </Button>

            <Dialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                width={500}
            >
                <h5 className="mb-4">Bulk Upload Committees</h5>
                
                <div className="my-4 flex gap-2 items-center">
                    <p>Download Template:</p>
                    <div className="flex gap-2">
                       
                        <Button
                            size="xs"
                            icon={<HiDownload />}
                            onClick={() => downloadTemplate('Word')}
                        >
                            Download
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                    <p>Upload Committees File:</p>
                    <Input
                        type="file"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        accept=".xlsx,.xls,.csv"
                    />
                </div>

                <div>
                    <p>Enter Remark</p>
                    <OutlinedInput textarea label={'Enter Remark'} value={''} onChange={function (value: string): void {
                        throw new Error('Function not implemented.');
                    } } />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Button
                        variant="plain"
                        onClick={() => setIsDialogOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        onClick={handleUpload}
                        disabled={!file}
                    >
                        Confirm
                    </Button>
                </div>
            </Dialog>
        </>
    );
};

export default CommitteeBulkUpload;