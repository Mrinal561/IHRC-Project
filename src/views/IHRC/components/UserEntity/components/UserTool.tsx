// import React, { useEffect, useState } from 'react'
// import { Button, toast, Notification } from '@/components/ui'
// import { HiDownload, HiPlusCircle } from 'react-icons/hi'
// import { useNavigate } from 'react-router-dom'
// import { useDispatch } from 'react-redux'
// import { APP_PREFIX_PATH } from '@/constants/route.constant'
// import { fetchUsers } from '@/store/slices/userEntity/UserEntitySlice'
// import { fetchCompanyGroups } from '@/store/slices/companyGroup/companyGroupSlice'
// import Bu from './Bu'
// import httpClient from '@/api/http-client'
// import { endpoints } from '@/api/endpoint'

// const UserTool: React.FC<{ onUploadSuccess?: () => void }> = ({ onUploadSuccess }) => {
//     const navigate = useNavigate()
//     const dispatch = useDispatch()
//     const [companyDetails, setCompanyDetails] = useState<{
//         id: number
//         name: string
//         group_id?: number
//     } | null>(null)

//     const handleClick = () => {
//         navigate('/add-user', {
//             state: {
//                 companyName: companyDetails?.name,
//                 companyId: companyDetails?.id,
//             },
//         })
//     }

//     const handleDownload = async () => {
//         if (!companyDetails) {
//             toast.push(
//                 <Notification title="Error" type="error">
//                     Company details not loaded yet
//                 </Notification>
//             )
//             return
//         }

//         try {
//             const queryParams = {
//                 ...(companyDetails.group_id && { group_id: [companyDetails.group_id] }),
//                 company_id: [companyDetails.id],
//             }

//             const response = await httpClient.get(endpoints.user.downloadData(), {
//                 params: queryParams,
//                 responseType: 'blob' // Important for file downloads
//             })

//             // Create download link
//             const url = window.URL.createObjectURL(new Blob([response.data]))
//             const link = document.createElement('a')
//             link.href = url
//             link.setAttribute('download', 'user_data.xlsx')
//             document.body.appendChild(link)
//             link.click()
            
//             // Clean up
//             link.parentNode?.removeChild(link)
//             window.URL.revokeObjectURL(url)

//             toast.push(
//                 <Notification title="Success" type="success">
//                     User data downloaded successfully
//                 </Notification>
//             )
//         } catch (error) {
//             console.error('Download failed:', error)
//             toast.push(
//                 <Notification title="Error" type="error">
//                     Failed to download user data
//                 </Notification>
//             )
//         }
//     }

//     const fetchCompanyData = async () => {
//         try {
//             const { data } = await dispatch(fetchCompanyGroups({})).unwrap()
//             console.log('data', data)

//             // Check if data exists and has at least one entry
//             if (Array.isArray(data) && data.length > 0) {
//                 const companyDetails = data[0]
//                 if (companyDetails) {
//                     setCompanyDetails({
//                         id: companyDetails.id,
//                         name: companyDetails.name,
//                     })
//                     console.log('Extracted Company Details:', {
//                         id: companyDetails.id,
//                         name: companyDetails.name,
//                     })
//                 } else {
//                     console.warn(
//                         'Company details not found in the first entry.',
//                     )
//                 }
//             } else {
//                 console.warn(
//                     'Data is not in the expected array format or is empty.',
//                 )
//             }
//         } catch (error) {
//             console.error('Failed to fetch company details:', error)
//         }
//     }

//     useEffect(() => {
//         console.log('Inside user tool now')
//         fetchCompanyData()
//     }, [])

//     return (
//         <div className="flex gap-3">
//              <Button 
//                 variant='solid' 
//                 size='sm' 
//                 icon={<HiDownload />}
//                 onClick={handleDownload}
//             >
//                 Download
//             </Button>
//             <Bu onUploadSuccess={onUploadSuccess}></Bu>
//             <Button
//                 variant="solid"
//                 icon={<HiPlusCircle />}
//                 size="sm"
//                 onClick={handleClick}
//             >
//                 Add User
//             </Button>
//         </div>
//     )
// }

// export default UserTool



import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { endpoints } from '@/api/endpoint'
import httpClient from '@/api/http-client'
import { Notification, toast } from '@/components/ui'
import Bu from './Bu'

interface CompanyDetails {
  id: number
  name: string
  group_id: number
}

const UserTool: React.FC<{ onUploadSuccess?: () => void }> = ({ onUploadSuccess }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null)

    const handleDownload = async () => {
        if (!companyDetails) {
            toast.push(
                <Notification title="Error" type="error">
                    Company details not loaded
                </Notification>
            )
            return
        }

        try {
            const params = new URLSearchParams()
            // params.append('company_id[]', companyDetails.id.toString())
            params.append('group_id[]', companyDetails.group_id.toString())

            const response = await httpClient.get(
                endpoints.user.downloadData(), 
                {
                    params,
                    responseType: 'blob'
                }
            )

            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'user_data.xlsx')
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)

            toast.push(
                <Notification title="Success" type="success">
                    User data downloaded successfully
                </Notification>
            )
        } catch (error) {
            console.error('Download failed:', error)
            toast.push(
                <Notification title="Error" type="error">
                    Failed to download user data
                </Notification>
            )
        }
    }

    const fetchCompanyData = async () => {
        try {
            // Use your existing company endpoint to get the first company
            const response = await httpClient.get(endpoints.company.getAll())
            console.log('Company data:', response.data.data)
            const companies = response.data.data
            
            if (companies && companies.length > 0) {
                const firstCompany = companies[0]
                setCompanyDetails({
                    id: firstCompany.id,
                    name: firstCompany.name,
                    group_id: firstCompany.group_id // Ensure this field exists in your API response
                })
            }
        } catch (error) {
            console.error('Failed to fetch company details:', error)
            toast.push(
                <Notification title="Error" type="error">
                    Failed to load company information
                </Notification>
            )
        }
    }

    useEffect(() => {
        fetchCompanyData()
    }, [])

    return (
        <div className="flex gap-3">
            <Button 
                variant='solid' 
                size='sm' 
                icon={<HiDownload />}
                onClick={handleDownload}
            >
                Download Data
            </Button>
            <Bu onUploadSuccess={onUploadSuccess} />
            <Button
                variant="solid"
                icon={<HiPlusCircle />}
                size="sm"
                onClick={() => navigate('/add-user', { 
                    state: { 
                        companyName: companyDetails?.name,
                        companyId: companyDetails?.id,
                        groupId: companyDetails?.group_id
                    } 
                })}
            >
                Add User
            </Button>
        </div>
    )
}

export default UserTool