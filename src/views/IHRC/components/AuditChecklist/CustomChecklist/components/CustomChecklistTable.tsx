
import React, { useMemo, useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { Checkbox, Tooltip, Button, Dialog } from '@/components/ui'; // Import Dialog
import cloneDeep from 'lodash/cloneDeep';
import type { OnSortParam, ColumnDef } from '@/components/shared/DataTable';
import { useNavigate } from 'react-router-dom';
import { MdEdit } from 'react-icons/md';
import { FiTrash } from 'react-icons/fi';
import { dummyData, ComplianceData } from '@/views/IHRC/store/dummyData'
import { RiEyeLine } from 'react-icons/ri';


interface ComplianceRow {
    Compliance_Id: number;
    Legislation: string;
    Location: string;
    Compliance_Categorization: string;
    Compliance_Header: string;
    Compliance_Description: string;
    Penalty_Description: string;
    Compliance_Applicability: string;
    Bare_Act_Text: string;
    Compliance_Clause: string;
    Compliance_Type: string;
    Compliance_Frequency: string;
    Compliance_Statutory_Authority: string;
    Approval_Required: string;
    Criticality: string;
    Penalty_Type: string;
    Default_Due_Date: string;
    First_Due_Date: string;
    Due_Date: string;
    Scheduled_Frequency: string;
    Proof_Of_Compliance_Mandatory: string;
    Compliance_Status:string;
}

const complianceData: ComplianceRow[] = [
    {
        Compliance_Id: 3236,
        Legislation: "Bihar Shops and Establishments Act 1953 and Bihar Shops Establishments Rules 1955/ Bihar/ IR",
        Location: "HMVL - Office - Muzaffarpur - sadtpur - HR/ Muzaffarpur/ Bihar/ Office",
        Compliance_Categorization: "LICENSE / REGISTRATION",
        Compliance_Header: "Renewal of Registration",
        Compliance_Description: "Apply for renewal of certificate of registration in Form IA in duplicate not less than thirty days before the date on which the certificate of registration expires to the Inspecting Officer along with the prescribed fees.",
        Penalty_Description: "Fine which may extend to Rs. 250",
        Compliance_Applicability: "EVERY EMPLOYER",
        Bare_Act_Text: "Make an application when registration certificate is lost or destroyed to the Inspecting Officer within seven days of such loss or destruction for a duplicate copy along with a payment of a fee of two rupees either by crossed Indian Postal Order or by d",
        Compliance_Clause: "Section 6 and Rule 3 A",
        Compliance_Type: "On Going",
        Compliance_Frequency: "Half Yearly",
        Compliance_Statutory_Authority: "CHIEF INSPECTOR OF SHOPS AND COMMERCIAL ESTABLISHMENTS/REGISTERING OFFICER",
        Approval_Required: "Yes",
        Criticality: "High",
        Penalty_Type: "Fine",
        Default_Due_Date: "20th July 20th Jan",
        First_Due_Date: "15-Apr-16",
        Due_Date: '14-Apr-17',
        Scheduled_Frequency: "Yearly",
        Proof_Of_Compliance_Mandatory: "Yes",
        Compliance_Status:"Approved"
      },
      {
        Compliance_Id: 4501,
        Legislation: "Delhi Factories Act 1948 and Delhi Factories Rules 1950/ Delhi/ IR",
        Location: "HMVL - Office - Arrah - Ramana Pakri Road - HR/ Arrah/ Bihar/ Office",
        Compliance_Categorization: "LICENSE / REGISTRATION",
        Compliance_Header: "Annual Renewal of License",
        Compliance_Description: "Submit an application for the renewal of the factory license in Form 1A, at least 45 days before the expiry date, to the Factory Inspector along with the required fees.",
        Penalty_Description: "Penalty may extend up to Rs. 500",
        Compliance_Applicability: "FACTORY OWNER",
        Bare_Act_Text: "In case the factory license is lost, notify the Factory Inspector immediately and apply for a duplicate license along with a fee of ten rupees.",
        Compliance_Clause: "Section 4 and Rule 6",
        Compliance_Type: "On Going",
        Compliance_Frequency: "Annually",
        Compliance_Statutory_Authority: "FACTORY INSPECTOR",
        Approval_Required: "Yes",
        Criticality: "Medium",
        Penalty_Type: "Fine",
        Default_Due_Date: "1st March 1st September",
        First_Due_Date: "01-Jan-17",
        Due_Date: '31-Dec-17',
        Scheduled_Frequency: "Yearly",
        Proof_Of_Compliance_Mandatory: "Yes",
        Compliance_Status:"Pending"
      },
      {
        Compliance_Id: 5602,
        Legislation: "Karnataka Shops and Commercial Establishments Act 1961 and Karnataka Shops Rules 1963/ Karnataka/ IR",
        Location: "HMVL - Office - Aurangabad - Priyavrat Path - HR/ Aurangabad/ Bihar/ Office",
        Compliance_Categorization: "REGISTRATION / REPORTING",
        Compliance_Header: "Monthly Compliance Report",
        Compliance_Description: "File a monthly compliance report in Form IX with the Labour Department, detailing employee work hours and wages paid, by the 5th of each month.",
        Penalty_Description: "Penalty up to Rs. 1000 for late submission",
        Compliance_Applicability: "SHOPS AND ESTABLISHMENTS",
        Bare_Act_Text: "Report any changes in employment status or wages to the Labour Department within seven days of occurrence, along with a fee of five rupees for each report.",
        Compliance_Clause: "Section 12 and Rule 10",
        Compliance_Type: "Ongoing",
        Compliance_Frequency: "Monthly",
        Compliance_Statutory_Authority: "LABOUR COMMISSIONER",
        Approval_Required: "No",
        Criticality: "High",
        Penalty_Type: "Fine",
        Default_Due_Date: "5th of each month",
        First_Due_Date: "01-Feb-18",
        Due_Date: '05-Feb-18',
        Scheduled_Frequency: "Monthly",
        Proof_Of_Compliance_Mandatory: "No",
        Compliance_Status:"Rejected"
      },
      {
        Compliance_Id: 6789,
        Legislation: "Maharashtra Shops and Establishments Act 1948 and Maharashtra Shops Rules 1954/ Maharashtra/ IR",
        Location: "HMVL - Office - Begusarai - Kachhari Road - HR/ Begusarai/ Bihar/ Office",
        Compliance_Categorization: "REPORTING",
        Compliance_Header: "Quarterly Wage Report",
        Compliance_Description: "Submit a quarterly wage report in Form XIV to the Labour Commissioner by the 15th of the first month following the end of the quarter.",
        Penalty_Description: "Fine up to Rs. 500 for late submission",
        Compliance_Applicability: "EMPLOYERS",
        Bare_Act_Text: "File any discrepancies in wages with the Labour Commissioner within fifteen days of detection, accompanied by a fee of ten rupees.",
        Compliance_Clause: "Section 12 and Rule 14",
        Compliance_Type: "Ongoing",
        Compliance_Frequency: "Quarterly",
        Compliance_Statutory_Authority: "LABOUR COMMISSIONER",
        Approval_Required: "No",
        Criticality: "Medium",
        Penalty_Type: "Fine",
        Default_Due_Date: "15th of January, April, July, October",
        First_Due_Date: "15-Jan-18",
        Due_Date: '15-Jan-18',
        Scheduled_Frequency: "Quarterly",
        Proof_Of_Compliance_Mandatory: "No",
        Compliance_Status:"Approved"
      },
      {
        Compliance_Id: 7890,
        Legislation: "Tamil Nadu Shops and Establishments Act 1947 and Tamil Nadu Shops Rules 1959/ Tamil Nadu/ IR",
        Location: "HMVL - Office - Samastipur - ShivSagar Plazza -HR / Samastipur/ Bihar/ Office",
        Compliance_Categorization: "LICENSE / REGISTRATION",
        Compliance_Header: "Renewal of Trade License",
        Compliance_Description: "Apply for the renewal of the trade license in Form VII at least 30 days before the license expiry date to the Municipal Authority along with the necessary fee.",
        Penalty_Description: "Late fee up to Rs. 300",
        Compliance_Applicability: "TRADE LICENSE HOLDERS",
        Bare_Act_Text: "In case of loss of the trade license, report to the Municipal Authority within seven days and apply for a duplicate license with a fee of fifteen rupees.",
        Compliance_Clause: "Section 5 and Rule 8",
        Compliance_Type: "On Going",
        Compliance_Frequency: "Annually",
        Compliance_Statutory_Authority: "MUNICIPAL AUTHORITY",
        Approval_Required: "Yes",
        Criticality: "High",
        Penalty_Type: "Fine",
        Default_Due_Date: "1st June 1st December",
        First_Due_Date: "01-June-17",
        Due_Date: '01-June-17',
        Scheduled_Frequency: "Yearly",
        Proof_Of_Compliance_Mandatory: "No",
        Compliance_Status:"Pending"
      }


];


const ViewDetailsButton = ({ compliance }: { compliance: ComplianceData }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/app/IHRC/compliance-list-detail/${compliance.Compliance_ID}`, {
            state: compliance,
        });
    };

    return (
        <Button size="sm" onClick={handleViewDetails}>
            <MdEdit size={24} />
        </Button>
    );
};

const CustomChecklistTable = () => {
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<ComplianceRow | null>(null);

    const navigate = useNavigate();

    const isAllSelected = useMemo(
        () => selectedItems.size === complianceData.length,
        [selectedItems]
    );

    const handleCheckboxChange = (id: number) => {
        setSelectedItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id); // Deselect if already selected
            } else {
                newSet.add(id); // Select if not already selected
            }
            return newSet;
        });
    };

    const handleDeleteClick = (item: ComplianceRow) => {
        setItemToDelete(item);
        setDialogIsOpen(true);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            // Implement your delete logic here
            console.log('Deleting:', itemToDelete);
        }
        setDialogIsOpen(false);
        setItemToDelete(null);
    };

    const handleCancelDelete = () => {
        setDialogIsOpen(false);
        setItemToDelete(null);
    };

    const EditIcon = () => (
        <span className="text-[#7c828e] hover:text-indigo-600">
            <svg
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                ></path>
            </svg>
        </span>
    );

    const columns: ColumnDef<ComplianceData>[] = useMemo(
        () => [
            {
                header: 'Compliance ID',                enableSorting: false,

                accessorKey: 'Compliance_ID',
                cell: (props) => (
                  <div className="w-10 text-start">{props.getValue()}</div>
                ),
              },
              {
                header: 'Legislation',                enableSorting: false,

                accessorKey: 'Legislation',
                cell: (props) => {
                  const value = props.getValue() as string;
                  return (
                    <Tooltip title={value} placement="top">
                      <div className="w-36 truncate">{value.length > 20 ? value.substring(0, 20) + '...' : value}</div>
                    </Tooltip>
                  );
                },
              },
              {
                header: 'Criticality',                enableSorting: false,

                accessorKey: 'Criticality',
                cell: (props) => {
                    const criticality = props.getValue(); // Get the value once
            
                    return (
                        <div className="w-24 font-semibold truncate">
                            {criticality === 'High' ? (
                                <span className="text-red-500">{criticality}</span>
                            ) : criticality === 'Medium' ? (
                                <span className="text-yellow-500">{criticality}</span>
                            ) : (
                                <span className="text-green-500">{criticality}</span>
                            )}
                        </div>
                    );
                }
            },
            
              {
                header: 'Location',                enableSorting: false,

                accessorKey: 'Location',
                cell: (props) => {
                  const value = props.getValue() as string;
                  return (
                    <Tooltip title={value} placement="top">
                      <div className="w-24 truncate">{value.length > 20 ? value.substring(0, 20) + '...' : value}</div>
                    </Tooltip>
                  );
                },
              },
              {
                header: 'Header',                enableSorting: false,

                accessorKey: 'Compliance_Header',
                cell: (props) => {
                  const value = props.getValue() as string;
                  return (
                    <Tooltip title={value} placement="top">
                      <div className="w-38 truncate">{value}</div>
                    </Tooltip>
                  );
                },
              },
            {
                header: 'Description',                enableSorting: false,

                accessorKey: 'Compliance_Description',
                cell: (props) => {
                    const value = props.getValue() as string;
                    return (
                        <Tooltip title={value} placement="left">
                            <div className="w-40 truncate">{value.length > 30 ? value.substring(0, 30) + '...' : value}</div>
                        </Tooltip>
                    );
                },
            },
            {
                header: 'Status',                enableSorting: false,

                accessorKey: 'Status',
                cell: (props) => {
                    const criticality = props.getValue(); // Get the value once
            
                    return (
                        <div className="w-24 font-semibold truncate">
                            {criticality === 'Approved' ? (
                                <span className="text-green-500">{criticality}</span>
                            ) : criticality === 'Pending' ? (
                                <span className="text-yellow-500">{criticality}</span>
                            ) : criticality === 'Rejected' ? ( 
                                <span className="text-red-500">{criticality}</span>
                            ): (
                                <span></span>
                            )}
                        </div>
                    );
                }
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => {
                    const value1= "Edit Compliance"
                    const value2= "Delete Compliance"
                    return(

                    <div className='flex space-x-2'>
                        <Tooltip title="View Compliance Detail" placement="top">
                        <Button
                          size="sm"
                        //   onClick={() => navigate(`/app/IHRC/assign-list-detail/${row.original.Compliance_ID}`, { state: row.original })}
                          icon={<RiEyeLine />}
                          className='hover:bg-transparent'
                        />
            </Tooltip>
                    <Tooltip title={value1} placement="top">
                    <Button
                        size="sm"
                        onClick={() => handleEditClick(row.original)}
                        icon={<MdEdit />}
                        className='hover:bg-transparent'
                        />
                    </Tooltip>
                    <Tooltip title={value2} placement="top">
                    <Button
                        size="sm"
                        onClick={() => handleDeleteClick(row.original)}
                        icon={<FiTrash />}
                        className='hover:bg-transparent text-red-500'
                        />
                    </Tooltip>
                </div>
                )
                },
            },
        ],
        [selectedItems, isAllSelected]
    );

    return (
        <div className="w-full overflow-x-auto">
            <DataTable
                columns={columns}
                data={dummyData}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ className: 'rounded-md' }}
                loading={false}
                stickyHeader={true}
                stickyFirstColumn={true}
                stickyLastColumn={true}
                
            />
            <Dialog
                isOpen={dialogIsOpen}
                onClose={handleCancelDelete}
                onRequestClose={handleCancelDelete}
                shouldCloseOnOverlayClick={false} 
            >
                <h5 className="mb-4">Confirm Delete</h5>
                <p>
                    Are you sure you want to delete the compliance: {itemToDelete?.Compliance_Header}?
                </p>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={handleCancelDelete}
                    >
                        Cancel
                    </Button>
                    <Button variant="solid" color="red-600" onClick={handleConfirmDelete}>
                        Confirm
                    </Button>
                </div>
            </Dialog>
        </div>
    );
};

export default CustomChecklistTable;
