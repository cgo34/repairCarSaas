import { AuthResponse } from "@domain/models/auth/AuthResponse";

export interface IAuthResponseMapper<T> {
  toDomain(external: T): AuthResponse;
}