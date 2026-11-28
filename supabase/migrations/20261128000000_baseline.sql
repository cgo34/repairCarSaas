--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA IF NOT EXISTS public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: organization_member_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.organization_member_status AS ENUM (
    'pending',
    'active',
    'blocked',
    'archived'
);


--
-- Name: organization_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.organization_role AS ENUM (
    'admin',
    'manager',
    'technician'
);


--
-- Name: platform_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.platform_role AS ENUM (
    'user',
    'super_admin'
);


--
-- Name: apply_plan_changes(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.apply_plan_changes(p_changes jsonb) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  r       record;
  v_count integer := 0;
begin
  if not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  for r in select * from public.preview_plan_changes(p_changes) loop
    perform public.set_plan_feature(r.plan_id, r.feature_key, r.new_value);

    insert into public.plan_change_log
      (changed_by, plan_id, plan_code, feature_key, old_value, new_value, orgs_on_plan, orgs_affected)
    values
      (auth.uid(), r.plan_id, r.plan_code, r.feature_key, r.old_value, r.new_value, r.orgs_on_plan, r.orgs_affected);

    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;


--
-- Name: can_manage_member(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.can_manage_member(p_member_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO ''
    AS $$
  select
    public.is_super_admin()
    or exists (
      select 1
      from public.organization_members t
      join public.organization_members c
        on c.organization_id = t.organization_id
       and c.user_id = auth.uid()
       and c.status = 'active'
      where t.id = p_member_id
        and not public.is_super_admin_user(t.user_id)
        and (
          c.role = 'admin'
          or (c.role = 'manager' and t.created_by = auth.uid() and t.role = 'technician')
        )
    );
$$;


--
-- Name: can_manage_user(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.can_manage_user(p_user_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO ''
    AS $$
  select
    p_user_id = auth.uid()
    or public.is_super_admin()
    or exists (
      select 1
      from public.organization_members t
      where t.user_id = p_user_id
        and public.can_manage_member(t.id)
    );
$$;


--
-- Name: can_use_feature(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.can_use_feature(p_organization_id uuid, p_feature text) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO ''
    AS $$
  select public.is_organization_member(p_organization_id)
    and coalesce((
      select e.value = 'true'::jsonb
      from public.organization_effective_features e
      where e.organization_id = p_organization_id and e.feature_key = p_feature
    ), false);
$$;


--
-- Name: clear_demo_profile(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.clear_demo_profile() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null or not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  update public.organization_members m
     set status = 'archived'
   where m.user_id = v_uid
     and m.status = 'active'
     and exists (select 1 from public.demo_profiles d where d.organization_id = m.organization_id);

  delete from public.demo_profile_context where user_id = v_uid;

  insert into public.profile_switch_log (user_id, action)
  values (v_uid, 'clear');
end;
$$;


--
-- Name: create_demo_profile(uuid, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_demo_profile(p_organization_id uuid, p_role text, p_label text DEFAULT NULL::text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_id uuid;
begin
  if auth.uid() is null or not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  if p_role not in ('admin', 'manager', 'technician') then
    raise exception 'Invalid role' using errcode = '22023';
  end if;

  if not exists (select 1 from public.demo_profiles d where d.organization_id = p_organization_id) then
    raise exception 'Not a demo organization' using errcode = '42501';
  end if;

  insert into public.demo_profiles (organization_id, role, label)
  values (p_organization_id, p_role, coalesce(nullif(trim(p_label), ''), initcap(p_role)))
  returning id into v_id;

  return v_id;
end;
$$;


--
-- Name: delete_demo_profile(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.delete_demo_profile(p_profile_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_org uuid;
begin
  if auth.uid() is null or not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  select organization_id into v_org from public.demo_profiles where id = p_profile_id;
  if v_org is null then
    raise exception 'Demo profile not found' using errcode = 'P0002';
  end if;

  -- Keep at least one profile so the organization stays a demo organization
  if (select count(*) from public.demo_profiles where organization_id = v_org) <= 1 then
    raise exception 'Cannot delete the last profile of a demo organization' using errcode = '23514';
  end if;

  delete from public.demo_profiles where id = p_profile_id;
end;
$$;


--
-- Name: enforce_plan_limit(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.enforce_plan_limit() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_limit   integer;
  v_count   bigint;
  v_month   timestamptz := date_trunc('month', now());
  v_demo    boolean;
begin
  select o.is_demo into v_demo from public.organizations o where o.id = new.organization_id;
  if coalesce(v_demo, false) then
    return new;
  end if;

  if tg_table_name = 'garages' then
    v_limit := public.org_limit(new.organization_id, 'max_garages');
    if v_limit is not null then
      select count(*) into v_count from public.garages where organization_id = new.organization_id;
      if v_count >= v_limit then
        raise exception 'PLAN_LIMIT_GARAGES: limite de % garage(s) atteinte pour votre plan', v_limit
          using errcode = 'P0001';
      end if;
    end if;

  elsif tg_table_name = 'quotes' then
    v_limit := public.org_limit(new.organization_id, 'max_quotes_per_month');
    if v_limit is not null then
      select count(*) into v_count from public.quotes
       where organization_id = new.organization_id and created_at >= v_month;
      if v_count >= v_limit then
        raise exception 'PLAN_LIMIT_QUOTES: limite de % devis par mois atteinte pour votre plan', v_limit
          using errcode = 'P0001';
      end if;
    end if;

  elsif tg_table_name = 'invoices' then
    v_limit := public.org_limit(new.organization_id, 'max_invoices_per_month');
    if v_limit is not null then
      select count(*) into v_count from public.invoices
       where organization_id = new.organization_id and created_at >= v_month;
      if v_count >= v_limit then
        raise exception 'PLAN_LIMIT_INVOICES: limite de % facture(s) par mois atteinte pour votre plan', v_limit
          using errcode = 'P0001';
      end if;
    end if;

    -- An invoice created from a quote is a conversion
    if new.quote_id is not null then
      v_limit := public.org_limit(new.organization_id, 'max_conversions_per_month');
      if v_limit is not null then
        select count(*) into v_count from public.invoices
         where organization_id = new.organization_id and quote_id is not null and created_at >= v_month;
        if v_count >= v_limit then
          raise exception 'PLAN_LIMIT_CONVERSIONS: limite de % conversion(s) devis en facture par mois atteinte pour votre plan', v_limit
            using errcode = 'P0001';
        end if;
      end if;
    end if;
  end if;

  return new;
end;
$$;


--
-- Name: expire_subscriptions(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.expire_subscriptions() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_free_id uuid;
  v_count   integer;
begin
  select id into v_free_id from public.subscription_plans where code = 'FREE';
  if v_free_id is null then
    return 0;
  end if;

  update public.subscriptions s
     set plan_id    = v_free_id,
         status     = 'active',
         source     = 'manual',
         end_date   = null
   where s.end_date is not null
     and s.end_date <= now()
     and s.plan_id <> v_free_id;

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;


--
-- Name: get_demo_profile_context(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_demo_profile_context() RETURNS TABLE(profile_id uuid, organization_id uuid, role text)
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO ''
    AS $$
begin
  if auth.uid() is null or not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  return query
  select c.profile_id, c.organization_id, c.role
  from public.demo_profile_context c
  where c.user_id = auth.uid();
end;
$$;


--
-- Name: get_platform_stats(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_platform_stats() RETURNS TABLE(organizations_total bigint, free_organizations bigint, premium_organizations bigint, new_organizations_30d bigint, users_total bigint, new_users_30d bigint, blocked_users bigint, mrr_cents bigint, quotes_total bigint, invoices_total bigint, signups_6m jsonb, near_quota_organizations bigint, expiring_subscriptions bigint, recent_organizations jsonb)
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO ''
    AS $$
begin
  if not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  return query
  with real_orgs as (
    select o.id, o.name, o.created_at
    from public.organizations o
    where not o.is_demo
  ),
  org_plan as (
    -- an expired subscription counts as FREE (no revenue)
    select r.id,
           case when s.end_date is null or s.end_date > now() then sp.code else 'FREE' end as code,
           case when s.end_date is null or s.end_date > now() then sp.price_cents else 0 end as price_cents,
           s.status
    from real_orgs r
    left join public.subscriptions s on s.organization_id = r.id
    left join public.subscription_plans sp on sp.id = s.plan_id
  ),
  real_users as (
    select distinct u.id, u.is_blocked
    from public.users u
    join public.organization_members m on m.user_id = u.id
    join real_orgs r on r.id = m.organization_id
    where u.platform_role <> 'super_admin'
  )
  select
    (select count(*) from real_orgs),
    (select count(*) from org_plan where code = 'FREE'),
    (select count(*) from org_plan where code = 'PREMIUM'),
    (select count(*) from real_orgs where created_at >= now() - interval '30 days'),
    (select count(*) from real_users),
    (select count(*) from real_users ru
       join auth.users au on au.id = ru.id
       where au.created_at >= now() - interval '30 days'),
    (select count(*) from real_users where is_blocked),
    (select coalesce(sum(price_cents), 0)::bigint from org_plan where status = 'active'),
    (select count(*) from public.quotes q where q.organization_id in (select id from real_orgs)),
    (select count(*) from public.invoices i where i.organization_id in (select id from real_orgs)),
    coalesce((
      select jsonb_agg(jsonb_build_object('month', to_char(g.m, 'YYYY-MM'), 'count', (
        select count(*) from real_orgs r where date_trunc('month', r.created_at) = g.m
      )) order by g.m)
      from generate_series(
        date_trunc('month', now()) - interval '5 months',
        date_trunc('month', now()),
        interval '1 month'
      ) as g(m)
    ), '[]'::jsonb),
    (select count(*)
       from public.subscriptions s
       join real_orgs r on r.id = s.organization_id
       join public.organization_effective_features ef
         on ef.organization_id = r.id and ef.feature_key = 'max_seats'
       where s.status = 'active'
         and nullif(ef.value::text, 'null') is not null
         and (select count(*) from public.organization_members m
                where m.organization_id = r.id and m.status = 'active'
                  and m.user_id not in (select su.id from public.users su where su.platform_role = 'super_admin')
             ) >= nullif(ef.value::text, 'null')::integer * 0.8),
    (select count(*)
       from public.subscriptions s
       join real_orgs r on r.id = s.organization_id
       where s.status = 'active'
         and s.end_date is not null
         and s.end_date >= now()
         and s.end_date <= now() + interval '7 days'),
    coalesce((
      select jsonb_agg(x order by x.created_at desc)
      from (
        select o.id, o.name, o.created_at, o.is_demo,
          case when s.end_date is null or s.end_date > now() then sp.code else 'FREE' end as plan,
          (select count(*) from public.organization_members m
             where m.organization_id = o.id and m.status = 'active'
               and m.user_id not in (select su.id from public.users su where su.platform_role = 'super_admin')
          ) as members_count,
          (select count(*) from public.garages g where g.organization_id = o.id) as garages_count
        from public.organizations o
        left join public.subscriptions s on s.organization_id = o.id
        left join public.subscription_plans sp on sp.id = s.plan_id
        order by o.created_at desc
        limit 10
      ) x
    ), '[]'::jsonb);
end;
$$;


--
-- Name: grant_feature(uuid, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.grant_feature(p_organization_id uuid, p_feature_key text, p_duration text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_expires timestamptz;
begin
  if not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  if not exists (
    select 1 from public.features f
     where f.key = p_feature_key and f.type = 'boolean' and f.is_addon
  ) then
    raise exception 'Feature not offerable: %', p_feature_key using errcode = '22023';
  end if;

  v_expires := case p_duration
    when 'minutes5'  then now() + interval '5 minutes'
    when 'week'      then now() + interval '7 days'
    when 'month'     then now() + interval '1 month'
    when 'unlimited' then null
    else null
  end;

  if p_duration not in ('minutes5', 'week', 'month', 'unlimited') then
    raise exception 'Invalid duration: %', p_duration using errcode = '22023';
  end if;

  -- One active gift per organization and feature: replace the previous one
  delete from public.organization_features
   where organization_id = p_organization_id
     and feature_key = p_feature_key
     and source = 'gift';

  insert into public.organization_features
    (organization_id, feature_key, value, source, starts_at, expires_at, granted_by, note)
  values
    (p_organization_id, p_feature_key, 'true'::jsonb, 'gift', now(), v_expires, auth.uid(), 'Offert par le super admin');
end;
$$;


--
-- Name: grant_premium(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.grant_premium(p_organization_id uuid, p_duration text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_plan_id   uuid;
  v_end_date  timestamptz;
begin
  if not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  if not exists (select 1 from public.organizations o where o.id = p_organization_id) then
    raise exception 'Organization not found' using errcode = 'P0002';
  end if;

  v_end_date := case p_duration
    when 'minute'    then now() + interval '1 minute'
    when 'week'      then now() + interval '7 days'
    when 'month'     then now() + interval '1 month'
    when 'unlimited' then null
    else null
  end;

  if p_duration not in ('minute', 'week', 'month', 'unlimited') then
    raise exception 'Invalid duration: %', p_duration using errcode = '22023';
  end if;

  select p.id into v_plan_id from public.subscription_plans p where p.code = 'PREMIUM';
  if v_plan_id is null then
    raise exception 'PREMIUM plan not found' using errcode = 'P0002';
  end if;

  update public.subscriptions s
     set plan_id    = v_plan_id,
         status     = 'active',
         source     = 'manual',
         start_date = now(),
         end_date   = v_end_date
   where s.organization_id = p_organization_id;

  if not found then
    insert into public.subscriptions (organization_id, plan_id, status, source, start_date, end_date)
    values (p_organization_id, v_plan_id, 'active', 'manual', now(), v_end_date);
  end if;
end;
$$;


--
-- Name: guard_organization_member_update(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.guard_organization_member_update() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
begin
  -- service_role / postgres (no end-user JWT) are trusted
  if auth.uid() is null then
    return new;
  end if;

  if new.role is distinct from old.role then
    if not public.is_super_admin() and not exists (
      select 1 from public.organization_members m
      where m.user_id = auth.uid()
        and m.organization_id = old.organization_id
        and m.role = 'admin'
        and m.status = 'active'
    ) then
      raise exception 'Only an organization admin can change a role' using errcode = '42501';
    end if;
  end if;

  return new;
end;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
DECLARE
  v_first text := NULLIF(btrim(COALESCE(NEW.raw_user_meta_data ->> 'first_name', '')), '');
  v_last  text := NULLIF(btrim(COALESCE(NEW.raw_user_meta_data ->> 'last_name', '')), '');
  v_full  text := NULLIF(btrim(COALESCE(NEW.raw_user_meta_data ->> 'fullName', '')), '');
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    v_first,
    v_last,
    COALESCE(v_full, NULLIF(btrim(COALESCE(v_first, '') || ' ' || COALESCE(v_last, '')), ''), '')
  );

  RETURN NEW;
END;
$$;


--
-- Name: is_organization_admin(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_organization_admin(target_organization_id uuid) RETURNS boolean
    LANGUAGE sql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id =
          target_organization_id
      and om.user_id = auth.uid()
      and om.role = 'admin'
      and om.status = 'active'
  );
$$;


--
-- Name: is_organization_member(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_organization_member(target_organization_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO ''
    AS $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = target_organization_id
      and m.user_id = auth.uid()
      and m.status = 'active'
  );
$$;


--
-- Name: is_super_admin(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_super_admin() RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO ''
    AS $$
  select exists (
    select 1 from public.users u
    where u.id = auth.uid() and u.platform_role = 'super_admin'
  );
$$;


--
-- Name: is_super_admin_user(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_super_admin_user(p_user_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO ''
    AS $$
  select exists (
    select 1 from public.users u
    where u.id = p_user_id and u.platform_role = 'super_admin'
  );
$$;


--
-- Name: list_demo_profiles(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.list_demo_profiles() RETURNS TABLE(profile_id uuid, organization_id uuid, organization_name text, plan_code text, role text, label text)
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO ''
    AS $$
begin
  if auth.uid() is null or not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  return query
  select p.id, p.organization_id, o.name, sp.code, p.role, p.label
  from public.demo_profiles p
  join public.organizations o on o.id = p.organization_id
  left join public.subscriptions s on s.organization_id = o.id
  left join public.subscription_plans sp on sp.id = s.plan_id
  order by o.name,
           case p.role when 'admin' then 1 when 'manager' then 2 else 3 end;
end;
$$;


--
-- Name: list_plan_change_log(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.list_plan_change_log(p_limit integer DEFAULT 50) RETURNS TABLE(id uuid, changed_at timestamp with time zone, changed_by text, plan_code text, feature_key text, feature_name text, old_value jsonb, new_value jsonb, orgs_on_plan integer, orgs_affected integer)
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO ''
    AS $$
begin
  if not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  return query
  select l.id, l.changed_at,
         (select u.email::text from auth.users u where u.id = l.changed_by),
         l.plan_code, l.feature_key, f.name::text,
         l.old_value, l.new_value, l.orgs_on_plan, l.orgs_affected
    from public.plan_change_log l
    left join public.features f on f.key = l.feature_key
   order by l.changed_at desc
   limit greatest(1, least(coalesce(p_limit, 50), 500));
end;
$$;


--
-- Name: list_platform_organizations(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.list_platform_organizations() RETURNS TABLE(id uuid, name text, created_at timestamp with time zone, plan_code text, subscription_status text, members_count bigint, garages_count bigint, quotes_count bigint, invoices_count bigint, is_demo boolean, members_limit integer, garages_limit integer, quotes_limit integer, invoices_limit integer, quotes_month_count bigint, invoices_month_count bigint)
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO ''
    AS $$
begin
  if not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  -- Limits come from the effective features (plan fallback + gifts); null = unlimited
  return query
  select
    o.id,
    o.name::text,
    o.created_at,
    (case when s.end_date is null or s.end_date > now() then sp.code else 'FREE' end)::text,
    s.status::text,
    (select count(*) from public.organization_members m
       where m.organization_id = o.id and m.status = 'active'
         and m.user_id not in (select su.id from public.users su where su.platform_role = 'super_admin')),
    (select count(*) from public.garages g where g.organization_id = o.id),
    (select count(*) from public.quotes q where q.organization_id = o.id),
    (select count(*) from public.invoices i where i.organization_id = o.id),
    o.is_demo,
    (select nullif(e.value::text, 'null')::integer from public.organization_effective_features e
       where e.organization_id = o.id and e.feature_key = 'max_seats'),
    (select nullif(e.value::text, 'null')::integer from public.organization_effective_features e
       where e.organization_id = o.id and e.feature_key = 'max_garages'),
    (select nullif(e.value::text, 'null')::integer from public.organization_effective_features e
       where e.organization_id = o.id and e.feature_key = 'max_quotes_per_month'),
    (select nullif(e.value::text, 'null')::integer from public.organization_effective_features e
       where e.organization_id = o.id and e.feature_key = 'max_invoices_per_month'),
    (select count(*) from public.quotes q
       where q.organization_id = o.id and q.created_at >= date_trunc('month', now())),
    (select count(*) from public.invoices i
       where i.organization_id = o.id and i.created_at >= date_trunc('month', now()))
  from public.organizations o
  left join public.subscriptions s on s.organization_id = o.id
  left join public.subscription_plans sp on sp.id = s.plan_id
  order by o.created_at desc;
end;
$$;


--
-- Name: list_platform_plans(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.list_platform_plans() RETURNS TABLE(plan_id uuid, plan_code text, plan_name text, price_cents integer, orgs_count integer, feature_key text, feature_type text, feature_name text, feature_description text, is_addon boolean, has_value boolean, value jsonb)
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO ''
    AS $$
begin
  if not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  return query
  select
    p.id,
    p.code::text,
    p.name::text,
    p.price_cents::integer,
    (select count(distinct s.organization_id)::integer
       from public.subscriptions s
       join public.organizations o on o.id = s.organization_id
      where s.plan_id = p.id and s.status = 'active'
        and (s.end_date is null or s.end_date > now())
        and not coalesce(o.is_demo, false)),
    f.key,
    f.type,
    f.name,
    f.description,
    f.is_addon,
    pf.plan_id is not null,
    pf.value
  from public.subscription_plans p
  cross join public.features f
  left join public.plan_features pf
    on pf.plan_id = p.id and pf.feature_key = f.key
  order by p.price_cents, p.code, f.is_addon, f.key;
end;
$$;


--
-- Name: list_platform_users(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.list_platform_users() RETURNS TABLE(id uuid, full_name text, email text, is_blocked boolean, role text, organization_name text, organizations_count bigint, created_at timestamp with time zone)
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO ''
    AS $$
begin
  if not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  return query
  select distinct on (u.id)
    u.id,
    coalesce(nullif(u.full_name, ''), nullif(trim(coalesce(u.first_name, '') || ' ' || coalesce(u.last_name, '')), ''))::text,
    u.email::text,
    u.is_blocked,
    m.role::text,
    o.name::text,
    (select count(*) from public.organization_members mm
       where mm.user_id = u.id
         and mm.organization_id not in (select dp.organization_id from public.demo_profiles dp)),
    au.created_at
  from public.users u
  join public.organization_members m on m.user_id = u.id
  join public.organizations o on o.id = m.organization_id
  left join auth.users au on au.id = u.id
  where u.platform_role <> 'super_admin'
    and o.id not in (select dp.organization_id from public.demo_profiles dp)
  order by u.id, o.created_at;
end;
$$;


--
-- Name: org_limit(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.org_limit(p_organization_id uuid, p_feature text) RETURNS integer
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO ''
    AS $$
  select nullif(e.value::text, 'null')::integer
  from public.organization_effective_features e
  where e.organization_id = p_organization_id and e.feature_key = p_feature;
$$;


--
-- Name: plan_change_impact(uuid, text, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.plan_change_impact(p_plan_id uuid, p_key text, p_new jsonb) RETURNS TABLE(orgs_on_plan integer, orgs_affected integer)
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_type  text;
  v_old   jsonb;
  v_on    integer;
  v_aff   integer := 0;
  v_n     integer;
  v_orgs  uuid[];
  v_month timestamptz := date_trunc('month', now());
begin
  if not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  select f.type into v_type from public.features f where f.key = p_key;
  select pf.value into v_old from public.plan_features pf
   where pf.plan_id = p_plan_id and pf.feature_key = p_key;

  v_orgs := array(
    select distinct s.organization_id
      from public.subscriptions s
      join public.organizations o on o.id = s.organization_id
     where s.plan_id = p_plan_id
       and s.status = 'active'
       and (s.end_date is null or s.end_date > now())
       and not coalesce(o.is_demo, false)
  );
  v_on := coalesce(array_length(v_orgs, 1), 0);

  if v_type = 'boolean' then
    if coalesce(v_old, 'false'::jsonb) = 'true'::jsonb and p_new = 'false'::jsonb then
      v_aff := v_on;
    end if;
  elsif p_new is not null and jsonb_typeof(p_new) = 'number' then
    v_n := (p_new::text)::integer;
    if p_key = 'max_garages' then
      select count(*) into v_aff from unnest(v_orgs) as po(organization_id)
       where (select count(*) from public.garages g where g.organization_id = po.organization_id) >= v_n;
    elsif p_key = 'max_quotes_per_month' then
      select count(*) into v_aff from unnest(v_orgs) as po(organization_id)
       where (select count(*) from public.quotes q
               where q.organization_id = po.organization_id and q.created_at >= v_month) >= v_n;
    elsif p_key = 'max_invoices_per_month' then
      select count(*) into v_aff from unnest(v_orgs) as po(organization_id)
       where (select count(*) from public.invoices i
               where i.organization_id = po.organization_id and i.created_at >= v_month) >= v_n;
    elsif p_key = 'max_conversions_per_month' then
      select count(*) into v_aff from unnest(v_orgs) as po(organization_id)
       where (select count(*) from public.invoices i
               where i.organization_id = po.organization_id and i.quote_id is not null
                 and i.created_at >= v_month) >= v_n;
    end if;
  end if;

  return query select v_on, v_aff;
end;
$$;


--
-- Name: preview_plan_changes(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.preview_plan_changes(p_changes jsonb) RETURNS TABLE(plan_id uuid, plan_code text, feature_key text, feature_name text, feature_type text, old_value jsonb, new_value jsonb, orgs_on_plan integer, orgs_affected integer, is_risky boolean)
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  ch      jsonb;
  v_plan  uuid;
  v_key   text;
  v_new   jsonb;
  v_old   jsonb;
  v_type  text;
  v_on    integer;
  v_aff   integer;
  v_risky boolean;
begin
  if not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  for ch in select * from jsonb_array_elements(coalesce(p_changes, '[]'::jsonb)) loop
    v_plan := (ch->>'plan_id')::uuid;
    v_key  := ch->>'feature_key';
    v_new  := coalesce(ch->'value', 'null'::jsonb);

    select f.type into v_type from public.features f where f.key = v_key;
    select pf.value into v_old from public.plan_features pf
     where pf.plan_id = v_plan and pf.feature_key = v_key;
    if v_old is null and v_type = 'boolean' then v_old := 'false'::jsonb; end if;
    if v_old is null and v_type = 'limit'   then v_old := '0'::jsonb;     end if;

    if v_old = v_new then continue; end if;

    select i.orgs_on_plan, i.orgs_affected into v_on, v_aff
      from public.plan_change_impact(v_plan, v_key, v_new) i;

    if v_type = 'boolean' then
      v_risky := v_old = 'true'::jsonb and v_new = 'false'::jsonb;
    else
      v_risky := jsonb_typeof(v_new) = 'number'
             and (jsonb_typeof(v_old) = 'null' or (v_new::text)::numeric < (v_old::text)::numeric);
    end if;

    return query
    select v_plan, p.code::text, v_key, f.name::text, v_type, v_old, v_new,
           v_on, v_aff, (v_risky and v_on > 0)
      from public.subscription_plans p, public.features f
     where p.id = v_plan and f.key = v_key;
  end loop;
end;
$$;


--
-- Name: provision_organization(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.provision_organization(p_name text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
DECLARE
  v_uid     uuid := auth.uid();
  v_org_id  uuid;
  v_plan_id uuid;
  v_name    text := NULLIF(btrim(COALESCE(p_name, '')), '');
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated' USING ERRCODE = '28000';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = v_uid) THEN
    RAISE EXCEPTION 'User profile not found' USING ERRCODE = 'P0002';
  END IF;

  -- Reprise : organisation deja provisionnee
  SELECT id INTO v_org_id
  FROM public.organizations
  WHERE owner_user_id = v_uid
  ORDER BY created_at
  LIMIT 1;

  IF v_org_id IS NULL THEN
    INSERT INTO public.organizations (name, owner_user_id, created_at, updated_at)
    VALUES (COALESCE(v_name, 'Mon espace'), v_uid, now(), now())
    RETURNING id INTO v_org_id;
  END IF;

  INSERT INTO public.organization_members (user_id, organization_id, role, status)
  SELECT v_uid, v_org_id, 'admin', 'active'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE user_id = v_uid AND organization_id = v_org_id
  );

  IF NOT EXISTS (SELECT 1 FROM public.subscriptions WHERE organization_id = v_org_id) THEN
    SELECT id INTO v_plan_id FROM public.subscription_plans WHERE code = 'FREE' LIMIT 1;
    IF v_plan_id IS NULL THEN
      RAISE EXCEPTION 'FREE plan not found' USING ERRCODE = 'P0002';
    END IF;

    -- source laisse a sa valeur par defaut, comme le code applicatif precedent
    INSERT INTO public.subscriptions (organization_id, plan_id, status, start_date)
    VALUES (v_org_id, v_plan_id, 'active', now());
  END IF;

  RETURN v_org_id;
END;
$$;


--
-- Name: set_plan_feature(uuid, text, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_plan_feature(p_plan_id uuid, p_feature_key text, p_value jsonb) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_type  text;
  v_value jsonb;
begin
  if not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  if not exists (select 1 from public.subscription_plans where id = p_plan_id) then
    raise exception 'Unknown plan' using errcode = '22023';
  end if;

  select f.type into v_type from public.features f where f.key = p_feature_key;
  if v_type is null then
    raise exception 'Unknown feature: %', p_feature_key using errcode = '22023';
  end if;

  if v_type = 'boolean' then
    if p_value is null or jsonb_typeof(p_value) <> 'boolean' then
      raise exception 'Boolean value expected for %', p_feature_key using errcode = '22023';
    end if;
    v_value := p_value;
  else
    if p_value is null or jsonb_typeof(p_value) = 'null' then
      v_value := 'null'::jsonb;
    elsif jsonb_typeof(p_value) = 'number'
      and (p_value::text)::numeric >= 0
      and (p_value::text)::numeric = trunc((p_value::text)::numeric) then
      v_value := p_value;
    else
      raise exception 'Non-negative integer or null expected for %', p_feature_key using errcode = '22023';
    end if;
  end if;

  insert into public.plan_features (plan_id, feature_key, value)
  values (p_plan_id, p_feature_key, v_value)
  on conflict (plan_id, feature_key) do update set value = excluded.value;
end;
$$;


--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


--
-- Name: set_user_blocked(uuid, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_user_blocked(target_user_id uuid, blocked boolean) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  if not public.is_super_admin() then
    if target_user_id = auth.uid() then
      raise exception 'Cannot block yourself' using errcode = '42501';
    end if;

    -- the caller must manage every membership of the target
    if not exists (
         select 1 from public.organization_members t
         where t.user_id = target_user_id
       )
       or exists (
         select 1 from public.organization_members t
         where t.user_id = target_user_id
           and not public.can_manage_member(t.id)
       ) then
      raise exception 'Not allowed' using errcode = '42501';
    end if;
  end if;

  update public.users set is_blocked = blocked where id = target_user_id;
end;
$$;


--
-- Name: switch_demo_profile(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.switch_demo_profile(p_profile_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
declare
  v_uid     uuid := auth.uid();
  v_profile public.demo_profiles%rowtype;
  v_member  uuid;
begin
  if v_uid is null or not public.is_super_admin() then
    raise exception 'Forbidden' using errcode = '42501';
  end if;

  select * into v_profile from public.demo_profiles where id = p_profile_id;
  if not found then
    raise exception 'Demo profile not found' using errcode = 'P0002';
  end if;

  -- Archive the caller's memberships in OTHER demo organizations only
  update public.organization_members m
     set status = 'archived'
   where m.user_id = v_uid
     and m.organization_id <> v_profile.organization_id
     and m.status = 'active'
     and exists (select 1 from public.demo_profiles d where d.organization_id = m.organization_id);

  -- Stable membership per demo organization (keeps created_by/assigned ids valid)
  select id into v_member
  from public.organization_members
  where user_id = v_uid and organization_id = v_profile.organization_id
  limit 1;

  if v_member is null then
    insert into public.organization_members (user_id, organization_id, role, status)
    values (v_uid, v_profile.organization_id, v_profile.role, 'active');
  else
    update public.organization_members
       set role = v_profile.role, status = 'active'
     where id = v_member;
  end if;

  insert into public.demo_profile_context (user_id, profile_id, organization_id, role, updated_at)
  values (v_uid, v_profile.id, v_profile.organization_id, v_profile.role, now())
  on conflict (user_id) do update
    set profile_id = excluded.profile_id,
        organization_id = excluded.organization_id,
        role = excluded.role,
        updated_at = now();

  insert into public.profile_switch_log (user_id, action, profile_id, organization_id, role)
  values (v_uid, 'switch', v_profile.id, v_profile.organization_id, v_profile.role);
end;
$$;


--
-- Name: update_billing_infos_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_billing_infos_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


--
-- Name: update_professional_infos_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_professional_infos_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


--
-- Name: update_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: body_materials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.body_materials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255),
    code character varying
);


--
-- Name: body_parts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.body_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text,
    code character varying(100),
    color character varying(255)
);


--
-- Name: company_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.company_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    company_name text,
    legal_form text,
    siren text,
    siret text,
    tva_number text,
    capital text,
    address text,
    zip_code text,
    city text,
    country text DEFAULT 'France'::text,
    phone text,
    email text,
    website text,
    iban text,
    bic text,
    payment_delay integer DEFAULT 30,
    late_payment_penalty text,
    recovery_fee text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: default_setting_price_body_part_coefficient; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.default_setting_price_body_part_coefficient (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    body_part_id uuid NOT NULL,
    difficulty_coefficient numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: default_setting_price_diameter_coefficient; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.default_setting_price_diameter_coefficient (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    diameter numeric(10,2) NOT NULL,
    coefficient numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: default_setting_price_general; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.default_setting_price_general (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    hourly_rate numeric(10,2) NOT NULL,
    unit_time integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: default_setting_price_impact_count_to_ut; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.default_setting_price_impact_count_to_ut (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    impact_count_min integer NOT NULL,
    impact_count_max integer NOT NULL,
    unit_time integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_impact_count_range CHECK ((impact_count_min <= impact_count_max))
);


--
-- Name: default_setting_price_technicity_coefficient; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.default_setting_price_technicity_coefficient (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    aluminium_coefficient numeric(10,2) NOT NULL,
    dsp_coefficient numeric(10,2) NOT NULL,
    dap_coefficient numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: demo_profile_context; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.demo_profile_context (
    user_id uuid NOT NULL,
    profile_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    role text NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: demo_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.demo_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    role text NOT NULL,
    label text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT demo_profiles_role_check CHECK ((role = ANY (ARRAY['admin'::text, 'manager'::text, 'technician'::text])))
);


--
-- Name: document_statuses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.document_statuses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code text NOT NULL,
    label text NOT NULL
);


--
-- Name: features; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.features (
    key text NOT NULL,
    type text NOT NULL,
    name text NOT NULL,
    description text,
    is_addon boolean DEFAULT false NOT NULL,
    stripe_price_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT features_type_check CHECK ((type = ANY (ARRAY['boolean'::text, 'limit'::text])))
);


--
-- Name: garage_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.garage_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    garage_id uuid NOT NULL,
    organization_member_id uuid NOT NULL,
    percentage_commission numeric,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


--
-- Name: garages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.garages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255),
    address character varying(255),
    zip_code character varying(20),
    city character varying(255),
    phone character varying(50),
    email character varying(255),
    code text,
    organization_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    archived_at timestamp with time zone,
    percentage_commission numeric(5,2) DEFAULT 0
);


--
-- Name: hail_alerts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hail_alerts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    department_id uuid NOT NULL,
    risk_level character varying(10) DEFAULT 'none'::character varying NOT NULL,
    cape_value numeric(8,2),
    weather_code integer,
    vigilance_level character varying(10) DEFAULT 'none'::character varying,
    last_checked_at timestamp with time zone DEFAULT now(),
    CONSTRAINT hail_alerts_risk_level_check CHECK (((risk_level)::text = ANY ((ARRAY['none'::character varying, 'moderate'::character varying, 'high'::character varying, 'active'::character varying])::text[]))),
    CONSTRAINT hail_alerts_vigilance_level_check CHECK (((vigilance_level)::text = ANY ((ARRAY['none'::character varying, 'yellow'::character varying, 'orange'::character varying, 'red'::character varying])::text[])))
);


--
-- Name: hail_departments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hail_departments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(3) NOT NULL,
    name character varying(100) NOT NULL,
    lat numeric(8,4) NOT NULL,
    lon numeric(8,4) NOT NULL,
    country_code character varying(2) DEFAULT 'FR'::character varying NOT NULL
);


--
-- Name: invoice_details; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invoice_details (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    invoice_id uuid,
    body_part_id uuid,
    body_material_id uuid,
    repair_type_id uuid,
    impact_count_25 integer,
    impact_count_35 integer,
    dent_removal_price numeric(5,2),
    price numeric(10,2)
);


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invoices (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    garage_id uuid,
    quote_id uuid,
    created_by_member_id uuid NOT NULL,
    assigned_member_id uuid,
    invoice_number text,
    quote_number text,
    status_id uuid,
    is_forfait boolean DEFAULT false NOT NULL,
    forfait_amount numeric(10,2),
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    country text,
    currency text,
    is_sent boolean DEFAULT false NOT NULL,
    sent_at timestamp with time zone,
    car_brand text,
    car_immatriculation text,
    car_year integer,
    commission_rate numeric(5,2),
    commission_paid boolean DEFAULT false NOT NULL,
    is_display_unit_price boolean DEFAULT true NOT NULL,
    is_compute_commission_without_dent_removal boolean DEFAULT false NOT NULL,
    total_ht numeric(10,2) DEFAULT 0 NOT NULL,
    total_ttc numeric(10,2) DEFAULT 0 NOT NULL,
    total_commission numeric(10,2) DEFAULT 0 NOT NULL,
    garage_name text,
    garage_address text,
    garage_zip_code character varying(10),
    garage_city text,
    garage_phone text,
    garage_email text,
    garage_percentage_commission numeric(5,2),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    archived_at timestamp with time zone
);


--
-- Name: monitored_locations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.monitored_locations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    city_name character varying(100) NOT NULL,
    lat numeric(8,4) NOT NULL,
    lon numeric(8,4) NOT NULL,
    country_code character varying(2) DEFAULT 'FR'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: organization_features; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_features (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    feature_key text NOT NULL,
    value jsonb,
    source text NOT NULL,
    starts_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone,
    stripe_subscription_item_id text,
    granted_by uuid,
    note text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT organization_features_source_check CHECK ((source = ANY (ARRAY['purchase'::text, 'gift'::text, 'trial'::text, 'support'::text])))
);


--
-- Name: plan_features; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.plan_features (
    plan_id uuid NOT NULL,
    feature_key text NOT NULL,
    value jsonb
);


--
-- Name: subscription_plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscription_plans (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    price_cents integer NOT NULL,
    stripe_price_id text,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    code text DEFAULT 'FREE'::text NOT NULL
);


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    plan_id uuid NOT NULL,
    stripe_subscription_id text,
    status text NOT NULL,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    organization_id uuid NOT NULL,
    source text DEFAULT 'stripe'::text NOT NULL,
    CONSTRAINT subscriptions_source_check CHECK ((source = ANY (ARRAY['stripe'::text, 'manual'::text, 'trial'::text]))),
    CONSTRAINT subscriptions_status_check CHECK ((status = ANY (ARRAY['active'::text, 'canceled'::text, 'incomplete'::text, 'past_due'::text, 'trialing'::text])))
);


--
-- Name: organization_effective_features; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.organization_effective_features WITH (security_invoker='true') AS
 WITH org_plan AS (
         SELECT s.organization_id,
                CASE
                    WHEN ((s.end_date IS NULL) OR (s.end_date > now())) THEN s.plan_id
                    ELSE ( SELECT p.id
                       FROM public.subscription_plans p
                      WHERE (p.code = 'FREE'::text))
                END AS plan_id
           FROM public.subscriptions s
          WHERE (s.status = 'active'::text)
        ), plan_vals AS (
         SELECT op.organization_id,
            pf.feature_key,
            pf.value
           FROM (org_plan op
             JOIN public.plan_features pf ON ((pf.plan_id = op.plan_id)))
        ), grants AS (
         SELECT organization_features.id,
            organization_features.organization_id,
            organization_features.feature_key,
            organization_features.value,
            organization_features.source,
            organization_features.starts_at,
            organization_features.expires_at,
            organization_features.stripe_subscription_item_id,
            organization_features.granted_by,
            organization_features.note,
            organization_features.created_at
           FROM public.organization_features
          WHERE ((organization_features.starts_at <= now()) AND ((organization_features.expires_at IS NULL) OR (organization_features.expires_at > now())))
        ), keys AS (
         SELECT plan_vals.organization_id,
            plan_vals.feature_key
           FROM plan_vals
        UNION
         SELECT grants.organization_id,
            grants.feature_key
           FROM grants
        )
 SELECT k.organization_id,
    k.feature_key,
    f.type,
        CASE f.type
            WHEN 'boolean'::text THEN to_jsonb((COALESCE(( SELECT ((pv.value)::text = 'true'::text)
               FROM plan_vals pv
              WHERE ((pv.organization_id = k.organization_id) AND (pv.feature_key = k.feature_key))), false) OR (EXISTS ( SELECT 1
               FROM grants g
              WHERE ((g.organization_id = k.organization_id) AND (g.feature_key = k.feature_key) AND ((g.value)::text = 'true'::text))))))
            ELSE
            CASE
                WHEN ((EXISTS ( SELECT 1
                   FROM plan_vals pv
                  WHERE ((pv.organization_id = k.organization_id) AND (pv.feature_key = k.feature_key) AND (pv.value IS NOT NULL) AND ((pv.value)::text = 'null'::text)))) OR (EXISTS ( SELECT 1
                   FROM grants g
                  WHERE ((g.organization_id = k.organization_id) AND (g.feature_key = k.feature_key) AND ((g.value IS NULL) OR ((g.value)::text = 'null'::text)))))) THEN NULL::jsonb
                ELSE to_jsonb((COALESCE(( SELECT ((pv.value)::text)::numeric AS value
                   FROM plan_vals pv
                  WHERE ((pv.organization_id = k.organization_id) AND (pv.feature_key = k.feature_key))), (0)::numeric) + COALESCE(( SELECT sum(((g.value)::text)::numeric) AS sum
                   FROM grants g
                  WHERE ((g.organization_id = k.organization_id) AND (g.feature_key = k.feature_key))), (0)::numeric)))
            END
        END AS value
   FROM (keys k
     JOIN public.features f ON ((f.key = k.feature_key)));


--
-- Name: organization_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    role text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    percentage_commission numeric,
    status public.organization_member_status DEFAULT 'active'::public.organization_member_status NOT NULL,
    created_by uuid,
    CONSTRAINT organization_members_role_check CHECK ((role = ANY (ARRAY['admin'::text, 'technician'::text, 'manager'::text])))
);


--
-- Name: organization_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    company_name text DEFAULT ''::text NOT NULL,
    legal_form text DEFAULT 'EI'::text NOT NULL,
    capital text,
    siren character(9),
    siret character(14),
    tva_number text,
    address text DEFAULT ''::text NOT NULL,
    zip_code text DEFAULT ''::text NOT NULL,
    city text DEFAULT ''::text NOT NULL,
    country text DEFAULT 'FR'::text NOT NULL,
    phone text,
    email text,
    website text,
    iban text,
    bic text,
    payment_delay integer DEFAULT 30 NOT NULL,
    late_payment_penalty text DEFAULT '3 fois le taux légal en vigueur'::text,
    recovery_fee text DEFAULT '40 €'::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    archived_at timestamp with time zone
);


--
-- Name: organizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organizations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    owner_user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    legal_name text,
    legal_form text,
    siren text,
    siret text,
    vat_number text,
    share_capital text,
    address text,
    postal_code text,
    city text,
    country_code text DEFAULT 'FR'::text,
    phone text,
    email text,
    website text,
    iban text,
    bic text,
    payment_delay_days integer DEFAULT 30,
    late_penalty text,
    collection_fee text,
    currency text DEFAULT 'EUR'::text,
    vat_rate numeric(5,2) DEFAULT 20.00,
    is_demo boolean DEFAULT false NOT NULL
);


--
-- Name: plan_change_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.plan_change_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    changed_at timestamp with time zone DEFAULT now() NOT NULL,
    changed_by uuid,
    plan_id uuid NOT NULL,
    plan_code text NOT NULL,
    feature_key text NOT NULL,
    old_value jsonb,
    new_value jsonb,
    orgs_on_plan integer DEFAULT 0 NOT NULL,
    orgs_affected integer DEFAULT 0 NOT NULL
);


--
-- Name: profile_switch_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profile_switch_log (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    action text NOT NULL,
    profile_id uuid,
    organization_id uuid,
    role text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT profile_switch_log_action_check CHECK ((action = ANY (ARRAY['switch'::text, 'clear'::text])))
);


--
-- Name: profile_switch_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.profile_switch_log ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.profile_switch_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: quote_details; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quote_details (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    quote_id uuid,
    body_part_id uuid,
    body_material_id uuid,
    repair_type_id uuid,
    impact_count_25 integer,
    impact_count_35 integer,
    dent_removal_price numeric(5,2),
    price numeric(10,2)
);


--
-- Name: quotes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quotes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization_id uuid NOT NULL,
    garage_id uuid,
    created_by_member_id uuid NOT NULL,
    assigned_member_id uuid,
    status_id uuid,
    quote_number text,
    is_forfait boolean DEFAULT false,
    forfait_amount numeric(10,2),
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    country text,
    currency text,
    is_sent boolean DEFAULT false,
    sent_at timestamp with time zone,
    car_brand text,
    car_immatriculation text,
    car_year integer,
    total_ht numeric(10,2) DEFAULT 0,
    commission_rate numeric(5,2),
    commission_paid boolean DEFAULT false NOT NULL,
    is_display_unit_price boolean DEFAULT true,
    is_compute_commission_without_dent_removal boolean DEFAULT false,
    garage_name text,
    garage_address text,
    garage_zip_code character varying(10),
    garage_city text,
    garage_phone text,
    garage_email text,
    garage_percentage_commission numeric(5,2),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    archived_at timestamp with time zone,
    convert_to_invoice boolean DEFAULT false NOT NULL,
    accepted_at timestamp with time zone,
    converted_at timestamp with time zone
);


--
-- Name: repair_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.repair_types (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255),
    code text
);


--
-- Name: setting_price_body_part_coefficient; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.setting_price_body_part_coefficient (
    body_part_id uuid NOT NULL,
    difficulty_coefficient numeric(5,2),
    organization_id uuid NOT NULL
);


--
-- Name: setting_price_diameter_coefficient; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.setting_price_diameter_coefficient (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    diameter numeric,
    coefficient numeric,
    organization_id uuid NOT NULL
);


--
-- Name: setting_price_general; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.setting_price_general (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    hourly_rate numeric(10,2),
    unit_time numeric,
    organization_id uuid NOT NULL
);


--
-- Name: setting_price_impact_count_to_ut; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.setting_price_impact_count_to_ut (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    unit_time integer,
    impact_count_min integer,
    impact_count_max integer,
    organization_id uuid NOT NULL
);


--
-- Name: setting_price_technicity_coefficient; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.setting_price_technicity_coefficient (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    diameter_25_coefficient numeric DEFAULT '1'::numeric NOT NULL,
    aluminium_coefficient numeric(5,2) DEFAULT '1'::numeric NOT NULL,
    diameter_35_coefficient numeric DEFAULT '1'::numeric NOT NULL,
    dsp_coefficient numeric DEFAULT '1'::numeric NOT NULL,
    dap_coefficient numeric DEFAULT '1'::numeric NOT NULL,
    organization_id uuid NOT NULL
);


--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.organization_role NOT NULL,
    organization_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email text NOT NULL,
    full_name text,
    phone text,
    first_name text,
    last_name text,
    profile_picture_url text,
    is_blocked boolean DEFAULT false NOT NULL,
    percentage_commission numeric(5,2) DEFAULT 0,
    platform_role public.platform_role DEFAULT 'user'::public.platform_role NOT NULL,
    CONSTRAINT users_platform_role_check CHECK ((platform_role = ANY (ARRAY['user'::public.platform_role, 'super_admin'::public.platform_role])))
);


--
-- Name: vehicles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vehicles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    garage_id uuid,
    marque text,
    annee integer,
    immatriculation text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: body_materials body_materials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.body_materials
    ADD CONSTRAINT body_materials_pkey PRIMARY KEY (id);


--
-- Name: body_parts body_parts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.body_parts
    ADD CONSTRAINT body_parts_pkey PRIMARY KEY (id);


--
-- Name: company_settings company_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_settings
    ADD CONSTRAINT company_settings_pkey PRIMARY KEY (id);


--
-- Name: company_settings company_settings_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_settings
    ADD CONSTRAINT company_settings_user_id_unique UNIQUE (user_id);


--
-- Name: default_setting_price_body_part_coefficient default_setting_price_body_part_coefficient_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.default_setting_price_body_part_coefficient
    ADD CONSTRAINT default_setting_price_body_part_coefficient_pkey PRIMARY KEY (id);


--
-- Name: default_setting_price_diameter_coefficient default_setting_price_diameter_coefficient_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.default_setting_price_diameter_coefficient
    ADD CONSTRAINT default_setting_price_diameter_coefficient_pkey PRIMARY KEY (id);


--
-- Name: default_setting_price_general default_setting_price_general_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.default_setting_price_general
    ADD CONSTRAINT default_setting_price_general_pkey PRIMARY KEY (id);


--
-- Name: default_setting_price_impact_count_to_ut default_setting_price_impact_count_to_ut_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.default_setting_price_impact_count_to_ut
    ADD CONSTRAINT default_setting_price_impact_count_to_ut_pkey PRIMARY KEY (id);


--
-- Name: default_setting_price_technicity_coefficient default_setting_price_technicity_coefficient_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.default_setting_price_technicity_coefficient
    ADD CONSTRAINT default_setting_price_technicity_coefficient_pkey PRIMARY KEY (id);


--
-- Name: demo_profile_context demo_profile_context_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.demo_profile_context
    ADD CONSTRAINT demo_profile_context_pkey PRIMARY KEY (user_id);


--
-- Name: demo_profiles demo_profiles_organization_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.demo_profiles
    ADD CONSTRAINT demo_profiles_organization_id_role_key UNIQUE (organization_id, role);


--
-- Name: demo_profiles demo_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.demo_profiles
    ADD CONSTRAINT demo_profiles_pkey PRIMARY KEY (id);


--
-- Name: document_statuses document_statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_statuses
    ADD CONSTRAINT document_statuses_pkey PRIMARY KEY (id);


--
-- Name: features features_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.features
    ADD CONSTRAINT features_pkey PRIMARY KEY (key);


--
-- Name: garage_members garage_technicians_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.garage_members
    ADD CONSTRAINT garage_technicians_pkey PRIMARY KEY (id);


--
-- Name: garage_members garage_technicians_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.garage_members
    ADD CONSTRAINT garage_technicians_unique UNIQUE (garage_id, organization_member_id);


--
-- Name: garages garages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.garages
    ADD CONSTRAINT garages_pkey PRIMARY KEY (id);


--
-- Name: hail_alerts hail_alerts_department_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hail_alerts
    ADD CONSTRAINT hail_alerts_department_unique UNIQUE (department_id);


--
-- Name: hail_alerts hail_alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hail_alerts
    ADD CONSTRAINT hail_alerts_pkey PRIMARY KEY (id);


--
-- Name: hail_departments hail_departments_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hail_departments
    ADD CONSTRAINT hail_departments_code_key UNIQUE (code);


--
-- Name: hail_departments hail_departments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hail_departments
    ADD CONSTRAINT hail_departments_pkey PRIMARY KEY (id);


--
-- Name: invoice_details invoice_details_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoice_details
    ADD CONSTRAINT invoice_details_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: monitored_locations monitored_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.monitored_locations
    ADD CONSTRAINT monitored_locations_pkey PRIMARY KEY (id);


--
-- Name: organization_features organization_features_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_features
    ADD CONSTRAINT organization_features_pkey PRIMARY KEY (id);


--
-- Name: organization_members organization_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_members
    ADD CONSTRAINT organization_members_pkey PRIMARY KEY (id);


--
-- Name: organization_members organization_members_user_id_organization_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_members
    ADD CONSTRAINT organization_members_user_id_organization_id_key UNIQUE (user_id, organization_id);


--
-- Name: organization_profiles organization_profiles_organization_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_profiles
    ADD CONSTRAINT organization_profiles_organization_id_key UNIQUE (organization_id);


--
-- Name: organization_profiles organization_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_profiles
    ADD CONSTRAINT organization_profiles_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: plan_change_log plan_change_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plan_change_log
    ADD CONSTRAINT plan_change_log_pkey PRIMARY KEY (id);


--
-- Name: plan_features plan_features_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plan_features
    ADD CONSTRAINT plan_features_pkey PRIMARY KEY (plan_id, feature_key);


--
-- Name: profile_switch_log profile_switch_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profile_switch_log
    ADD CONSTRAINT profile_switch_log_pkey PRIMARY KEY (id);


--
-- Name: quote_details quote_details_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quote_details
    ADD CONSTRAINT quote_details_pkey PRIMARY KEY (id);


--
-- Name: quotes quotes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_pkey PRIMARY KEY (id);


--
-- Name: repair_types repair_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repair_types
    ADD CONSTRAINT repair_types_pkey PRIMARY KEY (id);


--
-- Name: setting_price_body_part_coefficient setting_price_body_part_coefficient_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.setting_price_body_part_coefficient
    ADD CONSTRAINT setting_price_body_part_coefficient_pkey PRIMARY KEY (organization_id, body_part_id);


--
-- Name: setting_price_diameter_coefficient setting_price_diameter_coefficient_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.setting_price_diameter_coefficient
    ADD CONSTRAINT setting_price_diameter_coefficient_pkey PRIMARY KEY (id);


--
-- Name: setting_price_impact_count_to_ut setting_price_impact_count_to_ut_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.setting_price_impact_count_to_ut
    ADD CONSTRAINT setting_price_impact_count_to_ut_pkey PRIMARY KEY (id);


--
-- Name: subscription_plans subscription_plans_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscription_plans
    ADD CONSTRAINT subscription_plans_name_key UNIQUE (name);


--
-- Name: subscription_plans subscription_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscription_plans
    ADD CONSTRAINT subscription_plans_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: default_setting_price_body_part_coefficient uq_default_setting_body_part; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.default_setting_price_body_part_coefficient
    ADD CONSTRAINT uq_default_setting_body_part UNIQUE (body_part_id);


--
-- Name: default_setting_price_impact_count_to_ut uq_default_setting_impact_range; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.default_setting_price_impact_count_to_ut
    ADD CONSTRAINT uq_default_setting_impact_range UNIQUE (impact_count_min, impact_count_max);


--
-- Name: default_setting_price_diameter_coefficient uq_default_setting_price_diameter; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.default_setting_price_diameter_coefficient
    ADD CONSTRAINT uq_default_setting_price_diameter UNIQUE (diameter);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_user_organization_role_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_organization_role_unique UNIQUE (user_id, organization_id, role);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vehicles vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (id);


--
-- Name: idx_default_setting_body_part_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_default_setting_body_part_id ON public.default_setting_price_body_part_coefficient USING btree (body_part_id);


--
-- Name: idx_default_setting_impact_range; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_default_setting_impact_range ON public.default_setting_price_impact_count_to_ut USING btree (impact_count_min, impact_count_max);


--
-- Name: idx_hail_alerts_department_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hail_alerts_department_id ON public.hail_alerts USING btree (department_id);


--
-- Name: idx_hail_alerts_risk_level; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hail_alerts_risk_level ON public.hail_alerts USING btree (risk_level);


--
-- Name: idx_monitored_locations_org_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_monitored_locations_org_id ON public.monitored_locations USING btree (organization_id);


--
-- Name: organization_features_org_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX organization_features_org_idx ON public.organization_features USING btree (organization_id, feature_key);


--
-- Name: organization_profiles_organization_id_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX organization_profiles_organization_id_unique ON public.organization_profiles USING btree (organization_id);


--
-- Name: setting_price_general_organization_id_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX setting_price_general_organization_id_unique ON public.setting_price_general USING btree (organization_id);


--
-- Name: company_settings company_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER company_settings_updated_at BEFORE UPDATE ON public.company_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: garages set_garages_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_garages_updated_at BEFORE UPDATE ON public.garages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: garages trg_enforce_limit_garages; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_enforce_limit_garages BEFORE INSERT ON public.garages FOR EACH ROW EXECUTE FUNCTION public.enforce_plan_limit();


--
-- Name: invoices trg_enforce_limit_invoices; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_enforce_limit_invoices BEFORE INSERT ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.enforce_plan_limit();


--
-- Name: quotes trg_enforce_limit_quotes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_enforce_limit_quotes BEFORE INSERT ON public.quotes FOR EACH ROW EXECUTE FUNCTION public.enforce_plan_limit();


--
-- Name: organization_members trg_guard_organization_member_update; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_guard_organization_member_update BEFORE UPDATE ON public.organization_members FOR EACH ROW EXECUTE FUNCTION public.guard_organization_member_update();


--
-- Name: company_settings company_settings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_settings
    ADD CONSTRAINT company_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: demo_profile_context demo_profile_context_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.demo_profile_context
    ADD CONSTRAINT demo_profile_context_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: demo_profile_context demo_profile_context_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.demo_profile_context
    ADD CONSTRAINT demo_profile_context_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.demo_profiles(id) ON DELETE CASCADE;


--
-- Name: demo_profile_context demo_profile_context_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.demo_profile_context
    ADD CONSTRAINT demo_profile_context_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: demo_profiles demo_profiles_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.demo_profiles
    ADD CONSTRAINT demo_profiles_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: setting_price_body_part_coefficient fk_body_part; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.setting_price_body_part_coefficient
    ADD CONSTRAINT fk_body_part FOREIGN KEY (body_part_id) REFERENCES public.body_parts(id);


--
-- Name: default_setting_price_body_part_coefficient fk_default_setting_body_part; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.default_setting_price_body_part_coefficient
    ADD CONSTRAINT fk_default_setting_body_part FOREIGN KEY (body_part_id) REFERENCES public.body_parts(id) ON DELETE CASCADE;


--
-- Name: garage_members garage_technicians_garage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.garage_members
    ADD CONSTRAINT garage_technicians_garage_id_fkey FOREIGN KEY (garage_id) REFERENCES public.garages(id) ON DELETE CASCADE;


--
-- Name: garage_members garage_technicians_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.garage_members
    ADD CONSTRAINT garage_technicians_member_id_fkey FOREIGN KEY (organization_member_id) REFERENCES public.organization_members(id) ON DELETE CASCADE;


--
-- Name: garages garages_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.garages
    ADD CONSTRAINT garages_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: hail_alerts hail_alerts_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hail_alerts
    ADD CONSTRAINT hail_alerts_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.hail_departments(id) ON DELETE CASCADE;


--
-- Name: invoice_details invoice_details_body_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoice_details
    ADD CONSTRAINT invoice_details_body_material_id_fkey FOREIGN KEY (body_material_id) REFERENCES public.body_materials(id);


--
-- Name: invoice_details invoice_details_body_part_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoice_details
    ADD CONSTRAINT invoice_details_body_part_id_fkey FOREIGN KEY (body_part_id) REFERENCES public.body_parts(id);


--
-- Name: invoice_details invoice_details_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoice_details
    ADD CONSTRAINT invoice_details_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE;


--
-- Name: invoice_details invoice_details_repair_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoice_details
    ADD CONSTRAINT invoice_details_repair_type_id_fkey FOREIGN KEY (repair_type_id) REFERENCES public.repair_types(id);


--
-- Name: invoices invoices_assigned_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_assigned_member_id_fkey FOREIGN KEY (assigned_member_id) REFERENCES public.organization_members(id);


--
-- Name: invoices invoices_created_by_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_created_by_member_id_fkey FOREIGN KEY (created_by_member_id) REFERENCES public.organization_members(id);


--
-- Name: invoices invoices_garage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_garage_id_fkey FOREIGN KEY (garage_id) REFERENCES public.garages(id);


--
-- Name: invoices invoices_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: invoices invoices_quote_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_quote_id_fkey FOREIGN KEY (quote_id) REFERENCES public.quotes(id);


--
-- Name: invoices invoices_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.document_statuses(id);


--
-- Name: monitored_locations monitored_locations_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.monitored_locations
    ADD CONSTRAINT monitored_locations_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: organization_features organization_features_feature_key_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_features
    ADD CONSTRAINT organization_features_feature_key_fkey FOREIGN KEY (feature_key) REFERENCES public.features(key) ON DELETE CASCADE;


--
-- Name: organization_features organization_features_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_features
    ADD CONSTRAINT organization_features_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: organization_members organization_members_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_members
    ADD CONSTRAINT organization_members_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: organization_members organization_members_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_members
    ADD CONSTRAINT organization_members_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: organization_members organization_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_members
    ADD CONSTRAINT organization_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: organization_profiles organization_profiles_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_profiles
    ADD CONSTRAINT organization_profiles_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: organizations organizations_owner_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_owner_user_id_fkey FOREIGN KEY (owner_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: plan_change_log plan_change_log_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plan_change_log
    ADD CONSTRAINT plan_change_log_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id) ON DELETE CASCADE;


--
-- Name: plan_features plan_features_feature_key_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plan_features
    ADD CONSTRAINT plan_features_feature_key_fkey FOREIGN KEY (feature_key) REFERENCES public.features(key) ON DELETE CASCADE;


--
-- Name: plan_features plan_features_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plan_features
    ADD CONSTRAINT plan_features_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id) ON DELETE CASCADE;


--
-- Name: profile_switch_log profile_switch_log_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profile_switch_log
    ADD CONSTRAINT profile_switch_log_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL;


--
-- Name: profile_switch_log profile_switch_log_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profile_switch_log
    ADD CONSTRAINT profile_switch_log_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.demo_profiles(id) ON DELETE SET NULL;


--
-- Name: profile_switch_log profile_switch_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profile_switch_log
    ADD CONSTRAINT profile_switch_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: quote_details quote_details_body_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quote_details
    ADD CONSTRAINT quote_details_body_material_id_fkey FOREIGN KEY (body_material_id) REFERENCES public.body_materials(id);


--
-- Name: quote_details quote_details_body_part_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quote_details
    ADD CONSTRAINT quote_details_body_part_id_fkey FOREIGN KEY (body_part_id) REFERENCES public.body_parts(id);


--
-- Name: quote_details quote_details_quote_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quote_details
    ADD CONSTRAINT quote_details_quote_id_fkey FOREIGN KEY (quote_id) REFERENCES public.quotes(id) ON DELETE CASCADE;


--
-- Name: quote_details quote_details_repair_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quote_details
    ADD CONSTRAINT quote_details_repair_type_id_fkey FOREIGN KEY (repair_type_id) REFERENCES public.repair_types(id);


--
-- Name: quotes quotes_assigned_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_assigned_member_id_fkey FOREIGN KEY (assigned_member_id) REFERENCES public.organization_members(id);


--
-- Name: quotes quotes_created_by_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_created_by_member_id_fkey FOREIGN KEY (created_by_member_id) REFERENCES public.organization_members(id);


--
-- Name: quotes quotes_garage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_garage_id_fkey FOREIGN KEY (garage_id) REFERENCES public.garages(id);


--
-- Name: quotes quotes_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: quotes quotes_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.document_statuses(id);


--
-- Name: setting_price_body_part_coefficient setting_price_body_part_coefficient_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.setting_price_body_part_coefficient
    ADD CONSTRAINT setting_price_body_part_coefficient_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: setting_price_diameter_coefficient setting_price_diameter_coefficient_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.setting_price_diameter_coefficient
    ADD CONSTRAINT setting_price_diameter_coefficient_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: setting_price_general setting_price_general_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.setting_price_general
    ADD CONSTRAINT setting_price_general_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: setting_price_impact_count_to_ut setting_price_impact_count_to_ut_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.setting_price_impact_count_to_ut
    ADD CONSTRAINT setting_price_impact_count_to_ut_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: setting_price_technicity_coefficient setting_price_technicity_coefficient_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.setting_price_technicity_coefficient
    ADD CONSTRAINT setting_price_technicity_coefficient_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: subscriptions subscriptions_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: subscriptions subscriptions_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id);


--
-- Name: user_profiles user_profiles_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: user_profiles user_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users users_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: vehicles vehicles_garage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_garage_id_fkey FOREIGN KEY (garage_id) REFERENCES public.garages(id) ON DELETE CASCADE;


--
-- Name: vehicles vehicles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: organization_profiles Admins can create organization profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can create organization profile" ON public.organization_profiles FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.organization_id = organization_profiles.organization_id) AND (om.user_id = auth.uid()) AND (om.role = 'admin'::text)))));


--
-- Name: setting_price_body_part_coefficient Admins can insert body part coefficients; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert body part coefficients" ON public.setting_price_body_part_coefficient FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.organization_id = setting_price_body_part_coefficient.organization_id) AND (om.user_id = auth.uid()) AND (om.role = 'admin'::text)))));


--
-- Name: setting_price_diameter_coefficient Admins can insert diameter coefficients; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert diameter coefficients" ON public.setting_price_diameter_coefficient FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.organization_id = setting_price_diameter_coefficient.organization_id) AND (om.user_id = auth.uid()) AND (om.role = 'admin'::text)))));


--
-- Name: setting_price_general Admins can insert general settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert general settings" ON public.setting_price_general FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.organization_id = setting_price_general.organization_id) AND (om.user_id = auth.uid()) AND (om.role = 'admin'::text)))));


--
-- Name: setting_price_impact_count_to_ut Admins can insert impact count settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert impact count settings" ON public.setting_price_impact_count_to_ut FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.organization_id = setting_price_impact_count_to_ut.organization_id) AND (om.user_id = auth.uid()) AND (om.role = 'admin'::text)))));


--
-- Name: setting_price_technicity_coefficient Admins can insert technicity coefficients; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert technicity coefficients" ON public.setting_price_technicity_coefficient FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.organization_id = setting_price_technicity_coefficient.organization_id) AND (om.user_id = auth.uid()) AND (om.role = 'admin'::text)))));


--
-- Name: garages Admins can manage organization garages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage organization garages" ON public.garages TO authenticated USING (public.is_organization_admin(organization_id)) WITH CHECK (public.is_organization_admin(organization_id));


--
-- Name: users Admins can read organization users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can read organization users" ON public.users FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM (public.organization_members om_admin
     JOIN public.organization_members om_target ON ((om_target.organization_id = om_admin.organization_id)))
  WHERE ((om_admin.user_id = auth.uid()) AND (om_admin.role = 'admin'::text) AND (om_target.user_id = users.id)))));


--
-- Name: setting_price_body_part_coefficient Admins can update body part coefficients; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update body part coefficients" ON public.setting_price_body_part_coefficient FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.organization_id = setting_price_body_part_coefficient.organization_id) AND (om.user_id = auth.uid()) AND (om.role = 'admin'::text))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.organization_id = setting_price_body_part_coefficient.organization_id) AND (om.user_id = auth.uid()) AND (om.role = 'admin'::text)))));


--
-- Name: setting_price_diameter_coefficient Admins can update diameter coefficients; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update diameter coefficients" ON public.setting_price_diameter_coefficient FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.organization_id = setting_price_diameter_coefficient.organization_id) AND (om.user_id = auth.uid()) AND (om.role = 'admin'::text))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.organization_id = setting_price_diameter_coefficient.organization_id) AND (om.user_id = auth.uid()) AND (om.role = 'admin'::text)))));


--
-- Name: setting_price_general Admins can update general settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update general settings" ON public.setting_price_general FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.organization_id = setting_price_general.organization_id) AND (om.user_id = auth.uid()) AND (om.role = 'admin'::text))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.organization_id = setting_price_general.organization_id) AND (om.user_id = auth.uid()) AND (om.role = 'admin'::text)))));


--
-- Name: setting_price_impact_count_to_ut Admins can update impact count settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update impact count settings" ON public.setting_price_impact_count_to_ut FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.organization_id = setting_price_impact_count_to_ut.organization_id) AND (om.user_id = auth.uid()) AND (om.role = 'admin'::text))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.organization_id = setting_price_impact_count_to_ut.organization_id) AND (om.user_id = auth.uid()) AND (om.role = 'admin'::text)))));


--
-- Name: organization_members Admins can update members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update members" ON public.organization_members FOR UPDATE TO authenticated USING ((organization_id IN ( SELECT om.organization_id
   FROM public.organization_members om
  WHERE ((om.user_id = auth.uid()) AND (om.role = 'admin'::text))))) WITH CHECK ((organization_id IN ( SELECT om.organization_id
   FROM public.organization_members om
  WHERE ((om.user_id = auth.uid()) AND (om.role = 'admin'::text)))));


--
-- Name: organization_profiles Admins can update organization profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update organization profile" ON public.organization_profiles FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.organization_id = organization_profiles.organization_id) AND (om.user_id = auth.uid()) AND (om.role = 'admin'::text))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.organization_id = organization_profiles.organization_id) AND (om.user_id = auth.uid()) AND (om.role = 'admin'::text)))));


--
-- Name: users Admins can update organization users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update organization users" ON public.users FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.user_id = users.id) AND public.is_organization_admin(om.organization_id))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.user_id = users.id) AND public.is_organization_admin(om.organization_id)))));


--
-- Name: setting_price_technicity_coefficient Admins can update technicity coefficients; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update technicity coefficients" ON public.setting_price_technicity_coefficient FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.organization_id = setting_price_technicity_coefficient.organization_id) AND (om.user_id = auth.uid()) AND (om.role = 'admin'::text))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.organization_id = setting_price_technicity_coefficient.organization_id) AND (om.user_id = auth.uid()) AND (om.role = 'admin'::text)))));


--
-- Name: subscription_plans Anyone can read subscription plans; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can read subscription plans" ON public.subscription_plans FOR SELECT TO authenticated USING (true);


--
-- Name: garages Assigned members can read garages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Assigned members can read garages" ON public.garages FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM (public.garage_members gm
     JOIN public.organization_members om ON ((om.id = gm.organization_member_id)))
  WHERE ((gm.garage_id = garages.id) AND (om.user_id = auth.uid()) AND (om.status = 'active'::public.organization_member_status)))));


--
-- Name: hail_alerts Authenticated users can read hail alerts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can read hail alerts" ON public.hail_alerts FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: hail_departments Authenticated users can read hail departments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can read hail departments" ON public.hail_departments FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: organizations Enable users to view their own data only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable users to view their own data only" ON public.organizations FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = owner_user_id));


--
-- Name: users Enable users to view their own data only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable users to view their own data only" ON public.users FOR SELECT TO authenticated USING ((( SELECT auth.uid() AS uid) = id));


--
-- Name: users Managers can update own created users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Managers can update own created users" ON public.users FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.organization_members t
  WHERE ((t.user_id = users.id) AND public.can_manage_member(t.id))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.organization_members t
  WHERE ((t.user_id = users.id) AND public.can_manage_member(t.id)))));


--
-- Name: invoice_details Members can delete invoice details; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Members can delete invoice details" ON public.invoice_details FOR DELETE USING ((invoice_id IN ( SELECT invoices.id
   FROM public.invoices
  WHERE (invoices.organization_id IN ( SELECT organization_members.organization_id
           FROM public.organization_members
          WHERE (organization_members.user_id = auth.uid()))))));


--
-- Name: invoice_details Members can insert invoice details; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Members can insert invoice details" ON public.invoice_details FOR INSERT WITH CHECK ((invoice_id IN ( SELECT invoices.id
   FROM public.invoices
  WHERE (invoices.organization_id IN ( SELECT organization_members.organization_id
           FROM public.organization_members
          WHERE (organization_members.user_id = auth.uid()))))));


--
-- Name: setting_price_body_part_coefficient Members can read body part coefficients; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Members can read body part coefficients" ON public.setting_price_body_part_coefficient FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.organization_id = setting_price_body_part_coefficient.organization_id) AND (om.user_id = auth.uid())))));


--
-- Name: setting_price_diameter_coefficient Members can read diameter coefficients; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Members can read diameter coefficients" ON public.setting_price_diameter_coefficient FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.organization_id = setting_price_diameter_coefficient.organization_id) AND (om.user_id = auth.uid())))));


--
-- Name: setting_price_general Members can read general settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Members can read general settings" ON public.setting_price_general FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.organization_id = setting_price_general.organization_id) AND (om.user_id = auth.uid())))));


--
-- Name: setting_price_impact_count_to_ut Members can read impact count settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Members can read impact count settings" ON public.setting_price_impact_count_to_ut FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.organization_id = setting_price_impact_count_to_ut.organization_id) AND (om.user_id = auth.uid())))));


--
-- Name: invoice_details Members can read invoice details; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Members can read invoice details" ON public.invoice_details FOR SELECT USING ((invoice_id IN ( SELECT invoices.id
   FROM public.invoices
  WHERE (invoices.organization_id IN ( SELECT organization_members.organization_id
           FROM public.organization_members
          WHERE (organization_members.user_id = auth.uid()))))));


