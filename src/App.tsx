import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-lg bg-brand-background px-lg py-xl">
      <section className="flex flex-col items-center gap-sm text-center">
        <span className="inline-flex items-center rounded-full bg-brand-primary/10 px-sm py-2xs text-sm font-semibold text-brand-primary">
          RepoC
        </span>
        <h1 className="text-4xl font-semibold">Design tokens with Tailwind</h1>
        <p className="max-w-xl text-brand-muted">
          A playground for applying brand-aligned colors, typography, and spacing scale directly from Tailwind class utilities.
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
          onClick={() => setCount((current) => current + 1)}
        >
          Increment
        </button>
        <p className="text-sm text-brand-muted">
          Edit{' '}
          <code className="rounded bg-brand-neutral/5 px-xs py-3xs font-mono text-brand-neutral">src/App.tsx</code> and save to test HMR.
        </p>
      </section>
    </main>
  )
}

export default App
