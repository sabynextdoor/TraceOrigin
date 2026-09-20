import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'

function Logo({ size = 'default', showTagline = true }) {
  const sizes = {
    small: {
      icon: 'w-6 h-6',
      text: 'text-lg',
      tagline: 'text-[10px]'
    },
    default: {
      icon: 'w-8 h-8',
      text: 'text-xl',
      tagline: 'text-xs'
    },
    large: {
      icon: 'w-12 h-12',
      text: 'text-3xl',
      tagline: 'text-sm'
    }
  }

  const currentSize = sizes[size] || sizes.default

  return (
    <Link to="/" className="flex items-center space-x-3 group">
      <div className={`${currentSize.icon} rounded-full bg-surface2 shadow-subtle flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-glow`}>
        <ShieldCheck className="w-[60%] h-[60%] text-frost" strokeWidth={1.5} />
      </div>
      <div className="flex flex-col">
        <span className={`${currentSize.text} font-medium tracking-tight font-display premium-gradient-text`}>
          TraceOrigin
        </span>
        {showTagline && (
          <span className={`${currentSize.tagline} text-fog font-light tracking-wider`}>
            Verify before you trust.
          </span>
        )}
      </div>
    </Link>
  )
}

export default Logo