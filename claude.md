# RepoC - Comprehensive Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Core Features](#core-features)
6. [Library Modules](#library-modules)
7. [API Schemas](#api-schemas)
8. [Build Configuration](#build-configuration)
9. [Development Workflow](#development-workflow)
10. [Known Issues and Fixes](#known-issues-and-fixes)

---

## Project Overview

**RepoC** is a React-based web application built with Vite and TypeScript. The project demonstrates several advanced patterns including:
- Feature flag and experiment management
- Analytics consent tracking
- Persistent chat memory with localStorage/sessionStorage
- API request/response validation schemas
- Distributed tracing utilities

The application serves as a foundation for building data-driven applications with sophisticated feature management and analytics capabilities.

---

## Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────┐
│          React Application              │
│         (Vite + TypeScript)             │
├─────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │Analytics │  │Experiments│  │Tracing ││
│  │ System   │  │  Engine   │  │ Layer  ││
│  └──────────┘  └──────────┘  └────────┘│
├─────────────────────────────────────────┤
│  ┌──────────────────────────────────┐  │
│  │    Persistent Chat Memory        │  │
│  │  (localStorage/sessionStorage)   │  │
│  └──────────────────────────────────┘  │
├─────────────────────────────────────────┤
│  ┌──────────────────────────────────┐  │
│  │      API Schema Validation       │  │
│  │   (Booking & Gallery APIs)       │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## Technology Stack

### Core Dependencies
- **React** 18.2.0 - UI library
- **React DOM** 18.2.0 - DOM rendering
- **TypeScript** 5.2.2 - Type-safe development

### Build Tools
- **Vite** 5.0.8 - Fast build tool and dev server
- **@vitejs/plugin-react** 4.2.1 - React plugin for Vite

### Development Tools
- **ESLint** 8.55.0 - Code linting
- **@typescript-eslint/eslint-plugin** 6.14.0 - TypeScript linting rules
- **@typescript-eslint/parser** 6.14.0 - TypeScript parser for ESLint
- **eslint-plugin-react-hooks** 4.6.0 - React Hooks linting
- **eslint-plugin-react-refresh** 0.4.5 - React Refresh linting

---

## Project Structure

```
RepoC/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── schemas.ts          # API validation schemas
│   │   └── services/
│   │       └── page.tsx            # Services page component
│   ├── lib/
│   │   ├── hooks/
│   │   │   └── usePersistentChatMemory.ts  # Persistent chat hook
│   │   ├── analytics.ts            # Analytics system
│   │   ├── experiments.ts          # Feature flags & experiments
│   │   └── logger.ts               # Distributed tracing
│   ├── App.tsx                     # Main application component
│   ├── App.css                     # Application styles
│   ├── main.tsx                    # Application entry point
│   ├── index.css                   # Global styles
│   └── middleware.ts               # Middleware (future use)
├── dist/                           # Build output directory
├── index.html                      # HTML entry point
├── vite.config.ts                  # Vite configuration
├── tsconfig.json                   # TypeScript configuration
├── tsconfig.node.json              # Node TypeScript config
├── .eslintrc.cjs                   # ESLint configuration
├── package.json                    # Project dependencies
└── README.md                       # Project README

```

---

## Core Features

### 1. Main Application (App.tsx)

The main application component demonstrates:
- **Analytics Consent Banner**: GDPR-compliant consent management
- **Event Tracking**: User interaction tracking
- **State Persistence**: Stores consent preferences in localStorage
- **Counter Demo**: Simple interactive counter with analytics tracking

**Key Features**:
```typescript
// Analytics consent management
const [analyticsConsent, setAnalyticsConsentState] = useState<boolean | null>(null)

// Event tracking on consent
useEffect(() => {
  if (analyticsConsent) {
    trackEvent({ name: 'app_view' })
  }
}, [analyticsConsent])

// Track user interactions
const handleIncrement = () => {
  setCount((prev) => {
    const next = prev + 1
    trackEvent({ name: 'counter_increment', payload: { value: next } })
    return next
  })
}
```

**File Location**: `src/App.tsx:1`

---

## Library Modules

### 1. Analytics System (`src/lib/analytics.ts`)

A privacy-focused analytics system with consent management.

**Features**:
- Consent-based tracking (no data sent without user approval)
- localStorage persistence for consent preferences
- Event tracking with custom payloads
- Lazy initialization (only loads when consent granted)

**Key Functions**:
```typescript
// Set user consent and persist to storage
setAnalyticsConsent(value: boolean): void

// Check if consent has been granted
hasAnalyticsConsent(): boolean

// Track events with optional metadata
trackEvent({ name, payload }: AnalyticsEvent): void

// Initialize analytics from stored consent
setupAnalyticsFromStorage(): void
```

**Usage Example**:
```typescript
import { setAnalyticsConsent, trackEvent } from './lib/analytics'

// Request consent
setAnalyticsConsent(true)

// Track an event
trackEvent({
  name: 'button_click',
  payload: { buttonId: 'submit' }
})
```

**File Location**: `src/lib/analytics.ts:1`

---

### 2. Feature Flags & Experiments (`src/lib/experiments.ts`)

A comprehensive feature flag and A/B testing system with React hooks integration.

**Core Concepts**:
- **Feature Flags**: Boolean/number/string values for feature toggles
- **Experiments**: Weighted variant assignment for A/B/n testing
- **Overrides**: URL parameter and manual overrides for testing
- **Linked Flags**: Disable experiments when a flag is off

**Feature Flag API**:
```typescript
// Register feature flags
registerFeatureFlags({
  'dark_mode': true,
  'max_upload_size': { defaultValue: 10, description: 'Max MB' }
})

// Check if feature is enabled
const isDarkMode = isFeatureEnabled('dark_mode')

// Get feature value
const maxSize = getFeatureFlag('max_upload_size')

// React hook
const darkMode = useFeatureEnabled('dark_mode')
```

**Experiment API**:
```typescript
// Register an experiment
registerExperiment({
  key: 'checkout_flow',
  variants: [
    { name: 'control', weight: 1 },
    { name: 'variant_a', weight: 1, payload: { color: 'blue' } },
    { name: 'variant_b', weight: 1, payload: { color: 'green' } }
  ],
  fallbackVariant: 'control',
  linkedFlag: 'enable_ab_tests'
})

// Get assignment (consistent per user ID)
const assignment = getExperimentAssignment('checkout_flow', {
  subjectId: userId
})

// React hook
const variant = useExperimentVariant('checkout_flow', {
  subjectId: userId
})
```

**URL Override Support**:
```typescript
// Enable via URL: ?ff_dark_mode=true&exp_checkout_flow=variant_a
hydrateOverridesFromSearch()
```

**Advanced Features**:
- Deterministic variant assignment using FNV-1a hashing
- Weighted distribution for gradual rollouts
- Server-side rendering compatible
- TypeScript generics for type-safe payloads
- Global state subscription with `useSyncExternalStore`

**File Location**: `src/lib/experiments.ts:1`

---

### 3. Distributed Tracing (`src/lib/logger.ts`)

A lightweight tracing system for debugging API calls and route changes.

**Trace Categories**:
- `api:request` - Outgoing API requests
- `api:response` - API responses with status codes
- `route:navigate` - Client-side navigation events

**Key Functions**:
```typescript
// Trace an API request
traceApiRequest('GET', '/api/users', { userId: 123 })

// Trace an API response
traceApiResponse('POST', '/api/bookings', 201, { bookingId: 'abc' })

// Trace route changes
traceRouteChange('/home', '/profile', { userId: 123 })

// Register custom trace sink
registerTraceSink((entry: TraceLog) => {
  sendToMonitoring(entry)
})
```

**Trace Log Format**:
```typescript
interface TraceLog {
  timestamp: string      // ISO 8601 timestamp
  category: TraceCategory
  message: string
  metadata?: Record<string, unknown>
}
```

**Output Example**:
```
[trace] 2025-11-13T19:31:00.000Z api:request GET /api/users {"userId":123}
[trace] 2025-11-13T19:31:00.150Z api:response GET /api/users -> 200 {"count":10}
```

**File Location**: `src/lib/logger.ts:1`

---

### 4. Persistent Chat Memory (`src/lib/hooks/usePersistentChatMemory.ts`)

A production-ready React hook for managing chat message history with automatic persistence.

**Features**:
- **Storage Options**: localStorage (persistent) or sessionStorage (tab-scoped)
- **Tab Synchronization**: Real-time sync across browser tabs
- **Error Handling**: Graceful fallback when storage is unavailable
- **Type Safety**: Generic support for custom message types
- **Hydration**: Lazy loading from storage after mount
- **Custom Serialization**: Override JSON serialization if needed

**Basic Usage**:
```typescript
import { useLocalChatMemory } from './lib/hooks/usePersistentChatMemory'

function ChatComponent() {
  const {
    messages,
    appendMessage,
    clearMessages,
    isHydrated,
    error
  } = useLocalChatMemory({
    storageKey: 'my-chat',
    initialMessages: []
  })

  const sendMessage = (content: string) => {
    appendMessage({
      id: crypto.randomUUID(),
      role: 'user',
      content,
      createdAt: new Date().toISOString()
    })
  }

  if (!isHydrated) return <div>Loading...</div>

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
    </div>
  )
}
```

**Advanced Usage with Custom Types**:
```typescript
interface CustomMessage {
  id: string
  text: string
  userId: string
  timestamp: number
}

const { messages, updateMessage, removeMessage } =
  useLocalChatMemory<CustomMessage>({
    storageKey: 'custom-chat',
    initialMessages: [],
    syncTabs: true,
    serializer: (msgs) => JSON.stringify(msgs),
    parser: (raw) => JSON.parse(raw)
  })

// Update a specific message
updateMessage(
  (msg, idx) => msg.id === targetId,
  (msg, idx) => ({ ...msg, text: 'Updated!' })
)

// Remove a message
removeMessage((msg, idx) => msg.id === targetId)
```

**Available Hooks**:
- `useLocalChatMemory` - Uses localStorage (persistent across sessions)
- `useSessionChatMemory` - Uses sessionStorage (cleared on tab close)

**API Reference**:
```typescript
interface PersistentChatMemoryResult<TMessage> {
  messages: TMessage[]                          // Current messages
  setMessages: Dispatch<SetStateAction<TMessage[]>>  // Replace all messages
  appendMessage: (msg: TMessage | ((prev) => TMessage)) => void
  updateMessage: (matcher, updater) => void     // Update matching messages
  removeMessage: (matcher) => void              // Remove matching messages
  replaceMessages: (msgs) => void               // Alias for setMessages
  clearMessages: () => void                     // Remove all messages
  reload: () => void                            // Reload from storage
  storageKey: string                            // The key used in storage
  isHydrated: boolean                           // True when loaded from storage
  error: Error | null                           // Latest error if any
  isStorageAvailable: boolean                   // True if storage works
}
```

**File Location**: `src/lib/hooks/usePersistentChatMemory.ts:1`

---

## API Schemas

### Booking API (`src/app/api/schemas.ts`)

Framework-agnostic request/response validation for booking operations.

**Request Schema**:
```typescript
interface BookingRequest {
  guestName: string           // Required, non-empty
  email: string               // Required, valid email
  phone?: string              // Optional phone number
  checkInDate: string         // ISO 8601 date (YYYY-MM-DD)
  checkOutDate: string        // ISO 8601 date, must be after check-in
  guests: number              // Positive integer
  specialRequests?: string    // Optional text
}
```

**Validation**:
```typescript
import { validateBookingRequest } from './app/api/schemas'

const result = validateBookingRequest({
  guestName: 'John Doe',
  email: 'john@example.com',
  checkInDate: '2025-12-01',
  checkOutDate: '2025-12-05',
  guests: 2
})

if (result.success) {
  // result.data is a validated BookingRequest
  processBooking(result.data)
} else {
  // result.errors contains ValidationError[]
  console.error(result.errors)
}
```

**Response Types**:
```typescript
type BookingResponse =
  | { success: true; bookingId: string; message?: string }
  | { success: false; errors: ValidationError[] }
```

**File Location**: `src/app/api/schemas.ts:18`

---

### Gallery API (`src/app/api/schemas.ts`)

Schema for fetching and filtering gallery images.

**Request Schema**:
```typescript
interface GalleryFetchRequest {
  category?: string           // Filter by category
  tags?: string[]             // Filter by tags
  limit?: number              // Items per page (1-100, default 24)
  offset?: number             // Pagination offset (default 0)
  includeFeatured?: boolean   // Include featured images (default false)
}
```

**Image Schema**:
```typescript
interface GalleryImage {
  id: string
  url: string
  altText: string
  categories: string[]
  tags: string[]
  isFeatured: boolean
  uploadedAt: string          // ISO 8601 timestamp
}
```

**Validation**:
```typescript
import { validateGalleryFetchRequest } from './app/api/schemas'

const result = validateGalleryFetchRequest({
  category: 'nature',
  tags: ['sunset', 'beach'],
  limit: 20,
  offset: 0,
  includeFeatured: true
})

if (result.success) {
  // result.data is normalized with defaults applied
  fetchGallery(result.data)
}
```

**Response Type**:
```typescript
type GalleryFetchResponse =
  | {
      success: true
      total: number
      images: GalleryImage[]
      nextOffset?: number
    }
  | {
      success: false
      errors: ValidationError[]
    }
```

**File Location**: `src/app/api/schemas.ts:120`

---

## Build Configuration

### Vite Configuration (`vite.config.ts`)

Simple Vite configuration with React plugin:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**File Location**: `vite.config.ts:1`

---

### TypeScript Configuration

**Main Config** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Node Config** (`tsconfig.node.json`):
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

---

## Development Workflow

### Available Scripts

```bash
# Development server with HMR
npm run dev

# Production build (TypeScript check + Vite build)
npm run build

# Preview production build locally
npm run preview

# Lint TypeScript/TSX files
npm run lint
```

### Development Server
```bash
npm run dev
```
- Starts Vite dev server (usually http://localhost:5173)
- Hot Module Replacement (HMR) enabled
- Fast refresh for React components

### Building for Production
```bash
npm run build
```
1. Runs `tsc` for type checking
2. Runs `vite build` to create optimized bundle
3. Output directory: `dist/`

**Build Output**:
```
dist/
├── index.html               # Entry HTML
├── assets/
│   ├── index-[hash].css    # Bundled styles (~1.5 KB)
│   └── index-[hash].js     # Bundled JavaScript (~145 KB)
```

### Preview Build
```bash
npm run preview
```
- Serves the production build locally
- Useful for testing optimized bundle before deployment

---

## Known Issues and Fixes

### Issue 1: Build System Mismatch ✅ FIXED

**Problem**: The project had Next.js scripts in `package.json` but was actually configured for Vite (had `vite.config.ts` and `index.html`).

**Solution**: Updated `package.json` to use Vite:
- Changed scripts from `next dev/build/start` to `vite/vite build/vite preview`
- Removed Next.js dependencies
- Added Vite and related plugins

**File Modified**: `package.json:5-9`

---

### Issue 2: TypeScript Type Errors in schemas.ts ✅ FIXED

**Problem**: TypeScript errors due to `unknown` types from destructured object:
```
error TS18046: 'guests' is of type 'unknown'
error TS18046: 'guestName' is of type 'unknown'
```

**Solution**: Added type assertions after validation checks in `validateBookingRequest`:
```typescript
// Before validation, types are unknown
const { guestName, email, guests, ... } = input

// After validation passes, safe to assert types
return {
  success: true,
  data: {
    guestName: (guestName as string).trim(),
    email: (email as string).trim(),
    guests: guests as number,
    // ...
  }
}
```

**File Modified**: `src/app/api/schemas.ts:89-109`

---

## Best Practices

### 1. Feature Flag Management
- Always provide descriptive names and descriptions for flags
- Use URL overrides for testing: `?ff_flagName=true`
- Link experiments to flags to disable during incidents
- Use weighted variants for gradual rollouts

### 2. Analytics
- Always request consent before tracking
- Track meaningful events (not every click)
- Include relevant context in event payloads
- Test analytics in dev with console output

### 3. API Validation
- Always validate user input on both client and server
- Return structured error objects with field-level errors
- Use TypeScript discriminated unions for responses
- Provide clear, actionable error messages

### 4. State Management
- Use persistent hooks for data that should survive refreshes
- Use session storage for temporary, tab-scoped data
- Handle storage unavailability gracefully
- Always check `isHydrated` before rendering

---

## Deployment

### Static Hosting (Recommended)

After building, deploy the `dist/` folder to any static host:

**Vercel**:
```bash
npm run build
vercel --prod
```

**Netlify**:
```bash
npm run build
netlify deploy --prod --dir=dist
```

**GitHub Pages**:
```bash
npm run build
# Copy dist/ to gh-pages branch
```

### Environment Variables

Create a `.env` file for environment-specific config:
```env
VITE_API_BASE_URL=https://api.example.com
VITE_ANALYTICS_KEY=your-key-here
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

---

## Future Enhancements

### Recommended Additions
1. **Router**: Add React Router for multi-page navigation
2. **State Management**: Consider Zustand or Redux for complex state
3. **UI Library**: Add Tailwind CSS or Material-UI for styling
4. **API Client**: Integrate axios or fetch wrapper with retry logic
5. **Testing**: Add Vitest for unit tests, Playwright for E2E
6. **CI/CD**: Set up GitHub Actions for automated builds
7. **Monitoring**: Integrate Sentry or similar for error tracking

### Middleware (`src/middleware.ts`)
Currently empty - can be used for:
- Authentication checks
- Request/response transformation
- Rate limiting
- CORS handling

---

## Contributing

### Code Style
- Use TypeScript for all new code
- Follow ESLint rules (run `npm run lint`)
- Use functional components with hooks
- Prefer named exports over default exports
- Add JSDoc comments for public APIs

### Git Workflow
1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit: `git commit -m "feat: add feature"`
3. Run linter: `npm run lint`
4. Build to verify: `npm run build`
5. Push and create PR

---

## License

ISC License - See `package.json` for details.

---

## Support

For issues or questions:
1. Check this documentation
2. Review the source code comments
3. Open an issue in the repository

---

**Last Updated**: 2025-11-13
**Version**: 1.0.0
