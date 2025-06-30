import React from 'react'
import { DataTable } from '@/components/shared'



const SalaryRegisterTable = ({ data }: { data: any[] }) => {

    const formatIndianNumber = (num: number): string => {
  const result = new Intl.NumberFormat('en-IN').format(num);
  return result;
};


    const columns = [
        {
            header: 'Company',
            accessorKey: 'company_name',
            cell: (row: any) => <div className="min-w-[150px]">{row.getValue()}</div>
        },
        {
            header: 'Month',
            accessorKey: 'month',
            cell: (row: any) => <div className="min-w-[100px]">{row.getValue()}</div>
        },
        {
            header: 'Year',
            accessorKey: 'year',
            cell: (row: any) => <div className="min-w-[80px]">{row.getValue()}</div>
        },
        {
            header: 'Employee Name',
            accessorFn: (row: any) => row.register_data?.['Employee Name'] || '--',
            cell: (row: any) => <div className="min-w-[150px]">{row.getValue()}</div>
        },
        {
            header: 'Employee Code',
            accessorFn: (row: any) => row.register_data?.['Employee Code'] || '--',
            cell: (row: any) => <div className="min-w-[100px]">{row.getValue()}</div>
        },
        {
            header: 'Basic Wages',
            accessorFn: (row: any) => row.register_data?.['Basic Wages'] || '--',
            cell: (row: any) => <div className="min-w-[100px]">{formatIndianNumber(row.getValue())}</div>
        },
        {
            header: 'D.A.',
            accessorFn: (row: any) => row.register_data?.['D.A.'] || '--',
            cell: (row: any) => <div className="min-w-[80px]">{formatIndianNumber(row.getValue())}</div>
        },
        {
            header: 'H.R.A.',
            accessorFn: (row: any) => row.register_data?.['H.R.A.'] || '--',
            cell: (row: any) => <div className="min-w-[80px]">{formatIndianNumber(row.getValue())}</div>
        },
        {
            header: 'Gross Salary',
            accessorFn: (row: any) => row.register_data?.['Gross Salary'] || '--',
            cell: (row: any) => <div className="min-w-[100px]">{formatIndianNumber(row.getValue())}</div>
        },
        {
            header: 'Created By',
            accessorKey: 'created_by_name',
            cell: (row: any) => <div className="min-w-[150px]">{row.getValue()}</div>
        },
        {
            header: 'Created At',
            accessorKey: 'created_at',
            cell: (row: any) => (
                <div className="min-w-[150px]">
                    {new Date(row.getValue()).toLocaleDateString()}
                </div>
            )
        }
    ]

    return (
        <div className="relative">
            <DataTable
                columns={columns}
                data={data}
                pagingData={{
                    total: data.length,
                    pageIndex: 1,
                    pageSize: 10
                }}
            />
        </div>
    )
}

export default SalaryRegisterTable