// import React, { useState } from 'react';

import { useState } from "react";

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









// import React, { useState } from 'react';

// interface OutlinedInputProps {
//   label: string;
//   value: string;
//   onChange: (value: string) => void;
//   textarea?: boolean;
//   maxLabelWidth?: string;
//   disabled?: boolean;
//   maxCharsPerLine?: number; // New prop
//   placeholder?: string;
// }

// const OutlinedInput: React.FC<OutlinedInputProps> = ({ 
//   label, 
//   value, 
//   onChange, 
//   textarea = false,
//   maxLabelWidth = '90%',
//   disabled = false
// }) => {
//   const [isFocused, setIsFocused] = useState(false);

//   const handleFocus = () => setIsFocused(true);
//   const handleBlur = () => setIsFocused(false);

//   const isFloating = isFocused || value !== '';

// //   return (
// //     <div className="relative">
// //       <div className="absolute top-0 left-0 w-full h-full border rounded-md pointer-events-none border-gray-300">
// //         <span
// //           className={`absolute px-1 transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis ${
// //             isFloating
// //               ? '-top-3 left-3 text-xs font-semibold bg-white text-indigo-600'
// //               : 'top-2 left-2 text-sm text-gray-500'
// //           }`}
// //           style={{ maxWidth: maxLabelWidth }}
// //         >
// //           {label}
// //         </span>
// //       </div>

// //       {textarea ? (
// //         <textarea
// //           value={value}
// //           onChange={(e) => onChange(e.target.value)}
// //           onFocus={handleFocus}
// //           onBlur={handleBlur}
// //           className="w-full px-3 py-2 bg-transparent border-none focus:outline-none resize-none"
// //           rows={4}
// //         />
// //       ) : (
// //         <input
// //           type="text"
// //           value={value}
// //           onChange={(e) => onChange(e.target.value)}
// //           onFocus={handleFocus}
// //           onBlur={handleBlur}
// //           className="w-full px-3 py-2 bg-transparent border-none focus:outline-none"
// //         />
// //       )}
// //     </div>
// //   );
// // };

// return (
//     <div className={`relative ${disabled ? 'opacity-50' : ''}`}>
//       <div className="absolute top-0 left-0 w-full h-full border rounded-md pointer-events-none border-gray-300">
//         <span
//           className={`absolute px-1 transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis ${
//             isFloating
//               ? '-top-3 left-3 text-xs font-semibold bg-white text-indigo-600'
//               : 'top-2 left-2 text-sm text-gray-500'
//           } ${disabled ? 'text-gray-400' : ''}`}
//           style={{ maxWidth: maxLabelWidth }}
//         >
//           {label}
//         </span>
//       </div>

//       {textarea ? (
//         <textarea
//           value={value}
//           onChange={(e) => !disabled && onChange(e.target.value)}
//           onFocus={handleFocus}
//           onBlur={handleBlur}
//           className="w-full px-3 py-2 bg-transparent border-none focus:outline-none resize-none"
//           rows={4}
//           disabled={disabled}
//         />
//       ) : (
//         <input
//           type="text"
//           value={value}
//           onChange={(e) => !disabled && onChange(e.target.value)}
//           onFocus={handleFocus}
//           onBlur={handleBlur}
//           className="w-full px-3 py-2 bg-transparent border-none focus:outline-none"
//           disabled={disabled}
//         />
//       )}
//     </div>
//   );
// };

// export default OutlinedInput;




// interface OutlinedInputProps {
//   label: string;
//   value: string;
//   onChange: (value: string) => void;
//   textarea?: boolean;
//   maxLabelWidth?: string;
//   disabled?: boolean;
//   maxCharsPerLine?: number; // New prop
//   placeholder?: string; // New prop
// }

// const OutlinedInput: React.FC<OutlinedInputProps> = ({ 
//   label, 
//   value, 
//   onChange, 
//   textarea = false,
//   maxLabelWidth = '90%',
//   disabled = false,
//   maxCharsPerLine,
//   placeholder
// }) => {
//   const [isFocused, setIsFocused] = useState(false);

//   const handleFocus = () => setIsFocused(true);
//   const handleBlur = () => setIsFocused(false);

//   const isFloating = isFocused || value !== '';

//   const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//   if (!maxCharsPerLine) {
//     onChange(e.target.value);
//     return;
//   }

//   const cursorPosition = e.target.selectionStart;
//   const valueBeforeCursor = e.target.value.substring(0, cursorPosition);
//   const linesBeforeCursor = valueBeforeCursor.split('\n');
//   const currentLineIndex = linesBeforeCursor.length - 1;
//   const currentLine = linesBeforeCursor[currentLineIndex];

//   // Cast the native event to InputEvent to access inputType
//   const nativeEvent = e.nativeEvent as InputEvent;

