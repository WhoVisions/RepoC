import { useState } from 'react'
import { useLanguage, useTranslation } from './i18n'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const { language, setLanguage, resolvedLanguage, isLoading, error } = useLanguage()
  const { t } = useTranslation()

  return (
    <>
      <div>
        <h1>{t('app.title', 'RepoC')}</h1>
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
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            {t('app.buttonLabel', 'count is {{count}}', { count })}
          </button>
          <p>
            {t('app.instructions', 'Edit src/App.tsx and save to test HMR')}
          </p>
        </div>
      </div>
    </>
  )
}

export default App
