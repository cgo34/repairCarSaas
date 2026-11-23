# Architecture feature-first (Clean Architecture)

## 1. Arbre

```
src/
├── app/                         # Composition root (bootstrap de l'application)
│   ├── App.vue, main.ts, config.ts
│   ├── di/
│   │   ├── container.ts         # Unique container InversifyJS
│   │   ├── tokens.ts, tokenTypes.ts
│   │   └── bindings/            # <feature>.bindings.ts (+ shared, misc)
│   ├── layouts/                 # MainLayout, header, sidebar, footer, customizer
│   ├── router/                  # Router global (assemble les routes des features)
│   ├── plugins/, theme/, types/, views/
│
├── features/
│   └── <feature>/               # account, auth, carRepairSettings, costCalculation,
│       │                        # countries, dashboard, documentStatuses, garages,
│       │                        # invoices, lineItems, organizations, priceSettings,
│       │                        # quotes, subscription, technicians, users,
│       │                        # vehicles, weather
│       ├── domain/              # entities, valueObjects, errors (logique metier pure)
│       ├── application/         # useCases (interface + classe), ports (repositories/services), dtos, mappers, services
│       ├── infrastructure/      # repositories, api, mappers, dtos (Supabase, pdf...)
│       ├── presentation/        # views, components, composables, routes, state,
│       │                        # guards, models
│       └── composition/         # useX() / use<Page>Dependencies() : seul endroit
│                                # qui resout le container
│
├── shared/                      # Code transverse (aucune dependance vers app/features)
│   ├── application/             # ports, utils
│   ├── infrastructure/          # supabase, pdf, email, download, region, providers
│   └── presentation/            # composables, ui (components, styles), utils
│
├── assets/
└── scss/
```

Exemple concret (`features/quotes`) :

```
quotes/
├── domain/entities/
├── application/{dtos,mappers,ports,services,useCases}/   # ex. CreateQuoteUseCase.ts
├── infrastructure/{api,mappers,pdf,repositories}/
├── presentation/{composables,mappers,models,routes,types,views}/
└── composition/                                          # useCreateQuotePageDependencies.ts, ...
```

## 2. Regles de dependance

| Couche | Peut importer |
|---|---|
| `domain` | rien |
| `application` | `domain`, `shared/application` |
| `infrastructure` | `application` (implemente les ports), `domain`, `shared` |
| `presentation` | `application` (contrats), `domain`, `shared` — jamais `container.get()` ni `inversify` |
| `composition` | tout le feature + `app/di` (seule couche autorisee a resoudre le container) |
| `shared` | jamais `app/` ni `features/` |

Alias : `@/*` → `src/*`, `@assets/*` → `src/assets/*`.

## 3. Changements du refactor

Base : commit `411e92e0` — 766 fichiers modifies (+3826 / −3645), majoritairement des
renommages (historique git conserve via `git log --follow`).

**Avant** : organisation par couche technique, au niveau racine.

```
src/@domain  src/@application  src/@infrastructure  src/@presentation
src/router  src/plugins  src/theme  src/types  src/@core
```

**Apres** : organisation par fonctionnalite (feature-first), chaque feature contient
ses propres couches.

| Avant | Apres |
|---|---|
| `src/@domain/**` | `src/features/<feature>/domain/` |
| `src/@application/**` (use cases, ports) | `src/features/<feature>/application/` |
| `src/@infrastructure/**` (repositories) | `src/features/<feature>/infrastructure/` |
| `src/@infrastructure/ioc/symbols.ts`, `symbolTypes.ts` | `src/app/di/tokens.ts`, `tokenTypes.ts` |
| Container Inversify unique | `src/app/di/container.ts` + `bindings/<feature>.bindings.ts` |
| `src/@presentation/**` (views, composables) | `src/features/<feature>/presentation/` |
| `src/@presentation/@ui/layouts`, `helpers/menu`, `composables/useCustomizerState.ts` | `src/app/layouts/` |
| `src/App.vue`, `config.ts`, `router`, `plugins`, `theme`, `types` | `src/app/` |
| Code transverse (supabase, pdf, email, ui, utils) | `src/shared/` |

Autres points :

- **Composition par feature** : les composables recoivent leurs dependances via des
  factories (`createUseX(deps)`), assemblees dans `composition/` (`useX()` /
  `use<Page>Dependencies()`). La presentation ne connait plus le container.
- **Bindings DI decoupes par feature** : le container reste unique, chaque feature
  enregistre ses use cases et repositories dans son propre fichier de bindings.
- **Routes** : chaque feature expose ses routes (`presentation/routes`), assemblees
  par `app/router`.
- **Aucun changement fonctionnel** : build OK ; `npm run type-check` remonte les
  611 erreurs TS deja presentes avant le refactor.

## 4. Convention use case : interface + classe dans le meme fichier

Il n'y a plus de dossier `application/ports/useCases/`. Le contrat d'un use case vit a cote
de son implementation (navigation plus simple) ; `ports/` ne contient que les
repositories et services.

```ts
// features/quotes/application/useCases/DeleteQuoteUseCase.ts
import { IQuoteRepository } from '@/features/quotes/application/ports/repositories/IQuoteRepository';

export interface IDeleteQuoteUseCase {
  execute(quoteId: string): Promise<void>;
}

export class DeleteQuoteUseCase implements IDeleteQuoteUseCase {
  constructor(private readonly quoteRepository: IQuoteRepository) {}

  async execute(quoteId: string): Promise<void> {
    await this.quoteRepository.delete(quoteId);
  }
}
```

Les consommateurs importent le contrat depuis le meme module :
`import { IDeleteQuoteUseCase } from '@/features/quotes/application/useCases/DeleteQuoteUseCase'`.

## 5. Ajouter une feature

1. Creer `src/features/<feature>/{domain,application,infrastructure,presentation,composition}` (uniquement les couches utiles).
2. Definir les ports repositories/services dans `application/ports`, et chaque use case dans `application/useCases/<Nom>UseCase.ts` (interface + classe dans le meme fichier).
3. Implementer les repositories dans `infrastructure/repositories`.
4. Ajouter les tokens (`app/di/tokens.ts`) et un `app/di/bindings/<feature>.bindings.ts`, puis l'enregistrer dans `container.ts`.
5. Exposer `useX()` dans `composition/`, consommer-le depuis la presentation.
6. Exporter les routes de la feature et les ajouter a `app/router`.
