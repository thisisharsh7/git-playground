import axe from 'axe-core'
import { expect } from 'vitest'

/**
 * Runs axe over a rendered container.
 *
 * `color-contrast` is disabled deliberately: vitest.config.ts sets css:false,
 * so Tailwind classes never resolve and axe cannot measure real colours.
 * Contrast is verified manually, not here.
 */
export async function expectNoAxeViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false } },
  })
  expect(results.violations.map((v) => `${v.id}: ${v.nodes.length} node(s)`)).toEqual([])
}
