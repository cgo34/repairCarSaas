import { AuthResponse } from "@supabase/supabase-js";
import { UserDto } from '@/@application/dtos/UserDto';

export interface IAuthService {
    login(email: string, password: string): Promise<UserDto>;
    register(email: string, password: string, fullName: string): Promise<{ user: UserDto | null, error: any }>;
    logout(): Promise<void>;
    getCurrentUser(): Promise<any>;
    onAuthStateChange(callback: (event: string, session: any) => void): void;
  }
  