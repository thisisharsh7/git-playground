import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GitCommands, commandCategories } from '@/components/git-commands'
import { GitExplainer } from '@/lib/git-explainer'

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

describe('category icons (D2.14)', () => {
  // Below the sm breakpoint the labels are hidden, so a repeated icon leaves
  // two filters indistinguishable. remote/collaboration both used Users and
  // advanced/maintenance both used Settings.
  it('gives every category its own icon', () => {
    const icons = commandCategories.map((category) => category.icon)
    expect(new Set(icons).size).toBe(icons.length)
  })

  it('covers every category the command data actually uses', () => {
    const declared = new Set(commandCategories.map((category) => category.id))
    for (const command of GitExplainer.getAllCommands()) {
      expect(declared.has(command.category), command.command).toBe(true)
    }
  })

  // 'All' and 'Advanced' are also difficulty labels, so this uses a category
  // label that is unique on the page to prove the hoisted array stays wired up.
  it('filters the list when a category is selected', () => {
    render(<GitCommands />)
    openReference()

    expect(screen.getByText('git gc')).toBeInTheDocument()
    expect(screen.getByText('git rebase')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Maintenance' }))

    expect(screen.getByText('git gc')).toBeInTheDocument()
    expect(screen.queryByText('git rebase')).not.toBeInTheDocument()
  })
})

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
