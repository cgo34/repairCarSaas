
import { AuthError, AuthResponse } from '@supabase/supabase-js';
import { UserDto } from '@/@application/dtos/UserDto';

export interface IAuthRepository {
  login(email: string, password: string): Promise<UserDto>;
  register(email: string, password: string, fullName: string): Promise<{ user: UserDto | null, error: any }>;
  logout(): Promise<{ error: AuthError | null }>;
  getCurrentUser(): Promise<any>;
  updateEmail(newEmail: string): Promise<void>;
  onAuthStateChange(callback: (event: string, session: any) => void): void;
}
