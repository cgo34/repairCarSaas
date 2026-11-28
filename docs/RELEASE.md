# Release et déploiement PROD

Versionnement : [SemVer](https://semver.org/lang/fr/) `vX.Y.Z` via tags Git sur `main`.
Le déploiement PROD déploie uniquement le front (Cloudflare Pages). **Les migrations PROD sont manuelles.**

## Cycle d'une PR avec migration

1. Feature : ajouter `supabase/migrations/<timestamp>_<nom>.sql`, **idempotente** (`if not exists`) et **rétro-compatible** (l'ancien front doit continuer à fonctionner).
2. La CI (`Supabase migrations`) rejoue toutes les migrations sur une base locale et lance les tests pgTAP.
3. Pour tester la preview, jouer la migration à la main sur la base DEV (les previews partagent DEV).
4. PR abandonnée : jouer une migration inverse sur DEV. PR mergée : ne pas rejouer sur DEV.
5. Renommer/supprimer une colonne : en deux releases (ajouter + migrer le code, supprimer ensuite).

## Publier une version

1. PR `develop` → `main` (**Merge commit**, jamais Squash/Rebase).
2. Attendre la CI verte sur `main` (l'artefact n'est conservé que 7 jours).
3. Lister les migrations à jouer :
   `git diff --name-only <dernier-tag>..origin/main -- supabase/migrations`
4. Sauvegarder la base PROD, puis jouer ces migrations sur PROD **avant** le front.
5. Poser le tag sur le dernier commit de `main` :
   `git tag vX.Y.Z origin/main && git push origin vX.Y.Z`
6. Approuver le déploiement dans l'environnement `production` (onglet Actions → Deploy PROD).
7. Le smoke test vérifie `config.json` (`environment: production`) et l'absence de noindex.

## Hotfix (correctif urgent en PROD)

1. Partir de `main` : `git switch -c hotfix/<nom> origin/main --no-track`, corriger, pousser.
2. PR vers `main` : la CI tourne et la preview `pr-N` est déployée (backend DEV), pour tester avant le merge.
3. Merger en **Merge commit**, attendre la CI verte sur `main`.
4. Bumper `package.json` si besoin (PATCH, ex. `1.0.2`), puis suivre « Publier une version » à partir de l'étape 5 (tag, approbation du déploiement).
5. **Rétro-merge dans `develop`** pour ne pas perdre le correctif :
   ```
   git fetch origin
   git switch -c chore/backmerge-vX.Y.Z origin/develop --no-track
   git merge origin/main
   git push -u origin HEAD
   ```
   Puis PR `chore/backmerge-vX.Y.Z` → `develop` (la branche part de `develop`, les conflits éventuels se règlent dedans).
   - Ruleset `develop` en Squash only : le correctif entre avec un commit unique. Le contenu étant identique des deux côtés, la prochaine PR `develop` → `main` reste propre.
   - Pour garder l'historique lié, autoriser temporairement **Merge commit** sur « Protect develop ».
6. Ne pas utiliser `cherry-pick` : il duplique le commit avec un autre SHA et fait diverger les branches.

## Rollback

- Front : Actions → Deploy PROD → Run workflow depuis la branche `main`, avec le tag précédent (ex. `v1.0.0`). Si l'artefact a expiré (7 jours), relancer la CI sur ce commit.
- Base : les migrations rétro-compatibles évitent d'avoir à les annuler ; sinon restaurer le backup.
