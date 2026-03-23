import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const roles = [
  {
    key: 'admin',
    label: 'Admin',
    icon: '⚡',
    description: 'Full system control & management',
    accent: '#f0a500',
    glow: 'rgba(240,165,0,0.35)',
    bg: 'rgba(240,165,0,0.08)',
    border: 'rgba(240,165,0,0.3)',
  },
  {
    key: 'warden',
    label: 'Warden',
    icon: '🛡',
    description: 'Manage rooms & student welfare',
    accent: '#60a5fa',
    glow: 'rgba(96,165,250,0.35)',
    bg: 'rgba(96,165,250,0.08)',
    border: 'rgba(96,165,250,0.3)',
  },
  {
    key: 'student',
    label: 'Student',
    icon: '🎓',
    description: 'Access your hostel services',
    accent: '#34d399',
    glow: 'rgba(52,211,153,0.35)',
    bg: 'rgba(52,211,153,0.08)',
    border: 'rgba(52,211,153,0.3)',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showRoles, setShowRoles]   = useState(false)
  const [hoveredRole, setHovered]   = useState(null)
  const [mounted, setMounted]       = useState(false)
  const [rolesVisible, setRolesVis] = useState(false)

  // Auto-redirect logged-in users to their dashboard
  useEffect(() => {
    if (user) {
      const dest = { ADMIN: '/admin', WARDEN: '/warden', STUDENT: '/student' }[user.role]
      if (dest) navigate(dest, { replace: true })
    }
  }, [user, navigate])

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  const handleLoginClick = () => {
    setShowRoles(true)
    setTimeout(() => setRolesVis(true), 30)
  }

  const handleRoleSelect = (roleKey) => {
    navigate(`/login/${roleKey}`)
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setRolesVis(false)
      setTimeout(() => setShowRoles(false), 300)
    }
  }

  return (
    <div style={s.root}>
      {/* ── Background image with layered overlays ── */}
      <div style={s.bgImage} />
      <div style={s.bgOverlay1} />
      <div style={s.bgOverlay2} />
      <div style={s.bgNoise} />

      {/* ── Animated light beams ── */}
      <div style={s.beam1} />
      <div style={s.beam2} />

      {/* ── Floating dots ── */}
      {[...Array(12)].map((_, i) => (
        <div key={i} style={{
          ...s.dot,
          left: `${8 + i * 8}%`,
          top:  `${15 + (i % 5) * 18}%`,
          animationDelay: `${i * 0.4}s`,
          animationDuration: `${3 + (i % 3)}s`,
          opacity: 0.15 + (i % 3) * 0.07,
          width:  3 + (i % 3),
          height: 3 + (i % 3),
        }} />
      ))}

      {/* ── Top bar ── */}
      <header style={{
        ...s.topBar,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(-16px)',
        transition: 'all 0.7s ease',
      }}>
        <div style={s.logo}>
          <div style={s.logoIcon}>H</div>
          <div>
            <div style={s.logoName}>HostelHub</div>
            <div style={s.logoTagline}>Management System</div>
          </div>
        </div>
        <div style={s.statusPill}>
          <span style={s.statusDot} />
          System Online
        </div>
      </header>

      {/* ── Main hero content ── */}
      <main style={s.hero}>
        <div style={{
          ...s.heroInner,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(32px)',
          transition: 'all 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.15s',
        }}>
          {/* Eyebrow */}
          <div style={s.eyebrow}>
            <span style={s.eyebrowDot} />
            Welcome to your hostel portal
          </div>

          {/* Title */}
          <h1 style={s.title}>
            Hostel
            <br />
            <span style={s.titleAccent}>Management</span>
            <br />
            System
          </h1>

          {/* Subtitle */}
          <p style={s.subtitle}>
            Seamlessly manage rooms, students, wardens,<br />
            complaints, payments & daily operations.
          </p>

          {/* CTA Button */}
          <button
            style={{
              ...s.loginBtn,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 0.7s ease 0.4s, background 0.2s, box-shadow 0.2s, transform 0.2s',
            }}
            onClick={handleLoginClick}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#ffb929'
              e.currentTarget.style.boxShadow = '0 0 40px rgba(240,165,0,0.5), 0 8px 32px rgba(0,0,0,0.4)'
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#f0a500'
              e.currentTarget.style.boxShadow = '0 0 24px rgba(240,165,0,0.3), 0 8px 24px rgba(0,0,0,0.3)'
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
            }}
          >
            <span>Login to Portal</span>
            <span style={s.btnArrow}>→</span>
          </button>

          {/* Stat pills */}
          <div style={{
            ...s.statRow,
            opacity: mounted ? 1 : 0,
            transition: 'opacity 0.8s ease 0.6s',
          }}>
            {[['500+','Students'],['50+','Rooms'],['3','Roles'],['24/7','Access']].map(([v,l]) => (
              <div key={l} style={s.statPill}>
                <span style={s.statVal}>{v}</span>
                <span style={s.statLbl}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ── Role Selection Overlay ── */}
      {showRoles && (
        <div
          style={{
            ...s.overlay,
            opacity: rolesVisible ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
          onClick={handleOverlayClick}
        >
          <div style={{
            ...s.roleModal,
            opacity: rolesVisible ? 1 : 0,
            transform: rolesVisible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
            transition: 'all 0.35s cubic-bezier(0.34, 1.4, 0.64, 1)',
          }}>
            {/* Modal header */}
            <div style={s.modalHeader}>
              <div>
                <h2 style={s.modalTitle}>Select your role</h2>
                <p style={s.modalSub}>Choose how you'd like to sign in</p>
              </div>
              <button
                style={s.closeBtn}
                onClick={() => { setRolesVis(false); setTimeout(() => setShowRoles(false), 300) }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              >✕</button>
            </div>

            {/* Divider */}
            <div style={s.divider} />

            {/* Role cards */}
            <div style={s.roleGrid}>
              {roles.map((role, idx) => (
                <button
                  key={role.key}
                  style={{
                    ...s.roleCard,
                    background: hoveredRole === role.key ? role.bg : 'rgba(255,255,255,0.03)',
                    borderColor: hoveredRole === role.key ? role.border : 'rgba(255,255,255,0.08)',
                    boxShadow: hoveredRole === role.key
                      ? `0 8px 32px ${role.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`
                      : '0 2px 8px rgba(0,0,0,0.2)',
                    transform: hoveredRole === role.key ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
                    opacity: rolesVisible ? 1 : 0,
                    transition: `all 0.25s cubic-bezier(0.34, 1.3, 0.64, 1), opacity 0.4s ease ${0.1 + idx * 0.06}s`,
                  }}
                  onClick={() => handleRoleSelect(role.key)}
                  onMouseEnter={() => setHovered(role.key)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Top accent */}
                  <div style={{
                    ...s.roleAccent,
                    background: role.accent,
                    opacity: hoveredRole === role.key ? 1 : 0,
                  }} />

                  {/* Icon circle */}
                  <div style={{
                    ...s.roleIconCircle,
                    background: hoveredRole === role.key ? role.bg : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${hoveredRole === role.key ? role.border : 'rgba(255,255,255,0.07)'}`,
                    boxShadow: hoveredRole === role.key ? `0 0 16px ${role.glow}` : 'none',
                  }}>
                    <span style={{ fontSize: '1.6rem' }}>{role.icon}</span>
                  </div>

                  {/* Label */}
                  <div style={{
                    ...s.roleLabel,
                    color: hoveredRole === role.key ? role.accent : '#e2e8f0',
                  }}>{role.label}</div>

                  {/* Description */}
                  <div style={s.roleDesc}>{role.description}</div>

                  {/* Arrow */}
                  <div style={{
                    ...s.roleArrow,
                    color: role.accent,
                    opacity: hoveredRole === role.key ? 1 : 0,
                    transform: hoveredRole === role.key ? 'translate(-50%, 0)' : 'translate(-50%, 4px)',
                  }}>
                    ↓ Continue
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Keyframe styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }
        @keyframes beamMove {
          0%   { opacity: 0.4; transform: skewX(-15deg) translateX(-10%); }
          50%  { opacity: 0.15; }
          100% { opacity: 0.4; transform: skewX(-15deg) translateX(10%); }
        }
      `}</style>
    </div>
  )
}

/* ────────────────────────────────
   Styles
──────────────────────────────── */
const s = {
  root: {
    minHeight: '100vh',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'DM Sans', sans-serif",
    display: 'flex',
    flexDirection: 'column',
  },

  // Background
  bgImage: {
    position: 'absolute', inset: 0, zIndex: 0,
    backgroundImage: `url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1800&q=80')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center 30%',
    filter: 'brightness(0.35) saturate(0.8)',
  },
  bgOverlay1: {
    position: 'absolute', inset: 0, zIndex: 1,
    background: 'linear-gradient(135deg, rgba(5,8,15,0.92) 0%, rgba(10,15,30,0.75) 50%, rgba(5,8,15,0.88) 100%)',
  },
  bgOverlay2: {
    position: 'absolute', inset: 0, zIndex: 2,
    background: 'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(240,165,0,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 80%, rgba(96,165,250,0.04) 0%, transparent 55%)',
  },
  bgNoise: {
    position: 'absolute', inset: 0, zIndex: 3,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat',
    backgroundSize: '128px 128px',
  },

  // Light beams
  beam1: {
    position: 'absolute', zIndex: 2,
    top: '-20%', left: '10%',
    width: '3px', height: '120%',
    background: 'linear-gradient(180deg, transparent, rgba(240,165,0,0.08), transparent)',
    transform: 'skewX(-15deg)',
    animation: 'beamMove 8s ease-in-out infinite',
  },
  beam2: {
    position: 'absolute', zIndex: 2,
    top: '-20%', left: '60%',
    width: '2px', height: '120%',
    background: 'linear-gradient(180deg, transparent, rgba(96,165,250,0.05), transparent)',
    transform: 'skewX(-15deg)',
    animation: 'beamMove 12s ease-in-out infinite reverse',
  },

  // Floating dot
  dot: {
    position: 'absolute', zIndex: 3,
    borderRadius: '50%',
    background: '#f0a500',
    animation: 'floatY 3s ease-in-out infinite',
  },

  // Top bar
  topBar: {
    position: 'relative', zIndex: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '22px 48px',
  },
  logo: { display: 'flex', alignItems: 'center', gap: 12 },
  logoIcon: {
    width: 44, height: 44,
    background: 'linear-gradient(135deg, #f0a500, #e09000)',
    borderRadius: 11,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Playfair Display', serif",
    fontWeight: 900, fontSize: '1.1rem', color: '#0d0f14',
    boxShadow: '0 0 20px rgba(240,165,0,0.4)',
  },
  logoName: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 700, fontSize: '1.05rem', color: '#f1f5f9',
    letterSpacing: '-0.01em',
  },
  logoTagline: {
    fontSize: '0.62rem', color: '#64748b',
    textTransform: 'uppercase', letterSpacing: '0.1em',
  },
  statusPill: {
    display: 'flex', alignItems: 'center', gap: 7,
    background: 'rgba(52,211,153,0.08)',
    border: '1px solid rgba(52,211,153,0.2)',
    borderRadius: 99, padding: '5px 14px',
    fontSize: '0.75rem', color: '#34d399',
    letterSpacing: '0.03em',
  },
  statusDot: {
    width: 7, height: 7, borderRadius: '50%',
    background: '#34d399',
    boxShadow: '0 0 8px rgba(52,211,153,0.7)',
    animation: 'pulseDot 2s ease-in-out infinite',
    display: 'inline-block',
  },

  // Hero
  hero: {
    flex: 1, position: 'relative', zIndex: 10,
    display: 'flex', alignItems: 'center',
    padding: '0 48px 60px',
  },
  heroInner: {
    maxWidth: 580,
  },
  eyebrow: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'rgba(240,165,0,0.1)',
    border: '1px solid rgba(240,165,0,0.2)',
    borderRadius: 99, padding: '6px 16px',
    fontSize: '0.78rem', color: '#f0a500', fontWeight: 500,
    letterSpacing: '0.04em', marginBottom: 24,
  },
  eyebrowDot: {
    width: 6, height: 6, borderRadius: '50%', background: '#f0a500',
    display: 'inline-block', animation: 'pulseDot 1.5s infinite',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(2.6rem, 5.5vw, 4rem)',
    fontWeight: 900,
    color: '#f1f5f9',
    margin: '0 0 20px',
    lineHeight: 1.05,
    letterSpacing: '-0.02em',
  },
  titleAccent: {
    background: 'linear-gradient(90deg, #f0a500, #ffd166)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '1rem', color: '#94a3b8',
    lineHeight: 1.75, margin: '0 0 36px',
    fontWeight: 300,
  },

  // Login button
  loginBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 12,
    background: '#f0a500',
    border: 'none', borderRadius: 12,
    padding: '16px 32px',
    fontSize: '1rem', fontWeight: 700,
    color: '#0d0f14',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: '0.01em',
    boxShadow: '0 0 24px rgba(240,165,0,0.3), 0 8px 24px rgba(0,0,0,0.3)',
    marginBottom: 40,
  },
  btnArrow: {
    fontSize: '1.1rem', fontWeight: 700,
    display: 'inline-block',
    transition: 'transform 0.2s ease',
  },

  // Stats
  statRow: {
    display: 'flex', gap: 6, flexWrap: 'wrap',
  },
  statPill: {
    display: 'flex', alignItems: 'center', gap: 7,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 99, padding: '6px 14px',
  },
  statVal: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '0.9rem', fontWeight: 700, color: '#f0a500',
  },
  statLbl: {
    fontSize: '0.72rem', color: '#64748b',
    textTransform: 'uppercase', letterSpacing: '0.06em',
  },

  // Overlay
  overlay: {
    position: 'fixed', inset: 0, zIndex: 100,
    background: 'rgba(5,8,15,0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 24,
  },

  // Role modal
  roleModal: {
    background: 'linear-gradient(135deg, rgba(15,20,35,0.98), rgba(10,14,28,0.98))',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '32px',
    width: '100%', maxWidth: 560,
    boxShadow: '0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)',
    position: 'relative',
  },
  modalHeader: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.4rem', fontWeight: 700,
    color: '#f1f5f9', margin: '0 0 4px',
    letterSpacing: '-0.01em',
  },
  modalSub: {
    fontSize: '0.85rem', color: '#64748b', margin: 0,
  },
  closeBtn: {
    width: 34, height: 34,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    color: '#94a3b8', fontSize: '0.85rem',
    cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.15s ease',
    fontFamily: 'monospace',
  },
  divider: {
    height: 1, background: 'rgba(255,255,255,0.06)',
    margin: '0 0 24px',
  },

  // Role grid
  roleGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12,
  },
  roleCard: {
    position: 'relative',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '28px 16px 20px',
    borderRadius: 14, border: '1px solid',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.34, 1.3, 0.64, 1)',
    overflow: 'hidden', textAlign: 'center',
    outline: 'none',
  },
  roleAccent: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 2,
    transition: 'opacity 0.2s ease',
  },
  roleIconCircle: {
    width: 64, height: 64, borderRadius: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
    transition: 'all 0.25s ease',
  },
  roleLabel: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1rem', fontWeight: 700,
    marginBottom: 6,
    transition: 'color 0.2s ease',
    letterSpacing: '-0.01em',
  },
  roleDesc: {
    fontSize: '0.75rem', color: '#64748b',
    lineHeight: 1.5, marginBottom: 12,
  },
  roleArrow: {
    fontSize: '0.75rem', fontWeight: 600,
    letterSpacing: '0.04em',
    position: 'absolute', bottom: 10, left: '50%',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
}
