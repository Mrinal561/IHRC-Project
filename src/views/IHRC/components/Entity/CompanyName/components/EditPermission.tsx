// import React, { useState, useMemo, useEffect } from 'react';
// import { ColumnDef, OnSortParam } from '@/components/shared/DataTable';
// import DataTable from '@/components/shared/DataTable';
// import { Button, Tooltip, Badge, Dialog, toast, Notification, Checkbox, Input } from '@/components/ui';
// import { RiCheckLine, RiCloseLine, RiEyeLine } from 'react-icons/ri';
// import { HiOutlineViewGrid } from 'react-icons/hi';
// import Lottie from 'lottie-react';
// import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json';
// import OutlinedSelect from '@/components/ui/Outlined';
// import httpClient from '@/api/http-client';
// import { endpoints } from '@/api/endpoint';
 
// // Updated interface to match API response
// interface PermissionData {
//   id: number;
//   tracker_id: number;
//   update_by: number;
//   tracker_type: string;
//   reason_for_request: string;
//   is_requested: boolean;
//   count: number;
//   created_at: string;
//   last_updated_at: string;
//   UpdateBy: {
//     id: number;
//     name: string;
//     Company: null | any;
//     company_id: null | number;
//     CompanyGroup: null | any;
//     group_id: null | number;
//   };
// }
 
// const EditPermission = () => {
//   const filterOptions = [
//     { label: 'PF Tracker', value: 'pf' },
//     { label: 'PFIW Tracker', value: 'pfiw' },
//     { label: 'ESI Tracker', value: 'esi' },
//     { label: 'LWF Tracker', value: 'lwf' },
//     { label: 'PTRC Tracker', value: 'ptrc' },
//     { label: 'PTEC Tracker', value: 'ptec' }
//   ];
   
//   const [filter, setFilter] = useState('');
//   const [selectedItems, setSelectedItems] = useState(new Set());
//   const [isAllSelected, setIsAllSelected] = useState(false);
//   const [data, setData] = useState<PermissionData[]>([]);
//   const [filteredData, setFilteredData] = useState<PermissionData[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedRequest, setSelectedRequest] = useState<PermissionData | null>(null);
// const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
// const [requestToReject, setRequestToReject] = useState<number | null>(null);
// const [rejectReason, setRejectReason] = useState('');
 
//   const [tableData, setTableData] = useState({
//     total: 0,
//     pageIndex: 1,
//     pageSize: 10,
//     query: '',
//     sort: { order: '', key: '' },
//   });
 
//   // Fetch data from API

//   const fetchData = async () => {
//     try {
//       setIsLoading(true);
//       const response = await httpClient.get(endpoints.request.getAll());
      
//       console.log(response.data.data)
//       // Assuming the API returns an array of permission data
//       const fetchedData: PermissionData[] = response.data.data;

//       setData(fetchedData);
//       setTableData(prev => ({ ...prev, total: fetchedData.length }));
//       setIsLoading(false);
//     } catch (err) {
//       console.error('Error fetching permission data:', err);
//       setError('Failed to load permission data');
//       setIsLoading(false);
//     }
//   };


//   useEffect(() => {
//     fetchData();
//   }, []);
 
//   // Filter effect
//   // useEffect(() => {
//   //   if (filter) {
//   //     const filtered = data.filter((item) =>
//   //       item.tracker_type.toLowerCase() === filter.toLowerCase()
//   //     );
//   //     setFilteredData(filtered);
//   //     setTableData((prev) => ({ ...prev, total: filtered.length }));
//   //   } else {
//   //     setFilteredData(data);
//   //     setTableData((prev) => ({ ...prev, total: data.length }));
//   //   }
//   // }, [data, filter]);
 
//   // Select all and individual select logic
//   const handleSelectAllChange = () => {
//     if (isAllSelected) {
//       setSelectedItems(new Set());
//     } else {
//       const allIds = (filter ? filteredData : data).map(item => item.id);
//       setSelectedItems(new Set(allIds));
//     }
//     setIsAllSelected(!isAllSelected);
//   };
 
//   const handleCheckboxChange = (id: number) => {
//     const newSelectedItems = new Set(selectedItems);
//     if (selectedItems.has(id)) {
//       newSelectedItems.delete(id);
//       setIsAllSelected(false);
//     } else {
//       newSelectedItems.add(id);
//       if (newSelectedItems.size === (filter ? filteredData : data).length) {
//         setIsAllSelected(true);
//       }
//     }
//     setSelectedItems(newSelectedItems);
//   };
 
