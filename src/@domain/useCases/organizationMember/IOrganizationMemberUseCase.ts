import { OrganizationMemberDto } from '@/@application/dtos/organizations/OrganizationMemberDto';

export interface IOrganizationMemberUseCase {
  getByMemberId(userId: string): Promise<OrganizationMemberDto[]>;
  getMembersByOrganizationId(organizationId: string): Promise<OrganizationMemberDto[]>;
  archiveMember(memberId: string): Promise<void>;
  updateMember(memberId: string, data: Partial<Pick<OrganizationMemberDto, 'role' | 'percentage_commission' | 'status'>> & { first_name?: string; last_name?: string; email?: string }): Promise<OrganizationMemberDto>;
}
