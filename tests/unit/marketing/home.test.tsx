import { renderWithProviders } from '../../../src/test-utils/render'
import { HomePage } from '../../../src/modules/marketing/pages/HomePage'

describe('HomePage', () => {
  it('renders hero content and call-to-action', () => {
    const { getByRole } = renderWithProviders(<HomePage />)

    expect(
      getByRole('heading', { level: 2, name: /capture stories that matter/i })
    ).toBeInTheDocument()

    const cta = getByRole('link', { name: /book a session/i })
    expect(cta).toHaveAttribute('href', '/booking')
  })
})