--
-- Name: organization_profiles Members can read organization profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Members can read organization profile" ON public.organization_profiles FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.organization_id = organization_profiles.organization_id) AND (om.user_id = auth.uid())))));


--
-- Name: setting_price_technicity_coefficient Members can read technicity coefficients; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Members can read technicity coefficients" ON public.setting_price_technicity_coefficient FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.organization_id = setting_price_technicity_coefficient.organization_id) AND (om.user_id = auth.uid())))));


--
-- Name: organization_members Members read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Members read access" ON public.organization_members FOR SELECT TO authenticated USING ((public.is_organization_admin(organization_id) OR (user_id = auth.uid())));


--
-- Name: monitored_locations Org members can manage their monitored locations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Org members can manage their monitored locations" ON public.monitored_locations USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE (organization_members.user_id = auth.uid())))) WITH CHECK ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE (organization_members.user_id = auth.uid()))));


--
-- Name: company_settings Org members can read company settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Org members can read company settings" ON public.company_settings FOR SELECT USING ((auth.uid() IN ( SELECT om.user_id
   FROM public.organization_members om
  WHERE (om.organization_id = ( SELECT om2.organization_id
           FROM public.organization_members om2
          WHERE (om2.user_id = company_settings.user_id)
         LIMIT 1)))));


