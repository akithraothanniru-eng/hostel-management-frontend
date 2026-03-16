import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar  from '../../components/Navbar'
import { DataTable, Modal, Alert } from '../../components/index.jsx'
import { roomService }   from '../../services/roomService'
import { wardenService } from '../../services/wardenService'

const emptyForm = { roomNumber:'', capacity:'', wardenId:'' }

export default function ManageRooms() {
  const [rooms,   setRooms]   = useState([])
  const [wardens, setWardens] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(false)
  const [editItem,setEditItem]= useState(null)
  const [form,    setForm]    = useState(emptyForm)
  const [error,   setError]   = useState('')
  const [saving,  setSaving]  = useState(false)

  const load = () => {
    setLoading(true)
    Promise.all([roomService.getAll(), wardenService.getAll()])
      .then(([r, w]) => { setRooms(r); setWardens(w) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openAdd  = () => { setEditItem(null); setForm(emptyForm); setError(''); setModal(true) }
  const openEdit = (r) => {
    setEditItem(r)
    setForm({ roomNumber: r.roomNumber, capacity: r.capacity, wardenId: r.wardenId || '' })
    setError(''); setModal(true)
  }
  const closeModal = () => { setModal(false); setError('') }

  const handleSave = async (e) => {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      const payload = { ...form, capacity: Number(form.capacity), wardenId: form.wardenId ? Number(form.wardenId) : null }
      if (editItem) await roomService.update(editItem.roomId, payload)
      else          await roomService.create(payload)
      closeModal(); load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save room')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this room?')) return
    try { await roomService.delete(id); load() }
    catch (err) { alert(err.response?.data?.message || 'Delete failed') }
  }

  const columns = [
    { label: 'Room', render: r => (
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:36, height:36, background:'var(--accent-dim)', color:'var(--accent)', borderRadius:'var(--radius-sm)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.8rem' }}>
          {r.roomNumber}
        </div>
        <span style={{ fontWeight:500 }}>Room {r.roomNumber}</span>
      </div>
    )},
    { label: 'Capacity', render: r => `${r.capacity} beds` },
    { label: 'Occupancy', render: r => (
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ flex:1, height:5, background:'var(--bg-hover)', borderRadius:99, maxWidth:80 }}>
          <div style={{ height:'100%', width:`${(r.occupancy/r.capacity)*100}%`, background: r.occupancy >= r.capacity ? 'var(--red)' : 'var(--green)', borderRadius:99 }}></div>
        </div>
        <span style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>{r.occupancy}/{r.capacity}</span>
      </div>
    )},
    { label: 'Status', render: r => r.occupancy >= r.capacity
        ? <span className="badge badge-red">Full</span>
        : <span className="badge badge-green">Available</span>
    },
    { label: 'Warden', render: r => r.wardenUsername || <span style={{color:'var(--text-muted)'}}>Unassigned</span> },
  ]

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Manage Rooms" />
        <div className="page-content">
          <div className="page-header">
            <h1>Rooms</h1>
            <p>Manage hostel rooms, capacity, and warden assignments.</p>
          </div>
          <DataTable
            title={`All Rooms (${rooms.length})`}
            columns={columns} data={rooms} loading={loading} searchable
            onAdd={openAdd} addLabel="Add Room"
            actions={row => (
              <div style={{display:'flex',gap:6}}>
                <button className="btn btn-secondary btn-sm" onClick={() => openEdit(row)}>Edit</button>
                <button className="btn btn-danger btn-sm"    onClick={() => handleDelete(row.roomId)}>Delete</button>
              </div>
            )}
          />
        </div>
      </div>

      <Modal isOpen={modal} onClose={closeModal} title={editItem ? 'Edit Room' : 'Add Room'}>
        <form onSubmit={handleSave}>
          <Alert message={error} />
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Room Number *</label>
              <input className="form-input" value={form.roomNumber} onChange={e=>setForm({...form,roomNumber:e.target.value})} placeholder="e.g. 101" required />
            </div>
            <div className="form-group">
              <label className="form-label">Capacity *</label>
              <input className="form-input" type="number" min="1" value={form.capacity} onChange={e=>setForm({...form,capacity:e.target.value})} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Assign Warden</label>
            <select className="form-select" value={form.wardenId} onChange={e=>setForm({...form,wardenId:e.target.value})}>
              <option value="">No Warden</option>
              {wardens.map(w => <option key={w.wardenId} value={w.wardenId}>{w.username}</option>)}
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Room'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
