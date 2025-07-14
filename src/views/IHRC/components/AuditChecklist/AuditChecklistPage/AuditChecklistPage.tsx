



// import React, { useState, useEffect } from 'react'
// import { AdaptableCard } from '@/components/shared'
// import { Button, Dialog, Input, Notification, toast } from '@/components/ui'
// import { HiDownload, HiUpload } from 'react-icons/hi'
// import AuditChecklistTable from './components/AuditChecklistTable'
// import httpClient from '@/api/http-client'
// import { endpoints } from '@/api/endpoint'
// import OutlinedSelect from '@/components/ui/Outlined'
// import Company from './components/Company'

// interface CompanyOption {
//   label: string
//   value: string
//   group_id: number
// }

// const AuditChecklistPage = () => {
//     const [isDialogOpen, setIsDialogOpen] = useState(false)
//     const [selectedCompany, setSelectedCompany] = useState<CompanyOption | null>(null)
//     const [companyGroups, setCompanyGroups] = useState<any[]>([])
//     const [companies, setCompanies] = useState<CompanyOption[]>([])
//     const [searchQuery, setSearchQuery] = useState('')
//     const [file, setFile] = useState<File | null>(null)
//     const [remark, setRemark] = useState('')
//     const [isUploading, setIsUploading] = useState(false)
//     const [data, setData] = useState<any[]>([])
//     const [loading, setLoading] = useState(true)
//     const [pagination, setPagination] = useState({
//         total: 0,
//         pageIndex: 1,
//         pageSize: 10,
//     })

//     // Fetch company groups and companies
//     useEffect(() => {
//         const fetchCompanyData = async () => {
//             try {
//                 // Fetch company groups
//                 const groupsResponse = await httpClient.get(endpoints.companyGroup.getAll())
//                 setCompanyGroups(groupsResponse.data.data)

//                 if (groupsResponse.data.data.length > 0) {
//                     // Fetch companies for the first group by default
//                     await fetchCompanies(groupsResponse.data.data[0].id)
//                 }
//             } catch (error) {
//                 console.error('Error fetching company data:', error)
//                 toast.push(
//                     <Notification title="Error" type="error">
//                         Failed to load company data
//                     </Notification>
//                 )
//             }
//         }

//         fetchCompanyData()
//     }, [])

//     const fetchCompanies = async (groupId: number) => {
//         try {
//             const response = await httpClient.get(endpoints.company.getAll(), {
//                 params: { 'group_id[]': groupId }
//             })
//             setCompanies(
//                 response.data.data.map((company: any) => ({
//                     label: company.name,
//                     value: String(company.id),
//                     group_id: company.group_id
//                 }))
//             )
//         } catch (error) {
//             console.error('Error fetching companies:', error)
//             toast.push(
//                 <Notification title="Error" type="error">
//                     Failed to load companies
//                 </Notification>
//             )
//         }
//     }

//     // Fetch data function
//     const fetchData = async () => {
//         try {
//             setLoading(true)
//             const params = {
//                 page: pagination.pageIndex,
//                 page_size: pagination.pageSize,
//                 search: searchQuery,
//                 company_id: selectedCompany?.value
//             }

//             const response = await httpClient.get(endpoints.compliance.listComplianceChecklist(), { params })
//             setData(response.data.data)
//             setPagination(prev => ({
//                 ...prev,
//                 total: response.data.paginate_data?.totalResults || 0
//             }))
//         } catch (error) {
//             console.error('Error fetching compliance checklists:', error)
//             toast.push(
//                 <Notification title="Error" type="error">
//                     Failed to load compliance checklists
//                 </Notification>
//             )
//         } finally {
//             setLoading(false)
//         }
//     }

//     useEffect(() => {
//         fetchData()
//     }, [pagination.pageIndex, pagination.pageSize, searchQuery, selectedCompany])

//     const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchQuery(e.target.value)
//         // Reset to first page when searching
//         setPagination(prev => ({ ...prev, pageIndex: 1 }))
//     }

