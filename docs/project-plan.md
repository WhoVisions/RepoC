## Project Plan

### Goals
- Replace Vite starter with a modular, production-ready app that handles marketing content, a visual gallery, customer bookings, and admin workflows.
- Expose booking and gallery data through an internal API surface (edge/serverless friendly) to share logic between client UI and automated jobs.
- Ship with a clear testing strategy and repeatable Netlify deployment steps.

### Proposed Top-Level Structure
- `package.json`: expand scripts to cover linting, typechecking, unit/E2E tests, and API function builds.
- `netlify.toml`: define site build (`npm run build`), functions folder, and environment-specific redirects.
- `src/`: React SPA organized by feature modules and shared layers.
- `api/`: standalone serverless functions (Netlify Functions) for bookings, gallery assets, and admin utilities.
- `tests/`: cross-cutting test suites (component, integration, smoke) with shared fixtures and mocks.

```
/
?? src/
?  ?? app/                # routing, providers, global services
?  ?? modules/
?  ?  ?? marketing/
?  ?  ?  ?? components/
?  ?  ?  ?? pages/
?  ?  ?  ?? content/      # markdown/json data for hero, features, FAQ
?  ?  ?? gallery/
?  ?  ?  ?? components/   # gallery grid, filters, lightbox
?  ?  ?  ?? hooks/        # data fetching, caching
?  ?  ?  ?? services/     # API client for gallery endpoints
?  ?  ?? booking/
?  ?  ?  ?? components/   # form, date picker, availability list
?  ?  ?  ?? hooks/        # booking state machine, validation
?  ?  ?  ?? services/     # API client for booking endpoints
?  ?  ?? admin/
?  ?     ?? components/   # dashboards, CRUD tables
?  ?     ?? pages/        # protected routes (login, overview)
?  ?? shared/
?  ?  ?? components/      # buttons, layout primitives
?  ?  ?? hooks/           # auth, analytics, feature flags
?  ?  ?? lib/             # utilities (date, formatting, API helper)
?  ?  ?? styles/          # global tokens, mixins, themes
?  ?? test-utils/         # custom render, mock server, data builders
?? api/
?  ?? gallery.ts          # GET /gallery ? list & filter assets
?  ?? booking.ts          # POST /booking ? create reservation
?  ?? availability.ts     # GET /availability ? used by booking form
?  ?? admin/
?     ?? auth.ts          # Admin auth (e.g., Netlify Identity)
?     ?? reports.ts       # CSV exports, metrics
?? tests/
?  ?? unit/               # Vitest suites per module
?  ?? integration/        # Modules interacting with API mocks
?  ?? e2e/                # Playwright/Cypress for marketing + booking
?? netlify.toml           # build + redirects + function config
```

### Module Details
- **Marketing (`src/modules/marketing`)**: SSR-friendly components for hero, features, testimonials; content-driven via JSON/Markdown; hook for A/B testing.
- **Gallery (`src/modules/gallery`)**: lazy-loaded routes, responsive grid, optional infinite scroll; hooks connect to `/api/gallery`. Add image optimization via Netlify Image CDN.
- **Booking (`src/modules/booking`)**: multi-step form with validation (`zod`), date picker, availability fetch, payments stub. Shared state machine (XState or reducer) for resiliency.
- **Admin (`src/modules/admin`)**: protected routes using `react-router` guards and Netlify Identity/JWT; dashboards built with headless table library; feature flags for beta tools.
- **API (`/api`)**: Netlify Functions, authored in TypeScript, sharing DTOs and validation schemas with front-end via `src/shared/lib`. Use modular service layer (e.g., `services/bookingService.ts`) for business logic; include mock data provider for local dev (toggle via env).

### Testing Strategy
- **Unit**: Vitest + Testing Library for components/hooks; snapshot for marketing sections; contract tests for API clients.
- **Integration**: Vitest with MSW to mock Netlify Functions; ensure booking flow handles success/errors; gallery caching logic under load.
- **E2E**: Add Playwright (extend `package.json` devDeps) to cover marketing navigation, gallery filtering, booking submission, admin login guard.
- **CI Checks**: Add `npm run typecheck` (tsc --noEmit), `npm run test:unit`, `npm run test:e2e` (conditional for CI) and integrate with Netlify build hooks.

### Deployment Notes (Netlify)
- Create `netlify.toml`:
  - `[build]` with `command = "npm run build"` and `publish = "dist"`.
  - `[functions]` with `directory = "netlify/functions"` or point directly to `/api` after transpile.
  - Redirect `/api/*` to Netlify Functions (`/api/:splat` with `status = 200` and `force = true`).
- Use Netlify Edge Functions for caching gallery responses; configure in `netlify.toml` under `[edge_functions]`.
- Set environment variables (`MARKETING_API`, `BOOKING_DB_URL`) in Netlify dashboard; mirror via `.env.example` locally.
- Automate previews via Netlify Deploy Previews; run unit + integration tests in `netlify.toml` `[build.environment]` or Netlify Build Plugins.

### Next Steps
- Scaffold directories (`mkdir -p src/modules/...`, `api/`, `tests/`).
- Update `package.json` scripts and add dependencies (`react-router-dom`, `zod`, `@tanstack/react-query`, `msw`, `playwright`).
- Author baseline Netlify Function handlers and add MSW mocks.
- Write smoke tests for marketing/booking flows before feature build-out.
