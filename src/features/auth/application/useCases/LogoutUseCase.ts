import { IAuthService } from '@/features/auth/application/ports/services/IAuthService';

export interface ILogoutUseCase {
    execute(): Promise<void>;
  }

export class LogoutUseCase implements ILogoutUseCase {
  constructor(
    private authService: IAuthService
  ) {}

  async execute(): Promise<void> {
    await this.authService.logout();
  }
}
