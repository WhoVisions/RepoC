import { BookingForm } from '../components/BookingForm'
import { AvailabilityPanel } from '../components/AvailabilityPanel'

export function BookingPage() {
  return (
    <section aria-labelledby="booking-page-title">
      <header>
        <h2 id="booking-page-title">Book your RepoC Studio experience</h2>
        <p>
          Check upcoming availability and reserve your session in minutes. A team
          member will follow up within 24 hours.
        </p>
      </header>

      <div className="booking-page__grid">
        <BookingForm />
        <AvailabilityPanel />
      </div>
    </section>
  )
}
