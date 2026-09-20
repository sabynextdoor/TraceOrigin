import React, { useEffect, useState } from 'react'

function RiskGauge({ score, level }) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const duration = 1500
    const startTime = performance.now()
    const startValue = 0
    const endValue = score

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedScore(Math.round(startValue + (endValue - startValue) * eased))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [score])

  const getColor = (s) => {
    if (s >= 80) return '#ff6b6b'
    if (s >= 60) return '#f5b84c'
    if (s >= 30) return '#f0a64b'
    return '#8bcfb0'
  }

  const getLevelColor = (lvl) => {
    const colors = { CRITICAL: 'text-danger', HIGH: 'text-warn', MEDIUM: 'text-warn/80', LOW: 'text-ok' }
    return colors[lvl] || colors.LOW
  }

  const radius = 80
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animatedScore / 100) * circumference

  return (
    <div className="relative inline-flex flex-col items-center w-48 h-52 sm:w-56 sm:h-60 lg:w-64 lg:h-64">
      <div className="relative w-full h-full">
        <svg width="100%" height="100%" viewBox="0 0 220 220" className="transform -rotate-90 drop-shadow-[0_0_18px_rgba(102,58,243,0.18)]">
          <circle cx="110" cy="110" r={radius} fill="none" stroke="rgba(186,215,247,0.08)" strokeWidth="12" />
          <circle cx="110" cy="110" r={radius} fill="none" stroke={getColor(animatedScore)} strokeWidth="12" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-100" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl sm:text-4xl font-semibold font-display ${getLevelColor(level)}`}>{animatedScore}</span>
          <span className="text-xs text-fog font-medium">/ 100</span>
          <span className={`text-sm font-semibold mt-1 ${getLevelColor(level)}`}>{level}</span>
        </div>
      </div>
      <span className="premium-eyebrow mt-3">Risk score</span>
    </div>
  )
}

export default RiskGauge