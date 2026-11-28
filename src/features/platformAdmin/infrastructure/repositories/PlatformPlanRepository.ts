import type { IPlatformPlanRepository } from '@/features/platformAdmin/application/ports/repositories/IPlatformPlanRepository';
import type {
  PlanChangeDto,
  PlanChangeImpactDto,
  PlanChangeLogDto,
  PlanFeatureValue,
  PlatformPlanDto,
} from '@/features/platformAdmin/application/dtos/PlatformPlanDto';
import type { SupabaseClient } from '@/shared/infrastructure/supabase/SupabaseClient';
import type { IClientProvider } from '@/shared/infrastructure/supabase/IClientProvider';

const toPayload = (changes: PlanChangeDto[]) =>
  changes.map(c => ({ plan_id: c.planId, feature_key: c.featureKey, value: c.value }));

export class PlatformPlanRepository implements IPlatformPlanRepository {
  constructor(private readonly clientProvider: IClientProvider<SupabaseClient>) {}

  async list(): Promise<PlatformPlanDto[]> {
    const { data, error } = await this.clientProvider.getClient().rpc('list_platform_plans');
    if (error) throw error;

    const plans = new Map<string, PlatformPlanDto>();
    for (const row of data ?? []) {
      let plan = plans.get(row.plan_id);
      if (!plan) {
        plan = {
          id: row.plan_id,
          code: row.plan_code,
          name: row.plan_name,
          priceCents: Number(row.price_cents),
          orgsCount: Number(row.orgs_count),
          features: [],
        };
        plans.set(row.plan_id, plan);
      }
      const type = row.feature_type === 'boolean' ? 'boolean' : 'limit';
      const raw = row.has_value ? (row.value as PlanFeatureValue) : (type === 'boolean' ? false : 0);
      plan.features.push({
        key: row.feature_key,
        type,
        name: row.feature_name,
        description: row.feature_description,
        isAddon: row.is_addon,
        value: raw,
      });
    }
    return [...plans.values()];
  }

  async previewChanges(changes: PlanChangeDto[]): Promise<PlanChangeImpactDto[]> {
    const { data, error } = await this.clientProvider.getClient().rpc('preview_plan_changes', {
      p_changes: toPayload(changes),
    });
    if (error) throw error;
    return (data ?? []).map(row => ({
      planId: row.plan_id,
      planCode: row.plan_code,
      featureKey: row.feature_key,
      featureName: row.feature_name,
      type: row.feature_type === 'boolean' ? 'boolean' : 'limit',
      oldValue: row.old_value as PlanFeatureValue,
      newValue: row.new_value as PlanFeatureValue,
      orgsOnPlan: Number(row.orgs_on_plan),
      orgsAffected: Number(row.orgs_affected),
      isRisky: row.is_risky,
    }));
  }

  async applyChanges(changes: PlanChangeDto[]): Promise<number> {
    const { data, error } = await this.clientProvider.getClient().rpc('apply_plan_changes', {
      p_changes: toPayload(changes),
    });
    if (error) throw error;
    return Number(data ?? 0);
  }

  async listChangeLog(limit = 50): Promise<PlanChangeLogDto[]> {
    const { data, error } = await this.clientProvider.getClient().rpc('list_plan_change_log', { p_limit: limit });
    if (error) throw error;
    return (data ?? []).map(row => ({
      id: row.id,
      changedAt: row.changed_at,
      changedBy: row.changed_by,
      planCode: row.plan_code,
      featureKey: row.feature_key,
      featureName: row.feature_name ?? row.feature_key,
      oldValue: row.old_value as PlanFeatureValue,
      newValue: row.new_value as PlanFeatureValue,
      orgsOnPlan: Number(row.orgs_on_plan),
      orgsAffected: Number(row.orgs_affected),
    }));
  }
}
