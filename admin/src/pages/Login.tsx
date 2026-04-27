import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { AxiosError } from 'axios'
import { login } from '../api/auth'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login({ email, password })
      setAuth(res.data.data.token, res.data.data.user)
      navigate('/')
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>
      if (axiosErr.response?.status === 403) {
        setError("Compte inactif. Contactez l'administrateur système.")
      } else if (axiosErr.response?.status === 422) {
        setError('Identifiants invalides.')
      } else {
        setError('Une erreur est survenue. Réessayez.')
      }
    } finally {
      setLoading(false)
    }
  }

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    background: '#1A1A1A',
    border: '1px solid #2E2E2E',
    color: '#FFFFFF',
    fontFamily: 'Helvetica Neue, Arial, sans-serif',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    borderRadius: 0,
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Helvetica Neue, Arial, sans-serif',
      }}
    >
      <div style={{ width: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ marginBottom: 12 }}>
            <span style={{ color: '#FF7900', fontSize: 36, fontWeight: 700 }}>
              GeoTag
            </span>
            <span style={{ color: '#FFFFFF', fontSize: 36, fontWeight: 700 }}>
              {' '}
              Tracker
            </span>
          </div>
          <p style={{ color: '#666666', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>
            Espace Administrateur
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <div>
            <label
              style={{
                display: 'block',
                color: '#999999',
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={fieldStyle}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                color: '#999999',
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={fieldStyle}
            />
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(205,60,20,0.12)',
                border: '1px solid #CD3C14',
                color: '#CD3C14',
                padding: '10px 14px',
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              padding: '14px',
              background: '#FF7900',
              border: 'none',
              color: '#000000',
              fontFamily: 'Helvetica Neue, Arial, sans-serif',
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              borderRadius: 0,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
