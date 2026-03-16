import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar  from '../../components/Navbar'
import { DataTable, Modal, Alert } from '../../components/index.jsx'
import { wardenService } from '../../services/wardenService'

const emptyForm = { username:'', password:'', email:'' }

export default function ManageWardens() {
  const [wardens, setWardens]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm]         = useState(emptyForm)
  const [error, setError]       = useState('')
  const [saving, setSaving]     = useState(false)

  const load = () => {
    setLoading(true)
    wardenService.getAll().then(setWardens).catch(()=>{}).finally(()=>setLoading(false))
  }
  useEffect(load, [])

  const openAdd  = () => { setEditItem(null); setForm(emptyForm); setError(''); setModal(true) }
  const openEdit = (w) => { setEditItem(w); setForm({username:w.username,password:'',email:w.email}); setError(''); setModal(true) }
  const closeModal = () => { setModal(false); setError('') }

  const handleSave = async (e) => {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      if (editItem) await wardenService.update(editItem.wardenId, form)
      else          await wardenService.create(form)
      closeModal(); load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save warden')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this warden?')) return
    try { await wardenService.delete(id); load() }
    catch (err) { alert(err.response?.data?.message || 'Delete failed') }
  }

  const columns = [
    { label: '#', render: r => <span style={{color:'var(--text-muted)'}}>{r.wardenId}</span> },
    { label: 'Warden', render: r => (
      <div style={{display:'flex', gap:10, alignItems:'center'}}>
        <div className="avatar">{r.username?.slice(0,2).toUpperCase()}</div>
        <div><div style={{fontWeight:500}}>{r.username}</div><div style={{fontSize:'0.78rem',color:'var(--text-secondary)'}}>{r.email}</div></div>
      </div>
    )},
    { label: 'Email', key: 'email' },
    { label: 'User ID', render: r => <span style={{color:'var(--text-muted)'}}>{r.userId}</span> },
  ]

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Manage Wardens" />
        <div className="page-content">
          <div className="page-header">
            <h1>Wardens</h1>
            <p>Manage hostel warden accounts.</p>
          </div>
          <DataTable
            title={`All Wardens (${wardens.length})`}
            columns={columns} data={wardens} loading={loading} searchable
            onAdd={openAdd} addLabel="Add Warden"
            actions={row => (
              <div style={{display:'flex',gap:6}}>
                <button className="btn btn-secondary btn-sm" onClick={() => openEdit(row)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row.wardenId)}>Delete</button>
              </div>
            )}
          />
        </div>
      </div>

      <Modal isOpen={modal} onClose={closeModal} title={editItem ? 'Edit Warden' : 'Add Warden'}>
        <form onSubmit={handleSave}>
          <Alert message={error} />
          <div className="form-group">
            <label className="form-label">Username *</label>
            <input className="form-input" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="form-input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password {editItem ? '(leave blank to keep)' : '*'}</label>
            <input className="form-input" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required={!editItem} />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
