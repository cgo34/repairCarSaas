import { AuthError } from '@/features/auth/domain/errors/AuthError';
import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { AuthErrorCode } from '@/features/auth/domain/valueObjects/AuthErrorCode';

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