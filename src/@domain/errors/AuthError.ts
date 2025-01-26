import { AuthErrorCode } from "@domain/valueObjects/AuthErrorCode";

export class AuthError extends Error {
    constructor(
      public readonly code: AuthErrorCode,
      message: string,
      public readonly originalError?: unknown
    ) {
      super(message);
      this.name = 'AuthError';
    }
  }