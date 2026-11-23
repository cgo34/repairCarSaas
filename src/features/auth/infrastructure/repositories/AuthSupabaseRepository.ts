import { IClientProvider } from '@/shared/infrastructure/supabase/IClientProvider';
import { UserDto } from '@/features/users/application/dtos/UserDto';
import { UserMapper } from '@/features/users/infrastructure/mappers/UserMapper';
import { IAuthRepository } from '@/features/auth/application/ports/repositories/IAuthRepository';
import { SupabaseAuthResponse } from '@/features/auth/infrastructure/dtos/SupabaseAuthResponse';
import { Session } from '@supabase/supabase-js';
import { SupabaseClient } from '@/shared/infrastructure/supabase/SupabaseClient';
import { UserApiModel } from '@/features/users/infrastructure/api/UserApiModel';

const USER_PROFILE_SELECT = 'id, email, full_name, first_name, last_name, is_blocked';

export class AuthSupabaseRepository implements IAuthRepository {
  constructor(private clientProvider: IClientProvider<SupabaseClient>) {}

  async login(email: string, password: string): Promise<UserDto> {
    try {
      const { data } = await this.clientProvider.getClient().auth.signInWithPassword({ email, password }) as SupabaseAuthResponse;

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
        full_name: userProfile?.full_name ?? data.user.user_metadata?.fullName ?? '',
        first_name: userProfile?.first_name,
        last_name: userProfile?.last_name,
      });
    } catch (error) {
      console.error('[AuthRepository] login error:', error);
      throw error;
    }
  }

  async register(email: string, password: string, fullName: string): Promise<{ user: UserDto | null, error: Error | null }> {
    const { data, error } = await this.clientProvider.getClient().auth.signUp({
      email,
      password,
      options: { data: { fullName } }
    }) as SupabaseAuthResponse;

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
      full_name: userProfile?.full_name ?? data.user.user_metadata?.fullName ?? '',
      first_name: userProfile?.first_name,
      last_name: userProfile?.last_name,
    });

    return { user: userDto, error };
  }

  async logout(): Promise<void> {
    const { error } =
      await this.clientProvider
        .getClient()
        .auth
        .signOut();

    if (error) {
      throw error;
    }
  }

  async sendResetPasswordEmail(
    email: string
  ): Promise<void> {

    const { error } =
      await this.clientProvider
        .getClient()
        .auth
        .resetPasswordForEmail(email);

    if (error) {
      throw error;
    }
  }

  async getCurrentUser(): Promise<UserDto | null> {
    const { data: authData } = await this.clientProvider.getClient().auth.getUser()
    if (!authData?.user) return null

    const { data: userProfile, error } = await this.clientProvider.getClient()
      .from('users')
      .select(USER_PROFILE_SELECT)
      .eq('id', authData.user.id)
      .returns<UserApiModel[]>()
      .single()

    if (error) {
      console.warn('[AuthRepository] Could not fetch user profile:', error)
      return null
    }

    return UserMapper.apiToDto({
      id: authData.user.id,
      email: authData.user.email ?? '',
      full_name: userProfile?.full_name ?? authData.user.user_metadata?.fullName ?? '',
      first_name: userProfile?.first_name,
      last_name: userProfile?.last_name,
      is_blocked: userProfile?.is_blocked,
    })
  }

  async updateEmail(newEmail: string): Promise<void> {
    const { error } = await this.clientProvider.getClient().auth.updateUser({ email: newEmail });
    if (error) throw new Error(`Error updating email in auth.users: ${error.message}`);
  }

  async deleteUser(userId: string): Promise<void> {
    const { error } = await this.clientProvider.getClient().functions.invoke('delete-user', {
      body: { userId },
    });
    if (error) throw new Error(`Error deleting auth user: ${error.message}`);
  }

  async getUserSession(): Promise<{ data: { session: Session | null } }> {
    return await this.clientProvider.getClient().auth.getSession();
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void): void {
    this.clientProvider.getClient().auth.onAuthStateChange(callback);
  }
}
