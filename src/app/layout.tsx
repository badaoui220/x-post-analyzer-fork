import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { Footer } from '@/components/footer';
import { Analytics } from '@vercel/analytics/react';
import { BannerSpot } from '@/components/spots/banner-spot';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const baseUrl = 'https://x-post-analyzer.vercel.app';
const ogImageUrl = `${baseUrl}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
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
  authors: [{ name: 'Audiencon', url: 'https://github.com/audiencon' }],
  creator: 'Audiencon',
  publisher: 'Audiencon',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    title: 'X Post Analyzer - AI-Powered Post Analysis',
    description:
      'Get AI-powered insights to make your X (Twitter) posts more engaging, friendly, and viral.',
    siteName: 'X Post Analyzer',
    images: [
      {
        url: ogImageUrl,
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
    images: [ogImageUrl],
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
        <BannerSpot id="spot-banner" />
        {children}
        <Footer />
        <Toaster position="bottom-right" theme="dark" closeButton richColors />
        <Analytics />
      </body>
    </html>
  );
}
