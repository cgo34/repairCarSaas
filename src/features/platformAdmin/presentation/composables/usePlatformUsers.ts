import { ref, type Ref } from 'vue';
import type { PlatformUserDto } from '@/features/platformAdmin/application/dtos/PlatformUserDto';
import type { IListPlatformUsersUseCase } from '@/features/platformAdmin/application/useCases/ListPlatformUsersUseCase';

export interface IUsePlatformUsers {
  users: Ref<PlatformUserDto[]>;
  isLoading: Ref<boolean>;
  error: Ref<string | null>;
  load(): Promise<void>;
}

export interface UsePlatformUsersDependencies {
  listPlatformUsersUseCase: IListPlatformUsersUseCase;
}

export function createUsePlatformUsers(deps: UsePlatformUsersDependencies): IUsePlatformUsers {
  const users = ref<PlatformUserDto[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const load = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      users.value = await deps.listPlatformUsersUseCase.execute();
    } catch (e) {
      error.value = e instanceof Error ? e.message : String((e as { message?: string })?.message ?? e);
    } finally {
      isLoading.value = false;
    }
  };

  return { users, isLoading, error, load };
}
