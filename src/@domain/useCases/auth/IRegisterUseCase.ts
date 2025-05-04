import { AuthResponse } from "@supabase/supabase-js";

export interface IRegisterUseCase {
    execute(email: string, password: string, fullName: string): Promise<AuthResponse>;
  }