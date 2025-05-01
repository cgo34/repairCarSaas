import { User } from '@domain/entities/User';
import { IAuthRepository } from '@domain/repositories/IAuthRepository';
import { IAuthService } from '@domain/services/IAuthService';
import { SYMBOLS } from '@infrastructure/ioc/symbols';
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

  async login(email: string, password: string): Promise<User> {
    const user = await this.authRepository.login(email, password);
    
    // if (!this.isUser(user)) {
    //   throw new Error('Invalid user data structure');
    // }

    return user;
  }

  async register(email: string, password: string): Promise<void> {
    return await this.authRepository.register(email, password);
  }

  async logout(): Promise<void> {
    return await this.authRepository.logout();
  }

  async getCurrentUser(): Promise<User> {
    return await this.authRepository.getCurrentUser();
  }

  onAuthStateChange(callback: (event: string, session: unknown) => void): void {
    this.authRepository.onAuthStateChange(callback);
  }
}
