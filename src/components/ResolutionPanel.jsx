import { useState } from 'react'
import { TARGETS } from '../data/rulesData'

const RESOLUTION_TYPES = [
  'Guest satisfied',
  'Refund issued',
  'Room changed',
  'Maintenance dispatched',
  'Reservation adjusted',
  'No action required',
]

const CURRENT_AGENT = 'Jordan M.'

function timeAgo(ts) {
  if (!ts) return ''
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  return `${Math.floor(mins / 60)}h ago`
}

export default function ResolutionPanel({ row, claimState, resolveState, onClose, onClaim, onReassign, onResolve }) {
  const [resolutionType, setResolutionType] = useState(RESOLUTION_TYPES[0])
  const [note, setNote] = useState('')
  const [assignTarget, setAssignTarget] = useState(row.assignedTo === 'Unassigned' ? TARGETS[0] : row.assignedTo)

  const isClaimed = !!claimState
  const isResolved = !!resolveState || row.status === 'resolved'
  const claimedByMe = claimState?.by === CURRENT_AGENT

  function handleResolve() {
    if (!note.trim()) return
    onResolve({ resolutionType, note: note.trim() })
  }

  function handleReassign() {
    onReassign(assignTarget)
  }

  return (
    <>
      <div className="panel-backdrop" onClick={onClose} />
      <div className="resolution-panel">
        <div className="panel-header">
          <div>
            <div className="panel-id">{row.id}</div>
            <div className="panel-title">{row.reason}</div>
          </div>
          <button className="panel-close" onClick={onClose}>✕</button>
        </div>

        {/* Meta */}
        <div className="panel-meta-grid">
          <div className="panel-meta-item">
            <div className="panel-meta-label">Property</div>
            <div className="panel-meta-value">{row.propertyName}</div>
          </div>
          <div className="panel-meta-item">
            <div className="panel-meta-label">Type</div>
            <div className="panel-meta-value">
              <span className="type-chip">{row.type}</span>
            </div>
          </div>
          <div className="panel-meta-item">
            <div className="panel-meta-label">Escalated</div>
            <div className="panel-meta-value">{row.time}</div>
          </div>
          <div className="panel-meta-item">
            <div className="panel-meta-label">Status</div>
            <div className="panel-meta-value">
              <span className={`status-pill ${isResolved ? 'resolved' : isClaimed ? 'claimed' : 'pending'}`}>
                {isResolved ? 'Resolved' : isClaimed ? 'Claimed' : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        <div className="panel-divider" />

        {/* Resolved view */}
        {isResolved && (
          <div className="panel-resolved-view">
            <div className="resolved-header">Escalation resolved</div>
            {resolveState ? (
              <>
                <div className="resolved-field">
                  <span className="resolved-label">Outcome</span>
                  <span className="resolved-value">{resolveState.resolutionType}</span>
                </div>
                <div className="resolved-field">
                  <span className="resolved-label">Note</span>
                  <span className="resolved-value">{resolveState.note}</span>
                </div>
                <div className="resolved-field">
                  <span className="resolved-label">Resolved by</span>
                  <span className="resolved-value">{resolveState.by} · {timeAgo(resolveState.at)}</span>
                </div>
                {claimState && (
                  <div className="resolved-field">
                    <span className="resolved-label">Claimed by</span>
                    <span className="resolved-value">{claimState.by} · {timeAgo(claimState.at)}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="resolved-field">
                <span className="resolved-label">Agent time</span>
                <span className="resolved-value">{row.agentTime ? `${row.agentTime} min` : 'Logged externally'}</span>
              </div>
            )}
          </div>
        )}

        {/* Active workflow */}
        {!isResolved && (
          <>
            {/* Claim section */}
            <div className="panel-section">
              <div className="panel-section-label">Ownership</div>
              {!isClaimed ? (
                <div className="panel-claim-row">
                  <span className="panel-unassigned">Unassigned</span>
                  <button className="btn-primary" onClick={() => onClaim(CURRENT_AGENT)}>
                    Claim this escalation
                  </button>
                </div>
              ) : (
                <div className="panel-claim-row">
                  <div className="agent-badge">
                    <div className="agent-avatar">{claimState.by.split(' ').map(w => w[0]).join('')}</div>
                    <div>
                      <div className="agent-name">{claimState.by}</div>
                      <div className="agent-time">Claimed {timeAgo(claimState.at)}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reassign section */}
            <div className="panel-section">
              <div className="panel-section-label">Assign to</div>
              <div className="panel-reassign-row">
                <select
                  className="rule-select"
                  value={assignTarget}
                  onChange={e => setAssignTarget(e.target.value)}
                  style={{ flex: 1 }}
                >
                  <option value="Unassigned">Unassigned</option>
                  {TARGETS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <button className="btn-secondary" onClick={handleReassign}>
                  Reassign
                </button>
              </div>
            </div>

            {/* Resolution form — only available once claimed */}
            {claimedByMe && (
              <>
                <div className="panel-divider" />
                <div className="panel-section">
                  <div className="panel-section-label">Resolve escalation</div>
                  <div className="panel-form-group">
                    <label className="form-label">Outcome</label>
                    <select
                      className="rule-select full"
                      value={resolutionType}
                      onChange={e => setResolutionType(e.target.value)}
                    >
                      {RESOLUTION_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="panel-form-group">
                    <label className="form-label">Resolution note <span className="form-hint">(required)</span></label>
                    <textarea
                      className="panel-textarea"
                      rows={3}
                      placeholder="Describe what was done to resolve this escalation..."
                      value={note}
                      onChange={e => setNote(e.target.value)}
                    />
                  </div>
                  <button
                    className="btn-primary full-width"
                    onClick={handleResolve}
                    disabled={!note.trim()}
                  >
                    Mark as Resolved
                  </button>
                </div>
              </>
            )}

            {isClaimed && !claimedByMe && (
              <div className="panel-claimed-notice">
                This escalation is owned by {claimState.by}. Only they can resolve it.
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
