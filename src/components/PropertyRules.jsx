import { useState } from 'react'
import { PROPERTIES, CONDITION_FIELDS } from '../data/rulesData'
import RuleHealthCard from './RuleHealthCard'

function rulePreview(rule) {
  return rule.conditions.map((c, i) => {
    const fieldDef = CONDITION_FIELDS.find(f => f.value === c.field)
    const unit = c.field === 'duration' ? ' min' : c.field === 'unresolvedCount' ? ' requests' : ''
    return (i > 0 ? ' AND ' : '') + `${fieldDef?.label} ${c.operator} ${c.value}${unit}`
  }).join('')
}

export default function PropertyRules({ rules, onToggle, onDelete }) {
  const [selectedPropertyId, setSelectedPropertyId] = useState('all')
  const [expandedId, setExpandedId] = useState(null)

  const filtered = selectedPropertyId === 'all'
    ? rules
    : rules.filter(r => r.propertyId === selectedPropertyId || r.propertyId === 'all')

  const propName = (id) => {
    if (id === 'all') return 'All Properties'
    return PROPERTIES.find(p => p.id === id)?.name || id
  }

  return (
    <div className="section">
      <div className="section-header">
        <div>
          <h2 className="section-title">Property Rule Summary</h2>
          <p className="section-desc">View performance and manage active escalation rules</p>
        </div>
        <select
          className="rule-select"
          value={selectedPropertyId}
          onChange={e => setSelectedPropertyId(e.target.value)}
        >
          <option value="all">All Properties</option>
          {PROPERTIES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="queue-empty">No rules for this property yet. Create one above.</div>
      ) : (
        <div className="rules-list">
          {filtered.map(rule => {
            const isExpanded = expandedId === rule.id
            return (
              <div key={rule.id} className={`rule-row ${rule.enabled ? '' : 'rule-disabled'}`}>
                <div className="rule-row-main">
                  <div className="rule-row-info">
                    <div className="rule-row-name">{rule.name}</div>
                    <div className="rule-row-scope">{propName(rule.propertyId)}</div>
                    <div className="rule-row-preview">
                      If {rulePreview(rule)} → Escalate to <strong>{rule.action.target}</strong>
                    </div>
                  </div>
                  <div className="rule-row-actions">
                    <button
                      className="btn-ghost"
                      onClick={() => setExpandedId(isExpanded ? null : rule.id)}
                    >
                      {isExpanded ? 'Hide stats' : 'View stats'}
                    </button>
                    <button
                      className={`toggle-btn ${rule.enabled ? 'on' : 'off'}`}
                      onClick={() => onToggle(rule.id)}
                    >
                      {rule.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                    <button className="btn-ghost danger" onClick={() => onDelete(rule.id)}>
                      Delete
                    </button>
                  </div>
                </div>

                {isExpanded && <RuleHealthCard rule={rule} />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
