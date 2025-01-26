import { AuthError } from '@domain/errors/AuthError';
import { IAuthState } from '@domain/states/IAuthState';
import { AuthErrorCode } from '@domain/valueObjects/AuthErrorCode';

export function requireAuth(authState: IAuthState) {
  return () => {
    if (!authState.isAuthenticated.value) {
      throw new AuthError(
        AuthErrorCode.UNAUTHORIZED,
        'Authentication required'
      );
    }
  };
}