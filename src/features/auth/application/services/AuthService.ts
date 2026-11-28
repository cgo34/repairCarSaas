import { UserDto } from '@/features/users/application/dtos/UserDto';
import { IAuthRepository } from '@/features/auth/application/ports/repositories/IAuthRepository';
import { IAuthService } from '@/features/auth/application/ports/services/IAuthService';

export class AuthService implements IAuthService {
  constructor(private authRepository: IAuthRepository) {
  }

  async login(email: string, password: string): Promise<UserDto> {
    return await this.authRepository.login(email, password);
  }

  async register(email: string, password: string, fullName: string): Promise<{ user: UserDto | null, error: Error | null }> {
    return await this.authRepository.register(email, password, fullName);
  }

  async logout(): Promise<void> {
    return await this.authRepository.logout();
  }

  async getCurrentUser(): Promise<UserDto | null> {
    return await this.authRepository.getCurrentUser();
  }

  async updateEmail(newEmail: string): Promise<void> {
    return await this.authRepository.updateEmail(newEmail);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return await this.authRepository.changePassword(currentPassword, newPassword);
  }

  onAuthStateChange(callback: (event: string, session: unknown) => void): void {
    this.authRepository.onAuthStateChange(callback);
  }
}
