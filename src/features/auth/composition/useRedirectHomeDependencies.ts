import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import type { IAuthState } from '@/features/auth/presentation/state/IAuthState';

export function useRedirectHomeDependencies() {
  return {
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
  };
}
