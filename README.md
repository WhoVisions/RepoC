# RepoC

RepoC is a small Vite + React demo that showcases an accessible counter widget. It focuses on inclusive keyboard navigation, ARIA semantics, and clear documentation so the project can be shared publicly with confidence.

## Features
- Accessible counter card with labeled controls and live status updates
- Global skip link for bypassing repeated content
- Keyboard shortcuts for quick increment, decrement, and reset actions
- Modern styling with focus-visible outlines and screen reader instructions

## Keyboard Shortcuts
- **Increase**: `ArrowUp`, `ArrowRight`, `+`
- **Decrease**: `ArrowDown`, `ArrowLeft`, `-`
- **Reset**: `R`, `Escape`, `0`

## Getting Started
```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Lint the project
npm run lint

# Build for production
npm run build
```

## Project Structure
```text
src/
  App.tsx            # Application layout with skip link and main content region
  App.css            # Styling, including focus-visible and skip link treatment
  components/
    CounterCard.tsx  # Accessible counter component
    SkipLink.tsx     # Reusable skip link component
```

## Accessibility Notes
- Interactive elements expose descriptive `aria-label` and `aria-describedby` attributes.
- The counter announces changes via a `role="status"` live region.
- Keyboard shortcuts are declared with `aria-keyshortcuts` and documented above.
- Buttons manage disabled states to prevent keyboard traps.

## Contributing
Issues and pull requests are welcome! Please run `npm run lint` before submitting.

## License
MIT ? RepoC contributors
