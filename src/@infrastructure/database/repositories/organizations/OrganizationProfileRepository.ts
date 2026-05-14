import { inject, injectable } from 'inversify';

import { OrganizationProfileDto } from '@/@application/dtos/organizations/OrganizationProfileDto';

import { IOrganizationProfileRepository } from '@/@domain/repositories/organizations/IOrganizationProfileRepository';

import { OrganizationProfileApiModel } from '@/@infrastructure/database/api/organizations/OrganizationProfileApiModel';

import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';

import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';

import { SYMBOLS } from '@/@infrastructure/ioc/symbols';

import { OrganizationProfileMapper } from '@/@infrastructure/mappers/organizations/OrganizationProfileMapper';

@injectable()
export class OrganizationProfileRepository
  implements IOrganizationProfileRepository
{
  constructor(
    @inject(SYMBOLS.Providers.ClientProvider)
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
    console.log('Updating organization profile with DTO:', dto);
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