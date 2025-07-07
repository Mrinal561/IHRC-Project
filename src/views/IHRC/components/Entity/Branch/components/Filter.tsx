// import React, { useState } from 'react';
// import OutlinedSelect from '@/components/ui/Outlined/Outlined';
// import { EntityData, entityDataSet } from '../../../../store/dummyEntityData';

// type Option = {
//   value: string;
//   label: string;
// };

// const getUniqueLocations = (data: EntityData[]): string[] => {
//   const location = data.map(item => item.Location);
//   return Array.from(new Set(location)).filter((location): location is string => location !== undefined);
// };

// const optionsLocations: Option[] = getUniqueLocations(entityDataSet).map(location => ({
//   value: location,
//   label: location,
// }));



// const getUniqueDistricts = (data: EntityData[]): string[] => {
//   const districts = data.map(item => item.District);
//   return Array.from(new Set(districts)).filter((district): district is string => district !== undefined);
// };

// const options: Option[] = getUniqueDistricts(entityDataSet).map(district => ({
//   value: district,
//   label: district,
// }));


// const getUniqueState = (data: EntityData[]): string[] => {
//   const state = data.map(item => item.State);
//   return Array.from(new Set(state)).filter((state): state is string => state !== undefined);
// };

// const optionState: Option[] = getUniqueDistricts(entityDataSet).map(state => ({
//   value: state,
//   label: state,
// }));


// const getUniqueGroup = (data: EntityData[]): string[] => {
//   const companyGroupName = data.map(item => item.Company_Group_Name);
//   return Array.from(new Set(companyGroupName)).filter((companyGroupName): companyGroupName is string => companyGroupName !== undefined);
// };

// const groupOptions: Option[] = getUniqueGroup(entityDataSet).map(companyGroupName => ({
//   value: companyGroupName,
//   label: companyGroupName,
// }));

// const getUniqueName = (data: EntityData[]): string[] => {
//   const companyName = data.map(item => item.Company_Name);
//   return Array.from(new Set(companyName)).filter((companyName): companyName is string => companyName !== undefined);
// };

// const nameOptions: Option[] = getUniqueName(entityDataSet).map(companyName => ({
//   value: companyName,
//   label: companyName,
// }));
// const Filter: React.FC = () => {
//   const [currentFilter, setCurrentFilter] = useState<string>(options[0]?.value || '');
//   const [currentGroup, setCurrentGroup] = useState<string>(groupOptions[0]?.value||'');
//   const [groupName, setGroupName] = useState<string>(nameOptions[0]?.value||'');
//   const [stateName, setStateName] = useState<string>(optionState[0]?.value||'');
//   const [locationName, setLocationName] = useState<string>(optionsLocations[0]?.value||'');

//   const handleFilterChange = (selectedOption: Option | null) => {
//     if (selectedOption) {
//       setCurrentFilter(selectedOption.value);
//       // You can add any additional logic here that needs to happen when the filter changes
//     }
//   };
//   const handleGroupChange = (selectedOption: Option | null) => {
//     if (selectedOption) {
//         setCurrentGroup(selectedOption.value)
      
//       // You can add any additional logic here that needs to happen when the filter changes
//     }
//   };
//   const handleNameChange = (selectedOption: Option | null) => {
//     if (selectedOption) {
//         setGroupName(selectedOption.value)
      
//       // You can add any additional logic here that needs to happen when the filter changes
//     }
//   };
//   const handleLocationChange = (selectedOption: Option | null) => {
//     if (selectedOption) {
//       setLocationName(selectedOption.value)
      
//       // You can add any additional logic here that needs to happen when the filter changes
//     }
//   };
//   const handleStateChange = (selectedOption: Option | null) => {
//     if (selectedOption) {
//       setStateName(selectedOption.value)
      
//       // You can add any additional logic here that needs to happen when the filter changes
//     }
//   };
//   return (
//     <div className=" flex gap-3 w-full">    
//         <div className='w-40'>
//         <OutlinedSelect
//         label="Company Group"
//         options={groupOptions}
//         value={groupOptions.find((option) => option.value === currentGroup)}
//         onChange={handleGroupChange}
//       />
//         </div>
//         <div className='w-40'>
//         <OutlinedSelect
//         label="Company"
//         options={nameOptions}
//         value={nameOptions.find((option) => option.value === groupName)}
//         onChange={handleNameChange}
//       />
//         </div>
//         <div className='w-40'>
//         <OutlinedSelect
//         label="State"
//         options={optionState}
//         value={optionState.find((option) => option.value === stateName)}
//         onChange={handleStateChange}
//       />
//         </div>
//         <div className='w-40'>
//         <OutlinedSelect
//         label="District"
//         options={options}
//         value={options.find((option) => option.value === currentFilter)}
//         onChange={handleFilterChange}
//       />
//         </div>
//         <div className='w-40'>
//         <OutlinedSelect
//         label="Location"
//         options={optionsLocations}
//         value={optionsLocations.find((option) => option.value === locationName)}
//         onChange={handleFilterChange}
//       />
//         </div>
//     </div>
//   );
// };

