import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import type { TranslationDictionary, TranslationLoader } from './jsonLoader'

type InterpolationValues = Record<string, string | number>

const STORAGE_KEY = 'app.language'

function interpolate(template: string, values?: InterpolationValues) {
  if (!values) {
    return template
  }

  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, token) => {
    if (!(token in values)) {
      return match
    }

    const value = values[token]
    return value == null ? '' : String(value)
  })
}

type LanguageContextValue = {
  language: string
  setLanguage: (locale: string) => void
  resolvedLanguage: string
  translations: TranslationDictionary
  t: (key: string, defaultValue?: string, values?: InterpolationValues) => string
  isLoading: boolean
  error: Error | null
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

type LanguageProviderProps = {
  loader: TranslationLoader
  children: ReactNode
  defaultLanguage?: string
  fallbackLanguage?: string
}

export function LanguageProvider({
  loader,
  children,
  defaultLanguage = 'en',
  fallbackLanguage,
}: LanguageProviderProps) {
  const initialLanguage = useMemo(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return stored
      }

      const browserLanguage = window.navigator.language ?? window.navigator.languages?.[0]
      if (browserLanguage) {
        return browserLanguage
      }
    }
    return defaultLanguage
  }, [defaultLanguage])
  const [requestedLanguage, setRequestedLanguage] = useState<string>(initialLanguage)
  const [resolvedLanguage, setResolvedLanguage] = useState<string>(initialLanguage)
  const [translations, setTranslations] = useState<TranslationDictionary>({})
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const requestIdRef = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, requestedLanguage)
  }, [requestedLanguage])

  useEffect(() => {
    let cancelled = false
    const requestId = ++requestIdRef.current

    async function applyTranslations(locale: string, allowFallback: boolean) {
      try {
        const data = await loader(locale)
        if (cancelled || requestIdRef.current !== requestId) {
          return
        }
        setTranslations(data)
        setResolvedLanguage(locale)
        setError(null)
      } catch (err) {
        if (allowFallback && fallbackLanguage && locale !== fallbackLanguage) {
          await applyTranslations(fallbackLanguage, false)
          return
        }

        if (cancelled || requestIdRef.current !== requestId) {
          return
        }

        setTranslations({})
        setResolvedLanguage(locale)
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        if (!cancelled && requestIdRef.current === requestId) {
          setIsLoading(false)
        }
      }
    }

    setIsLoading(true)
    void applyTranslations(requestedLanguage, true)

    return () => {
      cancelled = true
    }
  }, [requestedLanguage, loader, fallbackLanguage])

  const updateLanguage = useCallback((locale: string) => {
    setRequestedLanguage(locale)
  }, [])

  const translate = useCallback(
    (key: string, defaultValue?: string, values?: InterpolationValues) => {
      const template = translations[key] ?? defaultValue ?? key
      return interpolate(template, values)
    },
    [translations],
  )

  const value = useMemo<LanguageContextValue>(
    () => ({
      language: requestedLanguage,
      setLanguage: updateLanguage,
      resolvedLanguage,
      translations,
      t: translate,
      isLoading,
      error,
    }),
    [requestedLanguage, updateLanguage, resolvedLanguage, translations, translate, isLoading, error],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

function useLanguageContext() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguageContext must be used within a LanguageProvider')
  }
  return context
}

export function useLanguage() {
  const { language, setLanguage, resolvedLanguage, isLoading, error } = useLanguageContext()
  return { language, setLanguage, resolvedLanguage, isLoading, error }
}

export function useTranslation() {
  const { t, translations, resolvedLanguage, isLoading, error } = useLanguageContext()
  return { t, translations, resolvedLanguage, isLoading, error }
}