//   const columns: ColumnDef<PermissionData>[] = useMemo(
//     () => [
      
//       {
//         header: 'Requested By',
//         enableSorting: false,
//         accessorKey: 'UpdateBy',
//         cell: (props) => {
//           const updateBy = props.getValue() as PermissionData['UpdateBy'];
//           return (
//             <Tooltip title={updateBy.name}>
//               <div className="w-36 truncate">{updateBy.name}</div>
//             </Tooltip>
//           );
//         },
//       },
//       {
//         header: 'Reason For Request',
//         enableSorting: false,
//         accessorKey: 'reason_for_request',
//         cell: (props) => {
//           const reason = props.getValue() as string;
//           return (
//             <Tooltip title={reason}>
//               <div className="w-52 truncate">{reason}</div>
//             </Tooltip>
//           );
//         },
//       },
//       {
//         header: 'Tracker Type',
//         enableSorting: false,
//         accessorKey: 'tracker_type',
//         cell: (props) => {
//           const type = props.getValue() as string;
//           return (
//             <Badge
//               className="text-xs bg-sky-600"
//               content={type.toUpperCase()}
//             />
//           );
//         },
//       },
//       {
//         header: 'Created At',
//         enableSorting: false,
//         accessorKey: 'created_at',
//         cell: (props) => {
//           const date = new Date(props.getValue() as string);
//           return (
//             <Tooltip title={date.toLocaleString()}>
//               <div className="w-52 truncate">
//                 {date.toLocaleDateString()} {date.toLocaleTimeString()}
//               </div>
//             </Tooltip>
//           );
//         },
//       },
//       {
//         header: 'Action',
//         id: 'actions',
//         cell: ({ row }) => (
//           <div className="flex gap-2">
//             <Tooltip title="View Details">
//               <Button
//                 size="sm"
//                 onClick={() => setSelectedRequest(row.original)}
//                 icon={<RiEyeLine />}
//               />
//             </Tooltip>
//             <Tooltip title="Approve">
//               <Button
//                 size="sm"
//                 variant="solid"
//                 color="green-600"
//                 onClick={() => handleApprove(row.original.id)}
//                 icon={<RiCheckLine />}
//               />
//             </Tooltip>
//             <Tooltip title="Reject">
//               <Button
//                 size="sm"
//                 variant="solid"
//                 color="red-600"
//                 onClick={() => {
//                   setRequestToReject(row.original.id);
//                   setRejectDialogOpen(true);
//                 }}
//                 icon={<RiCloseLine />}
//               />
//             </Tooltip>
//           </div>
//         ),
//       },
//     ],
//     []
//   );

//   const handleReject = async () => {
//     if (!requestToReject || !rejectReason) {
//       toast.push(
//         <Notification title="Error" type="error" duration={3000} closable={true}>
//           Please provide a reject reason
//         </Notification>
//       );
//       return;
//     }
  
//     try {
//       const response = await httpClient.put(
//         endpoints.request.rejectRequest(requestToReject),
//         { reject_reason: rejectReason }
//       );
      
//       if (response) {
//         fetchData();
//         toast.push(
//           <Notification title="Success" type="success" duration={3000} closable={true}>
//             Request has been rejected
//           </Notification>
//         );
//         setRejectDialogOpen(false);
//         setRejectReason('');
//       }
//     } catch (err) {
//       console.error('Error rejecting request:', err);
//       toast.push(
//         <Notification title="Failed" type="error" duration={3000} closable={true}>
//           Failed to reject request
//         </Notification>
//       );
//     }
//   };
 
//   const handleFilterChange = (value: string) => {
//     setFilter(value);
//   };
 
//   const handleApprove = (id: number) => {
//     const approvePermission = async () => {
//       try {
//         const response = await httpClient.delete(endpoints.permission.approveRequest(id));
//         if (response) {
//          fetchData();
//           toast.push(
//             <Notification title="Success" type="success" duration={3000} closable={true}>
//             Permission has been given successfully
//         </Notification>,
//           );
//           // Optionally, refresh the data or update the local state
//           // fetchData(); // if you want to refresh the entire data
//           // or update the local state if you have a way to do so
//         } else {
//           toast.push(
//             <Notification title="Failed" type="error" duration={3000} closable={true}>
//             Failed to approve permission request
//         </Notification>,
//           );
//         }
//       } catch (err) {
//         console.error('Error approving permission:', err);
//         toast.push(
//             <Notification title="Failed" type="error" duration={3000} closable={true}>
//             Failed to approve permission request
//         </Notification>,
//         )
//       }
//     };
  
