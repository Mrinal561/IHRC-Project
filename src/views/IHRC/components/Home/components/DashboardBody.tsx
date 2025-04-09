

import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json';
import BranchesDashboardCount from './staticDashboard/BranchesDashboardCount';
import SEDashboardCount from './staticDashboard/SEDashboardCount';
import AgreementsDashboardCount from './staticDashboard/AgreementsDashboardCount';
import RentalDepositsDashboard from './staticDashboard/RentalDepositsDashboard';
import NoticesDashboard from './staticDashboard/NoticesDasboard';
import Notices from './staticDashboard/Notices';
import ComplianceCalendar from './staticDashboard/ComplianceCalender';
import RevenueStackedColumn from './staticDashboard/RevenueStackedColumn';
import AnnualRevenueDonut from './staticDashboard/AnnualRevenueDonut';
import PaymentDateComparison from './staticDashboard/PaymentDateComparison';
import ChallanUploadCounts from './staticDashboard/ChallanUploadCounts';
import { useSelector } from 'react-redux';
import store, { useAppSelector } from '@/store';
import ComplinceStatus from './staticDashboard/CompliceStatus';
import ComplinceTool from './staticDashboard/ComplinceTool';
import Alerts from './staticDashboard/Alreat';
import TableFilter from '../../Registers&Return/input/SalaryRegister/components/TableFilter';
import RemittanceStatus from './staticDashboard/RemittenceStatus';
import Updateds from './staticDashboard/Updates';
import VirtualAgreement from './staticDashboard/VirtualAgreement';
import BranchOwnership from './staticDashboard/BranchOwnership';
import BranchTypes from './staticDashboard/BranchTypes';
import ComplianceStatusPie from './staticDashboard/ComplianceStatusPie';
import ComplianceStatus from './staticDashboard/ComplianceStatus';
import NoticeStatusPie from './staticDashboard/NoticeStatusPie';
import RemittanceBreakup from './staticDashboard/RemittanceBreakup';
import RegistrationsBreakup from './staticDashboard/RegistrationBreakup';
import RegistrationBreakup from './staticDashboard/RegistrationBreakup';
import LWF from './staticDashboard/LWF';
import SandEStatusPie from './staticDashboard/SandEStatusPie';
import AgreementStatus from './staticDashboard/AgreementStatus';
import BranchStatus from './staticDashboard/BranchStatus';

interface DashboardBodyProps {
    companyId: string | number;
    stateId?: string | number;
    districtId?: string | number;
    locationId?: string | number;
    branchId?: string | number;
    loading: boolean;
}

