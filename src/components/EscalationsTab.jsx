import { useState } from 'react'
import { INITIAL_RULES } from '../data/rulesData'
import RuleBuilder from './RuleBuilder'
import EscalationQueue from './EscalationQueue'
import PropertyRules from './PropertyRules'

export default function EscalationsTab() {
  const [rules, setRules] = useState(INITIAL_RULES)

  function handleSave(rule) {
    setRules(prev => [rule, ...prev])
  }

  function handleToggle(id) {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r))
  }

  function handleDelete(id) {
    setRules(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="escalations-tab">
      <div className="tab-page-header">
        <h1 className="tab-page-title">Escalation &amp; Workflow Builder</h1>
        <p className="tab-page-desc">Define escalation rules, manage live escalations, and review property-level configurations.</p>
      </div>

      <RuleBuilder onSave={handleSave} />
      <EscalationQueue />
      <PropertyRules rules={rules} onToggle={handleToggle} onDelete={handleDelete} />
    </div>
  )
}
