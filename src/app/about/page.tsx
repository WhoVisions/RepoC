/* eslint-disable react-refresh/only-export-components */
import type { Metadata } from 'next';

const ABOUT_METADATA: Metadata = {
  title: 'About RepoC',
  description:
    'Discover the goals and implementation details behind RepoC, a Next.js reference project centered on metadata best practices.',
  openGraph: {
    title: 'About RepoC',
    description:
      'RepoC documents how to migrate from Vite to the Next.js App Router while embracing the Metadata API for SEO-critical pages.',
    url: 'https://repoc.example.com/about',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'About RepoC',
    description: 'Why RepoC leans into the Next.js Metadata API and how you can adopt the same patterns.',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return ABOUT_METADATA;
}

export default function AboutPage() {
  return (
    <article>
      <h2>Project Principles</h2>
      <p>
        RepoC originated as a minimal Vite + React counter. We rebuilt it with Next.js so we could document best practices for
        colocating metadata with UI, especially when dealing with dynamic, content-driven routes.
      </p>
      <p>
        The project illustrates how global metadata declared in <code>layout.tsx</code> cooperates with page-level generators.
        This keeps canonical URLs, share summaries, and social cards accurate without relying on monolithic configuration files.
      </p>

      <h2>Metadata Highlights</h2>
      <ul>
        <li>Each route exports <code>generateMetadata</code> for fine-grained control</li>
        <li>Open Graph and Twitter properties inherit sensible defaults from the root layout</li>
        <li>Dynamic blog articles resolve canonicals and publication dates from structured content</li>
      </ul>

      <h2>What's Next</h2>
      <p>
        Future iterations will integrate a CMS-backed content layer and automated OG image generation. The current code base is
        intentionally compact so you can slot the patterns into your own project.
      </p>
    </article>
  );
}
