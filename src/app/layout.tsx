import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { Footer } from '@/components/footer';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'X Post Analyzer - AI-Powered Post Analysis',
    template: '%s | X Post Analyzer',
  },
  description:
    'Get AI-powered insights to make your X (Twitter) posts more engaging, friendly, and viral. Analyze your content and get instant suggestions for improvement.',
  keywords: [
    'X',
    'Twitter',
    'post analyzer',
    'AI analysis',
    'engagement',
    'virality',
    'social media',
    'content optimization',
  ],
  authors: [{ name: 'Said BADAOUI', url: 'https://github.com/audiencon' }],
  creator: 'Said BADAOUI',
  publisher: 'Said BADAOUI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://x-post-analyzer.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://x-post-analyzer.vercel.app',
    title: 'X Post Analyzer - AI-Powered Post Analysis',
    description:
      'Get AI-powered insights to make your X (Twitter) posts more engaging, friendly, and viral.',
    siteName: 'X Post Analyzer',
    images: [
      {
        url: '/screenshot.png',
        width: 1200,
        height: 630,
        alt: 'X Post Analyzer - AI-Powered Post Analysis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'X Post Analyzer - AI-Powered Post Analysis',
    description:
      'Get AI-powered insights to make your X (Twitter) posts more engaging, friendly, and viral.',
    images: ['/screenshot.png'],
    creator: '@audiencon',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen bg-[#111] font-sans text-white antialiased`}>
        {children}
        <Footer />
        <Toaster position="bottom-right" theme="dark" closeButton richColors />
        <Analytics />
      </body>
    </html>
  );
}