--
-- Name: organizations Organization members can read organization; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organization members can read organization" ON public.organizations FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.organization_id = organizations.id) AND (om.user_id = auth.uid()) AND (om.status = 'active'::public.organization_member_status)))));


--
-- Name: company_settings Owner can write company settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Owner can write company settings" ON public.company_settings USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: hail_alerts Service role can upsert hail alerts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can upsert hail alerts" ON public.hail_alerts USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: organizations Users can create their own organization; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own organization" ON public.organizations FOR INSERT TO authenticated WITH CHECK ((auth.uid() = owner_user_id));


--
-- Name: garages Users can insert garages in their organization; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert garages in their organization" ON public.garages FOR INSERT WITH CHECK ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE (organization_members.user_id = auth.uid()))));


--
-- Name: user_profiles Users can read their own profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can read their own profiles" ON public.user_profiles FOR SELECT TO authenticated USING ((user_id = auth.uid()));


--
-- Name: garages Users can update garages from their organization; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update garages from their organization" ON public.garages FOR UPDATE USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE (organization_members.user_id = auth.uid())))) WITH CHECK ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE (organization_members.user_id = auth.uid()))));


--
-- Name: users Users can update own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));


--
-- Name: garages Users can view garages from their organization; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view garages from their organization" ON public.garages FOR SELECT USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE (organization_members.user_id = auth.uid()))));


