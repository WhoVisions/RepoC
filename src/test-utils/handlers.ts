import { HttpResponse, http } from 'msw'
import type {
  AvailabilitySlot,
  BookingRequest,
  BookingResponse,
  GalleryItem
} from '../shared/lib/api-types'

const galleryMock: GalleryItem[] = [
  {
    id: 'mock-001',
    title: 'Mocked Mountains',
    category: 'landscape',
    imageUrl: '/images/mock/mountains.jpg',
    description: 'A mocked gallery item for tests.'
  }
]

const availabilityMock: AvailabilitySlot[] = [
  {
    date: '2025-11-05',
    available: true,
    timeSlots: ['10:00', '12:00']
  }
]

export const handlers = [
  http.get('/api/gallery', () => HttpResponse.json({ items: galleryMock })),
  http.get('/api/availability', ({ request }) => {
    const url = new URL(request.url)
    const dateQuery = url.searchParams.get('date')

    if (dateQuery) {
      const match = availabilityMock.find((slot) => slot.date === dateQuery)
      return HttpResponse.json({ availability: match ?? null })
    }

    return HttpResponse.json({ availability: availabilityMock })
  }),
  http.post('/api/booking', async ({ request }) => {
    const payload = (await request.json()) as BookingRequest

    const response: BookingResponse = {
      reservationId: 'res_test_123',
      status: 'confirmed',
      message: `Booking confirmed for ${payload.date} at ${payload.time}`
    }

    return HttpResponse.json(response, { status: 201 })
  }),
  http.post('/api/admin/auth', () =>
    HttpResponse.json({ token: 'mock-token', expiresIn: 3600 })
  ),
  http.get('/api/admin/reports', () =>
    HttpResponse.json({ summary: { totalBookings: 1, revenue: 150 } })
  )
]
