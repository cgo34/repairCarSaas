
---
applyTo: "**/*.vue,**/composables/**/*.ts"
---

# Vue 3 Guidelines

- Use Composition API and TypeScript.
- Prefer `<script setup lang="ts">` for Vue components.
- Keep business rules outside Vue components.
- Use composables to manage presentation state and actions.
- Keep mutable refs private when state is intended to be read-only to consumers.
- Expose computed values and explicit mutation actions.
- Preserve Vue reactivity.
- Prefer existing module-scoped shared state patterns where appropriate.
- Inject application dependencies through factories when the architecture requires it.
- Do not introduce Pinia or provide/inject without a demonstrated need.
- Do not instantiate repositories inside Vue components.
- Handle loading and error states.
- Avoid unnecessary API calls and accidental duplicate shared state instances.
