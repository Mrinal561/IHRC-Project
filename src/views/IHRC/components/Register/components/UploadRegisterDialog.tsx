import { Button, Dialog, Input } from "@/components/ui";
import OutlinedSelect from "@/components/ui/Outlined/Outlined";
import { HiDownload } from "react-icons/hi";

const UploadRegisterDialog = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const months = [
      { label: 'January', value: '01' },
      { label: 'February', value: '02' },
      { label: 'March', value: '03' },
      { label: 'April', value: '04' },
      { label: 'May', value: '05' },
      { label: 'June', value: '06' },
      { label: 'July', value: '07' },
      { label: 'August', value: '08' },
      { label: 'September', value: '09' },
      { label: 'October', value: '10' },
      { label: 'November', value: '11' },
      { label: 'December', value: '12' },
    ];
  
    const years = [
      { label: '2024', value: '2024' },
      { label: '2023', value: '2023' },
      { label: '2022', value: '2022' },
    ];
  
    const registerNames = [
      { label: 'Attendance Register', value: 'attendance' },
      { label: 'Leave Register', value: 'leave' },
      { label: 'Salary Register', value: 'salary' },
      { label: 'Maternity Register', value: 'maternity' },
    ];
  
    return (
      <Dialog  
        isOpen={isOpen}
        onClose={onClose}
        onRequestClose={onClose}
        width={800}
      >
        <div className="">
          <h5 className="mb-6">Upload Register</h5>
          <div className='flex flex-col gap-4'>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Month</label>
                <OutlinedSelect 
                  label={"Select Month"} 
                  options={months}
                  value={undefined} 
                  onChange={() => {}} 
                />      
              </div>
  
              <div>
                <label className="block text-sm font-medium mb-2">Select Year</label>
                <OutlinedSelect 
                  label={"Select Year"} 
                  options={years}
                  value={undefined} 
                  onChange={() => {}} 
                />                   
              </div>
            </div>
  
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Choose Register Name</label>
                <OutlinedSelect 
                  label={"Select Register"} 
                  options={registerNames}
                  value={undefined} 
                  onChange={() => {}} 
                />                   
              </div>
  
              <div className="flex items-end">
                <Button 
                  icon={<HiDownload />}
                  size="sm"
                  className="h-10"
                >
                  Download Template
                </Button>
              </div>
            </div>
  
            <div>
              <label className="block text-sm font-medium mb-2">Upload File</label>
              <Input
                type="file"
                accept=".xlsx,.xls"
                className="mb-4"
              />                
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="plain" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="solid">
              Confirm
            </Button>
          </div>
        </div>
      </Dialog>
    );
  };


  export default UploadRegisterDialog;