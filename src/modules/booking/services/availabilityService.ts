import type { AvailabilitySlot } from '../../../shared/lib/api-types'

type AvailabilityResponse = {
  availability: AvailabilitySlot[] | AvailabilitySlot | null
}

export async function fetchAvailability(date?: string): Promise<AvailabilitySlot[] | AvailabilitySlot | null> {
  const endpoint = date ? `/api/availability?date=${encodeURIComponent(date)}` : '/api/availability'

  const response = await fetch(endpoint)

  if (!response.ok) {
    throw new Error(`Failed to load availability: ${response.statusText}`)
  }

  const payload = (await response.json()) as AvailabilityResponse
  return payload.availability ?? []
}
