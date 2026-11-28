-- =============================================================================
-- 20260701_13_drop_legacy_seat_columns.sql
-- Seats are now driven by plan_features / organization_features
-- (view organization_effective_features). The legacy columns of
-- public.subscriptions are obsolete. DESTRUCTIVE: apply only after
-- 20260701_09 (alerts rewritten on the effective limit) has been applied.
-- =============================================================================

alter table public.subscriptions drop column if exists max_seats;
alter table public.subscriptions drop column if exists included_seats;
alter table public.subscriptions drop column if exists extra_seats;
alter table public.subscriptions drop column if exists extra_seat_price;
