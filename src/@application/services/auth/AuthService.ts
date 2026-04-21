import { UserDto } from '@/@application/dtos/UserDto';
import { IAuthRepository } from '@domain/repositories/IAuthRepository';
import { IAuthService } from '@domain/services/IAuthService';
import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { AuthResponse } from '@supabase/supabase-js';
import { inject, injectable } from 'inversify';

@injectable()
export class AuthService implements IAuthService {
  constructor(@inject(SYMBOLS.Repositories.AuthRepository) private authRepository: IAuthRepository) {
  }

  // Type guard pour vérifier si c'est bien un User
  private isUser(user: any): user is User {
    return (
      user &&
      typeof user.id === 'string' &&
      typeof user.email === 'string' &&
      typeof user.role === 'string' &&
      user.createdAt instanceof Date
    );
  }

  async login(email: string, password: string): Promise<UserDto> {
    return await this.authRepository.login(email, password);
  }

  async register(email: string, password: string, fullName: string): Promise<{ user: UserDto | null, error: any }> {
    return await this.authRepository.register(email, password, fullName);
  }

  async logout(): Promise<void> {
    return await this.authRepository.logout();
  }

  async getCurrentUser(): Promise<UserDto> {
    return await this.authRepository.getCurrentUser();
  }

  onAuthStateChange(callback: (event: string, session: unknown) => void): void {
    this.authRepository.onAuthStateChange(callback);
  }
}
