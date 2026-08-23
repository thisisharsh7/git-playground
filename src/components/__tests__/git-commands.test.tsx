import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GitCommands } from '@/components/git-commands'

const SEARCH = 'Search commands, descriptions, or use cases...'

// The search box lives in the "Command Reference" inner tab and the component
// defaults to the explainer tab, so it has to be opened first. Radix tabs use
// activationMode="automatic", so focus activates the trigger synchronously —
// unlike userEvent.click, which runs on real timers and went over the 5s test
// timeout under parallel load. The trigger renders both a long and a short
// label (one visible per breakpoint), hence the regex.
function openReference() {
  fireEvent.focus(screen.getByRole('tab', { name: /Command Reference/ }))
  return screen.getByPlaceholderText(SEARCH) as HTMLInputElement
}

describe('command reference search (D2.1)', () => {
  it('keeps every typed character', () => {
    render(<GitCommands />)
    const input = openReference()

    // Typed one character at a time, as a user does. The old effect depended on
    // searchQuery, so each keystroke reset the value to initialSearch ('').
    for (const value of ['r', 're', 'reb']) {
      fireEvent.change(input, { target: { value } })
      expect(input.value).toBe(value)
    }
    expect(input.value).toBe('reb')
  })

  it('filters the command list as you type', () => {
    render(<GitCommands />)
    const input = openReference()

    fireEvent.change(input, { target: { value: 'rebase' } })
    expect(screen.getByText('git rebase')).toBeInTheDocument()
    expect(screen.queryByText('git cherry-pick')).not.toBeInTheDocument()
  })

  it('still adopts the initialSearch prop', () => {
    render(<GitCommands initialSearch="stash" />)
    const input = openReference()
    expect(input.value).toBe('stash')
  })
})
