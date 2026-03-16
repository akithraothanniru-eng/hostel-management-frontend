import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar  from '../../components/Navbar'
import { Alert, Badge, LoadingSpinner, EmptyState } from '../../components/index.jsx'
import { complaintService } from '../../services/complaintService'

export default function RaiseComplaint() {
  const [complaints, setComplaints] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [form,       setForm]       = useState({ title:'', description:'' })
  const [error,      setError]      = useState('')
  const [success,    setSuccess]    = useState('')
  const [submitting, setSubmitting] = useState(false)

  const load = () => {
    complaintService.getMine().then(setComplaints).catch(()=>{}).finally(()=>setLoading(false))
  }
  useEffect(load, [])

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess(''); setSubmitting(true)
    try {
      await complaintService.raise(form)
      setSuccess('Complaint submitted successfully!')
      setForm({ title:'', description:'' }); load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint')
    } finally { setSubmitting(false) }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Complaints" />
        <div className="page-content">
          <div className="page-header">
            <h1>Complaints</h1>
            <p>Raise a new complaint or track existing ones.</p>
          </div>

          <div className="dash-grid">
            {/* Raise form */}
            <div className="card">
              <div className="section-heading">Raise New Complaint</div>
              <Alert message={error}   type="error" />
              <Alert message={success} type="success" />
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input className="form-input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Brief title of your issue" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows="5" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Describe your issue in detail..." style={{resize:'vertical'}} />
                </div>
                <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} disabled={submitting}>
                  {submitting ? 'Submitting...' : '📝 Submit Complaint'}
                </button>
              </form>
            </div>

            {/* History */}
            <div className="card" style={{maxHeight:520,display:'flex',flexDirection:'column'}}>
              <div className="section-heading">My Complaints ({complaints.length})</div>
              <div style={{overflowY:'auto',flex:1}}>
                {loading ? <LoadingSpinner /> : complaints.length===0 ? <EmptyState icon="💬" message="No complaints raised yet" /> : (
                  complaints.map(c => (
                    <div key={c.complaintId} style={{padding:'14px 0',borderBottom:'1px solid var(--border)'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
                        <div style={{fontWeight:500,fontSize:'0.9rem'}}>{c.title}</div>
                        <Badge status={c.status} />
                      </div>
                      {c.description && <div style={{fontSize:'0.82rem',color:'var(--text-secondary)',marginBottom:4,lineHeight:1.5}}>{c.description}</div>}
                      <div style={{fontSize:'0.72rem',color:'var(--text-muted)'}}>{c.createdAt?new Date(c.createdAt).toLocaleString():''}</div>
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
