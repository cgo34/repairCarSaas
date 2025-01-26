import { IAuthService } from '@domain/services/IAuthService';
import { ILogoutUseCase } from '@domain/useCases/auth/ILogoutUseCase';
import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class LogoutUseCase implements ILogoutUseCase {
  constructor(
    @inject(SYMBOLS.Services.AuthService) private authService: IAuthService
  ) {}

  async execute(): Promise<void> {
    console.log('[LogoutUseCase] Executing logout');
    await this.authService.logout();
  }
}
