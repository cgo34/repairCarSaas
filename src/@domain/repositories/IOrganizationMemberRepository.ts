import { OrganizationMemberDtoModel } from "@application/dtos/OrganizationMemberDtoModel";

export interface IOrganizationMemberRepository {
  create(member: OrganizationMemberDtoModel): Promise<OrganizationMemberDtoModel>;
}
