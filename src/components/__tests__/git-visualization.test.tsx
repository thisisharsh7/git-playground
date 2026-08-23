import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { GitVisualization } from '@/components/git-visualization'

describe('view subtrees are not remounted (D2.10)', () => {
  it('keeps the same DOM nodes across an unrelated parent re-render', () => {
    const { rerender } = render(<GitVisualization onNavigateToLesson={() => {}} />)
    const before = screen.getByText('Git Workflow Visualization')

    // A new prop identity re-renders the parent without changing the view.
    // While the view components were declared inside the parent, each render
    // produced a new component type, so React remounted the whole subtree and
    // replaced these DOM nodes.
    rerender(<GitVisualization onNavigateToLesson={() => {}} />)

    expect(screen.getByText('Git Workflow Visualization')).toBe(before)
  })

  it('still swaps the subtree when the view actually changes', () => {
    render(<GitVisualization />)
    expect(screen.getByText('Git Workflow Visualization')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Commit Tree' }))
    expect(screen.queryByText('Git Workflow Visualization')).not.toBeInTheDocument()

    // Exact name: "Git Workflow Visualization" is also matched by a loose regex.
    fireEvent.click(screen.getByRole('button', { name: 'Git Workflow' }))
    expect(screen.getByText('Git Workflow Visualization')).toBeInTheDocument()
  })

  it('still routes the lesson buttons to their lesson ids', () => {
    const onNavigateToLesson = vi.fn()
    render(<GitVisualization onNavigateToLesson={onNavigateToLesson} />)

    fireEvent.click(screen.getByRole('button', { name: /practice branching/i }))
    expect(onNavigateToLesson).toHaveBeenCalledWith('branching')
  })
})
