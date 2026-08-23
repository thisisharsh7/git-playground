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

describe('overall progress (D2.6)', () => {
  it('reports 0 of 4 with no progress stored', () => {
    render(<GitLessons />)
    expect(screen.getByText('0%')).toBeInTheDocument()
    expect(screen.getByText(/0 of 4 lessons completed/)).toBeInTheDocument()
  })

  it('counts one passed lesson out of four as 25%', () => {
    seed([passed('git-basics')])
    render(<GitLessons />)
    expect(screen.getByText('25%')).toBeInTheDocument()
    expect(screen.getByText(/1 of 4 lessons completed/)).toBeInTheDocument()
  })

  it('never exceeds 100% or 4 of 4 when stale entries are stored', () => {
    // Six passed entries, two of which are not real lessons any more.
    // quizScore 80 so the per-lesson badges do not collide with the 100%
    // overall-progress figure this test is asserting on.
    seed([
      passed('git-basics', 80),
      passed('branching', 80),
      passed('remote-repos', 80),
      passed('advanced-git', 80),
      passed('retired-lesson-1', 80),
      passed('retired-lesson-2', 80),
    ])
    render(<GitLessons />)
    expect(screen.getByText('100%')).toBeInTheDocument()
    // Previously this read "6 of 4 lessons completed".
    expect(screen.getByText(/4 of 4 lessons completed/)).toBeInTheDocument()
  })

  it('ignores duplicated entries for the same lesson', () => {
    seed([passed('git-basics'), passed('git-basics'), passed('git-basics')])
    render(<GitLessons />)
    expect(screen.getByText('25%')).toBeInTheDocument()
    expect(screen.getByText(/1 of 4 lessons completed/)).toBeInTheDocument()
  })
})

describe('score rendering (D2.5)', () => {
  it('shows a badge for a legitimate score of 0 instead of a stray "0"', () => {
    seed([
      {
        lessonId: 'git-basics',
        lessonCompleted: true,
        quizCompleted: true,
        quizPassed: false,
        quizScore: 0,
      },
    ])
    render(<GitLessons initialLessonId="git-basics" />)

    expect(screen.getByText('0%')).toBeInTheDocument()
    // The old `quizScore &&` guard evaluated to 0, which React rendered as text
    // next to the "required" line.
    const requiredLine = screen.getByText(/required\)/).parentElement
    expect(requiredLine?.textContent).not.toMatch(/\)\s*0\s*$/)
  })

  it('shows a badge for a score of 100', () => {
    seed([passed('git-basics', 100)])
    render(<GitLessons initialLessonId="git-basics" />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('renders no percentage when a passed lesson has no recorded score', () => {
    seed([
      {
        lessonId: 'git-basics',
        lessonCompleted: true,
        quizCompleted: true,
        quizPassed: true,
      },
    ])
    render(<GitLessons />)
    // Previously this rendered a bare "%" with no number.
    expect(screen.queryByText('%')).not.toBeInTheDocument()
    expect(screen.queryByText('Quiz Score')).not.toBeInTheDocument()
  })
})
