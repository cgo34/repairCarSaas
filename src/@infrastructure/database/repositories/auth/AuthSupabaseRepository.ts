import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { UserDto } from '@/@infrastructure/dtos/UserDto';
import { UserMapper } from '@/@infrastructure/mappers/UserMapper';
import { UserRole } from '@domain/enums/UserRole';
import { IAuthRepository } from '@domain/repositories/IAuthRepository';
import { SupabaseAuthResponse } from '@infrastructure/database/dtos/supabase/SupabaseAuthResponse';
import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { AuthError, AuthResponse } from '@supabase/supabase-js';
import { inject, injectable } from 'inversify';
import { SupabaseClient } from '../../clients/SupabaseClient';

@injectable()
export class AuthSupabaseRepository implements IAuthRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>) {
  }

  async login(email: string, password: string): Promise<UserDto> {
    try {
      const { data } = await this.clientProvider.getClient().auth.signIn(email, password) as SupabaseAuthResponse;

      if (!data.user) {
        throw new Error('No user data in response');
      }

      // Récupérer le profil utilisateur depuis la table public.users pour obtenir le rôle custom
      const { data: userProfile, error: profileError } = await this.clientProvider
        .getClient()
        .from('users')
        .select('id, email, full_name, role')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.warn('[AuthRepository] Could not fetch user profile:', profileError);
      }

      // Construire un UserDto via UserMapper
      const userDto: UserDto = UserMapper.apiToDto({
        id: data.user.id,
        email: data.user.email ?? '',
        full_name: userProfile?.full_name ?? (data.user.user_metadata as any)?.fullName ?? '',
        role: (userProfile?.role as UserRole) ?? 'technician',
        subscription: undefined // ou à compléter selon ta logique
      });
      return userDto;
    } catch (error) {
      console.error('[AuthRepository] login error:', error);
      throw error;
    }
  }

  async register(email: string, password: string, fullName: string): Promise<{ user: UserDto | null, error: any }> {
    const { data, error } = await this.clientProvider.getClient().auth.signUp(email, password, fullName ) as SupabaseAuthResponse;
    if (!data?.user) {
      return { user: null, error };
    }
    // Récupérer le profil utilisateur depuis la table public.users pour obtenir le rôle custom
    const { data: userProfile } = await this.clientProvider
      .getClient()
      .from('users')
      .select('id, email, full_name, role')
      .eq('id', data.user.id)
      .single();
    const userDto: UserDto = UserMapper.apiToDto({
      id: data.user.id,
      email: data.user.email ?? '',
      full_name: userProfile?.full_name ?? (data.user.user_metadata as any)?.fullName ?? '',
      role: (userProfile?.role as UserRole) ?? 'technician',
      subscription: undefined // à adapter selon ta logique
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
    // Récupérer le profil utilisateur depuis la table public.users pour obtenir le rôle custom
    const { data: userProfile } = await this.clientProvider
      .getClient()
      .from('users')
      .select('id, email, full_name, role')
      .eq('id', authData.user.id)
      .single();
    const userDto: UserDto = UserMapper.apiToDto({
      id: authData.user.id,
      email: authData.user.email ?? '',
      full_name: userProfile?.full_name ?? (authData.user.user_metadata as any)?.fullName ?? '',
      role: (userProfile?.role as UserRole) ?? 'technician',
      subscription: undefined // à adapter selon ta logique
    });
    return userDto;
  }

  async getUserSession(): Promise<any> {
    return await this.clientProvider.getClient().auth.session();
  }

  onAuthStateChange(callback: (event: string, session: any) => void): void {
    this.clientProvider.getClient().auth.onAuthStateChange(callback);
  }
}
