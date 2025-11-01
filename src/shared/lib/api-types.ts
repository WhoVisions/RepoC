export type GalleryItem = {
  id: string
  title: string
  category: string
  imageUrl: string
  description?: string
}

export type AvailabilitySlot = {
  date: string
  available: boolean
  timeSlots: string[]
}

export type BookingRequest = {
  name: string
  email: string
  date: string
  time: string
  guests?: number
  notes?: string
}

export type BookingResponse = {
  reservationId: string
  status: 'confirmed' | 'waitlisted'
  message: string
}

export type ApiError = {
  statusCode: number
  message: string
  details?: Record<string, unknown>
}
