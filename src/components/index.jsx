import { useState } from 'react'

/* ── StatCard ── */
export function StatCard({ icon, color = 'indigo', value, label, delta, deltaType }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon-box ${color}`}>{icon}</div>
      <div className="stat-body">
        <div className="stat-value">{value ?? '—'}</div>
        <div className="stat-label">{label}</div>
        {delta && (
          <div className={`stat-delta ${deltaType || 'up'}`}>{delta}</div>
        )}
      </div>
    </div>
  )
}

/* ── Badge ── */
export function Badge({ status }) {
  const map = {
    PENDING:     'badge badge-yellow',
    IN_PROGRESS: 'badge badge-blue',
    RESOLVED:    'badge badge-green',
    PAID:        'badge badge-green',
    NOT_PAID:    'badge badge-red',
    ADMIN:       'badge badge-yellow',
    WARDEN:      'badge badge-blue',
    STUDENT:     'badge badge-indigo',
    HOSTEL:      'badge badge-green',
    HOME:        'badge badge-orange',
    ACTIVE:      'badge badge-green',
    INACTIVE:    'badge badge-gray',
  }
  const cls = map[status?.toUpperCase()] || 'badge badge-gray'
  return <span className={cls}>{status?.replace('_', ' ')}</span>
}

/* ── Loading ── */
export function LoadingSpinner({ size = 'normal' }) {
  return (
    <div className="loading-center">
      <div className={`spinner${size === 'sm' ? ' spinner-sm' : ''}`} />
    </div>
  )
}

/* ── Empty State ── */
export function EmptyState({ icon = '📭', title = 'No data found', desc = '' }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <div className="empty-title">{title}</div>
      {desc && <div className="empty-desc">{desc}</div>}
    </div>
  )
}

/* ── Alert ── */
export function Alert({ type = 'error', message, onClose }) {
  if (!message) return null
  const typeMap = { error: 'alert-error', success: 'alert-success', warning: 'alert-warning', info: 'alert-info' }
  const icons   = { error: '⚠', success: '✓', warning: '⚠', info: 'ℹ' }
  return (
    <div className={`alert ${typeMap[type]}`}>
      <span>{icons[type]}</span>
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button onClick={onClose} style={{ background:'none',border:'none',cursor:'pointer',opacity:0.6,marginLeft:8 }}>✕</button>
      )}
    </div>
  )
}

/* ── Modal ── */
export function Modal({ isOpen, onClose, title, children, size }) {
  if (!isOpen) return null
  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal${size === 'lg' ? ' modal-lg' : ''}`}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

/* ── DataTable ── */
export function DataTable({
  title, columns, data = [], loading, onAdd, addLabel,
  searchable, actions, emptyMsg, emptyIcon,
}) {
  const [search, setSearch] = useState('')

  const filtered = searchable && search
    ? data.filter(row =>
        Object.values(row).some(v => String(v ?? '').toLowerCase().includes(search.toLowerCase()))
      )
    : data

  return (
    <div className="table-wrap">
      <div className="table-toolbar">
        <span className="table-title">{title}</span>
        <div className="table-actions">
          {searchable && (
            <input
              className="search-input"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          )}
          {onAdd && (
            <button className="btn btn-primary btn-sm" onClick={onAdd}>
              <span>+</span> {addLabel || 'Add'}
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState icon={emptyIcon} title={emptyMsg || 'No records found'} />
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {columns.map(col => <th key={col.label}>{col.label}</th>)}
                {actions && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={row.id ?? i}>
                  {columns.map(col => (
                    <td key={col.label}>
                      {col.render ? col.render(row) : (row[col.key] ?? '—')}
                    </td>
                  ))}
                  {actions && <td>{actions(row)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/* ── Avatar ── */
export function Avatar({ name, color = 'indigo' }) {
  return (
    <span className={`avatar avatar-${color}`}>
      {name?.slice(0, 2).toUpperCase() || '??'}
    </span>
  )
}

/* ── ProgressBar ── */
export function ProgressBar({ value, max, color = 'indigo' }) {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div className="progress-bar" style={{ flex: 1 }}>
        <div className={`progress-fill ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', minWidth: 36, textAlign: 'right' }}>
        {value}/{max}
      </span>
    </div>
  )
}
