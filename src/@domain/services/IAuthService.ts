import { AuthResponse } from "@supabase/supabase-js";

export interface IAuthService {
    login(email: string, password: string): Promise<any>;
    register(email: string, password: string, fullName: string): Promise<AuthResponse>;
    logout(): Promise<void>;
    getCurrentUser(): Promise<any>;
    onAuthStateChange(callback: (event: string, session: any) => void): void;
  }
  