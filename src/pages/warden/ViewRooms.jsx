import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar  from '../../components/Navbar'
import { LoadingSpinner, EmptyState } from '../../components/index.jsx'
import { roomService } from '../../services/roomService'

export default function ViewRooms() {
  const [rooms,   setRooms]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    roomService.wardenGetAll().then(setRooms).catch(()=>{}).finally(()=>setLoading(false))
  }, [])

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="View Rooms" />
        <div className="page-content">
          <div className="page-header">
            <h1>Rooms</h1>
            <p>View all rooms and their current occupancy.</p>
          </div>

          {loading ? <LoadingSpinner /> : rooms.length === 0 ? <EmptyState icon="🚪" message="No rooms found" /> : (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:16}}>
              {rooms.map(r => {
                const pct = Math.round((r.occupancy / r.capacity) * 100)
                const isFull = r.occupancy >= r.capacity
                return (
                  <div key={r.roomId} className="card" style={{borderTop:`3px solid ${isFull?'var(--red)':'var(--green)'}`}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
                      <div>
                        <div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:'1.3rem'}}>Room {r.roomNumber}</div>
                        <div style={{fontSize:'0.78rem',color:'var(--text-secondary)'}}>
                          Warden: {r.wardenUsername || 'Unassigned'}
                        </div>
                      </div>
                      <span className={`badge ${isFull?'badge-red':'badge-green'}`}>{isFull?'Full':'Available'}</span>
                    </div>
                    <div style={{marginBottom:10}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                        <span style={{fontSize:'0.8rem',color:'var(--text-secondary)'}}>Occupancy</span>
                        <span style={{fontSize:'0.8rem',fontWeight:600,color:isFull?'var(--red)':'var(--green)'}}>{r.occupancy}/{r.capacity}</span>
                      </div>
                      <div style={{height:6,background:'var(--bg-hover)',borderRadius:99}}>
                        <div style={{height:'100%',width:`${pct}%`,background:isFull?'var(--red)':'var(--green)',borderRadius:99,transition:'width 0.5s ease'}}></div>
                      </div>
                    </div>
                    <div style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>
                      {r.capacity - r.occupancy} bed{r.capacity - r.occupancy !== 1 ? 's' : ''} available
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
