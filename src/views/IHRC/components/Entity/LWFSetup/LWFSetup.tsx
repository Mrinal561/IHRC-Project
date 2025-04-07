import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Button, Dialog, toast, Notification } from '@/components/ui'
import { HiArrowLeft, HiDownload, HiPlusCircle } from 'react-icons/hi'
import LWFSetupPanel from './components/LWFSetupPanel'
import LWFSetupTable from './components/LWFSetupTable'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import { LWFSetupData } from '@/@types/lwfData'
import LWFBulkUpload from './components/LWFBulkUpload'
import OutlinedInput from '@/components/ui/OutlinedInput'

interface LocationState {
    companyName?: string
    companyGroupName?: string
}

const LWFSetupPage: React.FC = () => {
    const { companyName } = useParams<{ companyName: string }>()
    const navigate = useNavigate()
    const location = useLocation()
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [lwfSetupData, setLWFSetupData] = useState<LWFSetupData[]>([])
      const [stateSearch, setStateSearch] = useState('');
    
    const locationState = location.state as {
        companyName?: string
        companyGroupName?: string
        companyId?: string // Add companyId to the type
        groupId?: string
    }
    const actualCompanyId = locationState?.companyId
    const actualCompanyName = locationState?.companyName
    const actualGroupName = locationState?.companyGroupName
    const actualGroupId = locationState?.groupId
    const [pagination, setPagination] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
    })

    const fetchLWFSetupData = async () => {
        try {
            setIsLoading(true)
            const response = await httpClient.get(endpoints.lwfSetup.getAll(), {
                params: {
                    'company_id[]': actualCompanyId,
                    page: pagination.pageIndex,
                    page_size: pagination.pageSize,
                    ...(stateSearch && { 'state_name[]': stateSearch }),

                },
            })
            if (response?.data.data) {
                setLWFSetupData(response.data.data)
                setPagination((prev) => ({
                    ...prev,
                    total: response.data.paginate_data.totalResults,
                }))
            }
        } catch (error) {
            console.error('Error fetching LWF Setup data:', error)
            showNotification('Failed to fetch LWF Setup data')
        } finally {
            setIsLoading(false)
        }
    }
    const handlePaginationChange = (page: number) => {
        setPagination((prev) => ({ ...prev, pageIndex: page }))
    }

    const handlePageSizeChange = (newPageSize: number) => {
        setPagination((prev) => ({
            ...prev,
            pageSize: newPageSize,
            pageIndex: 1, // Reset to first page when changing page size
        }))
    }

    const refreshLWFSetupData = () => {
        fetchLWFSetupData()
        // showNotification('PF Setup data refreshed successfully');
    }

    const handleStateSearch = (value: string) => {
        setStateSearch(value);
      };
    
      // Handle state search submit
      const handleStateSearchSubmit = () => {
        setPagination(prev => ({ ...prev, pageIndex: 1 })); // Reset to first page when searching
        fetchLWFSetupData();
      };

    useEffect(() => {
        if (actualCompanyName) {
            fetchLWFSetupData()
        }
    }, [actualCompanyName, pagination.pageIndex, pagination.pageSize, stateSearch])

    const handleBack = () => {
        navigate(-1)
    }

    const handleAddLWFSetup = (newLWFSetup: LWFSetupData) => {
        try {
            setIsLoading(true)
            // Implement create logic here
            console.log('New LWF Setup:', newLWFSetup)
            setIsOpen(false)
            fetchLWFSetupData() // Refresh data
            showNotification('LWF Setup created successfully', 'success')
        } catch (error) {
            console.error('Error adding LWF setup:', error)
            showNotification('Failed to create LWF setup')
        } finally {
            setIsLoading(false)
        }
    }

    const showNotification = (
        message: string,
        type: 'success' | 'danger' = 'danger',
    ) => {
        toast.push(
            <Notification
                title={type === 'success' ? 'Success' : 'Error'}
                type={type}
            >
                <div className="flex items-center">
                    <span>{message}</span>
                </div>
            </Notification>,
        )
    }


    const handleDownload = async () => {
        if (!actualCompanyId || !actualGroupId) {
          toast.push(
            <Notification title="Error" type="error">
              Company information is incomplete
            </Notification>
          );
          return;
        }
    
        try {
          const params = new URLSearchParams();
          params.append('company_id[]', actualCompanyId);
          params.append('group_id[]', actualGroupId);
    
          const response = await httpClient.get(endpoints.lwfSetup.download(), {
            params,
            responseType: 'blob'
          });
    
          // Create download link
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'lwf_setup_data.xlsx');
          document.body.appendChild(link);
          link.click();
          
          // Clean up
          link.parentNode?.removeChild(link);
          window.URL.revokeObjectURL(url);
    
          toast.push(
            <Notification title="Success" type="success">
              LWF Setup data downloaded successfully
            </Notification>
          );
        } catch (error) {
          console.error('Download failed:', error);
          toast.push(
            <Notification title="Error" type="error">
              Failed to download LWF Setup data
            </Notification>
          );
        }
      };


    return (
        <div className="">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    {/* <div className="flex gap-3"> */}

                    <Button
                        variant="plain"
                        size="sm"
                        icon={<HiArrowLeft />}
                        onClick={handleBack}
                        className="mr-2"
                        ></Button>
                    <h1 className="text-2xl font-bold">
                        {actualCompanyName}-LWF Setup
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                <div className="relative">
              <OutlinedInput
                label="Search by state..."
                value={stateSearch}
                onChange={handleStateSearch}
                />
                                            </div>
                 <Button 
                                            variant='solid' 
                                            size='sm' 
                                            icon={<HiDownload />}
                                            onClick={handleDownload}
                                            >
                                            Download
                                          </Button>
                    <LWFBulkUpload
                        companyId={actualCompanyId}
                        onUploadSuccess={refreshLWFSetupData}
                        />
                    <Button
                        variant="solid"
                        size="sm"
                        icon={<HiPlusCircle />}
                        onClick={() => setIsOpen(true)}
                        >
                        Add LWF Setup
                    </Button>
                </div>
                        {/* </div> */}
            </div>

            <LWFSetupTable
                data={lwfSetupData}
                isLoading={isLoading}
                onRefresh={refreshLWFSetupData}
                pagination={pagination}
                onPaginationChange={handlePaginationChange}
                onPageSizeChange={handlePageSizeChange}
            />

            <Dialog
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onRequestClose={() => setIsOpen(false)}
                width={950}
                height={525}
                shouldCloseOnOverlayClick={false}
            >
                <h4 className="">Add LWF Setup</h4>
                <LWFSetupPanel
                    onClose={() => setIsOpen(false)}
                    addLWFSetup={handleAddLWFSetup}
                    companyId={actualCompanyId}
                    groupId={actualGroupId}
                    companyName={actualCompanyName}
                    groupName={actualGroupName}
                />
            </Dialog>
        </div>
    )
}

export default LWFSetupPage
