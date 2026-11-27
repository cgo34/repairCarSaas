import type { IPlatformOrganizationRepository } from '@/features/platformAdmin/application/ports/repositories/IPlatformOrganizationRepository';
import type { PlatformOrganizationDto } from '@/features/platformAdmin/application/dtos/PlatformOrganizationDto';
import type { FeatureGrantDuration } from '@/features/platformAdmin/application/dtos/FeatureGrant';
import type { PremiumGrantDuration } from '@/features/platformAdmin/application/dtos/PremiumGrantDuration';
import type { SupabaseClient } from '@/shared/infrastructure/supabase/SupabaseClient';
import type { IClientProvider } from '@/shared/infrastructure/supabase/IClientProvider';

export class PlatformOrganizationRepository implements IPlatformOrganizationRepository {
  constructor(private readonly clientProvider: IClientProvider<SupabaseClient>) {}

  async list(): Promise<PlatformOrganizationDto[]> {
    const { data, error } = await this.clientProvider.getClient().rpc('list_platform_organizations');
    if (error) throw error;

    return (data ?? []).map((row): PlatformOrganizationDto => ({
      id: row.id,
      name: row.name,
      createdAt: row.created_at,
      planCode: row.plan_code,
      subscriptionStatus: row.subscription_status,
      membersCount: Number(row.members_count),
      garagesCount: Number(row.garages_count),
      quotesCount: Number(row.quotes_count),
      invoicesCount: Number(row.invoices_count),
      isDemo: row.is_demo,
      membersLimit: row.members_limit,
      garagesLimit: row.garages_limit,
      quotesLimit: row.quotes_limit,
      invoicesLimit: row.invoices_limit,
      quotesMonthCount: Number(row.quotes_month_count),
      invoicesMonthCount: Number(row.invoices_month_count),
    }));
  }

  async grantPremium(organizationId: string, duration: PremiumGrantDuration): Promise<void> {
    const { error } = await this.clientProvider.getClient().rpc('grant_premium', {
      p_organization_id: organizationId,
      p_duration: duration,
    });
    if (error) throw error;
  }

  async setDemo(organizationId: string, isDemo: boolean): Promise<void> {
    const { error } = await this.clientProvider.getClient().rpc('set_organization_demo', {
      p_organization_id: organizationId,
      p_is_demo: isDemo,
    });
    if (error) throw error;
  }

  async grantFeature(organizationId: string, featureKey: string, duration: FeatureGrantDuration): Promise<void> {
    const { error } = await this.clientProvider.getClient().rpc('grant_feature', {
      p_organization_id: organizationId,
      p_feature_key: featureKey,
      p_duration: duration,
    });
    if (error) throw error;
  }
}
