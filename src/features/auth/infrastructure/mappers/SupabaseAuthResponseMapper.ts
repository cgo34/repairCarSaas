import { IAuthResponseMapper } from "@/features/auth/application/ports/mappers/IAuthResponseMapper";
import { AuthResponse } from "@/features/auth/domain/entities/AuthResponse";
import { SupabaseAuthResponse } from "@/features/auth/infrastructure/dtos/SupabaseAuthResponse";

export class SupabaseAuthResponseMapper implements IAuthResponseMapper<SupabaseAuthResponse> {
  toDomain(dto: SupabaseAuthResponse): AuthResponse {
    if (!dto) {
      throw new Error('Invalid Supabase response');
    }
    return {
      user: {
        id: dto.data.user.id,
        email: dto.data.user.email,
        role: dto.data.user.role,
        created_at: dto.data.user.created_at
      },
      session: dto.data.session ? {
        access_token: dto.data.session.access_token,
        expires_at: dto.data.session.expires_at
      } : undefined
    };
  }
}