import { Button } from '@/components/ui'
import React from 'react'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import ReturnTrackerFilter from './ReturnTrackerFilter'
import ReturnTrackerTable from './ReturnTrackerTable'
import ReturnTrackerBulk from './ReturnTrackerBulk'

const ReturnTrackerTool = () => {
    const navigate = useNavigate()
  return (
    <div className='w-full'>
    <div className='flex gap-4 items-center mb-4 w-full'>
      <ReturnTrackerFilter/>
      {/* <CustomDateRangePicker onApply={handleDateRangeApply} /> */}
      <Button  
        variant="solid" 
        size="sm" 
        icon={<HiDownload />}
        // onClick={handleDownload}
      >
        Download Return Data
      </Button>
      <div>
        <ReturnTrackerBulk />
      </div>
      {/* {canCreate && ( */}
      <Button
        variant="solid"
        size="sm"
        icon={<HiPlusCircle />}
        onClick={() => navigate('/add-return-tracker')} // Adjust this path to match your routing structure
      >
        Add Return
      </Button>
    {/* )} */}
    </div>

    <div className="mt-8">
        <ReturnTrackerTable />
    </div>
  </div>
  )
}

export default ReturnTrackerTool