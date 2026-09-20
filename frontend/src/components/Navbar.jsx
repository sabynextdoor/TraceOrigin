import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Shield, Menu, X, User, LogOut, LogIn, UserPlus, Home, BarChart3, History, Activity, Award, Bell, ChevronDown, Sparkles, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

function Navbar({ showToast }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setShowUserMenu(false)
    setMobileOpen(false)
    if (showToast) showToast('Signed out securely.', 'info')
  }

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/analyze', label: 'Analyze', icon: Shield },
    { path: '/history', label: 'History', icon: History },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/intelligence', label: 'Intelligence', icon: Activity }
  ]

  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-hairline bg-canvas/85 backdrop-blur-2xl">
      <div className="premium-section">
        <div className="flex items-center justify-between h-16">
          <Logo size="default" showTagline />

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`premium-nav-link ${active ? 'premium-nav-link-active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="hidden md:flex items-center gap-2 ml-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu((current) => !current)}
                  className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1.5 rounded-lg border border-hairline bg-surface/60 hover:border-hairline2 hover:bg-surface2 transition-all"
                  aria-expanded={showUserMenu}
                  aria-label="Open user menu"
                >
                  <span className="premium-avatar">
                    {(user.full_name || user.username || 'U')[0].toUpperCase()}
                  </span>
                  <span className="text-sm font-medium text-frost max-w-[9rem] truncate">{user.full_name || user.username}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-fog transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                  <>
                    <button className="premium-menu-backdrop" onClick={() => setShowUserMenu(false)} aria-label="Close user menu" />
                    <div className="premium-menu">
                      <div className="px-4 py-3 border-b border-hairline">
                        <div className="flex items-center gap-3">
                          <span className="premium-avatar w-10 h-10">{(user.full_name || user.username || 'U')[0].toUpperCase()}</span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-ice truncate">{user.full_name || user.username}</p>
                            <p className="text-xs text-fog truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-2 py-2 space-y-0.5">
                        <Link to="/profile" onClick={() => setShowUserMenu(false)} className="premium-menu-item"><User className="w-4 h-4 text-accent" /><span>Profile</span></Link>
                        <Link to="/dashboard" onClick={() => setShowUserMenu(false)} className="premium-menu-item"><Activity className="w-4 h-4 text-accent" /><span>Dashboard</span></Link>
                        <Link to="/history" onClick={() => setShowUserMenu(false)} className="premium-menu-item"><History className="w-4 h-4 text-accent" /><span>History</span></Link>
                        <Link to="/settings" onClick={() => setShowUserMenu(false)} className="premium-menu-item"><Bell className="w-4 h-4 text-accent" /><span>Notifications</span></Link>
                      </div>
                      <div className="border-t border-hairline my-1" />
                      <button onClick={handleLogout} className="premium-menu-item w-full text-danger hover:bg-danger/10"><LogOut className="w-4 h-4" /><span>Sign out</span></button>
                      <div className="px-4 py-2.5 border-t border-hairline mt-1">
                        <div className="flex items-center gap-2 text-[11px] text-fog">
                          <Award className="w-3.5 h-3.5 text-accent" />
                          <span>Verification workspace</span>
                          <Sparkles className="w-3.5 h-3.5 text-accent ml-auto" />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="premium-button-ghost"><LogIn className="w-4 h-4" /><span>Sign in</span></Link>
                <Link to="/register" className="premium-button-primary"><UserPlus className="w-4 h-4" /><span>Get started</span></Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen((current) => !current)}
            className="md:hidden premium-button-icon"
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="premium-mobile-menu">
          <div className="px-4 py-4 space-y-1">
            {user && (
              <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl border border-hairline bg-surface2">
                <span className="premium-avatar">{(user.full_name || user.username || 'U')[0].toUpperCase()}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ice truncate">{user.full_name || user.username}</p>
                  <p className="text-xs text-fog truncate">{user.email}</p>
                </div>
              </div>
            )}

            <div className="relative mb-2">
              <Search className="premium-input-icon" aria-hidden="true" />
              <input className="premium-input pl-10" placeholder="Search navigation" aria-label="Search navigation" />
            </div>

            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`premium-nav-link w-full ${active ? 'premium-nav-link-active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              )
            })}

            {user ? (
              <div className="border-t border-hairline pt-3 mt-3 space-y-1">
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="premium-menu-item"><User className="w-4 h-4 text-accent" /><span>Profile</span></Link>
                <Link to="/settings" onClick={() => setMobileOpen(false)} className="premium-menu-item"><Bell className="w-4 h-4 text-accent" /><span>Notifications</span></Link>
                <button onClick={handleLogout} className="premium-menu-item w-full text-danger hover:bg-danger/10"><LogOut className="w-4 h-4" /><span>Sign out</span></button>
              </div>
            ) : (
              <div className="border-t border-hairline pt-3 mt-3 grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="premium-button-secondary w-full"><LogIn className="w-4 h-4" /><span>Sign in</span></Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="premium-button-primary w-full"><UserPlus className="w-4 h-4" /><span>Sign up</span></Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
