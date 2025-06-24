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

const AuditorTool: React.FC<{ onUploadSuccess?: () => void }> = ({ onUploadSuccess }) => {
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
            params.append('group_id[]', companyDetails.group_id.toString())

            const response = await httpClient.get(
                endpoints.auditor.auditorExport(), 
                {
                    params,
                    responseType: 'blob'
                }
            )

            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'auditor_data.xlsx')
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)

            toast.push(
                <Notification title="Success" type="success">
                    Auditor data downloaded successfully
                </Notification>
            )
        } catch (error) {
            console.error('Download failed:', error)
            toast.push(
                <Notification title="Error" type="error">
                    Failed to download auditor data
                </Notification>
            )
        }
    }

    const fetchCompanyData = async () => {
        try {
            const response = await httpClient.get(endpoints.company.getAll())
            const companies = response.data.data
            
            if (companies && companies.length > 0) {
                const firstCompany = companies[0]
                setCompanyDetails({
                    id: firstCompany.id,
                    name: firstCompany.name,
                    group_id: firstCompany.group_id
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
                onClick={() => navigate('/add-auditor', { 
                    state: { 
                        companyName: companyDetails?.name,
                        companyId: companyDetails?.id,
                        groupId: companyDetails?.group_id
                    } 
                })}
            >
                Add Auditor
            </Button>
        </div>
    )
}

export default AuditorTool