import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://my-git-playground.vercel.app',
      lastModified: new Date('2025-07-05'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://my-git-playground.vercel.app/git-playground',
      lastModified: new Date('2025-07-05'),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]
}
