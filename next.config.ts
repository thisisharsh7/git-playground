import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Temporarily disable redirects to prevent loops
  /*
  async redirects() {
    return [
      // Redirect common Git learning related paths to the playground
      {
        source: '/learn',
        destination: '/git-playground',
        permanent: true,
      },
      {
        source: '/tutorial',
        destination: '/git-playground',
        permanent: true,
      },
      {
        source: '/practice',
        destination: '/git-playground',
        permanent: true,
      },
      {
        source: '/playground',
        destination: '/git-playground',
        permanent: true,
      },
      // Redirect specific learning topics to playground with appropriate tabs
      {
        source: '/lessons',
        destination: '/git-playground?tab=lessons',
        permanent: true,
      },
      {
        source: '/commands',
        destination: '/git-playground?tab=commands',
        permanent: true,
      },
      {
        source: '/visualization',
        destination: '/git-playground?tab=visualization',
        permanent: true,
      },
      {
        source: '/visualize',
        destination: '/git-playground?tab=visualization',
        permanent: true,
      },
      // Redirect common Git command searches
      {
        source: '/git-:command',
        destination: '/git-playground?tab=commands&search=:command',
        permanent: false,
      },
      // Redirect old-style URLs
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      // Redirect common misspellings
      {
        source: '/git-master',
        destination: '/',
        permanent: true,
      },
      {
        source: '/gitmaster',
        destination: '/',
        permanent: true,
      },
      // Redirect help and documentation requests
      {
        source: '/help',
        destination: '/git-playground?tab=lessons',
        permanent: false,
      },
      {
        source: '/docs',
        destination: '/git-playground?tab=commands',
        permanent: false,
      },
      {
        source: '/documentation',
        destination: '/git-playground?tab=commands',
        permanent: false,
      },
      // Redirect getting started requests
      {
        source: '/getting-started',
        destination: '/git-playground?tab=lessons',
        permanent: false,
      },
      {
        source: '/start',
        destination: '/git-playground',
        permanent: false,
      },
      {
        source: '/begin',
        destination: '/git-playground',
        permanent: false,
      },
    ];
  },
  
  async rewrites() {
    return [
      // API-like rewrites for dynamic content
      {
        source: '/api/command/:command',
        destination: '/git-playground?tab=commands&search=:command',
      },
      {
        source: '/search/:query',
        destination: '/git-playground?tab=commands&search=:query',
      },
    ];
  },
  */

  // Additional config options
  poweredByHeader: false,
  compress: true,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Headers for better SEO and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      // Cache static assets
      {
        source: '/favicon.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/site.webmanifest',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
