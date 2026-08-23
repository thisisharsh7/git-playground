import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ThemeProvider, useTheme } from '@/components/theme-provider'

function Probe() {
  const { theme, setTheme } = useTheme()
  return (
    <button onClick={() => setTheme('dark')} data-testid="probe">
      {theme}
    </button>
  )
}

// D2.11 removed a dead `context === undefined` check from useTheme. These pin
// the behaviour that removal had to preserve. Theme *behaviour* itself (the
// first-visit flash, D2.9) is deliberately untouched.
describe('useTheme outside a provider (D2.11)', () => {
  it('returns the default context instead of throwing', () => {
    expect(() => render(<Probe />)).not.toThrow()
    expect(screen.getByTestId('probe')).toHaveTextContent('light')
  })

  it('exposes a no-op setTheme', () => {
    render(<Probe />)
    fireEvent.click(screen.getByTestId('probe'))
    expect(screen.getByTestId('probe')).toHaveTextContent('light')
  })
})

describe('useTheme inside a provider', () => {
  it('reads the provider default', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <Probe />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('probe')).toHaveTextContent('dark')
  })

  it('setTheme updates the theme and persists it under the existing key', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <Probe />
      </ThemeProvider>,
    )
    fireEvent.click(screen.getByTestId('probe'))
    expect(screen.getByTestId('probe')).toHaveTextContent('dark')
    expect(localStorage.getItem('git-master-theme')).toBe('dark')
  })
})
