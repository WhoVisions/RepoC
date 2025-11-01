import type { Handler } from '@netlify/functions'
import { z } from 'zod'
import type { BookingRequest, BookingResponse } from '../src/shared/lib/api-types'

const bookingSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  date: z.string().regex(/\d{4}-\d{2}-\d{2}/, 'date must be YYYY-MM-DD'),
  time: z.string().min(1),
  guests: z.number().positive().int().max(12).optional(),
  notes: z.string().max(500).optional()
})

const makeResponse = (statusCode: number, payload: unknown) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return makeResponse(405, { message: 'Method Not Allowed' })
  }

  if (!event.body) {
    return makeResponse(400, { message: 'Missing booking payload' })
  }

  let parsedBody: BookingRequest
  try {
    parsedBody = JSON.parse(event.body)
  } catch (error) {
    return makeResponse(400, { message: 'Invalid JSON body' })
  }

  const validation = bookingSchema.safeParse(parsedBody)

  if (!validation.success) {
    return makeResponse(422, {
      message: 'Invalid booking details',
      issues: validation.error.flatten()
    })
  }

  const response: BookingResponse = {
    reservationId: `res_${Date.now()}`,
    status: 'confirmed',
    message: `Thanks ${validation.data.name}, your booking is confirmed for ${validation.data.date} at ${validation.data.time}.`
  }

  return makeResponse(201, response)
}
