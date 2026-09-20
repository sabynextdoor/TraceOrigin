import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  User, Mail, Shield, Edit2, Save, X, CheckCircle,
  Bell, LogOut, ChevronRight, Activity
} from 'lucide-react'

function Profile({ showToast }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.full_name || '',
        email: user.email || '',
        username: user.username || ''
      })
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [user])

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

  if (!user && !isLoading) {
    return <LoginPrompt icon={User} message="Please login to view your profile" />
  }

  if (isLoading || !user) {
    return (
      <div className="container-responsive py-8">
        <div className="premium-panel p-12 text-center !rounded-cards">
          <div className="w-10 h-10 border-2 border-hairline border-t-accent rounded-full animate-spin mx-auto mb-4" role="status" aria-label="Loading profile">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="text-fog text-sm">Loading your profile...</p>
        </div>
      </div>
    )
  }

  const handleSave = () => {
    showToast('Profile updated.', 'success')
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    showToast('Logged out', 'info')
  }

  return (
    <div className="container-responsive py-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <span className="premium-eyebrow mb-3">Your workspace</span>
          <h1 className="premium-display text-2xl sm:text-3xl mt-3">Profile</h1>
          <p className="text-sm text-fog mt-1">Manage your account</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => navigate('/settings')} className="premium-button-secondary !min-h-9">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </button>
          <button onClick={() => setIsEditing(!isEditing)} className={isEditing ? 'premium-button-primary !min-h-9' : 'premium-button-secondary !min-h-9'}>
            {isEditing ? <><Save className="w-4 h-4" /> <span>Save</span></> : <><Edit2 className="w-4 h-4" /> <span>Edit</span></>}
          </button>
        </div>
      </div>

      <div className="premium-panel p-4 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="premium-avatar w-20 h-20 !text-2xl sm:!text-3xl flex-shrink-0">
            {formData.fullName ? formData.fullName[0].toUpperCase() : formData.username[0].toUpperCase()}
          </div>

          <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
            {isEditing ? (
              <div className="space-y-3 w-full">
                <div className="premium-field">
                  <label htmlFor="profile-name" className="premium-label">Full Name</label>
                  <input
                    id="profile-name"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="premium-input w-full"
                  />
                </div>
                <div className="premium-field">
                  <label htmlFor="profile-email" className="premium-label">Email</label>
                  <input
                    id="profile-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="premium-input w-full"
                  />
                </div>
                <div className="premium-field">
                  <label htmlFor="profile-username" className="premium-label">Username</label>
                  <input
                    id="profile-username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="premium-input w-full"
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-medium text-ice font-display">{formData.fullName || formData.username}</h2>
                <p className="text-sm text-fog">{formData.email}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                  <span className="premium-badge premium-status-safe rounded-badges"><CheckCircle className="w-3 h-3" /> Verified</span>
                  <span className="premium-badge premium-status-info rounded-badges"><Shield className="w-3 h-3" /> Member</span>
                  {user.created_at && (
                    <span className="premium-badge premium-status-neutral rounded-badges">Since {new Date(user.created_at).getFullYear()}</span>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex gap-6 text-center sm:text-left">
            <div><p className="text-xl font-medium text-ice font-display flex items-center gap-1 justify-center sm:justify-start"><Activity className="w-5 h-5 text-fog" strokeWidth={1.5} /> —</p><p className="text-xs text-fog">Activity</p></div>
            <div><p className="text-xl font-medium text-ice font-display">{user.email ? '✓' : '—'}</p><p className="text-xs text-fog">Verified</p></div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-hairline">
            <button onClick={() => setIsEditing(false)} className="premium-button-secondary !min-h-9"><X className="w-4 h-4" /> Cancel</button>
            <button onClick={handleSave} className="premium-button-primary !min-h-9"><Save className="w-4 h-4" /> Save</button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <button onClick={() => navigate('/settings')} className="premium-panel p-4 sm:p-5 group text-left hover:shadow-glass transition-shadow">
          <div className="flex items-center gap-3">
            <span className="premium-icon-tile !rounded-icons">
              <Bell className="w-5 h-5" strokeWidth={1.5} />
            </span>
            <div className="flex-1"><p className="text-sm font-medium text-ice group-hover:text-frost transition-colors">Notifications</p><p className="text-xs text-fog">Manage preferences</p></div>
            <ChevronRight className="w-4 h-4 text-fog/50 group-hover:text-frost transition-colors" />
          </div>
        </button>
        <button onClick={handleLogout} className="premium-panel p-4 sm:p-5 group text-left hover:shadow-glass transition-shadow">
          <div className="flex items-center gap-3">
            <span className="premium-icon-tile premium-icon-tile-danger !rounded-icons">
              <LogOut className="w-5 h-5" strokeWidth={1.5} />
            </span>
            <div className="flex-1"><p className="text-sm font-medium text-ice group-hover:text-danger transition-colors">Logout</p><p className="text-xs text-fog">Sign out securely</p></div>
            <ChevronRight className="w-4 h-4 text-fog/50 group-hover:text-frost transition-colors" />
          </div>
        </button>
      </div>

      <div className="premium-footer-note mt-8">
        <p>🔒 Your data is encrypted at rest and in transit. We never share your information.</p>
      </div>
    </div>
  )
}

export default Profile