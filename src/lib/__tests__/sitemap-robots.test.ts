// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import sitemap from '@/app/sitemap'
import robots from '@/app/robots'
import { baseUrl } from '@/lib/seo-config'

describe('sitemap', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('lists exactly the two real routes, in order', () => {
    expect(sitemap().map((entry) => entry.url)).toEqual([
      'https://my-git-playground.vercel.app',
      'https://my-git-playground.vercel.app/git-playground',
    ])
  })

  it('keeps the homepage at priority 1.0', () => {
    expect(sitemap()[0]).toMatchObject({ changeFrequency: 'weekly', priority: 1.0 })
  })

  // 'daily' is unsupportable (repo untouched since 2025-07-06) but is pinned
  // here because changing it is a Phase 9 decision, not a Phase 1 one.
  it('pins the playground entry as it stands today', () => {
    expect(sitemap()[1]).toMatchObject({ changeFrequency: 'daily', priority: 0.9 })
  })

  // Guards the commented-out ?tab= block. Search Console shows those URLs
  // ranking 36-59 as separate pages; submitting them would formalise that.
  it('never submits a query-string URL', () => {
    expect(sitemap().every((entry) => !String(entry.url).includes('?'))).toBe(true)
  })
})

describe('robots', () => {
  const rules = () => robots().rules as Array<Record<string, unknown>>

  it('declares the sitemap on the same origin as seo-config', () => {
    expect(robots().sitemap).toBe(`${baseUrl}/sitemap.xml`)
  })

  it('never blocks the whole site', () => {
    for (const rule of rules()) {
      const disallow = [rule.disallow].flat().filter(Boolean) as string[]
      expect(disallow).not.toContain('/')
    }
  })

  it('never blocks the fallback route', () => {
    for (const rule of rules()) {
      const disallow = [rule.disallow].flat().filter(Boolean) as string[]
      expect(disallow.some((path) => path.startsWith('/git-playground'))).toBe(false)
    }
  })

  // Pinned defects, both fixed in Phase 9: '/_next/' relies on longest-match
  // precedence that not every crawler implements, and '/*.json$' blocks RSC
  // payloads. Pinning them keeps the Phase 9 diff explicit.
  it('currently disallows /_next/ while allowing /_next/static/', () => {
    const wildcard = rules()[0]
    expect(wildcard.allow).toContain('/_next/static/')
    expect(wildcard.disallow).toContain('/_next/')
  })
})
