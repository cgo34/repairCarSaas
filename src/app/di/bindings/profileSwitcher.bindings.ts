import type { Container } from 'inversify';
import { SYMBOLS } from '@/app/di/tokens';
import type { IDemoProfileRepository } from '@/features/profileSwitcher/application/ports/repositories/IDemoProfileRepository';
import { DemoProfileRepository } from '@/features/profileSwitcher/infrastructure/repositories/DemoProfileRepository';
import { ListDemoProfilesUseCase, type IListDemoProfilesUseCase } from '@/features/profileSwitcher/application/useCases/ListDemoProfilesUseCase';
import { SwitchDemoProfileUseCase, type ISwitchDemoProfileUseCase } from '@/features/profileSwitcher/application/useCases/SwitchDemoProfileUseCase';
import { ClearDemoProfileUseCase, type IClearDemoProfileUseCase } from '@/features/profileSwitcher/application/useCases/ClearDemoProfileUseCase';

export function registerProfileSwitcherBindings(container: Container): void {
  container.bind<IDemoProfileRepository>(SYMBOLS.Repositories.DemoProfileRepository).toDynamicValue(ctx => new DemoProfileRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<IListDemoProfilesUseCase>(SYMBOLS.UseCases.ProfileSwitcher.ListDemoProfilesUseCase).toDynamicValue(ctx => new ListDemoProfilesUseCase(ctx.container.get(SYMBOLS.Repositories.DemoProfileRepository))).inSingletonScope();
  container.bind<ISwitchDemoProfileUseCase>(SYMBOLS.UseCases.ProfileSwitcher.SwitchDemoProfileUseCase).toDynamicValue(ctx => new SwitchDemoProfileUseCase(ctx.container.get(SYMBOLS.Repositories.DemoProfileRepository))).inSingletonScope();
  container.bind<IClearDemoProfileUseCase>(SYMBOLS.UseCases.ProfileSwitcher.ClearDemoProfileUseCase).toDynamicValue(ctx => new ClearDemoProfileUseCase(ctx.container.get(SYMBOLS.Repositories.DemoProfileRepository))).inSingletonScope();
}
