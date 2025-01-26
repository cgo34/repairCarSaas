import { IAuthRepository } from '@domain/repositories/IAuthRepository';
import { IAuthService } from '@domain/services/IAuthService';
import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class AuthService implements IAuthService {
  constructor(@inject(SYMBOLS.Repositories.AuthRepository) private authRepository: IAuthRepository) {
    console.log('[AuthService] Initialized with AuthRepository:', authRepository);
  }

  async login(email: string, password: string): Promise<any> {
    console.log('[AuthService] login', email, password);
    
    return await this.authRepository.login(email, password);
  }

  async register(email: string, password: string): Promise<any> {
    return await this.authRepository.register(email, password);
  }

  async logout(): Promise<void> {
    return await this.authRepository.logout();
  }

  async getCurrentUser(): Promise<any> {
    return await this.authRepository.getCurrentUser();
  }

  onAuthStateChange(callback: (event: string, session: any) => void): void {
    this.authRepository.onAuthStateChange(callback);
  }
}
