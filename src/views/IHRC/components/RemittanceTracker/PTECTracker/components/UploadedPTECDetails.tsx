import React, { useMemo } from 'react';
import { Button } from '@/components/ui';
import { HiArrowLeft } from 'react-icons/hi';
import DataTable, { ColumnDef } from '@/components/shared/DataTable';
import { useNavigate } from 'react-router-dom';
import ConfigDropdown from './ConfigDropdown';
// import ConfigDropdown from './ConfigDropdown';

// Define the interface for PT Tracker Data
interface PTTrackerData {
  companyName: string;
  ptCode: string;
  location: string;
  month: string;
  noOfEmployees: number;
  grossSalary: string;
  ptAmount: number;
  dueDate: string;
  dateOfPayment: string;
  delay: string;
  delayReason: string;
  typeOfChallan: string;
  challanNo: string;
  acknowledgementNo: string;
}

const dummyData: PTTrackerData[] = [
  {
    companyName: 'India Shelter PVT Ltd',
    ptCode: 'MH/PT/000123',
    location: 'Mumbai',
    month: 'Apr-23',
    noOfEmployees: 1500,
    grossSalary: "35,000,000",
    ptAmount: 300000,
    dueDate: '30-May-23',
    dateOfPayment: '28-May-23',
    delay: "",
    delayReason: '',
    typeOfChallan: 'Regular',
    challanNo: 'PT2023042801',
    acknowledgementNo: 'ACK2023042801'
  },
  {
    companyName: 'India Shelter PVT Ltd',
    ptCode: 'MH/PT/000123',
    location: 'Mumbai',
    month: 'May-23',
    noOfEmployees: 1550,
    grossSalary: "36,500,000",
    ptAmount: 310000,
    dueDate: '30-Jun-23',
    dateOfPayment: '02-Jul-23',
    delay: "2 Days",
    delayReason: 'Bank holiday',
    typeOfChallan: 'Regular',
    challanNo: 'PT2023070201',
    acknowledgementNo: 'ACK2023070201'
  },
  {
    companyName: 'India Shelter PVT Ltd',
    ptCode: 'MH/PT/000123',
    location: 'Mumbai',
    month: 'Jun-23',
    noOfEmployees: 1550,
    grossSalary: "37,500,000",
    ptAmount: 320000,
    dueDate: '30-Jul-23',
    dateOfPayment: '28-Jul-23',
    delay: "",
    delayReason: '',
    typeOfChallan: 'Regular',
    challanNo: 'PT2023070201',
    acknowledgementNo: 'ACK2023070221'
  },
  // Add more dummy data as needed
];

interface UploadedPTDetailsProps {
  onBack: () => void;
}

const UploadedPTECDetails: React.FC<UploadedPTDetailsProps> = ({ onBack }) => {
  const navigate = useNavigate();

  const columns: ColumnDef<PTTrackerData>[] = useMemo(
    () => [
      {
        header: 'PT Code',
        accessorKey: 'ptCode',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Month',
        accessorKey: 'month',
        cell: (props) => <div className="w-28 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'No. of Employees',
        accessorKey: 'noOfEmployees',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as number}</div>,
      },
      {
        header: 'Gross Salary',
        accessorKey: 'grossSalary',
        cell: (props) => <div className="w-28 truncate">₹{props.getValue() as string}</div>,
      },
      {
        header: 'PT Amount',
        accessorKey: 'ptAmount',
        cell: (props) => <div className="w-28 truncate">₹{(props.getValue() as number).toLocaleString()}</div>,
      },
      {
        header: 'Due Date',
        accessorKey: 'dueDate',
        cell: (props) => <div className="w-28 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Date of Payment',
        accessorKey: 'dateOfPayment',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Delay',
        accessorKey: 'delay',
        cell: (props) => <div className="w-28 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Delay Reason',
        accessorKey: 'delayReason',
        cell: (props) => <div className="w-28 truncate">{props.getValue() as string}</div>,
      },
      
      {
        header: 'Type of Challan',
        accessorKey: 'typeOfChallan',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <ConfigDropdown companyName={undefined} companyGroupName={undefined} />
        ),
      },
    ],
    []
  );

  const backFunction = () => {
    navigate('/ptec-tracker');
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-8">
        <Button
          variant="plain"
          size="sm"
          icon={<HiArrowLeft />}
          onClick={backFunction}
          className="mr-4"
        >
        </Button>
        <h2 className="text-2xl font-bold">Uploaded PT EC Tracker Details</h2>
      </div>
      <DataTable
        columns={columns}
        data={dummyData}
        skeletonAvatarColumns={[0]}
        skeletonAvatarProps={{ className: 'rounded-md' }}
        stickyHeader={true}
        stickyFirstColumn={true}
        stickyLastColumn={true}
      />
    </div>
  );
};

export default UploadedPTECDetails;