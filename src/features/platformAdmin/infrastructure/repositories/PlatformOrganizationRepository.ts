import type { IPlatformOrganizationRepository } from '@/features/platformAdmin/application/ports/repositories/IPlatformOrganizationRepository';
import type { PlatformOrganizationDto } from '@/features/platformAdmin/application/dtos/PlatformOrganizationDto';
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
    }));
  }
}
