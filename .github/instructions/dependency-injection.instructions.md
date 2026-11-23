
---
applyTo: "src/**/*.ts"
---

# Dependency Injection Guidelines

Use InversifyJS as the existing dependency injection container.

- Reuse the existing InversifyJS container and registration conventions.
- Register repositories and use cases through explicit bindings.
- Prefer constructor injection for class-based dependencies.
- Use injection tokens when runtime interfaces require identifiers.
- Use `to()` for injectable classes.
- Use `toDynamicValue()` for explicit factories.
- Use `toConstantValue()` for preconstructed values.
- Use singleton scope only when shared instance identity is required.
- Resolve dependencies at composition boundaries.
- Avoid Service Locator usage inside business logic.
- Do not create additional containers for individual features unless required by the existing architecture.
- Do not register Vue composables in InversifyJS by default.
- Keep Application and Domain independent of InversifyJS when compatible with existing conventions.

Before modifying dependency registration, inspect the existing `inversify.config.ts` and reuse its conventions.
