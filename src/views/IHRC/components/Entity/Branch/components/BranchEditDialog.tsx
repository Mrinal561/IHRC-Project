// import React, { useState, useEffect } from 'react';
// import { Button, DatePicker, Dialog, Notification, toast } from '@/components/ui';
// import OutlinedInput from '@/components/ui/OutlinedInput';
// // import { showErrorNotification } from '@/components/ui/ErrorMessage';
// import { useDispatch } from 'react-redux';
// import { fetchBranchById, updateBranch } from '@/store/slices/branch/branchSlice';
// import dayjs from 'dayjs';
// import { showErrorNotification } from '@/components/ui/ErrorMessage/ErrorMessage';

// interface BranchDetails {
//     id?: number;
//     group_id?: number;
//     company_id?: number;
//     state_id?: number;
//     district_id?: number;
//     location_id?: number;
//     name?: string;
//     opening_date?: string;
//     head_count?: string; 
//     address?: string;
//     type?: string;
//     office_type?: string;
//     other_office_id?: number | null;
//     register_number?: string | null;
//     status?: string;
//     se_status?: string;
//     office_mode?: string;
//     se_document?: string | null;
//     lease_document?: string | null;
//     document_validity_type?: string;
//     se_validity?: string;
//     lease_status?: string | null;
//     lease_validity?: string | null;
//     custom_data?: {
//       remark?: string;
//       status?: string;
//       email?: string;
//       mobile?: string;
//     };
//     created_by?: number;
//     created_at?: string;
//     updated_at?: string;
//     CompanyGroup?: {
//       id?: number;
//       name?: string;
//     };
//     Company?: {
//       id?: number;
//       name?: string;
//     };
//     State?: {
//       id?: number;
//       name?: string;
//     };
//     District?: {
//       id?: number;
//       name?: string;
//     };
//     Location?: {
//       id?: number;
//       name?: string;
//     };
//     OtherBrancOffice?: {
//         id?: number,
//         name?: string
//     }
//   }

// interface BranchEditDialogProps {
//   isOpen: boolean;
//   onClose: () => void;
//   branchId: number;
//   onRefresh: () => void;
// }

// const BranchEditDialog: React.FC<BranchEditDialogProps> = ({
//   isOpen,
//   onClose,
//   branchId,
//   onRefresh
// }) => {
//   const [editedData, setEditedData] = useState<BranchDetails>({
//     id: branchId,
//     name: '',
//     address: '',
//     opening_date: '',
//     head_count: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (isOpen && branchId) {
//       fetchBranchData();
//     }
//   }, [isOpen, branchId]);

//   const fetchBranchData = async () => {
//     try {
//       setLoading(true);
//       const response = await dispatch(fetchBranchById(branchId))
//         .unwrap()
//         .catch((error: any) => {
//           throw error;
//         });
      
//       setEditedData(response);
//     } catch (error) {
//       setError('Failed to load Branch details');
//       console.error('Error fetching Branch data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (field: keyof BranchDetails, value: string | number) => {
//     setEditedData((prev) => ({...prev, [field]: value }));
//   };

//   const handleDateChange = (field: 'opening_date', date: Date | null) => {
//     if (date) {
//       handleChange(field, date.toISOString().split('T')[0]);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       // Create updateData object with only the fields that can be updated
//       const updateData = {
//         group_id: editedData.group_id,
//         state_id: editedData.state_id,
//         company_id: editedData.company_id,
//         district: editedData.District?.name,
//         location: editedData.Location?.name,
//         name: editedData.name,
//         address: editedData.address,
//         opening_date: editedData.opening_date,
//         head_count: editedData.head_count,
//         office_mode: editedData.office_mode,
//         type: editedData.type,
//         office_type: editedData.office_type,
//         other_office:editedData.OtherBrancOffice?.name,
//         custom_data:{
//             remark: editedData.custom_data?.remark,
//             status: editedData.custom_data?.status
//         },
//         se_status: editedData.se_status,
//         lease_status: editedData.lease_status,
//         lease_validity: editedData.lease_validity,
//         se_document: editedData.se_document,
//         register_number: editedData.register_number,
//         document_validity_type: editedData.document_validity_type,
//         se_validity : editedData.se_validity

//       };

//       console.log(updateData)

//       // Dispatch update branch action
//      const res =  await dispatch(updateBranch({
//         id: branchId,
//         data: updateData
//       })).unwrap()
//       .catch((error: any) => {
//         throw error; // Re-throw to prevent navigation
//     });

//       if(res){
//           openNotification('success', 'Branch edited successfully');
//           onClose();
//           if(onRefresh){
//             onRefresh();
//           }

