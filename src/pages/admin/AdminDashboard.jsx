import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar  from '../../components/Navbar'
import { StatCard, LoadingSpinner } from '../../components/index.jsx'
import { studentService }  from '../../services/studentService'
import { wardenService }   from '../../services/wardenService'
import { roomService }     from '../../services/roomService'
import { complaintService} from '../../services/complaintService'
import { paymentService }  from '../../services/paymentService'

export default function AdminDashboard() {
  const [stats, setStats]   = useState({})
  const [loading, setLoading] = useState(true)
  const [recent, setRecent] = useState([])

  useEffect(() => {
    Promise.all([
      studentService.getAll(),
      wardenService.getAll(),
      roomService.getAll(),
      complaintService.getAll(),
      paymentService.getAll(),
    ]).then(([students, wardens, rooms, complaints, payments]) => {
      setStats({
        students:  students.length,
        wardens:   wardens.length,
        rooms:     rooms.length,
        complaints:complaints.length,
        pending:   complaints.filter(c => c.status === 'PENDING').length,
        paid:      payments.filter(p => p.status === 'PAID').length,
        unpaid:    payments.filter(p => p.status === 'NOT_PAID').length,
        available: rooms.filter(r => r.occupancy < r.capacity).length,
      })
      setRecent(complaints.slice(0, 5))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content"><Navbar title="Dashboard" /><LoadingSpinner /></div>
    </div>
  )

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Admin Dashboard" />
        <div className="page-content">
          <div className="page-header">
            <h1>Overview</h1>
            <p>Welcome back! Here's what's happening in your hostel.</p>
          </div>

          <div className="stat-grid">
            <StatCard icon="👤" iconColor="blue"   color="blue"   value={stats.students}  label="Total Students" />
            <StatCard icon="🛡" iconColor="purple" color="purple" value={stats.wardens}   label="Wardens" />
            <StatCard icon="🚪" iconColor="yellow" color=""       value={stats.rooms}     label="Total Rooms" />
            <StatCard icon="✅" iconColor="green"  color="green"  value={stats.available} label="Available Rooms" />
            <StatCard icon="💬" iconColor="orange" color="orange" value={stats.pending}   label="Pending Complaints" />
            <StatCard icon="💳" iconColor="red"    color="red"    value={stats.unpaid}    label="Unpaid Fees" />
          </div>

          <div className="dash-grid">
            <div className="card">
              <div className="section-heading">Recent Complaints</div>
              {recent.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No complaints yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {recent.map(c => (
                    <div key={c.complaintId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{c.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{c.studentName}</div>
                      </div>
                      <span className={`badge ${c.status === 'PENDING' ? 'badge-yellow' : c.status === 'IN_PROGRESS' ? 'badge-blue' : 'badge-green'}`}>
                        {c.status?.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <div className="section-heading">Quick Stats</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Occupancy Rate', value: stats.rooms ? `${Math.round(((stats.rooms - stats.available) / stats.rooms) * 100)}%` : '0%', color: 'var(--blue)' },
                  { label: 'Complaints Resolved', value: stats.complaints ? `${Math.round(((stats.complaints - stats.pending) / stats.complaints) * 100)}%` : '0%', color: 'var(--green)' },
                  { label: 'Payment Collection', value: (stats.paid + stats.unpaid) ? `${Math.round((stats.paid / (stats.paid + stats.unpaid)) * 100)}%` : '0%', color: 'var(--accent)' },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{s.label}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: s.color }}>{s.value}</span>
                    </div>
                    <div style={{ height: 4, background: 'var(--bg-hover)', borderRadius: 99 }}>
                      <div style={{ height: '100%', width: s.value, background: s.color, borderRadius: 99, transition: 'width 0.8s ease' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
