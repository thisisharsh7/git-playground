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

  // Was "contains no fill-blank question", guarding against shipping an
  // unanswerable one. Phase 4D made fill-blank renderable and scorable, so the
  // useful guard now is that every shipped type has a renderer.
  it('every question type has a renderer in quiz.tsx', () => {
    const renderable = new Set(['multiple-choice', 'true-false', 'fill-blank'])
    for (const quiz of quizzes) {
      for (const question of quiz.questions) {
        expect(renderable.has(question.type), `${quiz.id}/${question.id}`).toBe(true)
      }
    }
  })

  // A fill-blank answer is compared as a trimmed, lowercased string, so its
  // correctAnswer must be a string rather than an index or boolean.
  it('every fill-blank question has a string answer', () => {
    for (const quiz of quizzes) {
      for (const question of quiz.questions) {
        if (question.type !== 'fill-blank') continue
        expect(typeof question.correctAnswer, `${quiz.id}/${question.id}`).toBe('string')
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

  // FIXED in Phase 4C. The advertised threshold is now the real one: each
  // passingScore is itself an attainable score, so "60% required" means 3/5 and
  // not "actually 4/5". Previously 85 silently demanded a perfect score.
  it('every passingScore is an attainable score', () => {
    for (const quiz of quizzes) {
      expect(attainable(quiz.questions.length), quiz.id).toContain(quiz.passingScore)
    }
  })

  it('the advertised threshold equals the effective threshold', () => {
    for (const quiz of quizzes) {
      const scores = attainable(quiz.questions.length)
      const effective = Math.min(...scores.filter((score) => score >= quiz.passingScore))
      expect(effective, quiz.id).toBe(quiz.passingScore)
    }
  })

  it('every quiz is passable without a perfect score', () => {
    for (const quiz of quizzes) {
      const scores = attainable(quiz.questions.length)
      const passingBelowPerfect = scores.filter(
        (score) => score >= quiz.passingScore && score < 100,
      )
      expect(passingBelowPerfect.length, quiz.id).toBeGreaterThan(0)
    }
  })

  it('keeps a non-decreasing difficulty ramp across the lesson order', () => {
    const scores = quizzes.map((quiz) => quiz.passingScore)
    expect(scores).toEqual([...scores].sort((a, b) => a - b))
  })
})

describe('lesson commands resolve in the reference', () => {
  // Previously 'git branch -d' could not resolve, because lookup was
  // exact-match only. Phase 4D's longest-prefix matching closed that gap, so
  // every command a lesson advertises now has documentation behind it.
  it('every advertised lesson command resolves', () => {
    const unresolvable = lessons
      .flatMap((lesson) => lesson.commands)
      .filter((command) => !GitExplainer.explain(command))
    expect(unresolvable).toEqual([])
  })
})
