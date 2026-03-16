import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const adminNav = [
  { section: 'Overview', items: [
    { label: 'Dashboard',      icon: '⬡', path: '/admin' },
  ]},
  { section: 'Management', items: [
    { label: 'Students',       icon: '👤', path: '/admin/students' },
    { label: 'Wardens',        icon: '🛡', path: '/admin/wardens' },
    { label: 'Rooms',          icon: '🚪', path: '/admin/rooms' },
  ]},
  { section: 'Operations', items: [
    { label: 'Complaints',     icon: '💬', path: '/admin/complaints' },
    { label: 'Payments',       icon: '💳', path: '/admin/payments' },
    { label: 'Food Menu',      icon: '🍽', path: '/admin/food-menu' },
    { label: 'Notifications',  icon: '🔔', path: '/admin/notifications' },
  ]},
]

const wardenNav = [
  { section: 'Overview', items: [
    { label: 'Dashboard',      icon: '⬡', path: '/warden' },
  ]},
  { section: 'Operations', items: [
    { label: 'Rooms',          icon: '🚪', path: '/warden/rooms' },
    { label: 'Complaints',     icon: '💬', path: '/warden/complaints' },
    { label: 'Notifications',  icon: '🔔', path: '/warden/notifications' },
  ]},
]

const studentNav = [
  { section: 'Overview', items: [
    { label: 'Dashboard',      icon: '⬡', path: '/student' },
  ]},
  { section: 'My Hostel', items: [
    { label: 'Food Menu',      icon: '🍽', path: '/student/food-menu' },
    { label: 'Complaints',     icon: '💬', path: '/student/complaint' },
    { label: 'Payments',       icon: '💳', path: '/student/payments' },
    { label: 'Attendance',     icon: '📋', path: '/student/attendance' },
    { label: 'Notifications',  icon: '🔔', path: '/student/notifications' },
  ]},
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const navMap = { ADMIN: adminNav, WARDEN: wardenNav, STUDENT: studentNav }
  const nav = navMap[user?.role] || []

  const handleLogout = () => { logout(); navigate('/login') }

  const initials = user?.username?.slice(0, 2).toUpperCase() || 'U'
  const avatarClass = { ADMIN: 'yellow', WARDEN: 'blue', STUDENT: 'green' }[user?.role] || ''

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">H</div>
        <div>
          <div className="logo-text">HostelHub</div>
          <div className="logo-sub">Management</div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '8px 0' }}>
        {nav.map(group => (
          <div key={group.section} className="sidebar-section">
            <div className="sidebar-section-label">{group.section}</div>
            {group.items.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin' || item.path === '/warden' || item.path === '/student'}
                className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
              >
                <span className="item-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user" onClick={handleLogout} title="Click to logout">
          <div className={`avatar ${avatarClass}`}>{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.username}</div>
            <div className="sidebar-user-role">{user?.role?.toLowerCase()} · logout</div>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>↩</span>
        </div>
      </div>
    </aside>
  )
}
