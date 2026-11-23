import type { Container } from 'inversify';
import { SYMBOLS } from '@/app/di/tokens';
import { BodyMaterialService } from '@/features/carRepairSettings/application/services/BodyMaterialService';
import { BodyPartService } from '@/features/carRepairSettings/application/services/BodyPartService';
import { DentRepairTypeService } from '@/features/carRepairSettings/application/services/DentRepairTypeService';
import { BodyMaterialUseCase } from '@/features/carRepairSettings/application/useCases/BodyMaterialUseCase';
import { BodyPartUseCase } from '@/features/carRepairSettings/application/useCases/BodyPartUseCase';
import { DentRepairTypeUseCase } from '@/features/carRepairSettings/application/useCases/DentRepairTypeUSeCase';
import { IBodyMaterialRepository } from '@/features/carRepairSettings/application/ports/repositories/IBodyMaterialRepository';
import { IBodyPartRepository } from '@/features/carRepairSettings/application/ports/repositories/IBodyPartRepository';
import { IDentRepairTypeRepository } from '@/features/carRepairSettings/application/ports/repositories/IDentRepairTypeRepository';
import { IBodyMaterialService } from '@/features/carRepairSettings/application/ports/services/IBodyMaterialService';
import { IBodyPartService } from '@/features/carRepairSettings/application/ports/services/IBodyPartService';
import { IDentRepairTypeService } from '@/features/carRepairSettings/application/ports/services/IDentRepairTypeService';
import { IBodyMaterialUseCase } from '@/features/carRepairSettings/application/useCases/BodyMaterialUseCase';
import { IBodyPartUseCase } from '@/features/carRepairSettings/application/useCases/BodyPartUseCase';
import { IDentRepairTypeUseCase } from '@/features/carRepairSettings/application/useCases/DentRepairTypeUSeCase';
import { BodyPartRepository } from '@/features/carRepairSettings/infrastructure/repositories/BodyPartRepository';
import { useBodyMaterialState } from '@/features/carRepairSettings/composition/useBodyMaterialState';
import { useBodyPartState } from '@/features/carRepairSettings/composition/useBodyPartState';
import { useDentRepairTypeState } from '@/features/carRepairSettings/composition/useDentRepairTypeState';
import { IBodyMaterialState } from '@/features/carRepairSettings/presentation/types/IBodyMaterialState';
import { IBodyPartState } from '@/features/carRepairSettings/presentation/types/IBodyPartState';
import { IDentRepairTypeState } from '@/features/carRepairSettings/presentation/types/IDentRepairTypeState';
import { BodyMaterialRepository } from '@/features/carRepairSettings/infrastructure/repositories/BodyMaterialRepository';
import { DentRepairTypeRepository } from '@/features/carRepairSettings/infrastructure/repositories/DentRepairTypeRepository';

export function registerCarRepairSettingsBindings(container: Container): void {
  container.bind<IBodyPartRepository>(SYMBOLS.Repositories.BodyPartRepository).toDynamicValue(ctx => new BodyPartRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<IBodyMaterialRepository>(SYMBOLS.Repositories.BodyMaterialRepository).toDynamicValue(ctx => new BodyMaterialRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<IDentRepairTypeRepository>(SYMBOLS.Repositories.DentRepairTypeRepository).toDynamicValue(ctx => new DentRepairTypeRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<IBodyPartService>(SYMBOLS.Services.BodyPartService).toDynamicValue(ctx => new BodyPartService(ctx.container.get(SYMBOLS.Repositories.BodyPartRepository))).inSingletonScope();
  container.bind<IBodyMaterialService>(SYMBOLS.Services.BodyMaterialService).toDynamicValue(ctx => new BodyMaterialService(ctx.container.get(SYMBOLS.Repositories.BodyMaterialRepository))).inSingletonScope();
  container.bind<IDentRepairTypeService>(SYMBOLS.Services.DentRepairTypeService).toDynamicValue(ctx => new DentRepairTypeService(ctx.container.get(SYMBOLS.Repositories.DentRepairTypeRepository))).inSingletonScope();
  container.bind<IBodyPartUseCase>(SYMBOLS.UseCases.CarRepair.BodyPartUseCase).toDynamicValue(ctx => new BodyPartUseCase(ctx.container.get(SYMBOLS.Services.BodyPartService))).inSingletonScope();
  container.bind<IBodyMaterialUseCase>(SYMBOLS.UseCases.CarRepair.BodyMaterialUseCase).toDynamicValue(ctx => new BodyMaterialUseCase(ctx.container.get(SYMBOLS.Services.BodyMaterialService))).inSingletonScope();
  container.bind<IDentRepairTypeUseCase>(SYMBOLS.UseCases.CarRepair.DentRepairTypeUseCase).toDynamicValue(ctx => new DentRepairTypeUseCase(ctx.container.get(SYMBOLS.Services.DentRepairTypeService))).inSingletonScope();
  container.bind<IBodyPartState>(SYMBOLS.States.CarRepair.BodyPartState).toDynamicValue(() => {
    return useBodyPartState();
  });
  container.bind<IBodyMaterialState>(SYMBOLS.States.CarRepair.BodyMaterialState).toDynamicValue(() => {
    return useBodyMaterialState();
  });
  container.bind<IDentRepairTypeState>(SYMBOLS.States.CarRepair.DentRepairTypeState).toDynamicValue(() => {
    return useDentRepairTypeState();
  });
}