//     const handlePageChange = (page: number) => {
//         setPagination(prev => ({ ...prev, pageIndex: page }))
//     }

//     const handlePageSizeChange = (size: number) => {
//         setPagination(prev => ({ ...prev, pageSize: size, pageIndex: 1 }))
//     }

//     const handleDownloadTemplate = async () => {
//         try {
//             if (!selectedCompany) {
//                 toast.push(
//                     <Notification title="Warning" type="warning">
//                         Please select a company first
//                     </Notification>
//                 )
//                 return
//             }

//             const response = await httpClient.get(
//                 endpoints.compliance.downloadComplianceTemplate(),
//                 {
//                     params: { company_id: selectedCompany.value },
//                     responseType: 'blob'
//                 }
//             )

//             const url = window.URL.createObjectURL(new Blob([response.data]))
//             const link = document.createElement('a')
//             link.href = url
//             link.setAttribute('download', 'compliance_checklist_template.xlsx')
//             document.body.appendChild(link)
//             link.click()
//             link.remove()

//             toast.push(
//                 <Notification title="Success" type="success">
//                     Template downloaded successfully
//                 </Notification>
//             )
//         } catch (error) {
//             console.error('Error downloading template:', error)
//             toast.push(
//                 <Notification title="Error" type="error">
//                     Failed to download template
//                 </Notification>
//             )
//         }
//     }

//     const handleDownloadData = async () => {
//         try {
//             if (!selectedCompany) {
//                 toast.push(
//                     <Notification title="Warning" type="warning">
//                         Please select a company first
//                     </Notification>
//                 )
//                 return
//             }

//             const response = await httpClient.get(
//                 endpoints.compliance.downloadComplianceChecklist(),
//                 {
//                     params: { company_id: selectedCompany.value },
//                     responseType: 'blob'
//                 }
//             )

//             const url = window.URL.createObjectURL(new Blob([response.data]))
//             const link = document.createElement('a')
//             link.href = url
//             link.setAttribute('download', 'compliance_checklist_data.xlsx')
//             document.body.appendChild(link)
//             link.click()
//             link.remove()