//   // If current line reaches max chars and user didn't press enter, prevent input
//   if (currentLine.length >= maxCharsPerLine && nativeEvent.inputType !== 'insertLineBreak') {
//     return;
//   }

//   onChange(e.target.value);
// };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//   if (!maxCharsPerLine) return;

//   const textarea = e.target as HTMLTextAreaElement;
//   const cursorPosition = textarea.selectionStart;
//   const valueBeforeCursor = textarea.value.substring(0, cursorPosition);
//   const linesBeforeCursor = valueBeforeCursor.split('\n');
//   const currentLineIndex = linesBeforeCursor.length - 1;
//   const currentLine = linesBeforeCursor[currentLineIndex];

//   // Prevent typing beyond max chars (except for Enter key)
//   if (currentLine.length >= maxCharsPerLine && e.key !== 'Enter' && e.key !== 'Backspace') {
//     e.preventDefault();
//   }
// };

//   return (
//     <div className={`relative ${disabled ? 'opacity-50' : ''}`}>
//       <div className="absolute top-0 left-0 w-full h-full border rounded-md pointer-events-none border-gray-300">
//         <span
//           className={`absolute px-1 transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis ${
//             isFloating
//               ? '-top-3 left-3 text-xs font-semibold bg-white text-indigo-600'
//               : 'top-2 left-2 text-sm text-gray-500'
//           } ${disabled ? 'text-gray-400' : ''}`}
//           style={{ maxWidth: maxLabelWidth }}
//         >
//           {label}
//         </span>
//       </div>

//       {textarea ? (
//         <textarea
//           value={value}
//           onChange={handleTextareaChange}
//           onKeyDown={handleKeyDown}
//           onFocus={handleFocus}
//           onBlur={handleBlur}
//           className="w-full px-3 py-2 bg-transparent border-none focus:outline-none resize-none"
//           rows={4}
//           disabled={disabled}
//           placeholder={placeholder}
//         />
//       ) : (
//         <input
//           type="text"
//           value={value}
//           onChange={(e) => !disabled && onChange(e.target.value)}
//           onFocus={handleFocus}
//           onBlur={handleBlur}
//           className="w-full px-3 py-2 bg-transparent border-none focus:outline-none"
//           disabled={disabled}
//         />
//       )}
      
//       {maxCharsPerLine && textarea && (
//         <div className="text-xs text-gray-500 mt-1">
//           Max {maxCharsPerLine} characters per line
//         </div>
//       )}
//     </div>
//   );
// };


// export default OutlinedInput;






// interface OutlinedInputProps {
//   label: string;
//   value: string;
//   onChange: (value: string) => void;
//   onBlur?: () => void;  // Add this line
//   textarea?: boolean;
//   maxLabelWidth?: string;
//   disabled?: boolean;
//   maxCharsPerLine?: number;
//   placeholder?: string;
// }

// const OutlinedInput: React.FC<OutlinedInputProps> = ({ 
//   label, 
//   value, 
//   onChange, 
//   onBlur,  // Add this to destructured props
//   textarea = false,
//   maxLabelWidth = '90%',
//   disabled = false,
//   maxCharsPerLine,
//   placeholder
// }) => {
//   const [isFocused, setIsFocused] = useState(false);

//   const handleFocus = () => setIsFocused(true);
//   const handleBlur = () => {
//     setIsFocused(false);
//     if (onBlur) onBlur();  // Call the onBlur prop if it exists
//   };

//   const isFloating = isFocused || value !== '';

//   const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     if (!maxCharsPerLine) {
//       onChange(e.target.value);
//       return;
//     }

//     const cursorPosition = e.target.selectionStart;
//     const valueBeforeCursor = e.target.value.substring(0, cursorPosition);
//     const linesBeforeCursor = valueBeforeCursor.split('\n');
//     const currentLineIndex = linesBeforeCursor.length - 1;
//     const currentLine = linesBeforeCursor[currentLineIndex];

//     const nativeEvent = e.nativeEvent as InputEvent;

//     if (currentLine.length >= maxCharsPerLine && nativeEvent.inputType !== 'insertLineBreak') {
//       return;
//     }

//     onChange(e.target.value);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (!maxCharsPerLine) return;

//     const textarea = e.target as HTMLTextAreaElement;
//     const cursorPosition = textarea.selectionStart;
//     const valueBeforeCursor = textarea.value.substring(0, cursorPosition);
//     const linesBeforeCursor = valueBeforeCursor.split('\n');
//     const currentLineIndex = linesBeforeCursor.length - 1;
//     const currentLine = linesBeforeCursor[currentLineIndex];

//     if (currentLine.length >= maxCharsPerLine && e.key !== 'Enter' && e.key !== 'Backspace') {
//       e.preventDefault();
//     }
//   };

