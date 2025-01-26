import { IAuthProvider } from '@domain/providers/IAuthProvider';
import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { SupabaseClient } from '@supabase/supabase-js';
import { inject, injectable } from 'inversify';

@injectable()
export class AuthProvider implements IAuthProvider {
  private supabaseClient: SupabaseClient;

  constructor(@inject(SYMBOLS.Clients.SupabaseClient) supabaseClient: SupabaseClient) {
    this.supabaseClient = supabaseClient;
    console.log('[AuthProvider] Initialized with SupabaseClient:', supabaseClient);
  }

  async signInWithPassword(email: string, password: string): Promise<{ user: any; session: any }> {
    console.log('[AuthProvider] signInWithPassword', email, password);
    
    const { data, error } = await this.supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return data;
  }

  async signUp(email: string, password: string): Promise<{ user: any; session: any }> {
    const { data, error } = await this.supabaseClient.auth.signUp({ email, password });
    if (error) throw new Error(error.message);

    return data;
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabaseClient.auth.signOut();
    if (error) throw error;
    
    // Forcer le nettoyage de la session Supabase
    await this.supabaseClient.auth.clearSession();
  }

  async getSession(): Promise<{ user: any; session: any }> {
    const { data, error } = await this.supabaseClient.auth.getSession();
    if (error) throw new Error(error.message);
    
    return {
      user: data.session?.user || null,
      session: data.session
    };
  }

  onAuthStateChange(callback: (event: string, session: any) => void): void {
    console.log('[AuthProvider] onAuthStateChange', callback);
    
    this.supabaseClient.auth.onAuthStateChange(callback);
  }
}
