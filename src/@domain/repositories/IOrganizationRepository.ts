import { OrganizationMemberApiModel } from "@/@infrastructure/database/api/OrganizationMemberApiModel";
import { OrganizationDtoModel } from "@application/dtos/OrganizationDtoModel";

export interface IOrganizationRepository {
  create(organization: OrganizationDtoModel): Promise<OrganizationDtoModel>;
  getMembersByOrganizationId(organizationId: string): Promise<OrganizationMemberApiModel[]>;
}
