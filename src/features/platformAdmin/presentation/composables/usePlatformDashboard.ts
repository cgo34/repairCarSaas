import { ref, type Ref } from 'vue';
import type { PlatformStatsDto } from '@/features/platformAdmin/application/dtos/PlatformStatsDto';
import type { IGetPlatformStatsUseCase } from '@/features/platformAdmin/application/useCases/GetPlatformStatsUseCase';

export interface IUsePlatformDashboard {
  stats: Ref<PlatformStatsDto | null>;
  isLoading: Ref<boolean>;
  error: Ref<string | null>;
  load(): Promise<void>;
}

export interface UsePlatformDashboardDependencies {
  getPlatformStatsUseCase: IGetPlatformStatsUseCase;
}

export function createUsePlatformDashboard(deps: UsePlatformDashboardDependencies): IUsePlatformDashboard {
  const { getPlatformStatsUseCase } = deps;

  const stats = ref<PlatformStatsDto | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const load = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      stats.value = await getPlatformStatsUseCase.execute();
    } catch (e) {
      error.value = e instanceof Error ? e.message : String((e as { message?: string })?.message ?? e);
    } finally {
      isLoading.value = false;
    }
  };

  return { stats, isLoading, error, load };
}
