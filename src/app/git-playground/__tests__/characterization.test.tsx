import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import GitPlaygroundPage from '@/app/git-playground/page'

// Tab state lives in the route file, so the page needs these three hooks.
// With useSearchParams mocked there is no suspension and the Suspense
// fallback never renders.
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ replace: vi.fn(), push: vi.fn(), prefetch: vi.fn(), back: vi.fn() }),
  usePathname: () => '/git-playground',
}))

// These tests pin the CURRENT behaviour of executeCommand (page.tsx:132-247)
// through the UI, before Phase 3 moves it into src/lib/git-engine.ts. A test
// written after the extraction could not prove the extraction preserved
// behaviour, which is why they exist now and must pass UNMODIFIED afterwards.
//
// Assertions of wrong-but-real output are deliberate. Where real git would
// differ, a paired it.fails() states the correct behaviour and names the phase
// that delivers it.

const PLACEHOLDER = 'Type your Git command here...'

// Command output is rendered into the transcript; reading body text keeps these
// assertions independent of the markup Phase 3 will restructure.
const out = () => document.body.textContent ?? ''

async function settle() {
  // executeCommand wraps its work in setTimeout(..., 300).
  await act(async () => {
    vi.advanceTimersByTime(300)
  })
}

async function quick(label: string) {
  fireEvent.click(screen.getByRole('button', { name: label }))
  await settle()
}

async function type(command: string) {
  fireEvent.change(screen.getByPlaceholderText(PLACEHOLDER), { target: { value: command } })
  fireEvent.click(screen.getByRole('button', { name: 'Execute' }))
  await settle()
}