// export default Filter;




import React, { useState } from 'react';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import { EntityData, entityDataSet } from '../../../../store/dummyEntityData';

type Option = {
  value: string;
  label: string;
};

const getUniqueLocations = (data: EntityData[]): string[] => {
  const location = data.map(item => item.Location);
  return Array.from(new Set(location)).filter((location): location is string => location !== undefined);
};

const optionsLocations: Option[] = getUniqueLocations(entityDataSet).map(location => ({
  value: location,
  label: location,
}));



const getUniqueDistricts = (data: EntityData[]): string[] => {
  const districts = data.map(item => item.District);
  return Array.from(new Set(districts)).filter((district): district is string => district !== undefined);
};

const options: Option[] = getUniqueDistricts(entityDataSet).map(district => ({
  value: district,
  label: district,
}));


const getUniqueState = (data: EntityData[]): string[] => {
  const state = data.map(item => item.State);
  return Array.from(new Set(state)).filter((state): state is string => state !== undefined);
};

const optionState: Option[] = getUniqueDistricts(entityDataSet).map(state => ({
  value: state,
  label: state,
}));


const getUniqueGroup = (data: EntityData[]): string[] => {
  const companyGroupName = data.map(item => item.Company_Group_Name);
  return Array.from(new Set(companyGroupName)).filter((companyGroupName): companyGroupName is string => companyGroupName !== undefined);
};

const groupOptions: Option[] = getUniqueGroup(entityDataSet).map(companyGroupName => ({
  value: companyGroupName,
  label: companyGroupName,
}));

const getUniqueName = (data: EntityData[]): string[] => {
  const companyName = data.map(item => item.Company_Name);
  return Array.from(new Set(companyName)).filter((companyName): companyName is string => companyName !== undefined);
};

const nameOptions: Option[] = getUniqueName(entityDataSet).map(companyName => ({
  value: companyName,
  label: companyName,
}));
const Filter: React.FC = () => {
  const [currentFilter, setCurrentFilter] = useState<string>(options[0]?.value || '');
  const [currentGroup, setCurrentGroup] = useState<string>(groupOptions[0]?.value||'');
  const [groupName, setGroupName] = useState<string>(nameOptions[0]?.value||'');
  const [stateName, setStateName] = useState<string>(optionState[0]?.value||'');
  const [locationName, setLocationName] = useState<string>(optionsLocations[0]?.value||'');

  const handleFilterChange = (selectedOption: Option | null) => {
    if (selectedOption) {
      setCurrentFilter(selectedOption.value);
      // You can add any additional logic here that needs to happen when the filter changes
    }
  };
  const handleGroupChange = (selectedOption: Option | null) => {
    if (selectedOption) {
        setCurrentGroup(selectedOption.value)
      
      // You can add any additional logic here that needs to happen when the filter changes
    }
  };
  const handleNameChange = (selectedOption: Option | null) => {
    if (selectedOption) {
        setGroupName(selectedOption.value)
      
      // You can add any additional logic here that needs to happen when the filter changes
    }
  };
  const handleLocationChange = (selectedOption: Option | null) => {
    if (selectedOption) {
      setLocationName(selectedOption.value)
      
      // You can add any additional logic here that needs to happen when the filter changes
    }
  };
  const handleStateChange = (selectedOption: Option | null) => {
    if (selectedOption) {
      setStateName(selectedOption.value)
      
      // You can add any additional logic here that needs to happen when the filter changes
    }
  };
  return (
    <div className=" flex gap-3 w-full">    
        <div className='w-40'>
        <OutlinedSelect
        label="Company Group"
        options={groupOptions}
        value={groupOptions.find((option) => option.value === currentGroup)}
        onChange={handleGroupChange}
      />
        </div>
        <div className='w-40'>
        <OutlinedSelect
        label="Company"
        options={nameOptions}
        value={nameOptions.find((option) => option.value === groupName)}
        onChange={handleNameChange}
      />
        </div>
        <div className='w-40'>
        <OutlinedSelect
        label="State"
        options={optionState}
        value={optionState.find((option) => option.value === stateName)}
        onChange={handleStateChange}
      />
        </div>
        <div className='w-40'>
        <OutlinedSelect
        label="District"
        options={options}
        value={options.find((option) => option.value === currentFilter)}
        onChange={handleFilterChange}
      />
        </div>
        <div className='w-40'>
        <OutlinedSelect
        label="Location"
        options={optionsLocations}
        value={optionsLocations.find((option) => option.value === locationName)}
        onChange={handleFilterChange}
      />
        </div>
    </div>
  );
};

export default Filter;