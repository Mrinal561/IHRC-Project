import { AdaptableCard, DataTable } from "@/components/shared";
import { Button } from "@/components/ui";
import { HiArrowLeft, HiDownload } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

 const RegisterHistory = () => {
    // This would receive the register ID as a param in a real app
    const registerData = {
      fileName: 'Attendance Register',
      year: '2024',
      months: [
        { month: 'January', file: 'Attendance Register' },
        { month: 'February', file: 'Attendance Register' },
        { month: 'March', file: 'Attendance Register' },
      ]
    };
  
    const handleDownload = (fileName: string) => {
      console.log(`Downloading ${fileName}`);
      // Actual download logic would go here
    };
  
    const columns = [
      {
        header: 'Input File Name',
        enableSorting: false,

        accessorKey: 'fileName',
        cell: ({ row }) => <div className="w-64">{registerData.fileName}</div>
      },
      {
        header: 'Month',
        enableSorting: false,

        accessorKey: 'month',
        cell: ({ row }) => <div className="w-32">{row.original.month}</div>
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <Button
            size="sm"
            icon={<HiDownload />}
            onClick={() => handleDownload(row.original.file)}
          >
            Download
          </Button>
        )
      }
    ];


    const navigate = useNavigate();
  
    return (
      <AdaptableCard className="h-full" bodyClass="h-full">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
          <div className="mb-4 lg:mb-0">
            <div className="flex gap-2">
                 <Button
                                    variant="plain"
                                    size="sm"
                                    icon={<HiArrowLeft />}
                                    onClick={() => navigate(-1)}
                                    className="mb-4"
                                />
            <h3 className="text-2xl font-bold">Register History - {registerData.fileName} <span className="text-2xl font-bold">-{registerData.year}</span></h3>
            </div>
           
          </div>
        </div>
        <div className='mb-8'>
          <DataTable
            columns={columns}
            data={registerData.months}
            loading={false}
            pagingData={{
              total: registerData.months.length,
              pageIndex: 1,
              pageSize: 10
            }}
            stickyHeader={true}
          />
        </div>
      </AdaptableCard>
    );
  };


  export default RegisterHistory;