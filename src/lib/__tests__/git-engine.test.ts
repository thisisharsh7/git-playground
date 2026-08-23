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

  // D1.10. Uses the real default generator, not the injected stub.
  it('generates fixed-length lowercase hex commit ids', () => {
    const ids = new Set<string>()
    for (let i = 0; i < 500; i++) {
      let state = createInitialGitState()
      state = executeGitCommand(state, 'git add .')!.state
      const output = executeGitCommand(state, 'git commit -m "x"')!.output
      const id = output.match(/^\[main ([^\]]+)\]/)![1]
      expect(id).toMatch(/^[0-9a-f]{7}$/)
      ids.add(id)
    }
    // Not a strict guarantee, but 500 draws from 16^7 should not collide much.
    expect(ids.size).toBeGreaterThan(490)
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

// FIXED in Phase 4B. These assertions are the reason the engine had to become
// directly importable: the UI cannot observe input mutation, because
// setGitState is handed a fresh top-level object either way. The damage was
// latent until something memoized on gitState.commits — i.e. once the
// visualization is wired to live state.
describe('D1.1 the engine does not mutate the state it is given', () => {
  it('git branch leaves the input branches array alone', () => {
    const state = createInitialGitState()
    const result = run(state, 'git branch feature')
    expect(state.branches).toEqual(['main'])
    expect(result.state.branches).toEqual(['main', 'feature'])
  })

  it('git commit leaves the input commits array alone', () => {
    const state = createInitialGitState()
    const staged = run(state, 'git add .').state
    const result = run(staged, 'git commit -m "x"')
    expect(staged.commits).toHaveLength(1)
    expect(result.state.commits).toHaveLength(2)
  })

  it('git add <file> leaves the input stagingArea array alone', () => {
    const state = createInitialGitState()
    const result = run(state, 'git add README.md')
    expect(state.stagingArea).toEqual([])
    expect(result.state.stagingArea).toEqual(['README.md'])
  })

  it('git remote add leaves the input remotes array alone', () => {
    const state = createInitialGitState()
    const result = run(state, 'git remote add origin https://example.com/r.git')
    expect(state.remotes).toEqual([])
    expect(result.state.remotes).toEqual(['origin -> https://example.com/r.git'])
  })

  it('returns a state whose arrays are not shared with the input', () => {
    const state = createInitialGitState()
    const result = run(state, 'git status')
    for (const key of ['branches', 'commits', 'workingDirectory', 'stagingArea', 'remotes'] as const) {
      expect(result.state[key], key).not.toBe(state[key])
    }
  })

  it('does not touch its input state across a sequence of commands', () => {
    const state = createInitialGitState()
    const before = structuredClone(state)
    run(state, 'git branch feature')
    run(state, 'git add README.md')
    run(state, 'git remote add origin https://example.com/r.git')
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