--
-- Name: subscriptions Users can view organization subscriptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view organization subscriptions" ON public.subscriptions FOR SELECT TO authenticated USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE (organization_members.user_id = auth.uid()))));


--
-- Name: body_materials authenticated_can_read_body_materials; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY authenticated_can_read_body_materials ON public.body_materials FOR SELECT TO authenticated USING (true);


--
-- Name: body_parts authenticated_can_read_body_parts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY authenticated_can_read_body_parts ON public.body_parts FOR SELECT TO authenticated USING (true);


--
-- Name: default_setting_price_body_part_coefficient authenticated_can_read_default_setting_body_part; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY authenticated_can_read_default_setting_body_part ON public.default_setting_price_body_part_coefficient FOR SELECT TO authenticated USING (true);


--
-- Name: default_setting_price_impact_count_to_ut authenticated_can_read_default_setting_impact_count; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY authenticated_can_read_default_setting_impact_count ON public.default_setting_price_impact_count_to_ut FOR SELECT TO authenticated USING (true);


--
-- Name: default_setting_price_diameter_coefficient authenticated_can_read_default_setting_price_diameter; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY authenticated_can_read_default_setting_price_diameter ON public.default_setting_price_diameter_coefficient FOR SELECT TO authenticated USING (true);