//     approvePermission();
//   };
 
//   const onPaginationChange = (page: number) => {
//     setTableData((prev) => ({ ...prev, pageIndex: page }));
//   };
 
//   const onSelectChange = (value: number) => {
//     setTableData((prev) => ({ ...prev, pageSize: Number(value), pageIndex: 1 }));
//   };
 
//   const onSort = (sort: OnSortParam) => {
//     setTableData((prev) => ({ ...prev, sort }));
//   };
 
//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-96 text-gray-500 rounded-xl">
//         <div className="w-28 h-28">
//           <Lottie animationData={loadingAnimation} loop className="w-24 h-24" />
//         </div>
//         <p className="text-lg font-semibold">Loading Data...</p>
//       </div>
//     );
//   }
 
//   // Error state
//   // if (error) {
//   //   return (
//   //     <div className="p-8 text-center text-red-600">
//   //       <p>{error}</p>
//   //       <Button onClick={() => window.location.reload()}>Retry</Button>
//   //     </div>
//   //   );
//   // }

//   return (
//     <div className="">
//       <div className="flex justify-between items-center mb-12">
//       <h3 className="text-2xl font-bold">Remittance Tracker Edit Permission</h3>
//         <div className="flex items-center gap-4">
//           <div className="w-52 z-10-">
//             {/* <OutlinedSelect
//               label="Filter"
//               options={filterOptions}
//               value={filter}
//               onChange={handleFilterChange}
//             /> */}
//           </div>
//         </div>
//       </div>
      
//       {data.length === 0 ? (
//   <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
//     <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
//     <p className="text-center">No Data Available</p>
//   </div>
// ) : (
//   <DataTable
//     columns={columns}
//     data={data}
//     skeletonAvatarColumns={[0]}
//     skeletonAvatarProps={{ className: 'rounded-md' }}
//     loading={isLoading}
//     pagingData={{
//       total: tableData.total,
//       pageIndex: tableData.pageIndex,
//       pageSize: tableData.pageSize,
//     }}
//     onPaginationChange={onPaginationChange}
//     onSelectChange={onSelectChange}
//     onSort={onSort}
//     stickyHeader={true}
//     stickyFirstColumn={true}
//     stickyLastColumn={true}
//   />
// )}
//     </div>
//   );
// };
 
// export default EditPermission;






import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef, OnSortParam } from '@/components/shared/DataTable';
import DataTable from '@/components/shared/DataTable';
import { Button, Tooltip, Badge, Dialog, toast, Notification, Checkbox, Input } from '@/components/ui';
import { RiCheckLine, RiCloseLine, RiEyeLine } from 'react-icons/ri';
import { HiOutlineViewGrid } from 'react-icons/hi';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json';
import OutlinedSelect from '@/components/ui/Outlined';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

interface PermissionData {
  id: number;
  tracker_id: number;
  update_by: number;
  tracker_type: string;
  reason_for_request: string;
  reject_reason: string;
  is_requested: boolean;
  is_approved: boolean;
  is_rejected: boolean;
  count: number;
  created_at: string;
  last_updated_at: string;
  expires_at: string;
  UpdateBy: {
    id: number;
    name: string;
    Company: {
      id: number;
      name: string;
    },
    company_id: null | number;
    CompanyGroup: null | any;
    group_id: null | number;
  };
}

