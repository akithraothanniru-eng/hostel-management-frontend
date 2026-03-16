import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import Login from '../pages/auth/Login'

import AdminDashboard    from '../pages/admin/AdminDashboard'
import ManageStudents    from '../pages/admin/ManageStudents'
import ManageWardens     from '../pages/admin/ManageWardens'
import ManageRooms       from '../pages/admin/ManageRooms'
import ManageComplaints  from '../pages/admin/ManageComplaints'
import ManagePayments    from '../pages/admin/ManagePayments'
import ManageFoodMenu    from '../pages/admin/ManageFoodMenu'
import SendNotifications from '../pages/admin/SendNotifications'

import WardenDashboard      from '../pages/warden/WardenDashboard'
import WardenComplaints     from '../pages/warden/WardenComplaints'
import ViewRooms            from '../pages/warden/ViewRooms'
import WardenNotifications  from '../pages/warden/WardenNotifications'

import StudentDashboard  from '../pages/student/StudentDashboard'
import RaiseComplaint    from '../pages/student/RaiseComplaint'
import FoodMenu          from '../pages/student/FoodMenu'
import PaymentHistory    from '../pages/student/PaymentHistory'
import AttendanceStatus  from '../pages/student/AttendanceStatus'
import Notifications     from '../pages/student/Notifications'

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="spinner" style={{margin:'80px auto'}}></div>
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/login" replace />
  return children
}

export default function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={
        user ? <Navigate to={getDashboard(user.role)} replace /> : <Login />
      } />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/students"      element={<ProtectedRoute role="ADMIN"><ManageStudents /></ProtectedRoute>} />
      <Route path="/admin/wardens"       element={<ProtectedRoute role="ADMIN"><ManageWardens /></ProtectedRoute>} />
      <Route path="/admin/rooms"         element={<ProtectedRoute role="ADMIN"><ManageRooms /></ProtectedRoute>} />
      <Route path="/admin/complaints"    element={<ProtectedRoute role="ADMIN"><ManageComplaints /></ProtectedRoute>} />
      <Route path="/admin/payments"      element={<ProtectedRoute role="ADMIN"><ManagePayments /></ProtectedRoute>} />
      <Route path="/admin/food-menu"     element={<ProtectedRoute role="ADMIN"><ManageFoodMenu /></ProtectedRoute>} />
      <Route path="/admin/notifications" element={<ProtectedRoute role="ADMIN"><SendNotifications /></ProtectedRoute>} />

      {/* Warden */}
      <Route path="/warden"               element={<ProtectedRoute role="WARDEN"><WardenDashboard /></ProtectedRoute>} />
      <Route path="/warden/complaints"    element={<ProtectedRoute role="WARDEN"><WardenComplaints /></ProtectedRoute>} />
      <Route path="/warden/rooms"         element={<ProtectedRoute role="WARDEN"><ViewRooms /></ProtectedRoute>} />
      <Route path="/warden/notifications" element={<ProtectedRoute role="WARDEN"><WardenNotifications /></ProtectedRoute>} />

      {/* Student */}
      <Route path="/student"              element={<ProtectedRoute role="STUDENT"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/complaint"    element={<ProtectedRoute role="STUDENT"><RaiseComplaint /></ProtectedRoute>} />
      <Route path="/student/food-menu"    element={<ProtectedRoute role="STUDENT"><FoodMenu /></ProtectedRoute>} />
      <Route path="/student/payments"     element={<ProtectedRoute role="STUDENT"><PaymentHistory /></ProtectedRoute>} />
      <Route path="/student/attendance"   element={<ProtectedRoute role="STUDENT"><AttendanceStatus /></ProtectedRoute>} />
      <Route path="/student/notifications"element={<ProtectedRoute role="STUDENT"><Notifications /></ProtectedRoute>} />

      <Route path="/" element={<Navigate to={user ? getDashboard(user.role) : '/login'} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function getDashboard(role) {
  if (role === 'ADMIN')   return '/admin'
  if (role === 'WARDEN')  return '/warden'
  if (role === 'STUDENT') return '/student'
  return '/login'
}
