import React, { useState, useEffect } from 'react';
import { AdaptableCard } from '@/components/shared';
import ComplianceCertificateTable from './components/ComplianceCertificateTable';
import ComplianceCertificateTool from './components/ComplianceCertificateTool';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { useAppSelector } from '@/store';
import { Loading } from '@/components/shared';
import { HiOutlineViewGrid } from 'react-icons/hi';

const ComplianceCertificate = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [tableKey, setTableKey] = useState(Date.now());
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<string | null>(new Date().getFullYear().toString());
    
    // Generate year options (current year and previous 4 years)
    const yearOptions = Array.from({ length: 5 }, (_, i) => {
        const year = new Date().getFullYear() - i;
        return { value: year.toString(), label: year.toString() };
    });

    const fetchCertificateData = async () => {
        setLoading(true);
        try {
            const response = await httpClient.get(endpoints.compliance.listCertificate(), {
                params: {
                    companyId: selectedCompany,
                    month: selectedMonth,
                    year: selectedYear
                }
            });
            setData(response.data);
        } catch (error) {
            console.error('Failed to fetch compliance certificates:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedYear) {
            fetchCertificateData();
        }
    }, [selectedCompany, selectedMonth, selectedYear, tableKey]);

    const handleRefresh = () => {
        setTableKey(Date.now());
    };

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold">Compliance Certificates</h3>
                </div>
                <ComplianceCertificateTool 
                    onSuccess={handleRefresh}
                    yearOptions={yearOptions}
                    selectedCompany={selectedCompany}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    onCompanyChange={setSelectedCompany}
                    onMonthChange={setSelectedMonth}
                    onYearChange={setSelectedYear}
                />
            </div>
            {loading ? (
                <div className="py-10 text-gray-400">Loading...</div>
            ) : data.length === 0 ? (
                <div className="flex items-center justify-center min-h-[300px] w-full">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                        <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
                        <p className="text-center">No Data Available</p>
                    </div>
                </div>
            ) : (
                <ComplianceCertificateTable 
                    data={data} 
                    onDownloadSuccess={handleRefresh}
                />
            )}
        </AdaptableCard>
    );
};

export default ComplianceCertificate;