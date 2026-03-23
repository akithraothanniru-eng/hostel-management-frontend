import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/* Role config — maps URL param to display info */
const roleConfig = {
  admin: {
    display: 'Admin',
    apiRole: 'ADMIN',
    icon: '⚡',
    accent: '#f0a500',
    glow: 'rgba(240,165,0,0.2)',
    dimColor: 'rgba(240,165,0,0.08)',
    border: 'rgba(240,165,0,0.25)',
    hint: { username: 'admin1', password: 'admin123' },
  },
  warden: {
    display: 'Warden',
    apiRole: 'WARDEN',
    icon: '🛡',
    accent: '#60a5fa',
    glow: 'rgba(96,165,250,0.2)',
    dimColor: 'rgba(96,165,250,0.08)',
    border: 'rgba(96,165,250,0.25)',
    hint: { username: 'warden1', password: 'warden123' },
  },
  student: {
    display: 'Student',
    apiRole: 'STUDENT',
    icon: '🎓',
    accent: '#34d399',
    glow: 'rgba(52,211,153,0.2)',
    dimColor: 'rgba(52,211,153,0.08)',
    border: 'rgba(52,211,153,0.25)',
    hint: { username: 'student1', password: 'pass1234' },
  },
}

export default function Login() {
  const { role: roleParam } = useParams()          // e.g. "admin", "warden", "student"
  const navigate = useNavigate()
  const { login, user } = useAuth()

  const config = roleConfig[roleParam] || roleConfig.admin
  const isValidRole = !!roleConfig[roleParam]

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [mounted,  setMounted]  = useState(false)
  const [showPw,   setShowPw]   = useState(false)

  // Redirect already-logged-in users
  useEffect(() => {
    if (user) {
      const dest = { ADMIN: '/admin', WARDEN: '/warden', STUDENT: '/student' }[user.role]
      if (dest) navigate(dest, { replace: true })
    }
  }, [user, navigate])

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!username.trim()) { setError('Username is required'); return }
    if (!password)        { setError('Password is required'); return }
    setLoading(true)
    try {
      const loggedUser = await login(username.trim(), password)
      const dest = { ADMIN: '/admin', WARDEN: '/warden', STUDENT: '/student' }[loggedUser.role]
      navigate(dest || '/', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      {/* Backgrounds */}
      <div style={s.bgImage} />
      <div style={s.bgOverlay} />
      <div style={{
        ...s.bgGlow,
        background: `radial-gradient(ellipse 60% 50% at 50% 40%, ${config.glow} 0%, transparent 65%)`,
      }} />
      <div style={s.bgGrid} />

      {/* Back link */}
      <div style={{
        ...s.backRow,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(-10px)',
        transition: 'all 0.5s ease',
      }}>
        <Link
          to="/"
          style={s.backLink}
          onMouseEnter={e => e.currentTarget.style.color = '#f1f5f9'}
          onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
        >
          ← Back to Home
        </Link>
      </div>

      {/* Card */}
      <div style={s.center}>
        <div style={{
          ...s.card,
          borderColor: config.border,
          boxShadow: `0 40px 100px rgba(0,0,0,0.6), 0 0 60px ${config.glow}`,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.97)',
          transition: 'all 0.55s cubic-bezier(0.34, 1.2, 0.64, 1) 0.05s',
        }}>

          {/* Colored top stripe */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: `linear-gradient(90deg, ${config.accent}, ${config.accent}88)`,
            borderRadius: '16px 16px 0 0',
          }} />

          {/* Logo row */}
          <div style={s.logoRow}>
            <div style={s.logoMark}>H</div>
            <div>
              <div style={s.logoName}>HostelHub</div>
              <div style={s.logoSub}>Management System</div>
            </div>
          </div>

          {/* Role badge */}
          {isValidRole && (
            <div style={{
              ...s.roleBadge,
              background: config.dimColor,
              border: `1px solid ${config.border}`,
              color: config.accent,
            }}>
              <span style={{ fontSize: '1rem' }}>{config.icon}</span>
              Login as {config.display}
            </div>
          )}

          {/* Heading */}
          <h1 style={s.heading}>
            {isValidRole ? `${config.display} Sign In` : 'Sign In'}
          </h1>
          <p style={s.subheading}>
            Enter your credentials to access the {config.display?.toLowerCase()} dashboard
          </p>

          {/* Error alert */}
          {error && (
            <div style={s.errorAlert}>
              <span>⚠</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ marginTop: 4 }}>
            {/* Username */}
            <div style={s.field}>
              <label style={s.fieldLabel}>Username</label>
              <input
                style={s.input}
                type="text"
                placeholder={`e.g. ${config.hint.username}`}
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoFocus
                onFocus={e => {
                  e.target.style.borderColor = config.accent
                  e.target.style.boxShadow = `0 0 0 3px ${config.dimColor}`
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* Password */}
            <div style={s.field}>
              <label style={s.fieldLabel}>Password</label>
              <div style={s.inputWrap}>
                <input
                  style={{ ...s.input, paddingRight: 44 }}
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={e => {
                    e.target.style.borderColor = config.accent
                    e.target.style.boxShadow = `0 0 0 3px ${config.dimColor}`
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                <button
                  type="button"
                  style={s.eyeBtn}
                  onClick={() => setShowPw(p => !p)}
                  tabIndex={-1}
                >
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...s.submitBtn,
                background: loading
                  ? 'rgba(255,255,255,0.1)'
                  : `linear-gradient(135deg, ${config.accent}, ${config.accent}cc)`,
                color: loading ? '#94a3b8' : '#0d0f14',
                boxShadow: loading ? 'none' : `0 8px 28px ${config.glow}`,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={e => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = `0 12px 36px ${config.glow}`
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = loading ? 'none' : `0 8px 28px ${config.glow}`
              }}
            >
              {loading ? (
                <span style={s.spinnerRow}>
                  <span style={s.spinner} />
                  Signing in...
                </span>
              ) : (
                `Sign In as ${config.display} →`
              )}
            </button>
          </form>

          {/* Switch role */}
          <div style={s.switchRow}>
            Not {config.display}?{' '}
            <Link
              to="/"
              style={{ color: config.accent, fontWeight: 500, textDecoration: 'none' }}
            >
              Choose a different role
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex', flexDirection: 'column',
    position: 'relative', overflow: 'hidden',
    fontFamily: "'DM Sans', sans-serif",
  },
  bgImage: {
    position: 'absolute', inset: 0, zIndex: 0,
    backgroundImage: `url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1800&q=80')`,
    backgroundSize: 'cover', backgroundPosition: 'center 30%',
    filter: 'brightness(0.2) saturate(0.6)',
  },
  bgOverlay: {
    position: 'absolute', inset: 0, zIndex: 1,
    background: 'rgba(5,8,15,0.88)',
  },
  bgGlow: {
    position: 'absolute', inset: 0, zIndex: 2,
    pointerEvents: 'none',
  },
  bgGrid: {
    position: 'absolute', inset: 0, zIndex: 3,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
    `,
    backgroundSize: '48px 48px',
    pointerEvents: 'none',
  },
  backRow: {
    position: 'relative', zIndex: 10,
    padding: '20px 36px',
  },
  backLink: {
    fontSize: '0.83rem', color: '#64748b',
    textDecoration: 'none', fontWeight: 400,
    transition: 'color 0.15s ease',
  },
  center: {
    flex: 1, position: 'relative', zIndex: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '0 24px 48px',
  },
  card: {
    width: '100%', maxWidth: 420,
    background: 'rgba(12,16,28,0.97)',
    border: '1px solid',
    borderRadius: 18,
    padding: '40px 36px 36px',
    position: 'relative', overflow: 'hidden',
    backdropFilter: 'blur(24px)',
  },
  logoRow: {
    display: 'flex', alignItems: 'center', gap: 11,
    marginBottom: 24,
  },
  logoMark: {
    width: 40, height: 40,
    background: 'linear-gradient(135deg,#f0a500,#e09000)',
    borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Playfair Display', serif",
    fontWeight: 900, fontSize: '1rem', color: '#0d0f14',
    boxShadow: '0 0 16px rgba(240,165,0,0.35)',
    flexShrink: 0,
  },
  logoName: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 700, fontSize: '0.95rem', color: '#f1f5f9',
  },
  logoSub: {
    fontSize: '0.6rem', color: '#475569',
    textTransform: 'uppercase', letterSpacing: '0.09em',
  },
  roleBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 7,
    padding: '6px 14px',
    borderRadius: 99,
    fontSize: '0.8rem', fontWeight: 600,
    marginBottom: 20,
    letterSpacing: '0.02em',
  },
  heading: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.5rem', fontWeight: 700,
    color: '#f1f5f9', margin: '0 0 6px',
    letterSpacing: '-0.02em',
  },
  subheading: {
    fontSize: '0.85rem', color: '#64748b',
    margin: '0 0 24px', lineHeight: 1.5,
  },
  errorAlert: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'rgba(239,68,68,0.09)',
    border: '1px solid rgba(239,68,68,0.25)',
    borderLeft: '3px solid #ef4444',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: '0.84rem', color: '#fca5a5',
    marginBottom: 16,
  },
  field: { marginBottom: 16 },
  fieldLabel: {
    display: 'block',
    fontSize: '0.72rem', fontWeight: 600,
    color: '#94a3b8',
    textTransform: 'uppercase', letterSpacing: '0.07em',
    marginBottom: 7,
  },
  input: {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 9,
    color: '#f1f5f9',
    padding: '11px 14px',
    fontSize: '0.9rem',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
    outline: 'none',
  },
  inputWrap: { position: 'relative' },
  eyeBtn: {
    position: 'absolute', right: 0, top: 0, bottom: 0,
    width: 42, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'none', border: 'none',
    cursor: 'pointer', fontSize: '0.9rem',
  },
  submitBtn: {
    width: '100%', border: 'none', borderRadius: 10,
    padding: '13px', marginTop: 8,
    fontSize: '0.95rem', fontWeight: 700,
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: '0.01em',
    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
  },
  spinnerRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
  },
  spinner: {
    display: 'inline-block', width: 15, height: 15,
    border: '2px solid rgba(255,255,255,0.15)',
    borderTopColor: '#94a3b8',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  switchRow: {
    textAlign: 'center', marginTop: 22,
    fontSize: '0.82rem', color: '#475569',
  },
}
