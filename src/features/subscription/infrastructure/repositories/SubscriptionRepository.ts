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

    return SubscriptionMapper.apiToDto(data)
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

    const dto = SubscriptionMapper.apiToDto(data);
    return dto;
  }
}
