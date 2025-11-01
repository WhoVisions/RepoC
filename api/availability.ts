import type { Handler } from '@netlify/functions'
import type { AvailabilitySlot } from '../src/shared/lib/api-types'

const availability: AvailabilitySlot[] = [
  {
    date: '2025-11-01',
    available: true,
    timeSlots: ['09:00', '11:00', '14:00']
  },
  {
    date: '2025-11-02',
    available: false,
    timeSlots: []
  }
]

export const handler: Handler = async (event) => {
  const queryDate = event.queryStringParameters?.date

  if (queryDate) {
    const match = availability.find((slot) => slot.date === queryDate)
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ availability: match ?? null })
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ availability })
  }
}
