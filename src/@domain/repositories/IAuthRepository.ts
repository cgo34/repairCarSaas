
import { AuthError, AuthResponse } from '@supabase/supabase-js';
import { UserDto } from '@/@infrastructure/dtos/UserDto';

export interface IAuthRepository {
  login(email: string, password: string): Promise<UserDto>;
  register(email: string, password: string, fullName: string): Promise<AuthResponse>;
  logout(): Promise<{ error: AuthError | null }>;
  getCurrentUser(): Promise<any>;
  onAuthStateChange(callback: (event: string, session: any) => void): void;
}
