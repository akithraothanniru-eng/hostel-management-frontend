import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar  from '../../components/Navbar'
import { LoadingSpinner, EmptyState } from '../../components/index.jsx'
import { notificationService } from '../../services/notificationService'

export default function Notifications() {
  const [notifs,  setNotifs]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    notificationService.studentGetAll().then(setNotifs).catch(()=>{}).finally(()=>setLoading(false))
  }, [])

  const roleColors = { ADMIN:'yellow', WARDEN:'blue', STUDENT:'green' }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Notifications" />
        <div className="page-content">
          <div className="page-header">
            <h1>Notifications</h1>
            <p>All announcements from admin and wardens.</p>
          </div>

          {loading ? <LoadingSpinner /> : notifs.length===0 ? <EmptyState icon="🔔" message="No notifications yet" /> : (
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {notifs.map(n => (
                <div key={n.notificationId} className="notif-card">
                  <div className={`notif-icon`} style={{background:`var(--${roleColors[n.senderRole]||'yellow'}-dim)`,color:`var(--${roleColors[n.senderRole]||'accent'})`}}>
                    📢
                  </div>
                  <div className="notif-content">
                    <div className="notif-title">{n.title}</div>
                    <div className="notif-msg">{n.message}</div>
                    <div className="notif-meta">
                      <span className={`badge badge-${roleColors[n.senderRole]||'yellow'}`} style={{marginRight:8}}>{n.senderRole}</span>
                      {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
