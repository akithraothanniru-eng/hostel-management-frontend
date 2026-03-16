import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar  from '../../components/Navbar'
import { DataTable, Modal, Alert, Badge } from '../../components/index.jsx'
import { studentService } from '../../services/studentService'
import { roomService }    from '../../services/roomService'

const emptyForm = { username:'', password:'', email:'', name:'', phone:'', course:'', year:'', roomId:'' }

export default function ManageStudents() {
  const [students, setStudents] = useState([])
  const [rooms, setRooms]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm]         = useState(emptyForm)
  const [error, setError]       = useState('')
  const [saving, setSaving]     = useState(false)

  const load = () => {
    setLoading(true)
    Promise.all([studentService.getAll(), roomService.getAll()])
      .then(([s, r]) => { setStudents(s); setRooms(r) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openAdd  = () => { setEditItem(null); setForm(emptyForm); setError(''); setModal(true) }
  const openEdit = (s) => {
    setEditItem(s)
    setForm({ username: s.username, password: '', email: s.email, name: s.name,
               phone: s.phone||'', course: s.course||'', year: s.year||'', roomId: s.roomId||'' })
    setError(''); setModal(true)
  }
  const closeModal = () => { setModal(false); setError('') }

  const handleSave = async (e) => {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      const payload = { ...form, year: form.year ? Number(form.year) : undefined, roomId: form.roomId ? Number(form.roomId) : undefined }
      if (editItem) await studentService.update(editItem.studentId, payload)
      else          await studentService.create(payload)
      closeModal(); load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save student')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return
    try { await studentService.delete(id); load() }
    catch (err) { alert(err.response?.data?.message || 'Delete failed') }
  }

  const columns = [
    { label: '#', render: (r) => <span style={{color:'var(--text-muted)'}}>{r.studentId}</span> },
    { label: 'Student', render: (r) => (
      <div style={{display:'flex', gap:10, alignItems:'center'}}>
        <div className="avatar blue">{r.name?.slice(0,2).toUpperCase()}</div>
        <div><div style={{fontWeight:500}}>{r.name}</div><div style={{fontSize:'0.78rem',color:'var(--text-secondary)'}}>{r.email}</div></div>
      </div>
    )},
    { label: 'Username', key: 'username' },
    { label: 'Course',   render: r => <span>{r.course || '—'} {r.year ? `(Yr ${r.year})` : ''}</span> },
    { label: 'Phone',    render: r => r.phone || '—' },
    { label: 'Room',     render: r => r.roomNumber ? <Badge status={null} /> || r.roomNumber : <span style={{color:'var(--text-muted)'}}>Unassigned</span> },
  ]

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Manage Students" />
        <div className="page-content">
          <div className="page-header">
            <h1>Students</h1>
            <p>Add, update, and manage student records.</p>
          </div>

          <DataTable
            title={`All Students (${students.length})`}
            columns={columns}
            data={students}
            loading={loading}
            searchable
            onAdd={openAdd}
            addLabel="Add Student"
            actions={(row) => (
              <div style={{display:'flex',gap:6}}>
                <button className="btn btn-secondary btn-sm" onClick={() => openEdit(row)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row.studentId)}>Delete</button>
              </div>
            )}
          />
        </div>
      </div>

      <Modal isOpen={modal} onClose={closeModal} title={editItem ? 'Edit Student' : 'Add Student'} size="lg">
        <form onSubmit={handleSave}>
          <Alert message={error} />
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Username *</label>
              <input className="form-input" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password {editItem ? '(leave blank to keep)' : '*'}</label>
              <input className="form-input" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required={!editItem} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="10-digit number" />
            </div>
            <div className="form-group">
              <label className="form-label">Course</label>
              <input className="form-input" value={form.course} onChange={e => setForm({...form, course: e.target.value})} placeholder="e.g. B.Tech" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Year</label>
              <select className="form-select" value={form.year} onChange={e => setForm({...form, year: e.target.value})}>
                <option value="">Select Year</option>
                {[1,2,3,4,5,6].map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Assign Room</label>
              <select className="form-select" value={form.roomId} onChange={e => setForm({...form, roomId: e.target.value})}>
                <option value="">No Room</option>
                {rooms.map(r => <option key={r.roomId} value={r.roomId}>Room {r.roomNumber} ({r.occupancy}/{r.capacity})</option>)}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Student'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
