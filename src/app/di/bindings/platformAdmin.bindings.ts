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
import { SetOrganizationDemoUseCase, type ISetOrganizationDemoUseCase } from '@/features/platformAdmin/application/useCases/SetOrganizationDemoUseCase';
import { ListPlatformUsersUseCase, type IListPlatformUsersUseCase } from '@/features/platformAdmin/application/useCases/ListPlatformUsersUseCase';
import type { IPlatformPlanRepository } from '@/features/platformAdmin/application/ports/repositories/IPlatformPlanRepository';
import { PlatformPlanRepository } from '@/features/platformAdmin/infrastructure/repositories/PlatformPlanRepository';
import { ListPlatformPlansUseCase, type IListPlatformPlansUseCase } from '@/features/platformAdmin/application/useCases/ListPlatformPlansUseCase';
import { PreviewPlanChangesUseCase, type IPreviewPlanChangesUseCase } from '@/features/platformAdmin/application/useCases/PreviewPlanChangesUseCase';
import { ApplyPlanChangesUseCase, type IApplyPlanChangesUseCase } from '@/features/platformAdmin/application/useCases/ApplyPlanChangesUseCase';
import { ListPlanChangeLogUseCase, type IListPlanChangeLogUseCase } from '@/features/platformAdmin/application/useCases/ListPlanChangeLogUseCase';

export function registerPlatformAdminBindings(container: Container): void {
  container.bind<IPlatformPlanRepository>(SYMBOLS.Repositories.PlatformPlanRepository).toDynamicValue(ctx => new PlatformPlanRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<IListPlatformPlansUseCase>(SYMBOLS.UseCases.PlatformAdmin.ListPlatformPlansUseCase).toDynamicValue(ctx => new ListPlatformPlansUseCase(ctx.container.get(SYMBOLS.Repositories.PlatformPlanRepository))).inSingletonScope();
  container.bind<IPreviewPlanChangesUseCase>(SYMBOLS.UseCases.PlatformAdmin.PreviewPlanChangesUseCase).toDynamicValue(ctx => new PreviewPlanChangesUseCase(ctx.container.get(SYMBOLS.Repositories.PlatformPlanRepository))).inSingletonScope();
  container.bind<IApplyPlanChangesUseCase>(SYMBOLS.UseCases.PlatformAdmin.ApplyPlanChangesUseCase).toDynamicValue(ctx => new ApplyPlanChangesUseCase(ctx.container.get(SYMBOLS.Repositories.PlatformPlanRepository))).inSingletonScope();
  container.bind<IListPlanChangeLogUseCase>(SYMBOLS.UseCases.PlatformAdmin.ListPlanChangeLogUseCase).toDynamicValue(ctx => new ListPlanChangeLogUseCase(ctx.container.get(SYMBOLS.Repositories.PlatformPlanRepository))).inSingletonScope();
  container.bind<IPlatformStatsRepository>(SYMBOLS.Repositories.PlatformStatsRepository).toDynamicValue(ctx => new PlatformStatsRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<IPlatformOrganizationRepository>(SYMBOLS.Repositories.PlatformOrganizationRepository).toDynamicValue(ctx => new PlatformOrganizationRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<IPlatformUserRepository>(SYMBOLS.Repositories.PlatformUserRepository).toDynamicValue(ctx => new PlatformUserRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<IGetPlatformStatsUseCase>(SYMBOLS.UseCases.PlatformAdmin.GetPlatformStatsUseCase).toDynamicValue(ctx => new GetPlatformStatsUseCase(ctx.container.get(SYMBOLS.Repositories.PlatformStatsRepository))).inSingletonScope();
  container.bind<IListPlatformOrganizationsUseCase>(SYMBOLS.UseCases.PlatformAdmin.ListPlatformOrganizationsUseCase).toDynamicValue(ctx => new ListPlatformOrganizationsUseCase(ctx.container.get(SYMBOLS.Repositories.PlatformOrganizationRepository))).inSingletonScope();
  container.bind<IGrantPremiumUseCase>(SYMBOLS.UseCases.PlatformAdmin.GrantPremiumUseCase).toDynamicValue(ctx => new GrantPremiumUseCase(ctx.container.get(SYMBOLS.Repositories.PlatformOrganizationRepository))).inSingletonScope();
  container.bind<IGrantFeatureUseCase>(SYMBOLS.UseCases.PlatformAdmin.GrantFeatureUseCase).toDynamicValue(ctx => new GrantFeatureUseCase(ctx.container.get(SYMBOLS.Repositories.PlatformOrganizationRepository))).inSingletonScope();
  container.bind<ISetOrganizationDemoUseCase>(SYMBOLS.UseCases.PlatformAdmin.SetOrganizationDemoUseCase).toDynamicValue(ctx => new SetOrganizationDemoUseCase(ctx.container.get(SYMBOLS.Repositories.PlatformOrganizationRepository))).inSingletonScope();
  container.bind<IListPlatformUsersUseCase>(SYMBOLS.UseCases.PlatformAdmin.ListPlatformUsersUseCase).toDynamicValue(ctx => new ListPlatformUsersUseCase(ctx.container.get(SYMBOLS.Repositories.PlatformUserRepository))).inSingletonScope();
}
