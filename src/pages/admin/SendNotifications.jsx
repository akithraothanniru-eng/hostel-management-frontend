import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar  from '../../components/Navbar'
import { Alert, LoadingSpinner, EmptyState } from '../../components/index.jsx'
import { notificationService } from '../../services/notificationService'

export default function SendNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [form,     setForm]     = useState({ title:'', message:'' })
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')
  const [sending,  setSending]  = useState(false)

  const load = () => {
    setLoading(true)
    notificationService.getAll().then(setNotifications).catch(()=>{}).finally(()=>setLoading(false))
  }
  useEffect(load, [])

  const handleSend = async (e) => {
    e.preventDefault(); setError(''); setSuccess(''); setSending(true)
    try {
      await notificationService.send(form)
      setSuccess('Notification sent successfully!')
      setForm({ title:'', message:'' })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send notification')
    } finally { setSending(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notification?')) return
    try { await notificationService.delete(id); load() }
    catch { alert('Delete failed') }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Notifications" />
        <div className="page-content">
          <div className="page-header">
            <h1>Notifications</h1>
            <p>Broadcast announcements to all hostel residents.</p>
          </div>

          <div className="dash-grid">
            {/* Compose */}
            <div className="card">
              <div className="section-heading">Compose Notification</div>
              <Alert message={error} type="error" />
              <Alert message={success} type="success" />
              <form onSubmit={handleSend}>
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input className="form-input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Notification title" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea className="form-input" rows="5" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Write your message here..." required style={{resize:'vertical'}} />
                </div>
                <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} disabled={sending}>
                  {sending ? 'Sending...' : '📢 Send Notification'}
                </button>
              </form>
            </div>

            {/* History */}
            <div className="card" style={{maxHeight:600,display:'flex',flexDirection:'column'}}>
              <div className="section-heading">Sent Notifications ({notifications.length})</div>
              <div style={{overflowY:'auto',flex:1}}>
                {loading ? <LoadingSpinner /> : notifications.length === 0 ? (
                  <EmptyState icon="🔔" message="No notifications sent yet" />
                ) : (
                  notifications.map(n => (
                    <div key={n.notificationId} className="notif-card" style={{margin:0,marginBottom:10}}>
                      <div className="notif-icon">📢</div>
                      <div className="notif-content">
                        <div className="notif-title">{n.title}</div>
                        <div className="notif-msg">{n.message}</div>
                        <div className="notif-meta">
                          <span className={`badge badge-${n.senderRole==='ADMIN'?'yellow':'blue'}`} style={{marginRight:8}}>{n.senderRole}</span>
                          {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                        </div>
                      </div>
                      <button className="btn btn-danger btn-icon" onClick={() => handleDelete(n.notificationId)} title="Delete">✕</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
