
import { OrganizationProfileDto } from '@/features/organizations/application/dtos/OrganizationProfileDto';

import { IOrganizationProfileRepository } from '@/features/organizations/application/ports/repositories/IOrganizationProfileRepository';

export interface IOrganizationProfileUseCase {
  getProfile(
    organizationId: string
  ): Promise<OrganizationProfileDto | null>;

  updateProfile(
    dto: OrganizationProfileDto
  ): Promise<OrganizationProfileDto>;
}

export class OrganizationProfileUseCase
  implements IOrganizationProfileUseCase
{
  constructor(
    private readonly repository: IOrganizationProfileRepository
  ) {}

  async getProfile(
    organizationId: string
  ): Promise<OrganizationProfileDto | null> {
    return this.repository.getByOrganizationId(
      organizationId
    );
  }

  async updateProfile(
    dto: OrganizationProfileDto
  ): Promise<OrganizationProfileDto> {
    return this.repository.update(dto);
  }
}
