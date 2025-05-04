import { SupabaseAuthResponse } from "@/@infrastructure/database/dtos/supabase/SupabaseAuthResponse";

export interface IAuthService {
    login(email: string, password: string): Promise<any>;
    register(email: string, password: string, fullName: string): Promise<SupabaseAuthResponse>;
    logout(): Promise<void>;
    getCurrentUser(): Promise<any>;
    onAuthStateChange(callback: (event: string, session: any) => void): void;
  }
  