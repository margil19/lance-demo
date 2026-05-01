function getSuccessColor(rate) {
  if (rate >= 95) return { bg: '#F0FDF4', border: '#BBF7D0', text: '#065F46', bar: '#10B981' }
  if (rate >= 90) return { bg: '#F0FDF4', border: '#BBF7D0', text: '#166534', bar: '#22C55E' }
  if (rate >= 85) return { bg: '#FEFCE8', border: '#FDE68A', text: '#92400E', bar: '#F59E0B' }
  return { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B', bar: '#EF4444' }
}

export default function PropertyTile({ property, onClick }) {
  const c = getSuccessColor(property.successRate)

  return (
    <div
      className="property-tile"
      style={{ background: c.bg, borderColor: c.border }}
      onClick={() => onClick(property)}
    >
      <div className="tile-top">
        <div className="tile-brand">{property.brand}</div>
        <div className="tile-rate" style={{ color: c.text }}>{property.successRate}%</div>
      </div>

      <div className="tile-name">{property.name}</div>
      <div className="tile-location">{property.location}</div>

      <div className="tile-bar-wrap">
        <div className="tile-bar-bg">
          <div className="tile-bar-fill" style={{ width: `${property.successRate}%`, background: c.bar }} />
        </div>
      </div>

      <div className="tile-stats">
        <div className="tile-stat">
          <span className="tile-stat-value">{(property.totalCalls / 1000).toFixed(1)}k</span>
          <span className="tile-stat-label">Calls</span>
        </div>
        <div className="tile-stat">
          <span className="tile-stat-value" style={{ color: '#EF4444' }}>{property.escalationRate}%</span>
          <span className="tile-stat-label">Escalated</span>
        </div>
        <div className="tile-stat">
          <span className="tile-stat-value">${(property.revenueRecovered / 1000).toFixed(0)}k</span>
          <span className="tile-stat-label">Recovered</span>
        </div>
      </div>

      <div className="tile-drill">View details</div>
    </div>
  )
}
