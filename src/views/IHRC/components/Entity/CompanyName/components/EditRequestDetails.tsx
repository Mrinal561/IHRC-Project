import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Badge, Dialog, Input, Notification, toast } from '@/components/ui';
import { RiArrowLeftLine } from 'react-icons/ri';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

interface EditRequestDetails {
  request: {
    id: number;
    tracker_id: number;
    tracker_type: string;
    reason_for_request: string;
    reject_reason: string;
    created_at: string;
    is_approved: boolean;
    is_rejected: boolean;
    is_requested: boolean;
    UpdateBy: {
      id: number;
      name: string;
    };
  };
  changes: {
    old_data: Record<string, any>;
    new_data: Record<string, any>;
    changed_fields: string[];
  };
  tracker_details: Record<string, any>;
}

// Define field configurations for each tracker type
const TRACKER_FIELD_CONFIG = {
  pf: {
    fields: [
      'no_of_emp', 'payroll_month', 'epf_wage', 'eps_wage', 'edli_wage',
      'total_challan_amt', 'total_paid_amt', 'difference_amt', 'difference_reason',
      'payment_due_date', 'payment_date', 'delay_in_days', 'delay_reason',
      'challan_type', 'trrn_no', 'crn_no', 'created_at', 'updated_at'
    ]
  },
  esi: {
    fields: [
      'no_of_emp', 'payroll_month', 'gross_wage', 'employee_esi', 'employer_esi',
      'total_esi', 'challan_amt', 'difference_amt', 'difference_reason',
      'payment_due_date', 'payment_date', 'delay_in_days', 'delay_reason',
      'challan_no', 'challan_type', 'created_at', 'updated_at'
    ]
  },
  pfiw: {
    fields: [
      'payroll_month', 'return_due_date', 'submit_date', 'delay_in_days', 
      'delay_reason', 'challan_type', 'created_at', 'updated_at'
    ]
  },
  lwf: {
    fields: [
      'period', 'salary_register_amt', 'total_paid_amt', 'difference_amt',
      'difference_reason', 'payment_due_date', 'payment_date', 'delay_in_days',
      'delay_reason', 'receipt_no', 'challan_type', 'created_at', 'updated_at'
    ]
  },
  ptrc: {
    fields: [
      'no_of_emp', 'payroll_month', 'gross_salary', 'salary_register_amt',
      'total_paid_amt', 'difference_amt', 'difference_reason', 'payment_due_date',
      'payment_date', 'delay_in_days', 'delay_reason', 'challan_type',
      'created_at', 'updated_at'
    ]
  },
  ptec: {
    fields: [
      'period', 'total_challan_amt', 'total_paid_amt', 'difference_amt',
      'difference_reason', 'payment_due_date', 'payment_date', 'delay_in_days',
      'delay_reason', 'receipt_no', 'challan_type', 'created_at', 'updated_at'
    ]
  }
};

// Field labels mapping
const FIELD_LABELS = {
  no_of_emp: 'No of Employees',
  payroll_month: 'Payroll Month',
  epf_wage: 'EPF Wage',
  eps_wage: 'EPS Wage',
  edli_wage: 'EDLI Wage',
  total_challan_amt: 'Total Challan Amount',
  total_paid_amt: 'Total Paid Amount',
  difference_amt: 'Difference Amount',
  difference_reason: 'Difference Reason',
  payment_due_date: 'Payment Due Date',
  payment_date: 'Payment Date',
  delay_in_days: 'Delay In Days',
  delay_reason: 'Delay Reason',
  challan_type: 'Challan Type',
  trrn_no: 'TRRN Number',
  crn_no: 'CRN Number',
  gross_wage: 'Gross Wage',
  employee_esi: 'Employee ESI',
  employer_esi: 'Employer ESI',
  total_esi: 'Total ESI',
  challan_amt: 'Challan Amount',
  challan_no: 'Challan Number',
  return_due_date: 'Return Due Date',
  submit_date: 'Submit Date',
  period: 'Period',
  salary_register_amt: 'Salary Register Amount',
  receipt_no: 'Receipt Number',
  gross_salary: 'Gross Salary',
  created_at: 'Created At',
  updated_at: 'Updated At'
};

const EditPermissionDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [details, setDetails] = useState<EditRequestDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const requestId = location.state?.requestId;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await httpClient.get(
          endpoints.request.requestDetail(requestId)
        );
        setDetails(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching details:', err);
        setError('Failed to load request details');
        setLoading(false);
      }
    };

    fetchDetails();
  }, [requestId]);

  const formatValue = (value: any): string => {
    if (value === null || value === undefined || value === '') return 'N/A';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return String(value);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const capitalize = (str: string): string => {
    if (!str) return 'N/A';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleApprove = async () => {
    try {
      const response = await httpClient.delete(
        endpoints.permission.approveRequest(requestId)
      );
      if (response) {
        toast.push(
          <Notification title="Success" type="success" duration={3000} closable={true}>
            Request has been approved successfully
          </Notification>
        );
        fetchDetails();
      }
    } catch (err) {
      console.error('Error approving request:', err);
      toast.push(
        <Notification title="Failed" type="error" duration={3000} closable={true}>
          Failed to approve request
        </Notification>
      );
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.push(
        <Notification title="Error" type="error" duration={3000} closable={true}>
          Please provide a reject reason
        </Notification>
      );
      return;
    }

    try {
      const response = await httpClient.put(
        endpoints.request.rejectRequest(requestId),
        { reject_reason: rejectReason }
      );
      if (response) {
        toast.push(
          <Notification title="Success" type="success" duration={3000} closable={true}>
            Request has been rejected
          </Notification>
        );
        setRejectDialogOpen(false);
        setRejectReason('');
        fetchDetails();
      }
    } catch (err) {
      console.error('Error rejecting request:', err);
      toast.push(
        <Notification title="Failed" type="error" duration={3000} closable={true}>
          Failed to reject request
        </Notification>
      );
    }
  };

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const response = await httpClient.get(
        endpoints.request.requestDetail(requestId)
      );
      setDetails(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching details:', err);
      setError('Failed to load request details');
      setLoading(false);
    }
  };

  const renderField = (field: string, value: any) => {
    const label = FIELD_LABELS[field] || field.replace(/_/g, ' ');
    
    // Special formatting for certain field types
    let formattedValue = value;
    if (field.includes('date') || field.includes('_at') || field === 'payroll_month' || field === 'period') {
      formattedValue = formatDate(value);
    } else if (field === 'challan_type') {
      formattedValue = capitalize(value);
    } else {
      formattedValue = formatValue(value);
    }

    return (
      <div key={field} className="border-b pb-2">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{formattedValue}</p>
      </div>
    );
  };

  const renderTrackerDetails = () => {
    if (!details) return null;
    
    const trackerType = details.request.tracker_type.toLowerCase();
    const config = TRACKER_FIELD_CONFIG[trackerType] || TRACKER_FIELD_CONFIG.ptrc;
    
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Tracker Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {config.fields.map(field => 
            renderField(field, details.tracker_details[field])
          )}
        </div>
      </div>
    );
  };

  const renderCurrentData = () => {
    if (!details) return null;
    
    const trackerType = details.request.tracker_type.toLowerCase();
    const config = TRACKER_FIELD_CONFIG[trackerType] || TRACKER_FIELD_CONFIG.ptrc;
    
    return (
      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium text-gray-700">Current Data</h4>
          <div className="inline-flex items-center bg-blue-500 text-white px-2 py-1 rounded-md">
            Existing Values
          </div>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {config.fields.map(field => 
              renderField(field, details.changes.old_data[field])
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderRequestedChanges = () => {
    if (!details) return null;
    
    return (
      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium text-gray-700">Requested Changes</h4>
          <div className="inline-flex items-center bg-green-500 text-white px-2 py-1 rounded-md">
            New Values
          </div>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {details.changes.changed_fields.length > 0 ? (
            details.changes.changed_fields.map((field) => (
              <div key={field} className="border-b pb-2 last:border-b-0">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-500 capitalize">
                    {FIELD_LABELS[field] || field.replace(/_/g, ' ')}:
                  </span>
                  <span className="text-sm font-bold text-green-600 break-all">
                    {formatValue(details.changes.new_data[field])}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Current value: {formatValue(details.changes.old_data[field])}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No changes detected
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500 rounded-xl">
        <div className="w-28 h-28">
          <Lottie animationData={loadingAnimation} loop className="w-24 h-24" />
        </div>
        <p className="text-lg font-semibold">Loading Request Details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>{error}</p>
        <Button className="mt-4" onClick={handleBack}>
          Go Back
        </Button>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="p-8 text-center text-gray-600">
        <p>No request details found</p>
        <Button className="mt-4" onClick={handleBack}>
          Go Back
        </Button>
      </div>
    );
  }

  // Safely access nested setup data with fallbacks
  const setupData = details.tracker_details?.setup_data || {};
  const companyName = setupData.Company?.name || 'N/A';
  const stateName = setupData.State?.name || setupData.Location?.District?.State?.name || 'N/A';
  const districtName = setupData.Location?.District?.name || 'N/A';
  const locationName = setupData.Location?.name || 'N/A';

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button
          variant="plain"
          onClick={handleBack}
          icon={<RiArrowLeftLine />}
        />
        <h2 className="text-2xl font-bold">Edit Request Details</h2>
      </div>

      <div className="">
        <div className='bg-white rounded-lg shadow p-6 mb-6'>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 pb-4">
            <div>
              <p className="text-sm text-gray-500">Company Name:</p>
              <p className="font-medium">{companyName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">State:</p>
              <p className="font-medium">{stateName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">District:</p>
              <p className="font-medium">{districtName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location:</p>
              <p className="font-medium">{locationName}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 pb-4">
            <div>
              <p className="text-sm text-gray-500">Tracker Type:</p>
              <div className="inline-flex items-center space-x-2 bg-blue-500 text-white px-2 py-1 rounded-md">
                {details.request.tracker_type.toUpperCase()}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status:</p>
              {details.request.is_rejected ? (
                <div className="inline-flex items-center bg-red-500 text-white px-2 py-1 rounded-md">Rejected</div>
              ) : details.request.is_approved ? (
                <div className="inline-flex items-center bg-green-500 text-white px-2 py-1 rounded-md">Approved</div>
              ) : (
                <div className="inline-flex items-center bg-yellow-500 text-white px-2 py-1 rounded-md">Pending</div>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">Requested By:</p>
              <p className="font-medium">{details.request.UpdateBy?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Request Date:</p>
              <p className="font-medium">
                {details.request.created_at ? new Date(details.request.created_at).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-6 pb-4">
            <div>
              <p className="text-sm text-gray-500">Reason for Request:</p>
              <p className="font-medium">{details.request.reason_for_request || 'N/A'}</p>
            </div>
          </div>
        </div>

        {renderTrackerDetails()}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Changes Requested</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderCurrentData()}
            {renderRequestedChanges()}
          </div>
        </div>
      </div>

      {!details.request.is_approved && !details.request.is_rejected && (
        <div className="flex justify-end gap-4">
          <Button
            variant="solid"
            color="red-600"
            onClick={() => setRejectDialogOpen(true)}
          >
            Reject
          </Button>
          <Button
            variant="solid"
            color="green-600"
            onClick={handleApprove}
          >
            Approve
          </Button>
        </div>
      )}
      <Dialog isOpen={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
        <div >
          <h4 className="text-lg font-semibold">Reject Request</h4>
        </div>
        <div >
          <div className="space-y-4">
            <p>Please provide a reason for rejecting this request:</p>
            <Input
              textArea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reject reason..."
            />
          </div>
        </div>
        <div className='flex justify-end gap-2'>
          <Button variant="plain" onClick={() => setRejectDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="solid" 
            onClick={handleReject}
            disabled={!rejectReason.trim()}
          >
            Confirm
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default EditPermissionDetails;