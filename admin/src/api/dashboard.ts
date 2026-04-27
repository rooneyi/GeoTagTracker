import { apiClient } from './client'
import type { ApiResponse, DashboardStats } from '../types'

export const getDashboardStats = () =>
  apiClient.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats')
