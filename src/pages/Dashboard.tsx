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
    ? [
        {
          label: 'Total soumissions',
          value: stats.total_submissions,
          accent: '#000000',
        },
        {
          label: "Aujourd'hui",
          value: stats.today_submissions,
          accent: '#FF7900',
        },
        {
          label: 'Techniciens actifs',
          value: stats.active_technicians,
          accent: '#000000',
        },
        {
          label: 'Non consultées',
          value: stats.submitted_count,
          accent: '#CD3C14',
        },
        {
          label: 'Consultées',
          value: stats.viewed_count,
          accent: '#32C832',
        },
      ]
    : []

  return (
    <div>
      <h1
        style={{
          fontFamily: 'Helvetica Neue, Arial, sans-serif',
          fontSize: 28,
          fontWeight: 700,
          color: '#000000',
          marginBottom: 32,
          marginTop: 0,
        }}
      >
        Tableau de bord
      </h1>

      {/* Stat cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
          gap: 16,
          marginBottom: 40,
        }}
      >
        {loadingStats
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: '#FFFFFF',
                  height: 96,
                  opacity: 0.4,
                }}
              />
            ))
          : statCards.map((card) => (
              <div
                key={card.label}
                style={{
                  background: '#FFFFFF',
                  padding: '20px 24px',
                  borderTop: `3px solid ${card.accent}`,
                }}
              >
                <div
                  style={{
                    fontSize: 38,
                    fontWeight: 700,
                    color: card.accent,
                    fontFamily: 'Helvetica Neue, Arial, sans-serif',
                    lineHeight: 1,
                  }}
                >
                  {card.value}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#666666',
                    fontFamily: 'Helvetica Neue, Arial, sans-serif',
                    marginTop: 8,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {card.label}
                </div>
              </div>
            ))}
      </div>

      {/* Recent submissions */}
      <div style={{ background: '#FFFFFF' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid #EEEEEE',
          }}
        >
          <h2
            style={{
              fontFamily: 'Helvetica Neue, Arial, sans-serif',
              fontSize: 14,
              fontWeight: 700,
              margin: 0,
              color: '#000000',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Soumissions récentes
          </h2>
          <Link
            to="/submissions"
            style={{
              fontFamily: 'Helvetica Neue, Arial, sans-serif',
              fontSize: 12,
              color: '#FF7900',
              textDecoration: 'none',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Voir tout
          </Link>
        </div>

        {loadingRecent ? (
          <div
            style={{
              padding: 40,
              textAlign: 'center',
              color: '#999999',
              fontFamily: 'Helvetica Neue, Arial, sans-serif',
              fontSize: 14,
            }}
          >
            Chargement...
          </div>
        ) : recent.length === 0 ? (
          <div
            style={{
              padding: 40,
              textAlign: 'center',
              color: '#999999',
              fontFamily: 'Helvetica Neue, Arial, sans-serif',
              fontSize: 14,
            }}
          >
            Aucune soumission
          </div>
        ) : (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: 'Helvetica Neue, Arial, sans-serif',
            }}
          >
            <thead>
              <tr style={{ background: '#F5F5F5' }}>
                <Th>ID</Th>
                <Th>Technicien</Th>
                <Th>Date de capture</Th>
                <Th>Statut</Th>
                <Th>Zone</Th>
              </tr>
            </thead>
            <tbody>
              {recent.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #EEEEEE' }}>
                  <Td>
                    <Link
                      to={`/submissions/${s.id}`}
                      style={{
                        color: '#FF7900',
                        textDecoration: 'none',
                        fontWeight: 600,
                      }}
                    >
                      #{s.id}
                    </Link>
                  </Td>
                  <Td>{s.user?.name ?? '—'}</Td>
                  <Td>{formatDate(s.captured_at)}</Td>
                  <Td>
                    <StatusBadge status={s.status} />
                  </Td>
                  <Td style={{ color: '#666666', fontSize: 13 }}>
                    {s.address_label ??
                      `${s.position.latitude.toFixed(4)}, ${s.position.longitude.toFixed(4)}`}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
