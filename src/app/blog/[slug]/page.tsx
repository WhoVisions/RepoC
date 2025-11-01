/* eslint-disable react-refresh/only-export-components */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getAllPosts, getPost } from '@/lib/posts';

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return getAllPosts().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getPost(params.slug);

  if (!post) {
    return {
      title: 'Article not found',
      description: 'The requested article could not be located.',
    };
  }

  const published = new Date(post.publishedAt);
  const updated = post.updatedAt ? new Date(post.updatedAt) : undefined;

  return {
    title: post.title,
    description: post.description,
    alternates: post.canonical
      ? {
          canonical: post.canonical,
        }
      : undefined,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: `https://repoc.example.com/blog/${post.slug}`,
      publishedTime: published.toISOString(),
      modifiedTime: updated?.toISOString(),
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  } satisfies Metadata;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPost(params.slug);

  if (!post) {
    return notFound();
  }

  const published = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(post.publishedAt));

  const updated = post.updatedAt
    ? new Intl.DateTimeFormat('en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(post.updatedAt))
    : undefined;

  return (
    <article>
      <span className="pill">{post.tags.join(' | ')}</span>
      <h2>{post.title}</h2>
      <p className="meta">
        Published {published}
        {updated ? ` - Updated ${updated}` : ''}
      </p>

      {post.body.map((paragraph) => (
        <p key={paragraph.slice(0, 24)}>{paragraph}</p>
      ))}
    </article>
  );
}
