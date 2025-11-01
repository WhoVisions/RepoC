/* eslint-disable react-refresh/only-export-components */
import type { Metadata } from 'next';
import Link from 'next/link';

const HOME_METADATA: Metadata = {
  title: 'Composable Metadata with Next.js',
  description:
    'Learn how RepoC uses the Next.js Metadata API to keep SEO, Open Graph, and social cards consistent across every route.',
  openGraph: {
    title: 'Composable Metadata with Next.js',
    description:
      'Take a tour of RepoC and discover how the App Router streamlines metadata management for static and dynamic pages alike.',
    url: 'https://repoc.example.com/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Composable Metadata with Next.js',
    description:
      'RepoC demonstrates how to co-locate metadata with the UI it describes using the Next.js Metadata API.',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return HOME_METADATA;
}

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <p className="pill">Metadata First</p>
        <h2>Ship better previews without leaving your routes.</h2>
        <p>
          RepoC upgrades the original Vite demo into a fully featured Next.js App Router project. Every route exports
          <code>generateMetadata</code> so titles, descriptions, and share images stay up-to-date.
        </p>
        <p>
          Explore the <Link href="/about">About</Link> page for project goals or browse our <Link href="/blog">blog</Link>{' '}
          for implementation deep dives.
        </p>
      </section>

      <section className="card-grid">
        <div className="card">
          <h3>Layout Defaults</h3>
          <p>
            Global metadata, including Open Graph templates, lives in <code>app/layout.tsx</code>. Page metadata composes on
            top of those defaults, ensuring consistent branding.
          </p>
        </div>

        <div className="card">
          <h3>Static &amp; Dynamic Routes</h3>
          <p>
            Static pages such as <code>/about</code> export a metadata factory, while dynamic blog routes derive titles and
            canonicals from structured content.
          </p>
        </div>

        <div className="card">
          <h3>Built with Type Safety</h3>
          <p>
            TypeScript definitions for <code>Metadata</code> keep previews predictable. The typed Metadata API guides which
            fields are available for each platform integration.
          </p>
        </div>
      </section>
    </>
  );
}
