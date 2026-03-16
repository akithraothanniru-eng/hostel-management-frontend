import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar  from '../../components/Navbar'
import { LoadingSpinner, EmptyState } from '../../components/index.jsx'
import { foodMenuService } from '../../services/foodMenuService'

const DAYS = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']
const DAY_COLORS = { MONDAY:'blue', TUESDAY:'purple', WEDNESDAY:'green', THURSDAY:'yellow', FRIDAY:'orange', SATURDAY:'red', SUNDAY:'purple' }

export default function FoodMenu() {
  const [menus,   setMenus]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    foodMenuService.studentGetAll().then(setMenus).catch(()=>{}).finally(()=>setLoading(false))
  }, [])

  const today = new Date().toLocaleDateString('en-US',{weekday:'long'}).toUpperCase()

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Food Menu" />
        <div className="page-content">
          <div className="page-header">
            <h1>Weekly Food Menu</h1>
            <p>View today's and this week's meal schedule.</p>
          </div>

          {/* Today's highlight */}
          {(() => {
            const todayMenu = menus.find(m => m.dayOfWeek === today)
            if (!todayMenu) return null
            return (
              <div style={{background:'linear-gradient(135deg,var(--accent-dim),var(--blue-dim))',border:'1px solid var(--border-light)',borderRadius:'var(--radius-lg)',padding:'20px 24px',marginBottom:24}}>
                <div style={{fontSize:'0.72rem',textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--accent)',marginBottom:8,fontWeight:600}}>Today's Menu — {today}</div>
                <div style={{display:'flex',gap:32,flexWrap:'wrap'}}>
                  {[['🌅 Breakfast',todayMenu.breakfast],['☀️ Lunch',todayMenu.lunch],['🌙 Dinner',todayMenu.dinner]].map(([label,val])=>(
                    <div key={label}>
                      <div style={{fontSize:'0.72rem',color:'var(--text-muted)',marginBottom:3}}>{label}</div>
                      <div style={{fontWeight:500,fontSize:'0.95rem'}}>{val||'Not set'}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}

          {loading ? <LoadingSpinner /> : menus.length===0 ? <EmptyState icon="🍽" message="No menu available" /> : (
            <div className="menu-grid">
              {DAYS.map(day => {
                const menu  = menus.find(m => m.dayOfWeek === day)
                const color = DAY_COLORS[day]
                const isToday = day === today
                return (
                  <div key={day} className="menu-day-card" style={isToday?{border:'1px solid var(--accent)'}:{}}>
                    <div className="menu-day-header" style={isToday?{background:'var(--accent-dim)'}:{}}>
                      <span className={`badge badge-${color}`}>{day}</span>
                      {isToday && <span className="badge badge-yellow">TODAY</span>}
                    </div>
                    <div className="menu-day-body">
                      {menu ? (
                        <>
                          <div className="menu-meal">
                            <div className="menu-meal-type">🌅 Breakfast</div>
                            <div className="menu-meal-name">{menu.breakfast||<span style={{color:'var(--text-muted)'}}>—</span>}</div>
                          </div>
                          <div className="menu-meal">
                            <div className="menu-meal-type">☀️ Lunch</div>
                            <div className="menu-meal-name">{menu.lunch||<span style={{color:'var(--text-muted)'}}>—</span>}</div>
                          </div>
                          <div className="menu-meal">
                            <div className="menu-meal-type">🌙 Dinner</div>
                            <div className="menu-meal-name">{menu.dinner||<span style={{color:'var(--text-muted)'}}>—</span>}</div>
                          </div>
                        </>
                      ) : (
                        <div style={{color:'var(--text-muted)',fontSize:'0.85rem',textAlign:'center',padding:'16px 0'}}>No menu available</div>
                      )}
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
