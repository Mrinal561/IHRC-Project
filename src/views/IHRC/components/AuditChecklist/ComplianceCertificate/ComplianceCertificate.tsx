import React, { useState } from 'react'
import ComplianceCertificateDetails from './components/ComplianceCertificateDetails'
import { Button, Dialog, toast, Notification, Dropdown } from '@/components/ui'
import { FaDownload } from 'react-icons/fa6';
import MonthWiseSummary from './components/MonthWiseSummary'
const DownloadCertificateButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("Year")
  const [selectedMonth, setSelectedMonth] = useState("Month")
  

  const handleAssignClick = () => {
      setIsDialogOpen(true);
  };

  const handleConfirm = () => {
      setIsDialogOpen(false);
      toast.push(
        <Notification
          title="Success"
          type="success"
        >
          Certificate downloaded successfully!
        </Notification>,
        {
          placement: 'top-end',
        }
      );
    };

  const handleCancel = () => {
      setIsDialogOpen(false);
  };

  const yearOptions = [
    { key: '2021', name: '2021' },
    { key: '2022', name: '2022' },
    { key: '2023', name: '2023' },
    { key: '2024', name: '2024' },
  ]

  const monthOptions = [
    { key: '1', name: 'January' },
    { key: '2', name: 'February' },
    { key: '3', name: 'March' },
    { key: '4', name: 'April' },
    { key: '5', name: 'May' },
    { key: '6', name: 'June' },
    { key: '7', name: 'July' },
    { key: '8', name: 'August' },
    { key: '9', name: 'September' },
    { key: '10', name: 'October' },
    { key: '11', name: 'November' },
    { key: '12', name: 'December' },
  ];

  const handleSelect = (key) => {
    const selected = monthOptions.find(item => item.key === key);
    if (selected) {
      setSelectedMonth(selected.name); // Update the title
    }
  };

  const handleYear = (key) => {
    const selected = yearOptions.find(item => item.key === key);
    if (selected) {
      setSelectedYear(selected.name); // Update the title
    }
  };

  return (
      <div className='flex gap-6 justify-center items-center'>
        <Dropdown title={selectedMonth} onSelect={handleSelect}>
                {monthOptions.map((item) => (
                    <Dropdown.Item
                        eventKey={item.key}
                        key={item.key}
                    >
                        {item.name}
                    </Dropdown.Item>
                ))}
            </Dropdown>
          
            <Dropdown title={selectedYear} onSelect={handleYear}>
                {yearOptions.map((item) => (
                    <Dropdown.Item
                        eventKey={item.key}
                        key={item.key}
                    >
                        {item.name}
                    </Dropdown.Item>
                ))}
            </Dropdown>
          <Button
              block
              variant="solid"
              size="sm"
              icon={<FaDownload />}
              onClick={handleAssignClick}
          >
              Download Certificates
          </Button>

          <Dialog
              isOpen={isDialogOpen}
              onClose={handleCancel}
              width={400}
          >
              <h5 className="mb-4">Confirm Download</h5>
              <p>Are you sure you want to download certificate?</p>
              <div className="mt-6 text-right">
                  <Button
                      size="sm"
                      className="mr-2"
                      onClick={handleCancel}
                  >
                      Cancel
                  </Button>
                  <Button
                      variant="solid"
                      size="sm"
                      onClick={handleConfirm}
                  >
                      Confirm
                  </Button>
              </div>
          </Dialog>
      </div>
  );
};

const ComplianceCertificate = () => {
  return (
    <>
    <div className="lg:flex items-center justify-between mb-8">
      <div>
                <h3 className="mb-4 lg:mb-0">Compliance Certificate</h3>
      </div>
      <div>

      <DownloadCertificateButton />
      </div>
    </div>
      <MonthWiseSummary />
    </>
  )
}

export default ComplianceCertificate