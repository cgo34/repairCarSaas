-- =============================================================================
-- 20260701_15_feature_access_guard.sql
-- Server-side check used by Edge Functions (mailjet-email) to enforce plan
-- features that are otherwise only hidden in the UI.
-- can_use_feature: true when the caller is an active member of the organization
-- and the feature is enabled (plan, gift or add-on, via organization_effective_features).
-- Idempotent. Apply after 20260701_10.
-- =============================================================================

create or replace function public.can_use_feature(p_organization_id uuid, p_feature text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_organization_member(p_organization_id)
    and coalesce((
      select e.value = 'true'::jsonb
      from public.organization_effective_features e
      where e.organization_id = p_organization_id and e.feature_key = p_feature
    ), false);
$$;

revoke execute on function public.can_use_feature(uuid, text) from public, anon;
grant execute on function public.can_use_feature(uuid, text) to authenticated;
