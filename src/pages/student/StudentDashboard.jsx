import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar  from '../../components/Navbar'
import { StatCard, Badge, LoadingSpinner } from '../../components/index.jsx'
import { studentService }      from '../../services/studentService'
import { complaintService }    from '../../services/complaintService'
import { paymentService }      from '../../services/paymentService'
import { notificationService } from '../../services/notificationService'
import { useAuth } from '../../context/AuthContext'

export default function StudentDashboard() {
  const { user }   = useAuth()
  const [profile,   setProfile]   = useState(null)
  const [complaints,setComplaints]= useState([])
  const [payments,  setPayments]  = useState([])
  const [notifs,    setNotifs]    = useState([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      studentService.getMyProfile(),
      complaintService.getMine(),
      paymentService.getMine(),
      notificationService.studentGetAll(),
    ]).then(([p, c, pay, n]) => { setProfile(p); setComplaints(c); setPayments(pay); setNotifs(n) })
     .catch(() => {})
     .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="app-layout"><Sidebar />
      <div className="main-content"><Navbar title="Dashboard" /><LoadingSpinner /></div>
    </div>
  )

  const unpaid   = payments.filter(p => p.status === 'NOT_PAID').length
  const pending  = complaints.filter(c => c.status === 'PENDING').length

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Student Dashboard" />
        <div className="page-content">
          {/* Welcome banner */}
          <div style={{background:'linear-gradient(135deg, var(--accent-dim) 0%, var(--blue-dim) 100%)',border:'1px solid var(--border-light)',borderRadius:'var(--radius-lg)',padding:'24px 28px',marginBottom:24,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:16}}>
            <div>
              <div style={{fontSize:'0.78rem',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:4}}>Welcome back</div>
              <h1 style={{fontSize:'1.5rem',marginBottom:4}}>{profile?.name || user?.username}</h1>
              <div style={{fontSize:'0.875rem',color:'var(--text-secondary)'}}>
                {profile?.course && `${profile.course} · `}
                {profile?.year && `Year ${profile.year} · `}
                {profile?.roomNumber ? `Room ${profile.roomNumber}` : 'No room assigned'}
              </div>
            </div>
            <div className="avatar" style={{width:64,height:64,fontSize:'1.4rem',background:'var(--accent-dim)',color:'var(--accent)'}}>
              {profile?.name?.slice(0,2).toUpperCase() || 'ST'}
            </div>
          </div>

          <div className="stat-grid">
            <StatCard icon="💬" iconColor="orange" color="orange" value={pending}           label="Pending Complaints" />
            <StatCard icon="💳" iconColor="red"    color="red"    value={unpaid}            label="Unpaid Fees" />
            <StatCard icon="📋" iconColor="blue"   color="blue"   value={complaints.length} label="Total Complaints" />
            <StatCard icon="🔔" iconColor="purple" color="purple" value={notifs.length}     label="Notifications" />
          </div>

          <div className="dash-grid">
            <div className="card">
              <div className="section-heading">My Complaints</div>
              {complaints.length === 0
                ? <p style={{color:'var(--text-muted)',fontSize:'0.875rem'}}>No complaints raised.</p>
                : complaints.slice(0,5).map(c => (
                  <div key={c.complaintId} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
                    <div>
                      <div style={{fontWeight:500,fontSize:'0.875rem'}}>{c.title}</div>
                      <div style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>{c.createdAt?new Date(c.createdAt).toLocaleDateString():''}</div>
                    </div>
                    <Badge status={c.status} />
                  </div>
                ))
              }
            </div>

            <div className="card">
              <div className="section-heading">Recent Notifications</div>
              {notifs.length === 0
                ? <p style={{color:'var(--text-muted)',fontSize:'0.875rem'}}>No notifications.</p>
                : notifs.slice(0,4).map(n => (
                  <div key={n.notificationId} style={{padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
                    <div style={{fontWeight:500,fontSize:'0.875rem',marginBottom:2}}>{n.title}</div>
                    <div style={{fontSize:'0.8rem',color:'var(--text-secondary)'}}>{n.message?.slice(0,80)}{n.message?.length>80?'...':''}</div>
                    <div style={{fontSize:'0.72rem',color:'var(--text-muted)',marginTop:4}}>{n.createdAt?new Date(n.createdAt).toLocaleString():''}</div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
