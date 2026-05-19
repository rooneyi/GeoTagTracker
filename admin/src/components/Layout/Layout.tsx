import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const MOBILE_BREAKPOINT = 960

export default function Layout() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(mobile)
      if (!mobile) {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F5F5' }}>
      {isMobile && isSidebarOpen && (
        <button
          aria-label="Fermer le menu"
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.35)',
            border: 'none',
            zIndex: 999,
            cursor: 'pointer',
          }}
        />
      )}

      <Sidebar
        isMobile={isMobile}
        isOpen={!isMobile || isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        <Header
          isMobile={isMobile}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />
        <main style={{ flex: 1, overflow: 'auto', padding: isMobile ? 16 : 32 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
