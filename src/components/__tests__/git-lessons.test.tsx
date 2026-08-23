import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GitLessons } from '@/components/git-lessons'

const KEY = 'git-lessons-progress'

const seed = (entries: Array<Record<string, unknown>>) =>
  localStorage.setItem(KEY, JSON.stringify(entries))

const passed = (lessonId: string, quizScore = 100) => ({
  lessonId,
  lessonCompleted: true,
  quizCompleted: true,
  quizPassed: true,
  quizScore,
})

describe('lesson deep link (D1.13)', () => {
  it('opens the requested lesson', () => {
    render(<GitLessons initialLessonId="git-basics" />)
    // The detail view shows the lesson's own commands; the list does not.
    expect(screen.getByText('Git commands covered:')).toBeInTheDocument()
  })

  it('ignores an unknown lesson id and stays on the list', () => {
    render(<GitLessons initialLessonId="does-not-exist" />)
    expect(screen.queryByText('Git commands covered:')).not.toBeInTheDocument()
    expect(screen.getByText('Git Basics')).toBeInTheDocument()
  })

  it('does not let a deep link bypass the progression gate', () => {
    // remote-repos is the third lesson, so it needs branching passed.
    render(<GitLessons initialLessonId="remote-repos" />)
    expect(screen.queryByText('Git commands covered:')).not.toBeInTheDocument()
  })

  it('opens a later lesson once its prerequisite is passed', () => {
    seed([passed('git-basics'), passed('branching')])
    render(<GitLessons initialLessonId="remote-repos" />)
    expect(screen.getByText('Git commands covered:')).toBeInTheDocument()
  })

  it('renders the list when no lesson is requested', () => {
    render(<GitLessons />)
    expect(screen.queryByText('Git commands covered:')).not.toBeInTheDocument()
  })
})
