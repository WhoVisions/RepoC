import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import {
  getStoredConsent,
  setAnalyticsConsent,
  setupAnalyticsFromStorage,
  trackEvent,
} from './lib/analytics'
import EditorShowcase from './components/EditorShowcase'
import CounterCard from './components/CounterCard'
import SkipLink from './components/SkipLink'
import { useLanguage, useTranslation } from './i18n'
import { AppProviders } from './app/AppProviders'
import { HomePage } from './modules/marketing/pages/HomePage'
import { GalleryPage } from './modules/gallery/pages/GalleryPage'
import { BookingPage } from './modules/booking/pages/BookingPage'
import { AdminPage } from './modules/admin/pages/AdminPage'

function App() {
  const [count, setCount] = useState(0)
  const [analyticsConsent, setAnalyticsConsentState] = useState<boolean | null>(null)
  const { language, setLanguage, resolvedLanguage, isLoading, error } = useLanguage()
  const { t } = useTranslation()

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
    <BrowserRouter>
      <AppProviders>
        <SkipLink targetId="main-content" />
        <div className="layout">
          <header className="layout__header">
            <h1>RepoC Studio</h1>
            <nav aria-label="Primary navigation">
              <ul className="layout__nav">
                <li>
                  <Link to="/">Marketing</Link>
                </li>
                <li>
                  <Link to="/gallery">Gallery</Link>
                </li>
                <li>
                  <Link to="/booking">Booking</Link>
                </li>
                <li>
                  <Link to="/admin">Admin</Link>
                </li>
              </ul>
            </nav>
            <div className="language-picker">
              <label>
                <span>{t('app.language.select', 'Select language')}</span>
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  disabled={isLoading}
                >
                  <option value="en">{t('app.language.english', 'English')}</option>
                  <option value="es">{t('app.language.spanish', 'Spanish')}</option>
                  <option value="fr">{t('app.language.french', 'French')}</option>
                  <option value="de">{t('app.language.german', 'German')}</option>
                </select>
              </label>
            </div>
            {resolvedLanguage !== language && !error ? (
              <p className="resolved-language">
                {t('app.language.resolved', 'Using {{locale}} translations', { locale: resolvedLanguage })}
              </p>
            ) : null}
            {error ? <p className="error">{error.message}</p> : null}
          </header>
          <main
            aria-labelledby="app-title"
            className="layout__main"
            id="main-content"
            tabIndex={-1}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>

            <section className="flex flex-col items-center gap-sm text-center">
              <span className="inline-flex items-center rounded-full bg-brand-primary/10 px-sm py-2xs text-sm font-semibold text-brand-primary">
                RepoC
              </span>
              <h1 className="text-4xl font-semibold" id="app-title">Design tokens with Tailwind</h1>
              <p className="max-w-xl text-brand-muted">
                A playground for applying brand-aligned colors, typography, and spacing scale directly from Tailwind class utilities.
              </p>
              <p className="app-subtitle">
                Accessible counter demo with keyboard shortcuts and ARIA support.
              </p>
            </section>

            <section className="flex flex-col items-center gap-sm rounded-2xl bg-brand-surface px-xl py-lg shadow-lg">
              <p className="text-lg font-medium text-brand-neutral">
                Count:&nbsp;
                <span className="font-display text-brand-secondary">{count}</span>
              </p>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-brand-primary px-lg py-2xs text-white transition-colors hover:bg-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary"
                onClick={handleIncrement}
              >
                Increment
              </button>
              <p className="text-sm text-brand-muted">
                Edit{' '}
                <code className="rounded bg-brand-neutral/5 px-xs py-3xs font-mono text-brand-neutral">src/App.tsx</code> and save to test HMR.
              </p>
            </section>

            <CounterCard />
          </main>
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
        {/* Main's EditorShowcase kept, as a div so the router's single main landmark stays the only <main>. */}
        <div className="flex min-h-screen w-full bg-brand-surface">
          <EditorShowcase />
        </div>
      </AppProviders>
    </BrowserRouter>
  )
}

export default App
