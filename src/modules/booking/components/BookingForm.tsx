import { useState } from 'react'
import type { BookingRequest } from '../../../shared/lib/api-types'
import { createBooking } from '../services/bookingService'
import './BookingForm.css'

const initialForm: BookingRequest = {
  name: '',
  email: '',
  date: '',
  time: '',
  guests: 1,
  notes: ''
}

export function BookingForm() {
  const [form, setForm] = useState<BookingRequest>(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const updateField = <Key extends keyof BookingRequest>(key: Key, value: BookingRequest[Key]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await createBooking({ ...form })
      setSuccessMessage(response.message)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create booking'
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit} aria-labelledby="booking-form-title">
      <header>
        <h3 id="booking-form-title">Reserve your session</h3>
        <p>Pick a date, tell us your vision, and we will confirm the details shortly.</p>
      </header>

      <label>
        Name
        <input
          name="name"
          type="text"
          required
          value={form.name}
          onChange={(event) => updateField('name', event.target.value)}
        />
      </label>

      <label>
        Email
        <input
          name="email"
          type="email"
          required
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
        />
      </label>

      <div className="booking-form__row">
        <label>
          Date
          <input
            name="date"
            type="date"
            required
            value={form.date}
            onChange={(event) => updateField('date', event.target.value)}
          />
        </label>
        <label>
          Time
          <input
            name="time"
            type="time"
            required
            value={form.time}
            onChange={(event) => updateField('time', event.target.value)}
          />
        </label>
      </div>

      <label>
        Guests
        <input
          name="guests"
          type="number"
          min={1}
          max={12}
          value={form.guests ?? 1}
          onChange={(event) => updateField('guests', Number(event.target.value))}
        />
      </label>

      <label>
        Notes
        <textarea
          name="notes"
          value={form.notes ?? ''}
          onChange={(event) => updateField('notes', event.target.value)}
          rows={4}
          placeholder="Tell us about your ideal shoot"
        />
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Booking...' : 'Submit booking'}
      </button>

      {successMessage && (
        <p role="status" className="booking-form__success">
          {successMessage}
        </p>
      )}

      {errorMessage && (
        <p role="alert" className="booking-form__error">
          {errorMessage}
        </p>
      )}
    </form>
  )
}
