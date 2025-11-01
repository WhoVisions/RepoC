# RepoC

RepoC demonstrates how to migrate a small Vite + React project to the Next.js App Router while embracing the Metadata API for every route.

## Getting Started

```bash
npm install
npm run dev
```

Navigate to <http://localhost:3000> to explore the example pages:

- `/:` highlights the project goals and links to other sections
- `/about:` explains the migration strategy and metadata patterns
- `/blog:` lists articles with structured metadata
- `/blog/[slug]:` dynamic routes that generate canonical URLs, Open Graph, and Twitter cards

## Metadata Highlights

- Global defaults live in `src/app/layout.tsx` and are composed on by each page
- Static routes export `generateMetadata` functions for precise titles and descriptions
- Dynamic routes derive metadata from structured content in `src/lib/posts.ts`
