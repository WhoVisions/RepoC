import { useQuery } from '@tanstack/react-query'
import type { AvailabilitySlot } from '../../../shared/lib/api-types'
import { fetchAvailability } from '../services/availabilityService'

export function useAvailabilityQuery(date?: string) {
  return useQuery<AvailabilitySlot[] | AvailabilitySlot | null, Error>({
    queryKey: ['availability', date ?? 'all'],
    queryFn: () => fetchAvailability(date),
    suspense: false
  })
}
