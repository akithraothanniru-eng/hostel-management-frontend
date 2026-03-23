import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/* ── Icon components (inline SVG — no extra library needed) ── */
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const Icons = {
  dashboard:     'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  students:      'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  wardens:       'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  rooms:         'M3 9.5L12 4l9 5.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z M9 21V12h6v9',
  complaints:    'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  payments:      'M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  foodmenu:      'M18 8h1a4 4 0 0 1 0 8h-1 M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z M6 1v3 M10 1v3 M14 1v3',
  notifications: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
  attendance:    'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
  logout:        'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9',
}

const adminNav = [
  { section: 'Overview', items: [
    { label: 'Dashboard',     icon: 'dashboard',     path: '/admin', end: true },
  ]},
  { section: 'Manage', items: [
    { label: 'Students',      icon: 'students',      path: '/admin/students' },
    { label: 'Wardens',       icon: 'wardens',       path: '/admin/wardens' },
    { label: 'Rooms',         icon: 'rooms',         path: '/admin/rooms' },
  ]},
  { section: 'Operations', items: [
    { label: 'Complaints',    icon: 'complaints',    path: '/admin/complaints' },
    { label: 'Payments',      icon: 'payments',      path: '/admin/payments' },
    { label: 'Food Menu',     icon: 'foodmenu',      path: '/admin/food-menu' },
    { label: 'Notifications', icon: 'notifications', path: '/admin/notifications' },
  ]},
]

const wardenNav = [
  { section: 'Overview', items: [
    { label: 'Dashboard',     icon: 'dashboard',     path: '/warden', end: true },
  ]},
  { section: 'Operations', items: [
    { label: 'Rooms',         icon: 'rooms',         path: '/warden/rooms' },
    { label: 'Complaints',    icon: 'complaints',    path: '/warden/complaints' },
    { label: 'Notifications', icon: 'notifications', path: '/warden/notifications' },
  ]},
]

const studentNav = [
  { section: 'Overview', items: [
    { label: 'Dashboard',     icon: 'dashboard',     path: '/student', end: true },
  ]},
  { section: 'My Hostel', items: [
    { label: 'Food Menu',     icon: 'foodmenu',      path: '/student/food-menu' },
    { label: 'Complaints',    icon: 'complaints',    path: '/student/complaint' },
    { label: 'Payments',      icon: 'payments',      path: '/student/payments' },
    { label: 'Attendance',    icon: 'attendance',    path: '/student/attendance' },
    { label: 'Notifications', icon: 'notifications', path: '/student/notifications' },
  ]},
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const navMap = { ADMIN: adminNav, WARDEN: wardenNav, STUDENT: studentNav }
  const nav = navMap[user?.role] || []

  const initials = user?.username?.slice(0, 2).toUpperCase() || 'U'
  const roleClass = user?.role?.toLowerCase() || 'student'

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-mark">H</div>
        <div>
          <div className="logo-text">HostelHub</div>
          <div className="logo-sub">Management</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {nav.map(group => (
          <div key={group.section} className="sidebar-section">
            <div className="sidebar-section-label">{group.section}</div>
            {group.items.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
              >
                <span className="sidebar-item-icon">
                  <Icon d={Icons[item.icon]} size={16} />
                </span>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User profile + logout */}
      <div className="sidebar-bottom">
        <div className="sidebar-user-card">
          <div className={`user-avatar ${roleClass}`}>{initials}</div>
          <div className="user-info">
            <div className="user-name">{user?.username}</div>
            <div className="user-role">{user?.role?.toLowerCase()}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <Icon d={Icons.logout} size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
