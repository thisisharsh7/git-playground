import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GitPlayground } from '@/components/playground/git-playground'
import { expectNoAxeViolations } from '@/test/axe'

const PLACEHOLDER = 'Type your Git command here...'

const headingOutline = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('h1,h2,h3,h4,h5,h6')).map((el) => ({
    level: Number(el.tagName[1]),
    text: el.textContent,
  }))

describe('playground accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<GitPlayground />)
    await expectNoAxeViolations(container)
  })

  it('gives the command prompt an accessible name', () => {
    render(<GitPlayground />)
    // Previously the only hint was a placeholder, which AT may not announce.
    expect(screen.getByLabelText('Git command')).toBe(screen.getByPlaceholderText(PLACEHOLDER))
  })

  it('exposes the transcript as a focusable live log', () => {
    render(<GitPlayground />)
    const log = screen.getByRole('log', { name: 'Terminal output' })
    expect(log).toHaveAttribute('aria-live', 'polite')
    expect(log).toHaveAttribute('tabindex', '0')
  })

  it('runs a command from the keyboard with Enter', () => {
    render(<GitPlayground />)
    const input = screen.getByLabelText('Git command')
    fireEvent.change(input, { target: { value: 'git status' } })
    // onKeyDown, not the deprecated onKeyPress.
    fireEvent.keyDown(input, { key: 'Enter' })
    expect((input as HTMLInputElement).value).toBe('')
  })

  it('ignores Enter while a command is already running', () => {
    render(<GitPlayground />)
    const input = screen.getByLabelText('Git command')
    fireEvent.change(input, { target: { value: 'git status' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    fireEvent.change(input, { target: { value: 'git branch' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    // Second submission is dropped, so the text stays for the user to resend.
    expect((input as HTMLInputElement).value).toBe('git branch')
  })
})

describe('playground heading structure', () => {
  it('nests card titles under an h1 by default', () => {
    const { container } = render(<GitPlayground />)
    expect(headingOutline(container)).toEqual([
      { level: 2, text: 'git-playground' },
      { level: 2, text: 'Repository State' },
      { level: 3, text: 'Current Branch' },
      { level: 3, text: 'All Branches' },
      { level: 3, text: 'Working Directory' },
      { level: 3, text: 'Recent Commits' },
      { level: 2, text: 'Quick Commands' },
    ])
  })

  it('shifts a level deeper when mounted under an h2', () => {
    // What the homepage will need in Phase 7.
    const { container } = render(<GitPlayground headingLevel={3} />)
    expect(headingOutline(container).map((h) => h.level)).toEqual([3, 3, 4, 4, 4, 4, 3])
  })

  it('never skips a heading level at either depth', () => {
    for (const level of [2, 3] as const) {
      const { container, unmount } = render(<GitPlayground headingLevel={level} />)
      const levels = headingOutline(container).map((h) => h.level)
      expect(Math.min(...levels)).toBe(level)
      expect(Math.max(...levels)).toBe(level + 1)
      unmount()
    }
  })
})
