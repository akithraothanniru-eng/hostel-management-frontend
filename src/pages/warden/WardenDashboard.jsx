import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar  from '../../components/Navbar'
import { StatCard, Badge, LoadingSpinner } from '../../components/index.jsx'
import { roomService }      from '../../services/roomService'
import { complaintService } from '../../services/complaintService'
import { paymentService }   from '../../services/paymentService'

export default function WardenDashboard() {
  const [rooms,      setRooms]      = useState([])
  const [complaints, setComplaints] = useState([])
  const [payments,   setPayments]   = useState([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    Promise.all([
      roomService.wardenGetAll(),
      complaintService.wardenGetAll(),
      paymentService.getAllPayments ? paymentService.getAll() : Promise.resolve([]),
    ]).then(([r, c, p]) => { setRooms(r); setComplaints(c); setPayments(p) })
     .catch(() => {})
     .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="app-layout"><Sidebar />
      <div className="main-content"><Navbar title="Warden Dashboard" /><LoadingSpinner /></div>
    </div>
  )

  const pending  = complaints.filter(c => c.status === 'PENDING').length
  const available= rooms.filter(r => r.occupancy < r.capacity).length

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Warden Dashboard" />
        <div className="page-content">
          <div className="page-header">
            <h1>Warden Overview</h1>
            <p>Monitor your hostel block status.</p>
          </div>

          <div className="stat-grid">
            <StatCard icon="🚪" iconColor="yellow" value={rooms.length}     label="Total Rooms" />
            <StatCard icon="✅" iconColor="green"  color="green" value={available}    label="Available Rooms" />
            <StatCard icon="💬" iconColor="orange" color="orange" value={pending}     label="Pending Complaints" />
            <StatCard icon="📋" iconColor="blue"   color="blue" value={complaints.length} label="Total Complaints" />
          </div>

          <div className="dash-grid">
            <div className="card">
              <div className="section-heading">Recent Complaints</div>
              {complaints.slice(0,6).length === 0
                ? <p style={{color:'var(--text-muted)',fontSize:'0.875rem'}}>No complaints.</p>
                : complaints.slice(0,6).map(c => (
                  <div key={c.complaintId} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
                    <div>
                      <div style={{fontWeight:500,fontSize:'0.875rem'}}>{c.title}</div>
                      <div style={{fontSize:'0.78rem',color:'var(--text-secondary)'}}>{c.studentName}</div>
                    </div>
                    <Badge status={c.status} />
                  </div>
                ))
              }
            </div>

            <div className="card">
              <div className="section-heading">Room Status</div>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {rooms.slice(0,6).map(r => (
                  <div key={r.roomId} style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:32,height:32,background:'var(--accent-dim)',color:'var(--accent)',borderRadius:'var(--radius-sm)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.75rem',fontWeight:700}}>
                        {r.roomNumber}
                      </div>
                      <span style={{fontSize:'0.875rem'}}>Room {r.roomNumber}</span>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{width:60,height:4,background:'var(--bg-hover)',borderRadius:99}}>
                        <div style={{height:'100%',width:`${(r.occupancy/r.capacity)*100}%`,background:r.occupancy>=r.capacity?'var(--red)':'var(--green)',borderRadius:99}}></div>
                      </div>
                      <span style={{fontSize:'0.78rem',color:'var(--text-secondary)'}}>{r.occupancy}/{r.capacity}</span>
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
