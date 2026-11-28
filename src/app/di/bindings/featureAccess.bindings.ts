import type { Container } from 'inversify'
import { SYMBOLS } from '@/app/di/tokens'
import type { IFeatureAccessRepository } from '@/features/featureAccess/application/ports/repositories/IFeatureAccessRepository'
import { GetFeatureAccessUseCase, type IGetFeatureAccessUseCase } from '@/features/featureAccess/application/useCases/GetFeatureAccessUseCase'
import { FeatureAccessRepository } from '@/features/featureAccess/infrastructure/repositories/FeatureAccessRepository'
import type { IFeatureAccessState } from '@/features/featureAccess/presentation/state/IFeatureAccessState'
import { FeatureAccessState } from '@/features/featureAccess/presentation/state/FeatureAccessState'

export function registerFeatureAccessBindings(container: Container): void {
  container.bind<IFeatureAccessRepository>(SYMBOLS.Repositories.FeatureAccessRepository).toDynamicValue(ctx => new FeatureAccessRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope()
  container.bind<IGetFeatureAccessUseCase>(SYMBOLS.UseCases.FeatureAccess.GetFeatureAccessUseCase).toDynamicValue(ctx => new GetFeatureAccessUseCase(ctx.container.get(SYMBOLS.Repositories.FeatureAccessRepository))).inSingletonScope()
  container.bind<IFeatureAccessState>(SYMBOLS.States.FeatureAccessState).toDynamicValue(ctx => new FeatureAccessState(ctx.container.get(SYMBOLS.UseCases.FeatureAccess.GetFeatureAccessUseCase))).inSingletonScope()
}
