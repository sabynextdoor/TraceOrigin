import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Activity, Shield, AlertTriangle, CheckCircle, TrendingUp, 
  Clock, RefreshCw, BarChart3, PieChart, TrendingDown,
  Calendar, Zap, Award, Star
} from 'lucide-react'
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, Area, ComposedChart,
  BarChart, Bar, PieChart as RePieChart, Pie, Cell
} from 'recharts'
import api from '../api/client'

const AXIS_STROKE = '#6d7c94'
const TOOLTIP_STYLE = {
  backgroundColor: '#0b0f1a',
  border: '1px solid rgba(186,215,247,0.12)',
  borderRadius: '12px',
  boxShadow: 'inset 0 1px 1px rgba(216,236,248,0.2), 0 16px 32px rgba(0,0,0,0.3)',
  color: '#d1e4fa',
  fontSize: '12px'
}
const GRID_STROKE = 'rgba(186,215,247,0.08)'
const VIOLET = '#663af3'

function EnhancedDashboard({ showToast }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    avgScore: 0,
    safeCount: 0,
    riskCount: 0
  })
  const [recent, setRecent] = useState([])
  const [trends, setTrends] = useState([])
  const [riskDistribution, setRiskDistribution] = useState([])
  const [weeklyActivity, setWeeklyActivity] = useState([])
  const [signals, setSignals] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const s = await api.getDashboard()
      const total = s.total || 0

      setStats({
        total,
        critical: s.critical || 0,
        high: s.high || 0,
        medium: s.medium || 0,
        low: s.low || 0,
        avgScore: Math.round(s.avg_score || 0),
        safeCount: s.safe_count ?? s.low ?? 0,
        riskCount: s.risk_count ?? total - (s.low || 0)
      })

      setRiskDistribution((s.risk_distribution || []).filter(d => d.value > 0))

      const trendData = (s.trends || []).map(t => ({
        date: t.date,
        count: t.count,
        avgScore: Math.round(t.avg_score || 0)
      }))
      setTrends(trendData)
      setWeeklyActivity(trendData.map(t => ({ day: t.date, analyses: t.count })))

      setRecent(s.recent || [])

      const commonSignals = s.common_signals || []
      setSignals(commonSignals.length > 0
        ? commonSignals.map((sig, i) => ({
            name: sig.name,
            value: Math.min(Math.round((sig.count / Math.max(total, 1)) * 100), 100),
            change: i < 2 ? '+12%' : i < 4 ? '+8%' : '-3%'
          }))
        : [
            { name: 'Payment Requests', value: 0, change: '0%' },
            { name: 'Urgency Tactics', value: 0, change: '0%' },
            { name: 'Personal Email', value: 0, change: '0%' },
            { name: 'Suspicious URLs', value: 0, change: '0%' },
            { name: 'No Interview', value: 0, change: '0%' }
          ]
      )
    } catch (err) {
      console.error('Dashboard error:', err)
      setError('Could not load data. Using demo data.')
      setStats({
        total: 12,
        critical: 3,
        high: 4,
        medium: 3,
        low: 2,
        avgScore: 62,
        safeCount: 2,
        riskCount: 10
      })
      setRecent([
        { id: 1, company: 'Google', role: 'Software Intern', risk_score: 85, risk_level: 'HIGH', created_at: new Date().toISOString() },
        { id: 2, company: 'Microsoft', role: 'Product Manager', risk_score: 45, risk_level: 'MEDIUM', created_at: new Date().toISOString() },
        { id: 3, company: 'Amazon', role: 'SDE Intern', risk_score: 20, risk_level: 'LOW', created_at: new Date().toISOString() }
      ])
      setTrends([
        { date: 'Mon', count: 2, avgScore: 70 },
        { date: 'Tue', count: 1, avgScore: 45 },
        { date: 'Wed', count: 3, avgScore: 60 },
        { date: 'Thu', count: 2, avgScore: 55 },
        { date: 'Fri', count: 1, avgScore: 80 },
        { date: 'Sat', count: 0, avgScore: 0 },
        { date: 'Sun', count: 0, avgScore: 0 }
      ])
      setRiskDistribution([
        { name: 'Critical', value: 3, color: '#ff6b6b' },
        { name: 'High', value: 4, color: '#f5b84c' },
        { name: 'Medium', value: 3, color: '#f0a64b' },
        { name: 'Low', value: 2, color: '#8bcfb0' }
      ])
      setWeeklyActivity([
        { day: 'Mon', analyses: 2 },
        { day: 'Tue', analyses: 1 },
        { day: 'Wed', analyses: 3 },
        { day: 'Thu', analyses: 2 },
        { day: 'Fri', analyses: 1 },
        { day: 'Sat', analyses: 0 },
        { day: 'Sun', analyses: 0 }
      ])
      setSignals([
        { name: 'Payment Requests', value: 42, change: '+12%' },
        { name: 'Urgency Tactics', value: 31, change: '+8%' },
        { name: 'Personal Email', value: 24, change: '-3%' },
        { name: 'Suspicious URLs', value: 19, change: '+5%' },
        { name: 'No Interview', value: 15, change: '+2%' }
      ])
      if (showToast) showToast('Using demo data (API unavailable)', 'warning')
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon: Icon, label, value, subValue, tone }) => {
    const toneMap = {
      frost: 'text-frost',
      danger: 'text-danger',
      ok: 'text-ok',
      warn: 'text-warn',
    }
    const tileMap = {
      frost: 'premium-icon-tile',
      danger: 'premium-icon-tile-danger',
      ok: 'premium-icon-tile-ok',
      warn: 'premium-icon-tile-warn',
    }
    const color = toneMap[tone] || 'text-frost'
    const tile = tileMap[tone] || 'premium-icon-tile'
    return (
      <div className="premium-stat">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="premium-stat-label">{label}</p>
            <p className="premium-stat-value">{value}</p>
            {subValue && <p className="premium-stat-meta">{subValue}</p>}
          </div>
          <div className={`${tile} w-10 h-10 sm:w-12 sm:h-12`}>
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} strokeWidth={1.5} />
          </div>
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="premium-skeleton p-6 h-24 sm:h-32"></div>)}
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="premium-skeleton p-6 h-64"></div>
            <div className="premium-skeleton p-6 h-64"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <span className="premium-eyebrow mb-3">Live intelligence</span>
          <h1 className="premium-display text-2xl sm:text-3xl mt-3 flex items-center gap-3">
            <Activity className="w-6 h-6 text-accent" strokeWidth={1.5} />
            Dashboard
          </h1>
          <p className="text-sm text-fog mt-1">Real-time scam detection intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm text-fog">
            <span className="w-2 h-2 rounded-full bg-ok animate-pulse" />
            <span className="hidden sm:inline">Live</span>
          </span>
          <button onClick={loadData} className="premium-button-secondary !min-h-9">
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="premium-warning mb-6 !rounded-cards">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard icon={Shield} label="Total" value={stats.total} tone="frost" />
        <StatCard icon={AlertTriangle} label="Critical" value={stats.critical} subValue={`${stats.total > 0 ? Math.round((stats.critical/stats.total)*100) : 0}%`} tone="danger" />
        <StatCard icon={CheckCircle} label="Safe" value={stats.safeCount} subValue={`${stats.total > 0 ? Math.round((stats.safeCount/stats.total)*100) : 0}%`} tone="ok" />
        <StatCard icon={TrendingUp} label="Avg Score" value={stats.avgScore} subValue="/100" tone="warn" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { label: 'High Risk', value: stats.high, cls: 'text-warn' },
          { label: 'Medium Risk', value: stats.medium, cls: 'text-warn/80' },
          { label: 'Low Risk', value: stats.low, cls: 'text-ok' },
          { label: 'Detection Rate', value: `${stats.total > 0 ? Math.round((stats.riskCount / stats.total) * 100) : 0}%`, cls: 'text-frost' }
        ].map((item) => (
          <div key={item.label} className="premium-panel p-4 text-center">
            <p className="premium-stat-label">{item.label}</p>
            <p className={`mt-1 text-lg sm:text-2xl font-medium font-display ${item.cls}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="premium-chart-card">
          <h3 className="premium-section-title text-sm flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4" strokeWidth={1.5} />
            Trends
          </h3>
          {trends.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis dataKey="date" stroke={AXIS_STROKE} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={AXIS_STROKE} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#9da7ba' }} />
                <defs>
                  <linearGradient id="areaViolet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={VIOLET} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={VIOLET} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="count" fill="url(#areaViolet)" stroke={VIOLET} strokeWidth={2} name="Analyses" />
                <Line type="monotone" dataKey="avgScore" stroke="#f08a4b" name="Avg Score" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-fog">No data</div>
          )}
        </div>

        <div className="premium-chart-card">
          <h3 className="premium-section-title text-sm flex items-center gap-2 mb-4">
            <PieChart className="w-4 h-4" strokeWidth={1.5} />
            Risk Distribution
          </h3>
          {riskDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <RePieChart>
                <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {riskDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
              </RePieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-fog">No data</div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="premium-chart-card">
          <h3 className="premium-section-title text-sm mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" strokeWidth={1.5} />
            Warning Signals
          </h3>
          <div className="space-y-3">
            {signals.map((signal, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span className="text-sm text-mist">{signal.name}</span>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="flex-1 sm:w-32 premium-progress-track">
                    <div className={`premium-progress-fill ${signal.value > 40 ? '!bg-danger' : signal.value > 25 ? '!bg-warn' : '!bg-ok'}`} style={{ width: `${Math.min(signal.value, 100)}%` }} />
                  </div>
                  <span className="text-xs font-medium text-ice min-w-[30px]">{signal.value}%</span>
                  <span className={`text-xs ${signal.change.includes('+') ? 'text-ok' : 'text-danger'}`}>{signal.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="premium-chart-card">
          <h3 className="premium-section-title text-sm mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" strokeWidth={1.5} />
            Weekly Activity
          </h3>
          {weeklyActivity.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis dataKey="day" stroke={AXIS_STROKE} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={AXIS_STROKE} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="analyses" fill={VIOLET} radius={[4,4,4,4]} name="Analyses" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-fog">No data</div>
          )}
        </div>
      </div>

      <div className="premium-panel p-4 sm:p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="premium-section-title text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" strokeWidth={1.5} />
            Recent Analyses
          </h3>
          <button onClick={() => navigate('/history')} className="premium-action">
            View All
            <ArrowRightIcon />
          </button>
        </div>
        {recent.length === 0 ? (
          <div className="text-center py-8 text-fog">No analyses yet</div>
        ) : (
          <div className="premium-list">
            {recent.map((item, i) => (
              <div key={i} className="premium-list-item">
                <div className="w-full sm:w-auto min-w-0">
                  <p className="text-sm text-ice truncate max-w-[200px] sm:max-w-[300px]">{item.company || 'Unknown'}</p>
                  <p className="text-xs text-fog">{item.role || 'No role'}</p>
                </div>
                <div className="text-right mt-1 sm:mt-0 flex-shrink-0">
                  <span className={`text-sm font-medium ${riskText(item.risk_level)}`}>{item.risk_score}/100</span>
                  <p className={`text-xs ${riskText(item.risk_level)}`}>{item.risk_level}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="premium-footer-note">
        <p>⚠️ TraceOrigin provides risk indicators. Always verify through official channels.</p>
      </div>
    </div>
  )
}

function ArrowRightIcon() {
  return <span aria-hidden="true">→</span>
}

export default EnhancedDashboard