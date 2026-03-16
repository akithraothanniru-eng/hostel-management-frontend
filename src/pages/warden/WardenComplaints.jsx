import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar  from '../../components/Navbar'
import { DataTable, Badge, Modal } from '../../components/index.jsx'
import { complaintService } from '../../services/complaintService'

export default function WardenComplaints() {
  const [complaints, setComplaints] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [filter,     setFilter]     = useState('ALL')
  const [selected,   setSelected]   = useState(null)
  const [modal,      setModal]      = useState(false)

  const load = () => {
    setLoading(true)
    complaintService.wardenGetAll().then(setComplaints).catch(()=>{}).finally(()=>setLoading(false))
  }
  useEffect(load, [])

  const handleStatus = async (id, status) => {
    try { await complaintService.wardenUpdateStatus(id, status); load() }
    catch { alert('Update failed') }
  }

  const filtered = filter === 'ALL' ? complaints : complaints.filter(c => c.status === filter)

  const columns = [
    { label: 'ID',      render: r => <span style={{color:'var(--text-muted)'}}>{r.complaintId}</span> },
    { label: 'Student', render: r => <span style={{fontWeight:500}}>{r.studentName}</span> },
    { label: 'Title',   render: r => (
      <div>
        <div style={{fontWeight:500}}>{r.title}</div>
        <div style={{fontSize:'0.78rem',color:'var(--text-secondary)'}}>{r.description?.slice(0,60)}{r.description?.length>60?'...':''}</div>
      </div>
    )},
    { label: 'Status',  render: r => <Badge status={r.status} /> },
    { label: 'Date',    render: r => r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—' },
  ]

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Complaints" />
        <div className="page-content">
          <div className="page-header">
            <h1>Complaints</h1>
            <p>Manage and respond to student complaints.</p>
          </div>

          <div style={{display:'flex',gap:8,marginBottom:16}}>
            {['ALL','PENDING','IN_PROGRESS','RESOLVED'].map(s => (
              <button key={s} className={`btn btn-sm ${filter===s?'btn-primary':'btn-secondary'}`} onClick={()=>setFilter(s)}>
                {s.replace('_',' ')}
                <span style={{marginLeft:6,background:'rgba(255,255,255,0.15)',borderRadius:99,padding:'1px 6px',fontSize:'0.7rem'}}>
                  {s==='ALL'?complaints.length:complaints.filter(c=>c.status===s).length}
                </span>
              </button>
            ))}
          </div>

          <DataTable
            title={`Complaints (${filtered.length})`}
            columns={columns} data={filtered} loading={loading} searchable
            actions={row => (
              <div style={{display:'flex',gap:6}}>
                <button className="btn btn-secondary btn-sm" onClick={()=>{setSelected(row);setModal(true)}}>View</button>
                {row.status==='PENDING'    && <button className="btn btn-sm" style={{background:'var(--blue-dim)',color:'var(--blue)'}} onClick={()=>handleStatus(row.complaintId,'IN_PROGRESS')}>Start</button>}
                {row.status!=='RESOLVED'   && <button className="btn btn-success btn-sm" onClick={()=>handleStatus(row.complaintId,'RESOLVED')}>Resolve</button>}
              </div>
            )}
          />
        </div>
      </div>

      <Modal isOpen={modal} onClose={()=>setModal(false)} title="Complaint Details">
        {selected && (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
              <div style={{fontWeight:600}}>{selected.title}</div>
              <Badge status={selected.status} />
            </div>
            <div style={{background:'var(--bg-secondary)',borderRadius:'var(--radius-sm)',padding:14,marginBottom:12}}>
              <p style={{fontSize:'0.875rem',color:'var(--text-secondary)',lineHeight:1.7}}>{selected.description||'No description.'}</p>
            </div>
            <div style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>By: {selected.studentName} · {selected.createdAt?new Date(selected.createdAt).toLocaleString():''}</div>
            <div className="modal-footer">
              {selected.status!=='RESOLVED'&&<button className="btn btn-success" onClick={()=>{handleStatus(selected.complaintId,'RESOLVED');setModal(false)}}>Mark Resolved</button>}
              <button className="btn btn-secondary" onClick={()=>setModal(false)}>Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
