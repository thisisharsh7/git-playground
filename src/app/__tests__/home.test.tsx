import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Home from '@/app/page'
import { expectNoAxeViolations } from '@/test/axe'

// `/` is a synchronous server component with no server-only APIs, so RTL can
// render it directly.

const outline = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('h1,h2,h3,h4,h5,h6')).map((el) => ({
    level: Number(el.tagName[1]),
    text: el.textContent?.trim(),
  }))

describe('homepage hero is unchanged', () => {
  it('has exactly one h1, reading "Git Master"', () => {
    const { container } = render(<Home />)
    const h1s = container.querySelectorAll('h1')
    expect(h1s).toHaveLength(1)
    expect(h1s[0].textContent?.trim()).toBe('Git Master')
  })

  it('keeps the hero paragraph verbatim', () => {
    render(<Home />)
    expect(
      screen.getByText(
        'Master Git version control with our interactive playground. Learn Git commands, visualize workflows, and understand version control concepts through hands-on practice.',
      ),
    ).toBeInTheDocument()
  })

  it('keeps the hero CTA anchor text and href', () => {
    const { container } = render(<Home />)
    const cta = Array.from(container.querySelectorAll('a')).find((a) =>
      a.textContent?.includes('Start Learning Git'),
    )
    expect(cta).toBeDefined()
    expect(cta).toHaveAttribute('href', '/git-playground?tab=playground')
  })

  it('keeps all three original CTA hrefs', () => {
    const { container } = render(<Home />)
    const hrefs = Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href'))
    expect(hrefs).toContain('/git-playground?tab=playground')
    expect(hrefs).toContain('/git-playground?tab=lessons')
    expect(hrefs).toContain('/git-playground?tab=visualization')
  })
})

describe('playground section on the homepage', () => {
  it('uses the exact H2 text', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { level: 2, name: 'Interactive Git Playground' })
    expect(heading).toBeInTheDocument()
  })

  it('sits after the hero and before the feature cards', () => {
    const { container } = render(<Home />)
    const text = container.textContent ?? ''
    const hero = text.indexOf('Master Git version control with our interactive playground.')
    const cta = text.indexOf('Start Learning Git')
    const section = text.indexOf('Interactive Git Playground')
    const features = text.indexOf('Interactive Terminal')
    expect(hero).toBeLessThan(cta)
    expect(cta).toBeLessThan(section)
    expect(section).toBeLessThan(features)
  })

  it('mounts the terminal, repository state and quick commands', () => {
    render(<Home />)
    expect(screen.getByLabelText('Git command')).toBeInTheDocument()
    expect(screen.getByRole('log', { name: 'Terminal output' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Repository State' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Quick Commands' })).toBeInTheDocument()
  })

  it('does not load lessons, quizzes, the command catalogue or the visualization', () => {
    const { container } = render(<Home />)
    const text = container.textContent ?? ''
    expect(text).not.toContain('Git commands covered:')
    expect(text).not.toContain('git cherry-pick')
    expect(text).not.toContain('Git Workflow Visualization')
    expect(text).not.toContain('Passing Score')
  })

  it('runs a command from the keyboard', () => {
    render(<Home />)
    const input = screen.getByLabelText('Git command')
    fireEvent.change(input, { target: { value: 'git status' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect((input as HTMLInputElement).value).toBe('')
  })
})

describe('homepage document structure', () => {
  it('never skips a heading level', () => {
    const { container } = render(<Home />)
    const levels = outline(container).map((h) => h.level)
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1)
    }
  })

  it('has no axe violations', async () => {
    const { container } = render(<Home />)
    await expectNoAxeViolations(container)
  })
})
