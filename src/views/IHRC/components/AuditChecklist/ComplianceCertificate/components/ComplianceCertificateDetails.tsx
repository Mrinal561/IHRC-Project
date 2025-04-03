// import React, { useEffect, useState } from 'react'
// import { Button, Notification, toast, Tooltip } from '@/components/ui'
// import DataTable from '@/components/shared/DataTable'
// import { ColumnDef } from '@/components/shared/DataTable'
// import { HiDownload } from 'react-icons/hi'
// import { useDispatch } from 'react-redux'
// import {
//     fetchCertificates,
//     downloadCertificate,
// } from '@/store/slices/certificate/certificateSlice'

// interface CertificateData {
//     id: number
//     company: string
//     company_group: string
//     month: number
//     year: number
//     created_at: string
// }

// interface DownloadCertificateButtonProps {
//     certificateId: number
// }

// const DownloadCertificateButton: React.FC<DownloadCertificateButtonProps> = ({
//     certificateId,
// }) => {
//     const [isDownloading, setIsDownloading] = useState(false)
//     const dispatch = useDispatch()

//     const handleDownload = async () => {
//         try {
//             setIsDownloading(true)
//             const response = await dispatch(
//                 downloadCertificate(certificateId.toString()),
//             )

//             if (response.payload === true) {
//                 toast.push(
//                     <Notification title="Success" type="success">
//                         Certificate downloaded successfully!
//                     </Notification>,
//                     {
//                         placement: 'top-end',
//                     },
//                 )
//             } else {
//                 throw new Error('Download failed')
//             }
//         } catch (error) {
//             toast.push(
//                 <Notification title="Error" closable={true} type="danger">
//                     Failed to download certificate. Please try again.
//                 </Notification>,
//                 {
//                     placement: 'top-end',
//                 },
//             )
//         } finally {
//             setIsDownloading(false)
//         }
//     }

//     return (
//         <Tooltip title="Download Compliance Certificate" placement="top">
//             <Button
//                 size="sm"
//                 icon={<HiDownload />}
//                 onClick={handleDownload}
//                 // loading={isDownloading}
//                 // disabled={isDownloading}
//             />
//         </Tooltip>
//     )
// }

// const ComplianceCertificateDetails = () => {
//     const [data, setData] = useState<CertificateData[]>([])
//     const [loading, setLoading] = useState(true)
//     const dispatch = useDispatch()

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true)
//                 const response = await dispatch(fetchCertificates())
//                 if (response.payload && response.payload.certificates) {
//                     setData(response.payload.certificates)
//                 }
//             } catch (error) {
//                 console.error('Error fetching certificates:', error)
//             } finally {
//                 setLoading(false)
//             }
//         }

//         fetchData()
//     }, [dispatch])

//     const getMonthName = (monthNumber: number) => {
//         const date = new Date()
//         date.setMonth(monthNumber - 1)
//         return date.toLocaleString('default', { month: 'long' })
//     }

//     const columns: ColumnDef<CertificateData>[] = [
//         {
//             header: 'Year',
//             accessorKey: 'year',
//         },
//         {
//             header: 'Month',
//             accessorKey: 'month',
//             cell: (props) => {
//                 const monthNumber = props.getValue() as number
//                 return getMonthName(monthNumber)
//             },
//         },
//         {
//             header: 'Action',
//             id: 'action',
//             cell: ({ row }) => (
//                 <DownloadCertificateButton certificateId={row.original.id} />
//             ),
//         },
//     ]

//     return (
//         <DataTable
//             columns={columns}
//             data={data}
//             skeletonAvatarColumns={[0]}
//             skeletonAvatarProps={{ className: 'rounded-md' }}
//             loading={loading}
//         />
//     )
// }

// export default ComplianceCertificateDetails

import React, { useState } from 'react'
import { Button, Notification, toast, Tooltip } from '@/components/ui'
import DataTable from '@/components/shared/DataTable'
import { ColumnDef } from '@/components/shared/DataTable'
import { HiDownload } from 'react-icons/hi'

interface CertificateData {
    id: number
    company: string
    company_group: string
    month: number
    year: number
    created_at: string
}

interface DownloadCertificateButtonProps {
    certificateId: number
}

const DownloadCertificateButton: React.FC<DownloadCertificateButtonProps> = ({
    certificateId,
}) => {
    const [isDownloading, setIsDownloading] = useState(false)

    const handleDownload = async () => {
        try {
            setIsDownloading(true)
            // Simulate download delay
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            toast.push(
                <Notification title="Success" type="success">
                    Certificate downloaded successfully!
                </Notification>,
                {
                    placement: 'top-end',
                },
            )
        } catch (error) {
            toast.push(
                <Notification title="Error" closable={true} type="danger">
                    Failed to download certificate. Please try again.
                </Notification>,
                {
                    placement: 'top-end',
                },
            )
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <Tooltip title="Download Compliance Certificate" placement="top">
            <Button
                size="sm"
                icon={<HiDownload />}
                onClick={handleDownload}
                loading={isDownloading}
                disabled={isDownloading}
            />
        </Tooltip>
    )
}

const ComplianceCertificateDetails = () => {
    // Dummy data for certificates
    const dummyData: CertificateData[] = [
        {
            id: 1,
            company: "ABC Corp",
            company_group: "Tech Group",
            month: 1, // January
            year: 2023,
            created_at: "2023-01-15T00:00:00Z"
        },
        {
            id: 2,
            company: "XYZ Ltd",
            company_group: "Finance Group",
            month: 6, // June
            year: 2023,
            created_at: "2023-06-20T00:00:00Z"
        },
        {
            id: 3,
            company: "Global Inc",
            company_group: "Services Group",
            month: 12, // December
            year: 2023,
            created_at: "2023-12-05T00:00:00Z"
        }
    ]

    const [data] = useState<CertificateData[]>(dummyData)
    const [loading] = useState(false) // Set to false since we're using dummy data

    const getMonthName = (monthNumber: number) => {
        const date = new Date()
        date.setMonth(monthNumber - 1)
        return date.toLocaleString('default', { month: 'long' })
    }

    const columns: ColumnDef<CertificateData>[] = [
        {
            header: 'Year',
            accessorKey: 'year',
        },
        {
            header: 'Month',
            accessorKey: 'month',
            cell: (props) => {
                const monthNumber = props.getValue() as number
                return getMonthName(monthNumber)
            },
        },
        {
            header: 'Company',
            accessorKey: 'company',
        },
        {
            header: 'Action',
            id: 'action',
            cell: ({ row }) => (
                <DownloadCertificateButton certificateId={row.original.id} />
            ),
        },
    ]

    return (
        <DataTable
            columns={columns}
            data={data}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ className: 'rounded-md' }}
            loading={loading}
        />
    )
}

export default ComplianceCertificateDetails
