
import { OrganizationProfileDto } from '@/features/organizations/application/dtos/OrganizationProfileDto';

import { IOrganizationProfileRepository } from '@/features/organizations/application/ports/repositories/IOrganizationProfileRepository';

import { OrganizationProfileApiModel } from '@/features/organizations/infrastructure/api/OrganizationProfileApiModel';

import { SupabaseClient } from '@/shared/infrastructure/supabase/SupabaseClient';

import { IClientProvider } from '@/shared/infrastructure/supabase/IClientProvider';


import { OrganizationProfileMapper } from '@/features/organizations/infrastructure/mappers/OrganizationProfileMapper';

export class OrganizationProfileRepository
  implements IOrganizationProfileRepository
{
  constructor(
    private readonly clientProvider:
      IClientProvider<SupabaseClient>
  ) {}

  /**
   * ============================================================
   * GET PROFILE
   * ============================================================
   */

  async getByOrganizationId(
    organizationId: string
  ): Promise<OrganizationProfileDto | null> {
    const { data, error } =
      await this.clientProvider
        .getClient()
        .from('organization_profiles')
        .select('*')
        .eq('organization_id', organizationId)
        .maybeSingle<OrganizationProfileApiModel>();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return OrganizationProfileMapper.apiToDto(
      data
    );
  }

  /**
   * ============================================================
   * UPDATE PROFILE
   * ============================================================
   */

  async update(
    dto: OrganizationProfileDto
  ): Promise<OrganizationProfileDto> {
    const apiModel =
      OrganizationProfileMapper.dtoToApi(dto);

    const { data, error } =
      await this.clientProvider
        .getClient()
        .from('organization_profiles')
        .upsert(apiModel)
        .select('*')
        .single<OrganizationProfileApiModel>();

    if (error) {
      throw error;
    }

    return OrganizationProfileMapper.apiToDto(
      data
    );
  }
}