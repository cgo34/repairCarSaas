import type { Container } from 'inversify';
import { SYMBOLS } from '@/app/di/tokens';
import type { IPlatformStatsRepository } from '@/features/platformAdmin/application/ports/repositories/IPlatformStatsRepository';
import { PlatformStatsRepository } from '@/features/platformAdmin/infrastructure/repositories/PlatformStatsRepository';
import { GetPlatformStatsUseCase, type IGetPlatformStatsUseCase } from '@/features/platformAdmin/application/useCases/GetPlatformStatsUseCase';

export function registerPlatformAdminBindings(container: Container): void {
  container.bind<IPlatformStatsRepository>(SYMBOLS.Repositories.PlatformStatsRepository).toDynamicValue(ctx => new PlatformStatsRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<IGetPlatformStatsUseCase>(SYMBOLS.UseCases.PlatformAdmin.GetPlatformStatsUseCase).toDynamicValue(ctx => new GetPlatformStatsUseCase(ctx.container.get(SYMBOLS.Repositories.PlatformStatsRepository))).inSingletonScope();
}
