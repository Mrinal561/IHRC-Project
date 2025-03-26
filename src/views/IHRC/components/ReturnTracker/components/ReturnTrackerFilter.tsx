
import React, { useState, useEffect } from 'react';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import { endpoints } from '@/api/endpoint';
import httpClient from '@/api/http-client';
import { Notification, toast } from '@/components/ui';
import OutlinedInput from '@/components/ui/OutlinedInput';

const ReturnTrackerFilter = () => {
 
    const companyOptions = [
        { value: 'adani_solution', label: 'Adani Solution' },
        { value: 'adani_tech', label: 'Adani Tech' },
    ]


    const branchOptions = [
        { value: 'ahmedabad_branch', label: 'Ahmedabad Branch' },
        { value: 'chennai_branch', label: 'Chennai Branch' },
    ]


  return ( 
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"> 
      {/* <div className="min-w-0">
      <OutlinedInput
                  label="Group Name" value={'Adani Group'} onChange={function (value: string): void {
                      throw new Error('Function not implemented.');
                  } }        />
      </div> */}
      <div className="min-w-0">
        <OutlinedSelect
                  label="Company"
                  options={companyOptions} value={undefined} onChange={undefined}         
        />
      </div>
      <div className="min-w-0">
        <OutlinedSelect
                  label="State"
                  options={companyOptions} value={undefined} onChange={undefined}         
        />
      </div>
      <div className="min-w-0">
        <OutlinedSelect
                  label="Branch"
                  options={branchOptions} value={undefined} onChange={undefined}          
        />
      </div>
      
    </div>
  );
};

export default ReturnTrackerFilter;