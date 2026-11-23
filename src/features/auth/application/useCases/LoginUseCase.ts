import { IAuthService } from '@/features/auth/application/ports/services/IAuthService';
import { UserDto } from '@/features/users/application/dtos/UserDto';

export interface ILoginUseCase {
    execute(email: string, password: string): Promise<UserDto>;
  }

export class LoginUseCase implements ILoginUseCase {
  constructor(
    private authService: IAuthService
  ) {    
    if (!authService) {
      throw new Error('AuthService injection failed in LoginUseCase');
    }
  }

  async execute(email: string, password: string): Promise<UserDto> {
    return await this.authService.login(email, password);
  }
}

