import { OrganizationProfileDto } from '@/@application/dtos/organizations/OrganizationProfileDto';

export interface IOrganizationProfileUseCase {
  getProfile(
    organizationId: string
  ): Promise<OrganizationProfileDto | null>;

  updateProfile(
    dto: OrganizationProfileDto
  ): Promise<OrganizationProfileDto>;
}