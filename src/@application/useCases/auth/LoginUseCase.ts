import { IAuthService } from '@domain/services/IAuthService';
import { ILoginUseCase } from '@domain/useCases/auth/ILoginUseCase';
import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class LoginUseCase implements ILoginUseCase {
  constructor(
    @inject(SYMBOLS.Services.AuthService) private authService: IAuthService
  ) {    
    if (!authService) {
      throw new Error('AuthService injection failed in LoginUseCase');
    }
  }

  async execute(email: string, password: string): Promise<any> {
    return await this.authService.login(email, password);
  }
}

