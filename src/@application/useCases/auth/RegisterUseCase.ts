import { IAuthService } from '@/@domain/services/IAuthService';
import { IRegisterUseCase } from '@/@domain/useCases/auth/IRegisterUseCase';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { AuthResponse } from '@supabase/supabase-js';
import { inject, injectable } from 'inversify';

@injectable()
export class RegisterUseCase implements IRegisterUseCase {
  constructor(
    @inject(SYMBOLS.Services.AuthService) private authService: IAuthService
  ) {
    if (!authService) {
      throw new Error('AuthService injection failed in LoginUseCase');
    }
  }

  async execute(email: string, password: string, fullName: string): Promise<AuthResponse> {
    return await this.authService.register(email, password, fullName);
  }
}
