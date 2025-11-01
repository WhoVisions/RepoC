## Who Visions Next.js App Structure Plan

### 1. Goals
- Support rapid iteration on Who Visions experiences with a modular, type-safe React codebase.
- Keep presentation, domain logic, and platform utilities clearly separated to aid testing and reusability.
- Leverage Next.js App Router conventions while accommodating future API integrations and automation workflows.

### 2. Directory Overview
```
/
??? src/
?   ??? app/
?   ?   ??? (marketing)/
?   ?   ??? (dashboard)/
?   ?   ??? layout.tsx
?   ?   ??? page.tsx
?   ??? components/
?   ?   ??? ui/
?   ?   ??? layouts/
?   ?   ??? feedback/
?   ??? lib/
?   ?   ??? api/
?   ?   ??? analytics/
?   ?   ??? auth/
?   ?   ??? utils/
?   ??? styles/
??? api/
?   ??? clients/
?   ??? schemas/
?   ??? services/
??? tests/
?   ??? e2e/
?   ??? integration/
?   ??? unit/
??? scripts/
```

### 3. Src/App
- **Segmented routes:** Group key user flows into route groups such as `(marketing)` for public storytelling and `(dashboard)` for authenticated creators.
- **Shared layout:** `layout.tsx` wires global providers (theme, auth context, analytics) and imports base styles from `src/styles`.
- **Routing conventions:** Collocate route-specific server actions, metadata, and loading/error boundaries within each route folder for clarity.
- **Page modules:** Favor small server components that coordinate data fetching via `src/lib/api` helpers, then compose UI components from `src/components`.

### 4. Src/Components
- **`ui/`:** Reusable primitives (buttons, cards, form inputs) with Tailwind or CSS modules, designed for both marketing and app surfaces.
- **`layouts/`:** Higher-level shells (e.g., dashboard frame, marketing hero) that orchestrate page sections.
- **`feedback/`:** Toasts, dialogs, loaders, and other interaction responses. Hook into `src/lib/analytics` to capture engagement events.
- **Storybook optionality:** If visual regressions are a concern, colocate component stories inside `ui/` folders and configure Storybook later.

### 5. Src/Lib
- **`api/`:** Fetchers and server actions. Centralize REST/GraphQL client configuration, apply Zod schemas from `/api/schemas`, and expose typed hooks for client components.
- **`analytics/`:** Tracking helpers (e.g., PostHog, Segment). Provide a generic `track` wrapper so UI code remains provider-agnostic.
- **`auth/`:** Session utilities, JWT parsing, and role-based helpers. Integrate with NextAuth or custom middleware.
- **`utils/`:** Date, formatting, and general-purpose helpers kept pure and unit-tested.

### 6. API Layer (Root `/api`)
- **`clients/`:** External service wrappers (e.g., CRM, content store). Implement retry/backoff and error normalization.
- **`schemas/`:** Shared Zod/TypeScript schemas for validating payloads across server-client boundary; import into `src/lib/api` and server routes.
- **`services/`:** Domain-oriented orchestration (e.g., ?generate vision board?). Expose functions consumed by Next.js route handlers.
- Optionally expose REST endpoints via Next.js Route Handlers under `src/app/api`, delegating to `/api/services` for business logic.

### 7. Tests
- **`unit/`:** Vitest/Jest specs targeting `src/lib` utilities and critical components. Co-locate mocks and fixtures per domain.
- **`integration/`:** Test server actions and route handlers against mocked external APIs using Next.js testing utilities.
- **`e2e/`:** Playwright or Cypress covering creator onboarding, content publishing, and analytics flows. Store shared selectors and commands in `tests/e2e/support`.

### 8. Cross-Cutting Practices
- **Type safety:** Share TypeScript types between client and server through `/api/schemas` and `src/lib/api` exports.
- **Styling:** Centralize design tokens in `src/styles/tokens.css` and expose via CSS variables. For component-level styling, favor CSS Modules or Tailwind with design tokens.
- **State management:** Prefer server components and React context for global state; reserve Zustand/Redux only for complex collaborative features.
- **Performance:** Use edge-friendly server actions for personalization, static generation for marketing routes, and incremental static regeneration for content pages.
- **Developer experience:** Add linting/prettier configs, establish commit/check pipelines, and use `scripts/` for scaffolding repeated tasks (component generation, schema sync).

### 9. Next Steps
- Scaffold base folders and placeholder files to align team contributions.
- Define priority user journeys for Who Visions to inform initial route groups.
- Document coding standards (naming, testing expectations) in `README` or `docs/architecture.md`.
