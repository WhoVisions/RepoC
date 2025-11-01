import { useEffect, useState } from 'react'
import {
  getStoredConsent,
  setAnalyticsConsent,
  setupAnalyticsFromStorage,
  trackEvent,
} from './lib/analytics'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [analyticsConsent, setAnalyticsConsentState] = useState<boolean | null>(null)

  useEffect(() => {
    setupAnalyticsFromStorage()
    setAnalyticsConsentState(getStoredConsent())
  }, [])

  useEffect(() => {
    if (analyticsConsent) {
      trackEvent({ name: 'app_view' })
    }
  }, [analyticsConsent])

  const handleConsent = (value: boolean) => {
    setAnalyticsConsent(value)
    setAnalyticsConsentState(value)
    if (value) {
      trackEvent({ name: 'consent_granted' })
    }
  }

  const handleIncrement = () => {
    setCount((prev) => {
      const next = prev + 1
      trackEvent({ name: 'counter_increment', payload: { value: next } })
      return next
    })
  }

  return (
    <>
      <div>
        <h1>RepoC</h1>
        <div className="card">
          <button onClick={handleIncrement}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        {analyticsConsent === null && (
          <div className="consent-banner">
            <p>Allow anonymous analytics so we can improve the app?</p>
            <div className="consent-actions">
              <button onClick={() => handleConsent(true)}>Allow</button>
              <button onClick={() => handleConsent(false)}>Decline</button>
            </div>
          </div>
        )}
        {analyticsConsent === false && (
          <div className="consent-message">
            <p>Analytics are currently disabled. You can enable them anytime.</p>
            <button onClick={() => handleConsent(true)}>Enable analytics</button>
          </div>
        )}
        {analyticsConsent === true && (
          <div className="consent-message">
            <p>Thanks for helping us improve with anonymous analytics.</p>
            <button onClick={() => handleConsent(false)}>Disable analytics</button>
          </div>
        )}
      </div>
    </>
  )
}

export default App
