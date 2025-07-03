import React, { useState } from 'react'
import { DataTable } from '@/components/shared'
import { Tooltip } from 'react-tooltip'
import { Button } from '@/components/ui'
import { HiDownload } from 'react-icons/hi'
import GenerateRegisterDialog from './GenerateRegisterDialog' // Adjust the import path

const RegisterTable = ({ data }: { data: any[] }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedRow, setSelectedRow] = useState<any>(null)

    const handleGenerateClick = (row: any) => {
        setSelectedRow(row)
        setIsDialogOpen(true)
    }

    const columns = [
        {
            header: 'Company',
            enableSorting: false,
            accessorKey: 'company_name',
            cell: (row: any) => <div className="min-w-[150px]">{row.getValue()}</div>
        },
        {
            header: 'Register Type',
            enableSorting: false,
            accessorKey: 'register_type',
            cell: (row: any) => <div className="min-w-[100px]">{row.getValue()}</div>
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => (
                <div className='flex gap-2 items-center'>
                    {/* <Tooltip title="Generate Register"> */}
                        <Button
                            size="sm"
                            icon={<HiDownload />}
                            onClick={() => handleGenerateClick(row.original)}
                        >
                            Generate Register
                        </Button>
                    {/* </Tooltip> */}
                </div>
            ),
        },
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
            
            <GenerateRegisterDialog 
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                rowData={selectedRow}
            />
        </div>
    )
}

export default RegisterTable