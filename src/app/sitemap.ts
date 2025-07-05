import { MetadataRoute } from 'next'
import { baseUrl, commandConfigs } from '@/lib/seo-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date()
  
  // Base pages
  const basePages: MetadataRoute.Sitemap = [
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
  ]

  // Tab-specific pages
  const tabPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/git-playground?tab=playground`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/git-playground?tab=lessons`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/git-playground?tab=commands`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/git-playground?tab=visualization`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Command-specific pages
  const commandPages: MetadataRoute.Sitemap = Object.keys(commandConfigs).map(command => ({
    url: `${baseUrl}/git-playground?tab=commands&search=${command}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Additional popular Git commands
  const additionalCommands = [
    'status', 'log', 'diff', 'checkout', 'reset', 'revert', 
    'stash', 'tag', 'remote', 'fetch', 'clone', 'init'
  ]

  const additionalCommandPages: MetadataRoute.Sitemap = additionalCommands.map(command => ({
    url: `${baseUrl}/git-playground?tab=commands&search=${command}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  // Learning-focused pages
  const learningPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/git-playground?tab=lessons&topic=basics`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/git-playground?tab=lessons&topic=branching`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/git-playground?tab=lessons&topic=remote`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/git-playground?tab=lessons&topic=advanced`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Visualization-focused pages
  const visualizationPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/git-playground?tab=visualization&view=workflow`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/git-playground?tab=visualization&view=branching`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/git-playground?tab=visualization&view=merging`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  return [
    ...basePages,
    ...tabPages,
    ...commandPages,
    ...additionalCommandPages,
    ...learningPages,
    ...visualizationPages,
  ]
}