//       }

      
//       if (onRefresh) {
//         onRefresh();
//       }
//     } catch (err) {
//       console.error('Error submitting branch data:', err);
//     //   openNotification('error', 'Failed to update branch');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openNotification = (type: 'success' | 'info' | 'error' | 'warning' | 'error', message: string) => {
//     toast.push(
//       <Notification
//         title={type.charAt(0).toUpperCase() + type.slice(1)}
//         type={type}
//         closable={true}
//       >
//         {message}
//       </Notification>
//     );
//   };

//   if (loading) {
//     return (
//       <Dialog
//         isOpen={isOpen}
//         onClose={onClose}
//         onRequestClose={onClose}
//         width={600}
//         shouldCloseOnOverlayClick={false} 
//       >
//         <div className="flex justify-center items-center h-full">
//           <p>Loading...</p>
//         </div>
//       </Dialog>
//     );
//   }

//   if (error) {
//     return (
//       <Dialog
//         isOpen={isOpen}
//         onClose={onClose}
//         onRequestClose={onClose}
//         width={600}
//       >
//         <div className="flex justify-center items-center h-full">
//           <p className="text-red-500">{error}</p>
//         </div>
//       </Dialog>
//     );
//   }

//   return (
//     <Dialog
//       isOpen={isOpen}
//       onClose={onClose}
//       onRequestClose={onClose}
//       width={600}
//     >
//       <h5 className="mb-4">Edit Branch Detail</h5>
      
//       <div className="p-4 space-y-4">
//         <div className='flex flex-col gap-2 w-full'>
//           <label>Branch Name</label>
//           <OutlinedInput
//             label="Branch Name"
//             value={editedData.name || ''}
//             onChange={(value) => handleChange('name', value)}
//           />
//         </div>

//         <div className='flex flex-col gap-2 w-full'>
//           <label>Branch Address</label>
//           <OutlinedInput
//             label="Branch Address"
//             value={editedData.address || ''}
//             onChange={(value) => handleChange('address', value)}
//           />
//         </div>

//         <div className='flex flex-col gap-2 w-full'>
//           <label>Select Date of Opening</label>
//           <div className='w-full'>
//             <DatePicker
//               size='sm'
//               placeholder="Date of Opening"
//               value={editedData.opening_date ? new Date(editedData.opening_date) : undefined}
//               onChange={(date) => handleDateChange('opening_date', date)}
//             />
//           </div>
//         </div>

//         <div className='flex flex-col gap-2 w-full'>
//           <label>Headcount</label>
//           <OutlinedInput
//             label="Headcount"
//             value={editedData.head_count?.toString() || ''}
//             onChange={(value) => handleChange('head_count', parseInt(value, 10))}
//           />
//         </div>
//       </div>

//       <div className="flex justify-end mt-6">
//         <Button variant="plain" onClick={onClose} className="mr-2">
//           Cancel
//         </Button>
//         <Button 
//           variant="solid" 
//           onClick={handleSubmit} 
//           disabled={loading}
//         >
//           {loading ? 'Updating...' : 'Confirm'}
//         </Button>
//       </div>
//     </Dialog>
//   );
// };

// export default BranchEditDialog;





import React, { useState, useEffect } from 'react';
import { Button, DatePicker, Dialog, Notification, toast } from '@/components/ui';
import OutlinedInput from '@/components/ui/OutlinedInput';
// import { showErrorNotification } from '@/components/ui/ErrorMessage';
import { useDispatch } from 'react-redux';
import { fetchBranchById, updateBranch } from '@/store/slices/branch/branchSlice';
import dayjs from 'dayjs';
import { showErrorNotification } from '@/components/ui/ErrorMessage/ErrorMessage';

interface BranchDetails {
    id?: number;
    group_id?: number;
    company_id?: number;
    state_id?: number;
    district_id?: number;
    location_id?: number;
    name?: string;
    opening_date?: string;
    head_count?: string; 
    address?: string;
    type?: string;
    office_type?: string;
    other_office_id?: number | null;
    register_number?: string | null;
    status?: string;
    se_status?: string;
    office_mode?: string;
    se_document?: string | null;
    lease_document?: string | null;
    document_validity_type?: string;
    se_validity?: string;
    lease_status?: string | null;
    lease_validity?: string | null;
    custom_data?: {
      remark?: string;
      status?: string;
      email?: string;
      mobile?: string;
    };
    created_by?: number;
    created_at?: string;
    updated_at?: string;
    CompanyGroup?: {
      id?: number;
      name?: string;
    };
    Company?: {
      id?: number;
      name?: string;
    };
    State?: {
      id?: number;
      name?: string;
    };
    District?: {
      id?: number;
      name?: string;
    };
    Location?: {
      id?: number;
      name?: string;
    };
    OtherBrancOffice?: {
        id?: number,
        name?: string
    }
  }

