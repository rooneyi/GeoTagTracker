import { NavLink } from 'react-router-dom'
import logoOrange from '../../assets/logo_orange.svg'

const NAV_ITEMS = [
  { to: '/', label: 'Tableau de bord', end: true },
  { to: '/submissions', label: 'Soumissions', end: false },
  { to: '/technicians', label: 'Techniciens', end: false },
]

type SidebarProps = {
  isMobile: boolean
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isMobile, isOpen, onClose }: SidebarProps) {
  return (
    <aside
      style={{
        width: 240,
        minHeight: '100vh',
        background: '#1A1A1A',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: isMobile ? 'fixed' : 'relative',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: isMobile ? 1000 : 'auto',
        transform: isMobile ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
        transition: 'transform 0.25s ease',
        boxShadow: isMobile && isOpen ? '0 18px 40px rgba(0, 0, 0, 0.28)' : 'none',
      }}
    >
      <div
        style={{
          padding: '28px 24px 24px',
          borderBottom: '1px solid #2A2A2A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src={logoOrange}
            alt="GeoTag logo"
            style={{ width: 40, height: 40 }}
          />
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
            <span
              style={{
                color: '#FF7900',
                fontFamily: 'Helvetica Neue, Arial, sans-serif',
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: 0.5,
              }}
            >
              GeoTag
            </span>
            <span
              style={{
                color: '#FFFFFF',
                fontFamily: 'Helvetica Neue, Arial, sans-serif',
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              Tracker
            </span>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, paddingTop: 12 }}>
        {NAV_ITEMS.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => {
              if (isMobile) onClose()
            }}
            style={({ isActive }) => ({
              display: 'block',
              padding: '13px 24px',
              fontFamily: 'Helvetica Neue, Arial, sans-serif',
              fontSize: 14,
              fontWeight: isActive ? 700 : 400,
              color: isActive ? '#FF7900' : '#999999',
              textDecoration: 'none',
              background: isActive ? 'rgba(255,121,0,0.08)' : 'transparent',
              borderRight: isActive ? '3px solid #FF7900' : '3px solid transparent',
            })}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div
        style={{
          padding: '14px 24px',
          borderTop: '1px solid #2A2A2A',
          color: '#444444',
          fontFamily: 'Helvetica Neue, Arial, sans-serif',
          fontSize: 11,
        }}
      >
        v1.0.0
      </div>
    </aside>
  )
}
