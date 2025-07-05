import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://my-git-playground.vercel.app'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date('2025-07-05'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/git-playground`,
      lastModified: new Date('2025-07-05'),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]
}
