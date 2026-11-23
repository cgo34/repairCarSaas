import { AuthResponse } from "@/features/auth/domain/entities/AuthResponse";

export interface IAuthResponseMapper<T> {
  toDomain(external: T): AuthResponse;
}