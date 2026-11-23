import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { IAuthService } from '@/features/auth/application/ports/services/IAuthService';
import { IUserUseCase } from '@/features/users/application/useCases/UserUseCase';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseProfileState } from '@/features/account/presentation/composables/useProfileState';

export function useProfileState() {
  return createUseProfileState({
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    authService: container.get<IAuthService>(SYMBOLS.Services.AuthService),
    userUseCase: container.get<IUserUseCase>(SYMBOLS.UseCases.UserUseCase),
  });
}
