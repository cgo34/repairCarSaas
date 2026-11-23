import { IBodyMaterialUseCase } from '@/features/carRepairSettings/application/useCases/BodyMaterialUseCase';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseBodyMaterialState } from '@/features/carRepairSettings/presentation/composables/useBodyMaterialState';

export function useBodyMaterialState() {
  return createUseBodyMaterialState({
    bodyMaterialUseCase: container.get<IBodyMaterialUseCase>(SYMBOLS.UseCases.CarRepair.BodyMaterialUseCase),
  });
}
