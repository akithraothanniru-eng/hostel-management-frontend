import { useState } from 'react'

export function StatCard({ icon, iconColor = 'yellow', value, label, color }) {
  return (
    <div className={`stat-card ${color || ''}`}>
      <div className={`stat-icon ${iconColor}`}>{icon}</div>
      <div className="stat-info">
        <div className="stat-value">{value ?? '—'}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  )
}

export function Badge({ status }) {
  const map = {
    PENDING:     'badge badge-yellow',
    IN_PROGRESS: 'badge badge-blue',
    RESOLVED:    'badge badge-green',
    PAID:        'badge badge-green',
    NOT_PAID:    'badge badge-red',
    ADMIN:       'badge badge-yellow',
    WARDEN:      'badge badge-blue',
    STUDENT:     'badge badge-green',
    HOSTEL:      'badge badge-green',
    HOME:        'badge badge-orange',
    MONDAY:      'badge badge-purple',
    TUESDAY:     'badge badge-blue',
    WEDNESDAY:   'badge badge-green',
    THURSDAY:    'badge badge-yellow',
    FRIDAY:      'badge badge-orange',
    SATURDAY:    'badge badge-red',
    SUNDAY:      'badge badge-purple',
  }
  const cls = map[status?.toUpperCase()] || 'badge badge-default'
  return <span className={cls}>{status?.replace('_', ' ')}</span>
}

export function LoadingSpinner() {
  return <div className="loading-wrapper"><div className="spinner"></div></div>
}

export function EmptyState({ icon = '📭', message = 'No data found' }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <p>{message}</p>
    </div>
  )
}

export function Modal({ isOpen, onClose, title, children, size }) {
  if (!isOpen) return null
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${size === 'lg' ? 'modal-lg' : ''}`}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function DataTable({ title, columns, data, onAdd, addLabel, searchable, actions, loading, emptyMsg }) {
  const [search, setSearch] = useState('')

  const filtered = searchable && search
    ? data.filter(row =>
        Object.values(row).some(v =>
          String(v ?? '').toLowerCase().includes(search.toLowerCase())
        )
      )
    : data

  return (
    <div className="table-wrapper">
      <div className="table-header">
        <span className="table-title">{title}</span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {searchable && (
            <input
              className="table-search"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          )}
          {onAdd && (
            <button className="btn btn-primary btn-sm" onClick={onAdd}>
              + {addLabel || 'Add'}
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState message={emptyMsg || 'No records found'} />
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col.key || col.label}>{col.label}</th>
                ))}
                {actions && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={row.id || i}>
                  {columns.map(col => (
                    <td key={col.key || col.label}>
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

export function Alert({ type = 'error', message }) {
  if (!message) return null
  return <div className={`alert alert-${type}`}>{message}</div>
}

export function PageLayout({ children }) {
  return (
    <div className="app-layout">
      {children}
    </div>
  )
}
