import { IBodyPartUseCase } from '@/features/carRepairSettings/application/useCases/BodyPartUseCase';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseBodyPartState } from '@/features/carRepairSettings/presentation/composables/useBodyPartState';

export function useBodyPartState() {
  return createUseBodyPartState({
    bodyPartUseCase: container.get<IBodyPartUseCase>(SYMBOLS.UseCases.CarRepair.BodyPartUseCase),
  });
}
