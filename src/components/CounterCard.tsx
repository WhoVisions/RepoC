import { useId, useState, type KeyboardEvent } from 'react'

const MIN_COUNT = 0

const shortcutInstructions =
  'Use Arrow Up or Arrow Right to increase, Arrow Down or Arrow Left to decrease, and R to reset the counter.'

const clampToMin = (value: number) => Math.max(value, MIN_COUNT)

const humanizeCount = (count: number) =>
  count === 1 ? '1 item selected' : `${count} items selected`

const getShortcutLabel = (keys: string[]) => keys.join(' ')

function CounterCard() {
  const descriptionId = useId()
  const titleId = `${descriptionId}-title`
  const messageId = `${descriptionId}-message`
  const shortcutId = `${descriptionId}-shortcuts`

  const [count, setCount] = useState(0)

  const increment = () => setCount((value) => value + 1)
  const decrement = () => setCount((value) => clampToMin(value - 1))
  const reset = () => setCount(MIN_COUNT)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null

    if (target?.closest('button, a')) {
      return
    }

    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowRight':
      case '+':
        event.preventDefault()
        increment()
        break
      case 'ArrowDown':
      case 'ArrowLeft':
      case '-':
        event.preventDefault()
        decrement()
        break
      case 'r':
      case 'R':
      case 'Escape':
      case '0':
        event.preventDefault()
        reset()
        break
      default:
        break
    }
  }

  return (
    <section
      aria-describedby={`${messageId} ${shortcutId}`}
      aria-labelledby={titleId}
      className="card counter-card"
      onKeyDown={handleKeyDown}
      role="group"
      tabIndex={0}
    >
      <h2 id={titleId}>Counter controls</h2>
      <p id={messageId} role="status">
        {humanizeCount(count)}
      </p>
      <p className="sr-only" id={shortcutId}>
        {shortcutInstructions}
      </p>

      <div className="card-controls" role="toolbar" aria-label="Counter actions">
        <button
          aria-describedby={`${messageId} ${shortcutId}`}
          aria-keyshortcuts={getShortcutLabel(['ArrowUp', 'ArrowRight', '+'])}
          aria-label="Increase counter"
          onClick={increment}
          type="button"
        >
          Increment
        </button>
        <button
          aria-describedby={`${messageId} ${shortcutId}`}
          aria-keyshortcuts={getShortcutLabel(['ArrowDown', 'ArrowLeft', '-'])}
          aria-label="Decrease counter"
          disabled={count === MIN_COUNT}
          onClick={decrement}
          type="button"
        >
          Decrement
        </button>
        <button
          aria-describedby={`${messageId} ${shortcutId}`}
          aria-keyshortcuts={getShortcutLabel(['R', 'Escape', '0'])}
          aria-label="Reset counter"
          disabled={count === MIN_COUNT}
          onClick={reset}
          type="button"
        >
          Reset
        </button>
      </div>
    </section>
  )
}

export default CounterCard
