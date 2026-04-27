import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Tableau de bord', end: true },
  { to: '/submissions', label: 'Soumissions', end: false },
  { to: '/technicians', label: 'Techniciens', end: false },
]

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 240,
        minHeight: '100vh',
        background: '#1A1A1A',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          padding: '28px 24px 24px',
          borderBottom: '1px solid #2A2A2A',
        }}
      >
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
          {' '}
          Tracker
        </span>
        <div
          style={{
            color: '#666666',
            fontSize: 11,
            fontFamily: 'Helvetica Neue, Arial, sans-serif',
            marginTop: 4,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          Admin
        </div>
      </div>

      <nav style={{ flex: 1, paddingTop: 12 }}>
        {NAV_ITEMS.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
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
