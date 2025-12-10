import { AdaptableCard } from '@/components/shared'
import React from 'react'
import RegisterTrackerTool from './components/RegisterTrackerTool'

const RegisterTracker = () => {
  return (
    <AdaptableCard className='h-full' bodyClass='h-full'>
      <div className="flex flex-wrap gap-6 items-center justify-between mb-6">
        <div className="mb-4 lg:mb-0">
          <h3 className="text-2xl font-bold">Register</h3>
        </div>
        <RegisterTrackerTool />
      </div>
    </AdaptableCard>
  )
}

export default RegisterTracker