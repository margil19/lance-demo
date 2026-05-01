import { useState, useEffect } from 'react'
import { buildLiveQueue, PROPERTIES } from '../data/rulesData'
import ResolutionPanel from './ResolutionPanel'

const ALL_TYPES = ['Reservations', 'Restaurant', 'Maintenance', 'Concierge', 'Billing']

function loadLS(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
  catch { return fallback }
}

function saveLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

const BASE_QUEUE = buildLiveQueue()

export default function EscalationQueue() {
  const [filterProperty, setFilterProperty] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedRow, setSelectedRow] = useState(null)

  // { [id]: { by, at } }
  const [claimed, setClaimed] = useState(() => loadLS('lance-claimed', {}))
  // { [id]: { by, at, resolutionType, note } }
  const [resolved, setResolved] = useState(() => loadLS('lance-resolved', {}))
  // { [id]: string } — reassigned targets
  const [assigned, setAssigned] = useState(() => loadLS('lance-assigned', {}))

  useEffect(() => saveLS('lance-claimed', claimed), [claimed])
  useEffect(() => saveLS('lance-resolved', resolved), [resolved])
  useEffect(() => saveLS('lance-assigned', assigned), [assigned])

  // Merge live state onto queue rows
  const queue = BASE_QUEUE.map(row => ({
    ...row,
    status: resolved[row.id] ? 'resolved' : row.status,
    assignedTo: assigned[row.id] ?? row.assignedTo,
  }))

  const filtered = queue.filter(row => {
    if (filterProperty !== 'all' && row.propertyId !== filterProperty) return false
    if (filterType !== 'all' && row.type !== filterType) return false
    if (filterStatus !== 'all' && row.status !== filterStatus) return false
    return true
  })

  const pendingCount  = queue.filter(r => r.status === 'pending').length
  const resolvedToday = Object.keys(resolved).length

  function handleClaim(rowId, agentName) {
    setClaimed(prev => ({ ...prev, [rowId]: { by: agentName, at: Date.now() } }))
  }

  function handleReassign(rowId, target) {
    setAssigned(prev => ({ ...prev, [rowId]: target }))
    // Update the selected row display
    setSelectedRow(prev => prev?.id === rowId ? { ...prev, assignedTo: target } : prev)
  }

  function handleResolve(rowId, resolution) {
    setResolved(prev => ({
      ...prev,
      [rowId]: { ...resolution, by: claimed[rowId]?.by ?? 'Agent', at: Date.now() },
    }))
    setSelectedRow(null)
  }

  const openRow = selectedRow ? queue.find(r => r.id === selectedRow.id) ?? selectedRow : null

  return (
    <div className="section command-center">
      <div className="section-header">
        <div>
          <h2 className="section-title">Live Escalation Queue</h2>
          <p className="section-desc">Click any row to claim, reassign, or resolve</p>
        </div>
        <div className="cc-header-right">
          <div className="resolved-today-badge">
            <span className="resolved-today-count">{resolvedToday}</span>
            <span className="resolved-today-label">Resolved today</span>
          </div>
          <div className="esc-summary">
            <span className="esc-badge pending">{pendingCount} Pending</span>
            <span className="esc-badge resolved">{resolvedToday} Resolved</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="queue-filters">
        <select className="rule-select" value={filterProperty} onChange={e => setFilterProperty(e.target.value)}>
          <option value="all">All Properties</option>
          {PROPERTIES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select className="rule-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          {ALL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="rule-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>
        {(filterProperty !== 'all' || filterType !== 'all' || filterStatus !== 'all') && (
          <button className="btn-ghost" onClick={() => { setFilterProperty('all'); setFilterType('all'); setFilterStatus('all') }}>
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="esc-table">
        <div className="esc-row header queue-header">
          <div>Request ID</div>
          <div>Property</div>
          <div>Type</div>
          <div>Reason</div>
          <div>Time</div>
          <div>Assigned To</div>
          <div>Status</div>
          <div>Action</div>
        </div>

        {filtered.length === 0 && (
          <div className="queue-empty">No escalations match the current filters.</div>
        )}

        {filtered.map(row => {
          const isClaimed   = !!claimed[row.id]
          const isResolved  = row.status === 'resolved'
          const isSelected  = selectedRow?.id === row.id

          return (
            <div
              key={row.id}
              className={`esc-row queue-row ${isSelected ? 'row-selected' : ''} ${isResolved ? 'row-resolved' : ''}`}
              onClick={() => setSelectedRow(row)}
            >
              <div className="esc-id">{row.id}</div>
              <div className="queue-property">{row.propertyName}</div>
              <div className="esc-type"><span className="type-chip">{row.type}</span></div>
              <div className="esc-reason">{row.reason}</div>
              <div className="esc-time">{row.time}</div>
              <div className="queue-assigned">
                {isClaimed
                  ? <span className="claimed-by">{claimed[row.id].by}</span>
                  : <span className="unassigned-text">{row.assignedTo}</span>
                }
              </div>
              <div>
                <span className={`status-pill ${isResolved ? 'resolved' : isClaimed ? 'claimed' : 'pending'}`}>
                  {isResolved ? 'Resolved' : isClaimed ? 'Claimed' : 'Pending'}
                </span>
              </div>
              <div onClick={e => e.stopPropagation()}>
                {!isResolved && !isClaimed && (
                  <button
                    className="btn-claim"
                    onClick={() => handleClaim(row.id, 'Jordan M.')}
                  >
                    Claim
                  </button>
                )}
                {!isResolved && isClaimed && (
                  <button
                    className="btn-resolve-quick"
                    onClick={() => setSelectedRow(row)}
                  >
                    Resolve
                  </button>
                )}
                {isResolved && (
                  <span className="resolved-check">Done</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Resolution Drawer */}
      {openRow && (
        <ResolutionPanel
          row={openRow}
          claimState={claimed[openRow.id] ?? null}
          resolveState={resolved[openRow.id] ?? null}
          onClose={() => setSelectedRow(null)}
          onClaim={(agent) => handleClaim(openRow.id, agent)}
          onReassign={(target) => handleReassign(openRow.id, target)}
          onResolve={(res) => handleResolve(openRow.id, res)}
        />
      )}
    </div>
  )
}
