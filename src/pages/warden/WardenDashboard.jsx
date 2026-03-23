import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar  from '../../components/Navbar'
import { StatCard, Badge, ProgressBar, LoadingSpinner } from '../../components/index.jsx'
import { roomService }      from '../../services/roomService'
import { complaintService } from '../../services/complaintService'

export default function WardenDashboard() {
  const [rooms,      setRooms]      = useState([])
  const [complaints, setComplaints] = useState([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    Promise.all([
      roomService.wardenGetAll(),
      complaintService.wardenGetAll(),
    ]).then(([r, c]) => { setRooms(r); setComplaints(c) })
     .catch(() => {})
     .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content"><Navbar title="Dashboard" /><LoadingSpinner /></div>
    </div>
  )

  const available = rooms.filter(r => r.occupancy < r.capacity).length
  const pending   = complaints.filter(c => c.status === 'PENDING').length
  const resolved  = complaints.filter(c => c.status === 'RESOLVED').length

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Warden Dashboard" subtitle="Overview" />
        <div className="page-content">

          {/* Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #1d4ed8 0%, #0891b2 100%)',
            borderRadius: 'var(--r-lg)', padding: '20px 28px', marginBottom: 24,
            boxShadow: '0 8px 32px rgba(29,78,216,0.3)', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>Warden Portal</div>
              <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#fff' }}>Block Overview</div>
              <div style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
                {rooms.length} rooms · {pending} pending issues
              </div>
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
              {[
                { label: 'Available', value: available },
                { label: 'Resolved',  value: resolved },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#fff' }}>{s.value}</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="stat-grid">
            <StatCard icon="🚪" color="blue"   value={rooms.length} label="Total Rooms" />
            <StatCard icon="✅" color="green"  value={available}    label="Available" />
            <StatCard icon="💬" color="yellow" value={pending}      label="Pending Complaints" />
            <StatCard icon="🔍" color="indigo" value={complaints.length} label="Total Complaints" />
          </div>

          <div className="grid-2">
            {/* Room status */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Room Status</span>
                <span className="badge badge-blue">{rooms.length} total</span>
              </div>
              <div className="card-body">
                {rooms.length === 0 ? (
                  <div style={{ textAlign:'center', color:'var(--text-muted)', fontSize:'0.875rem' }}>No rooms assigned.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {rooms.slice(0, 6).map(r => {
                      const isFull = r.occupancy >= r.capacity
                      return (
                        <div key={r.roomId}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Room {r.roomNumber}</span>
                              {isFull && <span className="badge badge-red">Full</span>}
                            </div>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.occupancy}/{r.capacity}</span>
                          </div>
                          <ProgressBar value={r.occupancy} max={r.capacity} color={isFull ? 'red' : 'indigo'} />
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Recent complaints */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Complaints</span>
                <span className="badge badge-yellow">{pending} pending</span>
              </div>
              <div className="card-body" style={{ padding: '0' }}>
                {complaints.length === 0 ? (
                  <div style={{ padding: 24, textAlign:'center', color:'var(--text-muted)', fontSize:'0.875rem' }}>No complaints.</div>
                ) : complaints.slice(0, 5).map(c => (
                  <div key={c.complaintId} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    padding: '12px 22px', borderBottom: '1px solid var(--border)',
                  }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{c.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{c.studentName}</div>
                    </div>
                    <Badge status={c.status} />
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
