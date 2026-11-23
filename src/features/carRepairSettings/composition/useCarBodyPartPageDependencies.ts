import { IBodyPartState } from '@/features/carRepairSettings/presentation/types/IBodyPartState';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';

export function useCarBodyPartPageDependencies() {
  return {
    useBodyPartState: container.get<IBodyPartState>(SYMBOLS.States.CarRepair.BodyPartState),
  };
}
