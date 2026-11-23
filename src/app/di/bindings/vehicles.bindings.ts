import type { Container } from 'inversify';
import { SYMBOLS } from '@/app/di/tokens';
import { VehicleService } from '@/features/vehicles/application/services/VehicleService';
import { VehicleUseCase } from '@/features/vehicles/application/useCases/VehicleUseCase';
import { IVehicleRepository } from '@/features/vehicles/application/ports/repositories/IVehicleRepository';
import { IVehicleService } from '@/features/vehicles/application/ports/services/IVehicleService';
import { IVehicleUseCase } from '@/features/vehicles/application/useCases/VehicleUseCase';
import { VehicleRepository } from '@/features/vehicles/infrastructure/repositories/VehicleRepository';

export function registerVehiclesBindings(container: Container): void {
  container.bind<IVehicleRepository>(SYMBOLS.Repositories.VehicleRepository).toDynamicValue(ctx => new VehicleRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<IVehicleService>(SYMBOLS.Services.VehicleService).toDynamicValue(ctx => new VehicleService(ctx.container.get(SYMBOLS.Repositories.VehicleRepository))).inSingletonScope();
  container.bind<IVehicleUseCase>(SYMBOLS.UseCases.Vehicle).toDynamicValue(ctx => new VehicleUseCase(ctx.container.get(SYMBOLS.Services.VehicleService))).inSingletonScope();
}
