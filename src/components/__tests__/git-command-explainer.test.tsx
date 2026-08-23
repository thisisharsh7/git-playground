import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GitCommandExplainer } from '@/components/git-command-explainer'

const INPUT = 'Type a Git command (e.g., git cherry-pick, git rebase, merge...)'

// The spinner has no accessible name, so it is located by its animation class.
const spinner = () => document.querySelector('.animate-spin')

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('command explainer spinner (D2.4)', () => {
  it('clears the spinner when the query is emptied mid-debounce', async () => {
    render(<GitCommandExplainer />)
    const input = screen.getByPlaceholderText(INPUT)

    // Start a search, then clear it inside the 300ms debounce window.
    fireEvent.change(input, { target: { value: 'rebase' } })
    expect(spinner()).not.toBeNull()

    fireEvent.change(input, { target: { value: '' } })
    expect(spinner()).toBeNull()

    // Still gone once the original debounce would have elapsed.
    await act(async () => {
      vi.advanceTimersByTime(300)
    })
    expect(spinner()).toBeNull()
  })

  it('clears the spinner after a completed search', async () => {
    render(<GitCommandExplainer />)
    fireEvent.change(screen.getByPlaceholderText(INPUT), { target: { value: 'git rebase' } })
    expect(spinner()).not.toBeNull()

    await act(async () => {
      vi.advanceTimersByTime(300)
    })
    expect(spinner()).toBeNull()
  })
})