--
-- Name: default_setting_price_general authenticated_can_read_default_setting_price_general; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY authenticated_can_read_default_setting_price_general ON public.default_setting_price_general FOR SELECT TO authenticated USING (true);


--
-- Name: default_setting_price_technicity_coefficient authenticated_can_read_default_setting_price_technicity; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY authenticated_can_read_default_setting_price_technicity ON public.default_setting_price_technicity_coefficient FOR SELECT TO authenticated USING (true);


--
-- Name: document_statuses authenticated_can_read_document_statuses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY authenticated_can_read_document_statuses ON public.document_statuses FOR SELECT TO authenticated USING (true);


--
-- Name: repair_types authenticated_can_read_repair_types; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY authenticated_can_read_repair_types ON public.repair_types FOR SELECT TO authenticated USING (true);


--
-- Name: vehicles authenticated_read_vehicles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY authenticated_read_vehicles ON public.vehicles FOR SELECT TO authenticated USING (true);


--
-- Name: body_materials; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.body_materials ENABLE ROW LEVEL SECURITY;

--
-- Name: body_materials body_materials_super_admin_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY body_materials_super_admin_insert ON public.body_materials FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());


--
-- Name: body_materials body_materials_super_admin_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY body_materials_super_admin_update ON public.body_materials FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());


