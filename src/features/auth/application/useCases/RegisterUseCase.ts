import { IAuthService } from '@/features/auth/application/ports/services/IAuthService';
import { UserDto } from '@/features/users/application/dtos/UserDto';

export interface IRegisterUseCase {
  execute(email: string, password: string, fullName: string): Promise<{ user: UserDto | null, error: Error | null }>;
}

export class RegisterUseCase implements IRegisterUseCase {
  constructor(
    private authService: IAuthService
  ) {
    if (!authService) {
      throw new Error('AuthService injection failed in LoginUseCase');
    }
  }

  async execute(email: string, password: string, fullName: string): Promise<{ user: UserDto | null, error: Error | null }> {
    return await this.authService.register(email, password, fullName);
  }
}
