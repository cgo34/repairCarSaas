import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
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

  async getPlanByName(name: 'free' | 'silver' | 'gold') {
    const { data, error } = await this.clientProvider.getClient()
      .from('subscription_plans')
      .select('id')
      .eq('name', name)
      .limit(1)
      .single()

    if (error) {
      console.error('[SubscriptionRepo] getPlanByName error:', error)
      return null
    }

    return data
  }

  async createSubscription(data: SubscriptionInsertDto): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .from('subscriptions')
      .insert({
        user_id: data.userId,
        plan_id: data.planId,
        status: data.status,
        start_date: data.startDate.toISOString()
      })

    if (error) {
      console.error('[SubscriptionRepo] createSubscription error:', error)
      throw error
    }
  }
}