--
-- Name: body_parts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.body_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: body_parts body_parts_super_admin_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY body_parts_super_admin_insert ON public.body_parts FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());


--
-- Name: body_parts body_parts_super_admin_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY body_parts_super_admin_update ON public.body_parts FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());


--
-- Name: company_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: default_setting_price_body_part_coefficient; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.default_setting_price_body_part_coefficient ENABLE ROW LEVEL SECURITY;

--
-- Name: default_setting_price_diameter_coefficient; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.default_setting_price_diameter_coefficient ENABLE ROW LEVEL SECURITY;

--
-- Name: default_setting_price_general; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.default_setting_price_general ENABLE ROW LEVEL SECURITY;

--
-- Name: default_setting_price_impact_count_to_ut; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.default_setting_price_impact_count_to_ut ENABLE ROW LEVEL SECURITY;

--
-- Name: default_setting_price_technicity_coefficient; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.default_setting_price_technicity_coefficient ENABLE ROW LEVEL SECURITY;

--
-- Name: demo_profile_context; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.demo_profile_context ENABLE ROW LEVEL SECURITY;

--
-- Name: demo_profile_context demo_profile_context_own_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY demo_profile_context_own_select ON public.demo_profile_context FOR SELECT TO authenticated USING (((user_id = auth.uid()) AND public.is_super_admin()));


