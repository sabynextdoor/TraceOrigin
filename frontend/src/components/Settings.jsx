import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Bell, Mail, BellRing, Shield, Calendar, Zap, Save
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Settings({ showToast }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    analysisComplete: true,
    scamAlerts: true,
    weeklyDigest: false,
    securityAlerts: true
  })

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
    const label = key.replace(/([A-Z])/g, ' $1').trim()
    showToast(`${label} ${!notifications[key] ? 'enabled' : 'disabled'}`, 'success')
  }

  const handleSave = () => {
    showToast('Notification settings saved.', 'success')
  }

  const Switch = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`premium-switch ${enabled ? 'premium-switch-active' : ''}`}
      role="switch"
      aria-checked={enabled}
      aria-label="Toggle notification"
    >
      <div className={`w-5 h-5 rounded-full bg-white shadow-subtle transition-all duration-300 ${enabled ? 'ml-6' : 'ml-1'}`} />
    </button>
  )

  const LoginPrompt = ({ icon: Icon, message }) => (
    <div className="container-responsive py-8">
      <div className="premium-panel p-12 text-center !rounded-cards">
        <div className="premium-icon-tile w-16 h-16 rounded-icons mx-auto mb-5">
          <Icon className="w-8 h-8" strokeWidth={1.5} />
        </div>
        <p className="text-fog">{message}</p>
        <button onClick={() => navigate('/login')} className="premium-button-primary mt-6">
          Sign In
        </button>
      </div>
    </div>
  )

  if (!user) {
    return <LoginPrompt icon={Bell} message="Please login to access settings" />
  }

  return (
    <div className="container-responsive py-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/profile')} className="premium-button-icon !rounded-icons" aria-label="Back to profile">
          <ArrowLeft className="w-5 h-5 text-fog" />
        </button>
        <div>
          <span className="premium-eyebrow mb-2">Preferences</span>
          <h1 className="premium-display text-2xl sm:text-3xl mt-2">Notifications</h1>
          <p className="text-sm text-fog mt-1">Manage your preferences</p>
        </div>
      </div>

      <div className="premium-panel p-4 sm:p-8">
        <div className="space-y-6">
          <p className="text-sm text-fog">Choose which notifications you want to receive</p>
          <div className="premium-list !rounded-badges">
            {[
              { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive via email', icon: Mail },
              { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push', icon: BellRing },
              { key: 'analysisComplete', label: 'Analysis Complete', desc: 'When analysis finishes', icon: Zap },
              { key: 'scamAlerts', label: 'Scam Alerts', desc: 'New scam patterns', icon: Shield },
              { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly summary', icon: Calendar },
              { key: 'securityAlerts', label: 'Security Alerts', desc: 'Important security updates', icon: Shield }
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.key} className="premium-list-item">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="premium-icon-tile w-9 h-9 !rounded-icons flex-shrink-0">
                      <Icon className="w-4 h-4" strokeWidth={1.5} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm text-ice">{item.label}</p>
                      <p className="text-xs text-fog">{item.desc}</p>
                    </div>
                  </div>
                  <Switch enabled={notifications[item.key]} onChange={() => toggleNotification(item.key)} />
                </div>
              )
            })}
          </div>
          <button onClick={handleSave} className="premium-button-primary w-full sm:w-auto">
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>

      <div className="mt-6">
        <button onClick={() => navigate('/profile')} className="premium-button-secondary w-full !min-h-11">
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </button>
      </div>
    </div>
  )
}

export default Settings