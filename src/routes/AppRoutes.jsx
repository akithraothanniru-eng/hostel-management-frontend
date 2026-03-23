import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Auth pages
import Home  from '../pages/auth/Home'
import Login from '../pages/auth/Login'

// Admin pages
import AdminDashboard    from '../pages/admin/AdminDashboard'
import ManageStudents    from '../pages/admin/ManageStudents'
import ManageWardens     from '../pages/admin/ManageWardens'
import ManageRooms       from '../pages/admin/ManageRooms'
import ManageComplaints  from '../pages/admin/ManageComplaints'
import ManagePayments    from '../pages/admin/ManagePayments'
import ManageFoodMenu    from '../pages/admin/ManageFoodMenu'
import SendNotifications from '../pages/admin/SendNotifications'

// Warden pages
import WardenDashboard     from '../pages/warden/WardenDashboard'
import WardenComplaints    from '../pages/warden/WardenComplaints'
import ViewRooms           from '../pages/warden/ViewRooms'
import WardenNotifications from '../pages/warden/WardenNotifications'

// Student pages
import StudentDashboard from '../pages/student/StudentDashboard'
import RaiseComplaint   from '../pages/student/RaiseComplaint'
import FoodMenu         from '../pages/student/FoodMenu'
import PaymentHistory   from '../pages/student/PaymentHistory'
import AttendanceStatus from '../pages/student/AttendanceStatus'
import Notifications    from '../pages/student/Notifications'

/* ─────────────────────────────────────────────
   Protected route wrapper
   - If not logged in  → redirect to /
   - If wrong role      → redirect to their dashboard
───────────────────────────────────────────── */
function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#0d0f14',
    }}>
      <div style={{
        width: 36, height: 36,
        border: '3px solid rgba(255,255,255,0.08)',
        borderTopColor: '#f0a500',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (!user) return <Navigate to="/" replace />

  if (role && user.role !== role) {
    // Redirect to their actual dashboard instead of kicking to home
    const dest = { ADMIN: '/admin', WARDEN: '/warden', STUDENT: '/student' }[user.role]
    return <Navigate to={dest || '/'} replace />
  }

  return children
}

/* ─────────────────────────────────────────────
   Routing table
───────────────────────────────────────────── */
export default function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>

      {/* ── Public routes ── */}

      {/* Home / Landing page — default entry point, never auto-redirects to login */}
      <Route path="/" element={<Home />} />

      {/* Login with role param  e.g. /login/admin  /login/warden  /login/student */}
      <Route
        path="/login/:role"
        element={
          user
            ? <Navigate to={getDashboard(user.role)} replace />
            : <Login />
        }
      />

      {/* Legacy /login without role — just redirect home */}
      <Route path="/login" element={<Navigate to="/" replace />} />

      {/* ── Admin routes ── */}
      <Route path="/admin"                element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/students"       element={<ProtectedRoute role="ADMIN"><ManageStudents /></ProtectedRoute>} />
      <Route path="/admin/wardens"        element={<ProtectedRoute role="ADMIN"><ManageWardens /></ProtectedRoute>} />
      <Route path="/admin/rooms"          element={<ProtectedRoute role="ADMIN"><ManageRooms /></ProtectedRoute>} />
      <Route path="/admin/complaints"     element={<ProtectedRoute role="ADMIN"><ManageComplaints /></ProtectedRoute>} />
      <Route path="/admin/payments"       element={<ProtectedRoute role="ADMIN"><ManagePayments /></ProtectedRoute>} />
      <Route path="/admin/food-menu"      element={<ProtectedRoute role="ADMIN"><ManageFoodMenu /></ProtectedRoute>} />
      <Route path="/admin/notifications"  element={<ProtectedRoute role="ADMIN"><SendNotifications /></ProtectedRoute>} />

      {/* ── Warden routes ── */}
      <Route path="/warden"               element={<ProtectedRoute role="WARDEN"><WardenDashboard /></ProtectedRoute>} />
      <Route path="/warden/complaints"    element={<ProtectedRoute role="WARDEN"><WardenComplaints /></ProtectedRoute>} />
      <Route path="/warden/rooms"         element={<ProtectedRoute role="WARDEN"><ViewRooms /></ProtectedRoute>} />
      <Route path="/warden/notifications" element={<ProtectedRoute role="WARDEN"><WardenNotifications /></ProtectedRoute>} />

      {/* ── Student routes ── */}
      <Route path="/student"               element={<ProtectedRoute role="STUDENT"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/complaint"     element={<ProtectedRoute role="STUDENT"><RaiseComplaint /></ProtectedRoute>} />
      <Route path="/student/food-menu"     element={<ProtectedRoute role="STUDENT"><FoodMenu /></ProtectedRoute>} />
      <Route path="/student/payments"      element={<ProtectedRoute role="STUDENT"><PaymentHistory /></ProtectedRoute>} />
      <Route path="/student/attendance"    element={<ProtectedRoute role="STUDENT"><AttendanceStatus /></ProtectedRoute>} />
      <Route path="/student/notifications" element={<ProtectedRoute role="STUDENT"><Notifications /></ProtectedRoute>} />

      {/* ── Catch-all → Home ── */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  )
}

function getDashboard(role) {
  return { ADMIN: '/admin', WARDEN: '/warden', STUDENT: '/student' }[role] || '/'
}
