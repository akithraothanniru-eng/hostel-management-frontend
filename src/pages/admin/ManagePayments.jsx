import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar  from '../../components/Navbar'
import { DataTable, Modal, Alert, Badge } from '../../components/index.jsx'
import { paymentService }  from '../../services/paymentService'
import { studentService }  from '../../services/studentService'

const emptyForm = { studentId:'', amount:'', month:'', status:'NOT_PAID' }

export default function ManagePayments() {
  const [payments,  setPayments]  = useState([])
  const [students,  setStudents]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [modal,     setModal]     = useState(false)
  const [form,      setForm]      = useState(emptyForm)
  const [error,     setError]     = useState('')
  const [saving,    setSaving]    = useState(false)
  const [filter,    setFilter]    = useState('ALL')

  const load = () => {
    setLoading(true)
    Promise.all([paymentService.getAll(), studentService.getAll()])
      .then(([p, s]) => { setPayments(p); setStudents(s) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleSave = async (e) => {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      await paymentService.create({ ...form, studentId: Number(form.studentId), amount: Number(form.amount) })
      setModal(false); load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create payment')
    } finally { setSaving(false) }
  }

  const toggleStatus = async (id, current) => {
    const next = current === 'PAID' ? 'NOT_PAID' : 'PAID'
    try { await paymentService.updateStatus(id, next); load() }
    catch (err) { alert('Update failed') }
  }

  const filtered = filter === 'ALL' ? payments : payments.filter(p => p.status === filter)

  const columns = [
    { label: '#', render: r => <span style={{color:'var(--text-muted)'}}>{r.paymentId}</span> },
    { label: 'Student', render: r => <span style={{fontWeight:500}}>{r.studentName}</span> },
    { label: 'Month',   key: 'month' },
    { label: 'Amount',  render: r => <span style={{color:'var(--accent)',fontWeight:600}}>₹{Number(r.amount).toLocaleString()}</span> },
    { label: 'Status',  render: r => <Badge status={r.status} /> },
  ]

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Manage Payments" />
        <div className="page-content">
          <div className="page-header">
            <h1>Payments</h1>
            <p>Track and manage student fee payments.</p>
          </div>

          {/* Summary strip */}
          <div style={{display:'flex',gap:12,marginBottom:20,flexWrap:'wrap'}}>
            <div className="card" style={{padding:'14px 20px',display:'flex',gap:16,alignItems:'center',flex:1,minWidth:160}}>
              <div style={{color:'var(--green)',fontSize:'1.4rem',fontFamily:'var(--font-display)',fontWeight:700}}>{payments.filter(p=>p.status==='PAID').length}</div>
              <div style={{fontSize:'0.8rem',color:'var(--text-secondary)'}}>Paid</div>
            </div>
            <div className="card" style={{padding:'14px 20px',display:'flex',gap:16,alignItems:'center',flex:1,minWidth:160}}>
              <div style={{color:'var(--red)',fontSize:'1.4rem',fontFamily:'var(--font-display)',fontWeight:700}}>{payments.filter(p=>p.status==='NOT_PAID').length}</div>
              <div style={{fontSize:'0.8rem',color:'var(--text-secondary)'}}>Unpaid</div>
            </div>
            <div className="card" style={{padding:'14px 20px',display:'flex',gap:16,alignItems:'center',flex:1,minWidth:160}}>
              <div style={{color:'var(--accent)',fontSize:'1.4rem',fontFamily:'var(--font-display)',fontWeight:700}}>
                ₹{payments.filter(p=>p.status==='PAID').reduce((s,p)=>s+Number(p.amount),0).toLocaleString()}
              </div>
              <div style={{fontSize:'0.8rem',color:'var(--text-secondary)'}}>Collected</div>
            </div>
          </div>

          {/* Filter */}
          <div style={{display:'flex',gap:8,marginBottom:16}}>
            {['ALL','PAID','NOT_PAID'].map(s => (
              <button key={s} className={`btn btn-sm ${filter===s?'btn-primary':'btn-secondary'}`} onClick={()=>setFilter(s)}>
                {s.replace('_',' ')}
              </button>
            ))}
          </div>

          <DataTable
            title={`Payments (${filtered.length})`}
            columns={columns} data={filtered} loading={loading} searchable
            onAdd={() => { setForm(emptyForm); setError(''); setModal(true) }} addLabel="Add Payment"
            actions={row => (
              <button
                className={`btn btn-sm ${row.status==='PAID'?'btn-danger':'btn-success'}`}
                onClick={() => toggleStatus(row.paymentId, row.status)}
              >
                {row.status==='PAID' ? 'Mark Unpaid' : 'Mark Paid'}
              </button>
            )}
          />
        </div>
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Add Payment">
        <form onSubmit={handleSave}>
          <Alert message={error} />
          <div className="form-group">
            <label className="form-label">Student *</label>
            <select className="form-select" value={form.studentId} onChange={e=>setForm({...form,studentId:e.target.value})} required>
              <option value="">Select Student</option>
              {students.map(s => <option key={s.studentId} value={s.studentId}>{s.name} ({s.username})</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount (₹) *</label>
              <input className="form-input" type="number" min="0" step="0.01" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Month *</label>
              <input className="form-input" value={form.month} onChange={e=>setForm({...form,month:e.target.value})} placeholder="e.g. January 2025" required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
              <option value="NOT_PAID">Not Paid</option>
              <option value="PAID">Paid</option>
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={()=>setModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'Saving...':'Add Payment'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
