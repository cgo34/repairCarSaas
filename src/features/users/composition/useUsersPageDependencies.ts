import { IUseUserState } from '@/features/users/presentation/types/IUseUserState';
import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';

export function useUsersPageDependencies() {
  return {
    useUserState: container.get<IUseUserState>(SYMBOLS.States.UserState),
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
  };
}
