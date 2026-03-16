import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar  from '../../components/Navbar'
import { Badge, LoadingSpinner, EmptyState } from '../../components/index.jsx'
import { paymentService } from '../../services/paymentService'

export default function PaymentHistory() {
  const [payments, setPayments] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    paymentService.getMine().then(setPayments).catch(()=>{}).finally(()=>setLoading(false))
  }, [])

  const paid   = payments.filter(p => p.status === 'PAID')
  const unpaid = payments.filter(p => p.status === 'NOT_PAID')
  const total  = payments.reduce((s, p) => s + Number(p.amount), 0)
  const paidAmt= paid.reduce((s, p) => s + Number(p.amount), 0)

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Payment History" />
        <div className="page-content">
          <div className="page-header">
            <h1>Payment History</h1>
            <p>View your fee payment records.</p>
          </div>

          {/* Summary */}
          <div style={{display:'flex',gap:12,marginBottom:24,flexWrap:'wrap'}}>
            {[
              {label:'Total Dues',   value:`₹${total.toLocaleString()}`,   color:'var(--text-primary)'},
              {label:'Amount Paid',  value:`₹${paidAmt.toLocaleString()}`, color:'var(--green)'},
              {label:'Pending',      value:`₹${(total-paidAmt).toLocaleString()}`, color:'var(--red)'},
            ].map(s => (
              <div key={s.label} className="card" style={{flex:1,minWidth:160,padding:'16px 20px'}}>
                <div style={{fontSize:'0.75rem',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:6}}>{s.label}</div>
                <div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:'1.4rem',color:s.color}}>{s.value}</div>
              </div>
            ))}
          </div>

          {loading ? <LoadingSpinner /> : payments.length===0 ? <EmptyState icon="💳" message="No payment records found" /> : (
            <>
              {unpaid.length > 0 && (
                <div style={{marginBottom:24}}>
                  <div className="section-heading" style={{color:'var(--red)'}}>Pending Payments</div>
                  <div style={{display:'flex',flexDirection:'column',gap:10}}>
                    {unpaid.map(p => (
                      <div key={p.paymentId} style={{background:'var(--red-dim)',border:'1px solid rgba(247,94,94,0.2)',borderRadius:'var(--radius)',padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10}}>
                        <div>
                          <div style={{fontWeight:600,fontSize:'0.95rem'}}>{p.month}</div>
                          <div style={{fontSize:'0.78rem',color:'var(--text-secondary)',marginTop:2}}>Payment ID: #{p.paymentId}</div>
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:12}}>
                          <span style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:'1.1rem',color:'var(--red)'}}>₹{Number(p.amount).toLocaleString()}</span>
                          <Badge status={p.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="section-heading">All Payments</div>
                <div className="table-wrapper">
                  <table>
                    <thead><tr>
                      <th>#</th><th>Month</th><th>Amount</th><th>Status</th>
                    </tr></thead>
                    <tbody>
                      {payments.map(p => (
                        <tr key={p.paymentId}>
                          <td style={{color:'var(--text-muted)'}}>{p.paymentId}</td>
                          <td style={{fontWeight:500}}>{p.month}</td>
                          <td style={{color:'var(--accent)',fontWeight:600}}>₹{Number(p.amount).toLocaleString()}</td>
                          <td><Badge status={p.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