interface BranchEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  branchId: number;
  onRefresh: () => void;
}

const BranchEditDialog: React.FC<BranchEditDialogProps> = ({
  isOpen,
  onClose,
  branchId,
  onRefresh
}) => {
  const [editedData, setEditedData] = useState<BranchDetails>({
    id: branchId,
    name: '',
    address: '',
    opening_date: '',
    head_count: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen && branchId) {
      fetchBranchData();
    }
  }, [isOpen, branchId]);

  const fetchBranchData = async () => {
    try {
      setLoading(true);
      const response = await dispatch(fetchBranchById(branchId))
        .unwrap()
        .catch((error: any) => {
          throw error;
        });
      
      setEditedData(response);
    } catch (error) {
      setError('Failed to load Branch details');
      console.error('Error fetching Branch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof BranchDetails, value: string | number) => {
    setEditedData((prev) => ({...prev, [field]: value }));
  };

  const handleDateChange = (field: 'opening_date', date: Date | null) => {
    if (date) {
      handleChange(field, date.toISOString().split('T')[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Create updateData object with only the fields that can be updated
      const updateData = {
        group_id: editedData.group_id,
        state_id: editedData.state_id,
        company_id: editedData.company_id,
        district: editedData.District?.name,
        location: editedData.Location?.name,
        name: editedData.name,
        address: editedData.address,
        opening_date: editedData.opening_date,
        head_count: editedData.head_count,
        office_mode: editedData.office_mode,
        type: editedData.type,
        office_type: editedData.office_type,
        other_office:editedData.OtherBrancOffice?.name,
        custom_data:{
            remark: editedData.custom_data?.remark,
            status: editedData.custom_data?.status
        },
        se_status: editedData.se_status,
        lease_status: editedData.lease_status,
        lease_validity: editedData.lease_validity,
        se_document: editedData.se_document,
        register_number: editedData.register_number,
        document_validity_type: editedData.document_validity_type,
        se_validity : editedData.se_validity

      };

      console.log(updateData)

      // Dispatch update branch action
     const res =  await dispatch(updateBranch({
        id: branchId,
        data: updateData
      })).unwrap()
      .catch((error: any) => {
        throw error; // Re-throw to prevent navigation
    });

      if(res){
          openNotification('success', 'Branch edited successfully');
          onClose();
          if(onRefresh){
            onRefresh();
          }

      }

      
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error('Error submitting branch data:', err);
    //   openNotification('error', 'Failed to update branch');
    } finally {
      setLoading(false);
    }
  };

  const openNotification = (type: 'success' | 'info' | 'error' | 'warning' | 'error', message: string) => {
    toast.push(
      <Notification
        title={type.charAt(0).toUpperCase() + type.slice(1)}
        type={type}
        closable={true}
      >
        {message}
      </Notification>
    );
  };

  if (loading) {
    return (
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        onRequestClose={onClose}
        width={600}
        shouldCloseOnOverlayClick={false} 
      >
        <div className="flex justify-center items-center h-full">
          <p>Loading...</p>
        </div>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        onRequestClose={onClose}
        width={600}
      >
        <div className="flex justify-center items-center h-full">
          <p className="text-red-500">{error}</p>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      onRequestClose={onClose}
      width={600}
    >
      <h5 className="mb-4">Edit Branch Detail</h5>
      
      <div className="p-4 space-y-4">
        <div className='flex flex-col gap-2 w-full'>
          <label>Branch Name</label>
          <OutlinedInput
            label="Branch Name"
            value={editedData.name || ''}
            onChange={(value) => handleChange('name', value)}
          />
        </div>

        <div className='flex flex-col gap-2 w-full'>
          <label>Branch Address</label>
          <OutlinedInput
            label="Branch Address"
            value={editedData.address || ''}
            onChange={(value) => handleChange('address', value)}
          />
        </div>

        <div className='flex flex-col gap-2 w-full'>
          <label>Select Date of Opening</label>
          <div className='w-full'>
            <DatePicker
              size='sm'
              placeholder="Date of Opening"
              value={editedData.opening_date ? new Date(editedData.opening_date) : undefined}
              onChange={(date) => handleDateChange('opening_date', date)}
            />
          </div>
        </div>

        <div className='flex flex-col gap-2 w-full'>
          <label>Headcount</label>
          <OutlinedInput
            label="Headcount"
            value={editedData.head_count?.toString() || ''}
            onChange={(value) => handleChange('head_count', parseInt(value, 10))}
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button variant="plain" onClick={onClose} className="mr-2">
          Cancel
        </Button>
        <Button 
          variant="solid" 
          onClick={handleSubmit} 
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Confirm'}
        </Button>
      </div>
    </Dialog>
  );
};

export default BranchEditDialog;