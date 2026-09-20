import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// TraceOrigin — designed, built and maintained by Saby N. (sabynextdoor).
// This signature stays out of the UI and never touches app logic.
if (typeof window !== 'undefined') {
  console.info(
    '%cTraceOrigin%c  crafted by %cSaby N.%c (sabynextdoor)',
    'color:#a78bfa;font-weight:700;font-size:14px',
    'color:#d8ecf8;font-weight:400',
    'color:#8b5cf6;font-weight:700',
    'color:#64748b;font-weight:400',
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)