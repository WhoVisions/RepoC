import './App.css'
import CounterCard from './components/CounterCard'
import SkipLink from './components/SkipLink'

function App() {
  return (
    <>
      <SkipLink targetId="main-content" />
      <div className="app-shell">
        <header className="app-header">
          <h1 className="app-title" id="app-title">
            RepoC
          </h1>
          <p className="app-subtitle">
            Accessible counter demo with keyboard shortcuts and ARIA support.
          </p>
        </header>
        <main
          aria-labelledby="app-title"
          className="app-main"
          id="main-content"
          tabIndex={-1}
        >
          <CounterCard />
        </main>
      </div>
    </>
  )
}

export default App
