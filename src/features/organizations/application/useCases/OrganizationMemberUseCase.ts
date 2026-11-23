import { OrganizationMemberDto } from '@/features/organizations/application/dtos/OrganizationMemberDto';
import { IOrganizationMemberRepository } from '@/features/organizations/application/ports/repositories/IOrganizationMemberRepository';

export interface IOrganizationMemberUseCase {
  getByMemberId(userId: string): Promise<OrganizationMemberDto[]>;
  getMembersByOrganizationId(organizationId: string): Promise<OrganizationMemberDto[]>;
  archiveMember(memberId: string): Promise<void>;
  updateMember(memberId: string, data: Partial<Pick<OrganizationMemberDto, 'role' | 'percentage_commission' | 'status'>> & { first_name?: string; last_name?: string; email?: string }): Promise<OrganizationMemberDto>;
}

export class OrganizationMemberUseCase implements IOrganizationMemberUseCase {
  constructor(
    private readonly organizationMemberRepository: IOrganizationMemberRepository
  ) {}

  async getMembersByOrganizationId(organizationId: string): Promise<OrganizationMemberDto[]> {
    return this.organizationMemberRepository.getMembersByOrganizationId(organizationId);
  }

  async getByMemberId(userId: string): Promise<OrganizationMemberDto[]> {
    return this.organizationMemberRepository.getByMemberId(userId);
  }  

  async archiveMember(memberId: string): Promise<void> {
    return await this.organizationMemberRepository.archiveMember(memberId);
  }

  async updateMember(memberId: string, data: Partial<Pick<OrganizationMemberDto, 'role' | 'percentage_commission' | 'status'>> & { first_name?: string; last_name?: string; email?: string }): Promise<OrganizationMemberDto> {
    return await this.organizationMemberRepository.updateMember(memberId, data);
  }
}
