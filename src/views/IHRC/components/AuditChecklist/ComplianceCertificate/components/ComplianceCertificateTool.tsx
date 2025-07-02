import React, { useState } from 'react';
import { Button, Dialog, Notification, toast } from '@/components/ui';
import { HiDownload, HiPlusCircle } from 'react-icons/hi';
import GenerateCertificateDialog from './GenerateCertificateDialog';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

interface ComplianceCertificateToolProps {
    onSuccess: () => void;
    yearOptions: { value: string; label: string }[];
    selectedCompany: string | null;
    selectedMonth: string | null;
    selectedYear: string | null;
    onCompanyChange: (value: string | null) => void;
    onMonthChange: (value: string | null) => void;
    onYearChange: (value: string | null) => void;
}

const monthOptions = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
];

const ComplianceCertificateTool: React.FC<ComplianceCertificateToolProps> = ({ 
    onSuccess,
    yearOptions,
    selectedCompany,
    selectedMonth,
    selectedYear,
    onCompanyChange,
    onMonthChange,
    onYearChange
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [companies, setCompanies] = useState<{ value: string; label: string }[]>([]);
    const [loadingCompanies, setLoadingCompanies] = useState(false);

    // Fetch companies on component mount
    React.useEffect(() => {
        const fetchCompanies = async () => {
            setLoadingCompanies(true);
            try {
                const response = await httpClient.get(endpoints.company.getAll());
                const formattedCompanies = response.data?.data?.map((company: any) => ({
                    value: company.id.toString(),
                    label: company.name
                }));
                setCompanies(formattedCompanies || []);
            } catch (error) {
                console.error('Failed to fetch companies:', error);
            } finally {
                setLoadingCompanies(false);
            }
        };

        fetchCompanies();
    }, []);

    const handleGenerateSuccess = () => {
        setIsDialogOpen(false);
        onSuccess();
    };

    return (
        <>
            <div className="flex gap-2 items-center">
                {/* Company Dropdown */}
                <div className="min-w-[150px]">
                    <OutlinedSelect
                        options={companies}
                        value={selectedCompany ? 
                            { value: selectedCompany, label: companies.find(c => c.value === selectedCompany)?.label || '' } 
                            : null
                        }
                        onChange={(option) => onCompanyChange(option?.value || null)}
                        label="Select Company"
                        // isLoading={loadingCompanies}
                    />
                </div>

                {/* Month Dropdown */}
                <div className="min-w-[120px]">
                    <OutlinedSelect
                        options={monthOptions}
                        value={selectedMonth ? 
                            { value: selectedMonth, label: monthOptions.find(m => m.value === selectedMonth)?.label || '' } 
                            : null
                        }
                        onChange={(option) => onMonthChange(option?.value || null)}
                        label="Select Month"
                    />
                </div>

                {/* Year Dropdown */}
                <div className="min-w-[100px]">
                    <OutlinedSelect
                        options={yearOptions}
                        value={selectedYear ? 
                            { value: selectedYear, label: selectedYear } 
                            : null
                        }
                        onChange={(option) => onYearChange(option?.value || null)}
                        label="Select Year"
                    />
                </div>

                <Button
                    variant="solid"
                    size="sm"
                    icon={<HiPlusCircle />}
                    onClick={() => setIsDialogOpen(true)}
                    disabled={!selectedCompany || !selectedMonth || !selectedYear}
                >
                    Generate Certificate
                </Button>
            </div>

            <GenerateCertificateDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSuccess={handleGenerateSuccess}
                companyId={selectedCompany ? parseInt(selectedCompany) : undefined}
                month={selectedMonth || ''}
                year={selectedYear || ''}
            />
        </>
    );
};

export default ComplianceCertificateTool;