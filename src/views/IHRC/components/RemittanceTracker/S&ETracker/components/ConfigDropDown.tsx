import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Button, Tooltip, Dialog, Input, toast, Notification } from '@/components/ui';
import { FiSettings, FiUpload } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { HiUpload } from 'react-icons/hi';

const ConfigDropDown = ({ companyName, companyGroupName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target) &&
          dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsDialogOpen(true);
    setIsOpen(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log(`Uploading ${file.name} for ${selectedOption}`);
      // Here you would typically handle the file upload to your server
    }
    setIsDialogOpen(false);
  };

  const options = [
    { key: 'Payment', label: 'Payment Receipt Upload' },
  ];

  const updateDropdownPosition = () => {
    if (buttonRef.current && dropdownRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = dropdownRef.current.offsetWidth;
      dropdownRef.current.style.position = 'fixed';
      dropdownRef.current.style.top = `${rect.bottom + window.scrollY}px`;
      // Adjust the left position to move the dropdown more to the left
      dropdownRef.current.style.left = `${rect.left + window.scrollX - dropdownWidth + rect.width}px`;
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      window.addEventListener('scroll', updateDropdownPosition);
      window.addEventListener('resize', updateDropdownPosition);
    }
    return () => {
      window.removeEventListener('scroll', updateDropdownPosition);
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [isOpen]);


  const openNotification = (type: 'success' | 'info' | 'error' | 'warning', message: string) => {
    toast.push(
        <Notification
            title={type.charAt(0).toUpperCase() + type.slice(1)}
            type={type}
        >
            {message}
        </Notification>
    )
}


  const handleConfirm = () => {
    setIsDialogOpen(false);
    openNotification('success', 'Proof uploaded successfully');

  };


  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Tooltip title="Click to upload S&E documents">
        <Button
          ref={buttonRef}
          size='sm'
          icon={<HiUpload />}
          onClick={() => setIsOpen(!isOpen)}
        />
      </Tooltip>
      {isOpen && ReactDOM.createPortal(
        <div ref={dropdownRef} className="py-2 w-52 h-22 bg-white rounded-md shadow-xl mt-2 border border-gray-200 z-50">
          {options.map((option) => (
            <button
              key={option.key}
               className="block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-gray-100 w-full text-left"
              onClick={() => handleOptionClick(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>,
        document.body
      )}
      <Dialog isOpen={isDialogOpen}>
            <div className='mb-4'>Please Upload {selectedOption} reciept</div>
          <div className="flex flex-col gap-2">
          <Input
            type="file"
            onChange={handleFileUpload}
            className="mb-4"
          />
        </div>
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
    </>
  );
};

export default ConfigDropDown;