--
-- Name: demo_profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.demo_profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: demo_profiles demo_profiles_super_admin_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY demo_profiles_super_admin_select ON public.demo_profiles FOR SELECT TO authenticated USING (public.is_super_admin());


--
-- Name: document_statuses; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.document_statuses ENABLE ROW LEVEL SECURITY;

--
-- Name: document_statuses document_statuses_super_admin_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY document_statuses_super_admin_insert ON public.document_statuses FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());


--
-- Name: document_statuses document_statuses_super_admin_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY document_statuses_super_admin_update ON public.document_statuses FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());


--
-- Name: features; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;

--
-- Name: features features_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY features_read ON public.features FOR SELECT TO authenticated USING (true);


--
-- Name: garage_members; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.garage_members ENABLE ROW LEVEL SECURITY;

--
-- Name: garage_members garage_members_admin_write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY garage_members_admin_write ON public.garage_members TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.id = garage_members.organization_member_id) AND public.is_organization_admin(om.organization_id))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.id = garage_members.organization_member_id) AND public.is_organization_admin(om.organization_id)))));


--
-- Name: garage_members garage_members_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY garage_members_read ON public.garage_members FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.organization_members om
  WHERE ((om.id = garage_members.organization_member_id) AND ((om.user_id = auth.uid()) OR public.is_organization_admin(om.organization_id))))));


--
-- Name: garages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.garages ENABLE ROW LEVEL SECURITY;

--
-- Name: hail_alerts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.hail_alerts ENABLE ROW LEVEL SECURITY;

--
-- Name: hail_departments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.hail_departments ENABLE ROW LEVEL SECURITY;

--
-- Name: invoice_details; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.invoice_details ENABLE ROW LEVEL SECURITY;

--
-- Name: invoices; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

--
-- Name: invoices invoices_org_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY invoices_org_delete ON public.invoices FOR DELETE TO authenticated USING (public.is_organization_member(organization_id));


--
-- Name: invoices invoices_org_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY invoices_org_insert ON public.invoices FOR INSERT TO authenticated WITH CHECK (public.is_organization_member(organization_id));


--
-- Name: invoices invoices_org_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY invoices_org_select ON public.invoices FOR SELECT TO authenticated USING (public.is_organization_member(organization_id));


--
-- Name: invoices invoices_org_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY invoices_org_update ON public.invoices FOR UPDATE TO authenticated USING (public.is_organization_member(organization_id)) WITH CHECK (public.is_organization_member(organization_id));


--
-- Name: monitored_locations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.monitored_locations ENABLE ROW LEVEL SECURITY;

--
-- Name: default_setting_price_general no_delete_default_settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY no_delete_default_settings ON public.default_setting_price_general FOR DELETE TO authenticated USING (false);


--
-- Name: default_setting_price_general no_insert_default_settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY no_insert_default_settings ON public.default_setting_price_general FOR INSERT TO authenticated WITH CHECK (false);


--
-- Name: default_setting_price_general no_update_default_settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY no_update_default_settings ON public.default_setting_price_general FOR UPDATE TO authenticated USING (false);


--
-- Name: organization_members om_hide_super_admin; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY om_hide_super_admin ON public.organization_members AS RESTRICTIVE FOR SELECT TO authenticated USING ((public.is_super_admin() OR (NOT public.is_super_admin_user(user_id)) OR (user_id = auth.uid())));


--
-- Name: organization_members om_restrict_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY om_restrict_delete ON public.organization_members AS RESTRICTIVE FOR DELETE TO authenticated USING (public.can_manage_member(id));


--
-- Name: organization_members om_restrict_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY om_restrict_update ON public.organization_members AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.can_manage_member(id)) WITH CHECK (public.can_manage_member(id));


--
-- Name: organization_features; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.organization_features ENABLE ROW LEVEL SECURITY;

--
-- Name: organization_features organization_features_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY organization_features_read ON public.organization_features FOR SELECT TO authenticated USING ((organization_id IN ( SELECT organization_members.organization_id
   FROM public.organization_members
  WHERE (organization_members.user_id = auth.uid()))));


--
-- Name: organization_members; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

--
-- Name: organization_profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.organization_profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: organizations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

--
-- Name: organizations organizations_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY organizations_delete ON public.organizations FOR DELETE TO authenticated USING ((auth.uid() = owner_user_id));


--
-- Name: organizations organizations_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY organizations_update ON public.organizations FOR UPDATE TO authenticated USING ((auth.uid() = owner_user_id));


--
-- Name: plan_change_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.plan_change_log ENABLE ROW LEVEL SECURITY;

--
-- Name: plan_features; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.plan_features ENABLE ROW LEVEL SECURITY;

--
-- Name: plan_features plan_features_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY plan_features_read ON public.plan_features FOR SELECT TO authenticated USING (true);


--
-- Name: profile_switch_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profile_switch_log ENABLE ROW LEVEL SECURITY;

--
-- Name: profile_switch_log profile_switch_log_super_admin_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY profile_switch_log_super_admin_select ON public.profile_switch_log FOR SELECT TO authenticated USING (public.is_super_admin());


--
-- Name: quote_details; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quote_details ENABLE ROW LEVEL SECURITY;

--
-- Name: quote_details quote_details_org_all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY quote_details_org_all ON public.quote_details TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.quotes q
  WHERE ((q.id = quote_details.quote_id) AND public.is_organization_member(q.organization_id))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.quotes q
  WHERE ((q.id = quote_details.quote_id) AND public.is_organization_member(q.organization_id)))));


--
-- Name: quotes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

--
-- Name: quotes quotes_org_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY quotes_org_delete ON public.quotes FOR DELETE TO authenticated USING (public.is_organization_member(organization_id));


--
-- Name: quotes quotes_org_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY quotes_org_insert ON public.quotes FOR INSERT TO authenticated WITH CHECK (public.is_organization_member(organization_id));


--
-- Name: quotes quotes_org_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY quotes_org_select ON public.quotes FOR SELECT TO authenticated USING (public.is_organization_member(organization_id));


--
-- Name: quotes quotes_org_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY quotes_org_update ON public.quotes FOR UPDATE TO authenticated USING (public.is_organization_member(organization_id)) WITH CHECK (public.is_organization_member(organization_id));


--
-- Name: repair_types; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.repair_types ENABLE ROW LEVEL SECURITY;

--
-- Name: repair_types repair_types_super_admin_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY repair_types_super_admin_insert ON public.repair_types FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());


--
-- Name: repair_types repair_types_super_admin_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY repair_types_super_admin_update ON public.repair_types FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());


--
-- Name: setting_price_body_part_coefficient; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.setting_price_body_part_coefficient ENABLE ROW LEVEL SECURITY;

--
-- Name: setting_price_diameter_coefficient; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.setting_price_diameter_coefficient ENABLE ROW LEVEL SECURITY;

--
-- Name: setting_price_general; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.setting_price_general ENABLE ROW LEVEL SECURITY;

--
-- Name: setting_price_impact_count_to_ut; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.setting_price_impact_count_to_ut ENABLE ROW LEVEL SECURITY;

--
-- Name: setting_price_technicity_coefficient; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.setting_price_technicity_coefficient ENABLE ROW LEVEL SECURITY;

--
-- Name: subscription_plans; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

--
-- Name: subscriptions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

--
-- Name: user_profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- Name: users users_hide_super_admin; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY users_hide_super_admin ON public.users AS RESTRICTIVE FOR SELECT TO authenticated USING (((platform_role <> 'super_admin'::public.platform_role) OR (id = auth.uid()) OR public.is_super_admin()));


--
-- Name: users users_restrict_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY users_restrict_update ON public.users AS RESTRICTIVE FOR UPDATE TO authenticated USING (public.can_manage_user(id)) WITH CHECK (public.can_manage_user(id));


