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
  const { user }    = useAuth()
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
    ]).then(([p, c, pay, n]) => {
      setProfile(p); setComplaints(c); setPayments(pay); setNotifs(n)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content"><Navbar title="Dashboard" /><LoadingSpinner /></div>
    </div>
  )

  const unpaid  = payments.filter(p => p.status === 'NOT_PAID').length
  const pending = complaints.filter(c => c.status === 'PENDING').length
  const paid    = payments.filter(p => p.status === 'PAID').length

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Student Dashboard" subtitle="My Portal" />
        <div className="page-content">

          {/* Profile banner */}
          <div style={{
            background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
            borderRadius: 'var(--r-lg)', padding: '22px 28px', marginBottom: 24,
            boxShadow: '0 8px 32px rgba(5,150,105,0.3)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: 14,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: '#fff',
                border: '2px solid rgba(255,255,255,0.3)',
              }}>
                {profile?.name?.slice(0,2).toUpperCase() || user?.username?.slice(0,2).toUpperCase() || 'ST'}
              </div>
              <div>
                <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#fff' }}>
                  {profile?.name || user?.username}
                </div>
                <div style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                  {profile?.course && `${profile.course} · `}
                  {profile?.year  && `Year ${profile.year} · `}
                  {profile?.roomNumber ? `Room ${profile.roomNumber}` : 'No room assigned'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
              {[
                { label: 'Paid', value: paid },
                { label: 'Complaints', value: complaints.length },
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
            <StatCard icon="💬" color="yellow" value={pending}          label="Pending Complaints" />
            <StatCard icon="💳" color="red"    value={unpaid}           label="Unpaid Fees" />
            <StatCard icon="📋" color="indigo" value={complaints.length}label="Total Complaints" />
            <StatCard icon="🔔" color="purple" value={notifs.length}    label="Notifications" />
          </div>

          <div className="grid-2">

            {/* My Complaints */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">My Complaints</span>
                <span className="badge badge-yellow">{pending} open</span>
              </div>
              <div style={{ padding: '0' }}>
                {complaints.length === 0 ? (
                  <div style={{ padding: '24px', textAlign:'center', color:'var(--text-muted)', fontSize:'0.875rem' }}>
                    No complaints raised.
                  </div>
                ) : (
                  complaints.slice(0,5).map(c => (
                    <div key={c.complaintId} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                      padding: '12px 22px', borderBottom: '1px solid var(--border)',
                    }}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{c.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}
                        </div>
                      </div>
                      <Badge status={c.status} />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Notifications */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Notifications</span>
                <span className="badge badge-indigo">{notifs.length} total</span>
              </div>
              <div className="card-body" style={{ padding: '8px 22px' }}>
                {notifs.length === 0 ? (
                  <div style={{ padding: '16px 0', textAlign:'center', color:'var(--text-muted)', fontSize:'0.875rem' }}>No notifications.</div>
                ) : notifs.slice(0,4).map(n => (
                  <div key={n.notificationId} className="notif-item">
                    <div className="notif-icon-box">📢</div>
                    <div className="notif-content">
                      <div className="notif-title">{n.title}</div>
                      <div className="notif-msg">{n.message?.slice(0,80)}{n.message?.length > 80 ? '...' : ''}</div>
                      <div className="notif-meta">{n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''}</div>
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
