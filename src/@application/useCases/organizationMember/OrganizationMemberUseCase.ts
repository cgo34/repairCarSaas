import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';
import { IOrganizationMemberUseCase } from '@/@domain/useCases/organizationMember/IOrganizationMemberUseCase';
import { OrganizationMemberDtoModel } from '@/@application/dtos/OrganizationMemberDtoModel';
import { IOrganizationMemberRepository } from '@/@domain/repositories/IOrganizationMemberRepository';

@injectable()
export class OrganizationMemberUseCase implements IOrganizationMemberUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.OrganizationMemberRepository)
    private readonly organizationMemberRepository: IOrganizationMemberRepository
  ) {}

  async getMembersByOrganizationId(organizationId: string): Promise<OrganizationMemberDtoModel[]> {
    return this.organizationMemberRepository.getMembersByOrganizationId(organizationId);
  }

  async getByMemberId(userId: string): Promise<OrganizationMemberDtoModel[]> {
    return this.organizationMemberRepository.getByMemberId(userId);
  }
}
