import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SubmissionList from './pages/Submissions/SubmissionList'
import SubmissionDetail from './pages/Submissions/SubmissionDetail'
import TechnicianList from './pages/Technicians/TechnicianList'
import TechnicianHistory from './pages/Technicians/TechnicianHistory'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth()
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#000000',
          color: '#FF7900',
          fontFamily: 'Helvetica Neue, Arial, sans-serif',
          fontSize: 16,
        }}
      >
        Chargement...
      </div>
    )
  }
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AppRoutes() {
  const { token, loading } = useAuth()
  if (loading) return null
  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="submissions" element={<SubmissionList />} />
        <Route path="submissions/:id" element={<SubmissionDetail />} />
        <Route path="technicians" element={<TechnicianList />} />
        <Route path="technicians/:id/history" element={<TechnicianHistory />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
