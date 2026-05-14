import { OrganizationProfileDto } from '@/@application/dtos/organizations/OrganizationProfileDto';

export interface IOrganizationProfileRepository {
  getByOrganizationId(
    organizationId: string
  ): Promise<OrganizationProfileDto | null>;

  update(
    dto: OrganizationProfileDto
  ): Promise<OrganizationProfileDto>;
}