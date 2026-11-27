import type { IPlatformStatsRepository } from '@/features/platformAdmin/application/ports/repositories/IPlatformStatsRepository';
import type { PlatformStatsDto, RecentOrganizationDto } from '@/features/platformAdmin/application/dtos/PlatformStatsDto';
import type { SupabaseClient } from '@/shared/infrastructure/supabase/SupabaseClient';
import type { IClientProvider } from '@/shared/infrastructure/supabase/IClientProvider';

interface RecentOrganizationRow {
  id: string;
  name: string;
  plan: string | null;
  created_at: string | null;
  members_count: number;
  garages_count: number;
  is_demo?: boolean;
}

export class PlatformStatsRepository implements IPlatformStatsRepository {
  constructor(private readonly clientProvider: IClientProvider<SupabaseClient>) {}

  async getStats(): Promise<PlatformStatsDto> {
    const { data, error } = await this.clientProvider.getClient().rpc('get_platform_stats');
    if (error) throw error;

    const row = data?.[0];
    if (!row) throw new Error('Platform stats unavailable');

    const recent = (row.recent_organizations as unknown as RecentOrganizationRow[] | null) ?? [];

    return {
      organizationsTotal: Number(row.organizations_total),
      freeOrganizations: Number(row.free_organizations),
      premiumOrganizations: Number(row.premium_organizations),
      newOrganizations30d: Number(row.new_organizations_30d),
      usersTotal: Number(row.users_total),
      newUsers30d: Number(row.new_users_30d),
      blockedUsers: Number(row.blocked_users),
      mrrCents: Number(row.mrr_cents),
      quotesTotal: Number(row.quotes_total),
      invoicesTotal: Number(row.invoices_total),
      signups6m: ((row.signups_6m as unknown as { month: string; count: number }[] | null) ?? []).map((s) => ({
        month: s.month,
        count: Number(s.count),
      })),
      nearQuotaOrganizations: Number(row.near_quota_organizations),
      expiringSubscriptions: Number(row.expiring_subscriptions),
      recentOrganizations: recent.map((o): RecentOrganizationDto => ({
        id: o.id,
        name: o.name,
        plan: o.plan,
        createdAt: o.created_at,
        membersCount: Number(o.members_count),
        garagesCount: Number(o.garages_count),
        isDemo: o.is_demo ?? false,
      })),
    };
  }
}
