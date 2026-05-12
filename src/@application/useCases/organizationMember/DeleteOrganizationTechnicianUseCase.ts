import { IAuthRepository } from "@/@domain/repositories/IAuthRepository";
import { SYMBOLS } from "@/@infrastructure/ioc/symbols";
import { inject, injectable } from "inversify";

@injectable()
export class DeleteOrganizationTechnicianUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.AuthRepository)
    private readonly authRepository: IAuthRepository
  ) {}

  async execute(userId: string): Promise<void> {
    await this.authRepository.deleteUser(userId);
  }
    
}