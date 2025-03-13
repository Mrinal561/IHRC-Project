// import React, { useState, useEffect } from 'react';
// import { Button, Dialog, Notification, toast } from '@/components/ui';
// import { HiPlusCircle } from 'react-icons/hi';
// import OutlinedInput from '@/components/ui/OutlinedInput';
// import AdaptableCard from '@/components/shared/AdaptableCard';
// import CompanyNameTable from './components/CompanyNameTable';
// import { useAppDispatch } from '@/store';
// import { fetchCompanies, createCompany } from '@/store/slices/company/companySlice';
// import { CompanyData } from '@/@types/company';
// import { endpoints } from '@/api/endpoint';
// import httpClient from '@/api/http-client';
// import Bu from './components/Bu';
// import { useNavigate } from 'react-router-dom';
// import * as yup from 'yup';
// import { useFormik } from 'formik';
// import { showErrorNotification } from '@/components/ui/ErrorMessage';

// interface NewCompany {
//   name: string;
//   group_id: number;
// }

// const validationSchema = yup.object().shape({
//   name: yup
//     .string()
//     .required('Company name is required')
//     .min(2, 'Company name must be at least 2 characters')
//     .max(100, 'Company name must not exceed 100 characters')
//     .matches(/^\S.*\S$|^\S$/,'The input must not have leading or trailing spaces'),
//   group_id: yup
//     .number()
//     .min(1, 'Valid company group is required')
//     .required('Company group is required')
// });

// const CompanyName = () => {
//   const dispatch = useAppDispatch();
//   const [isLoading, setIsLoading] = useState(false);
//   const [dialogLoading, setDialogLoading] = useState(false);
//   const [companyData, setCompanyData] = useState<CompanyData[]>([]);
//   const [dialogIsOpen, setIsOpen] = useState(false);
//   const [tableKey, setTableKey] = useState(0);
//   const navigate = useNavigate();
//   const [companyGroup, setCompanyGroup] = useState({ id: 0, name: '' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [pagination, setPagination] = useState({
//     total: 0,
//     pageIndex: 1,
//     pageSize: 10,
// });
//   // Load default company group
//   const loadDefaultCompanyGroup = async () => {
//     try {
//       const { data } = await httpClient.get(endpoints.companyGroup.getAll(), {
//         params: { ignorePlatform: true },
//       });

//       if (data.data && data.data.length > 0) {
//         const defaultGroup = data.data[0];
//         const groupData = {
//           id: defaultGroup.id,
//           name: defaultGroup.name
//         };
//         setCompanyGroup(groupData);
//         formik.setFieldValue('group_id', defaultGroup.id);
//       }
//     } catch (error) {
//       console.error('Failed to load default company group:', error);
//       toast.push(
//         <Notification title="Error" closable={true} type="danger">
//           Failed to load company group
//         </Notification>
//       );
//     }
//   };

//   const fetchCompanyDataTable = async (page = 1, pageSize = 10, search = '') => {
//     setIsLoading(true);
//     try {
//       const { payload: data }: any = await dispatch(fetchCompanies({
//         page,
//         page_size: pageSize,
//         search
//       }));

//       if (data && data.data) {
//         setPagination(prev => ({
//           ...prev,
//           total: data.paginate_data.totalResults
//       }));
//         setCompanyData(
//           data.data.map((v: any) => ({
//             ...v,
//             company_group_name: v?.CompanyGroup?.name
//           })) || []
//         );
//       }
//     } catch (error) {
//       console.error('Failed to fetch companies:', error);
//       toast.push(
//         <Notification title="Error" closable={true} type="danger">
//           Failed to fetch companies
//         </Notification>
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   const handlePaginationChange = (page: number) => {
//     setPagination(prev => ({ ...prev, pageIndex: page }));
// };

// const handlePageSizeChange = (newPageSize: number) => {
//     setPagination(prev => ({
//         ...prev,
//         pageSize: newPageSize,
//         pageIndex: 1, // Reset to first page when changing page size
//     }));
// };

//   const handleSearch = (value: string) => {
//     setSearchTerm(value);
//     const timeoutId = setTimeout(() => {
//       fetchCompanyDataTable(1, 10, value);
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   };

