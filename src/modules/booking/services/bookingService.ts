import type { BookingRequest, BookingResponse } from '../../../shared/lib/api-types'

export async function createBooking(payload: BookingRequest): Promise<BookingResponse> {
  const response = await fetch('/api/booking', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }))
    throw new Error(error.message ?? 'Unable to create booking')
  }

  return (await response.json()) as BookingResponse
}
