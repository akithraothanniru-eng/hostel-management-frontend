import { useAuth } from '../context/AuthContext'

export default function Navbar({ title, subtitle }) {
  const { user } = useAuth()
  const roleClass = user?.role?.toLowerCase() || 'student'
  const initials  = user?.username?.slice(0, 2).toUpperCase() || 'U'

  return (
    <header className="navbar">
      <div className="navbar-breadcrumb">
        <span className="navbar-page-title">{title}</span>
        {subtitle && (
          <>
            <span className="navbar-sep">›</span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{subtitle}</span>
          </>
        )}
      </div>

      <div className="navbar-right">
        <span className={`role-badge ${roleClass}`}>{user?.role}</span>
        <div
          className={`navbar-avatar ${roleClass}`}
          title={user?.username}
        >
          {initials}
        </div>
      </div>
    </header>
  )
}
