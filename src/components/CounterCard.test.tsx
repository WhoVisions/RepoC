import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import CounterCard from './CounterCard'

describe('CounterCard', () => {
  it('updates status text when using buttons', async () => {
    const user = userEvent.setup()
    render(<CounterCard />)

    const groups = screen.getAllByRole('group', { name: /counter controls/i })
    const card = groups[groups.length - 1]
    const status = within(card).getByRole('status')
    const incrementButton = within(card).getByRole('button', { name: /increase counter/i })
    const decrementButton = within(card).getByRole('button', { name: /decrease counter/i })
    const resetButton = within(card).getByRole('button', { name: /reset counter/i })

    expect(status).toHaveTextContent('0 items selected')
    expect(decrementButton).toBeDisabled()
    expect(resetButton).toBeDisabled()

    await user.click(incrementButton)

    expect(status).toHaveTextContent('1 item selected')
    expect(decrementButton).not.toBeDisabled()
    expect(resetButton).not.toBeDisabled()
  })

  it('supports keyboard shortcuts for incrementing and resetting', async () => {
    render(<CounterCard />)

    const groups = screen.getAllByRole('group', { name: /counter controls/i })
    const group = groups[groups.length - 1]
    const status = within(group).getByRole('status')

    group.focus()

    fireEvent.keyDown(group, { key: 'ArrowUp' })
    expect(status).toHaveTextContent('1 item selected')

    fireEvent.keyDown(group, { key: 'ArrowRight' })
    expect(status).toHaveTextContent('2 items selected')

    fireEvent.keyDown(group, { key: 'r' })
    expect(status).toHaveTextContent('0 items selected')
  })
})
