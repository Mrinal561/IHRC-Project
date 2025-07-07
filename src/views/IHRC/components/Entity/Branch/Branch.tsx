// import React, { useState, useEffect, useCallback, useRef } from 'react'
// import AdaptableCard from '@/components/shared/AdaptableCard'
// import BranchTool from './components/BranchTool'
// import { EntityData } from '@/views/IHRC/store/dummyEntityData'
// import BranchTable from './components/BranchTable'
// import AddBranchForm from './components/BranchForms'
// import { fetchBranches } from '@/store/slices/branch/branchSlice'
// import { useAppDispatch } from '@/store'
// import { BranchData } from '@/@types/branch'
// import { toast, Notification } from '@/components/ui'
// import Company from '../../Home/components/Company'
// import OutlinedInput from '@/components/ui/OutlinedInput';

// interface SelectOption {
//     label: string
//     value: string
// }

// const Branch = () => {
//     const [searchTerm, setSearchTerm] = useState('')

//     const handleSearch = (value: string) => {
//         setSearchTerm(value)
//     }

//     const [selectedBranch, setSelectedBranch] = useState<SelectOption | null>(
//         null,
//     )
//     const [selectedCompanyGroup, setSelectedCompanyGroup] =
//         useState<SelectOption | null>(null)
//     const [selectedCompany, setSelectedCompany] = useState<SelectOption | null>(
//         null,
//     )
//     const [selectedState, setSelectedState] = useState<SelectOption | null>(
//         null,
//     )
//     const [selectedDistrict, setSelectedDistrict] =
//         useState<SelectOption | null>(null)
//     const [selectedLocation, setSelectedLocation] =
//         useState<SelectOption | null>(null)

//     const tableRefreshRef = useRef<(() => void) | null>(null)
//     // Method to set the refresh function
//     const setTableRefresh = useCallback((refreshFn: () => void) => {
//         tableRefreshRef.current = refreshFn
//     }, [])

//     // Method to trigger table refresh
//     const handleTableRefresh = () => {
//         if (tableRefreshRef.current) {
//             tableRefreshRef.current()
//         }
//     }
    

//     const filterValues = {
//         branchId: selectedBranch?.value,
//         companyGroupId: selectedCompanyGroup?.value,
//         companyId: selectedCompany?.value,
//         stateId: selectedState?.value,
//         districtId: selectedDistrict?.value,
//         locationId: selectedLocation?.value,
//         search: searchTerm,
//     }

//     return (
//         <AdaptableCard className="h-full" bodyClass="h-full">
//             <div className="flex flex-col justify-between gap-8 mb-2">
//                 <div className="mb-4 lg:mb-0 flex justify-between">
//                     <h3 className="text-2xl font-bold">Branch</h3>
//                     <div className="flex items-center gap-4">
//                         <OutlinedInput
//                             label="Search By Branch Name"
//                             value={searchTerm}
//                             onChange={(e) => handleSearch(e)}
//                         />
//                         <div className="flex-shrink-0">
//                             <BranchTool 
//                             onTableRefresh={handleTableRefresh} 
//                             companyGroupId={selectedCompanyGroup?.value}
//                             companyId={selectedCompany?.value} />
//                         </div>
//                     </div>
//                 </div>
//                 {/* Modified this div to be more flexible */}
//                 <div className="mb-8 flex flex-col lg:flex-row gap-4 w-full">
//                     {/* Wrap Company component in a div that grows to fill available space */}
//                     <div className="flex-1 flex flex-wrap gap-4">
//                         <Company
//                             onBranchChange={setSelectedBranch}
//                             onCompanyGroupChange={setSelectedCompanyGroup}
//                             onCompanyChange={setSelectedCompany}
//                             onStateChange={setSelectedState}
//                             onDistrictChange={setSelectedDistrict}
//                             onLocationChange={setSelectedLocation}
//                         />
//                     </div>
//                     {/* Add Branch button will maintain its size */}
//                 </div>
//             </div>
//             {/* <BranchTable filterValues={filterValues}/> */}
//             <BranchTable
//                 filterValues={filterValues}
//                 onRefreshMethodAvailable={setTableRefresh}
//             />
//         </AdaptableCard>
//     )
// }

