import { DataTable } from "@/components/shared";
import { Button, Tooltip } from "@/components/ui";
import { HiEye } from "react-icons/hi";

const RegisterTable = ({ onViewDetails }: { onViewDetails: (id: string) => void }) => {
    // Dummy data for the register table
    const dummyData = [
      {
        id: '1',
        fileName: 'Attendance Register',
        year: '2024',
      },
      {
        id: '2',
        fileName: 'Leave Register',
        year: '2024',
      },
      {
        id: '3',
        fileName: 'Salary Register',
        year: '2024',
      },
      {
        id: '4',
        fileName: 'Maternity Register',
        year: '2024',
      },
      
    ];
  
    const columns = [
      {
        header: 'Input File Name',
        enableSorting: false,
        accessorKey: 'fileName',
        cell: ({ row }) => <div className="w-64 truncate">{row.original.fileName}</div>
      },
      {
        header: 'Year',
        enableSorting: false,

        accessorKey: 'year',

        cell: ({ row }) => <div className="w-20">{row.original.year}</div>
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
            <Tooltip title="View History">
          <Button
            size="sm"
            icon={<HiEye />}
            onClick={() => onViewDetails(row.original.id)}
            >
          </Button>
              </Tooltip>
        )
      }
    ];
  
    return (
      <div className="relative">
        <DataTable
          columns={columns}
          data={dummyData}
          loading={false}
          pagingData={{
            total: dummyData.length,
            pageIndex: 1,
            pageSize: 10
          }}
          stickyHeader={true}
        />
      </div>
    );
  };

export default RegisterTable