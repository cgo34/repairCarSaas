import { OrganizationMemberDto } from "@/@application/dtos/organizations/OrganizationMemberDto";
import { CreateOrganizationTechnicianDto } from "@/@application/dtos/organizations/CreateOrganizationTechnicianDto";
import { IAuthRepository } from "@/@domain/repositories/IAuthRepository";
import { IOrganizationMemberRepository } from "@/@domain/repositories/IOrganizationMemberRepository";
import { IUserRepository } from "@/@domain/repositories/IUserRepository";
import { SYMBOLS } from "@/@infrastructure/ioc/symbols";
import { inject, injectable } from "inversify";

@injectable()
export class CreateOrganizationTechnicianUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.AuthRepository)
    private readonly authRepository: IAuthRepository,

    @inject(SYMBOLS.Repositories.UserRepository)
    private readonly userRepository: IUserRepository,

    @inject(SYMBOLS.Repositories.OrganizationMemberRepository)
    private readonly organizationMemberRepository: IOrganizationMemberRepository
  ) {}

  async execute(
    dto: CreateOrganizationTechnicianDto
  ): Promise<OrganizationMemberDto> {
    let memberCreated: OrganizationMemberDto | null = null;

    console.log('Executing CreateOrganizationTechnicianUseCase with DTO:', dto);

    try {
      // ─────────────────────────────────────
      // 1. Create auth user
      // ─────────────────────────────────────

      memberCreated = await this.organizationMemberRepository.createOrganizationTechnician(
        dto
      );

      console.log('Organization member created:', memberCreated);

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