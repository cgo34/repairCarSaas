import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { IUseProfileState } from '@/features/account/presentation/types/IUseProfileState';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';

export function useUserSettingsPageDependencies() {
  return {
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    profileState: container.get<IUseProfileState>(SYMBOLS.States.ProfileState),
  };
}
