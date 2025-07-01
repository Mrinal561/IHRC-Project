import { AdaptableCard } from '@/components/shared'
import React, { useState, useEffect } from 'react'
import { HiOutlineViewGrid } from 'react-icons/hi'
import AttendanceRegisterTable from './AttendanceRegisterTable'
import AttendanceRegisterTool from './AttendanceRegisterTool'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'

const FINANCIAL_YEAR_KEY = 'selectedFinancialYear'
const FINANCIAL_YEAR_CHANGE_EVENT = 'financialYearChanged'

const AttendanceRegister = () => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [tableKey, setTableKey] = useState(Date.now())
  const [financialYear, setFinancialYear] = useState<string | null>(
    sessionStorage.getItem(FINANCIAL_YEAR_KEY) || '2025-26' // Default value
  )
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    total_pages: 1
  })

  // Extract the starting year from financial year
  const getYearFromFinancialYear = (fy: string | null) => {
    if (!fy) return null
    return fy.split('-')[0]
  }

  useEffect(() => {
    const handleFinancialYearChange = (event: CustomEvent) => {
      const newFinancialYear = event.detail
      setFinancialYear(newFinancialYear)
      sessionStorage.setItem(FINANCIAL_YEAR_KEY, newFinancialYear)
      setTableKey(Date.now())
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

  const fetchAttendanceRegisterData = async () => {
    setLoading(true)
    try {
      const year = getYearFromFinancialYear(financialYear)
      const response = await httpClient.get(endpoints.register.listAttendanceRegister(), {
        params: {
          register_type: 'Attendance Register',
          year: year
        }
      })
      
      // Make sure response has expected structure
      if (response.data && Array.isArray(response.data.data)) {
        setData(response.data.data)
        setMeta(response.data.meta || {
          total: response.data.data.length,
          page: 1,
          limit: 10,
          total_pages: 1
        })
      } else {
        console.error('Unexpected API response structure:', response.data)
        setData([])
      }
    } catch (error) {
      console.error('Failed to fetch attendance register data:', error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendanceRegisterData()
  }, [financialYear, tableKey])

  const handleRefresh = () => {
    setTableKey(Date.now())
  }

  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div className="mb-4 lg:mb-0">
          <h3 className="text-2xl font-bold">Attendance Register</h3>
        </div>
        <AttendanceRegisterTool onSuccess={handleRefresh} />
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
        <AttendanceRegisterTable 
          data={data} 
          meta={meta} 
        />
      )}
    </AdaptableCard>
  )
}

export default AttendanceRegister