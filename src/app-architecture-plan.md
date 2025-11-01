## Who Visions Next.js App Structure Plan

### 1. Goals
- Support rapid iteration on Who Visions experiences with a modular, type-safe React codebase.
- Keep presentation, domain logic, and platform utilities clearly separated to aid testing and reusability.
- Leverage Next.js App Router conventions while accommodating future API integrations and automation workflows.
- Provide a clear migration path from the current Vite/React starter toward the target Next.js architecture.

### 2. Current State Review
- Repository currently uses Vite with a single `src/App.tsx` entry point and minimal global styling.
- No routing, API abstraction, or shared component library exists yet, so introducing structure now will minimize churn later.
- Testing setup relies on Vitest but has no organized test suites; no Storybook or design system is in place.

### 3. Directory Overview
```
/
+-- next.config.mjs
+-- package.json
+-- public/
|   +-- images/
+-- src/
|   +-- app/
|   |   +-- (marketing)/
|   |   |   +-- layout.tsx
|   |   |   +-- page.tsx
|   |   +-- (dashboard)/
|   |   |   +-- layout.tsx
|   |   |   +-- page.tsx
|   |   +-- api/
|   |   |   +-- visions/
|   |   |       +-- route.ts
|   |   +-- layout.tsx
|   |   +-- page.tsx
|   +-- components/
|   |   +-- ui/
|   |   +-- layouts/
|   |   +-- feedback/
|   +-- lib/
|   |   +-- api/
|   |   +-- analytics/
|   |   +-- auth/
|   |   +-- utils/
|   +-- styles/
+-- api/
|   +-- clients/
|   +-- schemas/
|   +-- services/
+-- tests/
|   +-- e2e/
|   +-- integration/
|   +-- unit/
+-- scripts/
```

### 4. Src/App
- **Segmented routes:** Group key user flows into route groups such as `(marketing)` for public storytelling and `(dashboard)` for authenticated creators.
- **Shared layout:** The root `layout.tsx` wires global providers (theme, auth, analytics) and imports base styles from `src/styles`. Route-group layouts add contextual chrome (dashboard nav, marketing footer, etc.).
- **Routing conventions:** Collocate route-specific server actions, metadata, and loading/error boundaries within each route folder for clarity.
- **Page modules:** Favor small server components that coordinate data fetching via `src/lib/api` helpers, then compose UI components from `src/components`.
- **Server actions and API routes:** Delegate to `/api/services` for core logic, keeping `src/app/api/*/route.ts` handlers lightweight.

### 5. Src/Components
- **`ui/`:** Reusable primitives (buttons, cards, form inputs) with Tailwind or CSS Modules, designed for both marketing and app surfaces.
- **`layouts/`:** Higher-level shells (dashboard frame, marketing hero) that orchestrate page sections and data wiring.
- **`feedback/`:** Toasts, dialogs, loaders, and other interaction responses. Integrate with `src/lib/analytics` to capture engagement events.
- **Documentation:** Optionally colocate Storybook stories or MDX usage notes alongside components as the system matures.

### 6. Src/Lib
- **`api/`:** Fetchers and server actions. Centralize REST/GraphQL client configuration, apply Zod schemas from `/api/schemas`, and expose typed client hooks.
- **`analytics/`:** Tracking helpers (e.g., Segment, PostHog). Provide a generic `track` wrapper so UI code remains provider-agnostic.
- **`auth/`:** Session utilities, cookie parsing, and role-based helpers. Integrate with NextAuth or custom middleware when required.
- **`utils/`:** Pure helper functions for formatting, dates, and feature flags. Keep small and well-tested.

### 7. API Layer (Root `/api`)
- **`clients/`:** External service wrappers (CRM, content store, AI services). Implement retry/backoff and consistent error handling.
- **`schemas/`:** Shared Zod/TypeScript schemas validating payloads across server-client boundaries; import into `src/lib/api` and route handlers.
- **`services/`:** Domain-oriented orchestration (e.g., 'generate vision board'). Expose functions consumed by Next.js server actions or route handlers.
- **Integration with App Router:** Route handlers under `src/app/api` should forward to these services to keep business logic centralized.

### 8. Tests
- **`unit/`:** Vitest or Jest specs targeting `src/lib` utilities and critical components. Co-locate mocks and fixtures per domain.
- **`integration/`:** Exercise server actions and route handlers against mocked external APIs using Next.js testing utilities.
- **`e2e/`:** Playwright or Cypress covering creator onboarding, content publishing, and analytics flows. Store shared selectors and commands in `tests/e2e/support`.

### 9. Cross-Cutting Practices
- **Type safety:** Share TypeScript types between client and server through `/api/schemas` and `src/lib/api` exports.
- **Styling:** Centralize design tokens in `src/styles/tokens.css` and expose via CSS variables. Choose Tailwind or CSS Modules per component complexity.
- **State management:** Prefer server components and React context for global state; introduce Zustand/Redux only for collaborative or real-time features.
- **Performance:** Use edge-friendly server actions for personalization, static generation for marketing routes, and ISR for dynamic content pages.
- **Developer experience:** Add linting and formatting rules, establish commit/check pipelines, and use `scripts/` for scaffolding repetitive tasks (component generation, schema sync).

### 10. Migration Steps
- Add Next.js dependencies, convert `package.json` scripts to `next dev`, `next build`, and `next start`, and remove Vite-specific tooling once parity is reached.
- Move the current `src/App.tsx` content into `src/app/(marketing)/page.tsx`, adapting client-side interactions to client components and rehoming global styles under `src/styles`.
- Introduce placeholder files in each proposed directory (e.g., `src/lib/api/index.ts`) with TODO comments so the structure becomes visible to the team.
- Update testing configuration to use `next/jest` for unit/integration tests and add Playwright for end-to-end coverage.
- Document coding standards and onboarding notes in `README` or a new `docs/architecture.md` referencing this plan.

### 11. Next Steps
- Scaffold base folders and placeholder files to align team contributions.
- Define priority user journeys for Who Visions to inform initial route groups and component priorities.
- Schedule a working session to plan the Vite-to-Next.js migration timeline and assign responsible owners.