//   return (
//     <div className={`relative ${disabled ? 'opacity-50' : ''}`}>
//       <div className="absolute top-0 left-0 w-full h-full border rounded-md pointer-events-none border-gray-300">
//         <span
//           className={`absolute px-1 transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis ${
//             isFloating
//               ? '-top-3 left-3 text-xs font-semibold bg-white text-indigo-600'
//               : 'top-2 left-2 text-sm text-gray-500'
//           } ${disabled ? 'text-gray-400' : ''}`}
//           style={{ maxWidth: maxLabelWidth }}
//         >
//           {label}
//         </span>
//       </div>

//       {textarea ? (
//         <textarea
//           value={value}
//           onChange={handleTextareaChange}
//           onKeyDown={handleKeyDown}
//           onFocus={handleFocus}
//           onBlur={handleBlur}
//           className="w-full px-3 py-2 bg-transparent border-none focus:outline-none resize-none"
//           rows={4}
//           disabled={disabled}
//           placeholder={placeholder}
//         />
//       ) : (
//         <input
//           type="text"
//           value={value}
//           onChange={(e) => !disabled && onChange(e.target.value)}
//           onFocus={handleFocus}
//           onBlur={handleBlur}
//           className="w-full px-3 py-2 bg-transparent border-none focus:outline-none"
//           disabled={disabled}
//         />
//       )}
      
//       {maxCharsPerLine && textarea && (
//         <div className="text-xs text-gray-500 mt-1">
//           Max {maxCharsPerLine} characters per line
//         </div>
//       )}
//     </div>
//   );
// };

// export default OutlinedInput;








interface OutlinedInputProps {
  label: string;
  value: string | number | null;  // Allow null values
  onChange: (value: string) => void;
  onBlur?: (e?: React.FocusEvent) => void;  // More flexible onBlur type
  textarea?: boolean;
  maxLabelWidth?: string;
  disabled?: boolean;
  maxCharsPerLine?: number;
  placeholder?: string;
  error?: boolean;  // Add error prop
}

const OutlinedInput: React.FC<OutlinedInputProps> = ({ 
  label, 
  value, 
  onChange, 
  onBlur,
  textarea = false,
  maxLabelWidth = '90%',
  disabled = false,
  maxCharsPerLine,
  placeholder,
  error = false  // Add error prop with default
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const stringValue = value !== null ? String(value) : '';

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);  // Pass the event to onBlur
  };

  const isFloating = isFocused || (value !== null && value !== '');

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!maxCharsPerLine) {
      onChange(e.target.value);
      return;
    }

    const cursorPosition = e.target.selectionStart;
    const valueBeforeCursor = e.target.value.substring(0, cursorPosition);
    const linesBeforeCursor = valueBeforeCursor.split('\n');
    const currentLineIndex = linesBeforeCursor.length - 1;
    const currentLine = linesBeforeCursor[currentLineIndex];

    const nativeEvent = e.nativeEvent as InputEvent;

    if (currentLine.length >= maxCharsPerLine && nativeEvent.inputType !== 'insertLineBreak') {
      return;
    }

    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!maxCharsPerLine) return;

    const textarea = e.target as HTMLTextAreaElement;
    const cursorPosition = textarea.selectionStart;
    const valueBeforeCursor = textarea.value.substring(0, cursorPosition);
    const linesBeforeCursor = valueBeforeCursor.split('\n');
    const currentLineIndex = linesBeforeCursor.length - 1;
    const currentLine = linesBeforeCursor[currentLineIndex];

    if (currentLine.length >= maxCharsPerLine && e.key !== 'Enter' && e.key !== 'Backspace') {
      e.preventDefault();
    }
  };

  return (
    <div className={`relative ${disabled ? 'opacity-50' : ''}`}>
      <div className={`absolute top-0 left-0 w-full h-full border rounded-md pointer-events-none ${error ? 'border-red-500' : 'border-gray-300'}`}>
        <span
          className={`absolute px-1 transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis ${
            isFloating
              ? `-top-3 left-3 text-xs font-semibold bg-white ${error ? 'text-red-600' : 'text-indigo-600'}`
              : `top-2 left-2 text-sm ${error ? 'text-red-500' : 'text-gray-500'}`
          } ${disabled ? 'text-gray-400' : ''}`}
          style={{ maxWidth: maxLabelWidth }}
        >
          {label}
        </span>
      </div>

      {textarea ? (
        <textarea
          value={value || ''}  // Handle null case
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 bg-transparent border-none focus:outline-none resize-none ${error ? 'text-red-600' : ''}`}
          rows={4}
          disabled={disabled}
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
                  value={stringValue} // Handle null case
          onChange={(e) => !disabled && onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 bg-transparent border-none focus:outline-none ${error ? 'text-red-600' : ''}`}
          disabled={disabled}
          placeholder={placeholder}
        />
      )}
      
      {maxCharsPerLine && textarea && (
        <div className="text-xs text-gray-500 mt-1">
          Max {maxCharsPerLine} characters per line
        </div>
      )}
    </div>
  );
};

export default OutlinedInput;