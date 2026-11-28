import type { IDemoProfileRepository } from '@/features/profileSwitcher/application/ports/repositories/IDemoProfileRepository';
import type { DemoProfileContextDto, DemoProfileDto, DemoProfileRole } from '@/features/profileSwitcher/application/dtos/DemoProfileDto';
import type { SupabaseClient } from '@/shared/infrastructure/supabase/SupabaseClient';
import type { IClientProvider } from '@/shared/infrastructure/supabase/IClientProvider';

export class DemoProfileRepository implements IDemoProfileRepository {
  constructor(private readonly clientProvider: IClientProvider<SupabaseClient>) {}

  async list(): Promise<DemoProfileDto[]> {
    const { data, error } = await this.clientProvider.getClient().rpc('list_demo_profiles');
    if (error) throw error;

    return (data ?? []).map(row => ({
      profileId: row.profile_id,
      organizationId: row.organization_id,
      organizationName: row.organization_name,
      planCode: row.plan_code,
      role: row.role as DemoProfileRole,
      label: row.label,
    }));
  }

  async getContext(): Promise<DemoProfileContextDto | null> {
    const { data, error } = await this.clientProvider.getClient().rpc('get_demo_profile_context');
    if (error) throw error;

    const row = data?.[0];
    if (!row) return null;

    return {
      profileId: row.profile_id,
      organizationId: row.organization_id,
      role: row.role as DemoProfileRole,
    };
  }

  async switchTo(profileId: string): Promise<void> {
    const { error } = await this.clientProvider.getClient().rpc('switch_demo_profile', { p_profile_id: profileId });
    if (error) throw error;
  }

  async clear(): Promise<void> {
    const { error } = await this.clientProvider.getClient().rpc('clear_demo_profile');
    if (error) throw error;
  }

  async create(organizationId: string, role: DemoProfileRole, label?: string): Promise<void> {
    const { error } = await this.clientProvider.getClient().rpc('create_demo_profile', {
      p_organization_id: organizationId,
      p_role: role,
      p_label: label,
    });
    if (error) throw error;
  }

  async delete(profileId: string): Promise<void> {
    const { error } = await this.clientProvider.getClient().rpc('delete_demo_profile', { p_profile_id: profileId });
    if (error) throw error;
  }
}
