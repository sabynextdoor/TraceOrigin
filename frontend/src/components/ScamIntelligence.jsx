import React, { useState, useEffect } from 'react'
import { 
  Globe, AlertTriangle, TrendingUp, TrendingDown,
  Shield, Database, Activity, Minus, PieChart
} from 'lucide-react'
import api from '../api/client'

function ScamIntelligence({ showToast }) {
  const [data, setData] = useState({
    loading: true,
    patterns: {},
    total: 0,
    mostCommon: '',
    trend: 'stable',
    topScams: [],
    globalStats: {}
  })

  useEffect(() => {
    loadIntelligence()
  }, [])

  const loadIntelligence = async () => {
    try {
      const [patterns, stats] = await Promise.all([
        api.getScamPatterns(),
        api.getIntelligence()
      ])
      
      setData({
        loading: false,
        patterns: patterns.patterns || {},
        total: patterns.total_analyses || 0,
        mostCommon: patterns.most_common || 'None',
        trend: patterns.trend || 'stable',
        topScams: stats.top_scams || [],
        globalStats: stats
      })
    } catch (error) {
      showToast('Failed to load intelligence data', 'error')
      setData(prev => ({ ...prev, loading: false }))
    }
  }

  if (data.loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="premium-skeleton p-6 h-32 rounded-cards"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="premium-skeleton h-32 rounded-cards"></div>
          <div className="premium-skeleton h-32 rounded-cards"></div>
          <div className="premium-skeleton h-32 rounded-cards"></div>
        </div>
      </div>
    )
  }

  const getTrendIcon = (trend) => {
    if (trend === 'increasing') return <TrendingUp className="w-4 h-4 text-danger" />
    if (trend === 'decreasing') return <TrendingDown className="w-4 h-4 text-ok" />
    return <Minus className="w-4 h-4 text-warn" />
  }

  const getPatternColor = (value) => {
    if (value > 20) return 'premium-progress-fill !bg-danger'
    if (value > 10) return 'premium-progress-fill !bg-warn'
    return 'premium-progress-fill'
  }

  const patternLabels = {
    'payment': '💰 Payment Requests',
    'urgency': '⏰ Urgency Tactics',
    'personal_email': '📧 Personal Email',
    'whatsapp': '💬 WhatsApp/Telegram',
    'no_interview': '❌ No Interview',
    'fake_selection': '🏆 Fake Selection',
    'suspicious_url': '🔗 Suspicious URLs'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="premium-eyebrow mb-3">Global threat map</span>
          <h1 className="premium-display text-2xl sm:text-3xl mt-3">Scam Intelligence Center</h1>
          <p className="text-fog text-sm mt-1">Global scam pattern analysis &amp; real-time insights</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-ok animate-pulse" />
            <span className="text-fog">Live</span>
          </div>
          <button onClick={loadIntelligence} className="premium-button-secondary !min-h-9">
            <Database className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="premium-stat">
          <p className="premium-stat-label">Total Analyses</p>
          <p className="premium-stat-value">{data.total}</p>
          <p className="premium-stat-meta">Global database</p>
        </div>
        <div className="premium-stat">
          <p className="premium-stat-label">Most Common Scam</p>
          <p className="premium-stat-value !text-lg !leading-snug">
            {data.mostCommon || 'None'}
          </p>
          <p className="premium-stat-meta">Based on detection patterns</p>
        </div>
        <div className="premium-stat">
          <p className="premium-stat-label">Trend</p>
          <div className="flex items-center gap-2 mt-1">
            {getTrendIcon(data.trend)}
            <p className={`premium-stat-value ${
              data.trend === 'increasing' ? '!text-danger' :
              data.trend === 'decreasing' ? '!text-ok' :
              '!text-warn'
            }`}>
              {data.trend.charAt(0).toUpperCase() + data.trend.slice(1)}
            </p>
          </div>
          <p className="premium-stat-meta">Last 30 days</p>
        </div>
      </div>

      {/* Pattern Analysis */}
      <div className="premium-panel p-6">
        <h3 className="premium-section-title text-sm mb-5 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" strokeWidth={1.5} />
          Scam Pattern Detection
        </h3>
        <div className="space-y-3">
          {Object.entries(data.patterns).map(([key, value]) => {
            const max = Math.max(...Object.values(data.patterns), 1)
            return (
              <div key={key} className="flex items-center justify-between gap-4">
                <span className="text-sm text-ice flex-shrink-0">{patternLabels[key] || key}</span>
                <div className="flex items-center gap-3 flex-1 justify-end">
                  <div className="premium-progress-track w-32 sm:w-48">
                    <div className={getPatternColor(value)} style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
                  </div>
                  <span className={`text-sm font-medium ${
                    value > 20 ? 'text-danger' : value > 10 ? 'text-warn' : 'text-ok'
                  } min-w-[24px] text-right`}>
                    {value}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top Scams */}
      <div className="premium-panel p-6">
        <h3 className="premium-section-title text-sm mb-5 flex items-center gap-2">
          <Globe className="w-4 h-4" strokeWidth={1.5} />
          Top Scams Worldwide
        </h3>
        <div className="premium-list">
          {data.topScams.map((scam, i) => (
            <div key={i} className="premium-list-item">
              <div className="flex items-center gap-3 min-w-0">
                <span className="premium-icon-tile w-8 h-8 !rounded-icons text-xs">
                  #{i + 1}
                </span>
                <span className="text-sm text-ice truncate">{scam.name}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm font-medium text-warn">{scam.count}</span>
                <span className="text-xs text-fog">reports</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Stats */}
      <div className="premium-panel p-6">
        <h3 className="premium-section-title text-sm mb-5 flex items-center gap-2">
          <Shield className="w-4 h-4" strokeWidth={1.5} />
          Global Protection Stats
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="premium-icon-tile w-11 h-11 mx-auto mb-2">
              <PieChart className="w-5 h-5 text-frost" strokeWidth={1.5} />
            </div>
            <p className="premium-stat-value !text-xl">{data.globalStats.total_analyses || 0}</p>
            <p className="premium-stat-meta">Total Analyses</p>
          </div>
          <div className="text-center">
            <div className="premium-icon-tile w-11 h-11 mx-auto mb-2">
              <Activity className="w-5 h-5 text-ok" strokeWidth={1.5} />
            </div>
            <p className="premium-stat-value !text-xl">{data.globalStats.unique_users || 0}</p>
            <p className="premium-stat-meta">Active Users</p>
          </div>
          <div className="text-center">
            <div className="premium-icon-tile w-11 h-11 mx-auto mb-2">
              <TrendingUp className="w-5 h-5 text-warn" strokeWidth={1.5} />
            </div>
            <p className="premium-stat-value !text-xl">{data.globalStats.detection_rate || 0}%</p>
            <p className="premium-stat-meta">Detection Rate</p>
          </div>
          <div className="text-center">
            <div className="premium-icon-tile w-11 h-11 mx-auto mb-2">
              <Shield className="w-5 h-5 text-accent" strokeWidth={1.5} />
            </div>
            <p className="premium-stat-value !text-xl">24/7</p>
            <p className="premium-stat-meta">Active Monitoring</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScamIntelligence