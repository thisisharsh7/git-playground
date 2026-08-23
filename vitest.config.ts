import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  // tsconfigPaths supplies the `@/*` -> `./src/*` alias from tsconfig.json.
  plugins: [tsconfigPaths(), react()],
  test: {
    // Pure-logic files opt out with `// @vitest-environment node`.
    environment: 'jsdom',
    // Explicit vitest imports; avoids adding test types to tsconfig.
    globals: false,
    setupFiles: ['./src/test/setup.ts'],
    // No PostCSS in tests, so axe color-contrast stays disabled and is checked manually.
    css: false,
    clearMocks: true,
    restoreMocks: true,
    // The 5s default is tuned for fast unit tests. Rendering the whole command
    // catalogue and the visualization in jsdom, or running axe over a full
    // page, legitimately takes seconds — and exceeded 5s under parallel load,
    // producing flaky timeouts rather than real failures.
    testTimeout: 20000,
    hookTimeout: 20000,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules/**', '.next/**'],
    // toLocaleString() is ICU-dependent; pin TZ for deterministic git log output.
    env: { TZ: 'UTC' },
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      include: ['src/lib/**', 'src/data/**', 'src/components/**'],
      // ui/* is vendored shadcn; test/* is harness.
      exclude: ['src/components/ui/**', 'src/test/**'],
    },
  },
})
