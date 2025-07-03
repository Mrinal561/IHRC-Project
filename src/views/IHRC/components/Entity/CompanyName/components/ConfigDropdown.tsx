
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Button, Tooltip } from '@/components/ui';
import { FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { APP_PREFIX_PATH } from '@/constants/route.constant';

interface ConfigDropdownProps {
  companyName: string;
  companyGroupName?: string;
  companyId: string;
  groupId: string;
}

const ConfigDropdown: React.FC<ConfigDropdownProps> = ({ 
  companyName, 
  companyGroupName, 
  companyId,
  groupId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const handleSetupClick = (setupType) => {
    const urlSafeCompanyName = encodeURIComponent(companyName.replace(/\s+/g, '-').toLowerCase());
    navigate(`${APP_PREFIX_PATH}/IHRC/${setupType.toLowerCase()}-setup/${urlSafeCompanyName}`, 
      { state: { companyName, companyGroupName, companyId, groupId } }
    );
    setIsOpen(false);
  };

  const options = [
    { key: 'PF', label: 'PF Setup' },
    { key: 'ESI', label: 'ESI Setup' },
    { key: 'PT', label: 'PT Setup' },
    { key: 'LWF', label: 'LWF Setup' },
    {key: 'posh', label: 'POSH Setup'},
    {key: 'register', label: 'Register Setup'},
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target) &&
          dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <Tooltip title="Click To Configure">
        <Button
          ref={buttonRef}
          size="sm"
          icon={<FiSettings />}
          onClick={() => setIsOpen(!isOpen)}
        />
      </Tooltip>
      {isOpen && ReactDOM.createPortal(
        <div 
          ref={dropdownRef}
          className="py-2 w-40 bg-white rounded-md shadow-xl border border-gray-200 z-50 absolute"
          style={{
            position: 'absolute',
            top: buttonRef.current ? buttonRef.current.getBoundingClientRect().bottom + 'px' : '0',
            left: buttonRef.current ? 
              (buttonRef.current.getBoundingClientRect().left - 160 + buttonRef.current.getBoundingClientRect().width) + 'px' : '0',
            transform: 'translateY(8px)'
          }}
        >
          {options.map((option) => (
            <button
              key={option.key}
              className="block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-gray-100 w-full text-left"
              onClick={() => handleSetupClick(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

export default ConfigDropdown;