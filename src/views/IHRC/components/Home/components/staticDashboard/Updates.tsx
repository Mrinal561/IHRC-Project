// import React from 'react'
// import Timeline from '@/components/ui/Timeline'
// import Avatar from '@/components/ui/Avatar'
// import Badge from '@/components/ui/Badge'
// import Card from '@/components/ui/Card'
// import Tag from '@/components/ui/Tag'
// import { AlertCircle, FileText, Clock, Upload } from 'lucide-react'

// const TimelineAvatar = ({ children, ...rest }) => {
//     return (
//         <Avatar {...rest} size={25} shape="circle">
//             {children}
//         </Avatar>
//     )
// }

// const Updateds = () => {
//     return (
//         <div className="max-w-[700px]">
//             <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
//                     Latest Updates
//                 </h2>
//                 <button className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
//                     View All
//                 </button>
//             </div>
//             <Timeline>
//                 <Timeline.Item
//                 // media={
//                 //     <TimelineAvatar className="bg-blue-500 text-white">
//                 //         <Upload size={14} />
//                 //     </TimelineAvatar>
//                 // }
//                 >
//                     <p className="my-1 flex items-center">
//                     <span className="font-semibold text-gray-900 dark:text-gray-100">
//                             23.02/2025
//                         </span>
//                         <span className="mx-2">-</span>
//                         <span>
//                            Process Flow for Delinking of Erroneously Linked Member ID's from UAN.{' '}
//                         </span>
//                     </p>
//                 </Timeline.Item>
//                 <Timeline.Item
//                 // media={
//                 //     <TimelineAvatar className="bg-blue-500 text-white">
//                 //         <Upload size={14} />
//                 //     </TimelineAvatar>
//                 // }
//                 >
//                     <p className="my-1 flex items-center">
//                         <span className="font-semibold text-gray-900 dark:text-gray-100">
//                             11.12/2024
//                         </span>
//                         <span className="mx-2">-</span>
//                         <span>
//                            Kerla LWF! Online Payment Mode Enabled.{' '}
//                         </span>
//                     </p>
//                 </Timeline.Item>
//                 <Timeline.Item
//                 // media={
//                 //     <TimelineAvatar className="bg-blue-500 text-white">
//                 //         <Upload size={14} />
//                 //     </TimelineAvatar>
//                 // }
//                 >
//                     <p className="my-1 flex items-center">
//                         <span className="font-semibold text-gray-900 dark:text-gray-100">
//                             05.12/2024
//                         </span>
//                         <span className="mx-2">-</span>
//                         <span>
//                         EPFO EXTENSION OF TIME - UAN Activation and Seeding Bank Account with Aadhar for availing the benefits under ELI Scheme.{' '}
//                         </span>
//                     </p>
//                 </Timeline.Item>
//                 <Timeline.Item
//                 // media={
//                 //     <TimelineAvatar className="bg-blue-500 text-white">
//                 //         <Upload size={14} />
//                 //     </TimelineAvatar>
//                 // }
//                 >
//                     <p className="my-1 flex items-center">
//                         <span className="font-semibold text-gray-900 dark:text-gray-100">
//                             18.07/2025
//                         </span>
//                         <span className="mx-2">-</span>
//                         <span>
//                         Haryana LWF! Option of monthly payment available on the online portal. {' '}
//                         </span>
//                     </p>
//                 </Timeline.Item>
//             </Timeline>
//         </div>
//     )
// }

// export default Updateds



import React from 'react';
import Timeline from '@/components/ui/Timeline';
import latestUpdates from './latestUpdates.json';

interface LatestUpdate {
  title: string;
  slug: string;
  date: string;
}

const Updateds = () => {
  // Type assertion if needed
  const updates: LatestUpdate[] = latestUpdates as LatestUpdate[];

  return (
    <div className="max-w-[700px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Latest Updates
        </h2>
        <button className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
          View All
        </button>
      </div>
      <Timeline>
        {updates.map((update, index) => (
          <Timeline.Item key={index}>
            <p className="my-1 flex items-center">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {update.date}
              </span>
              <span className="mx-2">-</span>
              <span>{update.title}</span>
            </p>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
};

export default Updateds;