import { PROPERTIES } from './mockData'

export const REQUEST_TYPES = ['Reservations', 'Restaurant', 'Maintenance', 'Concierge', 'Billing']
export const GUEST_TYPES = ['VIP', 'Standard', 'Group', 'Corporate']
export const TARGETS = ['Manager', 'Facilities Lead', 'Sales Team', 'Front Desk Supervisor', 'General Manager']
export const CONDITION_FIELDS = [
  { value: 'requestType',     label: 'Request Type',    operators: ['=', '!='], valueType: 'requestType' },
  { value: 'guestType',       label: 'Guest Type',      operators: ['=', '!='], valueType: 'guestType' },
  { value: 'duration',        label: 'Unresolved (min)', operators: ['>', '>=', '<'], valueType: 'number' },
  { value: 'unresolvedCount', label: 'Unresolved Count', operators: ['>', '>='], valueType: 'number' },
]

export const TEMPLATES = [
  {
    id: 'tpl-1',
    name: 'VIP Guest Fast Escalation',
    description: 'VIP guest unresolved over 1 min → Call Manager',
    conditions: [
      { id: 'c1', field: 'guestType', operator: '=', value: 'VIP' },
      { id: 'c2', field: 'duration', operator: '>', value: '1' },
    ],
    action: { target: 'Manager' },
  },
  {
    id: 'tpl-2',
    name: 'Maintenance Backlog',
    description: '5+ unresolved maintenance requests → Facilities Lead',
    conditions: [
      { id: 'c1', field: 'requestType', operator: '=', value: 'Maintenance' },
      { id: 'c2', field: 'unresolvedCount', operator: '>=', value: '5' },
    ],
    action: { target: 'Facilities Lead' },
  },
  {
    id: 'tpl-3',
    name: 'Revenue Request Timeout',
    description: 'Restaurant or Reservations unresolved >3 min → Sales Team',
    conditions: [
      { id: 'c1', field: 'requestType', operator: '=', value: 'Restaurant' },
      { id: 'c2', field: 'duration', operator: '>', value: '3' },
    ],
    action: { target: 'Sales Team' },
  },
  {
    id: 'tpl-4',
    name: 'Billing Dispute Escalation',
    description: 'Billing request unresolved >2 min → Front Desk Supervisor',
    conditions: [
      { id: 'c1', field: 'requestType', operator: '=', value: 'Billing' },
      { id: 'c2', field: 'duration', operator: '>', value: '2' },
    ],
    action: { target: 'Front Desk Supervisor' },
  },
]

function makeId() {
  return 'rule-' + Math.random().toString(36).slice(2, 9)
}

function makeCondId() {
  return 'cond-' + Math.random().toString(36).slice(2, 9)
}

export const INITIAL_RULES = [
  {
    id: makeId(),
    propertyId: 'marriott-sfo',
    name: 'Maintenance after 2 min',
    enabled: true,
    conditions: [
      { id: makeCondId(), field: 'requestType', operator: '=', value: 'Maintenance' },
      { id: makeCondId(), field: 'duration', operator: '>', value: '2' },
    ],
    action: { target: 'Manager' },
  },
  {
    id: makeId(),
    propertyId: 'fourseasons-miami',
    name: 'VIP instant escalation',
    enabled: true,
    conditions: [
      { id: makeCondId(), field: 'guestType', operator: '=', value: 'VIP' },
      { id: makeCondId(), field: 'duration', operator: '>', value: '1' },
    ],
    action: { target: 'General Manager' },
  },
  {
    id: makeId(),
    propertyId: 'sheraton-boston',
    name: 'Billing dispute fast-track',
    enabled: false,
    conditions: [
      { id: makeCondId(), field: 'requestType', operator: '=', value: 'Billing' },
      { id: makeCondId(), field: 'duration', operator: '>=', value: '3' },
    ],
    action: { target: 'Front Desk Supervisor' },
  },
]

export function buildLiveQueue() {
  const rows = []
  PROPERTIES.forEach((prop) => {
    prop.escalations.forEach((esc) => {
      rows.push({
        id: esc.id,
        propertyId: prop.id,
        propertyName: prop.name,
        type: esc.type,
        reason: esc.reason,
        time: esc.time,
        status: esc.status,
        assignedTo: esc.status === 'resolved' ? 'Manager' : 'Unassigned',
        agentTime: esc.agentTime,
      })
    })
  })
  return rows
}

// ── Rule Performance Simulation ──────────────────────────────────────────────

// Deterministic pseudo-random from a string seed (simple hash)
function seededRand(seed) {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0
  }
  return Math.abs(h) / 2147483647
}

// Assign a deterministic guestType to an escalation based on its id
function getGuestType(escId) {
  const r = seededRand(escId + 'guest')
  if (r < 0.22) return 'VIP'
  if (r < 0.65) return 'Standard'
  if (r < 0.85) return 'Group'
  return 'Corporate'
}

