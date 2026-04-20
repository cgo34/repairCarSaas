import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { User } from '@domain/entities/User';
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

  async login(email: string, password: string): Promise<User> {
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

      // Construire l'entité User avec le rôle custom (ou fallback sur 'technician')
      const user: User = {
        id: data.user.id,
        email: data.user.email ?? '',
        fullName: userProfile?.full_name ?? (data.user.user_metadata as any)?.fullName ?? '',
        role: (userProfile?.role as UserRole) ?? 'technician',
        createdAt: new Date(data.user.created_at)
      };

      return user;
    } catch (error) {
      console.error('[AuthRepository] login error:', error);
      throw error;
    }
  }

  async register(email: string, password: string, fullName: string): Promise<AuthResponse> {
    return await this.clientProvider.getClient().auth.signUp(email, password, fullName );


  }

  async logout(): Promise<{ error: AuthError | null }> {
    return await this.clientProvider.getClient().auth.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
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

    const user: User = {
      id: authData.user.id,
      email: authData.user.email ?? '',
      fullName: userProfile?.full_name ?? (authData.user.user_metadata as any)?.fullName ?? '',
      role: (userProfile?.role as UserRole) ?? 'technician',
      createdAt: new Date(authData.user.created_at)
    };

    return user;
  }

  async getUserSession(): Promise<any> {
    return await this.clientProvider.getClient().auth.session();
  }

  onAuthStateChange(callback: (event: string, session: any) => void): void {
    this.clientProvider.getClient().auth.onAuthStateChange(callback);
  }
}
