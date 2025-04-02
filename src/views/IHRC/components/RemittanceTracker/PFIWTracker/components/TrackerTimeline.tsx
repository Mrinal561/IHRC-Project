import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Notification, toast, Timeline } from '@/components/ui';
import { HiArrowLeft } from 'react-icons/hi';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

interface TimelineEvent {
  id: number;
  action: string;
  performed_at: string;
  reason: string | null;
  details: RequestDetails | string | null;
  PerformedBy: {
    id: number;
    name: string;
    email: string;
  },
  tracker_type: string;
}

interface RequestDetails {
    changed_fields: string[];
  }

const TrackerTimeline = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [timelineData, setTimelineData] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { trackerId, trackerType } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!trackerId || !trackerType) {
          throw new Error('Missing tracker information');
        }

        setLoading(true);
        const response = await httpClient.get(
          endpoints.request.trackerTimeline(),
          {
            params: {
              trackerId: trackerId,
              type: trackerType
            }
          }
        );
        
        // Ensure data is properly formatted
        const formattedData = response.data.map((event: any) => ({
          ...event,
          details: event.details
        }));
        
        setTimelineData(formattedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching timeline:', err);
        setError('Failed to load timeline data');
        toast.push(
          <Notification title="Error" type="danger">
            Failed to load timeline data
          </Notification>
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [trackerId, trackerType]);

  if (!trackerId || !trackerType) {
    return (
      <div className="p-4">
        <Button onClick={() => navigate(-1)} icon={<HiArrowLeft />}>
          Back to Tracker
        </Button>
        <div className="mt-4 text-red-500">
          Error: Missing tracker information. Please navigate from the tracker table.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500 rounded-xl">
        <div className="w-28 h-28">
          <Lottie 
            animationData={loadingAnimation} 
            loop 
            className="w-24 h-24"
          />
        </div>
        <p className="text-lg font-semibold">
          Loading Timeline...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Button onClick={() => navigate(-1)} icon={<HiArrowLeft />}>
        </Button>
        <div className="mt-4 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  const formatActionText = (action: string) => {
    switch (action) {
      case 'approve': return 'Approved';
      case 'reject': return 'Rejected';
      case 'request': return 'Requested';
      default: return action;
    }
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    // Format as "M/D/YYYY, h:mm:ss AM/PM" in UTC
    return date.toLocaleString('en-US', {
      timeZone: 'UTC',
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <Button
          onClick={() => navigate(-1)}
          icon={<HiArrowLeft />}
          variant="plain"
          className=""
        />
        <h2 className="text-2xl font-bold">Tracker Timeline</h2>
      </div>

      {timelineData.length > 0 ? (
        <Timeline>
          {timelineData.map((event) => (
    //      <Timeline.Item
    //      key={event.id}
    //      media={
    //        <div className="flex mt-1.5">
    //          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
    //            {event.PerformedBy.name.charAt(0)}
    //          </div>
    //        </div>
    //      }
    //    >
    //      <div className="flex flex-col">
    //        <div className="flex items-center mb-1">
    //          <h4 className="font-semibold">{event.PerformedBy.name}</h4>
    //          <span className="mx-2">•</span>
    //          <span className="text-gray-500 text-sm">
    //            {new Date(event.performed_at).toLocaleString()}
    //          </span>
    //        </div>
           
    //        <div className='flex gap-2 items-center mb-2'>
    //          <div>
    //            <div className="inline-flex items-center space-x-2 bg-blue-500 text-white px-2 py-1 rounded-md capitalize">
    //              {event.tracker_type}
    //            </div>
    //          </div>
    //          <div className="inline-flex items-center rounded-md text-xs capitalize">
    //            <div className={`px-2 py-1 rounded-md ${
    //              event.action === 'approve' 
    //                ? 'bg-green-100 text-green-800' 
    //                : event.action === 'reject' 
    //                ? 'bg-red-100 text-red-800' 
    //                : 'bg-blue-100 text-blue-800'
    //            }`}>
    //              {event.action}
    //            </div>
    //          </div>
    //        </div>
       
    //        {/* Conditional rendering based on action type */}
    //        {['reject', 'approve'].includes(event.action) ? (
    //          <>
    //            {event.reason && (
    //              <p className="text-gray-700 mb-2">
    //                <span className="font-medium">Reason:</span> {event.reason}
    //              </p>
    //            )}
    //            <div className="bg-gray-50 p-3 rounded-md">
    //              <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
    //                <div>
    //                  <span className="font-medium capitalize">Performed By:</span> {event.PerformedBy.name}
    //                </div>
    //                <div>
    //                  <span className="font-medium capitalize">Performed At:</span> {new Date(event.performed_at).toLocaleString()}
    //                </div>
    //                <div className='flex items-center gap-2'>
    //                  <span className="font-medium capitalize">Tracker Type:</span> 
    //                  <span className='capitalize'>{event.tracker_type}</span>
    //                </div>
    //                <div className='flex items-center gap-2'>
    //                  <span className="font-medium capitalize">Action:</span> <span className='capitalize'>{event.action}</span>
    //                </div>
    //                <div className='flex items-center gap-2'>
    //                  <span className="font-medium capitalize">Reason:</span><span className='capitalize'> {event.reason}</span>
    //                </div>
    //                {event.action === 'reject' && event.details && typeof event.details === 'object' && (
    //                  <div className='bg-gray-50 p-3 rounded-md'>
    //                    <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
    //                      <div>
    //                        <span className="font-medium">Rejected By:</span> {event.details.rejected_by}
    //                      </div>
    //                      <div>
    //                        <span className="font-medium">Request ID:</span> {event.details.rejected_request_id}
    //                      </div>
    //                    </div>
    //                  </div>
    //                )}
    //              </div>
    //            </div>
    //          </>
    //        ) : (
    //          // Request action display
    //          <div className="bg-gray-50 p-3 rounded-md">
    //            <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
    //              <div>
    //                <span className="font-medium">Performed By:</span> {event.PerformedBy.name}
    //              </div>
    //              <div>
    //                <span className="font-medium">Performed At:</span> {new Date(event.performed_at).toLocaleString()}
    //              </div>
    //              <div>
    //                <span className="font-medium">Request Reason:</span> {event.reason}
    //              </div>
    //              {event.details?.changed_fields && (
    //         <div>
    //           <span className="font-medium">Changed Fields:</span>
    //           <ul className="list-disc list-inside mt-1">
    //             {event.details.changed_fields.map((field: string, index: number) => (
    //               <li key={index} className="capitalize">{field.replace(/_/g, ' ')}</li>
    //             ))}
    //           </ul>
    //         </div>
    //       )}
    //            </div>
    //          </div>
    //        )}
    //      </div>
    //    </Timeline.Item>

    <Timeline.Item
  key={event.id}
  media={
    <div className="flex mt-1.5">
      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
        {event.PerformedBy.name.charAt(0)}
      </div>
    </div>
  }
>
  <div className="flex flex-col">
    <div className="flex items-center mb-1">
      <h4 className="font-semibold">{event.PerformedBy.name}</h4>
      <span className="mx-2">•</span>
      <span className="text-gray-500 text-sm">
      {formatDateTime(event.performed_at)}

      </span>
    </div>
    
    <div className='flex gap-2 items-center mb-2'>
      <div>
        <div className="inline-flex items-center space-x-2 bg-blue-500 text-white px-2 py-1 rounded-md capitalize">
          {event.tracker_type}
        </div>
      </div>
      <div className="inline-flex items-center rounded-md text-xs capitalize">
        <div className={`px-2 py-1 rounded-md ${
          event.action === 'approve' 
            ? 'bg-green-100 text-green-800' 
            : event.action === 'reject' 
            ? 'bg-red-100 text-red-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
         {formatActionText(event.action)}
        </div>
      </div>
    </div>

    {/* Conditional rendering based on action type */}
    {event.action === 'reject' || event.action === 'approve' ? (
      <div className="bg-gray-50 p-3 rounded-md">
        <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
          <div  className='flex items-center gap-2'>
            <span className="font-medium">Performed By:</span> <span className='capitalize'>
                {event.PerformedBy.name}
                </span> 
          </div>
          <div>
            <span className="font-medium">Performed At:</span> {formatDateTime(event.performed_at)}

          </div>
          <div className='flex items-center gap-2'>
            <span className="font-medium">Tracker Type:</span> <span className='capitalize'>
                {event.tracker_type}
                </span>
          </div>
          <div className='flex items-center gap-2'>
            <span className="font-medium">Status:</span><span className='capitalize'>
            {formatActionText(event.action)}
                </span> 
          </div>
          <div className='flex items-center gap-2'>
            <span className="font-medium">Reason:</span> <span className='capitalize'>
                {event.reason}
                </span>
          </div>
          {event.action === 'reject' && event.details && (
            <>
              {/* <div>
                <span className="font-medium">Rejected By:</span> {event.details.rejected_b}
              </div>
              <div>
                <span className="font-medium">Request ID:</span> {event.details.rejected_request_id}
              </div> */}
            </>
          )}
        </div>
      </div>
    ) : (
      // Request action display
      <div className="bg-gray-50 p-3 rounded-md">
        <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
          <div>
            <span className="font-medium">Performed By:</span> {event.PerformedBy.name}
          </div>
          <div>
            <span className="font-medium">Performed At:</span> {formatDateTime(event.performed_at)}
          </div>
          <div className='flex items-center gap-2'>
            <span className="font-medium">Status:</span><span className='capitalize'>
            {formatActionText(event.action)}
                </span> 
          </div>
          <div>
            <span className="font-medium">Request Reason:</span> {event.reason}
          </div>
          {event.action === 'request' && typeof event.details === 'object' && event.details !== null && 'changed_fields' in event.details && (
  <div>
    <span className="font-medium">Changed Fields:</span>
    <ul className="list-disc list-inside mt-1">
      {event.details.changed_fields.map((field: string, index: number) => (
        <li key={index} className="capitalize">{field.replace(/_/g, ' ')}</li>
      ))}
    </ul>
  </div>
)}
        </div>
      </div>
    )}
  </div>
</Timeline.Item>

          ))}
        </Timeline>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 border rounded-xl">
          <p>No timeline events found for this tracker</p>
        </div>
      )}
    </div>
  );
};

export default TrackerTimeline;