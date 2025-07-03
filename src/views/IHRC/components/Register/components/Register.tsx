import { AdaptableCard } from '@/components/shared'
import React, { useState, useEffect } from 'react'
import SalaryRegisterTool from './RegisterTool'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import { useAppSelector } from '@/store'
import { HiOutlineViewGrid } from 'react-icons/hi'
import RegisterTable from './RegisterTable'
import RegisterTool from './RegisterTool'

const FINANCIAL_YEAR_KEY = 'selectedFinancialYear'
const FINANCIAL_YEAR_CHANGE_EVENT = 'financialYearChanged'

const SalaryRegister = () => {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [tableKey, setTableKey] = useState(Date.now())
    const [financialYear, setFinancialYear] = useState<string | null>(
        sessionStorage.getItem(FINANCIAL_YEAR_KEY)
    )

    // Extract the starting year from financial year (e.g., 2025 from 2025-26)
    const getYearFromFinancialYear = (fy: string | null) => {
        if (!fy) return null;
        return fy.split('-')[0]; // Returns the first part (2025 from 2025-26)
    };

    useEffect(() => {
        const handleFinancialYearChange = (event: CustomEvent) => {
            const newFinancialYear = event.detail
            setFinancialYear(newFinancialYear)
            sessionStorage.setItem(FINANCIAL_YEAR_KEY, newFinancialYear)
            setTableKey(Date.now()) // Refresh data when financial year changes
        }

        window.addEventListener(
            FINANCIAL_YEAR_CHANGE_EVENT,
            handleFinancialYearChange as EventListener
        )

        return () => {
            window.removeEventListener(
                FINANCIAL_YEAR_CHANGE_EVENT,
                handleFinancialYearChange as EventListener
            )
        }
    }, [])

    const fetchSalaryRegisterData = async () => {
        setLoading(true)
        try {
            const year = getYearFromFinancialYear(financialYear);
            const response = await httpClient.get(endpoints.register.listSalaryRegister(), {
                params: {
                    // register_type: 'Salary Register',
                    // year: year // Pass the extracted year instead of financial_year
                }
            })
            setData(response.data.data)
        } catch (error) {
            console.error('Failed to fetch salary register data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (financialYear) {
            fetchSalaryRegisterData()
        }
    }, [financialYear, tableKey])

    const handleRefresh = () => {
        setTableKey(Date.now())
    }

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold">Registers</h3>
                </div>
                <RegisterTool onSuccess={handleRefresh} />
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
                <RegisterTable data={data} />
            )}
        </AdaptableCard>
    )
}

export default SalaryRegister