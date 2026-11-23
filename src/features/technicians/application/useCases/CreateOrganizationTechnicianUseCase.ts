

import { OrganizationMemberDto } from "@/features/organizations/application/dtos/OrganizationMemberDto";
import { CreateOrganizationTechnicianDto } from "@/features/technicians/application/dtos/CreateOrganizationTechnicianDto";
import { IAuthRepository } from "@/features/auth/application/ports/repositories/IAuthRepository";
import { IOrganizationMemberRepository } from "@/features/organizations/application/ports/repositories/IOrganizationMemberRepository";
import { IUserRepository } from "@/features/users/application/ports/repositories/IUserRepository";

export interface ICreateOrganizationTechnicianUseCase {
  execute(technician: CreateOrganizationTechnicianDto): Promise<OrganizationMemberDto>;
}

export class CreateOrganizationTechnicianUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,

    private readonly userRepository: IUserRepository,

    private readonly organizationMemberRepository: IOrganizationMemberRepository
  ) {}

  async execute(
    dto: CreateOrganizationTechnicianDto
  ): Promise<OrganizationMemberDto> {
    let memberCreated: OrganizationMemberDto | null = null;

    try {
      // ─────────────────────────────────────
      // 1. Create auth user
      // ─────────────────────────────────────

      memberCreated = await this.organizationMemberRepository.createOrganizationTechnician(
        dto
      );

      return memberCreated;

      // ─────────────────────────────────────
      // 2. Create public.users
      // ─────────────────────────────────────

      // await this.userRepository.createUser({
      //   id: authUserId ?? '',
      //   first_name: dto.first_name,
      //   last_name: dto.last_name,
      //   email: dto.email,
      //   percentage_commission: dto.percentage_commission
      // });

      // ─────────────────────────────────────
      // 3. Create organization member
      // ─────────────────────────────────────

      // await this.organizationMemberRepository.create({
      //   user_id: authUserId,
      //   organization_id: dto.organization_id,
      //   role: dto.role
      // });

      // ─────────────────────────────────────
      // 4. Send invitation email
      // ─────────────────────────────────────

      // await this.authRepository.sendResetPasswordEmail(
      //   dto.email
      // );

    } catch (error) {

      // rollback auth user
      if (memberCreated) {
        await this.authRepository.deleteUser(memberCreated.user_id);
      }

      throw error;
    }
  }
}
