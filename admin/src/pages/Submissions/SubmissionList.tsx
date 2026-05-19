import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getSubmissions } from '../../api/submissions'
import { getTechnicians } from '../../api/technicians'
import type { Submission, Technician } from '../../types'
import StatusBadge from '../../components/ui/StatusBadge'
import { formatDate } from '../../utils/format'
import { resolveAssetUrl } from '../../utils/assets'

type FiltersState = {
  status: string
  user_id: string
  from: string
  to: string
}

const INITIAL_FILTERS: FiltersState = { status: '', user_id: '', from: '', to: '' }

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'submitted', label: 'Envoyée' },
  { value: 'viewed', label: 'Consultée' },
  { value: 'received', label: 'Reçue' },
]

const selectStyle: React.CSSProperties = {
  padding: '9px 12px',
  border: '1px solid #DDDDDD',
  background: '#FFFFFF',
  fontFamily: 'Helvetica Neue, Arial, sans-serif',
  fontSize: 13,
  color: '#1A1A1A',
  outline: 'none',
  borderRadius: 0,
  minWidth: 160,
}

const inputStyle: React.CSSProperties = {
  padding: '9px 12px',
  border: '1px solid #DDDDDD',
  background: '#FFFFFF',
  fontFamily: 'Helvetica Neue, Arial, sans-serif',
  fontSize: 13,
  color: '#1A1A1A',
  outline: 'none',
  borderRadius: 0,
}

export default function SubmissionList() {
  const navigate = useNavigate()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState<FiltersState>(INITIAL_FILTERS)

  const fetchData = (page: number, f: FiltersState) => {
    setLoading(true)
    getSubmissions({
      page,
      per_page: 15,
      ...(f.status ? { status: f.status } : {}),
      ...(f.user_id ? { user_id: Number(f.user_id) } : {}),
      ...(f.from ? { from: f.from } : {}),
      ...(f.to ? { to: f.to } : {}),
    })
      .then((res) => {
        setSubmissions(res.data.data)
        setCurrentPage(res.data.meta.current_page)
        setLastPage(res.data.meta.last_page)
        setTotal(res.data.meta.total)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getTechnicians({ per_page: 100 }).then((res) => setTechnicians(res.data.data))
    fetchData(1, INITIAL_FILTERS)
  }, [])

  const handleSearch = () => fetchData(1, filters)

  const handleReset = () => {
    setFilters(INITIAL_FILTERS)
    fetchData(1, INITIAL_FILTERS)
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    color: '#666666',
    marginBottom: 5,
    fontFamily: 'Helvetica Neue, Arial, sans-serif',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    fontWeight: 600,
  }

  return (
    <div>
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
        Soumissions
      </h1>

      {/* Filters */}
      <div
        style={{
          background: '#FFFFFF',
          padding: '20px 24px',
          marginBottom: 20,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          alignItems: 'flex-end',
        }}
      >
        <div>
          <label style={labelStyle}>Technicien</label>
          <select
            value={filters.user_id}
            onChange={(e) => setFilters({ ...filters, user_id: e.target.value })}
            style={{ ...selectStyle, minWidth: 200 }}
          >
            <option value="">Tous</option>
            {technicians.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Statut</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            style={selectStyle}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Du</label>
          <input
            type="date"
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Au</label>
          <input
            type="date"
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
            style={inputStyle}
          />
        </div>

        <button
          onClick={handleSearch}
          style={{
            padding: '9px 24px',
            background: '#FF7900',
            border: 'none',
            color: '#000000',
            fontFamily: 'Helvetica Neue, Arial, sans-serif',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            borderRadius: 0,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          Filtrer
        </button>

        <button
          onClick={handleReset}
          style={{
            padding: '9px 24px',
            background: 'transparent',
            border: '1px solid #DDDDDD',
            color: '#666666',
            fontFamily: 'Helvetica Neue, Arial, sans-serif',
            fontSize: 12,
            cursor: 'pointer',
            borderRadius: 0,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          Réinitialiser
        </button>
      </div>

      {/* Table */}
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
            Aucune soumission trouvée
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
                  <Th>Technicien</Th>
                  <Th>Date de capture</Th>
                  <Th>Statut</Th>
                  <Th>Position</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr
                    key={s.id}
                    style={{ borderBottom: '1px solid #EEEEEE', cursor: 'pointer' }}
                    onClick={() => navigate(`/submissions/${s.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        navigate(`/submissions/${s.id}`)
                      }
                    }}
                    tabIndex={0}
                  >
                    <Td>
                      <Link
                        to={`/submissions/${s.id}`}
                        onClick={(e) => e.stopPropagation()}
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
                        src={resolveAssetUrl(s.photo_url)}
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
                    <Td>{s.user?.name ?? '—'}</Td>
                    <Td>{formatDate(s.captured_at)}</Td>
                    <Td>
                      <StatusBadge status={s.status} />
                    </Td>
                    <Td style={{ fontSize: 12, color: '#666666' }}>
                      {s.address_label ??
                        `${s.position.latitude.toFixed(4)}, ${s.position.longitude.toFixed(4)}`}
                    </Td>
                    <Td>
                      <Link
                        to={`/submissions/${s.id}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: 'inline-block',
                          padding: '7px 14px',
                          background: '#FF7900',
                          color: '#000000',
                          textDecoration: 'none',
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: 0.4,
                        }}
                      >
                        Voir
                      </Link>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>

            {lastPage > 1 && (
              <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                onPrev={() => fetchData(currentPage - 1, filters)}
                onNext={() => fetchData(currentPage + 1, filters)}
              />
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

function Pagination({
  currentPage,
  lastPage,
  onPrev,
  onNext,
}: {
  currentPage: number
  lastPage: number
  onPrev: () => void
  onNext: () => void
}) {
  const btnBase: React.CSSProperties = {
    padding: '6px 16px',
    background: 'transparent',
    fontFamily: 'Helvetica Neue, Arial, sans-serif',
    fontSize: 13,
    borderRadius: 0,
    cursor: 'pointer',
  }
  return (
    <div
      style={{
        padding: '16px 24px',
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        fontFamily: 'Helvetica Neue, Arial, sans-serif',
        borderTop: '1px solid #EEEEEE',
      }}
    >
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        style={{
          ...btnBase,
          border: '1px solid #DDDDDD',
          color: currentPage === 1 ? '#CCCCCC' : '#000000',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
        }}
      >
        Précédent
      </button>
      <span style={{ fontSize: 13, color: '#666666', padding: '0 8px' }}>
        Page {currentPage} / {lastPage}
      </span>
      <button
        onClick={onNext}
        disabled={currentPage === lastPage}
        style={{
          ...btnBase,
          border: '1px solid #DDDDDD',
          color: currentPage === lastPage ? '#CCCCCC' : '#000000',
          cursor: currentPage === lastPage ? 'not-allowed' : 'pointer',
        }}
      >
        Suivant
      </button>
    </div>
  )
}
