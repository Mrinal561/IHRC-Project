import React, { useState, useEffect } from 'react';
import { Button, DatePicker, Dialog, Input, Tooltip } from '@/components/ui';
import OutlinedInput from '@/components/ui/OutlinedInput';
import { toast, Notification } from '@/components/ui';
import { useDispatch } from 'react-redux';
import { fetchNoticeById, updateNotice } from '@/store/slices/noticeTracker/noticeTrackerSlice';
import { showErrorNotification } from '@/components/ui/ErrorMessage';
import { Eye } from 'lucide-react';
import NoticeTypeAutosuggest from './NoticeTypeAutosuggest';
import NoticeActAutosuggest from './NoticeActAutosuggest';

interface EditNoticeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  noticeId: number | null;
  onSuccess?: () => void;
}

interface FileData {
  data: string;
  filename: string;
  mimetype: string;
}

const EditNoticeDialog: React.FC<EditNoticeDialogProps> = ({
  isOpen,
  onClose,
  noticeId,
  onSuccess
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const initialFormData = {
    notice_type: '',
    notice_type_id: null,
    notice_date: null,
    reference_number: '',
    related_act: '',
    notice_detail: '',
    related_act_id: null,
    notice_document: null,
  };
  
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const loadNoticeData = async () => {
      if (noticeId) {
        try {
          setIsLoading(true);
          const response = await dispatch(fetchNoticeById(noticeId)).unwrap();
          console.log('api response', response);
          
          // Convert the date string to a Date object if it exists
          const noticeDate = response.notice_date ? new Date(response.notice_date) : null;
          
          const formattedData = {
            notice_type: response.notice_type || '',
            notice_type_id: response.notice_type_id || null,
            notice_date: noticeDate,
            notice_detail: response.notice_detail,
            reference_number: response.reference_number || '',
            related_act: response.related_act || '',
            related_act_id: response.related_act_id || null,
            notice_document: response.notice_document || null,
          };

          setFormData(formattedData);
          
        } catch (error) {
          console.error('Failed to load notice:', error);
          showErrorNotification('Failed to load notice details');
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (isOpen && noticeId) {
      loadNoticeData();
    }
  }, [dispatch, noticeId, isOpen]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/zip',
      'application/x-zip-compressed',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];

    if (!allowedTypes.includes(file.type)) {
      showErrorNotification('Only PDF, ZIP, and image files (JPEG, PNG, GIF) are allowed');
      return;
    }

    // Validate file size (20MB max)
    if (file.size > 20 * 1024 * 1024) {
      showErrorNotification('File size must be less than 20MB');
      return;
    }

    setSelectedFile(file);

    try {
      const base64String = await convertToBase64(file);
      const fileData = {
        data: base64String,
        filename: file.name,
        mimetype: file.type
      };
      setFileData(fileData);
    } catch (error) {
      console.error('Error converting file:', error);
      showErrorNotification('Error processing file');
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Extract base64 data (remove the data URL prefix)
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (!noticeId) return;
  
    try {
      setIsLoading(true);
      
      const noticeData: any = {
        notice_type: formData.notice_type,
        notice_type_id: formData.notice_type_id,
        notice_date: formData.notice_date ? formData.notice_date.toISOString() : null,
        reference_number: formData.reference_number,
        notice_detail: formData.notice_detail,
        related_act: formData.related_act,
        related_act_id: formData.related_act_id,
      };

      // Only include document if a new one was selected
      if (fileData) {
        noticeData.notice_document = fileData;
      }
  
      await dispatch(updateNotice({
        id: noticeId.toString(),
        noticeData: noticeData
      })).unwrap();
      
      toast.push(
        <Notification title="Success" type="success" closable={true}>
          Notice updated successfully
        </Notification>
      );
      onSuccess?.();
      onClose();
    } catch (error) {
     throw error
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentView = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (formData.notice_document) {
      const fullPath = `${import.meta.env.VITE_API_GATEWAY}/${formData.notice_document}`;
      window.open(fullPath, '_blank');
      console.log('full path url ' , fullPath);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      width={800}
      shouldCloseOnOverlayClick={false} 
    >
      <div className="p-6">
        <h5 className="text-lg font-semibold mb-6">Edit Notice Details</h5>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <NoticeTypeAutosuggest
                value={formData.notice_type}
                onChange={(value) => handleChange('notice_type', value)}
                onNoticeTypeSelect={(id) => handleChange('notice_type_id', id)}
                isDisabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notice Received on</label>
              <DatePicker
                clearable
                size="sm"
                placeholder="Select Date"
                value={formData.notice_date}
                onChange={(date) => handleChange('notice_date', date)}
                inputFormat="DD/MM/YYYY"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Letter/ Notice reference number</label>
              <OutlinedInput 
                label="Reference Number"
                value={formData.reference_number}
                onChange={(value) => handleChange('reference_number', value)}
              />
            </div>
            <div className="space-y-2">
              <NoticeActAutosuggest
                value={formData.related_act}
                onChange={(value) => handleChange('related_act', value)}
                onNoticeActSelect={(id) => handleChange('related_act_id', id)}
                isDisabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2 flex gap-2 flex-col">
            <label className="text-sm font-medium">Update Notice Copy (PDF/Zip/Image, Max 20MB)</label>
            <div className='flex gap-2'>
              <Input 
                type="file"
                onChange={handleFileChange}
                className="w-full"
                accept=".pdf,.jpg,.jpeg,.png,.zip"
              />
              {formData.notice_document && (
                 <Tooltip title = "View Document">
                                                                           <Button
                                                                           className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0"
                                                                               onClick={handleDocumentView}
                                                                               >
                                                                               <Eye size={20} />
                                                                           </Button>
                                                                               </Tooltip>
              )}
            </div>
           
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Details of Notice
            </label>
            <textarea
              className="w-full p-2 border rounded-md h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.notice_detail}
              onChange={(e) =>
                handleChange('notice_detail', e.target.value)
              }
              placeholder="Enter notice details..."
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-2">
          <Button 
            variant="plain" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            variant="solid" 
            onClick={handleSubmit}
            loading={isLoading}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default EditNoticeDialog;