// export default Branch




import React, { useState, useEffect, useCallback, useRef } from 'react'
import AdaptableCard from '@/components/shared/AdaptableCard'
import BranchTool from './components/BranchTool'
import { EntityData } from '@/views/IHRC/store/dummyEntityData'
import BranchTable from './components/BranchTable'
import AddBranchForm from './components/BranchForms'
import { fetchBranches } from '@/store/slices/branch/branchSlice'
import { useAppDispatch } from '@/store'
import { BranchData } from '@/@types/branch'
import { toast, Notification } from '@/components/ui'
import Company from '../../Home/components/Company'
import OutlinedInput from '@/components/ui/OutlinedInput';

interface SelectOption {
    label: string
    value: string
}

const Branch = () => {
    const [searchTerm, setSearchTerm] = useState('')

    const handleSearch = (value: string) => {
        setSearchTerm(value)
    }

    const [selectedBranch, setSelectedBranch] = useState<SelectOption | null>(
        null,
    )
    const [selectedCompanyGroup, setSelectedCompanyGroup] =
        useState<SelectOption | null>(null)
    const [selectedCompany, setSelectedCompany] = useState<SelectOption | null>(
        null,
    )
    const [selectedState, setSelectedState] = useState<SelectOption | null>(
        null,
    )
    const [selectedDistrict, setSelectedDistrict] =
        useState<SelectOption | null>(null)
    const [selectedLocation, setSelectedLocation] =
        useState<SelectOption | null>(null)

    const tableRefreshRef = useRef<(() => void) | null>(null)
    // Method to set the refresh function
    const setTableRefresh = useCallback((refreshFn: () => void) => {
        tableRefreshRef.current = refreshFn
    }, [])

    // Method to trigger table refresh
    const handleTableRefresh = () => {
        if (tableRefreshRef.current) {
            tableRefreshRef.current()
        }
    }
    

    const filterValues = {
        branchId: selectedBranch?.value,
        companyGroupId: selectedCompanyGroup?.value,
        companyId: selectedCompany?.value,
        stateId: selectedState?.value,
        districtId: selectedDistrict?.value,
        locationId: selectedLocation?.value,
        search: searchTerm,
    }

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="flex flex-col justify-between gap-8 mb-2">
                <div className="mb-4 lg:mb-0 flex justify-between">
                    <h3 className="text-2xl font-bold">Branch</h3>
                    <div className="flex items-center gap-4">
                        <OutlinedInput
                            label="Search By Branch Name"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e)}
                        />
                        <div className="flex-shrink-0">
                            <BranchTool 
                            onTableRefresh={handleTableRefresh} 
                            companyGroupId={selectedCompanyGroup?.value}
                            companyId={selectedCompany?.value} />
                        </div>
                    </div>
                </div>
                {/* Modified this div to be more flexible */}
                <div className="mb-8 flex flex-col lg:flex-row gap-4 w-full">
                    {/* Wrap Company component in a div that grows to fill available space */}
                    <div className="flex-1 flex flex-wrap gap-4">
                        <Company
                            onBranchChange={setSelectedBranch}
                            onCompanyGroupChange={setSelectedCompanyGroup}
                            onCompanyChange={setSelectedCompany}
                            onStateChange={setSelectedState}
                            onDistrictChange={setSelectedDistrict}
                            onLocationChange={setSelectedLocation}
                        />
                    </div>
                    {/* Add Branch button will maintain its size */}
                </div>
            </div>
            {/* <BranchTable filterValues={filterValues}/> */}
            <BranchTable
                filterValues={filterValues}
                onRefreshMethodAvailable={setTableRefresh}
            />
        </AdaptableCard>
    )
}

export default Branch