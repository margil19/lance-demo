import { useState, useRef } from 'react'
import {
  CONDITION_FIELDS, REQUEST_TYPES, GUEST_TYPES, TARGETS, TEMPLATES, PROPERTIES,
} from '../data/rulesData'

function makeCondId() {
  return 'cond-' + Math.random().toString(36).slice(2, 9)
}

function emptyCondition() {
  return { id: makeCondId(), field: 'requestType', operator: '=', value: REQUEST_TYPES[0] }
}

function getValueOptions(field) {
  if (field === 'requestType') return REQUEST_TYPES
  if (field === 'guestType') return GUEST_TYPES
  return null
}

function ConditionRow({ cond, index, total, onChange, onRemove, onDragStart, onDragOver, onDrop, isDragging }) {
  const fieldDef = CONDITION_FIELDS.find(f => f.value === cond.field)
  const valueOptions = getValueOptions(cond.field)

  return (
    <div
      className={`condition-row ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
    >
      <div className="drag-handle" title="Drag to reorder">⠿</div>

      {index > 0 && <div className="condition-connector">AND</div>}

      <select
        className="rule-select"
        value={cond.field}
        onChange={(e) => onChange(index, 'field', e.target.value)}
      >
        {CONDITION_FIELDS.map(f => (
          <option key={f.value} value={f.value}>{f.label}</option>
        ))}
      </select>

      <select
        className="rule-select small"
        value={cond.operator}
        onChange={(e) => onChange(index, 'operator', e.target.value)}
      >
        {fieldDef.operators.map(op => (
          <option key={op} value={op}>{op}</option>
        ))}
      </select>

      {valueOptions ? (
        <select
          className="rule-select"
          value={cond.value}
          onChange={(e) => onChange(index, 'value', e.target.value)}
        >
          {valueOptions.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      ) : (
        <input
          className="rule-input small"
          type="number"
          min="0"
          value={cond.value}
          onChange={(e) => onChange(index, 'value', e.target.value)}
          placeholder="min"
        />
      )}

      {total > 1 && (
        <button className="cond-remove" onClick={() => onRemove(index)}>Remove</button>
      )}
    </div>
  )
}

export default function RuleBuilder({ onSave }) {
  const [name, setName] = useState('')
  const [propertyId, setPropertyId] = useState('all')
  const [conditions, setConditions] = useState([emptyCondition()])
  const [action, setAction] = useState(TARGETS[0])
  const [templateMsg, setTemplateMsg] = useState('')
  const dragIndex = useRef(null)

  function handleCondChange(index, key, value) {
    setConditions(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [key]: value }
      if (key === 'field') {
        const opts = getValueOptions(value)
        next[index].operator = CONDITION_FIELDS.find(f => f.value === value).operators[0]
        next[index].value = opts ? opts[0] : '1'
      }
      return next
    })
  }

  function handleCondRemove(index) {
    setConditions(prev => prev.filter((_, i) => i !== index))
  }

  function handleAddCondition() {
    setConditions(prev => [...prev, emptyCondition()])
  }

  function handleDragStart(e, index) {
    dragIndex.current = index
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e, index) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function handleDrop(e, dropIndex) {
    e.preventDefault()
    const from = dragIndex.current
    if (from === null || from === dropIndex) return
    setConditions(prev => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(dropIndex, 0, moved)
      return next
    })
    dragIndex.current = null
  }

  function handleLoadTemplate(tpl) {
    setName(tpl.name)
    setConditions(tpl.conditions.map(c => ({ ...c, id: makeCondId() })))
    setAction(tpl.action.target)
    setTemplateMsg(`Loaded: ${tpl.name}`)
    setTimeout(() => setTemplateMsg(''), 2500)
  }

  function handleSave() {
    if (!name.trim()) return
    onSave({
      id: 'rule-' + Math.random().toString(36).slice(2, 9),
      propertyId,
      name: name.trim(),
      enabled: true,
      conditions,
      action: { target: action },
    })
    setName('')
    setPropertyId('all')
    setConditions([emptyCondition()])
    setAction(TARGETS[0])
  }

  function handleReset() {
    setName('')
    setPropertyId('all')
    setConditions([emptyCondition()])
    setAction(TARGETS[0])
    setTemplateMsg('')
  }

  return (
    <div className="rule-builder">
      <div className="builder-top">
        <div className="builder-header">
          <h3 className="builder-title">Rule Builder</h3>
          <p className="builder-desc">Define when Lance should escalate to a human agent</p>
        </div>

        {/* Templates */}
        <div className="templates-panel">
          <div className="templates-label">Load template</div>
          <div className="templates-grid">
            {TEMPLATES.map(tpl => (
              <button key={tpl.id} className="template-btn" onClick={() => handleLoadTemplate(tpl)}>
                <div className="tpl-name">{tpl.name}</div>
                <div className="tpl-desc">{tpl.description}</div>
              </button>
            ))}
          </div>
          {templateMsg && <div className="template-loaded">{templateMsg}</div>}
        </div>
      </div>

      <div className="builder-form">
        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Rule Name</label>
            <input
              className="rule-input full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. VIP Escalation Rule"
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Apply to Property</label>
            <select
              className="rule-select full"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
            >
              <option value="all">All Properties</option>
              {PROPERTIES.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Conditions <span className="form-hint">(drag to reorder)</span></label>
          <div className="conditions-list">
            {conditions.map((cond, i) => (
              <ConditionRow
                key={cond.id}
                cond={cond}
                index={i}
                total={conditions.length}
                onChange={handleCondChange}
                onRemove={handleCondRemove}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            ))}
          </div>
          <button className="add-condition-btn" onClick={handleAddCondition}>
            + Add condition
          </button>
        </div>

        <div className="form-group">
          <label className="form-label">Action: Escalate to</label>
          <select
            className="rule-select"
            value={action}
            onChange={(e) => setAction(e.target.value)}
          >
            {TARGETS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="form-rule-preview">
          <span className="preview-label">Rule preview: </span>
          <span className="preview-text">
            If{' '}
            {conditions.map((c, i) => {
              const fieldDef = CONDITION_FIELDS.find(f => f.value === c.field)
              const unit = c.field === 'duration' ? ' min' : c.field === 'unresolvedCount' ? ' requests' : ''
              return (
                <span key={c.id}>
                  {i > 0 && <strong> AND </strong>}
                  <em>{fieldDef?.label} {c.operator} {c.value}{unit}</em>
                </span>
              )
            })}
            {' '}&rarr; Escalate to <strong>{action}</strong>
          </span>
        </div>

        <div className="form-actions">
          <button className="btn-secondary" onClick={handleReset}>Reset</button>
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={!name.trim()}
          >
            Save Rule
          </button>
        </div>
      </div>
    </div>
  )
}
