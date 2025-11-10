import { AdaptableCard } from '@/components/shared'
import React, { useState } from 'react'
import AuditorTable from './components/AuditorTable'
import AuditorTool from './components/AuditorTool'
import OutlinedInput from '@/components/ui/OutlinedInput'

const AuditorEntity = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const handleSearch = (value: string) => {
        setSearchTerm(value)
    }

    const handleDataRefresh = () => {
        setRefreshTrigger(prev => prev + 1)
    }

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
                <div className="flex items-center justify-between w-full">
                    <h3 className="text-2xl font-bold">Auditor</h3>
                    <div className="flex items-center gap-4">
                        <OutlinedInput
                            label="Search By Firm/Name/Email"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e)}
                        />
                        <div className="flex-shrink-0">
                            <AuditorTool onUploadSuccess={handleDataRefresh} />
                        </div>
                    </div>
                </div>
            </div>
            <AuditorTable search={searchTerm} refreshTrigger={refreshTrigger} />
        </AdaptableCard>
    )
}

export default AuditorEntity