//             toast.push(
//                 <Notification title="Success" type="success">
//                     Data downloaded successfully
//                 </Notification>
//             )
//         } catch (error) {
//             console.error('Error downloading data:', error)
//             toast.push(
//                 <Notification title="Error" type="error">
//                     Failed to download data
//                 </Notification>
//             )
//         }
//     }

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files.length > 0) {
//             setFile(e.target.files[0])
//         }
//     }

//     const handleBulkUpload = async () => {
//         if (!file || !selectedCompany) {
//             toast.push(
//                 <Notification title="Warning" type="warning">
//                     Please select a file and company
//                 </Notification>
//             )
//             return
//         }

//         setIsUploading(true)
//         try {
//             const formData = new FormData()
//             formData.append('file', file)
//             formData.append('company_id', selectedCompany.value)
//             formData.append('company_group_id', selectedCompany.group_id.toString())

//             await httpClient.post(
//                 endpoints.compliance.bulkUploadCompliancceChecklist(),
//                 formData,
//                 {
//                     headers: {
//                         'Content-Type': 'multipart/form-data'
//                     }
//                 }
//             )

//             toast.push(
//                 <Notification title="Success" type="success">
//                     File uploaded successfully
//                 </Notification>
//             )
//             setIsDialogOpen(false)
//             fetchData() // Refresh data after upload
//         } catch (error) {
//             console.error('Error uploading file:', error)
//             toast.push(
//                 <Notification title="Error" type="error">
//                     Failed to upload file
//                 </Notification>
//             )
//         } finally {
//             setIsUploading(false)
//         }
//     }

//     return (
//         <AdaptableCard className="h-full" bodyClass="h-full">
//             <div className='flex flex-col gap-8'>
//                 <div className='flex justify-between items-center mb-2'>
//                     <div className="flex flex-row items-center justify-between">
//                         <div className="">
//                             <h3 className="text-2xl font-bold">Compliance Checklist</h3>
//                             <p className="text-gray-600">View your company's compliance</p>
//                         </div>
//                     </div>

//                     <div className='flex items-center gap-2'>
//                         <div>
//                             <Input 
//                                 placeholder="Search..."
//                                 value={searchQuery}
//                                 onChange={handleSearch}
//                             />
//                         </div>
//                         <div>
//                             <Button 
//                                 variant='solid' 
//                                 size='sm' 
//                                 icon={<HiDownload />}
//                                 onClick={handleDownloadData}
//                             >
//                                 Download
//                             </Button>
//                         </div>
//                         <div>
//                             <Button 
//                                 variant='solid' 
//                                 size='sm' 
//                                 icon={<HiUpload />} 
//                                 onClick={() => setIsDialogOpen(true)}
//                             >
//                                 Bulk Upload
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="mb-2">
//                     <Company />
//                 </div>

//                 <AuditChecklistTable
//                     data={data}
//                     loading={loading}
//                     pagination={pagination}
//                     onPaginationChange={handlePageChange}
//                     onPageSizeChange={handlePageSizeChange}
//                     onRefresh={fetchData}
//                     searchQuery={searchQuery}
//                 />
//             </div>

//             {/* Bulk Upload Dialog */}
//             <Dialog
//                 isOpen={isDialogOpen}
//                 onClose={() => setIsDialogOpen(false)}
//                 width={450}
//                 shouldCloseOnOverlayClick={false}
//             >
//                 <h5 className="mb-4">Bulk Upload</h5>
//                 <div className='flex flex-col gap-2'>
//                     <label className="text-sm font-medium">Company</label>
//                         <OutlinedSelect
//                             label="Select Company"
//                             options={companies}
//                             value={selectedCompany}
//                             onChange={(selectedOption: CompanyOption | null) => {
//                                 setSelectedCompany(selectedOption)
//                                 // Reset to first page when company changes
//                                 setPagination(prev => ({ ...prev, pageIndex: 1 }))
//                             }}
//                         />
//                 </div>
//                 <div className="my-4 flex gap-2 items-center">
//                     <p>Download Format</p>
//                     <Button 
//                         size="xs" 
//                         icon={<HiDownload />}
//                         onClick={handleDownloadTemplate}
//                     >
//                         Download
//                     </Button>
//                 </div>
//                 <div className="flex flex-col gap-2">
//                     <p>Upload Compliance File:</p>
//                     <Input
//                         type="file"
//                         accept=".xlsx,.xls"
//                         className="mb-4"
//                         onChange={handleFileChange}
//                     />
//                 </div>
//                 <p>Enter the Remark:</p>
//                 <textarea
//                     className="w-full p-2 border rounded mb-2"
//                     rows={3}
//                     placeholder="Enter remark"
//                     value={remark}
//                     onChange={(e) => setRemark(e.target.value)}
//                 />
//                 <div className="mt-6 text-right flex gap-2 justify-end items-center">
//                     <Button
//                         size="sm"
//                         className="mr-2"
//                         onClick={() => setIsDialogOpen(false)}
//                         disabled={isUploading}
//                     >
//                         Cancel
//                     </Button>
//                     <Button
//                         variant="solid"
//                         size="sm"
//                         onClick={handleBulkUpload}
//                         loading={isUploading}
//                     >
//                         {isUploading ? 'Uploading...' : 'Confirm'}
//                     </Button>
//                 </div>
//             </Dialog>
//         </AdaptableCard>
//     )
// }

// export default AuditChecklistPage





// AuditChecklistPage.tsx
import React, { useState, useEffect } from 'react'
import { AdaptableCard } from '@/components/shared'
import { Button, Dialog, Input, Notification, toast } from '@/components/ui'
import { HiDownload, HiUpload } from 'react-icons/hi'
import AuditChecklistTable from './components/AuditChecklistTable'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import OutlinedSelect from '@/components/ui/Outlined'
import Company from './components/Company' // Renamed from Company

interface CompanyOption {
  label: string
  value: string
  group_id: number
}

const AuditChecklistPage = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [companies, setCompanies] = useState<CompanyOption[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<CompanyOption | null>(null)
    const [bulkUploadCompany, setBulkUploadCompany] = useState<CompanyOption | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [remark, setRemark] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
    })
    const [filters, setFilters] = useState({
        company_id: '',
        state_id: '',
        branch_id: ''
    })


    useEffect(() => {
    const fetchCompanies = async () => {
        try {
            const response = await httpClient.get(endpoints.company.getAll());
            setCompanies(response.data.data.map((company: any) => ({
                label: company.name,
                value: String(company.id),
                group_id: company.group_id
            })));
        } catch (error) {
            console.error('Error fetching companies:', error);
            toast.push(
                <Notification title="Error" type="error">
                    Failed to load companies
                </Notification>
            );
        }
    };
    
    fetchCompanies();
}, []);


    // Fetch data function
