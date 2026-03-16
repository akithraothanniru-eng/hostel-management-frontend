import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar  from '../../components/Navbar'
import { Modal, Alert, LoadingSpinner } from '../../components/index.jsx'
import { foodMenuService } from '../../services/foodMenuService'

const DAYS = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']
const emptyForm = { dayOfWeek:'MONDAY', breakfast:'', lunch:'', dinner:'' }

export default function ManageFoodMenu() {
  const [menus,   setMenus]   = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(false)
  const [form,    setForm]    = useState(emptyForm)
  const [error,   setError]   = useState('')
  const [saving,  setSaving]  = useState(false)

  const load = () => {
    setLoading(true)
    foodMenuService.getAll().then(setMenus).catch(()=>{}).finally(()=>setLoading(false))
  }
  useEffect(load, [])

  const openEdit = (menu) => {
    setForm({ dayOfWeek: menu.dayOfWeek, breakfast: menu.breakfast||'', lunch: menu.lunch||'', dinner: menu.dinner||'' })
    setError(''); setModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault(); setError(''); setSaving(true)
    try { await foodMenuService.createOrUpdate(form); setModal(false); load() }
    catch (err) { setError(err.response?.data?.message || 'Failed to save menu') }
    finally { setSaving(false) }
  }

  const dayColors = { MONDAY:'blue', TUESDAY:'purple', WEDNESDAY:'green', THURSDAY:'yellow', FRIDAY:'orange', SATURDAY:'red', SUNDAY:'purple' }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Food Menu" />
        <div className="page-content">
          <div className="page-header" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div>
              <h1>Food Menu</h1>
              <p>Manage the weekly meal schedule.</p>
            </div>
            <button className="btn btn-primary" onClick={() => { setForm(emptyForm); setError(''); setModal(true) }}>+ Add / Update Day</button>
          </div>

          {loading ? <LoadingSpinner /> : (
            <div className="menu-grid">
              {DAYS.map(day => {
                const menu = menus.find(m => m.dayOfWeek === day)
                const color = dayColors[day]
                return (
                  <div key={day} className="menu-day-card">
                    <div className="menu-day-header">
                      <span className={`badge badge-${color}`}>{day}</span>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(menu || { dayOfWeek: day, breakfast:'', lunch:'', dinner:'' })}>
                        {menu ? 'Edit' : '+ Add'}
                      </button>
                    </div>
                    <div className="menu-day-body">
                      {menu ? (
                        <>
                          <div className="menu-meal">
                            <div className="menu-meal-type">🌅 Breakfast</div>
                            <div className="menu-meal-name">{menu.breakfast || <span style={{color:'var(--text-muted)'}}>Not set</span>}</div>
                          </div>
                          <div className="menu-meal">
                            <div className="menu-meal-type">☀️ Lunch</div>
                            <div className="menu-meal-name">{menu.lunch || <span style={{color:'var(--text-muted)'}}>Not set</span>}</div>
                          </div>
                          <div className="menu-meal">
                            <div className="menu-meal-type">🌙 Dinner</div>
                            <div className="menu-meal-name">{menu.dinner || <span style={{color:'var(--text-muted)'}}>Not set</span>}</div>
                          </div>
                        </>
                      ) : (
                        <div style={{color:'var(--text-muted)',fontSize:'0.85rem',textAlign:'center',padding:'16px 0'}}>No menu set for this day.</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Edit Menu">
        <form onSubmit={handleSave}>
          <Alert message={error} />
          <div className="form-group">
            <label className="form-label">Day of Week *</label>
            <select className="form-select" value={form.dayOfWeek} onChange={e=>setForm({...form,dayOfWeek:e.target.value})}>
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">🌅 Breakfast</label>
            <input className="form-input" value={form.breakfast} onChange={e=>setForm({...form,breakfast:e.target.value})} placeholder="e.g. Idli & Sambar" />
          </div>
          <div className="form-group">
            <label className="form-label">☀️ Lunch</label>
            <input className="form-input" value={form.lunch} onChange={e=>setForm({...form,lunch:e.target.value})} placeholder="e.g. Rice, Dal, Sabzi" />
          </div>
          <div className="form-group">
            <label className="form-label">🌙 Dinner</label>
            <input className="form-input" value={form.dinner} onChange={e=>setForm({...form,dinner:e.target.value})} placeholder="e.g. Chapati, Paneer" />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Menu'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
