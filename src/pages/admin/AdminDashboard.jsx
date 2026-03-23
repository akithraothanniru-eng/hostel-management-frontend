import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar  from '../../components/Navbar'
import { StatCard, LoadingSpinner, Badge, ProgressBar } from '../../components/index.jsx'
import { studentService }  from '../../services/studentService'
import { wardenService }   from '../../services/wardenService'
import { roomService }     from '../../services/roomService'
import { complaintService} from '../../services/complaintService'
import { paymentService }  from '../../services/paymentService'

export default function AdminDashboard() {
  const [stats,      setStats]      = useState({})
  const [complaints, setComplaints] = useState([])
  const [rooms,      setRooms]      = useState([])
  const [loading,    setLoading]    = useState(true)

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
        available: rooms.filter(r => r.occupancy < r.capacity).length,
        pending:   complaints.filter(c => c.status === 'PENDING').length,
        resolved:  complaints.filter(c => c.status === 'RESOLVED').length,
        paid:      payments.filter(p => p.status === 'PAID').length,
        unpaid:    payments.filter(p => p.status === 'NOT_PAID').length,
        complaints: complaints.length,
        payments:   payments.length,
      })
      setComplaints(complaints.slice(0, 6))
      setRooms(rooms.slice(0, 6))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content"><Navbar title="Dashboard" /><LoadingSpinner /></div>
    </div>
  )

  const occupancyPct = stats.rooms
    ? Math.round(((stats.rooms - stats.available) / stats.rooms) * 100) : 0

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Dashboard" subtitle="Overview" />
        <div className="page-content">

          {/* Welcome banner */}
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            borderRadius: 'var(--r-lg)',
            padding: '22px 28px',
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            boxShadow: '0 8px 32px rgba(79,70,229,0.3)',
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                Good day, Admin
              </div>
              <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.3rem', color: '#fff', letterSpacing: '-0.02em' }}>
                Hostel Overview
              </div>
              <div style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
                {stats.students} students · {stats.rooms} rooms · {stats.pending} pending complaints
              </div>
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              {[
                { label: 'Occupancy', value: `${occupancyPct}%` },
                { label: 'Collection', value: stats.payments ? `${Math.round((stats.paid / stats.payments) * 100)}%` : '0%' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#fff' }}>{s.value}</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stat cards */}
          <div className="stat-grid">
            <StatCard icon="👥" color="indigo"  value={stats.students}  label="Total Students" />
            <StatCard icon="🛡" color="blue"    value={stats.wardens}   label="Wardens" />
            <StatCard icon="🚪" color="purple"  value={stats.rooms}     label="Total Rooms" />
            <StatCard icon="✅" color="green"   value={stats.available} label="Available Rooms" />
            <StatCard icon="💬" color="yellow"  value={stats.pending}   label="Pending Complaints" />
            <StatCard icon="💳" color="red"     value={stats.unpaid}    label="Unpaid Fees" />
          </div>

          {/* Bottom grid */}
          <div className="grid-2">

            {/* Recent Complaints */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Recent Complaints</span>
                <span className="badge badge-yellow">{stats.pending} Pending</span>
              </div>
              <div className="card-body" style={{ padding: '4px 0' }}>
                {complaints.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No complaints yet.</div>
                ) : complaints.map(c => (
                  <div key={c.complaintId} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 22px', borderBottom: '1px solid var(--border)',
                  }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{c.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{c.studentName}</div>
                    </div>
                    <Badge status={c.status} />
                  </div>
                ))}
              </div>
            </div>

            {/* Room Status */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Room Occupancy</span>
                <span className="badge badge-indigo">{stats.rooms} Rooms</span>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {rooms.map(r => (
                    <div key={r.roomId}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: '0.855rem', fontWeight: 500 }}>Room {r.roomNumber}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {r.occupancy}/{r.capacity} beds
                        </span>
                      </div>
                      <ProgressBar
                        value={r.occupancy}
                        max={r.capacity}
                        color={r.occupancy >= r.capacity ? 'red' : r.occupancy / r.capacity > 0.7 ? 'yellow' : 'green'}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
