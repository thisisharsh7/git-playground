import { MetadataRoute } from 'next'
import { baseUrl } from '@/lib/seo-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date()

  const basePages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/git-playground`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  // const tabPages: MetadataRoute.Sitemap = [
  //   {
  //     url: `${baseUrl}/git-playground?tab=playground`,
  //     lastModified: currentDate,
  //     changeFrequency: 'weekly',
  //     priority: 0.8,
  //   },
  //   {
  //     url: `${baseUrl}/git-playground?tab=lessons`,
  //     lastModified: currentDate,
  //     changeFrequency: 'weekly',
  //     priority: 0.8,
  //   },
  //   {
  //     url: `${baseUrl}/git-playground?tab=commands`,
  //     lastModified: currentDate,
  //     changeFrequency: 'weekly',
  //     priority: 0.8,
  //   },
  //   {
  //     url: `${baseUrl}/git-playground?tab=visualization`,
  //     lastModified: currentDate,
  //     changeFrequency: 'weekly',
  //     priority: 0.8,
  //   },
  // ]
  return [
    ...basePages,
    // ...tabPages
  ]
}
