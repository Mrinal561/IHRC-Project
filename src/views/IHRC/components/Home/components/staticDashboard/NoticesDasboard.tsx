

import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { Tooltip } from '@/components/ui';
import type { ColumnDef } from '@/components/shared/DataTable';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';


interface NoticeStatusProps {
    companyId?: string | number;
    stateId?: string | number;
    districtId?: string | number;
    locationId?: string | number;
    branchId?: string | number;
  }

 const NoticesDashboard: React.FC<NoticeStatusProps> = ({ 
     companyId, 
     stateId, 
     districtId, 
     locationId, 
     branchId 
   })  => {
     const [noticeData, setNoticeData] = useState([]);
       const [loading, setLoading] = useState<boolean>(true);


       useEffect(() => {
        const fetchNoticeStatus = async () => {
            try {
                const params: any = {};
                if (companyId) params.companyId = companyId;
                if (stateId) params.stateId = stateId;
                if (districtId) params.districtId = districtId;
                if (locationId) params.locationId = locationId;
                if (branchId) params.branchId = branchId;
                const response = await httpClient.get(endpoints.graph.noticeStatus(), {
                    params
                });
                setNoticeData(response.data);
            } catch (error) {
                console.error('Error fetching Notice Status Data:', error);
            } finally {
                setLoading(false);
              }
        };

        // if (companyId || stateId || districtId || locationId || branchId) {
            fetchNoticeStatus();
        // }
    }, [companyId, stateId, districtId, locationId, branchId]);

  const columns = useMemo(
      () => [
          {
              header: 'Status',
              accessorKey: 'name',
              enableSorting: false,
              cell: (props) => {
                  const value = props.getValue() as string;
                  const textColorClass = 
                  value === 'Closed' ? 'text-red-600' : 
                  value === 'Open' ? 'text-green-600' : 
                  '';
                  return (
                      <Tooltip title={value} placement="top">
                                                 <div className={`w-10.5 font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200 text-xs ${textColorClass}`}>
                                                     {value.length > 30
                                                         ? value.substring(0, 30) + '...'
                                                         : value}
                                                 </div>
                                             </Tooltip>
                  );
              },
          },
          {
              header: 'Total',
              accessorKey: 'value',
              enableSorting: false,
              cell: (props) => {
                   const row = props.row.original;
                                      const value = props.getValue() as string;
                                      return (
                                          <Tooltip title={value} placement="top">
                                              <div
                                                  className={`inline-flex items-center py-2 rounded-full text-xs font-semibold ${row.badgeColor}`}>
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
    <div className="w-full  overflow-x-auto py-2 bg-white rounded-lg shadow-lg border table-home h-100">
        <h2 className="text-base text-center font-semibold mb-2 mt-0">Notice Status</h2>
          <DataTable
              columns={columns}
              data={noticeData}
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

  export default NoticesDashboard;