//   const handleDataChange = async () => {
//     setTableKey(prevKey => prevKey + 1);
//     await fetchCompanyDataTable(1, 10);
//   };

//   const formik = useFormik({
//     initialValues: {
//       name: '',
//       group_id: companyGroup.id,
//     },
//     validationSchema,
//     validateOnChange: true,
//     validateOnBlur: true,
//     enableReinitialize: true,
//     onSubmit: async (values) => {
//       if (values.group_id === 0) {
//         showErrorNotification('Valid company group is required');
//         return;
//       }

//       setDialogLoading(true);
//       try {
//         const response = await dispatch(createCompany(values))
//           .unwrap()
//           .catch((error: any) => {
//             if (error.response?.data?.message) {
//               showErrorNotification(error.response.data.message);
//             } else if (error.message) {
//               showErrorNotification(error.message);
//             } else if (Array.isArray(error)) {
//               showErrorNotification(error);
//             } else {
//               showErrorNotification(error);
//             }
//             throw error;
//           });

//         if(response) {
//           onDialogClose();
//           toast.push(
//             <Notification title="Success" type="success">
//               Company added successfully
//             </Notification>
//           );
//           handleDataChange();
//         }
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setDialogLoading(false);
//       }
//     },
//   });

//   useEffect(() => {
//     loadDefaultCompanyGroup();
//   }, []);

//   useEffect(() => {
//     fetchCompanyDataTable();
//   }, []);

//   const onDialogClose = () => {
//     setIsOpen(false);
//     formik.resetForm();
//   };

//   const handleInputChange = (value: string) => {
//     formik.setFieldValue('name', value);
//     formik.setFieldTouched('name', true, false);
//   };

//   return (
//     <AdaptableCard className="h-full" bodyClass="h-full">
//       <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
//         <div className="mb-4 lg:mb-0">
//           <h3 className="text-2xl font-bold">Companies</h3>
//         </div>
//         <div className="flex gap-3 items-center">
//           <OutlinedInput
//             label="Search By Company Name"
//             value={searchTerm}
//             onChange={(e) => handleSearch(e)}
//           />
//           <Bu onUploadSuccess={handleDataChange} />
//           <Button
//             size="sm"
//             icon={<HiPlusCircle />}
//             onClick={() => setIsOpen(true)}
//             variant="solid"
//           >
//             Add Company
//           </Button>
//         </div>
//       </div>

//       <CompanyNameTable
//         key={tableKey}
//         onDataChange={handleDataChange}
//         companyData={companyData}
//         isLoading={isLoading}
//         pagination={pagination}
//       onPaginationChange={handlePaginationChange}
//       onPageSizeChange={handlePageSizeChange}
//       />

//       <Dialog
//         isOpen={dialogIsOpen}
//         onClose={onDialogClose}
//         onRequestClose={onDialogClose}
//         shouldCloseOnOverlayClick={false}
//       >
//         <form onSubmit={formik.handleSubmit}>
//           <h5 className="mb-4">Add Company</h5>
//           <div className="mb-4 flex flex-col gap-3">
//             <label>Company Group</label>
//             <OutlinedInput
//               label="Company Group"
//               value={companyGroup.name}
//               disabled
//             />
//             {formik.touched.group_id && formik.errors.group_id && (
//               <div className="mt-1 text-red-500 text-sm">{formik.errors.group_id}</div>
//             )}
//           </div>
//           <div className="mb-4 flex flex-col gap-3">
//             <label>Company Name <span className="text-red-500">*</span></label>
//             <OutlinedInput
//               label="Enter Company Name"
//               value={formik.values.name}
//               onChange={handleInputChange}
//               onBlur={formik.handleBlur('name')}
//               error={Boolean(formik.touched.name && formik.errors.name)}
//             />
//             {formik.touched.name && formik.errors.name && (
//               <div className="mt-1 text-red-500 text-sm">{formik.errors.name}</div>
//             )}
//           </div>
//           <div className="text-right mt-6">
//             <Button
//               className="ltr:mr-2 rtl:ml-2"
//               variant="plain"
//               onClick={onDialogClose}
//               disabled={dialogLoading}
//               type="button"
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="solid"
//               loading={dialogLoading}
//               type="submit"
//             >
//               Confirm
//             </Button>
//           </div>
//         </form>
//       </Dialog>
//     </AdaptableCard>
//   );
// };

