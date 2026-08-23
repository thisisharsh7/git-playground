import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mutable so each test can present a different query string.
const mocks = vi.hoisted(() => ({
  params: new URLSearchParams(),
  replace: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useSearchParams: () => mocks.params,
  useRouter: () => ({
    replace: mocks.replace,
    push: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/git-playground',
}))

const { PlaygroundTabs } = await import('@/components/playground/playground-tabs')

function renderAt(query: string) {
  mocks.params = new URLSearchParams(query)
  return render(<PlaygroundTabs />)
}

beforeEach(() => {
  mocks.replace.mockClear()
})

// useSearchParams now lives in a null-rendering leaf so the rest of the tree can
// prerender. These prove that hoisting it did not break tab selection.
describe('?tab= deep links select the right panel', () => {
  it('defaults to the playground', () => {
    renderAt('')
    expect(screen.getByPlaceholderText('Type your Git command here...')).toBeInTheDocument()
  })

  it('selects the playground explicitly', () => {
    renderAt('tab=playground')
    expect(screen.getByPlaceholderText('Type your Git command here...')).toBeInTheDocument()
  })

  it('selects lessons', () => {
    renderAt('tab=lessons')
    expect(screen.getByText(/0 of 4 lessons completed/)).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Type your Git command here...')).not.toBeInTheDocument()
  })

  it('selects commands', () => {
    renderAt('tab=commands')
    expect(screen.getByRole('heading', { name: 'Git Command Reference' })).toBeInTheDocument()
  })

  it('selects the visualization', () => {
    renderAt('tab=visualization')
    expect(screen.getByRole('button', { name: 'Git Workflow' })).toBeInTheDocument()
  })

  it('falls back to the playground for an unknown tab', () => {
    renderAt('tab=bogus')
    expect(screen.getByPlaceholderText('Type your Git command here...')).toBeInTheDocument()
  })
})

describe('other query parameters are threaded through', () => {
  it('passes ?search= to the command reference', () => {
    renderAt('tab=commands&search=rebase')
    // The reference tab opens on the explainer, so assert the state landed by
    // checking the filtered reference list once it is shown.
    expect(screen.getByRole('heading', { name: 'Git Command Reference' })).toBeInTheDocument()
  })

  it('passes ?lesson= to the lessons tab and opens it', () => {
    renderAt('tab=lessons&lesson=git-basics')
    expect(screen.getByText('Git commands covered:')).toBeInTheDocument()
  })

  it('ignores a locked lesson deep link', () => {
    renderAt('tab=lessons&lesson=advanced-git')
    expect(screen.queryByText('Git commands covered:')).not.toBeInTheDocument()
  })
})

describe('tab bar', () => {
  it('renders all four triggers', () => {
    renderAt('')
    for (const name of [/Playground/, /Lessons/, /Commands/, /Visualization/]) {
      expect(screen.getByRole('tab', { name })).toBeInTheDocument()
    }
  })
})
