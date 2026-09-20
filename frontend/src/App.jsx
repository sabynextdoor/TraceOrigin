import React, { useState, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Landing from './components/Landing'
import Login from './components/Login'
import Register from './components/Register'
import ProtectedRoute from './components/ProtectedRoute'
import Toast from './components/Toast'

const Analyzer = lazy(() => import('./components/Analyzer'))
const Results = lazy(() => import('./components/Results'))
const History = lazy(() => import('./components/History'))
const EnhancedDashboard = lazy(() => import('./components/EnhancedDashboard'))
const ScamIntelligence = lazy(() => import('./components/ScamIntelligence'))
const Profile = lazy(() => import('./components/Profile'))
const Settings = lazy(() => import('./components/Settings'))

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-frost animate-spin mx-auto mb-3" strokeWidth={1.5} />
        <p className="text-xs text-fog font-mono tracking-widest">LOADING</p>
      </div>
    </div>
  )
}

function App() {
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  return (
    <AuthProvider>
      <Router>
        <Layout showToast={showToast}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login showToast={showToast} />} />
              <Route path="/register" element={<Register showToast={showToast} />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/analyze" element={<Analyzer showToast={showToast} />} />
                <Route path="/results/:id" element={<Results showToast={showToast} />} />
                <Route path="/history" element={<History showToast={showToast} />} />
                <Route path="/dashboard" element={<EnhancedDashboard showToast={showToast} />} />
                <Route path="/intelligence" element={<ScamIntelligence showToast={showToast} />} />
                <Route path="/profile" element={<Profile showToast={showToast} />} />
                <Route path="/settings" element={<Settings showToast={showToast} />} />
              </Route>

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </Layout>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </Router>
    </AuthProvider>
  )
}

export default App