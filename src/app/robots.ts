import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://my-git-playground.vercel.app'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/_next/',
        '/private/',
      ],
    },
    // Use the manual sitemap to avoid XML encoding issues
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
