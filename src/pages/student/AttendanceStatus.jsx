import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar  from '../../components/Navbar'
import { Alert, Badge, LoadingSpinner, EmptyState } from '../../components/index.jsx'
import { attendanceService } from '../../services/attendanceService'

export default function AttendanceStatus() {
  const [records,  setRecords]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [form,     setForm]     = useState({ date: new Date().toISOString().slice(0,10), status:'HOSTEL' })
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')
  const [saving,   setSaving]   = useState(false)

  const load = () => {
    attendanceService.getMine().then(setRecords).catch(()=>{}).finally(()=>setLoading(false))
  }
  useEffect(load, [])

  const handleMark = async (e) => {
    e.preventDefault(); setError(''); setSuccess(''); setSaving(true)
    try {
      await attendanceService.mark(form)
      setSuccess('Attendance marked successfully!')
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark attendance')
    } finally { setSaving(false) }
  }

  const hostelDays = records.filter(r => r.status === 'HOSTEL').length
  const homeDays   = records.filter(r => r.status === 'HOME').length

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Attendance" />
        <div className="page-content">
          <div className="page-header">
            <h1>Attendance</h1>
            <p>Mark and view your daily attendance status.</p>
          </div>

          {/* Stats */}
          <div style={{display:'flex',gap:12,marginBottom:24,flexWrap:'wrap'}}>
            {[
              {label:'In Hostel',value:hostelDays,color:'var(--green)'},
              {label:'At Home',  value:homeDays,  color:'var(--orange)'},
              {label:'Total',    value:records.length,color:'var(--blue)'},
            ].map(s => (
              <div key={s.label} className="card" style={{flex:1,minWidth:140,padding:'16px 20px'}}>
                <div style={{fontSize:'0.75rem',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:6}}>{s.label}</div>
                <div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:'1.5rem',color:s.color}}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="dash-grid">
            {/* Mark form */}
            <div className="card">
              <div className="section-heading">Mark Attendance</div>
              <Alert message={error}   type="error" />
              <Alert message={success} type="success" />
              <form onSubmit={handleMark}>
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input className="form-input" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Status *</label>
                  <div style={{display:'flex',gap:10}}>
                    {['HOSTEL','HOME'].map(s => (
                      <label key={s} style={{display:'flex',alignItems:'center',gap:8,flex:1,background:form.status===s?'var(--accent-dim)':'var(--bg-secondary)',border:`1px solid ${form.status===s?'var(--accent)':'var(--border)'}`,borderRadius:'var(--radius-sm)',padding:'12px',cursor:'pointer',transition:'all 0.15s'}}>
                        <input type="radio" name="status" value={s} checked={form.status===s} onChange={()=>setForm({...form,status:s})} style={{accentColor:'var(--accent)'}} />
                        <span>{s==='HOSTEL'?'🏠 In Hostel':'🏡 At Home'}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} disabled={saving}>
                  {saving ? 'Marking...' : '✓ Mark Attendance'}
                </button>
              </form>
            </div>

            {/* History */}
            <div className="card" style={{maxHeight:480,display:'flex',flexDirection:'column'}}>
              <div className="section-heading">Attendance History</div>
              <div style={{overflowY:'auto',flex:1}}>
                {loading ? <LoadingSpinner /> : records.length===0 ? <EmptyState icon="📋" message="No attendance records" /> : (
                  [...records].reverse().map(r => (
                    <div key={r.attendanceId} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
                      <div>
                        <div style={{fontWeight:500,fontSize:'0.875rem'}}>{r.date}</div>
                        <div style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>#{r.attendanceId}</div>
                      </div>
                      <Badge status={r.status} />
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
