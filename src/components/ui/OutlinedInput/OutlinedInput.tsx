// import React, { useState } from 'react';

// interface OutlinedInputProps {
//   label: string;
//   value: string;
//   onChange: (value: string) => void;
//   textarea?: boolean; // Add a prop for textarea support
// }

// const OutlinedInput: React.FC<OutlinedInputProps> = ({ label, value, onChange, textarea = false }) => {
//   const [isFocused, setIsFocused] = useState(false);

//   const handleFocus = () => setIsFocused(true);
//   const handleBlur = () => setIsFocused(false);

//   const isFloating = isFocused || value !== '';

//   return (
//     <div className="relative">
//       <div className="absolute top-0 left-0 w-full h-full border rounded-md pointer-events-none border-gray-300">
//         <span
//           className={`absolute px-1 transition-all duration-200 ${
//             isFloating
//               ? '-top-3 left-3 text-xs font-semibold bg-white text-indigo-600'
//               : 'top-2 left-2 text-sm text-gray-500'
//           }`}
//         >
//           {label}
//         </span>
//       </div>

//       {textarea ? (
//         <textarea
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           onFocus={handleFocus}
//           onBlur={handleBlur}
//           className="w-full px-3 py-2 bg-transparent border-none focus:outline-none resize-none"
//           rows={4} // You can control the rows here
//         />
//       ) : (
//         <input
//           type="text"
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           onFocus={handleFocus}
//           onBlur={handleBlur}
//           className="w-full px-3 py-2 bg-transparent border-none focus:outline-none"
//         />
//       )}
//     </div>
//   );
// };

// export default OutlinedInput;

import React, { useState } from 'react';

interface OutlinedInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  maxLabelWidth?: string;
}

const OutlinedInput: React.FC<OutlinedInputProps> = ({ 
  label, 
  value, 
  onChange, 
  textarea = false,
  maxLabelWidth = '90%' // Default max width for the label
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const isFloating = isFocused || value !== '';

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full h-full border rounded-md pointer-events-none border-gray-300">
        <span
          className={`absolute px-1 transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis ${
            isFloating
              ? '-top-3 left-3 text-xs font-semibold bg-white text-indigo-600'
              : 'top-2 left-2 text-sm text-gray-500'
          }`}
          style={{ maxWidth: maxLabelWidth }}
        >
          {label}
        </span>
      </div>

      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full px-3 py-2 bg-transparent border-none focus:outline-none resize-none"
          rows={4}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full px-3 py-2 bg-transparent border-none focus:outline-none"
        />
      )}
    </div>
  );
};

export default OutlinedInput;


