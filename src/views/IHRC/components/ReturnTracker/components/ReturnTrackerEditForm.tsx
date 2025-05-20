import { Button, DatePicker, Input } from '@/components/ui'
import OutlinedSelect from '@/components/ui/Outlined'
import OutlinedInput from '@/components/ui/OutlinedInput/OutlinedInput'
import React from 'react'
import { IoArrowBack } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

const ReturnTrackerEditForm = () => {
    const navigate=useNavigate();


    const companyOptions = [
        { value: 'adani_solution', label: 'Adani Solution' },
        { value: 'adani_tech', label: 'Adani Tech' },
    ]

    const dummyActData = [
        { value: "Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013", label: "Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013" },
        { value: "Employment Exchanges (Compulsory Notification of Vacancies) Act, 1959", act_name: "Employment Exchanges (Compulsory Notification of Vacancies) Act, 1959" },
        { value: "Payment of Bonus Act 1965", label: "Payment of Bonus Act 1965" },
        { value: "Maternity Benefit Act 1961", label: "Maternity Benefit Act 1961" },
        { value: "Shops & Commercial Establishment Act", label: "Shops & Commercial Establishment Act" },
        { value: "Minimum Wages Act, 1948", label: "Minimum Wages Act, 1948" },
        { value: "Payment of Wages Act, 1934", label: "Payment of Wages Act, 1934" },
        { value: "Employee Compensation Act, 1923", label: "Employee Compensation Act, 1923" },
        { value:"Factories Act 1948", label: "Factories Act 1948" },
        { value: "Combined Returns", label: "Combined Returns" },
      ];

      const returnOptions = [
        { value: 'return_name_1', label: 'Return Name 1' },
        { value: 'return_name_2', label: 'Return Name 2' },
    ]

    const stateOptions = [
        { value: 'gujarat', label: 'Gujarat' },
        { value: 'tamil_nadu', label: 'Tamil Nadu' },
    ]

    const districtOptions = [
        { value: 'ahmedabad', label: 'Ahmedabad' },
        { value: 'chennai', label: 'Chennai' },
    ]
    const locationOptions = [
        { value: 'ahmedabad', label: 'Ahmedabad' },
        { value: 'chennai', label: 'Chennai' },
    ]

    const branchOptions = [
        { value: 'ahmedabad_branch', label: 'Ahmedabad Branch' },
        { value: 'chennai_branch', label: 'Chennai Branch' },
    ]

    const monthOptions = [
        { value: 'jan', label: 'January' },
        { value: 'feb', label: 'February' },
        { value: 'mar', label: 'March' },
        { value: 'apr', label: 'April' },
        { value: 'may', label: 'May' },
        { value: 'jun', label: 'June' },
        { value: 'jul', label: 'July' },
        { value: 'aug', label: 'August' },
        { value: 'sep', label: 'September' },
        { value: 'oct', label: 'October' },
        { value: 'nov', label: 'November' },
        { value: 'dec', label: 'December' },
    ];

    const yearOptions = [
        { value: '2020', label: '2020' },
        { value: '2021', label: '2021' },
        { value: '2022', label: '2022' },
        { value: '2023', label: '2023' },
        { value: '2024', label: '2024' },
        { value: '2025', label: '2025' },
    ]

    const returnFileOptions = [
        { value: 'not_applicable', label: 'Not Applicable' },
        { value: 'applicable', label: 'Applicable' },
    ]
    
  return (
    <div className='w-full mx-auto p-2 bg-white rounded-lg'>
        <div className="flex gap-2 items-center mb-3">
        <Button
                    size="sm"
                    variant="plain"
                    icon={<IoArrowBack className="text-gray-500 hover:text-gray-700" />}
                    onClick={() => navigate(-1)}
                />
                <h3 className="text-2xl font-semibold">Edit Return Details</h3>
        </div>

        <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Company Group <span className="text-red-500">*</span>
                        </label>
                        <OutlinedInput
                            label="Company Group"
                            value={'Adani Group'}
                            onChange={() => {}}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Company <span className="text-red-500">*</span>
                        </label>
                        <OutlinedSelect
                          label="Select Company"
                          options={companyOptions} value={undefined} onChange={undefined}                            
                        />
                    </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Act Name <span className="text-red-500">*</span>
                        </label>
                        <OutlinedSelect
                          label="Select Act Name"
                          options={dummyActData} value={undefined} onChange={undefined}                            
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Return Name <span className="text-red-500">*</span>
                        </label>
                        <OutlinedSelect
                          label="Select Return Name"
                          options={returnOptions} value={undefined} onChange={undefined}                            
                        />
                    </div>
        </div>


        <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
                        <label className="text-sm font-medium">
                            State <span className="text-red-500">*</span>
                        </label>
                        <OutlinedSelect
                          label="Select State"
                          options={stateOptions} value={undefined} onChange={undefined}                            
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                           District <span className="text-red-500">*</span>
                        </label>
                        <OutlinedSelect
                          label="Select District"
                          options={districtOptions} value={undefined} onChange={undefined}                            
                        />
                    </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Location <span className="text-red-500">*</span>
                        </label>
                        <OutlinedSelect
                          label="Select Location"
                          options={locationOptions} value={undefined} onChange={undefined}                            
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                           Branch <span className="text-red-500">*</span>
                        </label>
                        <OutlinedSelect
                          label="Select Branch"
                          options={branchOptions} value={undefined} onChange={undefined}                            
                        />
                    </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Frequency <span className="text-red-500">*</span>
                        </label>
                        <OutlinedInput
                          label="Act Frequency"
                          value={'Monthly'} onChange={function (value: string): void {
                              throw new Error('Function not implemented.')
                          } }                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Year <span className="text-red-500">*</span>
                        </label>
                        <OutlinedSelect
                          label="Select Year"
                          options={yearOptions} value={undefined} onChange={undefined}                            
                        />
                    </div>
                   
        </div>



        <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
                        <label className="text-sm font-medium">
                           Month <span className="text-red-500">*</span>
                        </label>
                        <OutlinedSelect
                          label="Select Month"
                          options={monthOptions} value={undefined} onChange={undefined}                            
                        />
                    </div>
       
                    {/* <div className="space-y-2">
                        <label className="text-sm font-medium">
                           Month <span className="text-red-500">*</span>
                        </label>
                        <OutlinedSelect
                          label="Select Month"
                          options={monthOptions} value={undefined} onChange={undefined}                            
                        />
                    </div> */}
                     <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Return File Submission <span className="text-red-500">*</span>
                        </label>
                        <OutlinedSelect
                          label="Select Return File Submission"
                          options={returnFileOptions} value={undefined} onChange={undefined}                            
                        />
                    </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
       
                    {/* <div className="space-y-2">
                        <label className="text-sm font-medium">
                           Not Applicable Reason <span className="text-red-500">*</span>
                        </label>
                        <OutlinedInput
                          label="Enter Not Applicable Reason"
                          value={''} onChange={function (value: string): void {
                              throw new Error('Function not implemented.')
                          } }                        />
                    </div> */}
                     <div className="space-y-2">
                    <label htmlFor="firstDate">Select Date<span className="text-red-500">*</span></label>
                          <DatePicker 
                            placeholder='Select Date' 
                            value={undefined} 
                            size='sm'
                  onChange={undefined}
                          />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Delay Reason <span className="text-red-500">*</span>
                        </label>
                        <OutlinedInput
                          label="Enter Delay Reason"
                          value={''} onChange={function (value: string): void {
                              throw new Error('Function not implemented.')
                          } }                        />
                    </div>
                    <div className="space-y-2">
                                           <label className="text-sm font-medium">
                                               Return Copy (PDF/Zip/Image, Max 20MB) <span className="text-red-500">*</span>
                                           </label>
                                           <Input
                                               type="file"
                                               size='sm'
                                               className="w-full"
                                               accept=".pdf,.jpg,.zip,.jpeg,.png"
                                           />
                                           
                                       </div>
        </div>

        {/* <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Delay Reason <span className="text-red-500">*</span>
                        </label>
                        <OutlinedInput
                          label="Enter Delay Reason"
                          value={''} onChange={function (value: string): void {
                              throw new Error('Function not implemented.')
                          } }                        />
                    </div>
                   
                   <div className="space-y-2">
                                           <label className="text-sm font-medium">
                                               Return Copy (PDF/Zip/Image, Max 20MB) <span className="text-red-500">*</span>
                                           </label>
                                           <Input
                                               type="file"
                                               size='sm'
                                               className="w-full"
                                               accept=".pdf,.jpg,.zip,.jpeg,.png"
                                           />
                                           
                                       </div>
        </div> */}

        <div className="flex justify-end gap-2 pt-8">
                    <Button
                      type="button"
                      variant="plain"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant='solid'
                    //   loading={loading}
                    >
                      Confirm
                    </Button>
                  </div>
        </div>
    </div>
  )
}

export default ReturnTrackerEditForm