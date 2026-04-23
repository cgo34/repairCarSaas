import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { UserDto } from '@/@application/dtos/UserDto';
import { UserMapper } from '@/@infrastructure/mappers/UserMapper';
import { UserRole } from '@domain/enums/UserRole';
import { IAuthRepository } from '@domain/repositories/IAuthRepository';
import { SupabaseAuthResponse } from '@infrastructure/database/dtos/supabase/SupabaseAuthResponse';
import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { AuthError, AuthResponse } from '@supabase/supabase-js';
import { inject, injectable } from 'inversify';
import { SupabaseClient } from '../../clients/SupabaseClient';
import { UserApiModel } from '../../api/UserApiModel';

const USER_PROFILE_SELECT = 'id, email, full_name, first_name, last_name, role, percentage_commission';

@injectable()
export class AuthSupabaseRepository implements IAuthRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>) {}

  async login(email: string, password: string): Promise<UserDto> {
    try {
      const { data } = await this.clientProvider.getClient().auth.signIn(email, password) as SupabaseAuthResponse;

      if (!data.user) {
        throw new Error('No user data in response');
      }

      const { data: userProfile, error: profileError } = await this.clientProvider
        .getClient()
        .from('users')
        .select(USER_PROFILE_SELECT)
        .eq('id', data.user.id)
        .maybeSingle<UserApiModel>();

      if (profileError) {
        console.warn('[AuthRepository] Could not fetch user profile:', profileError);
      }

      return UserMapper.apiToDto({
        id: data.user.id,
        email: data.user.email ?? '',
        full_name: userProfile?.full_name ?? (data.user.user_metadata as any)?.fullName ?? '',
        first_name: userProfile?.first_name,
        last_name: userProfile?.last_name,
        role: (userProfile?.role as UserRole) ?? 'technician',
        percentage_commission: userProfile?.percentage_commission,
      });
    } catch (error) {
      console.error('[AuthRepository] login error:', error);
      throw error;
    }
  }

  async register(email: string, password: string, fullName: string): Promise<{ user: UserDto | null, error: any }> {
    const { data, error } = await this.clientProvider.getClient().auth.signUp(email, password, fullName) as SupabaseAuthResponse;

    if (!data?.user) {
      return { user: null, error };
    }

    const { data: userProfile } = await this.clientProvider
      .getClient()
      .from('users')
      .select(USER_PROFILE_SELECT)
      .eq('id', data.user.id)
      .maybeSingle<UserApiModel>();

    const userDto: UserDto = UserMapper.apiToDto({
      id: data.user.id,
      email: data.user.email ?? '',
      full_name: userProfile?.full_name ?? (data.user.user_metadata as any)?.fullName ?? '',
      first_name: userProfile?.first_name,
      last_name: userProfile?.last_name,
      role: (userProfile?.role as UserRole) ?? 'technician',
      percentage_commission: userProfile?.percentage_commission,
    });

    return { user: userDto, error };
  }

  async logout(): Promise<{ error: AuthError | null }> {
    return await this.clientProvider.getClient().auth.signOut();
  }

  async getCurrentUser(): Promise<UserDto | null> {
    const { data: authData } = await this.clientProvider.getClient().auth.user();
    if (!authData?.user) {
      return null;
    }

    const { data: userProfile } = await this.clientProvider
      .getClient()
      .from('users')
      .select(USER_PROFILE_SELECT)
      .eq('id', authData.user.id)
      .maybeSingle<UserApiModel>();

    return UserMapper.apiToDto({
      id: authData.user.id,
      email: authData.user.email ?? '',
      full_name: userProfile?.full_name ?? (authData.user.user_metadata as any)?.fullName ?? '',
      first_name: userProfile?.first_name,
      last_name: userProfile?.last_name,
      role: (userProfile?.role as UserRole) ?? 'technician',
      percentage_commission: userProfile?.percentage_commission,
    });
  }

  async updateEmail(newEmail: string): Promise<void> {
    const { error } = await this.clientProvider.getClient().auth.update({ email: newEmail });
    if (error) throw new Error(`Error updating email in auth.users: ${error.message}`);
  }

  async getUserSession(): Promise<any> {
    return await this.clientProvider.getClient().auth.session();
  }

  onAuthStateChange(callback: (event: string, session: any) => void): void {
    this.clientProvider.getClient().auth.onAuthStateChange(callback);
  }
}
