import { useAuth } from '../context/AuthContext'

export default function Navbar({ title }) {
  const { user } = useAuth()
  const roleClass = user?.role?.toLowerCase()

  return (
    <header className="navbar">
      <span className="navbar-title">{title}</span>
      <div className="navbar-actions">
        <span className={`role-chip ${roleClass}`}>{user?.role}</span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          {user?.username}
        </span>
      </div>
    </header>
  )
}
