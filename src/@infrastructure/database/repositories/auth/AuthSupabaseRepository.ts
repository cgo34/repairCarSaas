import { IClientProvider } from '@domain/providers/IClientProvider';
import { IAuthRepository } from '@domain/repositories/IAuthRepository';
import { SupabaseAuthResponse } from '@infrastructure/database/dtos/supabase/SupabaseAuthResponse';
import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';
import { UserMapper } from '../../../mappers/UserMapper';
import { User } from '../../dtos/supabase/SupabaseUser';

@injectable()
export class AuthSupabaseRepository implements IAuthRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider) {
    console.log('[AuthRepository] Initialized with clientProvider:', clientProvider);
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const { data } = await this.clientProvider.getClient().auth.signIn(email, password) as SupabaseAuthResponse;
      console.log('[AuthRepository] login response', data);

      if (!data.user) {
        throw new Error('No user data in response');
      }

      const userDto: User = data.user;
      console.log('[AuthRepository] login userDto', userDto);

      return UserMapper.toDomain(userDto);
    } catch (error) {
      console.error('[AuthRepository] login error:', error);
      throw error;
    }
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
