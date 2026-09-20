import React from 'react'
import { Link } from 'react-router-dom'
import {
  Scan, Gauge, AlertTriangle, ListChecks, History, PieChart,
  Mail, ArrowRight, Lock, Shield, KeyRound, Check, Sparkles
} from 'lucide-react'
import Logo from './Logo'

const FEATURES = [
  { icon: Scan, label: 'Paste & scan' },
  { icon: Gauge, label: 'Risk score' },
  { icon: AlertTriangle, label: 'Indicators' },
  { icon: ListChecks, label: 'Checklist' },
  { icon: History, label: 'History' },
  { icon: PieChart, label: 'Dashboard' },
]

function AuthCardPreview({ tone = 'center' }) {
  return (
    <div className="rounded-cards bg-[rgba(5,6,15,0.97)] p-6 shadow-glass backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gridline-blue/70" />
          <span className="w-2 h-2 rounded-full bg-gridline-blue/70" />
          <span className="w-2 h-2 rounded-full bg-gridline-blue/70" />
        </span>
        <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fog/60">
          traceorigin / secure
        </span>
      </div>

      {tone === 'center' && (
        <>
          <div className="premium-kicker mb-2">Welcome back</div>
          <h4 className="text-lg font-medium text-ice font-display mb-4">Continue your workspace</h4>
          <div className="space-y-3">
            <div className="min-h-11 rounded-inputs bg-[rgba(199,211,234,0.06)] border border-hairline px-4 py-2.5 flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-fog/60" />
              <span className="text-sm text-fog/70">you@example.com</span>
            </div>
            <div className="min-h-11 rounded-inputs bg-[rgba(199,211,234,0.06)] border border-hairline px-4 py-2.5 flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-fog/60" />
              <span className="text-sm text-fog/70">••••••••••••</span>
            </div>
            <div className="inline-flex items-center justify-center gap-2 w-full min-h-11 px-6 rounded-buttons bg-accent text-white text-sm font-medium shadow-accent">
              Continue
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </>
      )}

      {tone === 'left' && (
        <>
          <div className="premium-kicker mb-2">Faster access</div>
          <h4 className="text-sm font-medium text-ice font-display mb-4">Enter your code</h4>
          <div className="flex gap-2 mb-4">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="w-10 h-11 rounded-inputs border border-hairline bg-[rgba(199,211,234,0.06)] flex items-center justify-center text-mist text-sm">
                {i === 0 ? <KeyRound className="w-4 h-4" /> : ''}
              </span>
            ))}
          </div>
          <div className="inline-flex items-center justify-center gap-2 w-full min-h-11 px-6 rounded-buttons border border-hairline bg-surface text-white text-sm font-medium">
            Verify
            <Check className="w-4 h-4" />
          </div>
        </>
      )}

      {tone === 'right' && (
        <>
          <div className="premium-kicker mb-2">Single sign-on</div>
          <h4 className="text-sm font-medium text-ice font-display mb-4">Pick a provider</h4>
          <div className="space-y-2.5">
            {['Google', 'Microsoft'].map((provider) => (
              <div key={provider} className="inline-flex items-center justify-center gap-2 w-full min-h-11 px-6 rounded-buttons border border-hairline bg-surface text-white text-sm font-medium">
                <span className="w-4 h-4 rounded-full bg-hairline flex items-center justify-center text-[10px] font-semibold text-mist">
                  {provider[0]}
                </span>
                {provider}
              </div>
            ))}
            <div className="flex items-center gap-3 py-1">
              <span className="h-px flex-1 bg-hairline" />
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog/60">or</span>
              <span className="h-px flex-1 bg-hairline" />
            </div>
            <div className="inline-flex items-center justify-center gap-2 w-full min-h-11 px-6 rounded-buttons border border-hairline bg-surface text-white text-sm font-medium">
              <Shield className="w-4 h-4 text-frost" />
              SSO
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function Landing() {
  return (
    <div className="min-h-screen">
      {/* ── Hero · illuminated wordmark + floating glass auth cards ── */}
      <section className="relative overflow-hidden">
        <div className="premium-section pt-24 sm:pt-32 pb-20 lg:pb-32 text-center">
          <div className="flex justify-center mb-6 animate-fade-up">
            <span className="premium-eyebrow">Introducing</span>
          </div>

          <h1 className="premium-display text-[44px] sm:text-[64px] lg:text-[96px] leading-[1.02] animate-fade-up" style={{ animationDelay: '80ms' }}>
            <span className="premium-gradient-text">TraceOrigin</span>
          </h1>

          <p className="mt-6 mx-auto max-w-xl text-lg sm:text-xl leading-relaxed text-mist animate-fade-up" style={{ animationDelay: '160ms' }}>
            Verify before you trust. TraceOrigin turns internship and job offers into
            a clear, explainable risk verdict — before you pay, apply, or reply.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: '240ms' }}>
            <Link to="/analyze" className="premium-button-primary min-w-[180px]">
              <Sparkles className="w-4 h-4" />
              Analyze an opportunity
            </Link>
            <Link to="/register" className="premium-button-secondary min-w-[160px]">
              <Shield className="w-4 h-4" />
              Get started free
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-fog/70 animate-fade-up" style={{ animationDelay: '320ms' }}>
            <span className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-ok" /> Free to use</span>
            <span className="inline-flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-frost" /> Privacy first</span>
            <span className="inline-flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5 text-accent" /> Real-time results</span>
          </div>
        </div>

        {/* Floating glass auth-card fan */}
        <div className="relative mx-auto max-w-5xl px-4 pb-10 -mt-2 lg:pb-24">
          <div className="relative h-[380px] sm:h-[420px] hidden lg:block">
            <div className="absolute left-0 top-8 w-[300px] -rotate-6 opacity-80 animate-float-slow">
              <AuthCardPreview tone="left" />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 w-[340px] z-10 animate-float-slow" style={{ animationDelay: '1.2s' }}>
              <AuthCardPreview tone="center" />
            </div>
            <div className="absolute right-0 top-8 w-[300px] rotate-6 opacity-80 animate-float-slow" style={{ animationDelay: '2.1s' }}>
              <AuthCardPreview tone="right" />
            </div>
          </div>
          <div className="lg:hidden">
            <AuthCardPreview tone="center" />
          </div>
        </div>
      </section>

      {/* ── Feature workbook · six circular tiles on a thread ── */}
      <section className="premium-section py-20 lg:py-[120px] border-t border-hairline/70">
        <div className="flex justify-center mb-5">
          <span className="premium-eyebrow">Built to verify</span>
        </div>
        <h2 className="premium-display text-center text-3xl sm:text-4xl lg:text-[44px]">Signal&nbsp;<span className="premium-gradient-text">over noise.</span></h2>
        <p className="mx-auto mt-4 max-w-[640px] text-center text-base leading-relaxed text-fog">
          Paste a message, email, or job description. TraceOrigin scans for payment
          demands, urgency tactics, fake recruiters, risky links, and every other
          signal scammers lean on.
        </p>

        <div className="mt-16 relative">
          <div className="absolute top-8 left-10 right-10 h-px bg-hairline hidden md:block" aria-hidden="true" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-4">
            {FEATURES.map(({ icon: Icon, label }, index) => (
              <div key={label} className="relative flex flex-col items-center gap-4 animate-fade-up" style={{ animationDelay: `${index * 70}ms` }}>
                <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-surface2 shadow-subtle">
                  <Icon className="w-6 h-6 text-frost" strokeWidth={1.5} />
                </div>
                <span className="text-sm font-medium text-mist">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Capability cards ── */}
      <section className="premium-section pb-20 lg:pb-[120px]">
        <div className="flex justify-center mb-5">
          <span className="premium-eyebrow">Explainable by design</span>
        </div>
        <h2 className="premium-display text-center text-3xl sm:text-4xl lg:text-[44px]">Every score comes&nbsp;<span className="premium-gradient-text">with its evidence.</span></h2>
        <p className="mx-auto mt-4 max-w-[640px] text-center text-base leading-relaxed text-fog">
          You never get a black-box verdict. Each risk score surfaces the specific
          warning indicators, a verification checklist, and a clear next step.
        </p>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {[
            { icon: Scan, title: 'Paste & analyze', copy: 'Messages, emails, LinkedIn posts, or job descriptions — instant scan for 20+ scam patterns.' },
            { icon: ListChecks, title: 'A verification checklist', copy: 'A step-by-step checklist covering pay-to-apply traps, recruiter identity, and company legitimacy.' },
            { icon: PieChart, title: 'A dashboard that learns', copy: 'Your history and risk trends, charted. Spot patterns across every offer you review.' },
          ].map(({ icon: Icon, title, copy }, index) => (
            <div key={title} className="premium-feature text-center animate-fade-up" style={{ animationDelay: `${index * 90}ms` }}>
              <div className="premium-feature-icon mx-auto">
                <Icon className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-medium text-ice font-display mb-2">{title}</h3>
              <p className="text-sm leading-relaxed text-fog">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="premium-section pb-24 lg:pb-32">
        <div className="premium-cta text-center rounded-cards p-10 sm:p-14">
          <div className="flex justify-center mb-6">
            <Logo size="large" showTagline={false} />
          </div>
          <h2 className="premium-display text-3xl sm:text-4xl lg:text-5xl">Ready to check the offer?</h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-fog">
            One paste is all it takes. No signup required to see your first verdict.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link to="/analyze" className="premium-button-primary min-w-[200px]">
              Scan an opportunity
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="premium-button-secondary min-w-[160px]">
              <Lock className="w-4 h-4" />
              Sign in to workspace
            </Link>
          </div>
        </div>

        <div className="premium-footer-note mt-10">
          <p>
            TraceOrigin provides risk indicators based on available information. A high score does not prove fraud,
            and a low score does not guarantee legitimacy. Always verify opportunities through official channels.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Landing