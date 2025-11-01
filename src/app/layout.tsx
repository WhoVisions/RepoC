/* eslint-disable react-refresh/only-export-components */
import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const SITE_NAME = 'RepoC Knowledge Base';
const SITE_DESCRIPTION =
  'A demo Next.js application showcasing per-page metadata generation with the App Router API.';

export const metadata: Metadata = {
  metadataBase: new URL('https://repoc.example.com'),
  title: {
    default: SITE_NAME,
    template: `%s - ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  creator: 'RepoC Team',
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: 'https://repoc.example.com',
    siteName: SITE_NAME,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    creator: '@repoc_app',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <main>
          <header>
            <span className="pill">RepoC</span>
            <h1>{SITE_NAME}</h1>
            <p className="meta">A quick reference built with the Next.js App Router.</p>
            <nav>
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
              <Link href="/blog">Blog</Link>
            </nav>
          </header>
          {children}
          <footer>Copyright {new Date().getFullYear()} RepoC. Crafted with Next.js metadata API.</footer>
        </main>
      </body>
    </html>
  );
}
