import { OrganizationMemberDtoModel } from "@application/dtos/OrganizationMemberDtoModel";

export interface IOrganizationMemberRepository {
  getMembersByOrganizationId(organizationId: string): Promise<OrganizationMemberDtoModel[]>;
  getByMemberId(userId: string): Promise<OrganizationMemberDtoModel[]>;
  create(member: OrganizationMemberDtoModel): Promise<OrganizationMemberDtoModel>;
}
