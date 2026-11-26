import { ref, type Ref } from 'vue';
import type { PlatformOrganizationDto } from '@/features/platformAdmin/application/dtos/PlatformOrganizationDto';
import type { IListPlatformOrganizationsUseCase } from '@/features/platformAdmin/application/useCases/ListPlatformOrganizationsUseCase';

export interface IUsePlatformOrganizations {
  organizations: Ref<PlatformOrganizationDto[]>;
  isLoading: Ref<boolean>;
  error: Ref<string | null>;
  load(): Promise<void>;
}

export interface UsePlatformOrganizationsDependencies {
  listPlatformOrganizationsUseCase: IListPlatformOrganizationsUseCase;
}

export function createUsePlatformOrganizations(deps: UsePlatformOrganizationsDependencies): IUsePlatformOrganizations {
  const organizations = ref<PlatformOrganizationDto[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const load = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      organizations.value = await deps.listPlatformOrganizationsUseCase.execute();
    } catch (e) {
      error.value = e instanceof Error ? e.message : String((e as { message?: string })?.message ?? e);
    } finally {
      isLoading.value = false;
    }
  };

  return { organizations, isLoading, error, load };
}
