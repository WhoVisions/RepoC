import { type MouseEvent } from 'react'

type SkipLinkProps = {
  targetId: string
  label?: string
}

function SkipLink({ targetId, label = 'Skip to main content' }: SkipLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (typeof document === 'undefined') {
      return
    }

    event.preventDefault()

    const anchor = event.currentTarget
    const target = document.getElementById(targetId)

    if (target) {
      target.focus({ preventScroll: false })
    } else {
      anchor.blur()
    }
  }

  return (
    <a className="skip-link" href={`#${targetId}`} onClick={handleClick}>
      {label}
    </a>
  )
}

export default SkipLink