beforeEach(() => {
  vi.useFakeTimers()
  render(<GitPlaygroundPage />)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('initial state', () => {
  it('seeds the transcript with git init and the first commit', () => {
    expect(out()).toContain('Initialized empty Git repository in /project/.git/')
    expect(out()).toContain('a1b2c3d')
    expect(out()).toContain('Initial commit')
  })

  it('shows main as the only branch and two working-directory files', () => {
    expect(out()).toContain('README.md')
    expect(out()).toContain('index.html')
    expect(screen.getByText('★ main')).toBeInTheDocument()
  })

  it('marks the newest commit as HEAD', () => {
    expect(screen.getByText('HEAD')).toBeInTheDocument()
  })
})

describe('supported commands', () => {
  it('git status lists both files as untracked', async () => {
    await quick('Status')
    expect(out()).toContain('On branch main')
    // Never-committed files are untracked, not modified.
    expect(out()).toContain('Untracked files:')
    expect(out()).not.toContain('Changes not staged for commit:')
  })

  it('git add . stages everything', async () => {
    await quick('Add All')
    expect(out()).toContain('Added all files to staging area')
    expect(screen.getAllByText('Staged')).toHaveLength(2)
  })

  it('git status after staging reports files as to-be-committed', async () => {
    await quick('Add All')
    await quick('Status')
    expect(out()).toContain('Changes to be committed:')
  })

  it('git commit creates a commit and clears the staging area', async () => {
    await quick('Add All')
    await quick('Commit')
    expect(out()).toMatch(/\[main \S+\] Update files/)
    expect(screen.queryByText('Staged')).not.toBeInTheDocument()
  })

  it('git commit with nothing staged is rejected', async () => {
    await quick('Commit')
    expect(out()).toContain('nothing added to commit but untracked files present')
  })

  it('git branch lists main as current', async () => {
    await quick('Branches')
    expect(out()).toContain('* main')
  })

  it('git branch feature creates a branch', async () => {
    await quick('New Branch')
    expect(out()).toContain("Created branch 'feature'")
    expect(screen.getByText('feature')).toBeInTheDocument()
  })

  it('git branch feature twice is rejected', async () => {
    await quick('New Branch')
    await quick('New Branch')
    expect(out()).toContain("fatal: A branch named 'feature' already exists.")
  })

  it('git checkout switches branch', async () => {
    await quick('New Branch')
    await quick('Checkout')
    expect(out()).toContain("Switched to branch 'feature'")
    expect(screen.getByText('★ feature')).toBeInTheDocument()
  })

  it('git checkout of a missing branch is rejected', async () => {
    await quick('Checkout')
    expect(out()).toContain(
      "error: pathspec 'feature' did not match any file(s) known to git",
    )
  })

  it('git log shows the seeded commit', async () => {
    await quick('Log')
    expect(out()).toContain('commit a1b2c3d')
    expect(out()).toContain('Author: Developer')
  })

  it('git remote -v reports no remotes', async () => {
    await quick('Remotes')
    expect(out()).toContain('No remotes configured')
  })

  it('an unknown git subcommand is rejected', async () => {
    await type('git push')
    expect(out()).toContain("git: 'push' is not a git command. See 'git --help'.")
  })

  it('a non-git command is rejected', async () => {
    await type('ls')
    expect(out()).toContain('bash: ls: command not found')
  })

  it('whitespace-only input cannot be submitted', () => {
    fireEvent.change(screen.getByPlaceholderText(PLACEHOLDER), { target: { value: '   ' } })
    expect(screen.getByRole('button', { name: 'Execute' })).toBeDisabled()
  })
})

// Each block pins the real current output first (so Phase 3 cannot change it
// silently), then states the correct behaviour in an it.fails() that will begin
// failing the moment Phase 4 lands the fix — forcing it to be converted.
describe('pinned defects', () => {
  // FIXED in Phase 4B.
  describe('D1.9 working-tree lifecycle', () => {
    it('a committed file is no longer reported as modified or untracked', async () => {
      await quick('Add All')
      await quick('Commit')
      await quick('Status')
      expect(out()).toContain('nothing to commit, working tree clean')
      expect(out()).not.toContain('Untracked files:')
    })

    it('the same unchanged files cannot be committed twice', async () => {
      await quick('Add All')
      await quick('Commit')
      await quick('Add All')
      await quick('Commit')
      // Exactly one commit from one unchanged working directory.
      expect(out().match(/\] Update files/g)).toHaveLength(1)
      expect(out()).toContain('nothing to commit, working tree clean')
    })

    it('staged but never-committed files are shown as new files', async () => {
      await quick('Add All')
      await quick('Status')
      expect(out()).toContain('Changes to be committed:')
      expect(out()).toContain('new file:')
      expect(out()).not.toContain('modified:')
    })

    it('re-staging a tracked file reports it as modified, not new', async () => {
      await quick('Add All')
      await quick('Commit')
      await type('git add README.md')
      await quick('Status')
      expect(out()).toContain('modified:')
      expect(out()).not.toContain('new file:')
    })

    it('git add . after committing everything has nothing to stage', async () => {
      await quick('Add All')
      await quick('Commit')
      await quick('Add All')
      expect(screen.queryByText('Staged')).not.toBeInTheDocument()
    })
  })

  // FIXED in Phase 4B.
  describe('D1.3 git log ancestry', () => {
    it('a new branch inherits its parent history', async () => {
      await quick('New Branch')
      await quick('Checkout')
      await quick('Log')
      expect(out()).toContain('commit a1b2c3d')
    })

    it('a branch created with checkout -b inherits history too', async () => {
      await type('git checkout -b feature')
      await quick('Log')
      expect(out()).toContain('commit a1b2c3d')
    })

    it('a branch does not see commits its parent gained after the split', async () => {
      // Branch first, then commit on main, then look from the branch.
      await quick('New Branch')
      await quick('Add All')
      await type('git commit -m "later on main"')
      await quick('Checkout')
      await quick('Log')
      expect(out()).toContain('commit a1b2c3d')
      expect(out()).not.toContain('    later on main')
    })

    it('main does not see commits made on a branch', async () => {
      await type('git checkout -b feature')
      await quick('Add All')
      await type('git commit -m "only on feature"')
      await type('git checkout main')
      await quick('Log')
      expect(out()).not.toContain('    only on feature')
    })
  })

  // FIXED in Phase 4A.
  describe('D1.7 missing required arguments', () => {
    it('bare git add reports that nothing was specified', async () => {
      await type('git add')
      expect(out()).toContain('Nothing specified, nothing added.')
      expect(out()).toContain("hint: Maybe you wanted to say 'git add .'?")
    })

    it('bare git checkout prints usage', async () => {
      await type('git checkout')
      expect(out()).toContain('usage: git checkout <branch>')
    })

    it('git remote add without a url prints usage', async () => {
      await type('git remote add origin')
      expect(out()).toContain('usage: git remote add <name> <url>')
    })

    it('an unknown remote subcommand is reported', async () => {
      await type('git remote rename a b')
      expect(out()).toContain('error: Unknown subcommand: rename')
    })

    // Not an error: bare `git remote` lists remote names, and real git prints
    // nothing when none are configured.
    it('bare git remote lists configured remotes', async () => {
      await type('git remote add origin https://example.com/r.git')
      await type('git remote')
      expect(out()).toContain('origin')
    })
  })

  // FIXED in Phase 4B.
  describe('D1.11 whitespace handling', () => {
    it('tolerates repeated inner whitespace', async () => {
      await type('git  status')
      expect(out()).toContain('On branch main')
      expect(out()).not.toContain("git: '' is not a git command.")
    })

    it('tolerates surrounding whitespace', async () => {
      await type('   git status   ')
      expect(out()).toContain('On branch main')
    })

    it('tolerates tabs between arguments', async () => {
      await type('git\tbranch\tfeature')
      expect(out()).toContain("Created branch 'feature'")
    })

    it('still keeps whitespace inside a quoted commit message', async () => {
      await quick('Add All')
      await type('git   commit   -m   "two  spaces"')
      expect(out()).toContain('two  spaces')
    })
  })

  // FIXED in Phase 4A.
  describe('D1.6 bare git', () => {
    it('prints usage instead of the literal string undefined', async () => {
      await type('git')
      expect(out()).toContain('usage: git <command> [<args>]')
      expect(out()).not.toContain('undefined')
    })

    it('lists the commands the simulator actually supports', async () => {
      await type('git')
      expect(out()).toContain('add, branch, checkout, commit, log, remote, status')
    })
  })

  // FIXED in Phase 4A. Flags are no longer read as branch names.
  describe('D1.4 and D1.5 flag parsing', () => {
    it('git checkout -b creates and switches to the branch', async () => {
      await type('git checkout -b feature')
      expect(out()).toContain("Switched to a new branch 'feature'")
      expect(screen.getByText('★ feature')).toBeInTheDocument()
    })

    it('git checkout -b onto an existing branch is refused', async () => {
      await quick('New Branch')
      await type('git checkout -b feature')
      expect(out()).toContain("fatal: a branch named 'feature' already exists")
    })

    it('git branch -d deletes a branch', async () => {
      await quick('New Branch')
      await type('git branch -d feature')
      expect(out()).toContain('Deleted branch feature (was a1b2c3d).')
      expect(screen.queryByText('feature')).not.toBeInTheDocument()
    })

    it('git branch -d of a missing branch is refused', async () => {
      await type('git branch -d nope')
      expect(out()).toContain("error: branch 'nope' not found.")
    })

    it('git branch -d of the checked-out branch is refused', async () => {
      await type('git branch -d main')
      expect(out()).toContain("error: Cannot delete branch 'main' checked out at")
    })

    it('an unrecognised flag is reported as a switch, not created as a branch', async () => {
      await type('git branch -a')
      expect(out()).toContain('error: unknown switch')
      expect(out()).not.toContain("Created branch '-a'")
    })
  })

  // FIXED in Phase 4B.
  describe('D1.8 git commit -m parsing', () => {
    it('bare git commit prints usage instead of inventing a message', async () => {
      await quick('Add All')
      await type('git commit')
      expect(out()).toContain('usage: git commit -m <message>')
      expect(out()).not.toContain('Commit message')
    })

    it('keeps apostrophes inside a double-quoted message', async () => {
      await quick('Add All')
      await type('git commit -m "it\'s fine"')
      expect(out()).toMatch(/\[main [0-9a-f]{7}\] it's fine/)
    })

    it('keeps internal spacing in a quoted message', async () => {
      await quick('Add All')
      await type('git commit -m "two  spaces"')
      expect(out()).toContain('two  spaces')
    })

    it('accepts a single unquoted token', async () => {
      await quick('Add All')
      await type('git commit -m wip')
      expect(out()).toMatch(/\[main [0-9a-f]{7}\] wip/)
    })

    it('refuses an empty message', async () => {
      await quick('Add All')
      await type('git commit -m ""')
      expect(out()).toContain('Aborting commit due to empty commit message.')
    })
  })

  // FIXED in Phase 4C.
  describe('D1.12 text typed during execution', () => {
    it('survives the command that is already running', async () => {
      const input = screen.getByPlaceholderText(PLACEHOLDER) as HTMLInputElement

      // Submit a command, then type the next one during the 300ms window.
      fireEvent.change(input, { target: { value: 'git status' } })
      fireEvent.click(screen.getByRole('button', { name: 'Execute' }))
      expect(input.value).toBe('')

      fireEvent.change(input, { target: { value: 'git branch' } })
      await settle()

      // Previously setCommand('') ran when the command resolved, wiping this.
      expect(input.value).toBe('git branch')
    })

    it('clears the prompt as soon as a command is submitted', async () => {
      const input = screen.getByPlaceholderText(PLACEHOLDER) as HTMLInputElement
      fireEvent.change(input, { target: { value: 'git status' } })
      fireEvent.click(screen.getByRole('button', { name: 'Execute' }))
      expect(input.value).toBe('')
      await settle()
      expect(input.value).toBe('')
    })
  })

  // FIXED in Phase 4C.
  describe('D1.14 terminal focus', () => {
    it('keeps the prompt enabled while a command runs', async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Status' }))
      // Disabling the input used to blur it, dropping focus to <body>.
      expect(screen.getByPlaceholderText(PLACEHOLDER)).not.toBeDisabled()
      await settle()
    })

    it('returns focus to the prompt after a quick command', async () => {
      await quick('Status')
      expect(screen.getByPlaceholderText(PLACEHOLDER)).toHaveFocus()
    })

    it('still blocks overlapping commands via the quick buttons', async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Status' }))
      expect(screen.getByRole('button', { name: 'Status' })).toBeDisabled()
      await settle()
      expect(screen.getByRole('button', { name: 'Status' })).not.toBeDisabled()
    })
  })
})
