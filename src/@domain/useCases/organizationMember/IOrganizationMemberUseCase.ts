import { OrganizationMemberDto } from '@/@application/dtos/organizations/OrganizationMemberDto';

export interface IOrganizationMemberUseCase {
  getByMemberId(userId: string): Promise<OrganizationMemberDto[]>;
  getMembersByOrganizationId(organizationId: string): Promise<OrganizationMemberDto[]>;
  archiveMember(memberId: string): Promise<void>;
}
