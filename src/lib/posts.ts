export type Article = {
  slug: string;
  title: string;
  description: string;
  summary: string;
  body: string[];
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  canonical?: string;
};

const articles: Article[] = [
  {
    slug: 'introducing-nextjs-metadata-api',
    title: 'Introducing the Next.js Metadata API',
    description:
      'Explore how the Next.js App Router enables ergonomic, type-safe metadata generation for every route.',
    summary:
      'Understand the mechanics of the Metadata API, from static exports to dynamic factories that tap into route params.',
    body: [
      'Next.js 13 introduced a first-class Metadata API that keeps your SEO, Open Graph, and social tags colocated with the routes they describe. The API supports both static exports and dynamic generation, unlocking a single source of truth for titles, descriptions, and preview images.',
      'With the App Router, you can export either a metadata object or a generateMetadata function. The latter receives params and searchParams, making it ideal for dynamic segments such as blog posts or documentation pages.',
      'In RepoC we lean on generateMetadata to compute meta tags per page, ensuring that our content remains discoverable and richly previewed on social platforms.',
    ],
    tags: ['nextjs', 'metadata', 'seo'],
    publishedAt: '2024-09-18',
    updatedAt: '2025-01-04',
    canonical: 'https://repoc.example.com/blog/introducing-nextjs-metadata-api',
  },
  {
    slug: 'optimizing-open-graph-previews',
    title: 'Optimizing Open Graph Previews with Structured Metadata',
    description:
      'Craft compelling link previews by pairing accurate metadata with consistent imagery and branded descriptions.',
    summary:
      'Learn a repeatable checklist for Open Graph and Twitter Card setups, from canonical URLs to share-ready summaries.',
    body: [
      'High-quality Open Graph metadata turns a plain hyperlink into a rich preview card. Beyond title and description, aim to provide canonical URLs, content type, and image hints to help platforms render consistent previews.',
      'We recommend establishing a helper that assembles default metadata and merges page-specific overrides. This keeps branding consistent while allowing each article to highlight unique insights.',
      "Next.js metadata objects map directly to Open Graph fields. By centralising the defaults in RepoC's layout metadata and augmenting them within each page, we deliver precise, context-aware previews.",
    ],
    tags: ['open-graph', 'twitter', 'branding'],
    publishedAt: '2024-11-22',
    canonical: 'https://repoc.example.com/blog/optimizing-open-graph-previews',
  },
];

export function getAllPosts(): Article[] {
  return articles;
}

export function getPost(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}