const EditPermission = () => {
  const navigate = useNavigate();
  const filterOptions = [
    { label: 'PF Tracker', value: 'pf' },
    { label: 'PFIW Tracker', value: 'pfiw' },
    { label: 'ESI Tracker', value: 'esi' },
    { label: 'LWF Tracker', value: 'lwf' },
    { label: 'PTRC Tracker', value: 'ptrc' },
    { label: 'PTEC Tracker', value: 'ptec' }
  ];

  const [filter, setFilter] = useState('');
  const [data, setData] = useState<PermissionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [requestToReject, setRequestToReject] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const [tableData, setTableData] = useState({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: { order: '', key: '' },
  });

  const filteredData = useMemo(() => {
    return filter 
      ? data.filter(item => item.tracker_type === filter)
      : data;
  }, [data, filter]);

  // Fetch data from API
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await httpClient.get(endpoints.request.getAll(), {
        params: {
          tracker_type: filter || undefined // Only send if filter exists
        }
      });
      const fetchedData: PermissionData[] = response.data.data;
      setData(fetchedData);
      setTableData(prev => ({ ...prev, total: fetchedData.length }));
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching permission data:', err);
      setError('Failed to load permission data');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  // Filter effect
  // useEffect(() => {
  //   if (filter) {
  //     const filtered = data.filter((item) =>
  //       item.tracker_type.toLowerCase() === filter.toLowerCase()
  //     );
  //     setFilteredData(filtered);
  //     setTableData((prev) => ({ ...prev, total: filtered.length }));
  //   } else {
  //     setFilteredData(data);
  //     setTableData((prev) => ({ ...prev, total: data.length }));
  //   }
  // }, [data, filter]);

  const handleViewDetails = (request: PermissionData) => {
    navigate('/request-tracker-detail', { 
      state: { requestId: request.id } 
    });
  };



  const handleApprove = async (id: number) => {
    try {
      const response = await httpClient.put(endpoints.permission.approveRequest(id));
      if (response) {
        fetchData();
        toast.push(
          <Notification title="Success" type="success" duration={3000} closable={true}>
            Permission has been given successfully
          </Notification>,
        );
      } else {
        toast.push(
          <Notification title="Failed" type="error" duration={3000} closable={true}>
            Failed to approve permission request
          </Notification>,
        );
      }
    } catch (err) {
      console.error('Error approving permission:', err);
      toast.push(
        <Notification title="Failed" type="error" duration={3000} closable={true}>
          Failed to approve permission request
        </Notification>,
      );
    }
  };

  const handleReject = async () => {
    if (!requestToReject || !rejectReason) {
      toast.push(
        <Notification title="Error" type="error" duration={3000} closable={true}>
          Please provide a reject reason
        </Notification>
      );
      return;
    }

    try {
      const response = await httpClient.put(
        endpoints.request.rejectRequest(requestToReject),
        { reject_reason: rejectReason }
      );
      
      if (response) {
        fetchData();
        toast.push(
          <Notification title="Success" type="success" duration={3000} closable={true}>
            Request has been rejected
          </Notification>
        );
        setRejectDialogOpen(false);
        setRejectReason('');
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

  const onPaginationChange = (page: number) => {
    setTableData((prev) => ({ ...prev, pageIndex: page }));
  };

  const onSelectChange = (value: number) => {
    setTableData((prev) => ({ ...prev, pageSize: Number(value), pageIndex: 1 }));
  };

  const onSort = (sort: OnSortParam) => {
    setTableData((prev) => ({ ...prev, sort }));
  };

  const columns: ColumnDef<PermissionData>[] = useMemo(
    () => [
      {
        header: 'Company',
        enableSorting: false,
        accessorKey: 'UpdateBy',
        cell: (props) => {
          const updateBy = props.getValue() as PermissionData['UpdateBy'];
          return (
            <Tooltip title={updateBy.Company.name}>
              <div className="w-40 truncate">{updateBy.Company.name}</div>
            </Tooltip>
          );
        },
      },
      {
        header: 'Requested By',
        enableSorting: false,
        accessorKey: 'UpdateBy',
        cell: (props) => {
          const updateBy = props.getValue() as PermissionData['UpdateBy'];
          return (
            <Tooltip title={updateBy.name}>
              <div className="w-40 truncate">{updateBy.name}</div>
            </Tooltip>
          );
        },
      },
      {
        header: 'Reason For Request',
        enableSorting: false,
        accessorKey: 'reason_for_request',
        cell: (props) => {
          const reason = props.getValue() as string;
          return (
            <Tooltip title={reason}>
              <div className="w-64 truncate">{reason}</div>
            </Tooltip>
          );
        },
      },
      {
        header: 'Tracker Type',
        enableSorting: false,
        accessorKey: 'tracker_type',
        cell: (props) => {
          const type = props.getValue() as string;
          return (
            <div className='w-32'>
            <div
              className="inline-flex items-center bg-blue-500 font-semibold text-white w-16 justify-center px-2 py-1 rounded-md"
              >{type.toUpperCase()}</div>
              </div>
          );
        },
      },
      {
        header: 'Created At',
        enableSorting: false,
        accessorKey: 'created_at',
        cell: (props) => {
          const date = new Date(props.getValue() as string);
          return (
            <Tooltip title={date.toLocaleString()}>
              <div className="w-52 truncate">
                {date.toLocaleDateString()} {date.toLocaleTimeString()}
              </div>
            </Tooltip>
          );
        },
      },
      {
        header: 'Last Updated At',
        enableSorting: false,
        accessorKey: 'last_updated_at',
        cell: (props) => {
          const date = new Date(props.getValue() as string);
          return (
            <Tooltip title={date.toLocaleString()}>
              <div className="w-52 truncate">
                {date.toLocaleDateString()} {date.toLocaleTimeString()}
              </div>
            </Tooltip>
          );
        },
      },
      {
        header: 'Status',
        enableSorting: false,
        accessorKey: 'is_approved',
        cell: (props) => {
          const isApproved = props.getValue() as boolean;
          const row = props.row.original;
          if (row.is_rejected) {
            <div
              className="inline-flex items-center bg-red-500 text-white w-16 justify-center px-2 py-1 rounded-md">Rejected</div>;
          }
          return isApproved 
            ?  <div
              className="inline-flex items-center bg-green-500 text-white w-16 justify-center px-2 py-1 rounded-md">Approved</div>
            :  <div
            className="inline-flex items-center bg-yellow-500 text-white w-24 font-semibold justify-center px-2 py-1 rounded-md">Pending</div>;
        },
      },
      {
        header: 'Action',
        id: 'actions',
        cell: ({ row }) => {
          const request = row.original;
          return (
            <div className="flex gap-2">
              <Tooltip title="View Details">
                <Button
                  size="sm"
                  onClick={() => handleViewDetails(request)}
                  icon={<RiEyeLine />}
                />
              </Tooltip>
              {!request.is_approved && !request.is_rejected && (
                <>
                  <Tooltip title="Approve">
                    <Button
                      size="sm"
                      variant="solid"
                      color="green-600"
                      onClick={() => handleApprove(request.id)}
                      icon={<RiCheckLine />}
                    />
                  </Tooltip>
                  <Tooltip title="Reject">
                    <Button
                      size="sm"
                      variant="solid"
                      color="red-600"
                      onClick={() => {
                        setRequestToReject(request.id);
                        setRejectDialogOpen(true);
                      }}
                      icon={<RiCloseLine />}
                    />
                  </Tooltip>
                </>
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500 rounded-xl">
        <div className="w-28 h-28">
          <Lottie animationData={loadingAnimation} loop className="w-24 h-24" />
        </div>
        <p className="text-lg font-semibold">Loading Data...</p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex justify-between items-center mb-12">
        <h3 className="text-2xl font-bold">Remittance Tracker Edit Permission</h3>
        <div className="flex items-center gap-4">
          <div className="w-52 z-10">
            <OutlinedSelect
              label="Filter"
              options={filterOptions}
              value={filterOptions.find(opt => opt.value === filter)}
              onChange={(selectedOption) => {
                // Extract just the value from the selected option
                const selectedValue = selectedOption.value;
                setFilter(selectedValue);
                setTableData(prev => ({ ...prev, pageIndex: 1 }));
              }}
            />
          </div>
        </div>
      </div>
      
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
          <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
          <p className="text-center">No Data Available</p>
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={filter ? filteredData : data}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ className: 'rounded-md' }}
            loading={isLoading}
            pagingData={{
              total: tableData.total,
              pageIndex: tableData.pageIndex,
              pageSize: tableData.pageSize,
            }}
            onPaginationChange={onPaginationChange}
            onSelectChange={onSelectChange}
            onSort={onSort}
            stickyHeader={true}
            stickyFirstColumn={true}
            stickyLastColumn={true}
          />

          {/* Reject Dialog */}
          <Dialog isOpen={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
            <div>
              <h4 className="text-lg font-semibold">Reject Request</h4>
            </div>
            <div>
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
            <div className='flex justify-end'>
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
        </>
      )}
    </div>
  );
};

export default EditPermission;