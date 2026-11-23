import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseAuthState } from '@/features/auth/presentation/composables/useAuthState';

export function useAuthState() {
  return createUseAuthState({
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
  });
}
