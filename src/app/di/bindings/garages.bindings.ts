import type { Container } from 'inversify';
import { SYMBOLS } from '@/app/di/tokens';
import { GarageService } from '@/features/garages/application/services/GarageService';
import { GarageUseCase } from '@/features/garages/application/useCases/GarageUseCase';
import { IGarageRepository } from '@/features/garages/application/ports/repositories/IGarageRepository';
import { IGarageService } from '@/features/garages/application/ports/services/IGarageService';
import { IGarageUseCase } from '@/features/garages/application/useCases/GarageUseCase';
import { useGarageState } from '@/features/garages/composition/useGarageState';
import { IUseGarageState } from '@/features/garages/presentation/types/IUseGarageState';
import { GarageRepository } from '@/features/garages/infrastructure/repositories/GarageRepository';

export function registerGaragesBindings(container: Container): void {
  container.bind<IGarageRepository>(SYMBOLS.Repositories.GarageRepository).toDynamicValue(ctx => new GarageRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<IGarageService>(SYMBOLS.Services.GarageService).toDynamicValue(ctx => new GarageService(ctx.container.get(SYMBOLS.Repositories.GarageRepository))).inSingletonScope();
  container.bind<IGarageUseCase>(SYMBOLS.UseCases.Garage).toDynamicValue(ctx => new GarageUseCase(ctx.container.get(SYMBOLS.Repositories.GarageRepository))).inSingletonScope();
  container.bind<IUseGarageState>(SYMBOLS.States.GarageState).toDynamicValue(() => {
    return useGarageState();
  });
}
