import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { Tooltip } from '@/components/ui';
import type { ColumnDef } from '@/components/shared/DataTable';
import { endpoints } from '@/api/endpoint';
import httpClient from '@/api/http-client';

interface BranchStatusProps {
    companyId?: string | number;
    stateId?: string | number;
    districtId?: string | number;
    locationId?: string | number;
    branchId?: string | number;
  }


 const BranchOwnership: React.FC<BranchStatusProps> = ({ 
    companyId, 
    stateId, 
    districtId, 
    locationId, 
    branchId 
  }) => {
    // const ownershipData = [
    //     { name: 'Rented', ph: '50', vr: '100', value: '150' },
    //     { name: 'Owned', ph: '50', vr: '100', value: '150', },
    //     { name: 'Total',ph: '100', vr: '200', value: '300'  },
    // ];
    const [ ownershipData, setOwnershipData ] = useState([])
          const [loading, setLoading] = useState<boolean>(true);
    


    useEffect(() => {
        const fetchBranchStatus = async () => {
            try {
                const params: any = {};
                if (companyId) params.companyId = companyId;
                if (stateId) params.stateId = stateId; // Include stateId in API call
                if (districtId) params.districtId = districtId;
                if (locationId) params.locationId = locationId;
                if (branchId) params.branchId = branchId;

                const response = await httpClient.get(endpoints.graph.branchStatus() , {
                    params
                });
                setOwnershipData(response.data);
            } catch (error) {
                console.error('Error fetching Branch Status Data:', error);
            } finally {
                setLoading(false);
              }
        };

        // if (companyId || stateId || districtId || locationId || branchId) {
            fetchBranchStatus();
        // }
    }, [companyId, stateId, districtId, locationId, branchId]);

    
    const columns = useMemo(
        () => [
            {
                header: 'Type',
                accessorKey: 'name',
                enableSorting: false,
                cell: (props) => {
                    // const value = props.getValue() as string;
                    // return (
                    //     <Tooltip title={value} placement="top">
                    //         <div className="font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200 text-xs w-18">
                    //             {value.length > 30 ? value.substring(0, 30) + '...' : value}
                    //         </div>
                    //     </Tooltip>
                    const value = props.getValue() as string;
                    // Determine text color based on type
                    let textColor = 'text-gray-700';
                    if (value.toLowerCase() === 'rented') {
                        textColor = 'text-[#ffc107]'; // Yellow for Rented
                    } else if (value.toLowerCase() === 'owned') {
                        textColor = 'text-[#0ea5e9]'; // Blue for Owned
                    } else if (value.toLowerCase() === 'total') {
                        textColor = 'text-gray-900 font-bold'; // Dark gray and bold for Total
                    }
                    
                    return (
                        <Tooltip title={value} placement="top">
                            <div className={`font-semibold hover:text-blue-600 transition-colors duration-200 text-xs w-18 ${textColor}`}>
                                {value.length > 30 ? value.substring(0, 30) + '...' : value}
                            </div>
                        </Tooltip>
                    );
                },
            },
            // {
            //     header: 'PH',
            //     accessorKey: 'ph',
            //     enableSorting: false,
            //     cell: (props) => {
            //         const value = props.getValue() as string;
            //         return (
            //             <Tooltip title={value} placement="top">
            //                 <div className="font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200 text-xs">
            //                     {value.length > 30 ? value.substring(0, 30) + '...' : value}
            //                 </div>
            //             </Tooltip>
            //         );
            //     },
            // },
            // {
            //     header: 'VR',
            //     accessorKey: 'vr',
            //     enableSorting: false,
            //     cell: (props) => {
            //         const value = props.getValue() as string;
            //         return (
            //             <Tooltip title={value} placement="top">
            //                 <div className="inline-flex items-center rounded-full text-xs font-semibold">
            //                     {value.length > 30 ? value.substring(0, 30) + '...' : value}
            //                 </div>
            //             </Tooltip>
            //         );
            //     },
            // },
            {
                header: 'Total',
                accessorKey: 'value',
                enableSorting: false,
                cell: (props) => {
                //    const row = props.row.original;
                //                        const value = props.getValue() as string;
                //                        return (
                //                            <Tooltip title={value} placement="top">
                //                                <div
                //                                    className={`inline-flex items-center py-2 rounded-full text-xs text-center font-semibold ${row.badgeColor}`}>
                //                 {value.length > 18 ? value.substring(0, 18) + '...' : value}
                //             </div>
                //         </Tooltip>
                const row = props.row.original;
                const value = props.getValue() as string;
                
                // Determine text color based on the name
                let textColor = 'text-gray-700';
                if (row.name.toLowerCase() === 'rented') {
                    textColor = 'text-[#ffc107]'; // Yellow for Rented
                } else if (row.name.toLowerCase() === 'owned') {
                    textColor = 'text-[#0ea5e9]'; // Blue for Owned
                } else if (row.name.toLowerCase() === 'total') {
                    textColor = 'text-gray-900 font-bold'; // Dark gray and bold for Total
                }
                
                return (
                    <Tooltip title={value} placement="top">
                        <div className={`inline-flex items-center py-2 rounded-full text-xs text-center font-semibold ${textColor}`}>
                            {value.length > 18 ? value.substring(0, 18) + '...' : value}
                        </div>
                    </Tooltip>
                    );
                },
            },
        ],
        []
    );

    return (
        <div className="w-full overflow-x-auto py-2 bg-white rounded-lg shadow-lg border table-home">
           <h2 className="text-base text-center font-semibold mb-2 mt-0">Branch Status</h2>
            <DataTable
                columns={columns}
                data={ownershipData}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ className: 'rounded-md' }}
                loading={loading}
                stickyHeader={true}
                selectable={false}
                showPageSizeSelector={false} 
            />
        </div>
    );
};

export default BranchOwnership;