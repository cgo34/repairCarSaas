import { OrganizationDtoModel } from "@/features/organizations/application/dtos/OrganizationDtoModel";

export interface IOrganizationRepository {
  getById(id: string): Promise<OrganizationDtoModel | null>;
  create(organization: OrganizationDtoModel): Promise<OrganizationDtoModel>;
}
