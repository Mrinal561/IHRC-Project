// src/services/complianceChecklistService.ts

import { endpoints } from "@/api/endpoint"
import httpClient from "@/api/http-client"

export const fetchComplianceChecklists = async (params: any) => {
  return httpClient.get(endpoints.compliance.listComplianceChecklist(), { params })
}

export const fetchComplianceChecklistDetail = async (id: number) => {
  return httpClient.get(endpoints.compliance.detailComplianceChecklist(id))
}

export const updateComplianceChecklist = async (id: number, data: any) => {
  return httpClient.put(endpoints.compliance.editComplianceChecklist(id), data)
}

export const deleteComplianceChecklist = async (id: number) => {
  return httpClient.delete(endpoints.compliance.detailComplianceChecklist(id))
}

export const downloadComplianceTemplate = async (companyId: number) => {
  return httpClient.get(endpoints.compliance.downloadComplianceTemplate(), {
    params: { company_id: companyId },
    responseType: 'blob'
  })
}

export const bulkUploadCompliance = async (data: FormData) => {
  return httpClient.post(endpoints.compliance.bulkUploadCompliance(), data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const downloadComplianceData = async (params: any) => {
  return httpClient.get(endpoints.compliance.downloadComplianceChecklist(), {
    params,
    responseType: 'blob'
  })
}