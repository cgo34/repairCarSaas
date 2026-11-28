import { ref } from 'vue';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import type { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import type { IOrganizationProfileUseCase } from '@/features/organizations/application/useCases/OrganizationProfileUseCase';
import {
  isOrganizationProfileComplete,
  type OrganizationProfileRequiredFields,
} from '@/features/organizations/domain/rules/isOrganizationProfileComplete';

// Module-scoped so the sidebar badge and the profile page share the same state.
// null = not loaded yet (no badge shown).
const isComplete = ref<boolean | null>(null);

export function useOrganizationProfileCompleteness() {
  const refresh = async (): Promise<void> => {
    const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
    const organizationId = authState.userContext?.value?.organization?.id;
    if (!organizationId) return;
    try {
      const profile = await container
        .get<IOrganizationProfileUseCase>(SYMBOLS.UseCases.OrganizationProfileUseCase)
        .getProfile(organizationId);
      isComplete.value = isOrganizationProfileComplete(profile);
    } catch {
      isComplete.value = null;
    }
  };

  const update = (profile: OrganizationProfileRequiredFields): void => {
    isComplete.value = isOrganizationProfileComplete(profile);
  };

  return { isComplete, refresh, update };
}
