import { SupabaseSession } from "@infrastructure/database/dtos/supabase/SupabaseSessionDto";
import { SupabaseUser } from "@infrastructure/database/dtos/supabase/SupabaseUserDto";

export interface SupabaseAuthResponse {
  data: {
    user: SupabaseUser;
    session: SupabaseSession;
  },
  error: any;
}