const fetchData = async () => {
    try {
        setLoading(true)
        // Create params object with only non-empty filters
        const params: Record<string, any> = {
            page: pagination.pageIndex,
            page_size: pagination.pageSize,
            search: searchQuery
        };

        // Add filters only if they have values
        if (filters.company_id) params.company_id = filters.company_id;
        if (filters.state_id) params.state_id = filters.state_id;
        if (filters.branch_id) params.branch_id = filters.branch_id;

        const response = await httpClient.get(endpoints.compliance.listComplianceChecklist(), { params })
        setData(response.data.data)
        setPagination(prev => ({
            ...prev,
            total: response.data.paginate_data?.totalResults || 0
        }))
    } catch (error) {
        console.error('Error fetching compliance checklists:', error)
        toast.push(
            <Notification title="Error" type="error">
                Failed to load compliance checklists
            </Notification>
        )
    } finally {
        setLoading(false)
    }
}

    useEffect(() => {
        fetchData()
    }, [pagination.pageIndex, pagination.pageSize, searchQuery, filters])

    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters)
        // Reset to first page when filters change
        setPagination(prev => ({ ...prev, pageIndex: 1 }))
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
        // Reset to first page when searching
        setPagination(prev => ({ ...prev, pageIndex: 1 }))
    }

    const handlePageChange = (page: number) => {
        setPagination(prev => ({ ...prev, pageIndex: page }))
    }

    const handlePageSizeChange = (size: number) => {
        setPagination(prev => ({ ...prev, pageSize: size, pageIndex: 1 }))
    }

    const handleDownloadTemplate = async () => {
        try {
            if (!bulkUploadCompany) {
                toast.push(
                    <Notification title="Warning" type="warning">
                        Please select a company first
                    </Notification>
                )
                return
            }

            const response = await httpClient.get(
                endpoints.compliance.downloadComplianceTemplate(),
                {
                    params: { company_id: bulkUploadCompany.value },
                    responseType: 'blob'
                }
            )

            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'compliance_checklist_template.xlsx')
            document.body.appendChild(link)
            link.click()
            link.remove()

            toast.push(
                <Notification title="Success" type="success">
                    Template downloaded successfully
                </Notification>
            )
        } catch (error) {
            console.error('Error downloading template:', error)
            toast.push(
                <Notification title="Error" type="error">
                    Failed to download template
                </Notification>
            )
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0])
        }
    }

    const handleBulkUpload = async () => {
        if (!file || !bulkUploadCompany) {
            toast.push(
                <Notification title="Warning" type="warning">
                    Please select a file and company
                </Notification>
            )
            return
        }

        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('company_id', bulkUploadCompany.value)
            formData.append('group_id', bulkUploadCompany.group_id.toString())

            await httpClient.post(
                endpoints.compliance.bulkUploadCompliance(),
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )

            toast.push(
                <Notification title="Success" type="success">
                    File uploaded successfully
                </Notification>
            )
            setIsDialogOpen(false)
            fetchData() // Refresh data after upload
        } catch (error: any) {
          let errorMessage = 'Failed to import checklists';
          
          // Check if the error has response data with messages
          if (error.response?.data?.message) {
            // If it's an array of messages, join them with line breaks
            if (Array.isArray(error.response.data.message)) {
              errorMessage = error.response.data.message.join('\n');
            } else {
              errorMessage = error.response.data.message;
            }
          } else if (error.response?.data?.errors) {
            // If there are individual error objects with row numbers
            errorMessage = error.response.data.errors
              .map((err: any) => `Row ${err.row}: ${err.messages.join(', ')}`)
              .join('\n');
          }
        
          toast.push(
            <Notification title="Error" type="error">
              {errorMessage}
            </Notification>
          );
        }finally {
              setIsUploading(false);
            }
    }


    const handleDownloadData = async () => {
    try {
      

        // Create params object without company_id from filters
        const { company_id, ...restFilters } = filters;
        
        const response = await httpClient.get(
            endpoints.compliance.downloadComplianceChecklist(),
            {
                responseType: 'blob'
            });
        

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'compliance_checklist.xlsx')
        document.body.appendChild(link)
        link.click()
        link.remove()

        toast.push(
            <Notification title="Success" type="success">
                Data downloaded successfully
            </Notification>
        )
    } catch (error) {
        console.error('Error downloading data:', error)
        toast.push(
            <Notification title="Error" type="error">
                Failed to download data
            </Notification>
        )
    }
}


    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className='flex flex-col gap-8'>
                <div className='flex justify-between items-center mb-2'>
                    <div className="flex flex-row items-center justify-between">
                        <div className="">
                            <h3 className="text-2xl font-bold">Compliance Checklist</h3>
                            <p className="text-gray-600">View your company's compliance</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-2'>
                        <div>
                            <Input 
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>
                        <div>
                            <Button 
                                variant='solid' 
                                size='sm' 
                                icon={<HiDownload />}
                                onClick={handleDownloadData}
                            >
                                Download
                            </Button>
                        </div>
                        <div>
                            <Button 
                                variant='solid' 
                                size='sm' 
                                icon={<HiUpload />} 
                                onClick={() => setIsDialogOpen(true)}
                            >
                                Bulk Upload
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="mb-2">
                    <Company onFilterChange={handleFilterChange} />
                </div>

                <AuditChecklistTable
                    data={data}
                    loading={loading}
                    pagination={pagination}
                    onPaginationChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    onRefresh={fetchData}
                    searchQuery={searchQuery}
                />
            </div>

            {/* Bulk Upload Dialog */}
            <Dialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                width={450}
                shouldCloseOnOverlayClick={false}
            >
                <h5 className="mb-4">Bulk Upload</h5>
                <div className='flex flex-col gap-2'>
                    <label className="text-sm font-medium">Company</label>
                    <OutlinedSelect
                        label="Select Company"
                        options={companies}
                        value={bulkUploadCompany}
                        onChange={setBulkUploadCompany}
                    />
                </div>
                <div className="my-4 flex gap-2 items-center">
                    <p>Download Format</p>
                    <Button 
                        size="xs" 
                        icon={<HiDownload />}
                        onClick={handleDownloadTemplate}
                    >
                        Download
                    </Button>
                </div>
                <div className="flex flex-col gap-2">
                    <p>Upload Compliance File:</p>
                    <Input
                        type="file"
                        accept=".xlsx,.xls"
                        className="mb-4"
                        onChange={handleFileChange}
                    />
                </div>
                <p>Enter the Remark:</p>
                <textarea
                    className="w-full p-2 border rounded mb-2"
                    rows={3}
                    placeholder="Enter remark"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                />
                <div className="mt-6 text-right flex gap-2 justify-end items-center">
                    <Button
                        size="sm"
                        className="mr-2"
                        onClick={() => setIsDialogOpen(false)}
                        disabled={isUploading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        size="sm"
                        onClick={handleBulkUpload}
                        loading={isUploading}
                    >
                        {isUploading ? 'Uploading...' : 'Confirm'}
                    </Button>
                </div>
            </Dialog>
        </AdaptableCard>
    )
}

export default AuditChecklistPage