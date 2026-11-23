import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { IUseCompanySettingsState } from '@/features/account/presentation/types/IUseCompanySettingsState';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';

export function useCompanySettingsPageDependencies() {
  return {
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    companySettingsState: container.get<IUseCompanySettingsState>(SYMBOLS.States.CompanySettingsState),
  };
}
