import React from 'react'
import { DataTable } from '@/components/shared'

const SalaryRegisterTable = ({ data }: { data: any[] }) => {
    const formatIndianNumber = (num: number): string => {
        if (num === 0) return '0' // Explicitly handle zero values
        if (!num) return '--'
        return new Intl.NumberFormat('en-IN').format(num)
    }

    const columns = [
        
        {
            header: 'Company',
            enableSorting: false,
            accessorKey: 'company_name',
            cell: (row: any) => <div className="min-w-[150px]">{row.getValue()}</div>
        },
        {
            header: 'Month/Year',
            enableSorting: false,
            accessorFn: (row: any) => `${row.month} ${row.year}`,
            cell: (row: any) => <div className="min-w-[100px]">{row.getValue()}</div>
        },
        {
            header: 'Branch',
            enableSorting: false,
            accessorFn: (row: any) => row.register_data?.Branch || '--',
            cell: (row: any) => <div className="min-w-[150px]">{row.getValue()}</div>
        },
        {
            header: 'Emp Code',
            enableSorting: false,
            accessorFn: (row: any) => row.register_data?.['Employee Code'] || '--',
            cell: (row: any) => <div className="min-w-[100px]">{row.getValue()}</div>
        },
        {
            header: 'Emp Name',
            enableSorting: false,
            accessorFn: (row: any) => row.register_data?.['Employee Name'] || '--',
            cell: (row: any) => <div className="min-w-[150px]">{row.getValue()}</div>
        },
        {
            header: 'Designation',
            enableSorting: false,
            accessorFn: (row: any) => row.register_data?.Designation || '--',
            cell: (row: any) => <div className="min-w-[120px]">{row.getValue()}</div>
        },
        {
            header: 'Department',
            enableSorting: false,
            accessorFn: (row: any) => row.register_data?.Department || '--',
            cell: (row: any) => <div className="min-w-[120px]">{row.getValue()}</div>
        },
        {
            header: 'Basic',
            enableSorting: false,
            accessorFn: (row: any) => row.register_data?.['Basic Wages'] || 0,
            cell: (row: any) => <div className="min-w-[80px] text-right">{formatIndianNumber(row.getValue())}</div>
        },
        {
            header: 'DA',
            enableSorting: false,
            accessorFn: (row: any) => row.register_data?.['D.A.'] || 0,
            cell: (row: any) => <div className="min-w-[80px] text-right">{formatIndianNumber(row.getValue())}</div>
        },
        {
            header: 'HRA',
            enableSorting: false,
            accessorFn: (row: any) => row.register_data?.['H.R.A.'] || 0,
            cell: (row: any) => <div className="min-w-[80px] text-right">{formatIndianNumber(row.getValue())}</div>
        },
        {
            header: 'Other Allowance',
            enableSorting: false,
            accessorFn: (row: any) => row.register_data?.['Other Allowance'] || 0,
            cell: (row: any) => <div className="min-w-[100px] text-right">{formatIndianNumber(row.getValue())}</div>
        },
        {
            header: 'Special Allowance',
            enableSorting: false,
            accessorFn: (row: any) => row.register_data?.['Special Allowance'] || 0,
            cell: (row: any) => <div className="min-w-[100px] text-right">{formatIndianNumber(row.getValue())}</div>
        },
        {
            header: 'Total',
            enableSorting: false,
            accessorFn: (row: any) => row.register_data?.['Total (Basic+ DA)'] || 0,
            cell: (row: any) => <div className="min-w-[100px] text-right font-medium">{formatIndianNumber(row.getValue())}</div>
        },
        {
            header: 'PF',
            enableSorting: false,
            accessorFn: (row: any) => row.register_data?.['P.F.'] || 0,
            cell: (row: any) => <div className="min-w-[80px] text-right">{formatIndianNumber(row.getValue())}</div>
        },
        {
            header: 'PT',
            enableSorting: false,
            accessorFn: (row: any) => row.register_data?.['P.T.'] || 0,
            cell: (row: any) => <div className="min-w-[80px] text-right">{formatIndianNumber(row.getValue())}</div>
        },
        {
            header: 'IT',
            enableSorting: false,
            accessorFn: (row: any) => row.register_data?.['I.T'] || 0,
            cell: (row: any) => <div className="min-w-[80px] text-right">{formatIndianNumber(row.getValue())}</div>
        },
        {
            header: 'Net Salary',
            enableSorting: false,
            accessorFn: (row: any) => row.register_data?.['Net Salary'] || 0,
            cell: (row: any) => <div className="min-w-[100px] text-right font-medium">{formatIndianNumber(row.getValue())}</div>
        },
        {
            header: 'Working Days',
            enableSorting: false,
            accessorFn: (row: any) => row.register_data?.['Total no of Working Days'] || '--',
            cell: (row: any) => <div className="min-w-[100px] text-center">{row.getValue()}</div>
        },
        {
            header: 'Days Present',
            enableSorting: false,
            accessorFn: (row: any) => row.register_data?.['No of Days Present/Worked'] || '--',
            cell: (row: any) => <div className="min-w-[100px] text-center">{row.getValue()}</div>
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