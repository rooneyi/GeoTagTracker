export interface User {
  id: number
  name: string
  email: string | null
  phone: string | null
  role: 'admin' | 'technician' | null
  is_active: boolean | null
  last_login_at: string | null
  created_at: string | null
  updated_at: string | null
}

export interface Position {
  latitude: number
  longitude: number
  gps_accuracy: number | null
}

export interface Device {
  platform: string
  model: string | null
  app_version: string | null
}

export interface Submission {
  id: number
  user_id: number
  status: string
  photo_path: string
  photo_url: string
  photo_name: string
  captured_at: string
  received_at: string
  viewed_at: string | null
  position: Position
  address_label: string | null
  device: Device
  user: User | null
  created_at: string
  updated_at: string
}

export interface Technician {
  id: number
  name: string
  email: string | null
  phone: string | null
  role: string | null
  is_active: boolean | null
  last_login_at: string | null
  created_at: string | null
  updated_at: string | null
}

export interface DashboardStats {
  total_submissions: number
  today_submissions: number
  active_technicians: number
  submitted_count: number
  viewed_count: number
}

export interface PaginatedResponse<T> {
  data: T[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    per_page: number
    to: number
    total: number
  }
}

export interface ApiResponse<T> {
  data: T
  message?: string
}
