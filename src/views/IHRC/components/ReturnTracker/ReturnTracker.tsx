import { AdaptableCard } from '@/components/shared'
import React from 'react'
import ReturnTrackerTool from './components/ReturnTrackerTool'

const ReturnTracker = () => {
  return (
    <AdaptableCard className='h-full' bodyClass='h-full'>
      <div className="flex flex-wrap gap-6 items-center justify-between mb-6">
                <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold">Return Tracker</h3>
                </div>
                <ReturnTrackerTool/>
            </div>
    </AdaptableCard>
  )
}

export default ReturnTracker