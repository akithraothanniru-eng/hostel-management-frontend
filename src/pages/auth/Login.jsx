import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!username || !password) { setError('Please enter username and password'); return }
    setLoading(true)
    try {
      const user = await login(username, password)
      const dest = { ADMIN: '/admin', WARDEN: '/warden', STUDENT: '/student' }[user.role] || '/login'
      navigate(dest, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg"></div>
      <div className="login-grid"></div>

      <div className="login-card">
        <div className="login-logo">
          <div className="logo-mark" style={{ width: 44, height: 44, fontSize: '1.2rem' }}>H</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem' }}>HostelHub</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Management System</div>
          </div>
        </div>

        <h1 className="login-title">Welcome back</h1>
        <p className="login-sub">Sign in to your account to continue</p>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-input"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 8, fontSize: '0.95rem' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div style={{ marginTop: 28, padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Default Credentials</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[['Admin', 'admin1', 'admin123'], ['Warden', 'warden1', 'warden123'], ['Student', 'student1', 'pass1234']].map(([role, u, p]) => (
              <div key={role} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.8rem' }}>
                <span className={`badge badge-${role.toLowerCase() === 'admin' ? 'yellow' : role.toLowerCase() === 'warden' ? 'blue' : 'green'}`}>{role}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{u}</span>
                <span style={{ color: 'var(--text-muted)' }}>/</span>
                <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
