import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

// Every real lesson has a quiz, so the unavailable-quiz path can only be
// reached by removing the data. Isolated in its own file because this mock
// applies to the whole module graph.
vi.mock('@/data/quizzes', () => ({
  quizzes: [],
  getQuizByLessonId: () => undefined,
}))

const { GitLessons } = await import('@/components/git-lessons')

function openQuiz() {
  // "Take Quiz" only appears once the lesson itself is completed.
  localStorage.setItem(
    'git-lessons-progress',
    JSON.stringify([
      {
        lessonId: 'git-basics',
        lessonCompleted: true,
        quizCompleted: false,
        quizPassed: false,
      },
    ]),
  )
  render(<GitLessons initialLessonId="git-basics" />)
  fireEvent.click(screen.getByRole('button', { name: /take quiz/i }))
}

describe('missing quiz data (D2.8)', () => {
  it('explains the problem instead of silently doing nothing', () => {
    openQuiz()
    expect(screen.getByText('Quiz unavailable')).toBeInTheDocument()
    expect(screen.getByText(/could not be loaded/)).toBeInTheDocument()
  })

  it('offers a way back to the lesson list', () => {
    openQuiz()
    fireEvent.click(screen.getByRole('button', { name: /back to lessons/i }))
    expect(screen.queryByText('Quiz unavailable')).not.toBeInTheDocument()
    expect(screen.getByText('Git Basics')).toBeInTheDocument()
  })

  it('offers a way back to the lesson detail', () => {
    openQuiz()
    fireEvent.click(screen.getByRole('button', { name: /back to lesson$/i }))
    expect(screen.queryByText('Quiz unavailable')).not.toBeInTheDocument()
    // Detail view, not the list.
    expect(screen.getByText('Git commands covered:')).toBeInTheDocument()
  })

  it('leaves stored progress untouched', () => {
    openQuiz()
    expect(localStorage.getItem('git-lessons-progress')).not.toContain('"quizCompleted":true')
  })
})
