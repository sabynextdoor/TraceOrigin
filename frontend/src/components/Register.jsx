import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, User, UserPlus, ArrowRight, AlertCircle, CheckCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Register({ showToast }) {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    full_name: '',
    password: '',
    confirm_password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setFieldErrors((current) => ({ ...current, [name]: undefined }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!formData.full_name.trim()) nextErrors.full_name = 'Enter your full name'
    if (!formData.username.trim()) {
      nextErrors.username = 'Enter a username'
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
      nextErrors.username = 'Use letters and numbers only'
    } else if (formData.username.length < 3) {
      nextErrors.username = 'Use at least 3 characters'
    }
    if (!formData.email.trim()) {
      nextErrors.email = 'Enter your email address'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Enter a valid email address'
    }
    if (!formData.password) {
      nextErrors.password = 'Enter a password'
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Use at least 6 characters'
    }
    if (formData.confirm_password !== formData.password) {
      nextErrors.confirm_password = 'Passwords do not match'
    }
    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess(false)
    if (!validate()) return

    setLoading(true)
    const { confirm_password, ...userData } = formData
    const result = await register(userData)
    setLoading(false)

    if (result.success) {
      setSuccess(true)
      if (showToast) showToast('Account created. Sign in to continue.', 'success')
      window.setTimeout(() => navigate('/login'), 1800)
      return
    }

    const message = result.error || 'Unable to create your account. Try again.'
    setError(message)
    if (showToast) showToast(message, 'error')
  }

  const inputClass = (name) => `premium-input pl-10 pr-11 ${fieldErrors[name] ? 'border-danger/60 focus:border-danger/80 focus:ring-danger/15' : ''}`

  return (
    <div className="premium-shell">
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-12 xl:px-20 py-10 lg:py-8">
        <div className="w-full max-w-2xl">
          <div className="premium-auth-panel animate-fade-up">
            <div className="mb-8">
              <div className="premium-kicker mb-4">TraceOrigin account</div>
              <div className="flex items-start gap-4">
                <div className="premium-icon-tile">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="premium-title text-3xl">Create your workspace</h2>
                  <p className="premium-subtitle mt-2">Start building an evidence trail for every opportunity you review.</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="premium-form-error mb-5" role="alert" aria-live="assertive">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="premium-success mb-5" role="status" aria-live="polite">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Account created. Taking you to sign in...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="premium-field">
                  <label htmlFor="reg-fullname" className="premium-label">Full name</label>
                  <div className="relative">
                    <User className="premium-input-icon" aria-hidden="true" />
                    <input
                      id="reg-fullname"
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className={`premium-input pl-10 ${fieldErrors.full_name ? 'border-danger/60 focus:border-danger/80 focus:ring-danger/15' : ''}`}
                      placeholder="Your name"
                      autoComplete="name"
                      aria-invalid={Boolean(fieldErrors.full_name)}
                    />
                  </div>
                  {fieldErrors.full_name && <p className="text-[11px] text-danger">{fieldErrors.full_name}</p>}
                </div>

                <div className="premium-field">
                  <label htmlFor="reg-username" className="premium-label">Username</label>
                  <div className="relative">
                    <User className="premium-input-icon" aria-hidden="true" />
                    <input
                      id="reg-username"
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={inputClass('username')}
                      placeholder="e.g. alexrivera"
                      autoComplete="username"
                      aria-invalid={Boolean(fieldErrors.username)}
                    />
                  </div>
                  {fieldErrors.username && <p className="text-[11px] text-danger">{fieldErrors.username}</p>}
                </div>
              </div>

              <div className="premium-field">
                <label htmlFor="reg-email" className="premium-label">Email address</label>
                <div className="relative">
                  <Mail className="premium-input-icon" aria-hidden="true" />
                  <input
                    id="reg-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`premium-input pl-10 ${fieldErrors.email ? 'border-danger/60 focus:border-danger/80 focus:ring-danger/15' : ''}`}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={Boolean(fieldErrors.email)}
                  />
                </div>
                {fieldErrors.email && <p className="text-[11px] text-danger">{fieldErrors.email}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="premium-field">
                  <label htmlFor="reg-password" className="premium-label">Password</label>
                  <div className="relative">
                    <Lock className="premium-input-icon" aria-hidden="true" />
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={inputClass('password')}
                      placeholder="At least 6 characters"
                      autoComplete="new-password"
                      aria-invalid={Boolean(fieldErrors.password)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-fog hover:text-ice hover:bg-surface2 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.password && <p className="text-[11px] text-danger">{fieldErrors.password}</p>}
                </div>

                <div className="premium-field">
                  <label htmlFor="reg-confirm" className="premium-label">Confirm password</label>
                  <div className="relative">
                    <Lock className="premium-input-icon" aria-hidden="true" />
                    <input
                      id="reg-confirm"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      className={inputClass('confirm_password')}
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      aria-invalid={Boolean(fieldErrors.confirm_password)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((current) => !current)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-fog hover:text-ice hover:bg-surface2 transition-colors"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showConfirmPassword}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.confirm_password && <p className="text-[11px] text-danger">{fieldErrors.confirm_password}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="premium-button-primary w-full"
                aria-label={loading ? 'Creating account' : 'Create account'}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Creating account</span>
                  </>
                ) : (
                  <>
                    <span>Create account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="premium-divider my-6" />

            <p className="text-center text-sm text-fog">
              Already have an account?{' '}
              <Link to="/login" className="premium-link">Sign in</Link>
            </p>

            <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-hairline bg-surface2/60 p-3">
              <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-fog">
                Your account is scoped to your own analyses and history. You control what you submit and what you keep.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
