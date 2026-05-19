import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboardStats } from '../api/dashboard'
import { getSubmissions } from '../api/submissions'
import type { DashboardStats, Submission } from '../types'
import StatusBadge from '../components/ui/StatusBadge'
import { formatDate } from '../utils/format'

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recent, setRecent] = useState<Submission[]>([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingRecent, setLoadingRecent] = useState(true)

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data.data))
      .finally(() => setLoadingStats(false))

    getSubmissions({ per_page: 5, page: 1 })
      .then((res) => setRecent(res.data.data))
      .finally(() => setLoadingRecent(false))
  }, [])

  const statCards = stats
    ? (() => {
        const total = stats.total_submissions || 0
        const viewed = stats.viewed_count || 0
        const notViewed = stats.submitted_count || 0
        const viewedPct = total > 0 ? Math.round((viewed / total) * 100) : 0

        return [
          {
            key: 'total',
            label: 'Total soumissions',
            value: total,
            accent: '#000000',
          },
          {
            key: 'today',
            label: "Aujourd'hui",
            value: stats.today_submissions,
            accent: '#FF7900',
          },
          {
            key: 'techs',
            label: 'Techniciens actifs',
            value: stats.active_technicians,
            accent: '#000000',
          },
          {
            key: 'not_viewed',
            label: 'Non consultées',
            value: notViewed,
            accent: '#CD3C14',
          },
          {
            key: 'viewed',
            label: 'Consultées',
            value: viewed,
            accent: '#32C832',
          },
          {
            key: 'viewed_pct',
            label: 'Taux consult.',
            value: `${viewedPct}%`,
            accent: '#3B82F6',
          },
        ]
      })()
    : []

  return (
    <div>
      <h1
        style={{
          fontFamily: 'Helvetica Neue, Arial, sans-serif',
          fontSize: 28,
          fontWeight: 700,
          color: '#000000',
          marginBottom: 12,
          marginTop: 0,
        }}
      >
        Tableau de bord
      </h1>

      {/* Top summary cards - unique, no duplicates */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {(loadingStats ? Array.from({ length: 4 }) : statCards.slice(0, 4)).map((card: any, i: number) => (
          <div
            key={card?.label ?? i}
            style={{
              background: '#FFFFFF',
              padding: '18px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: 88,
              border: '1px solid #F0F0F0',
            }}
          >
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: card?.accent ?? '#000' }}>{card?.value ?? '—'}</div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>{card?.label ?? ''}</div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 6, background: (card?.accent ?? '#EEE'), opacity: 0.18 }} />
          </div>
        ))}
      </div>

      {/* Main content: 3 columns - chart / recent / right column */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px 320px', gap: 16 }}>
        {/* Left: chart - simple donut showing consulted vs not consulted */}
        <div style={{ background: '#FFFFFF', padding: 20, border: '1px solid #F0F0F0' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Consultation</h3>
          <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {stats ? (
              (() => {
                const total = stats.total_submissions || 0
                const viewed = stats.viewed_count || 0
                const notViewed = stats.submitted_count || 0
                const viewedPct = total > 0 ? (viewed / total) * 100 : 0
                const radius = 60
                const circumference = 2 * Math.PI * radius
                const dash = (viewedPct / 100) * circumference

                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <svg width={160} height={140} viewBox="0 0 160 140">
                      <g transform="translate(80,70)">
                        <circle r={radius} fill="none" stroke="#F3F4F6" strokeWidth={18} />
                        <circle
                          r={radius}
                          fill="none"
                          stroke="#32C832"
                          strokeWidth={18}
                          strokeLinecap="round"
                          strokeDasharray={`${dash} ${circumference - dash}`}
                          transform="rotate(-90)"
                        />
                      </g>
                    </svg>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 700 }}>{Math.round(viewedPct)}%</div>
                      <div style={{ fontSize: 12, color: '#666' }}>{viewed} consultées / {total} total</div>
                      <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>Non consultées: {notViewed}</div>
                    </div>
                  </div>
                )
              })()
            ) : (
              <div style={{ color: '#999' }}>Chargement...</div>
            )}
          </div>
        </div>

        {/* Center: recent submissions list */}
        <div style={{ background: '#FFFFFF', border: '1px solid #F0F0F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F5F5F5' }}>
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Admissions récentes</h2>
          </div>
          <div style={{ padding: 16 }}>
            {loadingRecent ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>Chargement...</div>
            ) : recent.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>Aucune soumission</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {recent.map((s) => (
                  <div key={s.id} style={{ padding: 12, border: '1px solid #F5F5F5', display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 22, background: '#F5F5F5' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{s.user?.name ?? '—'}</div>
                      <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>{formatDate(s.captured_at)}</div>
                    </div>
                    <div style={{ marginLeft: 8 }}><StatusBadge status={s.status} /></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: alerts + quick access */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#FFFFFF', padding: 16, border: '1px solid #F0F0F0', minHeight: 140 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Alertes</h3>
            <div style={{ paddingTop: 12, color: '#999' }}>Aucune alerte active</div>
          </div>

          {/* Accès rapide supprimé car liens non fonctionnels */}
        </div>
      </div>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        padding: '11px 16px',
        textAlign: 'left',
        fontSize: 11,
        fontWeight: 700,
        color: '#666666',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      }}
    >
      {children}
    </th>
  )
}

function Td({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <td
      style={{
        padding: '14px 16px',
        fontSize: 14,
        color: '#1A1A1A',
        ...style,
      }}
    >
      {children}
    </td>
  )
}
