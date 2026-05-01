import { useState } from 'react'
import FleetOverview from './components/FleetOverview'
import PropertyDetail from './components/PropertyDetail'
import EscalationsTab from './components/EscalationsTab'

export default function App() {
  const [activeTab, setActiveTab] = useState('analytics')
  const [selectedProperty, setSelectedProperty] = useState(null)

  function handleSelectProperty(property) {
    setSelectedProperty(property)
  }

  function handleBack() {
    setSelectedProperty(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="brand-name">Lance</span>
          </div>
          <nav className="tab-nav">
            <button
              className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => { setActiveTab('analytics'); setSelectedProperty(null) }}
            >
              Analytics
            </button>
            <button
              className={`tab-btn ${activeTab === 'escalations' ? 'active' : ''}`}
              onClick={() => { setActiveTab('escalations'); setSelectedProperty(null) }}
            >
              Escalations
            </button>
          </nav>
          <div className="header-meta">
            <span className="header-period">Last 30 days · 8 properties</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        {activeTab === 'analytics' && (
          selectedProperty
            ? <PropertyDetail property={selectedProperty} onBack={handleBack} />
            : <FleetOverview onSelectProperty={handleSelectProperty} />
        )}
        {activeTab === 'escalations' && <EscalationsTab />}
      </main>
    </div>
  )
}
