import { describe, expect, it } from 'vitest'
import { getQuizByLessonId, quizzes } from '@/data/quizzes'
import { lessons } from '@/components/git-lessons'
import { lessonContent } from '@/components/interactive-lesson'
import { GitExplainer } from '@/lib/git-explainer'

const lessonIds = ['git-basics', 'branching', 'remote-repos', 'advanced-git']

describe('lessons', () => {
  it('has 4 lessons in the exact order the unlock gate depends on', () => {
    // isLessonUnlocked() in git-lessons.tsx gates on array position, so this
    // order is a behavioural contract, not presentation.
    expect(lessons.map((lesson) => lesson.id)).toEqual(lessonIds)
  })

  it('every lesson has content', () => {
    expect(Object.keys(lessonContent).sort()).toEqual([...lessonIds].sort())
  })

  it('holds 14 steps, distributed 4/4/3/3', () => {
    const counts = lessonIds.map((id) => lessonContent[id].length)
    expect(counts).toEqual([4, 4, 3, 3])
    expect(counts.reduce((a, b) => a + b, 0)).toBe(14)
  })

  it('every step has sequential ids and non-empty teaching fields', () => {
    for (const id of lessonIds) {
      const steps = lessonContent[id]
      expect(steps.map((step) => step.id)).toEqual(steps.map((_, index) => index + 1))
      for (const step of steps) {
        expect(step.title.length, `${id} title`).toBeGreaterThan(0)
        expect(step.command.length, `${id} command`).toBeGreaterThan(0)
        expect(step.explanation.length, `${id} explanation`).toBeGreaterThan(0)
      }
    }
  })
})

describe('quizzes', () => {
  it('has 4 quizzes of 5 questions each, 20 in total', () => {
    expect(quizzes).toHaveLength(4)
    expect(quizzes.map((quiz) => quiz.questions.length)).toEqual([5, 5, 5, 5])
    expect(quizzes.flatMap((quiz) => quiz.questions)).toHaveLength(20)
  })

  it('every quiz maps to a real lesson, and every lesson has a quiz', () => {
    for (const quiz of quizzes) {
      expect(lessonIds).toContain(quiz.lessonId)
    }
    for (const id of lessonIds) {
      expect(getQuizByLessonId(id), id).toBeDefined()
    }
  })

  it('returns undefined for an unknown lesson', () => {
    expect(getQuizByLessonId('nope')).toBeUndefined()
  })

  it('question ids are unique within each quiz', () => {
    for (const quiz of quizzes) {
      const ids = quiz.questions.map((question) => question.id)
      expect(new Set(ids).size, quiz.id).toBe(ids.length)
    }
  })

  it('every multiple-choice answer indexes a real option', () => {
    for (const quiz of quizzes) {
      for (const question of quiz.questions) {
        if (question.type !== 'multiple-choice') continue
        expect(question.options, `${quiz.id}/${question.id}`).toBeDefined()
        expect(typeof question.correctAnswer).toBe('number')
        expect(question.correctAnswer as number).toBeGreaterThanOrEqual(0)
        expect(question.correctAnswer as number).toBeLessThan(question.options!.length)
      }
    }
  })

  it('every true-false answer is a boolean', () => {
    for (const quiz of quizzes) {
      for (const question of quiz.questions) {
        if (question.type !== 'true-false') continue
        expect(typeof question.correctAnswer, `${quiz.id}/${question.id}`).toBe('boolean')
      }
    }
  })

  // quiz.tsx renders nothing for 'fill-blank' even though the type allows it,
  // so adding one would ship an unanswerable question. This guard fails first.
  it('contains no fill-blank question', () => {
    for (const quiz of quizzes) {
      for (const question of quiz.questions) {
        expect(question.type, `${quiz.id}/${question.id}`).not.toBe('fill-blank')
      }
    }
  })

  it('every question explains its answer', () => {
    for (const quiz of quizzes) {
      for (const question of quiz.questions) {
        expect(question.explanation.length, `${quiz.id}/${question.id}`).toBeGreaterThan(0)
      }
    }
  })
})

describe('quiz scoring thresholds', () => {
  // quiz.tsx scores with Math.round((correct / total) * 100), so a 5-question
  // quiz can only ever produce 0, 20, 40, 60, 80 or 100.
  const attainable = (total: number) =>
    Array.from({ length: total + 1 }, (_, correct) => Math.round((correct / total) * 100))

  // Documents the drift between the advertised threshold and the real one.
  it('effective minimum passing score per quiz', () => {
    const effective = quizzes.map((quiz) => {
      const scores = attainable(quiz.questions.length)
      return Math.min(...scores.filter((score) => score >= quiz.passingScore))
    })
    expect(quizzes.map((quiz) => quiz.passingScore)).toEqual([70, 75, 80, 85])
    expect(effective).toEqual([80, 80, 80, 100])
  })

  // KNOWN DEFECT (D2.3), fixed in Phase 4. advanced-git advertises "85% required"
  // but 85 is unattainable on 5 questions, so it silently demands a perfect
  // score. it.fails() keeps CI green; when Phase 4 lands an achievable value
  // this test will start failing and must be converted to a plain it().
  it.fails('every quiz is passable without a perfect score', () => {
    for (const quiz of quizzes) {
      const scores = attainable(quiz.questions.length)
      const passingBelowPerfect = scores.filter(
        (score) => score >= quiz.passingScore && score < 100,
      )
      expect(passingBelowPerfect.length, quiz.id).toBeGreaterThan(0)
    }
  })
})

describe('lesson commands resolve in the reference', () => {
  // Pinned gap: 'git branch -d' is advertised by the branching lesson but the
  // explainer is exact-match only, so it cannot resolve. Asserting the exact
  // list means any NEW gap fails the build. Phase 4 closes this one.
  it('only git branch -d is unresolvable', () => {
    const unresolvable = lessons
      .flatMap((lesson) => lesson.commands)
      .filter((command) => !GitExplainer.explain(command))
    expect(unresolvable).toEqual(['git branch -d'])
  })
})
