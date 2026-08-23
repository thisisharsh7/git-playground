#!/usr/bin/env node
// Asserts the prerendered HTML still carries the SEO signals that earn this
// site its traffic. Runs after `next build`, reads the build output directly:
// no server, no browser, no dependencies.
import { readFileSync, existsSync } from 'node:fs'

const ORIGIN = 'https://my-git-playground.vercel.app'

const PAGES = [
  {
    file: '.next/server/app/index.html',
    canonical: ORIGIN,
    title:
      'Interactive Git Learning Platform - Git Master | Interactive Git Learning Platform',
    mustContain: [
      // The one sentence on / that carries the "playground" phrase.
      'Master Git version control with our interactive playground.',
      // The hero CTA and its anchor text must survive.
      'Start Learning Git',
      '/git-playground?tab=playground',
      // Phase 7: the section heading, and proof the playground itself is in the
      // server-rendered HTML rather than appearing only after hydration.
      'Interactive Git Playground',
      'Type your Git command here',
      'Repository State',
      'Quick Commands',
    ],
    // Phase 7 must not bring the heavy tabs onto the homepage.
    mustNotContain: ['cherry-pick', 'passingScore', 'Git Workflow Visualization'],
    h1: 'Git Master',
  },
  {
    file: '.next/server/app/git-playground.html',
    canonical: `${ORIGIN}/git-playground`,
    title:
      'Git Playground - Interactive Learning - Git Master | Interactive Git Learning Platform',
    mustContain: [],
    // No h1 today: useSearchParams inside <Suspense> makes this page prerender
    // only its spinner fallback. Fixed in Phase 8; pinned as 0 until then.
    h1: null,
  },
]

const failures = []
const fail = (message) => failures.push(message)

function attr(html, regex, label, file) {
  const matches = [...html.matchAll(regex)]
  if (matches.length !== 1) {
    fail(`${file}: expected exactly 1 ${label}, found ${matches.length}`)
    return null
  }
  return matches[0][1]
}

for (const page of PAGES) {
  if (!existsSync(page.file)) {
    fail(`${page.file}: missing — run \`npm run build\` first`)
    continue
  }
  const html = readFileSync(page.file, 'utf8')

  const canonical = attr(
    html,
    /<link rel="canonical" href="([^"]*)"\/?>/g,
    'canonical link',
    page.file,
  )
  if (canonical !== null && canonical !== page.canonical) {
    fail(`${page.file}: canonical is "${canonical}", expected "${page.canonical}"`)
  }

  const title = attr(html, /<title>([^<]*)<\/title>/g, '<title>', page.file)
  if (title !== null && title !== page.title) {
    fail(`${page.file}: title is "${title}", expected "${page.title}"`)
  }

  if (/content="noindex/.test(html) || /content="[^"]*nofollow/.test(html)) {
    fail(`${page.file}: contains noindex/nofollow`)
  }

  // Count opening tags only. A bare grep for 'application/ld+json' returns 6
  // here, because the JSON-LD is also inlined in the RSC flight payload via
  // self.__next_f.push(...). Counting opening tags gives the real 3.
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  // Was 3 before Phase 5 removed the fabricated Organization block and the
  // duplicate SoftwareApplication entity.
  if (blocks.length !== 1) {
    fail(`${page.file}: expected 1 JSON-LD block, found ${blocks.length}`)
  }
  for (const [index, block] of blocks.entries()) {
    try {
      JSON.parse(block[1])
    } catch {
      fail(`${page.file}: JSON-LD block ${index + 1} is not valid JSON`)
    }
  }

  const h1s = [...html.matchAll(/<h1[\s>]/g)]
  const expectedH1s = page.h1 === null ? 0 : 1
  if (h1s.length !== expectedH1s) {
    fail(`${page.file}: expected ${expectedH1s} <h1>, found ${h1s.length}`)
  }
  if (page.h1 !== null && !html.includes(`>${page.h1}`)) {
    fail(`${page.file}: <h1> text "${page.h1}" not found`)
  }

  for (const needle of page.mustContain) {
    if (!html.includes(needle)) {
      fail(`${page.file}: missing required copy "${needle}"`)
    }
  }

  for (const needle of page.mustNotContain ?? []) {
    if (html.includes(needle)) {
      fail(`${page.file}: unexpectedly contains "${needle}"`)
    }
  }

  // Fabrications removed in Phase 5 must never come back.
  for (const banned of ['aggregateRating', '"@type":"Organization"', 'Git Master Team']) {
    if (html.includes(banned)) {
      fail(`${page.file}: contains removed fabrication "${banned}"`)
    }
  }
  // dateModified was `new Date()`, so it always claimed "modified today".
  if (/"dateModified"/.test(html)) {
    fail(`${page.file}: dateModified is self-invalidating and was removed`)
  }
}

if (failures.length > 0) {
  console.error('SEO assertions FAILED:\n')
  for (const failure of failures) console.error(`  - ${failure}`)
  console.error('\nThese guard the page that earns 100% of this site\'s search clicks.')
  console.error('If a change here is intentional, update scripts/assert-seo.mjs deliberately.\n')
  process.exit(1)
}

console.log(`SEO assertions passed for ${PAGES.length} pages.`)
