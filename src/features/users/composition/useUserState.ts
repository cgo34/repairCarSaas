import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { IUserUseCase } from '@/features/users/application/useCases/UserUseCase';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseUserState } from '@/features/users/presentation/composables/useUserState';

export function useUserState() {
  return createUseUserState({
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    userUseCase: container.get<IUserUseCase>(SYMBOLS.UseCases.UserUseCase),
  });
}
