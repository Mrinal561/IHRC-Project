// import { Button } from '@/components/ui'
// import React from 'react'
// import { HiDownload, HiPlusCircle } from 'react-icons/hi'
// import { useNavigate } from 'react-router-dom'

// const BranchAgreementTool = ({canCreate}) => {

//     const navigate = useNavigate();


//     const handleBranchAgreement = () => {
//         navigate(`/branch-agreement-form`)
//     }
//   return (
//     <div className='flex gap-2 items-center w- pb-6'>
//       <Button variant='solid' size='sm' icon={<HiDownload />}>Download</Button>
//         <div>
//           {canCreate && (
//             <Button variant='solid' onClick={handleBranchAgreement} icon={<HiPlusCircle />} size="sm" >Add Agreement</Button>
//           )}
//         </div>
//     </div>
//   )
// }

// export default BranchAgreementTool

import { Button } from '@/components/ui'
import React from 'react'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import { toast, Notification } from '@/components/ui'

interface FilterValues {
  company_id?: { value: string | number; label: string } | string | number
  branch_id?: { value: string | number; label: string } | string | number
  sub_category?: string
  agreement_type?: string
  group_id?: { value: string | number; label: string } | string | number
}

interface BranchAgreementToolProps {
  canCreate: boolean
  filters?: FilterValues
}

const BranchAgreementTool = ({ canCreate, filters }: BranchAgreementToolProps) => {
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)

  const handleBranchAgreement = () => {
    navigate(`/branch-agreement-form`)
  }

  const getValue = (value: any): string | number | undefined => {
    if (!value) return undefined
    if (typeof value === 'object' && value !== null) return value.value
    return value
  }

  const handleDownload = async () => {
    try {
      setLoading(true)
      
      // Prepare query parameters directly from filters
      const params: Record<string, any> = {}

      // Extract values from filters
      const companyId = getValue(filters?.company_id)
      const branchId = getValue(filters?.branch_id)
      const groupId = getValue(filters?.group_id)

      if (companyId) {
        params.company_id = companyId
      }

      if (branchId) {
        params.branch_id = branchId
      }

      if (groupId) {
        params.group_id = [groupId] // API expects array
      }

      // Add other filters
      if (filters?.sub_category) {
        params.sub_category = filters.sub_category
      }

      if (filters?.agreement_type) {
        params.agreement_type = filters.agreement_type
      }

      // Call the export API
      const response = await httpClient.get(endpoints.branchAgreement.download(), {
        params,
        responseType: 'blob'
      })

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `branch_agreements_${new Date().toISOString().split('T')[0]}.xlsx`)
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)

    } catch (error) {
      console.error('Download failed:', error)
      toast.push(
        <Notification title="Download Error" type="danger">
          Failed to download agreement data
        </Notification>
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex gap-2 items-center pb-6'>
      <Button 
        variant='solid' 
        size='sm' 
        icon={<HiDownload />}
        onClick={handleDownload}
        loading={loading}
      >
        Download Data
      </Button>
      <div>
        {canCreate && (
          <Button 
            variant='solid' 
            onClick={handleBranchAgreement} 
            icon={<HiPlusCircle />} 
            size="sm"
          >
            Add Agreement
          </Button>
        )}
      </div>
    </div>
  )
}

export default BranchAgreementTool