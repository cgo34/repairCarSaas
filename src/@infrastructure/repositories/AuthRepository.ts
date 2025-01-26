import { IAuthProvider } from '@domain/providers/IAuthProvider';
import { IAuthRepository } from '@domain/repositories/IAuthRepository';
import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class AuthRepository implements IAuthRepository {
  constructor(@inject(SYMBOLS.Providers.AuthProvider) private authProvider: IAuthProvider) {
    console.log('[AuthRepository] Initialized with AuthProvider:', authProvider);
  }

  async login(email: string, password: string): Promise<any> {
    return await this.authProvider.signInWithPassword(email, password);
  }

  async register(email: string, password: string): Promise<any> {
    return await this.authProvider.signUp(email, password);
  }

  async logout(): Promise<void> {
    return await this.authProvider.signOut();
  }

  async getCurrentUser(): Promise<any> {
    return await this.authProvider.getSession();
  }

  onAuthStateChange(callback: (event: string, session: any) => void): void {
    this.authProvider.onAuthStateChange(callback);
  }
}
