import { apiClient } from './client'
import type { ApiResponse, PaginatedResponse, Technician } from '../types'

export interface TechnicianFilters {
  is_active?: boolean
  per_page?: number
  page?: number
}

export interface CreateTechnicianPayload {
  name: string
  email: string
  phone?: string
  password: string
  is_active?: boolean
}

export interface UpdateTechnicianPayload {
  name?: string
  email?: string
  phone?: string
  password?: string
  is_active?: boolean
}

export const getTechnicians = (filters?: TechnicianFilters) =>
  apiClient.get<PaginatedResponse<Technician>>('/admin/technicians', {
    params: filters,
  })

export const createTechnician = (payload: CreateTechnicianPayload) =>
  apiClient.post<ApiResponse<Technician>>('/admin/technicians', payload)

export const updateTechnician = (id: number, payload: UpdateTechnicianPayload) =>
  apiClient.put<ApiResponse<Technician>>(`/admin/technicians/${id}`, payload)

export const toggleTechnicianStatus = (id: number, is_active: boolean) =>
  apiClient.patch<ApiResponse<Technician>>(`/admin/technicians/${id}/status`, {
    is_active,
  })
