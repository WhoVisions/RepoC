const CONSENT_STORAGE_KEY = 'analytics-consent'

type AnalyticsEvent = {
  name: string
  payload?: Record<string, unknown>
}

let isInitialized = false
let consentGranted = false

const safeWindow: Window | undefined = typeof window !== 'undefined' ? window : undefined

function readStoredConsent(): boolean | null {
  if (!safeWindow) return null

  try {
    const storedValue = safeWindow.localStorage.getItem(CONSENT_STORAGE_KEY)
    if (storedValue === null) return null
    return storedValue === 'true'
  } catch (error) {
    console.warn('[analytics] Failed to read consent from storage.', error)
    return null
  }
}

function persistConsent(value: boolean): void {
  if (!safeWindow) return

  try {
    safeWindow.localStorage.setItem(CONSENT_STORAGE_KEY, value.toString())
  } catch (error) {
    console.warn('[analytics] Failed to persist consent to storage.', error)
  }
}

function initializeAnalytics(): void {
  if (isInitialized || !consentGranted) return

  // Placeholder for initializing a real analytics SDK.
  console.log('[analytics] Analytics initialized.')
  isInitialized = true
}

export function getStoredConsent(): boolean | null {
  return readStoredConsent()
}

export function hasAnalyticsConsent(): boolean {
  return consentGranted
}

export function setAnalyticsConsent(value: boolean): void {
  consentGranted = value
  persistConsent(value)
  if (value) {
    initializeAnalytics()
  }
}

export function setupAnalyticsFromStorage(): void {
  const storedConsent = readStoredConsent()
  consentGranted = storedConsent ?? false
  if (consentGranted) {
    initializeAnalytics()
  }
}

export function trackEvent({ name, payload }: AnalyticsEvent): void {
  if (!consentGranted) return
  initializeAnalytics()
  console.log('[analytics] Track event:', name, payload ?? {})
}
