import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppErrorFallback from './components/common/AppErrorFallback'
import { initFrontendErrorTracking, Sentry } from './services/errorTracking'

initFrontendErrorTracking()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<AppErrorFallback />}>
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>,
)
