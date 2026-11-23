import { IUseGarageState } from '@/features/garages/presentation/types/IUseGarageState';
import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';

export function useGaragesPageDependencies() {
  return {
    useGarageState: container.get<IUseGarageState>(SYMBOLS.States.GarageState),
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
  };
}
