import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { IOrganizationProfileUseCase } from '@/features/organizations/application/useCases/OrganizationProfileUseCase';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseOrganizationProfileState } from '@/features/organizations/presentation/composables/useOrganizationProfileState';

export function useOrganizationProfileState() {
  return createUseOrganizationProfileState({
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    useCase: container.get<IOrganizationProfileUseCase>(SYMBOLS.UseCases.OrganizationProfileUseCase),
  });
}