--
-- Name: vehicles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: FUNCTION apply_plan_changes(p_changes jsonb); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.apply_plan_changes(p_changes jsonb) FROM PUBLIC;
GRANT ALL ON FUNCTION public.apply_plan_changes(p_changes jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.apply_plan_changes(p_changes jsonb) TO service_role;


--
-- Name: FUNCTION can_manage_member(p_member_id uuid); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.can_manage_member(p_member_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION public.can_manage_member(p_member_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.can_manage_member(p_member_id uuid) TO service_role;


--
-- Name: FUNCTION can_manage_user(p_user_id uuid); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.can_manage_user(p_user_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION public.can_manage_user(p_user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.can_manage_user(p_user_id uuid) TO service_role;


--
-- Name: FUNCTION can_use_feature(p_organization_id uuid, p_feature text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.can_use_feature(p_organization_id uuid, p_feature text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.can_use_feature(p_organization_id uuid, p_feature text) TO authenticated;
GRANT ALL ON FUNCTION public.can_use_feature(p_organization_id uuid, p_feature text) TO service_role;


--
-- Name: FUNCTION clear_demo_profile(); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.clear_demo_profile() FROM PUBLIC;
GRANT ALL ON FUNCTION public.clear_demo_profile() TO authenticated;
GRANT ALL ON FUNCTION public.clear_demo_profile() TO service_role;


--
-- Name: FUNCTION create_demo_profile(p_organization_id uuid, p_role text, p_label text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.create_demo_profile(p_organization_id uuid, p_role text, p_label text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.create_demo_profile(p_organization_id uuid, p_role text, p_label text) TO authenticated;
GRANT ALL ON FUNCTION public.create_demo_profile(p_organization_id uuid, p_role text, p_label text) TO service_role;


--
-- Name: FUNCTION delete_demo_profile(p_profile_id uuid); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.delete_demo_profile(p_profile_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION public.delete_demo_profile(p_profile_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.delete_demo_profile(p_profile_id uuid) TO service_role;


--
-- Name: FUNCTION enforce_plan_limit(); Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON FUNCTION public.enforce_plan_limit() TO anon;
GRANT ALL ON FUNCTION public.enforce_plan_limit() TO authenticated;
GRANT ALL ON FUNCTION public.enforce_plan_limit() TO service_role;


--
-- Name: FUNCTION expire_subscriptions(); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.expire_subscriptions() FROM PUBLIC;
GRANT ALL ON FUNCTION public.expire_subscriptions() TO service_role;


--
-- Name: FUNCTION get_demo_profile_context(); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_demo_profile_context() FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_demo_profile_context() TO authenticated;
GRANT ALL ON FUNCTION public.get_demo_profile_context() TO service_role;


--
-- Name: FUNCTION get_platform_stats(); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.get_platform_stats() FROM PUBLIC;
GRANT ALL ON FUNCTION public.get_platform_stats() TO authenticated;
GRANT ALL ON FUNCTION public.get_platform_stats() TO service_role;


--
-- Name: FUNCTION grant_feature(p_organization_id uuid, p_feature_key text, p_duration text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.grant_feature(p_organization_id uuid, p_feature_key text, p_duration text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.grant_feature(p_organization_id uuid, p_feature_key text, p_duration text) TO authenticated;
GRANT ALL ON FUNCTION public.grant_feature(p_organization_id uuid, p_feature_key text, p_duration text) TO service_role;


--
-- Name: FUNCTION grant_premium(p_organization_id uuid, p_duration text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.grant_premium(p_organization_id uuid, p_duration text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.grant_premium(p_organization_id uuid, p_duration text) TO authenticated;
GRANT ALL ON FUNCTION public.grant_premium(p_organization_id uuid, p_duration text) TO service_role;


--
-- Name: FUNCTION guard_organization_member_update(); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.guard_organization_member_update() FROM PUBLIC;
GRANT ALL ON FUNCTION public.guard_organization_member_update() TO service_role;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;


--
-- Name: FUNCTION is_organization_admin(target_organization_id uuid); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.is_organization_admin(target_organization_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION public.is_organization_admin(target_organization_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.is_organization_admin(target_organization_id uuid) TO service_role;


--
-- Name: FUNCTION is_organization_member(target_organization_id uuid); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.is_organization_member(target_organization_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION public.is_organization_member(target_organization_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.is_organization_member(target_organization_id uuid) TO service_role;


--
-- Name: FUNCTION is_super_admin(); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.is_super_admin() FROM PUBLIC;
GRANT ALL ON FUNCTION public.is_super_admin() TO authenticated;
GRANT ALL ON FUNCTION public.is_super_admin() TO service_role;


--
-- Name: FUNCTION is_super_admin_user(p_user_id uuid); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.is_super_admin_user(p_user_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION public.is_super_admin_user(p_user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.is_super_admin_user(p_user_id uuid) TO service_role;


--
-- Name: FUNCTION list_demo_profiles(); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.list_demo_profiles() FROM PUBLIC;
GRANT ALL ON FUNCTION public.list_demo_profiles() TO authenticated;
GRANT ALL ON FUNCTION public.list_demo_profiles() TO service_role;


--
-- Name: FUNCTION list_plan_change_log(p_limit integer); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.list_plan_change_log(p_limit integer) FROM PUBLIC;
GRANT ALL ON FUNCTION public.list_plan_change_log(p_limit integer) TO authenticated;
GRANT ALL ON FUNCTION public.list_plan_change_log(p_limit integer) TO service_role;


--
-- Name: FUNCTION list_platform_organizations(); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.list_platform_organizations() FROM PUBLIC;
GRANT ALL ON FUNCTION public.list_platform_organizations() TO authenticated;
GRANT ALL ON FUNCTION public.list_platform_organizations() TO service_role;


--
-- Name: FUNCTION list_platform_plans(); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.list_platform_plans() FROM PUBLIC;
GRANT ALL ON FUNCTION public.list_platform_plans() TO authenticated;
GRANT ALL ON FUNCTION public.list_platform_plans() TO service_role;


--
-- Name: FUNCTION list_platform_users(); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.list_platform_users() FROM PUBLIC;
GRANT ALL ON FUNCTION public.list_platform_users() TO authenticated;
GRANT ALL ON FUNCTION public.list_platform_users() TO service_role;


--
-- Name: FUNCTION org_limit(p_organization_id uuid, p_feature text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.org_limit(p_organization_id uuid, p_feature text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.org_limit(p_organization_id uuid, p_feature text) TO authenticated;
GRANT ALL ON FUNCTION public.org_limit(p_organization_id uuid, p_feature text) TO service_role;


--
-- Name: FUNCTION plan_change_impact(p_plan_id uuid, p_key text, p_new jsonb); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.plan_change_impact(p_plan_id uuid, p_key text, p_new jsonb) FROM PUBLIC;
GRANT ALL ON FUNCTION public.plan_change_impact(p_plan_id uuid, p_key text, p_new jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.plan_change_impact(p_plan_id uuid, p_key text, p_new jsonb) TO service_role;


--
-- Name: FUNCTION preview_plan_changes(p_changes jsonb); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.preview_plan_changes(p_changes jsonb) FROM PUBLIC;
GRANT ALL ON FUNCTION public.preview_plan_changes(p_changes jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.preview_plan_changes(p_changes jsonb) TO service_role;


--
-- Name: FUNCTION provision_organization(p_name text); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.provision_organization(p_name text) FROM PUBLIC;
GRANT ALL ON FUNCTION public.provision_organization(p_name text) TO authenticated;
GRANT ALL ON FUNCTION public.provision_organization(p_name text) TO service_role;


--
-- Name: FUNCTION set_plan_feature(p_plan_id uuid, p_feature_key text, p_value jsonb); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.set_plan_feature(p_plan_id uuid, p_feature_key text, p_value jsonb) FROM PUBLIC;
GRANT ALL ON FUNCTION public.set_plan_feature(p_plan_id uuid, p_feature_key text, p_value jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.set_plan_feature(p_plan_id uuid, p_feature_key text, p_value jsonb) TO service_role;


--
-- Name: FUNCTION set_updated_at(); Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON FUNCTION public.set_updated_at() TO anon;
GRANT ALL ON FUNCTION public.set_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.set_updated_at() TO service_role;


--
-- Name: FUNCTION set_user_blocked(target_user_id uuid, blocked boolean); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.set_user_blocked(target_user_id uuid, blocked boolean) FROM PUBLIC;
GRANT ALL ON FUNCTION public.set_user_blocked(target_user_id uuid, blocked boolean) TO authenticated;
GRANT ALL ON FUNCTION public.set_user_blocked(target_user_id uuid, blocked boolean) TO service_role;


--
-- Name: FUNCTION switch_demo_profile(p_profile_id uuid); Type: ACL; Schema: public; Owner: -
--

REVOKE ALL ON FUNCTION public.switch_demo_profile(p_profile_id uuid) FROM PUBLIC;
GRANT ALL ON FUNCTION public.switch_demo_profile(p_profile_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.switch_demo_profile(p_profile_id uuid) TO service_role;


--
-- Name: FUNCTION update_billing_infos_updated_at(); Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON FUNCTION public.update_billing_infos_updated_at() TO anon;
GRANT ALL ON FUNCTION public.update_billing_infos_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.update_billing_infos_updated_at() TO service_role;


--
-- Name: FUNCTION update_professional_infos_updated_at(); Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON FUNCTION public.update_professional_infos_updated_at() TO anon;
GRANT ALL ON FUNCTION public.update_professional_infos_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.update_professional_infos_updated_at() TO service_role;


--
-- Name: FUNCTION update_updated_at(); Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON FUNCTION public.update_updated_at() TO anon;
GRANT ALL ON FUNCTION public.update_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.update_updated_at() TO service_role;


--
-- Name: TABLE body_materials; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,MAINTAIN,UPDATE ON TABLE public.body_materials TO authenticated;
GRANT ALL ON TABLE public.body_materials TO service_role;


--
-- Name: TABLE body_parts; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,MAINTAIN,UPDATE ON TABLE public.body_parts TO authenticated;
GRANT ALL ON TABLE public.body_parts TO service_role;


--
-- Name: TABLE company_settings; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.company_settings TO authenticated;
GRANT ALL ON TABLE public.company_settings TO service_role;


--
-- Name: TABLE default_setting_price_body_part_coefficient; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.default_setting_price_body_part_coefficient TO authenticated;
GRANT ALL ON TABLE public.default_setting_price_body_part_coefficient TO service_role;


--
-- Name: TABLE default_setting_price_diameter_coefficient; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.default_setting_price_diameter_coefficient TO authenticated;
GRANT ALL ON TABLE public.default_setting_price_diameter_coefficient TO service_role;


--
-- Name: TABLE default_setting_price_general; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.default_setting_price_general TO authenticated;
GRANT ALL ON TABLE public.default_setting_price_general TO service_role;


--
-- Name: TABLE default_setting_price_impact_count_to_ut; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.default_setting_price_impact_count_to_ut TO authenticated;
GRANT ALL ON TABLE public.default_setting_price_impact_count_to_ut TO service_role;


--
-- Name: TABLE default_setting_price_technicity_coefficient; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.default_setting_price_technicity_coefficient TO authenticated;
GRANT ALL ON TABLE public.default_setting_price_technicity_coefficient TO service_role;


--
-- Name: TABLE demo_profile_context; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.demo_profile_context TO service_role;
GRANT SELECT ON TABLE public.demo_profile_context TO authenticated;


--
-- Name: TABLE demo_profiles; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.demo_profiles TO service_role;
GRANT SELECT ON TABLE public.demo_profiles TO authenticated;


--
-- Name: TABLE document_statuses; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,MAINTAIN,UPDATE ON TABLE public.document_statuses TO authenticated;
GRANT ALL ON TABLE public.document_statuses TO service_role;
GRANT SELECT ON TABLE public.document_statuses TO PUBLIC;


--
-- Name: TABLE features; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.features TO authenticated;
GRANT ALL ON TABLE public.features TO service_role;


--
-- Name: TABLE garage_members; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.garage_members TO authenticated;
GRANT ALL ON TABLE public.garage_members TO service_role;


--
-- Name: TABLE garages; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.garages TO authenticated;
GRANT ALL ON TABLE public.garages TO service_role;


--
-- Name: TABLE hail_alerts; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.hail_alerts TO authenticated;
GRANT ALL ON TABLE public.hail_alerts TO service_role;


--
-- Name: TABLE hail_departments; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.hail_departments TO authenticated;
GRANT ALL ON TABLE public.hail_departments TO service_role;


--
-- Name: TABLE invoice_details; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.invoice_details TO authenticated;
GRANT ALL ON TABLE public.invoice_details TO service_role;


--
-- Name: TABLE invoices; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.invoices TO authenticated;
GRANT ALL ON TABLE public.invoices TO service_role;


--
-- Name: TABLE monitored_locations; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.monitored_locations TO authenticated;
GRANT ALL ON TABLE public.monitored_locations TO service_role;


--
-- Name: TABLE organization_features; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.organization_features TO authenticated;
GRANT ALL ON TABLE public.organization_features TO service_role;


--
-- Name: TABLE plan_features; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.plan_features TO authenticated;
GRANT ALL ON TABLE public.plan_features TO service_role;


--
-- Name: TABLE subscription_plans; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.subscription_plans TO authenticated;
GRANT ALL ON TABLE public.subscription_plans TO service_role;


--
-- Name: TABLE subscriptions; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,MAINTAIN ON TABLE public.subscriptions TO authenticated;
GRANT ALL ON TABLE public.subscriptions TO service_role;


--
-- Name: TABLE organization_effective_features; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,MAINTAIN ON TABLE public.organization_effective_features TO authenticated;
GRANT ALL ON TABLE public.organization_effective_features TO service_role;


--
-- Name: TABLE organization_members; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,DELETE,MAINTAIN ON TABLE public.organization_members TO authenticated;
GRANT ALL ON TABLE public.organization_members TO service_role;


--
-- Name: COLUMN organization_members.role; Type: ACL; Schema: public; Owner: -
--

GRANT UPDATE(role) ON TABLE public.organization_members TO authenticated;


--
-- Name: COLUMN organization_members.percentage_commission; Type: ACL; Schema: public; Owner: -
--

GRANT UPDATE(percentage_commission) ON TABLE public.organization_members TO authenticated;


--
-- Name: COLUMN organization_members.status; Type: ACL; Schema: public; Owner: -
--

GRANT UPDATE(status) ON TABLE public.organization_members TO authenticated;


--
-- Name: TABLE organization_profiles; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.organization_profiles TO authenticated;
GRANT ALL ON TABLE public.organization_profiles TO service_role;


--
-- Name: TABLE organizations; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.organizations TO authenticated;
GRANT ALL ON TABLE public.organizations TO service_role;


--
-- Name: TABLE plan_change_log; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.plan_change_log TO service_role;


--
-- Name: TABLE profile_switch_log; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.profile_switch_log TO service_role;
GRANT SELECT ON TABLE public.profile_switch_log TO authenticated;


--
-- Name: SEQUENCE profile_switch_log_id_seq; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON SEQUENCE public.profile_switch_log_id_seq TO anon;
GRANT ALL ON SEQUENCE public.profile_switch_log_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.profile_switch_log_id_seq TO service_role;


--
-- Name: TABLE quote_details; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.quote_details TO authenticated;
GRANT ALL ON TABLE public.quote_details TO service_role;


--
-- Name: TABLE quotes; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.quotes TO authenticated;
GRANT ALL ON TABLE public.quotes TO service_role;


--
-- Name: TABLE repair_types; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,MAINTAIN,UPDATE ON TABLE public.repair_types TO authenticated;
GRANT ALL ON TABLE public.repair_types TO service_role;


--
-- Name: TABLE setting_price_body_part_coefficient; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.setting_price_body_part_coefficient TO authenticated;
GRANT ALL ON TABLE public.setting_price_body_part_coefficient TO service_role;


--
-- Name: TABLE setting_price_diameter_coefficient; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.setting_price_diameter_coefficient TO authenticated;
GRANT ALL ON TABLE public.setting_price_diameter_coefficient TO service_role;


--
-- Name: TABLE setting_price_general; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.setting_price_general TO authenticated;
GRANT ALL ON TABLE public.setting_price_general TO service_role;


--
-- Name: TABLE setting_price_impact_count_to_ut; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.setting_price_impact_count_to_ut TO authenticated;
GRANT ALL ON TABLE public.setting_price_impact_count_to_ut TO service_role;


--
-- Name: TABLE setting_price_technicity_coefficient; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.setting_price_technicity_coefficient TO authenticated;
GRANT ALL ON TABLE public.setting_price_technicity_coefficient TO service_role;


--
-- Name: TABLE user_profiles; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.user_profiles TO authenticated;
GRANT ALL ON TABLE public.user_profiles TO service_role;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,MAINTAIN ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;


--
-- Name: COLUMN users.email; Type: ACL; Schema: public; Owner: -
--

GRANT UPDATE(email) ON TABLE public.users TO authenticated;


--
-- Name: COLUMN users.full_name; Type: ACL; Schema: public; Owner: -
--

GRANT UPDATE(full_name) ON TABLE public.users TO authenticated;


--
-- Name: COLUMN users.phone; Type: ACL; Schema: public; Owner: -
--

GRANT UPDATE(phone) ON TABLE public.users TO authenticated;


--
-- Name: COLUMN users.first_name; Type: ACL; Schema: public; Owner: -
--

GRANT UPDATE(first_name) ON TABLE public.users TO authenticated;


--
-- Name: COLUMN users.last_name; Type: ACL; Schema: public; Owner: -
--

GRANT UPDATE(last_name) ON TABLE public.users TO authenticated;


--
-- Name: COLUMN users.profile_picture_url; Type: ACL; Schema: public; Owner: -
--

GRANT UPDATE(profile_picture_url) ON TABLE public.users TO authenticated;


--
-- Name: TABLE vehicles; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,DELETE,MAINTAIN,UPDATE ON TABLE public.vehicles TO authenticated;
GRANT ALL ON TABLE public.vehicles TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- PostgreSQL database dump complete
--


