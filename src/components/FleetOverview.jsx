import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import KPICard from './KPICard'
import PropertyTile from './PropertyTile'
import {
  PROPERTIES,
  getFleetKPIs,
  getFleetRequestTypeBreakdown,
  getFleetFunnelData,
} from '../data/mockData'

const kpis = getFleetKPIs()
const requestTypes = getFleetRequestTypeBreakdown()
const funnelData = getFleetFunnelData()

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
        <div className="tooltip-row">
          <span>Success Rate</span>
          <strong>{payload[0].value}%</strong>
        </div>
      </div>
    )
  }
  return null
}

export default function FleetOverview({ onSelectProperty }) {
  return (
    <div className="fleet-overview">

      <section className="section">
        <div className="kpi-grid">
          <KPICard label="Fleet Success Rate" value={`${kpis.successRate}%`} sub="Weighted avg · 8 properties" trend={2.1} color="green" />
          <KPICard label="Total AI Calls" value={kpis.totalCalls.toLocaleString()} sub="Last 30 days" trend={8.4} color="blue" />
          <KPICard label="Revenue Recovered" value={`$${(kpis.revenueRecovered / 1000).toFixed(0)}k`} sub="Retained via AI resolution" trend={12.7} color="purple" />
          <KPICard label="Escalation Rate" value={`${kpis.escalationRate}%`} sub="Requests requiring human agent" trend={-1.4} color="red" />
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Property Performance</h2>
            <p className="section-desc">Click any property to view detailed metrics</p>
          </div>
          <div className="legend">
            <span className="legend-item green">95%+ Excellent</span>
            <span className="legend-item yellow">85–94% Good</span>
            <span className="legend-item red">Below 85%</span>
          </div>
        </div>
        <div className="property-grid">
          {PROPERTIES.map((p) => (
            <PropertyTile key={p.id} property={p} onClick={onSelectProperty} />
          ))}
        </div>
      </section>

      <div className="charts-row">
        <section className="section chart-card wide">
          <h2 className="section-title">Success Rate by Request Type</h2>
          <p className="section-desc">Aggregated across all 8 properties · Last 30 days</p>
          <div className="chart-wrap" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={requestTypes} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="type" tick={{ fill: '#6B7280', fontSize: 13 }} axisLine={false} tickLine={false} />
                <YAxis domain={[75, 100]} tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="successRate" radius={[4, 4, 0, 0]}>
                  {requestTypes.map((entry) => (
                    <Cell key={entry.type} fill={getBarColor(entry.successRate)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="type-stats">
            {requestTypes.map((t) => (
              <div key={t.type} className="type-stat">
                <div className="type-name">{t.type}</div>
                <div className="type-total">{t.total.toLocaleString()} calls</div>
                <div className="type-rate" style={{ color: getBarColor(t.successRate) }}>{t.successRate}%</div>
              </div>
            ))}
          </div>
        </section>

        <section className="section chart-card narrow">
          <h2 className="section-title">Escalation Funnel</h2>
          <p className="section-desc">Fleet-wide · Last 30 days</p>
          <div className="funnel">
            {funnelData.map((step) => (
              <div key={step.label} className="funnel-step">
                <div className="funnel-meta">
                  <span className="funnel-label">{step.label}</span>
                  <div className="funnel-numbers">
                    <span className="funnel-count" style={{ color: step.color }}>
                      {step.value.toLocaleString()}
                    </span>
                    <span className="funnel-pct-badge" style={{ background: step.color + '18', color: step.color }}>
                      {step.pct}%
                    </span>
                  </div>
                </div>
                <div className="funnel-bar-bg">
                  <div
                    className="funnel-bar-fill"
                    style={{ width: `${step.pct}%`, background: step.color, minWidth: step.pct < 10 ? '6px' : undefined }}
                  />
                </div>
              </div>
            ))}
            <div className="funnel-insight">
              <strong>{funnelData[3].pct}%</strong> of all requests resolved autonomously by Lance AI — no human needed.
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
