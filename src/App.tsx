import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { AppProviders } from './app/AppProviders'
import { HomePage } from './modules/marketing/pages/HomePage'
import { GalleryPage } from './modules/gallery/pages/GalleryPage'
import { BookingPage } from './modules/booking/pages/BookingPage'
import { AdminPage } from './modules/admin/pages/AdminPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
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
          </header>
          <main className="layout__main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
        </div>
      </AppProviders>
    </BrowserRouter>
  )
}

export default App
