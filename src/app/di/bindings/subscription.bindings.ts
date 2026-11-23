import type { Container } from 'inversify';
import { SYMBOLS } from '@/app/di/tokens';
import { SubscriptionService } from '@/features/subscription/application/services/SubscriptionService';
import { GetCurrentSubscriptionUseCase } from '@/features/subscription/application/useCases/GetCurrentSubscriptionUseCase';
import { SubscribeToFreePlanUseCase } from '@/features/subscription/application/useCases/SubscribeToFreePlanUseCase';
import { SubscriptionRepository } from '@/features/subscription/infrastructure/repositories/SubscriptionRepository';
import { ISubscriptionState } from '@/features/subscription/presentation/state/ISubscriptionState';
import { SubscriptionState } from '@/features/subscription/presentation/state/SubscriptionState';
import { ISubscriptionRepository } from '@/features/subscription/application/ports/repositories/ISubscriptionRepository';
import { IGetCurrentSubscriptionUseCase } from '@/features/subscription/application/useCases/GetCurrentSubscriptionUseCase';
import { ISubscribeToFreePlanUseCase } from '@/features/subscription/application/useCases/SubscribeToFreePlanUseCase';
import { ISubscriptionService } from '@/features/subscription/application/services/ISubscriptionService';

export function registerSubscriptionBindings(container: Container): void {
  container.bind<ISubscriptionRepository>(SYMBOLS.Repositories.SubscriptionRepository).toDynamicValue(ctx => new SubscriptionRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<ISubscriptionService>(SYMBOLS.Services.SubscriptionService).toDynamicValue(ctx => new SubscriptionService(ctx.container.get(SYMBOLS.Repositories.SubscriptionRepository))).inSingletonScope();
  container.bind<ISubscribeToFreePlanUseCase>(SYMBOLS.UseCases.Subscription.SubscribeToFreePlanUseCase).toDynamicValue(ctx => new SubscribeToFreePlanUseCase(ctx.container.get(SYMBOLS.Repositories.SubscriptionRepository))).inSingletonScope();
  container.bind<IGetCurrentSubscriptionUseCase>(SYMBOLS.UseCases.Subscription.GetCurrentSubscriptionUseCase).toDynamicValue(ctx => new GetCurrentSubscriptionUseCase(ctx.container.get(SYMBOLS.Repositories.SubscriptionRepository))).inSingletonScope();
  container.bind<ISubscriptionState>(SYMBOLS.States.SubscriptionState).toDynamicValue(ctx => new SubscriptionState(ctx.container.get(SYMBOLS.UseCases.Subscription.GetCurrentSubscriptionUseCase))).inSingletonScope();
}
