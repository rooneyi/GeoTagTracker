import { apiClient } from './client'
import type { ApiResponse, PaginatedResponse, Submission } from '../types'

export interface SubmissionFilters {
  status?: string
  user_id?: number
  from?: string
  to?: string
  per_page?: number
  page?: number
}

export const getSubmissions = (filters?: SubmissionFilters) =>
  apiClient.get<PaginatedResponse<Submission>>('/admin/submissions', {
    params: filters,
  })

export const getSubmission = (id: number) =>
  apiClient.get<ApiResponse<Submission>>(`/admin/submissions/${id}`)

export const markSubmissionViewed = (id: number) =>
  apiClient.patch<{ message: string; submission: Submission }>(
    `/admin/submissions/${id}/mark-viewed`,
  )
