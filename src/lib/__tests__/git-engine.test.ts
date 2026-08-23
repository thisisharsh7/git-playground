// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  createInitialGitState,
  executeGitCommand,
  type GitState,
} from '@/lib/git-engine'

const DEPS = {
  now: () => '2026-01-01T00:00:00.000Z',
  nextId: () => 'zzz9999',
  formatTimestamp: () => 'FIXED_DATE',
}

const run = (state: GitState, input: string) => executeGitCommand(state, input, DEPS)!

describe('executeGitCommand', () => {
  it('returns null for empty input', () => {
    expect(executeGitCommand(createInitialGitState(), '   ', DEPS)).toBeNull()
  })

  it('produces deterministic commit output when its deps are injected', () => {
    let state = createInitialGitState()
    state = run(state, 'git add .').state
    const result = run(state, 'git commit -m "hello"')
    expect(result.output).toBe('[main zzz9999] hello')
    expect(result.success).toBe(true)
  })

  // formatTimestamp must be injectable or `git log` output is locale-dependent
  // and therefore untestable.
  it('renders git log through the injected formatter', () => {
    const result = run(createInitialGitState(), 'git log')
    expect(result.output).toBe(
      'commit a1b2c3d\nAuthor: Developer\nDate: FIXED_DATE\n\n    Initial commit\n',
    )
  })
})

// D1.1. These four pins are the reason the engine had to become directly
// importable: the UI cannot observe input mutation, because setGitState is
// still handed a fresh top-level object either way. The damage is latent until
// something memoizes on gitState.commits — i.e. when the visualization is
// wired to live state.
describe('D1.1 the engine mutates the state it is given', () => {
  it('pins: git branch mutates the input branches array', () => {
    const state = createInitialGitState()
    run(state, 'git branch feature')
    expect(state.branches).toEqual(['main', 'feature'])
  })

  it('pins: git commit mutates the input commits array', () => {
    const state = createInitialGitState()
    const staged = run(state, 'git add .').state
    run(staged, 'git commit -m "x"')
    expect(state.commits).toHaveLength(2)
  })

  it('pins: git add <file> mutates the input stagingArea array', () => {
    const state = createInitialGitState()
    run(state, 'git add README.md')
    expect(state.stagingArea).toEqual(['README.md'])
  })

  it('pins: git remote add mutates the input remotes array', () => {
    const state = createInitialGitState()
    run(state, 'git remote add origin https://example.com/r.git')
    expect(state.remotes).toEqual(['origin -> https://example.com/r.git'])
  })

  // The planned direct immutability test. Phase 3 is a bug-for-bug move, so
  // this fails today and it.fails() keeps CI green. Phase 4 deep-copies the six
  // arrays at engine entry; this test will then start failing and must be
  // converted to a plain it(), and the four pins above inverted.
  it.fails('a pure engine should not touch its input state', () => {
    const state = createInitialGitState()
    const before = structuredClone(state)
    run(state, 'git branch feature')
    run(state, 'git add README.md')
    expect(state).toEqual(before)
  })
})

// The constraint that lets the playground prerender into static HTML. Losing it
// is exactly how /git-playground ended up serving only a spinner.
describe('playground component purity', () => {
  it('does not import next/navigation', () => {
    const source = readFileSync('src/components/playground/git-playground.tsx', 'utf8')
    expect(source).not.toMatch(/from ['"]next\/navigation['"]/)
    // Match invocations, not the prose in this file's own doc comment.
    expect(source).not.toMatch(/\buseSearchParams\(|\buseRouter\(|\busePathname\(/)
  })
})
