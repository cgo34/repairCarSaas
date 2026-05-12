import { OrganizationMemberDtoModel } from '@/@application/dtos/OrganizationMemberDtoModel';

export interface IOrganizationMemberUseCase {
  getByMemberId(userId: string): Promise<OrganizationMemberDtoModel[]>;
  getMembersByOrganizationId(organizationId: string): Promise<OrganizationMemberDtoModel[]>;
}
