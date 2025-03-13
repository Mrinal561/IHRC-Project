

import React, { useState, useEffect } from 'react';
import { Button, DatePicker, Input, Card, Spinner } from '@/components/ui'; // Import Spinner
import OutlinedInput from '@/components/ui/OutlinedInput';
import { toast, Notification } from '@/components/ui';
import { IoArrowBack } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import StatusAutoSuggest from './StatusAutoSuggest';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import NoticeTypeAutosuggest from './NoticeTypeAutosuggest';
import * as Yup from 'yup';
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json';
import Lottie from 'lottie-react';


// Validation Schema
const validationSchema = Yup.object().shape({
  notice_reply: Yup.string()
    .required('Reply details are required')
    .trim(),
  notice_sent_at: Yup.date()
    .required('Reply date is required')
    .max(new Date(), 'Future dates are not allowed')
    .nullable(),
  reply_document: Yup.string()
    .required('Notice document is required'),
});

interface FormErrors {
  [key: string]: string;
}

const NoticeResponsePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const noticeId = location.state?.noticeId;
  const [notice, setNotice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [errors, setErrors] = useState<FormErrors>({});

  const [form, setForm] = useState({
    notice_reply: '',
    notice_sent_at: null,
    reply_document: null,
    status: 'closed',
  });

  useEffect(() => {
    if (!noticeId) {
      navigate('/notice-tracker', { replace: true });
      return;
    }
  }, [noticeId, navigate]);

  useEffect(() => {
    const fetchNoticeDetails = async () => {
      try {
        const response = await httpClient.get(
          endpoints.noticeTracker.detail(noticeId)
        );
        setNotice(response.data);
      } catch (error) {
        console.error('Failed to fetch notice details:', error);
        toast.push(
          <Notification title="Error" closable={true} type="error">
            Failed to fetch notice details
          </Notification>
        );
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    if (noticeId) {
      fetchNoticeDetails();
    }
  }, [noticeId]);

  const handleChange = (field: string, value: any) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
    // Clear error when field is changed
    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) { // 20MB limit
        toast.push(
          <Notification title="Error" closable={true} type="error">
            File size should not exceed 20MB
          </Notification>
        );
        return;
      }
      try {
        const base64String = await convertToBase64(file);
        handleChange('reply_document', base64String);
      } catch (error) {
        console.error('Error converting file:', error);
        toast.push(
          <Notification title="Error" closable={true} type="error">
            Error processing file
          </Notification>
        );
      }
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && typeof reader.result === 'string') {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        } else {
          reject(new Error('Failed to read file as base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const validateForm = async () => {
    try {
      await validationSchema.validate(form, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const newErrors: FormErrors = {};
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        console.error('Validation error:', error);
       
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    try {
      setIsLoading(true);
      const response = await httpClient.post(endpoints.noticeTracker.noticeReply(noticeId), {
        notice_sent_at: form.notice_sent_at,
        notice_reply: form.notice_reply,
        status: form.status,
        reply_documents: form.reply_document ? [form.reply_document] : []
      });

      if (response.data) {
        toast.push(
          <Notification title="Success" type="success" closable={true}>
            Reply submitted successfully
          </Notification>
        );
        navigate(-1);
      }
    } catch (error) {
      console.error('Failed to submit reply:', error);
      // toast.push(
      //   <Notification title="Error" type="error">
      //     Failed to submit reply
      //   </Notification>
      // );
    } finally {
      setIsLoading(false);
    }
  };

  const showFieldError = (fieldName: string) => {
    return errors[fieldName] ? (
      <span className="text-red-500 text-sm mt-1">{errors[fieldName]}</span>
    ) : null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

  const formatTextWithLineBreaks = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  // Show a loading spinner while fetching data
  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <Spinner size="lg" />
  //     </div>
  //   );
  // }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500 rounded-xl">
        <div className="w-28 h-28">
          <Lottie 
            animationData={loadingAnimation} 
            loop 
            className="w-24 h-24"
          />
        </div>
        <p className="text-lg font-semibold">Loading Data...</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="flex items-center gap-2 mb-8">
        <Button
          size="sm"
          className="p-2"
          variant="plain"
          icon={<IoArrowBack className="text-gray-500 hover:text-gray-700" />}
          onClick={() => navigate(-1)}
        />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Reply
        </h1>
      </div>

      {notice && Object.keys(notice).length > 0 && (
        <Card className="mb-8 p-4">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notice Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Notice Type:</p>
                <p className="inline-flex items-center space-x-2 bg-blue-500 text-white px-2 py-1 rounded-md">{notice.notice_type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Notice Act:</p>
                <p className="text-gray-900 dark:text-gray-100">{notice.related_act}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Notice Reference Number:</p>
                <p className="text-gray-900 dark:text-gray-100">{notice.reference_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Notice Received on:</p>
                <p className="text-gray-900 dark:text-gray-100">
                  {formatDate(notice.notice_date)}
                </p>
              </div>
              <div>
              <p className="text-sm text-gray-500">Criticality</p>
              <p className="text-gray-900 dark:text-gray-100">{notice.criticality.charAt(0).toUpperCase() + notice.criticality.slice(1)}</p>
              </div>
            <div>
              <p className="text-sm text-gray-500">Notice Details:</p>
              <p className="text-gray-600 dark:text-gray-300 preserve-newlines">
                {notice.notice_detail ? formatTextWithLineBreaks(notice.notice_detail) : 'N/A'}
              </p>
            </div>
            </div>

            {/* {notice.notice_document && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Notice Copy:</p>
                <div className="inline-flex gap-2 items-center">
                  <File className="w-4 h-4" />
                  <a href={notice.notice_document.url} target="_blank" className="hover:underline">
                    {notice.notice_document.name}
                  </a>
                </div>
              </div>
            )} */}
          </div>
        </Card>
      )}

      <div className="mb-8 p-6 border rounded-lg bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Add Reply</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Reply Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                clearable
                size="sm"
                placeholder="Select Date"
                value={form.notice_sent_at}
                onChange={(date) => handleChange('notice_sent_at', date)}
                inputFormat="DD/MM/YYYY"
                maxDate={new Date()}
              />
              {showFieldError('notice_sent_at')}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Reply Copy (PDF/Zip/Image, Max 20MB) <span className="text-red-500">*</span>
              </label>
              <Input
                type="file"
                onChange={handleFileChange}
                className="w-full"
                accept=".pdf,.jpg,.jpeg,.png,.zip"
              />
              {showFieldError('reply_document')}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Details Of The Reply <span className="text-red-500">*</span>
            </label>
            <OutlinedInput
              label="Details of the Reply"
              value={form.notice_reply}
              onChange={(value) => handleChange('notice_reply', value)}
              textarea={true}
              // error={!!errors.notice_reply}
            />
            {showFieldError('notice_reply')}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="plain" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button 
          variant="solid" 
          onClick={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default NoticeResponsePage;