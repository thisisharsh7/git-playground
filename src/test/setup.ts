import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
  // The app persists only `git-lessons-progress` and `git-master-theme`.
  localStorage.clear()
})
