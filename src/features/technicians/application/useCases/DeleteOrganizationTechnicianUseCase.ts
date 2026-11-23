import { IAuthRepository } from "@/features/auth/application/ports/repositories/IAuthRepository";

export interface IDeleteOrganizationTechnicianUseCase {
  execute(userId: string): Promise<void>;
}

export class DeleteOrganizationTechnicianUseCase implements IDeleteOrganizationTechnicianUseCase {
  constructor(
    private readonly authRepository: IAuthRepository
  ) {}

  async execute(userId: string): Promise<void> {
    await this.authRepository.deleteUser(userId);
  }
    
}