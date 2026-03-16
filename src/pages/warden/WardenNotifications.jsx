import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar  from '../../components/Navbar'
import { Alert, LoadingSpinner, EmptyState } from '../../components/index.jsx'
import { notificationService } from '../../services/notificationService'

export default function WardenNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [form,     setForm]     = useState({ title:'', message:'' })
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')
  const [sending,  setSending]  = useState(false)

  const load = () => {
    setLoading(true)
    notificationService.wardenGetAll().then(setNotifications).catch(()=>{}).finally(()=>setLoading(false))
  }
  useEffect(load, [])

  const handleSend = async (e) => {
    e.preventDefault(); setError(''); setSuccess(''); setSending(true)
    try {
      await notificationService.wardenSend(form)
      setSuccess('Notification sent!')
      setForm({ title:'', message:'' }); load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send')
    } finally { setSending(false) }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Notifications" />
        <div className="page-content">
          <div className="page-header">
            <h1>Notifications</h1>
            <p>Send announcements to hostel residents.</p>
          </div>

          <div className="dash-grid">
            <div className="card">
              <div className="section-heading">New Notification</div>
              <Alert message={error} type="error" />
              <Alert message={success} type="success" />
              <form onSubmit={handleSend}>
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input className="form-input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea className="form-input" rows="5" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required style={{resize:'vertical'}} />
                </div>
                <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} disabled={sending}>
                  {sending ? 'Sending...' : '📢 Send'}
                </button>
              </form>
            </div>

            <div className="card" style={{maxHeight:500,display:'flex',flexDirection:'column'}}>
              <div className="section-heading">Recent Notifications</div>
              <div style={{overflowY:'auto',flex:1}}>
                {loading ? <LoadingSpinner /> : notifications.length===0 ? <EmptyState icon="🔔" message="No notifications" /> : (
                  notifications.map(n => (
                    <div key={n.notificationId} className="notif-card" style={{margin:0,marginBottom:10}}>
                      <div className="notif-icon">📢</div>
                      <div className="notif-content">
                        <div className="notif-title">{n.title}</div>
                        <div className="notif-msg">{n.message}</div>
                        <div className="notif-meta">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</div>
                      </div>
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
