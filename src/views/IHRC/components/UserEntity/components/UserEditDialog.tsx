// import React, { useState, useEffect } from 'react';
// import { Button, Dialog, Notification, toast } from '@/components/ui';
// import OutlinedInput from '@/components/ui/OutlinedInput';
// import { useDispatch } from 'react-redux';
// // import { fetchUserById, updateUser } from '@/store/slices/user/userSlice';
// import { showErrorNotification } from '@/components/ui/ErrorMessage/ErrorMessage';
// import { fetchUserById, updateUser } from '@/store/slices/userEntity/UserEntitySlice';

// interface UserDetails {
//   id?: number;
//   name?: string;
//   group_id?:number;
//   password?:string;
//   company_id?:number;
//   joining_date?:string;
//   role_id?:number;
//   auth_signatory?:boolean;
//   suspend?:boolean;
//   disable?:boolean;
// //   last_name?: string;
//   email?: string;
//   mobile?: string;
//   // Add other potential user fields as needed
// }

// interface UserEditDialogProps {
//   isOpen: boolean;
//   onClose: () => void;
//   userId: number;
//   onRefresh?: () => void;
// }

// const UserEditDialog: React.FC<UserEditDialogProps> = ({
//   isOpen,
//   onClose,
//   userId,
//   onRefresh
// }) => {
//   const [editedData, setEditedData] = useState<UserDetails>({
//     id: userId,
//     name: '',
//     // last_name: '',
//     email: '',
//     mobile: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     console.log(userId)
//     if (isOpen && userId) {
//       fetchUserData();
//     }
//   }, [isOpen, userId]);

//   const fetchUserData = async () => {
//     try {
//       setLoading(true);
//       const response = await dispatch(fetchUserById(userId))
//         .unwrap()
//         .catch((error: any) => {
//           // Handle different error formats
//           if (error.response?.data?.message) {
//             showErrorNotification(error.response.data.message);
//           } else if (error.message) {
//             showErrorNotification(error.message);
//           } else if (Array.isArray(error)) {
//             showErrorNotification(error);
//           } else {
//             showErrorNotification('An unexpected error occurred. Please try again.');
//           }
//           throw error;
//         });
//         console.log(response)
      
//       setEditedData(response);
//       console.log(response)
//     } catch (error) {
//       setError('Failed to load User details');
//       console.error('Error fetching User data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (field: keyof UserDetails, value: string) => {
//     setEditedData((prev) => ({...prev, [field]: value }));
//   };

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       // Create updateData object with only the fields that can be updated
//       const updateData = {
//         name: editedData.name,
//         company_id: editedData.company_id,
//         group_id: editedData.group_id,
//         password:editedData.password,
//         email: editedData.email,
//         mobile: editedData.mobile,
//         joining_date: editedData.joining_date,
//         role_id:editedData.role_id,
//         auth_signatory:editedData.auth_signatory,
//         suspend: editedData.suspend,
//         disable:editedData.disable,
//       };

//       // Dispatch update user action
//       const res = await dispatch(updateUser({
//         id: userId,
//         data: updateData
//       })).unwrap()
//       .catch((error: any) => {
//         // Handle different error formats
//         if (error.response?.data?.message) {
//           showErrorNotification(error.response.data.message);
//         } else if (error.message) {
//           showErrorNotification(error.message);
//         } else if (Array.isArray(error)) {
//           showErrorNotification(error);
//         } else {
//           showErrorNotification('Failed to update user');
//         }
//         throw error;
//       });

//       if (res) {
//         openNotification('success', 'User edited successfully');
//         onClose();
//         if (onRefresh) {
//           onRefresh();
//         }
//       }
//     } catch (err) {
//       console.error('Error submitting user data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openNotification = (type: 'success' | 'info' | 'danger' | 'warning', message: string) => {
//     toast.push(
//       <Notification
//         title={type.charAt(0).toUpperCase() + type.slice(1)}
//         type={type}
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
//       <h5 className="mb-4">Edit User Details</h5>
      
//       <div className="p-4 space-y-4">
//         <div className='flex flex-col gap-2 w-full'>
//           <label>First Name</label>
//           <OutlinedInput
//             label="First Name"
//             value={editedData.name || ''}
//             onChange={(value) => handleChange('name', value)}
//           />
//         </div>

//         {/* <div className='flex flex-col gap-2 w-full'>
//           <label>Last Name</label>
//           <OutlinedInput
//             label="Last Name"
//             value={editedData.last_name || ''}
//             onChange={(value) => handleChange('last_name', value)}
//           />
//         </div> */}

//         <div className='flex flex-col gap-2 w-full'>
//           <label>Email</label>
//           <OutlinedInput
//             label="Email"
//             value={editedData.email || ''}
//             onChange={(value) => handleChange('email', value)}
//           />
//         </div>

//         <div className='flex flex-col gap-2 w-full'>
//           <label>Mobile</label>
//           <OutlinedInput
//             label="Mobile"
//             value={editedData.mobile || ''}
//             onChange={(value) => handleChange('mobile', value)}
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

// export default UserEditDialog;

