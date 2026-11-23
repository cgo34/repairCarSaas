import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import {
  configureCompanyProfile,
  createUseCompanyProfile,
} from '@/features/account/presentation/composables/useCompanyProfile';

const dependencies = {
  getAuthState: () => container.get<IAuthState>(SYMBOLS.States.AuthState),
};

// Appelé au démarrage : getCompanyProfile() (templates PDF) peut être utilisé sans passer par useCompanyProfile()
export function registerCompanyProfileDependencies() {
  configureCompanyProfile(dependencies);
}

export function useCompanyProfile() {
  return createUseCompanyProfile(dependencies);
}
