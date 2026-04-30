import { SubscriptionDto } from '@/@application/dtos/SubscriptionDto';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { SubscriptionMapper } from '@/@infrastructure/mappers/SubscriptionMapper';
import { ISubscriptionRepository, SubscriptionInsertDto } from '@domain/repositories/ISubscriptionRepository';
import { IClientProvider } from '@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(
    @inject(SYMBOLS.Providers.ClientProvider)
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

  async createSubscription(data: SubscriptionInsertDto): Promise<void> {
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

    console.log('Subscription created successfully for organization:', data.organizationId);
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

  async getSubscriptionByOrganizationId(organizationId: string): Promise<SubscriptionDto> {
    console.log('Fetching subscription for organization ID:', organizationId);
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


    console.log('Raw subscription data for organization', organizationId, ':', data);
    const dto = SubscriptionMapper.apiToDto(data);
    console.log('Fetched subscription for organization', organizationId, ':', dto);
    return dto;
  }
}
