import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://my-git-playground.vercel.app'
  const currentDate = new Date()

  return [
    // Home page - highest priority
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },

    // Main Git playground page
    {
      url: `${baseUrl}/git-playground`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },

    // Interactive playground section
    {
      url: `${baseUrl}/git-playground?tab=playground`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    // Learning lessons section
    {
      url: `${baseUrl}/git-playground?tab=lessons`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    // Git commands reference
    {
      url: `${baseUrl}/git-playground?tab=commands`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    // Git visualization section
    {
      url: `${baseUrl}/git-playground?tab=visualization`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    // Popular Git commands
    {
      url: `${baseUrl}/git-playground?tab=commands&search=add`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/git-playground?tab=commands&search=commit`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    }
  ]
}