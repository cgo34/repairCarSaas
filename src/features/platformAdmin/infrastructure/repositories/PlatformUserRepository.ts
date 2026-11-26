import type { IPlatformUserRepository } from '@/features/platformAdmin/application/ports/repositories/IPlatformUserRepository';
import type { PlatformUserDto } from '@/features/platformAdmin/application/dtos/PlatformUserDto';
import type { SupabaseClient } from '@/shared/infrastructure/supabase/SupabaseClient';
import type { IClientProvider } from '@/shared/infrastructure/supabase/IClientProvider';

export class PlatformUserRepository implements IPlatformUserRepository {
  constructor(private readonly clientProvider: IClientProvider<SupabaseClient>) {}

  async list(): Promise<PlatformUserDto[]> {
    const { data, error } = await this.clientProvider.getClient().rpc('list_platform_users');
    if (error) throw error;

    return (data ?? []).map((row): PlatformUserDto => ({
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      isBlocked: row.is_blocked,
      role: row.role,
      organizationName: row.organization_name,
      organizationsCount: Number(row.organizations_count),
      createdAt: row.created_at,
    }));
  }
}