// export default CompanyName;

import React, { useState, useEffect } from 'react'
import { Button, Dialog, Notification, toast } from '@/components/ui'
import { HiPlusCircle } from 'react-icons/hi'
import OutlinedInput from '@/components/ui/OutlinedInput'
import AdaptableCard from '@/components/shared/AdaptableCard'
import CompanyNameTable from './components/CompanyNameTable'
import { useAppDispatch } from '@/store'
import {
    fetchCompanies,
    createCompany,
} from '@/store/slices/company/companySlice'
import { CompanyData } from '@/@types/company'
import { endpoints } from '@/api/endpoint'
import httpClient from '@/api/http-client'
import Bu from './components/Bu'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { showErrorNotification } from '@/components/ui/ErrorMessage'

interface NewCompany {
    name: string
    group_id: number
}

const validationSchema = yup.object().shape({
    name: yup
        .string()
        .required('Company name is required')
        .min(2, 'Company name must be at least 2 characters')
        .max(100, 'Company name must not exceed 100 characters')
        .matches(
            /^\S.*\S$|^\S$/,
            'The input must not have leading or trailing spaces',
        ),
    group_id: yup
        .number()
        .min(1, 'Valid company group is required')
        .required('Company group is required'),
})

const CompanyName = () => {
    const dispatch = useAppDispatch()
    const [isLoading, setIsLoading] = useState(false)
    const [dialogLoading, setDialogLoading] = useState(false)
    const [companyData, setCompanyData] = useState<CompanyData[]>([])
    const [dialogIsOpen, setIsOpen] = useState(false)
    const [tableKey, setTableKey] = useState(0)
    const navigate = useNavigate()
    const [companyGroup, setCompanyGroup] = useState({ id: 0, name: '' })
    const [searchTerm, setSearchTerm] = useState('')
    const [pagination, setPagination] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
    })

    // Load default company group
    const loadDefaultCompanyGroup = async () => {
        try {
            const { data } = await httpClient.get(
                endpoints.companyGroup.getAll(),
                {
                    params: { ignorePlatform: true },
                },
            )

            if (data.data && data.data.length > 0) {
                const defaultGroup = data.data[0]
                const groupData = {
                    id: defaultGroup.id,
                    name: defaultGroup.name,
                }
                setCompanyGroup(groupData)
                formik.setFieldValue('group_id', defaultGroup.id)
            }
        } catch (error) {
            console.error('Failed to load default company group:', error)
            toast.push(
                <Notification title="Error" closable={true} type="error">
                    Failed to load company group
                </Notification>,
            )
        }
    }

    const fetchCompanyDataTable = async (
        page = 1,
        pageSize = 10,
        search = '',
    ) => {
        setIsLoading(true)
        try {
            const { payload: data }: any = await dispatch(
                fetchCompanies({
                    page,
                    page_size: pageSize,
                    search,
                }),
            )

            if (data && data.data) {
                setPagination((prev) => ({
                    ...prev,
                    total: data.paginate_data.totalResults,
                }))
                setCompanyData(
                    data.data.map((v: any) => ({
                        ...v,
                        company_group_name: v?.CompanyGroup?.name,
                    })) || [],
                )
            }
        } catch (error) {
            console.error('Failed to fetch companies:', error)
            toast.push(
                <Notification title="Error" closable={true} type="error">
                    Failed to fetch companies
                </Notification>,
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handlePaginationChange = (page: number) => {
        setPagination((prev) => ({ ...prev, pageIndex: page }))
        fetchCompanyDataTable(page, pagination.pageSize, searchTerm)
    }

    const handlePageSizeChange = (newPageSize: number) => {
        setPagination((prev) => ({
            ...prev,
            pageSize: newPageSize,
            pageIndex: 1, // Reset to first page when changing page size
        }))
        fetchCompanyDataTable(1, newPageSize, searchTerm)
    }

    const handleSearch = (value: string) => {
        setSearchTerm(value)
        fetchCompanyDataTable(1, pagination.pageSize, value)
    }

    const handleDataChange = async () => {
        setTableKey((prevKey) => prevKey + 1)
        await fetchCompanyDataTable(
            pagination.pageIndex,
            pagination.pageSize,
            searchTerm,
        )
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            group_id: companyGroup.id,
        },
        validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        enableReinitialize: true,
        onSubmit: async (values) => {
            if (values.group_id === 0) {
                showErrorNotification('Valid company group is required')
                return
            }

            setDialogLoading(true)
            try {
                const response = await dispatch(createCompany(values))
                    .unwrap()
                    .catch((error: any) => {
                        throw error
                    })

                if (response) {
                    onDialogClose()
                    toast.push(
                        <Notification title="Success" type="success" closable={true}>
                            Company added successfully
                        </Notification>,
                    )
                    handleDataChange()
                }
            } catch (error) {
                console.error(error)
            } finally {
                setDialogLoading(false)
            }
        },
    })

    useEffect(() => {
        loadDefaultCompanyGroup()
    }, [])

    useEffect(() => {
        fetchCompanyDataTable(
            pagination.pageIndex,
            pagination.pageSize,
            searchTerm,
        )
    }, [pagination.pageIndex, pagination.pageSize, searchTerm])

    const onDialogClose = () => {
        setIsOpen(false)
        formik.resetForm()
    }

    const handleInputChange = (value: string) => {
        formik.setFieldValue('name', value)
        formik.setFieldTouched('name', true, false)
    }

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
                <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold">Company</h3>
                </div>
                <div className="flex gap-3 items-center">
                    <OutlinedInput
                        label="Search By Company Name"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e)}
                    />
                    <Bu onUploadSuccess={handleDataChange} />
                    <Button
                        size="sm"
                        icon={<HiPlusCircle />}
                        onClick={() => setIsOpen(true)}
                        variant="solid"
                    >
                        Add Company
                    </Button>
                </div>
            </div>

            <CompanyNameTable
                key={tableKey}
                onDataChange={handleDataChange}
                companyData={companyData}
                isLoading={isLoading}
                pagination={pagination}
                onPaginationChange={handlePaginationChange}
                onPageSizeChange={handlePageSizeChange}
            />

            <Dialog
                isOpen={dialogIsOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
                shouldCloseOnOverlayClick={false}
            >
                <form onSubmit={formik.handleSubmit}>
                    <h5 className="mb-4">Add Company</h5>
                    <div className="mb-4 flex flex-col gap-3">
                        <label>Company Group</label>
                        <OutlinedInput
                            label="Company Group"
                            value={companyGroup.name}
                            disabled
                        />
                        {formik.touched.group_id && formik.errors.group_id && (
                            <div className="mt-1 text-red-500 text-sm">
                                {formik.errors.group_id}
                            </div>
                        )}
                    </div>
                    <div className="mb-4 flex flex-col gap-3">
                        <label>
                            Company Name <span className="text-red-500">*</span>
                        </label>
                        <OutlinedInput
                            label="Enter Company Name"
                            value={formik.values.name}
                            onChange={handleInputChange}
                            // onBlur={formik.handleBlur('name')}
                            // error={Boolean(formik.touched.name && formik.errors.name)}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <div className="mt-1 text-red-500 text-sm">
                                {formik.errors.name}
                            </div>
                        )}
                    </div>
                    <div className="text-right mt-6">
                        <Button
                            className="ltr:mr-2 rtl:ml-2"
                            variant="plain"
                            onClick={onDialogClose}
                            disabled={dialogLoading}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="solid"
                            loading={dialogLoading}
                            type="submit"
                        >
                            Confirm
                        </Button>
                    </div>
                </form>
            </Dialog>
        </AdaptableCard>
    )
}

export default CompanyName
