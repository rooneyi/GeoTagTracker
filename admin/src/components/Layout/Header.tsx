import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

type HeaderProps = {
  isMobile: boolean
  onToggleSidebar: () => void
}

export default function Header({ isMobile, onToggleSidebar }: HeaderProps) {
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
        justifyContent: 'space-between',
        padding: isMobile ? '0 16px' : '0 32px',
        gap: 20,
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {isMobile && (
          <button
            onClick={onToggleSidebar}
            aria-label="Ouvrir le menu"
            style={{
              background: 'transparent',
              border: '1px solid #DDDDDD',
              color: '#000000',
              minWidth: 38,
              height: 38,
              padding: '0 10px',
              fontFamily: 'Helvetica Neue, Arial, sans-serif',
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.4,
              cursor: 'pointer',
              borderRadius: 0,
            }}
          >
            Menu
          </button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 20 }}>
        <span
          style={{
            fontFamily: 'Helvetica Neue, Arial, sans-serif',
            fontSize: 13,
            color: '#666666',
            maxWidth: isMobile ? 120 : 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
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
          Deconnexion
        </button>
      </div>
    </header>
  )
}
