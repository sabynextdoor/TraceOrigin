import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="premium-panel p-12 text-center !rounded-cards">
          <div className="w-10 h-10 border-2 border-hairline border-t-accent rounded-full animate-spin mx-auto mb-4" role="status" aria-label="Loading">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="text-fog text-sm">Verifying your session...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute