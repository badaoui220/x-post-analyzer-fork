import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['x-post-analyzer.vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'x-post-analyzer.vercel.app',
        pathname: '/screenshot.png',
      },
    ],
  },
};

export default nextConfig;
