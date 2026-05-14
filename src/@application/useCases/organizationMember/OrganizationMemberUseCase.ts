import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';
import { IOrganizationMemberUseCase } from '@/@domain/useCases/organizationMember/IOrganizationMemberUseCase';
import { OrganizationMemberDto } from '@/@application/dtos/organizations/OrganizationMemberDto';
import { IOrganizationMemberRepository } from '@/@domain/repositories/IOrganizationMemberRepository';

@injectable()
export class OrganizationMemberUseCase implements IOrganizationMemberUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.OrganizationMemberRepository)
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
}
