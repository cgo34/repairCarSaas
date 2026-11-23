import { SupabaseSession } from "@/features/auth/infrastructure/dtos/SupabaseSessionDto";
import { SupabaseUser } from "@/features/auth/infrastructure/dtos/SupabaseUserDto";

export interface SupabaseAuthResponse {
  data: {
    user: SupabaseUser;
    session: SupabaseSession;
  },
  error: Error | null;
}