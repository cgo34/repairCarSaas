import { AuthResponse } from '@/features/auth/domain/entities/AuthResponse';

export interface IAuthProvider {
  signInWithPassword(email: string, password: string): Promise<AuthResponse>;
  signUp(email: string, password: string): Promise<AuthResponse>;
  signOut(): Promise<void>;
  getSession(): Promise<AuthResponse | null>;
  onAuthStateChange(callback: (event: string, session: any) => void): void;
}