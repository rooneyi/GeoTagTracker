import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { me, logout as apiLogout } from '../api/auth'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  token: string | null
  loading: boolean
  setAuth: (token: string, user: User) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('auth_token'),
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    me()
      .then((res) => setUser(res.data.data))
      .catch(() => {
        localStorage.removeItem('auth_token')
        setToken(null)
      })
      .finally(() => setLoading(false))
  }, [token])

  const setAuth = (newToken: string, newUser: User) => {
    localStorage.setItem('auth_token', newToken)
    setToken(newToken)
    setUser(newUser)
  }

  const logout = async () => {
    try {
      await apiLogout()
    } finally {
      localStorage.removeItem('auth_token')
      setToken(null)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
