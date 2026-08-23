// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import { GitExplainer, gitCommandExplanations } from '@/lib/git-explainer'

describe('command catalogue', () => {
  it('holds 25 commands', () => {
    expect(GitExplainer.getAllCommands()).toHaveLength(25)
  })

  it('every entry’s command field matches its key', () => {
    for (const [key, value] of Object.entries(gitCommandExplanations)) {
      expect(value.command).toBe(key)
    }
  })

  it('category counts sum to the catalogue size', () => {
    const categories = [
      'basic',
      'branching',
      'remote',
      'history',
      'advanced',
      'collaboration',
      'maintenance',
    ] as const
    const total = categories.reduce(
      (sum, category) => sum + GitExplainer.getCommandsByCategory(category).length,
      0,
    )
    expect(total).toBe(GitExplainer.getAllCommands().length)
  })

  it('difficulty counts sum to the catalogue size', () => {
    const difficulties = ['beginner', 'intermediate', 'advanced'] as const
    const total = difficulties.reduce(
      (sum, difficulty) => sum + GitExplainer.getCommandsByDifficulty(difficulty).length,
      0,
    )
    expect(total).toBe(GitExplainer.getAllCommands().length)
  })

  // Pinned defect: five relatedCommands point at commands that are not in the
  // catalogue at all (git restore, git fsck, git prune, git repack), so the
  // "related" links in the explainer UI lead nowhere. Asserting the exact list
  // means any NEW dangling reference fails the build. Fixed in Phase 4, either
  // by documenting those four commands or by dropping the references.
  it('has exactly five known-dangling relatedCommands', () => {
    const broken = GitExplainer.getAllCommands().flatMap((command) =>
      command.relatedCommands
        .filter((related) => !GitExplainer.explain(related))
        .map((related) => `${command.command} -> ${related}`),
    )
    expect(broken).toEqual([
      'git checkout -> git restore',
      'git switch -> git restore',
      'git gc -> git fsck',
      'git gc -> git prune',
      'git gc -> git repack',
    ])
  })

  it('returns an empty list for an unknown category', () => {
    expect(
      GitExplainer.getCommandsByCategory('bogus' as 'basic'),
    ).toEqual([])
  })
})

describe('explain', () => {
  it('resolves with and without the git prefix, case-insensitively', () => {
    const rebase = GitExplainer.explain('git rebase')
    expect(rebase).not.toBeNull()
    expect(GitExplainer.explain('rebase')).toBe(rebase)
    expect(GitExplainer.explain('  GIT REBASE  ')).toBe(rebase)
  })

  it('returns null for unknown input', () => {
    expect(GitExplainer.explain('')).toBeNull()
    expect(GitExplainer.explain('git nonexistent')).toBeNull()
  })

  // Pinned product hole (D2.13, fixed in Phase 4 with longest-prefix matching).
  // Lookup is exact-match, so any real command with a flag or argument fails —
  // which is what users actually type into the "explainer".
  it.each([
    'git rebase -i',
    'git add .',
    'git commit -m "x"',
    'git checkout -b feature',
    'git log --oneline',
    'git branch -d',
  ])('currently fails to resolve %p', (input) => {
    expect(GitExplainer.explain(input)).toBeNull()
  })
})

describe('searchCommands', () => {
  it('returns everything for an empty query', () => {
    expect(GitExplainer.searchCommands('')).toHaveLength(25)
  })

  it('is case-insensitive', () => {
    expect(GitExplainer.searchCommands('BRANCH')).toEqual(GitExplainer.searchCommands('branch'))
  })

  it('returns nothing for a non-match', () => {
    expect(GitExplainer.searchCommands('zzzznope')).toEqual([])
  })
})

describe('getRandomTip', () => {
  afterEach(() => vi.restoreAllMocks())

  it('returns the first command at the bottom of the range', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(GitExplainer.getRandomTip()).toBe(GitExplainer.getAllCommands()[0])
  })

  it('returns the last command at the top of the range', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999999)
    expect(GitExplainer.getRandomTip()).toBe(GitExplainer.getAllCommands()[24])
  })
})
