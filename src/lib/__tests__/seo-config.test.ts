// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  baseUrl,
  commonKeywords,
  generatePageMetadata,
  pageConfigs,
} from '@/lib/seo-config'

// `/` earns 100% of this property's search clicks (115 clicks, 3277 impressions,
// position 7.53) and ranks 6.69 for "git playground". Its canonical, title and
// description are frozen. These pins make any change to them a deliberate act.
describe('homepage metadata is frozen', () => {
  const home = generatePageMetadata(pageConfigs.home)

  it('canonical is the bare origin with no trailing slash', () => {
    expect(home.alternates?.canonical).toBe('https://my-git-playground.vercel.app')
    expect(home.alternates?.canonical).toBe(baseUrl)
  })

  // Pinned as-is, duplicated tagline included. Deliberately NOT being fixed:
  // the traffic data gives no reason to gamble the only page that earns clicks.
  it('title is unchanged, including the duplicated tagline', () => {
    expect(home.title).toBe(
      'Interactive Git Learning Platform - Git Master | Interactive Git Learning Platform',
    )
  })

  // Pinned as-is, "leading platform" superlative included. Deferred to the
  // post-28-day phase so it cannot be changed alongside the playground mount.
  it('description is unchanged, including the superlative suffix', () => {
    expect(home.description).toBe(
      'Master Git version control with our interactive playground. Learn Git commands, ' +
        'visualize workflows, and understand version control through hands-on practice | ' +
        'Git Master - The leading platform for interactive Git learning and version control education.',
    )
  })

  it('stays indexable', () => {
    expect(home.robots).toMatchObject({ index: true, follow: true })
  })

  it('keeps the search-console verification token', () => {
    expect(home.verification?.google).toBe('309dfde5f79964cc')
  })

  it('openGraph url matches the canonical', () => {
    expect(home.openGraph).toMatchObject({ url: 'https://my-git-playground.vercel.app' })
  })

  // Phase 5: 'Git Master Team' is not a real team and was emitted as
  // <meta name="author"> on every page.
  it('declares no fabricated author', () => {
    expect(home.authors).toBeUndefined()
  })

  // The OG image points at favicon.svg; it must not claim to be 1200x630.
  it('makes no false claim about the Open Graph image', () => {
    const images = home.openGraph?.images as Array<Record<string, unknown>>
    expect(images[0].width).toBeUndefined()
    expect(images[0].height).toBeUndefined()
  })
})

describe('playground metadata', () => {
  const playground = generatePageMetadata(pageConfigs.playground)

  it('is self-canonical', () => {
    expect(playground.alternates?.canonical).toBe(
      'https://my-git-playground.vercel.app/git-playground',
    )
  })

  it('stays indexable so the fallback route keeps working', () => {
    expect(playground.robots).toMatchObject({ index: true, follow: true })
  })
})

describe('pageConfigs invariants', () => {
  it('every path is empty or root-relative', () => {
    for (const config of Object.values(pageConfigs)) {
      expect(config.path === '' || config.path.startsWith('/')).toBe(true)
    }
  })

  it('only home and playground correspond to real routes', () => {
    expect([pageConfigs.home.path, pageConfigs.playground.path]).toEqual(['', '/git-playground'])
  })

  // Trap pin. These four configs are dead code today. Wiring any of them into a
  // layout would emit a query-string canonical, formalising the fragmentation
  // already visible in Search Console (?tab=lessons ranks 36.8 as its own page).
  it('the dead tab configs would produce query-string canonicals', () => {
    expect(generatePageMetadata(pageConfigs.lessons).alternates?.canonical).toBe(
      'https://my-git-playground.vercel.app/git-playground?tab=lessons',
    )
  })

  it('concatenates keywords without deduping', () => {
    const home = generatePageMetadata(pageConfigs.home)
    expect(home.keywords).toHaveLength(commonKeywords.length + pageConfigs.home.keywords.length)
    expect(home.keywords).toContain('git playground')
  })
})
