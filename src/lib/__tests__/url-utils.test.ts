// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  createGitPlaygroundUrl,
  getDefaultTab,
  isValidTab,
  parseGitPlaygroundUrl,
} from '@/lib/url-utils'

describe('createGitPlaygroundUrl', () => {
  it('returns the bare path with no options', () => {
    expect(createGitPlaygroundUrl()).toBe('/git-playground')
  })

  it('sets a tab', () => {
    expect(createGitPlaygroundUrl({ tab: 'lessons' })).toBe('/git-playground?tab=lessons')
  })

  it('combines tab and search', () => {
    expect(createGitPlaygroundUrl({ tab: 'commands', search: 'rebase' })).toBe(
      '/git-playground?tab=commands&search=rebase',
    )
  })

  it('omits an empty search', () => {
    expect(createGitPlaygroundUrl({ search: '' })).toBe('/git-playground')
  })

  // `command` forces tab=commands, overriding whatever tab was passed.
  it('command overrides the tab', () => {
    expect(createGitPlaygroundUrl({ tab: 'playground', command: 'add' })).toBe(
      '/git-playground?tab=commands&search=add',
    )
  })

  // Pinned oddity: `lesson` is applied last, so it wins the tab even when
  // `command` already set it to 'commands'. Nonsensical combined state.
  it('lesson wins the tab over command', () => {
    expect(createGitPlaygroundUrl({ command: 'add', lesson: 'branching' })).toBe(
      '/git-playground?tab=lessons&search=add&lesson=branching',
    )
  })

  // Pinned divergence: this helper keeps whitespace, while the inline logic in
  // git-playground/page.tsx:88 strips it with search.trim().
  it('preserves whitespace-only search, unlike the page', () => {
    expect(createGitPlaygroundUrl({ search: '  ' })).toBe('/git-playground?search=++')
  })
})

describe('parseGitPlaygroundUrl', () => {
  it('extracts tab, search and lesson', () => {
    expect(parseGitPlaygroundUrl('/git-playground?tab=lessons&search=a&lesson=b')).toEqual({
      tab: 'lessons',
      search: 'a',
      lesson: 'b',
    })
  })

  // Pinned: parse does NOT validate, it casts. Every caller must run isValidTab.
  it('passes an invalid tab straight through without validating', () => {
    expect(parseGitPlaygroundUrl('/git-playground?tab=bogus').tab).toBe('bogus')
  })

  it('never throws on unparseable input', () => {
    expect(() => parseGitPlaygroundUrl('::::')).not.toThrow()
  })
})

describe('isValidTab', () => {
  it('accepts the four real tabs', () => {
    for (const tab of ['playground', 'lessons', 'commands', 'visualization']) {
      expect(isValidTab(tab)).toBe(true)
    }
  })

  it('is case- and whitespace-sensitive', () => {
    expect(isValidTab('Playground')).toBe(false)
    expect(isValidTab('lessons ')).toBe(false)
    expect(isValidTab('')).toBe(false)
  })
})

// The parity test that unlocks de-duplication. git-playground/page.tsx
// re-implements this logic inline at :49-50 and :109-111 while url-utils sits
// unused. Green here means replacing both inline copies is provably a no-op.
describe('getDefaultTab matches the inline logic in git-playground/page.tsx', () => {
  const validTabs = ['playground', 'lessons', 'commands', 'visualization']
  const inline = (tab?: string | null) =>
    tab && validTabs.includes(tab) ? tab : 'playground'

  const cases: Array<string | null | undefined> = [
    undefined,
    null,
    '',
    'playground',
    'lessons',
    'commands',
    'visualization',
    'bogus',
    'PLAYGROUND',
    'lessons ',
    '../etc/passwd',
  ]

  it.each(cases)('agrees for %p', (tab) => {
    expect(getDefaultTab(tab ?? undefined)).toBe(inline(tab))
  })
})
