// src/components/CustomChecklistButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { HiPlusCircle } from 'react-icons/hi';

const CustomChecklistButton: React.FC = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/assign-custom-form'); // Adjust the path as needed
    };

    return (
        <Button
            block
            variant="solid"
            size="sm"
            icon={<HiPlusCircle />}
            onClick={handleClick}
        >
           Add Compliance
        </Button>
    );
};

export default CustomChecklistButton;