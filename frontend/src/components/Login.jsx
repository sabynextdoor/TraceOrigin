import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, ArrowRight, ShieldCheck, CheckCircle, Eye, EyeOff, AlertCircle, Sparkles, Fingerprint } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

function Login({ showToast }) {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const validate = () => {
    const nextErrors = {}
    if (!email.trim()) {
      nextErrors.email = 'Enter your email address'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Enter a valid email address'
    }
    if (!password) {
      nextErrors.password = 'Enter your password'
    }
    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (!validate()) return

    setLoading(true)
    const result = await login(email, password)
    setLoading(false)

    if (result.success) {
      if (showToast) showToast('Welcome back to TraceOrigin.', 'success')
      navigate('/analyze')
      return
    }

    const message = result.error || 'Unable to sign in. Check your credentials and try again.'
    setError(message)
    if (showToast) showToast(message, 'error')
  }

  return (
    <div className="premium-shell">
      <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-[1.05fr_1fr]">
        <section className="premium-auth-brand hidden lg:flex flex-col justify-between p-10 xl:p-14">
          <div className="premium-auth-visual" />
          <div className="relative z-10">
            <Logo size="large" showTagline />
          </div>

          <div className="relative z-10 max-w-xl space-y-7">
            <div>
              <div className="premium-kicker mb-5">Evidence before trust</div>
              <h1 className="premium-title text-4xl xl:text-5xl leading-[1.08] text-balance">
                See the signal behind every opportunity.
              </h1>
              <p className="premium-subtitle mt-5 max-w-lg text-base xl:text-lg">
                TraceOrigin turns messy messages, links, and offers into a clear, explainable verification trail.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {[
                { icon: ShieldCheck, title: 'Explainable risk scoring', copy: 'Every result shows the evidence behind the score.' },
                { icon: Fingerprint, title: 'Private by design', copy: 'Your workspace stays scoped to your account.' },
                { icon: CheckCircle, title: 'Built for real decisions', copy: 'Get a practical next step, not a black-box verdict.' }
              ].map(({ icon: Icon, title, copy }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="premium-icon-tile mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-frost">{title}</p>
                    <p className="text-xs leading-relaxed text-fog mt-0.5">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3 text-[11px] text-fog/70">
            <span className="w-1.5 h-1.5 rounded-full bg-ok animate-pulse" />
            <span>Verification workspace available</span>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 sm:px-6 lg:px-12 xl:px-20 py-10 lg:py-8">
          <div className="w-full max-w-md">
            <div className="lg:hidden mb-8">
              <Logo size="large" showTagline />
            </div>

            <div className="premium-auth-panel animate-fade-up">
              <div className="mb-8">
                <div className="premium-kicker mb-4">Secure access</div>
                <h2 className="premium-title text-3xl">Welcome back</h2>
                <p className="premium-subtitle mt-2">Sign in to continue your verification workspace.</p>
              </div>

              {error && (
                <div className="premium-form-error mb-5" role="alert" aria-live="assertive">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="premium-field">
                  <label htmlFor="login-email" className="premium-label">Email address</label>
                  <div className="relative">
                    <Mail className="premium-input-icon" aria-hidden="true" />
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className={`premium-input pl-10 ${fieldErrors.email ? 'border-danger/60 focus:border-danger/80 focus:ring-danger/15' : ''}`}
                      placeholder="you@example.com"
                      autoComplete="email"
                      aria-invalid={Boolean(fieldErrors.email)}
                      aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
                    />
                  </div>
                  {fieldErrors.email && <p id="login-email-error" className="text-[11px] text-danger">{fieldErrors.email}</p>}
                </div>

                <div className="premium-field">
                  <label htmlFor="login-password" className="premium-label">Password</label>
                  <div className="relative">
                    <Lock className="premium-input-icon" aria-hidden="true" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className={`premium-input pl-10 pr-11 ${fieldErrors.password ? 'border-danger/60 focus:border-danger/80 focus:ring-danger/15' : ''}`}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      aria-invalid={Boolean(fieldErrors.password)}
                      aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
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
                  {fieldErrors.password && <p id="login-password-error" className="text-[11px] text-danger">{fieldErrors.password}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="premium-button-primary w-full"
                  aria-label={loading ? 'Signing in' : 'Sign in'}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Signing in</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="premium-divider my-6" />

              <p className="text-center text-sm text-fog">
                New to TraceOrigin?{' '}
                <Link to="/register" className="premium-link">Create an account</Link>
              </p>

              <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-hairline bg-surface2/60 p-3">
                <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed text-fog">
                  Credentials are sent over an authenticated session. Passwords are stored as salted hashes, never as plain text.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-fog/70">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Verify before you trust.</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Login