import React, { useState, useEffect } from 'react';
import { Button, Dialog, Notification, toast } from '@/components/ui';
import OutlinedInput from '@/components/ui/OutlinedInput';
import { useDispatch } from 'react-redux';
import { showErrorNotification } from '@/components/ui/ErrorMessage/ErrorMessage';
import { fetchUserById, updateUser } from '@/store/slices/userEntity/UserEntitySlice';
import * as yup from 'yup';

interface UserDetails {
  id?: number;
  name?: string;
  group_id?: number;
  password?: string;
  company_id?: number;
  joining_date?: string;
  role_id?: number;
  auth_signatory?: boolean;
  suspend?: boolean;
  disable?: boolean;
  email?: string;
  mobile?: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface UserEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  onRefresh?: () => void;
}

const validationSchema = yup.object().shape({
  name: yup
  .string()
  .required('Name is required')
  .min(2, 'Name must be at least 2 characters')
  .matches(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/, 'Name can only contain letters with single spaces between words')
  .matches(/^\S.*\S$|^\S$/,'The input must not have leading or trailing spaces'),
  email: yup
  .string()
  .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/,
      'Invalid email address.'
  )
  .required('Email is required'),
  mobile: yup
    .string()
    .required('Mobile number is required')
    .matches(/^[0-9+\-\s]+$/, 'Please enter a valid mobile number')
    .min(10, 'Mobile number must be at least 10 digits')
    .max(15, 'Mobile number must not exceed 15 digits'),
});

const UserEditDialog: React.FC<UserEditDialogProps> = ({
  isOpen,
  onClose,
  userId,
  onRefresh
}) => {
  const [editedData, setEditedData] = useState<UserDetails>({
    id: userId,
    name: '',
    email: '',
    mobile: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserData();
    }
  }, [isOpen, userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await dispatch(fetchUserById(userId))
        .unwrap()
        .catch((error: any) => {
          if (error.response?.data?.message) {
            showErrorNotification(error.response.data.message);
          } else if (error.message) {
            showErrorNotification(error.message);
          } else if (Array.isArray(error)) {
            showErrorNotification(error);
          } else {
            showErrorNotification('An unexpected error occurred. Please try again.');
          }
          throw error;
        });
      
      setEditedData(response);
      // Clear validation errors when loading new data
      setValidationErrors({});
    } catch (error) {
      setError('Failed to load User details');
      console.error('Error fetching User data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof UserDetails, value: string) => {
    setEditedData(prev => ({...prev, [field]: value }));
    // Clear validation error for the field being changed
    setValidationErrors(prev => ({...prev, [field]: ''}));
  };

  const validateForm = async (): Promise<boolean> => {
    try {
      await validationSchema.validate(editedData, { abortEarly: false });
      setValidationErrors({});
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errors: ValidationErrors = {};
        err.inner.forEach((error) => {
          if (error.path) {
            errors[error.path] = error.message;
          }
        });
        setValidationErrors(errors);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    try {
      const isValid = await validateForm();
      if (!isValid) return;

      setLoading(true);
      const updateData = {
        name: editedData.name,
        company_id: editedData.company_id,
        group_id: editedData.group_id,
        password: editedData.password,
        email: editedData.email,
        mobile: editedData.mobile,
        joining_date: editedData.joining_date,
        role_id: editedData.role_id,
        auth_signatory: editedData.auth_signatory,
        suspend: editedData.suspend,
        disable: editedData.disable,
      };

      const res = await dispatch(updateUser({
        id: userId,
        data: updateData
      })).unwrap()
      .catch((error: any) => {
        if (error.response?.data?.message) {
          showErrorNotification(error.response.data.message);
        } else if (error.message) {
          showErrorNotification(error.message);
        } else if (Array.isArray(error)) {
          showErrorNotification(error);
        } else {
          showErrorNotification('Failed to update user');
        }
        throw error;
      });

      if (res) {
        openNotification('success', 'User edited successfully');
        onClose();
        if (onRefresh) {
          onRefresh();
        }
      }
    } catch (err) {
      console.error('Error submitting user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const openNotification = (type: 'success' | 'info' | 'error' | 'warning', message: string) => {
    toast.push(
      <Notification
        title={type.charAt(0).toUpperCase() + type.slice(1)}
        type={type}
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
        width={600}  shouldCloseOnOverlayClick={false} 
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
      <h5 className="mb-4">Edit User Details</h5>
      
      <div className="p-4 space-y-4">
        <div className='flex flex-col gap-2 w-full'>
          <label>First Name</label>
          <OutlinedInput
            label="First Name"
            value={editedData.name || ''}
            onChange={(value) => handleChange('name', value)}
          />
          {validationErrors.name && (
            <span className="text-red-500 text-sm">{validationErrors.name}</span>
          )}
        </div>

        <div className='flex flex-col gap-2 w-full'>
          <label>Email</label>
          <OutlinedInput
            label="Email"
            value={editedData.email || ''}
            onChange={(value) => handleChange('email', value)}
          />
          {validationErrors.email && (
            <span className="text-red-500 text-sm">{validationErrors.email}</span>
          )}
        </div>

        <div className='flex flex-col gap-2 w-full'>
          <label>Mobile</label>
          <OutlinedInput
            label="Mobile"
            value={editedData.mobile || ''}
            onChange={(value) => handleChange('mobile', value)}
          />
          {validationErrors.mobile && (
            <span className="text-red-500 text-sm">{validationErrors.mobile}</span>
          )}
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

export default UserEditDialog;