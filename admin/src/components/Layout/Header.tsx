import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header
      style={{
        height: 56,
        background: '#FFFFFF',
        borderBottom: '1px solid #EEEEEE',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 32px',
        gap: 20,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: 'Helvetica Neue, Arial, sans-serif',
          fontSize: 13,
          color: '#666666',
        }}
      >
        {user?.name}
      </span>
      <button
        onClick={handleLogout}
        style={{
          background: 'transparent',
          border: '1px solid #000000',
          color: '#000000',
          padding: '7px 18px',
          fontFamily: 'Helvetica Neue, Arial, sans-serif',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          borderRadius: 0,
        }}
      >
        Déconnexion
      </button>
    </header>
  )
}
