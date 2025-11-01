import { Suspense } from 'react'
import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../src/test-utils/render'
import { BookingPage } from '../../src/modules/booking/pages/BookingPage'

describe('Booking flow', () => {
  it('submits a booking and renders availability', async () => {
    const user = userEvent.setup()

    renderWithProviders(<BookingPage />)

    await screen.findByText('2025-11-05')

    await user.type(screen.getByLabelText(/name/i), 'Taylor Client')
    await user.type(screen.getByLabelText(/email/i), 'taylor@example.com')
    await user.type(screen.getByLabelText(/^date$/i), '2025-11-07')
    await user.type(screen.getByLabelText(/time/i), '10:30')
    await user.clear(screen.getByLabelText(/guests/i))
    await user.type(screen.getByLabelText(/guests/i), '3')
    await user.type(screen.getByLabelText(/notes/i), 'Looking for product photography')

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /submit booking/i }))
    })

    await screen.findByText(/booking confirmed for 2025-11-07 at 10:30/i)
  })
})
