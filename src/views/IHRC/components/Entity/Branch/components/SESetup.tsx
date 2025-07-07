// import React from 'react';
// import { Card,} from '@/components/ui/card';
// import { Input, DatePicker, Radio } from '@/components/ui';
// import OutlinedInput from '@/components/ui/OutlinedInput';

// const SESetup = ({ 
//   seRegistrationNumber, 
//   seValidityType, 
//   seValidityDate, 
//   seDocumentFile,
//   onSeRegistrationNumberChange,
//   onSeValidityTypeChange, 
//   onSeValidityDateChange,
//   onSeDocumentUpload
// }) => {
//   return (
//     <Card className="w-full">
//       <div>
//         <h4>S&E Setup</h4>
//       </div>
//       <div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//           <div>
//             <p className="block font-medium mb-2">
//               S&E Registration Number<span className="text-red-500">*</span>
//             </p>
//             <OutlinedInput
//               label="Enter S&E Registration Number"
//               value={seRegistrationNumber}
//               onChange={onSeRegistrationNumberChange}
//             />
//           </div>
//           <div>
//             <label className="block font-medium mb-2">
//               S&E Validity Type<span className="text-red-500">*</span>
//             </label>
//             <div className="flex items-center space-x-4">
//                 <div className='flex gap-2'>

//               <Radio
//                 // label="Fixed"
//                 placeholder='Fixed'
//                 name="Fixed"
//                 checked={seValidityType === 'fixed'}
//                 onChange={() => onSeValidityTypeChange('fixed')}
//                 />
//                 <span>Fixed</span>
//                 </div>
//                 <div className='flex gap-2'>

//               <Radio
//                 // label="Lifetime"
//                 placeholder='Lifetime'
//                 name="Lifetime"
//                 checked={seValidityType === 'lifetime'}
//                 onChange={() => onSeValidityTypeChange('lifetime')}
//                 />
//                 <span>Lifetime</span>
//                 </div>
//             </div>
//           </div>
//         </div>

//         {seValidityType === 'fixed' && (
//           <div className="mt-6">
//             <label className="block font-medium mb-2">
//               S&E Validity Date<span className="text-red-500">*</span>
//             </label>
//             <DatePicker
//               placeholder="Select a date"
//               value={seValidityDate}
//               onChange={onSeValidityDateChange}
//             />
//           </div>
//         )}

//         <div className="mt-6">
//           <label className="block font-medium mb-2">
//             Upload S&E Registration Certificate<span className="text-red-500">*</span>
//           </label>
//           <Input
//             type="file"
//             accept=".pdf"
//             value={seDocumentFile}
//             onChange={onSeDocumentUpload}
//           />
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default SESetup;



import React from 'react';
import { Card,} from '@/components/ui/card';
import { Input, DatePicker, Radio } from '@/components/ui';
import OutlinedInput from '@/components/ui/OutlinedInput';

const SESetup = ({ 
  seRegistrationNumber, 
  seValidityType, 
  seValidityDate, 
  seDocumentFile,
  onSeRegistrationNumberChange,
  onSeValidityTypeChange, 
  onSeValidityDateChange,
  onSeDocumentUpload
}) => {
  return (
    <Card className="w-full">
      <div>
        <h4>S&E Setup</h4>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <p className="block font-medium mb-2">
              S&E Registration Number<span className="text-red-500">*</span>
            </p>
            <OutlinedInput
              label="Enter S&E Registration Number"
              value={seRegistrationNumber}
              onChange={onSeRegistrationNumberChange}
            />
          </div>
          <div>
            <label className="block font-medium mb-2">
              S&E Validity Type<span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-4">
                <div className='flex gap-2'>

              <Radio
                // label="Fixed"
                placeholder='Fixed'
                name="Fixed"
                checked={seValidityType === 'fixed'}
                onChange={() => onSeValidityTypeChange('fixed')}
                />
                <span>Fixed</span>
                </div>
                <div className='flex gap-2'>

              <Radio
                // label="Lifetime"
                placeholder='Lifetime'
                name="Lifetime"
                checked={seValidityType === 'lifetime'}
                onChange={() => onSeValidityTypeChange('lifetime')}
                />
                <span>Lifetime</span>
                </div>
            </div>
          </div>
        </div>

        {seValidityType === 'fixed' && (
          <div className="mt-6">
            <label className="block font-medium mb-2">
              S&E Validity Date<span className="text-red-500">*</span>
            </label>
            <DatePicker
              placeholder="Select a date"
              value={seValidityDate}
              onChange={onSeValidityDateChange}
            />
          </div>
        )}

        <div className="mt-6">
          <label className="block font-medium mb-2">
            Upload S&E Registration Certificate<span className="text-red-500">*</span>
          </label>
          <Input
            type="file"
            accept=".pdf"
            value={seDocumentFile}
            onChange={onSeDocumentUpload}
          />
        </div>
      </div>
    </Card>
  );
};

export default SESetup;