import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { AxiosError } from 'axios'
import {
  getTechnicians,
  createTechnician,
  updateTechnician,
  toggleTechnicianStatus,
  type CreateTechnicianPayload,
  type UpdateTechnicianPayload,
} from '../../api/technicians'
import type { Technician } from '../../types'
import { formatDate } from '../../utils/format'

type FilterActive = '' | 'true' | 'false'

interface FormState {
  name: string
  phone: string
  password: string
  is_active: boolean
}

const EMPTY_FORM: FormState = {
  name: '',
  phone: '',
  password: '',
  is_active: true,
}

const inputBase: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  border: '1px solid #DDDDDD',
  background: '#FFFFFF',
  fontFamily: 'Helvetica Neue, Arial, sans-serif',
  fontSize: 13,
  color: '#1A1A1A',
  outline: 'none',
  borderRadius: 0,
  boxSizing: 'border-box',
}

export default function TechnicianList() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [filterActive, setFilterActive] = useState<FilterActive>('')

  const [modal, setModal] = useState<'none' | 'create' | 'edit'>('none')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({})
  const [submitting, setSubmitting] = useState(false)

  const fetchData = (page: number, fa: FilterActive) => {
    setLoading(true)
    getTechnicians({
      page,
      per_page: 15,
      ...(fa !== '' ? { is_active: fa === 'true' } : {}),
    })
      .then((res) => {
        setTechnicians(res.data.data)
        setCurrentPage(res.data.meta.current_page)
        setLastPage(res.data.meta.last_page)
        setTotal(res.data.meta.total)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData(1, filterActive)
  }, [filterActive])

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setFormErrors({})
    setEditingId(null)
    setShowPassword(false)
    setModal('create')
  }

  const openEdit = (tech: Technician) => {
    setForm({
      name: tech.name,
      phone: tech.phone ?? '',
      password: '',
      is_active: tech.is_active ?? true,
    })
    setFormErrors({})
    setEditingId(tech.id)
    setShowPassword(false)
    setModal('edit')
  }

  const closeModal = () => {
    setModal('none')
    setEditingId(null)
  }

  const handleSubmit = async () => {
    setFormErrors({})
    setSubmitting(true)
    try {
      if (modal === 'create') {
        const payload: CreateTechnicianPayload = {
          name: form.name,
          phone: form.phone,
          password: form.password,
          is_active: form.is_active,
        }
        await createTechnician(payload)
      } else if (modal === 'edit' && editingId != null) {
        const payload: UpdateTechnicianPayload = {
          name: form.name,
          phone: form.phone,
          is_active: form.is_active,
          ...(form.password ? { password: form.password } : {}),
        }
        await updateTechnician(editingId, payload)
      }
      closeModal()
      fetchData(currentPage, filterActive)
    } catch (err) {
      const axiosErr = err as AxiosError<{ errors?: Record<string, string[]> }>
      if (axiosErr.response?.data?.errors) {
        setFormErrors(axiosErr.response.data.errors)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleStatus = async (tech: Technician) => {
    await toggleTechnicianStatus(tech.id, !(tech.is_active ?? false))
    setTechnicians((prev) =>
      prev.map((t) =>
        t.id === tech.id ? { ...t, is_active: !(tech.is_active ?? false) } : t,
      ),
    )
  }

  const filterBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '7px 18px',
    background: active ? '#000000' : 'transparent',
    border: '1px solid #CCCCCC',
    color: active ? '#FFFFFF' : '#666666',
    fontFamily: 'Helvetica Neue, Arial, sans-serif',
    fontSize: 12,
    fontWeight: active ? 700 : 400,
    cursor: 'pointer',
    borderRadius: 0,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  })

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <h1
          style={{
            fontFamily: 'Helvetica Neue, Arial, sans-serif',
            fontSize: 28,
            fontWeight: 700,
            color: '#000000',
            margin: 0,
          }}
        >
          Techniciens
        </h1>
        <button
          onClick={openCreate}
          style={{
            padding: '10px 24px',
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
          + Nouveau technicien
        </button>
      </div>

      <div
        style={{
          background: '#FFFFFF',
          padding: '14px 20px',
          marginBottom: 20,
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontFamily: 'Helvetica Neue, Arial, sans-serif',
            fontSize: 12,
            color: '#666666',
            marginRight: 4,
          }}
        >
          Afficher :
        </span>
        {(
          [
            { value: '' as FilterActive, label: 'Tous' },
            { value: 'true' as FilterActive, label: 'Actifs' },
            { value: 'false' as FilterActive, label: 'Inactifs' },
          ] as { value: FilterActive; label: string }[]
        ).map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilterActive(value)}
            style={filterBtnStyle(filterActive === value)}
          >
            {label}
          </button>
        ))}
      </div>

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
          {total} technicien{total !== 1 ? 's' : ''}
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
        ) : technicians.length === 0 ? (
          <div
            style={{
              padding: 48,
              textAlign: 'center',
              color: '#999999',
              fontFamily: 'Helvetica Neue, Arial, sans-serif',
            }}
          >
            Aucun technicien
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
                  <Th>Nom</Th>
                  <Th>Telephone</Th>
                  <Th>Statut</Th>
                  <Th>Cree le</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {technicians.map((tech) => {
                  const isActive = tech.is_active ?? false

                  return (
                    <tr key={tech.id} style={{ borderBottom: '1px solid #EEEEEE' }}>
                      <Td>{tech.id}</Td>
                      <Td style={{ fontWeight: 600 }}>{tech.name}</Td>
                      <Td style={{ color: '#666666' }}>{tech.phone ?? '-'}</Td>
                      <Td>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 10px',
                            background: isActive ? '#E8F5E9' : '#FFEBEE',
                            color: isActive ? '#32C832' : '#CD3C14',
                            fontSize: 12,
                            fontWeight: 600,
                            borderRadius: 0,
                          }}
                        >
                          {isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </Td>
                      <Td style={{ color: '#666666', fontSize: 13 }}>
                        {tech.created_at ? formatDate(tech.created_at) : '-'}
                      </Td>
                      <Td>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <button
                            onClick={() => navigate(`/technicians/${tech.id}/history`)}
                            style={actionButtonStyle('#DDDDDD', '#666666')}
                          >
                            Historique
                          </button>
                          <button
                            onClick={() => openEdit(tech)}
                            style={actionButtonStyle('#000000', '#000000')}
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleToggleStatus(tech)}
                            style={{
                              ...actionButtonStyle(isActive ? '#CD3C14' : '#FF7900', isActive ? '#CD3C14' : '#000000'),
                              background: isActive ? 'transparent' : '#FF7900',
                              border: isActive ? '1px solid #CD3C14' : 'none',
                            }}
                          >
                            {isActive ? 'Desactiver' : 'Activer'}
                          </button>
                        </div>
                      </Td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {lastPage > 1 && (
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
                  onClick={() => fetchData(currentPage - 1, filterActive)}
                  disabled={currentPage === 1}
                  style={paginationBtnStyle(currentPage === 1)}
                >
                  Precedent
                </button>
                <span style={{ fontSize: 13, color: '#666666', padding: '0 8px' }}>
                  Page {currentPage} / {lastPage}
                </span>
                <button
                  onClick={() => fetchData(currentPage + 1, filterActive)}
                  disabled={currentPage === lastPage}
                  style={paginationBtnStyle(currentPage === lastPage)}
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {modal !== 'none' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16,
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              width: 480,
              maxWidth: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              fontFamily: 'Helvetica Neue, Arial, sans-serif',
            }}
          >
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid #EEEEEE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#000000',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {modal === 'create' ? 'Nouveau technicien' : 'Modifier le technicien'}
              </h2>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 22,
                  cursor: 'pointer',
                  color: '#999999',
                  padding: '0 4px',
                  lineHeight: 1,
                }}
              >
                x
              </button>
            </div>

            <div
              style={{
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <FormField label="Nom *" error={formErrors.name?.[0]}>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{
                    ...inputBase,
                    borderColor: formErrors.name ? '#CD3C14' : '#DDDDDD',
                  }}
                />
              </FormField>

              <FormField label="Telephone *" error={formErrors.phone?.[0]}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  style={{
                    ...inputBase,
                    borderColor: formErrors.phone ? '#CD3C14' : '#DDDDDD',
                  }}
                  placeholder="+243..."
                />
              </FormField>

              <FormField
                label={
                  modal === 'create'
                    ? 'Mot de passe *'
                    : 'Mot de passe (vide = inchange)'
                }
                error={formErrors.password?.[0]}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    style={{
                      ...inputBase,
                      borderColor: formErrors.password ? '#CD3C14' : '#DDDDDD',
                    }}
                  />
                  <input
                    type="checkbox"
                    id="show_password"
                    checked={showPassword}
                    onChange={() => setShowPassword((v) => !v)}
                    style={{ marginLeft: 4, cursor: 'pointer' }}
                  />
                  <label
                    htmlFor="show_password"
                    style={{ fontSize: 12, color: '#1A1A1A', cursor: 'pointer' }}
                  >
                    Afficher
                  </label>
                </div>
              </FormField>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="checkbox"
                  id="is_active_modal"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                <label
                  htmlFor="is_active_modal"
                  style={{ fontSize: 13, color: '#1A1A1A', cursor: 'pointer' }}
                >
                  Compte actif
                </label>
              </div>
            </div>

            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid #EEEEEE',
                display: 'flex',
                gap: 12,
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={closeModal}
                style={{
                  padding: '9px 24px',
                  background: 'transparent',
                  border: '1px solid #CCCCCC',
                  color: '#666666',
                  fontFamily: 'Helvetica Neue, Arial, sans-serif',
                  fontSize: 12,
                  cursor: 'pointer',
                  borderRadius: 0,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  padding: '9px 24px',
                  background: '#FF7900',
                  border: 'none',
                  color: '#000000',
                  fontFamily: 'Helvetica Neue, Arial, sans-serif',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1,
                  borderRadius: 0,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {submitting ? '...' : modal === 'create' ? 'Creer' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
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

function FormField({
  label,
  children,
  error,
}: {
  label: string
  children: React.ReactNode
  error?: string
}) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: 11,
          color: '#666666',
          marginBottom: 6,
          fontFamily: 'Helvetica Neue, Arial, sans-serif',
          textTransform: 'uppercase',
          letterSpacing: 0.3,
          fontWeight: 600,
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <span
          style={{
            fontSize: 11,
            color: '#CD3C14',
            marginTop: 4,
            display: 'block',
          }}
        >
          {error}
        </span>
      )}
    </div>
  )
}

function actionButtonStyle(borderColor: string, color: string): React.CSSProperties {
  return {
    padding: '5px 12px',
    background: 'transparent',
    border: `1px solid ${borderColor}`,
    color,
    fontFamily: 'Helvetica Neue, Arial, sans-serif',
    fontSize: 11,
    cursor: 'pointer',
    borderRadius: 0,
  }
}

function paginationBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: '6px 16px',
    background: 'transparent',
    border: '1px solid #DDDDDD',
    color: disabled ? '#CCCCCC' : '#000000',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: 13,
    borderRadius: 0,
    fontFamily: 'Helvetica Neue, Arial, sans-serif',
  }
}
