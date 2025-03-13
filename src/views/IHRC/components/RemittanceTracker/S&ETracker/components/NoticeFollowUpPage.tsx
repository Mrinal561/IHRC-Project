




import React, { useState, useEffect } from 'react';
import { Button, DatePicker, Input, Card, Spinner } from '@/components/ui';
import OutlinedInput from '@/components/ui/OutlinedInput';
import { toast, Notification } from '@/components/ui';
import { IoArrowBack } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import * as Yup from 'yup';
import NoticeTypeAutosuggest from './NoticeTypeAutosuggest';
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json';
import Lottie from 'lottie-react';

// Validation Schema
const validationSchema = Yup.object().shape({
  notice_type: Yup.string()
    .required('Notice type is required')
    .trim(),
  notice_date: Yup.date()
    .required('Received date is required')
    .max(new Date(), 'Future dates are not allowed')
    .nullable(),
  reference_number: Yup.string()
    .required('Reference number is required')
    .trim(),
  notice_detail: Yup.string()
    .required('Notice details are required')
    .trim(),
  notice_document: Yup.string()
    .required('Notice document is required'),
});

interface FormErrors {
  [key: string]: string;
}

const NoticeFollowUpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { noticeId, replyId } = location.state || {}; // Get noticeId and replyId from state
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [notice, setNotice] = useState<any>(null); // State to store notice details

  const [form, setForm] = useState({
    notice_type: '', // User input
    notice_date: null, // User input
    reference_number: '', // User input
    notice_detail: '', // User input
    notice_document: null, // User input
    // Fields fetched from notice details API
    group_id: null,
    company_id: null,
    district_id: null,
    location: '',
    criticality: 'high',
    related_act: '',
  });

  // Fetch notice details using noticeId
  useEffect(() => {
    const fetchNoticeDetails = async () => {
      try {
        const response = await httpClient.get(endpoints.noticeTracker.detail(noticeId));
        const noticeData = response.data;

        // Set the fields that will be used in the API request
        setForm(prev => ({
          ...prev,
          group_id: noticeData.group_id,
          company_id: noticeData.company_id,
          district_id: noticeData.Location.District.id,
          location: noticeData.Location.id,
          criticality: noticeData.criticality,
          related_act: noticeData.related_act,
        }));

        // Set notice details for display
        setNotice(noticeData);        

        console.log('testing data', noticeData);
      } catch (error) {
        console.error('Failed to fetch notice details:', error);
        toast.push(
          <Notification title="Error" closable={true} type="error">
            Failed to fetch notice details
          </Notification>
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (noticeId) {
      fetchNoticeDetails();
    }
  }, [noticeId]);

  // Handle form field changes
  const handleChange = (field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));
    setErrors(prev => ({
      ...prev,
      [field]: '',
    }));
  };

  // Handle file upload
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
        handleChange('notice_document', base64String);
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

  // Convert file to base64
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

  // Validate form
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
      }
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    try {
      setIsLoading(true);

      // Prepare the payload for the follow-up notice API
      const payload = {
        notice_type: form.notice_type,
        notice_date: form.notice_date,
        reference_number: form.reference_number,
        notice_detail: form.notice_detail,
        notice_document: form.notice_document,
        // Fields fetched from notice details API
        group_id: form.group_id,
        company_id: form.company_id,
        district_id: form.district_id,
        location: String(form.location),
        criticality: form.criticality,
        related_act: form.related_act,
      };

      // Call the follow-up notice API
      const response = await httpClient.post(endpoints.noticeTracker.followupNoticeCreate(noticeId), payload);

      if (response.data) {
        toast.push(
          <Notification title="Success" type="success" closable={true}>
            Follow-up notice created successfully
          </Notification>
        );
        navigate(-1); // Navigate back after success
      }
    } catch (error) {
      console.error('Failed to create follow-up notice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show field error messages
  const showFieldError = (fieldName: string) => {
    return errors[fieldName] ? (
      <span className="text-red-500 text-sm mt-1">{errors[fieldName]}</span>
    ) : null;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

  // Format text with line breaks
  const formatTextWithLineBreaks = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

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
          Notice
        </h1>
      </div>

      {/* Notice Details Section */}
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

          </div>
        </Card>
      )}

      {/* Add Notice Form */}
      <div className="mb-8 p-6 border rounded-lg bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Add Notice</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <NoticeTypeAutosuggest
                value={form.notice_type}
                onChange={(value) => handleChange('notice_type', value)}
                onNoticeTypeSelect={(id) => {
                  setForm((prev) => ({
                    ...prev,
                    notice_type_id: id,
                  }));
                }}
                isDisabled={isLoading}
              />
              {showFieldError('notice_type')}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Notice Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                clearable
                size="sm"
                placeholder="Select Date"
                value={form.notice_date}
                onChange={(date) => handleChange('notice_date', date)}
                inputFormat="DD/MM/YYYY"
                maxDate={new Date()}
              />
              {showFieldError('notice_date')}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Reference Number <span className="text-red-500">*</span>
              </label>
              <OutlinedInput
                label="Enter Reference Number"
                value={form.reference_number}
                onChange={(value) => handleChange('reference_number', value)}
              />
              {showFieldError('reference_number')}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Notice Copy (PDF/Zip/Image, Max 20MB) <span className="text-red-500">*</span>
              </label>
              <Input
                type="file"
                onChange={handleFileChange}
                className="w-full"
                accept=".pdf,.jpg,.jpeg,.png,.zip"
              />
              {showFieldError('notice_document')}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Details Of The Notice <span className="text-red-500">*</span>
            </label>
            <OutlinedInput
              label="Details of the Notice"
              value={form.notice_detail}
              onChange={(value) => handleChange('notice_detail', value)}
              textarea={true}
            />
            {showFieldError('notice_detail')}
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

export default NoticeFollowUpPage;