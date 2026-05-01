import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, Cell,
} from 'recharts'

function getBarColor(rate) {
  if (rate >= 95) return '#10B981'
  if (rate >= 90) return '#34D399'
  if (rate >= 85) return '#F59E0B'
  return '#EF4444'
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <div className="tooltip-label">{label}</div>
        {payload.map((p) => (
          <div key={p.name} className="tooltip-row">
            <span>{p.name === 'successRate' ? 'Success Rate' : 'Calls'}</span>
            <strong style={{ color: p.color }}>
              {p.name === 'successRate' ? `${p.value}%` : p.value?.toLocaleString()}
            </strong>
          </div>
        ))}
      </div>
    )
  }
  return null
}

function StatBadge({ label, value, color }) {
  return (
    <div className="stat-badge" style={{ borderColor: color + '44', background: color + '11' }}>
      <div className="stat-badge-value" style={{ color }}>{value}</div>
      <div className="stat-badge-label">{label}</div>
    </div>
  )
}

export default function PropertyDetail({ property: p, onBack }) {
  const typeChartData = p.callsByType.map((t) => ({
    ...t,
    successRate: parseFloat(((t.success / t.total) * 100).toFixed(1)),
  }))

  const pendingEsc = p.escalations.filter((e) => e.status === 'pending')
  const resolvedEsc = p.escalations.filter((e) => e.status === 'resolved')

  const successColor =
    p.successRate >= 95 ? '#10B981'
    : p.successRate >= 90 ? '#22C55E'
    : p.successRate >= 85 ? '#F59E0B'
    : '#EF4444'

  return (
    <div className="property-detail">
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>Back to Fleet</button>
        <div className="detail-title-row">
          <div>
            <div className="detail-brand">{p.brand}</div>
            <h1 className="detail-name">{p.name}</h1>
            <span className="detail-location">{p.location} · {p.rooms} rooms · {p.tier}</span>
          </div>
          <div className="detail-score" style={{ borderColor: successColor + '66', background: successColor + '0d' }}>
            <div className="score-value" style={{ color: successColor }}>{p.successRate}%</div>
            <div className="score-label">Success Rate</div>
          </div>
        </div>
        <div className="detail-stats-row">
          <StatBadge label="Total Calls" value={p.totalCalls.toLocaleString()} color="#3B82F6" />
          <StatBadge label="Revenue Recovered" value={`$${(p.revenueRecovered / 1000).toFixed(0)}k`} color="#8B5CF6" />
          <StatBadge label="Escalation Rate" value={`${p.escalationRate}%`} color="#EF4444" />
          <StatBadge label="Avg Handle Time" value={`${p.avgHandleTime}s`} color="#F59E0B" />
          <StatBadge label="NPS Score" value={`${p.npsScore} / 5`} color="#10B981" />
        </div>
      </div>

      <div className="charts-row">
        <section className="section chart-card" style={{ flex: '1.2' }}>
          <h2 className="section-title">Success by Request Type</h2>
          <p className="section-desc">This property · Last 30 days</p>
          <div className="chart-wrap" style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="type" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[70, 100]} tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="successRate" radius={[4, 4, 0, 0]}>
                  {typeChartData.map((entry) => (
                    <Cell key={entry.type} fill={getBarColor(entry.successRate)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="type-stats compact">
            {typeChartData.map((t) => (
              <div key={t.type} className="type-stat">
                <div className="type-name">{t.type}</div>
                <div className="type-split">
                  <span className="split-success">{t.success} resolved</span>
                  <span className="split-esc">{t.escalated} escalated</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section chart-card" style={{ flex: '1' }}>
          <h2 className="section-title">4-Week Trend</h2>
          <p className="section-desc">Success rate and call volume</p>
          <div className="chart-wrap" style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={p.trend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="rate" domain={['auto', 'auto']} tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis yAxisId="calls" orientation="right" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} formatter={(val) => val === 'successRate' ? 'Success Rate' : 'Calls'} />
                <Line yAxisId="rate" type="monotone" dataKey="successRate" stroke="#3B82F6" strokeWidth={2.5} dot={{ fill: '#3B82F6', r: 4 }} activeDot={{ r: 6 }} />
                <Line yAxisId="calls" type="monotone" dataKey="calls" stroke="#D1D5DB" strokeWidth={1.5} strokeDasharray="5 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="trend-summary">
            <div className="trend-delta" style={{ color: '#10B981' }}>
              +{(p.trend[3].successRate - p.trend[0].successRate).toFixed(1)}pp
            </div>
            <div className="trend-desc">improvement over 4 weeks</div>
          </div>
        </section>
      </div>

      <section className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Recent Escalations</h2>
            <p className="section-desc">{p.escalations.length} escalations this period</p>
          </div>
          <div className="esc-summary">
            <span className="esc-badge pending">{pendingEsc.length} Pending</span>
            <span className="esc-badge resolved">{resolvedEsc.length} Resolved</span>
          </div>
        </div>
        <div className="esc-table">
          <div className="esc-row header">
            <div>ID</div>
            <div>Type</div>
            <div>Reason</div>
            <div>Time</div>
            <div>Status</div>
            <div>Agent Time</div>
          </div>
          {p.escalations.map((e) => (
            <div key={e.id} className="esc-row">
              <div className="esc-id">{e.id}</div>
              <div className="esc-type"><span className="type-chip">{e.type}</span></div>
              <div className="esc-reason">{e.reason}</div>
              <div className="esc-time">{e.time}</div>
              <div><span className={`status-pill ${e.status}`}>{e.status === 'resolved' ? 'Resolved' : 'Pending'}</span></div>
              <div className="esc-agent-time">{e.agentTime ? `${e.agentTime} min` : '—'}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
