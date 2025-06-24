import React from 'react'
import AdaptableCard from '@/components/shared/AdaptableCard'
import CustomChecklistTool from './components/CustomChecklistTool'
import CustomChecklistTable from './components/CustomChecklistTable';
import  Company  from '../../Home/components/Company'
const CustomChecklist = () => {
  return (
     <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
                <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold">Custom Checklist</h3>
                    <p className="text-gray-600">View your company's custom compliance</p>
                </div>
                <CustomChecklistTool />
      </div>
      {/* <div className='mb-8'> */}
      {/* <Company /> */}
      {/* </div> */}
    <CustomChecklistTable/>
 </AdaptableCard>
  )
}

export default CustomChecklist