const DashboardBody: React.FC<DashboardBodyProps> = ({ companyId, stateId, districtId, locationId, branchId, loading }) => {

    const [sideCollapsed, setSideCollapsed] = useState<boolean>(() => {
        const storedValue = localStorage.getItem('sideCollapsed');
        return storedValue ? JSON.parse(storedValue) : false;
    });

    useEffect(() => {
        const handleStorageChange = () => {
            const newValue = JSON.parse(localStorage.getItem('sideCollapsed') || 'false');
            if (newValue !== sideCollapsed) {
                setSideCollapsed(newValue);
                console.log('sideCollapsed changed in DashboardBody:', newValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        const intervalId = setInterval(() => {
            const currentValue = JSON.parse(localStorage.getItem('sideCollapsed') || 'false');
            if (currentValue !== sideCollapsed) {
                setSideCollapsed(currentValue);
                console.log('sideCollapsed changed (interval check):', currentValue);
            }
        }, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(intervalId);
        };
    }, [sideCollapsed]);

    useEffect(() => {
        console.log('Initial sideCollapsed value in DashboardBody:', sideCollapsed);
    }, []);

    // if (loading) {
    //     console.log("Loading....................");
    //     return (
    //         <div className="flex flex-col items-center justify-center h-96 text-gray-500 rounded-xl">
    //             <div className="w-28 h-28">
    //                 <Lottie 
    //                     animationData={loadingAnimation} 
    //                     loop 
    //                     className="w-24 h-24"
    //                 />
    //             </div>
    //             <p className="text-lg font-semibold">
    //                 Loading Data...
    //             </p>
    //         </div>
    //     );
    // }

    console.log('DashboardBody rendering with:', { companyId, stateId, districtId, locationId, branchId });
    
    const getProps = () => {
        console.log('DashboardBody props:', { companyId, stateId, districtId, locationId, branchId });
      
        // Only include non-empty filter values in props
        const props: any = {};
        
        if (companyId) props.companyId = companyId;
        if (stateId) props.stateId = stateId;
        if (districtId) props.districtId = districtId;
        if (locationId) props.locationId = locationId;
        if (branchId) props.branchId = branchId;
        
        return props;
      };


    //   const {login} = store.getState();
    //   const moduleAccess = login.user.user.moduleAccess
    //   const moduleNames = moduleAccess.map(module => module.name);
      
      
    //   useEffect(() => {
    //       console.log('module names', moduleNames);
    //       console.log('module access ka data', moduleAccess);
    //   }, []);





    const props = getProps();

    if (!sideCollapsed) {
        return (
            <div className="flex flex-col gap-2 mt-1">
                {/* First Row */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
                    <div className="bg-white rounded-lg col-span-2 font-bold">
                        <BranchTypes {...props} />
                    </div>
                    <div className="bg-white rounded-lg col-span-2">
                        <BranchOwnership {...props} />
                    </div>
                    <div className="bg-white rounded-lg col-span-2">
                        <RentalDepositsDashboard {...props} />
                    </div>
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
                    <div className="col-span-2 bg-white rounded-lg p-2 shadow-lg border col-span-2">
                        <AgreementStatus {...props} />
                    </div>
                    <div className="bg-white rounded-lg col-span-2">
                        <SEDashboardCount {...props} />
                    </div>
                    <div className="col-span-2 bg-white p-2 rounded-lg shadow-lg border">
                        <SandEStatusPie {...props} />
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-6 gap-2'>
                    <div className="bg-white rounded-lg col-span-2">
                        <NoticesDashboard {...props} />
                    </div>
                    <div className="col-span-2 bg-white p-2 rounded-lg shadow-lg border">
                        <NoticeStatusPie {...props} />
                    </div>
                </div>

                {/* Fourth Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <RemittanceBreakup {...props} />
                    </div>
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <RegistrationBreakup {...props} />
                    </div>
                </div>

                {/* Fifth Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <ComplinceTool />
                    </div>
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <AnnualRevenueDonut  />
                    </div>
                </div>

                {/* Sixth Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <LWF />
                    </div>
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <ComplinceStatus />
                    </div>
                </div>

                {/* Seventh Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <ComplianceCalendar />
                    </div>
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <Updateds />
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="flex flex-col gap-2 mt-1">
                {/* First Row */}
                <div className="grid grid-cols-1 md:grid-cols-8 gap-2">
                    <div className="bg-white rounded-lg col-span-2 font-bold">
                        {/* <BranchTypes {...props} /> */}
                        <SEDashboardCount {...props} />
                    </div>
                    <div className="bg-white rounded-lg col-span-2">
                        <BranchOwnership {...props} />
                    </div>
                    <div className="bg-white rounded-lg col-span-2">
                        <RentalDepositsDashboard {...props} />
                    </div>
                    <div className="col-span-2 bg-white rounded-lg col-span-2">
                        <NoticesDashboard {...props} />
                    </div>
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 md:grid-cols-8 gap-2">
                <div className="bg-white p-1 rounded-lg shadow-lg border col-span-2">
                        <SandEStatusPie {...props} />
                    </div>
                    <div className="bg-white p-1 rounded-lg shadow-lg border col-span-2">
                        <BranchStatus {...props} />
                    </div>
                    <div className="bg-white rounded-lg p-1 shadow-lg border  col-span-2">
                        {/* <NoticesDashboard {...props} /> */}
                        <AgreementStatus {...props} />
                    </div>
                    <div className="bg-white p-1 rounded-lg shadow-lg border col-span-2">
                        <NoticeStatusPie {...props} />
                    </div>
                </div>

                {/* Fourth Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <RemittanceBreakup {...props} />
                    </div>
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <RegistrationBreakup {...props}/>
                    </div>
                </div>

                {/* Fifth Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <ComplinceTool {...props} />
                    </div>
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <AnnualRevenueDonut {...props} />
                    </div>
                </div>

                 {/* Sixth Row */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <LWF  {...props}/>
                    </div>
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <ComplinceStatus  {...props} />
                    </div>
                </div>

                {/* Seventh Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <ComplianceCalendar {...props} />
                    </div>
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <Updateds />
                    </div>
                </div>
            </div>
        );
    }
};

export default DashboardBody;