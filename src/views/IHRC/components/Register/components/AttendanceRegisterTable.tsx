import React, { useMemo, useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { Tooltip } from '@/components/ui';
import cloneDeep from 'lodash/cloneDeep';
import type { OnSortParam, ColumnDef } from '@/components/shared/DataTable';

interface AttendanceRegisterData {
  id: number;
  uuid: string;
  company_id: number;
  company_name: string;
  branches: Array<{
    id: number;
    name: string;
    location: string;
    district: string;
    state: string;
  }>;
  register_type: string;
  register_data: {
    [key: string]: any;
    // Daily status
    "1": string; "2": string; "3": string; "4": string; "5": string;
    "6": string; "7": string; "8": string; "9": string; "10": string;
    "11": string; "12": string; "13": string; "14": string; "15": string;
    "16": string; "17": string; "18": string; "19": string; "20": string;
    "21": string; "22": string; "23": string; "24": string; "25": string;
    "26": string; "27": string; "28": string; "29": string; "30": string;
    "31"?: string;
    
    // Employee details
    "Employee Name": string;
    "Employee Number": string;
    "Father/Husband Name": string;
    "Gender": string;
    "DOB": string;
    "DOJ": string;
    "Job Title": string;
    "Location": string;
    "Reporting Manager": string;
    
    // Attendance summary
    "Total Days": number;
    "Present Days": number;
    "Absent Days": number;
    "Weekly Offs": number;
    "Holidays": number;
    "WFH": number;
    "WOH": number;
    "On Duty": number;
    "Missing Swipe Days": number;
    "Total Paid Leave": number;
    "Paid Leave Taken": number;
    "Penalized Paid Leave": number;
    "Pending Paid Leave Taken": number;
    "Total Unpaid Leave": number;
    "Unpaid Leave Taken": number;
    "Penalized Unpaid Leave": number;
    "Pending Unpaid Leave Taken": number;
    "Pending WFH": number;
    "Pending On Duty": number;
  };
  month: string;
  year: number;
  created_by: number;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

interface AttendanceRegisterTableProps {
  data: AttendanceRegisterData[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

const AttendanceRegisterTable = ({ data, meta }: AttendanceRegisterTableProps) => {
  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'P': 'text-green-600',
      'A': 'text-red-600',
      'WFH': 'text-blue-600',
      'WOH': 'text-blue-400',
      'OD': 'text-purple-600',
      'WO': 'text-gray-600',
      'H': 'text-orange-600',
      'MS': 'text-yellow-600',
      'PL': 'text-indigo-600',
      'UL': 'text-pink-600',
      'PPL': 'text-rose-600',
      'P(MS)': 'text-yellow-600'
    };
    return colors[status] || 'text-gray-900';
  };

  const getStatusFullName = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'P': 'Present',
      'A': 'Absent',
      'WFH': 'Work From Home',
      'WOH': 'Work From Office',
      'OD': 'On Duty',
      'WO': 'Weekly Off',
      'H': 'Holiday',
      'MS': 'Missing Swipe',
      'PL': 'Paid Leave',
      'UL': 'Unpaid Leave',
      'PPL': 'Penalized Paid Leave',
      'P(MS)': 'Present with Missing Swipe'
    };
    return statusMap[status] || status;
  };

  // Transform the data to include both register_data and top-level fields
  const transformedData = data.map(item => ({
    ...item.register_data,
    company_name: item.company_name,
    month: item.month,
    year: item.year,
    id: item.id,
    uuid: item.uuid,
    created_by_name: item.created_by_name,
    created_at: item.created_at,
    updated_at: item.updated_at
  }));

  const columns: ColumnDef<typeof transformedData[0]>[] = useMemo(
    () => [
        {
        header: 'Company',
        enableSorting: false,
        accessorKey: 'company_name',
        cell: (props) => (
          <div className="w-40 truncate">{props.getValue()}</div>
        ),
      },
      // Employee Information
      {
        header: 'Emp ID',
        enableSorting: false,
        accessorKey: 'Employee Number',
        cell: (props) => (
          <div className="w-24 truncate font-medium">{props.getValue()}</div>
        ),
      },
      {
        header: 'Employee Name',
        enableSorting: false,
        accessorKey: 'Employee Name',
        cell: (props) => {
          const value = props.getValue() as string;
          return (
            <Tooltip title={value} placement="top">
              <div className="w-40 truncate font-medium">
                {value}
              </div>
            </Tooltip>
          );
        },
      },
      {
        header: 'Father/Husband',
        enableSorting: false,
        accessorKey: 'Father/Husband Name',
        cell: (props) => (
          <div className="w-40 truncate">{props.getValue()}</div>
        ),
      },
      {
        header: 'Gender',
        enableSorting: false,
        accessorKey: 'Gender',
        cell: (props) => (
          <div className="w-20 truncate">{props.getValue()}</div>
        ),
      },
      {
        header: 'DOB',
        enableSorting: false,
        accessorKey: 'DOB',
        cell: (props) => {
          const date = new Date(props.getValue() as string);
          return (
            <div className="w-24 truncate">
              {date.toLocaleDateString('en-IN')}
            </div>
          );
        },
      },
      {
        header: 'DOJ',
        enableSorting: false,
        accessorKey: 'DOJ',
        cell: (props) => {
          const date = new Date(props.getValue() as string);
          return (
            <div className="w-24 truncate">
              {date.toLocaleDateString('en-IN')}
            </div>
          );
        },
      },
      
      // Job Details
      {
        header: 'Designation',
        enableSorting: false,
        accessorKey: 'Job Title',
        cell: (props) => (
          <div className="w-40 truncate">{props.getValue()}</div>
        ),
      },
      {
        header: 'Location',
        enableSorting: false,
        accessorKey: 'Location',
        cell: (props) => (
          <div className="w-32 truncate">{props.getValue()}</div>
        ),
      },
      {
        header: 'Reporting Manager',
        enableSorting: false,
        accessorKey: 'Reporting Manager',
        cell: (props) => (
          <div className="w-40 truncate">{props.getValue()}</div>
        ),
      },
      

      // Daily Attendance (1-31)
      ...Array.from({ length: 31 }, (_, i) => {
        const day = i + 1;
        return {
          header: day.toString(),
          enableSorting: false,
          accessorKey: day.toString(),
          cell: (props) => {
            const status = props.getValue() as string;
            if (!status) return <div className="w-8"></div>;
            return (
              <Tooltip title={`${day} ${data[0]?.month}: ${getStatusFullName(status)}`} placement="top">
                <div className={`w-8 text-center ${getStatusColor(status)}`}>
                  {status.split('(')[0]} {/* Show just P for P(MS) */}
                </div>
              </Tooltip>
            );
          },
        };
      }),

      // Attendance Summary
      {
        header: 'Present',
        enableSorting: false,
        accessorKey: 'Present Days',
        cell: (props) => (
          <div className="w-16 text-center text-green-600 font-medium">
            {props.getValue()}
          </div>
        ),
      },
      {
        header: 'WFH',
        enableSorting: false,
        accessorKey: 'WFH',
        cell: (props) => (
          <div className="w-12 text-center text-blue-600 font-medium">
            {props.getValue()}
          </div>
        ),
      },
      {
        header: 'WOH',
        enableSorting: false,
        accessorKey: 'WOH',
        cell: (props) => (
          <div className="w-12 text-center text-blue-400 font-medium">
            {props.getValue()}
          </div>
        ),
      },
      {
        header: 'OD',
        enableSorting: false,
        accessorKey: 'On Duty',
        cell: (props) => (
          <div className="w-12 text-center text-purple-600 font-medium">
            {props.getValue()}
          </div>
        ),
      },
      {
        header: 'WO',
        enableSorting: false,
        accessorKey: 'Weekly Offs',
        cell: (props) => (
          <div className="w-12 text-center text-gray-600 font-medium">
            {props.getValue()}
          </div>
        ),
      },
      {
        header: 'H',
        enableSorting: false,
        accessorKey: 'Holidays',
        cell: (props) => (
          <div className="w-12 text-center text-orange-600 font-medium">
            {props.getValue()}
          </div>
        ),
      },
      {
        header: 'PL',
        enableSorting: false,
        accessorKey: 'Paid Leave Taken',
        cell: (props) => (
          <div className="w-12 text-center text-indigo-600 font-medium">
            {props.getValue()}
          </div>
        ),
      },
      {
        header: 'UL',
        enableSorting: false,
        accessorKey: 'Unpaid Leave Taken',
        cell: (props) => (
          <div className="w-12 text-center text-pink-600 font-medium">
            {props.getValue()}
          </div>
        ),
      },
      {
        header: 'PPL',
        enableSorting: false,
        accessorKey: 'Penalized Paid Leave',
        cell: (props) => (
          <div className="w-12 text-center text-rose-600 font-medium">
            {props.getValue()}
          </div>
        ),
      },
      {
        header: 'MS',
        enableSorting: false,
        accessorKey: 'Missing Swipe Days',
        cell: (props) => (
          <div className="w-12 text-center text-yellow-600 font-medium">
            {props.getValue()}
          </div>
        ),
      },
      {
        header: 'Absent',
        enableSorting: false,
        accessorKey: 'Absent Days',
        cell: (props) => (
          <div className="w-12 text-center text-red-600 font-medium">
            {props.getValue()}
          </div>
        ),
      },
      {
        header: 'Total Days',
        enableSorting: false,
        accessorKey: 'Total Days',
        cell: (props) => (
          <div className="w-12 text-center font-bold">
            {props.getValue()}
          </div>
        ),
      },
    ],
    [data]
  );

  const [tableData, setTableData] = useState({
    total: meta.total,
    pageIndex: meta.page,
    pageSize: meta.limit,
    query: '',
    sort: { order: '', key: '' },
  });

  const onPaginationChange = (page: number) => {
    const newTableData = cloneDeep(tableData);
    newTableData.pageIndex = page;
    setTableData(newTableData);
  };

  const onSelectChange = (value: number) => {
    const newTableData = cloneDeep(tableData);
    newTableData.pageSize = Number(value);
    newTableData.pageIndex = 1;
    setTableData(newTableData);
  };

  const onSort = (sort: OnSortParam) => {
    const newTableData = cloneDeep(tableData);
    newTableData.sort = sort;
    setTableData(newTableData);
  };

  return (
    <div className="w-full overflow-x-auto">
     
      <DataTable
        columns={columns}
        data={transformedData}
        skeletonAvatarColumns={[0]}
        skeletonAvatarProps={{ className: 'rounded-md' }}
        loading={false}
        pagingData={{
          total: tableData.total,
          pageIndex: tableData.pageIndex,
          pageSize: tableData.pageSize,
        }}
        onPaginationChange={onPaginationChange}
        onSelectChange={onSelectChange}
        onSort={onSort}
        stickyHeader={true}
        stickyFirstColumn={true}
        selectable={true}
      />
    </div>
  );
};

export default AttendanceRegisterTable;