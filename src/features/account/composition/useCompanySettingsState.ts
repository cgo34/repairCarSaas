import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { ICompanySettingsUseCase } from '@/features/account/application/useCases/CompanySettingsUseCase';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseCompanySettingsState } from '@/features/account/presentation/composables/useCompanySettingsState';

export function useCompanySettingsState() {
  return createUseCompanySettingsState({
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    companySettingsUseCase: container.get<ICompanySettingsUseCase>(SYMBOLS.UseCases.CompanySettings),
  });
}
