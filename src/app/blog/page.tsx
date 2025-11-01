/* eslint-disable react-refresh/only-export-components */
import type { Metadata } from 'next';
import Link from 'next/link';

import { getAllPosts } from '@/lib/posts';

const BLOG_METADATA: Metadata = {
  title: 'Metadata Deep Dives',
  description:
    'Read articles that break down how to design, implement, and scale metadata across a modern Next.js code base.',
  openGraph: {
    title: 'Metadata Deep Dives',
    description:
      'Practical guidance on the Next.js Metadata API, including canonical URLs, Open Graph previews, and dynamic routing patterns.',
    url: 'https://repoc.example.com/blog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Metadata Deep Dives',
    description:
      'Implementation notes and patterns for shipping polished social previews with the Next.js Metadata API.',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return BLOG_METADATA;
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <section>
      <h2>Latest Articles</h2>
      <div className="card-grid">
        {posts.map((post) => (
          <article key={post.slug} className="card">
            <div>
              <span className="pill">{post.tags[0]}</span>
              <h3>{post.title}</h3>
              <p className="meta">
                Published{' '}
                {new Intl.DateTimeFormat('en', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }).format(new Date(post.publishedAt))}
              </p>
            </div>
            <p>{post.summary}</p>
            <p>
              <Link href={`/blog/${post.slug}`}>Read article</Link>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
