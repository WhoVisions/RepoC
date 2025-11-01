import { ChangeEvent, useState } from 'react'
import './App.css'
import {
  useExperimentAssignment,
  useFeatureEnabled,
  useFeatureFlag,
} from './lib/experiments'

function App() {
  const [count, setCount] = useState(0)
  const [subjectId, setSubjectId] = useState('demo-user')

  const betaMessageEnabled = useFeatureEnabled('betaCounter')
  const showBadge = useFeatureEnabled('showExperimentBadge', true)
  const betaFlagValue = useFeatureFlag('betaCounter')
  const experimentAssignment = useExperimentAssignment<{
    headline: string
    cta: string
  }>('homepage_cta', { subjectId })

  const heading = experimentAssignment.variant.payload?.headline ?? 'RepoC'
  const ctaPrefix = experimentAssignment.variant.payload?.cta ?? 'count is'

  const handleSubjectChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSubjectId(event.target.value)
  }

  return (
    <div className="app-shell">
      <header>
        <h1>
          {heading}
          {showBadge && (
            <span
              className="experiment-badge"
              title={`Reason: ${experimentAssignment.reason}`}
            >
              {experimentAssignment.variant.name}
            </span>
          )}
        </h1>
        <p className="lead">
          Feature flags and experiments are active ? try changing the subject or URL
          overrides to see live updates.
        </p>
      </header>

      <section className="card">
        <label className="label">
          Variation subject
          <input
            value={subjectId}
            onChange={handleSubjectChange}
            placeholder="Enter a subject id"
            aria-label="Experiment subject identifier"
          />
        </label>
        <button onClick={() => setCount((value) => value + 1)}>
          {ctaPrefix} {count}
        </button>
        <p>
          {betaMessageEnabled ? (
            <>
              Beta flag is <strong>enabled</strong> ? the counter is part of a curated
              beta experience.
            </>
          ) : (
            <>Beta flag is disabled ? guests see the default counter messaging.</>
          )}
        </p>
      </section>

      <section className="details">
        <h2>Runtime State</h2>
        <dl>
          <div>
            <dt>Feature flag value</dt>
            <dd>
              <code>betaCounter</code> ? <code>{String(betaFlagValue)}</code>
            </dd>
          </div>
          <div>
            <dt>Experiment variant</dt>
            <dd>
              <code>homepage_cta</code> ? <code>{experimentAssignment.variant.name}</code>
              {experimentAssignment.isFallback && ' (fallback)'}
            </dd>
          </div>
          <div>
            <dt>Assignment reason</dt>
            <dd>{experimentAssignment.reason}</dd>
          </div>
        </dl>
        <p className="hint">
          Tip: append <code>?ff_betaCounter=true&amp;exp_homepage_cta=curious</code> to the URL
          to override both values.
        </p>
      </section>
    </div>
  )
}

export default App
