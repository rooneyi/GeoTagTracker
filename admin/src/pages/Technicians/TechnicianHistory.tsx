import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getSubmissions } from '../../api/submissions'
import type { Submission } from '../../types'
import StatusBadge from '../../components/ui/StatusBadge'
import { formatDate } from '../../utils/format'

export default function TechnicianHistory() {
  const { id } = useParams<{ id: string }>()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [technicianName, setTechnicianName] = useState('')

  const fetchData = (page: number) => {
    if (!id) return
    setLoading(true)
    getSubmissions({ user_id: Number(id), page, per_page: 15 })
      .then((res) => {
        setSubmissions(res.data.data)
        setCurrentPage(res.data.meta.current_page)
        setLastPage(res.data.meta.last_page)
        setTotal(res.data.meta.total)
        if (res.data.data.length > 0 && res.data.data[0].user) {
          setTechnicianName(res.data.data[0].user.name)
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData(1)
  }, [id])

  const paginBtnStyle = (disabled: boolean): React.CSSProperties => ({
    padding: '6px 16px',
    background: 'transparent',
    border: '1px solid #DDDDDD',
    color: disabled ? '#CCCCCC' : '#000000',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: 13,
    borderRadius: 0,
    fontFamily: 'Helvetica Neue, Arial, sans-serif',
  })

  return (
    <div>
      {/* Breadcrumb */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 28,
          fontFamily: 'Helvetica Neue, Arial, sans-serif',
        }}
      >
        <Link
          to="/technicians"
          style={{ color: '#666666', textDecoration: 'none', fontSize: 13 }}
        >
          ← Techniciens
        </Link>
        <span style={{ color: '#DDDDDD' }}>/</span>
        <span style={{ fontSize: 13, color: '#000000', fontWeight: 600 }}>
          {technicianName || `Technicien #${id}`}
        </span>
        <span style={{ color: '#DDDDDD' }}>/</span>
        <span style={{ fontSize: 13, color: '#000000' }}>Historique</span>
      </div>

      <h1
        style={{
          fontFamily: 'Helvetica Neue, Arial, sans-serif',
          fontSize: 28,
          fontWeight: 700,
          color: '#000000',
          marginBottom: 24,
          marginTop: 0,
        }}
      >
        {technicianName ? `Historique — ${technicianName}` : 'Historique des soumissions'}
      </h1>

      <div style={{ background: '#FFFFFF' }}>
        <div
          style={{
            padding: '12px 24px',
            borderBottom: '1px solid #EEEEEE',
            fontFamily: 'Helvetica Neue, Arial, sans-serif',
            fontSize: 12,
            color: '#666666',
          }}
        >
          {total} soumission{total !== 1 ? 's' : ''}
        </div>

        {loading ? (
          <div
            style={{
              padding: 48,
              textAlign: 'center',
              color: '#999999',
              fontFamily: 'Helvetica Neue, Arial, sans-serif',
            }}
          >
            Chargement...
          </div>
        ) : submissions.length === 0 ? (
          <div
            style={{
              padding: 48,
              textAlign: 'center',
              color: '#999999',
              fontFamily: 'Helvetica Neue, Arial, sans-serif',
            }}
          >
            Aucune soumission pour ce technicien
          </div>
        ) : (
          <>
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
                  <Th>Aperçu</Th>
                  <Th>Date de capture</Th>
                  <Th>Statut</Th>
                  <Th>Position</Th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
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
                    <Td>
                      <img
                        src={s.photo_url}
                        alt="aperçu"
                        style={{
                          width: 60,
                          height: 44,
                          objectFit: 'cover',
                          display: 'block',
                        }}
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </Td>
                    <Td>{formatDate(s.captured_at)}</Td>
                    <Td>
                      <StatusBadge status={s.status} />
                    </Td>
                    <Td style={{ fontSize: 12, color: '#666666' }}>
                      {s.address_label ??
                        `${s.position.latitude.toFixed(4)}, ${s.position.longitude.toFixed(4)}`}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>

            {lastPage > 1 && (
              <div
                style={{
                  padding: '16px 24px',
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  borderTop: '1px solid #EEEEEE',
                }}
              >
                <button
                  onClick={() => fetchData(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={paginBtnStyle(currentPage === 1)}
                >
                  Précédent
                </button>
                <span
                  style={{
                    fontSize: 13,
                    color: '#666666',
                    padding: '0 8px',
                    fontFamily: 'Helvetica Neue, Arial, sans-serif',
                  }}
                >
                  Page {currentPage} / {lastPage}
                </span>
                <button
                  onClick={() => fetchData(currentPage + 1)}
                  disabled={currentPage === lastPage}
                  style={paginBtnStyle(currentPage === lastPage)}
                >
                  Suivant
                </button>
              </div>
            )}
          </>
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
