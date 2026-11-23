import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';

export function useDashboardPageExempleDependencies() {
  return {
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
  };
}
