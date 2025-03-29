
import React, { useEffect, useState } from 'react';
import Timeline from '@/components/ui/Timeline';
import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';
import { FileText, AlertCircle, Mail, CheckCircle, File, Edit } from 'lucide-react';
import { Button, Tooltip } from '@/components/ui';
import { IoArrowBack } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import { endpoints } from '@/api/endpoint';
import httpClient from '@/api/http-client';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json';
import EditReplyDialog from './EditReplyDialog';
import EditFollowUpDialog from './EditFollowUpDialog';

interface LocationState {
    noticeId?: number;
    canCreate?: boolean;
    replyId? : number;
}

interface TimelineItem {
    type: 'reply' | 'followup';
    date: string;
    status?: string;
    noticeType?: string;
    details: string;
    document: {
        name: string;
        url: string;
    };
    respondedBy: string;
    referenceNumber?: string;
    relatedAct?: string;
    id?: number; // Add id for editing
}

interface NoticeDetails {
    noticeType: string;
    noticeAct: string;
    referenceNumber: string;
    receivedDate: string;
    noticeDetails: string;
    criticality: string;
    document: {
        name: string;
        url: string;
    };
    status: string;
}

const TimelineAvatar = ({ children, ...rest }) => {
    return (
        <Avatar {...rest} size={25} shape="circle">
            {children}
        </Avatar>
    );
};

const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    
    if (statusLower === 'open') {
        return 'bg-red-500 rounded text-white';
    }
    if (statusLower === 'closed') {
        return 'bg-green-500 rounded text-white';
    }
    return 'bg-amber-500 rounded text-white';
};

const getCriticalityIcon = (type: string) => {
    switch (type?.toLowerCase()) {
        case 'show case notice':
            return <AlertCircle className="w-4 h-4" />;
        case 'compliance':
            return <FileText className="w-4 h-4" />;
        case 'extension letter':
        case 'response letter':
            return <Mail className="w-4 h-4" />;
        case 'closure':
            return <CheckCircle className="w-4 h-4" />;
        default:
            return <FileText className="w-4 h-4" />;
    }
};

const NoticeTimelinePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { noticeId, canCreate, replyId: initialReplyId } = location.state as LocationState || {};
    const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
    const [noticeData, setNoticeData] = useState<NoticeDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [replyId, setReplyId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [editReplyId, setEditReplyId] = useState<number | null>(null);
    const [editFollowUpId, setEditFollowUpId] = useState<number | null>(null);
    const [replyEditDialogOpen, setReplyEditDialogOpen] = useState(false);
    const [followUpEditDialogOpen, setFollowUpEditDialogOpen] = useState(false);
    

    const baseUrl = `${import.meta.env.VITE_API_GATEWAY}`;

    useEffect(() => {
        if (!noticeId) {
            navigate('/notice-tracker', { replace: true });
            return;
        }
    }, [noticeId, navigate]);

    const fetchNoticeDetails = async () => {
        try {
            const response = await httpClient.get(endpoints.noticeTracker.detail(noticeId));
            const noticeData = response.data;            
            
            if (noticeData.replies && noticeData.replies.length > 0) {
                const replyDataId = noticeData.replies[noticeData.replies.length - 1].id;
                setReplyId(replyDataId);
            } else {
                setReplyId(null);
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNoticeDetails();
    }, [replyId]);

    const transformTimelineData = (data: any[]): TimelineItem[] => {
        return data.map((item) => {
            const baseDocumentObj = {
                name: '',
                url: ''
            };

            if (item.type === 'NOTICE_REPLY') {
                const docPath = item.data.reply_documents?.[0] || '';
                return {
                    type: 'reply',
                    date: item.date,
                    status: item.data.status,
                    noticeType: 'response letter',
                    details: item.data.notice_reply,
                    document: {
                        name: docPath.split('/').pop() || '',
                        url: docPath ? `${baseUrl}/${docPath}` : ''
                    },
                    respondedBy: item.user.name,
                    id: item.data.reply_id
                    // Add id for editing
                };
            }

            if (item.type === 'FOLLOW_UP_NOTICE') {
                const docPath = item.data.notice_document || '';
                return {
                    type: 'followup',
                    date: item.date,
                    noticeType: item.data.notice_type,
                    details: item.data.notice_detail,
                    document: {
                        name: docPath.split('/').pop() || '',
                        url: docPath ? `${baseUrl}/${docPath}` : ''
                    },
                    respondedBy: item.user.name,
                    referenceNumber: item.data.reference_number,
                    relatedAct: item.data.related_act,
                    status: item.data.status,
                    id: item.data.follow_up_notice_id
                };
            }

            return null;
        }).filter(Boolean) as TimelineItem[];
    };

    useEffect(() => {
        const fetchTimelineData = async () => {
            try {
                const response = await httpClient.get(endpoints.noticeTracker.timeline(noticeId));
                console.log("Raw API response:", response.data);
                const transformedData = transformTimelineData(response.data);
                
                setTimelineData(transformedData);
                console.log("Timeline data:", timelineData);

                if (response.data.length > 0 && response.data[0].type === 'NOTICE_CREATED') {
                    const notice = response.data[0];                    
                    const docPath = notice.data.notice_document || '';
                    setNoticeData({
                        noticeType: notice.data.notice_type,
                        noticeAct: notice.data.related_act,
                        referenceNumber: notice.data.reference_number,
                        receivedDate: notice.data.notice_date,
                        noticeDetails: notice.data.notice_detail,
                        criticality: notice.data.criticality,
                        document: {
                            name: docPath.split('/').pop() || '',
                            url: docPath ? `${baseUrl}/${docPath}` : ''
                        },
                        status: notice.data.status
                    });
                    if (notice.replies && notice.replies.length > 0) {
                        const latestReply = notice.replies[notice.replies.length - 1];
                        setReplyId(latestReply.id);
                    }
                }
            } catch (error) {
               throw error;
            } finally {
                setLoading(false);
            }
        };

        fetchTimelineData();
    }, [noticeId]);

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

    const refreshTimelineData = async () => {
        try {
            const response = await httpClient.get(endpoints.noticeTracker.timeline(noticeId));
            const transformedData = transformTimelineData(response.data);
            setTimelineData(transformedData);
        } catch (error) {
            console.error("Error refreshing timeline data:", error);
        }
    };

    const handleEditReply = (id) => {
        setEditReplyId(id);
        setReplyEditDialogOpen(true)
    };
    
    const handleEditFollowUp = (id) => {
        setEditFollowUpId(id);
        setFollowUpEditDialogOpen(true)
    };

    const renderTimelineItem = (item: TimelineItem) => {
        const isFollowUp = item.type === 'followup';

        return (
            <div className="my-1">
                <div className="flex items-center mb-2">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {item.respondedBy || "Admin"}
                    </span>
                    <span className="mx-2">
                        {isFollowUp ? "has created a follow-up notice on" : "has replied on"}
                    </span>
                    <span className="text-gray-600">
                        {formatDate(item.date)}
                    </span>
                    {item.status && (
                        <>
                            <span className="mx-2">and has set notice status to</span>
                            <div className={`${getStatusColor(item.status)} px-1`}>
                                {item.status.toUpperCase()}
                            </div>
                        </>
                    )}
                  
                </div>

                <Card className="mt-2">
                    <div className='flex justify-between'>

                    
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Notice Type:</p>
                            <div className="inline-flex items-center space-x-2 bg-blue-500 text-white px-2 py-1 rounded-md">
                                {item.noticeType ? item.noticeType.split(' ')
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                    .join(' ') : ''}
                            </div>
                        </div>
                        {isFollowUp && (
                            <>
                                <div>
                                    <p className="text-sm text-gray-500">Notice Act:</p>
                                    <p className="text-gray-900">{item.relatedAct}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Reference Number:</p>
                                    <p className="text-gray-900">{item.referenceNumber}</p>
                                </div>
                            </>
                        )}
                        <div>
                            <p className="text-sm text-gray-500">
                                {isFollowUp ? "Follow-up Notice Details:" : "Reply Details:"}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                                {formatTextWithLineBreaks(item.details)}
                            </p>
                        </div>
                        {item.document && item.document.name && (
                            <div className="items-center space-x-2 pt-2">
                                <p className="text-sm text-gray-500 mb-2">Document:</p>
                                <div className="inline-flex gap-2 items-center">
                                    <File className="w-4 h-4" />
                                    <a 
                                        href={item.document.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                    >
                                        {item.document.name}
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                    <div>
                        <Tooltip title= {isFollowUp ? 'Edit Follow-up Notice' : 'Edit reply'}>
                            
                        <Button
    variant="plain"
    icon={<Edit className="w-4 h-4" />}
    onClick={() => {
        console.log("Edit button clicked for item:", item);
        isFollowUp ? handleEditFollowUp(item.id) : handleEditReply(item.id);
    }}
    className="ml-auto"
/>
                        </Tooltip>
                    </div>
                    </div>
                </Card>
            </div>
        );
    };

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
            <p className="text-lg font-semibold">Loading Data...</p>
          </div>
        );
      }

    return (
        <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
                <Button
                    size="sm"
                    className="p-2"
                    variant="plain"
                    icon={<IoArrowBack className="text-gray-500 hover:text-gray-700" />}
                    onClick={() => navigate(-1)}
                />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Notice History
                </h1>
            </div>

            {noticeData && (
                <Card className="mb-8 p-4">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notice Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Notice Type:</p>
                                <p className="inline-flex items-center space-x-2 bg-blue-500 text-white px-2 py-1 rounded-md">
                                {noticeData.noticeType}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Notice Act:</p>
                                <p className="text-gray-900 dark:text-gray-100">{noticeData.noticeAct}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Notice Reference Number:</p>
                                <p className="text-gray-900 dark:text-gray-100">{noticeData.referenceNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Notice Date:</p>
                                <p className="text-gray-900 dark:text-gray-100">
                                    {formatDate(noticeData.receivedDate)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Criticality:</p>
                                <p className="text-gray-900 dark:text-gray-100">
                                  {noticeData.criticality.charAt(0).toUpperCase() + noticeData.criticality.slice(1)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Notice Details:</p>
                                <p className="text-gray-600 dark:text-gray-300 preserve-newlines">
                                    {formatTextWithLineBreaks(noticeData.noticeDetails)}
                                </p>
                            </div>
                        </div>
                        {noticeData.document && noticeData.document.name && (
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Notice Copy:</p>
                                <div className="inline-flex gap-2 items-center">
                                    <File className="w-4 h-4" />
                                    <a 
                                        href={noticeData.document.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                    >
                                        {noticeData.document.name}
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            )}

            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Timeline History</h2>
                {timelineData.length > 0 ? (
                    <Timeline>
                        {timelineData.map((item, index) => (
                            <Timeline.Item
                                key={index}
                                media={
                                    <TimelineAvatar className={item.type === 'reply' ? getStatusColor(item.status!) : 'bg-blue-500 rounded text-white'}>
                                        {getCriticalityIcon(item.noticeType)}
                                    </TimelineAvatar>
                                }
                            >
                                {renderTimelineItem(item)}
                            </Timeline.Item>
                        ))}
                    </Timeline>
                ) : (
                    <Card className="p-6">
                        <div className="flex flex-col items-center justify-center text-center">
                            <FileText className="w-12 h-12 text-gray-400 mb-3" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                                No Timeline History
                            </h3>
                            <p className="text-gray-500">
                                This notice hasn't received any replies or follow-ups yet.
                            </p>
                        </div>
                    </Card>
                )}
            </div>

            {noticeData && (
                <div className="flex justify-end mt-6">
                                         {noticeData.status === 'Open' ? (
                                        canCreate ? (
                                            <Button 
                                                variant="solid" 
                                                onClick={() => navigate('/notice-tracker/response', {
                                                    state: { 
                                                        noticeId: noticeId,
                                                        replyId: replyId,
                                                        canCreate: canCreate
                                                    }
                                                })}
                                            >
                                                <span>Add Reply</span>
                                            </Button>
                                        ) : (
                                            <Tooltip title="You don't have permission to create replies">
                                                <div className="opacity-50 cursor-not-allowed">
                                                    <Button 
                                                        variant="solid" 
                                                        disabled
                                                    >
                                                        <span>Add Reply</span>
                                                    </Button>
                                                </div>
                                            </Tooltip>
                                        )
                                    ) : noticeData.status === 'Closed' ? (
                                        canCreate ? (
                                            <Button 
                                                variant="solid" 
                                                onClick={() => navigate('/notice-tracker/followUpNotice', {
                                                    state: { 
                                                        noticeId: noticeId,
                                                        replyId: replyId,
                                                        canCreate: canCreate
                                                    }
                                                })}
                                            >
                                                <span>Add Follow-Up Notice</span>
                                            </Button>
                                        ) : (
                                            <Tooltip title="You don't have permission to create follow-up notice">
                                                <div className="opacity-50 cursor-not-allowed">
                                                    <Button 
                                                        variant="solid" 
                                                        disabled
                                                    >
                                                        <span>Add Follow-Up Notice</span>
                                                    </Button>
                                                </div>
                                            </Tooltip>
                                        )
                                    ) : null}
                                </div>
                            )}
            {editReplyId && (
                <EditReplyDialog
                    replyId={editReplyId}
                    isOpen={replyEditDialogOpen}
                    onClose={() => {
                        setEditReplyId(null);
                        setReplyEditDialogOpen(false);
                        refreshTimelineData();
                    }}
                    
                />
            )}

            {editFollowUpId && (
                <EditFollowUpDialog
                    followUpId={editFollowUpId}
                    isOpen={followUpEditDialogOpen}
                    onClose={() => {
                        setEditFollowUpId(null);
                        setFollowUpEditDialogOpen(false);
                        refreshTimelineData();
                    }}
                />
            )}
        </div>
    );
};

export default NoticeTimelinePage;



// import React, { useEffect, useState } from 'react';
// import Timeline from '@/components/ui/Timeline';
// import Avatar from '@/components/ui/Avatar';
// import Card from '@/components/ui/Card';
// import { FileText, AlertCircle, Mail, CheckCircle, File, Edit } from 'lucide-react';
// import { Button, Tooltip } from '@/components/ui';
// import { IoArrowBack } from 'react-icons/io5';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { endpoints } from '@/api/endpoint';
// import httpClient from '@/api/http-client';
// import Lottie from 'lottie-react';
// import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json';
// import EditReplyDialog from './EditReplyDialog';
// import EditFollowUpDialog from './EditFollowUpDialog';

// interface TimelineItem {
//     type: 'reply' | 'followup';
//     date: string;
//     status?: string;
//     noticeType?: string;
//     details: string;
//     document: {
//         name: string;
//         url: string;
//     };
//     respondedBy: string;
//     referenceNumber?: string;
//     relatedAct?: string;
//     id?: number;
// }

// interface NoticeDetails {
//     noticeType: string;
//     noticeAct: string;
//     referenceNumber: string;
//     receivedDate: string;
//     noticeDetails: string;
//     criticality: string;
//     document: {
//         name: string;
//         url: string;
//     };
//     status: string;
// }

// interface LocationState {
//     noticeId?: number;
//     canCreate?: boolean;
//     replyId?: number;
// }

// const TimelineAvatar = ({ children, ...rest }) => {
//     return (
//         <Avatar {...rest} size={25} shape="circle">
//             {children}
//         </Avatar>
//     );
// };

// const getStatusColor = (status: string) => {
//     const statusLower = status?.toLowerCase() || '';
    
//     if (statusLower === 'open') {
//         return 'bg-red-500 rounded text-white';
//     }
//     if (statusLower === 'closed') {
//         return 'bg-green-500 rounded text-white';
//     }
//     return 'bg-amber-500 rounded text-white';
// };

// const getCriticalityIcon = (type: string) => {
//     switch (type?.toLowerCase()) {
//         case 'show case notice':
//             return <AlertCircle className="w-4 h-4" />;
//         case 'compliance':
//             return <FileText className="w-4 h-4" />;
//         case 'extension letter':
//         case 'response letter':
//             return <Mail className="w-4 h-4" />;
//         case 'closure':
//             return <CheckCircle className="w-4 h-4" />;
//         default:
//             return <FileText className="w-4 h-4" />;
//     }
// };

// const NoticeTimelinePage = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { noticeId, canCreate, replyId: initialReplyId } = location.state as LocationState || {};
//     const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
//     const [noticeData, setNoticeData] = useState<NoticeDetails | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [replyId, setReplyId] = useState<number | null>(initialReplyId || null);
//     const [editReplyId, setEditReplyId] = useState<number | null>(null);
//     const [editFollowUpId, setEditFollowUpId] = useState<number | null>(null);
//     const [replyEditDialogOpen, setReplyEditDialogOpen] = useState(false);
//     const [followUpEditDialogOpen, setFollowUpEditDialogOpen] = useState(false);
    
//     const baseUrl = `${import.meta.env.VITE_API_GATEWAY}`;

//     useEffect(() => {
//         if (!noticeId) {
//             navigate('/notice-tracker', { replace: true });
//             return;
//         }
//     }, [noticeId, navigate]);

//     const fetchNoticeDetails = async () => {
//         try {
//             const response = await httpClient.get(endpoints.noticeTracker.detail(noticeId));
//             const noticeData = response.data;            
            
//             if (noticeData.replies && noticeData.replies.length > 0) {
//                 const replyDataId = noticeData.replies[noticeData.replies.length - 1].id;
//                 setReplyId(replyDataId);
//             } else {
//                 setReplyId(null);
//             }
//         } catch (error) {
//             throw error;
//         }
//     };

//     useEffect(() => {
//         fetchNoticeDetails();
//     }, [noticeId]);

//     const transformTimelineData = (data: any[]): TimelineItem[] => {
//         return data.map((item) => {
//             const baseDocumentObj = {
//                 name: '',
//                 url: ''
//             };

//             if (item.type === 'NOTICE_REPLY') {
//                 const docPath = item.data.reply_documents?.[0] || '';
//                 return {
//                     type: 'reply',
//                     date: item.date,
//                     status: item.data.status,
//                     noticeType: 'response letter',
//                     details: item.data.notice_reply,
//                     document: {
//                         name: docPath.split('/').pop() || '',
//                         url: docPath ? `${baseUrl}/${docPath}` : ''
//                     },
//                     respondedBy: item.user.name,
//                     id: item.data.reply_id
//                 };
//             }

//             if (item.type === 'FOLLOW_UP_NOTICE') {
//                 const docPath = item.data.notice_document || '';
//                 return {
//                     type: 'followup',
//                     date: item.date,
//                     noticeType: item.data.notice_type,
//                     details: item.data.notice_detail,
//                     document: {
//                         name: docPath.split('/').pop() || '',
//                         url: docPath ? `${baseUrl}/${docPath}` : ''
//                     },
//                     respondedBy: item.user.name,
//                     referenceNumber: item.data.reference_number,
//                     relatedAct: item.data.related_act,
//                     status: item.data.status,
//                     id: item.data.follow_up_notice_id
//                 };
//             }

//             return null;
//         }).filter(Boolean) as TimelineItem[];
//     };

//     useEffect(() => {
//         const fetchTimelineData = async () => {
//             try {
//                 setLoading(true);
//                 const response = await httpClient.get(endpoints.noticeTracker.timeline(noticeId));
//                 const transformedData = transformTimelineData(response.data);
                
//                 setTimelineData(transformedData);

//                 if (response.data.length > 0 && response.data[0].type === 'NOTICE_CREATED') {
//                     const notice = response.data[0];                    
//                     const docPath = notice.data.notice_document || '';
//                     setNoticeData({
//                         noticeType: notice.data.notice_type,
//                         noticeAct: notice.data.related_act,
//                         referenceNumber: notice.data.reference_number,
//                         receivedDate: notice.data.notice_date,
//                         noticeDetails: notice.data.notice_detail,
//                         criticality: notice.data.criticality,
//                         document: {
//                             name: docPath.split('/').pop() || '',
//                             url: docPath ? `${baseUrl}/${docPath}` : ''
//                         },
//                         status: notice.data.status
//                     });
                    
//                     if (notice.replies && notice.replies.length > 0) {
//                         const latestReply = notice.replies[notice.replies.length - 1];
//                         setReplyId(latestReply.id);
//                     }
//                 }
//             } catch (error) {
//                throw error;
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (noticeId) {
//             fetchTimelineData();
//         }
//     }, [noticeId]);

//     const formatDate = (dateString: string) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric'
//         });
//     };

//     const formatTextWithLineBreaks = (text: string) => {
//         return text.split('\n').map((line, index) => (
//             <React.Fragment key={index}>
//                 {line}
//                 <br />
//             </React.Fragment>
//         ));
//     };

//     const refreshTimelineData = async () => {
//         try {
//             const response = await httpClient.get(endpoints.noticeTracker.timeline(noticeId));
//             const transformedData = transformTimelineData(response.data);
//             setTimelineData(transformedData);
//         } catch (error) {
//             console.error("Error refreshing timeline data:", error);
//         }
//     };

//     const handleEditReply = (id: number) => {
//         setEditReplyId(id);
//         setReplyEditDialogOpen(true);
//     };
    
//     const handleEditFollowUp = (id: number) => {
//         setEditFollowUpId(id);
//         setFollowUpEditDialogOpen(true);
//     };

//     const renderTimelineItem = (item: TimelineItem) => {
//         const isFollowUp = item.type === 'followup';

//         return (
//             <div className="my-1">
//                 <div className="flex items-center mb-2">
//                     <span className="font-semibold text-gray-900 dark:text-gray-100">
//                         {item.respondedBy || "Admin"}
//                     </span>
//                     <span className="mx-2">
//                         {isFollowUp ? "has created a follow-up notice on" : "has replied on"}
//                     </span>
//                     <span className="text-gray-600">
//                         {formatDate(item.date)}
//                     </span>
//                     {item.status && (
//                         <>
//                             <span className="mx-2">and has set notice status to</span>
//                             <div className={`${getStatusColor(item.status)} px-1`}>
//                                 {item.status.toUpperCase()}
//                             </div>
//                         </>
//                     )}
//                 </div>

//                 <Card className="mt-2">
//                     <div className='flex justify-between'>
//                         <div className="space-y-4">
//                             <div>
//                                 <p className="text-sm text-gray-500">Notice Type:</p>
//                                 <div className="inline-flex items-center space-x-2 bg-blue-500 text-white px-2 py-1 rounded-md">
//                                     {item.noticeType ? item.noticeType.split(' ')
//                                         .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//                                         .join(' ') : ''}
//                                 </div>
//                             </div>
//                             {isFollowUp && (
//                                 <>
//                                     <div>
//                                         <p className="text-sm text-gray-500">Notice Act:</p>
//                                         <p className="text-gray-900">{item.relatedAct}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-500">Reference Number:</p>
//                                         <p className="text-gray-900">{item.referenceNumber}</p>
//                                     </div>
//                                 </>
//                             )}
//                             <div>
//                                 <p className="text-sm text-gray-500">
//                                     {isFollowUp ? "Follow-up Notice Details:" : "Reply Details:"}
//                                 </p>
//                                 <p className="text-gray-600 dark:text-gray-300">
//                                     {formatTextWithLineBreaks(item.details)}
//                                 </p>
//                             </div>
//                             {item.document && item.document.name && (
//                                 <div className="items-center space-x-2 pt-2">
//                                     <p className="text-sm text-gray-500 mb-2">Document:</p>
//                                     <div className="inline-flex gap-2 items-center">
//                                         <File className="w-4 h-4" />
//                                         <a 
//                                             href={item.document.url}
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                             className="hover:underline"
//                                         >
//                                             {item.document.name}
//                                         </a>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                         <div>
//                             <Tooltip title={isFollowUp ? 'Edit Follow-up Notice' : 'Edit reply'}>
//                                 <Button
//                                     variant="plain"
//                                     icon={<Edit className="w-4 h-4" />}
//                                     onClick={() => {
//                                         isFollowUp ? handleEditFollowUp(item.id!) : handleEditReply(item.id!);
//                                     }}
//                                     className="ml-auto"
//                                 />
//                             </Tooltip>
//                         </div>
//                     </div>
//                 </Card>
//             </div>
//         );
//     };

//     if (loading) {
//         return (
//           <div className="flex flex-col items-center justify-center h-96 text-gray-500 rounded-xl">
//             <div className="w-28 h-28">
//               <Lottie 
//                 animationData={loadingAnimation} 
//                 loop 
//                 className="w-24 h-24"
//               />
//             </div>
//             <p className="text-lg font-semibold">Loading Data...</p>
//           </div>
//         );
//     }

//     return (
//         <div className="p-6">
//             <div className="flex items-center gap-2 mb-8">
//                 <Button
//                     size="sm"
//                     className="p-2"
//                     variant="plain"
//                     icon={<IoArrowBack className="text-gray-500 hover:text-gray-700" />}
//                     onClick={() => navigate(-1)}
//                 />
//                 <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
//                     Notice History
//                 </h1>
//             </div>

//             {noticeData && (
//                 <Card className="mb-8 p-4">
//                     <div className="space-y-4">
//                         <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notice Details</h3>
//                         <div className="grid grid-cols-2 gap-4">
//                             <div>
//                                 <p className="text-sm text-gray-500">Notice Type:</p>
//                                 <p className="inline-flex items-center space-x-2 bg-blue-500 text-white px-2 py-1 rounded-md">
//                                 {noticeData.noticeType}</p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-gray-500">Notice Act:</p>
//                                 <p className="text-gray-900 dark:text-gray-100">{noticeData.noticeAct}</p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-gray-500">Notice Reference Number:</p>
//                                 <p className="text-gray-900 dark:text-gray-100">{noticeData.referenceNumber}</p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-gray-500">Notice Date:</p>
//                                 <p className="text-gray-900 dark:text-gray-100">
//                                     {formatDate(noticeData.receivedDate)}
//                                 </p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-gray-500">Criticality:</p>
//                                 <p className="text-gray-900 dark:text-gray-100">
//                                   {noticeData.criticality.charAt(0).toUpperCase() + noticeData.criticality.slice(1)}
//                                 </p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-gray-500">Notice Details:</p>
//                                 <p className="text-gray-600 dark:text-gray-300 preserve-newlines">
//                                     {formatTextWithLineBreaks(noticeData.noticeDetails)}
//                                 </p>
//                             </div>
//                         </div>
//                         {noticeData.document && noticeData.document.name && (
//                             <div>
//                                 <p className="text-sm text-gray-500 mb-2">Notice Copy:</p>
//                                 <div className="inline-flex gap-2 items-center">
//                                     <File className="w-4 h-4" />
//                                     <a 
//                                         href={noticeData.document.url}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className="hover:underline"
//                                     >
//                                         {noticeData.document.name}
//                                     </a>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </Card>
//             )}

//             <div className="mb-6">
//                 <h2 className="text-lg font-semibold mb-4">Timeline History</h2>
//                 {timelineData.length > 0 ? (
//                     <Timeline>
//                         {timelineData.map((item, index) => (
//                             <Timeline.Item
//                                 key={index}
//                                 media={
//                                     <TimelineAvatar className={item.type === 'reply' ? getStatusColor(item.status!) : 'bg-blue-500 rounded text-white'}>
//                                         {getCriticalityIcon(item.noticeType || '')}
//                                     </TimelineAvatar>
//                                 }
//                             >
//                                 {renderTimelineItem(item)}
//                             </Timeline.Item>
//                         ))}
//                     </Timeline>
//                 ) : (
//                     <Card className="p-6">
//                         <div className="flex flex-col items-center justify-center text-center">
//                             <FileText className="w-12 h-12 text-gray-400 mb-3" />
//                             <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
//                                 No Timeline History
//                             </h3>
//                             <p className="text-gray-500">
//                                 This notice hasn't received any replies or follow-ups yet.
//                             </p>
//                         </div>
//                     </Card>
//                 )}
//             </div>

//             {/* Conditionally render buttons based on canCreate permission */}
//             {noticeData && (
//                 <div className="flex justify-end mt-6">
//                     {noticeData.status === 'Open' ? (
//                         canCreate ? (
//                             <Button 
//                                 variant="solid" 
//                                 onClick={() => navigate('/notice-tracker/response', {
//                                     state: { 
//                                         noticeId: noticeId,
//                                         replyId: replyId,
//                                         canCreate: canCreate
//                                     }
//                                 })}
//                             >
//                                 <span>Add Reply</span>
//                             </Button>
//                         ) : (
//                             <Tooltip title="You don't have permission to create replies">
//                                 <div className="opacity-50 cursor-not-allowed">
//                                     <Button 
//                                         variant="solid" 
//                                         disabled
//                                     >
//                                         <span>Add Reply</span>
//                                     </Button>
//                                 </div>
//                             </Tooltip>
//                         )
//                     ) : noticeData.status === 'Closed' ? (
//                         canCreate ? (
//                             <Button 
//                                 variant="solid" 
//                                 onClick={() => navigate('/notice-tracker/followUpNotice', {
//                                     state: { 
//                                         noticeId: noticeId,
//                                         replyId: replyId,
//                                         canCreate: canCreate
//                                     }
//                                 })}
//                             >
//                                 <span>Add Follow-Up Notice</span>
//                             </Button>
//                         ) : (
//                             <Tooltip title="You don't have permission to create follow-ups">
//                                 <div className="opacity-50 cursor-not-allowed">
//                                     <Button 
//                                         variant="solid" 
//                                         disabled
//                                     >
//                                         <span>Add Follow-Up Notice</span>
//                                     </Button>
//                                 </div>
//                             </Tooltip>
//                         )
//                     ) : null}
//                 </div>
//             )}

//             {editReplyId && (
//                 <EditReplyDialog
//                     replyId={editReplyId}
//                     isOpen={replyEditDialogOpen}
//                     onClose={() => {
//                         setEditReplyId(null);
//                         setReplyEditDialogOpen(false);
//                         refreshTimelineData();
//                     }}
//                 />
//             )}

//             {editFollowUpId && (
//                 <EditFollowUpDialog
//                     followUpId={editFollowUpId}
//                     isOpen={followUpEditDialogOpen}
//                     onClose={() => {
//                         setEditFollowUpId(null);
//                         setFollowUpEditDialogOpen(false);
//                         refreshTimelineData();
//                     }}
//                 />
//             )}
//         </div>
//     );
// };

// export default NoticeTimelinePage;