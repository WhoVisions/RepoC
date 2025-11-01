import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  hydrateOverridesFromSearch,
  registerExperiments,
  registerFeatureFlags,
} from './lib/experiments.ts'

registerFeatureFlags({
  betaCounter: {
    defaultValue: false,
    description: 'Adds beta messaging to the counter card when enabled.',
  },
  showExperimentBadge: {
    defaultValue: true,
    description: 'Shows the active experiment variant next to the headline.',
  },
})

registerExperiments([
  {
    key: 'homepage_cta',
    fallbackVariant: 'control',
    linkedFlag: 'showExperimentBadge',
    variants: [
      {
        name: 'control',
        weight: 1,
        payload: {
          headline: 'RepoC',
          cta: 'count is',
        },
        description: 'Default copy with the classic RepoC headline.',
      },
      {
        name: 'curious',
        weight: 1,
        payload: {
          headline: 'RepoC Labs',
          cta: 'experiments say count is',
        },
        description: 'Alternative copy that highlights ongoing experiments.',
      },
    ],
  },
])

hydrateOverridesFromSearch()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
