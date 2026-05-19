import { apiClient } from './client'
import type { ApiResponse, User } from '../types'

export interface LoginPayload {
  phone: string
  password: string
  device_name?: string
}

export interface LoginData {
  token: string
  token_type: string
  user: User
}

export const login = (payload: LoginPayload) =>
  apiClient.post<ApiResponse<LoginData>>('/auth/login', {
    ...payload,
    device_name: payload.device_name ?? 'web-admin',
  })

export const me = () =>
  apiClient.get<ApiResponse<User>>('/auth/me')

export const logout = () =>
  apiClient.post('/auth/logout')
