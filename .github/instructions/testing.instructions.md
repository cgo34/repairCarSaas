
---
applyTo: "**/*.test.ts,**/*.spec.ts,src/features/**/*.ts"
---

# Testing Guidelines

Use Vitest and existing project testing utilities.

- Test business rules independently of Vue.
- Test use cases with mocked repository contracts.
- Test composables with injected fake use cases.
- Test success, failure and relevant edge cases.
- Avoid real network calls in unit tests.
- Do not require the production InversifyJS container for application unit tests.
- Verify shared reactive state behavior when relevant.
- Follow existing test naming and placement conventions.
- Run relevant tests and report failures accurately.
