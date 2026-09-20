import React from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'

function Layout({ children }) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main className="pt-16 sm:pt-20" key={location.pathname}>
        <div className="animate-fade-up">{children}</div>
      </main>
    </div>
  )
}

export default Layout