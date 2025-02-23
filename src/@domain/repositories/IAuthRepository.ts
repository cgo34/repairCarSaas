import { AuthError } from '@supabase/supabase-js';

export interface IAuthRepository {
  login(email: string, password: string): Promise<any>;
  register(email: string, password: string): Promise<any>;
  logout(): Promise<{ error: AuthError | null }>;
  getCurrentUser(): Promise<any>;
  onAuthStateChange(callback: (event: string, session: any) => void): void;
}
