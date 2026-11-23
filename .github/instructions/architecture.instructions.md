
---
applyTo: "src/features/**/*.ts,src/features/**/*.vue"
---

# Clean Architecture Guidelines

Organize features according to the existing architecture:

- Domain: entities and pure business rules.
- Application: use cases and ports.
- Infrastructure: repositories and external adapters.
- Presentation: Vue components, views and composables.
- Composition: assembly of feature dependencies.

Dependency rules:

- Domain must not depend on other layers.
- Application may depend on Domain.
- Infrastructure implements Application ports.
- Presentation consumes Application contracts.
- Composition assembles implementations and dependencies.

Never import Infrastructure directly into Domain or Application.

Use constructor injection for class-based use cases.

Keep business rules outside Vue components and composables.

Respect existing feature conventions, including separate use cases for CRUD operations when applicable.

Do not create empty layers or unnecessary abstractions.

When introducing a new feature, inspect a comparable existing feature and follow its established structure.
