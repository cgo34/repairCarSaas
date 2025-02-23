import { SupabaseUser } from "@infrastructure/database/dtos/supabase/SupabaseUserDto";

export interface SupabaseSession {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user: SupabaseUser;
};