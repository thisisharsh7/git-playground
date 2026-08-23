import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { QuizComponent } from '@/components/quiz'
import { quizzes } from '@/data/quizzes'

const quiz = quizzes[0] // git-basics: 5 questions, 10 minute limit

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

function start() {
  fireEvent.click(screen.getByRole('button', { name: /start quiz/i }))
}

describe('quiz timer expiry (D2.2)', () => {
  it('calls onComplete exactly once when the timer runs out', async () => {
    const onComplete = vi.fn()
    render(<QuizComponent quiz={quiz} onComplete={onComplete} onBack={() => {}} />)
    start()

    // Run past the full time limit.
    await act(async () => {
      vi.advanceTimersByTime((quiz.timeLimit! * 60 + 5) * 1000)
    })

    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('does not call onComplete before the timer expires', async () => {
    const onComplete = vi.fn()
    render(<QuizComponent quiz={quiz} onComplete={onComplete} onBack={() => {}} />)
    start()

    await act(async () => {
      vi.advanceTimersByTime(5000)
    })

    expect(onComplete).not.toHaveBeenCalled()
  })

  it('stops the countdown once results are shown', async () => {
    const onComplete = vi.fn()
    render(<QuizComponent quiz={quiz} onComplete={onComplete} onBack={() => {}} />)
    start()

    await act(async () => {
      vi.advanceTimersByTime((quiz.timeLimit! * 60 + 5) * 1000)
    })
    const callsAfterExpiry = onComplete.mock.calls.length

    await act(async () => {
      vi.advanceTimersByTime(60_000)
    })
    expect(onComplete.mock.calls.length).toBe(callsAfterExpiry)
  })
})