// Simulate duration: resolved → agentTime, pending → hash-based 4–18 min
function getDuration(esc) {
  if (esc.agentTime != null) return esc.agentTime
  return 4 + Math.round(seededRand(esc.id + 'dur') * 14)
}

// Count pending escalations of a given type for a given property
function getUnresolvedCount(propId, type) {
  const prop = PROPERTIES.find(p => p.id === propId)
  if (!prop) return 0
  return prop.escalations.filter(e => e.type === type && e.status === 'pending').length
}

function applyOperator(actual, operator, threshold) {
  const t = parseFloat(threshold)
  switch (operator) {
    case '=':  return actual === threshold
    case '!=': return actual !== threshold
    case '>':  return actual > t
    case '>=': return actual >= t
    case '<':  return actual < t
    default:   return false
  }
}

// Check whether a single enriched escalation matches all conditions of a rule
function matchesAllConditions(conditions, esc) {
  return conditions.every(cond => {
    switch (cond.field) {
      case 'requestType':
        return applyOperator(esc.type, cond.operator, cond.value)
      case 'guestType':
        return applyOperator(esc.guestType, cond.operator, cond.value)
      case 'duration':
        return applyOperator(esc.duration, cond.operator, cond.value)
      case 'unresolvedCount':
        return applyOperator(esc.unresolvedCount, cond.operator, cond.value)
      default:
        return false
    }
  })
}

// Build a flat list of all escalations enriched with simulated fields
function getAllEnrichedEscalations() {
  const rows = []
  PROPERTIES.forEach(prop => {
    prop.escalations.forEach(esc => {
      rows.push({
        id: esc.id,
        propertyId: prop.id,
        type: esc.type,
        status: esc.status,
        agentTime: esc.agentTime,
        guestType: getGuestType(esc.id),
        duration: getDuration(esc),
        unresolvedCount: getUnresolvedCount(prop.id, esc.type),
      })
    })
  })
  return rows
}

// Generate realistic 8-week sparkline that ends at `total` fires
function buildWeeklySparkline(total, ruleId) {
  const weeks = 8
  const base = Math.max(1, Math.round(total / weeks))
  return Array.from({ length: weeks }, (_, i) => {
    const noise = seededRand(ruleId + i) * base * 0.6
    const trend = base * (0.7 + (i / weeks) * 0.6)
    return Math.max(0, Math.round(trend + noise - base * 0.3))
  })
}

// Generate a threshold improvement suggestion for the first numeric condition
function buildSuggestion(rule, relevant) {
  const numericCond = rule.conditions.find(c =>
    (c.field === 'duration' || c.field === 'unresolvedCount') &&
    (c.operator === '>' || c.operator === '>=')
  )
  if (!numericCond) return null

  const threshold = parseFloat(numericCond.value)
  const lower = Math.max(0.5, threshold - (numericCond.field === 'duration' ? 0.5 : 1))

  const currentMatched = relevant.filter(e =>
    applyOperator(
      numericCond.field === 'duration' ? e.duration : e.unresolvedCount,
      numericCond.operator,
      numericCond.value
    )
  ).length

  const lowerMatched = relevant.filter(e =>
    applyOperator(
      numericCond.field === 'duration' ? e.duration : e.unresolvedCount,
      numericCond.operator,
      String(lower)
    )
  ).length

  if (relevant.length === 0) return null
  const currentRate = Math.round((currentMatched / relevant.length) * 100)
  const lowerRate  = Math.round((lowerMatched  / relevant.length) * 100)
  if (lowerRate <= currentRate) return null

  const fieldLabel = numericCond.field === 'duration' ? 'min' : 'requests'
  return `Lowering threshold to ${lower} ${fieldLabel} would increase catch rate from ${currentRate}% → ${lowerRate}%`
}

export function simulateRulePerformance(rule) {
  const all = getAllEnrichedEscalations()
  const relevant = rule.propertyId === 'all'
    ? all
    : all.filter(e => e.propertyId === rule.propertyId)

  const matched   = relevant.filter(e => matchesAllConditions(rule.conditions, e))
  const unmatched = relevant.filter(e => !matchesAllConditions(rule.conditions, e))

  const avgTime = (arr) => {
    const withTime = arr.filter(e => e.agentTime != null)
    if (!withTime.length) return null
    return Math.round(withTime.reduce((s, e) => s + e.agentTime, 0) / withTime.length)
  }

  const firesLast30 = matched.length
  // Simulate 7-day subset as ~25% of 30-day total, capped at 30-day count
  const firesLast7 = Math.min(firesLast30, Math.round(firesLast30 * 0.25 + seededRand(rule.id + '7d') * 2))
  const catchRate = relevant.length > 0
    ? Math.round((matched.length / relevant.length) * 100)
    : 0

  return {
    firesLast7,
    firesLast30,
    catchRate,
    avgMatchedTime:   avgTime(matched),
    avgUnmatchedTime: avgTime(unmatched),
    weeklySparkline:  buildWeeklySparkline(firesLast30, rule.id),
    suggestion:       buildSuggestion(rule, relevant),
  }
}

export { PROPERTIES }
