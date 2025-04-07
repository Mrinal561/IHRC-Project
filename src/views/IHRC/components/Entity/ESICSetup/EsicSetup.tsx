import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Button, Dialog, toast, Notification } from '@/components/ui'
import { HiArrowLeft, HiDownload, HiPlusCircle } from 'react-icons/hi'
import { setPanelExpand, useAppDispatch } from '@/store'
import ESISetupPanel from './components/ESISetupPanel'
import ESISetupTable from './components/EsicSetupTable'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import ESIBulkUpload from './components/ESIBulkUpload'

export interface ESISetupData {
    Company_Group_Name: string
    Company_Name: string
    esiCodeType: string
    esiCode: string
    esiCodeLocation: string
    esiUserId?: string
    esiPassword?: string
    authorizedSignatory: string
    signatoryDesignation?: string
    signatoryMobile?: string
    signatoryEmail?: string
    esiRegistrationCertificate?: File | null
    id?: number
}

interface LocationState {
    companyName?: string
    companyGroupName?: string
    companyId?: string
    groupId?: string
}

const CompanyESISetupPage: React.FC = () => {
    const { companyName } = useParams<{ companyName: string }>()
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useAppDispatch()
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [esiSetupData, setESISetupData] = useState<ESISetupData[]>([])
    const [companyData, setCompanyData] = useState<{
        Company_Group_Name: string
        Company_Name: string
    } | null>(null)
    const locationState = location.state as LocationState
    const [esiSetups, setEsiSetups] = useState([])
    const [loading, setLoading] = useState(false)
    const actualCompanyId = locationState?.companyId
    const actualCompanyName = locationState?.companyName
    const actualGroupName = locationState?.companyGroupName
    const actualGroupId = locationState?.groupId
    const [pagination, setPagination] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
    })
    // Function to fetch ESI setups and refresh table data
    const refreshData = async () => {
        setLoading(true)
        try {
            const response = await httpClient.get(endpoints.esiSetup.getAll())
            setEsiSetups(response.data) // Update with fetched data
        } catch (error) {
            console.error('Failed to fetch ESI setups:', error)
        } finally {
            setLoading(false)
        }
    }

    // const actualCompanyName = location.state?.companyName || decodeURIComponent(companyName || '').replace(/-/g, ' ');
    // const actualCompanyGroupName = locationState?.companyGroupName || '';

    const showNotification = (type: 'success' | 'danger', message: string) => {
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

    // Fetch company data
    const fetchCompanyData = async () => {
        try {
            const response = await httpClient.get(
                endpoints.company.getAll(actualCompanyName),
            )
            setCompanyData(response.data)
        } catch (error: any) {
            console.error('Error fetching company data:', error)
            showNotification(
                'danger',
                error.response?.data?.message || 'Failed to fetch company data',
            )
        }
    }

    // Fetch ESI setup data
    const fetchESISetupData = async () => {
        try {
            setIsLoading(true)
            const response = await httpClient.get(endpoints.esiSetup.getAll(), {
                params: {
                    'company_id[]': actualCompanyId,
                    page: pagination.pageIndex,
                    page_size: pagination.pageSize,
                },
            })
            if (response?.data.data) {
                setESISetupData(response.data.data)
                setPagination((prev) => ({
                    ...prev,
                    total: response.data.paginate_data.totalResults,
                }))
            }
        } catch (error: any) {
            console.error('Error fetching ESI setup data:', error)
            showNotification(
                'danger',
                error.response?.data?.message ||
                    'Failed to fetch ESI setup data',
            )
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
    const refreshESISetupData = () => {
        fetchESISetupData()
        // showNotification('PF Setup data refreshed successfully');
    }

    useEffect(() => {
        if (actualCompanyName) {
            fetchESISetupData()
        }
    }, [actualCompanyName, pagination.pageIndex, pagination.pageSize])

    const handleBack = () => {
        navigate(-1)
    }

    const handleAddESISetup = async (newESISetup: ESISetupData) => {
        try {
            setIsLoading(true)
            // const response = await httpClient.post(endpoints.esiSetup.create(), newESISetup);
            // showNotification('success', 'ESI Setup created successfully');

            fetchESISetupData() // Refresh the list
            // refreshData();
        } catch (error: any) {
            console.error('Error adding ESI setup:', error)
            // showNotification('danger', error.response?.data?.message || 'Failed to create ESI setup');
            // toast.push(
            //   <Notification title="Error" closable={true} type="danger">
            //     Failed to create ESI setup
            //   </Notification>
            // );
        } finally {
            setIsLoading(false)
        }
    }
    const handleClose = () => {
        setIsOpen(false)
    }
    //   const handleAddESISetup = async (newESISetup: ESISetupData) => {
    //  try {
    //    setIsLoading(true);
    //    setIsOpen(false);
    //     fetchESISetupData();
    //    showNotification('success', 'ESI Setup created successfully');
    //  } catch (error: any) {
    //    console.error('Error adding ESI setup:', error);
    //    showNotification('danger', error.response?.data?.message || 'Failed to create ESI setup');
    //  } finally {
    //    setIsLoading(false);
    //  }
    // };

    // const [key, setKey] = useState(0);
    // const refreshData = () => {
    //   setKey(prev => prev + 1);
    // };

    // useEffect(() => {
    //   refreshData();
    // }, [handleAddESISetup]);

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
    
          const response = await httpClient.get(endpoints.esiSetup.downloadData(), {
            params,
            responseType: 'blob'
          });
    
          // Create download link
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'esi_setup_data.xlsx');
          document.body.appendChild(link);
          link.click();
          
          // Clean up
          link.parentNode?.removeChild(link);
          window.URL.revokeObjectURL(url);
    
          toast.push(
            <Notification title="Success" type="success">
              ESI Setup data downloaded successfully
            </Notification>
          );
        } catch (error) {
          console.error('Download failed:', error);
          toast.push(
            <Notification title="Error" type="error">
              Failed to download ESI Setup data
            </Notification>
          );
        }
      };

      const refreshPTSetupData = () => {
        fetchESISetupData();
        // showNotification('PF Setup data refreshed successfully');
      };

    return (
        <div className="">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <Button
                        variant="plain"
                        size="sm"
                        icon={<HiArrowLeft />}
                        onClick={handleBack}
                        className="mr-2"
                    ></Button>
                    <h1 className="text-2xl font-bold">
                        {actualCompanyName}- ESI Setup
                    </h1>
                </div>
                <div className='flex gap-2'>

                <Button 
                            variant='solid' 
                            size='sm' 
                            icon={<HiDownload />}
                            onClick={handleDownload}
                            >
                            Download
                          </Button>
                          <ESIBulkUpload  companyId={actualCompanyId}
                        onUploadSuccess={refreshPTSetupData}/>
                <Button
                    variant="solid"
                    size="sm"
                    icon={<HiPlusCircle />}
                    onClick={() => setIsOpen(true)}
                    disabled={isLoading}
                    >
                    Add ESI Setup
                </Button>
                    </div>
            </div>

            <ESISetupTable
                data={esiSetupData}
                // onDelete={handleDelete}
                // onEdit={handleEdit}
                isLoading={isLoading}
                onRefresh={refreshESISetupData}
                // refreshData={fetchESISetupData}
                pagination={pagination}
                onPaginationChange={handlePaginationChange}
                onPageSizeChange={handlePageSizeChange}
            />

            <Dialog
                isOpen={isOpen}
                onClose={handleClose}
                onRequestClose={() => setIsOpen(false)}
                width={950}
                height={535}
                shouldCloseOnOverlayClick={false}
            >
                <h4 className="mb-1">Add ESI Setup</h4>
                <ESISetupPanel
                    onClose={handleClose}
                    addESISetup={handleAddESISetup}
                    refreshData={fetchESISetupData}
                    companyId={actualCompanyId}
                    groupId={actualGroupId}
                    companyName={actualCompanyName}
                    groupName={actualGroupName}
                />
            </Dialog>
        </div>
    )
}

export default CompanyESISetupPage
