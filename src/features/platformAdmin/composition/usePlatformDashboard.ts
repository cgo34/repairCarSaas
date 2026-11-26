import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import type { IGetPlatformStatsUseCase } from '@/features/platformAdmin/application/useCases/GetPlatformStatsUseCase';
import { createUsePlatformDashboard, type IUsePlatformDashboard } from '@/features/platformAdmin/presentation/composables/usePlatformDashboard';

export function usePlatformDashboard(): IUsePlatformDashboard {
  return createUsePlatformDashboard({
    getPlatformStatsUseCase: container.get<IGetPlatformStatsUseCase>(SYMBOLS.UseCases.PlatformAdmin.GetPlatformStatsUseCase),
  });
}
