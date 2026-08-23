import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { QuizComponent } from '@/components/quiz'
import { quizzes } from '@/data/quizzes'
import type { Quiz } from '@/types/quiz'

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

// The shipped data has no fill-blank questions, but the type allows them and
// nothing rendered for them, so one would have been unanswerable (D2.12).
const fillBlankQuiz: Quiz = {
  id: 'fb',
  lessonId: 'git-basics',
  title: 'Fill in the blank',
  description: 'x',
  passingScore: 100,
  questions: [
    {
      id: 'q1',
      question: 'Which command stages every change?',
      type: 'fill-blank',
      correctAnswer: 'git add .',
      explanation: 'It stages the whole working tree.',
      difficulty: 'easy',
    },
  ],
}

describe('fill-blank questions (D2.12)', () => {
  it('renders a labelled text input', () => {
    render(<QuizComponent quiz={fillBlankQuiz} onComplete={() => {}} onBack={() => {}} />)
    start()
    expect(screen.getByLabelText('Your answer')).toBeInTheDocument()
  })

  it('does not count a blank or whitespace-only answer as answered', () => {
    render(<QuizComponent quiz={fillBlankQuiz} onComplete={() => {}} onBack={() => {}} />)
    start()
    const submit = screen.getByRole('button', { name: /submit quiz/i })
    expect(submit).toBeDisabled()

    fireEvent.change(screen.getByLabelText('Your answer'), { target: { value: '   ' } })
    expect(submit).toBeDisabled()
  })

  it('accepts the correct answer', () => {
    const onComplete = vi.fn()
    render(<QuizComponent quiz={fillBlankQuiz} onComplete={onComplete} onBack={() => {}} />)
    start()
    fireEvent.change(screen.getByLabelText('Your answer'), { target: { value: 'git add .' } })
    fireEvent.click(screen.getByRole('button', { name: /submit quiz/i }))
    expect(onComplete).toHaveBeenCalledWith(true, 100)
  })

  it('ignores case and surrounding whitespace', () => {
    const onComplete = vi.fn()
    render(<QuizComponent quiz={fillBlankQuiz} onComplete={onComplete} onBack={() => {}} />)
    start()
    fireEvent.change(screen.getByLabelText('Your answer'), { target: { value: '  GIT ADD .  ' } })
    fireEvent.click(screen.getByRole('button', { name: /submit quiz/i }))
    expect(onComplete).toHaveBeenCalledWith(true, 100)
  })

  it('marks a wrong answer wrong', () => {
    const onComplete = vi.fn()
    render(<QuizComponent quiz={fillBlankQuiz} onComplete={onComplete} onBack={() => {}} />)
    start()
    fireEvent.change(screen.getByLabelText('Your answer'), { target: { value: 'git commit' } })
    fireEvent.click(screen.getByRole('button', { name: /submit quiz/i }))
    expect(onComplete).toHaveBeenCalledWith(false, 0)
  })
})

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
