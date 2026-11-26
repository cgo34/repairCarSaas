import { ref, type Ref } from 'vue';
import type { DemoProfileDto } from '@/features/profileSwitcher/application/dtos/DemoProfileDto';
import type { IListDemoProfilesUseCase } from '@/features/profileSwitcher/application/useCases/ListDemoProfilesUseCase';
import type { ISwitchDemoProfileUseCase } from '@/features/profileSwitcher/application/useCases/SwitchDemoProfileUseCase';
import type { IClearDemoProfileUseCase } from '@/features/profileSwitcher/application/useCases/ClearDemoProfileUseCase';

export interface IUseProfileSwitcher {
  profiles: Ref<DemoProfileDto[]>;
  isLoading: Ref<boolean>;
  error: Ref<string | null>;
  load(): Promise<void>;
  switchTo(profileId: string): Promise<boolean>;
  clear(): Promise<boolean>;
}

export interface UseProfileSwitcherDependencies {
  listProfilesUseCase: IListDemoProfilesUseCase;
  switchProfileUseCase: ISwitchDemoProfileUseCase;
  clearProfileUseCase: IClearDemoProfileUseCase;
}

export function createUseProfileSwitcher(deps: UseProfileSwitcherDependencies): IUseProfileSwitcher {
  const { listProfilesUseCase, switchProfileUseCase, clearProfileUseCase } = deps;

  const profiles = ref<DemoProfileDto[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const run = async (action: () => Promise<void>): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;
    try {
      await action();
      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : String((e as { message?: string })?.message ?? e);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const load = async (): Promise<void> => {
    await run(async () => {
      profiles.value = await listProfilesUseCase.execute();
    });
  };

  const switchTo = (profileId: string): Promise<boolean> => run(() => switchProfileUseCase.execute(profileId));

  const clear = (): Promise<boolean> => run(() => clearProfileUseCase.execute());

  return { profiles, isLoading, error, load, switchTo, clear };
}
