# RepairCarSaasGPT

## 1. Architecture
```
src/
│-- @domain/                   # Business rules and interfaces
│   ├── entities/              # Domain entities
│   ├── repositories/          # Repository interfaces
│   ├── services/              # Service interfaces
│   ├── providers/             # Provider interfaces
│   ├── useCases/              # Use case interfaces
│   └── events/                # (Optional) Event management
│
│-- @application/              # Use case and service implementations
│   ├── useCases/              # Use case implementations
│   │   ├── auth/              # Authentication use cases
│   │   └── ...
│   ├── services/              # Service implementations
│   ├── states/                # Application state management
│   └── dtos/                  # (Optional) Data Transfer Objects
│
│-- @infrastructure/           # Repository and provider implementations
│   ├── database/              # Database clients and repositories
│   │   ├── clients/           # Database client implementations
│   │   ├── repositories/      # Repository implementations
│   │   ├── providers/         # Database provider implementations
│   │   └── dtos/              # Data Transfer Objects for database
│   ├── providers/             # General provider implementations
│   ├── ioc/                   # Inversion of Control configuration
│   └── config/                # Configuration files
│
│-- @presentation/             # Presentation layer
│   ├── modules/               # Business modules (e.g., Vue.js)
│   │   ├── auth/              # Authentication module
│   │   ├── quotes/            # Quotes module
│   │   ├── invoices/          # Invoices module
│   │   └── ...
│   └── ui/                    # Shared UI components
│       ├── components/        # UI components
│       ├── layouts/           # Layout components
│       └── styles/            # Stylesheets
```

## 2. Nomenclature des branches
```
feature/nom-feature     # Pour les nouvelles fonctionnalités
fix/nom-bug            # Pour les corrections de bugs
refactor/nom-refactor  # Pour les refactorisations
chore/nom-tache        # Pour les tâches de maintenance
docs/nom-doc           # Pour la documentation
test/nom-test         # Pour l'ajout ou modification de tests
style/nom-style       # Pour les changements de style/formatage
perf/nom-perf         # Pour les optimisations de performance
```

## 3. Nomenclature commit
```
feat: ajoute la fonctionnalité X
fix: corrige le problème Y
refactor: améliore la structure de Z
chore: met à jour les dépendances
docs: met à jour la documentation
test: ajoute des tests pour X
style: met à jour le formatage du code
perf: améliore les performances de X
build: modifie la configuration de build
ci: met à jour la configuration CI
revert: annule le commit précédent
```

## 4. Workflow Git
1. La branche `main` contient le code de production
2. La branche `develop` contient le code en développement
3. Créer une branche feature/fix depuis `develop`
4. Créer une Pull Request vers `develop`
5. Après review et tests, merger dans `develop`
6. Périodiquement, merger `develop` dans `main` pour les releases



### Exemples détaillés :
```
# Nouvelles fonctionnalités
feat: ajoute le système d'authentification
feat(auth): implémente la connexion OAuth
feat(invoice): ajoute la génération de PDF

# Corrections de bugs
fix: corrige la validation du formulaire de login
fix(auth): résout le problème de token expiré
fix(ui): corrige l'affichage sur mobile

# Refactoring
refactor: migre vers la Clean Architecture
refactor(state): améliore la gestion d'état auth
refactor(api): optimise les appels API

# Documentation
docs: met à jour le README
docs(api): ajoute la documentation Swagger
docs(setup): ajoute le guide d'installation

# Tests
test: ajoute les tests unitaires auth
test(e2e): implémente les tests de workflow
test(perf): ajoute les tests de performance

# Style
style: applique les règles ESLint
style(css): reformate les styles SCSS
style(format): applique Prettier

# Performance
perf: optimise le chargement des images
perf(cache): implémente le cache Redis
perf(query): optimise les requêtes SQL

# Maintenance
chore: met à jour les dépendances npm
chore(deps): upgrade Vue vers v3.3
chore(cleanup): supprime le code mort

# Build
build: configure Vite
build(docker): met à jour le Dockerfile
build(webpack): optimise la configuration

# CI/CD
ci: configure GitHub Actions
ci(deploy): ajoute le déploiement automatique
ci(test): ajoute la couverture de code

# Revert
revert: annule le commit feat(auth)
```