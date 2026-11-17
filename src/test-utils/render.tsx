import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom'

type RenderOptions = {
  route?: string
  routerProps?: Omit<MemoryRouterProps, 'children'>
}

export function renderWithProviders(ui: ReactElement, options: RenderOptions = {}) {
  const { route = '/', routerProps } = options
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  })

  return render(
    <MemoryRouter initialEntries={[route]} {...routerProps}>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </MemoryRouter>
  )
}
