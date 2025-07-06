import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://my-git-playground.vercel.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/_next/static/', // ✅ allow static assets
        ],
        disallow: [
          '/api/',
          '/_next/',         // ❌ this blocks everything under _next, including static (unless overridden above)
          '/private/',
          '/admin/',
          '/*.json$',
          '/temp/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/_next/static/', // ✅ allow static assets
        ],
        disallow: [
          '/api/',
          '/_next/',
          '/private/',
          '/admin/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/_next/static/', // ✅ allow static assets
        ],
        disallow: [
          '/api/',
          '/_next/',
          '/private/',
          '/admin/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
