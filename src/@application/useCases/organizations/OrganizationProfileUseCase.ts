import { inject, injectable } from 'inversify';

import { OrganizationProfileDto } from '@/@application/dtos/organizations/OrganizationProfileDto';

import { SYMBOLS } from '@/@infrastructure/ioc/symbols';

import { IOrganizationProfileRepository } from '@/@domain/repositories/organizations/IOrganizationProfileRepository';
import { IOrganizationProfileUseCase } from '@/@domain/useCases/organizations/IOrganizationProfileUseCase';


@injectable()
export class OrganizationProfileUseCase
  implements IOrganizationProfileUseCase
{
  constructor(
    @inject(
      SYMBOLS.Repositories
        .OrganizationProfileRepository
    )
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
    console.log('UseCase : Updating organization profile with DTO:', dto);
    return this.repository.update(dto);
  }
}