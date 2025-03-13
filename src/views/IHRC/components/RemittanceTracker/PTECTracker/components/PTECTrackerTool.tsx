import React, { useState } from 'react'
import UploadedPTDetails from './UploadedPTECDetails'
import PTRCTrackerFilter from './PTECTrackerFilter'
import PTRCTrackerBulkUpload from './PTECTrackerBulkUpload.js'
import CustomDateRangePicker from './CustomDateRangePicker'
import { Button, toast, Notification } from '@/components/ui'
import { HiDownload } from 'react-icons/hi'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'

const PTECTrackerTool: React.FC<{
    onFilterChange: (filters: {
        groupName: string
        groupId: string
        companyName: string
        companyId: string
        ptCode: string
        startDate: string | null
        endDate: string | null
        // search: string
        location_name: string | null;
    }) => void
    canCreate: boolean
}> = ({ onFilterChange, canCreate }) => {
    const [showUploadedDetails, setShowUploadedDetails] = useState(false)
    const [filters, setFilters] = useState({
        groupName: '',
        groupId: '',
        companyName: '',
        companyId: '',
        ptCode: '',
        startDate: '',
        endDate: '',
        // search: '',
         location_name: ''
    })
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)

    const handleUploadConfirm = () => {
        setShowUploadedDetails(true)
    }

    const handleBack = () => {
        setShowUploadedDetails(false)
    }

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters)
        onFilterChange(newFilters)
    }

    const handleDateRangeApply = (start: Date, end: Date) => {
        setStartDate(start)
        setEndDate(end)

        // console.log(startDate, endDate)
        setFilters((prevFilters) => ({
            ...prevFilters,
            startDate: start ? start.toISOString().split('T')[0] : null, // Format: YYYY-MM-DD
            endDate: end ? end.toISOString().split('T')[0] : null,
        }))

        // Also call onFilterChange to notify parent component
        onFilterChange({
            ...filters,
            startDate: start ? start.toISOString().split('T')[0] : null,
            endDate: end ? end.toISOString().split('T')[0] : null,
        })
    }

    const handleDownload = async () => {
        try {
            if (!filters.groupId && !filters.ptCode && !filters.companyId) {
                toast.push(
                    <Notification
                        title="Warning"
                        type="warning"
                        closable={true}
                        duration={10000}
                    >
                        Atleast Select One Company To Download The Data
                    </Notification>,
                )
                return
            }
            const formattedStartDate = filters.startDate
                ? new Date(filters.startDate)
                      .toISOString()
                      .split('T')[0]
                      .replace(/-/g, '/')
                : ''
            const formattedEndDate = filters.endDate
                ? new Date(filters.endDate)
                      .toISOString()
                      .split('T')[0]
                      .replace(/-/g, '/')
                : ''

            const res = await httpClient.get(endpoints.ptec.downloadAll(), {
                responseType: 'blob',
                params: {
                    'group_id[]': filters.groupId,
                    'code[]': filters.ptCode,
                    'company_id[]': filters.companyId,
                    'to_date': formattedEndDate,
                    'from_date': formattedStartDate,
                },
            })
            if (res) {
                const blob = new Blob([res.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                })
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', 'PTECData.xlsx')
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                window.URL.revokeObjectURL(url) // Clean up the URL object
            }
        } catch (error) {
            console.error('Error downloading PTEC data:', error)
            // Here you might want to show an error notification to the user
            throw error
        }
    }

    if (showUploadedDetails) {
        return <UploadedPTDetails onBack={handleBack} />
    }

    return (
        <div className="w-full">
            <div className="flex gap-4 items-center mb-4 w-full">
                <PTRCTrackerFilter onFilterChange={handleFilterChange} />
                <CustomDateRangePicker onApply={handleDateRangeApply} />
                <Button
                    variant="solid"
                    size="sm"
                    icon={<HiDownload />}
                    onClick={handleDownload}
                >
                    Download PT EC Data
                </Button>
                <PTRCTrackerBulkUpload
                    onUploadConfirm={handleUploadConfirm}
                    canCreate={canCreate}
                />
            </div>
        </div>
    )
}

export default PTECTrackerTool
