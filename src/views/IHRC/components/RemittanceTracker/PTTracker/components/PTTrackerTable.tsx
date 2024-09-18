import React, { useMemo, useState } from 'react';
import { Button, Tooltip } from '@/components/ui';
import { FiEdit, FiTrash } from 'react-icons/fi';
import DataTable, { ColumnDef } from '@/components/shared/DataTable';
import { MdEdit } from 'react-icons/md';
import PTTrackerEditDialog from './PTTrackerEditDialog';

// Define the structure of your data
export interface PTTrackerData {
  companyName: string;
  state: string;
  ptRCLocation: string;
  stateLocation: string;
  ptRC: string;
  userId: string;
  password: string;
  frequency: string;
  remittanceMode: string;
  month: string;
  noOfEmployees: number;
  wages: number;
  pt: number;
  totalAmountPaid: number;
  differenceInAmount: number;
  receiptNo: string;
  dueDate: string;
  dateOfPayment: string;
  remarks: string;
  delay: string;
  delayReason:string;
}

// Dummy data (replace with your actual data source)
export const dummyData: PTTrackerData[] = [
  {
    companyName: 'India Shelter',
    state: 'Gujarat',
    ptRCLocation: 'Ahmedabad',
    stateLocation: 'GUJARAT',
    ptRC: 'PRC010512001831',
    userId: 'sakshamhrservices',
    password: 'Tonk@304001',
    frequency: 'Monthly',
    remittanceMode: 'Online',
    month: 'Jul-24',
    noOfEmployees: 34,
    wages: 660066,
    pt: 2024,
    totalAmountPaid: 660000,
    differenceInAmount: 66,
    receiptNo: '1275383',
    dueDate: '15-Aug-24',
    dateOfPayment: '20-Aug-24',
    remarks: '',
    delay: "5 Days",
    delayReason:"Server Error",
  },
  {
    companyName: 'India Shelter',
    state: 'Gujarat',
    ptRCLocation: 'Ahmedabad',
    stateLocation: 'GUJARAT',
    ptRC: 'PRC010512001831',
    userId: 'sakshamhrservices',
    password: 'Tonk@304001',
    frequency: 'Monthly',
    remittanceMode: 'Online',
    month: 'Jun-24',
    noOfEmployees: 74,
    wages: 560166,
    pt: 2024,
    totalAmountPaid: 560000,
    differenceInAmount: 166,
    receiptNo: '1275383',
    dueDate: '15-Aug-24',
    dateOfPayment: '7-Aug-24',
    remarks: '',
    delay: "",
    delayReason:"",
  },{
    companyName: 'India Shelter',
    state: 'Gujarat',
    ptRCLocation: 'Bhavnagar',
    stateLocation: 'GUJARAT',
    ptRC: 'PRC010512001831',
    userId: 'sakshamhrservices',
    password: 'Tonk@304001',
    frequency: 'Monthly',
    remittanceMode: 'Online',
    month: 'Jul-24',
    noOfEmployees: 43,
    wages: 460166,
    pt: 2024,
    totalAmountPaid: 450000,
    differenceInAmount: 10166,
    receiptNo: '1275383',
    dueDate: '15-Aug-24',
    dateOfPayment: '7-Aug-24',
    remarks: '',
    delay: "",
    delayReason:"",
  },
  // Add more dummy data here
];

const PTTrackerTable: React.FC = () => {
  const [data, setData] = useState<PTTrackerData[]>(dummyData);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingData, setEditingData] = useState<PTTrackerData | null>(null);

  const handleEdit = (row: PTTrackerData) => {
    setEditingData(row);
    setEditDialogOpen(true);
};


const handleEditSubmit = (editedData: PTTrackerData) => {
    setData((prevData) =>
        prevData.map((item) =>
            item === editingData ? editedData : item
        )
    );
    setEditDialogOpen(false);
    setEditingData(null);
};
  const columns: ColumnDef<PTTrackerData>[] = useMemo(
    () => [
      {
        header: 'Company Name',
        accessorKey: 'companyName',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'State',
        accessorKey: 'state',
        cell: (props) => <div className="w-28 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'PT RC Location',
        accessorKey: 'ptRCLocation',
        cell: (props) => <div className="w-36 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'State/Location',
        accessorKey: 'stateLocation',
        cell: (props) => <div className="w-36 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'PT RC',
        accessorKey: 'ptRC',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'User ID (RC)',
        accessorKey: 'userId',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Password',
        accessorKey: 'password',
        cell: (props) => <div className="w-32 truncate">********</div>,
      },
      {
        header: 'Frequency',
        accessorKey: 'frequency',
        cell: (props) => <div className="w-28 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Remittance Mode',
        accessorKey: 'remittanceMode',
        cell: (props) => <div className="w-36 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Month',
        accessorKey: 'month',
        cell: (props) => <div className="w-28 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'No. of Employees',
        accessorKey: 'noOfEmployees',
        cell: (props) => <div className="w-36 truncate">{props.getValue() as number}</div>,
      },
      {
        header: 'Wages',
        accessorKey: 'wages',
        cell: (props) => <div className="w-32 truncate">₹{(props.getValue() as number).toLocaleString()}</div>,
      },
      {
        header: 'PT',
        accessorKey: 'pt',
        cell: (props) => <div className="w-28 truncate">₹{(props.getValue() as number).toLocaleString()}</div>,
      },
      {
        header: 'Total Amount Paid',
        accessorKey: 'totalAmountPaid',
        cell: (props) => <div className="w-40 truncate">₹{(props.getValue() as number).toLocaleString()}</div>,
      },
      {
        header: 'Difference in Amount',
        accessorKey: 'differenceInAmount',
        cell: (props) => <div className="w-44 truncate">₹{(props.getValue() as number).toLocaleString()}</div>,
      },
      {
        header: 'Receipt No/Ack no',
        accessorKey: 'receiptNo',
        cell: (props) => <div className="w-40 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Due Date',
        accessorKey: 'dueDate',
        cell: (props) => <div className="w-28 truncate">{props.getValue() as string}</div>,
      },
      {
        header: 'Date of Payment',
        accessorKey: 'dateOfPayment',
        cell: (props) => <div className="w-36 truncate">{props.getValue() as string}</div>,
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
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Tooltip title="Edit">
              <Button
                size="sm"
                onClick={() => handleEdit(row.original)}
                icon={<MdEdit />}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                size="sm"
                onClick={() => console.log('delete')}
                icon={<FiTrash />}
                className="text-red-500"
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="relative">
      <DataTable
        columns={columns}
        data={data}
        skeletonAvatarColumns={[0]}
        skeletonAvatarProps={{ className: 'rounded-md' }}
        stickyHeader={true}
        stickyFirstColumn={true}
        stickyLastColumn={true}
      />
      {editingData && (
        <PTTrackerEditDialog
          isOpen={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSubmit={handleEditSubmit}
          data={editingData}
        />
      )}
    </div>
  );
};

export default PTTrackerTable;