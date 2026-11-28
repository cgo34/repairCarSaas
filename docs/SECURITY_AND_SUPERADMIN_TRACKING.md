# Suivi : sécurisation Supabase & profils super_admin

## Fait (commité)
- Phase 1 : inscription via trigger `handle_new_user` + RPC `provision_organization` (migration `20260701_01`, appliquée).
- Edge Function `create-organization-technician` sécurisée (JWT, rôle admin/manager, compensation), déployée.
- Reset password corrigé (session de recovery Supabase).
- `PlatformRole` / contexte global super_admin (code).

## Fait (non commité) : Phase 3
- `supabase/audit/20260701_security_audit.sql` : audit lecture seule (à exécuter, garder les résultats).
- `supabase/migrations/20260701_02_security_hardening.sql` : **à appliquer manuellement** après relecture de l'audit.
  - INSERT interdit côté client sur `users` / `organization_members`.
  - UPDATE par colonnes (jamais `id`, `platform_role`, `is_blocked`, `user_id`, `organization_id`).
  - Trigger : changement de rôle réservé à l'admin de l'organisation.
  - `set_user_blocked` : super_admin, ou admin/manager d'un utilisateur appartenant uniquement à ses organisations (ni soi-même, ni un admin).
  - `is_super_admin()`, `search_path` fixé, EXECUTE restreints, TRUNCATE/TRIGGER/REFERENCES révoqués.
  - Tables de référence : lecture authentifiée, écriture super_admin, pas de DELETE.
  - FK `users.id -> auth.users` ON DELETE CASCADE (`NOT VALID`, à `VALIDATE` après nettoyage des orphelins).
  - Failles trouvées par l'audit (blocs 1-2) et corrigées : RLS désactivé sur `quotes`, `invoices`, `garage_members` ; `quote_details` / `invoice_details` en `ALL true` ; `users` INSERT `true` ; `organization_members` « Users can be added as members » (auto-ajout à n'importe quelle organisation) ; `subscriptions` INSERT par un membre (passage gratuit en PREMIUM) ; `users` UPDATE propre ligne sans restriction de colonne (auto-attribution de `platform_role`).
  - Nouvelle fonction `is_organization_member()` utilisée par les policies `quotes` / `invoices` / `quote_details`.
  - Audit blocs 3-8 (grants, fonctions, triggers, FK, `user_profiles`, orphelins) encore à fournir.

## Phases 4-6 — implémentées (en attente d'application SQL + test)
- Migration `supabase/migrations/20260701_04_demo_profiles.sql` : tables `demo_profiles`, `demo_profile_context`, `profile_switch_log` (RLS, lecture super_admin, écriture uniquement via RPC) ; RPC `security definer` `list_demo_profiles`, `get_demo_profile_context`, `switch_demo_profile`, `clear_demo_profile` (contrôle `is_super_admin()` interne) ; `guard_organization_member_update` autorise le super_admin.
- Mécanisme : le super_admin reçoit une ligne `organization_members` stable dans l'org démo avec le rôle choisi ; les autres memberships **démo** sont archivés, les vrais memberships ne sont jamais touchés.
- Seed `supabase/seed/20260701_demo_profiles_seed.sql` (idempotent) : renomme les orgs des comptes `...demofree@` / `...demopremium@` en « Demo Free » / « Demo Premium », passe Premium en PREMIUM, crée 6 profils (2 orgs × admin/manager/technician). Les comptes doivent s'être connectés une fois.
- Front : feature `profileSwitcher` (use cases interface+classe, repository RPC, state, page `/admin/profiles`, DI) ; `GetAuthenticatedUserContextUseCase` lit le contexte démo ; `authGuard` gère `meta.platformAdmin` et redirige le contexte global vers `/admin/profiles` ; entrée « Profils de démonstration » dans le menu utilisateur (super_admin).

## Restant
- Appliquer `_04` puis le seed (Supabase SQL Editor), puis tester.
- Tests (Vitest non configuré).

## Décisions / hypothèses
- Blocage : `users.is_blocked` conservé (global) mais verrouillé côté serveur ; un utilisateur multi-organisations ne peut être bloqué que par un super_admin.
- Le compte super_admin de démo ne doit pas avoir de vraie organisation.
- Aucun super_admin n'est attribué automatiquement.

## Actions humaines
1. Exécuter l'audit et vérifier les résultats.
2. Appliquer `20260701_02_security_hardening.sql`, puis tester inscription, invitation, blocage, édition membre.
3. Redirect URLs Auth : `http://localhost:3000/**`, `https://cardentrepair.pro/**` ; `SITE_URL=https://cardentrepair.pro`.
4. Déployer le front (reset-password corrigé).
