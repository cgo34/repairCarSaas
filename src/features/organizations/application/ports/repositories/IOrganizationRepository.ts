import { OrganizationDtoModel } from "@/features/organizations/application/dtos/OrganizationDtoModel";

export interface IOrganizationRepository {
  getById(id: string): Promise<OrganizationDtoModel | null>;
  create(organization: OrganizationDtoModel): Promise<OrganizationDtoModel>;
  /** Server-side atomic provisioning (organization + admin member + Free plan) for the authenticated user. */
  provision(name: string): Promise<string>;
}
