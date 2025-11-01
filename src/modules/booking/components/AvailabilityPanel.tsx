import { useState } from 'react'
import type { AvailabilitySlot } from '../../../shared/lib/api-types'
import { useAvailabilityQuery } from '../hooks/useAvailabilityQuery'
import './AvailabilityPanel.css'

function toArray(data: AvailabilitySlot[] | AvailabilitySlot | null): AvailabilitySlot[] {
  if (!data) return []
  return Array.isArray(data) ? data : [data]
}

export function AvailabilityPanel() {
  const [selectedDate, setSelectedDate] = useState<string | undefined>()
  const { data, isLoading, isError, error } = useAvailabilityQuery(selectedDate)
  const slots = toArray(data ?? [])

  return (
    <aside className="availability-panel" aria-labelledby="availability-heading">
      <h3 id="availability-heading">Upcoming availability</h3>
      <p>Select a date to filter timeslots before submitting your booking.</p>

      <label className="availability-panel__filter">
        Filter by date
        <input
          type="date"
          value={selectedDate ?? ''}
          onChange={(event) => setSelectedDate(event.target.value || undefined)}
        />
      </label>

      {isLoading && <p role="status">Loading availability...</p>}

      {isError && (
        <p role="alert">{error?.message ?? 'Failed to load availability'}</p>
      )}

      {!isLoading && !isError && slots.length === 0 && (
        <p role="status">No open timeslots for the selected range.</p>
      )}

      {!isLoading && !isError && slots.length > 0 && (
        <ul className="availability-panel__list">
          {slots.map((slot) => (
            <li key={slot.date}>
              <strong>{slot.date}</strong>
              <span>{slot.available ? slot.timeSlots.join(', ') : 'Fully booked'}</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
