import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://my-git-playground.vercel.app'
  const currentDate = new Date()
  
  // Helper function to create properly encoded URLs
  const createUrl = (path: string, params?: Record<string, string>): string => {
    const url = new URL(path, baseUrl)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value)
      })
    }
    return url.toString()
  }
  
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
      url: createUrl('/git-playground'),
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    
    // Tab sections with properly encoded URLs
    {
      url: createUrl('/git-playground', { tab: 'playground' }),
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: createUrl('/git-playground', { tab: 'lessons' }),
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: createUrl('/git-playground', { tab: 'commands' }),
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: createUrl('/git-playground', { tab: 'visualization' }),
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    
    // Popular Git commands with properly encoded URLs
    {
      url: createUrl('/git-playground', { tab: 'commands', search: 'add' }),
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: createUrl('/git-playground', { tab: 'commands', search: 'commit' }),
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: createUrl('/git-playground', { tab: 'commands', search: 'push' }),
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: createUrl('/git-playground', { tab: 'commands', search: 'pull' }),
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: createUrl('/git-playground', { tab: 'commands', search: 'branch' }),
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: createUrl('/git-playground', { tab: 'commands', search: 'merge' }),
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
}
