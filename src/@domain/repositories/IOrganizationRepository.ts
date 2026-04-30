import { OrganizationDtoModel } from "@application/dtos/OrganizationDtoModel";

export interface IOrganizationRepository {
  create(organization: OrganizationDtoModel): Promise<OrganizationDtoModel>;
}
