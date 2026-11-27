import { ref, type Ref } from 'vue';
import type { PlatformOrganizationDto } from '@/features/platformAdmin/application/dtos/PlatformOrganizationDto';
import type { IListPlatformOrganizationsUseCase } from '@/features/platformAdmin/application/useCases/ListPlatformOrganizationsUseCase';
import type { IGrantPremiumUseCase } from '@/features/platformAdmin/application/useCases/GrantPremiumUseCase';
import type { IGrantFeatureUseCase } from '@/features/platformAdmin/application/useCases/GrantFeatureUseCase';
import type { FeatureGrantDuration } from '@/features/platformAdmin/application/dtos/FeatureGrant';
import type { PremiumGrantDuration } from '@/features/platformAdmin/application/dtos/PremiumGrantDuration';

export interface IUsePlatformOrganizations {
  organizations: Ref<PlatformOrganizationDto[]>;
  isLoading: Ref<boolean>;
  error: Ref<string | null>;
  load(): Promise<void>;
  grantPremium(organizationId: string, duration: PremiumGrantDuration): Promise<boolean>;
  grantFeature(organizationId: string, featureKey: string, duration: FeatureGrantDuration): Promise<boolean>;
}

export interface UsePlatformOrganizationsDependencies {
  listPlatformOrganizationsUseCase: IListPlatformOrganizationsUseCase;
  grantPremiumUseCase: IGrantPremiumUseCase;
  grantFeatureUseCase: IGrantFeatureUseCase;
}

export function createUsePlatformOrganizations(deps: UsePlatformOrganizationsDependencies): IUsePlatformOrganizations {
  const organizations = ref<PlatformOrganizationDto[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const toMessage = (e: unknown): string =>
    e instanceof Error ? e.message : String((e as { message?: string })?.message ?? e);

  const load = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      organizations.value = await deps.listPlatformOrganizationsUseCase.execute();
    } catch (e) {
      error.value = toMessage(e);
    } finally {
      isLoading.value = false;
    }
  };

  const grantPremium = async (organizationId: string, duration: PremiumGrantDuration): Promise<boolean> => {
    error.value = null;
    try {
      await deps.grantPremiumUseCase.execute(organizationId, duration);
    } catch (e) {
      error.value = toMessage(e);
      return false;
    }
    await load();
    return true;
  };

  const grantFeature = async (organizationId: string, featureKey: string, duration: FeatureGrantDuration): Promise<boolean> => {
    error.value = null;
    try {
      await deps.grantFeatureUseCase.execute(organizationId, featureKey, duration);
    } catch (e) {
      error.value = toMessage(e);
      return false;
    }
    return true;
  };

  return { organizations, isLoading, error, load, grantPremium, grantFeature };
}
