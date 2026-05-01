import { simulateRulePerformance } from '../data/rulesData'

function Sparkline({ data, color = '#3B82F6' }) {
  if (!data || data.length < 2) return null
  const max = Math.max(...data, 1)
  const W = 120
  const H = 36
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W
    const y = H - (v / max) * (H - 4) - 2
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  // Area fill path
  const first = `0,${H}`
  const last = `${W},${H}`
  const area = `${first} ${pts} ${last}`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ display: 'block' }}>
      <polygon points={area} fill={color} fillOpacity="0.1" />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last point dot */}
      {(() => {
        const last = data[data.length - 1]
        const x = W
        const y = H - (last / max) * (H - 4) - 2
        return <circle cx={x} cy={y} r="3" fill={color} />
      })()}
    </svg>
  )
}

function StatPill({ label, value, color }) {
  return (
    <div className="health-stat">
      <div className="health-stat-value" style={{ color }}>{value}</div>
      <div className="health-stat-label">{label}</div>
    </div>
  )
}

export default function RuleHealthCard({ rule }) {
  const perf = simulateRulePerformance(rule)

  const trendDir = (() => {
    const w = perf.weeklySparkline
    const recent = w.slice(-3).reduce((a, b) => a + b, 0)
    const prior  = w.slice(-6, -3).reduce((a, b) => a + b, 0)
    if (recent > prior * 1.1) return 'up'
    if (recent < prior * 0.9) return 'down'
    return 'flat'
  })()

  const trendColor = trendDir === 'up' ? '#10B981' : trendDir === 'down' ? '#EF4444' : '#6B7280'
  const trendLabel = trendDir === 'up' ? 'Trending up' : trendDir === 'down' ? 'Trending down' : 'Stable'

  const catchColor = perf.catchRate >= 70 ? '#10B981' : perf.catchRate >= 40 ? '#F59E0B' : '#EF4444'

  return (
    <div className={`health-card ${rule.enabled ? '' : 'health-card-dim'}`}>
      <div className="health-card-top">
        <div className="health-stats-row">
          <StatPill
            label="Fires / 7d"
            value={perf.firesLast7}
            color="#3B82F6"
          />
          <StatPill
            label="Fires / 30d"
            value={perf.firesLast30}
            color="#3B82F6"
          />
          <StatPill
            label="Catch Rate"
            value={`${perf.catchRate}%`}
            color={catchColor}
          />
          {perf.avgMatchedTime != null && (
            <StatPill
              label="Avg Resolve (caught)"
              value={`${perf.avgMatchedTime}m`}
              color="#8B5CF6"
            />
          )}
          {perf.avgUnmatchedTime != null && (
            <StatPill
              label="Avg Resolve (missed)"
              value={`${perf.avgUnmatchedTime}m`}
              color="#9CA3AF"
            />
          )}
        </div>

        <div className="health-sparkline-wrap">
          <div className="health-sparkline-label" style={{ color: trendColor }}>
            {trendLabel}
          </div>
          <Sparkline data={perf.weeklySparkline} color="#3B82F6" />
          <div className="health-sparkline-sub">8-week fire history</div>
        </div>
      </div>

      {perf.suggestion && (
        <div className="health-suggestion">
          <span className="health-suggestion-tag">Suggestion</span>
          {perf.suggestion}
        </div>
      )}
    </div>
  )
}
