import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, ChevronRight, Clock } from 'lucide-react'
import api from '../api/client'

function History({ showToast }) {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const data = await api.getHistory()
      setItems(data.items || [])
    } catch (error) {
      showToast('Failed to load history', 'error')
    } finally {
      setLoading(false)
    }
  }

  const openResult = (item) => {
    navigate(`/results/${item.id}`, { state: { result: item } })
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="premium-skeleton p-6 h-20 sm:h-24"></div>
          ))}
        </div>
      </div>
    )
  }

  const riskText = (level) => {
    const map = {
      CRITICAL: 'text-danger',
      HIGH: 'text-warn',
      MEDIUM: 'text-warn/80',
      LOW: 'text-ok'
    }
    return map[level] || 'text-ok'
  }

  const riskBadge = (level) => {
    const map = {
      CRITICAL: 'premium-status-danger',
      HIGH: 'premium-status-warn',
      MEDIUM: 'premium-status-warn-soft',
      LOW: 'premium-status-safe'
    }
    return map[level] || 'premium-status-safe'
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <span className="premium-eyebrow mb-3">Your evidence trail</span>
        <h1 className="premium-display text-2xl sm:text-3xl mt-3">Analysis History</h1>
        <p className="text-fog text-sm mt-1">Every verdict, kept in one place</p>
      </div>

      {items.length === 0 ? (
        <div className="premium-panel p-12 text-center !rounded-cards">
          <div className="premium-icon-tile w-16 h-16 rounded-icons mx-auto mb-5">
            <Calendar className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-medium text-ice mb-1">No analyses yet</h3>
          <p className="text-fog text-sm">Start by analyzing an opportunity</p>
          <button onClick={() => navigate('/analyze')} className="premium-button-primary mt-6">
            Analyze an opportunity
          </button>
        </div>
      ) : (
        <div className="premium-list !rounded-cards">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => openResult(item)}
              className="premium-list-item w-full text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="premium-icon-tile w-9 h-9 !rounded-icons flex-shrink-0">
                  <Clock className="w-4 h-4" strokeWidth={1.5} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-ice font-medium truncate">{item.company || 'Unknown'}</p>
                  <p className="text-xs text-fog truncate">{item.role || 'No role specified'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`premium-badge rounded-badges ${riskBadge(item.risk_level)}`}>
                  {item.risk_level}
                </span>
                <span className={`text-sm font-semibold ${riskText(item.risk_level)}`}>{item.risk_score}</span>
                <ChevronRight className="w-4 h-4 text-fog group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default History