import type { Container } from 'inversify';
import { SYMBOLS } from '@/app/di/tokens';
import type { IPlatformStatsRepository } from '@/features/platformAdmin/application/ports/repositories/IPlatformStatsRepository';
import type { IPlatformOrganizationRepository } from '@/features/platformAdmin/application/ports/repositories/IPlatformOrganizationRepository';
import type { IPlatformUserRepository } from '@/features/platformAdmin/application/ports/repositories/IPlatformUserRepository';
import { PlatformStatsRepository } from '@/features/platformAdmin/infrastructure/repositories/PlatformStatsRepository';
import { PlatformOrganizationRepository } from '@/features/platformAdmin/infrastructure/repositories/PlatformOrganizationRepository';
import { PlatformUserRepository } from '@/features/platformAdmin/infrastructure/repositories/PlatformUserRepository';
import { GetPlatformStatsUseCase, type IGetPlatformStatsUseCase } from '@/features/platformAdmin/application/useCases/GetPlatformStatsUseCase';
import { ListPlatformOrganizationsUseCase, type IListPlatformOrganizationsUseCase } from '@/features/platformAdmin/application/useCases/ListPlatformOrganizationsUseCase';
import { GrantPremiumUseCase, type IGrantPremiumUseCase } from '@/features/platformAdmin/application/useCases/GrantPremiumUseCase';
import { GrantFeatureUseCase, type IGrantFeatureUseCase } from '@/features/platformAdmin/application/useCases/GrantFeatureUseCase';
import { ListPlatformUsersUseCase, type IListPlatformUsersUseCase } from '@/features/platformAdmin/application/useCases/ListPlatformUsersUseCase';

export function registerPlatformAdminBindings(container: Container): void {
  container.bind<IPlatformStatsRepository>(SYMBOLS.Repositories.PlatformStatsRepository).toDynamicValue(ctx => new PlatformStatsRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<IPlatformOrganizationRepository>(SYMBOLS.Repositories.PlatformOrganizationRepository).toDynamicValue(ctx => new PlatformOrganizationRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<IPlatformUserRepository>(SYMBOLS.Repositories.PlatformUserRepository).toDynamicValue(ctx => new PlatformUserRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<IGetPlatformStatsUseCase>(SYMBOLS.UseCases.PlatformAdmin.GetPlatformStatsUseCase).toDynamicValue(ctx => new GetPlatformStatsUseCase(ctx.container.get(SYMBOLS.Repositories.PlatformStatsRepository))).inSingletonScope();
  container.bind<IListPlatformOrganizationsUseCase>(SYMBOLS.UseCases.PlatformAdmin.ListPlatformOrganizationsUseCase).toDynamicValue(ctx => new ListPlatformOrganizationsUseCase(ctx.container.get(SYMBOLS.Repositories.PlatformOrganizationRepository))).inSingletonScope();
  container.bind<IGrantPremiumUseCase>(SYMBOLS.UseCases.PlatformAdmin.GrantPremiumUseCase).toDynamicValue(ctx => new GrantPremiumUseCase(ctx.container.get(SYMBOLS.Repositories.PlatformOrganizationRepository))).inSingletonScope();
  container.bind<IGrantFeatureUseCase>(SYMBOLS.UseCases.PlatformAdmin.GrantFeatureUseCase).toDynamicValue(ctx => new GrantFeatureUseCase(ctx.container.get(SYMBOLS.Repositories.PlatformOrganizationRepository))).inSingletonScope();
  container.bind<IListPlatformUsersUseCase>(SYMBOLS.UseCases.PlatformAdmin.ListPlatformUsersUseCase).toDynamicValue(ctx => new ListPlatformUsersUseCase(ctx.container.get(SYMBOLS.Repositories.PlatformUserRepository))).inSingletonScope();
}
