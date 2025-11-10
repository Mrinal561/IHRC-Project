import React, { useState } from 'react'
import Button from '@/components/ui/Button'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import RecommendedTableSearch from './RecommendedTableSearch'
import { Dialog, toast, Notification, Select } from '../../../../../../components/ui'
import { useDispatch } from 'react-redux'
import {
    assignCompliancesToBranch,
} from '@/store/slices/compliance/ComplianceApiSlice'
import { showErrorNotification } from '@/components/ui/ErrorMessage'
 
interface AssignChecklistButtonProps {
    selectedComplianceIds: number[];
    branchValue?: string
    companyGroupValue?: string;
    companyValue?: string;
    stateValue?: string;
    districtValue?: string;
    locationValue?: string
    onAssignSuccess?: () => void;
    canCreate: boolean;
}
 
const AssignChecklistButton = ({
    selectedComplianceIds,
    branchValue,
    companyGroupValue,
    companyValue,
    stateValue,
    locationValue,
    districtValue,
    onAssignSuccess,
    canCreate
}: AssignChecklistButtonProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAssigning, setIsAssigning] = useState(false);
    const dispatch = useDispatch();
    
    const handleAssignClick = () => {
        // Check if at least one field is selected
        if (!companyGroupValue && !companyValue && !stateValue && !districtValue && !locationValue && !branchValue) {
            toast.push(
                <Notification title="Missing Information" type="danger">
                    Please select at least one field
                </Notification>
            );
            return;
        }
   
        // Check hierarchy only if fields are selected
        if (companyValue && !companyGroupValue) {
            toast.push(
                <Notification title="Missing Information" type="danger">
                    Please select Company Group before selecting Company
                </Notification>
            );
            return;
        }
   
        if (stateValue && (!companyGroupValue || !companyValue)) {
            toast.push(
                <Notification title="Missing Information" type="danger">
                    Please select Company Group and Company before selecting State
                </Notification>
            );
            return;
        }
   
        if (districtValue && (!companyGroupValue || !companyValue || !stateValue)) {
            toast.push(
                <Notification title="Missing Information" type="danger">
                    Please select Company Group, Company, and State before selecting District
                </Notification>
            );
            return;
        }
   
        if (locationValue && (!companyGroupValue || !companyValue || !stateValue || !districtValue)) {
            toast.push(
                <Notification title="Missing Information" type="danger">
                    Please select Company Group, Company, State, and District before selecting Location
                </Notification>
            );
            return;
        }
   
        if (branchValue && (!companyGroupValue || !companyValue || !stateValue || !districtValue || !locationValue)) {
            toast.push(
                <Notification title="Missing Information" type="danger">
                    Please select Company Group, Company, State, District, and Location before selecting Branch
                </Notification>
            );
            return;
        }
       
        if (selectedComplianceIds.length === 0) {
            toast.push(
                <Notification title="Empty" type="danger">
                    Please select at least one compliance
                </Notification>
            );
            return;
        }
   
        setIsDialogOpen(true);
    };
   
    const handleConfirm = async () => {
        setIsAssigning(true);
       
        const assignData = {
            group_id: parseInt(companyGroupValue),
            company_id: parseInt(companyValue),
            state_id: parseInt(stateValue),
            location_id: parseInt(locationValue),
            branch_id: parseInt(branchValue),
            compliance_id: selectedComplianceIds // Using the array of selected IDs
        };
 
        try {
            const response = await dispatch(assignCompliancesToBranch(assignData))
            .unwrap()
            .catch((error: any) => {
                // Handle different error formats
                if (error.response?.data?.message) {
                    // API error response
                    showErrorNotification(error.response.data.message);
                } else if (error.message) {
                    // Regular error object
                    showErrorNotification(error.message);
                } else if (Array.isArray(error)) {
                    // Array of error messages
                    showErrorNotification(error);
                } else {
                    // Fallback error message
                    // showErrorNotification('An unexpected error occurred. Please try again.');
                }
                throw error; // Re-throw to prevent navigation
            });

            if(response) {
                setIsDialogOpen(false);
                toast.push(
                    <Notification title="Success" type="success">
                    {selectedComplianceIds.length} compliance(s) assigned successfully
                </Notification>
            );
            onAssignSuccess?.(); // Notify parent of successful assignment       
        }
        } catch (error : any) {
            console.error('Failed to assign compliances:', error);
            toast.push(
                <Notification title="Failed" type="danger">
                    {error}
                </Notification>
            );
            // if (error.response?.data?.message) {
            //     showErrorNotification(error.response.data.message);
            // } else if (error.message) {
            //     showErrorNotification(error.message);
            // } else {
            //     showErrorNotification('An unexpected error occurred while deleting the user');
            // }
        } finally {
            setIsAssigning(false);
        }
    };
 
    const handleCancel = () => {
        setIsDialogOpen(false);
    };
 
    const isAssignDisabled = !companyGroupValue || !companyValue || !stateValue || !districtValue || !locationValue || !branchValue;
 
    return (
        <>
        {/* {canCreate && ( */}
            <Button
                variant="solid"
                size="sm"
                icon={<HiPlusCircle />}
                onClick={handleAssignClick}
                // disabled={selectedComplianceIds.length === 0 || !branchValue || isAssigning}
            >
               Assign Checklist
            </Button>
        {/* )} */}
            <Dialog
                isOpen={isDialogOpen}
                onClose={handleCancel}
                width={400}
            >
                <h5 className="mb-4">Confirm Assignment</h5>
                <p>
                    Are you sure you want to assign {selectedComplianceIds.length} compliance(s) to branch ID: {branchValue}?
                </p>
                <div className="mt-6 text-right">
                    <Button
                        size="sm"
                        className="mr-2"
                        onClick={handleCancel}
                        disabled={isAssigning}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        size="sm"
                        onClick={handleConfirm}
                        loading={isAssigning}
                    >
                        {isAssigning ? 'Assigning...' : 'Confirm'}
                    </Button>
                </div>
            </Dialog>
        </>
    );
};
 
interface RecommendedTableToolProps {
    selectedComplianceIds: number[];
    branchValue?: string
    companyGroupValue?: string;
    companyValue?: string;
    stateValue?: string;
    districtValue?: string;
    locationValue?: string
    onAssignSuccess?: () => void;
    canCreate: boolean;
}
 
const RecommendedTableTool = ({
    selectedComplianceIds,
    branchValue,
    companyGroupValue,
    companyValue,
    stateValue,
    locationValue,
    districtValue,
    onAssignSuccess,
    canCreate,
}: RecommendedTableToolProps) => {
    return (
        <>
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                <div className="block lg:inline-block md:mb-0 mb-4">
                    <AssignChecklistButton
                        selectedComplianceIds={selectedComplianceIds}
                        branchValue={branchValue}
                            companyGroupValue={companyGroupValue}
                            companyValue={companyValue}
                            stateValue={stateValue}
                            districtValue={districtValue}
                            locationValue={locationValue}
                        onAssignSuccess={onAssignSuccess}
                        canCreate={canCreate}
                    />
                </div>
            </div>
        </>
    )
}
 
export default RecommendedTableTool