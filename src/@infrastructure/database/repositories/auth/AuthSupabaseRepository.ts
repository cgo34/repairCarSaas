import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { IAuthRepository } from '@domain/repositories/IAuthRepository';
import { SupabaseAuthResponse } from '@infrastructure/database/dtos/supabase/SupabaseAuthResponse';
import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { AuthError } from '@supabase/supabase-js';
import { inject, injectable } from 'inversify';
import { UserMapper } from '../../../mappers/UserMapper';
import { SupabaseClient } from '../../clients/SupabaseClient';
import { User } from '../../dtos/supabase/SupabaseUser';

@injectable()
export class AuthSupabaseRepository implements IAuthRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>) {
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const { data } = await this.clientProvider.getClient().auth.signIn(email, password) as SupabaseAuthResponse;

      if (!data.user) {
        throw new Error('No user data in response');
      }

      const userDto: User = data.user;

      return UserMapper.toDomain(userDto);
    } catch (error) {
      console.error('[AuthRepository] login error:', error);
      throw error;
    }
  }

  async register(email: string, password: string): Promise<any> {
    return await this.clientProvider.getClient().auth.signUp(email, password);
  }

  async logout(): Promise<{ error: AuthError | null }> {
    return await this.clientProvider.getClient().auth.signOut();
  }

  async getCurrentUser(): Promise<any> {
    return await this.clientProvider.getClient().auth.user();
  }

  async getUserSession(): Promise<any> {
    return await this.clientProvider.getClient().auth.session();
  }

  onAuthStateChange(callback: (event: string, session: any) => void): void {
    this.clientProvider.getClient().auth.onAuthStateChange(callback);
  }
}
