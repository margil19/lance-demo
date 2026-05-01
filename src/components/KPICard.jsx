export default function KPICard({ label, value, sub, trend, color = 'blue' }) {
  const colorMap = {
    blue:   { accent: '#3B82F6', trendUp: '#ECFDF5', trendUpText: '#065F46', trendDown: '#FEF2F2', trendDownText: '#991B1B' },
    green:  { accent: '#10B981', trendUp: '#ECFDF5', trendUpText: '#065F46', trendDown: '#FEF2F2', trendDownText: '#991B1B' },
    red:    { accent: '#EF4444', trendUp: '#ECFDF5', trendUpText: '#065F46', trendDown: '#FEF2F2', trendDownText: '#991B1B' },
    purple: { accent: '#8B5CF6', trendUp: '#ECFDF5', trendUpText: '#065F46', trendDown: '#FEF2F2', trendDownText: '#991B1B' },
  }
  const c = colorMap[color]

  return (
    <div className="kpi-card">
      <div className="kpi-top">
        <div className="kpi-accent-bar" style={{ background: c.accent }} />
        {trend !== undefined && (
          <div
            className="kpi-trend"
            style={{
              background: trend >= 0 ? c.trendUp : c.trendDown,
              color: trend >= 0 ? c.trendUpText : c.trendDownText,
            }}
          >
            {trend >= 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  )
}
