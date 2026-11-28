import { SubscriptionDto } from '@/features/subscription/application/dtos/SubscriptionDto';
import { SupabaseClient } from '@/shared/infrastructure/supabase/SupabaseClient';
import { SubscriptionMapper } from '@/features/subscription/infrastructure/mappers/SubscriptionMapper';
import { ISubscriptionRepository } from '@/features/subscription/application/ports/repositories/ISubscriptionRepository';
import { CreateSubscriptionDto } from '@/features/subscription/application/dtos/CreateSubscriptionDto';
import { IClientProvider } from '@/shared/infrastructure/supabase/IClientProvider';

export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(
    private readonly clientProvider: IClientProvider<SupabaseClient>
  ) {}

  async getPlanByCode(code: string) {
    const { data, error } = await this.clientProvider.getClient()
      .from('subscription_plans')
      .select('id')
      .eq('code', code)
      .limit(1)
      .single()

    if (error) {
      console.error('[SubscriptionRepo] getPlanByCode error:', error)
      return null
    }

    return data
  }

  async createSubscription(data: CreateSubscriptionDto): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .from('subscriptions')
      .insert({
        organization_id: data.organizationId,
        plan_id: data.planId,
        status: data.status,
        start_date: data.startDate.toISOString()
      });

    if (error) {
      console.error('[SubscriptionRepo] createSubscription error:', error);
      throw error;
    }
  }

  async getSubscriptionByUserId(userId: string): Promise<SubscriptionDto> {
    const { data, error } = await this.clientProvider.getClient()
      .from('subscriptions')
      .select(`
        *,
        subscriptionPlan:subscription_plans(*)
        `)
      .eq('user_id', userId)
      .limit(1)
      .single()

    if (error) {
      console.error('[SubscriptionRepo] getPlanByName error:', error)
      throw error
    }

    const features = await this.getEffectiveFeatures(data.organization_id);
    return SubscriptionMapper.apiToDto(data, features)
  }

  async getSubscriptionByOrganizationId(organizationId: string): Promise<SubscriptionDto | null> {
    const { data, error } = await this.clientProvider.getClient()
      .from('subscriptions')
      .select(`
        *,
        subscriptionPlan:subscription_plans(*)
        `)
      .eq('organization_id', organizationId)
      .maybeSingle()

    if (error) {
      console.error('[SubscriptionRepo] getPlanByName error:', error)
      throw error
    }

    if (!data) return null;

    const features = await this.getEffectiveFeatures(organizationId);
    return SubscriptionMapper.apiToDto(data, features);
  }

  private async getEffectiveFeatures(
    organizationId: string,
  ): Promise<Record<string, number | boolean | null>> {
    const { data, error } = await this.clientProvider.getClient()
      .fromView('organization_effective_features')
      .select('feature_key, value')
      .eq('organization_id', organizationId);

    if (error) {
      console.error('[SubscriptionRepo] getEffectiveFeatures error:', error);
      return {};
    }

    const features: Record<string, number | boolean | null> = {};
    for (const row of data ?? []) {
      if (row.feature_key) features[row.feature_key] = row.value as number | boolean | null;
    }
    return features;
  }
}
