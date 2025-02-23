import { IAuthResponseMapper } from "@/@domain/mappers/interfaces/IAuthResponseMapper";
import { AuthResponse } from "@/@domain/models/auth/AuthResponse";
import { SupabaseAuthResponse } from "@/@infrastructure/dtos/SupabaseAuthResponse";

export class SupabaseAuthResponseMapper implements IAuthResponseMapper<SupabaseAuthResponse> {
  toDomain(dto: SupabaseAuthResponse): AuthResponse {
    if (!dto) {
      throw new Error('Invalid Supabase response');
    }

    return {
      user: {
        id: dto.user.id,
        email: dto.user.email,
        role: dto.user.role,
        created_at: dto.user.created_at
      },
      session: dto.session ? {
        access_token: dto.session.access_token,
        expires_at: dto.session.expires_at
      } : undefined
    };
  }
}