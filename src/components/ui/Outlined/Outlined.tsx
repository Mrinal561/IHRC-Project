

import React, { useState, useEffect } from 'react';
import { Select } from '../Select';
import { IoClose } from 'react-icons/io5';

const OutlinedSelect = ({ 
  label, 
  options, 
  value, 
  onChange, 
  isMulti = false, 
  isDisabled = false,
  showClearButton: allowClearButton = true // New prop with default value true
}) => {
  const [selectedValue, setSelectedValue] = useState(value);
  const [hasInput, setHasInput] = useState(false);

  useEffect(() => {
    setSelectedValue(value || (isMulti ? [] : ''));
  }, [value, isMulti]);

  const handleChange = (newValue) => {
    if (isMulti) {
      if (selectedValue.some(option => option.value === newValue.value)) {
        const updatedValue = selectedValue.filter(option => option.value !== newValue.value);
        setSelectedValue(updatedValue);
        onChange(updatedValue);
      } else {
        setSelectedValue([...selectedValue, newValue]);
        onChange([...selectedValue, newValue]);
      }
    } else {
      if (selectedValue === newValue) {
        setSelectedValue('');
        onChange('');
      } else {
        setSelectedValue(newValue);
        onChange(newValue);
      }
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (isMulti) {
      setSelectedValue([]);
      onChange([]);
    } else {
      setSelectedValue('');
      onChange('');
    }
  };

  // Modified to check both the value and the allowClearButton prop
  const shouldShowClearButton = allowClearButton && selectedValue && (
    (isMulti ? selectedValue.length > 0 : selectedValue !== '')
  );

  const isFloating = !isDisabled && (
    hasInput || 
    (selectedValue !== null && 
    selectedValue !== undefined && 
    (isMulti ? selectedValue.length > 0 : selectedValue !== ''))
  );

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full h-full border rounded-md pointer-events-none border-gray-300 bg-white">
        <span
          className={`absolute px-1 transition-all duration-200 ${
            isFloating
              ? '-top-3 left-3 text-xs font-semibold bg-white text-indigo-600'
              : 'top-2 left-2 text-sm text-gray-500'
          }`}
        >
          {label}
        </span>
      </div>
      <div className="relative flex items-center">
        <Select
          isDisabled={isDisabled}
          isMulti={isMulti}
          value={selectedValue}
          onChange={handleChange}
          options={options}
          className="w-full border-none bg-transparent"
          size="sm"
          onInputChange={(inputValue) => {
            setHasInput(inputValue.length > 0);
          }}
          styles={{
            control: (provided) => ({
              ...provided,
              minHeight: '36px',
              backgroundColor: 'transparent',
              border: 'none',
              boxShadow: 'none',
              paddingRight: shouldShowClearButton ? '23px' : '8px',
              '&:hover': {
                border: 'none',
              },
            }),
            placeholder: (provided) => ({
              ...provided,
              color: 'transparent',
            }),
            singleValue: (provided) => ({
              ...provided,
              color: '#000',
              marginTop: isFloating ? '8px' : '0',
            }),
            multiValue: (provided) => ({
              ...provided,
              marginTop: isFloating ? '8px' : '0',
            }),
            valueContainer: (provided) => ({
              ...provided,
              padding: '2px 8px',
            }),
            input: (provided) => ({
              ...provided,
              marginTop: isFloating ? '8px' : '0',
              color: '#000',
            }),
            menu: (provided) => ({
              ...provided,
              zIndex: 9999,
              position: 'absolute',
              backgroundColor: 'white',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              width: 'auto',
              minWidth: '100%'
            }),
            menuList: (provided) => ({
              ...provided,
              padding: 0,
              whiteSpace: 'nowrap',
            }),
            menuPortal: (provided) => ({
              ...provided,
              zIndex: 9999,
            }),
            indicatorSeparator: () => ({
              display: 'none',
            }),
            dropdownIndicator: (provided) => ({
              ...provided,
              padding: '0 8px',
            }),
          }}
          placeholder=""
          menuPortalTarget={document.body}
        />
        {shouldShowClearButton && !isDisabled && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full focus:outline-none"
            onClick={handleClear}
            type="button"
            aria-label="Clear selection"
          >
            <IoClose className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default OutlinedSelect;