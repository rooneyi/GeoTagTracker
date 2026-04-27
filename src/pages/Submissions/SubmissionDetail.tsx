import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getSubmission, markSubmissionViewed } from '../../api/submissions'
import type { Submission } from '../../types'
import StatusBadge from '../../components/ui/StatusBadge'
import { formatDate } from '../../utils/format'

// Fix Leaflet default marker icons with Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

export default function SubmissionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    if (!id) return
    getSubmission(Number(id))
      .then((res) => setSubmission(res.data.data))
      .catch(() => setFetchError('Soumission introuvable.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleMarkViewed = async () => {
    if (!submission) return
    setMarking(true)
    try {
      await markSubmissionViewed(submission.id)
      setSubmission({ ...submission, status: 'viewed' })
    } finally {
      setMarking(false)
    }
  }

  if (loading) {
    return (
      <div
        style={{
          fontFamily: 'Helvetica Neue, Arial, sans-serif',
          color: '#666666',
          padding: 32,
        }}
      >
        Chargement...
      </div>
    )
  }

  if (fetchError || !submission) {
    return (
      <div style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', padding: 32 }}>
        <div style={{ color: '#CD3C14', marginBottom: 16 }}>
          {fetchError || 'Erreur inconnue.'}
        </div>
        <button
          onClick={() => navigate('/submissions')}
          style={{
            padding: '8px 20px',
            cursor: 'pointer',
            background: 'transparent',
            border: '1px solid #000000',
            borderRadius: 0,
            fontFamily: 'Helvetica Neue, Arial, sans-serif',
            fontSize: 13,
          }}
        >
          Retour
        </button>
      </div>
    )
  }

  const { position } = submission

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
          to="/submissions"
          style={{ color: '#666666', textDecoration: 'none', fontSize: 13 }}
        >
          ← Soumissions
        </Link>
        <span style={{ color: '#DDDDDD' }}>/</span>
        <span style={{ fontSize: 13, color: '#000000', fontWeight: 600 }}>
          #{submission.id}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Left column */}
        <div
          style={{
            flex: '0 0 420px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {/* Photo */}
          <Panel title="Photo">
            <img
              src={submission.photo_url}
              alt="preuve terrain"
              style={{ width: '100%', maxHeight: 380, objectFit: 'cover', display: 'block' }}
            />
          </Panel>

          {/* Informations */}
          <Panel title="Informations">
            <div
              style={{
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <InfoRow label="Statut">
                <StatusBadge status={submission.status} />
              </InfoRow>
              <InfoRow label="Technicien">
                {submission.user ? (
                  <Link
                    to={`/technicians/${submission.user_id}/history`}
                    style={{ color: '#FF7900', textDecoration: 'none', fontWeight: 500 }}
                  >
                    {submission.user.name}
                  </Link>
                ) : (
                  `ID ${submission.user_id}`
                )}
              </InfoRow>
              <InfoRow label="Date de capture">{formatDate(submission.captured_at)}</InfoRow>
              <InfoRow label="Date de réception">{formatDate(submission.received_at)}</InfoRow>
              {submission.viewed_at && (
                <InfoRow label="Consultée le">{formatDate(submission.viewed_at)}</InfoRow>
              )}
            </div>
          </Panel>

          {/* Appareil */}
          <Panel title="Appareil">
            <div
              style={{
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <InfoRow label="Plateforme">{submission.device.platform}</InfoRow>
              {submission.device.model && (
                <InfoRow label="Modèle">{submission.device.model}</InfoRow>
              )}
              {submission.device.app_version && (
                <InfoRow label="Version app">{submission.device.app_version}</InfoRow>
              )}
            </div>
          </Panel>
        </div>

        {/* Right column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* GPS */}
          <Panel title="Géolocalisation">
            <div
              style={{
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <InfoRow label="Latitude">{position.latitude}</InfoRow>
              <InfoRow label="Longitude">{position.longitude}</InfoRow>
              {position.gps_accuracy != null && (
                <InfoRow label="Précision GPS">{position.gps_accuracy} m</InfoRow>
              )}
              {submission.address_label && (
                <InfoRow label="Adresse">{submission.address_label}</InfoRow>
              )}
            </div>
          </Panel>

          {/* Map */}
          <Panel title="Carte">
            <div style={{ height: 340 }}>
              <MapContainer
                center={[position.latitude, position.longitude]}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[position.latitude, position.longitude]}>
                  <Popup>
                    {submission.user?.name ?? `Technicien #${submission.user_id}`}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </Panel>

          {/* Actions */}
          {submission.status !== 'viewed' && (
            <div
              style={{
                background: '#FFFFFF',
                padding: '16px 20px',
                display: 'flex',
                gap: 12,
              }}
            >
              <button
                onClick={handleMarkViewed}
                disabled={marking}
                style={{
                  padding: '10px 28px',
                  background: '#FF7900',
                  border: 'none',
                  color: '#000000',
                  fontFamily: 'Helvetica Neue, Arial, sans-serif',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: marking ? 'not-allowed' : 'pointer',
                  opacity: marking ? 0.7 : 1,
                  borderRadius: 0,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {marking ? '...' : 'Marquer comme consultée'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Panel({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div style={{ background: '#FFFFFF' }}>
      <div
        style={{
          padding: '13px 20px',
          borderBottom: '1px solid #EEEEEE',
          fontFamily: 'Helvetica Neue, Arial, sans-serif',
          fontSize: 11,
          fontWeight: 700,
          color: '#000000',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  )
}

function InfoRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      <span
        style={{
          width: 140,
          fontSize: 12,
          color: '#666666',
          fontFamily: 'Helvetica Neue, Arial, sans-serif',
          flexShrink: 0,
          paddingTop: 1,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 14,
          color: '#1A1A1A',
          fontFamily: 'Helvetica Neue, Arial, sans-serif',
          fontWeight: 500,
        }}
      >
        {children}
      </span>
    </div>
  )
}
