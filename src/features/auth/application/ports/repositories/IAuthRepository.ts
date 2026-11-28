
import { Session } from '@supabase/supabase-js';
import { UserDto } from '@/features/users/application/dtos/UserDto';

export interface IAuthRepository {
  login(email: string, password: string): Promise<UserDto>;
  register(email: string, password: string, fullName: string): Promise<{ user: UserDto | null, error: Error | null }>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<UserDto | null>;
  getUserSession(): Promise<{ data: { session: Session | null } }>;
  updateEmail(newEmail: string): Promise<void>;
  changePassword(currentPassword: string, newPassword: string): Promise<void>;
  deleteUser(userId: string): Promise<void>;
  onAuthStateChange(callback: (event: string, session: Session | null) => void): void;
}
