import { OrganizationMemberDto } from "@/features/organizations/application/dtos/OrganizationMemberDto";
import { CreateOrganizationTechnicianDto } from "@/features/technicians/application/dtos/CreateOrganizationTechnicianDto";
import { IOrganizationMemberRepository } from "@/features/organizations/application/ports/repositories/IOrganizationMemberRepository";

export interface ICreateOrganizationTechnicianUseCase {
  execute(technician: CreateOrganizationTechnicianDto): Promise<OrganizationMemberDto>;
}

/**
 * Invitation is handled atomically server-side by the create-organization-technician
 * Edge Function (caller authorization, account + membership creation, compensation
 * on failure, invitation email).
 */
export class CreateOrganizationTechnicianUseCase implements ICreateOrganizationTechnicianUseCase {
  constructor(
    private readonly organizationMemberRepository: IOrganizationMemberRepository
  ) {}

  async execute(dto: CreateOrganizationTechnicianDto): Promise<OrganizationMemberDto> {
    return this.organizationMemberRepository.createOrganizationTechnician(dto);
  }
}
