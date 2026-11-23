import { OrganizationProfileDto } from '@/features/organizations/application/dtos/OrganizationProfileDto';

export interface IOrganizationProfileRepository {
  getByOrganizationId(
    organizationId: string
  ): Promise<OrganizationProfileDto | null>;

  update(
    dto: OrganizationProfileDto
  ): Promise<OrganizationProfileDto>;
}